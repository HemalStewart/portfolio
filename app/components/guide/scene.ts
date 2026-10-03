import {
  ACESFilmicToneMapping,
  CanvasTexture,
  CapsuleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Pose = "wave" | "idle" | "point" | "cheer" | "think";

export type GuideController = {
  setPointer: (x: number, y: number) => void;
  setPose: (pose: Pose) => void;
  setActive: (active: boolean) => void;
  dispose: () => void;
};

const COLORS = {
  shell: "#f3efe2",
  tea: "#0e5a43",
  ink: "#0f2219",
  signal: "#d9f99d",
  glow: "#b8f25a",
  clay: "#e2906b",
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Soft round contact shadow drawn once into a canvas texture. */
function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, "rgba(15,34,25,0.38)");
  grad.addColorStop(1, "rgba(15,34,25,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/**
 * "Commit", the guide bot: a cartoon robot built from primitives — rounded
 * head with a dark visor and glowing eyes, a git-branch antenna, a tea-green
 * body and two arms. It hovers, blinks, follows the pointer and plays simple
 * poses. Rendering pauses whenever it is inactive (tab hidden, nothing moving
 * under reduced motion).
 */
export function createGuide(
  canvas: HTMLCanvasElement,
  { reducedMotion }: { reducedMotion: boolean },
): GuideController {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  const size = canvas.clientWidth || 520;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(size, size, false);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0.25, 10.5);
  camera.lookAt(0, -0.1, 0);

  scene.add(new HemisphereLight("#ffffff", "#c9d3b8", 1.25));
  const key = new DirectionalLight("#fff6e8", 2.1);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rim = new DirectionalLight(COLORS.signal, 1.3);
  rim.position.set(3, 2, -4);
  scene.add(rim);

  const shell = new MeshStandardMaterial({
    color: COLORS.shell,
    roughness: 0.45,
  });
  const tea = new MeshStandardMaterial({ color: COLORS.tea, roughness: 0.55 });
  const ink = new MeshStandardMaterial({
    color: COLORS.ink,
    roughness: 0.22,
    metalness: 0.15,
  });
  const glow = new MeshStandardMaterial({
    color: COLORS.signal,
    emissive: COLORS.glow,
    emissiveIntensity: 1.3,
    roughness: 0.4,
  });
  const cheek = new MeshStandardMaterial({
    color: COLORS.clay,
    roughness: 0.6,
    transparent: true,
    opacity: 0.55,
  });

  const bot = new Group();
  scene.add(bot);

  // Body: tea-green capsule with a cream chest plate and a glowing badge.
  const body = new Mesh(new CapsuleGeometry(0.62, 0.5, 8, 24), tea);
  body.position.y = -1.08;
  bot.add(body);
  const chest = new Mesh(
    new RoundedBoxGeometry(0.62, 0.42, 0.14, 4, 0.1),
    shell,
  );
  chest.position.set(0, -0.98, 0.56);
  bot.add(chest);
  const badge = new Mesh(new SphereGeometry(0.07, 16, 12), glow);
  badge.position.set(0, -0.98, 0.65);
  bot.add(badge);
  const neck = new Mesh(new CylinderGeometry(0.17, 0.22, 0.26, 16), ink);
  neck.position.y = -0.38;
  bot.add(neck);

  // Head.
  const head = new Group();
  head.position.y = 0.42;
  bot.add(head);
  head.add(new Mesh(new RoundedBoxGeometry(1.72, 1.32, 1.36, 6, 0.44), shell));
  const visor = new Mesh(new RoundedBoxGeometry(1.36, 0.86, 0.2, 5, 0.19), ink);
  visor.position.z = 0.6;
  head.add(visor);
  const eyeGeo = new CapsuleGeometry(0.085, 0.14, 4, 12);
  const eyes = [-0.28, 0.28].map((x) => {
    const eye = new Mesh(eyeGeo, glow);
    eye.position.set(x, 0.06, 0.72);
    head.add(eye);
    return eye;
  });
  const mouth = new Mesh(new TorusGeometry(0.12, 0.026, 8, 24, Math.PI), glow);
  mouth.rotation.z = Math.PI;
  mouth.position.set(0, -0.17, 0.71);
  head.add(mouth);
  for (const x of [-0.5, 0.5]) {
    const c = new Mesh(new SphereGeometry(0.075, 12, 8), cheek);
    c.scale.set(1, 0.6, 0.3);
    c.position.set(x, -0.16, 0.7);
    head.add(c);
  }
  for (const x of [-0.92, 0.92]) {
    const ear = new Mesh(new CylinderGeometry(0.2, 0.2, 0.18, 24), tea);
    ear.rotation.z = Math.PI / 2;
    ear.position.x = x;
    head.add(ear);
    const dot = new Mesh(new SphereGeometry(0.06, 12, 8), glow);
    dot.position.x = x * 1.11;
    head.add(dot);
  }

  // Antenna shaped like a git branch: a stem, a forked commit, glowing tips.
  const antenna = new Group();
  antenna.position.y = 0.66;
  head.add(antenna);
  const stem = new Mesh(new CylinderGeometry(0.035, 0.035, 0.46, 8), ink);
  stem.position.y = 0.23;
  antenna.add(stem);
  const fork = new Mesh(new CylinderGeometry(0.03, 0.03, 0.26, 8), ink);
  fork.position.set(0.09, 0.27, 0);
  fork.rotation.z = -0.75;
  antenna.add(fork);
  const tip = new Mesh(new SphereGeometry(0.11, 20, 14), glow);
  tip.position.y = 0.5;
  antenna.add(tip);
  const tip2 = new Mesh(new SphereGeometry(0.07, 16, 12), glow);
  tip2.position.set(0.19, 0.37, 0);
  antenna.add(tip2);

  // Arms pivot at the shoulders.
  const armGeo = new CapsuleGeometry(0.14, 0.4, 6, 12);
  const handGeo = new SphereGeometry(0.17, 16, 12);
  const arms = [-1, 1].map((side) => {
    const pivot = new Group();
    pivot.position.set(side * 0.7, -0.74, 0);
    const arm = new Mesh(armGeo, tea);
    arm.position.y = -0.3;
    pivot.add(arm);
    const hand = new Mesh(handGeo, shell);
    hand.position.y = -0.66;
    pivot.add(hand);
    bot.add(pivot);
    return pivot;
  });

  // Hover ring and contact shadow.
  const ring = new Mesh(
    new TorusGeometry(0.42, 0.04, 8, 40),
    new MeshStandardMaterial({
      color: COLORS.signal,
      emissive: COLORS.glow,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.8,
    }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.95;
  bot.add(ring);
  const shadow = new Mesh(
    new PlaneGeometry(2.2, 2.2),
    new MeshBasicMaterial({
      map: shadowTexture(),
      transparent: true,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -2.35;
  scene.add(shadow);

  bot.position.y = 0.15;

  // ------------------------------------------------------------- animation
  const state = {
    pointer: { x: 0, y: 0 },
    look: { x: 0, y: 0 },
    pose: "wave" as Pose,
    poseStart: 0,
    arms: [-0.18, 0.18],
    blinkAt: 2.2,
    active: true,
  };
  let raf = 0;
  let last = performance.now();
  let time = 0;

  const armTargets = (pose: Pose, t: number): [number, number] => {
    const s = t - state.poseStart;
    switch (pose) {
      case "wave":
        // Raise the right hand and wave for a few seconds, then relax.
        return s < 3.2
          ? [-0.2 + Math.sin(t * 1.6) * 0.04, 2.75 + Math.sin(s * 9) * 0.32]
          : [-0.18 + Math.sin(t * 1.6) * 0.05, 0.18 - Math.sin(t * 1.6) * 0.05];
      case "point":
        // Left arm points across toward the content.
        return [-1.45 + Math.sin(t * 2.4) * 0.05, 0.22];
      case "cheer":
        return [-2.65 + Math.sin(t * 7) * 0.18, 2.65 - Math.sin(t * 7) * 0.18];
      case "think":
        return [-0.2, 2.25];
      default:
        return [
          -0.18 + Math.sin(t * 1.6) * 0.05,
          0.18 - Math.sin(t * 1.6) * 0.05,
        ];
    }
  };

  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    const t = time;
    const k = reducedMotion ? 1 : 1 - Math.pow(0.0015, dt);

    // Hover bob and gentle sway.
    const bob = reducedMotion ? 0 : Math.sin(t * 2) * 0.08;
    bot.position.y = 0.15 + bob;
    ring.scale.setScalar(1 + (reducedMotion ? 0 : Math.sin(t * 2) * 0.06));
    shadow.scale.setScalar(1 - bob * 1.4);

    // Look toward the pointer.
    state.look.x = lerp(state.look.x, state.pointer.x, k);
    state.look.y = lerp(state.look.y, state.pointer.y, k);
    const thinking = state.pose === "think";
    head.rotation.y = state.look.x * 0.55;
    head.rotation.x = -state.look.y * 0.32;
    head.rotation.z = thinking ? 0.18 : lerp(head.rotation.z, 0, k);
    bot.rotation.y = state.look.x * 0.25;
    for (const eye of eyes) {
      eye.position.x = (eye === eyes[0] ? -0.28 : 0.28) + state.look.x * 0.06;
      eye.position.y = 0.06 + state.look.y * 0.04;
    }

    // Blink.
    if (!reducedMotion && t > state.blinkAt) {
      const p = (t - state.blinkAt) / 0.16;
      const open = p < 1 ? Math.abs(1 - p * 2) : 1;
      for (const eye of eyes) eye.scale.y = Math.max(0.12, open);
      if (p >= 1) state.blinkAt = t + 2.5 + Math.random() * 3;
    }

    // Antenna pulse.
    glow.emissiveIntensity = reducedMotion
      ? 1.3
      : 1.15 + Math.sin(t * 3) * 0.35;
    antenna.rotation.z = reducedMotion ? 0 : Math.sin(t * 2.2) * 0.06;

    // Arms toward the pose.
    const [l, r] = armTargets(state.pose, t);
    const ak = reducedMotion ? 1 : 1 - Math.pow(0.0005, dt);
    state.arms[0] = lerp(state.arms[0], l, ak);
    state.arms[1] = lerp(state.arms[1], r, ak);
    arms[0].rotation.z = state.arms[0];
    arms[1].rotation.z = state.arms[1];

    renderer.render(scene, camera);
    raf = state.active && !reducedMotion ? requestAnimationFrame(frame) : 0;
  };

  const kick = () => {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  kick();

  return {
    setPointer(x, y) {
      state.pointer.x = Math.max(-1, Math.min(1, x));
      state.pointer.y = Math.max(-1, Math.min(1, y));
      if (reducedMotion) kick();
    },
    setPose(pose) {
      if (pose === state.pose && pose !== "wave") return;
      state.pose = pose;
      state.poseStart = time;
      kick();
    },
    setActive(active) {
      state.active = active;
      if (active) kick();
    },
    dispose() {
      cancelAnimationFrame(raf);
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          const material = object.material as MeshStandardMaterial;
          material.map?.dispose();
          material.dispose();
        }
      });
      renderer.dispose();
    },
  };
}
