(function () {
  'use strict'

  class RouteToolbar {
    constructor(root, options = {}) {
      this.root = root
      this.handlers = options
      this.route = null
      this.savedRoutes = []
      this.status = null
      this.panMode = false
    }

    setState(route, savedRoutes, status, panMode) {
      this.route = route
      this.savedRoutes = savedRoutes || []
      this.status = status || null
      this.panMode = !!panMode
      this.render()
    }

    render() {
      const route = this.route
      const canvas = route.canvas
      const surfaces = window.RouteModels.ROUTE_SURFACE_PRESETS.map(surface => `
        <option value="${surface.key}" ${surface.key === canvas.surface ? 'selected' : ''}>${surface.label}</option>
      `).join('')
      const savedOptions = this.savedRoutes.map(item => `
        <option value="${item.id}" ${item.id === route.id ? 'selected' : ''}>${escapeHtml(item.title)}</option>
      `).join('')
      const statusClass = this.status?.type ? ` ${this.status.type}` : ''

      this.root.innerHTML = `
        <div class="route-toolbar">
          <div class="route-title-row">
            <label class="field route-title-field"><span>Titolo percorso</span><input data-route-field="title" value="${escapeAttr(route.title)}"></label>
            <div class="route-toolbar-actions">
              <button type="button" class="btn btn-outline btn-sm" data-action="new">Nuovo</button>
              <button type="button" class="btn btn-primary btn-sm" data-action="save">Salva</button>
              <button type="button" class="btn btn-outline btn-sm" data-action="export">Esporta JSON</button>
              <label class="btn btn-outline btn-sm route-file-label">Importa JSON<input type="file" accept=".json,application/json" data-action="import" hidden></label>
              <button type="button" class="btn btn-delete-soft btn-sm" data-action="reset">Reset canvas</button>
            </div>
          </div>

          <div class="route-load-row">
            <label class="field"><span>Carica percorso</span><select data-action="load">
              <option value="">Percorsi salvati</option>
              ${savedOptions}
            </select></label>
            <label class="field route-surface-field"><span>Fondo</span><select data-canvas-field="surface">${surfaces}</select></label>
            <label class="field route-surface-name-field"><span>Nome fondo</span><input data-canvas-field="surfaceName" value="${escapeAttr(canvas.surfaceName)}" placeholder="Campo custom"></label>
            <label class="field route-dimension-field"><span>Larghezza</span><input type="number" min="240" data-canvas-field="width" value="${canvas.width}"></label>
            <label class="field route-dimension-field"><span>Lunghezza</span><input type="number" min="180" data-canvas-field="height" value="${canvas.height}"></label>
            <label class="route-check-field"><input type="checkbox" data-canvas-field="showGrid" ${canvas.showGrid ? 'checked' : ''}> Griglia</label>
            <div class="route-zoom-controls">
              <button type="button" class="btn btn-outline btn-sm" data-action="zoom-out">-</button>
              <span>${Math.round(canvas.zoom * 100)}%</span>
              <button type="button" class="btn btn-outline btn-sm" data-action="zoom-in">+</button>
              <button type="button" class="btn btn-outline btn-sm ${this.panMode ? 'is-on' : ''}" data-action="pan">Pan</button>
            </div>
          </div>

          <div class="route-meta-grid">
            <label class="field route-wide-field"><span>Descrizione</span><textarea rows="2" data-route-field="description">${escapeHtml(route.description)}</textarea></label>
            <label class="field route-wide-field"><span>Obiettivo didattico</span><textarea rows="2" data-route-field="objective">${escapeHtml(route.objective)}</textarea></label>
            <label class="field"><span>Livello consigliato</span><input type="number" min="1" max="10" data-route-field="level" value="${route.level}"></label>
            <label class="field"><span>Durata stimata min</span><input type="number" min="0" data-route-field="estimatedDurationMinutes" value="${route.estimatedDurationMinutes}"></label>
            <label class="field"><span>Allievi consigliati</span><input data-route-field="recommendedStudents" value="${escapeAttr(route.recommendedStudents)}"></label>
            <label class="field route-wide-field"><span>Skill coinvolte</span><input data-route-field="skills" value="${escapeAttr(route.skills.join(', '))}" placeholder="slalom, frenata_limone"></label>
            <label class="field route-wide-field"><span>Materiali necessari</span><textarea rows="2" data-route-field="materials">${escapeHtml(route.materials)}</textarea></label>
            <label class="field route-wide-field"><span>Note sicurezza</span><textarea rows="2" data-route-field="safetyNotes">${escapeHtml(route.safetyNotes)}</textarea></label>
          </div>

          <div class="route-status${statusClass}" ${this.status ? '' : 'hidden'}>${escapeHtml(this.status?.message || '')}</div>
        </div>
      `

      this.bind()
    }

    bind() {
      this.root.querySelectorAll('[data-route-field]').forEach(input => {
        const emit = options => {
          const field = input.dataset.routeField
          let value = input.value
          if (['level', 'estimatedDurationMinutes'].includes(field)) value = Number(value)
          this.handlers.onRouteChange?.(field, value, options)
        }
        input.addEventListener('input', () => emit({ live: true }))
        input.addEventListener('change', () => emit({ live: false }))
      })

      this.root.querySelectorAll('[data-canvas-field]').forEach(input => {
        const isSelect = input.tagName === 'SELECT'
        const isCheckbox = input.type === 'checkbox'
        if (!isSelect && !isCheckbox) input.addEventListener('input', () => this.emitCanvasChange(input, { live: true }))
        input.addEventListener('change', () => this.emitCanvasChange(input, { live: false }))
      })

      this.root.querySelectorAll('[data-action]').forEach(control => {
        const action = control.dataset.action
        if (action === 'import') {
          control.addEventListener('change', () => {
            this.handlers.onImport?.(control.files?.[0])
            control.value = ''
          })
          return
        }
        if (action === 'load') {
          control.addEventListener('change', () => {
            if (control.value) this.handlers.onLoad?.(control.value)
          })
          return
        }
        control.addEventListener('click', () => this.dispatchAction(action))
      })
    }

    emitCanvasChange(input, options = {}) {
      const field = input.dataset.canvasField
      let value = input.type === 'checkbox' ? input.checked : input.value
      if (['width', 'height'].includes(field)) value = Number(value)
      this.handlers.onCanvasChange?.({ [field]: value }, options)
    }

    dispatchAction(action) {
      if (action === 'new') this.handlers.onNew?.()
      if (action === 'save') this.handlers.onSave?.()
      if (action === 'export') this.handlers.onExport?.()
      if (action === 'reset') this.handlers.onResetCanvas?.()
      if (action === 'zoom-in') this.handlers.onZoom?.(0.1)
      if (action === 'zoom-out') this.handlers.onZoom?.(-0.1)
      if (action === 'pan') this.handlers.onTogglePan?.()
    }
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

  window.RouteToolbar = RouteToolbar
})()
