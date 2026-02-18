(function () {
  const isSubpage = window.location.pathname.includes('/pages/');
  const root = isSubpage ? '../' : './';

  const NAV_HTML = `
<nav>
  <a class="nav-logo" href="${root}index.html">✦ Оригами<span>/</span>Космос</a>
  <ul class="nav-links" id="nav-links">
    <li><a href="${root}pages/research.html">Исследование</a></li>
    <li><a href="${root}pages/miura.html">Миура-ори</a></li>
    <li><a href="${root}pages/calculator.html">Калькулятор</a></li>
    <li><a href="${root}pages/instructions.html">Инструкции</a></li>
  </ul>
  <button class="nav-burger" id="nav-burger" aria-label="Меню" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="nav-mobile" id="nav-mobile">
  <a href="${root}pages/research.html">Исследование</a>
  <a href="${root}pages/miura.html">Миура-ори</a>
  <a href="${root}pages/calculator.html">Калькулятор</a>
  <a href="${root}pages/instructions.html">Инструкции</a>
</div>`;

  const FOOTER_HTML = `
<footer>
  <div class="container">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">✦ Оригами в Космосе</div>
        <p>Исследовательская работа о применении<br>оригами-инженерии в современных<br>космических технологиях.</p>
      </div>
      <div class="footer-author">
        <div class="footer-author-title">Автор</div>
        <div class="footer-author-name">Едисеев Алексей</div>
        <div class="footer-author-grade">4 «Г» класс</div>
        <div class="footer-author-school">
          МОБУ СОШ №33 им. Л.А. Колосовой
          <strong>Руководитель: Винокурова Сардана Борисовна</strong>
        </div>
      </div>
    </div>
    <nav class="footer-nav">
      <a href="${root}index.html">Главная</a>
      <a href="${root}pages/research.html">Исследование</a>
      <a href="${root}pages/miura.html">Миура-ори</a>
      <a href="${root}pages/calculator.html">Калькулятор</a>
      <a href="${root}pages/instructions.html">Инструкции</a>
    </nav>
    <div class="footer-bottom">
      <p>© 2025 Едисеев Алексей<span class="dot"></span>МОБУ СОШ №33</p>
      <p>Королевские чтения · 2025</p>
    </div>
  </div>
</footer>`;

  const navTarget    = document.getElementById('nav-root');
  const footerTarget = document.getElementById('footer-root');
  if (navTarget)    navTarget.outerHTML    = NAV_HTML;
  if (footerTarget) footerTarget.outerHTML = FOOTER_HTML;
})();
