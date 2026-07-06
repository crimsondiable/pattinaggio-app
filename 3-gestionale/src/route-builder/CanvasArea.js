(function () {
  'use strict'

  class CanvasArea {
    constructor(root, options = {}) {
      this.root = root
      this.onAddElement = options.onAddElement || function () {}
      this.onSelect = options.onSelect || function () {}
      this.onChangeElement = options.onChangeElement || function () {}
      this.onCanvasChange = options.onCanvasChange || function () {}
      this.route = null
      this.selectedId = null
      this.panMode = false
      this.dragState = null
      this.root.innerHTML = `
        <div class="route-canvas-shell">
          <div class="route-canvas-ruler" id="route-canvas-ruler"></div>
          <div class="route-canvas-viewport" id="route-canvas-viewport">
            <div class="route-canvas-content" id="route-canvas-content">
              <div class="route-canvas-stage" id="route-canvas-stage"></div>
            </div>
          </div>
        </div>
      `
      this.viewport = this.root.querySelector('#route-canvas-viewport')
      this.content = this.root.querySelector('#route-canvas-content')
      this.stage = this.root.querySelector('#route-canvas-stage')
      this.ruler = this.root.querySelector('#route-canvas-ruler')
      this.bind()
    }

    bind() {
      this.viewport.addEventListener('dragover', event => {
        if (event.dataTransfer.types.includes('application/x-route-element-type') || event.dataTransfer.types.includes('text/plain')) {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'copy'
        }
      })

      this.viewport.addEventListener('drop', event => {
        const type = event.dataTransfer.getData('application/x-route-element-type') || event.dataTransfer.getData('text/plain')
        if (!type || !window.RouteModels.hasElementType(type)) return
        event.preventDefault()
        const point = this.stagePoint(event.clientX, event.clientY)
        this.onAddElement(type, point)
      })

      this.viewport.addEventListener('pointerdown', event => {
        const item = event.target.closest('.route-canvas-element')
        if (item) {
          event.preventDefault()
          const element = this.route.elements.find(candidate => candidate.id === item.dataset.elementId)
          if (!element) return
          this.onSelect(element.id)
          this.dragState = {
            mode: 'element',
            id: element.id,
            startX: event.clientX,
            startY: event.clientY,
            originalX: element.x,
            originalY: element.y,
          }
          this.viewport.setPointerCapture(event.pointerId)
          return
        }

        if (this.panMode || event.shiftKey || event.button === 1) {
          event.preventDefault()
          this.dragState = {
            mode: 'pan',
            startX: event.clientX,
            startY: event.clientY,
            panX: this.route.canvas.panX,
            panY: this.route.canvas.panY,
          }
          this.viewport.classList.add('is-panning')
          this.viewport.setPointerCapture(event.pointerId)
          return
        }

        this.onSelect(null)
      })

      this.viewport.addEventListener('pointermove', event => {
        if (!this.dragState || !this.route) return
        if (this.dragState.mode === 'element') {
          const zoom = this.route.canvas.zoom || 1
          const dx = (event.clientX - this.dragState.startX) / zoom
          const dy = (event.clientY - this.dragState.startY) / zoom
          const element = this.route.elements.find(candidate => candidate.id === this.dragState.id)
          if (!element) return
          const nextX = Math.round(Math.max(0, Math.min(this.route.canvas.width - element.width, this.dragState.originalX + dx)))
          const nextY = Math.round(Math.max(0, Math.min(this.route.canvas.height - element.height, this.dragState.originalY + dy)))
          this.onChangeElement(this.dragState.id, { x: nextX, y: nextY })
          return
        }

        if (this.dragState.mode === 'pan') {
          this.onCanvasChange({
            panX: Math.round(this.dragState.panX + event.clientX - this.dragState.startX),
            panY: Math.round(this.dragState.panY + event.clientY - this.dragState.startY),
          })
        }
      })

      const stopPointer = event => {
        if (!this.dragState) return
        this.dragState = null
        this.viewport.classList.remove('is-panning')
        try { this.viewport.releasePointerCapture(event.pointerId) } catch {}
      }
      this.viewport.addEventListener('pointerup', stopPointer)
      this.viewport.addEventListener('pointercancel', stopPointer)

      this.viewport.addEventListener('wheel', event => {
        if (!this.route || (!event.ctrlKey && !event.metaKey && !event.altKey)) return
        event.preventDefault()
        const current = this.route.canvas.zoom || 1
        const direction = event.deltaY > 0 ? -1 : 1
        const next = Math.min(2.5, Math.max(0.35, Math.round((current + direction * 0.1) * 100) / 100))
        this.onCanvasChange({ zoom: next })
      }, { passive: false })
    }

    stagePoint(clientX, clientY) {
      const rect = this.stage.getBoundingClientRect()
      const zoom = this.route?.canvas?.zoom || 1
      return {
        x: Math.round(Math.max(0, Math.min(this.route.canvas.width, (clientX - rect.left) / zoom))),
        y: Math.round(Math.max(0, Math.min(this.route.canvas.height, (clientY - rect.top) / zoom))),
      }
    }

    setState(route, selectedId, options = {}) {
      this.route = route
      this.selectedId = selectedId
      this.panMode = !!options.panMode
      this.render()
    }

    render() {
      if (!this.route) return
      const canvas = this.route.canvas
      this.viewport.classList.toggle('is-pan-mode', this.panMode)
      this.ruler.textContent = `${canvas.surfaceName} - ${canvas.width} larghezza x ${canvas.height} lunghezza`
      this.content.style.transform = `translate(${canvas.panX}px, ${canvas.panY}px) scale(${canvas.zoom})`
      this.stage.style.width = `${canvas.width}px`
      this.stage.style.height = `${canvas.height}px`
      this.stage.style.setProperty('--route-grid-size', `${canvas.gridSize || 24}px`)
      this.stage.classList.toggle('show-grid', !!canvas.showGrid)
      this.stage.dataset.surface = canvas.surface || 'custom'
      this.stage.innerHTML = `${this.renderSurface(canvas)}${this.route.elements.map(element => this.renderElement(element)).join('')}`
    }

    renderSurface(canvas) {
      const surface = canvas.surface || 'custom'
      return `
        <div class="route-surface-lines route-surface-${surface}" aria-hidden="true">
          <span class="route-line route-line-half"></span>
          <span class="route-line route-line-center-circle"></span>
          <span class="route-line route-line-left-box"></span>
          <span class="route-line route-line-right-box"></span>
          <span class="route-line route-line-left-circle"></span>
          <span class="route-line route-line-right-circle"></span>
          <span class="route-line route-line-volley-left"></span>
          <span class="route-line route-line-volley-right"></span>
          <span class="route-line route-line-rink"></span>
        </div>
      `
    }

    renderElement(element) {
      const def = window.RouteModels.getElementType(element.type)
      const color = window.RouteModels.ROUTE_VARIANT_COLORS[element.variant] || window.RouteModels.ROUTE_VARIANT_COLORS.gray
      const isSelected = this.selectedId === element.id ? ' is-selected' : ''
      const required = element.required ? ' required' : ' optional'
      const order = element.order == null ? '' : `<span class="route-order-badge">${element.order}</span>`
      return `
        <div
          class="route-canvas-element route-element-${element.type}${isSelected}${required}"
          data-element-id="${element.id}"
          title="${escapeHtml(element.label)}"
          style="left:${element.x}px;top:${element.y}px;width:${element.width}px;height:${element.height}px;--route-rotation:${element.rotation}deg;--route-element-color:${color}"
        >
          <div class="route-element-visual">
            ${order}
            <span class="route-element-text">${escapeHtml(shortLabel(def.label, element.label))}</span>
          </div>
        </div>
      `
    }
  }

  function shortLabel(typeLabel, elementLabel) {
    const label = elementLabel || typeLabel
    if (label.length <= 12) return label
    return label.split(/\s+/).map(part => part[0]).join('').slice(0, 5).toUpperCase()
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  window.CanvasArea = CanvasArea
})()
