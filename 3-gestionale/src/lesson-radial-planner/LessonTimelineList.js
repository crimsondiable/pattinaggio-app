(function () {
  'use strict'

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  function jsArg(value) {
    return JSON.stringify(String(value == null ? '' : value)).replace(/"/g, '&quot;')
  }

  function eventMeta(event) {
    return [
      event.locationName,
      event.studentNames?.length ? event.studentNames.join(', ') : '',
      event.status,
    ].filter(Boolean).join(' · ')
  }

  class LessonTimelineList {
    constructor(root, options = {}) {
      this.root = root
      this.handlersName = options.handlersName || 'LessonRadialPlannerPage'
    }

    render(day, state = {}) {
      const models = window.LessonRadialModels
      this.root.innerHTML = `
        <div class="radial-list-head">
          <h3>Lista leggibile</h3>
          <span>${escapeHtml(day.startTime)}-${escapeHtml(day.endTime)}</span>
        </div>
        <div class="radial-timeline-list">
          ${day.events.map(event => {
            const isSelected = event.id === state.selectedId
            const isCurrent = event.id === state.currentId
            const isNext = event.id === state.nextId
            return `
              <button type="button" class="radial-timeline-item ${isSelected ? 'is-selected' : ''} ${isCurrent ? 'is-current' : ''} ${isNext ? 'is-next' : ''}" onclick="${this.handlersName}.selectEvent(${jsArg(event.id)})">
                <span class="radial-timeline-time">${escapeHtml(event.startTime)}-${escapeHtml(event.endTime)}</span>
                <span class="radial-timeline-dot" style="background:${escapeHtml(event.color || window.LessonRadialTypeColors?.[event.type] || '#6ee7f9')}"></span>
                <span class="radial-timeline-main">
                  <strong>${escapeHtml(event.title)}</strong>
                  <small>${escapeHtml(models.eventTypeLabel(event.type))} · ${escapeHtml(event.durationMinutes)} min${eventMeta(event) ? ` · ${escapeHtml(eventMeta(event))}` : ''}</small>
                </span>
              </button>
            `
          }).join('')}
        </div>
      `
    }
  }

  window.LessonTimelineList = LessonTimelineList
})()
