(function () {
  'use strict'

  const TYPE_FALLBACK_COLORS = {
    lesson: '#6ee7f9',
    break: '#facc15',
    travel: '#a78bfa',
    unavailable: '#fb7185',
    free_slot: '#34d399',
  }

  function polarToCartesian(cx, cy, radius, angleDegrees) {
    const angleRadians = (angleDegrees - 90) * Math.PI / 180
    return {
      x: cx + radius * Math.cos(angleRadians),
      y: cy + radius * Math.sin(angleRadians),
    }
  }

  function describeArc(cx, cy, outerRadius, innerRadius, startAngle, endAngle) {
    const safeEnd = endAngle - startAngle >= 359.99 ? startAngle + 359.99 : endAngle
    const outerStart = polarToCartesian(cx, cy, outerRadius, safeEnd)
    const outerEnd = polarToCartesian(cx, cy, outerRadius, startAngle)
    const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle)
    const innerEnd = polarToCartesian(cx, cy, innerRadius, safeEnd)
    const largeArcFlag = safeEnd - startAngle <= 180 ? '0' : '1'
    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ')
  }

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

  function eventColor(event) {
    return event.color || TYPE_FALLBACK_COLORS[event.type] || TYPE_FALLBACK_COLORS.lesson
  }

  function segmentAngles(day, event) {
    const models = window.LessonRadialModels
    const dayStart = models.parseTimeToMinutes(day.startTime)
    const dayEnd = models.parseTimeToMinutes(day.endTime)
    const span = Math.max(1, dayEnd - dayStart)
    const start = models.clamp(models.parseTimeToMinutes(event.startTime), dayStart, dayEnd)
    const end = models.clamp(models.parseTimeToMinutes(event.endTime), dayStart, dayEnd)
    return {
      startAngle: ((start - dayStart) / span) * 360,
      endAngle: ((Math.max(start + 1, end) - dayStart) / span) * 360,
    }
  }

  function hourMarksHtml(day) {
    const models = window.LessonRadialModels
    const dayStart = models.parseTimeToMinutes(day.startTime)
    const dayEnd = models.parseTimeToMinutes(day.endTime)
    const span = Math.max(1, dayEnd - dayStart)
    const firstHour = Math.ceil(dayStart / 60) * 60
    const marks = []
    for (let minute = firstHour; minute <= dayEnd; minute += 120) {
      const angle = ((minute - dayStart) / span) * 360
      const p1 = polarToCartesian(190, 190, 122, angle)
      const p2 = polarToCartesian(190, 190, 132, angle)
      const label = polarToCartesian(190, 190, 105, angle)
      marks.push(`
        <line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" class="radial-hour-mark"></line>
        <text x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" class="radial-hour-label">${escapeHtml(models.minutesToTime(minute).slice(0, 2))}</text>
      `)
    }
    return marks.join('')
  }

  function segmentHtml(day, event, state, handlersName) {
    const { startAngle, endAngle } = segmentAngles(day, event)
    const path = describeArc(190, 190, 164, 124, startAngle, endAngle)
    const color = eventColor(event)
    const className = [
      'radial-segment',
      `is-${event.type}`,
      state.currentId === event.id ? 'is-current' : '',
      state.nextId === event.id ? 'is-next' : '',
      state.selectedId === event.id ? 'is-selected' : '',
      event.status === 'cancelled' ? 'is-cancelled' : '',
    ].filter(Boolean).join(' ')
    return `
      <path
        class="${className}"
        d="${path}"
        fill="${escapeHtml(color)}"
        tabindex="0"
        role="button"
        aria-label="${escapeHtml(event.title)} ${escapeHtml(event.startTime)}-${escapeHtml(event.endTime)}"
        onclick="${handlersName}.selectEvent(${jsArg(event.id)})"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${handlersName}.selectEvent(${jsArg(event.id)})}"
      ></path>
    `
  }

  function legendHtml() {
    const models = window.LessonRadialModels
    return models.EVENT_TYPES.map(type => `
      <span class="radial-legend-item">
        <span style="background:${TYPE_FALLBACK_COLORS[type]}"></span>
        ${escapeHtml(models.eventTypeLabel(type))}
      </span>
    `).join('')
  }

  class RadialDayView {
    constructor(root, options = {}) {
      this.root = root
      this.handlersName = options.handlersName || 'LessonRadialPlannerPage'
    }

    render(day, state = {}) {
      const models = window.LessonRadialModels
      const current = day.events.find(event => event.id === state.currentId)
      const next = day.events.find(event => event.id === state.nextId)
      this.root.innerHTML = `
        <div class="radial-day-card">
          <div class="radial-chart-wrap">
            <svg class="radial-chart" viewBox="0 0 380 380" role="img" aria-label="Vista circolare della giornata">
              <circle cx="190" cy="190" r="164" class="radial-base-ring"></circle>
              <circle cx="190" cy="190" r="124" class="radial-inner-ring"></circle>
              ${hourMarksHtml(day)}
              ${day.events.map(event => segmentHtml(day, event, state, this.handlersName)).join('')}
              <text x="190" y="179" class="radial-center-title">${escapeHtml(day.startTime)}-${escapeHtml(day.endTime)}</text>
              <text x="190" y="202" class="radial-center-subtitle">${day.events.length} blocchi</text>
            </svg>
          </div>
          <div class="radial-day-summary">
            <div class="radial-summary-row">
              <span>Corrente</span>
              <strong>${current ? escapeHtml(current.title) : 'Nessun blocco attivo'}</strong>
            </div>
            <div class="radial-summary-row">
              <span>Prossima</span>
              <strong>${next ? `${escapeHtml(next.startTime)} · ${escapeHtml(next.title)}` : 'Nessuna prossima lezione'}</strong>
            </div>
            <div class="radial-legend">${legendHtml()}</div>
            <div class="radial-debug-meta">
              <span>Fonte dati mock locale</span>
              <span>${escapeHtml(models.eventTypeLabel('lesson'))}: ${day.events.filter(event => event.type === 'lesson').length}</span>
            </div>
          </div>
        </div>
      `
    }
  }

  window.RadialDayView = RadialDayView
  window.LessonRadialTypeColors = TYPE_FALLBACK_COLORS
})()
