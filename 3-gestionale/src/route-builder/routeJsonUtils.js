(function () {
  'use strict'

  function routeToJson(route) {
    return JSON.stringify(window.RouteModels.normalizeRoute(route), null, 2)
  }

  function parseRouteJson(text) {
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new Error('File JSON non valido.')
    }
    if (!parsed || typeof parsed !== 'object') throw new Error('Il JSON non contiene un percorso.')
    if (!Array.isArray(parsed.elements)) throw new Error('Il percorso deve contenere una lista elements.')
    return window.RouteModels.normalizeRoute(parsed)
  }

  function safeFilename(value) {
    return String(value || 'percorso')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '')
      .slice(0, 64) || 'percorso'
  }

  function downloadRouteJson(route) {
    const normalized = window.RouteModels.normalizeRoute(route)
    const blob = new Blob([routeToJson(normalized)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${safeFilename(normalized.title)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function parseRouteFile(file) {
    if (!file) throw new Error('Scegli un file JSON da importare.')
    return parseRouteJson(await file.text())
  }

  window.RouteJsonUtils = {
    routeToJson,
    parseRouteJson,
    downloadRouteJson,
    parseRouteFile,
  }
})()
