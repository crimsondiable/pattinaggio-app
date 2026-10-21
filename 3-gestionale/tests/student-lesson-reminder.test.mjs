import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'
const source = readFileSync(new URL('../src/student-lesson-reminder.js', import.meta.url), 'utf8')
function fixture(options = {}) {
  const elements = new Map()
  const get = id => { if (!elements.has(id)) elements.set(id, { innerHTML: '', focus() {} }); return elements.get(id) }
  let freshProfile = { note_lezione: 'Nota originale', in_vacanza: true, logistica_individuale: { durata_lezione: 60 }, other: 'preservare' }
  if (Object.hasOwn(options, 'profile')) freshProfile = options.profile
  const students = [{ id: 'A', nome: 'Anna', profilo: { note_lezione: 'Nota originale' } }, { id: 'B', nome: 'Bea', profilo: {} }]
  if (options.profile === null) students[0].profilo = {}
  const requests = [], history = []
  const c = vm.createContext({
    console, document: { getElementById: get }, allAllievi: students,
    esc: text => String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
    editIcon: () => '<svg></svg>', logModificaLocale: (...args) => history.push(args),
    sb: { from(table) {
      return {
        select() { return { eq(column, id) { requests.push({ type: 'read', table, column, id }); return { single: async () => ({ data: { id, profilo: freshProfile } }) } } } },
        update(payload) {
          const request = { type: 'update', table, payload, filters: [] }; requests.push(request)
          const chain = {
            eq(column, value) { request.filters.push([column, value]); return chain },
            is(column, value) { request.filters.push([column, value]); return chain },
            select() { return chain },
            async single() {
              if (options.gate) await options.gate
              if (options.error) return { error: { message: 'Rete non disponibile' } }
              if (options.race) return { data: null }
              const id = request.filters.find(([column]) => column === 'id')[1]
              return { data: { id, profilo: payload.profilo } }
            }
          }; return chain
        }
      }
    } }
  })
  vm.runInContext(source, c)
  get('student-reminder-A'); get('student-reminder-B')
  return { c, get, requests, history, freshProfile }
}
function edit(f, text = 'Nuova nota') { f.c.editStudentLessonReminder('A'); f.c.setStudentLessonReminderDraft('A', text) }
test('read mode shows edit/add; editor preloads note and Cancel makes no requests', () => {
  const f = fixture()
  assert.match(f.c.renderStudentLessonReminder(f.c.allAllievi[0]), /Modifica promemoria/)
  assert.match(f.c.renderStudentLessonReminder(f.c.allAllievi[1]), /Aggiungi promemoria/)
  edit(f)
  assert.equal(f.c.studentLessonReminderEditors.A.original, 'Nota originale')
  f.c.cancelStudentLessonReminder('A')
  assert.equal(f.requests.length, 0)
  assert.match(f.get('student-reminder-A').innerHTML, /Nota originale/)
})
test('save updates only A, merges the current profile and applies compare-and-set', async () => {
  const f = fixture(); edit(f); await f.c.saveStudentLessonReminder('A')
  const write = f.requests.find(r => r.type === 'update')
  assert.equal(Object.keys(write.payload).join(','), 'profilo')
  assert.equal(write.payload.profilo.in_vacanza, true)
  assert.equal(write.payload.profilo.logistica_individuale.durata_lezione, 60)
  assert.equal(write.payload.profilo.other, 'preservare')
  assert.equal(write.payload.profilo.note_lezione, 'Nuova nota')
  assert.deepEqual(write.filters[0], ['id', 'A'])
  assert.deepEqual(write.filters[1], ['profilo', JSON.stringify(f.freshProfile)])
  assert.equal(f.c.allAllievi[1].profilo.note_lezione, undefined)
  assert.equal(f.c.studentLessonReminderEditors.A, undefined)
  assert.equal(f.history.length, 1)
})
test('failed and rejected concurrent updates preserve the typed draft and allow retry', async () => {
  for (const options of [{ error: true }, { race: true }]) {
    const f = fixture(options); edit(f, 'Testo da conservare'); await f.c.saveStudentLessonReminder('A')
    assert.equal(f.c.studentLessonReminderEditors.A.draft, 'Testo da conservare')
    assert.equal(f.c.studentLessonReminderEditors.A.saving, false)
    assert.ok(f.c.studentLessonReminderEditors.A.error)
    assert.match(f.get('student-reminder-A').innerHTML, /Testo da conservare/)
    assert.equal(f.c.allAllievi[0].profilo.note_lezione, 'Nota originale')
    assert.equal(f.history.length, 0)
  }
})
test('another writer changing the note is detected before any update', async () => {
  const f = fixture({ profile: { note_lezione: 'Nota modificata altrove' } }); edit(f)
  await f.c.saveStudentLessonReminder('A')
  assert.equal(f.requests.filter(r => r.type === 'update').length, 0)
  assert.match(f.c.studentLessonReminderEditors.A.error, /modificato altrove/)
  assert.equal(f.c.studentLessonReminderEditors.A.draft, 'Nuova nota')
})
test('clearing the note does not resurrect legacy aliases', async () => {
  const f = fixture({ profile: { note_lezione: 'Nota originale', promemoria_lezione: 'Vecchia nota' } }); edit(f, '')
  await f.c.saveStudentLessonReminder('A')
  assert.equal(f.c.studentLessonReminderValue(f.c.allAllievi[0]), '')
  assert.equal(f.c.allAllievi[0].profilo.promemoria_lezione, 'Vecchia nota')
  assert.match(f.get('student-reminder-A').innerHTML, /Aggiungi promemoria/)
})
test('empty notes on profiles without the canonical key still read historical aliases', () => {
  const f = fixture()
  assert.equal(f.c.studentLessonReminderValue({ profilo: { promemoria_lezione: 'Storica' } }), 'Storica')
  assert.equal(f.c.studentLessonReminderValue({ profilo: { note_lezione: null, promemoria_lezione: 'Storica' } }), '')
})
test('new profile uses an IS NULL comparison', async () => {
  const f = fixture({ profile: null }); edit(f); await f.c.saveStudentLessonReminder('A')
  assert.deepEqual(f.requests.find(r => r.type === 'update').filters[1], ['profilo', null])
})
test('no-op saving and repeated clicks never create unnecessary writes', async () => {
  const f = fixture(); edit(f, 'Nota originale'); await f.c.saveStudentLessonReminder('A')
  assert.equal(f.requests.length, 0)
  let release
  const gate = new Promise(resolve => { release = resolve })
  const pendingFixture = fixture({ gate }); edit(pendingFixture)
  const pending = pendingFixture.c.saveStudentLessonReminder('A')
  await Promise.resolve(); await Promise.resolve()
  await pendingFixture.c.saveStudentLessonReminder('A')
  pendingFixture.c.cancelStudentLessonReminder('A')
  assert.equal(pendingFixture.c.studentLessonReminderEditors.A.saving, true)
  release(); await pending
  assert.equal(pendingFixture.requests.filter(r => r.type === 'update').length, 1)
})
test('finishing A after navigating to B never replaces B or reopens A', async () => {
  let release
  const gate = new Promise(resolve => { release = resolve })
  const f = fixture({ gate }); edit(f)
  const pending = f.c.saveStudentLessonReminder('A')
  f.get('student-reminder-B').innerHTML = 'Scheda di Bea'
  release(); await pending
  assert.equal(f.get('student-reminder-B').innerHTML, 'Scheda di Bea')
  assert.equal(f.c.allAllievi[0].profilo.note_lezione, 'Nuova nota')
})
test('note text is escaped in both modes', () => {
  const f = fixture(); edit(f, '</textarea><img src=x onerror=alert(1)>')
  f.c.refreshStudentLessonReminder('A')
  assert.ok(!f.get('student-reminder-A').innerHTML.includes('<img'))
  assert.match(f.get('student-reminder-A').innerHTML, /&lt;img/)
})
