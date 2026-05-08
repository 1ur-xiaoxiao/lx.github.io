/**
 * viz.js — 10 Interactive Canvas Visualizations for Data Mining
 * Each function receives a container DOM element and renders a self-contained visualization.
 *
 * Theme constants
 */
const THEME = {
  bg: '#1a1a24',
  text: '#e8e6f0',
  grid: 'rgba(255,255,255,0.06)',
  accent: '#6c63ff',
  green: '#00d4aa',
  red: '#ff6584',
  orange: '#ffb347',
  muted: 'rgba(255,255,255,0.35)',
};

/* ─── Utility helpers ───────────────────────────────────────────── */

function setupCanvas(container, height = 350) {
  const w = container.clientWidth || 600;
  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement('canvas');
  canvas.width = w * dpr;
  canvas.height = height * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = height + 'px';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { canvas, ctx, w, h: height, dpr };
}

function makeBar(container) {
  const bar = document.createElement('div');
  bar.style.cssText = 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:8px 4px;font-size:13px;color:#e8e6f0;font-family:system-ui,sans-serif;';
  container.appendChild(bar);
  return bar;
}

function makeSlider(bar, label, min, max, step, value, onInput) {
  const wrap = document.createElement('label');
  wrap.style.cssText = 'display:flex;align-items:center;gap:6px;';
  const span = document.createElement('span');
  span.textContent = label;
  span.style.whiteSpace = 'nowrap';
  const inp = document.createElement('input');
  inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.value = value;
  inp.style.cssText = 'width:120px;accent-color:#6c63ff;';
  const valSpan = document.createElement('span');
  valSpan.style.cssText = 'min-width:48px;font-variant-numeric:tabular-nums;';
  valSpan.textContent = value;
  inp.addEventListener('input', () => { valSpan.textContent = inp.value; onInput(+inp.value); });
  wrap.append(span, inp, valSpan);
  bar.appendChild(wrap);
  return inp;
}

function makeBtn(bar, text, onClick) {
  const b = document.createElement('button');
  b.textContent = text;
  b.style.cssText = 'background:#6c63ff;color:#fff;border:none;border-radius:6px;padding:5px 14px;cursor:pointer;font-size:13px;';
  b.addEventListener('click', onClick);
  bar.appendChild(b);
  return b;
}

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

// Polyfill: roundRect for older browsers
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

/* ─── 1. Linear Regression ─────────────────────────────────────── */

function vizLinearRegression(container) {
  const N = 50;
  const xs = [], ys = [];
  const slope = 1.5, intercept = 2;
  for (let i = 0; i < N; i++) {
    const x = Math.random() * 10 - 5;
    xs.push(x);
    ys.push(slope * x + intercept + randn() * 2);
  }
  const meanX = xs.reduce((a, b) => a + b, 0) / N;

  const { canvas, ctx, w, h } = setupCanvas(container);
  const bar = makeBar(container);
  // Log-scale slider: linear 0-100 maps to lambda 0.01-100
  let lambda = 1;
  const lamWrap = document.createElement('label');
  lamWrap.style.cssText = 'display:flex;align-items:center;gap:6px;';
  const lamLabel = document.createElement('span');
  lamLabel.textContent = 'λ (log)';
  lamLabel.style.whiteSpace = 'nowrap';
  const lamInp = document.createElement('input');
  lamInp.type = 'range'; lamInp.min = 0; lamInp.max = 100; lamInp.step = 1; lamInp.value = 50;
  lamInp.style.cssText = 'width:140px;accent-color:#6c63ff;';
  const lamVal = document.createElement('span');
  lamVal.style.cssText = 'min-width:52px;font-variant-numeric:tabular-nums;';
  lamVal.textContent = '1.00';
  lamInp.addEventListener('input', () => {
    const t = lamInp.value / 100;
    lambda = Math.pow(10, t * 4 - 2); // 0.01 to 100
    lamVal.textContent = lambda >= 10 ? lambda.toFixed(1) : lambda.toFixed(2);
    draw();
  });
  lamWrap.append(lamLabel, lamInp, lamVal);
  bar.appendChild(lamWrap);

  const pad = { t: 30, r: 30, b: 40, l: 50 };

  function olsCoeffs() {
    let sxy = 0, sxx = 0;
    for (let i = 0; i < N; i++) { sxy += (xs[i] - meanX) * ys[i]; sxx += (xs[i] - meanX) ** 2; }
    const b1 = sxy / sxx;
    const b0 = ys.reduce((a, v) => a + v, 0) / N - b1 * meanX;
    return [b0, b1];
  }

  function ridgeCoeffs(lam) {
    let sxy = 0, sxx = 0;
    for (let i = 0; i < N; i++) { sxy += (xs[i] - meanX) * ys[i]; sxx += (xs[i] - meanX) ** 2; }
    const b1 = sxy / (sxx + lam * N);
    const b0 = ys.reduce((a, v) => a + v, 0) / N - b1 * meanX;
    return [b0, b1];
  }

  function lassoCoeffs(lam) {
    let sxy = 0, sxx = 0;
    for (let i = 0; i < N; i++) { sxy += (xs[i] - meanX) * ys[i]; sxx += (xs[i] - meanX) ** 2; }
    let b1 = sxy / sxx;
    const thresh = lam * N / (2 * sxx);
    if (b1 > thresh) b1 -= thresh;
    else if (b1 < -thresh) b1 += thresh;
    else b1 = 0;
    const b0 = ys.reduce((a, v) => a + v, 0) / N - b1 * meanX;
    return [b0, b1];
  }

  function toX(v) { return pad.l + (v + 6) / 12 * (w - pad.l - pad.r); }
  function toY(v) { const yMin = -10, yMax = 15; return pad.t + (1 - (v - yMin) / (yMax - yMin)) * (h - pad.t - pad.b); }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = THEME.grid; ctx.lineWidth = 1;
    for (let x = -5; x <= 5; x++) {
      const px = toX(x);
      ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, h - pad.b); ctx.stroke();
    }
    for (let y = -10; y <= 15; y += 5) {
      const py = toY(y);
      ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(w - pad.r, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = THEME.muted; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.l, toY(0)); ctx.lineTo(w - pad.r, toY(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(toX(0), pad.t); ctx.lineTo(toX(0), h - pad.b); ctx.stroke();

    // Points
    ctx.fillStyle = 'rgba(108,99,255,0.7)';
    for (let i = 0; i < N; i++) {
      ctx.beginPath(); ctx.arc(toX(xs[i]), toY(ys[i]), 3.5, 0, Math.PI * 2); ctx.fill();
    }

    const ols = olsCoeffs(), ridge = ridgeCoeffs(lambda), lasso = lassoCoeffs(lambda);

    function drawLine(coeffs, color) {
      ctx.strokeStyle = color; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(toX(-6), toY(coeffs[0] + coeffs[1] * -6));
      ctx.lineTo(toX(6), toY(coeffs[0] + coeffs[1] * 6));
      ctx.stroke();
    }

    drawLine(ols, '#6c63ff');
    drawLine(ridge, '#00d4aa');
    drawLine(lasso, '#ff6584');

    // Legend with coefficient values
    const lx = w - pad.r - 170, ly = pad.t + 10;
    [['OLS', '#6c63ff', ols], ['Ridge', '#00d4aa', ridge], ['Lasso', '#ff6584', lasso]].forEach(([name, col, c], i) => {
      ctx.fillStyle = col;
      ctx.fillRect(lx, ly + i * 22, 16, 3);
      ctx.fillStyle = THEME.text;
      ctx.font = '12px system-ui';
      ctx.fillText(`${name}: b0=${c[0].toFixed(2)}  b1=${c[1].toFixed(3)}`, lx + 22, ly + i * 22 + 4);
    });

    // Coefficient bar chart
    const bx = 16, by = h - 10;
    ctx.fillStyle = THEME.text; ctx.font = 'bold 11px system-ui';
    ctx.fillText('Coefficient b1', bx, by - 62);
    const maxC = Math.max(2, Math.abs(ols[1]) * 1.2);
    [['b1 OLS', ols[1], '#6c63ff'], ['b1 Ridge', ridge[1], '#00d4aa'], ['b1 Lasso', lasso[1], '#ff6584']].forEach(([lbl, v, col], i) => {
      const barW = Math.abs(v) / maxC * 70;
      ctx.fillStyle = col + '88';
      ctx.fillRect(bx + 76, by - 52 + i * 16, (v >= 0 ? barW : -barW), 12);
      ctx.fillStyle = col;
      ctx.fillRect(bx + 76, by - 52 + i * 16, 3, 12);
      ctx.fillStyle = THEME.text;
      ctx.font = '11px system-ui';
      ctx.fillText(`${lbl}: ${v.toFixed(3)}`, bx + 2, by - 42 + i * 16);
    });

    // Title
    ctx.fillStyle = THEME.text; ctx.font = 'bold 14px system-ui';
    ctx.fillText('Linear Regression: OLS vs Ridge vs Lasso', pad.l, 18);
  }

  draw();
}

/* ─── 2. KNN ───────────────────────────────────────────────────── */

function vizKNN(container) {
  const N = 60, K_CLASSES = 3, COLORS = ['#6c63ff', '#00d4aa', '#ff6584'];
  const points = [];
  const centers = [[2, 2], [8, 7], [5, 1]];
  for (let i = 0; i < N; i++) {
    const c = i % K_CLASSES;
    points.push({
      x: centers[c][0] + randn() * 1.5,
      y: centers[c][1] + randn() * 1.5,
      cls: c
    });
  }

  const { canvas, ctx, w, h } = setupCanvas(container);
  const bar = makeBar(container);
  let K = 3;
  makeSlider(bar, 'K', 1, 30, 1, K, v => { K = v; draw(); });

  let mouseX = -100, mouseY = -100;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
    draw();
  });
  canvas.addEventListener('mouseleave', () => { mouseX = -100; mouseY = -100; draw(); });

  const pad = { t: 30, r: 20, b: 30, l: 40 };
  const xMin = -2, xMax = 12, yMin = -2, yMax = 12;

  function toX(v) { return pad.l + (v - xMin) / (xMax - xMin) * (w - pad.l - pad.r); }
  function toY(v) { return pad.t + (1 - (v - yMin) / (yMax - yMin)) * (h - pad.t - pad.b); }
  function fromX(px) { return xMin + (px - pad.l) / (w - pad.l - pad.r) * (xMax - xMin); }
  function fromY(py) { return yMax - (py - pad.t) / (h - pad.t - pad.b) * (yMax - yMin); }

  function classifyKNN(px, py) {
    const dists = points.map(p => ({ d: Math.hypot(p.x - px, p.y - py), cls: p.cls }));
    dists.sort((a, b) => a.d - b.d);
    const counts = [0, 0, 0];
    for (let i = 0; i < Math.min(K, dists.length); i++) counts[dists[i].cls]++;
    return counts.indexOf(Math.max(...counts));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, w, h);

    // Decision regions
    const step = 8;
    for (let px = pad.l; px < w - pad.r; px += step) {
      for (let py = pad.t; py < h - pad.b; py += step) {
        const dx = fromX(px + step / 2), dy = fromY(py + step / 2);
        const cls = classifyKNN(dx, dy);
        ctx.fillStyle = COLORS[cls] + '22';
        ctx.fillRect(px, py, step, step);
      }
    }

    // Grid
    ctx.strokeStyle = THEME.grid; ctx.lineWidth = 1;
    for (let x = 0; x <= 10; x += 2) {
      const px = toX(x);
      ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, h - pad.b); ctx.stroke();
      ctx.fillStyle = THEME.muted; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(x, px, h - pad.b + 14);
    }
    for (let y = 0; y <= 10; y += 2) {
      const py = toY(y);
      ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(w - pad.r, py); ctx.stroke();
      ctx.fillStyle = THEME.muted; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
      ctx.fillText(y, pad.l - 6, py + 4);
    }

    // K nearest neighbors highlight
    if (mouseX > pad.l && mouseX < w - pad.r && mouseY > pad.t && mouseY < h - pad.b) {
      const mx = fromX(mouseX), my = fromY(mouseY);
      const dists = points.map(p => ({ ...p, d: Math.hypot(p.x - mx, p.y - my) }));
      dists.sort((a, b) => a.d - b.d);
      for (let i = 0; i < Math.min(K, dists.length); i++) {
        const p = dists[i];
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 7, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = COLORS[p.cls]; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(mouseX, mouseY); ctx.lineTo(toX(p.x), toY(p.y)); ctx.stroke();
      }
      // Crosshair
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(mouseX, pad.t); ctx.lineTo(mouseX, h - pad.b); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad.l, mouseY); ctx.lineTo(w - pad.r, mouseY); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Points
    points.forEach(p => {
      ctx.fillStyle = COLORS[p.cls];
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#1a1a24'; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Title
    ctx.fillStyle = THEME.text; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(`KNN Decision Boundary (K=${K})`, pad.l, 18);
  }

  draw();
}

/* ─── 3. Naive Bayes ───────────────────────────────────────────── */

function vizNaiveBayes(container) {
  const N = 80;
  const pts = [];
  const mus = [[2, 3], [7, 6]];
  const sigs = [[1.5, 1.2], [1.8, 1.0]];
  for (let i = 0; i < N; i++) {
    const c = i < N / 2 ? 0 : 1;
    pts.push({
      x: mus[c][0] + randn() * sigs[c][0],
      y: mus[c][1] + randn() * sigs[c][1],
      cls: c
    });
  }

  const { canvas, ctx, w, h } = setupCanvas(container);
  const bar = makeBar(container);
  let alpha = 0.1;
  makeSlider(bar, 'α (Laplace)', 0.01, 10, 0.01, alpha, v => { alpha = v; draw(); });

  const pad = { t: 30, r: 20, b: 30, l: 40 };
  const xMin = -3, xMax = 13, yMin = -2, yMax = 12;
  const COLORS = ['#6c63ff', '#ff6584'];

  function toX(v) { return pad.l + (v - xMin) / (xMax - xMin) * (w - pad.l - pad.r); }
  function toY(v) { return pad.t + (1 - (v - yMin) / (yMax - yMin)) * (h - pad.t - pad.b); }

  let clickX = -1, clickY = -1;

  canvas.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    clickX = xMin + (px - pad.l) / (w - pad.l - pad.r) * (xMax - xMin);
    clickY = yMax - (py - pad.t) / (h - pad.t - pad.b) * (yMax - yMin);
    draw();
  });

  function gaussProb(x, y, mu, sx, sy) {
    const a = (x - mu[0]) ** 2 / (sx ** 2 + alpha);
    const b2 = (y - mu[1]) ** 2 / (sy ** 2 + alpha);
    return Math.exp(-0.5 * (a + b2)) / (2 * Math.PI * Math.sqrt(sx * sy + alpha));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = THEME.grid; ctx.lineWidth = 1;
    for (let x = -2; x <= 12; x += 2) {
      const px = toX(x); ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, h - pad.b); ctx.stroke();
    }
    for (let y = -1; y <= 11; y += 2) {
      const py = toY(y); ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(w - pad.r, py); ctx.stroke();
    }

    // Gaussian contour ellipses
    for (let c = 0; c < 2; c++) {
      const mx = mus[c][0], my = mus[c][1];
      const sx = sigs[c][0] + alpha * 0.3, sy = sigs[c][1] + alpha * 0.3;
      for (let level = 1; level <= 3; level++) {
        const scale = level * 0.8;
        ctx.strokeStyle = COLORS[c] + (level === 1 ? '88' : level === 2 ? '55' : '33');
        ctx.lineWidth = level === 1 ? 2 : 1;
        ctx.beginPath();
        ctx.ellipse(toX(mx), toY(my), sx * scale * (w - pad.l - pad.r) / (xMax - xMin) * 0.13,
          sy * scale * (h - pad.t - pad.b) / (yMax - yMin) * 0.13, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Points
    pts.forEach(p => {
      ctx.fillStyle = COLORS[p.cls] + 'cc';
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 4, 0, Math.PI * 2); ctx.fill();
    });

    // Click posterior
    if (clickX > xMin && clickX < xMax && clickY > yMin && clickY < yMax) {
      const p0 = gaussProb(clickX, clickY, mus[0], sigs[0][0], sigs[0][1]) * 0.5;
      const p1 = gaussProb(clickX, clickY, mus[1], sigs[1][0], sigs[1][1]) * 0.5;
      const sum = p0 + p1 || 1;
      const post0 = (p0 / sum * 100).toFixed(1);
      const post1 = (p1 / sum * 100).toFixed(1);

      const sx = toX(clickX), sy = toY(clickY);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(sx, sy, 8, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = 'rgba(26,26,36,0.85)'; ctx.fillRect(sx + 12, sy - 30, 150, 42);
      ctx.strokeStyle = '#6c63ff44'; ctx.strokeRect(sx + 12, sy - 30, 150, 42);
      ctx.font = '12px system-ui'; ctx.fillStyle = '#6c63ff';
      ctx.fillText(`P(C0|x) = ${post0}%`, sx + 18, sy - 14);
      ctx.fillStyle = '#ff6584';
      ctx.fillText(`P(C1|x) = ${post1}%`, sx + 18, sy + 4);
    }

    // Title
    ctx.fillStyle = THEME.text; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Naive Bayes: Gaussian Contours & Posteriors', pad.l, 18);
  }

  draw();
}

/* ─── 4. Logistic Regression ───────────────────────────────────── */

function vizLogisticRegression(container) {
  const { canvas, ctx, w, h } = setupCanvas(container);
  const bar = makeBar(container);
  let slopeW = 1;
  makeSlider(bar, 'w (slope)', 0.1, 5, 0.1, slopeW, v => { slopeW = v; });

  let animT = 0;
  const gdDots = [], newtonDots = [];

  // Pre-compute loss curves
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    gdDots.push({ iter: i, loss: 2.5 * Math.exp(-0.04 * i) + 0.15 + randn() * 0.02 });
    newtonDots.push({ iter: i, loss: 2.5 * Math.exp(-0.15 * i) + 0.05 + randn() * 0.01 });
  }

  const pad = { t: 30, r: 20, b: 40, l: 50 };

  function draw(time) {
    animT = Math.min(1, animT + 0.008);
    const halfW = w / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, w, h);

    // --- Left: Sigmoid ---
    const lx = pad.l, ly = pad.t, lw = halfW - pad.l - 10, lh = h - pad.t - pad.b;

    ctx.strokeStyle = THEME.grid; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const py = ly + lh * i / 4;
      ctx.beginPath(); ctx.moveTo(lx, py); ctx.lineTo(lx + lw, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = THEME.muted; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lx, ly + lh); ctx.lineTo(lx + lw, ly + lh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx + lw / 2, ly); ctx.lineTo(lx + lw / 2, ly + lh); ctx.stroke();

    // Sigmoid curve
    ctx.strokeStyle = '#6c63ff'; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const z = (i / 200 - 0.5) * 12;
      const s = sigmoid(slopeW * z);
      const px = lx + (i / 200) * lw;
      const py = ly + (1 - s) * lh;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = THEME.text; ctx.font = 'bold 13px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Sigmoid: σ(wz)', lx + lw / 2, ly - 8);
    ctx.font = '11px system-ui'; ctx.fillStyle = THEME.muted;
    ctx.fillText('z', lx + lw, ly + lh + 16);
    ctx.fillText('0', lx + lw / 2, ly + lh + 16);
    ctx.fillText('σ(z)=0.5', lx + lw / 2 + 20, ly + lh / 2 - 6);

    // --- Right: Loss curve ---
    const rx = halfW + 10, rw = halfW - pad.r - 20;

    ctx.strokeStyle = THEME.grid; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const py = ly + lh * i / 4;
      ctx.beginPath(); ctx.moveTo(rx, py); ctx.lineTo(rx + rw, py); ctx.stroke();
    }

    // GD curve (blue)
    ctx.strokeStyle = '#6c63ff'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    const maxIter = Math.floor(animT * 60);
    for (let i = 0; i <= maxIter; i++) {
      const px = rx + (i / 60) * rw;
      const py = ly + (1 - gdDots[i].loss / 3) * lh;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Newton curve (green)
    ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= maxIter; i++) {
      const px = rx + (i / 60) * rw;
      const py = ly + (1 - newtonDots[i].loss / 3) * lh;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Animated dots
    if (maxIter > 0) {
      [[gdDots, '#6c63ff', 'GD'], [newtonDots, '#00d4aa', 'Newton']].forEach(([dots, col, name]) => {
        const d = dots[Math.min(maxIter, dots.length - 1)];
        const px = rx + (Math.min(maxIter, 60) / 60) * rw;
        const py = ly + (1 - d.loss / 3) * lh;
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = col; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
        ctx.fillText(name, px + 8, py - 6);
      });
    }

    ctx.fillStyle = THEME.text; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Cross-Entropy Loss', rx + rw / 2, ly - 8);
    ctx.font = '11px system-ui'; ctx.fillStyle = THEME.muted;
    ctx.fillText('Iteration', rx + rw / 2, ly + lh + 16);

    if (animT < 1) requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* ─── 5. Max Entropy ───────────────────────────────────────────── */

function vizMaxEntropy(container) {
  const { canvas, ctx, w, h } = setupCanvas(container);
  const bar = makeBar(container);
  let selP = 0.5;
  const slider = makeSlider(bar, 'p', 0.01, 0.99, 0.01, selP, v => { selP = v; draw(); });

  const pad = { t: 30, r: 30, b: 50, l: 50 };

  function entropy(p) {
    if (p <= 0 || p >= 1) return 0;
    return -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, w, h);

    const gx = pad.l, gy = pad.t, gw = w - pad.l - pad.r, gh = h - pad.t - pad.b;

    // Grid
    ctx.strokeStyle = THEME.grid; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const py = gy + gh * i / 4;
      ctx.beginPath(); ctx.moveTo(gx, py); ctx.lineTo(gx + gw, py); ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
      const px = gx + gw * i / 10;
      ctx.beginPath(); ctx.moveTo(px, gy); ctx.lineTo(px, gy + gh); ctx.stroke();
    }

    // Gradient fill under curve
    const grad = ctx.createLinearGradient(gx, gy, gx, gy + gh);
    grad.addColorStop(0, 'rgba(108,99,255,0.35)');
    grad.addColorStop(1, 'rgba(108,99,255,0.02)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh);
    for (let i = 0; i <= 200; i++) {
      const p = i / 200;
      const val = entropy(p);
      ctx.lineTo(gx + p * gw, gy + (1 - val) * gh);
    }
    ctx.lineTo(gx + gw, gy + gh);
    ctx.closePath();
    ctx.fill();

    // Curve
    ctx.strokeStyle = '#6c63ff'; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const p = i / 200;
      const val = entropy(p);
      const px = gx + p * gw, py = gy + (1 - val) * gh;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Max point at p=0.5
    const maxPx = gx + 0.5 * gw, maxPy = gy + (1 - 1) * gh;
    ctx.shadowColor = '#6c63ff'; ctx.shadowBlur = 18;
    ctx.fillStyle = '#6c63ff';
    ctx.beginPath(); ctx.arc(maxPx, maxPy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = THEME.text; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('max H=1.0', maxPx, maxPy - 14);

    // Special points
    ctx.fillStyle = THEME.muted; ctx.font = '11px system-ui';
    ctx.fillText('p=0', gx, gy + gh + 16);
    ctx.fillText('p=0.5', gx + gw / 2, gy + gh + 16);
    ctx.fillText('p=1', gx + gw, gy + gh + 16);
    ctx.fillText('H(p)=0', gx - 8, gy + gh + 4);
    ctx.textAlign = 'right';
    ctx.fillText('H(p)=1', gx - 8, gy + 4);

    // Selected point
    const sp = selP, sh = entropy(sp);
    const spx = gx + sp * gw, spy = gy + (1 - sh) * gh;
    ctx.strokeStyle = '#ff6584'; ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(spx, gy + gh); ctx.lineTo(spx, spy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx, spy); ctx.lineTo(spx, spy); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ff6584';
    ctx.beginPath(); ctx.arc(spx, spy, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = THEME.text; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(`p=${sp.toFixed(2)}, H(p)=${sh.toFixed(4)}`, spx + 12, spy - 8);

    // Title
    ctx.fillStyle = THEME.text; ctx.font = 'bold 14px system-ui';
    ctx.fillText('Binary Entropy Function', pad.l, 18);
  }

  draw();
}

/* ─── 6. Decision Tree ─────────────────────────────────────────── */

function vizDecisionTree(container) {
  const { canvas, ctx, w, h } = setupCanvas(container);
  const bar = makeBar(container);

  let useEntropy = true;
  let treeDepth = 2; // start with 2 levels (root + 2 children)

  makeBtn(bar, '分裂', () => { if (treeDepth < 4) { treeDepth++; draw(); } });
  makeBtn(bar, '重置', () => { treeDepth = 2; draw(); });
  makeBtn(bar, '切换准则', () => { useEntropy = !useEntropy; draw(); });

  const COLORS = ['#6c63ff', '#ff6584', '#00d4aa'];

  function impurity(n1, n2) {
    const total = n1 + n2 || 1;
    const p = n1 / total;
    if (useEntropy) {
      if (p <= 0 || p >= 1) return 0;
      return -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
    }
    return 1 - p * p - (1 - p) * (1 - p); // Gini
  }

  function buildTree(depth, maxDepth, parentSamples, parentDist) {
    if (depth > maxDepth) return null;
    const s = parentSamples || (depth === 0 ? 200 : Math.floor(50 + Math.random() * 100));
    const d1 = parentDist !== undefined ? parentDist : Math.floor(s * (0.3 + Math.random() * 0.4));
    const d2 = s - d1;
    const node = { samples: s, dist: [d1, d2], impurity: impurity(d1, d2), children: [] };
    if (depth < maxDepth) {
      const r1 = 0.4 + Math.random() * 0.2;
      const r2 = 1 - r1;
      node.children.push(buildTree(depth + 1, maxDepth, Math.floor(s * r1), Math.floor(d1 * (0.6 + Math.random() * 0.3))));
      node.children.push(buildTree(depth + 1, maxDepth, Math.floor(s * r2), Math.floor(d2 * (0.6 + Math.random() * 0.3))));
    }
    return node;
  }

  function drawNode(node, cx, cy, depth, maxD, spread) {
    if (!node) return;
    const nw = 80, nh = 50;
    const dominant = node.dist[0] >= node.dist[1] ? 0 : 1;

    // Node rectangle
    ctx.fillStyle = COLORS[dominant] + '33';
    ctx.strokeStyle = COLORS[dominant] + '88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - nw / 2, cy - nh / 2, nw, nh, 8);
    ctx.fill(); ctx.stroke();

    // Class distribution bar
    const total = node.dist[0] + node.dist[1] || 1;
    const bw = nw - 10;
    ctx.fillStyle = COLORS[0];
    ctx.fillRect(cx - bw / 2, cy + 6, bw * node.dist[0] / total, 6);
    ctx.fillStyle = COLORS[1];
    ctx.fillRect(cx - bw / 2 + bw * node.dist[0] / total, cy + 6, bw * node.dist[1] / total, 6);

    // Text
    ctx.fillStyle = THEME.text; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(`n=${node.samples}`, cx, cy - 8);
    ctx.font = '10px system-ui'; ctx.fillStyle = THEME.muted;
    const impLabel = useEntropy ? 'H' : 'Gini';
    ctx.fillText(`${impLabel}=${node.impurity.toFixed(3)}`, cx, cy + 22);

    // Children
    if (node.children.length > 0) {
      const nextSpread = spread * 0.5;
      const dy = 80;
      node.children.forEach((child, i) => {
        if (!child) return;
        const childX = cx + (i === 0 ? -spread : spread) * 0.5;
        const childY = cy + dy;
        ctx.strokeStyle = THEME.muted; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx, cy + nh / 2); ctx.lineTo(childX, childY - 25); ctx.stroke();
        drawNode(child, childX, childY, depth + 1, maxD, nextSpread);
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, w, h);

    const tree = buildTree(0, treeDepth);
    drawNode(tree, w / 2, 55, 0, treeDepth, w * 0.35);

    ctx.fillStyle = THEME.text; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(`Decision Tree (${useEntropy ? 'Entropy' : 'Gini'})`, 14, 18);
  }

  draw();
}

/* ─── 7. Perceptron ────────────────────────────────────────────── */

function vizPerceptron(container) {
  const N = 40;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const x = randn() * 2;
    const y = randn() * 2;
    const label = x + y > 0 ? 1 : -1;
    pts.push({ x, y, label });
  }

  let w1 = randn(), w2 = randn(), b = randn();
  let misCount = N;

  const { canvas, ctx, w, h } = setupCanvas(container);
  const bar = makeBar(container);

  makeBtn(bar, '训练一步', () => { trainStep(); draw(); });
  makeBtn(bar, '自动训练', () => { autoTrain(); });

  const pad = { t: 30, r: 20, b: 30, l: 40 };
  const range = 5;

  function toX(v) { return pad.l + (v + range) / (2 * range) * (w - pad.l - pad.r); }
  function toY(v) { return pad.t + (1 - (v + range) / (2 * range)) * (h - pad.t - pad.b); }

  function predict(p) { return (w1 * p.x + w2 * p.y + b) >= 0 ? 1 : -1; }

  function trainStep() {
    for (const p of pts) {
      if (predict(p) !== p.label) {
        w1 += p.label * p.x;
        w2 += p.label * p.y;
        b += p.label;
        break;
      }
    }
    misCount = pts.filter(p => predict(p) !== p.label).length;
  }

  let autoInterval = null;
  function autoTrain() {
    if (autoInterval) return;
    autoInterval = setInterval(() => {
      trainStep();
      draw();
      if (misCount === 0) { clearInterval(autoInterval); autoInterval = null; }
    }, 120);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = THEME.grid; ctx.lineWidth = 1;
    for (let x = -4; x <= 4; x++) {
      const px = toX(x); ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, h - pad.b); ctx.stroke();
    }
    for (let y = -4; y <= 4; y++) {
      const py = toY(y); ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(w - pad.r, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = THEME.muted; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(toX(0), pad.t); ctx.lineTo(toX(0), h - pad.b); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l, toY(0)); ctx.lineTo(w - pad.r, toY(0)); ctx.stroke();

    // Decision boundary line: w1*x + w2*y + b = 0 => y = -(w1*x + b) / w2
    if (Math.abs(w2) > 0.001) {
      ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toX(-range), toY(-(-w1 * (-range) - b) / w2));
      ctx.lineTo(toX(range), toY(-(-w1 * (range) - b) / w2));
      ctx.stroke();
    }

    // Points
    pts.forEach(p => {
      const correct = predict(p) === p.label;
      ctx.fillStyle = p.label === 1 ? '#ff6584' : '#6c63ff';
      ctx.beginPath();
      ctx.arc(toX(p.x), toY(p.y), correct ? 5 : 7, 0, Math.PI * 2);
      ctx.fill();
      if (!correct) {
        ctx.strokeStyle = '#ffb347'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 10, 0, Math.PI * 2); ctx.stroke();
      }
    });

    // Info
    ctx.fillStyle = THEME.text; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Perceptron', pad.l, 18);
    ctx.font = '12px system-ui'; ctx.fillStyle = THEME.muted;
    ctx.fillText(`w=[${w1.toFixed(2)}, ${w2.toFixed(2)}]  b=${b.toFixed(2)}  错分=${misCount}`, pad.l + 120, 18);
  }

  draw();
}

/* ─── 8. SVM ───────────────────────────────────────────────────── */

function vizSVM(container) {
  const N = 40;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const x = randn() * 1.5 + (i < N / 2 ? -2 : 2);
    const y = randn() * 1.5 + (i < N / 2 ? -1 : 1);
    pts.push({ x, y, label: i < N / 2 ? -1 : 1 });
  }

  const { canvas, ctx, w, h } = setupCanvas(container);
  const bar = makeBar(container);
  let C = 1, kernel = 'linear';
  makeSlider(bar, 'C', 0.1, 100, 0.1, C, v => { C = v; draw(); });
  makeBtn(bar, '线性核', () => { kernel = 'linear'; draw(); });
  makeBtn(bar, 'RBF核', () => { kernel = 'rbf'; draw(); });

  const pad = { t: 30, r: 20, b: 30, l: 40 };
  const range = 6;

  function toX(v) { return pad.l + (v + range) / (2 * range) * (w - pad.l - pad.r); }
  function toY(v) { return pad.t + (1 - (v + range) / (2 * range)) * (h - pad.t - pad.b); }

  // Simple SVM approximation for visualization
  function svmDecision(x, y) {
    if (kernel === 'linear') {
      return 0.8 * x + 0.5 * y;
    } else {
      // RBF-like: sum of Gaussian influences
      let val = 0;
      pts.forEach(p => {
        const d = Math.hypot(x - p.x, y - p.y);
        val += p.label * Math.exp(-0.5 * d * d) * (C / 10);
      });
      return val;
    }
  }

  // Find approximate support vectors (closest to boundary)
  function findSVs() {
    return pts.filter(p => {
      const v = Math.abs(svmDecision(p.x, p.y));
      return v < 1.5;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, w, h);

    const margin = 1.0 / Math.sqrt(C * 0.5 + 0.5);

    // Decision regions (low-res grid)
    const step = 6;
    for (let px = pad.l; px < w - pad.r; px += step) {
      for (let py = pad.t; py < h - pad.b; py += step) {
        const dx = (px - pad.l) / (w - pad.l - pad.r) * 2 * range - range;
        const dy = range - (py - pad.t) / (h - pad.t - pad.b) * 2 * range;
        const val = svmDecision(dx, dy);
        if (val > 0) ctx.fillStyle = 'rgba(255,101,132,0.08)';
        else ctx.fillStyle = 'rgba(108,99,255,0.08)';
        ctx.fillRect(px, py, step, step);
      }
    }

    // Grid
    ctx.strokeStyle = THEME.grid; ctx.lineWidth = 1;
    for (let x = -5; x <= 5; x++) {
      const px = toX(x); ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, h - pad.b); ctx.stroke();
    }
    for (let y = -5; y <= 5; y++) {
      const py = toY(y); ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(w - pad.r, py); ctx.stroke();
    }

    // Decision boundary and margins
    ctx.lineWidth = 2;
    const levels = [
      { val: 0, color: '#00d4aa', lw: 3 },
      { val: margin, color: '#00d4aa44', lw: 1.5 },
      { val: -margin, color: '#00d4aa44', lw: 1.5 }
    ];

    levels.forEach(({ val, color, lw }) => {
      ctx.strokeStyle = color; ctx.lineWidth = lw;
      ctx.beginPath();
      let started = false;
      const cols = 100;
      for (let i = 0; i <= cols; i++) {
        const x = -range + (2 * range) * i / cols;
        // Binary search for y where svmDecision(x, y) = val
        let lo = -range, hi = range, found = null;
        for (let iter = 0; iter < 20; iter++) {
          const mid = (lo + hi) / 2;
          if (svmDecision(x, mid) > val) hi = mid; else lo = mid;
        }
        found = (lo + hi) / 2;
        if (found > -range && found < range) {
          const px = toX(x), py = toY(found);
          if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    });

    // Support vectors
    const svs = findSVs();
    svs.forEach(p => {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 9, 0, Math.PI * 2); ctx.stroke();
    });

    // Points
    pts.forEach(p => {
      ctx.fillStyle = p.label === 1 ? '#ff6584' : '#6c63ff';
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#1a1a24'; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Title
    ctx.fillStyle = THEME.text; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(`SVM (${kernel === 'linear' ? '线性核' : 'RBF核'}, C=${C.toFixed(1)})`, pad.l, 18);
  }

  draw();
}

/* ─── 9. EM Algorithm ──────────────────────────────────────────── */

function vizEM(container) {
  const K = 3, N = 90;
  const trueMU = [[1, 2], [6, 7], [3, 8]];
  const trueSIG = [[1, 0.8], [1.2, 1], [0.8, 1.1]];
  const pts = [];
  for (let i = 0; i < N; i++) {
    const c = i % K;
    pts.push({
      x: trueMU[c][0] + randn() * trueSIG[c][0],
      y: trueMU[c][1] + randn() * trueSIG[c][1],
      cls: c
    });
  }

  let mu = [[2, 3], [5, 5], [4, 7]];
  let sig = [[2, 2], [2, 2], [2, 2]];
  let resp = Array.from({ length: N }, () => Array(K).fill(1 / K));
  const COLORS = ['#6c63ff', '#00d4aa', '#ff6584'];
  const logLikelihoods = [];

  const { canvas, ctx, w, h } = setupCanvas(container);
  const bar = makeBar(container);
  makeBtn(bar, 'E步', () => { eStep(); draw(); });
  makeBtn(bar, 'M步', () => { mStep(); draw(); });
  makeBtn(bar, '自动', () => { autoEM(); });

  const pad = { t: 30, r: 20, b: 30, l: 40 };
  const xMin = -2, xMax = 10, yMin = -2, yMax = 12;

  function toX(v) { return pad.l + (v - xMin) / (xMax - xMin) * (w - pad.l - pad.r); }
  function toY(v) { return pad.t + (1 - (v - yMin) / (yMax - yMin)) * (h - pad.t - pad.b); }

  function gauss2d(x, y, m, s) {
    const dx = x - m[0], dy = y - m[1];
    return Math.exp(-0.5 * (dx * dx / (s[0] * s[0]) + dy * dy / (s[1] * s[1]))) / (2 * Math.PI * s[0] * s[1]);
  }

  function eStep() {
    for (let i = 0; i < N; i++) {
      let sum = 0;
      for (let k = 0; k < K; k++) {
        resp[i][k] = gauss2d(pts[i].x, pts[i].y, mu[k], sig[k]);
        sum += resp[i][k];
      }
      for (let k = 0; k < K; k++) resp[i][k] /= (sum || 1);
    }
    computeLogLikelihood();
  }

  function mStep() {
    for (let k = 0; k < K; k++) {
      let nk = 0, sx = 0, sy = 0;
      for (let i = 0; i < N; i++) { nk += resp[i][k]; sx += resp[i][k] * pts[i].x; sy += resp[i][k] * pts[i].y; }
      mu[k] = [sx / (nk || 1), sy / (nk || 1)];
      let vx = 0, vy = 0;
      for (let i = 0; i < N; i++) {
        vx += resp[i][k] * (pts[i].x - mu[k][0]) ** 2;
        vy += resp[i][k] * (pts[i].y - mu[k][1]) ** 2;
      }
      sig[k] = [Math.sqrt(vx / (nk || 1)) + 0.3, Math.sqrt(vy / (nk || 1)) + 0.3];
    }
    computeLogLikelihood();
  }

  function computeLogLikelihood() {
    let ll = 0;
    for (let i = 0; i < N; i++) {
      let s = 0;
      for (let k = 0; k < K; k++) s += gauss2d(pts[i].x, pts[i].y, mu[k], sig[k]) / K;
      ll += Math.log(s + 1e-10);
    }
    logLikelihoods.push(ll);
  }

  let autoInterval = null;
  function autoEM() {
    if (autoInterval) return;
    let step = 0;
    autoInterval = setInterval(() => {
      if (step % 2 === 0) eStep(); else mStep();
      draw();
      step++;
      if (step > 20) { clearInterval(autoInterval); autoInterval = null; }
    }, 300);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, w, h);

    const plotW = w * 0.65;
    const llW = w * 0.3;

    // Scatter + ellipses area
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, plotW, h); ctx.clip();

    ctx.strokeStyle = THEME.grid; ctx.lineWidth = 1;
    for (let x = 0; x <= 8; x += 2) {
      const px = toX(x); ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, h - pad.b); ctx.stroke();
    }
    for (let y = 0; y <= 10; y += 2) {
      const py = toY(y); ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(plotW - 10, py); ctx.stroke();
    }

    // Ellipses
    for (let k = 0; k < K; k++) {
      ctx.strokeStyle = COLORS[k] + '66'; ctx.lineWidth = 2;
      for (let level = 1; level <= 2; level++) {
        ctx.beginPath();
        ctx.ellipse(toX(mu[k][0]), toY(mu[k][1]),
          sig[k][0] * level * (plotW - pad.l - 10) / (xMax - xMin) * 0.18,
          sig[k][1] * level * (h - pad.t - pad.b) / (yMax - yMin) * 0.14,
          0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Mean marker
      ctx.fillStyle = COLORS[k];
      ctx.beginPath(); ctx.arc(toX(mu[k][0]), toY(mu[k][1]), 5, 0, Math.PI * 2); ctx.fill();
    }

    // Points with responsibility coloring
    pts.forEach((p, i) => {
      const r = resp[i][0], g = resp[i][1], b = resp[i][2];
      const cr = Math.round(r * 108 + g * 0 + b * 255);
      const cg = Math.round(r * 99 + g * 212 + b * 101);
      const cb = Math.round(r * 255 + g * 170 + b * 132);
      ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 4, 0, Math.PI * 2); ctx.fill();
    });

    ctx.restore();

    // Log-likelihood chart
    if (logLikelihoods.length > 1) {
      const lx = plotW + 10, lw = llW - 20;
      ctx.fillStyle = THEME.text; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Log-Likelihood', lx + lw / 2, 18);

      const minLL = Math.min(...logLikelihoods), maxLL = Math.max(...logLikelihoods);
      const range = maxLL - minLL || 1;

      ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 2;
      ctx.beginPath();
      logLikelihoods.forEach((v, i) => {
        const px = lx + (i / (logLikelihoods.length - 1)) * lw;
        const py = pad.t + 20 + (1 - (v - minLL) / range) * (h - pad.t - pad.b - 30);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Dots
      logLikelihoods.forEach((v, i) => {
        const px = lx + (i / (logLikelihoods.length - 1)) * lw;
        const py = pad.t + 20 + (1 - (v - minLL) / range) * (h - pad.t - pad.b - 30);
        ctx.fillStyle = '#00d4aa';
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
      });
    }

    // Title
    ctx.fillStyle = THEME.text; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('EM Algorithm', pad.l, 18);
  }

  draw();
}

/* ─── 10. Boosting (AdaBoost) ──────────────────────────────────── */

function vizBoosting(container) {
  const N = 80;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const x = randn() * 2;
    const y = randn() * 2;
    // Non-linear: circle boundary
    const label = (x * x + y * y > 3) ? 1 : -1;
    pts.push({ x, y, label });
  }

  const { canvas, ctx, w, h } = setupCanvas(container);
  const bar = makeBar(container);
  let nStumps = 1;
  const stumpSlider = makeSlider(bar, '弱学习器数', 1, 50, 1, nStumps, v => { nStumps = v; draw(); });
  makeBtn(bar, '添加弱学习器', () => { nStumps = Math.min(50, nStumps + 1); stumpSlider.value = nStumps; draw(); });

  const pad = { t: 30, r: 20, b: 30, l: 40 };
  const range = 5;

  function toX(v) { return pad.l + (v + range) / (2 * range) * (w - pad.l - pad.r); }
  function toY(v) { return pad.t + (1 - (v + range) / (2 * range)) * (h - pad.t - pad.b); }

  // Pre-generate stump rules (axis-aligned)
  const stumps = [];
  for (let i = 0; i < 50; i++) {
    const axis = Math.random() < 0.5 ? 'x' : 'y';
    const threshold = (Math.random() - 0.5) * 6;
    const polarity = Math.random() < 0.5 ? 1 : -1;
    stumps.push({ axis, threshold, polarity, alpha: 0.5 + Math.random() * 0.5 });
  }

  function stumpPredict(s, x, y) {
    const v = s.axis === 'x' ? x : y;
    return s.polarity * (v > s.threshold ? 1 : -1);
  }

  function combinedPredict(x, y) {
    let val = 0;
    for (let i = 0; i < Math.min(nStumps, stumps.length); i++) {
      val += stumps[i].alpha * stumpPredict(stumps[i], x, y);
    }
    return val;
  }

  function accuracy() {
    let correct = 0;
    pts.forEach(p => {
      if (Math.sign(combinedPredict(p.x, p.y)) === p.label) correct++;
    });
    return correct / N;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, w, h);

    // Combined decision regions
    const step = 5;
    for (let px = pad.l; px < w - pad.r; px += step) {
      for (let py = pad.t; py < h - pad.b; py += step) {
        const dx = (px - pad.l) / (w - pad.l - pad.r) * 2 * range - range;
        const dy = range - (py - pad.t) / (h - pad.t - pad.b) * 2 * range;
        const val = combinedPredict(dx, dy);
        ctx.fillStyle = val > 0 ? 'rgba(255,101,132,0.12)' : 'rgba(108,99,255,0.12)';
        ctx.fillRect(px, py, step, step);
      }
    }

    // Grid
    ctx.strokeStyle = THEME.grid; ctx.lineWidth = 1;
    for (let x = -4; x <= 4; x++) {
      const px = toX(x); ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, h - pad.b); ctx.stroke();
    }
    for (let y = -4; y <= 4; y++) {
      const py = toY(y); ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(w - pad.r, py); ctx.stroke();
    }

    // Individual stump boundaries (thin gray lines)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    for (let i = 0; i < Math.min(nStumps, stumps.length); i++) {
      const s = stumps[i];
      if (s.axis === 'x') {
        const px = toX(s.threshold);
        ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, h - pad.b); ctx.stroke();
      } else {
        const py = toY(s.threshold);
        ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(w - pad.r, py); ctx.stroke();
      }
    }

    // Combined boundary (contour at 0)
    ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    const cols = 120;
    for (let i = 0; i <= cols; i++) {
      const x = -range + (2 * range) * i / cols;
      let lo = -range, hi = range, found = null;
      for (let iter = 0; iter < 20; iter++) {
        const mid = (lo + hi) / 2;
        if (combinedPredict(x, mid) > 0) hi = mid; else lo = mid;
      }
      found = (lo + hi) / 2;
      if (found > -range && found < range) {
        const px = toX(x), py = toY(found);
        if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Points
    pts.forEach(p => {
      ctx.fillStyle = p.label === 1 ? '#ff6584' : '#6c63ff';
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#1a1a24'; ctx.lineWidth = 1; ctx.stroke();
    });

    // Accuracy
    const acc = accuracy();
    ctx.fillStyle = THEME.text; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('AdaBoost', pad.l, 18);
    ctx.font = '13px system-ui'; ctx.fillStyle = '#00d4aa';
    ctx.fillText(`Accuracy: ${(acc * 100).toFixed(1)}%  |  弱学习器: ${Math.min(nStumps, stumps.length)}`, pad.l + 100, 18);
  }

  draw();
}
