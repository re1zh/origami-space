(function () {
  const MAT_NAMES = {
    '1': 'Обычная бумага',
    '2': 'Ватман',
    '3': 'Картон',
    '4': 'Фольга алюминиевая',
  };
  const MAT_WEIGHTS = { '1': 80, '2': 200, '3': 300, '4': 50 };

  function drawPreview(canvas, cols, rows, angle) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth * dpr;
    canvas.height = 220 * dpr;
    canvas.style.height = '220px';
    ctx.scale(dpr, dpr);

    const CW = canvas.offsetWidth;
    const CH = 220;

    ctx.beginPath();
    ctx.rect(0, 0, CW, CH);
    ctx.clip();

    const maxCols = Math.min(cols, 16);
    const maxRows = Math.min(rows, 9);

    const gamma = (angle * Math.PI) / 180;

    const dx = CW / (maxCols + 0.5) * Math.cos(gamma);
    const dy = (CH * 0.88) / maxRows - dx * Math.tan(gamma) * 0.1;
    const a  = CW / (maxCols + 0.5);

    const dy_step = (CH * 0.9) / maxRows;

    function nx(r, c) {
      return r % 2 === 0 ? c * a : c * a + dx;
    }
    function ny(r) {
      return r * dy_step + 8;
    }

    for (let r = 0; r < maxRows; r++) {
      const cellsInRow = r % 2 === 0 ? maxCols : maxCols - 1;
      for (let c = 0; c < cellsInRow; c++) {
        const tlx = nx(r,     c);     const tly = ny(r);
        const trx = nx(r,     c + 1); const try_ = ny(r);
        const blx = nx(r + 1, c);     const bly = ny(r + 1);
        const brx = nx(r + 1, c + 1); const bry = ny(r + 1);

        const isLight = (c + r) % 2 === 0;
        ctx.fillStyle = isLight
          ? 'rgba(74, 158, 255, 0.04)'
          : 'rgba(245, 200, 66, 0.05)';

        ctx.beginPath();
        ctx.moveTo(tlx, tly);
        ctx.lineTo(trx, try_);
        ctx.lineTo(brx, bry);
        ctx.lineTo(blx, bly);
        ctx.closePath();
        ctx.fill();
      }
    }

    const lw = Math.max(0.8, CW / 700);

    ctx.strokeStyle = 'rgba(100, 180, 255, 0.55)';
    ctx.lineWidth   = lw;
    ctx.setLineDash([lw * 4, lw * 3]);

    for (let r = 0; r <= maxRows; r++) {
      const segs = r % 2 === 0 ? maxCols : maxCols - 1;
      for (let c = 0; c < segs; c++) {
        ctx.beginPath();
        ctx.moveTo(nx(r, c),     ny(r));
        ctx.lineTo(nx(r, c + 1), ny(r));
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);

    for (let r = 0; r < maxRows; r++) {
      const isEven   = r % 2 === 0;
      const nodeCols = isEven ? maxCols + 1 : maxCols;

      for (let c = 0; c < nodeCols; c++) {
        const x0 = nx(r, c);
        const y0 = ny(r);
        const y1 = ny(r + 1);

        if (isEven) {
          if (c > 0) {
            ctx.strokeStyle = 'rgba(245, 200, 66, 0.55)';
            ctx.lineWidth   = lw * 0.9;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(nx(r + 1, c - 1), y1);
            ctx.stroke();
          }
          if (c < maxCols) {
            ctx.strokeStyle = 'rgba(245, 200, 66, 0.95)';
            ctx.lineWidth   = lw * 1.5;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(nx(r + 1, c), y1);
            ctx.stroke();
          }
        } else {
          ctx.strokeStyle = 'rgba(245, 200, 66, 0.95)';
          ctx.lineWidth   = lw * 1.5;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(nx(r + 1, c), y1);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(245, 200, 66, 0.55)';
          ctx.lineWidth   = lw * 0.9;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(nx(r + 1, c + 1), y1);
          ctx.stroke();
        }
      }
    }

    for (let r = 0; r <= maxRows; r++) {
      const nodeCols  = r % 2 === 0 ? maxCols + 1 : maxCols;
      const isRidge   = r % 2 === 0;
      const dotRadius = isRidge
        ? Math.max(2, lw * 2.5)
        : Math.max(1.2, lw * 1.5);
      ctx.fillStyle = isRidge
        ? 'rgba(245, 200, 66, 1)'
        : 'rgba(245, 200, 66, 0.6)';

      for (let c = 0; c < nodeCols; c++) {
        ctx.beginPath();
        ctx.arc(nx(r, c), ny(r), dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /* ─ Основной расчёт ─ */
  function calculate() {
    const W     = parseFloat(document.getElementById('c-width').value)  || 297;
    const H     = parseFloat(document.getElementById('c-height').value) || 420;
    const sx    = parseFloat(document.getElementById('c-step-x').value) || 30;
    const sy    = parseFloat(document.getElementById('c-step-y').value) || 40;
    const angle = parseFloat(document.getElementById('c-angle').value)  || 60;
    const mat   = document.getElementById('c-material').value || '2';

    const rad     = angle * Math.PI / 180;
    const cols    = Math.floor(W / sx);
    const rows    = Math.floor(H / sy);
    const cells   = cols * rows;
    const lines   = (cols + 1) * rows + (rows + 1) * cols;
    const shift   = Math.round(sx / 2 * 10) / 10;

    const foldedW = Math.round(sx * Math.cos(rad) * 10) / 10;
    const foldedH = Math.round(sy * 0.22 * 10) / 10;
    const compact = Math.round((foldedW * foldedH) / (W * H) * 100 * 10) / 10;

    const areaM2  = (W * H) / 1e6;
    const weight  = Math.round(MAT_WEIGHTS[mat] * areaM2 * 10) / 10;

    document.getElementById('calc-placeholder').style.display = 'none';
    document.getElementById('calc-result-area').style.display = 'block';

    document.getElementById('result-grid').innerHTML = `
      <div class="result-card">
        <div class="r-label">Столбцов складок</div>
        <div class="r-value">${cols}<span class="r-unit">шт</span></div>
      </div>
      <div class="result-card">
        <div class="r-label">Рядов складок</div>
        <div class="r-value">${rows}<span class="r-unit">шт</span></div>
      </div>
      <div class="result-card">
        <div class="r-label">Всего ячеек</div>
        <div class="r-value">${cells}<span class="r-unit">шт</span></div>
      </div>
      <div class="result-card">
        <div class="r-label">Линий разметки</div>
        <div class="r-value">${lines}<span class="r-unit">шт</span></div>
      </div>
      <div class="result-card">
        <div class="r-label">Смещение зигзага</div>
        <div class="r-value">${shift}<span class="r-unit">мм</span></div>
      </div>
      <div class="result-card">
        <div class="r-label">Вес заготовки</div>
        <div class="r-value">${weight}<span class="r-unit">г</span></div>
      </div>
      <div class="result-card">
        <div class="r-label">Ширина в сложенном виде</div>
        <div class="r-value">${foldedW}<span class="r-unit">мм</span></div>
      </div>
      <div class="result-card">
        <div class="r-label">Степень компактности</div>
        <div class="r-value">${compact}<span class="r-unit">%</span></div>
      </div>
      <div class="result-card full">
        <div class="r-label">Итоговая сводка</div>
        <div style="font-size:13px;color:var(--muted);line-height:1.7;margin-top:8px">
          ${MAT_NAMES[mat]}, лист ${W}×${H} мм — шаг ${sx}×${sy} мм, угол ${angle}°.<br>
          Получится <strong style="color:var(--text)">${cols}×${rows} = ${cells} ячеек</strong>.
          В сложенном виде: <strong style="color:var(--gold)">${foldedW}×${foldedH} мм</strong> —
          это ${compact}% от исходной площади.
        </div>
      </div>
    `;


    const canvas = document.getElementById('grid-canvas');
    if (canvas) drawPreview(canvas, cols, rows, angle);
  }

  const btn = document.getElementById('calc-submit');
  if (btn) btn.addEventListener('click', calculate);

  document.querySelectorAll('.calc-inputs input, .calc-inputs select').forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
  });
})();