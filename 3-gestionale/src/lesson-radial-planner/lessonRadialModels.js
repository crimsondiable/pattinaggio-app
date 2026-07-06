(function () {
  'use strict'

  const EVENT_TYPES = ['lesson', 'break', 'travel', 'unavailable', 'free_slot']
  const EVENT_STATUSES = ['planned', 'active', 'completed', 'cancelled']
  const DEFAULT_DAY_CONFIG = Object.freeze({
    id: 'mock-day-2026-07-05',
    date: '2026-07-05',
    startTime: '07:00',
    endTime: '23:00',
    title: 'Giornata tipo',
  })

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
  }

  function parseTimeToMinutes(value, fallback = 0) {
    if (typeof value === 'number' && Number.isFinite(value)) return clamp(Math.round(value), 0, 1440)
    const match = String(value || '').match(/^(\d{1,2}):(\d{2})/)
    if (!match) return fallback
    const hours = clamp(Number(match[1]) || 0, 0, 24)
    const minutes = clamp(Number(match[2]) || 0, 0, 59)
    return clamp(hours * 60 + minutes, 0, 1440)
  }

  function minutesToTime(totalMinutes) {
    const safe = clamp(Math.round(Number(totalMinutes) || 0), 0, 1440)
    const hours = Math.floor(safe / 60)
    const minutes = safe % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  function durationMinutes(startTime, endTime) {
    return Math.max(0, parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime))
  }

  function eventTypeLabel(type) {
    return {
      lesson: 'Lezione',
      break: 'Pausa',
      travel: 'Spostamento',
      unavailable: 'Non disponibile',
      free_slot: 'Slot libero',
    }[type] || 'Evento'
  }

  function normalizeList(value) {
    if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean)
    return String(value || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  function normalizeChecklist(value) {
    const rows = Array.isArray(value) ? value : normalizeList(value).map(label => ({ label }))
    return rows.map((item, index) => ({
      id: String(item.id || `check-${index + 1}`),
      label: String(item.label || item.title || ''),
      type: String(item.type || 'exercise'),
      done: item.done === true,
    })).filter(item => item.label)
  }

  function normalizeEvent(event = {}) {
    const startTime = String(event.startTime || event.start || '09:00').slice(0, 5)
    const endTime = String(event.endTime || event.end || minutesToTime(parseTimeToMinutes(startTime) + 60)).slice(0, 5)
    const type = EVENT_TYPES.includes(event.type) ? event.type : 'lesson'
    const status = EVENT_STATUSES.includes(event.status) ? event.status : 'planned'
    const studentNames = normalizeList(event.studentNames || event.students)
    const skills = normalizeList(event.skills)
    const exercises = normalizeList(event.exercises)
    return {
      id: String(event.id || uid('radial_event')),
      title: String(event.title || event.name || eventTypeLabel(type)),
      type,
      startTime,
      endTime,
      durationMinutes: Number(event.durationMinutes) || durationMinutes(startTime, endTime),
      locationName: String(event.locationName || event.location || event.luogo || ''),
      color: String(event.color || ''),
      icon: String(event.icon || ''),
      studentIds: normalizeList(event.studentIds),
      studentNames,
      status,
      primaryGoal: String(event.primaryGoal || event.goal || ''),
      skills,
      exercises,
      instructorNotes: String(event.instructorNotes || event.notes || ''),
      materials: normalizeList(event.materials),
      checklist: normalizeChecklist(event.checklist || [
        ...skills.map(label => ({ label, type: 'skill' })),
        ...exercises.map(label => ({ label, type: 'exercise' })),
      ]),
      quickNote: String(event.quickNote || ''),
      quickActions: normalizeList(event.quickActions || ['start', 'pause', 'complete', 'cancel']),
      updatedAt: String(event.updatedAt || new Date().toISOString()),
    }
  }

  function normalizeDaySchedule(schedule = {}) {
    const config = {
      ...DEFAULT_DAY_CONFIG,
      ...schedule,
      startTime: String(schedule.startTime || DEFAULT_DAY_CONFIG.startTime).slice(0, 5),
      endTime: String(schedule.endTime || DEFAULT_DAY_CONFIG.endTime).slice(0, 5),
    }
    const startMinute = parseTimeToMinutes(config.startTime, parseTimeToMinutes(DEFAULT_DAY_CONFIG.startTime))
    const endMinute = parseTimeToMinutes(config.endTime, parseTimeToMinutes(DEFAULT_DAY_CONFIG.endTime))
    const events = (Array.isArray(schedule.events) ? schedule.events : [])
      .map(normalizeEvent)
      .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime))
    return {
      id: String(config.id || uid('radial_day')),
      date: String(config.date || DEFAULT_DAY_CONFIG.date),
      title: String(config.title || DEFAULT_DAY_CONFIG.title),
      startTime: minutesToTime(startMinute),
      endTime: minutesToTime(Math.max(startMinute + 60, endMinute)),
      events,
      updatedAt: String(config.updatedAt || new Date().toISOString()),
    }
  }

  function currentMinutes(now = new Date()) {
    return now.getHours() * 60 + now.getMinutes()
  }

  function eventTemporalState(event, nowMinutes = currentMinutes()) {
    const start = parseTimeToMinutes(event.startTime)
    const end = parseTimeToMinutes(event.endTime)
    if (nowMinutes >= start && nowMinutes < end) return 'current'
    if (nowMinutes < start) return 'upcoming'
    return 'past'
  }

  function findCurrentEvent(events, nowMinutes = currentMinutes()) {
    return (events || []).find(event => eventTemporalState(event, nowMinutes) === 'current') || null
  }

  function findNextEvent(events, nowMinutes = currentMinutes()) {
    return (events || [])
      .filter(event => parseTimeToMinutes(event.startTime) > nowMinutes)
      .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime))[0] || null
  }

  function mapGestionaleLessonToRadialEvent(lesson = {}) {
    const startDate = lesson.data ? new Date(lesson.data) : null
    const hasValidDate = startDate && !Number.isNaN(startDate.getTime())
    const startTime = hasValidDate ? minutesToTime(startDate.getHours() * 60 + startDate.getMinutes()) : '09:00'
    const duration = Number(lesson.durata_min || lesson.durationMinutes || 60) || 60
    const allievi = (lesson.lezioni_allievi || []).map(row => row.allievi || row.allievo || row).filter(Boolean)
    const skills = (lesson.lezioni_skills || [])
      .map(row => row.skills?.nome || row.skill?.nome || row.nome || row.skillName)
      .filter(Boolean)
    return normalizeEvent({
      id: lesson.id,
      title: lesson.titolo || lesson.tipo || 'Lezione',
      type: 'lesson',
      startTime,
      endTime: minutesToTime(parseTimeToMinutes(startTime) + duration),
      durationMinutes: duration,
      locationName: lesson.luogo || lesson.locationName || '',
      studentIds: allievi.map(item => item.id).filter(Boolean),
      studentNames: allievi.map(item => [item.nome, item.cognome].filter(Boolean).join(' ') || item.nome || item.nickname).filter(Boolean),
      status: lesson.stato === 'chiusa' ? 'completed' : 'planned',
      primaryGoal: lesson.note_speciali || lesson.obiettivo || '',
      skills,
      instructorNotes: lesson.note || '',
      updatedAt: lesson.updated_at || lesson.updatedAt,
    })
  }

  window.LessonRadialModels = {
    EVENT_TYPES,
    EVENT_STATUSES,
    DEFAULT_DAY_CONFIG,
    uid,
    clamp,
    parseTimeToMinutes,
    minutesToTime,
    durationMinutes,
    eventTypeLabel,
    normalizeList,
    normalizeChecklist,
    normalizeEvent,
    normalizeDaySchedule,
    currentMinutes,
    eventTemporalState,
    findCurrentEvent,
    findNextEvent,
    mapGestionaleLessonToRadialEvent,
  }
})()
