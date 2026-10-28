/* ==========================================================================
   MOSS scroll story
   ========================================================================== */

(() => {
  'use strict';

  /* ---------------------------- Settings ---------------------------------- */

  // Scroll distance of each scene, in viewport heights.
  const TIMELINE = {
    growStart: 0,     
    growEnd: 1.3,     
    shrinkStart: 1.3, 
    shrinkEnd: 2.5,   
    darkStart: 2.5,  
    darkEnd: 2.9,     
    total: 3.5,       
  };


  const WIDTH = {
    peek: 0.7,
    peekMobile: 0.8,
    full: 0.96,
    info: 0.44,
    infoMobile: 0.62,
  };

  const MOBILE_BREAKPOINT = 700;
  const PEEK_VISIBLE = 0.6;     
  const PEEK_VISIBLE_MIN = 0.4;  
  const PEEK_MIN_GAP = 40;       
  const FULL_MAX_HEIGHT = 0.78;  
  const INFO_GAP = 40;           
  const SMOOTHING = 0.14;       

  
  const SPHERE = {
    widen: 0.25,  
    taller: 0.15,
  };

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

  // Blend two snapshots { scale, x, y } by t (0 → a, 1 → b).
  const blend = (a, b, t) => ({
    scale: lerp(a.scale, b.scale, t),
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
  });

  /* ---------------------------- Sphere bulge -------------------------------- */

  // An SVG displacement filter on the word. A generated "map" image tells every
  // pixel where to take its colour from; that makes the middle letters wider
  // and taller and the end letters narrower and shorter, like text printed on
  // a ball. The left/right edges never move, so nothing gets cut off.

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const SPHERE_ID = 'moss-sphere';

  // Builds the map for a word of W × H px (its natural, unscaled size).
  // Red = horizontal shift, green = vertical shift; 128 means "don't move".
  // Returns the image and the largest shift in px (needed for the filter scale).
  function createSphereMap(W, H) {
    const w = 512;
    const h = Math.max(8, Math.round((w * H) / W));
    const shifts = new Float32Array(w * h * 2);
    let largest = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const nx = ((x + 0.5) / w) * 2 - 1; // −1 (left) … 1 (right)
        const ny = ((y + 0.5) / h) * 2 - 1; // −1 (top)  … 1 (bottom)

        // Where this pixel takes its colour from:
        const fromX = nx - SPHERE.widen * nx * (1 - nx * nx);        // stretch middle, squeeze ends
        const fromY = ny / (1 + SPHERE.taller * (1 - 2 * nx * nx)); // taller middle, shorter ends

        const i = (y * w + x) * 2;
        shifts[i] = ((fromX - nx) * W) / 2; // in px
        shifts[i + 1] = ((fromY - ny) * H) / 2;
        largest = Math.max(largest, Math.abs(shifts[i]), Math.abs(shifts[i + 1]));
      }
    }

    // Write the shifts into an image, scaled so the largest shift is ±127.
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const map = ctx.createImageData(w, h);

    for (let p = 0; p < w * h; p++) {
      map.data[p * 4] = 128 + 127 * (shifts[p * 2] / largest);
      map.data[p * 4 + 1] = 128 + 127 * (shifts[p * 2 + 1] / largest);
      map.data[p * 4 + 2] = 128;
      map.data[p * 4 + 3] = 255;
    }

    ctx.putImageData(map, 0, 0);
    return { url: canvas.toDataURL(), largest };
  }

  // Adds the (invisible) SVG filter to the page and returns controls for it.
  //   - color-interpolation-filters="sRGB" keeps the map values exact
  //     (they are distances, not colours).
  //   - feFlood fills everything outside the map with grey 128 = "don't move",
  //     so pixels around the word are never pulled out of place.
  function createSphere() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = `
      <filter id="${SPHERE_ID}" color-interpolation-filters="sRGB">
        <feFlood flood-color="#808080" result="still" />
        <feImage result="map" preserveAspectRatio="none" x="0" y="0" width="0" height="0" />
        <feMerge result="lens">
          <feMergeNode in="still" />
          <feMergeNode in="map" />
        </feMerge>
        <feDisplacementMap in="SourceGraphic" in2="lens" scale="0"
          xChannelSelector="R" yChannelSelector="G" />
      </filter>`;
    section.appendChild(svg);

    const mapImage = svg.querySelector('feImage');
    const displacement = svg.querySelector('feDisplacementMap');
    let largestShift = 0;

    return {
      // Fit the map to the word's natural (unscaled) size.
      resize(w, h) {
        const { url, largest } = createSphereMap(w, h);
        largestShift = largest;
        mapImage.setAttribute('width', w);
        mapImage.setAttribute('height', h);
        mapImage.setAttribute('href', url);
      },
      // 0 = straight (filter off), 1 = full bulge.
      setStrength(strength) {
        if (strength < 0.005) {
          word.style.filter = '';
          return;
        }
        // Map values ±127 around 128 ≈ ±0.5 of the filter scale, so scale = 2 × shift.
        displacement.setAttribute('scale', 2 * largestShift * strength);
        word.style.filter = `url(#${SPHERE_ID})`;
      },
    };
  }

  const sphere = createSphere();

  /* ------------------------------ Measuring -------------------------------- */

  let vw = 0;
  let vh = 0;
  let scenes = null; // { peek, full, info } snapshots + maxLift
  let infoContentTop = 0;

  // Work out where the word sits in each scene. Runs on load and resize.
  function measure() {
    vw = stage.clientWidth;
    vh = stage.clientHeight;

    const isMobile = vw <= MOBILE_BREAKPOINT;
    const wordW = word.offsetWidth;   // natural (unscaled) size
    const wordH = word.offsetHeight;
    const centerX = (scale) => (vw - wordW * scale) / 2;
    sphere.resize(wordW, wordH);

    // PEEK — centred, at the bottom of the first screen. Shows PEEK_VISIBLE of
    // the letters' height (the rest is below the screen edge), but less (down
    // to PEEK_VISIBLE_MIN) when it would come closer than PEEK_MIN_GAP to the
    // hero buttons. The word's padding (room for round letters, see moss.css)
    // is left out, so PEEK_VISIBLE means "how much of the letters you see".
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
    };

    // INFO — small, centred at the top, with the description below it.
    const infoScale = (vw * (isMobile ? WIDTH.infoMobile : WIDTH.info)) / wordW;
    const infoTop = Math.max(vh * 0.1, 48);
    const info = {
      scale: infoScale,
      x: centerX(infoScale),
      y: infoTop,
    };

    // How far MOSS can rise with the page before it is centred on screen.
    const peekCenterY = peek.y + (wordH * peekScale) / 2;
    const fullCenterY = full.y + (wordH * fullScale) / 2;
    const maxLift = Math.max(0, peekCenterY - fullCenterY);

    scenes = { peek, full, info, maxLift };
    infoContentTop = infoTop + wordH * infoScale + INFO_GAP;

    // Section geometry (used by moss.css).
    section.style.setProperty('--moss-hero-h', `${site.offsetHeight}px`);
    section.style.setProperty('--moss-scroll-length', `${vh * TIMELINE.total}px`);
    section.style.setProperty('--moss-content-top', `${infoContentTop}px`);
  }

  /* ------------------------------- Rendering ------------------------------- */

  // Apply the look for a scroll position.
  //   scrollY — the smoothed ("glide") position that drives the animation
  //   pageY   — the real page position, so MOSS can rise exactly with the page
  function render(scrollY, pageY) {
    const growProgress = range(scrollY, TIMELINE.growStart * vh, TIMELINE.growEnd * vh);
    const shrinkProgress = range(scrollY, TIMELINE.shrinkStart * vh, TIMELINE.shrinkEnd * vh);
    const grow = easeInOut(growProgress);
    const shrink = easeInOut(shrinkProgress);
    const dark = easeInOut(range(scrollY, TIMELINE.darkStart * vh, TIMELINE.darkEnd * vh));

    // At first MOSS rises together with the page, so it stays the same distance
    // below the hero text instead of falling behind; once centred it stays put.
    const lift = Math.min(pageY, scenes.maxLift);
    const peek = { ...scenes.peek, y: scenes.peek.y - lift };

    const pose = blend(blend(peek, scenes.full, grow), scenes.info, shrink);
    word.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) scale(${pose.scale})`;

    // Sphere bulge: 0 at rest → builds up while growing → 1 at the biggest size
    // → fades out while shrinking → 0 on the info screen.
    const bulgeIn = Math.sin((Math.PI / 2) * growProgress);    // 0 → 1 while growing
    const bulgeOut = Math.cos((Math.PI / 2) * shrinkProgress); // 1 → 0 while shrinking
    sphere.setStrength(bulgeIn * bulgeOut);

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
    render(current, target);

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
    render(current, target);
  }

  root.classList.add('moss-scrollytelling');
  refresh();

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
})();