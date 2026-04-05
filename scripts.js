/* ================================================
   LUNA DE OCTUBRE – scripts.js
   ================================================ */

/* CAMBIA ESTE NÚMERO por el WhatsApp real antes de publicar */
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
   FILTROS DE PRODUCTOS (tienda.html)
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
   MODAL DE PRODUCTO (tienda.html)
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
  mPrice.textContent = precio !== 'Cotizar'
    ? precio + ' MXN'
    : 'Cotizar — escríbeme para más info';

  var msg = encodeURIComponent(
    'Hola! Vi tu tienda Luna de Octubre 🌙 y me interesa: ' + nombre + ' (' + precio + ')'
  );
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
   CANVAS – ESTRELLAS Y BRUJITA
   ================================================ */
var sc   = document.getElementById('starfield');
var wc   = document.getElementById('witchcanvas');
if (!sc || !wc) return;

var sctx = sc.getContext('2d');
var wctx = wc.getContext('2d');
var stars = [];
var W, H;

function resize() {
  W = sc.width  = wc.width  = window.innerWidth;
  H = sc.height = wc.height = window.innerHeight;
}

function initStars() {
  stars = [];
  var n = Math.floor(W * H / 2600);
  for (var i = 0; i < n; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      base: Math.random() * 0.45 + 0.05,
      sp: Math.random() * 0.01 + 0.003,
      ph: Math.random() * Math.PI * 2
    });
  }
  /* estrellas grandes y brillantes */
  for (var j = 0; j < Math.floor(n * 0.08); j++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.0 + 1.5,
      base: Math.random() * 0.4 + 0.3,
      sp: Math.random() * 0.012 + 0.005,
      ph: Math.random() * Math.PI * 2
    });
  }
}

function drawStars() {
  sctx.clearRect(0, 0, W, H);
  for (var i = 0; i < stars.length; i++) {
    var s = stars[i];
    s.ph += s.sp;
    var op = s.base + Math.sin(s.ph) * (s.base * 0.55);
    sctx.beginPath();
    sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sctx.fillStyle = 'rgba(255,255,255,' + op + ')';
    sctx.fill();
  }
  requestAnimationFrame(drawStars);
}

/* ---- DIBUJAR BRUJITA EN ESCOBA ---- */
function drawWitchOnBroom(x, y, opacity) {
  wctx.save();
  wctx.globalAlpha = opacity;
  wctx.shadowColor = 'rgba(192,132,252,0.45)';
  wctx.shadowBlur  = 8;

  var s = 1.0;

  wctx.save();
  wctx.translate(x, y);
  wctx.rotate(-0.18);

  /* palo de la escoba */
  wctx.beginPath();
  wctx.moveTo(-40 * s, 8 * s);
  wctx.lineTo(40 * s, -4 * s);
  wctx.strokeStyle = '#b5813a';
  wctx.lineWidth   = 3 * s;
  wctx.lineCap     = 'round';
  wctx.stroke();

  /* cerdas */
  var bristles = ['#8B6914','#a07820','#c9a84c','#8B6914','#c9a84c','#a07820'];
  for (var b = 0; b < 6; b++) {
    wctx.beginPath();
    wctx.moveTo(-36 * s + b * 2.5 * s, 5 * s);
    wctx.lineTo(-36 * s + b * 2.5 * s - 11 * s, 17 * s + b * 1.5 * s);
    wctx.strokeStyle = bristles[b];
    wctx.lineWidth   = 1.5 * s;
    wctx.stroke();
  }

  /* atadura */
  wctx.beginPath();
  wctx.moveTo(-40 * s, 7 * s);
  wctx.lineTo(-22 * s, 2 * s);
  wctx.strokeStyle = '#5a3e10';
  wctx.lineWidth   = 4.5 * s;
  wctx.stroke();

  wctx.restore();

  /* ---- BRUJITA ---- */
  wctx.save();
  wctx.translate(x, y);

  /* cuerpo / capa */
  wctx.beginPath();
  wctx.moveTo(0, -2 * s);
  wctx.lineTo(-11 * s, 10 * s);
  wctx.lineTo(11 * s, 10 * s);
  wctx.closePath();
  wctx.fillStyle = '#2d1a4a';
  wctx.fill();

  /* brazo sujetando escoba */
  wctx.beginPath();
  wctx.moveTo(-3 * s, 2 * s);
  wctx.lineTo(13 * s, 6 * s);
  wctx.strokeStyle = '#2d1a4a';
  wctx.lineWidth   = 3 * s;
  wctx.lineCap     = 'round';
  wctx.stroke();

  /* mano */
  wctx.beginPath();
  wctx.arc(13 * s, 6 * s, 2.5 * s, 0, Math.PI * 2);
  wctx.fillStyle = '#f5cba7';
  wctx.fill();

  /* cabeza */
  wctx.beginPath();
  wctx.arc(0, -7 * s, 7 * s, 0, Math.PI * 2);
  wctx.fillStyle = '#f5cba7';
  wctx.fill();

  /* pelo */
  wctx.beginPath();
  wctx.arc(0, -7 * s, 7 * s, Math.PI, Math.PI * 2);
  wctx.fillStyle = '#1a0a1a';
  wctx.fill();

  /* mechón volando */
  wctx.beginPath();
  wctx.moveTo(-7 * s, -9 * s);
  wctx.quadraticCurveTo(-19 * s, -17 * s, -15 * s, -23 * s);
  wctx.strokeStyle = '#1a0a1a';
  wctx.lineWidth   = 2 * s;
  wctx.stroke();

  /* ojos */
  wctx.beginPath();
  wctx.arc(-2.5 * s, -7.5 * s, 1.2 * s, 0, Math.PI * 2);
  wctx.fillStyle = '#1a0a1a';
  wctx.fill();
  wctx.beginPath();
  wctx.arc(2.5 * s, -7.5 * s, 1.2 * s, 0, Math.PI * 2);
  wctx.fillStyle = '#1a0a1a';
  wctx.fill();

  /* ala del sombrero */
  wctx.beginPath();
  wctx.ellipse(0, -13 * s, 10 * s, 2.5 * s, 0, 0, Math.PI * 2);
  wctx.fillStyle = '#1a0a1a';
  wctx.fill();

  /* cuerpo del sombrero */
  wctx.beginPath();
  wctx.moveTo(-5 * s, -13 * s);
  wctx.lineTo(-3 * s, -27 * s);
  wctx.lineTo(3 * s, -27 * s);
  wctx.lineTo(5 * s, -13 * s);
  wctx.closePath();
  wctx.fillStyle = '#1a0a1a';
  wctx.fill();

  /* cintillo morado */
  wctx.beginPath();
  wctx.moveTo(-4.8 * s, -15.5 * s);
  wctx.lineTo(4.8 * s, -15.5 * s);
  wctx.strokeStyle = '#7c3aed';
  wctx.lineWidth   = 1.8 * s;
  wctx.stroke();

  /* piernas */
  wctx.beginPath();
  wctx.moveTo(-4 * s, 9 * s);
  wctx.lineTo(-5 * s, 19 * s);
  wctx.moveTo(4 * s, 9 * s);
  wctx.lineTo(5 * s, 19 * s);
  wctx.strokeStyle = '#2d1a4a';
  wctx.lineWidth   = 2.5 * s;
  wctx.stroke();

  /* zapatitos */
  wctx.beginPath();
  wctx.ellipse(-6 * s, 19 * s, 4 * s, 2 * s, -0.3, 0, Math.PI * 2);
  wctx.fillStyle = '#1a0a1a';
  wctx.fill();
  wctx.beginPath();
  wctx.ellipse(6 * s, 19 * s, 4 * s, 2 * s, 0.3, 0, Math.PI * 2);
  wctx.fillStyle = '#1a0a1a';
  wctx.fill();

  wctx.restore();
  wctx.restore();
}

/* ---- ANIMACIÓN DE VUELO ---- */
var flying = false;

function flyWitch() {
  if (flying) return;
  flying = true;

  /* Buscar la luna en la página actual */
  var moonEl  = document.getElementById('moon');
  var moonCX  = W / 2;
  var moonCY  = H * 0.35;

  if (moonEl) {
    var r = moonEl.getBoundingClientRect();
    moonCX = r.left + r.width  / 2;
    moonCY = r.top  + r.height / 2;
  }

  var startX   = -90;
  var endX     = W + 90;
  var duration = 3400;
  var start    = null;

  /* altura inicio y fin (más arriba que la luna) */
  var startY = moonCY - 55;
  var endY   = moonCY - 35;
  var px     = (moonCX - startX) / (endX - startX);

  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    var x = startX + (endX - startX) * p;

    /* arco que pasa exactamente por la luna */
    var y;
    if (p <= px) {
      y = startY + (moonCY - startY) * Math.sin((p / px) * (Math.PI / 2));
    } else {
      y = moonCY + (endY - moonCY) * Math.sin(((p - px) / (1 - px)) * (Math.PI / 2));
    }

    /* fade in/out */
    var op = 1;
    if (p < 0.08) op = p / 0.08;
    if (p > 0.88) op = (1 - p) / 0.12;

    wctx.clearRect(0, 0, W, H);
    drawWitchOnBroom(x, y, op);

    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      wctx.clearRect(0, 0, W, H);
      flying = false;
    }
  }

  requestAnimationFrame(step);
}

/* Iniciar todo */
resize();
initStars();
requestAnimationFrame(drawStars);

window.addEventListener('resize', function () {
  resize();
  initStars();
});

/* Primera vez a los 2.5s, luego cada 10s */
setTimeout(flyWitch, 2500);
setInterval(flyWitch, 10000);
