/* OG Engine launch page: nav, hero halftone, dot artwork, rail, MOSS selector, waitlist form. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const SVG = 'http://www.w3.org/2000/svg';

  /* Runs fn(visible) as an element enters or leaves the viewport. */
  const watch = (el, fn) => {
    if (!('IntersectionObserver' in window)) { fn(true); return; }
    new IntersectionObserver(es => es.forEach(e => fn(e.isIntersecting)), { rootMargin: '80px' }).observe(el);
  };

  /* ── Nav ─────────────────────────────────────────── */
  const nav = $('.nav');
  const toggle = $('.nav__toggle');
  const label = $('.nav__toggle-label');
  const selectMoss = { fn: null };

  const setNav = open => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close' : 'Menu';
  };
  const showSub = key => $$('.nav__sublinks').forEach(ul => { ul.hidden = ul.dataset.for !== key; });

  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    setNav(open);
    if (open) $('.nav__links a').focus({ preventScroll: true });
  });
  $$('.nav__links a').forEach(a => {
    const show = () => showSub(a.dataset.sub);
    a.addEventListener('pointerenter', show);
    a.addEventListener('focus', show);
  });
  nav.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    if (a.dataset.pick && selectMoss.fn) selectMoss.fn(+a.dataset.pick);
    if (nav.classList.contains('is-open')) setNav(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
  });
  document.addEventListener('pointerdown', e => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target)) setNav(false);
  });

  /* ── Hero halftone (WebGL, CSS gradient underneath as the fallback) ── */
  (() => {
    const canvas = $('.band__fx');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) { canvas.remove(); return; }
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `
      precision highp float;
      uniform vec2 u_res; uniform float u_t; uniform float u_px;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
        return mix(mix(hash(i), hash(i+vec2(1.,0.)), f.x), mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), f.x), f.y);
      }
      float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*noise(p); p=p*2.03+17.; a*=.5; } return s; }
      float field(vec2 uv){
        vec2 p = vec2(uv.x*1.05 + uv.y*.9, uv.y*1.7 - uv.x*.5);
        float n = fbm(p*1.15 + vec2(u_t*.06, -u_t*.04));
        n += .3*sin((uv.x*1.5 + uv.y*2.3 + n*2.6)*2.1 + u_t*.22);
        return smoothstep(.12, 1.02, n);
      }
      vec3 tone(float f){
        vec3 dark = vec3(.045,.028,.014), teal = vec3(.66,.39,.11), light = vec3(.98,.82,.55);
        vec3 c = mix(dark, teal, smoothstep(0., .8, f));
        return mix(c, light, smoothstep(.7, 1., f)*.55);
      }
      void main(){
        vec2 frag = gl_FragCoord.xy;
        vec2 uv = frag / u_res.y;
        float cell = 8. * u_px;
        vec2 g = vec2(frag.x - frag.y, frag.x + frag.y) * .7071 / cell;
        vec2 id = floor(g) + .5;
        vec2 centre = vec2(id.x + id.y, id.y - id.x) * .7071 * cell / u_res.y;
        float fs = field(uv), fc = field(centre);
        float d = length(fract(g) - .5);
        float r = mix(.1, .6, fc);
        float dotMask = smoothstep(r + .07, r - .07, d);
        vec3 ht = mix(tone(0.)*.5, tone(fc*.75 + .3), dotMask);
        vec2 q = frag / u_res;
        float edge = min(min(q.x, 1.-q.x) * u_res.x / u_res.y, min(q.y, 1.-q.y) * 1.3);
        float m = clamp((1. - smoothstep(0., .5, edge))*.95 + fbm(uv*1.4 - u_t*.03)*1.1 - .38, 0., 1.);
        gl_FragColor = vec4(mix(tone(fs), ht, m), 1.);
      }`;
    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'u_res'), uT = gl.getUniformLocation(prog, 'u_t'), uPx = gl.getUniformLocation(prog, 'u_px');

    let px = 1, visible = true, raf = 0;
    const size = () => {
      px = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * px);
      canvas.height = Math.round(canvas.clientHeight * px);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const draw = now => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, 20 + now / 1000);
      gl.uniform1f(uPx, px);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = now => { draw(now); raf = visible && !reduced.matches ? requestAnimationFrame(loop) : 0; };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    size();
    draw(0);
    addEventListener('resize', () => { size(); draw(performance.now()); });
    watch(canvas, v => { visible = v; if (v) kick(); });
    reduced.addEventListener('change', kick);
  })();

  /* ── Dot artwork (SVG, seeded so it is the same on every load) ── */
  const rng = seed => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const W = 360, H = 250;
  const builders = {
    arcs(a) {
      for (let r = 70, k = 0; r <= 250; r += 27, k++) {
        const n = Math.round((Math.PI * r) / 21);
        for (let i = 0; i <= n; i++) {
          const t = Math.PI * (i / n);
          a.dot(180 + r * Math.cos(t), -24 + r * Math.sin(t), 4.6, 0.2 + 0.13 * k, (i + k) % 9 === 0);
        }
      }
    },
    grid(a) {
      for (let y = 0; y < 9; y++) for (let x = 0; x < 13; x++) {
        const v = a.rnd();
        a.dot(12 + x * 28, 14 + y * 28, 4.6, v > 0.86 ? 1 : v > 0.55 ? 0.55 : 0.22, v > 0.86);
      }
    },
    blocks(a) {
      [[112, 0, 7, 5], [0, 70, 13, 6], [262, 78, 9, 9], [150, 170, 8, 6]].forEach(([bx, by, cols, rows], b) => {
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) a.ring(bx + 6 + x * 11.5, by + 6 + y * 11.5, 4.2, 0.28 + 0.12 * b);
      });
      for (let i = 0; i < 6; i++) a.dot(273.5 + i * 11.5, 130.5, 3.4, 1, true);
    },
    rings(a) {
      for (let r = 62, k = 0; r <= 236; r += 14.5, k++) {
        const n = Math.round((Math.PI * 0.75 * r) / 14.5);
        for (let i = 0; i <= n; i++) {
          const t = Math.PI * (0.42 + 0.75 * (i / n));
          const x = 392 + r * Math.cos(t), y = -34 - r * Math.sin(t) * -1;
          if ((i + k * 2) % 7 === 0) a.dot(x, y, 4.4, 0.95, true); else a.ring(x, y, 5.6, 0.2 + (k % 4) * 0.12);
        }
      }
    },
    links(a) {
      const nodes = [];
      for (let y = 0; y < 4; y++) for (let x = 0; x < 6; x++) nodes.push([36 + x * 58 + (y % 2) * 29, 30 + y * 62]);
      nodes.forEach(([x, y], i) => {
        const right = nodes[i + 1];
        if (right && right[1] === y) a.line(x, y, right[0], right[1]);
        const below = nodes[i + 6];
        if (below) a.line(x, y, below[0], below[1]);
      });
      nodes.forEach(([x, y], i) => a.dot(x, y, i % 5 === 0 ? 7 : 5, i % 5 === 0 ? 1 : 0.6, i % 5 === 0));
    },
    steps(a) {
      for (let x = 0; x < 15; x++) {
        const rows = 1 + Math.floor(x * 0.66);
        for (let y = 0; y < rows; y++) a.dot(16 + x * 24, 236 - y * 24, 4.6, y === rows - 1 ? 1 : 0.2 + 0.05 * y, y === rows - 1);
      }
    },
    scatter(a) {
      [[70, 70], [250, 60], [150, 150], [300, 190], [60, 205]].forEach(([cx, cy], c) => {
        for (let i = 0; i < 26; i++) {
          const r = 8 + a.rnd() * 44, t = a.rnd() * 6.283;
          a.dot(cx + r * Math.cos(t), cy + r * Math.sin(t) * 0.8, 2.6 + a.rnd() * 2.4, 0.25 + a.rnd() * 0.6, i === c);
        }
      });
    },
    lattice(a) {
      const pts = [];
      for (let y = 0; y < 7; y++) for (let x = 0; x < 9; x++) pts.push([24 + x * 42 + (y % 2) * 21, 20 + y * 36, x, y]);
      pts.forEach(([x, y, cx, cy]) => {
        if (cx < 8) a.line(x, y, x + 42, y);
        if (cy < 6) { a.line(x, y, x + (cy % 2 ? 21 : -21), y + 36); if (cx < 8 || !(cy % 2)) a.line(x, y, x + (cy % 2 ? -21 : 21), y + 36); }
      });
      pts.forEach(([x, y, cx, cy]) => a.dot(x, y, 4.4, 0.9, (cx + cy * 2) % 6 === 0));
    },
    hub(a) {
      const cx = 180, cy = 132;
      for (let i = 0; i < 16; i++) {
        const t = (i / 16) * 6.283 - 1.57;
        a.line(cx, cy, cx + 86 * Math.cos(t), cy + 86 * Math.sin(t));
        a.dot(cx + 86 * Math.cos(t), cy + 86 * Math.sin(t), 5.4, 0.9, i % 4 === 0);
      }
      for (let i = 0; i < 44; i++) {
        const t = (i / 44) * 6.283;
        a.dot(cx + 116 * Math.cos(t), cy + 116 * Math.sin(t), 2.4, 0.3, false);
      }
      a.ring(cx, cy, 22, 0.9);
      a.dot(cx, cy, 11, 1, false);
    },
  };
  $$('[data-art]').forEach((host, n) => {
    const build = builders[host.dataset.art];
    if (!build) return;
    const target = host.matches('.pcard') ? $('.pcard__art', host) : host;
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', host.dataset.art === 'hub' ? 'xMidYMid meet' : 'xMidYMid slice');
    const lines = [], dots = [];
    const f = v => v.toFixed(1);
    build({
      rnd: rng(n * 977 + 13),
      dot: (x, y, r, o, hot) => dots.push(`<circle class="dot${hot ? ' dot--hot' : ''}" cx="${f(x)}" cy="${f(y)}" r="${f(r)}" opacity="${o.toFixed(2)}" style="animation-delay:${((x + y) % 32 / 10).toFixed(1)}s"/>`),
      ring: (x, y, r, o) => dots.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="#e0a558" stroke-width="1" opacity="${o.toFixed(2)}"/>`),
      line: (x1, y1, x2, y2) => lines.push(`<path class="link-line" d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}"/>`),
    });
    svg.innerHTML = lines.join('') + dots.join('');
    target.prepend(svg);
  });

  /* ── Principles rail: infinite loop, paused on hover or keyboard focus ── */
  $$('[data-rail]').forEach(rail => {
    const track = $('.rail__track', rail);
    const originals = [...track.children];
    let copies = [];
    const start = () => {
      if (reduced.matches || copies.length) return;
      copies = originals.map(card => {
        const copy = card.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.inert = true;
        track.append(copy);
        return copy;
      });
      rail.classList.add('is-looping');
      // About 40px a second, whatever the screen width.
      track.style.setProperty('--loop-dur', `${Math.round(track.scrollWidth / 2 / 40)}s`);
    };
    const stop = () => {
      copies.forEach(copy => copy.remove());
      copies = [];
      rail.classList.remove('is-looping');
    };
    start();
    reduced.addEventListener('change', () => (reduced.matches ? stop() : start()));
  });

  /* ── MOSS selector ───────────────────────────────── */
  (() => {
    const items = [
      { title: 'Runs marketing activity', desc: 'Systems that manage, automate and improve the marketing a business already does.', sides: 4 },
      { title: 'Removes repeat operations', desc: 'Systems that cut repetitive work, simplify processes and keep the business running.', sides: 3 },
      { title: 'Moves every lead forward', desc: 'Systems for lead management, sales workflows, follow-ups and conversions.', sides: 0 },
    ];
    const tabs = $$('.pick');
    const panel = $('#moss-panel');
    const copy = $('.stage__copy');
    const canvas = $('.stage__fx');
    const ctx = canvas.getContext('2d');
    let current = 0, shown = 0, fade = 1, visible = false, raf = 0, w = 0, h = 0;

    const select = (i, focus) => {
      current = i;
      tabs.forEach((t, k) => {
        t.setAttribute('aria-selected', String(k === i));
        t.tabIndex = k === i ? 0 : -1;
      });
      if (focus) tabs[i].focus();
      panel.setAttribute('aria-labelledby', `pick-${i}`);
      $('[data-count]').textContent = i + 1;
      $('[data-no]').textContent = `00${i + 1}`;
      $('[data-title]').textContent = items[i].title;
      $('[data-desc]').textContent = items[i].desc;
      copy.classList.remove('is-swap');
      void copy.offsetWidth;
      if (!reduced.matches) copy.classList.add('is-swap');
      kick();
    };
    selectMoss.fn = select;
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', e => {
        const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); select((i + d + tabs.length) % tabs.length, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });

    const size = () => {
      const px = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * px); canvas.height = Math.round(h * px);
      ctx.setTransform(px, 0, 0, px, 0, 0);
    };
    /* Stacked outlines of one shape, each turned a little further: a twisting column of dots. */
    const draw = time => {
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);
      const { sides } = items[shown];
      const cx = w * 0.64, cy = h * 0.4, base = Math.min(w, h) * 0.3;
      const layers = 13;
      for (let l = 0; l < layers; l++) {
        const k = l / (layers - 1);
        const rad = base * (0.42 + 0.72 * k);
        const rot = t * 0.16 + k * (1.1 + 0.5 * Math.sin(t * 0.31));
        const ox = Math.sin(t * 0.23) * k * base * 0.22, oy = Math.cos(t * 0.19) * k * base * 0.14;
        const count = (sides || 4) * Math.round(5 + 7 * k);
        ctx.fillStyle = `rgba(${Math.round(190 + 60 * k)},${Math.round(120 + 90 * k)},${Math.round(40 + 110 * k)},${(0.25 + 0.75 * k) * fade})`;
        for (let i = 0; i < count; i++) {
          const u = i / count;
          let x, y;
          if (!sides) {
            const a = u * 6.2832 + rot;
            x = Math.cos(a) * rad; y = Math.sin(a) * rad * (0.8 + 0.2 * Math.cos(t * 0.27 + k * 2));
          } else {
            const e = u * sides, s = Math.floor(e), f = e - s;
            const a0 = (s / sides) * 6.2832 + rot, a1 = ((s + 1) / sides) * 6.2832 + rot;
            x = (Math.cos(a0) + (Math.cos(a1) - Math.cos(a0)) * f) * rad;
            y = (Math.sin(a0) + (Math.sin(a1) - Math.sin(a0)) * f) * rad;
          }
          ctx.beginPath();
          ctx.arc(cx + ox + x, cy + oy + y, 1.1 + 1.5 * k, 0, 6.2832);
          ctx.fill();
        }
      }
    };
    const loop = time => {
      if (shown !== current) { fade -= 0.08; if (fade <= 0) { fade = 0; shown = current; } }
      else if (fade < 1) fade = Math.min(1, fade + 0.06);
      if (reduced.matches) { shown = current; fade = 1; }
      draw(reduced.matches ? 4000 : time);
      raf = visible && (!reduced.matches || shown !== current) ? requestAnimationFrame(loop) : 0;
    };
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }
    size();
    draw(4000);
    addEventListener('resize', () => { size(); draw(performance.now()); });
    watch(canvas, v => { visible = v; if (v) kick(); });
    reduced.addEventListener('change', kick);
  })();

  /* ── Reveal on entry ─────────────────────────────── */
  (() => {
    const els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduced.matches) { els.forEach(el => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  })();

  /* ── Audience ticker ─────────────────────────────── */
  $$('[data-ticker]').forEach(ticker => {
    const btn = $('.ticker__pause', ticker);
    btn.addEventListener('click', () => {
      const paused = ticker.classList.toggle('is-paused');
      btn.setAttribute('aria-pressed', String(paused));
      btn.textContent = paused ? 'Play' : 'Pause';
    });
  });

  /* ── Waitlist form: checked on submit, confirmed only once the server answers ── */
  $$('.wform').forEach(form => {
    const input = $('#w-email', form);
    const error = $('#w-email-err', form);
    const status = $('[data-form-status]', form);
    const button = $('[type="submit"]', form);
    const say = (text, state = '') => { status.textContent = text; status.dataset.state = state; };
    const valid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    const mark = bad => { input.setAttribute('aria-invalid', String(bad)); error.hidden = !bad; };

    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true' && valid()) mark(false); });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      say('');
      if (!valid()) { mark(true); input.focus(); return; }
      mark(false);
      button.disabled = true;
      const wait = setTimeout(() => say('Sending'), 300);
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const data = await res.json().catch(() => ({}));
        clearTimeout(wait);
        if (!res.ok) { say(data.error ? `Not joined: ${data.error}` : form.dataset.failed, 'failed'); return; }
        form.reset();
        say(form.dataset.sent);
      } catch {
        clearTimeout(wait);
        say(form.dataset.failed, 'failed');
      } finally {
        button.disabled = false;
      }
    });
  });
})();
