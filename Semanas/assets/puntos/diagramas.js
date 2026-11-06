/* Diagramas vectoriales de la Unidad 4: curvas Bézier y luz que viaja por las conexiones.
   Se dibujan como SVG, así que no pierden resolución y se pueden animar.
   Uso: <svg data-d="ruta" data-o='{...}'></svg> */
(function () {
  var NS = ' xmlns="http://www.w3.org/2000/svg"';
  function luz(d, retraso, dur, clase) {
    var est = 'animation-delay:' + (retraso || 0) + 's;animation-duration:' + (dur || 3.4) + 's';
    return '<path class="via ' + (clase || '') + '" d="' + d + '"/>' +
      '<path class="estela" d="' + d + '" pathLength="100" style="' + est + '"/>' +
      '<path class="nucleo" d="' + d + '" pathLength="100" style="' + est + '"/>';
  }
  function curva(a, b) {
    var dx = (b[0] - a[0]) / 2;
    return 'C' + (a[0] + dx) + ' ' + a[1] + ' ' + (b[0] - dx) + ' ' + b[1] + ' ' + b[0] + ' ' + b[1];
  }
  function textoLineas(x, y, s, cls, al, alto) {
    return s.split('|').map(function (l, i) {
      return '<text class="' + cls + '" x="' + x + '" y="' + (y + i * alto) + '" text-anchor="' + (al || 'middle') + '">' + l + '</text>';
    }).join('');
  }
  var D = {
    /* Recorrido con estaciones */
    ruta: function (o) {
      var it = o.items, n = it.length, W = o.w || 1424, H = o.h || 330, m = 86, y0 = o.y || 150, amp = o.amp || 34;
      var pts = it.map(function (x, i) { return [m + i * (W - 2 * m) / (n - 1), y0 + (i % 2 ? amp : -amp)]; });
      var d = 'M0 ' + y0 + ' ' + curva([0, y0], pts[0]);
      for (var i = 1; i < n; i++) d += curva(pts[i - 1], pts[i]);
      d += curva(pts[n - 1], [W, y0]);
      var s = luz(d, 0, o.dur || 7);
      it.forEach(function (x, i) {
        var p = pts[i], arriba = i % 2 === 0;
        s += '<circle class="nodo ' + (x.foco ? 'foco' : '') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (x.foco ? 15 : 11) + '"/>';
        if (x.h) s += '<text class="d-h ' + (x.foco ? 'foco' : '') + '" x="' + p[0] + '" y="' + (p[1] - 30) + '" text-anchor="middle">' + x.h + '</text>';
        s += textoLineas(p[0], p[1] + 50, x.t, 'd-t ' + (x.foco ? 'foco' : ''), 'middle', 34);
      });
      return ['0 0 ' + W + ' ' + H, s];
    },
    /* 100 ostras, dos perlas */
    ostras: function () {
      var conc = 'M0-13C8-13 12-4 10 5 8 12-5 14-10 7-13 1-8-13 0-13Z', estrias = 'M-5-7C-1-2 0 4-1 10M3-9C5-3 5 3 3 9', s = '', r = 0, sem = 7;
      function az() { sem = (sem * 16807) % 2147483647; return sem / 2147483647; }
      var GA = Math.PI * (3 - Math.sqrt(5)), elegidas = { 21: [0, 0], 68: [0, 0] };
      for (var i = 0; i < 100; i++) {
        var rad = 17.5 * Math.sqrt(i + .5), an = i * GA, x = 240 + rad * Math.cos(an), y = 285 + rad * Math.sin(an), rot = az() * 360;
        var e = elegidas[i];
        if (e) { e[0] = x; e[1] = y; }
        s += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + rot.toFixed(0) + ')"><path class="concha ' + (e ? 'viva' : '') + '" d="' + conc + '"/><path class="estria" d="' + estrias + '"/></g>';
      }
      var a = elegidas[21], b = elegidas[68], P1 = [760, 150], P2 = [760, 400];
      var alta = a[1] < b[1] ? a : b, baja = a[1] < b[1] ? b : a;
      var d1 = 'M' + alta[0] + ' ' + alta[1] + ' C' + (alta[0] + 230) + ' ' + (alta[1] - 40) + ' ' + (P2[0] - 280) + ' ' + (P2[1] + 10) + ' ' + (P2[0] - 44) + ' ' + P2[1];
      var d2 = 'M' + baja[0] + ' ' + baja[1] + ' C' + (baja[0] + 230) + ' ' + (baja[1] + 40) + ' ' + (P1[0] - 280) + ' ' + (P1[1] - 10) + ' ' + (P1[0] - 44) + ' ' + P1[1];
      s += luz(d1, 0, 3.6) + luz(d2, 1.2, 3.6);
      [P1, P2].forEach(function (p) { s += '<circle class="perla" cx="' + p[0] + '" cy="' + p[1] + '" r="46" fill="url(#gPerla)"/><circle class="brillo" cx="' + (p[0] - 14) + '" cy="' + (p[1] - 16) + '" r="9"/>'; });
      s += '<text class="d-h" x="240" y="560" text-anchor="middle">100 ostras: lo que exploras</text><text class="d-h foco" x="760" y="520" text-anchor="middle">2 perlas: lo que muestras</text>';
      var defs = '<defs><radialGradient id="gPerla" cx=".36" cy=".32" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".62" stop-color="#e5ded2"/><stop offset="1" stop-color="#a99f92"/></radialGradient></defs>';
      return ['0 0 980 580', defs + s];
    },
    /* Tres corrientes que confluyen en una oración */
    corrientes: function (o) {
      var W = o.w || 1424, H = o.h || 340, Y = [50, 170, 290], X0 = 340, X1 = 700, C = 170, s = '', et = o.etq;
      var cls = ['cinta', 'cinta c', 'cinta b'], g = [15, 12, 15];
      Y.forEach(function (y, i) {
        var w = g[i];
        var top = 'M' + X0 + ' ' + (y - w) + 'C' + (X0 + 210) + ' ' + (y - w) + ' ' + (X1 - 190) + ' ' + (C - 2) + ' ' + X1 + ' ' + (C - 2);
        var bot = 'L' + X1 + ' ' + (C + 2) + 'C' + (X1 - 190) + ' ' + (C + 2) + ' ' + (X0 + 210) + ' ' + (y + w) + ' ' + X0 + ' ' + (y + w) + 'Z';
        s += '<path class="' + cls[i] + '" d="' + top + bot + '"/>';
        s += '<circle class="nodo ' + (i === 1 ? 'foco' : '') + '" cx="' + X0 + '" cy="' + y + '" r="13"/>';
        s += textoLineas(X0 - 34, y + 10 - (et[i].indexOf('|') >= 0 ? 16 : 0), et[i], 'd-h', 'end', 34);
        s += '<path class="estela" d="M' + X0 + ' ' + y + 'C' + (X0 + 210) + ' ' + y + ' ' + (X1 - 190) + ' ' + C + ' ' + X1 + ' ' + C + 'L' + W + ' ' + C + '" pathLength="100" style="animation-delay:' + (i * .9) + 's;animation-duration:4.2s"/>';
        s += '<path class="nucleo" d="M' + X0 + ' ' + y + 'C' + (X0 + 210) + ' ' + y + ' ' + (X1 - 190) + ' ' + C + ' ' + X1 + ' ' + C + 'L' + W + ' ' + C + '" pathLength="100" style="animation-delay:' + (i * .9) + 's;animation-duration:4.2s"/>';
      });
      s += '<line class="via fuerte" x1="' + X1 + '" y1="' + C + '" x2="' + W + '" y2="' + C + '"/>';
      return ['0 0 ' + W + ' ' + H, s];
    },
    /* Una historia es una curva de tensión */
    arco: function (o) {
      var d = 'M0 330L190 330C470 330 500 44 720 44 930 44 920 196 1130 196L1424 196', s = luz(d, 0, 5.2);
      var n = [[190, 330, 'Comienzo', 0], [720, 44, 'Conflicto', 1], [1130, 196, 'Final', 0]];
      n.forEach(function (p) {
        s += '<circle class="nodo ' + (p[3] ? 'foco' : '') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[3] ? 15 : 12) + '"/>';
        s += '<text class="d-g ' + (p[3] ? 'foco' : '') + '" x="' + (p[0] + (p[3] ? 34 : 0)) + '" y="' + (p[1] - (p[3] ? -12 : 28)) + '" text-anchor="' + (p[3] ? 'start' : 'middle') + '">' + p[2] + '</text>';
      });
      s += '<text class="d-t" x="1424" y="370" text-anchor="end">tiempo de la presentación</text><text class="d-t" x="0" y="30">tensión</text>';
      return ['0 0 1424 380', s];
    },
    /* Del dato a tres públicos: nodo de puntos y tres curvas de luz */
    salas: function () {
      var c = [330, 290], s = '', sem = 11;
      function az() { sem = (sem * 16807) % 2147483647; return sem / 2147483647; }
      for (var i = 0; i < 300; i++) { var r = 7 * Math.sqrt(i), a = i * 2.39996; s += '<circle class="semilla ' + (az() < .49 ? 'c' : '') + '" cx="' + (c[0] + r * Math.cos(a)).toFixed(1) + '" cy="' + (c[1] + r * Math.sin(a)).toFixed(1) + '" r="3"/>'; }
      var d1 = 'M' + (c[0] + 110) + ' ' + (c[1] - 40) + ' C620 ' + (c[1] - 60) + ' 640 80 900 80';
      var d2 = 'M' + (c[0] + 125) + ' ' + c[1] + ' L900 ' + c[1];
      var d3 = 'M' + (c[0] + 110) + ' ' + (c[1] + 40) + ' C620 ' + (c[1] + 60) + ' 640 500 900 500';
      s += luz(d1, 0, 3.4) + luz(d2, 1.1, 3.4) + luz(d3, 2.2, 3.4);
      s += '<text class="d-g" x="930" y="108" style="fill:var(--compra)">81 %</text><text class="d-t" x="1120" y="106">Junta</text>';
      [[930, 45], [960, 25], [990, 35], [1020, 15], [1050, 28]].forEach(function (b) { s += '<rect x="' + b[0] + '" y="' + (c[1] + 30 - b[1] * 2) + '" width="22" height="' + (b[1] * 2) + '" fill="var(--punto)"/>'; });
      s += '<text class="d-t" x="1120" y="' + (c[1] + 12) + '">Gerencia</text>';
      [0, 1, 2].forEach(function (k) { s += '<line x1="930" x2="1090" y1="' + (470 + k * 30) + '" y2="' + (470 + k * 30) + '" stroke="var(--tinta-2)" stroke-width="2"/>'; });
      s += '<text class="d-t" x="1120" y="512">Operación</text>';
      return ['0 0 1290 580', s];
    },
    /* Principio de la pirámide: la respuesta arriba, y la luz baja hacia las razones */
    piramide: function (o) {
      var W = 1420, H = 690, s = '', top = [650, 92], nA = o.a.length, nD = o.d.length;
      var ax = o.a.map(function (t, i) { return [650 + (i - 1) * 420, 330]; });
      var dx = o.d.map(function (t, i) { return [650 + (i - 2.5) * 226, 570]; });
      ax.forEach(function (a, i) {
        s += luz('M' + top[0] + ' ' + (top[1] + 56) + 'C' + top[0] + ' 232 ' + a[0] + ' 232 ' + a[0] + ' ' + (a[1] - 42), i * .7, 3.2);
        for (var k = 0; k < 2; k++) {
          var d = dx[i * 2 + k];
          s += luz('M' + a[0] + ' ' + (a[1] + 42) + 'C' + a[0] + ' 470 ' + d[0] + ' 450 ' + d[0] + ' ' + (d[1] - 22), 1 + i * .5 + k * .4, 3.2);
        }
      });
      s += '<circle class="pir p0" cx="' + top[0] + '" cy="' + top[1] + '" r="58"/>';
      s += '<text class="d-g" x="' + (top[0] + 76) + '" y="' + (top[1] + 14) + '" style="font-size:38px">' + o.r + '</text>';
      ax.forEach(function (a, i) {
        s += '<circle class="pir" cx="' + a[0] + '" cy="' + a[1] + '" r="40"/>';
        s += textoLineas(a[0] + 56, a[1] - 6, o.a[i], 'd-h', 'start', 34);
      });
      dx.forEach(function (d, i) {
        s += '<circle class="pir p2" cx="' + d[0] + '" cy="' + d[1] + '" r="20"/>';
        s += textoLineas(d[0], d[1] + 52, o.d[i], 'd-t pequeno', 'middle', 28);
      });
      return ['0 0 ' + W + ' ' + H, s];
    },
    /* Situación, complicación, resolución sobre una sola curva */
    scr: function () {
      var d = 'M0 270L150 270C420 270 400 50 700 50 980 50 960 220 1240 220L1424 220', s = luz(d, 0, 4.6);
      [[150, 270, 'Situación', 0], [700, 50, 'Complicación', 1], [1240, 220, 'Resolución', 0]].forEach(function (p) {
        s += '<circle class="nodo ' + (p[3] ? 'foco' : '') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[3] ? 15 : 12) + '"/>';
        s += '<text class="d-g ' + (p[3] ? 'foco' : '') + '" x="' + (p[3] ? p[0] + 34 : p[0]) + '" y="' + (p[3] ? p[1] + 14 : p[1] - 28) + '" text-anchor="' + (p[3] ? 'start' : 'middle') + '">' + p[2] + '</text>';
      });
      return ['0 0 1424 300', s];
    },
    /* Flujo Sankey con datos reales: las cintas son proporcionales y la luz viaja por ellas */
    flujo: function (o) {
      var W = 900, H = 640, E = o.etapas, s = '', esc = 480 / E.total, x0 = 90, x1 = 420, x2 = 780, gap = 56;
      function cinta(xa, ya, ha, xb, yb, hb, cls) {
        var m = (xa + xb) / 2;
        return '<path class="cinta2 ' + cls + '" d="M' + xa + ' ' + ya + 'C' + m + ' ' + ya + ' ' + m + ' ' + yb + ' ' + xb + ' ' + yb + 'L' + xb + ' ' + (yb + hb) + 'C' + m + ' ' + (yb + hb) + ' ' + m + ' ' + (ya + ha) + ' ' + xa + ' ' + (ya + ha) + 'Z"/>';
      }
      var hC = E.con * esc, hS = E.sin * esc, yIni = 60, hT = E.total * esc;
      var yC = 44, yS = yC + hC + gap;
      s += cinta(x0, yIni, hC, x1, yC, hC, 'c') + cinta(x0, yIni + hC, hS, x1, yS, hS, '');
      var a = E.con_compra * esc, b = E.con_no * esc, c = E.sin_compra * esc, e = E.sin_no * esc;
      var yCompra = 44, yNo = yCompra + a + c + gap + 26;
      s += cinta(x1, yC, a, x2, yCompra, a, 'c fuerte') + cinta(x1, yS, c, x2, yCompra + a, c, 'c');
      s += cinta(x1, yC + a, b, x2, yNo, b, '') + cinta(x1, yS + c, e, x2, yNo + b, e, '');
      [[x0, yIni, hT], [x1, yC, hC], [x1, yS, hS], [x2, yCompra, a + c], [x2, yNo, b + e]].forEach(function (r) { s += '<rect class="barra-f" x="' + (r[0] - 5) + '" y="' + r[1] + '" width="10" height="' + r[2] + '"/>'; });
      var mid1 = (x0 + x1) / 2, mid2 = (x1 + x2) / 2;
      var luzD = 'M' + x0 + ' ' + (yIni + hC / 2) + 'C' + mid1 + ' ' + (yIni + hC / 2) + ' ' + mid1 + ' ' + (yC + hC / 2) + ' ' + x1 + ' ' + (yC + hC / 2) + 'C' + mid2 + ' ' + (yC + hC / 2) + ' ' + mid2 + ' ' + (yCompra + a / 2) + ' ' + x2 + ' ' + (yCompra + a / 2);
      s += '<path class="estela" d="' + luzD + '" pathLength="100" style="animation-duration:3.2s"/><path class="nucleo" d="' + luzD + '" pathLength="100" style="animation-duration:3.2s"/>';
      s += textoLineas(x0 - 14, yIni + hT / 2 - 16, E.t_total, 'd-h', 'end', 33);
      s += textoLineas(x1, yC + hC / 2 + 8, '', 'd-h', 'middle', 0);
      s += '<text class="d-t" x="' + x1 + '" y="' + (yS + hS + 34) + '" text-anchor="middle">' + E.t_sin + '</text>';
      s += '<text class="d-h foco" x="' + x1 + '" y="26" text-anchor="middle">' + E.t_con + '</text>';
      s += textoLineas(x2 + 16, yCompra + (a + c) / 2 - 8, E.t_compra, 'd-h foco', 'start', 32);
      s += textoLineas(x2 + 16, yNo + (b + e) / 2 - 8, E.t_no, 'd-t', 'start', 32);
      return ['-160 0 1240 ' + H, s];
    },
    /* Conector entre columnas */
    enlace: function (o) {
      var n = o.n || 3, W = o.w || 1424, H = 90, pts = [], s = '', hueco = o.hueco == null ? 56 : o.hueco, cw = (W - hueco * (n - 1)) / n;
      for (var i = 0; i < n; i++) pts.push([i * (cw + hueco) + 16, 45]);
      var d = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (var j = 1; j < n; j++) {
        var a = pts[j - 1], b = pts[j], mx = (a[0] + b[0]) / 2;
        d += 'C' + mx + ' ' + (j % 2 ? -10 : 100) + ' ' + mx + ' ' + (j % 2 ? -10 : 100) + ' ' + b[0] + ' ' + b[1];
      }
      s += luz(d, 0, 4);
      pts.forEach(function (p) { s += '<circle class="nodo" cx="' + p[0] + '" cy="' + p[1] + '" r="11"/>'; });
      return ['0 0 ' + W + ' ' + H, s];
    }
  };
  document.querySelectorAll('svg[data-d]').forEach(function (el) {
    var o = el.getAttribute('data-o'), r = D[el.getAttribute('data-d')](o ? JSON.parse(o) : {});
    el.setAttribute('viewBox', r[0]);
    el.classList.add('diagrama');
    el.setAttribute('role', 'img');
    el.innerHTML = r[1];
  });
})();
