/* Ayudas comunes de las sesiones 3 a 10: luz por las conexiones, curvas y formato de cifras. */
window.PUNTOS_DATOS = window.PUNTOS_DATOS || [];
window.CUR = {
  luz: function (d, r, dur, cl) {
    var e = 'animation-delay:' + (r || 0) + 's;animation-duration:' + (dur || 3.4) + 's';
    return '<path class="via ' + (cl || '') + '" d="' + d + '"/><path class="estela" d="' + d + '" pathLength="100" style="' + e + '"/><path class="nucleo" d="' + d + '" pathLength="100" style="' + e + '"/>';
  },
  suave: function (p) {
    var d = 'M' + p[0][0] + ' ' + p[0][1];
    for (var i = 1; i < p.length; i++) { var mx = (p[i - 1][0] + p[i][0]) / 2; d += 'C' + mx + ' ' + p[i - 1][1] + ' ' + mx + ' ' + p[i][1] + ' ' + p[i][0] + ' ' + p[i][1]; }
    return d;
  },
  miles: function (n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); },
  ic: function (n, x, y, t, color) {
    var c = (window.ICONOS || {})[n] || '';
    c = c.replace(/<(path|circle|rect|line|polyline|polygon|ellipse) /g, '<$1 pathLength="1" ');
    return '<svg class="icov" x="' + x + '" y="' + y + '" width="' + t + '" height="' + t + '" viewBox="0 0 24 24" style="color:' + (color || 'var(--acento-texto)') + '">' + c + '</svg>';
  },
  poner: function (id, html) { document.getElementById(id).innerHTML = html; }
};
