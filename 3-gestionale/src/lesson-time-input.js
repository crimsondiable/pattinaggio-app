(function () {
  'use strict';
  var input = document.getElementById('lz-ora');
  var toggle = document.getElementById('lz-ora-toggle');
  var picker = document.getElementById('lz-ora-picker');
  var hours = document.getElementById('lz-ora-hours');
  var minutes = document.getElementById('lz-ora-minutes');
  var done = document.getElementById('lz-ora-done');
  if (!input || !toggle || !picker || !hours || !minutes || !done) return;

  function populate(select, count) {
    for (var i = 0; i < count; i++) {
      var option = document.createElement('option');
      option.value = option.textContent = ('0' + i).slice(-2);
      select.appendChild(option);
    }
  }
  populate(hours, 24);
  populate(minutes, 60);

  function close() {
    picker.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }
  function normalize() {
    if (typeof window.normalizeLessonTime === 'function') {
      input.value = window.normalizeLessonTime(input.value) || input.value.trim();
    }
  }
  function apply() {
    input.value = hours.value + ':' + minutes.value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  toggle.addEventListener('click', function () {
    if (!picker.hidden) { close(); return; }
    normalize();
    var match = input.value.match(/^(\d{2}):(\d{2})$/);
    hours.value = match ? match[1] : '00';
    minutes.value = match ? match[2] : '00';
    picker.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    hours.focus();
  });
  input.addEventListener('blur', normalize);
  hours.addEventListener('change', apply);
  minutes.addEventListener('change', apply);
  done.addEventListener('click', function () { apply(); close(); input.focus(); });
  document.addEventListener('click', function (event) {
    if (!picker.contains(event.target) && event.target !== toggle) close();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !picker.hidden) { close(); toggle.focus(); }
  });
})();
