/* ==========================================================================
   3D Temple Experience v2 – realistic-style South Indian gopuram (Three.js r128)
   Everything is generated in code: no external model or image files.
   This is an ILLUSTRATIVE model, not a model of any real completed project.

   Realism features: ACES tone mapping, procedural stone / plaster / flagstone
   textures with bump, sky dome + image-based reflections, sloped-eave gopuram
   tiers, red-and-white striped walls, arched niches with painted figures,
   porch pillars, flagstaff, compound walls, palms, hills, devotees walking,
   string lights and glowing lamps at dusk/night.

   Edit: VIEWS (camera), HOTS (marker texts/links), TIMES (lighting), PLASTER
   (tier colours) below.
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
  if (!window.THREE || !THREE.OrbitControls || !THREE.BufferGeometryUtils) { fail('The 3D viewer could not be loaded. Please refresh the page.'); return; }

  var renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { fail('Your browser or device does not support WebGL, which is needed for the 3D view.'); return; }

  var small = Math.min(window.innerWidth, window.innerHeight) < 600;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.6 : 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D model of a South Indian temple gopuram. Drag to rotate, scroll or pinch to zoom.');
  stage.insertBefore(renderer.domElement, stage.firstChild);
  var maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.07;
  controls.minDistance = 6; controls.maxDistance = 70;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.autoRotateSpeed = 0.7;
  controls.autoRotate = !reduceMotion;

  /* ====================== procedural textures ====================== */
  function canvasTex(size, draw, repeatX, repeatY, srgb) {
    var c = document.createElement('canvas'); c.width = c.height = size;
    draw(c.getContext('2d'), size);
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeatX || 1, repeatY || 1); t.anisotropy = maxAniso;
    if (srgb) t.encoding = THREE.sRGBEncoding;
    return t;
  }
  function speckle(g, n, size, lo, hi, alpha) {
    for (var i = 0; i < n; i++) {
      var v = lo + Math.random() * (hi - lo);
      g.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',' + (Math.random() * alpha) + ')';
      g.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2.5, 1 + Math.random() * 2.5);
    }
  }
  function weathering(g, size) {      // vertical rain streaks and stains
    for (var i = 0; i < 40; i++) {
      var x = Math.random() * size, w = 2 + Math.random() * 10, h = 30 + Math.random() * 200;
      var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(60,45,25,' + (0.05 + Math.random() * 0.1) + ')'); gr.addColorStop(1, 'rgba(60,45,25,0)');
      g.fillStyle = gr; g.fillRect(x, Math.random() * size * 0.5, w, h);
    }
  }
  var grainMap = canvasTex(256, function (g, s) { g.fillStyle = '#f4f0e8'; g.fillRect(0, 0, s, s); speckle(g, 5000, s, 150, 255, 0.35); weathering(g, s); }, 1, 1, true);
  var grainBump = canvasTex(256, function (g, s) { g.fillStyle = '#888'; g.fillRect(0, 0, s, s); speckle(g, 7000, s, 40, 230, 0.6); }, 1, 1, false);
  var stripeMap = canvasTex(256, function (g, s) {
    for (var i = 0; i < 4; i++) { g.fillStyle = i % 2 ? '#f1e8d6' : '#b23a2c'; g.fillRect(i * 64, 0, 64, s); }
    speckle(g, 5000, s, 90, 255, 0.3); weathering(g, s);
  }, 1, 1, true);
  var flagMap = canvasTex(512, function (g, s) {
    g.fillStyle = '#9d8a64'; g.fillRect(0, 0, s, s);
    var n = 4, cs = s / n;
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var v = 150 + Math.random() * 40; g.fillStyle = 'rgb(' + v + ',' + (v - 14) + ',' + (v - 46) + ')'; g.fillRect(x * cs + 2, y * cs + 2, cs - 4, cs - 4);
    }
    speckle(g, 9000, s, 80, 220, 0.3);
  }, 30, 30, true);
  var flagBump = canvasTex(512, function (g, s) {
    g.fillStyle = '#222'; g.fillRect(0, 0, s, s); var n = 4, cs = s / n;
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) { g.fillStyle = '#bbb'; g.fillRect(x * cs + 3, y * cs + 3, cs - 6, cs - 6); }
    speckle(g, 9000, s, 60, 240, 0.5);
  }, 30, 30, false);
  var grassMap = canvasTex(256, function (g, s) { g.fillStyle = '#5d6b36'; g.fillRect(0, 0, s, s); speckle(g, 9000, s, 40, 190, 0.5); }, 40, 40, true);

  /* ====================== materials ====================== */
  var envMats = [];
  function mat(opts, envI) {
    var m = new THREE.MeshStandardMaterial(opts); m.userData.envI = envI == null ? 1 : envI; envMats.push(m); return m;
  }
  function plaster(hex) { return mat({ color: hex, map: grainMap, bumpMap: grainBump, bumpScale: 0.1, roughness: 0.9 }); }
  var PLASTER = [0xf2e6cf, 0xe3b866, 0xdcd3bd, 0xcfa56c, 0xf0e0bd, 0xd9c28c, 0xf0e2c6, 0xe8cf9a];
  var plasterMats = PLASTER.map(plaster);
  var M = {
    stone: plaster(0xd8c8a4), stoneDark: plaster(0xa89573),
    striped: mat({ map: stripeMap, bumpMap: grainBump, bumpScale: 0.1, roughness: 0.92 }),
    maroon: plaster(0x7c1d2b),
    gold: mat({ color: 0xe0b552, roughness: 0.38, metalness: 0.7, emissive: 0x3d2a06, emissiveIntensity: 0.6 }, 0.9),
    brass: mat({ color: 0xb98a3a, roughness: 0.45, metalness: 0.7, emissive: 0x2a1c05, emissiveIntensity: 0.5 }, 0.9),
    dark: mat({ color: 0x1b0f09, roughness: 1 }, 0.3),
    ground: mat({ map: flagMap, bumpMap: flagBump, bumpScale: 0.5, roughness: 0.95 }, 0.6),
    grass: mat({ map: grassMap, roughness: 1 }, 0.4),
    skin: mat({ color: 0xa8673a, roughness: 0.7 }),
    trunk: mat({ color: 0x6d5a40, roughness: 1 }, 0.4),
    leaf: mat({ color: 0x2f5424, roughness: 0.8, side: THREE.DoubleSide }, 0.25),
    hill: mat({ color: 0x4a6a38, roughness: 1 }, 0.3),
    lampBody: mat({ color: 0x8c6a2f, roughness: 0.4, metalness: 0.8 }),
    bulb: new THREE.MeshBasicMaterial({ color: 0xffd98a })
  };
  var figColors = [0xb32a3c, 0x1f6f78, 0xe0b34a, 0x4a7a3a, 0xc2683a, 0x5a4a9a, 0xd9d2c0, 0xa83a7a];
  var figMats = figColors.map(function (c) { return mat({ color: c, roughness: 0.65 }); });

  /* ====================== geometry batching ====================== */
  var G = {
    box: new THREE.BoxGeometry(1, 1, 1),
    cyl: new THREE.CylinderGeometry(1, 1, 1, 20, 1),
    cyl8: new THREE.CylinderGeometry(1, 1, 1, 8, 1),
    cone: new THREE.ConeGeometry(1, 1, 10),
    pyr: (function () { var g = new THREE.ConeGeometry(1, 1, 4, 1); g.rotateY(Math.PI / 4); return g; })(),
    sph: new THREE.SphereGeometry(1, 10, 8),
    arc: new THREE.TorusGeometry(1, 0.09, 6, 16, Math.PI),
    disc: new THREE.CylinderGeometry(1, 1, 1, 14, 1),
    pot: new THREE.LatheGeometry([[0, 0], [0.5, 0], [0.62, 0.1], [0.78, 0.4], [0.62, 0.7], [0.3, 0.82], [0.4, 0.9], [0.18, 1.0], [0.1, 1.5], [0, 1.9]].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 14),
    pillar: new THREE.LatheGeometry([[0, 0], [0.5, 0], [0.5, 0.06], [0.34, 0.1], [0.3, 0.2], [0.26, 0.3], [0.26, 0.78], [0.3, 0.82], [0.3, 0.86], [0.26, 0.9], [0.46, 0.95], [0.52, 1.0], [0, 1.0]].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 14)
  };
  var temple = new THREE.Group(); scene.add(temple);
  var buckets = new Map();
  var _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
  /** put(geometry, material, x,y,z, rotX,rotY,rotZ, scaleX,scaleY,scaleZ): queue a mesh for merging */
  function put(geo, m, x, y, z, rx, ry, rz, sx, sy, sz) {
    _e.set(rx || 0, ry || 0, rz || 0); _q.setFromEuler(_e); _p.set(x, y, z);
    _s.set(sx == null ? 1 : sx, sy == null ? 1 : sy, sz == null ? 1 : sz);
    _m.compose(_p, _q, _s);
    var g = geo.clone().applyMatrix4(_m);
    var b = buckets.get(m); if (!b) { b = []; buckets.set(m, b); } b.push(g);
  }
  function box(m, x, y, z, w, h, d) { put(G.box, m, x, y, z, 0, 0, 0, w, h, d); }
  var meshOf = new Map();
  function flush() {
    buckets.forEach(function (list, m) {
      var merged = THREE.BufferGeometryUtils.mergeBufferGeometries(list, false);
      var mesh = new THREE.Mesh(merged, m);
      mesh.castShadow = m !== M.bulb; mesh.receiveShadow = true;
      temple.add(mesh); meshOf.set(m, mesh); list.forEach(function (g) { g.dispose(); });
    });
    buckets.clear();
  }

  /* ---------- building blocks ---------- */
  function figure(x, y, z, ry, s, mi) {   // painted stucco deity / guardian
    var body = figMats[mi % figMats.length];
    put(G.cone, body, x, y + 0.27 * s, z, 0, ry, 0, 0.2 * s, 0.55 * s, 0.14 * s);
    put(G.sph, M.skin, x, y + 0.64 * s, z, 0, ry, 0, 0.075 * s, 0.085 * s, 0.075 * s);
    put(G.cone, M.gold, x, y + 0.76 * s, z, 0, ry, 0, 0.07 * s, 0.15 * s, 0.07 * s);
    var c = Math.cos(ry), sn = Math.sin(ry);
    [-1, 1].forEach(function (k) { put(G.cyl8, M.skin, x + k * 0.16 * s * c, y + 0.42 * s, z - k * 0.16 * s * sn, 0, 0, k * 0.55, 0.022 * s, 0.3 * s, 0.022 * s); });
  }
  function niche(x, y, z, side, w, h, mi) {   // arched niche + figure
    var ry = side > 0 ? 0 : Math.PI, zz = z + side * 0.02;
    box(M.dark, x, y, zz, w, h, 0.07);
    put(G.disc, M.dark, x, y + h / 2, zz, Math.PI / 2, 0, 0, w / 2, 0.07, w / 2);
    put(G.arc, M.gold, x, y + h / 2, z + side * 0.05, 0, ry, 0, w / 2 + 0.03, 1, 1);
    box(M.gold, x, y - h / 2 - 0.02, z + side * 0.06, w + 0.1, 0.05, 0.12);
    figure(x, y - h / 2 + 0.02, z + side * 0.1, ry, h * 0.95, mi);
  }
  function kuta(x, y, z, s, m) { box(m || M.stone, x, y + 0.11 * s, z, 0.24 * s, 0.22 * s, 0.24 * s); put(G.pyr, M.gold, x, y + 0.32 * s, z, 0, 0, 0, 0.22 * s, 0.22 * s, 0.22 * s); }
  function kalasam(x, y, z, s) { put(G.pot, M.gold, x, y, z, 0, 0, 0, 0.42 * s, 0.42 * s, 0.42 * s); }
  function pillar(x, y, z, h) { put(G.pillar, M.stone, x, y, z, 0, 0, 0, h * 0.34, h, h * 0.34); put(G.cyl, M.gold, x, y + h * 0.3, z, 0, 0, 0, h * 0.125, h * 0.03, h * 0.125); }
  function stripedWall(x0, x1, y, h, z, d, sideFacing) { // modules keep stripe width constant
    var n = Math.max(1, Math.round(Math.abs(x1 - x0) / 1.3)), w = (x1 - x0) / n;
    for (var i = 0; i < n; i++) box(M.striped, x0 + w * (i + 0.5), y + h / 2, z, w, h, d);
  }
  function stripedWallZ(z0, z1, y, h, x, d) {
    var n = Math.max(1, Math.round(Math.abs(z1 - z0) / 1.3)), w = (z1 - z0) / n;
    for (var i = 0; i < n; i++) box(M.striped, x, y + h / 2, z0 + w * (i + 0.5), d, h, w);
  }

  /* ====================== ground, hills, platform ====================== */
  var grass = new THREE.Mesh(new THREE.CircleGeometry(160, 48), M.grass); grass.rotation.x = -Math.PI / 2; grass.position.y = -0.02; grass.receiveShadow = true; scene.add(grass);
  var court = new THREE.Mesh(new THREE.CircleGeometry(34, 64), M.ground); court.rotation.x = -Math.PI / 2; court.receiveShadow = true; scene.add(court);
  for (var hI = 0; hI < 26; hI++) {
    var ha = (hI / 26) * Math.PI * 2 + Math.random() * 0.2, hr = 95 + Math.random() * 25, hs = 14 + Math.random() * 20;
    put(G.sph, M.hill, Math.cos(ha) * hr, -3, Math.sin(ha) * hr, 0, 0, 0, hs * 1.6, hs * 0.55, hs);
  }
  // plinth + steps
  box(M.stoneDark, 0, 0.225, 1.6, 16, 0.45, 12.4);
  box(M.stone, 0, 0.6, 1.6, 15.4, 0.3, 11.8);
  [-1, 1].forEach(function (k) { box(M.gold, k * 7.72, 0.62, 1.6, 0.06, 0.34, 11.9); box(M.gold, 0, 0.62, 1.6 + k * 5.92, 15.5, 0.34, 0.06); });
  for (var st = 0; st < 4; st++) box(M.stone, 0, 0.36 - st * 0.09, 8.25 + st * 0.5, 4.6 + st * 0.3, 0.14, 0.5);
  var BASE = 0.78;

  /* ====================== podium, doorway, porch ====================== */
  var PODH = 2.7;
  box(M.stoneDark, 0, BASE + 0.15, 0, 9.8, 0.3, 6.8);          // moulded footing
  box(M.stone, 0, BASE + 0.4, 0, 9.4, 0.2, 6.4);
  stripedWall(-4.4, 4.4, BASE + 0.5, PODH - 0.5, 0, 5.8);
  box(M.stone, 0, BASE + PODH + 0.1, 0, 9.2, 0.2, 6.2);       // cornice
  box(M.gold, 0, BASE + PODH + 0.23, 0, 9.3, 0.05, 6.3);
  // doorway (front)
  var DZ = 2.9;
  box(M.dark, 0, BASE + 1.45, DZ - 0.05, 1.9, 2.3, 0.4);
  box(M.stone, -1.2, BASE + 1.5, DZ + 0.08, 0.4, 2.7, 0.5);
  box(M.stone, 1.2, BASE + 1.5, DZ + 0.08, 0.4, 2.7, 0.5);
  box(M.stone, 0, BASE + 2.95, DZ + 0.08, 3.0, 0.4, 0.55);
  box(M.gold, 0, BASE + 3.2, DZ + 0.1, 3.1, 0.07, 0.6);
  put(G.disc, M.gold, 0, BASE + 3.5, DZ + 0.15, Math.PI / 2, 0, 0, 0.36, 0.06, 0.36);   // kirtimukha disc
  [-1, 1].forEach(function (k) { figure(k * 2.55, BASE + 0.55, DZ + 0.1, 0, 2.3, k > 0 ? 0 : 3); box(M.stone, k * 2.55, BASE + 0.5, DZ + 0.1, 0.9, 0.1, 0.5); });
  // porch (mukha mandapam)
  [-2.7, 2.7].forEach(function (px) { [3.7, 5.6].forEach(function (pz) { pillar(px, BASE, pz, 2.5); }); });
  box(M.stone, 0, BASE + 2.62, 4.7, 6.8, 0.3, 3.6);
  box(M.maroon, 0, BASE + 2.84, 4.7, 7.0, 0.14, 3.8);
  box(M.gold, 0, BASE + 2.93, 4.7, 7.05, 0.04, 3.85);
  for (var pk = 0; pk < 5; pk++) kuta(-3 + pk * 1.5, BASE + 2.98, 6.5, 1.1);
  // door glow (lit interior, brighter at night)
  var doorGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.2), new THREE.MeshBasicMaterial({ color: 0xffa94a, transparent: true, opacity: 0, depthWrite: false }));
  doorGlow.position.set(0, BASE + 1.4, DZ + 0.16); scene.add(doorGlow);

  /* ====================== gopuram tiers ====================== */
  var y = BASE + PODH + 0.3, TIERS = 8, tierInfo = [];
  var bulbPts = [];
  for (var t = 0; t < TIERS; t++) {
    var w = 8.4 - t * 0.78, d = 5.2 - t * 0.46, h = 1.45 - t * 0.04, pm = plasterMats[t % plasterMats.length];
    box(pm, 0, y + h / 2, 0, w, h, d);
    [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) { box(M.stone, sx * w / 2, y + h / 2, sz * d / 2, 0.3, h, 0.3); }); });
    var count = Math.max(2, Math.floor((w - 0.9) / 1.05)), span = w - 1.3;
    [1, -1].forEach(function (side) {
      for (var n = 0; n < count; n++) {
        var nx = count === 1 ? 0 : -span / 2 + span * n / (count - 1);
        niche(nx, y + h * 0.5, side * d / 2, side, 0.52, h * 0.55, n + t * 3);
        if (n < count - 1) { var mx = nx + span / (count - 1) / 2; box(M.stone, mx, y + h * 0.5, side * (d / 2 + 0.03), 0.1, h * 0.8, 0.08); }
      }
    });
    [-1, 1].forEach(function (sx) { // side faces: two niches each
      for (var n2 = 0; n2 < 2; n2++) { var nz = (n2 - 0.5) * d * 0.4; var ry2 = sx > 0 ? Math.PI / 2 : -Math.PI / 2;
        box(M.dark, sx * (w / 2 + 0.02), y + h * 0.5, nz, 0.07, h * 0.55, 0.52);
        figure(sx * (w / 2 + 0.1), y + h * 0.5 - h * 0.27, nz, ry2, h * 0.52, n2 + t);
      }
    });
    // sloped eave (four-sided frustum) + gold edge
    var ew = w + 1.0, eh = 0.48, topw = w - 0.1;
    var fr = new THREE.CylinderGeometry(topw / Math.SQRT2, ew / Math.SQRT2, eh, 4, 1); fr.rotateY(Math.PI / 4);
    put(fr, M.maroon, 0, y + h + eh / 2, 0, 0, 0, 0, 1, 1, (d + 1.0) / ew);
    box(M.gold, 0, y + h + 0.02, 0, w + 1.04, 0.06, d + 1.04);
    // tiny roofs along the eave
    var kc = Math.max(3, Math.round(ew / 1.15));
    [1, -1].forEach(function (side) { for (var k = 0; k < kc; k++) kuta(-ew / 2 + 0.3 + (ew - 0.6) * k / (kc - 1), y + h + 0.06, side * ((d + 1.0) / 2 - 0.16), 1.0); });
    [-1, 1].forEach(function (sx) { kuta(sx * (ew / 2 - 0.16), y + h + 0.06, 0, 1.0); });
    // string-light points on the front/back eave edge
    for (var b = 0; b <= Math.floor(ew / 0.38); b++) [1, -1].forEach(function (side) { bulbPts.push([-ew / 2 + b * 0.38, y + h - 0.05, side * ((d + 1.04) / 2 + 0.02)]); });
    tierInfo.push({ w: w, d: d, h: h, y: y });
    y += h + 0.34;
  }
  // barrel-vault crown
  var tw = 8.4 - (TIERS - 1) * 0.78, td = 5.2 - (TIERS - 1) * 0.46, vr = td * 0.5;
  put(G.cyl, M.maroon, 0, y, 0, 0, 0, Math.PI / 2, vr, tw + 0.8, vr);
  box(M.gold, 0, y + vr * 0.99, 0, tw + 0.9, 0.12, 0.28);
  [-1, 1].forEach(function (sx) { put(G.cone, M.gold, sx * (tw / 2 + 0.55), y, 0, 0, 0, -sx * Math.PI / 2, vr * 0.9, 0.7, vr * 0.9); put(G.disc, M.gold, sx * (tw / 2 + 0.42), y, 0, 0, 0, Math.PI / 2, vr * 0.92, 0.06, vr * 0.92); });
  var ridge = y + vr, KN = 7, kalasamTop = ridge;
  for (var kq = 0; kq < KN; kq++) {
    var kx = (kq - (KN - 1) / 2) * ((tw + 0.4) / (KN - 1)) * 0.92, ks = kq === 3 ? 1.35 : 1.0;
    kalasam(kx, ridge, 0, ks); if (kq === 3) kalasamTop = ridge + 1.9 * 0.42 * ks;
  }

  /* ====================== compound walls, flagstaff, lamps ====================== */
  var WH = 2.3;
  [-1, 1].forEach(function (sx) {
    stripedWall(sx > 0 ? 4.9 : -18, sx > 0 ? 18 : -4.9, 0, WH, 0, 1.0);
    box(M.stone, sx * 11.45, WH + 0.1, 0, 13.4, 0.2, 1.3); box(M.gold, sx * 11.45, WH + 0.22, 0, 13.45, 0.04, 1.35);
    for (var wk = 0; wk < 6; wk++) kuta(sx * (6.2 + wk * 2.3), WH + 0.2, 0, 1.4);
    stripedWallZ(-14, 0, 0, WH, sx * 18, 1.0); box(M.stone, sx * 18, WH + 0.1, -7, 1.3, 0.2, 14);
  });
  stripedWall(-18, 18, 0, WH, -14, 1.0); box(M.stone, 0, WH + 0.1, -14, 36, 0.2, 1.3);
  // flagstaff (dhwajastambham)
  box(M.stoneDark, 0, 0.9, 12.6, 2.0, 0.3, 2.0); box(M.stone, 0, 1.2, 12.6, 1.5, 0.3, 1.5);
  put(G.cyl, M.brass, 0, 4.9, 12.6, 0, 0, 0, 0.14, 7.2, 0.14);
  [1.7, 3.3, 5.0].forEach(function (ry) { put(G.cyl, M.gold, 0, ry, 12.6, 0, 0, 0, 0.22, 0.1, 0.22); });
  put(G.sph, M.gold, 0, 8.6, 12.6, 0, 0, 0, 0.26, 0.26, 0.26);
  // lamp posts
  var lampPos = [[-5.6, 8.9], [-2.4, 9.4], [2.4, 9.4], [5.6, 8.9]], lampHeads = [];
  lampPos.forEach(function (lp) {
    put(G.cyl8, M.lampBody, lp[0], 1.0, lp[1], 0, 0, 0, 0.05, 2.0, 0.05); box(M.lampBody, lp[0], 0.15, lp[1], 0.4, 0.3, 0.4);
    put(G.sph, M.gold, lp[0], 2.1, lp[1], 0, 0, 0, 0.17, 0.12, 0.17); lampHeads.push(new THREE.Vector3(lp[0], 2.25, lp[1]));
  });
  // bulbs
  bulbPts.forEach(function (bp) { put(G.sph, M.bulb, bp[0], bp[1], bp[2], 0, 0, 0, 0.05, 0.05, 0.05); });
  flush();
  var bulbMesh = meshOf.get(M.bulb);

  /* ====================== palms ====================== */
  var leafGeo = new THREE.PlaneGeometry(2.8, 0.5, 5, 1);
  (function () { var pos = leafGeo.attributes.position; for (var i = 0; i < pos.count; i++) { var tt = (pos.getX(i) + 1.4) / 2.8; pos.setX(i, tt * 2.8); pos.setZ(i, -tt * tt * 0.9); pos.setY(i, pos.getY(i) * (1 - tt * 0.5)); } leafGeo.rotateX(-Math.PI / 2); leafGeo.computeVertexNormals(); })();
  [[-22, -9], [-21, 2], [-23, 12], [21, -8], [22, 4], [20, 14], [-12, -18], [0, -19], [11, -18], [-9, 21], [9, 22], [-15, 16], [16, 18]].forEach(function (pp, idx) {
    var hgt = 7 + (idx % 4) * 0.9, lean = ((idx % 3) - 1) * 0.07;
    put(G.cyl8, M.trunk, pp[0] + lean * hgt * 0.5, hgt / 2, pp[1], 0, 0, -lean, 0.2, hgt, 0.2);
    var cx = pp[0] + lean * hgt, cz = pp[1];
    for (var l = 0; l < 10; l++) put(leafGeo, M.leaf, cx, hgt, cz, 0, (l / 10) * Math.PI * 2 + idx, 0.25 + (l % 2) * 0.12);
    put(G.sph, M.trunk, cx, hgt - 0.1, cz, 0, 0, 0, 0.3, 0.3, 0.3);
  });
  flush();

  /* ====================== devotees (animated) ====================== */
  var walkers = [];
  for (var wI = 0; wI < 9; wI++) {
    var grp = new THREE.Group(), col = figMats[(wI * 3) % figMats.length];
    var bodyM = new THREE.Mesh(G.cone, col); bodyM.scale.set(0.2, 0.75, 0.15); bodyM.position.y = 0.4; bodyM.castShadow = true;
    var headM = new THREE.Mesh(G.sph, M.skin); headM.scale.setScalar(0.09); headM.position.y = 0.88; headM.castShadow = true;
    grp.add(bodyM, headM); scene.add(grp);
    walkers.push({ g: grp, a: 3 + Math.random() * 7, z: 10.5 + Math.random() * 5.5, sp: 0.25 + Math.random() * 0.2, ph: Math.random() * 6.28, cx: (Math.random() - 0.5) * 6 });
  }

  /* ====================== sky, environment, lights ====================== */
  var skyU = { top: { value: new THREE.Color() }, mid: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color() }, sunSize: { value: 1 } };
  var skyMat = new THREE.ShaderMaterial({
    uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 hor; uniform vec3 sunDir; uniform vec3 sunCol; uniform float sunSize; varying vec3 vP;' +
      'void main(){ vec3 d = normalize(vP); float h = max(d.y,0.0);' +
      ' vec3 c = mix(hor, mid, smoothstep(0.0,0.22,h)); c = mix(c, top, smoothstep(0.18,0.8,h));' +
      ' float s = clamp(dot(d, normalize(sunDir)),0.0,1.0) + 0.0001; c += sunCol*(pow(s,600.0)*3.0*sunSize + pow(s,8.0)*0.25);' +
      ' if(d.y<0.0) c = mix(hor, hor*0.7, clamp(-d.y*3.0,0.0,1.0));' +
      ' c = clamp(c, 0.0, 6.0); gl_FragColor = vec4(c,1.0); }'
  });
  var skyDome = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), skyMat); skyDome.renderOrder = -1; scene.add(skyDome);
  /* Reflection environment: small gradient cube-map built from the sky colours (works on every GPU) */
  var envCube = null;
  function css(c) { return '#' + new THREE.Color(c).getHexString(); }
  function mixHex(a, b, k) { return new THREE.Color(a).lerp(new THREE.Color(b), k); }
  function setEnv(T) {
    var S = 64, faces = [];
    var topC = new THREE.Color(T.top), midC = new THREE.Color(T.mid), horC = new THREE.Color(T.hor), gndC = horC.clone().multiplyScalar(0.55);
    function cv() { var c = document.createElement('canvas'); c.width = c.height = S; return c; }
    function side() {
      var c = cv(), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, S);
      gr.addColorStop(0, '#' + midC.clone().lerp(topC, 0.5).getHexString()); gr.addColorStop(0.5, '#' + horC.getHexString());
      gr.addColorStop(0.52, '#' + gndC.getHexString()); gr.addColorStop(1, '#' + gndC.clone().multiplyScalar(0.7).getHexString());
      g.fillStyle = gr; g.fillRect(0, 0, S, S); return c;
    }
    function flat(col) { var c = cv(), g = c.getContext('2d'); g.fillStyle = '#' + col.getHexString(); g.fillRect(0, 0, S, S); return c; }
    faces = [side(), side(), flat(topC), flat(gndC.clone().multiplyScalar(0.7)), side(), side()];
    if (envCube) envCube.dispose();
    envCube = new THREE.CubeTexture(faces); envCube.encoding = THREE.sRGBEncoding; envCube.needsUpdate = true;
    scene.environment = envCube;
  }

  var hemi = new THREE.HemisphereLight(0xffffff, 0x7a6644, 0.25); scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xfff1d6, 1.5); sun.castShadow = true;
  var ss = small ? 1024 : 2048; sun.shadow.mapSize.set(ss, ss);
  var sc = sun.shadow.camera; sc.left = -26; sc.right = 26; sc.top = 26; sc.bottom = -14; sc.near = 1; sc.far = 130; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04;
  scene.add(sun); scene.add(sun.target);
  var lampLights = lampHeads.map(function (p) { var l = new THREE.PointLight(0xffa13a, 0, 12, 2); l.position.copy(p); scene.add(l); return l; });
  var spots = [[-7, 9], [7, 9]].map(function (p) { var s = new THREE.SpotLight(0xffc27a, 0, 60, 0.55, 0.7, 1.2); s.position.set(p[0], 0.4, p[1]); s.target.position.set(0, 9, 0); scene.add(s); scene.add(s.target); return s; });
  var doorLight = new THREE.PointLight(0xffa04a, 0, 9, 2); doorLight.position.set(0, BASE + 1.5, DZ + 1.0); scene.add(doorLight);

  function glowTex() { return canvasTex(64, function (g, s) { var gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); gr.addColorStop(0, 'rgba(255,200,110,1)'); gr.addColorStop(0.35, 'rgba(255,160,60,.45)'); gr.addColorStop(1, 'rgba(255,140,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, s, s); }, 1, 1, true); }
  var glowT = glowTex();
  var glows = lampHeads.map(function (p) { var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })); sp.position.copy(p); sp.scale.setScalar(1.8); scene.add(sp); return sp; });

  var STARS = 320, sp = new Float32Array(STARS * 3);
  for (var si = 0; si < STARS; si++) { var th = Math.random() * 6.283, ph = Math.random() * 1.25 + 0.12, rr = 280; sp[si * 3] = rr * Math.sin(ph) * Math.cos(th); sp[si * 3 + 1] = rr * Math.cos(ph); sp[si * 3 + 2] = rr * Math.sin(ph) * Math.sin(th); }
  var starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xfff2d0, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.9, fog: false, depthWrite: false })); stars.visible = false; scene.add(stars);

  var TIMES = {
    day:   { top: 0x3d84d2, mid: 0x9cc6ea, hor: 0xf3e7cd, sun: [0.55, 0.68, 0.48], sunC: 0xfff0d2, sunI: 1.7, hemiI: 0.25, exp: 0.95, env: 0.9, fog: 0xdfd8c2, lamp: 0, spot: 0, bulbs: false, glow: 0, stars: false, ground: 1 },
    dusk:  { top: 0x2a2d6a, mid: 0xb5587a, hor: 0xffa05a, sun: [-0.85, 0.16, 0.5], sunC: 0xff9446, sunI: 1.5, hemiI: 0.18, exp: 1.0, env: 0.7, fog: 0xc98a6a, lamp: 1.1, spot: 1.2, bulbs: true, glow: 0.55, stars: false, ground: 0.8 },
    night: { top: 0x03060f, mid: 0x0a1230, hor: 0x1e2a55, sun: [-0.35, 0.55, -0.6], sunC: 0xaecbff, sunI: 0.38, hemiI: 0.1, exp: 1.25, env: 0.45, fog: 0x0b1226, lamp: 2.0, spot: 2.0, bulbs: true, glow: 1, stars: true, ground: 0.5 }
  };
  var currentTime = 'day';
  function setTime(name) {
    var T = TIMES[name]; if (!T) return; currentTime = name;
    skyU.top.value.setHex(T.top); skyU.mid.value.setHex(T.mid); skyU.hor.value.setHex(T.hor);
    var sd = new THREE.Vector3().fromArray(T.sun).normalize(); skyU.sunDir.value.copy(sd); skyU.sunCol.value.setHex(T.sunC);
    skyU.sunSize.value = name === 'night' ? 0.35 : 1;
    sun.color.setHex(T.sunC); sun.intensity = T.sunI; sun.position.copy(sd).multiplyScalar(60);
    hemi.intensity = T.hemiI;
    renderer.toneMappingExposure = T.exp;
    scene.fog = new THREE.Fog(T.fog, 50, 190);
    setEnv(T);
    envMats.forEach(function (m) { m.envMapIntensity = T.env * m.userData.envI; });
    lampLights.forEach(function (l) { l.intensity = T.lamp; }); spots.forEach(function (s) { s.intensity = T.spot; }); doorLight.intensity = T.lamp * 0.9;
    glows.forEach(function (g) { g.material.opacity = T.glow; }); doorGlow.material.opacity = name === 'day' ? 0.05 : (name === 'dusk' ? 0.3 : 0.5);
    if (bulbMesh) bulbMesh.visible = T.bulbs; stars.visible = T.stars;
    document.querySelectorAll('[data-time]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-time') === name); });
  }

  /* ====================== camera views + hotspots ====================== */
  var VIEWS = {
    front:  { pos: [0, 9, 36], look: [0, 9, 0] },
    aerial: { pos: [26, 18, 30], look: [0, 8, 0] },
    close:  { pos: [6.5, 3.4, 15.5], look: [0, 3.2, 3] },
    crown:  { pos: [9, 20, 13], look: [0, 17, 0] }
  };
  var tween = null;
  function goView(name, instant) {
    var v = VIEWS[name]; if (!v) return;
    var to = { p: new THREE.Vector3().fromArray(v.pos), l: new THREE.Vector3().fromArray(v.look) };
    if (instant || reduceMotion) { camera.position.copy(to.p); controls.target.copy(to.l); controls.update(); }
    else tween = { fromP: camera.position.clone(), fromL: controls.target.clone(), to: to, t: 0 };
    document.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-view') === name); });
  }
  controls.addEventListener('start', function () { tween = null; });

  var t3 = tierInfo[3];
  var HOTS = [
    { pos: [0, kalasamTop, 0], title: 'Kalasam (crowning finials)', text: 'Seven gold-finished kalasams crown the barrel-vaulted roof. We make and finish finials to the size and style of your temple.', link: 'services.html#gopuram-sculptures', cta: 'Gopuram sculptures' },
    { pos: [-t3.w / 2 + 0.5, t3.y + t3.h * 0.5, t3.d / 2 + 0.5], title: 'Gopuram tiers and figures', text: 'Each tier carries arched niches with painted stucco figures, a sloped eave and rows of miniature roofs. Tiers, figures and ornament are made to your approved design.', link: 'services.html#gopuram-sculptures', cta: 'Gopuram sculptures' },
    { pos: [0, BASE + 3.1, DZ + 0.4], title: 'Entrance decoration', text: 'A stone-framed doorway, decorated lintel and guardian figures (dwarapalakas) welcome visitors. Entrance work can be designed to your temple.', link: 'services.html#entrance-decorations', cta: 'Entrance decorations' },
    { pos: [2.7, BASE + 1.9, 5.6], title: 'Pillars and columns', text: 'Sculpted pillars with traditional bases and flared capitals carry the porch roof. Sizes, motifs and finishes are customised.', link: 'services.html#pillars-columns', cta: 'Pillars and columns' },
    { pos: [-5.6, 2.4, 8.9], title: 'On-site installation', text: 'Finished works are transported and installed at your site, followed by inspection and handover.', link: 'services.html#installation', cta: 'On-site installation' }
  ];
  var hotHost = document.getElementById('hotspots3d'), panel = document.getElementById('info3d');
  hotHost.innerHTML = '';
  HOTS.forEach(function (h) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hotspot'; b.setAttribute('aria-label', h.title); b.innerHTML = '<span></span>';
    b.addEventListener('click', function (e) { e.stopPropagation(); openInfo(h); });
    hotHost.appendChild(b); h.el = b; h.v = new THREE.Vector3().fromArray(h.pos);
  });
  function openInfo(h) {
    panel.hidden = false; panel.querySelector('h3').textContent = h.title; panel.querySelector('p').textContent = h.text;
    var a = panel.querySelector('a'); a.href = h.link; a.textContent = 'See: ' + h.cta + ' →';
    HOTS.forEach(function (x) { x.el.classList.toggle('active', x === h); });
  }
  panel.querySelector('[data-close]').addEventListener('click', function () { panel.hidden = true; HOTS.forEach(function (x) { x.el.classList.remove('active'); }); });
  var proj = new THREE.Vector3();
  function updateHotspots() {
    var w = stage.clientWidth, hh = stage.clientHeight;
    HOTS.forEach(function (h) {
      proj.copy(h.v).project(camera);
      var vis = proj.z < 1 && proj.x > -1.05 && proj.x < 1.05 && proj.y > -1.05 && proj.y < 1.05;
      h.el.style.display = vis ? '' : 'none';
      if (vis) h.el.style.transform = 'translate(' + ((proj.x * 0.5 + 0.5) * w) + 'px,' + ((-proj.y * 0.5 + 0.5) * hh) + 'px) translate(-50%,-50%)';
    });
  }

  /* ====================== UI wiring ====================== */
  document.querySelectorAll('[data-view]').forEach(function (b) { b.addEventListener('click', function () { goView(b.getAttribute('data-view')); }); });
  document.querySelectorAll('[data-time]').forEach(function (b) { b.addEventListener('click', function () { setTime(b.getAttribute('data-time')); }); });
  var rot = document.getElementById('autoRotate');
  function syncRot() { rot.setAttribute('aria-pressed', controls.autoRotate); rot.textContent = controls.autoRotate ? 'Auto-rotate: On' : 'Auto-rotate: Off'; }
  rot.addEventListener('click', function () { controls.autoRotate = !controls.autoRotate; syncRot(); });
  var fsBtn = document.getElementById('fullscreen3d');
  if (fsBtn) { if (!stage.requestFullscreen) fsBtn.hidden = true; fsBtn.addEventListener('click', function () { if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen(); }); }
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') rotateBy(-0.15); else if (e.key === 'ArrowRight') rotateBy(0.15);
    else if (e.key === '+' || e.key === '=') dolly(0.9); else if (e.key === '-') dolly(1.1); else return;
    e.preventDefault();
  });
  function rotateBy(dx) { var off = camera.position.clone().sub(controls.target), a = Math.atan2(off.x, off.z) + dx, r = Math.hypot(off.x, off.z); camera.position.set(controls.target.x + r * Math.sin(a), camera.position.y, controls.target.z + r * Math.cos(a)); controls.update(); }
  function dolly(f) { var off = camera.position.clone().sub(controls.target).multiplyScalar(f), len = off.length(); if (len < controls.minDistance || len > controls.maxDistance) return; camera.position.copy(controls.target).add(off); controls.update(); }

  function resize() {
    var w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
    camera.aspect = w / h; camera.fov = w / h < 0.8 ? 62 : 42; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); document.addEventListener('fullscreenchange', resize);

  /* ====================== loop ====================== */
  var running = true, inView = true, clock = new THREE.Clock();
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function loop() {
    requestAnimationFrame(loop);
    if (!running || !inView) return;
    var dt = Math.min(clock.getDelta(), 0.05), time = clock.elapsedTime;
    if (tween) { tween.t = Math.min(1, tween.t + dt / 1.6); var e = ease(tween.t); camera.position.lerpVectors(tween.fromP, tween.to.p, e); controls.target.lerpVectors(tween.fromL, tween.to.l, e); if (tween.t >= 1) tween = null; }
    controls.update();
    skyDome.position.copy(camera.position);
    if (!reduceMotion) {
      walkers.forEach(function (w) {
        var ph = time * w.sp + w.ph, x = w.cx + Math.sin(ph) * w.a, dir = Math.cos(ph) >= 0 ? 1 : -1;
        w.g.position.set(x, 0.05 + Math.abs(Math.sin(time * 5 + w.ph)) * 0.035, w.z);
        w.g.rotation.y += ((dir > 0 ? Math.PI / 2 : -Math.PI / 2) - w.g.rotation.y) * 0.08;
      });
      if (currentTime !== 'day') lampLights.forEach(function (l, i) { l.intensity = TIMES[currentTime].lamp * (0.93 + 0.07 * Math.sin(time * 9 + i * 2.1)); });
    }
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
