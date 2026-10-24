import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  Fog,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type FormName = "branch" | "scatter" | "sphere" | "wave";

/** Where the field sits for one section: its shape, placement and strength. */
export type Mood = {
  form: FormName;
  /** Horizontal centre as a fraction of the half-width (-1 left … 1 right). */
  x: number;
  /** Vertical centre as a fraction of the half-height. */
  y: number;
  scale: number;
  /** Canvas opacity, so the field steps back behind long copy. */
  opacity: number;
  /** Lean towards the camera (radians), e.g. to look down on the wave. */
  tilt?: number;
  /** Placement on portrait screens. */
  narrow?: Partial<Pick<Mood, "x" | "y" | "scale" | "opacity">>;
};

export type FieldController = {
  /** Scroll position as a continuous index into the moods (2.5 = halfway 2→3). */
  setProgress: (k: number) => void;
  /** Pointer in normalised device coordinates (-1 … 1). */
  setPointer: (x: number, y: number) => void;
  setActive: (active: boolean) => void;
  resize: () => void;
  dispose: () => void;
};

const PALETTE = {
  bone: "#ecebe4",
  stone: "#8d918a",
  coal: "#202320",
  accent: "#b6f36a",
  clay: "#ff7a45",
};

type Formation = {
  pos: Float32Array;
  col: Float32Array;
  size: Float32Array;
  /** 0 = sits square in the sculpture, 1 = tumbles freely. */
  tumble: Float32Array;
};

/* ---------------------------------------------------------------- helpers */

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const linear = (hex: string) => {
  const c = new Color(hex);
  return [c.r, c.g, c.b] as const;
};

type SDF = (x: number, y: number, z: number) => number;

function sdCapsule(
  px: number,
  py: number,
  pz: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  r: number,
) {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = clamp01((pax * bax + pay * bay) / (bax * bax + bay * bay));
  const dx = pax - bax * h;
  const dy = pay - bay * h;
  return Math.sqrt(dx * dx + dy * dy + pz * pz) - r;
}

function sdTorus(px: number, py: number, pz: number, R: number, r: number) {
  const q = Math.sqrt(px * px + py * py) - R;
  return Math.sqrt(q * q + pz * pz) - r;
}

/**
 * Voxelise the shell of a signed distance field on a grid sized so roughly
 * `target` cells land in the shell. Returns cell centres and the spacing.
 */
function voxelise(
  sdf: SDF,
  bounds: [number, number, number],
  target: number,
  tagOf?: (x: number, y: number, z: number) => number,
) {
  const shell = (s: number) => {
    const cells: number[] = [];
    const tags: number[] = [];
    const [bx, by, bz] = bounds;
    for (let x = -bx; x <= bx; x += s)
      for (let y = -by; y <= by; y += s)
        for (let z = -bz; z <= bz; z += s) {
          const d = sdf(x, y, z);
          if (d <= 0 && d > -1.35 * s) {
            cells.push(x, y, z);
            tags.push(tagOf ? tagOf(x, y, z) : 0);
          }
        }
    return { cells, tags };
  };
  // Shell cells scale with 1/s², so one correction lands close to target.
  let s = 0.2;
  let result = shell(s);
  s *= Math.sqrt(result.cells.length / 3 / target);
  result = shell(s);
  return { ...result, spacing: s };
}

function emptyFormation(n: number): Formation {
  return {
    pos: new Float32Array(n * 3),
    col: new Float32Array(n * 3),
    size: new Float32Array(n),
    tumble: new Float32Array(n),
  };
}

function shuffle<T>(items: T[], random: () => number) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Scattered debris: free-tumbling voxels in a loose shell around a shape. */
function dust(
  f: Formation,
  slots: number[],
  random: () => number,
  inner: number,
  outer: number,
) {
  const bone = linear(PALETTE.bone);
  const stone = linear(PALETTE.stone);
  const accent = linear(PALETTE.accent);
  for (const i of slots) {
    const a = random() * Math.PI * 2;
    const r = lerp(inner, outer, Math.sqrt(random()));
    f.pos[i * 3] = Math.cos(a) * r;
    f.pos[i * 3 + 1] = Math.sin(a) * r * 0.85;
    f.pos[i * 3 + 2] = (random() - 0.5) * 3;
    const c = random() < 0.3 ? accent : random() < 0.5 ? stone : bone;
    f.col.set(c, i * 3);
    f.size[i] = 0.05 + random() * 0.08;
    f.tumble[i] = 1;
  }
}

/** Fill a formation from voxelised cells; leftover instances become dust. */
function fromCells(
  n: number,
  cells: number[],
  tags: number[],
  spacing: number,
  colourOf: (tag: number, random: () => number) => readonly number[],
  random: () => number,
  dustRange: [number, number],
) {
  const f = emptyFormation(n);
  const count = Math.min(n, cells.length / 3);
  const pick = shuffle(
    Array.from({ length: cells.length / 3 }, (_, i) => i),
    random,
  ).slice(0, count);
  const order = shuffle(
    Array.from({ length: n }, (_, i) => i),
    random,
  );
  pick.forEach((cell, k) => {
    const i = order[k];
    f.pos.set(cells.slice(cell * 3, cell * 3 + 3), i * 3);
    f.col.set(colourOf(tags[cell], random), i * 3);
    f.size[i] = spacing * 0.9;
    f.tumble[i] = 0;
  });
  dust(f, order.slice(count), random, dustRange[0], dustRange[1]);
  return f;
}

/* ------------------------------------------------------------ formations */

/** The git-branch glyph: three commit rings, a trunk and a merging curve. */
function branchFormation(n: number, random: () => number): Formation {
  const R = 0.78;
  const r = 0.33;
  const A = [-1.45, -2.55];
  const B = [-1.45, 2.55];
  const C = [1.6, 1.4];
  const curve: number[][] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const u = 1 - t;
    // Cubic from the bottom of C, down and across into the trunk.
    const p0 = [C[0], C[1] - R];
    const p1 = [C[0], -0.55];
    const p2 = [0.15, -0.95];
    const p3 = [A[0], -1.05];
    curve.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  const lineR = 0.29;
  const sdf: SDF = (x, y, z) => {
    let d = sdTorus(x - A[0], y - A[1], z, R, r);
    d = Math.min(d, sdTorus(x - B[0], y - B[1], z, R, r));
    d = Math.min(d, sdTorus(x - C[0], y - C[1], z, R, r));
    d = Math.min(
      d,
      sdCapsule(x, y, z, A[0], A[1] + R, B[0], B[1] - R, lineR),
    );
    for (let i = 0; i < curve.length - 1; i++)
      d = Math.min(
        d,
        sdCapsule(
          x,
          y,
          z,
          curve[i][0],
          curve[i][1],
          curve[i + 1][0],
          curve[i + 1][1],
          lineR,
        ),
      );
    return d;
  };
  // Tag 1: the new branch's head commit (C), lit in the accent colour.
  const tagOf = (x: number, y: number) =>
    Math.hypot(x - C[0], y - C[1]) < R + r + 0.05 ? 1 : 0;
  const { cells, tags, spacing } = voxelise(
    sdf,
    [2.6, 3.6, 0.7],
    n * 0.86,
    tagOf,
  );
  const bone = linear(PALETTE.bone);
  const stone = linear(PALETTE.stone);
  const accent = linear(PALETTE.accent);
  return fromCells(
    n,
    cells,
    tags,
    spacing,
    (tag, rand) => (tag === 1 ? accent : rand() < 0.16 ? stone : bone),
    random,
    [3.4, 6.2],
  );
}

/** A hollow voxel planet with a scatter of lit "cities". */
function sphereFormation(n: number, random: () => number): Formation {
  const sdf: SDF = (x, y, z) => Math.sqrt(x * x + y * y + z * z) - 2.75;
  const { cells, tags, spacing } = voxelise(sdf, [2.9, 2.9, 2.9], n * 0.9);
  const bone = linear(PALETTE.bone);
  const stone = linear(PALETTE.stone);
  const coal = linear(PALETTE.coal);
  const accent = linear(PALETTE.accent);
  return fromCells(
    n,
    cells,
    tags,
    spacing,
    (_, rand) => {
      const v = rand();
      return v < 0.08 ? accent : v < 0.3 ? stone : v < 0.4 ? coal : bone;
    },
    random,
    [3.6, 5.5],
  );
}

/** Free-floating particles across the whole viewport. */
function scatterFormation(n: number, random: () => number): Formation {
  const f = emptyFormation(n);
  const bone = linear(PALETTE.bone);
  const stone = linear(PALETTE.stone);
  const coal = linear(PALETTE.coal);
  const accent = linear(PALETTE.accent);
  const clay = linear(PALETTE.clay);
  for (let i = 0; i < n; i++) {
    f.pos[i * 3] = (random() - 0.5) * 24;
    f.pos[i * 3 + 1] = (random() - 0.5) * 14;
    f.pos[i * 3 + 2] = -12 + random() * 13;
    const v = random();
    f.col.set(
      v < 0.22
        ? accent
        : v < 0.26
          ? clay
          : v < 0.58
            ? stone
            : v < 0.8
              ? coal
              : bone,
      i * 3,
    );
    // Mostly fine dust, a few larger chips: a sparse field behind copy.
    const grain = random();
    f.size[i] =
      grain < 0.55
        ? 0.015 + random() * 0.025
        : grain < 0.92
          ? 0.04 + random() * 0.05
          : 0.1 + random() * 0.07;
    f.tumble[i] = 1;
  }
  return f;
}

/** A field of voxel columns; it rolls as a wave at runtime. */
function waveFormation(n: number, random: () => number): Formation {
  const f = emptyFormation(n);
  const cols = Math.round(Math.sqrt(n * 2.2));
  const rows = Math.ceil(n / cols);
  const gap = 0.36;
  const bone = linear(PALETTE.bone);
  const stone = linear(PALETTE.stone);
  const coal = linear(PALETTE.coal);
  const accent = linear(PALETTE.accent);
  const order = shuffle(
    Array.from({ length: n }, (_, i) => i),
    random,
  );
  for (let k = 0; k < n; k++) {
    const i = order[k];
    const c = k % cols;
    const r = Math.floor(k / cols);
    f.pos[i * 3] = (c - (cols - 1) / 2) * gap;
    f.pos[i * 3 + 1] = 0;
    f.pos[i * 3 + 2] = (r - (rows - 1) / 2) * gap;
    const v = random();
    // Mostly dark, so copy above it stays legible; a few lit voxels.
    f.col.set(
      v < 0.07 ? accent : v < 0.15 ? bone : v < 0.5 ? stone : coal,
      i * 3,
    );
    f.size[i] = gap * 0.56;
    f.tumble[i] = 0;
  }
  return f;
}

/* ----------------------------------------------------------------- scene */

/**
 * The voxel field: one instanced mesh of rounded cubes that morphs between
 * formations as the page scrolls — the git-branch glyph in the hero, loose
 * particles behind long copy, a planet, a rolling wave — and reassembles at
 * the end. Fixed behind the page, it renders only while the tab is visible.
 */
export function createField(
  canvas: HTMLCanvasElement,
  moods: Mood[],
  options: {
    reducedMotion: boolean;
    count: number;
    /** Seconds to hold the opening assembly (e.g. while a boot screen shows). */
    introDelay?: number;
  },
): FieldController {
  const { reducedMotion } = options;
  const n = options.count;
  const random = rng(20170101);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  // Far voxels sink into the page colour, which gives the field depth.
  scene.fog = new Fog(0x0a0b0a, 12, 27);
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;

  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  const key = new DirectionalLight(0xffffff, 1.8);
  key.position.set(5, 8, 7);
  scene.add(key);
  const glow = new PointLight(PALETTE.accent, 40, 26, 1.6);
  glow.position.set(-5, -4, 5);
  scene.add(glow);

  const geometry = new RoundedBoxGeometry(1, 1, 1, 1, 0.14);
  const material = new MeshStandardMaterial({
    roughness: 0.42,
    metalness: 0.08,
    envMapIntensity: 0.85,
  });
  const mesh = new InstancedMesh(geometry, material, n);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  mesh.instanceColor = new InstancedBufferAttribute(new Float32Array(n * 3), 3);
  mesh.instanceColor.setUsage(DynamicDrawUsage);
  mesh.frustumCulled = false;
  const group = new Group();
  group.add(mesh);
  scene.add(group);

  const forms: Record<FormName, Formation> = {
    branch: branchFormation(n, random),
    scatter: scatterFormation(n, random),
    sphere: sphereFormation(n, random),
    wave: waveFormation(n, random),
  };

  // Per-instance constants: stagger, idle phase, tumble axes and spin.
  const stagger = new Float32Array(n);
  const phase = new Float32Array(n);
  const rot = new Float32Array(n * 3);
  const spin = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    stagger[i] = random();
    phase[i] = random() * Math.PI * 2;
    rot[i * 3] = random() * Math.PI * 2;
    rot[i * 3 + 1] = random() * Math.PI * 2;
    rot[i * 3 + 2] = random() * Math.PI * 2;
    spin[i] = (random() - 0.5) * 1.2;
  }
  const push = new Float32Array(n * 3);

  const state = {
    k: 0,
    pointer: { x: 0, y: 0, tx: 0, ty: 0, active: 0, seen: false },
    tilt: { x: 0, y: 0 },
    opacity: 0,
    intro: reducedMotion ? 1 : 0,
    born: performance.now() + (options.introDelay ?? 0) * 1000,
    active: true,
    raf: 0,
    last: performance.now(),
    time: 0,
    width: 1,
    height: 1,
    dirty: true,
  };

  const halfHeight = () => Math.tan((camera.fov * Math.PI) / 360) * 14;

  function placement(mood: Mood) {
    const narrow = state.width / state.height < 0.9;
    const m = narrow ? { ...mood, ...mood.narrow } : mood;
    const hh = halfHeight();
    const hw = hh * camera.aspect;
    // Shapes are ~7.2 units tall; keep them inside narrow screens too.
    const fit = Math.min(1, (hw * 1.7) / 5.4);
    return {
      x: m.x * hw,
      y: m.y * hh,
      scale: m.scale * (narrow ? fit : 1),
      opacity: m.opacity,
      tilt: m.tilt ?? 0,
    };
  }

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    state.width = width;
    state.height = height;
    const dpr = Math.min(window.devicePixelRatio || 1, width < 900 ? 1.25 : 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    state.dirty = true;
  }

  const pointerWorld = new Vector3();
  const pointerLocal = new Vector3();
  const ray = new Vector3();

  function frame(now: number) {
    state.raf = 0;
    const dt = Math.min(0.05, (now - state.last) / 1000);
    state.last = now;
    if (!reducedMotion) state.time += dt;
    const time = state.time;

    // Wall-clock, so the opening assembly lands on time even at low frame rates.
    if (state.intro < 1)
      state.intro = clamp01((now - state.born) / 2600);

    const k = Math.max(0, Math.min(moods.length - 1, state.k));
    const ia = Math.floor(k);
    const ib = Math.min(moods.length - 1, ia + 1);
    const t = k - ia;
    const moodA = moods[ia];
    const moodB = moods[ib];
    const A = forms[moodA.form];
    const B = forms[moodB.form];
    const pa = placement(moodA);
    const pb = placement(moodB);
    const g = easeInOut(t);

    // Group placement follows the scroll blend; a slow sway and pointer tilt.
    const p = state.pointer;
    p.x = lerp(p.x, p.tx, 0.08);
    p.y = lerp(p.y, p.ty, 0.08);
    state.tilt.x = lerp(state.tilt.x, -p.y * 0.22, 0.05);
    state.tilt.y = lerp(state.tilt.y, p.x * 0.4, 0.05);
    const scale = lerp(pa.scale, pb.scale, g);
    group.position.set(lerp(pa.x, pb.x, g), lerp(pa.y, pb.y, g), 0);
    group.scale.setScalar(scale);
    group.rotation.set(
      lerp(pa.tilt, pb.tilt, g) + state.tilt.x + Math.sin(time * 0.21) * 0.06,
      state.tilt.y + Math.sin(time * 0.17) * 0.32,
      0,
    );
    group.updateMatrixWorld();

    const targetOpacity = lerp(pa.opacity, pb.opacity, g);
    state.opacity = lerp(state.opacity, targetOpacity, reducedMotion ? 1 : 0.12);
    canvas.style.opacity = state.opacity.toFixed(3);

    // Pointer → a point on the z=0 plane, in the group's local space.
    let pushOn = 0;
    if (p.seen) {
      ray.set(p.x, p.y, 0.5).unproject(camera).sub(camera.position).normalize();
      const d = -camera.position.z / ray.z;
      pointerWorld.copy(camera.position).addScaledVector(ray, d);
      pointerLocal.copy(pointerWorld);
      group.worldToLocal(pointerLocal);
      p.active = lerp(p.active, 1, 0.05);
      pushOn = p.active;
    }
    const pushR = 1.5 / Math.max(0.3, scale);
    const pushR2 = pushR * pushR;

    const S = forms.scatter;
    const introOn = state.intro < 1;

    const m = mesh.instanceMatrix.array as Float32Array;
    const colours = mesh.instanceColor!.array as Float32Array;

    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      const local = easeInOut(clamp01((t - stagger[i] * 0.4) / 0.6));
      // A little outward bow mid-flight so morphs feel like a burst.
      const bow = Math.sin(local * Math.PI) * 0.6;

      let x = lerp(A.pos[i3], B.pos[i3], local);
      let y = lerp(A.pos[i3 + 1], B.pos[i3 + 1], local);
      let z = lerp(A.pos[i3 + 2], B.pos[i3 + 2], local) + bow * 2;
      let size = lerp(A.size[i], B.size[i], local);
      const tumble = lerp(A.tumble[i], B.tumble[i], local);

      const wave =
        (moodA.form === "wave" ? 1 - local : 0) +
        (moodB.form === "wave" ? local : 0);
      if (wave > 0) {
        const h =
          Math.sin(x * 0.55 + time * 0.9) * Math.cos(z * 0.45 + time * 0.6) * 0.9 +
          Math.sin((x + z) * 0.3 - time * 0.5) * 0.5;
        y += h * wave;
        size *= 1 + Math.max(0, h) * 0.25 * wave;
      }

      if (introOn) {
        const li = easeInOut(clamp01((state.intro - stagger[i] * 0.45) / 0.55));
        x = lerp(S.pos[i3], x, li);
        y = lerp(S.pos[i3 + 1], y, li);
        z = lerp(S.pos[i3 + 2], z, li);
        size = lerp(S.size[i], size, li);
      }

      // Idle float, stronger for loose particles.
      const float = 0.03 + tumble * 0.22;
      x += Math.sin(time * 0.6 + phase[i]) * float;
      y += Math.cos(time * 0.5 + phase[i] * 1.3) * float;

      // Pointer pushes voxels aside like a hand through sand.
      let tx = 0;
      let ty = 0;
      let tz = 0;
      if (pushOn > 0) {
        const dx = x - pointerLocal.x;
        const dy = y - pointerLocal.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < pushR2 && d2 > 1e-6) {
          const d = Math.sqrt(d2);
          const f = (1 - d / pushR) ** 2 * 0.9 * pushOn;
          tx = (dx / d) * f;
          ty = (dy / d) * f;
          tz = f * 1.4;
        }
      }
      push[i3] += (tx - push[i3]) * 0.12;
      push[i3 + 1] += (ty - push[i3 + 1]) * 0.12;
      push[i3 + 2] += (tz - push[i3 + 2]) * 0.12;
      x += push[i3];
      y += push[i3 + 1];
      z += push[i3 + 2];

      // Rotation (Euler XYZ) and uniform scale, written straight in.
      const ax = (rot[i3] + time * spin[i]) * tumble;
      const ay = (rot[i3 + 1] + time * spin[i] * 0.7) * tumble;
      const az = rot[i3 + 2] * tumble;
      const a = Math.cos(ax);
      const b = Math.sin(ax);
      const c = Math.cos(ay);
      const d = Math.sin(ay);
      const e = Math.cos(az);
      const f = Math.sin(az);
      const ae = a * e;
      const af = a * f;
      const be = b * e;
      const bf = b * f;
      const o = i * 16;
      m[o] = c * e * size;
      m[o + 1] = (af + be * d) * size;
      m[o + 2] = (bf - ae * d) * size;
      m[o + 3] = 0;
      m[o + 4] = -c * f * size;
      m[o + 5] = (ae - bf * d) * size;
      m[o + 6] = (be + af * d) * size;
      m[o + 7] = 0;
      m[o + 8] = d * size;
      m[o + 9] = -b * c * size;
      m[o + 10] = a * c * size;
      m[o + 11] = 0;
      m[o + 12] = x;
      m[o + 13] = y;
      m[o + 14] = z;
      m[o + 15] = 1;

      colours[i3] = lerp(A.col[i3], B.col[i3], local);
      colours[i3 + 1] = lerp(A.col[i3 + 1], B.col[i3 + 1], local);
      colours[i3 + 2] = lerp(A.col[i3 + 2], B.col[i3 + 2], local);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor!.needsUpdate = true;

    renderer.render(scene, camera);
    state.dirty = false;
    schedule();
  }

  function schedule() {
    if (state.raf || !state.active) return;
    // Under reduced motion, draw only when something changed.
    if (reducedMotion && !state.dirty) return;
    state.raf = requestAnimationFrame(frame);
  }

  resize();
  schedule();

  return {
    setProgress(k) {
      if (Math.abs(k - state.k) < 1e-4) return;
      state.k = k;
      state.dirty = true;
      schedule();
    },
    setPointer(x, y) {
      if (reducedMotion) return;
      state.pointer.tx = x;
      state.pointer.ty = y;
      state.pointer.seen = true;
    },
    setActive(active) {
      state.active = active;
      if (active) {
        state.last = performance.now();
        schedule();
      } else if (state.raf) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      }
    },
    resize() {
      resize();
      schedule();
    },
    dispose() {
      cancelAnimationFrame(state.raf);
      state.active = false;
      geometry.dispose();
      material.dispose();
      environment.dispose();
      pmrem.dispose();
      mesh.dispose();
      renderer.dispose();
    },
  };
}
