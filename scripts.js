
   LUNA DE OCTUBRE – scripts.js
   ================================================ */

/* CAMBIA ESTE NÚMERO por el WhatsApp real */
var WA_NUMERO = '521XXXXXXXXXX';

/* ================================================
   MENÚ RESPONSIVE
   ================================================ */
var navToggle = document.getElementById('nav-toggle');
var navLinks  = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

/* ================================================
   FILTROS DE PRODUCTOS
   ================================================ */
var filterBtns = document.querySelectorAll('.fb');
var cards      = document.querySelectorAll('.pcard');

filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterBtns.forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    var cat = btn.getAttribute('data-cat');
    cards.forEach(function (c) {
      c.style.display = (cat === 'todos' || c.getAttribute('data-cat') === cat) ? '' : 'none';
    });
  });
});

/* Aplicar filtro desde URL: tienda.html?cat=muneca */
(function () {
  var params = new URLSearchParams(window.location.search);
  var cat    = params.get('cat');
  if (!cat) return;
  var btn = document.querySelector('.fb[data-cat="' + cat + '"]');
  if (btn) btn.click();
})();

/* ================================================
   MODAL DE PRODUCTO
   ================================================ */
var modal      = document.getElementById('modal');
var modalClose = document.getElementById('modal-close');
var mEmoji     = document.getElementById('m-emoji');
var mTitle     = document.getElementById('m-title');
var mDesc      = document.getElementById('m-desc');
var mPrice     = document.getElementById('m-price');
var mWa        = document.getElementById('modal-wa');

function abrirModal(card) {
  if (!modal) return;
  var nombre = card.getAttribute('data-name')  || '';
  var emoji  = card.getAttribute('data-emoji') || '';
  var desc   = card.getAttribute('data-desc')  || '';
  var precio = card.getAttribute('data-price') || '';
  mEmoji.textContent = emoji;
  mTitle.textContent = nombre;
  mDesc.textContent  = desc;
  mPrice.textContent = precio !== 'Cotizar' ? precio + ' MXN' : 'Cotizar — escríbeme para más info';
  var msg = encodeURIComponent('Hola! Vi tu tienda Luna de Octubre 🌙 y me interesa: ' + nombre + ' (' + precio + ')');
  if (mWa) mWa.href = 'https://wa.me/' + WA_NUMERO + '?text=' + msg;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

cards.forEach(function (c) {
  c.addEventListener('click', function () { abrirModal(c); });
});

if (modalClose) modalClose.addEventListener('click', cerrarModal);
if (modal) {
  modal.addEventListener('click', function (e) {
    if (e.target === modal) cerrarModal();
  });
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') cerrarModal();
});

/* ================================================
   CANVAS – ESTRELLAS + BRUJITA EN ESCOBA
   ================================================ */
(function () {
  var sc  = document.getElementById('starfield');
  var wc  = document.getElementById('witchcanvas');
  if (!sc || !wc) return;

  var sctx  = sc.getContext('2d');
  var wctx  = wc.getContext('2d');
  var stars = [];
  var W, H;

  /* -- resize -- */
  function resize() {
    W = sc.width  = wc.width  = window.innerWidth;
    H = sc.height = wc.height = window.innerHeight;
  }

  /* -- generar estrellas -- */
  function initStars() {
    stars = [];
    var n = Math.floor(W * H / 2400);
    /* estrellas pequeñas */
    for (var i = 0; i < n; i++) {
      stars.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.2 + 0.2,
        base: Math.random() * 0.45 + 0.05,
        sp: Math.random() * 0.01 + 0.003,
        ph: Math.random() * Math.PI * 2
      });
    }
    /* estrellas grandes y brillantes */
    for (var j = 0; j < Math.floor(n * 0.1); j++) {
      stars.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.0 + 1.6,
        base: Math.random() * 0.45 + 0.3,
        sp: Math.random() * 0.012 + 0.004,
        ph: Math.random() * Math.PI * 2
      });
    }
  }

  /* -- animar estrellas -- */
  function drawStars() {
    sctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s  = stars[i];
      s.ph  += s.sp;
      var op = s.base + Math.sin(s.ph) * (s.base * 0.55);
      sctx.beginPath();
      sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sctx.fillStyle = 'rgba(255,255,255,' + op + ')';
      sctx.fill();
    }
    requestAnimationFrame(drawStars);
  }

  /* -- dibujar brujita en escoba -- */
  function drawWitch(x, y, op) {
    wctx.save();
    wctx.globalAlpha  = op;
    wctx.shadowColor  = 'rgba(192,132,252,0.5)';
    wctx.shadowBlur   = 8;

    /* escoba */
    wctx.save();
    wctx.translate(x, y);
    wctx.rotate(-0.18);

    /* palo */
    wctx.beginPath();
    wctx.moveTo(-42, 9);
    wctx.lineTo( 42, -5);
    wctx.strokeStyle = '#b5813a';
    wctx.lineWidth   = 3;
    wctx.lineCap     = 'round';
    wctx.stroke();

    /* cerdas */
    var bristles = ['#8B6914','#a07820','#c9a84c','#8B6914','#c9a84c','#a07820'];
    for (var b = 0; b < 6; b++) {
      wctx.beginPath();
      wctx.moveTo(-38 + b * 2.8,  5);
      wctx.lineTo(-48 + b * 2.8, 18 + b * 1.5);
      wctx.strokeStyle = bristles[b];
      wctx.lineWidth   = 1.5;
      wctx.stroke();
    }

    /* atadura */
    wctx.beginPath();
    wctx.moveTo(-42, 8);
    wctx.lineTo(-24, 2);
    wctx.strokeStyle = '#5a3e10';
    wctx.lineWidth   = 5;
    wctx.stroke();

    wctx.restore();

    /* cuerpo brujita */
    wctx.save();
    wctx.translate(x, y);

    /* capa */
    wctx.beginPath();
    wctx.moveTo(0, -2);
    wctx.lineTo(-12, 11);
    wctx.lineTo( 12, 11);
    wctx.closePath();
    wctx.fillStyle = '#2d1a4a';
    wctx.fill();

    /* brazo sujetando */
    wctx.beginPath();
    wctx.moveTo(-3, 2);
    wctx.lineTo(14, 7);
    wctx.strokeStyle = '#2d1a4a';
    wctx.lineWidth   = 3;
    wctx.lineCap     = 'round';
    wctx.stroke();

    /* mano */
    wctx.beginPath();
    wctx.arc(14, 7, 2.5, 0, Math.PI * 2);
    wctx.fillStyle = '#f5cba7';
    wctx.fill();

    /* cabeza */
    wctx.beginPath();
    wctx.arc(0, -8, 7, 0, Math.PI * 2);
    wctx.fillStyle = '#f5cba7';
    wctx.fill();

    /* pelo */
    wctx.beginPath();
    wctx.arc(0, -8, 7, Math.PI, Math.PI * 2);
    wctx.fillStyle = '#1a0a1a';
    wctx.fill();

    /* mechón volando */
    wctx.beginPath();
    wctx.moveTo(-7, -10);
    wctx.quadraticCurveTo(-20, -18, -16, -25);
    wctx.strokeStyle = '#1a0a1a';
    wctx.lineWidth   = 2;
    wctx.stroke();

    /* ojos */
    wctx.beginPath(); wctx.arc(-2.5, -8.5, 1.2, 0, Math.PI * 2); wctx.fillStyle = '#1a0a1a'; wctx.fill();
    wctx.beginPath(); wctx.arc( 2.5, -8.5, 1.2, 0, Math.PI * 2); wctx.fillStyle = '#1a0a1a'; wctx.fill();

    /* ala sombrero */
    wctx.beginPath();
    wctx.ellipse(0, -14, 10, 2.5, 0, 0, Math.PI * 2);
    wctx.fillStyle = '#1a0a1a';
    wctx.fill();

    /* cuerpo sombrero */
    wctx.beginPath();
    wctx.moveTo(-5, -14);
    wctx.lineTo(-3, -28);
    wctx.lineTo( 3, -28);
    wctx.lineTo( 5, -14);
    wctx.closePath();
    wctx.fillStyle = '#1a0a1a';
    wctx.fill();

    /* cintillo morado */
    wctx.beginPath();
    wctx.moveTo(-4.8, -16);
    wctx.lineTo( 4.8, -16);
    wctx.strokeStyle = '#7c3aed';
    wctx.lineWidth   = 2;
    wctx.stroke();

    /* piernas */
    wctx.beginPath();
    wctx.moveTo(-4, 10); wctx.lineTo(-5, 20);
    wctx.moveTo( 4, 10); wctx.lineTo( 5, 20);
    wctx.strokeStyle = '#2d1a4a';
    wctx.lineWidth   = 2.5;
    wctx.stroke();

    /* zapatitos */
    wctx.beginPath(); wctx.ellipse(-6, 20, 4, 2, -0.3, 0, Math.PI * 2); wctx.fillStyle = '#1a0a1a'; wctx.fill();
    wctx.beginPath(); wctx.ellipse( 6, 20, 4, 2,  0.3, 0, Math.PI * 2); wctx.fillStyle = '#1a0a1a'; wctx.fill();

    wctx.restore();
    wctx.restore();
  }

  /* -- animación de vuelo -- */
  var flying = false;

  function flyWitch() {
    if (flying) return;
    flying = true;

    var moonEl = document.getElementById('moon');
    var moonCX = W / 2;
    var moonCY = H * 0.35;

    if (moonEl) {
      var r  = moonEl.getBoundingClientRect();
      moonCX = r.left + r.width  / 2;
      moonCY = r.top  + r.height / 2;
    }

    var startX   = -100;
    var endX     = W + 100;
    var duration = 3400;
    var t0       = null;
    var startY   = moonCY - 55;
    var endY     = moonCY - 35;
    var px       = (moonCX - startX) / (endX - startX);

    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / duration, 1);
      var x = startX + (endX - startX) * p;

      var y;
      if (p <= px) {
        y = startY + (moonCY - startY) * Math.sin((p / px) * (Math.PI / 2));
      } else {
        y = moonCY + (endY - moonCY) * Math.sin(((p - px) / (1 - px)) * (Math.PI / 2));
      }

      var op = 1;
      if (p < 0.08) op = p / 0.08;
      if (p > 0.88) op = (1 - p) / 0.12;

      wctx.clearRect(0, 0, W, H);
      drawWitch(x, y, op);

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        wctx.clearRect(0, 0, W, H);
        flying = false;
      }
    }

    requestAnimationFrame(step);
  }

  /* -- arrancar todo -- */
  resize();
  initStars();
  requestAnimationFrame(drawStars);

  window.addEventListener('resize', function () {
    resize();
    initStars();
  });

  setTimeout(flyWitch, 2500);
  setInterval(flyWitch, 10000);
})();
