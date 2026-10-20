// Calendar-only calculations avoid daylight-saving and UTC/local-date shifts.
function birthdayEscape(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
  });
}

function birthdayDateParts(value) {
  var match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  var year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  var date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  if (year < 1 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { year: year, month: month, day: day, stamp: date.getTime() };
}

function upcomingBirthdays(students, now) {
  now = now || new Date();
  if (!(now instanceof Date) || isNaN(now.getTime())) return [];
  var year = now.getFullYear();
  var today = Date.UTC(year, now.getMonth(), now.getDate());
  var seen = {};
  return (students || []).map(function (student) {
    if (!student || student.stato === 'archiviato' || student.tipo === 'associazione') return null;
    var birth = birthdayDateParts(student.data_nascita);
    if (!birth || birth.stamp > today) return null;
    var name = [student.nome, student.cognome].filter(Boolean).join(' ') || student.nickname || 'Allievo';
    var key = '$' + (student.id || name + student.data_nascita);
    if (seen[key]) return null;
    seen[key] = true;
    function anniversary(targetYear) {
      var day = birth.day;
      var leap = targetYear % 4 === 0 && (targetYear % 100 !== 0 || targetYear % 400 === 0);
      // Show an explicit early reminder on 28 February in non-leap years.
      if (birth.month === 2 && day === 29 && !leap) day = 28;
      return Date.UTC(targetYear, birth.month - 1, day);
    }
    var stamp = anniversary(year);
    if (stamp < today) stamp = anniversary(year + 1);
    var days = Math.round((stamp - today) / 86400000);
    if (days > 14) return null;
    var observed = new Date(stamp);
    return {
      student: student, name: name, days: days,
      date: ('0' + birth.day).slice(-2) + '/' + ('0' + birth.month).slice(-2),
      earlyLeapReminder: birth.month === 2 && birth.day === 29 && observed.getUTCDate() === 28
    };
  }).filter(Boolean).sort(function (a, b) {
    return a.days - b.days || a.name.localeCompare(b.name, 'it');
  });
}

function renderBirthdayReminders(students, options) {
  options = options || {};
  var rows = upcomingBirthdays(students, options.now);
  if (!rows.length) return '';
  var e = birthdayEscape;
  return '<section class="birthday-reminders" aria-label="Promemoria compleanni">' +
    (options.title ? '<h3>' + e(options.title) + '</h3>' : '') +
    rows.map(function (row) {
      var when = row.earlyLeapReminder ? (row.days === 0 ? 'Promemoria oggi per il 29 febbraio' : 'Promemoria fra ' + row.days + ' giorni per il 29 febbraio') :
        row.days === 0 ? 'Compleanno oggi' : row.days === 1 ? 'Compleanno domani' : 'Compleanno fra ' + row.days + ' giorni';
      var name = e(row.name);
      if (options.links !== false && row.student.id) name = '<button type="button" class="linkish" onclick="showView(\'scheda\',' + e(JSON.stringify(String(row.student.id))) + ')">' + name + '</button>';
      return '<div class="birthday-reminder' + (row.days === 0 ? ' is-today' : '') + '"><span aria-hidden="true">🎂</span><div><strong>' + name + '</strong><span>' + e(when) + ' · ' + e(row.date) + (row.earlyLeapReminder ? ' (anticipato al 28/02)' : '') + '</span></div></div>';
    }).join('') + '</section>';
}

function renderLessonBirthdayReminders() {
  var panel = document.getElementById('lz-birthday-reminders');
  if (!panel) return;
  var students = selectedLezioneAllieviIds().map(function (id) { return allievoById(id); }).filter(Boolean);
  panel.innerHTML = renderBirthdayReminders(students, { title: 'Compleanni dei partecipanti · oggi e prossimi 14 giorni' });
  panel.hidden = !panel.innerHTML;
}
