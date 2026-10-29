import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'

function declaration(source, name) {
  const start = source.search(new RegExp('^(?:async )?function ' + name + '\\(', 'm'))
  assert.ok(start >= 0, name)
  const rest = source.slice(start), end = rest.slice(1).search(/^(?:async )?function /m)
  return end < 0 ? rest : rest.slice(0, end + 1)
}
const fixtureStudents = () => [
  { id: 'A', nome: 'ClassOnlyAnna', cognome: 'Test', gruppo: 'Budosan prova', solo_gruppo: true, stato: 'attivo', profilo: { appuntamenti_individuali_attivi: true } },
  { id: 'B', nome: 'ClassOnlyBea', cognome: 'Test', gruppo: 'Budosan prova', solo_gruppo: true, stato: 'attivo' },
  { id: 'C', nome: 'CarloCabisto', cognome: 'Test', gruppo: 'Fratelli prova', stato: 'attivo', profilo: { appuntamenti_individuali_attivi: true } },
  { id: 'D', nome: 'DinaCabisto', cognome: 'Test', gruppo: 'Fratelli prova', stato: 'attivo', profilo: { appuntamenti_individuali_attivi: true } },
  { id: 'E', nome: 'ElenaPrivata', cognome: 'Test', gruppo: null, stato: 'attivo' },
]
function fixture(file) {
  const source = readFileSync(new URL('../src/' + file, import.meta.url), 'utf8')
  const elements = new Map(), students = fixtureStudents(), messages = [], writes = []
  const get = id => {
    if (!elements.has(id)) elements.set(id, { value: '', options: [], innerHTML: '', dataset: {}, hidden: false, classList: { remove() {}, toggle() {} } })
    return elements.get(id)
  }
  const c = vm.createContext({ console, window: {},
    document: { getElementById: get, querySelectorAll: () => [{ value: 'A' }] },
    allAllievi: students, allieviVisibiliGod: () => students, currentUid: 'teacher',
    filtroListaAllievi: 'tutti', gruppiEspansi: new Set(['Budosan prova', 'Fratelli prova']),
    renderDashboard() {}, requestAnimationFrame: cb => cb(), motion: { tableRows() {} },
    allievoTier: () => 'C', allievoTierListLabel: () => 'C', allievoInVacanza: () => false,
    gruppoInVacanza: () => false, allievoEtaLabel: () => '', vacationIconHtml: () => '',
    renderAllievoActionMenu: () => '', renderGruppoActionMenu: () => '',
    studentAvatarHtml: () => '', ordinaAllieviLista: a => a, esc: String, jsArg: JSON.stringify,
    lezioniCache: [], allievoById: id => students.find(a => a.id === id),
    activeAppointmentAllievi: () => students, appointmentGroupTargetValue: name => 'group:' + name,
    APPOINTMENT_GROUP_TARGET_PREFIX: 'group:',
    clearLezioneFormMessage() { messages.length = 0 }, setLezioneFormMessage: text => messages.push(text),
    normalizeLessonTime: () => '', composeLessonNotes: () => '',
    sb: { from(table) { return { update(payload) { const r = { table, payload }; writes.push(r); return {
      eq(key, value) { r.filter = [key, value]; return this }, async select() {
        return { data: students.filter(a => a.gruppo === r.filter[1]).map(a => ({ id: a.id, solo_gruppo: payload.solo_gruppo })) }
      }
    } } } } },
  })
  if (file.includes('legacy')) vm.runInContext(source.slice(0, source.indexOf('var _a, _b;')), c)
  for (const name of ['allievoSoloGruppo','gruppoSoloGruppo','lezionePresetPerAllievo','saveGroupOnlyRule',
    'groupRowInVacanza','allieviGroupNamesForCurrentMode','renderAllievi','allieviSelezionabiliLezione',
    'lezioneTargetLabelAllievo','gruppiSelezionabiliLezione','renderLezioneTargetOptions',
    'lessonAllievoIds','allievoHasIndividualLessonHistory','appointmentIndividualLessonsActiveForAllievo',
    'appointmentTargetIsGroup','appointmentGroupFromTarget','appointmentGroupMembers','appointmentTargetExists',
    'appointmentGroups','availabilityTargetOptions','salvaLezione']) vm.runInContext(declaration(source,name),c)
  return { c, get, students, messages, writes }
}
for (const file of ['app.js','app-legacy.js']) {
  test(file + ': Tutti shows the class once, never flattens its students, and keeps mixed members', () => {
    const f = fixture(file); f.c.renderAllievi()
    const html = f.get('allievi-content').innerHTML
    assert.ok(html.includes('Budosan prova')); assert.ok(!html.includes('Solo gruppo'))
    for (const name of ['ClassOnlyAnna','ClassOnlyBea']) assert.ok(!html.includes(name))
    for (const name of ['CarloCabisto','DinaCabisto','ElenaPrivata']) assert.ok(html.includes(name))
  })
  test(file + ': Attivi keeps class collapsed even after expand-all, mixed group can expand', () => {
    const f=fixture(file); f.c.filtroListaAllievi='attivi'; f.c.renderAllievi()
    const html=f.get('allievi-content').innerHTML
    assert.ok(!html.includes('ClassOnlyAnna')); assert.ok(html.includes('CarloCabisto'))
    assert.deepEqual(Array.from(f.c.allieviGroupNamesForCurrentMode()),['Fratelli prova'])
  })
  test(file + ': individual lesson options omit class-only students; class roster stays available', () => {
    const f=fixture(file); f.c.renderLezioneTargetOptions()
    const html=f.get('lz-tipo').innerHTML
    assert.ok(!html.includes('allievo:A')); assert.ok(html.includes('allievo:C'))
    assert.ok(html.includes('gruppo:Budosan prova')); assert.equal(f.c.allieviSelezionabiliLezione().length,5)
  })
  test(file + ': class constraint overrides old individual preference and history, mixed students retain both', () => {
    const f=fixture(file)
    f.c.lezioniCache=[{tipo:'individuale',lezioni_allievi:[{allievo_id:'A'}]}]
    assert.equal(f.c.appointmentIndividualLessonsActiveForAllievo(f.students[0]),false)
    assert.equal(f.c.appointmentIndividualLessonsActiveForAllievo(f.students[2]),true)
    assert.equal(f.c.lezionePresetPerAllievo(f.students[0]),'gruppo:Budosan prova')
    assert.equal(f.c.lezionePresetPerAllievo(f.students[2]),'modo:prep:C')
  })
  test(file + ': availability options and stale individual targets respect class constraint', () => {
    const f=fixture(file); const html=f.c.availabilityTargetOptions()
    assert.ok(!html.includes('value="A"')); assert.ok(html.includes('value="C"'))
    assert.ok(html.includes('group:Budosan prova'))
    assert.equal(f.c.appointmentTargetExists('A'),false); assert.equal(f.c.appointmentTargetExists('C'),true)
    assert.equal(f.c.appointmentTargetExists('group:Budosan prova'),true)
  })
  test(file + ': individual saving stops before any write when a stale roster includes a class student', async () => {
    const f=fixture(file); f.get('lz-data').value='2026-10-29'; f.get('lz-tipo').value='allievo:A'
    await f.c.salvaLezione()
    assert.match(f.messages[0],/solo a lezioni di gruppo/); assert.equal(f.writes.length,0)
  })
  test(file + ': the group rule is saved for all members in one filtered update and is reversible', async () => {
    const f=fixture(file); await f.c.saveGroupOnlyRule('Budosan prova',false)
    assert.equal(f.writes.length,1); assert.equal(f.writes[0].payload.solo_gruppo,false)
    assert.equal(f.students[0].solo_gruppo,false); assert.equal(f.students[1].solo_gruppo,false)
    assert.equal(f.students[2].solo_gruppo,undefined)
    await f.c.saveGroupOnlyRule('Budosan prova',true)
    assert.equal(f.students[0].solo_gruppo,true)
  })
}
