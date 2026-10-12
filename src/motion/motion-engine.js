// motion-engine.js — the smoothness layer every pattern-breaker site starts from.
//
// Framework-agnostic ES module. Pass the libraries in, so the same file works with npm imports
// (Vite, Astro, Next client components) and with CDN globals (static pages, the moves gallery):
//
//   import gsap from 'gsap';
//   import { ScrollTrigger } from 'gsap/ScrollTrigger';
//   import { SplitText } from 'gsap/SplitText';
//   import Lenis from 'lenis';
//   import { createMotionEngine } from './motion-engine.js';
//   const engine = createMotionEngine({ gsap, ScrollTrigger, SplitText, Lenis });
//
// What it settles once, so no scene re-solves it (each line is a bug someone already paid for):
// - Lenis smooth scroll on GSAP's ticker, only when motion is allowed; touch stays native.
// - Reduced motion: no Lenis, no hidden states, scenes asked to render their last frame.
// - Mobile address-bar resizes never rebuild pins mid-gesture; refresh waits for a calm finger.
// - Text is split only after fonts load (lines measured with fallback fonts are wrong).
// - Hidden "before" states exist only after the engine boots (html.motion-ready), never in
//   prerendered HTML: crawlers, no-JS visitors and prerender snapshots get visible content.
// - Holds read progress from CSS sticky stages (GSAP pins emit layout shifts; sticky doesn't).
// - ?at=<px> or ?at=<sceneId>:<0..1> jumps to a scroll state for deterministic screenshots.
// - Everything created through the engine can be reverted (SPA route changes, React unmounts).

export function createMotionEngine(libs, options = {}) {
  const { gsap, ScrollTrigger, SplitText, Lenis } = libs;
  if (!gsap || !ScrollTrigger) throw new Error('createMotionEngine needs { gsap, ScrollTrigger } (SplitText and Lenis optional)');
  gsap.registerPlugin(ScrollTrigger, ...(SplitText ? [SplitText] : []));

  const html = document.documentElement;
  const media = (q) => window.matchMedia(q).matches;
  // A prerender script sets window.__PRERENDER__ = true before load: render the plain, visible page.
  // The engine then runs the reduced path but adds no class to <html>, and scenes should write no
  // inline styles: the snapshot keeps both, and every later visitor would get a collapsed page.
  const PRERENDER = Boolean(window.__PRERENDER__);
  // ?reduce=1 forces the reduced-motion path (screenshots of the static version, QA).
  const FORCE_REDUCE = new URLSearchParams(location.search).get('reduce') === '1';
  // An in-page accessibility switch sets html[data-motion="off"] (or passes reduce: true), then
  // calls engine.destroy() and creates a new engine: the page rebuilds in its reduced form, no reload.
  // MediaWave policy (DECISIONS #24, #47): the site's own accessibility switch
  // (html.disable-animations) is the full stop. The OS reduced-motion flag is CALM, not REDUCE:
  // many Windows machines have "animation effects" off for speed, not vestibular reasons (Nati's
  // own machine reports reduce). CALM keeps scroll-driven scenes (the visitor's own scroll drives
  // them) but drops Lenis, velocity effects and large travel. ?motion=full overrides CALM for QA.
  const REDUCE = PRERENDER || FORCE_REDUCE || options.reduce === true || html.dataset.motion === 'off' ||
    html.classList.contains('disable-animations');
  const FORCE_FULL = new URLSearchParams(location.search).get('motion') === 'full';
  const CALM = !REDUCE && !FORCE_FULL && media('(prefers-reduced-motion: reduce)');
  const FINE = media('(hover: hover) and (pointer: fine)');
  const RTL = (html.getAttribute('dir') || getComputedStyle(html).direction) === 'rtl';
  // Multiply every horizontal motion that follows the reading direction by DIR.
  const DIR = RTL ? 1 : -1;

  const contexts = [];
  const cleanups = [];

  // ---- refresh discipline -------------------------------------------------------------------
  ScrollTrigger.config({ ignoreMobileResize: true });
  let lastScrollAt = 0;
  let touching = false;
  const onScrollStamp = () => { lastScrollAt = performance.now(); };
  const onTouchStart = () => { touching = true; };
  const onTouchEnd = () => { touching = false; lastScrollAt = performance.now(); };
  addEventListener('scroll', onScrollStamp, { passive: true });
  addEventListener('touchstart', onTouchStart, { passive: true });
  addEventListener('touchend', onTouchEnd, { passive: true });
  cleanups.push(() => {
    removeEventListener('scroll', onScrollStamp);
    removeEventListener('touchstart', onTouchStart);
    removeEventListener('touchend', onTouchEnd);
  });
  let refreshTimer = 0;
  // Refresh only when no finger is down and scrolling has been calm for 350 ms.
  function safeRefresh() {
    clearTimeout(refreshTimer);
    if (touching || performance.now() - lastScrollAt < 350) {
      refreshTimer = setTimeout(safeRefresh, 350);
      return;
    }
    ScrollTrigger.refresh();
  }
  // React to width changes only (rotation, desktop resize); height-only changes are the address bar.
  function onWidthResize(fn) {
    let w = innerWidth;
    const handler = () => {
      if (Math.abs(innerWidth - w) < 2) return;
      w = innerWidth;
      fn();
    };
    addEventListener('resize', handler);
    cleanups.push(() => removeEventListener('resize', handler));
  }
  onWidthResize(safeRefresh);

  // ---- smooth scroll ------------------------------------------------------------------------
  let lenis = null;
  // Skip smooth scrolling on pages with at most one scrubbed set-piece (options.smooth = false):
  // native scroll is enough there, and one less layer means fewer ways to fail.
  if (!REDUCE && !CALM && Lenis && options.smooth !== false) {
    lenis = new Lenis({
      lerp: 0.1, wheelMultiplier: 1,
      syncTouch: false,            // phones keep native momentum scrolling
      stopInertiaOnNavigate: true, // an internal link click stops the glide
      // Inner scrollers (menus, modals, code blocks) need data-lenis-prevent, otherwise the wheel
      // scrolls the page behind them. (allowNestedScroll does it automatically at a per-event cost.)
      ...(options.lenis || {}),
    });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // Native smooth scrolling fights Lenis (current lenis.css no longer neutralises it).
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    cleanups.push(() => { gsap.ticker.remove(raf); lenis.destroy(); lenis = null; html.style.scrollBehavior = prevBehavior; });
  }
  // Overlays (menus, lightboxes, preloaders) lock scrolling the same way with or without Lenis.
  function lock() { if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden'; }
  function unlock() { if (lenis) lenis.start(); else document.body.style.overflow = ''; }
  // The header offset is html { scroll-padding-top: <header height + gap> }, which both paths honour
  // (Lenis reads it, scrollIntoView applies it) and which focus scrolling needs anyway (WCAG 2.4.11).
  // opts.offset is an extra offset on top of it, the same on both paths; keep it 0 for a header, or
  // anchors land one header-height too low with motion on (measured: 144 px instead of 72 px).
  function scrollTo(target, opts = {}) {
    if (lenis) { lenis.start(); lenis.scrollTo(target, { duration: 1.2, ...opts }); return; }
    const behavior = REDUCE ? 'auto' : 'smooth';
    const offset = opts.offset ?? 0;
    if (typeof target === 'number') { window.scrollTo({ top: target + offset, behavior }); return; }
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (!offset) { el.scrollIntoView({ behavior }); return; } // also honours the target's scroll-margin-top
    const pad = parseFloat(getComputedStyle(html).scrollPaddingTop) || 0;
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - pad - margin + offset, behavior });
  }
  // In-page anchors go through the same path while Lenis runs (it would otherwise jump). Without
  // Lenis the browser's own fragment jump is left alone: it already honours scroll-padding, moves
  // focus and updates :target. Intercepting means doing all of that here, or the skip link breaks
  // for keyboard users (measured: Enter on the skip link, then Tab, went back to the header).
  const onAnchorClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!lenis && !options.anchorOffset) return;
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    const href = a && a.getAttribute('href');
    if (!href || href.length < 2) return;
    const decode = (h) => { try { return decodeURIComponent(h.slice(1)); } catch { return null; } };
    const id = decode(href); // Hebrew ids arrive percent-encoded, and querySelector('#%D7…') throws
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    scrollTo(el, { offset: options.anchorOffset ?? 0 });
    if (!el.matches('a[href], button, input, select, textarea, [tabindex]')) {
      el.setAttribute('tabindex', '-1');
      el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true });
    }
    el.focus({ preventScroll: true }); // the next Tab continues from the target, as with a native jump
    if (decode(location.hash) !== id) history.pushState(null, '', href);
  };
  document.addEventListener('click', onAnchorClick);
  cleanups.push(() => document.removeEventListener('click', onAnchorClick));

  // ---- fonts --------------------------------------------------------------------------------
  const fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => setTimeout(r, options.fontTimeout ?? 1800)),
  ]);

  // Hidden "before" states are allowed from here on (CSS: .motion-ready [data-reveal] { … }).
  // toggle, not add: a class left over from an earlier engine or a stale snapshot is removed, and
  // motion-reduced is never written while prerendering (measured: a snapshot carrying it collapsed
  // every hold for visitors who allow motion, hold 2400 px → 180 px).
  html.classList.toggle('motion-ready', !REDUCE);
  html.classList.toggle('motion-reduced', REDUCE && !PRERENDER);

  // ---- scenes -------------------------------------------------------------------------------
  // Run scene code inside a gsap.context so it can be reverted as a unit.
  function scene(fn, scope) {
    const ctx = gsap.context(() => fn({ gsap, ScrollTrigger, REDUCE, CALM, FINE, RTL, DIR, lenis, engine }), scope);
    contexts.push(ctx);
    return ctx;
  }

  // Split into lines after fonts load. Lines get a mask so they can rise from behind it.
  // Pass onSplit(self) that builds and RETURNS the animation: SplitText then re-splits on width
  // changes (autoSplit) and rebuilds the animation, so lines never break mid-word after a resize.
  // Don't put `text-wrap: balance` on split targets; it fights the splitting.
  async function splitLines(el, vars = {}) {
    // The split happens after an await, when the calling scene's gsap.context has already closed;
    // capture that context now and re-enter it, or destroy()/unmount would leave the split and its
    // trigger behind (measured: 2 leaked triggers per restart before this).
    const ctx = gsap.context();
    await fontsReady;
    if (!SplitText) throw new Error('splitLines needs SplitText (gsap/SplitText)');
    if (ctx && ctx.isReverted) return null; // the scene was torn down while fonts were loading
    el.style.fontKerning = 'none'; // kerning shifts glyphs between split and unsplit states
    // SplitText 3.15 groups words into lines with a left-to-right test, so dir="rtl" text collapses
    // into ONE line (measured). The element is ltr only while SplitText measures, then gets its own
    // direction back, so its ::before/::after, text-align:start and inline-start padding/border stay
    // where the author put them. autoSplit re-splits (width change, late webfont) go through
    // split.split(), which first calls split.revert(): both are wrapped so the element stays ltr
    // through the whole re-measure. Measured with a width change after the split: 4/4 lines, where
    // restoring the direction inside revert gave 1 line against 4 native.
    const rtl = /lines/.test(vars.type ?? 'lines') && getComputedStyle(el).direction === 'rtl';
    const authorDir = el.style.direction;
    let measuring = false;
    const measure = () => { if (rtl) { measuring = true; el.style.direction = 'ltr'; } };
    const settle = (self) => {
      if (!rtl) return;
      self.lines.forEach((line) => { line.style.direction = 'rtl'; });
      el.style.direction = authorDir;
      measuring = false;
    };
    const userOnSplit = vars.onSplit;
    const make = () => {
      measure();
      const split = SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'line', aria: 'auto',
        ...(userOnSplit ? { autoSplit: true } : {}),
        ...vars,
        // runs after every split, the first and each re-split, before the caller's animation is built
        onSplit: (self) => { settle(self); return userOnSplit ? userOnSplit(self) : undefined; },
      });
      const revert = split.revert.bind(split);
      const resplit = split.split.bind(split);
      split.split = (cfg) => { measure(); return resplit(cfg); };
      split.revert = () => { revert(); if (rtl && !measuring) el.style.direction = authorDir; return split; };
      return split;
    };
    if (ctx) return ctx.add(make);
    const split = make();
    cleanups.push(() => split.revert()); // created outside any scene: destroy() still reverts it
    return split;
  }

  // A held scene: a tall wrapper with a position:sticky stage inside. ScrollTrigger only reads
  // progress — no pin, no pin-spacer, no layout shift. The wrapper's height sets the distance.
  // Tween CSS variables in it with fromTo, never gsap.set + to: invalidateOnRefresh re-reads start
  // values at each refresh and a set start is lost (move H-04).
  function holdTimeline(wrapper, vars = {}) {
    const { scrub = 0.6, ...rest } = vars;
    return gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom bottom', scrub, invalidateOnRefresh: true, ...rest },
    });
  }

  // Routine entrances (cards, paragraphs, grid images): fire well before the block enters the
  // viewport, short and small, so the entrance is over before anyone sees it. Measured on MediaWave:
  // entrances that fired at the viewport edge were still settling under the thumb in 18 of 21 phone
  // scroll steps; fired 600 px early at 0.35 s / 18 px, in 0 of 21. Blocks already on screen at boot
  // are left alone (no load-time flash, and the LCP element is never hidden). A section's signature
  // entrance, meant to be watched, is built in its scene with a later start ('top 80%') instead.
  function reveal(targets, vars = {}, trigger = {}) {
    const els = gsap.utils.toArray(targets).filter((el) => el.getBoundingClientRect().top > innerHeight);
    if (REDUCE || !els.length) return null;
    const early = options.revealOffset ?? 600;
    // y is the start offset only; spread into the end state it would leave the block shifted for good
    const { y: yIn = 18, ...rest } = vars;
    const y = CALM ? 0 : yIn;
    return gsap.fromTo(els, { autoAlpha: 0, y }, {
      autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out',
      stagger: Math.min(0.06, 0.2 / Math.max(1, els.length - 1)), // a row never arrives as a queue
      ...rest,
      scrollTrigger: { trigger: trigger.trigger || els[0], start: `top bottom+=${early}`, once: true, fastScrollEnd: true, ...trigger },
    });
  }

  // Scroll velocity as a decaying, clamped signal (skews, speed-ups).
  let velocity = 0;
  const velTrigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => { velocity = self.getVelocity(); } });
  const velTick = () => { velocity *= 0.9; };
  gsap.ticker.add(velTick);
  cleanups.push(() => { velTrigger.kill(); gsap.ticker.remove(velTick); });
  const getVelocity = () => (CALM ? 0 : velocity); // CALM: no skews or speed-ups from scroll

  // Video that plays only while visible, shown only once a frame is actually playing.
  // destroy() pauses it, and the reduced engine pauses whatever an earlier engine or an autoplay
  // attribute started: a "stop animations" switch must stop loops too (WCAG 2.2.2).
  function playInView(video, { threshold = 0.25 } = {}) {
    if (REDUCE || CALM) { video.pause(); return; } // DECISIONS #24: the OS flag stops video
    video.muted = true;
    video.playsInline = true;
    const onPlaying = () => video.classList.add('is-playing');
    video.addEventListener('playing', onPlaying);
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else video.pause();
    }, { threshold });
    io.observe(video);
    cleanups.push(() => { io.disconnect(); video.pause(); video.removeEventListener('playing', onPlaying); });
  }

  // ---- QA hook: ?at=<px> | ?at=<sceneId>:<0..1> -------------------------------------------
  // The scene form survives layout changes: give the scene's main ScrollTrigger an id
  // (holdTimeline(wrapper, { id: 'story' })) and ?at=story:0.5 lands mid-scene in every build.
  const at = new URLSearchParams(location.search).get('at');
  const resolveAt = () => {
    if (/^-?\d+(\.\d+)?$/.test(at)) return Number(at);
    const [id, p = '0'] = at.split(':');
    const st = ScrollTrigger.getById(id);
    if (!st) return null;
    return st.start + (st.end - st.start) * Math.min(1, Math.max(0, Number(p) || 0));
  };
  if (at !== null) {
    // Lazy routes register their scene's trigger after fonts are in, so an id can be missing on
    // the first tries: stamp "missing" only after the last retry, or a filming tool reads the
    // early stamp and gives up while the scene is still mounting (found on the /lab routes).
    const jump = (final = false) => {
      const y = resolveAt();
      if (y === null) { if (final) html.dataset.at = `missing:${at}`; return; }
      if (lenis) { lenis.resize(); lenis.scrollTo(y, { immediate: true, force: true }); }
      window.scrollTo(0, y);
      ScrollTrigger.update();
      html.dataset.at = String(Math.round(window.scrollY));
    };
    fontsReady.then(() => {
      ScrollTrigger.refresh();
      jump();
      [500, 1500, 3000].forEach((ms, i, all) => setTimeout(() => { ScrollTrigger.refresh(); jump(i === all.length - 1); }, ms));
    });
  }

  // Refresh once fonts are in (line breaks and heights change) and after late images. Measured:
  // ScrollTrigger's own load-refresh can run just before a late webfont swaps, leaving every
  // trigger below the text ~74 px late — so also refresh on each fonts 'loadingdone'.
  fontsReady.then(() => ScrollTrigger.refresh());
  const onFontsDone = () => requestAnimationFrame(() => safeRefresh());
  if (document.fonts && document.fonts.addEventListener) {
    document.fonts.addEventListener('loadingdone', onFontsDone);
    cleanups.push(() => document.fonts.removeEventListener('loadingdone', onFontsDone));
  }
  addEventListener('load', safeRefresh, { once: true });

  function destroy() {
    contexts.splice(0).forEach((c) => c.revert());
    cleanups.splice(0).forEach((fn) => fn());
    html.classList.remove('motion-ready', 'motion-reduced');
  }

  const engine = {
    gsap, ScrollTrigger, SplitText,
    get lenis() { return lenis; },
    REDUCE, CALM, FINE, RTL, DIR, PRERENDER,
    fontsReady, scene, splitLines, holdTimeline, reveal, playInView,
    getVelocity, safeRefresh, onWidthResize, lock, unlock, scrollTo, destroy,
  };
  return engine;
}

// Theme layers (move T-01): sections declare data-theme="light|dark|…"; fixed layers crossfade when
// a section's box crosses the middle of the screen. Only the fixed .theme-bg layers crossfade
// (opacity). Text colour switches instantly at flipDelay. Never transition color, or an inherited
// custom property, on html, body or any fixed chrome: each transition frame re-styles every
// inheriting descendant (measured at 4x CPU with 300 sections: about 340 ms of long tasks per flip
// with the transition, about 100 ms without; on a real build, 543 ms to 0 ms over two flips).
// CSS supplies one layer per theme:
//   <div class="theme-bg" aria-hidden="true"><i data-t="light"></i><i data-t="dark"></i></div>
//   .theme-bg{position:fixed;inset:0;z-index:-1} .theme-bg i{position:absolute;inset:0;opacity:0;transition:opacity .35s}
//   .theme-bg i.on{opacity:1}  and body.t-dark { --ink:…; --ground:… } etc.
// Sections are looked up on every update, so client-side route changes (new sections, or a first
// route with none) keep working without recreating the trigger.
export function themeLayers(engine, { sections = '[data-theme]', layers = '.theme-bg [data-t]', flipDelay = 200 } = {}) {
  const { ScrollTrigger, REDUCE } = engine;
  const bgs = [...document.querySelectorAll(layers)];
  if (!bgs.length) return null;
  let current = null;
  let z = 1;
  let timer = 0;
  const apply = (t) => {
    if (t === current) return;
    current = t;
    bgs.forEach((l) => { const on = l.dataset.t === t; if (on) l.style.zIndex = String(++z); l.classList.toggle('on', on); });
    clearTimeout(timer);
    timer = setTimeout(() => {
      [...document.body.classList].filter((c) => c.startsWith('t-')).forEach((c) => document.body.classList.remove(c));
      document.body.classList.add(`t-${t}`);
    }, REDUCE ? 0 : flipDelay);
  };
  const pick = () => {
    const mid = innerHeight / 2;
    let t = current;
    for (const s of document.querySelectorAll(sections)) {
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { t = s.dataset.theme; break; }
    }
    if (t) apply(t);
  };
  const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: pick, onRefresh: pick });
  pick();
  return st;
}
