/* ==========================================================================
   Portfolio gallery: reads window.PROJECTS (data/projects.js)
   - #gallery           full gallery with filters + layout toggle (works.html)
   - #featuredProjects  featured highlights (index.html)
   - Lightbox with multiple images per project, keyboard + touch support
   ========================================================================== */
(function () {
  var projects = window.PROJECTS || [];
  var cats = window.PROJECT_CATEGORIES || [];
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var catLabel = function (k) { var c = cats.filter(function (x) { return x.key === k; })[0]; return c ? c.label : k; };

  function card(p, i) {
    var img = p.images[0];
    return '<article class="g-item" data-cat="' + esc(p.category) + '" style="animation-delay:' + (i * 60) + 'ms">' +
      '<button type="button" class="g-thumb" data-open="' + esc(p.id) + '" aria-label="View ' + esc(p.title) + '">' +
      '<img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '" loading="lazy" width="800" height="600">' +
      (p.placeholder ? '<span class="badge">Placeholder</span>' : '') +
      (p.images.length > 1 ? '<span class="badge badge--count">' + p.images.length + ' photos</span>' : '') + '</button>' +
      '<div class="g-body"><h3>' + esc(p.title) + '</h3><div class="g-meta">' + esc(catLabel(p.category)) + ' · ' + esc(p.location) + '</div><p>' + esc(p.description) + '</p></div></article>';
  }

  /* ---------- Lightbox ---------- */
  var lb, state = { project: null, idx: 0, opener: null }, touchX = null;
  function buildLightbox() {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Project image viewer');
    lb.innerHTML = '<button class="lb-close" aria-label="Close viewer">✕</button><div class="lb-inner">' +
      '<div class="lb-stage"><button class="lb-btn lb-prev" aria-label="Previous image">‹</button><img alt=""><button class="lb-btn lb-next" aria-label="Next image">›</button></div>' +
      '<div class="lb-caption"><h3></h3><div class="g-meta"></div><p></p><div class="lb-count" aria-live="polite"></div></div></div>';
    document.body.appendChild(lb);
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (touchX === null) return; var dx = e.changedTouches[0].clientX - touchX; touchX = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') { // simple focus trap
        var f = lb.querySelectorAll('button:not([hidden])'); var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  function show() {
    var p = state.project, im = p.images[state.idx];
    var img = lb.querySelector('img'); img.src = im.src; img.alt = im.alt;
    lb.querySelector('h3').textContent = p.title;
    lb.querySelector('.g-meta').textContent = catLabel(p.category) + ' · ' + p.location;
    lb.querySelector('p').textContent = p.description + (p.placeholder ? ' (Placeholder image – to be replaced.)' : '');
    lb.querySelector('.lb-count').textContent = 'Image ' + (state.idx + 1) + ' of ' + p.images.length;
    var multi = p.images.length > 1;
    lb.querySelector('.lb-prev').hidden = !multi; lb.querySelector('.lb-next').hidden = !multi;
  }
  function step(d) { var n = state.project.images.length; state.idx = (state.idx + d + n) % n; show(); }
  function openLb(id, opener) {
    var p = projects.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    if (!lb) buildLightbox();
    state.project = p; state.idx = 0; state.opener = opener; show();
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function closeLb() {
    lb.classList.remove('open'); document.body.style.overflow = '';
    if (state.opener) state.opener.focus();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-open]');
    if (b) openLb(b.getAttribute('data-open'), b);
  });

  /* ---------- Full gallery ---------- */
  function initGallery(host) {
    var filtersHost = document.getElementById('galleryFilters');
    var togglesHost = document.getElementById('layoutToggle');
    var current = 'all';
    var present = cats.filter(function (c) { return projects.some(function (p) { return p.category === c.key; }); });

    if (filtersHost) {
      filtersHost.innerHTML = '<button class="filter-btn" type="button" data-f="all" aria-pressed="true">All</button>' +
        present.map(function (c) { return '<button class="filter-btn" type="button" data-f="' + c.key + '" aria-pressed="false">' + esc(c.label) + '</button>'; }).join('');
      filtersHost.addEventListener('click', function (e) {
        var b = e.target.closest('.filter-btn'); if (!b) return;
        current = b.getAttribute('data-f');
        filtersHost.querySelectorAll('.filter-btn').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        render();
        // allow deep links like works.html#gopuram
        try { history.replaceState(null, '', current === 'all' ? location.pathname : '#' + current); } catch (err) { /* file:// or restricted contexts */ }
      });
    }
    if (togglesHost) {
      togglesHost.innerHTML = '<button type="button" data-l="masonry" aria-pressed="true">Masonry</button><button type="button" data-l="grid" aria-pressed="false">Grid</button>';
      togglesHost.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        togglesHost.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        host.classList.toggle('grid-mode', b.getAttribute('data-l') === 'grid');
      });
    }
    function render() {
      var list = projects.filter(function (p) { return current === 'all' || p.category === current; });
      host.innerHTML = list.length ? list.map(card).join('') : '<p class="empty-state">No projects in this category yet.</p>';
      var status = document.getElementById('galleryStatus');
      if (status) status.textContent = list.length + (list.length === 1 ? ' project shown' : ' projects shown');
    }
    var hash = location.hash.replace('#', '');
    if (hash && present.some(function (c) { return c.key === hash; })) {
      current = hash;
      if (filtersHost) filtersHost.querySelectorAll('.filter-btn').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-f') === hash); });
    }
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var g = document.getElementById('gallery'); if (g) initGallery(g);
    var f = document.getElementById('featuredProjects');
    if (f) {
      var list = projects.filter(function (p) { return p.featured; }).slice(0, 3);
      f.innerHTML = list.map(card).join('');
    }
  });
})();
