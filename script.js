/* GLASSVERSE — interactions (vanilla JS) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Toast helper ---------- */
  var toast = $('#toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  /* ---------- Mobile nav ---------- */
  var toggle = $('#navToggle'), links = $('#navLinks');
  function setMenu(open) {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
  $$('a', links).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Typing effect ---------- */
  var phrases = ['Cybersecurity Enthusiast', 'Python Developer', 'Web Developer', 'AI Explorer'];
  var typingEl = $('#typing');
  if (reduceMotion) {
    typingEl.textContent = phrases[0];
  } else {
    var p = 0, c = 0, deleting = false;
    (function tick() {
      var word = phrases[p];
      typingEl.textContent = word.slice(0, c);
      var delay = deleting ? 45 : 90;
      if (!deleting && c === word.length) { deleting = true; delay = 1400; }
      else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 350; }
      else { c += deleting ? -1 : 1; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      ro.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Active nav highlighting ---------- */
  var navAnchors = $$('a', links);
  var sectionIds = navAnchors.map(function (a) { return a.getAttribute('href').slice(1); });
  function updateActive() {
    var y = window.scrollY + 140, current = sectionIds[0];
    sectionIds.forEach(function (id) {
      var s = document.getElementById(id);
      if (s && s.offsetTop <= y) current = id;
    });
    /* Treat sections without their own nav link (soft skills, interests) as part of the previous one */
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = 'contact';
    navAnchors.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + current;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------- Back to top ---------- */
  var toTop = $('#toTop');
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      toTop.classList.toggle('show', window.scrollY > 600);
      updateActive();
      ticking = false;
    });
  }, { passive: true });
  updateActive();

  /* ---------- Placeholder project links ---------- */
  $$('.placeholder-link').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      showToast(a.getAttribute('data-msg') || 'Link coming soon.');
    });
  });

  /* ---------- Project card tilt (pointer devices only) ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    $$('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- Profile photo: tilt on hover, spin on click ---------- */
  var photo = $('#photo');
  if (photo && !reduceMotion) {
    if (window.matchMedia('(hover: hover)').matches) {
      photo.addEventListener('mousemove', function (e) {
        if (photo.classList.contains('spin')) return;
        var r = photo.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        photo.style.transform = 'rotateX(' + (-y * 10) + 'deg) rotateY(' + (x * 10) + 'deg)';
      });
      photo.addEventListener('mouseleave', function () { photo.style.transform = ''; });
    }
    photo.addEventListener('click', function () {
      if (photo.classList.contains('spin')) return;
      photo.style.transform = '';
      photo.classList.add('spin');
      setTimeout(function () { photo.classList.remove('spin'); }, 1000);
    });
  }

  /* ---------- Contact form ----------
     No backend is configured, so the form validates input and then opens the
     visitor's email app with the message pre-filled (mailto). It never claims
     a message was "sent". To use a real service, see README.md. */
  var form = $('#contactForm'), status = $('#formStatus');
  var TO = 'sanskarkulkarni9825@gmail.com';
  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Enter your name (at least 2 characters).'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Write a message of at least 10 characters.'; }
  };
  function check(field) {
    var msg = rules[field.name](field.value);
    field.classList.toggle('invalid', !!msg);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    $('#' + field.id + '-err').textContent = msg;
    return !msg;
  }
  ['name', 'email', 'message'].forEach(function (id) {
    var f = document.getElementById(id);
    f.addEventListener('blur', function () { check(f); });
    f.addEventListener('input', function () { if (f.classList.contains('invalid')) check(f); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = ['name', 'email', 'message'].map(function (id) { return document.getElementById(id); });
    var results = fields.map(check);
    var firstBad = fields[results.indexOf(false)];
    if (firstBad) { firstBad.focus(); status.textContent = 'Please fix the highlighted fields.'; return; }
    var subject = encodeURIComponent('Portfolio message from ' + fields[0].value.trim());
    var body = encodeURIComponent(fields[2].value.trim() + '\n\nFrom: ' + fields[0].value.trim() + ' <' + fields[1].value.trim() + '>');
    status.textContent = 'Opening your email app. Press send there to deliver your message.';
    window.location.href = 'mailto:' + TO + '?subject=' + subject + '&body=' + body;
  });

  /* ---------- Particle background ---------- */
  var canvas = $('#particles');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d'), W, H, dots = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
    var colors = ['34,211,238', '59,130,246', '139,92,246'];
    function resize() {
      W = canvas.width = innerWidth * dpr; H = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
      var n = Math.min(70, Math.floor(innerWidth / 18));
      dots = [];
      for (var i = 0; i < n; i++) dots.push({
        x: Math.random() * W, y: Math.random() * H,
        r: (Math.random() * 1.6 + .6) * dpr,
        vx: (Math.random() - .5) * .25 * dpr, vy: (Math.random() - .5) * .25 * dpr,
        c: colors[i % 3]
      });
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283);
        ctx.fillStyle = 'rgba(' + d.c + ',.7)'; ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var dx = d.x - dots[j].x, dy = d.y - dots[j].y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 * dpr) {
            ctx.strokeStyle = 'rgba(' + d.c + ',' + (0.14 * (1 - dist / (130 * dpr))) + ')';
            ctx.lineWidth = dpr * .6;
            ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    resize(); frame();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 200); });
  }
})();
