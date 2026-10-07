import * as THREE from "../_engine/vendor/three.module.js";

// Small independent ocean shader: one full-screen draw, only while the sea stage is visible.
// The texture is scaled with the ship zoom so the camera appears to rise above the water.
export function createOcean(canvas, reduced) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: false,
    powerPreference: "high-performance",
  });
  // Raw shader output: keep texture values untouched (no linear/sRGB round trip).
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  const scene = new THREE.Scene(),
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const U = {
    uTime: { value: 0 },
    uMap: { value: null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uShip: { value: new THREE.Vector3(0.5, 0.5, 0.2) },
    uZoom: { value: 1 },
    uFlow: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader:
      "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
    fragmentShader: `
    precision highp float; varying vec2 vUv;
    uniform sampler2D uMap; uniform float uTime,uZoom,uFlow; uniform vec2 uRes; uniform vec3 uShip;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(17.,9.);a*=.5;}return v;}
    void main(){
      vec2 px=vUv*uRes;                       // CSS pixels, origin bottom-left
      vec2 c=vec2(uShip.x,uRes.y-uShip.y);    // ship centre in the same space
      float tile=uRes.x*.6*uZoom;             // one texture tile, shrinking as we rise
      vec2 uv=(px-c)/tile;
      uv.y+=uFlow;                            // water streams past the ship
      float t=uTime;
      vec2 warp=vec2(sin(uv.y*9.+t*.6),cos(uv.x*8.-t*.5))*.004;
      vec3 water=texture2D(uMap,uv*vec2(1.,.62)+warp).rgb;
      water*=vec3(1.,.88,1.13);               // graded toward the reference's deeper blue
      vec3 mean=vec3(.0,.14,.38);
      water=max(mean+(water-mean)*1.25,0.);   // bring out the swell texture
      float sw=fbm(uv*vec2(9.,6.)+vec2(t*.03,-t*.05));
      water*=.82+.36*sw;                      // procedural swell so the sea never reads flat
      // foam: lacy streaks hugging the hull, a bow wave, and a short wake behind the stern
      vec2 d=(px-c)/max(uShip.z,1.);          // hull widths; hull spans |x|<.5, bow ~ +2.45
      float along=clamp(2.5-d.y,0.,80.);      // distance from the bow toward the stern
      float edge=abs(d.x)-.44;
      float width=.12+min(along,4.9)*.06;
      float centre=max(along-4.9,0.)*.22;     // wake arms leave the hull behind the stern
      float band=1.-smoothstep(0.,width+centre*.25,abs(edge-centre*.6)-centre*.2);
      band*=smoothstep(2.65,2.35,d.y)*exp(-max(along-4.9,0.)*.55)*smoothstep(-.12,0.,edge);
      vec2 q=vec2(d.x,d.y+t*.5+uFlow*3.);
      float f=fbm(q*vec2(6.,2.));
      float g=fbm(q*vec2(34.,5.)+f*1.5);
      float lace=smoothstep(.5,.62,g+band*.32-(1.-f)*.25);
      float foam=lace*smoothstep(0.,.35,band)*(.45+.55*band);
      water=mix(water,vec3(.84,.9,.97),clamp(foam,0.,1.)*.9);
      gl_FragColor=vec4(water,1.);
    }`,
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
  const ready = new Promise((resolve) =>
    new THREE.TextureLoader().load(
      "media/study/ocean.jpg",
      (map) => {
        map.wrapS = map.wrapT = THREE.MirroredRepeatWrapping;
        map.colorSpace = THREE.NoColorSpace;
        map.anisotropy = 4;
        U.uMap.value = map;
        resolve();
      },
      undefined,
      () => resolve(),
    ),
  );
  function resize() {
    const w = canvas.clientWidth || innerWidth,
      h = canvas.clientHeight || innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, w < 768 ? 1.25 : 1.5));
    renderer.setSize(w, h, false);
    U.uRes.value.set(w, h);
  }
  resize();
  return {
    ready,
    resize,
    // shipX/shipY: centre in CSS px, shipW: rendered hull width in px, zoom: 1 → ~0.1
    render(t, zoom, shipX, shipY, shipW, flow) {
      if (!U.uMap.value) return;
      U.uTime.value = reduced ? 0 : t * 0.001;
      U.uZoom.value = Math.max(0.12, zoom);
      U.uShip.value.set(shipX, shipY, shipW);
      U.uFlow.value = reduced ? 0 : flow;
      renderer.render(scene, camera);
    },
  };
}
