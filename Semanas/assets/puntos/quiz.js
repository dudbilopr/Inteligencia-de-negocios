/* Actividad EMI de cada sesión: práctica en inglés con retroalimentación inmediata. No lleva nota. */
(function () {
  var Q = window.QUIZ, raiz = document.getElementById('quiz'), i = 0, ok = 0;
  document.title = 'EMI activity · Session ' + Q.sesion + ' | Inteligencia de Negocios';
  function pinta() {
    if (i >= Q.preguntas.length) { fin(); return; }
    var p = Q.preguntas[i];
    raiz.innerHTML = '<p class="avance">Question ' + (i + 1) + ' of ' + Q.preguntas.length + '</p><div class="pista"><i style="width:' + (i / Q.preguntas.length * 100) + '%"></i></div>' +
      '<h2>' + p.q + '</h2><div class="ops">' + p.o.map(function (t, k) { return '<button type="button" data-k="' + k + '">' + t + '</button>'; }).join('') + '</div><div class="fb" aria-live="polite"></div>';
    raiz.querySelectorAll('.ops button').forEach(function (b) { b.addEventListener('click', responder); });
    var f = raiz.querySelector('.ops button'); if (f) f.focus({ preventScroll: true });
  }
  function responder(e) {
    var p = Q.preguntas[i], k = +e.currentTarget.getAttribute('data-k'), bien = k === p.a;
    if (bien) ok++;
    raiz.querySelectorAll('.ops button').forEach(function (b, n) { b.disabled = true; if (n === p.a) b.classList.add('si'); else if (n === k) b.classList.add('no'); });
    var fb = raiz.querySelector('.fb');
    fb.innerHTML = '<p><b>' + (bien ? 'Correct.' : 'Not quite.') + '</b> ' + p.e + '</p><button type="button" class="sig">' + (i + 1 < Q.preguntas.length ? 'Next question' : 'See my result') + '</button>';
    var s = fb.querySelector('.sig'); s.addEventListener('click', function () { i++; pinta(); }); s.focus({ preventScroll: true });
  }
  function fin() {
    raiz.innerHTML = '<p class="avance">Your result</p><p class="cifra">' + ok + ' / ' + Q.preguntas.length + '</p><p class="cierre">' + Q.cierre + '</p><p class="nota">Practice only: this activity does not count toward your grade.</p><button type="button" class="sig">Try again</button>';
    raiz.querySelector('.sig').addEventListener('click', function () { i = 0; ok = 0; pinta(); });
  }
  document.getElementById('tema').textContent = Q.tema;
  document.getElementById('ses').textContent = 'Session ' + Q.sesion + ' · English immersion';
  pinta();
})();
