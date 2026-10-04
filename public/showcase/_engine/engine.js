/* Showcase engine — the motion system shared by the concept sites.
   Needs GSAP 3.13 (+ ScrollTrigger, SplitText) and Lenis on the page.
   Behaviour is switched on with data attributes; each site then calls
   SE.init({ intro(tl) { ... } }) to play its own opening once the loader leaves.

   data-split="lines|words|chars|fill"  masked text reveal (fill = words brighten on scroll)
   data-reveal="up|down|left|right"     clip-path image reveal with a slow zoom-out
   data-parallax="14"                    inner media drifts inside its frame (% of height)
   data-drift="120"                      element floats against the scroll by ±px
   data-grow                             media opens from an inset frame to full bleed
   data-fade                             fade + rise
   data-count="98"                       number counts up
   data-marquee[="right"]                endless row, speeds up with scroll velocity
   data-horizontal                       pinned horizontal track (.h-track); swipe on phones
   data-swap                             sticky media that changes with [data-swap-step]s
   data-follow                           list rows ([data-img]) show an image at the cursor
   data-magnetic                         element leans toward the pointer
   data-cursor="View"                    cursor grows into a label
   data-clock="Asia/Colombo"             local time
   data-theme="dark"                     header flips colour over this section */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });

  const SE = (window.SE = { reduce, fine, lenis: null, $, $$ });

  /* ------------------------------------------------------ smooth scroll */
  if (!reduce && window.Lenis) {
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    SE.lenis = lenis;
  }
  SE.scrollTo = (target, opts = {}) =>
    SE.lenis
      ? SE.lenis.scrollTo(target, { duration: 1.6, ...opts })
      : (typeof target === "string" ? $(target) : target)?.scrollIntoView({ behavior: "smooth" });

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    const target = id.length > 1 && $(id);
    if (!target) return;
    event.preventDefault();
    closeMenu();
    SE.scrollTo(target);
  });

  /* -------------------------------------------------------- text splits */
  const markMasks = (split) => split.masks?.forEach((m) => m.classList.add("se-mask"));

  /** Split for an intro animation: returns the SplitText (lines, words, chars). */
  SE.split = (el, type = "lines") => {
    const split = SplitText.create(el, {
      type: type === "lines" ? "lines" : `lines, ${type}`,
      mask: "lines",
      linesClass: "se-line",
    });
    markMasks(split);
    gsap.set(el, { visibility: "visible" });
    return split;
  };

  function splitReveal(el) {
    const mode = el.dataset.split || "lines";
    const delay = parseFloat(el.dataset.delay || 0);
    if (mode === "fill") {
      SplitText.create(el, {
        type: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true },
            },
          ),
      });
      return;
    }
    SplitText.create(el, {
      type: mode === "lines" ? "lines" : `lines, ${mode}`,
      mask: "lines",
      linesClass: "se-line",
      autoSplit: true,
      onSplit(self) {
        markMasks(self);
        const targets = mode === "chars" ? self.chars : mode === "words" ? self.words : self.lines;
        return gsap.from(targets, {
          yPercent: 118,
          duration: 1.35,
          stagger: mode === "chars" ? 0.022 : mode === "words" ? 0.04 : 0.1,
          delay,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      },
    });
  }

  /* ----------------------------------------------------- scroll effects */
  const insets = {
    up: "inset(100% 0% 0% 0%)",
    down: "inset(0% 0% 100% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  };

  function buildEffects() {
    if (reduce) {
      $$("[data-intro]").forEach((el) => (el.style.visibility = "visible"));
      return;
    }
    $$("[data-split]").forEach(splitReveal);

    $$("[data-reveal]").forEach((el) => {
      const inner = el.querySelector("img, video");
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      tl.fromTo(
        el,
        { clipPath: insets[el.dataset.reveal] || insets.up },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
      );
      if (inner) tl.from(inner, { scale: 1.32, duration: 2.2 }, 0.15);
    });

    $$("[data-parallax]").forEach((el) => {
      const inner = el.querySelector("img, video");
      const amount = parseFloat(el.dataset.parallax || 14);
      if (!inner) return;
      gsap.fromTo(
        inner,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    $$("[data-drift]").forEach((el) => {
      const px = parseFloat(el.dataset.drift || 100);
      gsap.fromTo(
        el,
        { y: px },
        {
          y: -px,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    $$("[data-grow]").forEach((el) => {
      const inner = el.querySelector("img, video");
      const st = { trigger: el, start: "top 95%", end: "top 15%", scrub: true };
      gsap.fromTo(
        el,
        { clipPath: "inset(14% 22% 14% 22% round 18px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: st },
      );
      if (inner) gsap.fromTo(inner, { scale: 1.35 }, { scale: 1, ease: "none", scrollTrigger: { ...st } });
    });

    $$("[data-fade]").forEach((el) =>
      gsap.from(el, {
        autoAlpha: 0,
        y: 46,
        duration: 1.5,
        delay: parseFloat(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      }),
    );

    $$("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const o = { v: 0 };
      el.textContent = (0).toFixed(decimals);
      gsap.to(o, {
        v: end,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => (el.textContent = o.v.toFixed(decimals)),
      });
    });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 801px)", () => {
      $$("[data-horizontal]").forEach((section) => {
        const track = $(".h-track", section);
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });
    });

    $$("[data-swap]").forEach((section) => {
      const media = $$("[data-swap-media] > *", section);
      const steps = $$("[data-swap-step]", section);
      // Media stack in order: each new one wipes in over the last, and back out on the way up.
      const show = (i) => {
        media.forEach((m, j) => m.classList.toggle("is-on", j <= i));
        steps.forEach((s, j) => s.classList.toggle("is-on", j === i));
      };
      steps.forEach((step, i) =>
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && show(i),
        }),
      );
      show(0);
    });

    const header = $("[data-header]");
    if (header) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          header.classList.toggle("is-scrolled", y > 40);
          header.classList.toggle("is-hidden", y > 320 && self.direction === 1 && !document.body.classList.contains("menu-open"));
        },
      });
      $$('[data-theme="dark"]').forEach((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top 40px",
          end: "bottom 40px",
          toggleClass: { targets: header, className: "is-dark" },
        }),
      );
    }

    ScrollTrigger.refresh();
  }

  /* ------------------------------------------------------- always-on bits */
  $$("[data-marquee]").forEach((el) => {
    const track = $(".marquee__track", el);
    track.innerHTML += track.innerHTML;
    const dir = el.dataset.marquee === "right" ? 1 : -1;
    const speed = parseFloat(el.dataset.speed || 50);
    let x = dir === 1 ? -track.scrollWidth / 2 : 0;
    gsap.ticker.add((_, dt) => {
      if (reduce) return;
      const boost = SE.lenis ? Math.min(Math.abs(SE.lenis.velocity) * 6, 900) : 0;
      x += (dir * (speed + boost) * dt) / 1000;
      const w = track.scrollWidth / 2;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      track.style.transform = `translate3d(${x}px,0,0)`;
    });
  });

  $$("[data-clock]").forEach((el) => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: el.dataset.clock,
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => (el.textContent = fmt.format(new Date()));
    tick();
    setInterval(tick, 10000);
  });

  $$("video[data-autoplay]").forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? video.play().catch(() => {}) : video.pause(),
    ).observe(video);
  });

  if (fine && !reduce) {
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.innerHTML = '<div class="cursor__dot"></div><div class="cursor__label"></div>';
    document.body.appendChild(cursor);
    const label = $(".cursor__label", cursor);
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    addEventListener("pointermove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
    document.addEventListener("pointerover", (e) => {
      const labelled = e.target.closest("[data-cursor]");
      cursor.classList.toggle("is-label", Boolean(labelled));
      if (labelled) label.textContent = labelled.dataset.cursor;
      cursor.classList.toggle("is-link", !labelled && Boolean(e.target.closest("a, button")));
    });

    $$("[data-magnetic]").forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic || 0.35);
      const mx = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.45)" });
      const my = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.45)" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * strength);
        my((e.clientY - r.top - r.height / 2) * strength);
      });
      el.addEventListener("pointerleave", () => {
        mx(0);
        my(0);
      });
    });

    $$("[data-follow]").forEach((list) => {
      const box = document.createElement("div");
      box.className = "follow";
      box.innerHTML = '<div class="follow__in"></div>';
      document.body.appendChild(box);
      const inner = $(".follow__in", box);
      const rows = $$("[data-img]", list);
      const imgs = rows.map((row) => {
        const img = new Image();
        img.src = row.dataset.img;
        img.alt = "";
        inner.appendChild(img);
        return img;
      });
      const fx = gsap.quickTo(box, "x", { duration: 0.7, ease: "power3" });
      const fy = gsap.quickTo(box, "y", { duration: 0.7, ease: "power3" });
      list.addEventListener("pointermove", (e) => {
        fx(e.clientX + 28);
        fy(e.clientY - box.offsetHeight / 2);
      });
      rows.forEach((row, i) =>
        row.addEventListener("pointerenter", () => {
          box.classList.add("is-on");
          imgs.forEach((img, j) => img.classList.toggle("is-on", j === i));
        }),
      );
      list.addEventListener("pointerleave", () => box.classList.remove("is-on"));
    });
  }

  /* ---------------------------------------------------------------- menu */
  const menu = $(".menu");
  let menuTl = null;
  function openMenu() {
    if (!menu || document.body.classList.contains("menu-open")) return;
    document.body.classList.add("menu-open");
    SE.lenis?.stop();
    menuTl = gsap
      .timeline()
      .set(menu, { visibility: "visible" })
      .to(menu, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" })
      .from($$(".menu__links li", menu), { yPercent: 120, autoAlpha: 0, stagger: 0.07, duration: 1.1 }, 0.45);
  }
  function closeMenu() {
    if (!menu || !document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    gsap.to(menu, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.9,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(menu, { visibility: "hidden" });
        menuTl?.revert();
        gsap.set(menu, { clipPath: "inset(0% 0% 100% 0%)", visibility: "hidden" });
      },
    });
    SE.lenis?.start();
  }
  SE.openMenu = openMenu;
  SE.closeMenu = closeMenu;
  $$("[data-menu-open]").forEach((b) => b.addEventListener("click", openMenu));
  $$("[data-menu-close]").forEach((b) => b.addEventListener("click", closeMenu));
  addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
  if (menu) {
    const pics = $$(".menu__media img", menu);
    $$(".menu__links a", menu).forEach((a, i) =>
      a.addEventListener("pointerenter", () => pics.forEach((p, j) => p.classList.toggle("is-on", j === i % pics.length))),
    );
    pics[0]?.classList.add("is-on");
  }

  /* --------------------------------------------------- loader and intro */
  SE.init = ({ intro, minTime = 1500 } = {}) => {
    const loader = $(".loader");
    const count = $(".loader__count");
    const bar = $(".loader__bar");
    const waits = $$("[data-preload]").map(
      (el) =>
        new Promise((done) => {
          if (el.tagName === "VIDEO") {
            if (el.readyState >= 3) return done();
            el.addEventListener("canplay", done, { once: true });
            el.addEventListener("error", done, { once: true });
            setTimeout(done, 7000);
          } else {
            if (el.complete) return done();
            el.addEventListener("load", done, { once: true });
            el.addEventListener("error", done, { once: true });
          }
        }),
    );
    waits.push(document.fonts ? document.fonts.ready : Promise.resolve());

    const progress = { v: 0 };
    const paint = () => {
      if (count) count.textContent = String(Math.round(progress.v)).padStart(3, "0");
      if (bar) bar.style.transform = `scaleX(${progress.v / 100})`;
    };
    let settled = 0;
    waits.forEach((w) =>
      w.then(() => {
        settled += 1;
        gsap.to(progress, { v: (settled / waits.length) * 92, duration: 0.8, ease: "power2.out", onUpdate: paint });
      }),
    );

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      buildEffects();
      const tl = gsap.timeline();
      if (loader) {
        tl.to(loader, { yPercent: -100, duration: reduce ? 0.01 : 1.25, ease: "expo.inOut" });
        tl.add(() => loader.remove());
      }
      tl.add(() => SE.lenis?.start(), reduce ? 0 : 0.6);
      if (intro) intro(tl, reduce);
    };
    Promise.all([Promise.all(waits), new Promise((r) => setTimeout(r, reduce ? 0 : minTime))]).then(() =>
      gsap.to(progress, { v: 100, duration: 0.45, ease: "power2.out", onUpdate: paint, onComplete: start }),
    );
    setTimeout(start, 6000);
  };
})();
