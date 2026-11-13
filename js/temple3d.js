/* ==========================================================================
   3D Temple Experience – procedural gopuram built with Three.js
   Illustrative model generated in code (no external model files).
   Features: orbit/zoom/pan, auto-rotate, view presets, day/dusk/night,
   tappable hotspots, pause when off-screen, WebGL fallback.
   ========================================================================== */
(function () {
  var stage = document.getElementById('stage3d');
  if (!stage) return;
  var fallback = document.getElementById('fallback3d');
  var loading = document.getElementById('loading3d');

  function fail(msg) {
    if (loading) loading.hidden = true;
    stage.classList.add('is-failed');
    if (fallback) { fallback.hidden = false; if (msg) fallback.querySelector('[data-msg]').textContent = msg; }
  }
  if (!window.THREE || !THREE.OrbitControls) { fail('The 3D viewer could not be loaded. Please check your internet connection and refresh.'); return; }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (e) { fail('Your browser or device does not support WebGL, which is needed for the 3D view.'); return; }

  var small = Math.min(window.innerWidth, window.innerHeight) < 600;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.6 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D model of a South Indian temple gopuram. Drag to rotate, scroll or pinch to zoom.');
  renderer.domElement.setAttribute('role', 'img');
  stage.insertBefore(renderer.domElement, stage.firstChild);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.07;
  controls.minDistance = 6; controls.maxDistance = 40;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.autoRotateSpeed = 0.9;
  controls.autoRotate = !reduceMotion;

  /* ---------- Materials ---------- */
  function stoneTexture() {
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var g = c.getContext('2d');
    g.fillStyle = '#d9c39a'; g.fillRect(0, 0, 256, 256);
    for (var i = 0; i < 5200; i++) {
      var v = 170 + Math.random() * 70;
      g.fillStyle = 'rgba(' + v + ',' + (v - 22) + ',' + (v - 60) + ',' + (Math.random() * 0.22) + ')';
      g.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    g.strokeStyle = 'rgba(90,60,30,.12)'; g.lineWidth = 1;
    for (var y = 0; y <= 256; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1);
    t.encoding = THREE.sRGBEncoding; return t;
  }
  var tex = stoneTexture();
  var M = {
    stone: new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 }),
    stoneDark: new THREE.MeshStandardMaterial({ color: 0xb79c6c, roughness: 0.95 }),
    maroon: new THREE.MeshStandardMaterial({ color: 0x6b1426, roughness: 0.7 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd4af61, roughness: 0.32, metalness: 0.75, emissive: 0x3a2a05, emissiveIntensity: 0.25 }),
    niche: new THREE.MeshStandardMaterial({ color: 0x2b1a10, roughness: 1 }),
    ground: new THREE.MeshStandardMaterial({ color: 0xc2ab7d, roughness: 1 }),
    lamp: new THREE.MeshStandardMaterial({ color: 0xffd27a, emissive: 0xffa930, emissiveIntensity: 0.4 })
  };
  var figColors = [0xb32a3c, 0x1f6f78, 0xd4af61, 0x4a7a3a, 0xc2683a, 0x5a4a9a];

  function add(parent, geo, mat, x, y, z) {
    var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }

  /* ---------- Build temple ---------- */
  var temple = new THREE.Group(); scene.add(temple);

  // Ground + plinth + steps
  var ground = new THREE.Mesh(new THREE.CircleGeometry(38, 64), M.ground);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  add(temple, new THREE.BoxGeometry(12, 0.5, 8.4), M.stoneDark, 0, 0.25, 0);
  add(temple, new THREE.BoxGeometry(11.4, 0.3, 7.8), M.stone, 0, 0.65, 0);
  for (var s = 0; s < 4; s++) add(temple, new THREE.BoxGeometry(3.2 + s * 0.2, 0.18, 0.5), M.stoneDark, 0, 0.09 + s * 0.16 + 0.0, 4.5 - s * 0.14 + 0.0);

  var baseY = 0.8;
  // Base wall (entrance block) with doorway
  var baseH = 2.4;
  add(temple, new THREE.BoxGeometry(8.2, baseH, 5.2), M.stone, 0, baseY + baseH / 2, 0);
  add(temple, new THREE.BoxGeometry(8.6, 0.2, 5.6), M.maroon, 0, baseY + baseH + 0.1, 0);
  add(temple, new THREE.BoxGeometry(8.7, 0.12, 5.7), M.gold, 0, baseY + baseH + 0.26, 0);
  // Doorway (front and back)
  [1, -1].forEach(function (side) {
    add(temple, new THREE.BoxGeometry(1.7, 1.9, 0.3), M.niche, 0, baseY + 0.95, side * 2.62);
    add(temple, new THREE.BoxGeometry(2.1, 0.2, 0.4), M.gold, 0, baseY + 2.0, side * 2.66);
    // Door pillars
    [-1.25, 1.25].forEach(function (px) {
      add(temple, new THREE.CylinderGeometry(0.16, 0.2, 2.0, 14), M.stone, px, baseY + 1.0, side * 2.72);
      add(temple, new THREE.BoxGeometry(0.44, 0.16, 0.44), M.gold, px, baseY + 2.05, side * 2.72);
    });
    // Side figure niches on base wall
    [-3.0, -2.2, 2.2, 3.0].forEach(function (nx, k) { addNiche(temple, nx, baseY + 1.2, side * 2.62, side, 0.5, 1.1, k); });
  });

  function addNiche(parent, x, y, z, side, w, h, k) {
    add(parent, new THREE.BoxGeometry(w, h, 0.14), M.niche, x, y, z + side * 0.02);
    add(parent, new THREE.BoxGeometry(w + 0.12, 0.08, 0.2), M.gold, x, y + h / 2 + 0.04, z + side * 0.04);
    var col = new THREE.MeshStandardMaterial({ color: figColors[(k + Math.abs(Math.round(x * 3))) % figColors.length], roughness: 0.6 });
    var body = add(parent, new THREE.ConeGeometry(w * 0.34, h * 0.62, 10), col, x, y - h * 0.12, z + side * 0.14);
    body.scale.z = 0.7;
    add(parent, new THREE.SphereGeometry(w * 0.17, 12, 10), col, x, y + h * 0.24, z + side * 0.14);
    add(parent, new THREE.ConeGeometry(w * 0.12, h * 0.16, 8), M.gold, x, y + h * 0.4, z + side * 0.14);
  }

  // Gopuram tiers
  var TIERS = 7, y = baseY + baseH + 0.35, topY = 0;
  var topW = 0, topD = 0;
  for (var i = 0; i < TIERS; i++) {
    var w = 7.4 - i * 0.66, d = 4.7 - i * 0.42, h = 1.3 - i * 0.05;
    add(temple, new THREE.BoxGeometry(w, h, d), M.stone, 0, y + h / 2, 0);
    // corner pilasters
    [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) {
      add(temple, new THREE.BoxGeometry(0.22, h, 0.22), M.stoneDark, sx * (w / 2), y + h / 2, sz * (d / 2));
    }); });
    // niches on front + back
    var count = Math.max(2, Math.floor((w - 0.8) / 0.95));
    var span = w - 1.0;
    [1, -1].forEach(function (side) {
      for (var n = 0; n < count; n++) {
        var nx = count === 1 ? 0 : -span / 2 + (span * n) / (count - 1);
        addNiche(temple, nx, y + h * 0.5, side * (d / 2 + 0.01), side, 0.46, h * 0.68, n + i);
      }
    });
    // cornice
    var cor = add(temple, new THREE.BoxGeometry(w + 0.4, 0.17, d + 0.4), i % 2 ? M.maroon : M.stoneDark, 0, y + h + 0.085, 0);
    add(temple, new THREE.BoxGeometry(w + 0.5, 0.07, d + 0.5), M.gold, 0, y + h + 0.2, 0);
    // row of tiny roof finials (kuta/shala hints) along front and back edge
    var fc = Math.floor((w + 0.2) / 0.55);
    [1, -1].forEach(function (side) {
      for (var f = 0; f < fc; f++) {
        var fx = -w / 2 - 0.05 + ((w + 0.1) * f) / (fc - 1);
        add(temple, new THREE.ConeGeometry(0.1, 0.24, 6), M.gold, fx, y + h + 0.36, side * (d / 2 + 0.12));
      }
    });
    y += h + 0.28; topW = w; topD = d;
  }

  // Barrel-vault crown (shala roof)
  var vaultR = topW * 0.46;
  var vault = new THREE.Mesh(new THREE.CylinderGeometry(vaultR, vaultR, topD + 0.5, 28, 1, true, Math.PI / 2, Math.PI), M.maroon);
  vault.material = M.maroon.clone(); vault.material.side = THREE.DoubleSide;
  vault.rotation.x = Math.PI / 2; vault.position.y = y; vault.scale.x = 1; vault.castShadow = true; temple.add(vault);
  var vaultEdge = new THREE.Mesh(new THREE.TorusGeometry(vaultR, 0.05, 8, 28, Math.PI), M.gold);
  [1, -1].forEach(function (s2) { var e = vaultEdge.clone(); e.position.set(0, y, s2 * (topD / 2 + 0.25)); temple.add(e); });
  add(temple, new THREE.BoxGeometry(topW + 0.2, 0.18, topD + 0.5), M.stoneDark, 0, y - 0.09, 0);

  // Kalasams on ridge
  var ridge = y + vaultR;
  var kalasamTop;
  [-1.0, 0, 1.0].forEach(function (kz, idx) {
    var k = new THREE.Group();
    var sc = idx === 1 ? 1.25 : 1;
    add(k, new THREE.CylinderGeometry(0.2, 0.28, 0.18, 14), M.gold, 0, 0.09, 0);
    add(k, new THREE.SphereGeometry(0.3, 18, 14), M.gold, 0, 0.45, 0);
    add(k, new THREE.CylinderGeometry(0.08, 0.2, 0.25, 12), M.gold, 0, 0.78, 0);
    add(k, new THREE.ConeGeometry(0.1, 0.5, 10), M.gold, 0, 1.15, 0);
    k.scale.setScalar(sc); k.position.set(0, ridge, kz * (topD / 2 - 0.1)); temple.add(k);
    if (idx === 1) kalasamTop = ridge + 1.4 * sc;
  });

  // Flanking mandapam pillars (free-standing, left and right)
  [-1, 1].forEach(function (sx) {
    for (var p = 0; p < 3; p++) {
      var px = sx * (4.9 + p * 0.0), pz = -1.6 + p * 1.6;
      add(temple, new THREE.CylinderGeometry(0.2, 0.26, 2.3, 16), M.stone, px, 0.8 + 1.15, pz);
      add(temple, new THREE.BoxGeometry(0.55, 0.16, 0.55), M.gold, px, 0.8 + 2.38, pz);
      add(temple, new THREE.BoxGeometry(0.5, 0.14, 0.5), M.stoneDark, px, 0.87, pz);
    }
    add(temple, new THREE.BoxGeometry(0.7, 0.18, 4.6), M.maroon, sx * 4.9, 0.8 + 2.56, 0);
  });

  // Lamps in front
  var lamps = [];
  [-4.8, -2.2, 2.2, 4.8].forEach(function (lx) {
    add(temple, new THREE.CylinderGeometry(0.05, 0.08, 1.0, 8), M.gold, lx, 1.3, 5.6);
    add(temple, new THREE.SphereGeometry(0.14, 12, 10), M.lamp, lx, 1.9, 5.6);
    var pl = new THREE.PointLight(0xffa13a, 0, 9, 2); pl.position.set(lx, 2.0, 5.7); scene.add(pl); lamps.push(pl);
  });

  /* ---------- Lights + time of day ---------- */
  var hemi = new THREE.HemisphereLight(0xcfe3ff, 0x6a5538, 0.7); scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xfff1d6, 1.4);
  sun.position.set(14, 20, 12); sun.castShadow = true;
  var ss = small ? 1024 : 2048; sun.shadow.mapSize.set(ss, ss);
  sun.shadow.camera.left = -16; sun.shadow.camera.right = 16; sun.shadow.camera.top = 18; sun.shadow.camera.bottom = -10;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 70; sun.shadow.bias = -0.0004;
  scene.add(sun);

  var TIMES = {
    day:   { bg: 0xcfe4f2, fog: 0xcfe4f2, hemiI: 0.6, sunI: 1.1, sunC: 0xfff1d6, sunPos: [14, 20, 12], lamp: 0, glow: 0.25, ground: 0x9c8658 },
    dusk:  { bg: 0xe9a15f, fog: 0xd98a52, hemiI: 0.5,  sunI: 1.1, sunC: 0xff9a4d, sunPos: [-18, 7, 10], lamp: 0.6, glow: 0.45, ground: 0xa88457 },
    night: { bg: 0x0c1226, fog: 0x0c1226, hemiI: 0.22, sunI: 0.18, sunC: 0x7f95d6, sunPos: [-10, 18, -8], lamp: 2.2, glow: 0.95, ground: 0x4a3f33 }
  };
  var current = null;
  function setTime(name) {
    var t = TIMES[name]; if (!t) return; current = name;
    scene.background = new THREE.Color(t.bg);
    scene.fog = new THREE.Fog(t.fog, 28, 70);
    hemi.intensity = t.hemiI; sun.intensity = t.sunI; sun.color.setHex(t.sunC); sun.position.set(t.sunPos[0], t.sunPos[1], t.sunPos[2]);
    lamps.forEach(function (l) { l.intensity = t.lamp; });
    M.lamp.emissiveIntensity = name === 'day' ? 0.2 : name === 'dusk' ? 1.1 : 2.2;
    M.gold.emissiveIntensity = t.glow; M.ground.color.setHex(t.ground);
    document.querySelectorAll('[data-time]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-time') === name); });
  }

  /* ---------- Camera presets (smooth tween) ---------- */
  var target = new THREE.Vector3(0, 6, 0);
  var VIEWS = {
    front:  { pos: [0, 6.5, 24], look: [0, 6.5, 0] },
    aerial: { pos: [17, 21, 19], look: [0, 5.5, 0] },
    close:  { pos: [5.5, 4.2, 11], look: [0, 3.5, 0] },
    crown:  { pos: [6, 14, 9], look: [0, 12, 0] }
  };
  var tween = null;
  function goView(name, instant) {
    var v = VIEWS[name]; if (!v) return;
    var to = { p: new THREE.Vector3(v.pos[0], v.pos[1], v.pos[2]), l: new THREE.Vector3(v.look[0], v.look[1], v.look[2]) };
    if (instant || reduceMotion) { camera.position.copy(to.p); controls.target.copy(to.l); controls.update(); return; }
    tween = { fromP: camera.position.clone(), fromL: controls.target.clone(), to: to, t: 0 };
    document.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-view') === name); });
  }
  controls.addEventListener('start', function () { tween = null; });

  /* ---------- Hotspots ---------- */
  var HOTS = [
    { id: 'kalasam', pos: [0, kalasamTop, 0], title: 'Kalasam (crowning finials)', text: 'The gold-finished kalasams crown the gopuram. We make and finish the finials to the size and style of your temple.', link: 'services.html#gopuram-sculptures', cta: 'Gopuram sculptures' },
    { id: 'tiers', pos: [-3.2, 8.4, 2.4], title: 'Gopuram tiers and figures', text: 'Each tier carries niches with sculpted figures and a decorated cornice. Tiers, figures and ornament are made to your approved design.', link: 'services.html#gopuram-sculptures', cta: 'Gopuram sculptures' },
    { id: 'entrance', pos: [0, 2.4, 2.8], title: 'Entrance decoration', text: 'The entrance is framed by pillars, a decorated lintel and guardian-style niches. Entrance work can be designed to your temple.', link: 'services.html#entrance-decorations', cta: 'Entrance decorations' },
    { id: 'pillars', pos: [4.9, 2.6, 1.6], title: 'Pillars and columns', text: 'Sculpted pillars with traditional capitals support halls and corridors. Sizes and motifs are customised.', link: 'services.html#pillars-columns', cta: 'Pillars and columns' },
    { id: 'install', pos: [-4.8, 2.4, 5.7], title: 'On-site installation', text: 'Finished works are transported and installed at your site, followed by inspection and handover.', link: 'services.html#installation', cta: 'On-site installation' }
  ];
  var hotHost = document.getElementById('hotspots3d');
  var panel = document.getElementById('info3d');
  hotHost.innerHTML = '';
  HOTS.forEach(function (h) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'hotspot'; b.setAttribute('aria-label', h.title); b.innerHTML = '<span></span>';
    b.addEventListener('click', function (e) { e.stopPropagation(); openInfo(h); });
    hotHost.appendChild(b); h.el = b; h.v = new THREE.Vector3(h.pos[0], h.pos[1], h.pos[2]);
  });
  function openInfo(h) {
    panel.hidden = false;
    panel.querySelector('h3').textContent = h.title;
    panel.querySelector('p').textContent = h.text;
    var a = panel.querySelector('a'); a.href = h.link; a.textContent = 'See: ' + h.cta + ' →';
    HOTS.forEach(function (x) { x.el.classList.toggle('active', x === h); });
  }
  panel.querySelector('[data-close]').addEventListener('click', function () { panel.hidden = true; HOTS.forEach(function (x) { x.el.classList.remove('active'); }); });

  var proj = new THREE.Vector3();
  function updateHotspots() {
    var w = stage.clientWidth, hh = stage.clientHeight;
    HOTS.forEach(function (h) {
      proj.copy(h.v).project(camera);
      var visible = proj.z < 1 && proj.x > -1.05 && proj.x < 1.05 && proj.y > -1.05 && proj.y < 1.05;
      h.el.style.display = visible ? '' : 'none';
      if (visible) h.el.style.transform = 'translate(' + ((proj.x * 0.5 + 0.5) * w) + 'px,' + ((-proj.y * 0.5 + 0.5) * hh) + 'px) translate(-50%,-50%)';
    });
  }

  /* ---------- UI wiring ---------- */
  document.querySelectorAll('[data-view]').forEach(function (b) { b.addEventListener('click', function () { goView(b.getAttribute('data-view')); }); });
  document.querySelectorAll('[data-time]').forEach(function (b) { b.addEventListener('click', function () { setTime(b.getAttribute('data-time')); }); });
  var rot = document.getElementById('autoRotate');
  function syncRot() { rot.setAttribute('aria-pressed', controls.autoRotate); rot.textContent = controls.autoRotate ? 'Auto-rotate: On' : 'Auto-rotate: Off'; }
  rot.addEventListener('click', function () { controls.autoRotate = !controls.autoRotate; syncRot(); });
  var fsBtn = document.getElementById('fullscreen3d');
  if (fsBtn) {
    if (!stage.requestFullscreen) fsBtn.hidden = true;
    fsBtn.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen();
    });
  }
  // Keyboard: arrow keys rotate when the canvas wrapper is focused
  stage.addEventListener('keydown', function (e) {
    var step = 0.15;
    if (e.key === 'ArrowLeft') { rotateBy(-step, 0); }
    else if (e.key === 'ArrowRight') rotateBy(step, 0);
    else if (e.key === '+' || e.key === '=') dolly(0.9);
    else if (e.key === '-') dolly(1.1);
    else return; e.preventDefault();
  });
  function rotateBy(dx) {
    var off = camera.position.clone().sub(controls.target);
    var a = Math.atan2(off.x, off.z) + dx;
    var r = Math.hypot(off.x, off.z);
    camera.position.set(controls.target.x + r * Math.sin(a), camera.position.y, controls.target.z + r * Math.cos(a));
    controls.update();
  }
  function dolly(f) {
    var off = camera.position.clone().sub(controls.target).multiplyScalar(f);
    var len = off.length();
    if (len < controls.minDistance || len > controls.maxDistance) return;
    camera.position.copy(controls.target).add(off); controls.update();
  }

  /* ---------- Resize + render loop ---------- */
  function resize() {
    var w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
    camera.aspect = w / h; camera.fov = w / h < 0.8 ? 62 : 45; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  document.addEventListener('fullscreenchange', resize);

  var running = true, inView = true;
  var clock = new THREE.Clock();
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function loop() {
    requestAnimationFrame(loop);
    if (!running || !inView) return;
    var dt = Math.min(clock.getDelta(), 0.05);
    if (tween) {
      tween.t = Math.min(1, tween.t + dt / 1.4); var e = ease(tween.t);
      camera.position.lerpVectors(tween.fromP, tween.to.p, e);
      controls.target.lerpVectors(tween.fromL, tween.to.l, e);
      if (tween.t >= 1) tween = null;
    }
    controls.update();
    renderer.render(scene, camera);
    updateHotspots();
  }
  document.addEventListener('visibilitychange', function () { running = !document.hidden; });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: 0.05 }).observe(stage);

  resize(); setTime('day'); goView('aerial', true); syncRot();
  document.querySelector('[data-view="aerial"]').setAttribute('aria-pressed', 'true');
  if (loading) loading.hidden = true;
  var hint = document.getElementById('hint3d'); if (hint) setTimeout(function () { hint.classList.add('fade'); }, 6000);
  loop();
})();
