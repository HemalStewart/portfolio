import * as THREE from "../_engine/vendor/three.module.js";

// Independent dotted globe. Orthographic camera in CSS pixels so the sphere can be
// framed exactly like the reference: large, right-cropped, orange top rim, blue base.
const RAD = Math.PI / 180;
const toVec = (lat, lon, r) =>
  new THREE.Vector3(
    r * Math.cos(lat * RAD) * Math.sin(lon * RAD),
    r * Math.sin(lat * RAD),
    r * Math.cos(lat * RAD) * Math.cos(lon * RAD),
  );

const PORTS = [
  ["COLOMBO", 6.93, 79.85],
  ["MUMBAI", 19.08, 72.88],
  ["DUBAI", 25.2, 55.27],
  ["SINGAPORE", 1.29, 103.85],
  ["HONG KONG", 22.32, 114.17],
  ["SHANGHAI", 31.23, 121.47],
  ["BANGKOK", 13.75, 100.5],
  ["JAKARTA", -6.2, 106.85],
  ["PERTH", -31.95, 115.86],
  ["MELBOURNE", -37.81, 144.96],
];
const ROUTES = [
  [0, 2],
  [0, 1],
  [0, 3],
  [3, 4],
  [4, 5],
  [3, 8],
  [3, 9],
  [6, 4],
];

export function createGlobe(canvas, labelRoot, reduced) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -5000, 5000);
  camera.position.z = 1000;
  const tilt = new THREE.Group();
  const spin = new THREE.Group();
  tilt.add(spin);
  scene.add(tilt);

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 64),
    new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec3 vN;void main(){
        float facing=clamp(vN.z,0.,1.);
        float edge=pow(1.-facing,2.6);
        float up=smoothstep(-.35,.55,vN.y-vN.x*.15);
        vec3 rim=mix(vec3(.08,.22,1.),vec3(1.,.45,.12),up);
        float spread=mix(1.6,.85,up);
        vec3 col=vec3(.006,.006,.012)+rim*pow(edge,spread)*1.25;
        gl_FragColor=vec4(col,1.);
      }`,
    }),
  );
  spin.add(ball);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(1.06, 96, 64),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec3 vN;void main(){
        float f=clamp(-vN.z,0.,1.);
        float ring=pow(1.-f,7.)*smoothstep(0.,.18,f);
        float up=smoothstep(-.35,.55,vN.y-vN.x*.15);
        vec3 col=mix(vec3(.12,.25,1.),vec3(1.,.46,.15),up);
        gl_FragColor=vec4(col,ring*mix(1.25,.55,up));
      }`,
    }),
  );
  tilt.add(halo);

  // Port pins, arcs and travelling beads
  const pins = PORTS.map(([, lat, lon]) => {
    const pin = new THREE.Object3D();
    pin.position.copy(toVec(lat, lon, 1.004));
    spin.add(pin);
    return pin;
  });
  const arcs = [];
  const beads = [];
  const arcMaterial = new THREE.LineBasicMaterial({
    color: "#ff6a2a",
    transparent: true,
    opacity: 0.9,
  });
  for (const [a, b] of ROUTES) {
    const va = toVec(PORTS[a][1], PORTS[a][2], 1),
      vb = toVec(PORTS[b][1], PORTS[b][2], 1),
      pts = [];
    const lift = 0.06 + va.distanceTo(vb) * 0.12;
    for (let j = 0; j <= 64; j++) {
      const p = j / 64;
      pts.push(
        va
          .clone()
          .lerp(vb, p)
          .normalize()
          .multiplyScalar(1.003 + Math.sin(p * Math.PI) * lift),
      );
    }
    spin.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), arcMaterial));
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.006, 8, 6),
      new THREE.MeshBasicMaterial({ color: "#ffd2b8" }),
    );
    spin.add(bead);
    arcs.push(pts);
    beads.push(bead);
  }

  const labels = PORTS.map(([name]) => {
    const el = document.createElement("span");
    el.className = "glabel";
    el.innerHTML = `<b>${name}</b><i></i>`;
    labelRoot.append(el);
    return el;
  });

  let dots;
  const ready = fetch("media/land.geojson")
    .then((r) => {
      if (!r.ok) throw Error("Map unavailable");
      return r.json();
    })
    .then((data) => {
      const map = document.createElement("canvas");
      map.width = 1440;
      map.height = 720;
      const ctx = map.getContext("2d", { willReadFrequently: true });
      ctx.fillStyle = "#fff";
      for (const f of data.features) {
        const polys =
          f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
        for (const poly of polys) {
          ctx.beginPath();
          for (const ring of poly)
            ring.forEach(([lon, lat], i) => {
              const x = ((lon + 180) / 360) * 1440,
                y = ((90 - lat) / 180) * 720;
              i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            });
          ctx.fill("evenodd");
        }
      }
      const px = ctx.getImageData(0, 0, 1440, 720).data;
      const pos = [];
      // Lat/long grid of dots, thinned toward the poles, like a printed dot map.
      for (let lat = -84; lat <= 84; lat += 0.62) {
        const step = 0.62 / Math.max(0.2, Math.cos(lat * RAD));
        for (let lon = -180; lon < 180; lon += step) {
          const x = Math.floor(((lon + 180) / 360) * 1439),
            y = Math.floor(((90 - lat) / 180) * 719);
          if (px[(y * 1440 + x) * 4 + 3] < 120) continue;
          const v = toVec(lat, lon, 1.002);
          pos.push(v.x, v.y, v.z);
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      dots = new THREE.Points(
        g,
        new THREE.PointsMaterial({
          color: "#e9edf5",
          size: 1.5,
          sizeAttenuation: false,
          transparent: true,
          opacity: 0.92,
          depthWrite: false,
        }),
      );
      spin.add(dots);
    })
    .catch(() => {});

  const world = new THREE.Vector3(),
    normal = new THREE.Vector3();
  let w = 1,
    h = 1,
    cx = 0,
    cy = 0,
    radius = 1,
    clock = 0,
    lastPose = "";

  function resize(frame) {
    w = canvas.clientWidth || innerWidth;
    h = canvas.clientHeight || innerHeight;
    const dpr = Math.min(devicePixelRatio, w < 768 ? 1.6 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.left = -w / 2;
    camera.right = w / 2;
    camera.top = h / 2;
    camera.bottom = -h / 2;
    camera.updateProjectionMatrix();
    if (dots) dots.material.size = 1.5 * dpr * (w < 768 ? 0.85 : Math.min(1.3, w / 1280));
    ({ cx, cy, radius } = frame);
    lastPose = "";
  }

  return {
    ready,
    resize,
    // p: hero scroll progress (0..1 over the reference's 1008px), intro: loader reveal 0..1
    render(dt, p, intro) {
      clock += reduced ? 0 : Math.min(dt, 50) / 1000;
      const s = radius * (0.4 + 0.6 * intro);
      const lon0 = 92 - 70 * p - clock * 0.6;
      const pose = `${s.toFixed(1)}|${lon0.toFixed(2)}|${w}|${h}`;
      if (reduced && pose === lastPose) return;
      lastPose = pose;
      tilt.position.set(cx - w / 2, h / 2 - cy, 0);
      tilt.scale.setScalar(s);
      tilt.rotation.set(14 * RAD, 0, -9 * RAD);
      spin.rotation.y = -lon0 * RAD;
      for (let i = 0; i < beads.length; i++) {
        const f = ((clock * 0.12 + i * 0.37) % 1) * 64,
          k = Math.floor(f);
        beads[i].position.copy(arcs[i][k]).lerp(arcs[i][Math.min(k + 1, 64)], f - k);
      }
      renderer.render(scene, camera);
      for (let i = 0; i < labels.length; i++) {
        pins[i].getWorldPosition(world);
        normal.copy(world).sub(tilt.position).normalize();
        const x = world.x + w / 2,
          y = h / 2 - world.y,
          show = normal.z > 0.18 && x > 20 && x < w - 20 && y > 30 && y < h - 20;
        labels[i].style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
        labels[i].style.opacity = show ? String(Math.min(1, (normal.z - 0.18) * 6) * intro) : "0";
      }
    },
  };
}
