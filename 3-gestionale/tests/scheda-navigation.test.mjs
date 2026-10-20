import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'

const source = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8')
function declaration(name, input = source) {
  const start = input.search(new RegExp(`^(?:async )?function ${name}\\(`, 'm'))
  assert.ok(start >= 0, `Missing ${name}`)
  const rest = input.slice(start)
  const end = rest.slice(1).search(/^(?:async )?function /m)
  return end < 0 ? rest : rest.slice(0, end + 1)
}

function deferred() {
  let resolve
  const promise = new Promise(done => { resolve = done })
  return { promise, resolve }
}

function fixture(legacy = false) {
  const input = legacy ? readFileSync(new URL('../src/app-legacy.js', import.meta.url), 'utf8') : source
  const elements = new Map()
  const requests = []
  const listeners = new Map()
  const context = vm.createContext({
    console,
    window: { addEventListener: (name, callback) => listeners.set(name, callback) },
    APP_HISTORY_KEY: 'blading-manager-view',
    document: {
      body: { dataset: {}, classList: { toggle() {} } },
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, { hidden: true, innerHTML: '', classList: { toggle() {} } })
        return elements.get(id)
      },
    },
    allAllievi: ['A', 'B'].map(id => ({ id, nome: `Allievo ${id}`, cognome: 'Test', profilo: {} })),
    allSkills: [], currentSchedaId: null, schedaLoadVersion: 0,
    godMode: false, appHistoryStarted: true, appHistoryApplying: false,
    editReturnTarget: null,
    currentReturnTarget: () => null,
    syncNavActive() {}, recordAppHistory() {},
    requestAnimationFrame: callback => callback(), motion: { view() {}, cards() {} },
    sb: { from(table) { return { select() { return { eq(field, id) {
      const pending = deferred()
      requests.push({ table, id, ...pending })
      return pending.promise
    } } } } } },
    isFakieSkillName: () => false,
    fakieProgressMapForAllievo: () => ({}),
    isMissingLessonMeteoError: () => false,
    isMissingDimensioniError: () => false,
    isMissingNoteSpecialiError: () => false,
    renderLezioniTable: () => '',
    logisticaIndividualeProfilo: () => ({}),
    visibleAllievoAddress: () => ({}), allievoEtaLabel: () => '',
    allievoTier: () => 'C', vacationLabel: () => '',
    allievoLessonNote: () => '', esc: value => String(value ?? ''),
    vacationIconHtml: () => '', editIcon: () => '', canShareAllievo: () => false,
    allievoUpdatedAt: () => null, allievoInVacanzaDiretta: () => false,
    allievoDisplayName: id => `Allievo ${id}`, jsArg: JSON.stringify,
    parseMapCoordinate: () => null, renderSkillTree: () => '',
  })
  vm.runInContext(readFileSync(new URL('../src/birthday-reminders.js', import.meta.url), 'utf8'), context)
  if (legacy) vm.runInContext(input.slice(0, input.indexOf('var _a, _b;')), context)
  vm.runInContext(declaration('showView', input) + declaration('loadScheda', input) + (legacy ? '' : declaration('toggleVacanzaAllievo')), context)
  const popstateStart = input.search(/window.addEventListener\(['"]popstate['"],/)
  const popstateEnd = input.slice(popstateStart + 1).search(/window.addEventListener\(/) + popstateStart + 1
  vm.runInContext(input.slice(popstateStart, popstateEnd), context)
  context.document.getElementById('screen-app').hidden = false
  const content = () => elements.get('scheda-content').innerHTML
  const finish = (id, withLessons = false) => {
    requests.filter(r => r.id === id).forEach(r => r.resolve({ data: withLessons && r.table === 'lezioni_allievi' ? [{ lezione_id: 'L' }] : [] }))
  }
  const back = (name, id = null) => listeners.get('popstate')({ state: { app: context.APP_HISTORY_KEY, name, id } })
  return { context, requests, content, finish, back }
}

test('a slower previous student cannot replace the current student or their action buttons', async () => {
  const f = fixture()
  const a = f.context.loadScheda('A')
  const b = f.context.loadScheda('B')
  f.finish('B'); await b
  assert.match(f.content(), /toggleVacanzaAllievo\('B'\)/)
  f.finish('A'); await a
  assert.match(f.content(), /Allievo B/)
  assert.doesNotMatch(f.content(), /toggleVacanzaAllievo\('A'\)/)
})

test('leaving a loading student invalidates the response', async () => {
  const f = fixture()
  const a = f.context.loadScheda('A')
  f.context.showView('allievi')
  f.finish('A'); await a
  assert.doesNotMatch(f.content(), /toggleVacanzaAllievo/)
})

test('a late lesson response cannot replace another student', async () => {
  const f = fixture()
  const a = f.context.loadScheda('A')
  f.finish('A', true)
  await new Promise(resolve => setImmediate(resolve))
  const b = f.context.loadScheda('B')
  f.finish('B'); await b
  f.finish('A'); await a
  assert.match(f.content(), /Allievo B/)
  assert.doesNotMatch(f.content(), /toggleVacanzaAllievo\('A'\)/)
})

test('returning to A does not accept the obsolete A response from before leaving', async () => {
  const f = fixture()
  const first = f.context.loadScheda('A')
  const oldRequests = [...f.requests]
  f.context.showView('allievi')
  const current = f.context.loadScheda('A')
  oldRequests.forEach(request => request.resolve({ data: [] }))
  await first
  assert.doesNotMatch(f.content(), /toggleVacanzaAllievo/)
  f.finish('A'); await current
  assert.match(f.content(), /toggleVacanzaAllievo\('A'\)/)
})

for (const destination of ['allievi', 'scheda']) {
  test(`finishing vacation for A after navigating to ${destination} keeps the destination and updates only A`, async () => {
    const f = fixture()
    const write = deferred()
    const writes = []
    Object.assign(f.context, {
      confirm: () => true,
      logModificaLocale() {}, renderAllievi() {},
      alert: message => assert.fail(message),
    })
    f.context.showView('scheda')
    f.context.currentSchedaId = 'A'
    const reads = f.context.sb
    f.context.sb = { from(table) { return { update(payload) { return { eq(field, id) {
      writes.push({ table, field, id, payload })
      return { select() { return { single: () => write.promise } } }
    } } } } } }
    const saving = f.context.toggleVacanzaAllievo('A')
    f.context.sb = reads
    f.back(destination, destination === 'scheda' ? 'B' : null)
    if (destination === 'scheda') {
      f.finish('B')
      await new Promise(resolve => setImmediate(resolve))
    }
    write.resolve({ data: { ...f.context.allAllievi[0], profilo: { in_vacanza: true } } })
    await saving
    assert.equal(writes.length, 1)
    assert.equal(writes[0].id, 'A')
    assert.equal(writes[0].payload.profilo.in_vacanza, true)
    assert.equal(f.context.allAllievi[1].profilo.in_vacanza, undefined)
    assert.equal(f.context.document.body.dataset.view, destination)
    if (destination === 'scheda') {
      assert.equal(f.context.currentSchedaId, 'B')
      assert.match(f.content(), /toggleVacanzaAllievo\('B'\)/)
    }
    assert.equal(f.requests.filter(request => request.id === 'A').length, 0)
  })
}

test('a missing student exposes no previous student action buttons', async () => {
  const f = fixture()
  const a = f.context.loadScheda('A')
  f.finish('A'); await a
  await f.context.loadScheda('missing')
  assert.doesNotMatch(f.content(), /toggleVacanzaAllievo/)
  assert.match(f.content(), /Allievo non disponibile/)
})

test('legacy: late student and lesson responses cannot replace the student selected with Back', async () => {
  for (const withLessons of [false, true]) {
    const f = fixture(true)
    const a = f.context.loadScheda('A')
    if (withLessons) {
      f.finish('A', true)
      await new Promise(resolve => setImmediate(resolve))
    }
    f.back('scheda', 'B')
    f.finish('B')
    await new Promise(resolve => setImmediate(resolve))
    f.finish('A'); await a
    assert.equal(f.context.currentSchedaId, 'B')
    assert.match(f.content(), /showView\('nuovo-allievo','B'\)/)
    assert.doesNotMatch(f.content(), /showView\('nuovo-allievo','A'\)/)
  }
})
