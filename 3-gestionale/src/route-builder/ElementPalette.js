(function () {
  'use strict'

  class ElementPalette {
    constructor(root, options = {}) {
      this.root = root
      this.onAdd = options.onAdd || function () {}
    }

    render() {
      const groups = window.ROUTE_ELEMENT_TYPES.reduce((acc, item) => {
        const key = item.category || 'Altro'
        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
      }, {})

      this.root.innerHTML = `
        <div class="route-panel-head">
          <h3>Palette</h3>
          <span>${window.ROUTE_ELEMENT_TYPES.length}</span>
        </div>
        <div class="route-palette-groups">
          ${Object.entries(groups).map(([category, items]) => `
            <div class="route-palette-group">
              <div class="route-palette-category">${category}</div>
              ${items.map(item => this.renderItem(item)).join('')}
            </div>
          `).join('')}
        </div>
      `

      this.root.querySelectorAll('[data-route-element-type]').forEach(button => {
        button.addEventListener('click', () => this.onAdd(button.dataset.routeElementType))
        button.addEventListener('dragstart', event => {
          event.dataTransfer.effectAllowed = 'copy'
          event.dataTransfer.setData('application/x-route-element-type', button.dataset.routeElementType)
          event.dataTransfer.setData('text/plain', button.dataset.routeElementType)
        })
      })
    }

    renderItem(item) {
      const color = window.RouteModels.ROUTE_VARIANT_COLORS[item.defaultVariant] || window.RouteModels.ROUTE_VARIANT_COLORS.gray
      return `
        <button type="button" class="route-palette-item" draggable="true" data-route-element-type="${item.type}">
          <span class="route-palette-swatch route-swatch-${item.type}" style="--route-swatch:${color}"></span>
          <span class="route-palette-label">${item.label}</span>
        </button>
      `
    }
  }

  window.ElementPalette = ElementPalette
})()
