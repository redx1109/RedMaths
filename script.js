let lastFocus = null;
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
   NAVIGATION & LAYOUT ENGINE
   ============================================================ */
function navigate(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${viewId}`).classList.add('active');
  if (viewId === 'home') draw();
  window.scrollTo(0, 0);
  if (viewId !== 'stage') history.replaceState(null, '', viewId === 'home' ? location.pathname : '#' + viewId);
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
  history.replaceState(null, '', '#stage-' + lv);
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
const isTouchDevice = !matchMedia('(hover: hover)').matches;

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

  if (!detail.classList.contains('open')) lastFocus = document.activeElement;
  detail.inert = false;
  detail.classList.add('open');
  document.getElementById('detailClose').focus();
  detailBack.classList.add('open');
  detail.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeDetail(){
  activeDetailId = null;
  detail.classList.remove('open');
  detailBack.classList.remove('open');
  detail.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  detail.inert = true;
  if (lastFocus) lastFocus.focus();
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

/* pinch zoom */
let pinchDist = 0, pinchStart = 1;
const tDist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
shell.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    pinchDist = tDist(e.touches); pinchStart = currentZoom;
    zoomCont.style.transition = 'none';
  }
}, {passive:true});
shell.addEventListener('touchmove', e => {
  if (e.touches.length !== 2 || !pinchDist) return;
  e.preventDefault();
  currentZoom = Math.max(0.4, Math.min(1.2, pinchStart * tDist(e.touches) / pinchDist));
  zoomCont.style.transform = `scale(${currentZoom})`;
}, {passive:false});
const endPinch = e => { if (e.touches.length < 2) { pinchDist = 0; zoomCont.style.transition = ''; } };
shell.addEventListener('touchend', endPinch);
shell.addEventListener('touchcancel', endPinch);
/* trackpad pinch (desktop) */
shell.addEventListener('wheel', e => {
  if (!e.ctrlKey) return;
  e.preventDefault(); changeZoom(-e.deltaY * 0.01);
}, {passive:false});

/* theme */
const getTheme = () => { try { return getTheme() } catch(e){ return null } };
const setTheme = t => { try { localStorage.setItem('redmaths.theme', t) } catch(e){} };
const themeBtn = document.getElementById('themeBtn');
const root = document.documentElement;
(function(){ if(localStorage.getItem('redmaths.theme')==='light') root.dataset.theme='light';
  themeBtn.textContent = root.dataset.theme === 'light' ? '☀' : '☾'; })();
themeBtn.addEventListener('click', () => {
  const light = root.dataset.theme === 'light';
  root.dataset.theme = light ? 'dark' : 'light';
  themeBtn.textContent = light ? '☾' : '☀';
  setTheme(root.dataset.theme);
  draw();
});

/* ============================================================
   BOOT
   ============================================================ */
function route(){
  const h = location.hash.slice(1);
  if (h.startsWith('stage-') && LEVELS[h.slice(6)]) navigateStage(h.slice(6));
  else navigate(h === 'journey' ? 'journey' : 'home');
}
function boot(){
  updateProgress();
  onSlide();
  route();
  window.addEventListener('hashchange', route);
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
