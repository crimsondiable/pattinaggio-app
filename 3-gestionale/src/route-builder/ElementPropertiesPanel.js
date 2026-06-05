(function () {
  'use strict'

  class ElementPropertiesPanel {
    constructor(root, options = {}) {
      this.root = root
      this.onChange = options.onChange || function () {}
      this.onDuplicate = options.onDuplicate || function () {}
      this.onDelete = options.onDelete || function () {}
      this.onRotate = options.onRotate || function () {}
      this.route = null
      this.selectedId = null
      this.skillOptions = []
    }

    setState(route, selectedId, skillOptions = []) {
      this.route = route
      this.selectedId = selectedId
      this.skillOptions = skillOptions
      this.render()
    }

    render() {
      const element = this.route?.elements.find(item => item.id === this.selectedId)
      if (!element) {
        this.root.innerHTML = `
          <div class="route-panel-head">
            <h3>Proprieta</h3>
            <span>${this.route?.elements.length || 0}</span>
          </div>
          <div class="route-empty-panel">
            <strong>Nessun elemento selezionato</strong>
            <span>${this.route?.elements.length || 0} elementi nel percorso</span>
          </div>
        `
        return
      }

      const def = window.RouteModels.getElementType(element.type)
      const variants = (def.variants || [def.defaultVariant]).map(variant => `
        <option value="${variant}" ${variant === element.variant ? 'selected' : ''}>${variant}</option>
      `).join('')
      const types = window.ROUTE_ELEMENT_TYPES.map(item => `
        <option value="${item.type}" ${item.type === element.type ? 'selected' : ''}>${item.label}</option>
      `).join('')

      this.root.innerHTML = `
        <div class="route-panel-head">
          <h3>Proprieta</h3>
          <span>${escapeHtml(def.label)}</span>
        </div>
        <div class="route-props-actions">
          <button type="button" class="btn btn-outline btn-sm" data-action="rotate-left">Ruota -15</button>
          <button type="button" class="btn btn-outline btn-sm" data-action="rotate-right">Ruota +15</button>
          <button type="button" class="btn btn-outline btn-sm" data-action="duplicate">Duplica</button>
          <button type="button" class="btn btn-delete-soft btn-sm" data-action="delete">Elimina</button>
        </div>
        <div class="route-props-grid">
          ${field('label', 'Nome', element.label)}
          <label class="field"><span>Tipo</span><select data-field="type">${types}</select></label>
          ${numberField('x', 'X', element.x, 0)}
          ${numberField('y', 'Y', element.y, 0)}
          ${numberField('rotation', 'Rotazione', element.rotation)}
          ${numberField('width', 'Larghezza', element.width, 8)}
          ${numberField('height', 'Altezza', element.height, 8)}
          <label class="field"><span>Variante</span><select data-field="variant">${variants}</select></label>
          ${numberField('difficulty', 'Difficolta', element.difficulty, 1, 10)}
          ${numberField('order', 'Ordine', element.order ?? '', 1)}
          <label class="field route-wide-field"><span>Skill collegata</span><input data-field="skill" list="route-skill-options" value="${escapeAttr(element.skill)}" placeholder="Nome skill"></label>
          <label class="route-check-field"><input type="checkbox" data-field="required" ${element.required ? 'checked' : ''}> Obbligatorio</label>
          <label class="field route-wide-field"><span>Note didattiche</span><textarea data-field="notes" rows="5">${escapeHtml(element.notes)}</textarea></label>
        </div>
        <datalist id="route-skill-options">
          ${this.skillOptions.map(name => `<option value="${escapeAttr(name)}"></option>`).join('')}
        </datalist>
      `

      this.root.querySelectorAll('[data-field]').forEach(input => {
        input.addEventListener('input', () => this.emitChange(input, element))
        input.addEventListener('change', () => this.emitChange(input, element))
      })
      this.root.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
          const action = button.dataset.action
          if (action === 'duplicate') this.onDuplicate(element.id)
          if (action === 'delete') this.onDelete(element.id)
          if (action === 'rotate-left') this.onRotate(element.id, -15)
          if (action === 'rotate-right') this.onRotate(element.id, 15)
        })
      })
    }

    emitChange(input, element) {
      const fieldName = input.dataset.field
      let value = input.type === 'checkbox' ? input.checked : input.value
      if (['x', 'y', 'rotation', 'width', 'height', 'difficulty', 'order'].includes(fieldName)) {
        value = value === '' && fieldName === 'order' ? null : Number(value)
      }
      const patch = { [fieldName]: value }
      if (fieldName === 'type') {
        const nextDef = window.RouteModels.getElementType(value)
        const previousDef = window.RouteModels.getElementType(element.type)
        patch.variant = nextDef.defaultVariant
        if (!element.label || element.label === previousDef.label) patch.label = nextDef.label
      }
      this.onChange(element.id, patch)
    }
  }

  function field(name, label, value) {
    return `<label class="field route-wide-field"><span>${label}</span><input data-field="${name}" value="${escapeAttr(value)}"></label>`
  }

  function numberField(name, label, value, min = null, max = null) {
    return `<label class="field"><span>${label}</span><input type="number" data-field="${name}" value="${escapeAttr(value)}" ${min == null ? '' : `min="${min}"`} ${max == null ? '' : `max="${max}"`}></label>`
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, '&quot;')
  }

  window.ElementPropertiesPanel = ElementPropertiesPanel
})()
