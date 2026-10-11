/* ===== ZDJĘCIA: wpisz ścieżki lub adresy (np. "img/warsztaty.jpg"). "" = brak zdjęcia ===== */
var HERO_PHOTOS = ["", "", "", "", ""];   // 5 zdjęć w tle nagłówka (ok. 1920×900 px)
var NEWS_PHOTOS = ["", "", ""];           // 3 miniatury aktualności (16:10)
var CARD_PHOTOS = ["", "", "", ""];       // 4 zdjęcia w filarach „Co robimy”
var GALLERY_PHOTOS = ["", "", "", "", "", ""];   // 6 zdjęć w galerii (ok. 1200×900 px)
var SLIDE_MS = 6000;                      // czas zmiany zdjęcia w milisekundach
/* ================================================================================== */
(function () {
  function setPhoto(el, url) {
    el.style.backgroundImage = 'url("' + url + '")';
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    var ph = el.querySelector('[data-ph]'); if (ph) ph.remove();
    var ic = el.querySelector('svg'); if (ic) ic.style.display = 'none';
  }
  function fill(nodes, arr) {
    [].slice.call(nodes).forEach(function (el, i) { if (arr[i]) setPhoto(el, arr[i]); });
  }
  fill(document.querySelectorAll('[data-news]'), NEWS_PHOTOS);
  fill(document.querySelectorAll('[data-card]'), CARD_PHOTOS);
  fill(document.querySelectorAll('[data-gal]'), GALLERY_PHOTOS);

  var slides = [].slice.call(document.querySelectorAll('[data-slide]'));
  slides.forEach(function (s, i) { if (HERO_PHOTOS[i]) setPhoto(s, HERO_PHOTOS[i]); });

  var counter = document.getElementById('counter'), pp = document.getElementById('pp');
  var total = slides.length, cur = 0, paused = false, timer = null;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function show(n) {
    cur = (n + total) % total;
    slides.forEach(function (s, i) {
      s.classList.toggle('opacity-100', i === cur);
      s.classList.toggle('opacity-0', i !== cur);
    });
    counter.textContent = pad(cur + 1) + ' / ' + pad(total);
  }
  function start() {
    clearInterval(timer);
    if (!paused) timer = setInterval(function () { show(cur + 1); }, SLIDE_MS);
  }
  pp.addEventListener('click', function () {
    paused = !paused;
    pp.textContent = paused ? '▶' : '❚❚';
    pp.setAttribute('aria-label', paused ? 'Włącz automatyczną zmianę zdjęć' : 'Zatrzymaj automatyczną zmianę zdjęć');
    start();
  });
  show(0);
  start();

  var mb = document.getElementById('mb'), nav = document.getElementById('nav');
  mb.addEventListener('click', function () {
    var open = nav.classList.toggle('hidden') === false;
    mb.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && window.innerWidth < 768) {
      nav.classList.add('hidden');
      mb.setAttribute('aria-expanded', 'false');
    }
  });

  var revealItems = [].slice.call(document.querySelectorAll('main > section, main article, main [data-gal], footer > div > div'));
  revealItems.forEach(function (el, i) {
    el.classList.add('scroll-reveal');
    el.style.setProperty('--reveal-delay', (i % 4) * 90 + 'ms');
  });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }
})();
