/* Dirige la cámara: marca qué escena ya pasó y cuál viene, mueve las capas de fondo y dibuja los iconos.
   Se carga antes de puntos.js. */
(function () {
  var escenas = Array.prototype.slice.call(document.querySelectorAll('.esc'));
  var base = document.body.getAttribute('data-cine') || 'dolly', esc = document.getElementById('escenario');
  escenas.forEach(function (e, i) {
    e.setAttribute('data-c', e.getAttribute('data-cine') || base);
    e.setAttribute('data-pos', i ? 'despues' : 'antes');
  });
  /* Iconos: <i class="ico" data-i="database"></i> */
  document.querySelectorAll('.ico[data-i]').forEach(function (n) {
    var c = (window.ICONOS || {})[n.getAttribute('data-i')];
    if (!c) { n.style.display = 'none'; return; }
    n.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + c + '</svg>';
    n.querySelectorAll('svg > *').forEach(function (f) { f.setAttribute('pathLength', '1'); });
  });
  function capas(i) {
    esc.style.setProperty('--cam', i);
    document.querySelectorAll('.plx').forEach(function (p) {
      var vx = +p.getAttribute('data-vx') || 0, vy = +p.getAttribute('data-vy') || 0;
      p.style.transform = 'translate3d(' + (-i * vx) + 'px,' + (-i * vy) + 'px,0)';
    });
  }
  var previa = 0, haz = document.getElementById('haz');
  function colocar() {
    var a = -1;
    escenas.forEach(function (e, i) { if (e.classList.contains('activa')) a = i; });
    if (a < 0) return;
    escenas.forEach(function (e, i) {
      /* La escena que va a entrar toma el movimiento propio de la que le toca */
      e.setAttribute('data-pos', i < a ? 'antes' : i > a ? 'despues' : 'actual');
    });
    capas(a);
    if (haz && a !== previa) { haz.className = ''; void haz.offsetWidth; haz.className = a > previa ? 'adelante' : 'atras'; }
    previa = a;
  }
  var ob = new MutationObserver(colocar);
  escenas.forEach(function (e) { ob.observe(e, { attributes: true, attributeFilter: ['class'] }); });
})();
