// Wayline freight journey — independent scroll timeline.
// Scene order, hold lengths and artwork follow the United Carriers study (credited in
// media/SOURCES.md); every curve below was rebuilt from frame-by-frame measurements.
//
// Units: "design px" = reference pixels at a 1280×720 viewport (mobile: 390×844).
// Y = scroll position expressed in reference pixels, so timings hold at any viewport height.
import { createOcean } from "./water.js";

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (y, a, b) => clamp((y - a) / (b - a));
const sine = (t) => (1 - Math.cos(Math.PI * t)) / 2;
const f2 = (n) => Math.round(n * 100) / 100;

// Reduced motion: hold one still per scene instead of scrubbing continuous motion.
const SNAP_D = [
  [3197, 2900],
  [4896, 4320],
  [5760, 5700],
  [6900, 6400],
  [7850, 7344],
  [8600, 8352],
  [9300, 8900],
  [10300, 10100],
  [11548, 11000],
  [13500, 12400],
  [15100, 14500],
  [16344, 15500],
  [Infinity, 18000],
];
const SNAP_M = [
  [2560, 2400],
  [3250, 3000],
  [3680, 3600],
  [4250, 3690],
  [8000, 4400],
  [8610, 8442],
  [10700, 9576],
  [12600, 11466],
  [Infinity, 13734],
];
const snap = (y, table) => {
  for (const [limit, value] of table) if (y < limit) return value;
  return y;
};

// Keyframe track. "smooth" = monotone cubic (no overshoot between sampled measurements).
function track(keys, mode = "smooth") {
  const n = keys.length,
    xs = keys.map((k) => k[0]),
    ys = keys.map((k) => k[1]);
  const m = new Array(n).fill(0);
  if (mode === "smooth" && n > 2) {
    const d = [];
    for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m[0] = d[0];
    m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) {
        m[i] = m[i + 1] = 0;
        continue;
      }
      const a = m[i] / d[i],
        b = m[i + 1] / d[i],
        h = a * a + b * b;
      if (h > 9) {
        const t = 3 / Math.sqrt(h);
        m[i] = t * a * d[i];
        m[i + 1] = t * b * d[i];
      }
    }
  } else if (mode === "smooth" && n === 2) {
    // two keys: ease in and out
    mode = "sine";
  }
  return (y) => {
    if (y <= xs[0]) return ys[0];
    if (y >= xs[n - 1]) return ys[n - 1];
    let i = 1;
    while (xs[i] < y) i++;
    const x0 = xs[i - 1],
      x1 = xs[i],
      h = x1 - x0,
      t = (y - x0) / h,
      y0 = ys[i - 1],
      y1 = ys[i];
    if (mode === "linear") return y0 + (y1 - y0) * t;
    if (mode === "sine") return y0 + (y1 - y0) * sine(t);
    const t2 = t * t,
      t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * y0 +
      (t3 - 2 * t2 + t) * h * m[i - 1] +
      (-2 * t3 + 3 * t2) * y1 +
      (t3 - t2) * h * m[i]
    );
  };
}

// Cached style writes: only touch the DOM when a value actually changes.
const memo = new WeakMap();
function set(el, prop, value) {
  if (!el) return;
  let m = memo.get(el);
  if (!m) memo.set(el, (m = {}));
  if (m[prop] !== value) {
    m[prop] = value;
    el.style[prop] = value;
  }
}
const show = (el, on) => set(el, "visibility", on ? "visible" : "hidden");

// Image sequence with directional prefetch. Compressed frames stay in the HTTP cache;
// only a small window around the playhead is decoded ahead of time.
class Sequence {
  constructor(urls, onFrame) {
    this.urls = urls;
    this.n = urls.length;
    this.img = new Array(this.n);
    this.ok = new Uint8Array(this.n);
    this.onFrame = onFrame;
  }
  load(i) {
    if (i < 0 || i >= this.n || this.img[i]) return this.img[i];
    const im = new Image();
    im.decoding = "async";
    this.img[i] = im;
    im.onload = () => {
      this.ok[i] = 1;
      this.onFrame?.(this, i);
    };
    im.src = this.urls[i];
    return im;
  }
  first() {
    const im = this.load(0);
    return im.decode ? im.decode().catch(() => {}) : Promise.resolve();
  }
  prefetch(i, dir) {
    const ahead = dir < 0 ? -1 : 1;
    for (let d = 0; d < 18; d++) this.load(i + d * ahead);
    for (let d = 1; d < 5; d++) this.load(i - d * ahead);
    const next = this.img[i + 2 * ahead];
    if (next && this.ok[i + 2 * ahead] && next.decode) next.decode().catch(() => {});
  }
  loadAll() {
    for (let i = 0; i < this.n; i++) this.load(i);
  }
  nearest(i) {
    if (this.ok[i]) return this.img[i];
    for (let d = 1; d < this.n; d++) {
      if (this.ok[i - d]) return this.img[i - d];
      if (this.ok[i + d]) return this.img[i + d];
    }
    return null;
  }
}

// One canvas showing one frame of whichever sequence is active.
class Film {
  constructor(canvas, opaque) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: !opaque });
    this.drawn = null;
    this.want = null;
  }
  size(w, h) {
    const W = Math.max(1, Math.round(w)),
      H = Math.max(1, Math.round(h));
    if (this.canvas.width !== W || this.canvas.height !== H) {
      this.canvas.width = W;
      this.canvas.height = H;
      this.drawn = null;
    }
  }
  show(seq, i, dir) {
    i = clamp(Math.round(i), 0, seq.n - 1);
    seq.prefetch(i, dir);
    const im = seq.nearest(i);
    if (!im || this.drawn === im) return;
    this.drawn = im;
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(im, 0, 0, width, height);
  }
}

// ---------------------------------------------------------------- desktop curves
const D = {
  camZoom: track([
    [5760, 1],
    [6048, 0.893],
    [6336, 0.701],
    [6624, 0.564],
    [6912, 0.55],
  ]),
  camTx: track(
    [
      [6048, 0],
      [6336, -211],
      [6624, -500],
      [6912, -789],
      [7200, -1024],
    ],
  ),
  head: track([
    [5760, 0],
    [6048, -28],
    [6336, -79],
    [6624, -116],
    [6912, -120],
  ]),
  truckScale: track([
    [5760, 1],
    [6048, 0.905],
    [6336, 0.734],
    [6624, 0.612],
    [6912, 0.6],
  ]),
  truckLeftA: track([
    [5760, 291],
    [6048, 280],
    [6336, 259],
    [6624, 242],
    [6912, 181],
    [7200, 141],
  ]),
  truckLeftB: track(
    [
      [7200, 141],
      [9216, 313],
    ],
    "linear",
  ),
  descCx: null, // built lazily (depends on truckLeftB)
  descCy: track([
    [9150, 226.5],
    [9216, 239.5],
    [9504, 312.5],
    [9792, 358.5],
  ]),
  descS: track([
    [9150, 0.6],
    [9216, 0.6],
    [9504, 0.614],
    [9792, 0.622],
  ]),
  labelDrop: track([
    [9100, 0],
    [9216, 51],
    [9504, 211],
    [9792, 279],
  ]),
  labelFade: track([
    [9100, 1],
    [9216, 0.82],
    [9504, 0.245],
    [9792, 0],
  ]),
  flipDeg: track([
    [9100, 0],
    [9216, 21],
    [9504, 72],
    [9792, 90],
  ]),
  flipFade: track([
    [9100, 1],
    [9216, 0.77],
    [9504, 0.2],
    [9792, 0],
  ]),
  bandTop: track([
    [9150, 288.05],
    [9216, 272],
    [9504, 172],
    [9792, 144],
  ]),
  bandBottom: track([
    [9150, 760],
    [9216, 705],
    [9504, 605],
    [9792, 577],
  ]),
  ship: track([
    [12384, 1],
    [12600, 0.989],
    [12816, 0.969],
    [13032, 0.939],
    [13248, 0.898],
    [13464, 0.846],
    [13680, 0.781],
    [13896, 0.707],
    [14112, 0.624],
    [14328, 0.537],
    [14544, 0.45],
    [14760, 0.368],
    [14976, 0.294],
    [15192, 0.231],
    [15408, 0.18],
    [15624, 0.14],
    [15840, 0.111],
    [16056, 0.092],
    [16272, 0.082],
  ]),
  planeX: track([
    [16344, -1408],
    [16560, -1125],
    [16776, -219],
    [16992, 566],
    [17208, 1038],
    [17424, 1304],
    [17640, 1435],
    [17856, 1472],
  ]),
};
D.descCx = track([
  [9150, D.truckLeftB(9150) + 445 * 0.6],
  [9216, 580],
  [9504, 547],
  [9792, 531],
]);

// Mobile curves (reference 390×844)
const M = {
  crane: track(
    [
      [2250, 2304],
      [2560, 3197],
      [3000, 4320],
      [3250, 4896],
      [3600, 5688],
      [3680, 5760],
    ],
    "linear",
  ),
  camZ: track(
    [
      [3000, 0.58],
      [3250, 0.555],
      [3600, 0.416],
    ],
    "sine",
  ),
  camX: track(
    [
      [3000, 129],
      [3250, 339],
      [3600, 155],
    ],
    "sine",
  ),
  ship: track([
    [9576, 1],
    [9954, 0.983],
    [10332, 0.936],
    [10710, 0.859],
    [11088, 0.751],
    [11466, 0.614],
    [11844, 0.468],
    [12222, 0.351],
    [12600, 0.265],
    [12978, 0.208],
    [13356, 0.182],
    [13734, 0.167],
    [14112, 0.13],
    [14490, 0.11],
    [14868, 0.102],
    [15246, 0.1],
  ]),
};

// Wheel travel (truck-local px) as a pure function of Y, so reverse scrolling is exact.
// Reversing in from the right turns the wheels backwards; driving on turns them forwards.
const RAMP_A = 5900,
  RAMP_B = 6615,
  ENTRY_A = 4962,
  ENTRY_B = 5645;
function wheelTravel(Y) {
  if (Y <= ENTRY_A) return 0;
  const entry = -1.875 * (Math.min(Y, ENTRY_B) - ENTRY_A);
  if (Y <= RAMP_A) return entry;
  const r = Math.min(Y, RAMP_B) - RAMP_A;
  let d = entry + (0.9 * r * r) / (RAMP_B - RAMP_A);
  if (Y > RAMP_B) d += 1.8 * (Math.min(Y, 9792) - RAMP_B);
  return d;
}
function wheelSpeed(Y) {
  if (Y > ENTRY_A && Y < ENTRY_B) return -1.875;
  if (Y <= RAMP_A || Y >= 9792) return 0;
  return Y < RAMP_B ? (1.8 * (Y - RAMP_A)) / (RAMP_B - RAMP_A) : 1.8;
}

// Road turn after the overhead handover (map px, total length 679).
function roadPath(d) {
  if (d <= 63) return [267 + d, 238, 0];
  if (d <= 63 + 486.95) {
    const th = -Math.PI / 2 + (d - 63) / 310;
    return [330 + 310 * Math.cos(th), 548 + 310 * Math.sin(th), (th * 180) / Math.PI + 90];
  }
  return [640, 548 + (d - 549.95), 90];
}
// Horizontal offset of the road piece while the band zooms out (9792→10080). Keyed from the
// reference frames: seam at 1164 (9864), 790 (9936), 378 (10008); the curve follows.
const ROAD_RX = track([
  [9792, 900],
  [9864, 671],
  [9936, 264],
  [10008, 86],
  [10080, 0],
]);
const ROAD_SEAM = 250; // design x where the sliding road piece begins

export function createFreight(root, ocean, reduced) {
  const q = (s, r = root) => r.querySelector(s);
  const qa = (s, r = root) => [...r.querySelectorAll(s)];
  const el = {
    stage: q(".j-stage"),
    world: q(".j-world"),
    scene: q(".j-scene"),
    crane: q(".j-crane"),
    craneStatic: q(".j-crane-static"),
    craneFilm: q(".j-crane-film"),
    craneOut: q(".j-crane-out"),
    head: q(".j-crane-head"),
    mast: q(".j-crane-mast"),
    stack: q(".j-stack"),
    white: q(".j-cont-white"),
    label: q(".j-label"),
    panel: q(".j-panel"),
    laneA: q(".j-lane-a"),
    laneB: q(".j-lane-b"),
    rail: q(".j-rail"),
    railList: q(".j-rail-list"),
    cta: q(".j-cta"),
    road: q(".j-road"),
    truck: q(".j-truck"),
    side: q(".truck-side"),
    box: q(".truck-box"),
    wheels: qa(".wheel"),
    truckFilm: q(".truck-film"),
    top: q(".truck-top"),
    milestone: q(".j-milestone"),
    msLeft: q(".ms-left"),
    msList: q(".ms-list"),
    speed: q(".j-speed"),
    speedNum: q(".j-speed b"),
    mList: q(".m-list"),
    // ocean
    ocean,
    oStage: q(".o-stage", ocean),
    oClip: q(".o-clip", ocean),
    water: q(".o-water", ocean),
    ship: q(".o-ship", ocean),
    bob: q(".o-ship-bob", ocean),
    cloudL: q(".o-cloud-l", ocean),
    cloudR: q(".o-cloud-r", ocean),
    cloudB: q(".o-cloud-b", ocean),
    tint: q(".o-tint", ocean),
    overlap: q(".o-overlap", ocean),
    ovs: qa(".ov", ocean),
    plane: q(".o-plane", ocean),
    oContent: q(".o-content", ocean),
  };

  // Mobile list: reuse the desktop service and milestone items.
  const mLists = qa("ul", el.mList);
  if (mLists[0] && !mLists[0].children.length)
    for (const li of qa(".j-rail-list li")) mLists[0].append(li.cloneNode(true));
  const mMs = q(".m-ms", el.mList);
  if (mMs && !mMs.children.length) for (const li of qa(".ms-list li")) mMs.append(li.cloneNode(true));

  let dirty = true;
  const onFrame = () => (dirty = true);
  const seqs = {};
  const ready = fetch("sequences.json")
    .then((r) => r.json())
    .then((data) => {
      for (const k of ["lift", "rotate", "place", "overhead"]) seqs[k] = new Sequence(data[k], onFrame);
      return Promise.all([seqs.lift.first(), seqs.overhead.first(), el.craneStatic.decode?.().catch(() => {})]);
    })
    .catch(() => {});
  const craneFilm = new Film(el.craneFilm, true);
  const truckFilm = new Film(el.truckFilm, false);

  let water = null;
  try {
    water = createOcean(el.water, reduced);
  } catch {
    water = null;
  }

  // ------------------------------------------------------------ layout
  const L = {
    vw: innerWidth,
    vh: innerHeight,
    mobile: false,
    s: 1,
    k: 1,
    q: 1,
    ox: 0,
    oy: 0,
    right: 1280,
    left: 0,
    labelW: 2000,
    u: 1,
  };
  function fitLabel() {
    const ctx = document.createElement("canvas").getContext("2d");
    const family = getComputedStyle(el.label).fontFamily;
    ctx.font = `700 100px ${family}`;
    const mt = ctx.measureText("OUR SERVICES");
    const cap = mt.actualBoundingBoxAscent || 70;
    const fa = mt.fontBoundingBoxAscent || 95,
      fd = mt.fontBoundingBoxDescent || 25;
    const capH = L.mobile ? 140 : 205; // cap height of the reference's lettering
    const size = (capH / cap) * 100;
    const r = size / 100;
    const capTop = (size - (fa + fd) * r) / 2 + (fa - cap) * r; // within a line-height:1 box
    set(el.label, "fontSize", `${f2(size)}px`);
    L.labelCapTop = capTop;
    set(el.label, "top", `${f2(L.mobile ? 0 : 72 - capTop)}px`);
    L.labelW = el.label.offsetWidth || mt.width * r;
  }
  function resize(vw, vh, mobile) {
    Object.assign(L, { vw, vh, mobile });
    if (mobile) {
      L.s = vw / 390;
      L.k = vh / 844;
      L.ox = 0;
      L.oy = 0;
    } else {
      L.s = Math.min(vw / 1280, vh / 650);
      L.k = vh / 720;
      L.ox = (vw - 1280 * L.s) / 2;
      L.oy = vh - 720 * L.s;
    }
    L.q = L.k / L.s;
    L.left = -L.ox / L.s;
    L.right = (vw - L.ox) / L.s;
    L.u = vw / 1280;
    const dpr = Math.min(devicePixelRatio || 1, mobile ? 2 : 1.5);
    const cs = L.s * dpr * (mobile ? 0.6 : 1);
    craneFilm.size(1190 * cs, 670 * cs);
    truckFilm.size(930.7 * cs, 261.8 * cs);
    fitLabel();
    // ocean pieces sized in design px
    if (!mobile) {
      const u = L.u;
      set(el.cloudL, "width", `${f2(609 * u)}px`);
      set(el.cloudR, "width", `${f2(609 * u)}px`);
      set(el.cloudB, "width", `${f2(1350 * u)}px`);
      set(el.plane, "width", `${f2(1280 * u)}px`);
    }
    water?.resize();
    dirty = true;
  }

  // ------------------------------------------------------------ desktop journey
  let lastY = null,
    dir = 1,
    kmh = 0,
    shownKmh = -1;

  function placeTruck(cx, cy, sc, rot) {
    set(
      el.truck,
      "transform",
      `translate(${f2(cx - 445)}px,${f2(cy - 102.5)}px) rotate(${f2(rot)}deg) scale(${f2(sc * 1000) / 1000})`,
    );
  }
  function truckMode(mode) {
    show(el.side, mode === "side");
    show(el.box, mode === "side" && el._boxOn);
    for (const w of el.wheels) show(w, mode === "side");
    show(el.truckFilm, mode === "film");
    show(el.top, mode === "top");
  }
  function spinWheels(Y) {
    const a = wheelTravel(Y) / 28;
    const t = `rotate(${f2(a)}rad)`;
    for (const w of el.wheels) set(w, "transform", t);
  }

  function craneFrames(Yd) {
    // Static crane drives in, then the measured lift → rotate → place sequences.
    const filmOn = Yd >= 3197 && Yd < 5760 && seqs.lift;
    const LIFT_END = 4190;
    show(el.craneStatic, Yd < 3197 || !seqs.lift);
    set(el.craneStatic, "transform", `translateX(${f2(-306 * (1 - prog(Yd, 2304, 3197)))}px)`);
    show(el.white, Yd < 3197);
    show(el.craneFilm, filmOn);
    if (filmOn) {
      if (Yd < LIFT_END) {
        craneFilm.show(seqs.lift, 79 * prog(Yd, 3197, LIFT_END), dir);
        set(el.craneFilm, "transform", "none");
      } else if (Yd < 4896) {
        const p = prog(Yd, LIFT_END, 4896);
        craneFilm.show(seqs.rotate, 96 * p, dir);
        set(
          el.craneFilm,
          "transform",
          `translateY(${f2(9 * sine(p))}px) rotate(${f2(-2 * Math.sin(Math.PI * p))}deg)`,
        );
      } else {
        const p = prog(Yd, 4896, 5688),
          e = sine(prog(Yd, 4896, 5616));
        craneFilm.show(seqs.place, 48 * p, dir);
        set(el.craneFilm, "transform", `translateY(${f2(9 - 16 * e)}px) scale(${f2((1 - 0.1 * e) * 1000) / 1000})`);
      }
    }
    // stack slides out of frame as the crane turns
    const sp = sine(prog(Yd, 4273, 4896));
    show(el.stack, Yd < 5600);
    set(el.stack, "transform", `translateX(${f2(240 * sp)}px) scale(${f2((1 - 0.153 * sp) * 1000) / 1000})`);
    set(el.crane, "transform", `translateX(${f2(268 * prog(Yd, 4880, 5470))}px)`);
    // after the handover the spreader lifts clear on its mast
    const out = Yd >= 5760;
    show(el.craneOut, out);
    if (out) {
      const ty = D.head(Yd);
      set(el.head, "transform", `translateY(${f2(ty)}px)`);
      const top = 241.3 + 40 + ty;
      set(el.mast, "top", `${f2(top)}px`);
      set(el.mast, "height", `${f2(486 - top)}px`);
    }
  }

  function truckEarly(Yd) {
    // entry from the right and the side-on hold, in world px (camera zoom 1)
    const start = Math.max(1571, L.right + 8);
    const left = 291 + (start - 291) * (1 - prog(Yd, ENTRY_A, ENTRY_B));
    return [left + 445, 449 + 102.5, 1];
  }

  function desktop(Yraw, Yflow = Yraw) {
    const Y = Math.min(Yraw, 11548);
    set(el.world, "transform", `translate(${f2(L.ox)}px,${f2(L.oy)}px) scale(${L.s})`);

    // camera
    const z = D.camZoom(Y);
    let tx = D.camTx(Y);
    if (Y > 7200) tx = -1024 - (Y - 7200) * 0.82;
    const landTop = -158 + 811 * z;
    const sceneOn = Y < 7600;
    show(el.scene, sceneOn);
    if (sceneOn) {
      set(el.scene, "transform", `translate(${f2(-65 * (1 - z) + tx)}px,${f2(-158 * (1 - z))}px) scale(${f2(z * 10000) / 10000})`);
      craneFrames(Y);
    }

    // truck
    const truckOn = Y >= ENTRY_A;
    show(el.truck, truckOn);
    el._boxOn = Y >= 5760;
    if (truckOn && Y < 9792) {
      let cx, cy, sc;
      if (Y < 5760) [cx, cy, sc] = truckEarly(Y);
      else if (Y < 9150) {
        sc = D.truckScale(Y);
        const left = Y <= 7200 ? D.truckLeftA(Y) : D.truckLeftB(Y);
        cx = left + 445 * sc;
        cy = landTop - 204.5 * sc + 102.5 * sc;
      } else {
        cx = D.descCx(Y);
        cy = D.descCy(Y);
        sc = D.descS(Y);
      }
      placeTruck(cx, cy, sc, 0);
      if (Y < 9216) {
        truckMode("side");
        spinWheels(Y);
      } else {
        truckMode("film");
        if (seqs.overhead) truckFilm.show(seqs.overhead, 44 * prog(Y, 9216, 9720), dir);
      }
    }

    // big label
    const labelOn = Y >= 6615 && Y < 9792;
    show(el.label, labelOn);
    if (labelOn) {
      const x = lerp(Math.max(1280, L.right), -L.labelW, prog(Y, 6615, 9792));
      set(el.label, "transform", `translate(${f2(x)}px,${f2(D.labelDrop(Y))}px)`);
      set(el.label, "opacity", String(f2(D.labelFade(Y))));
    }

    // dark band (land → services panel → road band)
    const panelOn = Y >= 5700 && Y < 10080;
    const Zr = 2.405 - 1.405 * sine(prog(Y, 9864, 10080));
    show(el.panel, panelOn);
    if (panelOn) {
      const top = Y < 9150 ? landTop : Y < 9792 ? D.bandTop(Y) : 145;
      const bottom =
        Y < 9150 ? Math.max(760, (L.vh - L.oy) / L.s + 40) : Y < 9792 ? D.bandBottom(Y) : 145 + 180 * Zr;
      set(el.panel, "top", `${f2(top)}px`);
      set(el.panel, "height", `${f2(bottom - top)}px`);
      // While the road piece slides in, the straight band ends at its seam (panel left is -3000).
      const seam = Y >= 9792 ? 77 + ROAD_RX(Y) + Zr * (ROAD_SEAM - 77) : null;
      set(el.panel, "clipPath", seam === null ? "none" : `inset(0 ${f2(4280 - seam)}px 0 0)`);
      const lanes = prog(Y, 9150, 9420);
      const h = bottom - top;
      const shift = `${f2((-wheelTravel(Math.min(Y, 9792)) * 0.6) % 203)}px 0`;
      for (const [lane, f] of [
        [el.laneA, 0.305],
        [el.laneB, 0.684],
      ]) {
        set(lane, "opacity", String(f2(lanes)));
        set(lane, "top", `${f2(h * f - 5)}px`);
        set(lane, "backgroundPosition", shift);
      }
      const railOn = Y >= 6615 && Y < 9792;
      show(el.rail, railOn);
      if (railOn) {
        const x = lerp(Math.max(1280, L.right), -3563, prog(Y, 6615, 9677));
        set(el.rail, "transform", `translateX(${f2(x)}px)`);
        const flip = `perspective(900px) rotateX(${f2(D.flipDeg(Y))}deg)`;
        set(el.railList, "transform", flip);
        set(el.railList, "opacity", String(f2(D.flipFade(Y))));
      }
    }
    const ctaOn = Y >= 6600 && Y < 9792;
    show(el.cta, ctaOn);
    if (ctaOn) {
      const top = (Y < 9150 ? landTop : D.bandTop(Y)) + 343;
      set(el.cta, "top", `${f2(top)}px`);
      set(el.cta, "transform", `perspective(900px) rotateX(${f2(D.flipDeg(Y))}deg)`);
      set(el.cta, "opacity", String(f2(prog(Y, 6600, 6900) * D.flipFade(Y))));
    }

    // road, turn and milestone screen
    const roadOn = Y >= 9792;
    show(el.road, roadOn);
    show(el.milestone, roadOn);
    if (roadOn) {
      const rx = Y < 10080 ? ROAD_RX(Y) : 0;
      const off = Y < 10080 ? 0 : Y < 10368 ? (-205 * (Y - 10080)) / 288 : -(205 + (Y - 10368) * L.q);
      set(el.road, "transform", `translate(${f2(rx)}px,${f2(off)}px) scale(${f2(Zr * 10000) / 10000})`);
      set(el.road, "clipPath", Y < 10080 ? `inset(0 0 0 ${ROAD_SEAM + 1000}px)` : "none");
      let cx, cy, sc, rot;
      if (Y < 10080) {
        const a = (Zr - 1) / 1.405;
        cx = 77 + 190 * Zr - 2.95 * a;
        cy = 145 + 93 * Zr - 10.17 * a;
        sc = 0.2377 + 0.3843 * a;
        rot = 0;
      } else if (Y < 10368) {
        const p = prog(Y, 10080, 10368);
        const [px, py, r] = roadPath(679 * sine(p));
        cx = px;
        cy = py + off;
        sc = lerp(0.2377, 0.266, p);
        rot = r;
      } else {
        const p = sine(prog(Y, 10656, 11232));
        cx = lerp(640, 639, p);
        cy = lerp(472, 374, p);
        sc = 0.266;
        rot = 90;
      }
      placeTruck(cx, cy, sc, rot);
      truckMode("top");
      const Yf = Math.min(Yflow, 11548);
      const titleTop = Math.max(118, 520 - (Yf - 10368) * L.q);
      set(el.msLeft, "transform", `translateY(${f2(titleTop)}px)`);
      set(el.msList, "transform", `translateY(${f2(-26 - (Yf - 11232) * L.q)}px)`);
    }

    // speed readout
    const speedOn = Y >= 5700;
    show(el.speed, speedOn);
  }

  // ------------------------------------------------------------ mobile journey
  function mobile(Ym, Yflow = Ym) {
    const Y = Math.min(Ym, 8610);
    const s = L.s;
    let z, Mx;
    if (Y < 3680) {
      z = M.camZ(Y);
      Mx = M.camX(Y);
    } else {
      z = 0.416;
      Mx = 155;
    }
    const wx = (sx) => 640 + (sx - Mx) / z;
    const wy = (sy) => 653 + (sy - 341) / z;
    set(el.world, "transform", `translate(${f2(s * (Mx - z * 640))}px,${f2(s * (341 - z * 653))}px) scale(${f2(s * z * 10000) / 10000})`);
    set(el.scene, "transform", "none");
    const sceneOn = Y < 4300;
    show(el.scene, sceneOn);
    const Yd = Y < 3680 ? M.crane(Y) : Math.min(6912, 5760 + (Y - 3680) * 2.74);
    if (sceneOn) craneFrames(Yd);

    // label rides the dark ground
    const labelX = -(Y - 2250);
    const labelOn = Y > 2000 && labelX > -L.labelW;
    show(el.label, labelOn);
    if (labelOn) {
      set(el.label, "opacity", "1");
      set(
        el.label,
        "transform",
        `translate(${f2(wx(labelX))}px,${f2(wy(593) - L.labelCapTop / z)}px) scale(${f2((1 / z) * 1000) / 1000})`,
      );
    }

    // dark panel rises over the crane
    const pTop = lerp(341, -10, sine(prog(Y, 3700, 4200)));
    show(el.panel, Y >= 3600);
    set(el.panel, "top", `${f2(wy(pTop))}px`);
    set(el.panel, "height", `${f2((L.vh / s - pTop) / z + 60)}px`);
    show(el.rail, false);

    // truck
    const md = Math.min(Yd, 5760);
    const truckOn = md >= ENTRY_A;
    show(el.truck, truckOn);
    el._boxOn = md >= 5760;
    if (truckOn) {
      let cx, cy, sc, rot = 0;
      const [ex, ey] = truckEarly(md);
      if (Y < 4100) {
        cx = ex;
        cy = ey;
        sc = 1;
      } else {
        // screen-space move into the left column, then the final park before the sea
        const startX = Mx + z * (ex - 640),
          startY = 341 + z * (ey - 653);
        const p = sine(prog(Y, 4100, 4350)),
          p2 = sine(prog(Y, 7938, 8442));
        let sx = lerp(startX, 53, p),
          sy = lerp(startY, 262, p),
          ss = lerp(z, 0.363, p);
        sx = lerp(sx, 195, p2);
        sy = lerp(sy, 420, p2);
        ss = lerp(ss, 0.2, p2);
        cx = wx(sx);
        cy = wy(sy);
        sc = ss / z;
        rot = 90 * p;
      }
      placeTruck(cx, cy, sc, rot);
      if (Y < 3950) {
        truckMode("side");
        spinWheels(md);
      } else if (Y < 4200) {
        truckMode("film");
        if (seqs.overhead) truckFilm.show(seqs.overhead, 44 * prog(Y, 3950, 4200), dir);
      } else truckMode("top");
    }

    // services list scrolls up beside the parked truck
    const listOn = Y >= 4100 || Yflow >= 4100;
    show(el.mList, listOn);
    if (listOn) set(el.mList, "transform", `translateY(${f2(L.vh - (Math.min(Yflow, 8610) - 4070) * L.k)}px)`);
    for (const x of [el.cta, el.road, el.milestone, el.speed]) show(x, false);
  }

  // ------------------------------------------------------------ ocean
  let waterOn = false;
  function oceanDesktop(Y, t) {
    const on = Y >= 11548 - 10 && Y < 18000;
    if (!on) {
      waterOn = false;
      return;
    }
    const u = L.u,
      vw = L.vw,
      vh = L.vh;
    const parent = 1 - 0.1 * sine(prog(Y, 15768, 16488));
    const sc = D.ship(Y) * parent;
    const bob = reduced ? 0 : Math.sin(t / 1400) * 25 * u * sc;
    set(el.ship, "transform", `scale(${f2(sc * 10000) / 10000})`);
    set(el.bob, "transform", `translateY(${f2(bob / Math.max(sc, 0.05))}px)`);

    // clouds drifting under the camera as it climbs
    const c = prog(Y, 14400, 15048);
    const cloud = (img, x0, x1, y0, y1, top, op0, op1) => {
      const on = Y >= 14000 && Y < 15100;
      show(img, on);
      if (!on) return;
      const w = 609 * u;
      set(
        img,
        "transform",
        `translate(${f2(lerp(x0, x1, c) * u)}px,${f2((top + lerp(y0, y1, c)) * u)}px) scale(${f2(lerp(0.8, 0.6, c))})`,
      );
      set(img, "opacity", String(f2(lerp(op0, op1, c))));
      return w;
    };
    cloud(el.cloudL, -640, 256, 0, 30, 34, 0.3, 0);
    cloud(el.cloudR, 1280, 640, 150, 120, 529 - 150, 1, 0);
    const b = prog(Y, 14472, 15912);
    const bOn = Y >= 14472 && Y < 15912;
    show(el.cloudB, bOn);
    if (bOn) {
      const op = Y < 15048 ? 0.3 * prog(Y, 14472, 15048) : 0.3 * (1 - prog(Y, 15048, 15912));
      set(el.cloudB, "transform", `translate(${f2(225 * u)}px,${f2(131 * u)}px) scale(${f2(lerp(0.7, 2, b))})`);
      set(el.cloudB, "opacity", String(f2(op)));
    }

    // haze, then the cloud deck the aircraft flies over
    const haze = prog(Y, 15768, 16488);
    set(el.tint, "opacity", String(f2(haze)));
    const ovOn = Y >= 15768;
    show(el.overlap, ovOn);
    if (ovOn) {
      set(el.overlap, "opacity", String(f2(haze)));
      const g = sine(prog(Y, 16560, 17000));
      set(el.overlap, "transform", `translateY(${f2(-396 * g * u)}px) scale(${f2(lerp(0.939, 0.8, g))})`);
      const o = prog(Y, 15912, 16776);
      const e = 1 - Math.pow(1 - o, 3);
      el.ovs.forEach((img, i) => {
        set(img, "transform", `scale(${f2(lerp(8, 1, e) * (1 + i * 0.02))})`);
        set(img, "opacity", String(f2(o)));
      });
    }

    // aircraft and the white reveal behind it
    const planeOn = Y >= 16344 && Y < 17900;
    show(el.plane, planeOn);
    let cut = 0;
    if (planeOn || Y >= 17900) {
      const x = D.planeX(Math.min(Y, 17856));
      const ps = lerp(1, 1.3, prog(Y, 16344, 17856));
      const ph = 1280 * u * (2211 / 2221);
      set(el.plane, "transform", `translate(${f2(x * u)}px,${f2(vh / 2 - ph / 2 - 10 * u)}px) scale(${f2(ps * 1000) / 1000})`);
      // boundary sits under the wing root (just behind the plane's centre)
      cut = (x + 640 - 1280 * ps * 0.02) * u;
      cut = clamp(cut, 0, vw);
      if (Y >= 17856) cut = vw;
    }
    const clip = cut > 0 ? `inset(0 0 0 ${f2(cut)}px)` : "none";
    set(el.oClip, "clipPath", clip);
    set(el.oContent, "clipPath", cut > 0 ? `inset(-100vh 0 -100vh ${f2(cut)}px)` : "none");
    waterOn = cut < vw;
    if (waterOn && water) water.render(t, sc, vw / 2, vh / 2 + bob, 0.282 * vw * sc, reduced ? 0 : (t / 1000) * 0.03);
  }

  function oceanMobile(Ym, t) {
    const on = Ym >= 8610 - 10;
    if (!on) {
      waterOn = false;
      return;
    }
    const parent = 1 - 0.1 * sine(prog(Ym, 12100, 14868));
    const sc = M.ship(Ym) * parent;
    const bob = reduced ? 0 : Math.sin(t / 1400) * 25 * L.s * sc;
    set(el.ship, "transform", `scale(${f2(sc * 10000) / 10000})`);
    set(el.bob, "transform", `translateY(${f2(bob / Math.max(sc, 0.05))}px)`);
    set(el.tint, "opacity", String(f2(prog(Ym, 9576, 10710))));
    set(el.oClip, "clipPath", "none");
    set(el.oContent, "clipPath", "none");
    waterOn = Ym < 16400;
    if (waterOn && water)
      water.render(t, sc, L.vw / 2, L.vh / 2 + bob, 0.733 * L.vw * sc, reduced ? 0 : (t / 1000) * 0.03);
  }

  // ------------------------------------------------------------ public API
  let lastKm = 0;
  return {
    ready,
    resize,
    preloadAll() {
      for (const k in seqs) seqs[k].loadAll();
      // Hidden layers are not decoded until shown; decode them up front to avoid blank first frames.
      for (const img of [...root.querySelectorAll("img"), ...ocean.querySelectorAll("img")]) {
        if (img.decode) img.decode().catch(() => {});
      }
    },
    // jy: scroll offset from the journey's top (CSS px); t: time ms; dt: frame ms
    render(jy, t, dt, inJourney, inOcean) {
      const Y = L.mobile ? jy / L.k + 2494 : jy / L.k + 2544;
      if (lastY !== null && Y !== lastY) dir = Y > lastY ? 1 : -1;
      const v = lastY === null || dt <= 0 ? 0 : (Y - lastY) / (dt / 1000);
      lastY = Y;
      const Ys = reduced ? snap(Y, L.mobile ? SNAP_M : SNAP_D) : Y;
      if (inJourney) {
        if (L.mobile) mobile(Ys, Y);
        else desktop(Ys, Y);
        if (!L.mobile) {
          const target = Math.min(140, Math.abs(v * wheelSpeed(Math.min(Y, 9791))) * 0.04);
          kmh += (target - kmh) * Math.min(1, dt / 160);
          const shown = Math.round(kmh);
          if (shown !== lastKm) {
            lastKm = shown;
            el.speedNum.textContent = String(shown).padStart(2, "0");
          }
        }
      }
      if (inOcean) {
        if (L.mobile) oceanMobile(Ys, t);
        else oceanDesktop(Ys, t);
      }
      dirty = false;
    },
    get dirty() {
      return dirty;
    },
    get waterActive() {
      return waterOn;
    },
  };
}
