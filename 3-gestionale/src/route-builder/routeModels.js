(function () {
  'use strict'

  const ROUTE_ELEMENT_TYPES = [
    { type: 'cone', label: 'Conetto', category: 'Base', defaultWidth: 28, defaultHeight: 28, defaultVariant: 'orange', variants: ['orange', 'yellow', 'blue', 'green', 'white'] },
    { type: 'flat_marker', label: 'Cinesino', category: 'Base', defaultWidth: 36, defaultHeight: 16, defaultVariant: 'yellow', variants: ['yellow', 'orange', 'blue', 'green', 'white'] },
    { type: 'ground_stick', label: 'Asta / bastone a terra', category: 'Ostacoli', defaultWidth: 112, defaultHeight: 12, defaultVariant: 'wood', variants: ['wood', 'blue', 'red', 'white'] },
    { type: 'high_bar', label: 'Asta alta sotto cui passare', category: 'Ostacoli', defaultWidth: 132, defaultHeight: 44, defaultVariant: 'blue', variants: ['blue', 'green', 'red', 'white'] },
    { type: 'low_hurdle', label: 'Piccolo rialzo da scavalcare', category: 'Ostacoli', defaultWidth: 76, defaultHeight: 34, defaultVariant: 'green', variants: ['green', 'yellow', 'blue', 'red'] },
    { type: 'bank_ramp', label: 'Rampa bank to bank', category: 'Ostacoli', defaultWidth: 136, defaultHeight: 58, defaultVariant: 'steel', variants: ['steel', 'blue', 'orange'] },
    { type: 'crash_mat', label: 'Materassone', category: 'Sicurezza', defaultWidth: 156, defaultHeight: 86, defaultVariant: 'blue', variants: ['blue', 'green', 'red'] },
    { type: 'start_line', label: 'Linea di partenza', category: 'Percorso', defaultWidth: 148, defaultHeight: 16, defaultVariant: 'white', variants: ['white', 'green', 'blue'] },
    { type: 'finish_line', label: 'Linea di arrivo', category: 'Percorso', defaultWidth: 148, defaultHeight: 16, defaultVariant: 'white', variants: ['white', 'red', 'blue'] },
    { type: 'free_area', label: 'Area libera / zona delimitata', category: 'Percorso', defaultWidth: 180, defaultHeight: 112, defaultVariant: 'cyan', variants: ['cyan', 'green', 'yellow', 'red'] },
    { type: 'direction_arrow', label: 'Freccia direzionale', category: 'Percorso', defaultWidth: 92, defaultHeight: 40, defaultVariant: 'blue', variants: ['blue', 'green', 'orange', 'white'] },
    { type: 'stop_point', label: 'Punto di stop', category: 'Percorso', defaultWidth: 42, defaultHeight: 42, defaultVariant: 'red', variants: ['red', 'orange', 'blue'] },
    { type: 'forced_curve', label: 'Curva obbligata', category: 'Percorso', defaultWidth: 112, defaultHeight: 78, defaultVariant: 'violet', variants: ['violet', 'blue', 'green'] },
    { type: 'slalom', label: 'Slalom', category: 'Pattern', defaultWidth: 148, defaultHeight: 58, defaultVariant: 'orange', variants: ['orange', 'yellow', 'blue', 'green'] },
    { type: 'custom', label: 'Elemento personalizzato', category: 'Altro', defaultWidth: 82, defaultHeight: 52, defaultVariant: 'gray', variants: ['gray', 'blue', 'green', 'orange', 'red'] },
  ]

  const ROUTE_CANVAS_SIZES = [
    { key: 'small', label: 'Piccolo', width: 520, height: 340 },
    { key: 'medium', label: 'Medio', width: 760, height: 480 },
    { key: 'large', label: 'Grande', width: 1040, height: 640 },
    { key: 'custom', label: 'Personalizzato', width: 760, height: 480 },
  ]

  const ROUTE_SURFACE_PRESETS = [
    { key: 'basketball', label: 'Campetto da basket', width: 840, height: 450 },
    { key: 'futsal', label: 'Campo calcio a 5', width: 1000, height: 500 },
    { key: 'volleyball', label: 'Campo pallavolo', width: 720, height: 360 },
    { key: 'figure_skating', label: 'Figure skating / pista', width: 1200, height: 600 },
    { key: 'school_gym', label: 'Palestra scolastica', width: 760, height: 460 },
    { key: 'open_area', label: 'Piazza / area libera', width: 900, height: 560 },
    { key: 'custom', label: 'Custom salvato', width: 760, height: 480 },
  ]

  const ROUTE_VARIANT_COLORS = {
    orange: '#f97316',
    yellow: '#facc15',
    blue: '#38bdf8',
    green: '#34d399',
    red: '#fb7185',
    white: '#e5edf2',
    gray: '#94a3b8',
    cyan: '#67e8f9',
    violet: '#a78bfa',
    wood: '#b7793e',
    steel: '#8fa4ad',
  }

  const DEFAULT_ROUTE_CANVAS = Object.freeze({
    size: 'medium',
    surface: 'custom',
    surfaceName: 'Campo custom',
    width: 760,
    height: 480,
    showGrid: true,
    gridSize: 24,
    zoom: 1,
    panX: 18,
    panY: 18,
  })

  function uid(prefix) {
    const chunk = Math.random().toString(36).slice(2, 8)
    return `${prefix}_${Date.now().toString(36)}_${chunk}`
  }

  function numberOr(value, fallback) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  function clampNumber(value, min, max, fallback) {
    return Math.min(max, Math.max(min, numberOr(value, fallback)))
  }

  function getElementType(type) {
    return ROUTE_ELEMENT_TYPES.find(item => item.type === type) || ROUTE_ELEMENT_TYPES[0]
  }

  function hasElementType(type) {
    return ROUTE_ELEMENT_TYPES.some(item => item.type === type)
  }

  function getCanvasSize(size) {
    return ROUTE_CANVAS_SIZES.find(item => item.key === size) || ROUTE_CANVAS_SIZES[1]
  }

  function getSurfacePreset(surface) {
    return ROUTE_SURFACE_PRESETS.find(item => item.key === surface) || ROUTE_SURFACE_PRESETS[ROUTE_SURFACE_PRESETS.length - 1]
  }

  function parseList(value) {
    if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean)
    return String(value || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  function createElement(type, position = {}, overrides = {}) {
    const def = getElementType(type)
    const x = clampNumber(position.x, 0, 4000, 120)
    const y = clampNumber(position.y, 0, 4000, 120)
    return normalizeElement({
      id: uid('el'),
      type: def.type,
      label: def.label,
      x,
      y,
      rotation: 0,
      width: def.defaultWidth,
      height: def.defaultHeight,
      variant: def.defaultVariant,
      required: true,
      order: null,
      notes: '',
      difficulty: 1,
      skill: '',
      ...overrides,
    })
  }

  function createRoute(overrides = {}) {
    const now = new Date().toISOString()
    return normalizeRoute({
      id: uid('route'),
      title: 'Nuovo percorso',
      description: '',
      objective: '',
      level: 1,
      skills: [],
      estimatedDurationMinutes: 10,
      recommendedStudents: '1-4',
      materials: '',
      safetyNotes: '',
      canvas: { ...DEFAULT_ROUTE_CANVAS },
      elements: [],
      executionSequence: [],
      createdAt: now,
      updatedAt: now,
      ...overrides,
    })
  }

  function normalizeElement(element = {}) {
    const def = getElementType(element.type)
    return {
      id: String(element.id || uid('el')),
      type: def.type,
      label: String(element.label || element.name || def.label),
      x: clampNumber(element.x, 0, 4000, 0),
      y: clampNumber(element.y, 0, 4000, 0),
      rotation: numberOr(element.rotation, 0),
      width: clampNumber(element.width, 8, 2000, def.defaultWidth),
      height: clampNumber(element.height, 8, 2000, def.defaultHeight),
      variant: String(element.variant || element.color || def.defaultVariant),
      required: element.required !== false,
      order: element.order === '' || element.order == null ? null : numberOr(element.order, null),
      notes: String(element.notes || ''),
      difficulty: clampNumber(element.difficulty, 1, 10, 1),
      skill: String(element.skill || element.linkedSkill || ''),
    }
  }

  function normalizeCanvas(canvas = {}) {
    const sizeDef = getCanvasSize(canvas.size || DEFAULT_ROUTE_CANVAS.size)
    const isCustom = (canvas.size || sizeDef.key) === 'custom'
    const surfaceDef = getSurfacePreset(canvas.surface || DEFAULT_ROUTE_CANVAS.surface)
    const surface = surfaceDef.key
    return {
      size: isCustom ? 'custom' : sizeDef.key,
      surface,
      surfaceName: String(canvas.surfaceName || surfaceDef.label || DEFAULT_ROUTE_CANVAS.surfaceName),
      width: clampNumber(canvas.width, 240, 4000, sizeDef.width),
      height: clampNumber(canvas.height, 180, 4000, sizeDef.height),
      showGrid: canvas.showGrid !== false,
      gridSize: clampNumber(canvas.gridSize, 8, 96, DEFAULT_ROUTE_CANVAS.gridSize),
      zoom: clampNumber(canvas.zoom, 0.35, 2.5, DEFAULT_ROUTE_CANVAS.zoom),
      panX: numberOr(canvas.panX, DEFAULT_ROUTE_CANVAS.panX),
      panY: numberOr(canvas.panY, DEFAULT_ROUTE_CANVAS.panY),
    }
  }

  function normalizeRoute(route = {}) {
    const now = new Date().toISOString()
    const elements = Array.isArray(route.elements) ? route.elements.map(normalizeElement) : []
    return {
      id: String(route.id || uid('route')),
      title: String(route.title || 'Nuovo percorso'),
      description: String(route.description || ''),
      objective: String(route.objective || route.teachingObjective || ''),
      level: clampNumber(route.level, 1, 10, 1),
      skills: parseList(route.skills),
      estimatedDurationMinutes: clampNumber(route.estimatedDurationMinutes, 0, 600, 10),
      recommendedStudents: String(route.recommendedStudents || ''),
      materials: String(route.materials || ''),
      safetyNotes: String(route.safetyNotes || ''),
      canvas: normalizeCanvas(route.canvas || {}),
      elements,
      executionSequence: Array.isArray(route.executionSequence)
        ? route.executionSequence.map(item => String(item)).filter(Boolean)
        : elements
            .filter(element => element.order != null)
            .sort((a, b) => Number(a.order) - Number(b.order))
            .map(element => element.id),
      createdAt: String(route.createdAt || now),
      updatedAt: String(route.updatedAt || now),
    }
  }

  function applyCanvasSize(route, sizeKey) {
    const size = getCanvasSize(sizeKey)
    const canvas = {
      ...route.canvas,
      size: size.key,
      width: size.key === 'custom' ? route.canvas.width : size.width,
      height: size.key === 'custom' ? route.canvas.height : size.height,
    }
    return normalizeRoute({ ...route, canvas })
  }

  function applySurfacePreset(route, surfaceKey) {
    const surface = getSurfacePreset(surfaceKey)
    const isCustom = surface.key === 'custom'
    const canvas = {
      ...route.canvas,
      size: 'custom',
      surface: surface.key,
      surfaceName: isCustom ? route.canvas.surfaceName || surface.label : surface.label,
      width: isCustom ? route.canvas.width : surface.width,
      height: isCustom ? route.canvas.height : surface.height,
    }
    return normalizeRoute({ ...route, canvas })
  }

  window.RouteModels = {
    ROUTE_ELEMENT_TYPES,
    ROUTE_CANVAS_SIZES,
    ROUTE_SURFACE_PRESETS,
    ROUTE_VARIANT_COLORS,
    DEFAULT_ROUTE_CANVAS,
    getElementType,
    hasElementType,
    getCanvasSize,
    getSurfacePreset,
    createElement,
    createRoute,
    normalizeElement,
    normalizeRoute,
    parseList,
    applyCanvasSize,
    applySurfacePreset,
    uid,
  }
  window.ROUTE_ELEMENT_TYPES = ROUTE_ELEMENT_TYPES
})()
