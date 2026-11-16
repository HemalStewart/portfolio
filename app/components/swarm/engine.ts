import type { Member } from "./crew";

/*
 * The swarm. Every element marked `data-b` is a build step; when it scrolls
 * into view it joins a queue, and the nearest free cursor flies over and
 * makes it: drags a frame open while the piece fills in inside it, types a
 * heading behind a caret, carries a note in and drops it, traces an arrow.
 *
 *   data-b      frame | type | words | pop | drop | draw | rows
 *   data-name   the layer's name, shown in the panels
 *   data-by     the crew member who should do it, if they are free
 *   data-w      wave: inside one `data-scene`, lower waves are built first
 *   data-row    a row of a `rows` step
 *   data-act    something a resting cursor may click (fires `swarm:act`)
 *   data-pick   something a resting cursor may select (with `data-name`)
 *   data-gather resting cursors collect around this while it is on screen
 *
 * Positions are read from the live layout on every frame, so pinned and
 * panning sections stay under their cursors. Hidden states live in swarm.css
 * behind `html[data-motion]`; a step that waits too long is simply shown.
 */

type Kind = "frame" | "type" | "words" | "pop" | "drop" | "draw" | "rows";
type Pt = { x: number; y: number };
type Geo = { w: number; h: number; rot: number };
type Alive = () => boolean;

type Cursor = {
  i: number;
  el: HTMLElement;
  m: Member;
  x: number;
  y: number;
  busy: boolean;
  token: number;
  idleAt: number;
  nextRoam: number;
  herding: boolean;
  sel: HTMLElement | null;
};

type Task = {
  el: HTMLElement;
  kind: Kind;
  name: string;
  wave: number;
  scene: Element | null;
  order: number;
  state: "idle" | "queued" | "running" | "done";
  queuedAt: number;
  startedAt: number;
  geo?: Geo;
  ghost?: HTMLElement;
};

export type SwarmEvent = {
  type: "start" | "done";
  el: HTMLElement;
  kind: Kind;
  name: string;
  who?: Member;
};
export type SwarmRect = { x: number; y: number; w: number; h: number };

const KINDS = ["frame", "type", "words", "pop", "drop", "draw", "rows"];
const TOOL: Record<Kind, string> = {
  frame: "frame",
  type: "text",
  words: "text",
  pop: "move",
  drop: "note",
  draw: "arrow",
  rows: "move",
};
const NAME: Record<Kind, string> = {
  frame: "Frame",
  type: "Text",
  words: "Text",
  pop: "Layer",
  drop: "Note",
  draw: "Arrow",
  rows: "List",
};

/** A step never waits longer than this for a cursor. */
const MAX_WAIT = 3200;
const BASE_SPEED = 1.1;
/** How long a wave has to be under way before the next one may start. */
const WAVE_GAP = 400;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const ease = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

export function startSwarm(layer: HTMLElement, crew: Member[]) {
  const html = document.documentElement;
  const main = document.querySelector("main") ?? document.body;
  const tasks = new Map<Element, Task>();
  const queue: Task[] = [];
  const ghosts = new Set<Task>();
  const tweens = new Set<(t: number) => boolean>();
  const timers = new Set<number>();
  let raf = 0;
  let speed = BASE_SPEED;
  let dead = false;
  let inspecting = 0;
  let focus: Task | null = null;

  const sx = () => window.scrollX;
  const sy = () => window.scrollY;

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      if (!dead) fn();
    }, ms);
    timers.add(id);
  };

  /* ------------------------------------------------------------- tweens */

  const tick = (t: number) => {
    raf = 0;
    for (const fn of tweens) if (fn(t)) tweens.delete(fn);
    for (const task of ghosts) placeGhost(task);
    if (tweens.size || ghosts.size) raf = requestAnimationFrame(tick);
  };
  const kick = () => {
    if (!raf && !dead) raf = requestAnimationFrame(tick);
  };
  const tween = (ms: number, step: (p: number) => void, alive: Alive) =>
    new Promise<void>((resolve) => {
      let start = 0;
      tweens.add((t) => {
        if (!start) start = t;
        if (dead || !alive()) {
          resolve();
          return true;
        }
        const p = ms <= 0 ? 1 : Math.min(1, (t - start) / ms);
        step(p);
        if (p < 1) return false;
        resolve();
        return true;
      });
      kick();
    });

  /* ----------------------------------------------------------- geometry */

  const geo = (el: HTMLElement): Geo => {
    const r = el.getBoundingClientRect();
    const rot = parseFloat(getComputedStyle(el).rotate) || 0;
    return {
      w: el.offsetWidth || r.width,
      h: el.offsetHeight || r.height,
      rot: (rot * Math.PI) / 180,
    };
  };
  const centre = (el: Element): Pt => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 + sx(), y: r.top + r.height / 2 + sy() };
  };
  /** A point in the element's own box (0…w, 0…h), in page coordinates. */
  const at = (el: Element, g: Geo, lx: number, ly: number): Pt => {
    const c = centre(el);
    const dx = lx - g.w / 2;
    const dy = ly - g.h / 2;
    const cos = Math.cos(g.rot);
    const sin = Math.sin(g.rot);
    return { x: c.x + dx * cos - dy * sin, y: c.y + dx * sin + dy * cos };
  };
  const view = () => {
    const r = main.getBoundingClientRect();
    return {
      l: r.left + sx(),
      r: r.right + sx(),
      t: sy() + 76,
      b: sy() + window.innerHeight - 84,
    };
  };

  /* ------------------------------------------------------------ cursors */

  const cursors: Cursor[] = Array.from(
    layer.querySelectorAll<HTMLElement>(".sw-cur"),
  )
    .filter((el) => getComputedStyle(el).display !== "none")
    .map((el, i) => ({
      i,
      el,
      m: crew[i],
      x: 0,
      y: 0,
      busy: false,
      token: 0,
      idleAt: 0,
      nextRoam: rand(600, 2400),
      herding: false,
      sel: null,
    }));

  const place = (c: Cursor, x: number, y: number) => {
    c.x = x;
    c.y = y;
    c.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
  };
  const mode = (c: Cursor, name: "arrow" | "cross" | "text") => {
    if (c.el.dataset.mode !== name) c.el.dataset.mode = name;
  };
  const click = (c: Cursor) => {
    c.el.dataset.click = c.el.dataset.click === "a" ? "b" : "a";
  };
  const clearSel = (c: Cursor) => {
    c.sel?.remove();
    c.sel = null;
  };

  /** Fly along a slight arc to a target that may itself be moving. */
  const fly = (c: Cursor, target: () => Pt, alive: Alive, ms?: number) => {
    const from = { x: c.x, y: c.y };
    const first = target();
    const dist = Math.hypot(first.x - from.x, first.y - from.y);
    const bow = clamp(dist * 0.16, 0, 64) * (c.i % 2 ? 1 : -1);
    const dur = (ms ?? clamp(dist * 0.42, 150, 430)) / speed;
    return tween(
      dur,
      (p) => {
        const e = ease(p);
        const u = 1 - e;
        const to = target();
        const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
        const mx = (from.x + to.x) / 2 - ((to.y - from.y) / len) * bow;
        const my = (from.y + to.y) / 2 + ((to.x - from.x) / len) * bow;
        place(
          c,
          u * u * from.x + 2 * u * e * mx + e * e * to.x,
          u * u * from.y + 2 * u * e * my + e * e * to.y,
        );
      },
      alive,
    );
  };

  /* ------------------------------------------- selection boxes & ghosts */

  const boxAt = (box: HTMLElement, el: Element, g: Geo, p: number) => {
    const c = centre(el);
    box.style.transform = `translate3d(${(c.x - g.w / 2).toFixed(1)}px,${(c.y - g.h / 2).toFixed(1)}px,0) rotate(${g.rot}rad)`;
    box.style.width = `${(g.w * p).toFixed(1)}px`;
    box.style.height = `${(g.h * p).toFixed(1)}px`;
  };
  const makeSel = (c: Cursor, g: Geo, label?: string) => {
    const sel = document.createElement("div");
    sel.className = "sw-sel";
    sel.style.setProperty("--who", c.m.color);
    sel.style.transformOrigin = `${g.w / 2}px ${g.h / 2}px`;
    sel.innerHTML = "<i></i><i></i><i></i><i></i><b></b><em></em>";
    if (c.m.dark) sel.dataset.dark = "";
    if (label) sel.lastElementChild!.textContent = label;
    layer.appendChild(sel);
    return sel;
  };
  const sizeOf = (sel: HTMLElement, g: Geo, p: number) => {
    sel.children[4].textContent = `${Math.round(g.w * p)} × ${Math.round(g.h * p)}`;
  };

  const placeGhost = (task: Task) => {
    if (task.ghost && task.geo) boxAt(task.ghost, task.el, task.geo, 1);
  };
  const makeGhost = (task: Task) => {
    if (task.kind !== "frame" && task.kind !== "drop") return;
    task.geo = geo(task.el);
    const ghost = document.createElement("div");
    ghost.className = "sw-ghost";
    ghost.style.transformOrigin = `${task.geo.w / 2}px ${task.geo.h / 2}px`;
    layer.appendChild(ghost);
    task.ghost = ghost;
    ghosts.add(task);
    placeGhost(task);
    kick();
  };
  const dropGhost = (task: Task) => {
    task.ghost?.remove();
    task.ghost = undefined;
    ghosts.delete(task);
  };

  /* ------------------------------------------------------------- events */

  const emit = (type: SwarmEvent["type"], task: Task, c?: Cursor) => {
    const detail: SwarmEvent = {
      type,
      el: task.el,
      kind: task.kind,
      name: task.name,
      who: c?.m,
    };
    window.dispatchEvent(new CustomEvent("swarm", { detail }));
  };
  const emitRect = (task: Task, el: Element, g: Geo, p: number) => {
    if (focus !== task) return;
    const c = centre(el);
    const detail: SwarmRect = {
      x: Math.round(c.x - g.w / 2),
      y: Math.round(c.y - g.h / 2),
      w: Math.round(g.w * p),
      h: Math.round(g.h * p),
    };
    window.dispatchEvent(new CustomEvent("swarm:rect", { detail }));
  };

  /* ------------------------------------------------------------ actions */

  const rowsOf = (el: HTMLElement) =>
    Array.from(el.querySelectorAll<HTMLElement>("[data-row]"));

  const typing = async (
    task: Task,
    c: Cursor,
    alive: Alive,
    unit: string,
    per: number,
    cap: number,
  ) => {
    const el = task.el;
    const units = Array.from(el.querySelectorAll<HTMLElement>(unit));
    if (!units.length) return;
    await fly(
      c,
      () => {
        const r = units[0].getBoundingClientRect();
        return { x: r.left + sx() - 2, y: r.top + sy() + r.height * 0.55 };
      },
      alive,
    );
    if (!alive()) return;
    mode(c, "text");
    const caret = document.createElement("div");
    caret.className = "sw-caret";
    caret.style.setProperty("--who", c.m.color);
    layer.appendChild(caret);
    el.dataset.building = "";
    const n = units.length;
    let shown = -1;
    await tween(
      clamp(n * per, 220, cap) / speed,
      (p) => {
        const k = Math.min(n, Math.round(p * n));
        if (k !== shown) {
          shown = k;
          el.style.setProperty("--n", String(k));
        }
        const r = units[Math.max(0, k - 1)].getBoundingClientRect();
        const x = (k ? r.right : r.left) + sx();
        const y = r.top + sy();
        caret.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
        caret.style.height = `${r.height.toFixed(1)}px`;
        place(c, x + 4, y + r.height * 0.55);
      },
      alive,
    );
    caret.dataset.done = "";
    later(() => caret.remove(), 650);
  };

  const ACTIONS: Record<
    Kind,
    (task: Task, c: Cursor, alive: Alive) => Promise<void>
  > = {
    /* Press on the top-left corner and drag the frame open; the piece fills
       in inside the selection as it grows. */
    async frame(task, c, alive) {
      const el = task.el;
      const g = task.geo ?? geo(el);
      await fly(c, () => at(el, g, 0, 0), alive);
      if (!alive()) return;
      dropGhost(task);
      mode(c, "cross");
      click(c);
      focus = task;
      const sel = makeSel(c, g);
      el.style.clipPath = "inset(0 100% 100% 0)";
      el.dataset.building = "";
      await tween(
        clamp(Math.hypot(g.w, g.h) * 0.5, 240, 520) / speed,
        (p) => {
          const e = ease(p);
          const cut = ((1 - e) * 100).toFixed(2);
          el.style.clipPath = `inset(0 ${cut}% ${cut}% 0)`;
          boxAt(sel, el, g, e);
          sizeOf(sel, g, e);
          emitRect(task, el, g, e);
          const q = at(el, g, g.w * e, g.h * e);
          place(c, q.x, q.y);
        },
        alive,
      );
      if (!alive()) {
        sel.remove();
        return;
      }
      sel.dataset.done = "";
      later(() => sel.remove(), 620);
    },

    type: (task, c, alive) => typing(task, c, alive, ".tc", 30, 880),
    words: (task, c, alive) => typing(task, c, alive, ".tw", 24, 640),

    /* Click, and it is there. */
    async pop(task, c, alive) {
      await fly(c, () => centre(task.el), alive);
      if (alive()) click(c);
    },

    /* Carry it in from off to one side and let go. */
    async drop(task, c, alive) {
      const el = task.el;
      const g = task.geo ?? geo(el);
      ghosts.delete(task);
      const dx = (c.i % 2 ? 1 : -1) * rand(90, 170);
      const dy = -rand(60, 130);
      el.style.translate = `${dx.toFixed(0)}px ${dy.toFixed(0)}px`;
      const grab = () => at(el, g, g.w * 0.62, g.h * 0.42);
      await fly(c, grab, alive);
      if (!alive()) return;
      click(c);
      el.dataset.building = "";
      await tween(
        clamp(Math.hypot(dx, dy) * 2.2, 260, 440) / speed,
        (p) => {
          const e = ease(p);
          el.style.translate = `${(dx * (1 - e)).toFixed(1)}px ${(dy * (1 - e)).toFixed(1)}px`;
          const q = grab();
          place(c, q.x, q.y);
        },
        alive,
      );
    },

    /* Trace the stroke: the line follows the cursor's tip. */
    async draw(task, c, alive) {
      const el = task.el;
      const line =
        el.querySelector<SVGPathElement>(".ar-line") ??
        el.querySelector<SVGPathElement>("path");
      if (!line) return;
      const head = el.querySelector<SVGPathElement>(".ar-head");
      const total = line.getTotalLength();
      const on = (length: number): Pt => {
        const p = line.getPointAtLength(length);
        const m = line.getScreenCTM();
        if (!m) return { x: c.x, y: c.y };
        return {
          x: p.x * m.a + p.y * m.c + m.e + sx(),
          y: p.x * m.b + p.y * m.d + m.f + sy(),
        };
      };
      await fly(c, () => on(0), alive);
      if (!alive()) return;
      click(c);
      line.style.strokeDashoffset = "1";
      if (head) head.style.strokeDashoffset = "1";
      el.dataset.building = "";
      const a = on(0);
      const b = on(total);
      await tween(
        clamp(Math.hypot(b.x - a.x, b.y - a.y) * 2.6, 240, 500) / speed,
        (p) => {
          const e = ease(p);
          line.style.strokeDashoffset = (1 - e).toFixed(3);
          const q = on(total * e);
          place(c, q.x, q.y);
        },
        alive,
      );
      if (head && alive())
        await tween(
          110 / speed,
          (p) => {
            head.style.strokeDashoffset = (1 - p).toFixed(3);
          },
          alive,
        );
    },

    /* Run down a list, ticking each row in. */
    async rows(task, c, alive) {
      const rows = rowsOf(task.el);
      task.el.dataset.building = "";
      for (let i = 0; i < rows.length; i++) {
        if (!alive()) return;
        const row = rows[i];
        await fly(
          c,
          () => {
            const r = row.getBoundingClientRect();
            return {
              x: r.left + sx() + Math.min(26, r.width * 0.08),
              y: r.top + sy() + r.height / 2,
            };
          },
          alive,
          i ? 72 : undefined,
        );
        row.dataset.built = "";
        click(c);
      }
    },
  };

  /* -------------------------------------------------------------- queue */

  const finish = (task: Task) => {
    if (task.state === "done") return;
    const i = queue.indexOf(task);
    if (i >= 0) queue.splice(i, 1);
    task.state = "done";
    dropGhost(task);
    const el = task.el;
    el.style.clipPath = "";
    el.style.translate = "";
    el.style.removeProperty("--n");
    delete el.dataset.building;
    el.dataset.built = "";
    if (task.kind === "rows")
      rowsOf(el).forEach((row) => (row.dataset.built = ""));
    if (task.kind === "draw")
      el.querySelectorAll<SVGPathElement>("path").forEach((path) => {
        path.style.strokeDashoffset = "";
      });
    if (focus === task) focus = null;
    io.unobserve(el);
  };

  const run = async (task: Task, c: Cursor) => {
    task.state = "running";
    task.startedAt = performance.now();
    c.busy = true;
    c.herding = false;
    c.token++;
    c.el.dataset.busy = "";
    clearSel(c);
    html.dataset.tool = TOOL[task.kind];
    emit("start", task, c);
    const alive = () => task.state === "running";
    try {
      await ACTIONS[task.kind](task, c, alive);
    } catch {
      /* a step that fails is simply shown */
    }
    finish(task);
    emit("done", task, c);
    mode(c, "arrow");
    c.busy = false;
    c.idleAt = performance.now();
    c.nextRoam = rand(900, 3400);
    delete c.el.dataset.busy;
    pump();
  };

  /** Inside a scene, a wave waits for the waves before it to get going. */
  const eligible = (task: Task, now: number) => {
    if (!task.scene || !task.wave) return true;
    for (const other of tasks.values()) {
      if (other.scene !== task.scene || other.wave >= task.wave) continue;
      if (other.state === "queued") return false;
      if (other.state === "running" && now - other.startedAt < WAVE_GAP / speed)
        return false;
    }
    return true;
  };

  const pick = (task: Task, r: DOMRect) => {
    const by = task.el.dataset.by;
    const tx = r.left + sx();
    const ty = r.top + sy();
    let best: Cursor | null = null;
    let bestD = Infinity;
    for (const c of cursors) {
      if (c.busy) continue;
      let d = Math.hypot(c.x - tx, c.y - ty);
      if (by && c.m.id === by) d -= 1e6;
      if (d < bestD) {
        best = c;
        bestD = d;
      }
    }
    return best;
  };

  const pump = () => {
    if (dead) return;
    const now = performance.now();
    let starved = 0;
    queue.sort((a, b) => a.order - b.order);
    for (const task of [...queue]) {
      if (task.state !== "queued") continue;
      const r = task.el.getBoundingClientRect();
      // Scrolled past, or kept waiting: show it and move on.
      if (r.bottom < 0 || r.right < 0 || now - task.queuedAt > MAX_WAIT) {
        finish(task);
        emit("done", task);
        continue;
      }
      // Not on screen after all: wait for it to come back.
      if (r.top > window.innerHeight || r.left > window.innerWidth) {
        queue.splice(queue.indexOf(task), 1);
        dropGhost(task);
        task.state = "idle";
        io.unobserve(task.el);
        io.observe(task.el);
        continue;
      }
      if (!eligible(task, now)) continue;
      const c = pick(task, r);
      if (!c) {
        starved++;
        continue;
      }
      queue.splice(queue.indexOf(task), 1);
      void run(task, c);
    }
    // More work than hands: everyone speeds up until the queue clears.
    speed = clamp(BASE_SPEED + starved / 4, BASE_SPEED, 3);
  };

  const io = new IntersectionObserver(
    (entries) => {
      const now = performance.now();
      for (const entry of entries) {
        const task = tasks.get(entry.target);
        if (!task || task.state !== "idle") continue;
        if (entry.isIntersecting) {
          task.state = "queued";
          task.queuedAt = now;
          queue.push(task);
          makeGhost(task);
        } else if (
          entry.boundingClientRect.height &&
          entry.boundingClientRect.bottom < 0
        ) {
          finish(task);
          emit("done", task);
        }
      }
      pump();
    },
    { rootMargin: "0px 0px -7% 0px" },
  );

  document.querySelectorAll<HTMLElement>("[data-b]").forEach((el, order) => {
    const kind = el.dataset.b as Kind;
    if (!KINDS.includes(kind)) return;
    const task: Task = {
      el,
      kind,
      name: el.dataset.name || NAME[kind],
      wave: Number(el.dataset.w || 0),
      scene: el.closest("[data-scene]"),
      order,
      state: "built" in el.dataset ? "done" : "idle",
      queuedAt: 0,
      startedAt: 0,
    };
    tasks.set(el, task);
    if (task.state === "idle") io.observe(el);
  });

  /* ------------------------------------------------- life between tasks */

  const gatherEl = document.querySelector<HTMLElement>("[data-gather]");
  const gathering = () => {
    if (!gatherEl) return null;
    const r = gatherEl.getBoundingClientRect();
    const mid = r.top + r.height / 2;
    return mid > window.innerHeight * 0.2 && mid < window.innerHeight * 0.85
      ? r
      : null;
  };

  /** Select something already built, the way you click around a file. */
  const inspect = async (c: Cursor, alive: Alive) => {
    const onScreen = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top > 90 && r.bottom < window.innerHeight - 60 && r.width > 40;
    };
    const pool: { el: HTMLElement; name: string }[] = [];
    for (const task of tasks.values())
      if (
        task.state === "done" &&
        (task.kind === "frame" || task.kind === "drop") &&
        onScreen(task.el)
      )
        pool.push(task);
    document.querySelectorAll<HTMLElement>("[data-pick]").forEach((el) => {
      if (onScreen(el)) pool.push({ el, name: el.dataset.name || "Frame" });
    });
    const target = pool[Math.floor(Math.random() * pool.length)];
    if (!target) return;
    const el = target.el;
    inspecting++;
    const g = geo(el);
    c.el.dataset.busy = "";
    await fly(c, () => at(el, g, g.w, g.h), alive);
    if (alive()) {
      click(c);
      const sel = makeSel(c, g, target.name);
      sel.dataset.pick = "";
      sizeOf(sel, g, 1);
      c.sel = sel;
      await tween(
        rand(900, 1700),
        () => {
          boxAt(sel, el, g, 1);
          const q = at(el, g, g.w, g.h);
          place(c, q.x, q.y);
        },
        alive,
      );
      if (c.sel === sel) clearSel(c);
      else sel.remove();
    }
    inspecting--;
    if (!c.busy) delete c.el.dataset.busy;
  };

  /** Click something that responds: the browser flips, the terminal prints. */
  const act = async (c: Cursor, alive: Alive) => {
    const pool = Array.from(
      document.querySelectorAll<HTMLElement>("[data-act]"),
    ).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top > 60 && r.bottom < window.innerHeight && r.width > 0;
    });
    const el = pool[Math.floor(Math.random() * pool.length)];
    if (!el) return;
    const fx = rand(0.3, 0.7);
    const fy = rand(0.3, 0.7);
    c.el.dataset.busy = "";
    await fly(
      c,
      () => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width * fx + sx(), y: r.top + r.height * fy + sy() };
      },
      alive,
    );
    if (alive()) {
      click(c);
      el.dispatchEvent(new CustomEvent("swarm:act", { bubbles: true }));
      await tween(500, () => {}, alive);
    }
    if (!c.busy) delete c.el.dataset.busy;
  };

  const roam = (c: Cursor, urgent: boolean) => {
    const token = ++c.token;
    const alive = () => c.token === token && !c.busy;
    c.idleAt = performance.now();
    c.nextRoam = rand(1400, 5200);
    const v = view();
    const around = gathering();

    if (around) {
      // Collect around the edge of the frame, name tags showing.
      c.herding = false;
      c.el.dataset.show = "";
      const t = (c.i + Math.random() * 0.6) / cursors.length;
      const side = t * 4;
      const k = side % 1;
      const pad = rand(10, 34);
      const edge =
        side < 1
          ? { x: around.left + around.width * k, y: around.top - pad }
          : side < 2
            ? { x: around.right + pad, y: around.top + around.height * k }
            : side < 3
              ? { x: around.right - around.width * k, y: around.bottom + pad }
              : { x: around.left - pad, y: around.bottom - around.height * k };
      const x = clamp(edge.x + sx(), v.l + 8, v.r - 70);
      const y = edge.y + sy();
      void fly(c, () => ({ x, y }), alive, rand(520, 900));
      return;
    }
    delete c.el.dataset.show;

    if (urgent) {
      // Catch up with the reader: the target rides the viewport.
      c.herding = true;
      const x = rand(v.l + 20, v.r - 90);
      const ry = rand(0.16, 0.8) * window.innerHeight;
      void fly(c, () => ({ x, y: sy() + ry }), alive, rand(480, 860)).then(
        () => {
          if (c.token === token) c.herding = false;
        },
      );
      return;
    }

    const roll = Math.random();
    if (roll < 0.34 && inspecting < 2) {
      void inspect(c, alive);
      return;
    }
    if (roll < 0.5) {
      void act(c, alive);
      return;
    }
    const x = clamp(c.x + rand(-150, 150), v.l + 12, v.r - 80);
    const y = clamp(c.y + rand(-110, 110), v.t, v.b);
    void fly(c, () => ({ x, y }), alive, rand(700, 1400));
  };

  /** Bring resting cursors that fell off screen back to the reader. */
  const herd = () => {
    const top = sy() - 70;
    const bottom = sy() + window.innerHeight + 50;
    let k = 0;
    for (const c of cursors) {
      if (c.busy || c.herding) continue;
      if (c.y > top && c.y < bottom) continue;
      c.herding = true;
      later(() => {
        if (c.busy) c.herding = false;
        else roam(c, true);
      }, k++ * 50);
    }
  };

  const sweep = window.setInterval(() => {
    if (dead || document.hidden) return;
    pump();
    herd();
    const now = performance.now();
    for (const c of cursors)
      if (!c.busy && !c.herding && now - c.idleAt > c.nextRoam) roam(c, false);
  }, 240);

  let lastScroll = 0;
  const onScroll = () => {
    const now = performance.now();
    if (now - lastScroll < 140) return;
    lastScroll = now;
    herd();
  };

  /* ------------------------------------------------------------ controls */

  const settle = () => {
    for (const task of tasks.values())
      if (task.state === "queued" || task.state === "running") {
        finish(task);
        emit("done", task);
      }
  };
  /** Replay: build what is on screen again. */
  const replay = () => {
    for (const task of tasks.values()) {
      const r = task.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight || !r.width) continue;
      if (task.state !== "done") finish(task);
      delete task.el.dataset.built;
      if (task.kind === "rows")
        rowsOf(task.el).forEach((row) => delete row.dataset.built);
      task.state = "idle";
      io.observe(task.el);
    }
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") settle();
  };
  const onHide = () => {
    if (document.hidden) settle();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onKey);
  window.addEventListener("hh:replay", replay);
  document.addEventListener("visibilitychange", onHide);

  // Take each cursor over from where the opening left it (ringed round the
  // card); one that is not on screen arrives from the nearest side instead.
  const v = view();
  cursors.forEach((c, i) => {
    const r = c.el.getBoundingClientRect();
    const ringed =
      r.top > 0 &&
      r.top < window.innerHeight &&
      r.left > 0 &&
      r.left < window.innerWidth;
    if (ringed) {
      place(c, r.left + sx(), r.top + sy());
    } else {
      const side = i % 4;
      const along = Math.random();
      place(
        c,
        side === 1 ? v.r + 30 : side === 3 ? v.l - 70 : v.l + along * (v.r - v.l),
        side === 0
          ? sy() - 40
          : side === 2
            ? sy() + window.innerHeight + 20
            : sy() + along * window.innerHeight,
      );
    }
    c.el.dataset.on = "";
  });
  later(herd, 420);

  return () => {
    dead = true;
    cancelAnimationFrame(raf);
    window.clearInterval(sweep);
    timers.forEach((id) => window.clearTimeout(id));
    io.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("hh:replay", replay);
    document.removeEventListener("visibilitychange", onHide);
    layer
      .querySelectorAll(".sw-sel, .sw-ghost, .sw-caret")
      .forEach((el) => el.remove());
    cursors.forEach((c) => {
      delete c.el.dataset.on;
      delete c.el.dataset.busy;
    });
    delete html.dataset.tool;
  };
}
