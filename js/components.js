/* ==========================================================================
   Reusable components: header, footer, WhatsApp button, icons, structured data
   Pages contain <div id="site-header"></div> and <div id="site-footer"></div>.
   ========================================================================== */
(function () {
  var S = window.SITE;
  var C = S.contact;

  var svg = function (d, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' + (extra || '') + '>' + d + '</svg>';
  };
  var ICONS = {
    temple: svg('<path d="M3 21h18M5 21v-4h14v4M7 17v-4h10v4M9 13V9h6v4M11 9V6h2v3M12 2l1.5 4h-3z"/>'),
    deity: svg('<circle cx="12" cy="6" r="3"/><path d="M12 9v5M7 21l2-7h6l2 7M5 11l7 3 7-3"/>'),
    gopuram: svg('<path d="M4 21h16M6 21V16h12v5M8 16v-4h8v4M10 12V8h4v4M12 3l2 5h-4z"/>'),
    pillar: svg('<path d="M6 4h12M7 4v2h10V4M9 6v12M15 6v12M6 20h12M7 18h10"/>'),
    mandapam: svg('<path d="M3 9l9-5 9 5M5 9v11M19 9v11M9 9v11M15 9v11M3 20h18"/>'),
    entrance: svg('<path d="M5 21V8a7 7 0 0 1 14 0v13M9 21v-7a3 3 0 0 1 6 0v7M3 21h18"/>'),
    decor: svg('<path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/>'),
    design: svg('<path d="M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3"/>'),
    custom: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/><circle cx="12" cy="12" r="2.5"/>'),
    restore: svg('<path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/>'),
    install: svg('<path d="M14 7l3-3 3 3-3 3M17 4v10M4 20h10M7 20V10l4-4"/>'),
    craft: svg('<path d="M14 4l6 6-9 9H5v-6zM12 6l6 6"/>'),
    quality: svg('<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>'),
    people: svg('<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14c3 0 6 1.8 6 5"/>'),
    truck: svg('<path d="M2 6h12v10H2zM14 9h4l4 4v3h-8zM6 19a2 2 0 1 0 0-.01M18 19a2 2 0 1 0 0-.01"/>'),
    pin: svg('<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
    phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    chat: svg('<path d="M4 5h16v11H9l-5 4z"/>'),
    facebook: svg('<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>'),
    instagram: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>'),
    youtube: svg('<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9l5 3-5 3z"/>'),
    whatsapp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-2c1.8 1 3.8 1.5 5.9 1.5 6.9 0 12.5-5.6 12.5-12.5S22.900 3 16 3zm0 22.900c-1.900 0-3.700-.5-5.300-1.500l-.4-.2-4.400 1.200 1.200-4.300-.3-.4a10.300 10.300 0 0 1-1.600-5.500C5.200 9.800 10 5.200 16 5.200s10.800 4.700 10.800 10.400S21.900 25.900 16 25.900zm5.900-7.700c-.3-.2-1.900-.9-2.200-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100a8.500 8.500 0 0 1-4.200-3.700c-.3-.6.300-.5.900-1.700.1-.2 0-.4 0-.5l-1-2.300c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.100-.9.400s-1.100 1.100-1.100 2.600 1.100 3 1.300 3.200 2.200 3.400 5.400 4.700c2 .8 2.800.9 3.800.7.600-.1 1.900-.8 2.200-1.500s.3-1.400.2-1.500-.3-.2-.6-.4z"/></svg>'
  };
  window.ICONS = ICONS;

  var NAV = [
    ['index.html', 'Home', 'home'],
    ['about.html', 'About', 'about'],
    ['services.html', 'Services', 'services'],
    ['works.html', 'Our Works', 'works'],
    ['process.html', 'Process', 'process'],
    ['contact.html', 'Contact', 'contact']
  ];

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };

  /** Build a wa.me link. Falls back to the enquiry page if no real number is set. */
  window.waLink = function (text) {
    if (!S.isConfigured) return 'enquiry.html';
    return 'https://wa.me/' + C.whatsappNumber + (text ? '?text=' + encodeURIComponent(text) : '');
  };

  function renderHeader() {
    var host = document.getElementById('site-header');
    if (!host) return;
    var page = document.body.getAttribute('data-page');
    var links = NAV.map(function (n) {
      return '<li><a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : '') + '>' + n[1] + '</a></li>';
    }).join('');
    host.innerHTML =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header" id="siteHeader"><div class="container nav-wrap">' +
      '<a class="brand" href="index.html" aria-label="' + esc(S.businessName) + ' – Home">' + ICONS.temple +
      '<span class="brand-name">' + esc(S.businessName) + '<span class="brand-sub">Temple Sculpture Works</span></span></a>' +
      '<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks" aria-label="Toggle menu">☰</button>' +
      '<nav aria-label="Main"><ul class="nav-links" id="navLinks">' + links +
      '<li><a class="btn btn--gold" href="enquiry.html"' + (page === 'enquiry' ? ' aria-current="page"' : '') + '>Request a Quote</a></li></ul></nav>' +
      '</div></header>';
  }

  function renderFooter() {
    var host = document.getElementById('site-footer');
    if (!host) return;
    var soc = '';
    [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube']].forEach(function (p) {
      if (S.social[p[0]]) soc += '<a href="' + esc(S.social[p[0]]) + '" target="_blank" rel="noopener" aria-label="' + p[1] + '">' + ICONS[p[0]] + '</a>';
    });
    if (S.isConfigured) soc += '<a href="' + waLink('') + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ICONS.chat + '</a>';
    host.innerHTML =
      '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      '<div><h4>' + esc(S.businessName) + '</h4><p>' + esc(S.tagline) + '</p>' +
      (soc ? '<div class="social">' + soc + '</div>' : '') + '</div>' +
      '<div><h4>Explore</h4><ul>' + NAV.map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + '</a></li>'; }).join('') + '<li><a href="enquiry.html">Custom Project Enquiry</a></li></ul></div>' +
      '<div><h4>Services</h4><ul><li><a href="services.html#deity-sculptures">Deity Cement Sculptures</a></li><li><a href="services.html#gopuram-sculptures">Gopuram Sculptures</a></li><li><a href="services.html#pillars-columns">Pillars &amp; Columns</a></li><li><a href="services.html#mandapam-sculptures">Mandapam Sculptures</a></li><li><a href="services.html#installation">On-site Installation</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul><li>' + esc(C.address) + '</li><li><a href="tel:' + esc(C.phoneTel) + '">' + esc(C.phoneDisplay) + '</a></li><li><a href="mailto:' + esc(C.email) + '">' + esc(C.email) + '</a></li></ul></div>' +
      '</div><div class="footer-bottom">© <span id="yr"></span> ' + esc(S.businessName) + ' · Tamil Nadu, India</div></div></footer>';
    document.getElementById('yr').textContent = new Date().getFullYear();
  }

  function renderWhatsApp() {
    var a = document.createElement('a');
    a.className = 'wa-float';
    a.href = waLink('Hello, I would like to enquire about temple sculpture works.');
    a.setAttribute('aria-label', S.isConfigured ? 'Chat on WhatsApp' : 'Send an enquiry');
    if (S.isConfigured) { a.target = '_blank'; a.rel = 'noopener'; }
    a.innerHTML = ICONS.whatsapp;
    document.body.appendChild(a);
  }

  /** LocalBusiness JSON-LD – only emitted once real contact details are configured. */
  function renderStructuredData() {
    if (!S.isConfigured || /example\.com/.test(S.siteUrl) || /\[Enter/.test(S.businessName)) return;
    var sameAs = Object.keys(S.social).map(function (k) { return S.social[k]; }).filter(Boolean);
    var data = {
      '@context': 'https://schema.org', '@type': 'LocalBusiness', name: S.businessName,
      description: 'Traditional Indian temple cement sculpture works, gopuram sculptures, deity statues, pillars and mandapam works in Tamil Nadu.',
      url: S.siteUrl, telephone: C.phoneTel, email: C.email,
      address: { '@type': 'PostalAddress', streetAddress: C.address, addressRegion: 'Tamil Nadu', addressCountry: 'IN' },
      areaServed: 'Tamil Nadu, India', image: S.siteUrl + '/images/og-image.jpg'
    };
    if (sameAs.length) data.sameAs = sameAs;
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderHeader(); renderFooter(); renderWhatsApp(); renderStructuredData();
    // Fill icon placeholders: <span class="icon" data-icon="deity"></span>
    document.querySelectorAll('[data-icon]').forEach(function (el) { el.innerHTML = ICONS[el.getAttribute('data-icon')] || ''; });
    // Fill business text: <span data-site="businessName"></span>, data-site="contact.phoneDisplay"
    document.querySelectorAll('[data-site]').forEach(function (el) {
      var v = el.getAttribute('data-site').split('.').reduce(function (o, k) { return o && o[k]; }, S);
      if (v) el.textContent = v;
    });
  });
})();
