import * as THREE from "../_engine/vendor/three.module.js";

const clamp = (n) => Math.max(0, Math.min(1, n));
const blend = (a, b, n) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;
function rendererFor(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "default",
  });
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 650 ? 1.35 : 1.65),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  return renderer;
}
const latLon = (lat, lon, radius = 2) => {
  const a = (lat * Math.PI) / 180,
    b = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.cos(a) * Math.cos(b),
    radius * Math.sin(a),
    radius * Math.cos(a) * Math.sin(b),
  );
};
export function createGlobe(canvas, reduced) {
  const renderer = rendererFor(canvas),
    scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 40);
  camera.position.set(0, 0.15, 5.9);
  const earth = new THREE.Group();
  scene.add(earth);
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(2, 72, 48),
    new THREE.MeshPhongMaterial({
      color: "#040713",
      shininess: 25,
      specular: "#1d3c91",
    }),
  );
  earth.add(ball);
  scene.add(new THREE.AmbientLight("#4b66a2", 0.2));
  const light = new THREE.DirectionalLight("#799eff", 3);
  light.position.set(-4, -2, 3);
  scene.add(light);
  const warm = new THREE.DirectionalLight("#ffb67b", 1.2);
  warm.position.set(3, 5, -2);
  scene.add(warm);
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(2.035, 64, 40),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader:
        "varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=-p.xyz;gl_Position=projectionMatrix*p;}",
      fragmentShader:
        "varying vec3 n;varying vec3 v;void main(){float r=pow(1.-max(0.,dot(normalize(n),normalize(v))),3.3);vec3 col=mix(vec3(.13,.32,1.),vec3(1.,.43,.15),smoothstep(.25,.9,normalize(n).y));gl_FragColor=vec4(col,r*.9);}",
    }),
  );
  scene.add(halo);
  const grid = new THREE.Mesh(
    new THREE.SphereGeometry(2.009, 36, 18),
    new THREE.MeshBasicMaterial({
      color: "#1e315d",
      wireframe: true,
      transparent: true,
      opacity: 0.09,
    }),
  );
  earth.add(grid);
  const ports = [
    [6.93, 79.84],
    [1.29, 103.85],
    [-37.81, 144.96],
    [-36.85, 174.76],
    [22.3, 114.17],
  ];
  const beads = [],
    arcs = [];
  const portGeo = new THREE.SphereGeometry(0.023, 10, 8);
  for (const p of ports) {
    const pin = new THREE.Mesh(
      portGeo,
      new THREE.MeshBasicMaterial({ color: "#e2eaff" }),
    );
    pin.position.copy(latLon(...p, 2.028));
    earth.add(pin);
  }
  for (let i = 0; i < ports.length - 1; i++) {
    const a = latLon(...ports[i], 2.025),
      b = latLon(...ports[i + 1], 2.025),
      pts = [];
    for (let j = 0; j <= 64; j++) {
      const t = j / 64;
      pts.push(
        a
          .clone()
          .lerp(b, t)
          .normalize()
          .multiplyScalar(2.025 + Math.sin(t * Math.PI) * 0.38),
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    earth.add(
      new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: "#668cff",
          transparent: true,
          opacity: 0.8,
        }),
      ),
    );
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 8, 6),
      new THREE.MeshBasicMaterial({ color: "#ffffff" }),
    );
    earth.add(bead);
    beads.push(bead);
    arcs.push(pts);
  }
  const ready = fetch("media/land.geojson")
    .then((r) => {
      if (!r.ok) throw Error("Map data unavailable");
      return r.json();
    })
    .then((data) => {
      const map = document.createElement("canvas");
      map.width = 1024;
      map.height = 512;
      const ctx = map.getContext("2d");
      ctx.fillStyle = "#fff";
      for (const f of data.features) {
        const polygons =
          f.geometry.type === "Polygon"
            ? [f.geometry.coordinates]
            : f.geometry.coordinates;
        for (const polygon of polygons) {
          ctx.beginPath();
          for (const ring of polygon) {
            for (let i = 0; i < ring.length; i++) {
              const x = ((ring[i][0] + 180) / 360) * 1024,
                y = ((90 - ring[i][1]) / 180) * 512;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
          }
          ctx.fill("evenodd");
        }
      }
      const pixels = ctx.getImageData(0, 0, 1024, 512).data,
        positions = [],
        colors = [];
      const color = new THREE.Color();
      for (let i = 0; i < 32000; i++) {
        const y = 1 - ((i + 0.5) / 32000) * 2,
          lat = (Math.asin(y) * 180) / Math.PI,
          lon = ((i * 137.507764) % 360) - 180;
        const px = Math.min(1023, Math.floor(((lon + 180) / 360) * 1024)),
          py = Math.min(511, Math.floor(((90 - lat) / 180) * 512));
        if (pixels[(py * 1024 + px) * 4 + 3] < 100) continue;
        const v = latLon(lat, lon, 2.012);
        positions.push(v.x, v.y, v.z);
        const k = ((i * 31) % 100) / 100;
        color.set(k > 0.94 ? "#ffcb8e" : k > 0.6 ? "#cad6ee" : "#5877ad");
        colors.push(color.r, color.g, color.b);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      earth.add(
        new THREE.Points(
          g,
          new THREE.PointsMaterial({
            size: 0.012,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
          }),
        ),
      );
    })
    .catch(() => {});
  let width = 1,
    height = 1,
    rendered = false;
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    rendered = false;
  }
  resize();
  return {
    ready,
    resize,
    render(t, p) {
      if (reduced && rendered) return;
      rendered = true;
      earth.rotation.y = (reduced ? 0 : t * 0.000025) + 0.08;
      earth.rotation.z = -0.12;
      earth.position.y = -p * 1.2;
      const scale = 1 + p * 0.8;
      earth.scale.setScalar(scale);
      halo.position.copy(earth.position);
      halo.scale.setScalar(scale);
      for (let i = 0; i < beads.length; i++) {
        const pts = arcs[i],
          f = (reduced ? 0.3 : (t * 0.00016 + i * 0.23) % 1) * 64,
          k = Math.floor(f);
        beads[i].position.copy(pts[k]).lerp(pts[Math.min(k + 1, 64)], f - k);
      }
      renderer.render(scene, camera);
    },
  };
}

const metal = (color, roughness = 0.5, metalness = 0.25) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });
function box(parent, w, h, d, x, y, z, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}
function cylinder(parent, r1, r2, h, x, y, z, mat, axis = "y") {
  const g = new THREE.CylinderGeometry(r1, r2, h, 24);
  if (axis === "z") g.rotateX(Math.PI / 2);
  if (axis === "x") g.rotateZ(Math.PI / 2);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}
function shippingContainer(color = "#e0e2db", label = true) {
  const g = new THREE.Group(),
    body = metal(color, 0.55, 0.3),
    edge = metal("#c8cbd0", 0.4, 0.5);
  box(g, 6.2, 1.85, 1.85, 0, 0.925, 0, body);
  const ribGeo = new THREE.BoxGeometry(0.065, 1.69, 0.065),
    ribs = new THREE.InstancedMesh(ribGeo, body, 90),
    dummy = new THREE.Object3D();
  for (let i = 0; i < 45; i++) {
    dummy.position.set(-2.98 + i * 0.135, 0.93, 0.953);
    dummy.updateMatrix();
    ribs.setMatrixAt(i, dummy.matrix);
    dummy.position.z = -0.953;
    dummy.updateMatrix();
    ribs.setMatrixAt(i + 45, dummy.matrix);
  }
  g.add(ribs);
  for (const x of [-3.12, 3.12]) {
    box(g, 0.07, 1.92, 1.96, x, 0.925, 0, edge);
    for (const z of [-0.46, 0.46])
      cylinder(g, 0.022, 0.022, 1.63, x + 0.045, 0.94, z, edge);
  }
  for (const y of [0.06, 1.79])
    for (const z of [-0.96, 0.96]) box(g, 6.26, 0.08, 0.08, 0, y, z, edge);
  if (label) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#233edf";
    ctx.font = "800 76px Arial";
    ctx.fillText("WAYLINE", 8, 80);
    ctx.font = "16px monospace";
    ctx.fillStyle = "#5d6772";
    ctx.fillText("EVERY MOVE MATTERS.   ↗", 12, 113);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const labelPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 0.55),
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      }),
    );
    labelPlane.position.set(-0.25, 1.04, 0.994);
    g.add(labelPlane);
  }
  return g;
}
function truck() {
  const g = new THREE.Group(),
    dark = metal("#151b24", 0.33, 0.35),
    steel = metal("#8f9aa8", 0.35, 0.7),
    glass = metal("#192c37", 0.12, 0.45),
    rubber = metal("#171a1e", 0.85, 0),
    wheels = [];
  box(g, 8, 0.19, 1.72, 0.1, 0.6, 0, dark);
  box(g, 6.3, 0.23, 1.89, -0.55, 0.79, 0, steel);
  box(g, 1.75, 1.8, 1.76, 3.35, 1.48, 0, dark);
  box(g, 1.26, 0.65, 1.76, 3.5, 2.66, 0, dark);
  box(g, 1.5, 0.74, 0.018, 3.35, 2.07, 0.894, glass);
  box(g, 1.5, 0.74, 0.018, 3.35, 2.07, -0.894, glass);
  box(g, 0.019, 0.76, 1.52, 4.24, 2.11, 0, glass);
  box(g, 0.055, 0.1, 1.78, 4.25, 1.65, 0, steel);
  box(g, 0.09, 0.28, 1.91, 4.26, 0.7, 0, steel);
  for (let i = 0; i < 6; i++)
    box(g, 0.08, 0.042, 1.36, 4.25, 1.11 + i * 0.095, 0, steel);
  for (const z of [-0.68, 0.68])
    box(
      g,
      0.065,
      0.16,
      0.34,
      4.29,
      0.92,
      z,
      new THREE.MeshBasicMaterial({ color: "#fff8d0" }),
    );
  for (const z of [-1.04, 1.04]) {
    box(g, 0.08, 0.23, 0.2, 3.75, 2.38, z, steel);
    box(g, 0.37, 0.03, 0.3, 3.23, 0.87, z, steel);
  }
  for (const x of [-2.8, -1.85, -0.9, 2.43, 3.75])
    for (const z of [-0.98, 0.98]) {
      const wh = new THREE.Group();
      wh.position.set(x, 0.47, z);
      cylinder(wh, 0.46, 0.46, 0.28, 0, 0, 0, rubber, "z");
      cylinder(wh, 0.26, 0.26, 0.3, 0, 0, 0, steel, "z");
      cylinder(wh, 0.1, 0.1, 0.32, 0, 0, 0, dark, "z");
      const boltGeo = new THREE.CylinderGeometry(0.023, 0.023, 0.34, 6);
      boltGeo.rotateX(Math.PI / 2);
      const bolts = new THREE.InstancedMesh(boltGeo, dark, 8),
        dummy = new THREE.Object3D();
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        dummy.position.set(Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0);
        dummy.updateMatrix();
        bolts.setMatrixAt(k, dummy.matrix);
      }
      wh.add(bolts);
      g.add(wh);
      wheels.push(wh);
    }
  for (const z of [-0.71, 0.71])
    cylinder(g, 0.2, 0.2, 1.4, 1.35, 0.74, z, steel, "x");
  return { group: g, wheels };
}
function crane() {
  const g = new THREE.Group(),
    blue = metal("#234bd9"),
    black = metal("#202735"),
    yellow = metal("#f5b857");
  for (const x of [-4.5, 4.5])
    for (const z of [-2, 2]) {
      box(g, 0.25, 6.2, 0.25, x, 3, z, blue);
      box(g, 1.1, 0.3, 0.6, x, 0.25, z, black);
    }
  for (const z of [-2, 2]) box(g, 9.4, 0.55, 0.28, 0, 6.1, z, blue);
  for (const x of [-4.5, 4.5]) box(g, 0.3, 0.4, 4.25, x, 6.1, 0, blue);
  box(g, 3.2, 0.18, 2.5, 0, 6.36, 0, black);
  box(g, 6.1, 0.14, 1.95, 0, 4.6, 0, yellow);
  const ropes = [];
  for (const x of [-2.7, 2.7])
    for (const z of [-0.8, 0.8]) {
      const r = cylinder(g, 0.015, 0.015, 1, x, 5.2, z, black);
      ropes.push(r);
    }
  const spreader = g.children[g.children.length - 5];
  return { group: g, ropes, spreader };
}
function cargoShip() {
  const g = new THREE.Group(),
    hull = metal("#123264", 0.5, 0.2),
    deck = metal("#698388", 0.7, 0.15);
  const shape = new THREE.Shape();
  shape.moveTo(-4.2, -0.95);
  shape.lineTo(2.9, -0.95);
  shape.lineTo(4.4, 0);
  shape.lineTo(2.9, 0.95);
  shape.lineTo(-4.2, 0.95);
  shape.lineTo(-4.4, 0.6);
  shape.lineTo(-4.4, -0.6);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.85,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  });
  geo.rotateX(-Math.PI / 2);
  const base = new THREE.Mesh(geo, hull);
  g.add(base);
  box(g, 6.9, 0.09, 1.76, -0.45, 0.88, 0, deck);
  const colors = ["#ed8152", "#dee0d7", "#49758e", "#b39260", "#3049b3"];
  const cargoMaterial = metal("#ffffff", 0.65, 0.2),
    skin = document.createElement("canvas");
  skin.width = 128;
  skin.height = 128;
  const sc = skin.getContext("2d");
  sc.fillStyle = "#fff";
  sc.fillRect(0, 0, 128, 128);
  for (let x = 0; x < 128; x += 10) {
    sc.fillStyle = "#d7d7d7";
    sc.fillRect(x, 0, 2, 128);
    sc.fillStyle = "#f2f2f2";
    sc.fillRect(x + 2, 0, 2, 128);
  }
  cargoMaterial.map = new THREE.CanvasTexture(skin);
  cargoMaterial.map.colorSpace = THREE.SRGBColorSpace;
  const cargo = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.744, 0.333, 0.407),
      cargoMaterial,
      63,
    ),
    dummy = new THREE.Object3D(),
    color = new THREE.Color();
  let count = 0;
  for (let i = 0; i < 7; i++)
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 3; k++) {
        dummy.position.set(-2.9 + i * 0.84, 1.15 + k * 0.36, -0.55 + j * 0.55);
        dummy.updateMatrix();
        cargo.setMatrixAt(count, dummy.matrix);
        cargo.setColorAt(count, color.set(colors[(i + j + k) % 5]));
        count++;
      }
  g.add(cargo);
  const white = metal("#e7eced", 0.55, 0.2);
  box(g, 1.03, 1.4, 1.45, -3.6, 1.53, 0, white);
  box(g, 1.18, 0.37, 1.61, -3.6, 2.43, 0, white);
  for (const z of [-0.816, 0.816])
    box(g, 1, 0.17, 0.025, -3.6, 2.47, z, metal("#183f5c", 0.2, 0.3));
  cylinder(g, 0.12, 0.12, 1.35, -3.55, 3.13, 0, white);
  box(g, 0.75, 0.12, 0.12, -3.55, 3.76, 0, white);
  return g;
}
function airplane() {
  const g = new THREE.Group(),
    white = metal("#e1e5ec", 0.3, 0.5),
    blue = metal("#234be7", 0.35, 0.35),
    glass = metal("#172c48", 0.2, 0.4);
  const points = [
    new THREE.Vector2(0.03, -4.4),
    new THREE.Vector2(0.35, -3.5),
    new THREE.Vector2(0.44, -2.8),
    new THREE.Vector2(0.45, 2.3),
    new THREE.Vector2(0.32, 3.4),
    new THREE.Vector2(0.06, 4.2),
  ];
  const body = new THREE.LatheGeometry(points, 32);
  body.rotateZ(-Math.PI / 2);
  g.add(new THREE.Mesh(body, white));
  function wing(outline, y, mat) {
    const s = new THREE.Shape();
    outline.forEach(([x, z], i) => (i ? s.lineTo(x, z) : s.moveTo(x, z)));
    s.closePath();
    const geom = new THREE.ExtrudeGeometry(s, {
      depth: 0.1,
      bevelEnabled: false,
    });
    geom.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = y;
    g.add(mesh);
  }
  wing(
    [
      [0.8, 0],
      [-1.5, 5],
      [-2.15, 5],
      [-0.9, 0],
      [-2.15, -5],
      [-1.5, -5],
    ],
    0,
    white,
  );
  wing(
    [
      [-2.9, 0],
      [-3.8, 2],
      [-4.15, 2],
      [-3.5, 0],
      [-4.15, -2],
      [-3.8, -2],
    ],
    0.2,
    blue,
  );
  const tailShape = new THREE.Shape();
  tailShape.moveTo(-2.7, 0.25);
  tailShape.lineTo(-3.6, 2.2);
  tailShape.lineTo(-4.1, 2.2);
  tailShape.lineTo(-3.85, 0.25);
  tailShape.closePath();
  const tail = new THREE.Mesh(
    new THREE.ExtrudeGeometry(tailShape, { depth: 0.1, bevelEnabled: false }),
    blue,
  );
  tail.position.z = -0.05;
  g.add(tail);
  for (const z of [-2.2, 2.2]) {
    cylinder(g, 0.32, 0.24, 1.4, -0.2, -0.45, z, white, "x");
    cylinder(g, 0.235, 0.235, 0.02, 0.51, -0.45, z, glass, "x");
  }
  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), glass);
  cockpit.scale.set(0.38, 0.105, 0.275);
  cockpit.position.set(3.12, 0.315, 0);
  g.add(cockpit);
  const windows = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.037, 8, 6),
      glass,
      26,
    ),
    windowDummy = new THREE.Object3D();
  for (let i = 0; i < 13; i++)
    for (let j = 0; j < 2; j++) {
      windowDummy.position.set(-2.15 + i * 0.31, 0.15, j ? -0.422 : 0.422);
      windowDummy.scale.set(0.75, 1.2, 0.5);
      windowDummy.updateMatrix();
      windows.setMatrixAt(i * 2 + j, windowDummy.matrix);
    }
  g.add(windows);
  return g;
}
export function createFreight(canvas, reduced = false) {
  const renderer = rendererFor(canvas),
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(36, 1, 0.1, 140);
  const ambient = new THREE.HemisphereLight("#e4ecff", "#566783", 3);
  scene.add(ambient);
  const key = new THREE.DirectionalLight("#fff2de", 4);
  key.position.set(6, 12, 9);
  scene.add(key);
  const fill = new THREE.DirectionalLight("#94b4ff", 2);
  fill.position.set(-8, 4, -6);
  scene.add(fill);
  const truckModel = truck(),
    container = shippingContainer(),
    lift = crane(),
    ship = cargoShip(),
    plane = airplane();
  scene.add(truckModel.group, container, lift.group, ship, plane);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(160, 160),
    metal("#f7f8fa", 1, 0),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.04;
  scene.add(ground);
  const road = new THREE.Group(),
    roadMat = metal("#d2d5dd", 1, 0);
  for (let i = 0; i < 15; i++)
    box(road, 1.2, 0.007, 0.035, -14 + i * 2, 0.006, -1.65, roadMat);
  scene.add(road);
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext("2d"),
    grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, "rgba(0,0,0,.22)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 4),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.012;
  scene.add(shadow);
  const water = new THREE.Group(),
    waveMat = new THREE.MeshBasicMaterial({
      color: "#b8c9f2",
      transparent: true,
      opacity: 0.19,
    });
  for (let i = 0; i < 30; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(4 + (i % 5), 0.015, 0.023),
      waveMat,
    );
    line.position.set(-20 + (i % 7) * 6, 0.08, -10 + Math.floor(i / 7) * 5);
    water.add(line);
  }
  scene.add(water);
  const wake = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 7, 3, 1, true),
    new THREE.MeshBasicMaterial({
      color: "#dcecff",
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  wake.rotation.z = -Math.PI / 2;
  wake.scale.z = 0.1;
  wake.position.set(-6, 0.1, 0);
  scene.add(wake);
  const cloudCanvas = document.createElement("canvas");
  cloudCanvas.width = 128;
  cloudCanvas.height = 64;
  const cc = cloudCanvas.getContext("2d");
  for (let i = 0; i < 9; i++) {
    const x = 24 + (i % 5) * 17,
      y = 25 + (i % 3) * 6,
      r = 14 + (i % 4) * 3,
      cg = cc.createRadialGradient(x, y, 0, x, y, r);
    cg.addColorStop(0, "rgba(255,255,255,.55)");
    cg.addColorStop(1, "rgba(255,255,255,0)");
    cc.fillStyle = cg;
    cc.fillRect(0, 0, 128, 64);
  }
  const clouds = new THREE.Group(),
    cloudMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(cloudCanvas),
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  for (let i = 0; i < 12; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), cloudMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(-15 + (i % 4) * 9, 1 + (i % 3), -8 + Math.floor(i / 4) * 8);
    clouds.add(m);
  }
  scene.add(clouds);
  const white = new THREE.Color("#f7f8fa"),
    blue = new THREE.Color("#173fa0"),
    sky = new THREE.Color("#d9e6f5"),
    bg = new THREE.Color(),
    look = new THREE.Vector3();
  let mobile = false,
    rendered = false;
  function resize() {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    mobile = w < 650;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = mobile ? 42 : 36;
    camera.updateProjectionMatrix();
    rendered = false;
  }
  resize();
  return {
    resize,
    render(t, p) {
      if (reduced && rendered) return;
      rendered = true;
      const terminal = blend(0.24, 0.43, p),
        sea = blend(0.46, 0.54, p),
        air = blend(0.75, 0.82, p);
      bg.copy(white).lerp(blue, sea).lerp(sky, air);
      scene.background = bg;
      ground.material.color.copy(bg);
      truckModel.group.visible = p < 0.54;
      truckModel.group.position.x = -blend(0.35, 0.49, p) * 18;
      for (const w of truckModel.wheels) w.rotation.z = -p * 150;
      road.visible = p < 0.4;
      road.position.x = -((p * 45) % 2);
      shadow.visible = p < 0.52;
      shadow.material.opacity = 1 - sea;
      lift.group.visible = p > 0.22 && p < 0.54;
      lift.group.position.y = -6 * (1 - blend(0.22, 0.29, p));
      const cy = mix(1.01, 3.65, blend(0.3, 0.41, p)) * (1 - sea) + 2.1 * sea;
      container.visible = p < 0.79;
      container.position.set(-0.55, cy, 0);
      container.scale.setScalar(1 - sea * 0.77);
      container.rotation.y = sea * 0.05;
      const spreadY = cy + 1.95;
      lift.spreader.position.y = spreadY;
      for (const rope of lift.ropes) {
        const gap = Math.max(0.05, 6.25 - spreadY);
        rope.scale.y = gap;
        rope.position.y = spreadY + gap / 2;
      }
      ship.visible = p > 0.45 && p < 0.83;
      ship.position.set(-0.3, mix(-4, 0.03, sea), 0);
      ship.rotation.y = mix(0, -0.14, blend(0.54, 0.76, p));
      ship.position.x -= blend(0.74, 0.81, p) * 16;
      container.position.x = ship.position.x - 0.25 * sea;
      water.visible = p > 0.46 && p < 0.82;
      water.position.x = -((p * 15) % 6);
      wake.visible = p > 0.54 && p < 0.79;
      plane.visible = p > 0.74;
      plane.position.set(mix(-12, 1, air), 2.2 + blend(0.85, 1, p) * 0.9, 0);
      plane.rotation.y = -0.15;
      plane.rotation.x = -0.04;
      plane.rotation.z = 0.06 * Math.sin(p * 12);
      clouds.visible = p > 0.76;
      clouds.position.x = -p * 11;
      const overhead = blend(0.27, 0.43, p),
        seaLook = blend(0.47, 0.61, p),
        airLook = blend(0.76, 0.86, p);
      const x = mix(8, 2, overhead),
        y = mix(4.7, 13, overhead),
        z = mix(15, 11, overhead);
      const framing =
        (mobile ? 1.75 : 1) *
        (1 + (mobile ? 0.38 : 0.26) * overhead * (1 - airLook));
      camera.position.set(
        mix(mix(x, 9, seaLook), 11, airLook) * framing,
        mix(mix(y, 12, seaLook), 11, airLook) * framing,
        mix(mix(z, 13, seaLook), 15, airLook) * framing,
      );
      look.set(mobile ? -0.5 : -3, mobile ? 5.3 : 1.65, 0);
      camera.lookAt(look);
      renderer.render(scene, camera);
    },
  };
}
