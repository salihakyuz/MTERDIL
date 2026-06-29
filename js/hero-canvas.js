/* ============================================================
   Animated Hero Background — Cinematic Laser/Particle Scene
   ============================================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, raf;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ---- Particles ---- */
  const PARTICLE_COUNT = 140;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => mkParticle(true));

  function mkParticle(randomY) {
    return {
      x: Math.random() * (W || innerWidth),
      y: randomY ? Math.random() * (H || innerHeight) : (H || innerHeight) + 10,
      vx: (Math.random() - .5) * .4,
      vy: -(Math.random() * .6 + .15),
      r:  Math.random() * 1.8 + .4,
      a:  Math.random(),
      hue: Math.random() > .5 ? 185 : 270,  /* cyan vs purple */
    };
  }

  /* ---- Lasers ---- */
  const LASER_COUNT = 6;
  const lasers = Array.from({ length: LASER_COUNT }, (_, i) => mkLaser(i));

  function mkLaser(i) {
    return {
      angle: -Math.PI * .25 + (i / LASER_COUNT) * Math.PI * .7,
      speed: .0003 + Math.random() * .0004,
      phase: Math.random() * Math.PI * 2,
      hue:   i % 2 === 0 ? 185 : 275,
      alpha: .08 + Math.random() * .08,
      width: 1 + Math.random() * 1.5,
    };
  }

  /* ---- Light beams ---- */
  function drawBeams(t) {
    for (let b = 0; b < 3; b++) {
      const cx = W * (.25 + b * .25);
      const spread = .18 + Math.sin(t * .0003 + b * 1.5) * .06;
      const grad = ctx.createRadialGradient(cx, H, 0, cx, 0, H * .9);
      const a = .04 + Math.abs(Math.sin(t * .0005 + b)) * .05;
      const hue = b % 2 === 0 ? 185 : 270;
      grad.addColorStop(0, `hsla(${hue},100%,60%,${a})`);
      grad.addColorStop(1, 'transparent');
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, H);
      ctx.lineTo(cx - H * spread, 0);
      ctx.lineTo(cx + H * spread, 0);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ---- Fog layers ---- */
  function drawFog(t) {
    for (let f = 0; f < 2; f++) {
      const x = W * .5 + Math.sin(t * .00025 + f * 2) * W * .3;
      const g = ctx.createRadialGradient(x, H * .7, 0, x, H * .5, H * .6);
      g.addColorStop(0, 'rgba(20,20,40,0.18)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ---- Main draw ---- */
  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    /* Background gradient */
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   '#020208');
    bg.addColorStop(.5,  '#05050f');
    bg.addColorStop(1,   '#020206');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Fog */
    drawFog(t);

    /* Beams */
    drawBeams(t);

    /* Lasers */
    lasers.forEach(l => {
      const a = l.angle + Math.sin(t * l.speed + l.phase) * .25;
      const len = Math.max(W, H) * 1.5;
      const ox = W * .5, oy = H;
      ctx.save();
      ctx.strokeStyle = `hsla(${l.hue},100%,65%,${l.alpha})`;
      ctx.lineWidth   = l.width;
      ctx.shadowColor = `hsla(${l.hue},100%,65%,.6)`;
      ctx.shadowBlur  = 12;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + Math.cos(a) * len, oy + Math.sin(a) * len);
      ctx.stroke();
      ctx.restore();
    });

    /* Particles */
    particles.forEach((p, i) => {
      p.x += p.vx + Math.sin(t * .001 + i) * .15;
      p.y += p.vy;
      p.a += .008;
      if (p.a > Math.PI * 2) p.a = 0;
      const alpha = .4 + .5 * Math.sin(p.a);
      if (p.y < -10) Object.assign(particles[i], mkParticle(false));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,70%,${alpha})`;
      ctx.shadowColor = `hsla(${p.hue},100%,70%,.8)`;
      ctx.shadowBlur  = 6;
      ctx.fill();
    });

    /* Horizon glow */
    const hg = ctx.createLinearGradient(0, H * .6, 0, H);
    hg.addColorStop(0, 'transparent');
    hg.addColorStop(1, 'rgba(0,229,255,0.06)');
    ctx.fillStyle = hg;
    ctx.fillRect(0, 0, W, H);

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);

  /* Subtle mouse parallax */
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX / innerWidth  - .5) * 8;
    const dy = (e.clientY / innerHeight - .5) * 4;
    canvas.style.transform = `translate(${dx}px,${dy}px)`;
  }, { passive: true });
})();
