(function () {
  var D = window.SK;
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isHome = document.body.dataset.page === 'home';
  var base = isHome ? '' : 'index.html';
  root.classList.remove('no-js');
  if (reduced) root.classList.add('reduced');

  var ARROW = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10h14M11 4l6 6-6 6"/></svg>';
  var OUT = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 14L14 6M7 6h7v7"/></svg>';
  window.SK_ICONS = { ARROW: ARROW, OUT: OUT };

  function catUrl(c) { return 'kategorija.html?k=' + c.key; }
  function plural(n) {
    var m = n % 100;
    if (m === 1) return n + ' izdelek';
    if (m === 2) return n + ' izdelka';
    if (m === 3 || m === 4) return n + ' izdelki';
    return n + ' izdelkov';
  }
  window.SK_util = { catUrl: catUrl, plural: plural };

  /* nav links on subpages point back home */
  document.querySelectorAll('[data-home]').forEach(function (a) {
    a.setAttribute('href', base + a.getAttribute('data-home'));
  });

  /* mega menu + mobile category list */
  var mega = document.querySelector('.mega');
  var scrim = document.querySelector('.mega-scrim');
  var trig = document.querySelector('[data-mega]');
  var hdr = document.querySelector('.hdr');
  if (mega) {
    mega.innerHTML = D.cats.map(function (c) {
      return '<a href="' + catUrl(c) + '"><div class="mi-img"><img src="assets/img/' + c.key + '.jpg" alt="" loading="lazy"></div><div class="mi-t">' + c.name + '</div><div class="mi-c">' + plural(c.count) + '</div></a>';
    }).join('');
    var t;
    function open() { clearTimeout(t); mega.classList.add('open'); scrim.classList.add('open'); hdr.classList.add('mega-open'); trig.setAttribute('aria-expanded', 'true'); }
    function close() { t = setTimeout(function () { mega.classList.remove('open'); scrim.classList.remove('open'); hdr.classList.remove('mega-open'); trig.setAttribute('aria-expanded', 'false'); }, 120); }
    trig.addEventListener('mouseenter', open);
    trig.addEventListener('mouseleave', close);
    trig.addEventListener('click', function () { mega.classList.contains('open') ? close() : open(); });
    mega.addEventListener('mouseenter', open);
    mega.addEventListener('mouseleave', close);
    scrim.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
  var mm = document.querySelector('.mmenu');
  if (mm) {
    mm.querySelector('.mm-cats').innerHTML = D.cats.map(function (c) { return '<a href="' + catUrl(c) + '">' + c.name + '</a>'; }).join('');
    document.querySelector('.burger').addEventListener('click', function () { mm.classList.add('open'); });
    mm.querySelector('.mm-close').addEventListener('click', function () { mm.classList.remove('open'); });
    mm.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { mm.classList.remove('open'); }); });
  }

  /* footer category links */
  var fc = document.querySelector('[data-foot-cats]');
  if (fc) fc.innerHTML = D.cats.slice(0, 6).map(function (c) { return '<li><a href="' + catUrl(c) + '">' + c.name + '</a></li>'; }).join('');
  var fc2 = document.querySelector('[data-foot-cats2]');
  if (fc2) fc2.innerHTML = D.cats.slice(6).map(function (c) { return '<li><a href="' + catUrl(c) + '">' + c.name + '</a></li>'; }).join('');

  /* page specific render before animations */
  if (window.SK_page) window.SK_page();

  /* header state */
  var lastY = 0;
  function onScroll(y) {
    var solidAt = isHome ? 40 : 10;
    hdr.classList.toggle('is-solid', y > solidAt);
    var hide = y > lastY && y > 500 && !mega.classList.contains('open');
    hdr.classList.toggle('is-hidden', hide);
    lastY = y;
  }

  if (reduced || !window.gsap) {
    window.addEventListener('scroll', function () { onScroll(window.scrollY); }, { passive: true });
    onScroll(window.scrollY);
    var l = document.querySelector('.loader'); if (l) l.remove();
    if (window.SK_static) window.SK_static();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  var lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', function (e) { ScrollTrigger.update(); onScroll(e.scroll); });
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  window.SK_lenis = lenis;

  document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').split('#')[1];
      var el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: id === 'top' ? 0 : -20, duration: 1.4 });
    });
  });

  /* generic reveals */
  gsap.utils.toArray('.rv').forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: +(el.dataset.d || 0), scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* mini parallax inside frames */
  gsap.utils.toArray('[data-par]').forEach(function (el) {
    var amt = +el.dataset.par || 8;
    gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  if (window.SK_anim) window.SK_anim(gsap, ScrollTrigger, lenis);

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
