// Shared by the modern app and the legacy fallback. No database writes on opening.
function skillCatalogIsSaving() {
  return !!(skillCatalogContext && skillCatalogContext.saving);
}

function selectSkillForCatalog(skillId) {
  if (skillCatalogIsSaving()) return;
  var skill = allSkills.find(function (row) { return String(row.id) === String(skillId); });
  if (!skillCatalogContext) skillCatalogContext = {};
  skillCatalogContext.editingSkillId = skill ? skill.id : null;
  var def = skill ? skillDefinitionForSkill(skill) : null;
  var parentId = def && def.e_variante ? variantMotherSkillId(def) : '';
  if (!parentId && def && def.e_variante) {
    var parent = allSkills.find(function (row) { return normalizeText(row.nome) === normalizeText(variantMotherName(def)); });
    parentId = parent ? parent.id : '';
  }
  document.getElementById('skill-delete-select').value = skill ? skill.id : '';
  document.getElementById('skill-new-name').value = skill ? skill.nome : '';
  document.getElementById('skill-new-branch').innerHTML = skillCatalogBranchOptions(skill ? skill.ramo : 'Equilibrio');
  document.getElementById('skill-new-level').value = String(skill ? skill.livello || 1 : 1);
  document.getElementById('skill-new-block').value = skill ? skill.blocco || 'Base' : 'Base';
  document.getElementById('skill-new-open-closed').value = skill ? String(skill.open_closed || '').trim().toUpperCase() : 'OPEN';
  document.getElementById('skill-new-required').checked = !!(skill && skill.obbligatoria);
  document.getElementById('skill-new-description').value = skill ? String(skill.descrizione || '').replace(/(^|\n)Varianti:\s*[^\n]*/gi, '').trim() : '';
  document.getElementById('skill-new-variants').value = skill ? skillVariants(skill).join('\n') : '';
  document.getElementById('skill-new-is-variant').checked = !!(def && def.e_variante);
  refreshSkillVariantParentOptions(parentId || '');
  document.getElementById('skill-new-variant-parent').value = parentId || '';
  toggleNewSkillVariantParent();
  document.querySelectorAll('.skill-new-param[data-param]').forEach(function (select) {
    var value = skill && skill['param_' + select.dataset.param];
    select.value = value == null ? '' : String(value);
  });
  document.getElementById('skill-catalog-mode').textContent = skill ? 'Modifica skill' : 'Nuova skill';
  document.getElementById('btn-create-skill').textContent = skill ? 'Salva modifiche' : 'Crea skill';
  setSkillDeleteWarning('');
  setSkillCatalogStatus('');
}

function aggiornaSkillCatalogo() {
  if (skillCatalogIsSaving()) return Promise.resolve();
  var id = skillCatalogContext && skillCatalogContext.editingSkillId;
  var original = allSkills.find(function (row) { return String(row.id) === String(id); });
  if (!original) { setSkillCatalogStatus('La skill non è più disponibile. Riapri il catalogo.', 'msg-err'); return Promise.resolve(); }
  var value = function (name) { return String(document.getElementById(name).value || '').trim(); };
  var nome = value('skill-new-name');
  var level = Number(value('skill-new-level'));
  if (!nome) { setSkillCatalogStatus('Inserisci il nome della skill.', 'msg-err'); return Promise.resolve(); }
  if (allSkills.some(function (row) { return String(row.id) !== String(id) && normalizeText(row.nome) === normalizeText(nome); })) {
    setSkillCatalogStatus('Esiste già una skill con questo nome.', 'msg-err'); return Promise.resolve();
  }
  if (!Number.isInteger(level) || level < 1 || level > 10) {
    setSkillCatalogStatus('Inserisci un livello da 1 a 10.', 'msg-err'); return Promise.resolve();
  }
  var isVariant = document.getElementById('skill-new-is-variant').checked;
  var parentId = value('skill-new-variant-parent');
  var parent = allSkills.find(function (row) { return String(row.id) === String(parentId); });
  if (isVariant && (!parent || String(parent.id) === String(id))) {
    setSkillCatalogStatus('Scegli una skill madre diversa dalla skill che stai modificando.', 'msg-err'); return Promise.resolve();
  }
  var variants = splitVariantText(value('skill-new-variants'));
  var description = [value('skill-new-description'), variants.length ? 'Varianti: ' + variants.join(', ') + '.' : ''].filter(Boolean).join('\n');
  var payload = {
    nome: nome, ramo: value('skill-new-branch'), livello: level,
    blocco: value('skill-new-block'), open_closed: value('skill-new-open-closed') || null,
    obbligatoria: document.getElementById('skill-new-required').checked,
    descrizione: description || null
  };
  // Fields unrelated to this form (bilaterality, sides, type, prerequisites) stay untouched.
  if (Array.isArray(original.varianti)) payload.varianti = variants;
  document.querySelectorAll('.skill-new-param[data-param]').forEach(function (select) {
    var key = 'param_' + select.dataset.param;
    if (select.value || Object.prototype.hasOwnProperty.call(original, key)) payload[key] = select.value ? Number(select.value) : null;
  });
  var definition = skillDefinitionForSkill(original);
  var context = skillCatalogContext;
  context.saving = true;
  var controls = ['btn-create-skill', 'skill-delete-select', 'skill-catalog-new'];
  controls.forEach(function (key) { document.getElementById(key).disabled = true; });
  document.getElementById('btn-create-skill').textContent = 'Salvataggio…';
  setSkillCatalogStatus('');
  var saved = false;
  return sb.from('skills').update(payload).eq('id', id).select('*').single().then(function (result) {
    if (result.error) throw result.error;
    if (!result.data || String(result.data.id) !== String(id)) throw new Error('La modifica non è stata confermata dal database.');
    var updated = result.data;
    saved = true;
    allSkills = allSkills.map(function (row) { return String(row.id) === String(id) ? updated : row; });
    // Update only linkage/identity fields; retain the full methodological definition.
    if (definition) {
      var patch = {
        skill_id: id, skill_nome: updated.nome, ramo: updated.ramo,
        fascia_livello: updated.blocco, livello_num: updated.livello,
        e_variante: isVariant, variante_di: isVariant ? parent.nome : null,
        variante_match: isVariant ? { skill_id: parent.id, skill_nome: parent.nome } : null
      };
      if (JSON.stringify(variants) !== JSON.stringify(skillVariants(original))) patch.varianti = variants;
      return sb.from('skill_definizioni').update(patch).eq('id', definition.id).select('*').single().then(function (result) {
        if (result.error) throw result.error;
        if (!result.data) throw new Error('Aggiornamento della definizione non confermato.');
        skillDefinitions = skillDefinitions.map(function (row) { return String(row.id) === String(definition.id) ? result.data : row; });
      });
    }
    if (isVariant) return salvaDefinizioneVarianteSkill(updated, parent, variants).then(function (ok) {
      if (!ok) throw new Error('Relazione variante non salvata.');
    });
  }).then(function () {
    return refreshSkillCatalogConsumers();
  }).then(function () {
    document.getElementById('skill-delete-select').value = id;
    setSkillCatalogStatus('Skill "' + nome + '" aggiornata.', 'msg-ok');
  }).catch(function (error) {
    setSkillCatalogStatus((saved ? 'Skill aggiornata, ma completamento non riuscito: ' : '') + (error.message || 'Errore durante la modifica.'), 'msg-err');
  }).then(function () {
    context.saving = false;
    controls.forEach(function (key) { document.getElementById(key).disabled = false; });
    document.getElementById('skill-delete-select').value = id;
    document.getElementById('btn-create-skill').textContent = 'Salva modifiche';
  });
}
