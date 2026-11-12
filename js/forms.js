/* ==========================================================================
   Enquiry + contact forms
   - Client-side validation of required fields
   - Success message on screen
   - WhatsApp hand-off with the enquiry text pre-filled
   - Backend-ready: every submission is built into one payload object by
     buildPayload(). If SITE.formEndpoint is set, the payload is POSTed there
     (multipart/form-data, so reference images are included).
   ========================================================================== */
(function () {
  var S = window.SITE;
  var MAX_FILES = 5, MAX_MB = 5;

  function fieldWrap(el) { return el.closest('.field'); }
  function setError(el, msg) {
    var w = fieldWrap(el); if (!w) return;
    w.classList.toggle('invalid', !!msg);
    var e = w.querySelector('.error'); if (e) e.textContent = msg || '';
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function validateField(el) {
    var v = (el.value || '').trim();
    if (el.required && !v) { setError(el, 'This field is required.'); return false; }
    if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setError(el, 'Enter a valid email address.'); return false; }
    if (v && el.name === 'mobile' && !/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '').replace(/^(\+?91)/, '$1'))) {
      setError(el, 'Enter a valid 10-digit Indian mobile number.'); return false;
    }
    if (v && el.type === 'number' && Number(v) < Number(el.min || 1)) { setError(el, 'Enter a number of at least ' + (el.min || 1) + '.'); return false; }
    if (el.type === 'file' && el.files.length) {
      if (el.files.length > MAX_FILES) { setError(el, 'Please choose at most ' + MAX_FILES + ' images.'); return false; }
      for (var i = 0; i < el.files.length; i++) {
        var f = el.files[i];
        if (!/^image\//.test(f.type)) { setError(el, 'Only image files are allowed.'); return false; }
        if (f.size > MAX_MB * 1024 * 1024) { setError(el, 'Each image must be under ' + MAX_MB + ' MB.'); return false; }
      }
    }
    setError(el, ''); return true;
  }

  function label(form, el) {
    var l = form.querySelector('label[for="' + el.id + '"]');
    return l ? l.textContent.replace('*', '').trim() : el.name;
  }

  /** One structured payload – ready to hand to a future API / database. */
  function buildPayload(form) {
    var data = { formType: form.getAttribute('data-form'), submittedAt: new Date().toISOString(), fields: {}, files: [] };
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      if (!el.name || el.name === 'website_hp' || el.type === 'file') return;
      if (el.value.trim()) data.fields[el.name] = el.value.trim();
    });
    var fi = form.querySelector('input[type=file]');
    if (fi) for (var i = 0; i < fi.files.length; i++) data.files.push(fi.files[i].name);
    return data;
  }

  function whatsappText(form) {
    var lines = ['*New enquiry – ' + S.businessName + '*'];
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      if (!el.name || el.name === 'website_hp' || el.type === 'file' || !el.value.trim()) return;
      lines.push(label(form, el) + ': ' + el.value.trim());
    });
    var fi = form.querySelector('input[type=file]');
    if (fi && fi.files.length) lines.push('Reference images: ' + fi.files.length + ' (I will send them in this chat)');
    return lines.join('\n');
  }

  function init(form) {
    var success = document.getElementById(form.getAttribute('data-success'));
    var waBtn = success && success.querySelector('[data-wa]');
    var fileInput = form.querySelector('input[type=file]');
    var fileList = form.querySelector('.file-list');

    // Prevent past dates for completion date
    var d = form.querySelector('input[type=date]');
    if (d) d.min = new Date().toISOString().slice(0, 10);

    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      el.addEventListener('blur', function () { validateField(el); });
      el.addEventListener('input', function () { if (fieldWrap(el) && fieldWrap(el).classList.contains('invalid')) validateField(el); });
    });
    if (fileInput && fileList) fileInput.addEventListener('change', function () {
      fileList.textContent = Array.prototype.map.call(fileInput.files, function (f) { return f.name; }).join(', ');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      form.querySelectorAll('input,select,textarea').forEach(function (el) {
        if (el.name === 'website_hp') return;
        if (!validateField(el)) { ok = false; if (!firstBad) firstBad = el; }
      });
      if (!ok) { firstBad.focus(); return; }
      var hp = form.querySelector('[name=website_hp]');
      if (hp && hp.value) return; // bot trap

      var payload = buildPayload(form);
      var done = function (sent) {
        form.style.display = 'none';
        if (success) {
          success.classList.add('show');
          var note = success.querySelector('[data-note]');
          if (note) note.textContent = sent
            ? 'Your enquiry has been received. We will contact you shortly.'
            : 'Your enquiry details are ready. To complete your enquiry, please send it to us on WhatsApp using the button below.';
          if (waBtn) { waBtn.href = waLink(whatsappText(form)); if (S.isConfigured) { waBtn.target = '_blank'; waBtn.rel = 'noopener'; } }
          success.setAttribute('tabindex', '-1'); success.focus();
          if (success.scrollIntoView) success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };

      if (S.formEndpoint) {
        var fd = new FormData(form);
        fd.delete('website_hp');
        fd.append('payload', JSON.stringify(payload));
        fetch(S.formEndpoint, { method: 'POST', body: fd })
          .then(function (r) { if (!r.ok) throw new Error(r.status); done(true); })
          .catch(function () { alert('We could not send your enquiry online. Please use the WhatsApp option that follows.'); done(false); });
      } else {
        // No backend yet: log structured payload for developers and offer WhatsApp.
        if (window.console) console.info('Enquiry payload (no backend configured):', payload);
        done(false);
      }
    });

    var again = success && success.querySelector('[data-again]');
    if (again) again.addEventListener('click', function () {
      form.reset(); form.style.display = ''; success.classList.remove('show');
      if (fileList) fileList.textContent = '';
      form.querySelector('input,select,textarea').focus();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-form]').forEach(init);
    // Pre-select category from ?category=deity etc.
    var q = new URLSearchParams(location.search).get('category');
    var sel = document.getElementById('category');
    if (q && sel) Array.prototype.forEach.call(sel.options, function (o) { if (o.value === q) sel.value = q; });
  });
})();
