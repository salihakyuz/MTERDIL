/* ============================================================
   METE ERDİL — DJ PORTFOLIO  |  Shared JS
   ============================================================ */

/* ---- Custom Cursor ---- */
(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const hoverEls = 'a, button, .portfolio-card, .g-thumb, .filter-btn, .social-btn, .back-top';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  function loop() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * .14;
    ry += (my - ry) * .14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ---- Navbar ---- */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  const burger = document.querySelector('.nav-hamburger');
  const links  = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
      burger.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.classList.remove('open');
    }));
  }
})();

/* ---- Scroll Reveal ---- */
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .12 });
  els.forEach(el => io.observe(el));
})();

/* ---- Animated Counters ---- */
(function () {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      function frame(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(p * p * target) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      io.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(c => io.observe(c));
})();

/* ---- Back to Top ---- */
document.querySelectorAll('.back-top').forEach(btn => {
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

/* ---- Page transition links ---- */
(function () {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;
  const logo = overlay.querySelector('.page-transition-logo');

  document.querySelectorAll('a[data-transition]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      if (logo) { logo.style.opacity = '1'; logo.style.transform = 'scale(1)'; }
      setTimeout(() => { location.href = href; }, 500);
    });
  });

  if (overlay.style.opacity !== '0') {
    overlay.style.transition = 'opacity .5s';
    requestAnimationFrame(() => { overlay.style.opacity = '0'; });
    setTimeout(() => { overlay.style.display = 'none'; }, 600);
  }
})();

/* ---- Contact Form ---- */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const success = document.getElementById('form-success');

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(f => {
      const wrap = f.closest('.form-field');
      if (!f.value.trim()) {
        wrap.classList.add('error'); valid = false;
      } else {
        wrap.classList.remove('error');
      }
    });
    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.closest('.form-field').classList.add('error'); valid = false;
    }
    if (!valid) return;

    const btn = form.querySelector('.form-submit');
    btn.classList.add('loading');
    setTimeout(() => {
      btn.classList.remove('loading');
      form.reset();
      if (success) success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1400);
  });

  form.querySelectorAll('[required]').forEach(f => {
    f.addEventListener('input', () => f.closest('.form-field').classList.remove('error'));
  });
})();
