/* ==========================================================================
   MOSS scroll story
   ========================================================================== */

(() => {
  'use strict';

  /* ---------------------------- Settings ---------------------------------- */

  // Scroll distance of each scene, in viewport heights.
  const TIMELINE = {
    growStart: 0,     // PEEK → FULL begins
    growEnd: 1.3,     //        …and ends
    shrinkStart: 1.8, // FULL → INFO begins (the gap in between is a short hold)
    shrinkEnd: 3.0,   //        …and ends
    darkStart: 3.0,   // background turns bronze + description appears…
    darkEnd: 3.4,     //        …fully shown here
    total: 4.0,       // total scroll length (INFO stays on screen until here)
  };

  // Width of the MOSS word as a fraction of the viewport width.
  const WIDTH = {
    peek: 0.7,
    peekMobile: 0.8,
    full: 0.96,
    info: 0.44,
    infoMobile: 0.62,
  };

  const MOBILE_BREAKPOINT = 700; // px
  const PEEK_VISIBLE = 0.6;      // share of the letters' height visible in the PEEK scene…
  const PEEK_VISIBLE_MIN = 0.4;  // …but only down to this on short screens
  const PEEK_MIN_GAP = 40;       // px MOSS always keeps below the hero buttons
  const FULL_MAX_HEIGHT = 0.78;  // FULL never taller than this share of the viewport
  const INFO_GAP = 40;           // px between small MOSS and the description
  const SMOOTHING = 0.14;        // 0–1, lower = softer, more "glide" after wheel steps

  /* ------------------------------ Elements -------------------------------- */

  const root = document.documentElement;
  const section = document.getElementById('moss');
  const site = document.querySelector('.site');
  const actions = document.querySelector('.actions'); // hero buttons
  if (!section || !site || !actions) return;

  const stage = section.querySelector('.moss__stage');
  const word = section.querySelector('.moss__word');
  const content = section.querySelector('.moss__content');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return; // keep the static layout

  /* ------------------------------- Helpers -------------------------------- */

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const range = (v, start, end) => clamp01((v - start) / (end - start));
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // Blend two snapshots { scale, x, y, clip } by t (0 → a, 1 → b).
  const blend = (a, b, t) => ({
    scale: lerp(a.scale, b.scale, t),
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    clip: lerp(a.clip, b.clip, t),
  });

  /* ------------------------------ Measuring -------------------------------- */

  let vw = 0;
  let vh = 0;
  let scenes = null; // { peek, full, info } snapshots
  let infoContentTop = 0;

  // Work out where the word sits in each scene. Runs on load and resize.
  function measure() {
    vw = stage.clientWidth;
    vh = stage.clientHeight;

    const isMobile = vw <= MOBILE_BREAKPOINT;
    const wordW = word.offsetWidth;   // natural (unscaled) size
    const wordH = word.offsetHeight;
    const pad = wordH * 0.05;         // keeps letter overshoot from being clipped
    const centerX = (scale) => (vw - wordW * scale) / 2;

    // PEEK — centred, rising from the bottom edge of the hero. Shows PEEK_VISIBLE
    // of the letters' height, but shrinks back (to PEEK_VISIBLE_MIN at most) when
    // that would bring it closer than PEEK_MIN_GAP to the hero buttons.
    // The word's padding (room for round letters, see moss.css) is left out, so
    // PEEK_VISIBLE means "how much of the letters you see".
    const peekScale = (vw * (isMobile ? WIDTH.peekMobile : WIDTH.peek)) / wordW;
    const padTop = parseFloat(getComputedStyle(word).paddingTop);
    const lettersHeight = (wordH - 2 * padTop) * peekScale; // on screen, without padding
    const heroBottom = site.getBoundingClientRect().bottom + window.scrollY;
    const buttonsBottom = actions.getBoundingClientRect().bottom + window.scrollY;
    const lettersVisible = Math.max(
      lettersHeight * PEEK_VISIBLE_MIN,
      Math.min(lettersHeight * PEEK_VISIBLE, heroBottom - buttonsBottom - PEEK_MIN_GAP)
    );
    const peek = {
      scale: peekScale,
      x: centerX(peekScale),
      y: heroBottom - lettersVisible - padTop * peekScale,
      clip: wordH - padTop - lettersVisible / peekScale, // hides the part below the hero (unscaled px)
    };

    // FULL — as wide as the screen allows, centred in the viewport.
    const fullScale = Math.min(
      (vw * WIDTH.full) / wordW,
      (vh * FULL_MAX_HEIGHT) / wordH
    );
    const full = {
      scale: fullScale,
      x: centerX(fullScale),
      y: (vh - wordH * fullScale) / 2,
      clip: -pad,
    };

    // INFO — small, centred at the top, with the description below it.
    const infoScale = (vw * (isMobile ? WIDTH.infoMobile : WIDTH.info)) / wordW;
    const infoTop = Math.max(vh * 0.1, 48);
    const info = {
      scale: infoScale,
      x: centerX(infoScale),
      y: infoTop,
      clip: -pad,
    };

    scenes = { peek, full, info };
    infoContentTop = infoTop + wordH * infoScale + INFO_GAP;

    // Section geometry (used by moss.css).
    section.style.setProperty('--moss-hero-h', `${site.offsetHeight}px`);
    section.style.setProperty('--moss-scroll-length', `${vh * TIMELINE.total}px`);
    section.style.setProperty('--moss-content-top', `${infoContentTop}px`);
  }

  /* ------------------------------- Rendering ------------------------------- */

  // Apply the look for a given scroll position (px).
  function render(scrollY) {
    const grow = easeInOut(range(scrollY, TIMELINE.growStart * vh, TIMELINE.growEnd * vh));
    const shrink = easeInOut(range(scrollY, TIMELINE.shrinkStart * vh, TIMELINE.shrinkEnd * vh));
    const dark = easeInOut(range(scrollY, TIMELINE.darkStart * vh, TIMELINE.darkEnd * vh));

    const pose = blend(blend(scenes.peek, scenes.full, grow), scenes.info, shrink);

    // The hidden lower half is revealed in the first part of the growth, so the
    // letters are whole well before MOSS reaches full size.
    const reveal = easeInOut(range(grow, 0, 0.55));
    const clip = lerp(scenes.peek.clip, scenes.full.clip, reveal);

    word.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) scale(${pose.scale})`;
    word.style.clipPath = `inset(${scenes.full.clip}px ${scenes.full.clip}px ${clip}px ${scenes.full.clip}px)`;

    // Hero scrolls away naturally; fade it too so it never overlaps the letters.
    root.style.setProperty('--moss-hero-opacity', 1 - easeInOut(range(scrollY, 0, vh * 0.7)));

    // Background stays the site colour while MOSS moves, then turns bronze.
    section.style.setProperty('--moss-backdrop', dark);

    // Description + footer fade in as the background darkens (white text needs
    // the dark background); their links become clickable once mostly visible.
    const contentProgress = easeInOut(range(dark, 0.4, 1));
    section.style.setProperty('--moss-content', contentProgress);
    content.classList.toggle('is-visible', contentProgress > 0.5);
  }

  /* --------------------------- Scroll (with glide) -------------------------- */

  let target = 0;   // where the page actually is
  let current = 0;  // where the animation is (eases toward target)
  let running = false;

  function tick() {
    current += (target - current) * SMOOTHING;
    if (Math.abs(target - current) < 0.5) current = target;
    render(current);

    if (current !== target) requestAnimationFrame(tick);
    else running = false;
  }

  function requestRender() {
    target = window.scrollY;
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  /* --------------------------------- Init ----------------------------------- */

  function refresh() {
    measure();
    target = current = window.scrollY;
    render(current);
  }

  root.classList.add('moss-scrollytelling');
  refresh();

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
})();