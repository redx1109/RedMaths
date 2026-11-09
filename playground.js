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
  const cs = getComputedStyle(document.documentElement);
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
