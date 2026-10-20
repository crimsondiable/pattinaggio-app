import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'
const source = readFileSync(new URL('../src/birthday-reminders.js', import.meta.url), 'utf8')
function fixture() {
  const panel = { innerHTML: '', hidden: true }
  let selected = []
  const students = [{ id: 'today', nome: 'Anna', data_nascita: '2000-10-20' }, { id: 'future', nome: 'Bea', data_nascita: '2010-11-03' }]
  const c = vm.createContext({ Date, document: { getElementById: () => panel }, selectedLezioneAllieviIds: () => selected, allievoById: id => students.find(s => s.id === id) })
  vm.runInContext(source, c)
  return { c, panel, students, select: ids => { selected = ids } }
}
const today = new Date(2026, 9, 20, 23, 59)
test('includes today through day 14, sorts by proximity and excludes day 15', () => {
  const { c, students } = fixture()
  const result = c.upcomingBirthdays([students[1], { id: 'late', data_nascita: '2001-11-04' }, students[0]], today)
  assert.deepEqual(Array.from(result, r => [r.student.id, r.days]), [['today', 0], ['future', 14]])
})
test('wraps correctly across New Year and ignores the birth year when finding the anniversary', () => {
  const { c } = fixture()
  const result = c.upcomingBirthdays([{ id: 'A', data_nascita: '2000-01-02' }], new Date(2026, 11, 30))
  assert.equal(result[0].days, 3)
})
test('calendar days stay correct across daylight-saving changes', () => {
  const { c } = fixture()
  assert.equal(c.upcomingBirthdays([{ data_nascita: '2000-10-26' }], new Date(2026, 9, 24, 23, 59))[0].days, 2)
})
test('invalid, absent, future birth dates, archived students and associations are excluded', () => {
  const { c } = fixture()
  const invalid = [null, {}, { data_nascita: '2001-02-29' }, { data_nascita: 'bad' }, { data_nascita: '2030-10-20' }, { data_nascita: '2000-10-20', stato: 'archiviato' }, { data_nascita: '2000-10-20', tipo: 'associazione' }]
  assert.equal(c.upcomingBirthdays(invalid, today).length, 0)
})
test('29 February uses an explicit advance reminder on 28 February in non-leap years', () => {
  const { c } = fixture()
  const student = { data_nascita: '2000-02-29', nome: 'Test' }
  assert.equal(c.upcomingBirthdays([student], new Date(2027, 1, 28))[0].days, 0)
  assert.match(c.renderBirthdayReminders([student], { now: new Date(2027, 1, 28) }), /anticipato al 28\/02/)
  assert.equal(c.upcomingBirthdays([student], new Date(2028, 1, 28))[0].days, 1)
})
test('duplicate participants appear once and output escapes names and IDs', () => {
  const { c } = fixture()
  const student = { id: 'A"\'&', nome: '<img src=x>', data_nascita: '2000-10-20' }
  const html = c.renderBirthdayReminders([student, student], { now: today })
  assert.equal((html.match(/class="birthday-reminder is-today"/g) || []).length, 1)
  assert.ok(html.includes('&lt;img src=x&gt;'))
  assert.ok(!html.includes('<img src=x>'))
  assert.match(html, /Compleanno oggi/)
  assert.ok(!html.includes('2000'))
})
test('student card can show the reminder without a link and empty lists add no panel', () => {
  const { c, students } = fixture()
  assert.ok(!c.renderBirthdayReminders(students, { now: today, links: false }).includes('onclick'))
  assert.equal(c.renderBirthdayReminders([], { now: today }), '')
})
test('lesson panel follows current participants and clears when none remain', () => {
  const f = fixture()
  // Use a birth date matching the runtime day to keep the rendering hook realistic.
  const date = new Date()
  f.students[0].data_nascita = '2000-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
  f.select(['today']); f.c.renderLessonBirthdayReminders()
  assert.equal(f.panel.hidden, false)
  assert.match(f.panel.innerHTML, /Anna/)
  assert.ok(!f.panel.innerHTML.includes('Bea'))
  f.select([]); f.c.renderLessonBirthdayReminders()
  assert.equal(f.panel.hidden, true)
  assert.equal(f.panel.innerHTML, '')
})
