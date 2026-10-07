import Lenis from "../_engine/vendor/lenis.mjs";
import { createGlobe, createFreight } from "./world.js";

const $ = (s) => document.querySelector(s);
const reduced =
  matchMedia("(prefers-reduced-motion: reduce)").matches ||
  new URLSearchParams(location.search).get("motion") === "off";
if (reduced) document.documentElement.classList.add("reduced-motion");
const hero = $(".hero"),
  journey = $(".journey"),
  stage = $(".journey-stage");
const header = $(".site-header"),
  copy = $(".hero-copy"),
  port = $(".port-frame");
const articles = [...document.querySelectorAll("[data-chapter]")];
const stops = [...document.querySelectorAll("[data-stop]")];
const progressLine = $(".journey-progress i"),
  backdrop = $(".big-backdrop");
const menu = $("#site-menu"),
  quote = $("#quote-dialog");
const modes = ["01 — LAND", "02 — TERMINAL", "03 — OCEAN", "04 — AIR"];
const words = [
  "ON THE ROAD",
  "IN GOOD HANDS",
  "BEYOND BORDERS",
  "AHEAD OF TIME",
];
const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const smooth = (a, b, n) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};
let globe,
  freight,
  heroTop = 0,
  heroHeight = 1,
  journeyTop = 0,
  journeySpan = 1;
let portTop = 0,
  portHeight = 1,
  servicesTop = 0,
  faqTop = 0,
  contactTop = 0,
  vh = innerHeight,
  frame = 0,
  chapter = -1,
  ready = false;
let activeOcean = false,
  lightHeader = false,
  compactHeader = false,
  lastTime = performance.now();
const lenis = reduced
  ? null
  : new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      prevent: (el) => Boolean(el.closest?.("dialog")),
    });
lenis?.stop();
document.querySelector("main").inert = true;
header.inert = true;
function measure() {
  vh = innerHeight;
  heroTop = hero.offsetTop;
  heroHeight = hero.offsetHeight;
  journeyTop = journey.offsetTop;
  journeySpan = Math.max(1, journey.offsetHeight - vh);
  portTop = port.getBoundingClientRect().top + scrollY;
  portHeight = port.offsetHeight;
  servicesTop = $("#services").offsetTop;
  faqTop = $(".faq").offsetTop;
  contactTop = $("#contact").offsetTop;
  globe?.resize();
  freight?.resize();
}
try {
  globe = createGlobe($("#globe"), reduced);
  freight = createFreight($("#freight"), reduced);
} catch (error) {
  document.body.classList.add("webgl-fallback");
  console.warn("3D unavailable; static layout is active.", error);
}
function finish() {
  if (ready) return;
  ready = true;
  $(".load-track i").style.transform = "scaleX(1)";
  const loader = $(".loader");
  loader?.classList.add("done");
  setTimeout(() => loader?.remove(), reduced ? 0 : 1100);
  document.body.classList.add("is-ready");
  document.querySelector("main").inert = false;
  header.inert = false;
  document.querySelectorAll(".intro").forEach((el, i) => {
    if (!reduced)
      el.animate(
        [
          { transform: "translateY(110%)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        {
          duration: 1100,
          delay: 70 * i,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both",
        },
      );
  });
  lenis?.start();
  measure();
  const target = location.hash
    ? document.getElementById(location.hash.slice(1))
    : null;
  if (target) {
    const y =
      target.getBoundingClientRect().top +
      scrollY -
      (target === journey || target === hero ? 0 : 85);
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else scrollTo(0, y);
  }
}
const started = performance.now();
Promise.allSettled([document.fonts.ready, globe?.ready]).then(() =>
  setTimeout(finish, Math.max(0, 850 - (performance.now() - started))),
);
setTimeout(finish, 4500);
const motionLink = $("#motion-link");
if (reduced) {
  motionLink.textContent = "Motion reduced";
  motionLink.setAttribute("aria-current", "true");
}
function chooseChapter(p) {
  const next = p < 0.28 ? 0 : p < 0.5 ? 1 : p < 0.78 ? 2 : 3;
  if (next === chapter) return;
  chapter = next;
  for (let i = 0; i < articles.length; i++) {
    articles[i].hidden = i !== next;
    if (i === next && !reduced)
      articles[i].animate(
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 650, easing: "cubic-bezier(.2,.7,.1,1)" },
      );
    if (i === next) stops[i].setAttribute("aria-current", "step");
    else stops[i].removeAttribute("aria-current");
  }
  $(".mode-label").textContent = modes[next];
  backdrop.textContent = words[next];
  $(".journey-number").textContent = `0${next + 1} / 04`;
}
function tick(t) {
  const dt = Math.min(64, t - lastTime);
  lastTime = t;
  lenis?.raf(t);
  const y = scrollY,
    heroProgress = clamp((y - heroTop) / Math.max(1, heroHeight - vh));
  const jp = clamp((y - journeyTop) / journeySpan);
  const inHero = y < heroTop + heroHeight && y + vh > heroTop;
  const inJourney = y + vh > journeyTop && y < journeyTop + journeySpan + vh;
  if (inHero) {
    globe?.render(t, reduced ? 0 : heroProgress, dt);
    if (!reduced) {
      copy.style.transform = `translate3d(0,${-heroProgress * 130}px,0)`;
      copy.style.opacity = String(1 - smooth(0.2, 0.86, heroProgress));
    }
  }
  const ocean = jp >= 0.5 && jp < 0.78 && inJourney;
  if (activeOcean !== ocean) {
    activeOcean = ocean;
    stage.classList.toggle("ocean", ocean);
  }
  const onLight =
    (!inHero && !ocean && y < servicesTop) || (y >= faqTop && y < contactTop);
  if (lightHeader !== onLight) {
    lightHeader = onLight;
    header.classList.toggle("light", onLight);
  }
  if (compactHeader === inHero) {
    compactHeader = !inHero;
    header.classList.toggle("compact", compactHeader);
  }
  if (inJourney) {
    if (!reduced) chooseChapter(jp);
    progressLine.style.transform = `scaleX(${jp})`;
    freight?.render(t, reduced ? 0.14 : jp, dt);
  }
  if (!reduced && y + vh > portTop && y < portTop + portHeight) {
    const p = smooth(portTop - vh, portTop + portHeight * 0.1, y);
    port.style.clipPath = `inset(0 ${12 * (1 - p)}% 0 ${12 * (1 - p)}% round ${220 * (1 - p)}px)`;
  }
  frame = requestAnimationFrame(tick);
}
measure();
frame = requestAnimationFrame(tick);
if (reduced) articles.forEach((article) => (article.hidden = false));
let resizeTimer;
addEventListener(
  "resize",
  () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 120);
  },
  { passive: true },
);
document.fonts.ready.then(measure);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancelAnimationFrame(frame);
  else {
    lastTime = performance.now();
    frame = requestAnimationFrame(tick);
  }
});
function moveTo(target, offset = -85) {
  menu.close();
  $(".menu-toggle").setAttribute("aria-expanded", "false");
  const y =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + scrollY + offset;
  if (lenis)
    lenis.scrollTo(y, {
      duration: clamp(
        1.4 + Math.sqrt(Math.abs(y - scrollY) / vh) * 0.36,
        1.4,
        3.4,
      ),
      force: true,
    });
  else scrollTo({ top: y, behavior: "instant" });
}
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (event) => {
    const target = document.getElementById(a.getAttribute("href").slice(1));
    if (!target) return;
    event.preventDefault();
    history.replaceState(null, "", a.getAttribute("href"));
    moveTo(target, target === hero || target === journey ? 0 : -85);
  }),
);
stops.forEach((button) =>
  button.addEventListener("click", () =>
    moveTo(journeyTop + Number(button.dataset.stop) * journeySpan, 0),
  ),
);
$(".menu-toggle").addEventListener("click", () => {
  menu.showModal();
  lenis?.stop();
  $(".menu-toggle").setAttribute("aria-expanded", "true");
});
$(".menu-close").addEventListener("click", () => menu.close());
menu.addEventListener("close", () => {
  $(".menu-toggle").setAttribute("aria-expanded", "false");
  if (ready) lenis?.start();
});
document.querySelectorAll("[data-quote]").forEach((button) =>
  button.addEventListener("click", () => {
    quote.showModal();
    lenis?.stop();
    if (button.dataset.service)
      quote.querySelector("select").value = button.dataset.service;
  }),
);
$(".quote-close").addEventListener("click", () => quote.close());
quote.addEventListener("close", () => {
  if (ready) lenis?.start();
});
quote.addEventListener("click", (e) => {
  if (e.target === quote) {
    const r = quote.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      quote.close();
  }
});
$("#quote-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  $("#quote-result").textContent =
    `Your enquiry preview\n${data.get("service")} · ${data.get("origin")} → ${data.get("destination")}\n${data.get("cargo")}\n\nThis is a portfolio demonstration. Nothing has been sent or booked.`;
});
const detailGroups = [...document.querySelectorAll(".service-list details")],
  serviceImg = $(".service-photo img");
detailGroups.forEach((detail) =>
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    detailGroups.forEach((other) => {
      if (other !== detail) other.open = false;
    });
    const src = `media/${detail.dataset.image}`;
    serviceImg.src = src;
    serviceImg.alt = detail.querySelector("h3").textContent + " photography";
    $(".service-photo span").textContent = detail.dataset.caption;
    requestAnimationFrame(measure);
  }),
);
document
  .querySelectorAll(".faq details")
  .forEach((detail) =>
    detail.addEventListener("toggle", () => requestAnimationFrame(measure)),
  );
const routes = [
  "M207 211Q211 157 275 273",
  "M275 273Q378 241 440 391",
  "M440 391Q536 356 581 422",
];
const routeCodes = ["CMB → SIN", "SIN → MEL", "MEL → AKL"];
document.querySelectorAll("[data-route]").forEach((button) =>
  button.addEventListener("click", () => {
    const n = Number(button.dataset.route);
    document
      .querySelectorAll("[data-route]")
      .forEach((other) =>
        other.setAttribute("aria-pressed", String(other === button)),
      );
    const path = $(".route-path");
    path.setAttribute("d", routes[n]);
    $(".route-code").textContent = routeCodes[n];
    if (!reduced)
      path.animate([{ strokeDashoffset: 500 }, { strokeDashoffset: 0 }], {
        duration: 1600,
        easing: "cubic-bezier(.2,.7,.1,1)",
        fill: "both",
      });
  }),
);
if (!reduced) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.animate(
            [
              { opacity: 0, transform: "translateY(38px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 900, easing: "cubic-bezier(.16,1,.3,1)" },
          );
          observer.unobserve(e.target);
        }
    },
    { threshold: 0.13 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
