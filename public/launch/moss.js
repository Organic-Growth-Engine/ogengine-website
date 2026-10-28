(() => {
  'use strict';

  /* ---------------------------- Settings ---------------------------------- */

  // Scroll distance of each scene, in viewport heights.
  const TIMELINE = {
    growStart: 0,     // PEEK → FULL begins
    growEnd: 1.3,     //        …and ends
    shrinkStart: 1.8, // FULL → INFO begins (the gap in between is a short hold)
    shrinkEnd: 3.0,   //        …and ends
    total: 3.7,       // total scroll length (INFO stays on screen until here)
  };

  // Width of the MOSS word as a fraction of the viewport width.
  const WIDTH = {
    peek: 0.7,
    peekMobile: 0.8,
    full: 0.96,
    info: 0.44,
    infoMobile: 0.62,
  };

  const MOBILE_BREAKPOINT = 700; 
  const PEEK_VISIBLE = 0.7;      
  const PEEK_VISIBLE_MIN = 0.4;  
  const PEEK_MIN_GAP = 40;       
  const FULL_MAX_HEIGHT = 0.78;  
  const INFO_GAP = 40;           
  const SMOOTHING = 0.14;      

  /* ------------------------------ Elements -------------------------------- */

  const root = document.documentElement;
  const section = document.getElementById('moss');
  const site = document.querySelector('.site');
  const actions = document.querySelector('.actions'); 
  if (!section || !site || !actions) return;

  const stage = section.querySelector('.moss__stage');
  const word = section.querySelector('.moss__word');
  const content = section.querySelector('.moss__content');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return; 

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
  let scenes = null; 
  let infoContentTop = 0;

  // Work out where the word sits in each scene. Runs on load and resize.
  function measure() {
    vw = stage.clientWidth;
    vh = stage.clientHeight;

    const isMobile = vw <= MOBILE_BREAKPOINT;
    const wordW = word.offsetWidth;   
    const wordH = word.offsetHeight;
    const pad = wordH * 0.05;        
    const centerX = (scale) => (vw - wordW * scale) / 2;

    
    const peekScale = (vw * (isMobile ? WIDTH.peekMobile : WIDTH.peek)) / wordW;
    const peekHeight = wordH * peekScale;
    const heroBottom = site.getBoundingClientRect().bottom + window.scrollY;
    const buttonsBottom = actions.getBoundingClientRect().bottom + window.scrollY;
    const peekVisible = Math.max(
      peekHeight * PEEK_VISIBLE_MIN,
      Math.min(peekHeight * PEEK_VISIBLE, heroBottom - buttonsBottom - PEEK_MIN_GAP)
    );
    const peek = {
      scale: peekScale,
      x: centerX(peekScale),
      y: heroBottom - peekVisible,
      clip: wordH - peekVisible / peekScale, // hides the part below the hero (unscaled px)
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


    section.style.setProperty('--moss-hero-h', `${site.offsetHeight}px`);
    section.style.setProperty('--moss-scroll-length', `${vh * TIMELINE.total}px`);
    section.style.setProperty('--moss-content-top', `${infoContentTop}px`);
  }

  /* ------------------------------- Rendering ------------------------------- */

  // Apply the look for a given scroll position (px).
  function render(scrollY) {
    const grow = easeInOut(range(scrollY, TIMELINE.growStart * vh, TIMELINE.growEnd * vh));
    const shrink = easeInOut(range(scrollY, TIMELINE.shrinkStart * vh, TIMELINE.shrinkEnd * vh));

    const pose = blend(blend(scenes.peek, scenes.full, grow), scenes.info, shrink);


    const reveal = easeInOut(range(grow, 0, 0.55));
    const clip = lerp(scenes.peek.clip, scenes.full.clip, reveal);

    word.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) scale(${pose.scale})`;
    word.style.clipPath = `inset(${scenes.full.clip}px ${scenes.full.clip}px ${clip}px ${scenes.full.clip}px)`;


    root.style.setProperty('--moss-hero-opacity', 1 - easeInOut(range(scrollY, 0, vh * 0.7)));

    // Background deepens to logo bronze while MOSS shrinks.
    section.style.setProperty('--moss-backdrop', shrink);

    const contentProgress = easeInOut(range(shrink, 0.55, 1));
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