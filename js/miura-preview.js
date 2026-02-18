(function () {
  function drawMiuraTopView() {
    const canvas = document.getElementById('miura-top-view');
    if (!canvas) return;

    const dpr  = window.devicePixelRatio || 1;
    const CW   = canvas.offsetWidth;
    const CH   = 280;
    canvas.width  = CW * dpr;
    canvas.height = CH * dpr;
    canvas.style.height = CH + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    ctx.beginPath();
    ctx.rect(0, 0, CW, CH);
    ctx.clip();

    const COLS  = 9;
    const ROWS  = 6;
    const gamma = 60 * Math.PI / 180;

    const a       = CW / (COLS + 0.5);
    const dx      = a * Math.cos(gamma);
    const dy_step = (CH - 20) / ROWS;
    const padTop  = 10;

    function nx(r, c) {
      return r % 2 === 0 ? c * a : c * a + dx;
    }
    function ny(r) {
      return padTop + r * dy_step;
    }

    const lw = Math.max(1, CW / 500);

    for (let r = 0; r < ROWS; r++) {
      const cellsInRow = r % 2 === 0 ? COLS : COLS - 1;
      for (let c = 0; c < cellsInRow; c++) {
        const tlx = nx(r,     c);     const tly = ny(r);
        const trx = nx(r,     c + 1); const try_ = ny(r);
        const blx = nx(r + 1, c);     const bly = ny(r + 1);
        const brx = nx(r + 1, c + 1); const bry = ny(r + 1);

        ctx.fillStyle = (c + r) % 2 === 0
          ? 'rgba(74,  158, 255, 0.05)'
          : 'rgba(245, 200,  66, 0.06)';

        ctx.beginPath();
        ctx.moveTo(tlx, tly);
        ctx.lineTo(trx, try_);
        ctx.lineTo(brx, bry);
        ctx.lineTo(blx, bly);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.strokeStyle = 'rgba(100, 180, 255, 0.55)';
    ctx.lineWidth   = lw;
    ctx.setLineDash([lw * 4, lw * 3]);

    for (let r = 0; r <= ROWS; r++) {
      const segs = r % 2 === 0 ? COLS : COLS - 1;
      for (let c = 0; c < segs; c++) {
        ctx.beginPath();
        ctx.moveTo(nx(r, c),     ny(r));
        ctx.lineTo(nx(r, c + 1), ny(r));
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);

    for (let r = 0; r < ROWS; r++) {
      const isEven   = r % 2 === 0;
      const nodeCols = isEven ? COLS + 1 : COLS;

      for (let c = 0; c < nodeCols; c++) {
        const x0 = nx(r, c);
        const y0 = ny(r);
        const y1 = ny(r + 1);

        if (isEven) {
          if (c > 0) {
            ctx.strokeStyle = 'rgba(245, 200, 66, 0.5)';
            ctx.lineWidth   = lw * 0.9;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(nx(r + 1, c - 1), y1);
            ctx.stroke();
          }
          if (c < COLS) {
            ctx.strokeStyle = 'rgba(245, 200, 66, 0.95)';
            ctx.lineWidth   = lw * 1.6;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(nx(r + 1, c), y1);
            ctx.stroke();
          }
        } else {
          ctx.strokeStyle = 'rgba(245, 200, 66, 0.95)';
          ctx.lineWidth   = lw * 1.6;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(nx(r + 1, c), y1);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(245, 200, 66, 0.5)';
          ctx.lineWidth   = lw * 0.9;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(nx(r + 1, c + 1), y1);
          ctx.stroke();
        }
      }
    }

    for (let r = 0; r <= ROWS; r++) {
      const nodeCols  = r % 2 === 0 ? COLS + 1 : COLS;
      const isRidge   = r % 2 === 0;
      ctx.fillStyle   = isRidge ? 'rgba(245,200,66,1)' : 'rgba(245,200,66,0.55)';
      const dotR      = isRidge ? Math.max(2.5, lw * 2.8) : Math.max(1.5, lw * 1.6);
      for (let c = 0; c < nodeCols; c++) {
        ctx.beginPath();
        ctx.arc(nx(r, c), ny(r), dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawMiuraTopView);
  } else {
    drawMiuraTopView();
  }
  window.addEventListener('resize', drawMiuraTopView);
})();