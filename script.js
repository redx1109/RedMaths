let lastFocus = null;
/* ============================================================
   DATA & LEVELS
   ============================================================ */
const LEVELS = { 
  '00':'Origin',
  '01':'Structure',
  '02':'Dynamics',
  '03':'Abstraction',
  '04':'Frontier'
};
const LEVEL_ORDER = ['00','01','02','03','04'];

const LESSONS = [
  /* 00 · Origin (7) */
  { id:'f1', level:'00', title:'Place value', intuition:'A digit means different things depending on where it sits.', formula:'247 = 2\\cdot10^{2}+4\\cdot10^{1}+7', needs:[] },
  { id:'f2', level:'00', title:'Addition', intuition:'Adding is combining. Subtraction is adding the opposite.', formula:'a-b = a+(-b)', needs:['f1'] },
  { id:'f3', level:'00', title:'Multiplication', intuition:'Repeated addition. Commutative and distributes over addition.', formula:'a\\times b = b\\times a', needs:['f2'] },
  { id:'f4', level:'00', title:'Fractions', intuition:'A fraction is a division you have not performed yet.', formula:'\\frac{a}{b} = a \\div b', needs:['f3'] },
  { id:'f5', level:'00', title:'Negative numbers', intuition:'Every number has an opposite that cancels it.', formula:'a+(-a) = 0', needs:['f2'] },
  { id:'f6', level:'00', title:'Variables', intuition:'A letter is a placeholder for a number you have not chosen yet.', formula:'3x+2x = 5x', needs:['f4','f5'] },
  { id:'f7', level:'00', title:'Linear equations', intuition:'Undo operations in reverse until the variable stands alone.', formula:'ax+b=0 \\Rightarrow x=-\\frac{b}{a}', needs:['f6'] },

  /* 01 · Structure (10) */
  { id:'b1', level:'01', title:'Coordinates', intuition:'Two numbers pin down a point in the plane.', formula:'(x,y) \\in \\mathbb{R}^{2}', needs:['f5'] },
  { id:'b2', level:'01', title:'Lines & slope', intuition:'Slope is how fast y changes per unit of x.', formula:'y = mx+c', needs:['b1','f7'] },
  { id:'b3', level:'01', title:'Functions', intuition:'A machine: one input, exactly one output.', formula:'f : A \\to B', needs:['f6'] },
  { id:'b4', level:'01', title:'Quadratics', intuition:'A parabola is the graph of a square.', formula:'x = \\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}', needs:['f7'] },
  { id:'b5', level:'01', title:'Exponents', intuition:'An exponent counts repeated multiplication.', formula:'a^{m}a^{n} = a^{m+n}', needs:['f3'] },
  { id:'b6', level:'01', title:'Logarithms', intuition:'Logs undo powers and turn products into sums.', formula:'\\log_b(xy) = \\log_b x+\\log_b y', needs:['b5'] },
  { id:'b7', level:'01', title:'Trigonometry', intuition:'Sine and cosine are ratios of sides in a right triangle.', formula:'\\sin^{2}\\theta+\\cos^{2}\\theta = 1', needs:['b1'] },
  { id:'b8', level:'01', title:'Sets', intuition:'A set is a collection with no order and no repeats.', formula:'A\\cup B,\\;A\\cap B,\\;A\\setminus B', needs:['f1'] },
  { id:'b9', level:'01', title:'Counting', intuition:'The product rule does most of the work.', formula:'n! = n(n-1)\\cdots 2\\cdot1', needs:['f3'] },
  { id:'b10', level:'01', title:'Probability', intuition:'Favourable outcomes over possible outcomes.', formula:'P(A) = \\frac{|A|}{|\\Omega|}', needs:['b8','b9'] },

  /* 02 · Dynamics (13) */
  { id:'i1', level:'02', title:'Limits', intuition:'A limit is where a function is heading, not where it lands.', formula:'\\lim_{x\\to a} f(x) = L', needs:['b3','b6'] },
  { id:'i2', level:'02', title:'Continuity', intuition:'Draw it without lifting your pen.', formula:'\\lim_{x\\to a} f(x) = f(a)', needs:['i1'] },
  { id:'i3', level:'02', title:'Derivative', intuition:'Zoom in far enough and a smooth curve looks like a line.', formula:"f'(x) = \\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}", needs:['i1','b2'] },
  { id:'i4', level:'02', title:'Chain rule', intuition:'Differentiate outside, keep inside, times inside derivative.', formula:"(f\\circ g)'(x) = f'(g(x))\\,g'(x)", needs:['i3','b4'] },
  { id:'i5', level:'02', title:'Integral', intuition:'Slice area into slivers and add them up.', formula:'\\int_{a}^{b} f(x)\\,dx', needs:['i3','b4'] },
  { id:'i6', level:'02', title:'Fundamental theorem', intuition:'Differentiation and integration are inverse.', formula:"\\int_{a}^{b} f'(x)\\,dx = f(b)-f(a)", needs:['i3','i5'] },
  { id:'i7', level:'02', title:'Vectors', intuition:'An arrow with length and direction.', formula:'\\mathbf{v} = (v_1,v_2,\\dots,v_n)', needs:['b1'] },
  { id:'i8', level:'02', title:'Matrices', intuition:'A function on space that moves, stretches, and rotates.', formula:'A\\mathbf{x}=\\mathbf{b}', needs:['i7'] },
  { id:'i9', level:'02', title:'Systems of equations', intuition:'Many equations, many unknowns. Gaussian elimination does the work.', formula:'A\\mathbf{x}=\\mathbf{b}', needs:['i8','f7'] },
  { id:'i10', level:'02', title:'Sequences', intuition:'An infinite list indexed by the naturals.', formula:'(a_n)_{n\\ge1}', needs:['i1'] },
  { id:'i11', level:'02', title:'Series', intuition:'Infinite sums can converge — when terms shrink fast enough.', formula:'\\sum_{n=1}^{\\infty}\\frac{1}{n^{2}} = \\frac{\\pi^{2}}{6}', needs:['i10'] },
  { id:'i12', level:'02', title:'Complex numbers', intuition:'Adjoin i, whose square is -1, and the line becomes a plane.', formula:'i^{2} = -1', needs:['b5'] },
  { id:'i13', level:'02', title:'ε–δ analysis', intuition:'"Arbitrarily close" made rigorous.', formula:'\\forall\\varepsilon>0\\;\\exists\\delta>0:|x-a|<\\delta\\Rightarrow|f(x)-L|<\\varepsilon', needs:['i1'] },

  /* 03 · Abstraction (12) */
  { id:'a1', level:'03', title:'Groups', intuition:'Strip away the numbers and keep the structure of combining.', formula:'a(bc)=(ab)c,\\;ae=a,\\;aa^{-1}=e', needs:['i8'] },
  { id:'a2', level:'03', title:'Rings', intuition:'Add multiplication to a group and you get a ring.', formula:'(R,+,\\cdot)\\;\\text{with distributivity}', needs:['a1'] },
  { id:'a3', level:'03', title:'Fields', intuition:'A ring where every nonzero element is invertible.', formula:'\\mathbb{Z}/p\\mathbb{Z}\\;\\text{is a field}\\iff p\\;\\text{prime}', needs:['a2'] },
  { id:'a4', level:'03', title:'Vector spaces', intuition:'Abstract vectors: anything you can add and scale.', formula:'\\alpha\\mathbf{u}+\\beta\\mathbf{v}\\in V', needs:['i8','i9'] },
  { id:'a5', level:'03', title:'Linear maps', intuition:'Maps that preserve addition and scaling.', formula:'T(\\alpha u+\\beta v) = \\alpha T(u)+\\beta T(v)', needs:['a4'] },
  { id:'a6', level:'03', title:'Eigenvalues', intuition:'Directions that survive a linear map unchanged.', formula:'A\\mathbf{v}=\\lambda\\mathbf{v}', needs:['a5'] },
  { id:'a7', level:'03', title:'Topology', intuition:'Continuity without distance.', formula:"f\\;\\text{continuous}\\iff f^{-1}(U)\\;\\text{open}", needs:['i13','b8'] },
  { id:'a8', level:'03', title:'Metric spaces', intuition:'A distance function obeying three obvious axioms.', formula:'d(x,y)\\le d(x,z)+d(z,y)', needs:['a7'] },
  { id:'a9', level:'03', title:'Compactness', intuition:'Every open cover has a finite subcover.', formula:'\\text{every open cover has a finite subcover}', needs:['a8'] },
  { id:'a10', level:'03', title:'Complex analysis', intuition:'Complex differentiability is stricter — and buys enormous power.', formula:'\\oint_\\gamma f(z)\\,dz = 0', needs:['i6','i12'] },
  { id:'a11', level:'03', title:'Measure theory', intuition:'Not every set has a length, but the measurable ones add up.', formula:'\\mu\\Big(\\bigcup_n A_n\\Big) = \\sum_n \\mu(A_n)', needs:['i13','i11'] },
  { id:'a12', level:'03', title:'Multivariable calculus', intuition:'Functions of several variables. Derivatives become vectors.', formula:'\\nabla f = (\\partial_{x_1}f,\\dots,\\partial_{x_n}f)', needs:['i6'] },

  /* 04 · Frontier (8) */
  { id:'r1', level:'04', title:'Algebraic geometry', intuition:'Geometry as the zero sets of polynomials.', formula:'V(I) = \\{x : f(x)=0\\;\\forall f\\in I\\}', needs:['a3'] },
  { id:'r2', level:'04', title:'Homological algebra', intuition:'Measure how far a sequence is from exact.', formula:'\\cdots\\to C_{n+1}\\xrightarrow{\\partial}C_n\\to\\cdots', needs:['a3'] },
  { id:'r3', level:'04', title:'Lie groups', intuition:'A smooth group. Near the identity it is a Lie algebra.', formula:'[X,Y] = XY-YX', needs:['a1','a8'] },
  { id:'r4', level:'04', title:'Representation theory', intuition:'Turn abstract groups into matrices so you can compute.', formula:'\\rho : G\\to\\mathrm{GL}(V)', needs:['a1','a5'] },
  { id:'r5', level:'04', title:'Riemannian geometry', intuition:'A smooth manifold with a metric on each tangent space.', formula:'ds^{2} = g_{ij}\\,dx^{i}dx^{j}', needs:['a12','a8'] },
  { id:'r6', level:'04', title:'Functional analysis', intuition:'Linear operators on infinite-dimensional spaces.', formula:'\\|Tx\\|\\le C\\|x\\|', needs:['a5','a11'] },
  { id:'r7', level:'04', title:'Probability theory', intuition:'Measure theory applied to events.', formula:'P\\Big(\\bigcup_n A_n\\Big) = \\sum_n P(A_n)', needs:['a11','b10'] },
  { id:'r8', level:'04', title:'Stochastic processes', intuition:'Random variables indexed by time.', formula:'\\mathbb{E}[X_{t+s}\\mid\\mathcal{F}_s] = X_s', needs:['r7'] }
];
const unlocks = {};
LESSONS.forEach(l => l.needs.forEach(n => (unlocks[n] = unlocks[n] || []).push(l.id)));
/* ============================================================
   STATE & ELEMENTS
   ============================================================ */
const STORE = 'redmaths.v10';
let done = new Set(load());
let hoveredId = null;
let activeDetailId = null;
let currentZoom = 1;
let currentStage = '00';

const flowchart  = document.getElementById('flowchart');
const zoomCont   = document.getElementById('zoom-container');
const shell      = document.getElementById('flowchart-shell');
const svg        = document.getElementById('connections');
const nodesLayer = document.getElementById('nodes-layer');
const countEl    = document.getElementById('count');
const pctEl      = document.getElementById('pct');
const barEl      = document.getElementById('barfill');
const detail     = document.getElementById('detail');
const detailBack = document.getElementById('detailBackdrop');
const detailCont = document.getElementById('detailContent');

function load(){ try{ return JSON.parse(localStorage.getItem(STORE))||[] }catch(e){ return [] } }
function save(){ try{ localStorage.setItem(STORE, JSON.stringify([...done])) }catch(e){} }
function tex(src){
  if(typeof katex === 'undefined') return src;
  try { return katex.renderToString(src, {throwOnError:false, displayMode:false}) }
  catch(e){ return src }
}

/* ============================================================
   MUSIC PLAYER & AUTOPLAY HANDLING
   ============================================================ */
const music = document.getElementById('bg-music');
const musicPlayer = document.getElementById('musicPlayer');
const musicText = document.querySelector('.music-text');
const audioPrompt = document.getElementById('audioPrompt');

music.volume = 0.35;
music.addEventListener('error', () => { musicPlayer.style.display = 'none'; });

function updateMusicUI(isPlaying) {
  if (isPlaying) {
    musicPlayer.classList.add('playing');
    musicText.textContent = 'Pause';
    audioPrompt.classList.remove('show');
  } else {
    musicPlayer.classList.remove('playing');
    musicText.textContent = 'Play';
  }
}

function attemptPlay() {
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      updateMusicUI(true);
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('keydown', attemptPlay);
      window.removeEventListener('scroll', attemptPlay);
    }).catch(e => {
      audioPrompt.classList.add('show');
      if (!window.audioInteractionAdded) {
        window.audioInteractionAdded = true;
        document.addEventListener('click', attemptPlay);
        document.addEventListener('keydown', attemptPlay);
        window.addEventListener('scroll', attemptPlay);
      }
    });
  }
}

function toggleMusic() {
  if (music.paused) {
    music.play().then(() => updateMusicUI(true)).catch(() => {});
  } else {
    music.pause();
    updateMusicUI(false);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  attemptPlay();
});

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

/* ============================================================
   NAVIGATION & LAYOUT ENGINE
   ============================================================ */
function navigate(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${viewId}`).classList.add('active');
  window.scrollTo(0, 0);
}

function computeSubLayout(stageLessons) {
  const p = {};
  const depths = {};
  
  function getDepth(id) {
    if (depths[id] !== undefined) return depths[id];
    const lesson = stageLessons.find(l => l.id === id);
    if (!lesson) return 0;
    
    const internalNeeds = lesson.needs.filter(nid => stageLessons.some(l => l.id === nid));
    if (internalNeeds.length === 0) {
      depths[id] = 0;
      return 0;
    }
    const maxDepth = Math.max(...internalNeeds.map(getDepth)) + 1;
    depths[id] = maxDepth;
    return maxDepth;
  }
  
  stageLessons.forEach(l => getDepth(l.id));
  
  const byDepth = {};
  stageLessons.forEach(l => {
    const d = depths[l.id];
    if (!byDepth[d]) byDepth[d] = [];
    byDepth[d].push(l);
  });
  
  const maxNodesInRow = Math.max(...Object.values(byDepth).map(arr => arr.length));
  const canvasW = Math.max(1000, maxNodesInRow * 240);
  const canvasH = Math.max(400, (Object.keys(byDepth).length) * 160 + 100);
  
  Object.keys(byDepth).forEach(d => {
    const row = byDepth[d];
    const spacing = canvasW / (row.length + 1);
    row.forEach((lesson, i) => {
      p[lesson.id] = {
        x: (i + 1) * spacing - 90,
        y: 80 + d * 160,
        w: 180, h: 70, level: lesson.level
      };
    });
  });
  
  return { pos: p, w: canvasW, h: canvasH };
}

function navigateStage(lv) {
  currentStage = lv;
  navigate('stage');
  
  document.getElementById('stage-name').innerHTML = `<span class="stage-dot" style="background:var(--lvl-${lv})"></span> ${lv} · ${LEVELS[lv]}`;
  
  const stageLessons = LESSONS.filter(l => l.level === lv);
  const layout = computeSubLayout(stageLessons);
  
  flowchart.style.width = layout.w + 'px';
  flowchart.style.height = layout.h + 'px';
  svg.setAttribute('viewBox', `0 0 ${layout.w} ${layout.h}`);
  svg.setAttribute('width', layout.w);
  svg.setAttribute('height', layout.h);
  
  svg.innerHTML = '';
  nodesLayer.innerHTML = '';
  
  let html = '';
  stageLessons.forEach(lesson => {
    const p = layout.pos[lesson.id];
    const isDone = done.has(lesson.id);
    
    const externalNeeds = lesson.needs.filter(nid => !stageLessons.some(l => l.id === nid));
    let meta = isDone ? '✓ learned' : (lesson.needs.length ? `needs ${lesson.needs.length}` : 'entry point');
    if (externalNeeds.length > 0) {
      meta = `needs ${externalNeeds.length} from prior stages`;
    }

    html += `
      <button class="node lvl-${lesson.level}${isDone ? ' is-done' : ''}"
              data-id="${lesson.id}"
              style="left:${p.x}px; top:${p.y}px; width:${p.w}px; height:${p.h}px;"
              aria-label="${lesson.title} — ${meta}">
        <div class="node-top">
          <span class="node-lvl">${lesson.level}</span>
          <span class="node-check" aria-hidden="true">✓</span>
        </div>
        <div class="node-title">${lesson.title}</div>
        <div class="node-meta">${meta}</div>
      </button>`;
  });
  nodesLayer.innerHTML = html;

  stageLessons.forEach(lesson => {
    const to = layout.pos[lesson.id];
    lesson.needs.forEach(needId => {
      const from = layout.pos[needId];
      if(!from) return;
      
      const x1 = from.x + from.w / 2;
      const y1 = from.y + from.h;
      const x2 = to.x + to.w / 2;
      const y2 = to.y;
      const controlY = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${controlY}, ${x2} ${controlY}, ${x2} ${y2}`;
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'path');
      path.setAttribute('stroke', `var(--lvl-${to.level})`);
      path.setAttribute('data-from', needId);
      path.setAttribute('data-to', lesson.id);
      path.setAttribute('data-level', to.level);
      svg.appendChild(path);
    });
  });

  currentZoom = 1;
  zoomCont.style.transform = `scale(1)`;
  setTimeout(() => {
    shell.scrollLeft = (layout.w - shell.clientWidth) / 2;
    shell.scrollTop = 0;
  }, 50);
}

function changeZoom(delta) {
  currentZoom = Math.max(0.4, Math.min(1.2, currentZoom + delta));
  zoomCont.style.transform = `scale(${currentZoom})`;
}

/* ============================================================
   FOCUS & INTERACTION (Desktop Only Hover)
   ============================================================ */
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

function focusNode(id){
  if (isTouchDevice) return; // Disable sticky hover states on mobile
  hoveredId = id;
  const lesson = LESSONS.find(l => l.id === id);
  if(!lesson) return;
  
  const stageLessons = LESSONS.filter(l => l.level === currentStage);
  const internalNeeds = lesson.needs.filter(nid => stageLessons.some(l => l.id === nid));
  const internalUnlocks = (unlocks[id] || []).filter(uid => stageLessons.some(l => l.id === uid));
  
  const prereqs = new Set(internalNeeds);
  const unlockIds = new Set(internalUnlocks);
  const related = new Set([id, ...prereqs, ...unlockIds]);

  flowchart.classList.add('focusing');
  flowchart.querySelectorAll('.node').forEach(n => {
    const nid = n.dataset.id;
    n.classList.toggle('node-related', related.has(nid));
    n.classList.toggle('node-focus',  nid === id);
    n.classList.toggle('node-prereq', prereqs.has(nid));
    n.classList.toggle('node-unlock', unlockIds.has(nid));
  });
  svg.querySelectorAll('.path').forEach(p => {
    p.classList.toggle('path-active', p.dataset.from === id || p.dataset.to === id);
  });
}
function unfocusNode(){
  if (isTouchDevice) return;
  hoveredId = null;
  flowchart.classList.remove('focusing');
  flowchart.querySelectorAll('.node').forEach(n =>
    n.classList.remove('node-related','node-focus','node-prereq','node-unlock'));
  svg.querySelectorAll('.path').forEach(p => p.classList.remove('path-active'));
}

/* ============================================================
   DETAIL PANEL
   ============================================================ */
function openDetail(id){
  const lesson = LESSONS.find(l => l.id === id);
  if(!lesson) return;
  activeDetailId = id;
  const isDone = done.has(id);

  const prereqRows = lesson.needs.length
    ? lesson.needs.map(nid => {
        const n = LESSONS.find(l => l.id === nid);
        const isExternal = n.level !== currentStage;
        const badge = isExternal ? `<span style="color:var(--lvl-${n.level}); font-weight:700; margin-right:6px;">[${n.level}]</span>` : '';
        return `<li><button data-jump="${nid}">${badge}${n.title}</button></li>`;
      }).join('')
    : `<li class="empty">No prerequisites — start here.</li>`;

  const unlockRows = (unlocks[id]||[]).length
    ? unlocks[id].map(uid => {
        const u = LESSONS.find(l => l.id === uid);
        const isExternal = u.level !== currentStage;
        const badge = isExternal ? `<span style="color:var(--lvl-${u.level}); font-weight:700; margin-right:6px;">[${u.level}]</span>` : '';
        return `<li><button data-jump="${uid}">${badge}${u.title}</button></li>`;
      }).join('')
    : `<li class="empty">No dependents yet — a frontier lesson.</li>`;

  detailCont.innerHTML = `
    <p class="detail-lvl">${lesson.level} · ${LEVELS[lesson.level]}</p>
    <h3>${lesson.title}</h3>
    <p class="detail-intuition">${lesson.intuition}</p>
    <div class="detail-formula">${tex(lesson.formula)}</div>
    <div class="detail-section"><h4>Prerequisites</h4><ul>${prereqRows}</ul></div>
    <div class="detail-section"><h4>Unlocks</h4><ul>${unlockRows}</ul></div>
    <div class="detail-actions">
      <button class="btn primary" id="markBtn" data-id="${id}">
        ${isDone ? '✓ Learned — unmark' : 'Mark as learned'}
      </button>
    </div>`;

  lastFocus = document.activeElement;
  detail.inert = false;
  detail.classList.add('open');
  document.getElementById('detailClose').focus();
  detailBack.classList.add('open');
  detail.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  detail.inert = true;
  if (lastFocus) lastFocus.focus();
}
function closeDetail(){
  activeDetailId = null;
  detail.classList.remove('open');
  detailBack.classList.remove('open');
  detail.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

/* ============================================================
   PROGRESS & MARKING
   ============================================================ */
function updateProgress(){
  const total = LESSONS.length;
  const n = LESSONS.filter(l => done.has(l.id)).length;
  const pct = Math.round(n / total * 100);
  countEl.textContent = `${n} of ${total} learned`;
  pctEl.textContent   = pct + '%';
  barEl.style.width   = pct + '%';
}
function toggleDone(id){
  const wasDone = done.has(id);
  wasDone ? done.delete(id) : done.add(id);
  save();
  const node = flowchart.querySelector(`.node[data-id="${id}"]`);
  if(node){
    node.classList.toggle('is-done', !wasDone);
    const lesson = LESSONS.find(l => l.id === id);
    const stageLessons = LESSONS.filter(l => l.level === currentStage);
    const externalNeeds = lesson.needs.filter(nid => !stageLessons.some(l => l.id === nid));
    let meta = !wasDone ? '✓ learned' : (lesson.needs.length ? `needs ${lesson.needs.length}` : 'entry point');
    if (externalNeeds.length > 0) {
      meta = !wasDone ? '✓ learned' : `needs ${externalNeeds.length} from prior stages`;
    }
    node.querySelector('.node-meta').textContent = meta;
  }
  updateProgress();
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
nodesLayer.addEventListener('pointerover', e => {
  const node = e.target.closest('.node');
  if(!node || node.dataset.id === hoveredId) return;
  focusNode(node.dataset.id);
});
nodesLayer.addEventListener('pointerleave', unfocusNode);
nodesLayer.addEventListener('click', e => {
  const node = e.target.closest('.node');
  if(!node) return;
  openDetail(node.dataset.id);
});

detailCont.addEventListener('click', e => {
  const jump = e.target.closest('[data-jump]');
  if(jump){
    const id = jump.dataset.jump;
    const targetLevel = LESSONS.find(l => l.id === id).level;
    closeDetail();
    
    if (targetLevel !== currentStage) {
      navigateStage(targetLevel);
      setTimeout(() => openDetail(id), 400);
    } else {
      const target = flowchart.querySelector(`.node[data-id="${id}"]`);
      if(target){
        target.scrollIntoView({behavior:'smooth', block:'center', inline:'center'});
        setTimeout(() => openDetail(id), 350);
      }
    }
    return;
  }
  const mark = e.target.closest('#markBtn');
  if(mark){ toggleDone(mark.dataset.id); openDetail(mark.dataset.id); }
});
document.getElementById('detailClose').addEventListener('click', closeDetail);
detailBack.addEventListener('click', closeDetail);
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && activeDetailId) closeDetail();
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Tab' || !activeDetailId) return;
  const f = detail.querySelectorAll('button');
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* theme */
const themeBtn = document.getElementById('themeBtn');
const root = document.documentElement;
(function(){ if(localStorage.getItem('redmaths.theme')==='light') root.dataset.theme='light';
  themeBtn.textContent = root.dataset.theme === 'light' ? '☀' : '☾'; })();
themeBtn.addEventListener('click', () => {
  const light = root.dataset.theme === 'light';
  root.dataset.theme = light ? 'dark' : 'light';
  themeBtn.textContent = light ? '☾' : '☀';
  localStorage.setItem('redmaths.theme', root.dataset.theme);
  draw();
});

/* ============================================================
   PLAYGROUND CANVAS
   ============================================================ */
const cv = document.getElementById('plot');
const ctx = cv.getContext('2d');
const nSlider = document.getElementById('nSlider');
const bSlider = document.getElementById('bSlider');
const nOut = document.getElementById('nOut');
const bOut = document.getElementById('bOut');
const exactEl = document.getElementById('exact');
const approxEl = document.getElementById('approx');
const errorEl = document.getElementById('error');
let nRect = 8, bVal = 2;

function draw(){
  if(!cv.clientWidth) return;
  const w = cv.clientWidth;
  const h = cv.clientHeight || 240;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(w*dpr); cv.height = Math.round(h*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,w,h);
  const cs = getComputedStyle(root);
  const colA = cs.getPropertyValue('--accent').trim() || '#FF4D3D';
  const colL = cs.getPropertyValue('--line').trim()   || '#231C36';
  const colI = cs.getPropertyValue('--ink').trim()    || '#F2EEF9';
  const colM = cs.getPropertyValue('--muted').trim()  || '#948EA8';
  const pad = {l:40,r:14,t:14,b:28};
  const XM = 3.2, YM = 7;
  const px = x => pad.l + (x/XM)*(w-pad.l-pad.r);
  const py = y => h - pad.b - (y/YM)*(h-pad.t-pad.b);
  ctx.strokeStyle = colL; ctx.lineWidth = 1;
  for(let gx=0; gx<=3; gx++){ ctx.beginPath(); ctx.moveTo(px(gx),py(0)); ctx.lineTo(px(gx),py(YM)); ctx.stroke(); }
  for(let gy=0; gy<=6; gy+=2){ ctx.beginPath(); ctx.moveTo(px(0),py(gy)); ctx.lineTo(px(XM),py(gy)); ctx.stroke(); }
  ctx.save();
  ctx.beginPath(); ctx.rect(px(0),py(YM),px(XM)-px(0),py(0)-py(YM)); ctx.clip();
  const dx = bVal/nRect;
  ctx.fillStyle = colA; ctx.globalAlpha = 0.18;
  for(let i=1;i<=nRect;i++){ const x0=(i-1)*dx,x1=i*dx,hgt=x1*x1; ctx.fillRect(px(x0),py(hgt),px(x1)-px(x0),py(0)-py(hgt)); }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = colA; ctx.lineWidth = Math.max(1, 1.6-nRect*0.015);
  for(let i=1;i<=nRect;i++){ const x0=(i-1)*dx,x1=i*dx,hgt=x1*x1; ctx.strokeRect(px(x0),py(hgt),px(x1)-px(x0),py(0)-py(hgt)); }
  ctx.strokeStyle = colI; ctx.lineWidth = 2;
  ctx.beginPath();
  for(let i=0;i<=160;i++){ const x=(i/160)*XM,X=px(x),Y=py(x*x); i?ctx.lineTo(X,Y):ctx.moveTo(X,Y); }
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = colI; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(px(0),py(0)); ctx.lineTo(px(XM),py(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px(0),py(0)); ctx.lineTo(px(0),py(YM)); ctx.stroke();
  ctx.fillStyle = colM; ctx.font = '10px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  for(let gx=0;gx<=3;gx++) ctx.fillText(String(gx),px(gx),py(0)+16);
  ctx.textAlign = 'right';
  for(let gy=2;gy<=6;gy+=2) ctx.fillText(String(gy),px(0)-8,py(gy)+3);
}
function updateReadout(){
  const exact = (bVal**3)/3;
  const dx = bVal/nRect;
  const approx = dx**3*(nRect*(nRect+1)*(2*nRect+1))/6;
  exactEl.textContent = exact.toFixed(4);
  approxEl.textContent = approx.toFixed(4);
  errorEl.textContent = Math.abs(exact-approx).toFixed(4);
}
function onSlide(){
  nRect = +nSlider.value; bVal = +bSlider.value;
  nOut.textContent = String(nRect); bOut.textContent = bVal.toFixed(1);
  updateReadout(); draw();
}
nSlider.addEventListener('input', onSlide);
bSlider.addEventListener('input', onSlide);
window.addEventListener('resize', draw);

/* ============================================================
   BOOT
   ============================================================ */
function boot(){
  updateProgress();
  onSlide();
  navigateStage('00'); 
  navigate('home'); 
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
