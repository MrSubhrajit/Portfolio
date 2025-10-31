/* Interactive particle/starfield background
   - Canvas resizes automatically
   - Particles react to mouse movement
   - Lightweight and performant
*/

(() => {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = innerWidth);
  let height = (canvas.height = innerHeight);
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = width * DPR;
  canvas.height = height * DPR;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(DPR, DPR);

  // Particle settings
  const PARTICLE_COUNT = Math.floor((width * height) / 50000) + 50; // scales with screen
  const particles = [];
  const mouse = { x: width / 2, y: height / 2, maxDist: 120 };

  function rand(min, max) { return Math.random() * (max - min) + min; }

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.2, 0.2),
      size: rand(0.6, 2.4),
      baseAlpha: rand(0.06, 0.28),
    });
  }

  // handle resize
  window.addEventListener('resize', () => {
    width = canvas.width = innerWidth;
    height = canvas.height = innerHeight;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(DPR, DPR);
  });

  // mouse move
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  // draw loop
  function draw() {
    // slight translucent fill to create trailing effect
    ctx.fillStyle = 'rgba(8,12,16,0.25)';
    ctx.fillRect(0, 0, width, height);

    // draw connections and particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // move
      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // react to mouse: gentle attraction/repel
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.maxDist) {
        const force = (1 - dist / mouse.maxDist) * 0.6;
        p.vx -= (dx / dist) * force * 0.025;
        p.vy -= (dy / dist) * force * 0.025;
      } else {
        // slight damping to return to gentle motion
        p.vx *= 0.995;
        p.vy *= 0.995;
      }

      // draw particle
      ctx.beginPath();
      ctx.fillStyle = `rgba(88,166,255,${p.baseAlpha})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // lines to nearby particles (only draw some for performance)
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx2 = q.x - p.x;
        const dy2 = q.y - p.y;
        const dist2 = dx2 * dx2 + dy2 * dy2;
        if (dist2 < 16000) { // threshold squared (e.g., 126^2 ≈ 15876)
          const distNorm = Math.sqrt(dist2);
          const alpha = (1 - distNorm / 126) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(88,166,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  // kick off
  draw();

  // small utility to slowly nudge particle velocities to keep lively
  setInterval(() => {
    for (let p of particles) {
      p.vx += rand(-0.05, 0.05);
      p.vy += rand(-0.05, 0.05);
      // clamp velocity
      p.vx = Math.max(-0.8, Math.min(0.8, p.vx));
      p.vy = Math.max(-0.8, Math.min(0.8, p.vy));
    }
  }, 2200);

  // set year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
