// One editor per student; async completion never changes the current page/student.
var studentLessonReminderEditors = Object.create(null);

function studentLessonReminderValue(student) {
  student = student || {};
  var profile = student.profilo || {};
  // An explicitly empty canonical note must not resurrect a historical alias.
  if (Object.prototype.hasOwnProperty.call(profile, 'note_lezione')) return String(profile.note_lezione || '').trim();
  return String(profile.promemoria_lezione || profile.note_per_lezione || student.note_lezione || '').trim();
}

function studentLessonReminderContents(student) {
  var id = String(student.id);
  var arg = esc(JSON.stringify(id));
  var state = studentLessonReminderEditors[id];
  var note = studentLessonReminderValue(student);
  var heading = '<div class="student-reminder-head"><span>Promemoria lezione</span>';
  if (!state) {
    return heading + (note ? '<button type="button" class="btn btn-ghost btn-sm" aria-label="Modifica promemoria lezione" onclick="editStudentLessonReminder(' + arg + ')">' + editIcon() + '</button>' : '') + '</div>' +
      (note ? '<div class="student-reminder-text">' + esc(note) + '</div>' : '<button type="button" class="btn btn-ghost student-reminder-add" onclick="editStudentLessonReminder(' + arg + ')">+ Aggiungi promemoria</button>');
  }
  var disabled = state.saving ? ' disabled' : '';
  return heading + '</div><textarea id="student-reminder-input-' + esc(id) + '" rows="3" aria-label="Promemoria lezione" oninput="setStudentLessonReminderDraft(' + arg + ',this.value)"' + disabled + '>' + esc(state.draft) + '</textarea>' +
    (state.error ? '<p class="student-reminder-error" role="alert">' + esc(state.error) + '</p>' : '') +
    '<div class="student-reminder-actions"><button type="button" class="btn btn-primary btn-sm" onclick="saveStudentLessonReminder(' + arg + ')"' + disabled + '>' + (state.saving ? 'Salvataggio…' : 'Salva') + '</button><button type="button" class="btn btn-outline btn-sm" onclick="cancelStudentLessonReminder(' + arg + ')"' + disabled + '>Annulla</button></div>';
}

function renderStudentLessonReminder(student) {
  return '<div class="scheda-lesson-note student-reminder" id="student-reminder-' + esc(String(student.id)) + '">' + studentLessonReminderContents(student) + '</div>';
}

function refreshStudentLessonReminder(id) {
  var host = document.getElementById('student-reminder-' + id);
  var student = allAllievi.find(function (row) { return String(row.id) === String(id); });
  if (host && student) host.innerHTML = studentLessonReminderContents(student);
}

function editStudentLessonReminder(id) {
  var student = allAllievi.find(function (row) { return String(row.id) === String(id); });
  if (!student || student.tipo === 'associazione') return;
  if (!studentLessonReminderEditors[id]) {
    var note = studentLessonReminderValue(student);
    studentLessonReminderEditors[id] = { original: note, draft: note, saving: false, error: '' };
  }
  refreshStudentLessonReminder(id);
  var input = document.getElementById('student-reminder-input-' + id);
  if (input && !studentLessonReminderEditors[id].saving) input.focus();
}

function setStudentLessonReminderDraft(id, value) {
  var state = studentLessonReminderEditors[id];
  if (state && !state.saving) state.draft = value;
}

function cancelStudentLessonReminder(id) {
  var state = studentLessonReminderEditors[id];
  if (!state || state.saving) return;
  delete studentLessonReminderEditors[id];
  refreshStudentLessonReminder(id);
}

function saveStudentLessonReminder(id) {
  var state = studentLessonReminderEditors[id];
  if (!state || state.saving) return Promise.resolve();
  var text = state.draft.trim();
  if (text === state.original) { cancelStudentLessonReminder(id); return Promise.resolve(); }
  state.saving = true;
  state.error = '';
  refreshStudentLessonReminder(id);
  return Promise.resolve().then(function () {
    return sb.from('allievi').select('id,profilo').eq('id', id).single();
  }).then(function (result) {
    if (result.error) throw result.error;
    if (!result.data || String(result.data.id) !== String(id)) throw new Error('Allievo non disponibile. Il promemoria non è stato salvato.');
    var fresh = result.data;
    var cached = allAllievi.find(function (row) { return String(row.id) === String(id); }) || {};
    if (studentLessonReminderValue(Object.assign({}, cached, fresh)) !== state.original) {
      allAllievi = allAllievi.map(function (row) { return String(row.id) === String(id) ? Object.assign({}, row, fresh) : row; });
      throw new Error('Il promemoria è stato modificato altrove. Il tuo testo è ancora qui: copialo prima di annullare e riaprire la versione aggiornata.');
    }
    var raw = fresh.profilo;
    if (raw != null && (typeof raw !== 'object' || Array.isArray(raw))) throw new Error('Il profilo non è valido. Nessuna modifica salvata.');
    var profile = Object.assign({}, raw || {}, { note_lezione: text || null });
    var request = sb.from('allievi').update({ profilo: profile }).eq('id', id);
    // Compare-and-set the JSONB profile to retain concurrent vacation/logistics edits.
    request = raw == null ? request.is('profilo', null) : request.eq('profilo', JSON.stringify(raw));
    return request.select('*').single();
  }).then(function (result) {
    if (result.error) {
      if (result.error.code === 'PGRST116') throw new Error('Il profilo è cambiato o il salvataggio non è autorizzato. Il testo è ancora qui: riprova.');
      throw result.error;
    }
    if (!result.data || String(result.data.id) !== String(id) || studentLessonReminderValue(result.data) !== text) {
      throw new Error('Salvataggio non confermato. Il profilo potrebbe essere cambiato nel frattempo: riprova.');
    }
    allAllievi = allAllievi.map(function (row) { return String(row.id) === String(id) ? Object.assign({}, row, result.data) : row; });
    delete studentLessonReminderEditors[id];
    refreshStudentLessonReminder(id);
    if (typeof renderLessonStudentNotes === 'function') renderLessonStudentNotes();
    if (typeof logModificaLocale === 'function') {
      try { logModificaLocale('allievo', id, 'Aggiornato promemoria lezione'); } catch (error) { console.warn('Storico del promemoria non aggiornato', error); }
    }
  }).catch(function (error) {
    state.saving = false;
    state.error = error.message || 'Salvataggio non riuscito. Il testo è ancora qui: riprova.';
    refreshStudentLessonReminder(id);
  });
}
