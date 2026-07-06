(function () {
  'use strict'

  class RouteBuilderPage {
    constructor(root) {
      this.root = root
      this.route = window.RouteModels.createRoute()
      this.savedRoutes = []
      this.selectedId = null
      this.status = null
      this.panMode = false
      this.mounted = false
      this.toolbar = null
      this.palette = null
      this.canvas = null
      this.properties = null
    }

    init() {
      if (!this.mounted) this.mount()
      this.savedRoutes = window.RouteStorage.list()
      if (!this.savedRoutes.length && !this.route.elements.length) {
        this.route = this.createStarterRoute()
      }
      this.render()
    }

    mount() {
      this.root.innerHTML = `
        <div class="route-builder-page">
          <div class="section-header route-builder-heading">
            <div>
              <h2>Percorsi / Campo esercizi</h2>
              <p class="route-builder-subtitle">Editor operativo per percorsi didattici, materiali e sequenze.</p>
            </div>
          </div>
          <div id="route-toolbar-root"></div>
          <div class="route-builder-layout">
            <aside class="route-side-panel" id="route-palette-root"></aside>
            <section class="route-canvas-panel" id="route-canvas-root"></section>
            <aside class="route-side-panel route-props-panel" id="route-properties-root"></aside>
          </div>
        </div>
      `

      this.toolbar = new window.RouteToolbar(this.root.querySelector('#route-toolbar-root'), {
        onRouteChange: (field, value, options) => this.updateRouteField(field, value, options),
        onCanvasChange: (patch, options) => this.updateCanvas(patch, options),
        onSave: () => this.save(),
        onLoad: id => this.load(id),
        onExport: () => this.exportJson(),
        onImport: file => this.importJson(file),
        onResetCanvas: () => this.resetCanvas(),
        onNew: () => this.newRoute(),
        onZoom: delta => this.zoom(delta),
        onTogglePan: () => this.togglePan(),
      })
      this.palette = new window.ElementPalette(this.root.querySelector('#route-palette-root'), {
        onAdd: type => this.addElement(type),
      })
      this.canvas = new window.CanvasArea(this.root.querySelector('#route-canvas-root'), {
        onAddElement: (type, point) => this.addElement(type, point),
        onSelect: id => this.selectElement(id),
        onChangeElement: (id, patch) => this.updateElement(id, patch, { quiet: true, live: true }),
        onCanvasChange: patch => this.updateCanvas(patch, { quiet: true, live: true }),
      })
      this.properties = new window.ElementPropertiesPanel(this.root.querySelector('#route-properties-root'), {
        onChange: (id, patch, options) => this.updateElement(id, patch, options),
        onDuplicate: id => this.duplicateElement(id),
        onDelete: id => this.deleteElement(id),
        onRotate: (id, delta) => this.rotateElement(id, delta),
      })
      this.mounted = true
    }

    createStarterRoute() {
      const route = window.RouteModels.createRoute({
        title: 'Slalom base con frenata finale',
        description: 'Sequenza introduttiva con slalom regolare e stop controllato.',
        objective: 'Controllo traiettoria, ritmo e frenata in uscita.',
        level: 1,
        skills: ['slalom', 'frenata_limone', 'posizione_base'],
        estimatedDurationMinutes: 10,
        recommendedStudents: '1-4',
        materials: '6 conetti, linea di partenza, punto di stop',
        safetyNotes: 'Lasciare spazio libero dopo lo stop e ridurre velocita al primo giro.',
      })
      const items = [
        window.RouteModels.createElement('start_line', { x: 70, y: 220 }, { label: 'Partenza', order: 1 }),
        window.RouteModels.createElement('slalom', { x: 250, y: 198 }, { label: 'Slalom base', order: 2, skill: 'Slalom base' }),
        window.RouteModels.createElement('stop_point', { x: 530, y: 210 }, { label: 'Stop finale', order: 3, skill: 'Frenata limone' }),
        window.RouteModels.createElement('finish_line', { x: 630, y: 220 }, { label: 'Arrivo', order: 4 }),
      ]
      return window.RouteModels.normalizeRoute({ ...route, elements: items })
    }

    render() {
      this.savedRoutes = window.RouteStorage.list()
      this.toolbar.setState(this.route, this.savedRoutes, this.status, this.panMode)
      this.palette.render()
      this.canvas.setState(this.route, this.selectedId, { panMode: this.panMode })
      this.properties.setState(this.route, this.selectedId, this.skillOptions())
    }

    renderLiveCanvas() {
      this.canvas.setState(this.route, this.selectedId, { panMode: this.panMode })
      this.toolbar.route = this.route
      this.properties.route = this.route
    }

    clearTransientStatus() {
      window.clearTimeout(this.statusTimer)
      this.status = null
    }

    setStatus(message, type = 'msg-info') {
      this.status = message ? { message, type } : null
      window.clearTimeout(this.statusTimer)
      if (message) {
        this.statusTimer = window.setTimeout(() => {
          this.status = null
          if (this.mounted) this.render()
        }, 3200)
      }
    }

    markUpdated(route) {
      this.route = window.RouteModels.normalizeRoute({ ...route, updatedAt: new Date().toISOString() })
    }

    updateRouteField(field, value, options = {}) {
      const next = { ...this.route, [field]: field === 'skills' ? window.RouteModels.parseList(value) : value }
      this.markUpdated(next)
      if (options.live) {
        this.clearTransientStatus()
        return
      }
      this.render()
    }

    updateCanvas(patch, options = {}) {
      const changes = { ...patch }
      if ((Object.prototype.hasOwnProperty.call(changes, 'width') || Object.prototype.hasOwnProperty.call(changes, 'height')) && !Object.prototype.hasOwnProperty.call(changes, 'surface')) {
        changes.size = 'custom'
        changes.surface = 'custom'
      }
      let nextRoute = { ...this.route, canvas: { ...this.route.canvas, ...patch } }
      if (Object.prototype.hasOwnProperty.call(changes, 'surface') && patch.surface) {
        nextRoute = window.RouteModels.applySurfacePreset(nextRoute, patch.surface)
      } else if (Object.prototype.hasOwnProperty.call(changes, 'size')) {
        nextRoute = window.RouteModels.applyCanvasSize({ ...this.route, canvas: { ...this.route.canvas, ...changes } }, changes.size)
      } else {
        nextRoute = window.RouteModels.normalizeRoute({ ...this.route, canvas: { ...this.route.canvas, ...changes } })
      }
      this.markUpdated(nextRoute)
      if (options.live) {
        this.clearTransientStatus()
        this.renderLiveCanvas()
        return
      }
      if (!options.quiet) this.setStatus('Canvas aggiornato.', 'msg-info')
      this.render()
    }

    addElement(type, point = null) {
      const def = window.RouteModels.getElementType(type)
      const center = point || {
        x: Math.max(20, Math.round(this.route.canvas.width / 2 - def.defaultWidth / 2)),
        y: Math.max(20, Math.round(this.route.canvas.height / 2 - def.defaultHeight / 2)),
      }
      const maxOrder = this.route.elements.reduce((max, item) => Math.max(max, Number(item.order) || 0), 0)
      const element = window.RouteModels.createElement(type, center, { order: maxOrder + 1 })
      this.markUpdated({ ...this.route, elements: [...this.route.elements, element] })
      this.selectedId = element.id
      this.setStatus(`${def.label} aggiunto.`, 'msg-ok')
      this.render()
    }

    selectElement(id) {
      this.selectedId = id
      this.render()
    }

    updateElement(id, patch, options = {}) {
      const elements = this.route.elements.map(element => {
        if (element.id !== id) return element
        return window.RouteModels.normalizeElement({ ...element, ...patch })
      })
      this.markUpdated({ ...this.route, elements })
      if (options.live) {
        this.clearTransientStatus()
        this.renderLiveCanvas()
        return
      }
      if (!options.quiet) this.setStatus('Elemento aggiornato.', 'msg-info')
      this.render()
    }

    duplicateElement(id) {
      const source = this.route.elements.find(element => element.id === id)
      if (!source) return
      const maxOrder = this.route.elements.reduce((max, item) => Math.max(max, Number(item.order) || 0), 0)
      const clone = window.RouteModels.normalizeElement({
        ...source,
        id: window.RouteModels.uid('el'),
        x: Math.max(0, Math.min(source.x + 24, this.route.canvas.width - source.width)),
        y: Math.max(0, Math.min(source.y + 24, this.route.canvas.height - source.height)),
        label: `${source.label} copia`,
        order: maxOrder + 1,
      })
      this.markUpdated({ ...this.route, elements: [...this.route.elements, clone] })
      this.selectedId = clone.id
      this.setStatus('Elemento duplicato.', 'msg-ok')
      this.render()
    }

    deleteElement(id) {
      const source = this.route.elements.find(element => element.id === id)
      if (!source) return
      if (!window.confirm(`Eliminare "${source.label}" dal percorso?`)) return
      this.markUpdated({ ...this.route, elements: this.route.elements.filter(element => element.id !== id) })
      this.selectedId = null
      this.setStatus('Elemento eliminato.', 'msg-info')
      this.render()
    }

    rotateElement(id, delta) {
      const source = this.route.elements.find(element => element.id === id)
      if (!source) return
      const rotation = Math.round((Number(source.rotation) + delta + 360) % 360)
      this.updateElement(id, { rotation })
    }

    resetCanvas() {
      if (this.route.elements.length && !window.confirm('Svuotare il canvas di questo percorso?')) return
      this.markUpdated({
        ...this.route,
        elements: [],
        executionSequence: [],
        canvas: { ...this.route.canvas, zoom: 1, panX: 18, panY: 18 },
      })
      this.selectedId = null
      this.setStatus('Canvas svuotato.', 'msg-info')
      this.render()
    }

    newRoute() {
      if (this.route.elements.length && !window.confirm('Creare un nuovo percorso non salvato?')) return
      this.route = window.RouteModels.createRoute()
      this.selectedId = null
      this.panMode = false
      this.setStatus('Nuovo percorso pronto.', 'msg-info')
      this.render()
    }

    save() {
      this.route = window.RouteStorage.save(this.route)
      this.setStatus('Percorso salvato in locale.', 'msg-ok')
      this.render()
    }

    load(id) {
      const route = window.RouteStorage.get(id)
      if (!route) {
        this.setStatus('Percorso salvato non trovato.', 'msg-err')
        this.render()
        return
      }
      this.route = route
      this.selectedId = null
      this.panMode = false
      this.setStatus('Percorso caricato.', 'msg-ok')
      this.render()
    }

    exportJson() {
      window.RouteJsonUtils.downloadRouteJson(this.route)
      this.setStatus('JSON esportato.', 'msg-ok')
      this.render()
    }

    async importJson(file) {
      try {
        let route = await window.RouteJsonUtils.parseRouteFile(file)
        if (window.RouteStorage.exists(route.id)) {
          route = window.RouteModels.normalizeRoute({
            ...route,
            id: window.RouteModels.uid('route'),
            title: `${route.title} importato`,
            createdAt: new Date().toISOString(),
          })
        }
        this.route = route
        this.selectedId = null
        this.panMode = false
        this.setStatus('JSON importato. Premi Salva per conservarlo.', 'msg-ok')
      } catch (error) {
        this.setStatus(error.message || 'Importazione non riuscita.', 'msg-err')
      }
      this.render()
    }

    zoom(delta) {
      const next = Math.min(2.5, Math.max(0.35, Math.round((this.route.canvas.zoom + delta) * 100) / 100))
      this.updateCanvas({ zoom: next }, { quiet: true })
    }

    togglePan() {
      this.panMode = !this.panMode
      this.setStatus(this.panMode ? 'Pan attivo.' : 'Pan disattivato.', 'msg-info')
      this.render()
    }

    skillOptions() {
      const names = new Set()
      if (Array.isArray(window.SKILLTREE_NODES)) {
        window.SKILLTREE_NODES.forEach(skill => {
          if (skill?.name) names.add(skill.name)
        })
      }
      try {
        if (Array.isArray(allSkills)) {
          allSkills.forEach(skill => {
            if (skill?.nome) names.add(skill.nome)
            if (skill?.name) names.add(skill.name)
          })
        }
      } catch {}
      return Array.from(names).sort((a, b) => a.localeCompare(b, 'it'))
    }
  }

  let routeBuilderPage = null

  window.initRouteBuilderPage = function initRouteBuilderPage() {
    const root = document.getElementById('route-builder-root')
    if (!root) return
    if (!routeBuilderPage) routeBuilderPage = new RouteBuilderPage(root)
    routeBuilderPage.init()
  }

  window.RouteBuilderPage = RouteBuilderPage
})()
