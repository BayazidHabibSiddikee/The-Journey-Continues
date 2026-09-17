/* ============================================================
   BAYAZID HS — PORTFOLIO · main.js
   nav / reveal / typing / counters / lightbox / filters / videos
   ============================================================ */
(function () {
  'use strict';

  /* ---------- active nav link ---------- */
  (function setActiveNav() {
    var page = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === page) a.classList.add('is-active');
    });
  })();

  /* ---------- mobile burger ---------- */
  var burger = document.querySelector('.nav__burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
      burger.textContent = links.classList.contains('open') ? '\u2715' : '\u2630';
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- hero typing loop ---------- */
  var typed = document.getElementById('typed');
  if (typed) {
    var phrases = [
      'whoami \u2192 mechatronics engineer @ RUET',
      'cat mission.txt \u2192 build the machine, not be the cog',
      'ls ~/built \u2192 Marin_OS \u00b7 SwordFish \u00b7 CNC-Plotter \u00b7 SwordWM',
      'pacman -S curiosity --noconfirm',
      'ssh bayazid@the-journey-continues',
      'git commit -m "still learning, still building"'
    ];
    var pi = 0, ci = 0, deleting = false;
    (function tick() {
      var cur = phrases[pi];
      typed.textContent = deleting ? cur.slice(0, --ci) : cur.slice(0, ++ci);
      var delay = deleting ? 26 : 52;
      if (!deleting && ci === cur.length) { delay = 2100; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 420; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var dur = 1400, t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { co.observe(c); });
    } else { counters.forEach(animateCount); }
  }

  /* ---------- skill bars ---------- */
  var bars = document.querySelectorAll('.bar i');
  if (bars.length && 'IntersectionObserver' in window) {
    var bo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.width = e.target.getAttribute('data-w') + '%';
          bo.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { bo.observe(b); });
  } else {
    bars.forEach(function (b) { b.style.width = (b.getAttribute('data-w') || 0) + '%'; });
  }

  /* ---------- lightbox (RUET gallery + certificates) ----------
     Sources: a.lightbox-item anchors (href = full image, data-cap = caption). */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.cap');
    var items = Array.prototype.slice.call(document.querySelectorAll('a.lightbox-item'));
    var current = 0;

    function show(i) {
      current = (i + items.length) % items.length;
      var it = items[current];
      lbImg.src = it.getAttribute('href');
      lbImg.alt = it.getAttribute('data-cap') || '';
      if (lbCap) lbCap.textContent = it.getAttribute('data-cap') || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      lbImg.src = '';
      document.body.style.overflow = '';
    }
    items.forEach(function (it, idx) {
      it.addEventListener('click', function (ev) { ev.preventDefault(); show(idx); });
    });
    lb.querySelector('.x').addEventListener('click', close);
    var prev = lb.querySelector('.nv.prev'), next = lb.querySelector('.nv.next');
    if (prev) prev.addEventListener('click', function () { show(current - 1); });
    if (next) next.addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (ev) { if (ev.target === lb) close(); });
    document.addEventListener('keydown', function (ev) {
      if (!lb.classList.contains('open')) return;
      if (ev.key === 'Escape') close();
      if (ev.key === 'ArrowLeft') show(current - 1);
      if (ev.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- certificate category filter ---------- */
  var filterWrap = document.querySelector('.filters');
  if (filterWrap) {
    var chips = filterWrap.querySelectorAll('.chip');
    var certCards = document.querySelectorAll('.cert');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var f = chip.getAttribute('data-filter');
        certCards.forEach(function (card) {
          var match = (f === 'all' || card.getAttribute('data-cat') === f);
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ---------- YouTube click-to-play (privacy: nocookie, loads only on demand) ---------- */
  document.querySelectorAll('.vid').forEach(function (v) {
    var thumb = v.querySelector('.vid__thumb');
    if (!thumb) return;
    thumb.addEventListener('click', function () {
      var id = thumb.getAttribute('data-id');
      if (!id) return;
      thumb.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '?autoplay=1&rel=0" title="Project video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>';
    });
  });

  /* ---------- subtle parallax on hero terminal ---------- */
  var term = document.querySelector('.term');
  if (term && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY || 0;
      if (y < 900) term.style.transform = 'translateY(' + (y * 0.05) + 'px)';
    }, { passive: true });
  }
})();
