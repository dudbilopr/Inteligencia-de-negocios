/* Motor de la Unidad 4. Cada visitante del caso es un punto; cada escena reorganiza los mismos puntos.
   Escena: <section class="esc" data-p='{"f":"columnas","por":"desc"}'>. Un .paso puede cambiar los puntos con su propio data-p.
   Teclas: flechas o espacio, F pantalla completa, L tema claro u oscuro, N notas del docente. */
(function () {
  'use strict';
  var W = 1600, H = 900;
  var escenario = document.getElementById('escenario');
  var lienzo = document.getElementById('lienzo');
  var ctx = lienzo.getContext('2d');
  var escenas = Array.prototype.slice.call(document.querySelectorAll('.esc'));
  var calma = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CIFRAS = window.PUNTOS_CIFRAS || {};
  var D = window.PUNTOS_DATOS.map(function (r, i) {
    var t = r[0];
    return { i: i, tiempo: t, rebote: r[1], valor: r[2], compra: r[3], entr: r[4], p: r[5], mes: r[6], tipo: r[7],
      bandaT: t < 5 ? 'Menos de 5' : t < 20 ? '5 a 20' : t < 60 ? '20 a 60' : 'Más de 60', conValor: r[2] > 0 ? 'Con valor' : 'Sin valor' };
  });

  function azar(semilla) { var s = semilla; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  var r0 = azar(20261106);
  var puntos = D.map(function (d) {
    var x = r0() * W, y = r0() * H;
    return { d: d, x: x, y: y, r: 7, c: 0, a: 1, x0: x, y0: y, r0: 7, c0: 0, a0: 1, tx: x, ty: y, tr: 7, tc: 0, ta: 1, retraso: 0, j: r0(), k: r0() };
  });

  var colores = {};
  function leerColores() {
    var cs = getComputedStyle(document.documentElement);
    colores.punto = hex(cs.getPropertyValue('--punto'));
    colores.compra = hex(cs.getPropertyValue('--compra'));
    colores.tinta = cs.getPropertyValue('--tinta').trim();
    colores.tinta2 = cs.getPropertyValue('--tinta-2').trim();
    colores.regla = cs.getPropertyValue('--regla').trim();
    colores.acento = cs.getPropertyValue('--acento-texto').trim();
  }
  function hex(s) { s = s.trim().replace('#', ''); return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]; }
  function mezcla(t) {
    var a = colores.punto, b = colores.compra;
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' + Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ')';
  }
  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  /* ---------- Formas: cada una asigna destino a los puntos y devuelve notas y guías ---------- */
  var AREA = [760, 90, 760, 700];
  var formas = {
    /* Nube inicial: la gente sin ordenar */
    nube: function (o) {
      var a = o.area || [0, 0, W, H];
      puntos.forEach(function (p) {
        p.tx = a[0] + 18 + p.j * (a[2] - 36); p.ty = a[1] + 18 + p.k * (a[3] - 36);
        p.tr = o.r || 8; p.ta = o.a == null ? 1 : o.a; p.tc = o.pinta && p.d.compra ? 1 : 0;
      });
      return {};
    },
    /* Se retiran al borde inferior y acompañan sin competir con el texto */
    banda: function () {
      puntos.forEach(function (p) {
        p.tx = 12 + (p.d.i / 299) * (W - 24); p.ty = H - 17;
        p.tr = 2.2; p.ta = .75; p.tc = p.d.compra;
      });
      return {};
    },
    /* Una persona, un punto */
    reja: function (o) {
      var a = o.area || AREA, cols = o.cols || 25, orden = D.slice().sort(function (x, y) { return y.compra - x.compra || x.i - y.i; });
      var paso = a[2] / cols, filas = Math.ceil(300 / cols), r = Math.min(paso, a[3] / filas) * .38;
      orden.forEach(function (d, n) {
        var p = puntos[d.i];
        p.tx = a[0] + paso * ((n % cols) + .5); p.ty = a[1] + (a[3] / filas) * (Math.floor(n / cols) + .5);
        p.tr = r; p.ta = 1; p.tc = o.pinta === false ? 0 : d.compra;
      });
      return {};
    },
    /* Exploración: tiempo (escala logarítmica) contra tasa de rebote */
    dispersion: function (o) {
      var a = o.area || AREA, m = 62;
      var X = function (v) { return a[0] + m + Math.log(1 + v) / Math.log(1 + 400) * (a[2] - m - 12); };
      var Y = function (v) { return a[1] + a[3] - 44 - Math.sqrt(v / 20) * (a[3] - 60); };
      puntos.forEach(function (p) { p.tx = Math.min(a[0] + a[2], X(p.d.tiempo)) + (p.j - .5) * 8; p.ty = Y(p.d.rebote) + (p.k - .5) * 14 - 7; p.tr = 7; p.ta = .95; p.tc = p.d.compra; });
      var g = [{ l: [X(0), Y(0), X(400), Y(0)] }, { l: [X(0), Y(0), X(0), Y(20)] }];
      var n = [
        { x: X(400), y: Y(0) + 34, t: 'Minutos en páginas de producto (escala logarítmica)', al: 'right', s: 24, col: 'tinta2' },
        { x: X(0) + 10, y: Y(20) + 8, t: 'Tasa de rebote (escala raíz)', al: 'left', s: 24, col: 'tinta2' }
      ];
      return { guias: g, notas: n };
    },
    /* Unidades apiladas por categoría. Compradores abajo. */
    columnas: function (o) {
      var a = o.area || AREA, por = o.por || 'bandaT', cats = o.cats || ['Menos de 5', '5 a 20', '20 a 60', 'Más de 60'], foco = o.foco, nc = cats.length;
      var hueco = 26, ancho = (a[2] - hueco * (nc - 1)) / nc, cfil = o.cfil || 5, tam = ancho / cfil, base = a[1] + a[3] - 56;
      var notas = [], guias = [{ l: [a[0], base + 8, a[0] + a[2], base + 8] }];
      cats.forEach(function (cat, ci) {
        var g = D.filter(function (d) { return d[por] === cat; }).sort(function (x, y) { return y.compra - x.compra || x.i - y.i; });
        var enFoco = !foco || foco.indexOf(cat) >= 0, x0 = a[0] + ci * (ancho + hueco), nCompra = 0;
        g.forEach(function (d, n) {
          var p = puntos[d.i];
          p.tx = x0 + tam * ((n % cfil) + .5); p.ty = base - tam * (Math.floor(n / cfil) + .5);
          p.tr = tam * .36; p.ta = enFoco ? 1 : .22; p.tc = o.pinta === false ? (enFoco && foco ? 1 : 0) : d.compra;
          if (d.compra) nCompra++;
        });
        var alto = Math.ceil(g.length / cfil) * tam;
        notas.push({ x: x0 + ancho / 2, y: base + 44, t: String(cat), al: 'center', s: 28, col: enFoco ? 'tinta' : 'tinta2', peso: 600 });
        if (o.tasas !== false && enFoco) notas.push({ x: x0 + ancho / 2, y: base - alto - 16, t: o.conteo ? String(g.length) : o.reales ? o.reales[ci] : Math.round(nCompra / g.length * 100) + ' %', al: 'center', s: foco ? 46 : 32, col: foco ? 'acento' : 'tinta', peso: 800 });
      });
      if (o.eje) notas.push({ x: a[0] + a[2], y: a[1] - 2, t: o.eje, al: 'right', s: 24, col: 'tinta2' });
      return { guias: guias, notas: notas };
    },
    /* Distribución en espejo: arriba compraron, abajo no. Cualquier variable en el eje. */
    espejo: function (o) {
      var a = o.area || AREA, bins = o.bins || 26, ancho = a[2] / bins, cab = 46, pie = 46, campo = o.campo || 'p';
      var LO = function (p) { p = Math.max(.001, Math.min(.999, p)); return (Math.log(p / (1 - p)) + 6) / 11; };
      var fx = campo === 'tiempo' ? function (v) { return Math.min(.999, Math.log(1 + v) / Math.log(1 + 400)); } : function (v) { return Math.min(.999, LO(v)); };
      var alto = a[3] - cab - pie, base = a[1] + cab + alto * .5, c = {}, maxU = 0, maxD = 0;
      D.forEach(function (d) {
        var b = Math.floor(fx(d[campo]) * bins), k = b + '_' + d.compra; c[k] = (c[k] || 0) + 1;
        if (d.compra) maxU = Math.max(maxU, c[k]); else maxD = Math.max(maxD, c[k]);
      });
      /* escalas independientes por lado: comparar forma, no cantidad */
      var colD = 3, tamU = Math.min(ancho, (alto * .36) / Math.max(1, maxU)), tamD = Math.min(ancho / colD, (alto * .58) / Math.max(1, Math.ceil(maxD / colD)));
      var base2 = a[1] + cab + alto * .38;
      c = {};
      D.slice().sort(function (x, y) { return x[campo] - y[campo]; }).forEach(function (d) {
        var b = Math.floor(fx(d[campo]) * bins), k = b + '_' + d.compra; c[k] = (c[k] || 0) + 1;
        var p = puntos[d.i], f = c[k] - .5;
        var n0 = c[k] - 1; p.tx = a[0] + (b + .5) * ancho + (d.compra ? 0 : ((n0 % colD) - 1) * tamD); p.ty = d.compra ? base2 - 10 - f * tamU : base2 + 10 + (Math.floor(n0 / colD) + .5) * tamD;
        p.tr = Math.max(3, (d.compra ? tamU : tamD) * .42); p.ta = 1; p.tc = d.compra;
      });
      var yEje = a[1] + a[3] - 10, marcas = campo === 'tiempo' ? [[0, '0'], [Math.log(11) / Math.log(401), '10 min'], [Math.log(61) / Math.log(401), '1 h'], [1, '6 h']] : [[LO(.01), '1 %'], [LO(.1), '10 %'], [LO(.5), '50 %'], [LO(.9), '90 %'], [LO(.99), '99 %']];
      var notas = marcas.map(function (m, i) { return { x: a[0] + m[0] * a[2], y: yEje, t: m[1], al: i === 0 ? 'left' : i === marcas.length - 1 ? 'right' : 'center', s: 27, col: 'tinta2' }; });
      notas.push({ x: a[0] + a[2], y: a[1] + 24, t: 'Compraron', al: 'right', s: 30, col: 'acento', peso: 700 });
      notas.push({ x: a[0] + a[2], y: base2 + 44, t: 'No compraron', al: 'right', s: 30, col: 'tinta2', peso: 700 });
      return { guias: [{ l: [a[0], base2, a[0] + a[2], base2] }], notas: notas };
    },
    /* Reloj del año: cada rayo es un mes; su largo, la tasa de compra real */
    reloj: function (o) {
      var a = o.area || AREA, cx = a[0] + a[2] / 2, cy = a[1] + a[3] / 2, R = Math.min(a[2], a[3]) * .46, r0 = 74;
      var meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], M = CIFRAS.meses, idx = 0, notas = [], guias = [];
      var orden = D.slice().sort(function (x, y) { return y.compra - x.compra || x.i - y.i; });
      var pos = [];
      meses.forEach(function (mes, i) {
        var th = -Math.PI / 2 + i * Math.PI / 6, c = Math.cos(th), s = Math.sin(th), info = M[mes];
        if (!info) { notas.push({ x: cx + c * (r0 + 30), y: cy + s * (r0 + 30) + 8, t: mes, al: 'center', s: 23, col: 'tinta2' }); return; }
        var largo = info.tasa / .3 * (R - r0), nD = Math.max(1, Math.round(info.tasa * 100));
        for (var k = 0; k < nD; k++) pos.push({ x: cx + c * (r0 + (k + .5) / nD * largo), y: cy + s * (r0 + (k + .5) / nD * largo), foco: !o.foco || o.foco.indexOf(mes) >= 0 });
        guias.push({ l: [cx + c * r0, cy + s * r0, cx + c * (r0 + largo), cy + s * (r0 + largo)] });
        var enF = !o.foco || o.foco.indexOf(mes) >= 0;
        notas.push({ x: cx + c * (r0 + largo + 54), y: cy + s * (r0 + largo + 54) - 6, t: mes, al: 'center', s: enF ? 28 : 23, col: enF ? 'tinta' : 'tinta2', peso: 700 });
        notas.push({ x: cx + c * (r0 + largo + 54), y: cy + s * (r0 + largo + 54) + 22, t: (info.tasa * 100).toFixed(1).replace('.', ',') + ' %', al: 'center', s: enF ? 28 : 21, col: enF && o.foco ? 'acento' : 'tinta2', peso: enF && o.foco ? 800 : 500 });
      });
      orden.forEach(function (d, n) {
        var p = puntos[d.i], q = pos[n];
        if (q) { p.tx = q.x; p.ty = q.y; p.tr = 6.5; p.ta = q.foco ? 1 : .35; p.tc = 1; }
        else { var u = (n - pos.length) * 2.39996, ra = Math.sqrt(n - pos.length) * 4.1; p.tx = cx + ra * Math.cos(u); p.ty = cy + ra * Math.sin(u); p.tr = 1.6; p.ta = .45; p.tc = 0; }
      });
      return { notas: notas, guias: [] };
    },
    /* Curva de alcance real sobre los datos de prueba: los puntos caminan por la curva */
    alcance: function (o) {
      var a = o.area || AREA, m = 64, x0 = a[0] + m, y0 = a[1] + a[3] - 56, W2 = a[2] - m - 20, H2 = a[3] - 96, G = CIFRAS.ganancia_curva, q = o.q == null ? null : o.q;
      var X = function (v) { return x0 + v * W2; }, Y = function (v) { return y0 - v * H2; };
      var pts = G.map(function (v, i) { return [X(i / 50), Y(i === 0 ? 0 : v)]; });
      var enOrden = D.slice().sort(function (x, y) { return y.p - x.p; });
      enOrden.forEach(function (d, n) {
        var f = n / 299 * 50, i = Math.min(49, Math.floor(f)), t = f - i, P = puntos[d.i];
        P.tx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t; P.ty = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
        P.tr = 5; P.ta = 1; P.tc = (q != null && n / 299 <= q) ? 1 : 0;
      });
      var notas = [
        { x: x0 + W2, y: y0 + 40, t: 'Visitas, de más a menos probable', al: 'right', s: 24, col: 'tinta2' },
        { x: x0, y: a[1] + 2, t: 'Compradores alcanzados', al: 'left', s: 24, col: 'tinta2' },
        { x: X(.7), y: Y(.66), t: 'al azar', al: 'left', s: 25, col: 'tinta2' }
      ];
      var guias = [{ l: [x0, y0, x0 + W2, y0] }, { l: [x0, y0, x0, y0 - H2] }, { l: [x0, y0, x0 + W2, y0 - H2], d: [6, 8] }];
      if (q != null) {
        var v = CIFRAS.alcance[String(Math.round(q * 100))];
        guias.push({ l: [X(q), y0, X(q), Y(v)], d: [4, 6] });
        notas.push({ x: X(q) + 16, y: Y(v) + 44, t: Math.round(v * 100) + ' %', al: 'left', s: 66, col: 'acento', peso: 800 });
        notas.push({ x: X(q), y: y0 + 40, t: Math.round(q * 100) + ' %', al: 'center', s: 28, col: 'tinta', peso: 700 });
      }
      return { guias: guias, notas: notas };
    },
    /* Matriz de confusión del conjunto de prueba: cada punto representa unas 8 sesiones */
    matriz: function (o) {
      var a = o.area || AREA, m = 8, pad = 18, P = CIFRAS.prueba, tot = P.VP + P.VN + P.FP + P.FN;
      var cw = (a[2] - m - pad) / 2, ch = (a[3] - m - pad) / 2;
      var C = [['VP', 0, 0, 1, 'Compró y lo vio'], ['FN', 1, 0, 1, 'Compró y no lo vio'], ['FP', 0, 1, 0, 'No compró y falló'], ['VN', 1, 1, 0, 'No compró y acertó']];
      var cuantos = C.map(function (c) { return Math.round(P[c[0]] / tot * 300); });
      cuantos[3] = 300 - cuantos[0] - cuantos[1] - cuantos[2];
      var i = 0, notas = [];
      C.forEach(function (c, ci) {
        var cf = 17, t = (cw - 30) / cf, x0 = a[0] + m + c[1] * (cw + pad) + 14, y0 = a[1] + m + c[2] * (ch + pad) + 62, enF = !o.errores || c[0] === 'FN';
        for (var k = 0; k < cuantos[ci]; k++, i++) {
          var p = puntos[i];
          p.tx = x0 + (k % cf + .5) * t; p.ty = y0 + Math.floor(k / cf) * t * 1.02 + t / 2; p.tr = t * .36; p.ta = enF ? 1 : .22; p.tc = c[3];
        }
        notas.push({ x: x0, y: y0 - 22, t: P[c[0]].toLocaleString('es-CO') + '  ' + c[4], al: 'left', s: 28, col: c[0] === 'FN' ? 'acento' : 'tinta', peso: 700 });
      });
      return { notas: notas, guias: [{ l: [a[0] + m + cw + pad / 2, a[1] + m, a[0] + m + cw + pad / 2, a[1] + a[3]] }, { l: [a[0] + m, a[1] + m + ch + pad / 2, a[0] + a[2], a[1] + m + ch + pad / 2] }] };
    },
    /* Barras de unidades: cada punto vale una cantidad fija */
    barras: function (o) {
      var a = o.area || AREA, v = o.valores, et = o.etq, foco = o.foco || [], k = v.reduce(function (s, x) { return s + x; }, 0) / 300;
      var nc = v.length, hueco = 22, ancho = (a[2] - hueco * (nc - 1)) / nc, cfil = o.cfil || 5, tam = ancho / cfil, base = a[1] + a[3] - 66, notas = [], guias = [{ l: [a[0], base + 8, a[0] + a[2], base + 8] }];
      var cupo = v.map(function (x) { return Math.floor(x / k); }), f = 300 - cupo.reduce(function (s, x) { return s + x; }, 0);
      for (var i = 0; f > 0; i = (i + 1) % nc, f--) cupo[i]++;
      var pi = 0;
      cupo.forEach(function (c, ci) {
        var x0 = a[0] + ci * (ancho + hueco), hay = foco.indexOf(ci) >= 0;
        for (var n = 0; n < c; n++, pi++) {
          var p = puntos[pi];
          p.tx = x0 + tam * ((n % cfil) + .5); p.ty = base - tam * (Math.floor(n / cfil) + .5);
          p.tr = tam * .36; p.ta = (foco.length && !hay) ? .55 : 1; p.tc = hay ? 1 : 0;
        }
        var alto = Math.ceil(c / cfil) * tam;
        notas.push({ x: x0 + ancho / 2, y: base + 44, t: et[ci], al: 'center', s: 26, col: hay ? 'tinta' : 'tinta2', peso: hay ? 700 : 500 });
        notas.push({ x: x0 + ancho / 2, y: base - alto - 14, t: (o.pre || '') + fmt(v[ci]), al: 'center', s: hay ? 34 : 26, col: hay ? 'acento' : 'tinta2', peso: hay ? 800 : 500 });
      });
      if (o.eje) notas.push({ x: a[0], y: a[1] - 2, t: o.eje, al: 'left', s: 24, col: 'tinta2' });
      return { guias: guias, notas: notas };
    },
    /* Los puntos se vuelven los renglones de una hoja */
    pagina: function (o) {
      var a = o.area || [820, 90, 560, 720], lineas = o.lineas || 18, n = 0, orden = D.slice().sort(function (x, y) { return x.i - y.i; });
      var altoL = a[3] / lineas, cada = Math.ceil(300 / lineas), paso = a[2] / cada, largo = [1, .92, .97, .7];
      orden.forEach(function (d) {
        var fila = Math.floor(n / cada), col = n % cada, p = puntos[d.i], f = largo[fila % 4];
        p.tx = a[0] + col * paso * f + paso * .5; p.ty = a[1] + fila * altoL + altoL / 2;
        p.tr = (o.r || 3.2) * (fila === 0 ? 1.7 : 1); p.ta = 1; p.tc = fila === 0 ? 1 : 0;
        n++;
      });
      return {};
    },
    /* Un punto para cada butaca de un auditorio visto desde el escenario */
    auditorio: function (o) {
      var cx = (o.cx == null ? 800 : o.cx), cy = o.cy == null ? -120 : o.cy, filas = 9, r0 = 520, dr = 52, an = o.apertura || 1.05, luces = o.luces == null ? 0 : o.luces;
      var pesos = [], t = 0;
      for (var f = 0; f < filas; f++) { var w = r0 + f * dr; pesos.push(w); t += w; }
      var orden = D.slice().sort(function (x, y) { return x.i - y.i; }), k = 0;
      pesos.forEach(function (w, f) {
        var n = f === filas - 1 ? 300 - k : Math.round(300 * w / t);
        for (var i = 0; i < n; i++, k++) {
          var d = orden[k], p = puntos[d.i], th = -an + (2 * an) * (i + .5) / n, rad = r0 + f * dr;
          p.tx = cx + rad * Math.sin(th); p.ty = cy + rad * Math.cos(th) * .86;
          p.tr = 5 + f * .55; p.ta = 1; p.tc = 0; p.fila = f; p.orden = i;
        }
      });
      /* quienes se encienden primero son los de adelante, hacia atrás */
      var lista = puntos.slice().sort(function (x, y) { return (x.fila + x.j * 3) - (y.fila + y.j * 3); });
      lista.forEach(function (p, i) { p.tc = i < luces ? 1 : 0; });
      return {};
    },
    /* Los puntos escriben una palabra o una cifra */
    texto: function (o) {
      var a = o.area || [0, 0, W, H], off = document.createElement('canvas'), w = Math.round(a[2]), h = Math.round(a[3]);
      off.width = w; off.height = h;
      var c = off.getContext('2d'), tam = o.tam || 520;
      c.font = '800 ' + tam + 'px "Schibsted Grotesk", sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000';
      c.fillText(o.t, w / 2, h / 2 + tam * .04);
      var img = c.getImageData(0, 0, w, h).data, malla = 4, sitios = [];
      for (var y = 0; y < h; y += malla) for (var x = (y / malla % 2) * 2; x < w; x += malla) if (img[(y * w + x) * 4 + 3] > 128) sitios.push([x, y]);
      /* muestreo uniforme y separado: escoge sitios lejanos entre sí */
      var elegidos = [], paso = Math.sqrt(sitios.length * malla * malla / 300) * .96;
      for (var intento = 0; intento < 12 && elegidos.length < 300; intento++) {
        elegidos = [];
        var ocupa = {};
        for (var i = 0; i < sitios.length && elegidos.length < 300; i++) {
          var s = sitios[(i * 7919) % sitios.length], gx = Math.floor(s[0] / paso), gy = Math.floor(s[1] / paso), libre = true;
          for (var dx = -1; dx <= 1 && libre; dx++) for (var dy = -1; dy <= 1 && libre; dy++) {
            var q = ocupa[(gx + dx) + '_' + (gy + dy)];
            if (q && Math.hypot(q[0] - s[0], q[1] - s[1]) < paso) libre = false;
          }
          if (libre) { ocupa[gx + '_' + gy] = s; elegidos.push(s); }
        }
        paso *= .95;
      }
      while (elegidos.length < 300) elegidos.push(sitios[(elegidos.length * 131) % sitios.length]);
      elegidos.sort(function (m, n) { return m[0] - n[0]; });
      var orden = D.slice().sort(function (m, n) { return (m.j || 0) - (n.j || 0) || m.i - n.i; });
      orden.forEach(function (d, n) {
        var p = puntos[d.i], s = elegidos[n];
        p.tx = a[0] + s[0]; p.ty = a[1] + s[1]; p.tr = Math.max(4, paso * .36); p.ta = 1; p.tc = o.pinta && d.compra ? 1 : 0;
      });
      return {};
    }
  };

  /* ---------- Animación ---------- */
  var extra = { guias: [], notas: [] }, inicio = 0, dur = 1050, corre = false, tNotas = 1;
  function aplicar(spec) {
    if (!spec) return;
    puntos.forEach(function (p) { p.x0 = p.x; p.y0 = p.y; p.r0 = p.r; p.c0 = p.c; p.a0 = p.a; });
    var res = formas[spec.f](spec) || {};
    extra = { guias: res.guias || [], notas: res.notas || [] };
    var porX = spec.f !== 'banda';
    puntos.forEach(function (p) { p.retraso = calma ? 0 : (porX ? (p.tx / W) * 180 : 0) + p.j * 220; });
    inicio = performance.now(); tNotas = 0;
    if (calma) { puntos.forEach(function (p) { p.x = p.tx; p.y = p.ty; p.r = p.tr; p.c = p.tc; p.a = p.ta; }); tNotas = 1; dibujar(); return; }
    if (!corre) { corre = true; requestAnimationFrame(cuadro); }
  }
  function suave(t) { return 1 - Math.pow(1 - t, 4); }
  function cuadro(ahora) {
    var vivo = false;
    puntos.forEach(function (p) {
      var t = Math.min(1, Math.max(0, (ahora - inicio - p.retraso) / dur));
      if (t < 1) vivo = true;
      var e = suave(t);
      p.x = p.x0 + (p.tx - p.x0) * e; p.y = p.y0 + (p.ty - p.y0) * e; p.r = p.r0 + (p.tr - p.r0) * e;
      p.c = p.c0 + (p.tc - p.c0) * e; p.a = p.a0 + (p.ta - p.a0) * e;
    });
    tNotas = Math.min(1, Math.max(0, (ahora - inicio - 520) / 420));
    if (tNotas < 1) vivo = true;
    dibujar();
    if (vivo) requestAnimationFrame(cuadro); else corre = false;
  }
  function dibujar() {
    var esc = lienzo.width / W;
    ctx.setTransform(esc, 0, 0, esc, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = tNotas; ctx.strokeStyle = colores.regla; ctx.lineWidth = 2;
    extra.guias.forEach(function (g) {
      ctx.setLineDash(g.d || []);
      ctx.beginPath(); ctx.moveTo(g.l[0], g.l[1]); ctx.lineTo(g.l[2], g.l[3]); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.textBaseline = 'alphabetic';
    extra.notas.forEach(function (n) {
      ctx.font = (n.peso || 500) + ' ' + (n.s || 26) + 'px "Schibsted Grotesk", sans-serif';
      ctx.textAlign = n.al || 'left';
      ctx.fillStyle = n.col === 'tinta' ? colores.tinta : n.col === 'acento' ? colores.acento : colores.tinta2;
      ctx.fillText(n.t, n.x, n.y);
    });
    puntos.forEach(function (p) {
      if (p.a <= .005) return;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = mezcla(p.c);
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(.5, p.r), 0, 6.2832); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  /* ---------- Mundos ---------- */
  var cortina = document.getElementById('cortina'), mundoActual = null, ultimoX = .5, ultimoY = .5;
  function ponerMundo(m) {
    if (m === mundoActual) return;
    mundoActual = m;
    var raiz = document.documentElement;
    var fin = function () {
      if (m) raiz.setAttribute('data-mundo', m); else raiz.removeAttribute('data-mundo');
      leerColores(); dibujar();
    };
    if (!cortina || calma) { fin(); return; }
    var previo = raiz.getAttribute('data-mundo');
    /* lee el color de destino sin cambiar todavía el escenario */
    if (m) raiz.setAttribute('data-mundo', m); else raiz.removeAttribute('data-mundo');
    var color = getComputedStyle(raiz).getPropertyValue('--fondo');
    if (previo) raiz.setAttribute('data-mundo', previo); else raiz.removeAttribute('data-mundo');
    cortina.classList.remove('va');
    cortina.style.background = color;
    cortina.style.setProperty('--cx', (ultimoX * 100) + '%');
    cortina.style.setProperty('--cy', (ultimoY * 100) + '%');
    void cortina.offsetWidth;
    cortina.classList.add('va');
    clearTimeout(ponerMundo.t);
    ponerMundo.t = setTimeout(function () { fin(); cortina.classList.remove('va'); }, 740);
  }

  /* ---------- Navegación ---------- */
  var actual = -1, numPaso = 0;
  var barra = document.getElementById('barra'), contador = document.getElementById('contador'), cajaNotas = document.getElementById('notas'), ayuda = document.getElementById('ayuda');
  function pasosDe(e) { return Array.prototype.slice.call(e.querySelectorAll('.paso')); }
  function specDe(el) { var s = el.getAttribute('data-p'); return s ? JSON.parse(s) : null; }
  function ver(n, p) {
    n = Math.max(0, Math.min(escenas.length - 1, n));
    var cambia = n !== actual;
    if (cambia) {
      if (actual >= 0) escenas[actual].classList.remove('activa');
      escenas[n].classList.add('activa');
      actual = n;
      var nota = escenas[n].querySelector('aside.notas');
      cajaNotas.innerHTML = nota ? nota.innerHTML : '<em>Sin notas para esta escena.</em>';
      if (window.alEscena) window.alEscena(escenas[n]);
    }
    var ps = pasosDe(escenas[n]);
    numPaso = p == null ? 0 : Math.min(p, ps.length);
    var spec = specDe(escenas[n]), mundo = escenas[n].getAttribute('data-mundo');
    ps.forEach(function (x, i) {
      var v = i < numPaso;
      x.classList.toggle('visto', v);
      x.classList.toggle('ultimo', i === numPaso - 1);
      if (v && x.hasAttribute('data-p')) spec = specDe(x);
      if (v && x.hasAttribute('data-mundo')) mundo = x.getAttribute('data-mundo');
      var q = x.getAttribute('data-quita');
      if (q) escenas[n].querySelectorAll(q).forEach(function (el) { el.classList.toggle('quitado', v); });
      var m = x.getAttribute('data-clase');
      if (m) { var par = m.split('|'); escenas[n].querySelectorAll(par[0]).forEach(function (el) { el.classList.toggle(par[1], v); }); }
    });
    ponerMundo(mundo || document.body.getAttribute('data-mundo') || null);
    aplicar(spec);
    if (window.alPaso) window.alPaso(escenas[n], numPaso);
    barra.style.width = ((n + 1) / escenas.length * 100) + '%';
    contador.textContent = (n + 1) + ' / ' + escenas.length;
    try { history.replaceState(null, '', '#' + (n + 1) + (numPaso ? '.' + numPaso : '')); } catch (e) { /* iframe local */ }
    if (n > 0 && ayuda) ayuda.style.opacity = 0;
  }
  function siguiente() {
    var ps = pasosDe(escenas[actual]);
    if (numPaso < ps.length) ver(actual, numPaso + 1); else if (actual < escenas.length - 1) ver(actual + 1, 0);
  }
  function anterior() {
    if (numPaso > 0) ver(actual, numPaso - 1);
    else if (actual > 0) ver(actual - 1, pasosDe(escenas[actual - 1]).length);
  }
  addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') { e.preventDefault(); siguiente(); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); anterior(); }
    else if (k === 'Home') ver(0, 0);
    else if (k === 'End') ver(escenas.length - 1, 0);
    else if (k === 'f' || k === 'F') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); }
    else if (k === 'l' || k === 'L') cambiarTema();
    else if (k === 'n' || k === 'N') cajaNotas.classList.toggle('abiertas');
    else if (/^[1-9]$/.test(k) && escenas[actual].classList.contains('selector')) {
      var totalP = pasosDe(escenas[actual]).length, q = parseInt(k, 10);
      if (q <= totalP) ver(actual, q);
    }
    else if (window.alTecla) window.alTecla(k, escenas[actual]);
  });
  document.addEventListener('click', function (e) {
    var cajaE = escenario.getBoundingClientRect();
    ultimoX = (e.clientX - cajaE.left) / cajaE.width; ultimoY = (e.clientY - cajaE.top) / cajaE.height;
    if (e.target.closest('a,button,#notas')) return;
    if (e.clientX < innerWidth * .22) anterior(); else siguiente();
  });
  var tx = 0;
  addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', function (e) {
    var d = e.changedTouches[0].clientX - tx;
    if (Math.abs(d) > 40) { e.preventDefault(); if (d < 0) siguiente(); else anterior(); }
  });
  function cambiarTema() {
    var r = document.documentElement, claro = r.getAttribute('data-tema') !== 'claro';
    if (claro) r.setAttribute('data-tema', 'claro'); else r.removeAttribute('data-tema');
    try { localStorage.setItem('u4-tema', claro ? 'claro' : 'oscuro'); } catch (e) { /* sin almacenamiento */ }
    leerColores(); dibujar();
  }
  function medir() {
    var e = Math.min(innerWidth / W, innerHeight / H), dpr = Math.min(window.devicePixelRatio || 1, 2);
    escenario.style.transform = 'scale(' + e + ') translate(-50%, -50%)';
    lienzo.width = Math.round(W * e * dpr); lienzo.height = Math.round(H * e * dpr);
    dibujar();
  }
  addEventListener('resize', medir);
  addEventListener('hashchange', leerHash);
  function leerHash() {
    var m = /^#(\d+)(?:\.(\d+))?/.exec(location.hash);
    if (m) ver(parseInt(m[1], 10) - 1, m[2] ? parseInt(m[2], 10) : 0);
  }
  function arrancar() {
    try { if (localStorage.getItem('u4-tema') === 'claro') document.documentElement.setAttribute('data-tema', 'claro'); } catch (e) { /* sin almacenamiento */ }
    leerColores(); medir();
    var mi = document.body.getAttribute('data-mundo'); if (mi) { document.documentElement.setAttribute('data-mundo', mi); mundoActual = mi; leerColores(); }
    var m = /^#(\d+)(?:\.(\d+))?/.exec(location.hash);
    if (m) ver(parseInt(m[1], 10) - 1, m[2] ? parseInt(m[2], 10) : 0); else ver(0, 0);
  }
  window.PUNTOS_API = { aplicar: aplicar, puntos: puntos, ver: ver, siguiente: siguiente, anterior: anterior, total: function () { return escenas.length; }, escenaActual: function () { return actual; } };
  var f = document.fonts && document.fonts.load ? document.fonts.load('800 60px "Schibsted Grotesk"') : Promise.resolve();
  f.then(arrancar, arrancar);
})();
