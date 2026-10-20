import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'
const editor = readFileSync(new URL('../src/skill-catalog-editor.js', import.meta.url), 'utf8')
function declaration(source, name) {
  const start = source.search(new RegExp('^(?:async )?function ' + name + '\\(', 'm'))
  assert.ok(start >= 0, name)
  const rest = source.slice(start), end = rest.slice(1).search(/^(?:async )?function /m)
  return end < 0 ? rest : rest.slice(0, end + 1)
}
function fixture(file = 'app.js', options = {}) {
  const source = readFileSync(new URL('../src/' + file, import.meta.url), 'utf8')
  const nodes = new Map()
  const get = id => {
    if (!nodes.has(id)) nodes.set(id, { value: '', checked: false, disabled: false, innerHTML: '', textContent: '', style: {}, classList: { toggle() {} }, focus() {} })
    return nodes.get(id)
  }
  const params = [{ dataset: { param: 'tempo' }, value: '' }]
  const requests = [], messages = []
  const skills = [{ id: 'A', nome: 'Uovo', ramo: 'Equilibrio', livello: 2, blocco: 'Base', open_closed: 'CLOSED', obbligatoria: true, descrizione: 'Descrizione originale\nVarianti: dx, sx.', e_bilaterale: true, lato_sx_nome: 'sinistra', param_tempo: 3 }, { id: 'B', nome: 'Macchinina', ramo: 'Equilibrio', livello: 1 }]
  const definition = { id: 42, skill_id: 'A', skill_nome: 'Uovo', e_variante: false, cosa_fa: 'Testo metodologico da conservare', prerequisiti: ['base'], stato: 'validata' }
  const context = vm.createContext({
    document: { getElementById: get, querySelectorAll: () => params },
    allSkills: skills, skillDefinitions: options.definition ? [definition] : [], skillCatalogContext: null,
    requestAnimationFrame: fn => fn(), TUNING_PARAMS: [],
    normalizeText: text => String(text || '').trim().toLowerCase(), esc: String,
    setSkillCatalogStatus: (text, kind) => messages.push({ text, kind }),
    setSkillDeleteWarning() {}, skillCatalogBranchOptions: branch => branch,
    refreshSkillVariantParentOptions() {}, toggleNewSkillVariantParent() {},
    renderSkillParamControls() {}, resetSkillParamControls() {},
    refreshSkillDeleteOptions: id => { get('skill-delete-select').value = id },
    refreshSkillCatalogConsumers: async () => {},
    salvaDefinizioneVarianteSkill: async () => true,
    sb: { from(table) { return { update(payload) { return { eq(column, id) { requests.push({ table, payload, column, id }); return { select() { return { single: async () => {
      if ((options.error && table === 'skills') || (options.errorDefinition && table === 'skill_definizioni')) return { error: { message: 'Permission denied' } }
      if (options.gate) await options.gate
      if (options.empty) return { data: null }
      return { data: { ...(table === 'skills' ? skills.find(s => s.id === id) : definition), ...payload } }
    } } } } } } } } } },
  })
  for (const name of ['splitVariantText', 'skillVariants', 'skillDefinitionForSkill', 'variantMotherSkillId', 'variantMotherName', 'openSkillCatalogModal', 'chiudiSkillCatalogModal', 'creaSkillCatalogo']) vm.runInContext(declaration(source, name), context)
  if (file.includes('legacy')) vm.runInContext(source.slice(0, source.indexOf('var _a, _b;')), context)
  vm.runInContext(editor, context)
  return { c: context, get, requests, messages, params, definition }
}
for (const file of ['app.js', 'app-legacy.js']) {
  test(file + ': detail opens an editor prefilled with the selected skill; switching and new mode reset it', () => {
    const f = fixture(file)
    f.c.openSkillCatalogModal('tree', null, 'A')
    assert.equal(f.get('skill-new-name').value, 'Uovo')
    assert.equal(f.get('skill-new-required').checked, true)
    assert.equal(f.params[0].value, '3')
    assert.equal(f.get('skill-new-description').value, 'Descrizione originale')
    assert.equal(f.get('btn-create-skill').textContent, 'Salva modifiche')
    f.c.selectSkillForCatalog('B')
    assert.equal(f.get('skill-new-name').value, 'Macchinina')
    assert.equal(f.get('skill-new-required').checked, false)
    f.c.openSkillCatalogModal('catalog')
    assert.equal(f.get('skill-new-name').value, '')
    assert.equal(f.get('btn-create-skill').textContent, 'Crea skill')
    assert.equal(f.c.skillCatalogContext.editingSkillId, null)
  })
  test(file + ': saving the same name updates by ID and preserves fields outside the editor', async () => {
    const f = fixture(file)
    f.c.openSkillCatalogModal('tree', null, 'A')
    f.get('skill-new-description').value = 'Descrizione modificata'
    f.params[0].value = ''
    await f.c.creaSkillCatalogo()
    assert.equal(f.requests.length, 1)
    assert.equal(f.requests[0].id, 'A')
    assert.equal(f.requests[0].column, 'id')
    assert.equal(f.requests[0].payload.param_tempo, null)
    assert.equal(Object.hasOwn(f.requests[0].payload, 'e_bilaterale'), false)
    assert.equal(f.c.allSkills[0].e_bilaterale, true)
    assert.equal(f.c.allSkills[0].lato_sx_nome, 'sinistra')
    assert.equal(f.c.allSkills.length, 2)
    assert.equal(f.messages.at(-1).kind, 'msg-ok')
  })
}
test('another skill name is rejected without database writes', async () => {
  const f = fixture(); f.c.openSkillCatalogModal('tree', null, 'A')
  f.get('skill-new-name').value = 'macchinina'
  await f.c.creaSkillCatalogo()
  assert.equal(f.requests.length, 0)
  assert.match(f.messages.at(-1).text, /già una skill/)
})
test('definition update preserves pedagogical content, prerequisites and review state', async () => {
  const f = fixture('app.js', { definition: true }); f.c.openSkillCatalogModal('tree', null, 'A')
  f.get('skill-new-name').value = 'Uovo nuovo'
  await f.c.creaSkillCatalogo()
  assert.equal(f.requests[1].table, 'skill_definizioni')
  assert.equal(f.requests[1].id, 42)
  for (const key of ['cosa_fa', 'prerequisiti', 'stato']) assert.equal(Object.hasOwn(f.requests[1].payload, key), false)
  assert.equal(f.c.skillDefinitions[0].cosa_fa, f.definition.cosa_fa)
})
test('denied or empty updates show an error and retain the original cache', async () => {
  for (const options of [{ error: true }, { empty: true }]) {
    const f = fixture('app.js', options); f.c.openSkillCatalogModal('tree', null, 'A')
    f.get('skill-new-name').value = 'Nuovo nome'
    await f.c.creaSkillCatalogo()
    assert.equal(f.c.allSkills[0].nome, 'Uovo')
    assert.equal(f.messages.at(-1).kind, 'msg-err')
    assert.equal(f.get('btn-create-skill').disabled, false)
  }
})
test('variant cannot refer to itself', async () => {
  const f = fixture(); f.c.openSkillCatalogModal('tree', null, 'A')
  f.get('skill-new-is-variant').checked = true; f.get('skill-new-variant-parent').value = 'A'
  await f.c.creaSkillCatalogo()
  assert.equal(f.requests.length, 0)
  assert.match(f.messages.at(-1).text, /diversa/)
})

test('a second save and switching skill are blocked while the first request is pending', async () => {
  let release
  const gate = new Promise(resolve => { release = resolve })
  const f = fixture('app.js', { gate }); f.c.openSkillCatalogModal('tree', null, 'A')
  const pending = f.c.creaSkillCatalogo()
  await f.c.creaSkillCatalogo()
  f.c.selectSkillForCatalog('B')
  f.c.chiudiSkillCatalogModal()
  assert.equal(f.requests.length, 1)
  assert.equal(f.c.skillCatalogContext.editingSkillId, 'A')
  release(); await pending
  assert.equal(f.c.skillCatalogContext.saving, false)
})
test('a definition failure is reported as partial success, not a completed save', async () => {
  const f = fixture('app.js', { definition: true, errorDefinition: true })
  f.c.openSkillCatalogModal('tree', null, 'A')
  f.get('skill-new-name').value = 'Uovo aggiornato'
  await f.c.creaSkillCatalogo()
  assert.equal(f.c.allSkills[0].nome, 'Uovo aggiornato')
  assert.equal(f.c.skillDefinitions[0].skill_nome, 'Uovo')
  assert.equal(f.messages.at(-1).kind, 'msg-err')
  assert.match(f.messages.at(-1).text, /Skill aggiornata, ma completamento non riuscito/)
})
