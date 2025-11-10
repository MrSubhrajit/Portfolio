/* Tech-themed background with particle network and cursor effects
   - Creates a dynamic particle network that forms connections
   - Adds a custom cursor with trailing effect
   - Includes floating code symbols and tech elements
   - Modern tech aesthetic with interactive elements
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

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });

  // Tech element settings - adjust for device size
  const isMobile = window.innerWidth <= 768;
  const PARTICLE_COUNT = isMobile ? 50 : 100; // Fewer particles on mobile for performance
  const CODE_COUNT = isMobile ? 8 : 15; // Fewer code elements on mobile
  const particles = [];
  const codeElements = [];
  const cursorTrails = [];
  const mouse = { x: width / 2, y: height / 2, maxDist: isMobile ? 100 : 150 };
  const cursor = { x: width / 2, y: height / 2 };

  // Tech symbols to display
  const techSymbols = ['{', '}', '()', '[]', '<>', '</>', '=>', '===', '&&', '||', '++', '--', '==', '!=', '<=', '>='];
  const techColors = ['#58a6ff', '#79c0ff', '#a5d6ff', '#1f6feb', '#8250df', '#bb8cff', '#d2a8ff'];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  // Create particle class for network effect
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = rand(0, width);
      this.y = rand(0, height);
      this.size = rand(1, 2);
      this.baseSize = this.size;
      this.speedX = rand(-0.5, 0.5);
      this.speedY = rand(-0.5, 0.5);
      this.color = techColors[Math.floor(rand(0, techColors.length))];
      this.pulsePhase = rand(0, Math.PI * 2);
      this.pulseSpeed = rand(0.01, 0.03);
    }

    update() {
      // Move particle
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Pulse effect
      this.pulsePhase += this.pulseSpeed;
      this.size = this.baseSize + Math.sin(this.pulsePhase) * 0.5;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // React to mouse: gentle attraction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.maxDist) {
        const force = (1 - dist / mouse.maxDist) * 0.05;
        this.speedX += (dx / dist) * force;
        this.speedY += (dy / dist) * force;
        
        // Limit speed
        const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (speed > 1) {
          this.speedX = (this.speedX / speed) * 1;
          this.speedY = (this.speedY / speed) * 1;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      
      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Create code element class
  class CodeElement {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = rand(0, width);
      this.y = rand(-height, 0); // Start above the viewport
      this.speedY = rand(0.5, 2);
      this.size = rand(isMobile ? 12 : 14, isMobile ? 16 : 20);
      this.opacity = rand(0.1, 0.4);
      this.symbol = techSymbols[Math.floor(rand(0, techSymbols.length))];
      this.color = techColors[Math.floor(rand(0, techColors.length))];
      this.rotation = rand(-0.2, 0.2);
    }

    update() {
      this.y += this.speedY;
      
      // Reset if out of bounds
      if (this.y > height + 50) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px monospace`;
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  // Create cursor trail class
  class CursorTrail {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = rand(2, 6);
      this.speedX = rand(-1, 1);
      this.speedY = rand(-1, 1);
      this.life = 1.0;
      this.decay = rand(0.01, 0.03);
      this.color = techColors[Math.floor(rand(0, techColors.length))];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size *= 0.98;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      
      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Initialize code elements
  for (let i = 0; i < CODE_COUNT; i++) {
    codeElements.push(new CodeElement());
  }

  // Draw connections between particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[j].x - particles[i].x;
        const dy = particles[j].y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.5;
          ctx.strokeStyle = `rgba(88, 166, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Draw cursor effect
  function drawCursor() {
    // Draw cursor trails
    for (let i = cursorTrails.length - 1; i >= 0; i--) {
      const trail = cursorTrails[i];
      trail.update();
      trail.draw();
      
      if (trail.life <= 0 || trail.size <= 0.5) {
        cursorTrails.splice(i, 1);
      }
    }
    
    // Draw main cursor
    ctx.save();
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Inner circle
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#58a6ff';
    ctx.fill();
    ctx.restore();
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
    
    // Check if device type changed
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      location.reload(); // Reload to adjust particle count
    }
    
    // Reset particles positions
    for (let particle of particles) {
      particle.x = rand(0, width);
      particle.y = rand(0, height);
    }
  });

  // mouse move
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    
    // Add cursor trail
    if (Math.random() > 0.3) { // Don't add on every move for performance
      cursorTrails.push(new CursorTrail(cursor.x, cursor.y));
    }
  });
  
  // touch move for mobile
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      cursor.x = e.touches[0].clientX;
      cursor.y = e.touches[0].clientY;
      
      // Add cursor trail
      if (Math.random() > 0.3) {
        cursorTrails.push(new CursorTrail(cursor.x, cursor.y));
      }
    }
  }, { passive: true });

  // draw loop
  function draw() {
    // Clear canvas with slight transparency for trail effect
    ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw connections
    drawConnections();
    
    // Update and draw particles
    for (let particle of particles) {
      particle.update();
      particle.draw();
    }
    
    // Update and draw code elements
    for (let element of codeElements) {
      element.update();
      element.draw();
    }
    
    // Draw cursor effect
    drawCursor();

    requestAnimationFrame(draw);
  }

  // kick off
  draw();

  // set year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
