import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'

function declaration(source, name) {
  const start = source.search(new RegExp(`^(?:async )?function ${name}\\(`, 'm'))
  assert.ok(start >= 0, `Missing ${name}`)
  const rest = source.slice(start)
  const end = rest.slice(1).search(/^(?:async )?function /m)
  return end < 0 ? rest : rest.slice(0, end + 1)
}

function deferred() {
  let resolve
  const promise = new Promise(done => { resolve = done })
  return { promise, resolve }
}

function fixture(file, rpc = async () => ({ data: true, error: null })) {
  const source = readFileSync(new URL('../src/' + file, import.meta.url), 'utf8')
  let user = { id: 'A', email: 'ordinary@example.test', user_metadata: { role: 'admin' } }
  const context = vm.createContext({
    console: { warn() {} },
    currentUid: null, currentEmail: '', currentUserMetadata: {},
    currentSuperMaestroUid: null, superMaestroAccessVersion: 0, authIdentityVersion: 0,
    SUPER_MAESTRO_EMAIL: 'former-admin@example.test',
    godMode: false, godScope: 'all',
    sb: { rpc: name => name === 'is_super_maestro' ? rpc() : Promise.resolve({ data: null, error: { message: 'Unknown RPC' } }) },
    getCurrentAuthUser: async () => user,
    document: { getElementById: () => ({ hidden: false }) },
    clearBootstrapError() {}, appInited: false, appHistoryStarted: false,
  })
  if (file.includes('legacy')) vm.runInContext(source.slice(0, source.indexOf('var _a, _b;')), context)
  const names = ['isSuperMaestro', 'refreshCurrentAuthIdentity', 'handleAuthSession', 'initApp']
  if (/^(?:async )?function refreshSuperMaestroAccess\(/m.test(source)) names.push('refreshSuperMaestroAccess')
  vm.runInContext(names.map(name => declaration(source, name)).join('\n'), context)
  return { context, setUser(value) { user = value } }
}

for (const file of ['app.js', 'app-legacy.js']) {
  test(file + ': backend permission enables super maestro independently of email', async () => {
    const { context: c } = fixture(file)
    await c.refreshCurrentAuthIdentity()
    assert.equal(c.isSuperMaestro(), true)
  })

  test(file + ': email and editable metadata cannot grant denied backend permission', async () => {
    const f = fixture(file, async () => ({ data: false, error: null }))
    f.setUser({ id: 'A', email: 'former-admin@example.test', user_metadata: { role: 'admin', is_super_maestro: true } })
    await f.context.refreshCurrentAuthIdentity()
    assert.equal(f.context.isSuperMaestro(), false)
  })

  test(file + ': failed, malformed or unavailable role checks revoke prior access', async () => {
    for (const result of [
      { data: false, error: null }, { data: null, error: null },
      { data: 'true', error: null }, { data: true, error: { message: 'denied' } },
      new Error('offline'), undefined,
    ]) {
      const f = fixture(file)
      const c = f.context
      await c.refreshCurrentAuthIdentity()
      assert.equal(c.isSuperMaestro(), true)
      c.godMode = true
      c.godScope = 'mine'
      c.sb.rpc = result === undefined ? undefined : async () => {
        if (result instanceof Error) throw result
        return result
      }
      await c.refreshCurrentAuthIdentity()
      assert.equal(c.isSuperMaestro(), false)
      assert.equal(c.godMode, false)
      assert.equal(c.godScope, 'all')
    }
  })

  test(file + ': logout invalidates an outstanding permission response', async () => {
    const response = deferred()
    const { context: c } = fixture(file, () => response.promise)
    const loading = c.refreshCurrentAuthIdentity()
    await new Promise(setImmediate)
    await c.handleAuthSession(null)
    response.resolve({ data: true, error: null })
    await loading
    assert.equal(c.currentUid, null)
    assert.equal(c.isSuperMaestro(), false)
    assert.equal(c.godMode, false)
  })

  test(file + ': a late permission response for A cannot grant B access', async () => {
    const response = deferred()
    const f = fixture(file, () => response.promise)
    const c = f.context
    const loading = c.refreshCurrentAuthIdentity()
    await new Promise(setImmediate)
    f.setUser({ id: 'B', email: 'other@example.test', user_metadata: {} })
    c.sb.rpc = async () => ({ data: false, error: null })
    await c.refreshCurrentAuthIdentity()
    response.resolve({ data: true, error: null })
    await loading
    assert.equal(c.currentUid, 'B')
    assert.equal(c.isSuperMaestro(), false)
  })

  test(file + ': older checks for the same user cannot override a newer denial', async () => {
    const response = deferred()
    const { context: c } = fixture(file, () => response.promise)
    const loading = c.refreshCurrentAuthIdentity()
    await new Promise(setImmediate)
    c.sb.rpc = async () => ({ data: false, error: null })
    await c.refreshCurrentAuthIdentity()
    response.resolve({ data: true, error: null })
    await loading
    assert.equal(c.isSuperMaestro(), false)
  })

  test(file + ': switching sessions replaces the previous account and its privileged mode', async () => {
    const f = fixture(file)
    const c = f.context
    await c.refreshCurrentAuthIdentity()
    assert.equal(c.isSuperMaestro(), true)
    c.appInited = true
    c.godMode = true
    c.godScope = 'mine'
    f.setUser({ id: 'B', email: 'other@example.test', user_metadata: {} })
    c.sb.rpc = async () => ({ data: false, error: null })
    c.initApp = () => c.refreshCurrentAuthIdentity()
    await c.handleAuthSession({ user: { id: 'B' } })
    assert.equal(c.currentUid, 'B')
    assert.equal(c.isSuperMaestro(), false)
    assert.equal(c.godMode, false)
    assert.equal(c.godScope, 'all')
  })

  test(file + ': startup verifies the server role before rendering privileged controls', async () => {
    const { context: c } = fixture(file)
    let renderedRole = null
    c.sb.from = () => ({
      select() { return this }, eq() { return this }, order() { return this },
      then(resolve, reject) { return Promise.resolve({ data: [], error: null }).then(resolve, reject) },
    })
    Object.assign(c, {
      loadMaestroAvailabilitySlots: () => [], loadMaestroExcludedSlots: () => [],
      loadCalendarioItems: () => [], requiredQueryData: result => result.data,
      visibleCatalogSkills: rows => rows, loadSkillDefinitions: async () => [],
      loadLocations: async () => [],
      renderGodPanel() { renderedRole = c.isSuperMaestro() }, renderAllievi() {},
      consumeInitialRoute: () => ({ name: 'home', id: null }), showView() {},
      scheduleNuovaLezioneRouteRepair() {}, refreshDashboardData: async () => {},
    })
    await c.initApp()
    assert.equal(renderedRole, true)
  })
}
