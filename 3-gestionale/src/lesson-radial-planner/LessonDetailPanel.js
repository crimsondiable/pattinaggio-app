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

  function listHtml(items) {
    const rows = Array.isArray(items) ? items : []
    if (!rows.length) return '<span class="radial-muted">Non indicato</span>'
    return rows.map(item => `<span class="radial-pill">${escapeHtml(item)}</span>`).join('')
  }

  function actionLabel(action) {
    return {
      start: 'Avvia',
      pause: 'Pausa',
      complete: 'Completa',
      cancel: 'Annulla',
    }[action] || action
  }

  function progressPercent(event, nowMinutes) {
    const models = window.LessonRadialModels
    const start = models.parseTimeToMinutes(event.startTime)
    const end = models.parseTimeToMinutes(event.endTime)
    if (nowMinutes <= start) return 0
    if (nowMinutes >= end) return 100
    return Math.round(((nowMinutes - start) / Math.max(1, end - start)) * 100)
  }

  class LessonDetailPanel {
    constructor(root, options = {}) {
      this.root = root
      this.handlersName = options.handlersName || 'LessonRadialPlannerPage'
    }

    render(event, state = {}) {
      if (!event) {
        this.root.innerHTML = '<div class="radial-empty-detail">Seleziona un segmento per aprire la lezione.</div>'
        return
      }
      const models = window.LessonRadialModels
      const payload = window.WatchPayloadMapper.buildWatchLessonPayload(event)
      const percent = progressPercent(event, state.nowMinutes ?? models.currentMinutes())
      const quickNote = state.quickNotes?.[event.id] ?? event.quickNote ?? ''
      this.root.innerHTML = `
        <div class="radial-detail-panel">
          <div class="radial-detail-top">
            <button type="button" class="back-btn" onclick="${this.handlersName}.showDayView()">← Giornata</button>
            <span class="lesson-status-chip is-on">${escapeHtml(event.status)}</span>
          </div>
          <div class="radial-detail-title-row">
            <div>
              <h3>${escapeHtml(event.title)}</h3>
              <p>${escapeHtml(event.startTime)}-${escapeHtml(event.endTime)} · ${escapeHtml(event.durationMinutes)} min · ${escapeHtml(models.eventTypeLabel(event.type))}</p>
            </div>
            <button type="button" class="btn btn-outline btn-sm" onclick="${this.handlersName}.showDayView()">Vista giornata</button>
          </div>

          <div class="radial-detail-grid">
            <div class="radial-info-box">
              <span>Allievi</span>
              <strong>${escapeHtml(event.studentNames?.join(', ') || 'Non assegnati')}</strong>
            </div>
            <div class="radial-info-box">
              <span>Luogo</span>
              <strong>${escapeHtml(event.locationName || 'Da definire')}</strong>
            </div>
            <div class="radial-info-box">
              <span>Obiettivo</span>
              <strong>${escapeHtml(event.primaryGoal || 'Da definire')}</strong>
            </div>
            <div class="radial-info-box">
              <span>Materiale</span>
              <strong>${escapeHtml(event.materials?.join(', ') || 'Nessun materiale indicato')}</strong>
            </div>
          </div>

          <div class="radial-session-box">
            <div class="radial-session-head">
              <span>Session progress</span>
              <strong>${percent}%</strong>
            </div>
            <div class="radial-progress"><span style="width:${percent}%"></span></div>
            <div class="radial-actions">
              ${['start', 'pause', 'complete', 'cancel'].map(action => `
                <button type="button" class="btn ${action === 'start' ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="${this.handlersName}.setLessonStatus(${jsArg(event.id)}, ${jsArg(action)})">${escapeHtml(actionLabel(action))}</button>
              `).join('')}
            </div>
          </div>

          <div class="radial-detail-columns">
            <div>
              <p class="sec-title">Skill previste</p>
              <div class="radial-pill-row">${listHtml(event.skills)}</div>
              <p class="sec-title">Esercizi previsti</p>
              <div class="radial-pill-row">${listHtml(event.exercises)}</div>
              <p class="sec-title">Note istruttore</p>
              <div class="radial-note-box">${escapeHtml(event.instructorNotes || 'Nessuna nota.')}</div>
            </div>
            <div>
              <p class="sec-title">Checklist esercizi/skill</p>
              <div class="radial-checklist">
                ${event.checklist.map(item => `
                  <label class="radial-check-row">
                    <input type="checkbox" ${item.done ? 'checked' : ''} onchange="${this.handlersName}.toggleChecklistItem(${jsArg(event.id)}, ${jsArg(item.id)}, this.checked)">
                    <span>${escapeHtml(item.label)}</span>
                    <small>${escapeHtml(item.type)}</small>
                  </label>
                `).join('') || '<div class="radial-muted">Nessuna checklist.</div>'}
              </div>
              <p class="sec-title">Nota rapida</p>
              <textarea class="radial-quick-note" rows="3" placeholder="Nota rapida per app companion" oninput="${this.handlersName}.setQuickNote(${jsArg(event.id)}, this.value)">${escapeHtml(quickNote)}</textarea>
            </div>
          </div>

          <div class="radial-payload-box">
            <div class="radial-payload-head">
              <strong>WatchLessonPayload</strong>
              <button type="button" class="btn btn-outline btn-sm" onclick="${this.handlersName}.copyPayload(${jsArg(event.id)})">Copia JSON</button>
            </div>
            <pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre>
          </div>
        </div>
      `
    }
  }

  window.LessonDetailPanel = LessonDetailPanel
})()
