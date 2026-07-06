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

  class LessonRadialPlannerPage {
    constructor(root) {
      this.root = root
      this.day = null
      this.selectedId = null
      this.mode = 'day'
      this.quickNotes = {}
      this.status = null
      this.mounted = false
      this.dayView = null
      this.timelineList = null
      this.detailPanel = null
    }

    init() {
      if (!this.mounted) this.mount()
      if (!this.day) {
        this.day = window.MockLessonSchedule.buildMockLessonSchedule()
        this.selectedId = this.day.events.find(event => event.type === 'lesson')?.id || this.day.events[0]?.id || null
      }
      this.render()
    }

    mount() {
      this.root.innerHTML = `
        <div class="lesson-radial-page">
          <div class="section-header radial-heading">
            <div>
              <h2>LessonRadialPlanner</h2>
              <p class="radial-subtitle">Vista sperimentale della giornata lezioni con anello temporale e payload wearable mock.</p>
            </div>
            <div class="radial-view-switch" role="group" aria-label="Vista planner radiale">
              <button type="button" class="btn btn-outline btn-sm" id="radial-mode-day" onclick="LessonRadialPlannerPage.showDayView()">Giornata</button>
              <button type="button" class="btn btn-outline btn-sm" id="radial-mode-lesson" onclick="LessonRadialPlannerPage.showLessonView()">Lezione</button>
            </div>
          </div>
          <div id="lesson-radial-status" class="radial-status" hidden></div>
          <div id="lesson-radial-day-view" class="radial-day-layout"></div>
          <div id="lesson-radial-detail-view" class="radial-lesson-layout" hidden></div>
        </div>
      `
      this.dayView = new window.RadialDayView(this.root.querySelector('#lesson-radial-chart-root') || document.createElement('div'))
      this.timelineList = new window.LessonTimelineList(document.createElement('div'))
      this.detailPanel = new window.LessonDetailPanel(this.root.querySelector('#lesson-radial-detail-view'))
      this.mounted = true
    }

    render() {
      if (!this.day) return
      const models = window.LessonRadialModels
      const nowMinutes = models.currentMinutes()
      const current = models.findCurrentEvent(this.day.events, nowMinutes)
      const next = models.findNextEvent(this.day.events, nowMinutes)
      const selected = this.selectedEvent()
      const state = {
        selectedId: this.selectedId,
        currentId: current?.id || null,
        nextId: next?.id || null,
        nowMinutes,
        quickNotes: this.quickNotes,
      }

      const dayRoot = this.root.querySelector('#lesson-radial-day-view')
      const chartRoot = document.createElement('div')
      const listRoot = document.createElement('div')
      chartRoot.className = 'radial-chart-panel'
      listRoot.className = 'radial-list-panel'
      this.dayView = new window.RadialDayView(chartRoot)
      this.timelineList = new window.LessonTimelineList(listRoot)
      this.dayView.render(this.day, state)
      this.timelineList.render(this.day, state)
      dayRoot.innerHTML = ''
      dayRoot.append(chartRoot, listRoot)

      this.detailPanel.render(selected, state)
      this.syncModeButtons()
      this.renderStatus()
    }

    selectedEvent() {
      return this.day?.events.find(event => event.id === this.selectedId) || this.day?.events[0] || null
    }

    selectEvent(id) {
      if (!this.day?.events.some(event => event.id === id)) return
      this.selectedId = id
      this.mode = 'lesson'
      this.render()
    }

    showDayView() {
      this.mode = 'day'
      this.syncModeButtons()
    }

    showLessonView() {
      if (!this.selectedId) this.selectedId = this.day?.events[0]?.id || null
      this.mode = 'lesson'
      this.syncModeButtons()
    }

    syncModeButtons() {
      const dayView = this.root.querySelector('#lesson-radial-day-view')
      const detailView = this.root.querySelector('#lesson-radial-detail-view')
      const dayBtn = this.root.querySelector('#radial-mode-day')
      const lessonBtn = this.root.querySelector('#radial-mode-lesson')
      const showDay = this.mode === 'day'
      if (dayView) dayView.hidden = !showDay
      if (detailView) detailView.hidden = showDay
      if (dayBtn) {
        dayBtn.classList.toggle('btn-primary', showDay)
        dayBtn.classList.toggle('btn-outline', !showDay)
      }
      if (lessonBtn) {
        lessonBtn.classList.toggle('btn-primary', !showDay)
        lessonBtn.classList.toggle('btn-outline', showDay)
      }
    }

    setLessonStatus(id, action) {
      const statusByAction = {
        start: 'active',
        pause: 'planned',
        complete: 'completed',
        cancel: 'cancelled',
      }
      const status = statusByAction[action] || 'planned'
      this.day = {
        ...this.day,
        events: this.day.events.map(event => event.id === id
          ? { ...event, status, updatedAt: new Date().toISOString() }
          : event),
        updatedAt: new Date().toISOString(),
      }
      this.status = `${this.selectedEvent()?.title || 'Lezione'}: stato ${status}.`
      this.render()
    }

    toggleChecklistItem(eventId, itemId, checked) {
      this.day = {
        ...this.day,
        events: this.day.events.map(event => {
          if (event.id !== eventId) return event
          return {
            ...event,
            checklist: event.checklist.map(item => item.id === itemId ? { ...item, done: checked === true } : item),
            updatedAt: new Date().toISOString(),
          }
        }),
      }
      this.render()
    }

    setQuickNote(eventId, value) {
      this.quickNotes[eventId] = String(value || '')
    }

    copyPayload(eventId) {
      const event = this.day?.events.find(item => item.id === eventId)
      if (!event) return
      const payload = window.WatchPayloadMapper.buildWatchLessonPayload(event)
      const text = JSON.stringify(payload, null, 2)
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => {
            this.status = 'Payload copiato negli appunti.'
            this.renderStatus()
          })
          .catch(() => {
            this.status = 'Payload pronto nel riquadro JSON.'
            this.renderStatus()
          })
        return
      }
      this.status = 'Payload pronto nel riquadro JSON.'
      this.renderStatus()
    }

    renderStatus() {
      const el = this.root.querySelector('#lesson-radial-status')
      if (!el) return
      if (!this.status) {
        el.hidden = true
        return
      }
      el.hidden = false
      el.textContent = this.status
      window.clearTimeout(this.statusTimer)
      this.statusTimer = window.setTimeout(() => {
        this.status = null
        if (el) el.hidden = true
      }, 2800)
    }
  }

  let page = null

  function initLessonRadialPlannerPage() {
    const root = document.getElementById('lesson-radial-planner-root')
    if (!root) return
    if (!page) page = new LessonRadialPlannerPage(root)
    page.init()
  }

  window.initLessonRadialPlannerPage = initLessonRadialPlannerPage
  window.LessonRadialPlannerPage = {
    selectEvent: id => page?.selectEvent(id),
    showDayView: () => page?.showDayView(),
    showLessonView: () => page?.showLessonView(),
    setLessonStatus: (id, action) => page?.setLessonStatus(id, action),
    toggleChecklistItem: (eventId, itemId, checked) => page?.toggleChecklistItem(eventId, itemId, checked),
    setQuickNote: (eventId, value) => page?.setQuickNote(eventId, value),
    copyPayload: eventId => page?.copyPayload(eventId),
    debugState: () => ({ day: page?.day || null, selectedId: page?.selectedId || null }),
  }

  window.LessonRadialPlanner = {
    init: initLessonRadialPlannerPage,
    getCurrentSchedule: () => page?.day || null,
    buildWatchLessonPayload: lesson => window.WatchPayloadMapper.buildWatchLessonPayload(lesson),
    escapeHtml,
  }
})()
