/* ============================================================
   BACKGROUND MATH CANVAS
   ============================================================ */
const bgCanvas = document.getElementById('math-bg');
const bgCtx = bgCanvas.getContext('2d');
let particles = [];
const symbols = ['∑', '∫', 'π', '∞', '∂', '√', 'λ', 'θ', 'Δ', '∇', 'e', 'i', 'x²', 'y²', 'dx', 'dy', 'sin', 'cos'];

function initCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  particles = [];
  // Reduced number of particles on mobile to save battery
  const numParticles = Math.min(35, Math.floor(window.innerWidth / 25));
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 20 + 12,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      opacity: Math.random() * 0.15 + 0.05,
      rotation: (Math.random() - 0.5) * 0.5,
      vr: (Math.random() - 0.5) * 0.005
    });
  }
}

function drawCanvas() {
  if (document.hidden) { requestAnimationFrame(drawCanvas); return; }
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  const isLight = document.documentElement.dataset.theme === 'light';
  const color = isLight ? '0,0,0' : '255,255,255';

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.vr;

    if (p.x < -50) p.x = bgCanvas.width + 50;
    if (p.x > bgCanvas.width + 50) p.x = -50;
    if (p.y < -50) p.y = bgCanvas.height + 50;
    if (p.y > bgCanvas.height + 50) p.y = -50;

    bgCtx.save();
    bgCtx.translate(p.x, p.y);
    bgCtx.rotate(p.rotation);
    bgCtx.font = `${p.size}px "Instrument Serif", Georgia, serif`;
    bgCtx.fillStyle = `rgba(${color}, ${p.opacity})`;
    bgCtx.textAlign = 'center';
    bgCtx.textBaseline = 'middle';
    bgCtx.fillText(p.symbol, 0, 0);
    bgCtx.restore();
  });

  requestAnimationFrame(drawCanvas);
}

initCanvas();
drawCanvas();
window.addEventListener('resize', initCanvas);
