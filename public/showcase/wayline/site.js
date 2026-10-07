// Wayline — page orchestration: loader, hero globe, header, journey timeline, dialogs.
import Lenis from "../_engine/vendor/lenis.mjs";
import { createGlobe } from "./world.js";
import { createFreight } from "./freight.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const prog = (y, a, b) => clamp((y - a) / (b - a));
const expoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const reduced =
  matchMedia("(prefers-reduced-motion: reduce)").matches ||
  new URLSearchParams(location.search).get("motion") === "off";
const root = document.documentElement;
if (reduced) root.classList.add("reduced-motion");

const body = document.body,
  main = $("main"),
  loader = $(".loader"),
  header = $(".site-header"),
  hero = $(".hero"),
  heroCopy = $(".hero-copy"),
  globeBox = $(".globe-box"),
  journey = $(".journey"),
  ocean = $(".ocean"),
  menu = $("#site-menu"),
  quote = $("#quote-dialog");

// ---------------------------------------------------------------- engines
let globe = null,
  freight = null;
try {
  globe = createGlobe($("#globe"), $(".globe-labels"), reduced);
} catch (e) {
  console.warn("Globe unavailable", e);
}
try {
  freight = createFreight(journey, ocean, reduced);
} catch (e) {
  console.warn("Journey unavailable", e);
}

const lenis = reduced
  ? null
  : new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      prevent: (node) => Boolean(node.closest?.("dialog")),
    });
window.lenis = lenis;

// ---------------------------------------------------------------- layout
const L = { vw: 0, vh: 0, mobile: false, k: 1, heroH: 1, jTop: 0, jH: 1, oTop: 0, oH: 1 };
function measure() {
  L.vw = innerWidth;
  L.vh = innerHeight;
  L.mobile = L.vw < 768;
  L.k = L.mobile ? L.vh / 844 : L.vh / 720;
  L.heroH = hero.offsetHeight;
  L.jTop = journey.offsetTop;
  L.jH = journey.offsetHeight;
  L.oTop = ocean.offsetTop;
  L.oH = ocean.offsetHeight;
  if (globe) {
    const u = L.vw / (L.mobile ? 390 : 1280);
    globe.resize(
      L.mobile
        ? { cx: 230 * u, cy: (330 * L.vh) / 844, radius: 300 * u }
        : { cx: 1175 * u, cy: 270 * L.k, radius: 430 * u },
    );
  }
  freight?.resize(L.vw, L.vh, L.mobile);
  lastScroll = -1;
}

// ---------------------------------------------------------------- loader
let revealed = false,
  introStart = 0;
const counter = $(".ld-count b");
$$(".ld-list li").forEach((li, i) => li.style.setProperty("--i", String(i % 11)));

function reveal() {
  if (revealed) return;
  revealed = true;
  body.classList.remove("is-loading");
  body.classList.add("is-revealed");
  main.inert = false;
  header.inert = false;
  introStart = performance.now();
  lenis?.start();
  setTimeout(() => loader?.remove(), 700);
  freight?.preloadAll();
  jumpToHash();
}

if (reduced || !loader) {
  loader?.remove();
  revealed = true;
  body.classList.add("is-revealed");
  freight?.ready.then(() => freight.preloadAll());
} else {
  body.classList.add("is-loading");
  main.inert = true;
  header.inert = true;
  lenis?.stop();
  const t0 = performance.now();
  let readyAt = 0;
  const ready = Promise.allSettled([
    document.fonts.ready,
    globe?.ready,
    freight?.ready,
    $(".ld-map img")?.decode?.(),
  ]);
  Promise.race([ready, new Promise((r) => setTimeout(r, 9000))]).then(() => {
    readyAt = performance.now() - t0;
  });
  let exit = 0;
  const step = (now) => {
    const t = now - t0;
    // head row drifts down while the lists are swallowed from the top
    loader.style.setProperty("--hy", `${(26.6 + 8.5 * inOut(prog(t, 700, 5200))).toFixed(2)}rem`);
    let n = t < 2500 ? 65 * (1 - Math.pow(1 - prog(t, 250, 2500), 2)) : 65 + 35 * prog(t, 2500, 5200);
    if (!readyAt) n = Math.min(n, 99);
    counter.textContent = String(Math.floor(n)).padStart(2, "0");
    if (readyAt && t >= 5200 && !exit) exit = Math.max(t, readyAt + 150);
    if (exit) {
      counter.textContent = "100";
      if (t >= exit + 200) loader.classList.add("is-exit");
      if (t >= exit + 500) {
        loader.classList.add("is-done");
        reveal();
        return;
      }
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ---------------------------------------------------------------- header
let compact = null,
  hidden = false,
  lastHeaderY = 0;
function updateHeader(y) {
  const c = y > 80;
  if (c !== compact) {
    compact = c;
    header.classList.toggle("compact", c);
  }
  const d = y - lastHeaderY;
  if (Math.abs(d) > 3) {
    const h = d > 0 && y > 300 && !header.contains(document.activeElement);
    if (h !== hidden) {
      hidden = h;
      header.classList.toggle("hide", h);
    }
    lastHeaderY = y;
  }
}

// ---------------------------------------------------------------- frame loop
let lastScroll = -1,
  lastT = performance.now(),
  raf = 0;
function tick(t) {
  const dt = clamp(t - lastT, 0, 64);
  lastT = t;
  lenis?.raf(t);
  const y = lenis ? lenis.animatedScroll : scrollY;
  const moved = y !== lastScroll;
  lastScroll = y;

  // hero: globe framing, rotation and fade; copy fades first
  if (y < L.heroH + L.vh) {
    const Yh = y / L.k;
    const intro = reduced ? 1 : revealed ? expoOut(clamp((t - introStart) / 1100)) : 0;
    const fade = L.mobile ? 1 - prog(y, 0, L.vh * 0.9) : 1 - prog(Yh, 200, 1008);
    if (globe && fade > 0) globe.render(dt, reduced ? 0 : clamp(Yh / 1008, 0, 1.2), intro);
    globeBox.style.opacity = fade.toFixed(3);
    if (moved && !L.mobile) heroCopy.style.opacity = (1 - prog(Yh, 0, 150)).toFixed(3);
  }
  if (moved) updateHeader(y);

  // journey + ocean timeline
  if (freight) {
    const inJ = y + L.vh > L.jTop && y < L.jTop + L.jH;
    const inO = y + L.vh > L.oTop && y < L.oTop + L.oH;
    if ((inJ || inO) && (moved || freight.dirty || (inO && freight.waterActive) || inO))
      freight.render(y - L.jTop, t, dt, inJ, inO);
  }
  raf = requestAnimationFrame(tick);
}

measure();
raf = requestAnimationFrame(tick);
document.fonts.ready.then(measure);
addEventListener("load", measure);
let resizeTimer = 0;
addEventListener(
  "resize",
  () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 120);
  },
  { passive: true },
);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancelAnimationFrame(raf);
  else {
    lastT = performance.now();
    raf = requestAnimationFrame(tick);
  }
});

// ---------------------------------------------------------------- navigation
function targetY(target) {
  if (target === hero) return 0;
  // The services rail is the meaningful start of the journey.
  if (target === journey) return L.jTop + (L.mobile ? 2600 - 2494 : 7344 - 2544) * L.k;
  return target.getBoundingClientRect().top + (lenis ? lenis.animatedScroll : scrollY);
}
function moveTo(target, immediate = false) {
  if (menu.open) menu.close();
  const y = typeof target === "number" ? target : targetY(target);
  const from = lenis ? lenis.animatedScroll : scrollY;
  if (lenis)
    lenis.scrollTo(y, {
      immediate,
      force: true,
      duration: clamp(1.2 + Math.sqrt(Math.abs(y - from) / L.vh) * 0.3, 1.2, 3.2),
    });
  else scrollTo({ top: y, behavior: "instant" });
}
function jumpToHash() {
  const id = location.hash.slice(1);
  const target = id && document.getElementById(id);
  if (target) requestAnimationFrame(() => moveTo(target, true));
}
if (revealed) jumpToHash();
$$('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (event) => {
    const id = a.getAttribute("href").slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    event.preventDefault();
    history.replaceState(null, "", `#${id}`);
    moveTo(target);
    if (target.id !== "home") {
      const focusable = target.querySelector("h1, h2");
      if (focusable) {
        focusable.setAttribute("tabindex", "-1");
        focusable.focus({ preventScroll: true });
      }
    }
  }),
);

// ---------------------------------------------------------------- dialogs
const toggle = $(".menu-toggle");
toggle.addEventListener("click", () => {
  menu.showModal();
  lenis?.stop();
  toggle.setAttribute("aria-expanded", "true");
});
$(".menu-close").addEventListener("click", () => menu.close());
menu.addEventListener("close", () => {
  toggle.setAttribute("aria-expanded", "false");
  if (revealed) lenis?.start();
  toggle.focus({ preventScroll: true });
});
let quoteOpener = null;
$$("[data-quote]").forEach((button) =>
  button.addEventListener("click", () => {
    quoteOpener = button;
    if (menu.open) menu.close();
    quote.showModal();
    lenis?.stop();
    if (button.dataset.service) quote.querySelector("select").value = button.dataset.service;
  }),
);
$(".quote-close").addEventListener("click", () => quote.close());
quote.addEventListener("close", () => {
  if (revealed) lenis?.start();
  quoteOpener?.focus({ preventScroll: true });
});
quote.addEventListener("click", (e) => {
  if (e.target !== quote) return;
  const r = quote.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) quote.close();
});
$("#quote-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  $("#quote-result").textContent =
    `Your enquiry preview\n${data.get("service")} · ${data.get("origin")} → ${data.get("destination")}\n${data.get("cargo")}\n\nThis is a portfolio demonstration. Nothing has been sent or booked.`;
});

// ---------------------------------------------------------------- services accordion
const details = $$(".service-list details"),
  photo = $(".service-photo img"),
  caption = $(".service-photo span");
let generation = 0;
details.forEach((detail) =>
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    details.forEach((other) => other !== detail && (other.open = false));
    const src = `media/${detail.dataset.image}`,
      g = ++generation,
      next = new Image();
    next.src = src;
    next
      .decode()
      .then(() => {
        if (g !== generation) return;
        photo.src = src;
        photo.alt = `${detail.querySelector("h3").textContent} photography`;
        caption.textContent = detail.dataset.caption;
        if (!reduced)
          photo.animate(
            [
              { opacity: 0, transform: "scale(1.045)" },
              { opacity: 1, transform: "scale(1)" },
            ],
            { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" },
          );
      })
      .catch(() => {});
    requestAnimationFrame(measure);
  }),
);
$$(".faq details").forEach((d) => d.addEventListener("toggle", () => requestAnimationFrame(measure)));

// ---------------------------------------------------------------- network routes
const routes = ["M207 211Q211 157 275 273", "M275 273Q378 241 440 391", "M440 391Q536 356 581 422"],
  codes = ["CMB → SIN", "SIN → MEL", "MEL → AKL"];
$$("[data-route]").forEach((button) =>
  button.addEventListener("click", () => {
    const n = Number(button.dataset.route);
    $$("[data-route]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    const path = $(".route-path");
    path.setAttribute("d", routes[n]);
    $(".route-code").textContent = codes[n];
    if (!reduced)
      path.animate([{ strokeDashoffset: 500 }, { strokeDashoffset: 0 }], {
        duration: 1600,
        easing: "cubic-bezier(.2,.7,.1,1)",
        fill: "both",
      });
  }),
);

const motionLink = $("#motion-link");
if (reduced && motionLink) {
  motionLink.textContent = "Restore motion";
  motionLink.href = location.pathname + "#home";
}
