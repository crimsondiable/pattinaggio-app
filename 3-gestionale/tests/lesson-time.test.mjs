import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'

function declaration(source, name) {
  const start = source.search(new RegExp('^(?:async )?function ' + name + '\\(', 'm'))
  assert.ok(start >= 0, name)
  const rest = source.slice(start)
  const end = rest.slice(1).search(/^(?:async )?function /m)
  return end < 0 ? rest : rest.slice(0, end + 1)
}

for (const file of ['app.js', 'app-legacy.js']) {
  const source = readFileSync(new URL('../src/' + file, import.meta.url), 'utf8')
  function fixture(value, badInput = false) {
    const messages = []
    let focused = false
    const hour = { value, validity: { badInput }, focus() { focused = true } }
    const context = vm.createContext({
      document: { getElementById(id) {
        if (id === 'lz-ora') return hour
        return { value: '' }
      } },
      clearLezioneFormMessage() { messages.length = 0 },
      setLezioneFormMessage(message) { messages.push(message) },
      formatDate: () => '20/10/2026', lezioniDettagliEspansi: false,
      labelPartecipantiLezione: () => 'Allievo di prova',
      renderSkillChipsLezione: () => '', esc: x => String(x ?? ''), jsArg: JSON.stringify,
    })
    if (file.includes('legacy')) vm.runInContext(source.slice(0, source.indexOf('var _a, _b;')), context)
    for (const name of ['lessonStatus', 'splitLessonNotes', 'composeLessonNotes', 'normalizeLessonTime', 'lessonParsedNotes', 'lessonTime', 'formatLessonDate', 'lessonSpecialNotes', 'lessonColumnCell', 'renderLezioneListaRow', 'salvaLezione']) {
      vm.runInContext(declaration(source, name), context)
    }
    return { context, messages, focused: () => focused }
  }

  test(file + ': invalid or incomplete time stops saving and focuses the field', async () => {
    for (const raw of ['14:', '2', '25:00', '12:60', '2:30 PM']) {
      const f = fixture(raw)
      await f.context.salvaLezione()
      assert.match(f.messages[0], /24 ore/)
      assert.ok(f.focused())
    }
    const f = fixture('', true)
    await f.context.salvaLezione()
    assert.match(f.messages[0], /24 ore/)
    assert.ok(f.focused())
  })

  test(file + ': valid and optional empty hours pass time validation', async () => {
    for (const raw of ['', '00:00', '9:30', '1430', '23:59']) {
      const f = fixture(raw)
      await f.context.salvaLezione()
      assert.equal(f.messages[0], 'Inserisci la data.')
      assert.equal(f.focused(), false)
    }
  })

  test(file + ': saved hours survive reload and appear in both lesson lists', () => {
    const { context: c } = fixture('')
    for (const [raw, expected] of [['00:00', '00:00'], ['930', '09:30'], ['1430', '14:30'], ['23:59', '23:59']]) {
      const saved = { id: 'test-only', data: '2026-10-20', note: c.composeLessonNotes('Nota di prova', '', '', '', 'aperta', '', raw) }
      const loaded = JSON.parse(JSON.stringify(saved))
      assert.equal(c.lessonTime(loaded), expected)
      assert.ok(c.renderLezioneListaRow(loaded).includes('20/10/2026 · ' + expected))
      assert.ok(c.renderLezioneListaRow(loaded, { variant: 'scheda', schedaId: 'synthetic' }).includes('20/10/2026 · ' + expected))
    }
  })
}
