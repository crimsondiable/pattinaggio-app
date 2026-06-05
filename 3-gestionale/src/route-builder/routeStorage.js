(function () {
  'use strict'

  const STORAGE_KEY = 'bladingManagerRoutes:v1'
  const meta = { backend: 'localStorage', version: 1 }
  const memory = new Map()

  function storage() {
    try {
      const key = '__route_storage_test__'
      window.localStorage.setItem(key, '1')
      window.localStorage.removeItem(key)
      return window.localStorage
    } catch {
      return {
        getItem: key => memory.get(key) || null,
        setItem: (key, value) => { memory.set(key, String(value)) },
        removeItem: key => { memory.delete(key) },
      }
    }
  }

  function readRawList() {
    try {
      const parsed = JSON.parse(storage().getItem(STORAGE_KEY) || '[]')
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  function persist(list) {
    storage().setItem(STORAGE_KEY, JSON.stringify(list, null, 2))
  }

  function list() {
    return readRawList()
      .map(route => window.RouteModels.normalizeRoute(route))
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
  }

  function get(id) {
    return list().find(route => String(route.id) === String(id)) || null
  }

  function save(route) {
    const now = new Date().toISOString()
    const normalized = window.RouteModels.normalizeRoute({ ...route, updatedAt: now })
    const routes = readRawList().filter(item => String(item.id) !== String(normalized.id))
    routes.unshift(normalized)
    persist(routes)
    return normalized
  }

  function remove(id) {
    const routes = readRawList().filter(item => String(item.id) !== String(id))
    persist(routes)
    return routes.length
  }

  function exists(id) {
    return readRawList().some(item => String(item.id) === String(id))
  }

  window.RouteStorage = { meta, list, get, save, remove, exists }
})()
