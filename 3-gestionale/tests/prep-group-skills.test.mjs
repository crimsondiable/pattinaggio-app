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
function fixture(file, mode) {
  const source = readFileSync(new URL('../src/' + file, import.meta.url), 'utf8')
  const elements = new Map()
  const get = id => {
    if (!elements.has(id)) elements.set(id, { value: '', innerHTML: '', hidden: false, classList: { remove() {} } })
    return elements.get(id)
  }
  let selected = []
  const context = vm.createContext({
    document: { getElementById: get },
    lezioneFormMode: mode, lezionePresetAllievoId: null,
    GROUP_SKILL_ROWS_KEY: '__group__', FREE_LESSON_SKILL_ROWS_KEY: '__free__',
    editingLezioneSkillRows: {},
    allieviSelezionabiliLezione: () => [{ id: 'A', gruppo: 'Gruppo prova' }, { id: 'B', gruppo: 'Gruppo prova' }],
    selectedLezioneAllieviIds: () => selected,
    setLezioneAllievi(ids) { selected = ids; get('lz-skills-container').innerHTML = '' },
    renderGroupLessonPanel() {}, renderGroupIndividualControls() {},
    renderLessonStudentNotes() {}, renderSpecialGuestPanel() {}, renderPrepBoard() {},
    refreshSuggerimentiLuogoSeAperti() {}, applyDefaultLessonLocationFromTarget() {},
    renderLezioneLocationSelect() {}, aggiungiSkillRow() {}, addIndividualSkillWork() {},
    esc: String, jsArg: JSON.stringify, ripassoPanelId: id => 'ripasso-' + id,
  })
  for (const name of ['renderLezionePartecipanti', 'renderGroupSkillWorkspace', 'renderFreeLessonSkillWorkspace', 'renderLessonWorkButtons']) {
    vm.runInContext(declaration(source, name), context)
  }
  return { context, get }
}
for (const file of ['app.js', 'app-legacy.js']) {
  for (const mode of ['prep', 'standard']) {
    test(file + ': free lesson to group retains skill controls in ' + mode + ' mode', () => {
      const { context: c, get } = fixture(file, mode)
      for (const target of ['campo_libero', 'gruppo:Gruppo prova', 'campo_libero', 'gruppo:Gruppo prova']) {
        get('lz-tipo').value = target
        c.renderLezionePartecipanti()
        const html = get('lz-skills-container').innerHTML
        for (const label of ['+ Nuova skill', '+ Nuovo esercizio', '+ Nuovo percorso']) assert.ok(html.includes(label), target + ': ' + label)
        if (target.startsWith('gruppo:')) {
          assert.ok(html.includes('Lavoro di gruppo'))
          assert.ok(html.includes('Ripasso'))
          assert.ok(html.includes('skill-rows-__group__'))
        }
      }
    })
  }
}
