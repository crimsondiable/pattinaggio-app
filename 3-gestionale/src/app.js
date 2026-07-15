const SUPA_URL = 'https://mhioneawefsvagbccsum.supabase.co'
const SUPA_KEY = 'sb_publishable_SGGdSVxCEAXLgMGAjRksMQ_PbIvMIuH'

let sb, allAllievi = [], allSkills = [], allPrereqs = [], allProgressi = [], skillDefinitions = [], appInited = false, editingAllieviId = null, editingGruppoNome = null, currentUid = null, currentEmail = '', currentUserMetadata = {}, mostraArchiviati = false, filtroGruppo = null, filtroVacanza = false, filtroListaAllievi = 'attivi', filtroLezioni = 'all', filtroLezioniAperte = false, lezioniCache = null, lezioniDettagliEspansi = false, lezionePresetAllievoId = null, editingLezioneId = null, editingLezioneAllieviIds = [], editingLezioneSkillRows = {}, editingLezioneGroupFeedback = {}, gruppiEspansi = new Set(), lezioniAnniEspansi = new Set(), schedaLezioniAnniEspansi = new Set(), lezioniAnniDefaultAperto = false, schedaLezioniAnniDefaultAperti = new Set(), lezioneBackAllievoId = null, lezioneBackGruppoNome = null, currentSchedaId = null, currentGruppoNome = null, currentLezioneId = null, editReturnTarget = null, locationBackTarget = null, skillTreeEditMode = false, catalogSkillEditMode = false, catalogSkillBranchFilters = new Set(), pendingSpecialGuestId = null, skillCatalogContext = null, skillDetailContext = null, appHistoryStarted = false, appHistoryApplying = false
let luoghiLezioneCache = new Map(), luogoSuggestTimer = null, allLocations = [], locationsLoaded = false, globalSearchTimer = null, lezioneFormMode = 'standard'
let mappaTipoFiltro = 'all', mappaSelectedLocationName = null, mappaSingleFocusName = null, mappaPuntiEspansi = false, mappaPuntiEspansiLoaded = false
let calendarioSuggestTimer = null
let editingThemeColorName = null
const lezioniColumnState = { data: false, luogo: false, note: false }
const LEZIONE_DRAFT_KEY = 'lezioneDraftInCorso'
const GROUP_SKILL_ROWS_KEY = '__group__'
const FREE_LESSON_SKILL_ROWS_KEY = '__free__'
const APP_NOTES_KEY = 'bladingManagerAppNotes'
const APP_NOTES_REMOTE_KEY = 'gestionale'
const THEME_PRIMARY_COLOR_KEY = 'bladingManagerPrimaryColor'
const THEME_PRIMARY_COLOR_PRESETS_KEY = 'bladingManagerPrimaryColorPresets'
const DEFAULT_PRIMARY_COLOR = '#6EE7F9'
const DEFAULT_PRIMARY_DARK = '#22B8CF'
const LOCATION_MAP_COORDS_KEY = 'bladingManagerLocationMapCoords'
const LOCATION_BACK_TARGET_KEY = 'bladingManagerLocationBackTarget'
const MILANO_MAP_BOUNDS = Object.freeze({ north: 45.5433822361299, south: 45.38158101556157, west: 9.034115819444445, east: 9.286647969771241 })
const MILANO_MAP_VIEWBOX = Object.freeze({ width: 1114, height: 993 })
const MILANO_MAP_IMAGE = './mappa-milano-quartieri-dark@2x.png'
const LOCATION_CATEGORIES = ['Location', 'Parco', 'Ciclabile', 'Piazza', 'Pista di pattinaggio', 'Skatepark', 'Strada', 'Campi da basket', 'Palestra', 'Casa allievo', 'Altro']
const LOCATION_NORMALIZATION_GROUPS = [
  { nome: "Sant'Agostino", tipo: 'street', tipologia: 'Piazza', aliases: ["S.Agostino", "S. Agostino", "Piazza Sant'Agostino", "Piazza Sant'Agostino, 20123 Milano MI, Italia", "Sant'Agostino - casa"] },
  { nome: 'Tolstoj / Skatepark Tolstoj', tipo: 'skatepark', tipologia: 'Skatepark', aliases: ['Giardini di via Tolstoj Savona', 'Giardini di via Tolstoj Savona, 20144 Milano MI, Italia', 'Casa - skatepark Tolstoj'] },
  { nome: "Barrio's / Parco Barona", tipo: 'spot', tipologia: 'Parco', aliases: ["Casa - Barrio's", "Barrio's - parco Barona"] },
  { nome: 'Naviglio Pavese', tipo: 'street', tipologia: 'Ciclabile', aliases: ['Casa - naviglio Pavese', 'Ciclabile naviglio pavese'] },
  { nome: 'Castelletto / Robecco', tipo: 'spot', tipologia: 'Location', aliases: ['parco castelletto', 'cimitero castelletto'] },
  { nome: 'Casa', tipo: 'privato', tipologia: 'Casa allievo', private: true, aliases: ['Casa'] },
]
const MILANO_COORD_HINTS = [
  { match: ['centro'], x: 675, y: 478, label: 'Centro' },
  { match: ['arco della pace', 'arena', 'pagano'], x: 599, y: 431, label: 'Arco della Pace / Arena' },
  { match: ['garibaldi', 'moscova', 'porta nuova'], x: 680, y: 392, label: 'Garibaldi / Porta Nuova' },
  { match: ['cenisio', 'sarpi', 'isola'], x: 638, y: 326, label: 'Isola' },
  { match: ['porta genova', 'ticinese'], x: 632, y: 522, label: 'Ticinese' },
  { match: ['quadronno', 'palestro', 'guastalla'], x: 733, y: 490, label: 'Guastalla' },
  { match: ['fiera', 'city life', 'sempione', 'portello'], x: 523, y: 381, label: 'City Life / Portello' },
  { match: ['centrale', 'repubblica'], x: 760, y: 368, label: 'Centrale' },
  { match: ['porta venezia', 'indipendenza'], x: 778, y: 452, label: 'Porta Venezia' },
  { match: ['porta romana', 'p romana', 'p. romana', 'cadore', 'montenero', 'viale emilio caldara', 'emilio caldara'], x: 768, y: 547, label: 'Porta Romana' },
  { match: ['sant agostino', 's agostino', 's.agostino', 'piazza sant agostino'], x: 596, y: 520, label: 'Sant Agostino' },
  { match: ['romolo', 'area pozzi', 'via argelati', 'parco di via argelati', 'segantini'], x: 596, y: 594, label: 'Romolo' },
  { match: ['naviglio pavese', 'ciclabile naviglio'], x: 616, y: 640, label: 'Naviglio Pavese' },
  { match: ['navigli'], x: 629, y: 579, label: 'Navigli' },
  { match: ['solari', 'washington', 'giardini di via tolstoj', 'tolstoj savona', 'via tolstoj', 'savona'], x: 549, y: 508, label: 'Solari' },
  { match: ['napoli', 'soderini'], x: 507, y: 547, label: 'Soderini' },
  { match: ['bande nere', 'inganni'], x: 429, y: 524, label: 'Inganni' },
  { match: ['san siro', 'trenno'], x: 325, y: 343, label: 'San Siro' },
  { match: ['certosa', 'cascina merlata'], x: 396, y: 216, label: 'Certosa' },
  { match: ['maggiolina', 'istria'], x: 745, y: 275, label: 'Maggiolina' },
  { match: ['pasteur', 'rovereto'], x: 820, y: 306, label: 'Pasteur' },
  { match: ['citta studi', 'città studi', 'susa'], x: 854, y: 411, label: 'Citta Studi' },
  { match: ['porta vittoria', 'p vittoria', 'p. vittoria', 'lodi'], x: 840, y: 566, label: 'Porta Vittoria' },
  { match: ['affori', 'bovisa'], x: 540, y: 184, label: 'Bovisa' },
  { match: ['bicocca', 'niguarda'], x: 711, y: 141, label: 'Bicocca' },
  { match: ['precotto', 'turro'], x: 843, y: 196, label: 'Precotto' },
  { match: ['cimiano', 'crescenzago', 'adriano'], x: 945, y: 202, label: 'Cimiano' },
  { match: ['udine', 'lambrate', 'parco lambro'], x: 950, y: 354, label: 'Lambrate' },
  { match: ['forlanini'], x: 965, y: 539, label: 'Forlanini' },
  { match: ['corvetto', 'rogoredo'], x: 852, y: 685, label: 'Corvetto' },
  { match: ['ponte lambro', 'santa giulia'], x: 968, y: 660, label: 'Santa Giulia' },
  { match: ['ripamonti', 'vigentino'], x: 791, y: 759, label: 'Ripamonti' },
  { match: ['abbiategrasso', 'chiesa rossa'], x: 659, y: 797, label: 'Chiesa Rossa' },
  { match: ['famagosta', 'barona', 'barrio', 'via felice venosta', 'felice venosta'], x: 501, y: 677, label: 'Famagosta / Barona' },
  { match: ['bisceglie', 'baggio', 'olmi'], x: 211, y: 508, label: 'Bisceglie' },
  { match: ['istituto leopardi', 'leopardi'], x: 599, y: 431, label: 'Centro ovest' },
]
const MAESTRO_AVAILABILITY_METADATA_KEY = 'disponibilita_maestro_slots'
const MAESTRO_EXCLUDED_METADATA_KEY = 'disponibilita_maestro_escluse_slots'
const MAESTRO_AVAILABILITY_STORAGE_PREFIX = 'bladingManagerMaestroAvailability'
const MAESTRO_EXCLUDED_STORAGE_PREFIX = 'bladingManagerMaestroExcluded'
const CALENDARIO_METADATA_KEY = 'calendario_settimanale_items'
const CALENDARIO_STORAGE_PREFIX = 'bladingManagerCalendarioSettimanale'
const MAP_POINTS_EXPANDED_STORAGE_KEY = 'bladingManagerMappaPuntiEspansi'
const APPOINTMENT_SELECTION_STORAGE_KEY = 'bladingManagerAppointmentSelection'
const APPOINTMENT_PRIORITY_STORAGE_KEY = 'bladingManagerAppointmentPriorityModes'
const APPOINTMENT_TRAVEL_STORAGE_KEY = 'bladingManagerAppointmentTravelTimes'
const AVAILABILITY_DAYS = [
  { value: 1, label: 'Lunedi', short: 'Lun' },
  { value: 2, label: 'Martedi', short: 'Mar' },
  { value: 3, label: 'Mercoledi', short: 'Mer' },
  { value: 4, label: 'Giovedi', short: 'Gio' },
  { value: 5, label: 'Venerdi', short: 'Ven' },
  { value: 6, label: 'Sabato', short: 'Sab' },
  { value: 0, label: 'Domenica', short: 'Dom' },
]
let AVAILABILITY_START_MIN = 8 * 60
let AVAILABILITY_END_MIN = 21 * 60
const AVAILABILITY_STEP_MIN = 15
const AVAILABILITY_HOUR_PX = 30
const APPOINTMENT_BUFFER_MIN = 15
const APPOINTMENT_MIN_LESSON_MIN = 60
const APPOINTMENT_DEFAULT_WEEKLY_COUNT = 1
const APPOINTMENT_MAX_WEEKLY_COUNT = 7
const APPOINTMENT_GROUP_TARGET_PREFIX = 'gruppo:'
const APPOINTMENT_HEAT_START_MIN = 13 * 60
const APPOINTMENT_HEAT_END_MIN = 15 * 60 + 30
const APPOINTMENT_CONSECUTIVE_PREFER = 'prefer'
const APPOINTMENT_CONSECUTIVE_STRICT = 'strict'
let maestroAvailabilitySlots = [], maestroExcludedSlots = [], calendarioItems = [], appuntamentiSelectedAllievoId = null, appuntamentiAllieviQuery = ''
let availabilityDragState = null
let calendarioDragId = null
let appointmentSelectedAllieviIds = null
let appointmentPriorityModes = new Map()
let appointmentCurrentVariant = null
let appointmentGenerationNonce = 0
let appointmentPreviewDragId = null
const availabilityUndoStacks = new Map()
const availabilityEditModes = new Map()
let lastAppointmentScheduleVariants = []
const importedAppointmentVariantIds = new Set()
let godMode = false, godScope = 'all', shareContext = null
let appNotesTimer = null, appNotesRemoteAvailable = null
let appNotesReturnView = null
const SUPER_MAESTRO_EMAIL = 'francesco.grinovero@gmail.com'
const APP_BOOT_HASH = window.location.hash
let appBootRouteConsumed = false

const safeStorage = (() => {
  try {
    const storage = window.localStorage
    const testKey = '__blading_manager_storage_test__'
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return storage
  } catch {
    const memory = new Map()
    return {
      getItem: key => memory.has(key) ? memory.get(key) : null,
      setItem: (key, value) => { memory.set(key, String(value)) },
      removeItem: key => { memory.delete(key) },
    }
  }
})()

applyPrimaryColorFromStorage()

function localDateIso(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function isSuperMaestro() {
  return currentEmail === SUPER_MAESTRO_EMAIL
}
let tuningMode = 'parametri', tuningCard = null, tuningCount = 0, tuningAlertCount = 0, tuningLocal = [], tuningRecentSkillIds = []
let skillLabView = 'overview', skillLabUsageRows = [], skillLabLoaded = false, skillLabLoading = false
let skillLabFilters = { query: '', branch: '', usage: '', quality: '' }

function supabaseClientIsV2(client = sb) {
  return !!(client && client.auth && typeof client.auth.getSession === 'function')
}

function createSupabaseClientCompat() {
  const client = supabase.createClient(SUPA_URL, SUPA_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: 'blading-manager-auth',
      storage: safeStorage,
    }
  })
  if (supabaseClientIsV2(client)) return client
  return supabase.createClient(SUPA_URL, SUPA_KEY, {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    localStorage: safeStorage,
    multiTab: true,
  })
}

async function getCurrentAuthSession() {
  if (!sb?.auth) return null
  if (supabaseClientIsV2()) {
    const { data: { session } } = await sb.auth.getSession()
    return session || null
  }
  if (typeof sb.auth.session === 'function') return sb.auth.session()
  return null
}

async function getCurrentAuthUser() {
  if (!sb?.auth) return null
  if (typeof sb.auth.getUser === 'function') {
    try {
      const { data: { user }, error } = await sb.auth.getUser()
      if (user && !error) return user
    } catch (_e) {}
  }
  if (typeof sb.auth.user === 'function') return sb.auth.user()
  const session = await getCurrentAuthSession()
  return session?.user || null
}

async function refreshCurrentAuthIdentity() {
  const user = await getCurrentAuthUser()
  currentUid = user?.id || null
  currentEmail = (user?.email || '').toLowerCase()
  currentUserMetadata = user?.user_metadata || {}
  return currentUid
}

async function requireCurrentUidForWrite(errEl = null) {
  let uid = null
  try {
    uid = await refreshCurrentAuthIdentity()
  } catch (_e) {}
  uid = uid || currentUid
  if (uid) return uid
  const message = 'Sessione maestro non pronta: esci, rientra e riprova a salvare.'
  if (errEl) {
    errEl.textContent = message
    errEl.classList.add('show')
  }
  throw new Error(message)
}

function supabaseErrorText(error) {
  if (!error) return ''
  return [error.message, error.details, error.hint, error.code].filter(Boolean).join(' · ')
}

function requiredQueryData(result, label) {
  if (result?.error) {
    throw new Error(`Caricamento ${label} fallito: ${supabaseErrorText(result.error) || 'errore Supabase sconosciuto'}`)
  }
  return result?.data || []
}

function saveBlockedByPolicy(error) {
  const text = supabaseErrorText(error)
  return /row-level security|violates.*policy|permission denied|42501/i.test(text)
}

function saveErrorMessage(error, fallback = 'Errore di rete. Riprova.') {
  const detail = supabaseErrorText(error)
  if (saveBlockedByPolicy(error)) {
    return `Salvataggio bloccato dal database: la sessione non ha permesso di scrittura. Dettaglio: ${detail || 'policy RLS'}`
  }
  return detail || error?.message || fallback
}

async function signInWithPasswordCompat(email, password) {
  if (supabaseClientIsV2()) {
    return sb.auth.signInWithPassword({ email, password })
  }
  if (typeof sb?.auth?.signIn === 'function') {
    const result = await sb.auth.signIn({ email, password })
    return { data: { session: result.session || null, user: result.user || null }, error: result.error || null }
  }
  throw new Error('Client login non disponibile.')
}

async function signOutCompat() {
  if (!sb?.auth?.signOut) return
  await sb.auth.signOut()
}

async function updateCurrentUserMetadata(payload) {
  if (!sb?.auth) return { user: null, error: new Error('Client auth non disponibile.') }
  if (supabaseClientIsV2() && typeof sb.auth.updateUser === 'function') {
    const { data, error } = await sb.auth.updateUser({ data: payload })
    return { user: data?.user || null, error }
  }
  if (typeof sb.auth.update === 'function') {
    const result = await sb.auth.update({ data: payload })
    return { user: result?.user || result?.data || null, error: result?.error || null }
  }
  return { user: null, error: new Error('Aggiornamento utente non disponibile.') }
}

try {
  sb = createSupabaseClientCompat()
  window.sb = sb
} catch(e) {
  document.getElementById('login-err').textContent = 'Errore SDK: ' + e.message + ' — apri il file direttamente nel browser (non nel preview).'
  document.getElementById('login-err').classList.add('show')
}

// ── Motion / Anime.js ────────────────────────────────────────────────

const motion = (() => {
  const lib = window.anime
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  document.body.classList.toggle('motion-ready', !!lib && !reduce)

  function run(targets, params) {
    if (!lib || reduce) return
    lib.animate(targets, params)
  }

  function visibleView() {
    return document.querySelector('#screen-app main > section:not([hidden])')
  }

  function view(name) {
    const root = document.getElementById(`view-${name}`) || visibleView()
    if (!root) return
    run(root, {
      opacity: [0, 1],
      y: [10, 0],
      duration: 260,
      ease: 'outCubic'
    })
    cards(root)
    tableRows(root)
  }

  function cards(root = document) {
    if (!lib || reduce) return
    const items = root.querySelectorAll('.section-header, .card, .table-wrap')
    if (!items.length) return
    run(items, {
      opacity: [0, 1],
      y: [12, 0],
      duration: 420,
      delay: lib.stagger(35),
      ease: 'outCubic'
    })
  }

  function tableRows(root = document) {
    if (!lib || reduce) return
    const rows = root.querySelectorAll('tbody tr')
    if (!rows.length) return
    run(rows, {
      opacity: [0, 1],
      x: [-6, 0],
      duration: 300,
      delay: lib.stagger(18),
      ease: 'outCubic'
    })
  }

  function softFocus(target) {
    if (!lib || reduce) return
    if (!target || target.dataset.motionFocus === '1') return
    target.dataset.motionFocus = '1'
    run(target.querySelectorAll('td'), {
      backgroundColor: [
        'rgba(110,231,249,.16)',
        'rgba(110,231,249,.08)'
      ],
      duration: 260,
      ease: 'outCubic',
      complete: () => { target.dataset.motionFocus = '0' }
    })
  }

  function press(target) {
    if (!target) return
    run(target, {
      scale: [1, .97, 1],
      duration: 180,
      ease: 'outCubic'
    })
  }

  return { view, cards, tableRows, softFocus, press }
})()

document.addEventListener('pointerdown', e => {
  const target = e.target.closest('.btn, .chip, nav button, .scheda-tab')
  motion.press(target)
})

document.addEventListener('click', e => {
  const newSkillBtn = e.target.closest('[data-lesson-action="new-skill"]')
  if (!newSkillBtn || newSkillBtn.dataset.handledInline === '1') return
  e.preventDefault()
  addNewLessonSkillRow(newSkillBtn.dataset.ownerId)
})

// ── Auth ──────────────────────────────────────────────────────────────

let bootstrapState = 'signed-out'

function clearBootstrapError() {
  document.getElementById('app-bootstrap-error')?.remove()
  const loginError = document.getElementById('login-err')
  if (loginError?.dataset.bootstrapError === '1') {
    loginError.textContent = ''
    loginError.classList.remove('show')
    delete loginError.dataset.bootstrapError
  }
}

function showBootstrapError(error) {
  bootstrapState = 'error'
  const message = error?.message || 'Inizializzazione non riuscita.'
  console.error('Bootstrap applicazione fallito', error)
  const appScreen = document.getElementById('screen-app')
  if (appScreen && !appScreen.hidden) {
    document.getElementById('app-bootstrap-error')?.remove()
    const banner = document.createElement('div')
    banner.id = 'app-bootstrap-error'
    banner.className = 'msg msg-err show'
    banner.setAttribute('role', 'alert')
    const text = document.createElement('span')
    text.textContent = `${message} `
    const retry = document.createElement('button')
    retry.type = 'button'
    retry.className = 'btn btn-outline btn-sm'
    retry.textContent = 'Riprova'
    retry.addEventListener('click', retryBootstrap)
    banner.append(text, retry)
    appScreen.querySelector('main')?.prepend(banner)
    return
  }
  const loginError = document.getElementById('login-err')
  if (loginError) {
    loginError.textContent = ''
    const text = document.createElement('span')
    text.textContent = `${message} `
    const retry = document.createElement('button')
    retry.type = 'button'
    retry.className = 'btn btn-outline btn-sm'
    retry.textContent = 'Riprova'
    retry.addEventListener('click', retryBootstrap)
    loginError.append(text, retry)
    loginError.dataset.bootstrapError = '1'
    loginError.classList.add('show')
  }
}

async function retryBootstrap() {
  if (bootstrapState === 'loading') return
  clearBootstrapError()
  appInited = false
  try {
    await bootstrapAuth()
  } catch (error) {
    showBootstrapError(error)
  }
}

async function handleAuthSession(session) {
  if (session) {
    document.getElementById('screen-login').hidden = true
    document.getElementById('screen-app').hidden   = false
    if (!appInited) {
      bootstrapState = 'loading'
      clearBootstrapError()
      appInited = true
      try {
        await initApp()
        bootstrapState = 'ready'
      } catch (error) {
        appInited = false
        throw error
      }
    }
  } else {
    bootstrapState = 'signed-out'
    clearBootstrapError()
    appInited = false
    appHistoryStarted = false
    currentUid = null
    currentEmail = ''
    currentUserMetadata = {}
    document.getElementById('screen-login').hidden = false
    document.getElementById('screen-app').hidden   = true
  }
}

sb?.auth?.onAuthStateChange?.((_e, session) => {
  void handleAuthSession(session).catch(showBootstrapError)
})

async function bootstrapAuth() {
  if (!sb) return
  const session = await getCurrentAuthSession()
  await handleAuthSession(session)
}

void bootstrapAuth().catch(showBootstrapError)

async function doLogin() {
  const email = document.getElementById('login-email').value.trim()
  const pw    = document.getElementById('login-pw').value
  const errEl = document.getElementById('login-err')
  errEl.classList.remove('show')
  try {
    const { error } = await signInWithPasswordCompat(email, pw)
    if (error) throw error
  } catch (e) {
    if (window.legacyPasswordLogin) {
      window.legacyPasswordLogin(email, pw, errEl, e)
      return
    }
    errEl.textContent = e.message || 'Errore di connessione. Controlla la console.'
    errEl.classList.add('show')
  }
}

async function doLogout() {
  await signOutCompat()
}

// ── Init ──────────────────────────────────────────────────────────────

function initialRouteFromHash(hashValue = window.location.hash) {
  const raw = String(hashValue || '').replace(/^#/, '')
  if (!raw) return { name: 'home', id: null }
  const [encodedName, ...encodedRest] = raw.split('/')
  let name = ''
  let id = null
  try {
    name = decodeURIComponent(encodedName || '')
    id = encodedRest.length ? decodeURIComponent(encodedRest.join('/')) : null
  } catch {
    return { name: 'home', id: null }
  }
  const allowed = ['home','allievi','scheda','gruppo','lezioni','lesson-radial-planner','percorsi','calendario','appuntamenti','analisi','location','mappa','lezione','nuova-lezione','nuovo-allievo','nuovo-gruppo','skills','tuning','theme-colors','app-notes']
  if (!allowed.includes(name)) return { name: 'home', id: null }
  if (routeNeedsId(name) && !id) return { name: 'home', id: null }
  return { name, id }
}

function consumeInitialRoute() {
  if (appBootRouteConsumed) return { name: 'home', id: null }
  appBootRouteConsumed = true
  return initialRouteFromHash(APP_BOOT_HASH)
}

async function initApp() {
  const user = await getCurrentAuthUser()
  currentUid = user?.id || null
  currentEmail = (user?.email || '').toLowerCase()
  currentUserMetadata = user?.user_metadata || {}
  maestroAvailabilitySlots = loadMaestroAvailabilitySlots(currentUserMetadata)
  maestroExcludedSlots = loadMaestroExcludedSlots(currentUserMetadata)
  calendarioItems = loadCalendarioItems(currentUserMetadata)

  const [allieviResult, skillsResult, prerequisitiResult, progressiResult] = await Promise.all([
    sb.from('allievi').select('*').eq('stato', 'attivo').order('nome'),
    sb.from('skills').select('*').order('livello'),
    sb.from('prerequisiti_skill').select('*'),
    sb.from('progressi_allievo').select('allievo_id, skill_id, stadio')
  ])
  const a = requiredQueryData(allieviResult, 'allievi')
  const s = requiredQueryData(skillsResult, 'skill')
  const p = requiredQueryData(prerequisitiResult, 'prerequisiti')
  const pr = requiredQueryData(progressiResult, 'progressi')
  allAllievi = a
  allSkills  = visibleCatalogSkills(s)
  allPrereqs = p
  allProgressi = pr
  skillDefinitions = await loadSkillDefinitions()
  loadLocations().catch(error => console.warn('locations non precaricate', error))
  renderGodPanel()
  renderAllievi()
  const initialRoute = consumeInitialRoute()
  showView(initialRoute.name, initialRoute.id || undefined)
  scheduleNuovaLezioneRouteRepair()
  await refreshDashboardData()
}

async function loadSkillDefinitions() {
  const { data, error } = await sb.from('skill_definizioni').select('*')
  if (error) {
    const text = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`
    if (!/skill_definizioni|schema cache|could not find the table|does not exist/i.test(text)) console.warn('skill_definizioni non caricata', error)
    return []
  }
  return visibleCatalogSkills(data || [])
}

function isOwnedByCurrentMaestro(record = {}) {
  return !record?.maestro_id || String(record.maestro_id) === String(currentUid || '') || (godMode && isSuperMaestro())
}

function canShareAllievo(allievo = null) {
  if (!allievo || !currentUid) return false
  return isSuperMaestro() || !allievo.maestro_id || String(allievo.maestro_id) === String(currentUid)
}

function shareableGruppoMembri(gruppo) {
  const membri = gruppoMembri(gruppo)
  if (!membri.length || !membri.every(canShareAllievo)) return []
  return membri
}

function canShareGruppo(gruppo) {
  return !!gruppo && shareableGruppoMembri(gruppo).length > 0
}

function canEditAllievoAddress(allievo = null) {
  return !allievo || isOwnedByCurrentMaestro(allievo)
}

function canViewAllievoAddress(allievo = null) {
  if (!allievo) return true
  if (canEditAllievoAddress(allievo)) return true
  return !!allievo.profilo?.indirizzo_condiviso
}

function visibleAllievoAddress(allievo = {}) {
  const profilo = allievo?.profilo || {}
  if (!canViewAllievoAddress(allievo)) return { indirizzo: '', casa: '' }
  return {
    indirizzo: profilo.indirizzo || '',
    casa: profilo.casa || '',
    casa_latitudine: profilo.casa_latitudine ?? profilo.casa_lat ?? null,
    casa_longitudine: profilo.casa_longitudine ?? profilo.casa_lng ?? profilo.casa_lon ?? null,
  }
}

function locationCategoryOptions(selected = 'Location') {
  const value = selected && LOCATION_CATEGORIES.includes(selected) ? selected : (selected || 'Location')
  const options = LOCATION_CATEGORIES.includes(value) ? LOCATION_CATEGORIES : [...LOCATION_CATEGORIES, value]
  return options.map(t => `<option value="${esc(t)}" ${t === value ? 'selected' : ''}>${esc(t)}</option>`).join('')
}

function locationAliasKey(value) {
  return normalizeText(value || '').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function normalizedLocationGroupForName(nome = '') {
  const key = locationAliasKey(nome)
  if (!key) return null
  return LOCATION_NORMALIZATION_GROUPS.find(group =>
    locationAliasKey(group.nome) === key || (group.aliases || []).some(alias => locationAliasKey(alias) === key)
  ) || null
}

function normalizedLocationName(nome = '') {
  return normalizedLocationGroupForName(nome)?.nome || String(nome || '').trim()
}

function locationDbId(record = {}) {
  return record?.id || record?.location_id || null
}

function locationRecordMatchesName(record = {}, nome = '') {
  if (!record || !nome) return false
  const direct = normalizeText(record.nome || '') === normalizeText(nome || '')
  if (direct) return true
  return normalizeText(normalizedLocationName(record.nome || '')) === normalizeText(normalizedLocationName(nome || ''))
}

function locationRecordById(id) {
  if (!id) return null
  return allLocations.find(location => String(location.id || '') === String(id)) || null
}

function locationType(record = {}) {
  const group = normalizedLocationGroupForName(record.nome || '')
  return record.tipo || group?.tipo || record.tipologia || 'Location'
}

function locationTipologia(record = {}) {
  const group = normalizedLocationGroupForName(record.nome || '')
  return record.tipologia || group?.tipologia || record.tipo || 'Location'
}

function isPrivateLocation(record = {}) {
  const typeText = normalizeText([record.tipo, record.tipologia, record.nome, record.note, ...(record.tags || [])].filter(Boolean).join(' '))
  return normalizedLocationGroupForName(record.nome || '')?.private || /\b(casa|home|abitazione|privato)\b/.test(typeText)
}

function locationGoogleMapsUrl(record = {}) {
  if (record.google_maps_url) return record.google_maps_url
  if (isPrivateLocation(record) && !record.maps_confermato) return ''
  const coords = locationCoordinatesFromRecord(record)
  if (coords) return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
  const query = String(record.indirizzo || record.nome || '').trim()
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : ''
}

function openLocationMaps(nomeOrId) {
  const record = locationRecordById(nomeOrId) || locationRecordByName(nomeOrId) || { nome: nomeOrId }
  const url = locationGoogleMapsUrl(record)
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

function canEditLocation(record = null) {
  if (!record) return true
  if (record.source === 'allievo-casa') return canEditAllievoAddress(allievoById(record.allievo_id))
  return isOwnedByCurrentMaestro(record)
}

function canViewLocation(record = null) {
  if (!record) return true
  return canEditLocation(record) || !!record.condivisa
}

function locationMapStorageKey(nome) {
  return normalizeText(nome || '')
}

function loadLocationMapCoordsLocal() {
  try {
    return JSON.parse(safeStorage.getItem(LOCATION_MAP_COORDS_KEY) || '{}') || {}
  } catch {
    return {}
  }
}

function saveLocationMapCoordsLocal(nome, latitudine, longitudine, originalName = null) {
  const key = locationMapStorageKey(nome)
  if (!key) return
  const lat = parseMapCoordinate(latitudine)
  const lng = parseMapCoordinate(longitudine)
  const stored = loadLocationMapCoordsLocal()
  const originalKey = locationMapStorageKey(originalName)
  if (originalKey && originalKey !== key) delete stored[originalKey]
  if (lat === null || lng === null) delete stored[key]
  else stored[key] = { nome, latitudine: lat, longitudine: lng, updated_at: new Date().toISOString() }
  safeStorage.setItem(LOCATION_MAP_COORDS_KEY, JSON.stringify(stored))
}

function parseMapCoordinate(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(String(value).replace(',', '.').trim())
  return Number.isFinite(n) ? n : null
}

function locationCoordinatesFromRecord(record = {}) {
  const nested = record.coordinate || record.coordinates || record.mappa || {}
  const lat = parseMapCoordinate(record.latitudine ?? record.latitude ?? record.lat ?? nested.latitudine ?? nested.latitude ?? nested.lat)
  const lng = parseMapCoordinate(record.longitudine ?? record.longitude ?? record.lng ?? record.lon ?? nested.longitudine ?? nested.longitude ?? nested.lng ?? nested.lon)
  return lat === null || lng === null ? null : { lat, lng }
}

function normalizeMapMatchText(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function inferLocationCoordinates(record = {}) {
  const haystack = normalizeMapMatchText([record.nome, record.indirizzo, record.note, record.tipologia].filter(Boolean).join(' '))
  if (!haystack) return null
  const found = MILANO_COORD_HINTS.find(hint => hint.match.some(term => haystack.includes(normalizeMapMatchText(term))))
  if (!found) return null
  const mapCoords = found.x !== undefined && found.y !== undefined ? mappaCoordFromPoint(found.x, found.y) : null
  return {
    lat: found.lat ?? mapCoords?.lat,
    lng: found.lng ?? mapCoords?.lng,
    x: found.x,
    y: found.y,
    source: 'stimato',
    label: found.label,
  }
}

function locationMapCoords(record = {}) {
  const saved = locationCoordinatesFromRecord(record)
  if (saved) return { ...saved, source: 'salvato' }
  return inferLocationCoordinates(record)
}

function locationWithLocalMapCoords(record = {}) {
  const remoteCoords = locationCoordinatesFromRecord(record)
  if (remoteCoords) return record
  const local = loadLocationMapCoordsLocal()[locationMapStorageKey(record.nome)]
  return local ? { ...record, latitudine: local.latitudine, longitudine: local.longitudine } : record
}

function isMissingLocationTableError(error) {
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`
  if (isMissingLocationMapColumnsError(error)) return false
  return /locations.*(schema cache|does not exist|could not find|not found)|relation .*locations.*does not exist|table .*locations.*does not exist/i.test(text)
}

function isMissingLocationMapColumnsError(error) {
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`
  return /(latitudine|longitudine|latitude|longitude).*(schema cache|column|not found|could not find)|(schema cache|column|not found|could not find).*(latitudine|longitudine|latitude|longitude)/i.test(text)
}

function readCoordinateInputs(latId, lngId) {
  const latRaw = document.getElementById(latId)?.value.trim() || ''
  const lngRaw = document.getElementById(lngId)?.value.trim() || ''
  if (!latRaw && !lngRaw) return { lat: null, lng: null }
  const lat = parseMapCoordinate(latRaw)
  const lng = parseMapCoordinate(lngRaw)
  if (lat === null || lng === null) return { error: 'Inserisci sia latitudine sia longitudine in formato numerico.' }
  return { lat, lng }
}

function buildLocationPayload({ nome, tipologia, indirizzo, note, latitudine = null, longitudine = null, allievo_id = null, condivisa = false }) {
  const payload = {
    nome,
    tipologia: tipologia || 'Location',
    indirizzo: indirizzo || null,
    note: note || null,
    condivisa: !!condivisa,
    maestro_id: currentUid || null,
    updated_at: new Date().toISOString(),
  }
  if (allievo_id) payload.allievo_id = allievo_id
  const lat = parseMapCoordinate(latitudine)
  const lng = parseMapCoordinate(longitudine)
  if (lat !== null && lng !== null) {
    payload.latitudine = lat
    payload.longitudine = lng
  }
  return payload
}

function isMissingLocationPrivacyColumnsError(error) {
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`
  return /\b(condivisa|shared)\b/i.test(text)
}

function isMissingLocationCompositeConflictError(error) {
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`
  return /maestro_id.*nome|nome.*maestro_id|unique|exclusion|constraint|on conflict/i.test(text)
}

function localLocationMatches(row, payload, originalName = null) {
  const sameOriginal = originalName && normalizeText(row.nome) === normalizeText(originalName)
  const sameName = normalizeText(row.nome) === normalizeText(payload.nome)
  const sameOwner = String(row.maestro_id || '') === String(payload.maestro_id || '')
  return (sameOriginal || sameName) && sameOwner
}

async function writeLocationPayload(payload, originalName = null, { withoutCoords = false, withoutPrivacy = false, legacyConflict = false } = {}) {
  const cleanPayload = { ...payload }
  if (withoutCoords) {
    delete cleanPayload.latitudine
    delete cleanPayload.longitudine
  }
  if (withoutPrivacy) delete cleanPayload.condivisa

  const existing = originalName ? locationRecordByName(originalName) : locationRecordByName(payload.nome)
  if (!legacyConflict && existing?.id && canEditLocation(existing)) {
    return sb.from('locations').update(cleanPayload).eq('id', existing.id)
  }

  let result = await sb.from('locations').upsert(cleanPayload, { onConflict: legacyConflict ? 'nome' : 'maestro_id,nome' })
  if (result.error && !legacyConflict && isMissingLocationCompositeConflictError(result.error)) {
    result = await sb.from('locations').upsert(cleanPayload, { onConflict: 'nome' })
  }
  return result
}

async function persistLocationPayload(payload, originalName = null) {
  const hasCoords = parseMapCoordinate(payload.latitudine) !== null && parseMapCoordinate(payload.longitudine) !== null
  let strippedLocationPrivacy = false
  let { error } = await writeLocationPayload(payload, originalName)

  if (error && isMissingLocationPrivacyColumnsError(error) && !isMissingLocationTableError(error)) {
    strippedLocationPrivacy = true
    const retry = await writeLocationPayload(payload, originalName, { withoutPrivacy: true })
    error = retry.error
  }

  if (error && hasCoords && isMissingLocationMapColumnsError(error) && !isMissingLocationTableError(error)) {
    const retry = await writeLocationPayload(payload, originalName, {
      withoutCoords: true,
      withoutPrivacy: strippedLocationPrivacy || isMissingLocationPrivacyColumnsError(error),
    })
    error = retry.error
    if (!error) {
      saveLocationMapCoordsLocal(payload.nome, payload.latitudine, payload.longitudine, originalName)
      await loadLocations(true)
      return { ok: true, mapCoordsLocal: true }
    }
  }

  if (error) {
    if (isMissingLocationTableError(error)) {
      const local = JSON.parse(safeStorage.getItem('locationsLocal') || '[]').filter(l => !localLocationMatches(l, payload, originalName))
      local.push(payload)
      safeStorage.setItem('locationsLocal', JSON.stringify(local))
      allLocations = local.map(locationWithLocalMapCoords)
      locationsLoaded = true
      return { ok: true, localOnly: true }
    }
    return { ok: false, error }
  }

  await loadLocations(true)
  return { ok: true }
}

async function ricaricaAllievi() {
  let q = sb.from('allievi').select('*').order('nome')
  q = mostraArchiviati ? q.eq('stato', 'archiviato') : q.eq('stato', 'attivo')
  const result = await q
  const data = requiredQueryData(result, 'allievi')
  allAllievi = data
  renderGodPanel()
  renderAllievi()
  refreshDashboardData()
}

async function loadLocations(force = false) {
  if (locationsLoaded && !force) return allLocations
  const { data, error } = await sb.from('locations').select('*').order('nome')
  if (error) {
    const text = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`
    if (!/locations|schema cache|could not find the table|does not exist/i.test(text)) console.warn('locations non caricate', error)
    try { allLocations = (JSON.parse(safeStorage.getItem('locationsLocal') || '[]') || []).map(locationWithLocalMapCoords).filter(canViewLocation) } catch { allLocations = [] }
    locationsLoaded = true
    return allLocations
  }
  allLocations = (data || []).map(locationWithLocalMapCoords).filter(canViewLocation)
  locationsLoaded = true
  return allLocations
}

function locationRecordByName(nome) {
  const key = normalizeText(nome || '')
  const normalizedKey = normalizeText(normalizedLocationName(nome || ''))
  const matches = allLocations.filter(l =>
    normalizeText(l.nome || '') === key ||
    normalizeText(normalizedLocationName(l.nome || '')) === normalizedKey ||
    normalizeText(l.nome_normalizzato || '') === normalizedKey
  )
  return matches.find(l => String(l.maestro_id || '') === String(currentUid || ''))
    || matches.find(l => !!l.condivisa)
    || matches[0]
    || null
}

function lessonParticipantsFromLesson(lezione = {}) {
  return (lezione.lezioni_allievi || [])
    .map(row => row.allievi?.id ? (allAllievi.find(a => String(a.id) === String(row.allievi.id)) || row.allievi) : null)
    .filter(Boolean)
}

function addLocationNameCandidate(map, nome) {
  const clean = normalizedLocationName(nome)
  if (!clean) return
  const key = normalizeText(clean)
  if (key && !map.has(key)) map.set(key, clean)
}

function addLessonLocationCandidates(map, lezione = {}) {
  const luogo = String(lezione.luogo || '').trim()
  if (!luogo) return
  const participants = lessonParticipantsFromLesson(lezione)
  lessonLocationEntries(luogo, participants.map(a => a.id).filter(Boolean)).forEach(entry => addLocationNameCandidate(map, entry.nome))
}

function addDefaultMeetingLocationCandidates(map) {
  allieviVisibiliGod().filter(a => a.stato !== 'archiviato').forEach(allievo => {
    const individuale = logisticaIndividualeProfilo(allievo.profilo || {}, !!allievo.gruppo)
    addLocationNameCandidate(map, individuale.luogo_incontro || (!allievo.gruppo ? allievo.profilo?.luogo_incontro : ''))
  })
  gruppiEsistenti().forEach(gruppo => {
    const luogo = profiloComuneGruppo(gruppoMembri(gruppo)).luogo_incontro
    addLocationNameCandidate(map, luogo)
  })
}

function locationNamesFromLessons() {
  const map = new Map()
  ;(lezioniCache || []).forEach(l => addLessonLocationCandidates(map, l))
  addDefaultMeetingLocationCandidates(map)
  allLocations.forEach(l => {
    const nome = String(l.nome || '').trim()
    if (nome && !map.has(normalizeText(nome))) map.set(normalizeText(nome), nome)
  })
  return [...map.values()].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
}

function lessonLocationUsesName(lezione = {}, nome = '') {
  const target = normalizeText(nome)
  if (!target) return false
  if (lezione.location_id) {
    const rec = locationRecordById(lezione.location_id)
    if (rec && locationRecordMatchesName(rec, nome)) return true
  }
  const candidates = new Map()
  addLessonLocationCandidates(candidates, lezione)
  return [...candidates.values()].some(candidate =>
    normalizeText(candidate) === target ||
    normalizeText(normalizedLocationName(candidate)) === normalizeText(normalizedLocationName(nome))
  )
}

function renderDashboard() {
  const el = document.getElementById('dashboard-content')
  if (!el) return
  const allieviDashboard = allieviVisibiliGod().filter(a => mostraArchiviati ? a.stato === 'archiviato' : a.stato !== 'archiviato')
  const allieviLabel = mostraArchiviati ? 'Allievi archiviati' : 'Allievi attivi'
  const allieviAction = mostraArchiviati ? 'setArchivio(true)' : "showView('allievi')"
  el.innerHTML = `
    <div class="dashboard-grid dashboard-compact">
      <div class="dashboard-tile" onclick="${allieviAction}"><strong>${allieviDashboard.length}</strong><span>${allieviLabel}</span></div>
    </div>`
}

async function refreshDashboardData() {
  if (!lezioniCache) await loadLezioni(true)
  await loadLocations()
  renderDashboard()
}

function homeIcon(name) {
  const paths = {
    lesson: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    person: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    calendar: '<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>',
    chart: '<path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/>',
    archive: '<path d="M3 6h18M5 6v14h14V6M8 3h8l2 3H6l2-3Z"/><path d="M9 11h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.search}</svg>`
}

function focusHomeGlobalSearch() {
  const input = document.getElementById('global-search-input')
  input?.focus()
  input?.scrollIntoView({ block: 'nearest' })
  scheduleGlobalSearch()
}

function renderHome() {
  const el = document.getElementById('home-content')
  if (!el) return
  const now = new Date()
  const day = new Intl.DateTimeFormat('it-IT', { weekday: 'long' }).format(now)
  const date = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(now)
  const today = localDateIso(now)
  const todayLessons = (lezioniCache || [])
    .filter(lesson => String(lesson.data || '').slice(0, 10) === today)
    .sort((a, b) => lessonSortToken(a).localeCompare(lessonSortToken(b)))
  const lessons = todayLessons.map(lesson => {
    const participants = lessonParticipantsFromLesson(lesson)
    const open = lessonStatus(lesson) === 'aperta'
    return {
      id: lesson.id,
      time: lessonTime(lesson) || '—',
      title: labelPartecipantiLezione(lesson) || tipoLabel(lesson.tipo),
      place: lesson.luogo || 'Luogo non indicato',
      people: participants.length === 1 ? '1 partecipante' : `${participants.length} partecipanti`,
      status: open ? 'Aperta' : 'Chiusa',
      statusClass: open ? 'is-current' : 'is-done',
      note: lessonSpecialNotes(lesson) || 'Nessuna nota speciale',
    }
  })
  const involvedById = new Map()
  todayLessons.forEach(lesson => lessonParticipantsFromLesson(lesson).forEach(student => involvedById.set(String(student.id), student)))
  const students = [...involvedById.values()].slice(0, 3)
  const nextLesson = lessons.find(lesson => lesson.statusClass === 'is-current') || lessons[0] || null
  const weekStart = new Date(now)
  const weekday = (weekStart.getDay() + 6) % 7
  weekStart.setDate(weekStart.getDate() - weekday)
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)
  const weekLessons = (lezioniCache || []).filter(lesson => {
    const lessonDate = new Date(`${String(lesson.data || '').slice(0, 10)}T12:00:00`)
    return lessonDate >= weekStart && lessonDate < weekEnd
  })
  const weeklyStudentIds = new Set(weekLessons.flatMap(lesson => lessonParticipantsFromLesson(lesson).map(student => String(student.id))))
  const weeklyMinutes = weekLessons.reduce((total, lesson) => total + (Number(lesson.durata_min) || 0), 0)
  const weeklySkills = weekLessons.reduce((total, lesson) => total + (lesson.lezioni_skills?.length || 0), 0)
  el.innerHTML = `
    <div class="home-page">
      <div class="home-header">
        <div class="home-header-top">
          <div><div class="home-date">${esc(day)} · ${esc(date)}</div><h2 class="home-title">La tua giornata</h2></div>
          <button type="button" class="home-search-button" onclick="focusHomeGlobalSearch()">${homeIcon('search')}<span>Cerca allievi, gruppi, luoghi…</span></button>
          <button type="button" class="btn btn-primary" onclick="showView('nuova-lezione')">+ Nuova lezione</button>
        </div>
        <p class="home-summary">Oggi hai ${lessons.length} lezion${lessons.length === 1 ? 'e' : 'i'} e ${involvedById.size} alliev${involvedById.size === 1 ? 'o' : 'i'} coinvolti.</p>
      </div>

      <div class="home-operational-grid">
        <section class="home-section" aria-labelledby="home-timeline-title">
          <div class="home-section-head"><h3 id="home-timeline-title">Timeline giornata</h3><span>${esc(formatDateWithWeekday(today))}</span></div>
          <div class="home-timeline">
            ${lessons.length ? lessons.map(lesson => `<article class="home-lesson${lesson.statusClass === 'is-current' ? ' is-current' : ''}">
              <div class="home-lesson-time">${esc(lesson.time)}</div>
              <div class="home-lesson-main">
                <div class="home-lesson-title-row"><h4>${esc(lesson.title)}</h4><span class="home-status ${lesson.statusClass}">${esc(lesson.status)}</span></div>
                <div class="home-lesson-meta"><span>⌖ ${esc(lesson.place)}</span><span>◎ ${esc(lesson.people)}</span></div>
                <div class="home-lesson-context"><div class="home-context-item"><span>Note</span>${esc(lesson.note)}</div></div>
                <div class="home-lesson-actions"><button class="btn btn-primary btn-sm" onclick="openLezione(${jsArg(lesson.id)})">Apri lezione</button></div>
              </div>
            </article>`).join('') : '<div class="empty">Nessuna lezione registrata per oggi.</div>'}
          </div>
        </section>

        <aside class="home-sidebar">
          <section class="home-side-card home-next-card"><h3>Prima lezione di oggi</h3>${nextLesson ? `<div class="home-next-time">${esc(nextLesson.time)}</div><h4>${esc(nextLesson.title)}</h4><div class="home-detail-list"><div><span>Luogo</span><br>${esc(nextLesson.place)}</div><div><span>Partecipanti</span><br>${esc(nextLesson.people)}</div><div><span>Note</span><br>${esc(nextLesson.note)}</div></div><button class="btn btn-primary btn-full" onclick="openLezione(${jsArg(nextLesson.id)})">Apri lezione</button>` : '<div class="empty">Nessuna lezione prevista.</div>'}</section>
          <section class="home-side-card"><h3>Stato dati</h3><div class="empty">La Home mostra soltanto dati reali caricati dal gestionale.</div></section>
        </aside>
      </div>

      <section class="home-section"><div class="home-section-head"><h3>Allievi di oggi</h3><span>${involvedById.size} coinvolti</span></div><div class="home-students">${students.length ? students.map(student => { const name = [student.nome, student.cognome].filter(Boolean).join(' '); const initials = [student.nome, student.cognome].filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase(); return `<button type="button" class="home-student" onclick="showView('scheda',${jsArg(student.id)})"><div class="home-student-head"><div class="home-avatar">${esc(initials)}</div><div><strong>${esc(name)}</strong><span>${esc(student.gruppo || allievoTier(student))}</span></div></div></button>` }).join('') : '<div class="empty">Nessun allievo coinvolto nelle lezioni di oggi.</div>'}</div></section>

      <section class="home-section"><div class="home-section-head"><h3>Riepilogo settimana</h3><span>Dati registrati</span></div><div class="home-week"><div class="home-week-stat"><strong>${weekLessons.length}</strong><span>Lezioni</span></div><div class="home-week-stat"><strong>${String(Math.round(weeklyMinutes / 6) / 10).replace('.', ',')}</strong><span>Ore insegnate</span></div><div class="home-week-stat"><strong>${weeklyStudentIds.size}</strong><span>Allievi allenati</span></div><div class="home-week-stat"><strong>${weeklySkills}</strong><span>Skill lavorate</span></div></div></section>
    </div>`
  requestAnimationFrame(() => motion.cards(el))
}

// ── Views ─────────────────────────────────────────────────────────────

const APP_HISTORY_KEY = 'blading-manager-view'

function routeNeedsId(name) {
  return ['scheda', 'gruppo', 'location', 'lezione'].includes(name)
}

function normalizeRoute(name = 'home', id = null) {
  const cleanName = name || 'home'
  return { app: APP_HISTORY_KEY, name: cleanName, id: id || null }
}

function homeBoundaryRoute() {
  return { ...normalizeRoute('home'), boundary: true }
}

function routeHash(route) {
  const base = route.name || 'home'
  return route.id ? `#${encodeURIComponent(base)}/${encodeURIComponent(route.id)}` : `#${encodeURIComponent(base)}`
}

function sameRoute(a, b) {
  return !!a && !!b && a.app === APP_HISTORY_KEY && a.name === b.name && String(a.id || '') === String(b.id || '')
}

function recordAppHistory(name, id = null) {
  if (appHistoryApplying) return
  if (document.getElementById('screen-app')?.hidden) return
  if (routeNeedsId(name) && !id) return
  const route = normalizeRoute(name, id)
  if (!window.history?.pushState) return
  if (!appHistoryStarted) {
    const boundary = homeBoundaryRoute()
    history.replaceState(boundary, '', routeHash(boundary))
    history.pushState(route, '', routeHash(route))
    appHistoryStarted = true
    return
  }
  if (sameRoute(history.state, route)) return
  history.pushState(route, '', routeHash(route))
}

function showHomeFromHistoryBoundary() {
  appHistoryApplying = true
  showView('home')
  appHistoryApplying = false
  const home = normalizeRoute('home')
  history.pushState(home, '', routeHash(home))
}

window.addEventListener('popstate', event => {
  if (document.getElementById('screen-app')?.hidden) return
  const route = event.state
  if (!route || route.app !== APP_HISTORY_KEY) {
    showHomeFromHistoryBoundary()
    return
  }
  if (route.boundary) {
    showHomeFromHistoryBoundary()
    return
  }
  appHistoryApplying = true
  showView(route.name || 'home', route.id || null)
  appHistoryApplying = false
})

window.addEventListener('hashchange', () => {
  scheduleNuovaLezioneRouteRepair()
})

function visibleViewName() {
  return ['home','allievi','scheda','gruppo','lezioni','lesson-radial-planner','percorsi','calendario','appuntamenti','analisi','location','mappa','lezione','nuova-lezione','nuovo-allievo','nuovo-gruppo','skills','tuning','theme-colors','app-notes']
    .find(v => !document.getElementById(`view-${v}`)?.hidden) || null
}

function syncNavActive(name) {
  const locationFromMap = name === 'location' && locationBackTarget?.name === 'mappa'
  document.getElementById('nav-home')?.classList.toggle('active', name === 'home')
  document.getElementById('nav-allievi').classList.toggle('active', ['allievi','scheda','gruppo','nuovo-allievo','nuovo-gruppo'].includes(name))
  document.getElementById('nav-lezioni').classList.toggle('active', ['lezioni','lezione','nuova-lezione'].includes(name) || (name === 'location' && !locationFromMap))
  document.getElementById('nav-lesson-radial-planner')?.classList.toggle('active', name === 'lesson-radial-planner')
  document.getElementById('nav-percorsi').classList.toggle('active', name === 'percorsi')
  document.getElementById('nav-calendar').classList.toggle('active', name === 'calendario')
  document.getElementById('nav-auto-orari').classList.toggle('active', name === 'appuntamenti')
  document.getElementById('nav-analisi')?.classList.toggle('active', name === 'analisi')
  document.getElementById('nav-mappa').classList.toggle('active', name === 'mappa' || locationFromMap)
  document.getElementById('nav-skills').classList.toggle('active', name === 'skills')
  document.getElementById('nav-tuning').classList.toggle('active', name === 'tuning')
  document.getElementById('nav-theme-colors')?.classList.toggle('active', name === 'theme-colors')
  document.getElementById('nav-app-notes').classList.toggle('active', name === 'app-notes')
  window.ResponsiveShell?.revealActiveDestination()
}

function isValidLocationBackTarget(target) {
  if (!target || target.name === 'location') return false
  if (target.name === 'scheda' || target.name === 'gruppo' || target.name === 'lezione') return !!target.id
  return ['home','allievi','lezioni','lesson-radial-planner','percorsi','calendario','appuntamenti','analisi','mappa','skills','tuning','theme-colors','app-notes'].includes(target.name)
}

function readLocationBackTarget() {
  try {
    const target = JSON.parse(safeStorage.getItem(LOCATION_BACK_TARGET_KEY) || 'null')
    return isValidLocationBackTarget(target) ? target : null
  } catch {
    return null
  }
}

function setLocationBackTarget(target) {
  locationBackTarget = isValidLocationBackTarget(target) ? { name: target.name, id: target.id || null } : null
  if (locationBackTarget) safeStorage.setItem(LOCATION_BACK_TARGET_KEY, JSON.stringify(locationBackTarget))
  else safeStorage.removeItem(LOCATION_BACK_TARGET_KEY)
}

function locationBackLabel(target = locationBackTarget) {
  const labels = {
    home: 'Home',
    allievi: 'Allievi',
	    lezioni: 'Lezioni',
    'lesson-radial-planner': 'Planner',
	    percorsi: 'Percorsi',
	    calendario: 'Calendario',
	    appuntamenti: 'Appuntamenti',
    analisi: 'Analisi',
    mappa: 'Mappa',
    skills: 'Skills',
    tuning: 'Tuning',
    'theme-colors': 'Colori',
    'app-notes': 'Note',
    scheda: 'Scheda allievo',
    gruppo: 'Scheda gruppo',
    lezione: 'Lezione',
  }
  return labels[target?.name] || 'Lezioni'
}

function locationBackButtonHtml() {
  const target = locationBackTarget || readLocationBackTarget() || { name: 'lezioni', id: null }
  locationBackTarget = target
  return `<button class="back-btn" onclick="tornaDaLocation()">← ${esc(locationBackLabel(target))}</button>`
}

function tornaDaLocation() {
  const target = locationBackTarget || readLocationBackTarget()
  goToReturnTarget(target, { name: 'lezioni', id: null })
}

function currentReturnTarget() {
  const view = visibleViewName()
  if (view === 'scheda' && currentSchedaId) return { name: 'scheda', id: currentSchedaId }
  if (view === 'gruppo' && currentGruppoNome) return { name: 'gruppo', id: currentGruppoNome }
  if (view === 'lezione' && currentLezioneId) return { name: 'lezione', id: currentLezioneId }
  if (view === 'location') return locationBackTarget || readLocationBackTarget() || { name: 'lezioni', id: null }
  if (view === 'home' || view === 'allievi' || view === 'lezioni' || view === 'lesson-radial-planner' || view === 'percorsi' || view === 'calendario' || view === 'appuntamenti' || view === 'analisi' || view === 'mappa' || view === 'skills' || view === 'tuning' || view === 'theme-colors' || view === 'app-notes') return { name: view, id: null }
  return null
}

async function goToReturnTarget(target, fallback) {
  const destination = target || fallback
  if (!destination) return
  if (destination.name === 'scheda' && destination.id) {
    await loadScheda(destination.id)
    return
  }
  if (destination.name === 'gruppo' && destination.id) {
    showView('gruppo', destination.id)
    return
  }
  if (destination.name === 'lezione' && destination.id) {
    showView('lezione', destination.id)
    return
  }
  showView(destination.name, destination.id || undefined)
}

function showView(name, id) {
  if ((name === 'tuning' || name === 'theme-colors' || name === 'app-notes') && !godMode) name = 'allievi'
  const previousReturnTarget = currentReturnTarget()
  if (name === 'location') {
    const storedTarget = readLocationBackTarget()
    const target = !appHistoryStarted && storedTarget ? storedTarget : previousReturnTarget
    if (!appHistoryApplying && isValidLocationBackTarget(target)) setLocationBackTarget(target)
    else if (!locationBackTarget && storedTarget) locationBackTarget = storedTarget
  }
  document.body.dataset.view = name
  document.body.classList.toggle('route-builder-active', name === 'percorsi')
  document.body.classList.toggle('lesson-radial-active', name === 'lesson-radial-planner')
  if (['nuovo-allievo','nuovo-gruppo','nuova-lezione'].includes(name)) {
    const returnTarget = previousReturnTarget
    if (returnTarget) editReturnTarget = returnTarget
  }
  ['home','allievi','scheda','gruppo','lezioni','lesson-radial-planner','percorsi','calendario','appuntamenti','analisi','location','mappa','lezione','nuova-lezione','nuovo-allievo','nuovo-gruppo','skills','tuning','theme-colors','app-notes'].forEach(v => {
    document.getElementById(`view-${v}`).hidden = (v !== name)
  })
  syncNavActive(name)

  if (name === 'home')          renderHome()
  if (name === 'lezioni' && id) filtroLezioni = `allievo:${id}`
  if (name === 'lezioni')       loadLezioni()
  if (name === 'lesson-radial-planner') ensureLessonRadialPlannerMounted()
  if (name === 'percorsi')      ensureRouteBuilderMounted()
  if (name === 'calendario')    renderCalendario()
  if (name === 'appuntamenti')  loadAppuntamenti()
  if (name === 'analisi')       loadAnalisi()
  if (name === 'mappa')         renderMappa(id || null)
  if (name === 'location' && id) loadLocation(id)
  if (name === 'lezione' && id) loadLezione(id)
  if (name === 'nuova-lezione') {
    initNuovaLezione(id || null).catch(error => {
      console.error('Inizializzazione nuova lezione non riuscita', error)
      fallbackNuovaLezioneForm(id || null)
    })
  }
  if (name === 'nuovo-allievo') initNuovoAllievo(id || null)
  if (name === 'nuovo-gruppo')  initNuovoGruppo(id || null)
  if (name === 'gruppo' && id)  loadGruppo(id)
  if (name === 'scheda' && id)  loadScheda(id)
  if (name === 'skills')        renderSkillsCatalog()
  if (name === 'tuning')        initTuning()
  if (name === 'theme-colors')  renderThemeColorPanel()
  if (name === 'app-notes')     initAppNotes()
  requestAnimationFrame(() => motion.view(name))
  recordAppHistory(name, id || null)
}

function lezioneTargetStillLoading() {
  const select = document.getElementById('lz-tipo')
  return !!select && select.options.length === 1 && /Caricamento/i.test(select.options[0]?.textContent || '')
}

function ensurePrepFallbackTarget(routeId = null) {
  const select = document.getElementById('lz-tipo')
  if (!select) return
  const isPrep = String(routeId || '').startsWith('modo:prep') || lezioneFormMode === 'prep'
  if (!isPrep || select.value) return
  if (![...select.options].some(option => option.value === 'campo_libero')) {
    select.insertAdjacentHTML('beforeend', '<option value="campo_libero">Campo libero</option>')
  }
  select.value = 'campo_libero'
}

function fallbackNuovaLezioneForm(routeId = null) {
  try {
    if (String(routeId || '').startsWith('modo:prep')) lezioneFormMode = 'prep'
    renderLezioneTargetOptions(document.getElementById('lz-tipo')?.value || '')
    ensurePrepFallbackTarget(routeId)
    syncLezioneFormLabels(!!editingLezioneId)
    renderLezionePartecipanti()
  } catch (fallbackError) {
    console.error('Fallback nuova lezione non riuscito', fallbackError)
  }
}

function repairNuovaLezioneRouteIfNeeded() {
  if (document.getElementById('screen-app')?.hidden) return
  const route = initialRouteFromHash(window.location.hash)
  if (route.name !== 'nuova-lezione') return
  const select = document.getElementById('lz-tipo')
  const needsPrepOption = String(route.id || '').startsWith('modo:prep')
    && ![...(select?.options || [])].some(option => option.value === 'campo_libero')
  if (!lezioneTargetStillLoading() && !needsPrepOption) return
  initNuovaLezione(route.id || null).catch(error => {
    console.error('Inizializzazione nuova lezione non riuscita', error)
    fallbackNuovaLezioneForm(route.id || null)
  })
}

function scheduleNuovaLezioneRouteRepair() {
  ;[250, 1000, 2500].forEach(delay => setTimeout(repairNuovaLezioneRouteIfNeeded, delay))
}

function ensureRouteBuilderMounted() {
  const view = document.getElementById('view-percorsi')
  const root = document.getElementById('route-builder-root')
  if (!view || view.hidden || !root) return
  if (typeof initRouteBuilderPage === 'function') {
    try {
      initRouteBuilderPage()
    } catch (error) {
      console.error('Errore inizializzazione editor percorsi', error)
      root.innerHTML = routeBuilderLoadErrorHtml(error?.message || 'Errore JavaScript durante il caricamento.')
    }
    return
  }
  root.innerHTML = routeBuilderLoadErrorHtml('Script route-builder non caricati.')
}

function routeBuilderLoadErrorHtml(detail) {
  return `
    <div class="card">
      <div class="msg msg-err show" style="display:block;margin-bottom:.7rem">
        Editor percorsi non caricato.
      </div>
      <div style="color:var(--muted);font-size:.86rem;line-height:1.45">
        ${esc(detail || 'Errore non specificato.')}<br>
        Apri il gestionale tramite server locale:
        <a href="http://localhost:8027/#percorsi" style="color:var(--blu);font-weight:800">http://localhost:8027/#percorsi</a>
      </div>
    </div>`
}

function ensureLessonRadialPlannerMounted() {
  const view = document.getElementById('view-lesson-radial-planner')
  const root = document.getElementById('lesson-radial-planner-root')
  if (!view || view.hidden || !root) return
  if (typeof initLessonRadialPlannerPage === 'function') {
    try {
      initLessonRadialPlannerPage()
    } catch (error) {
      console.error('Errore inizializzazione planner radiale', error)
      root.innerHTML = lessonRadialPlannerLoadErrorHtml(error?.message || 'Errore JavaScript durante il caricamento.')
    }
    return
  }
  root.innerHTML = lessonRadialPlannerLoadErrorHtml('Script lesson-radial-planner non caricati.')
}

function lessonRadialPlannerLoadErrorHtml(detail) {
  return `
    <div class="card">
      <div class="msg msg-err show" style="display:block;margin-bottom:.7rem">
        Planner radiale non caricato.
      </div>
      <div style="color:var(--muted);font-size:.86rem;line-height:1.45">
        ${esc(detail || 'Errore non specificato.')}<br>
        Apri il gestionale tramite server locale:
        <a href="http://localhost:8027/#lesson-radial-planner" style="color:var(--blu);font-weight:800">http://localhost:8027/#lesson-radial-planner</a>
      </div>
    </div>`
}

function openAppNotes() {
  if (!godMode) return
  const current = visibleViewName()
  if (current && current !== 'app-notes') appNotesReturnView = current
  showView('app-notes')
}

function closeAppNotes() {
  const target = appNotesReturnView || 'allievi'
  appNotesReturnView = null
  const targetEl = document.getElementById(`view-${target}`)
  if (!targetEl) {
    showView('allievi')
    return
  }
  document.querySelectorAll('#screen-app main > section').forEach(section => { section.hidden = true })
  targetEl.hidden = false
  document.body.dataset.view = target
  document.body.classList.toggle('route-builder-active', target === 'percorsi')
  document.body.classList.toggle('lesson-radial-active', target === 'lesson-radial-planner')
  syncNavActive(target)
  requestAnimationFrame(() => motion.view(target))
}

function showCalendarFromHeader() {
  showView('calendario')
}

// ── Calendario settimanale ──────────────────────────────────────────────

function calendarioStorageKey() {
  return `${CALENDARIO_STORAGE_PREFIX}:${currentUid || currentEmail || 'local'}`
}

function newCalendarItemId() {
  return `cal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function normalizeCalendarioItems(items = []) {
  if (!Array.isArray(items)) return []
  return items
    .map(item => {
      const day = Number(item.day ?? item.giorno ?? item.weekday)
      const start = String(item.start || item.inizio || '').slice(0, 5)
      const end = String(item.end || item.fine || '').slice(0, 5)
      const startMin = timeToMinutes(start)
      const endMin = timeToMinutes(end)
      if (!AVAILABILITY_DAYS.some(d => d.value === day) || startMin === null || endMin === null || endMin <= startMin) return null
      return {
        id: String(item.id || newCalendarItemId()),
        day,
        start,
        end,
        title: String(item.title || item.titolo || item.targetName || 'Lezione').trim() || 'Lezione',
        location: String(item.location || item.luogo || '').trim(),
        note: String(item.note || '').trim(),
        source: String(item.source || 'manuale'),
        targetId: item.targetId || null,
        variantId: item.variantId || null,
        locked: item.locked === true || item.locked === 'true' || item.locked === 1 || item.locked === '1',
        created_at: item.created_at || new Date().toISOString(),
      }
    })
    .filter(Boolean)
    .sort((a, b) => availabilityDayOrder(a.day) - availabilityDayOrder(b.day) || timeToMinutes(a.start) - timeToMinutes(b.start) || String(a.title).localeCompare(String(b.title), 'it', { sensitivity: 'base' }))
}

function loadCalendarioItems(metadata = {}) {
  let local = []
  try { local = JSON.parse(safeStorage.getItem(calendarioStorageKey()) || '[]') || [] } catch { local = [] }
  const remote = normalizeCalendarioItems(metadata?.[CALENDARIO_METADATA_KEY] || metadata?.calendario_settimanale?.items || [])
  const items = remote.length ? remote : normalizeCalendarioItems(local)
  safeStorage.setItem(calendarioStorageKey(), JSON.stringify(items))
  return items
}

async function saveCalendarioItems(items) {
  calendarioItems = normalizeCalendarioItems(items)
  safeStorage.setItem(calendarioStorageKey(), JSON.stringify(calendarioItems))
  if (!sb?.auth) return { remote: false }
  const payload = {
    ...currentUserMetadata,
    [CALENDARIO_METADATA_KEY]: calendarioItems,
    calendario_settimanale_updated_at: new Date().toISOString(),
  }
  const { user, error } = await updateCurrentUserMetadata(payload)
  if (error) return { remote: false, error }
  currentUserMetadata = user?.user_metadata || payload
  return { remote: true }
}

function calendarioDayOptions(selected = 1) {
  return AVAILABILITY_DAYS.map(day => `<option value="${day.value}" ${Number(selected) === Number(day.value) ? 'selected' : ''}>${esc(day.label)}</option>`).join('')
}

function calendarioSetStatus(text, cls = '') {
  const el = document.getElementById('calendario-status')
  if (!el) return
  el.className = `calendar-status ${cls}`.trim()
  el.textContent = text || ''
}

function calendarioItemById(id) {
  return calendarioItems.find(item => String(item.id) === String(id)) || null
}

function calendarioHourLabelsHtml() {
  const labels = []
  for (let min = AVAILABILITY_START_MIN; min <= AVAILABILITY_END_MIN; min += 60) {
    labels.push(`<span class="calendar-hour-label" style="${appointmentPreviewPointStyle(min)}">${minutesToTime(min)}</span>`)
  }
  return `
    <div class="calendar-day calendar-time-rail" aria-hidden="true">
      <div class="calendar-time-title"></div>
      <div class="calendar-day-body calendar-time-lane">
        ${labels.join('')}
      </div>
    </div>`
}

function calendarioItemDuration(item = {}) {
  const startMin = timeToMinutes(item.start)
  const endMin = timeToMinutes(item.end)
  if (startMin === null || endMin === null || endMin <= startMin) return AVAILABILITY_STEP_MIN
  return endMin - startMin
}

function calendarioItemBlockHtml(item) {
  const startMin = timeToMinutes(item.start)
  const endMin = timeToMinutes(item.end)
  const meta = [item.location, item.note].filter(Boolean).join(' · ')
  const source = item.source === 'appuntamenti' ? 'auto' : 'manuale'
  const title = [item.title, `${item.start}-${item.end}`, source, meta].filter(Boolean).join(' · ')
  return `
    <div class="calendar-event-block${item.locked ? ' is-locked' : ''}" draggable="true" data-calendar-id="${esc(item.id)}" style="${appointmentPreviewRangeStyle(startMin, endMin)}" title="${esc(title)}" ondragstart="startCalendarioDrag(event,${jsArg(item.id)})">
      <strong>${esc(item.title)}</strong>
      <span>${esc(item.start)}-${esc(item.end)}</span>
      ${meta ? `<small>${esc(meta)}</small>` : ''}
      <div class="calendar-event-tools">
        <button type="button" onclick="event.stopPropagation(); toggleCalendarioItemLock(${jsArg(item.id)})" title="${item.locked ? 'Sblocca voce' : 'Blocca voce'}">${item.locked ? 'Fissa' : 'Blocca'}</button>
        <button type="button" onclick="event.stopPropagation(); deleteCalendarioItem(${jsArg(item.id)})" title="Elimina voce" aria-label="Elimina voce">×</button>
      </div>
    </div>`
}

function calendarioItemHtml(item) {
  const meta = [item.location, item.note].filter(Boolean).join(' · ')
  const source = item.source === 'appuntamenti' ? 'auto' : 'manuale'
  return `
    <details class="calendar-event">
      <summary>
        <span class="calendar-event-main">
          <span class="calendar-event-time">${esc(item.start)}-${esc(item.end)} · ${esc(source)}</span>
          <span class="calendar-event-title">${esc(item.title)}</span>
          ${meta ? `<span class="calendar-event-meta">${esc(meta)}</span>` : ''}
        </span>
        <button type="button" class="calendar-event-delete" onclick="event.preventDefault(); event.stopPropagation(); deleteCalendarioItem(${jsArg(item.id)})" title="Elimina voce" aria-label="Elimina voce">×</button>
      </summary>
      <div class="calendar-event-edit">
        <div class="calendar-edit-grid">
          <input type="time" value="${esc(item.start)}" onchange="updateCalendarioItem(${jsArg(item.id)}, 'start', this.value)" aria-label="Ora inizio">
          <input type="time" value="${esc(item.end)}" onchange="updateCalendarioItem(${jsArg(item.id)}, 'end', this.value)" aria-label="Ora fine">
        </div>
        <input type="text" value="${esc(item.title)}" onchange="updateCalendarioItem(${jsArg(item.id)}, 'title', this.value)" aria-label="Titolo">
        <select onchange="updateCalendarioItem(${jsArg(item.id)}, 'day', this.value)" aria-label="Giorno">${calendarioDayOptions(item.day)}</select>
        <input type="text" value="${esc(item.location)}" placeholder="Luogo" onchange="updateCalendarioItem(${jsArg(item.id)}, 'location', this.value)" aria-label="Luogo">
        <input type="text" value="${esc(item.note)}" placeholder="Note" onchange="updateCalendarioItem(${jsArg(item.id)}, 'note', this.value)" aria-label="Note">
        <div class="calendar-edit-actions">
          <button type="button" class="btn btn-outline btn-sm" onclick="deleteCalendarioItem(${jsArg(item.id)})">Elimina</button>
        </div>
      </div>
    </details>`
}

function calendarioBoardHtml() {
  const normalized = normalizeCalendarioItems(calendarioItems)
  return `<div class="calendar-board-wrap"><div class="calendar-board">
    ${calendarioHourLabelsHtml()}
    ${AVAILABILITY_DAYS.map(day => {
    const items = normalized.filter(item => Number(item.day) === Number(day.value))
    return `
      <div class="calendar-day" data-day="${day.value}" ondragover="event.preventDefault()" ondrop="dropCalendarioItem(event,${day.value})">
        <div class="calendar-day-head"><strong>${esc(day.label)}</strong><span>${items.length} voc${items.length === 1 ? 'e' : 'i'}</span></div>
        <div class="calendar-day-body">
          ${items.map(calendarioItemBlockHtml).join('')}
        </div>
      </div>`
  }).join('')}</div></div>`
}

function renderCalendario() {
  const el = document.getElementById('calendario-content')
  if (!el) return
  el.innerHTML = `
    <div class="card calendar-shell">
      <div class="calendar-shell-head">
        <div class="calendar-quick-title">Nuova voce</div>
        <button type="button" class="btn btn-outline btn-sm" onclick="clearCalendario()" ${calendarioItems.length ? '' : 'disabled'}>Cancella tutto</button>
      </div>
      <div class="calendar-form">
        <div class="field">
          <label>Giorno</label>
          <select id="cal-new-day">${calendarioDayOptions(1)}</select>
        </div>
        <div class="field place-suggest-wrap">
          <label>Titolo</label>
          <input type="text" id="cal-new-title" placeholder="Es. Lezione Marco" autocomplete="off" oninput="mostraSuggerimentiCalendarioTitolo()" onfocus="mostraSuggerimentiCalendarioTitolo()" onblur="nascondiSuggerimentiCalendarioSoon('cal-title-suggest')">
          <div id="cal-title-suggest" class="place-suggest-panel calendar-title-suggest-panel" hidden></div>
        </div>
        <div class="field">
          <label>Inizio</label>
          <input type="time" id="cal-new-start" value="09:00">
        </div>
        <div class="field">
          <label>Fine</label>
          <input type="time" id="cal-new-end" value="10:00">
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="addCalendarioManualItem()">Aggiungi</button>
      </div>
      <div class="calendar-extra-row">
        <div class="field place-suggest-wrap">
          <label>Luogo</label>
          <input type="text" id="cal-new-location" placeholder="Location" autocomplete="off" oninput="mostraSuggerimentiCalendarioLuogo()" onfocus="mostraSuggerimentiCalendarioLuogo()" onblur="nascondiSuggerimentiCalendarioSoon('cal-location-suggest')">
          <div id="cal-location-suggest" class="place-suggest-panel" hidden></div>
        </div>
        <div class="field">
          <label>Note</label>
          <input type="text" id="cal-new-note" placeholder="Promemoria">
        </div>
      </div>
      <div id="calendario-status" class="calendar-status"></div>
    </div>
    ${calendarioBoardHtml()}`
}

function calendarioTitleSuggestions(queryText = '') {
  const query = normalizeText(queryText)
  const rows = []
  const allievi = activeAppointmentAllievi()
    .filter(allievo => !allievo.gruppo || appointmentIndividualLessonsActiveForAllievo(allievo))
  ordinaAllieviLista(allievi).forEach(allievo => {
    const name = allievoDisplayName(allievo.id)
    const logistica = logisticaIndividualeProfilo(allievo.profilo || {}, !!allievo.gruppo)
    const location = logistica.luogo_incontro || (!allievo.gruppo ? allievo.profilo?.luogo_incontro : '') || ''
    const haystack = normalizeText([name, allievo.nome, allievo.cognome, allievo.nickname, allievo.gruppo, location].filter(Boolean).join(' '))
    if (!query || haystack.includes(query)) rows.push({ type: 'Allievo', title: name, location, detail: allievo.gruppo || location || '' })
  })
  appointmentGroups().forEach(gruppo => {
    const members = appointmentGroupMembers(gruppo)
    if (!members.length) return
    const profilo = profiloComuneGruppo(members)
    const location = profilo.luogo_incontro || ''
    const haystack = normalizeText([gruppo, location].filter(Boolean).join(' '))
    if (!query || haystack.includes(query)) rows.push({ type: 'Gruppo', title: gruppo, location, detail: `${members.length} allievi${location ? ' · ' + location : ''}` })
  })
  return rows
}

function mostraSuggerimentiCalendarioTitolo() {
  const input = document.getElementById('cal-new-title')
  const panel = document.getElementById('cal-title-suggest')
  if (!input || !panel) return
  const rows = calendarioTitleSuggestions(input.value)
  panel.innerHTML = rows.length
    ? rows.map(row => `<button type="button" class="place-suggest-btn" onmousedown="scegliSuggerimentoCalendarioTitolo(${jsArg(row.title)},${jsArg(row.location)})"><strong>${esc(row.title)}</strong><br><span style="color:var(--muted);font-size:.74rem">${esc(row.type)}${row.detail ? ` · ${esc(row.detail)}` : ''}</span></button>`).join('')
    : '<div class="place-suggest-empty">Nessun allievo o gruppo trovato.</div>'
  panel.hidden = false
}

function scegliSuggerimentoCalendarioTitolo(title, location = '') {
  const titleInput = document.getElementById('cal-new-title')
  const locationInput = document.getElementById('cal-new-location')
  if (titleInput) titleInput.value = title || ''
  if (locationInput && location && !locationInput.value.trim()) locationInput.value = location
  const panel = document.getElementById('cal-title-suggest')
  if (panel) panel.hidden = true
}

async function mostraSuggerimentiCalendarioLuogo() {
  const input = document.getElementById('cal-new-location')
  const panel = document.getElementById('cal-location-suggest')
  if (!input || !panel) return
  if (!locationsLoaded) await loadLocations()
  const query = normalizeText(input.value || '')
  const names = locationNamesFromLessons()
    .filter(nome => !query || normalizeText(nome).includes(query))
    .slice(0, 10)
  panel.innerHTML = names.length
    ? names.map(nome => `<button type="button" class="place-suggest-btn" onmousedown="scegliSuggerimentoCalendarioLuogo(${jsArg(nome)})">${esc(nome)}</button>`).join('')
    : '<div class="place-suggest-empty">Nessuna location trovata.</div>'
  panel.hidden = false
}

function scegliSuggerimentoCalendarioLuogo(location) {
  const input = document.getElementById('cal-new-location')
  if (input) input.value = location || ''
  const panel = document.getElementById('cal-location-suggest')
  if (panel) panel.hidden = true
}

function nascondiSuggerimentiCalendarioSoon(panelId) {
  clearTimeout(calendarioSuggestTimer)
  calendarioSuggestTimer = setTimeout(() => {
    const panel = document.getElementById(panelId)
    if (panel) panel.hidden = true
  }, 160)
}

async function addCalendarioManualItem() {
  const item = {
    id: newCalendarItemId(),
    day: Number(document.getElementById('cal-new-day')?.value || 1),
    title: document.getElementById('cal-new-title')?.value || 'Impegno',
    start: document.getElementById('cal-new-start')?.value || '',
    end: document.getElementById('cal-new-end')?.value || '',
    location: document.getElementById('cal-new-location')?.value || '',
    note: document.getElementById('cal-new-note')?.value || '',
    source: 'manuale',
  }
  const normalized = normalizeCalendarioItems([item])[0]
  if (!normalized) {
    calendarioSetStatus('Controlla giorno e orari: la fine deve essere dopo l inizio.', 'err')
    return
  }
  const saved = await saveCalendarioItems([...calendarioItems, normalized])
  renderCalendario()
  calendarioSetStatus(saved.remote ? 'Voce aggiunta al calendario.' : 'Voce aggiunta localmente.', saved.remote ? 'ok' : '')
}

async function updateCalendarioItem(id, field, value) {
  const allowed = ['day', 'start', 'end', 'title', 'location', 'note']
  if (!allowed.includes(field)) return
  const next = calendarioItems.map(item => String(item.id) === String(id) ? { ...item, [field]: field === 'day' ? Number(value) : value } : item)
  const normalized = normalizeCalendarioItems(next)
  if (normalized.length !== next.length) {
    calendarioSetStatus('Modifica non valida: controlla giorno e orari.', 'err')
    renderCalendario()
    return
  }
  const saved = await saveCalendarioItems(normalized)
  renderCalendario()
  calendarioSetStatus(saved.remote ? 'Calendario aggiornato.' : 'Calendario aggiornato localmente.', saved.remote ? 'ok' : '')
}

function startCalendarioDrag(event, id) {
  calendarioDragId = String(id)
  event.dataTransfer?.setData('text/plain', calendarioDragId)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer?.setDragImage?.(event.currentTarget, 12, 12)
}

async function dropCalendarioItem(event, day) {
  event.preventDefault()
  const id = event.dataTransfer?.getData('text/plain') || calendarioDragId
  const item = calendarioItemById(id)
  const lane = event.currentTarget.querySelector('.calendar-day-body')
  if (!item || !lane) return
  const rect = lane.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)))
  const duration = calendarioItemDuration(item)
  const rawStart = AVAILABILITY_START_MIN + ratio * (AVAILABILITY_END_MIN - AVAILABILITY_START_MIN)
  const startMin = availabilityClampStart(availabilitySnap(rawStart), duration)
  const next = calendarioItems.map(entry => String(entry.id) === String(id)
    ? { ...entry, day: Number(day), start: minutesToTime(startMin), end: minutesToTime(startMin + duration) }
    : entry)
  const saved = await saveCalendarioItems(next)
  renderCalendario()
  calendarioSetStatus(saved.remote ? 'Voce spostata.' : 'Voce spostata localmente.', saved.remote ? 'ok' : '')
}

async function toggleCalendarioItemLock(id) {
  const item = calendarioItemById(id)
  if (!item) return
  const next = calendarioItems.map(entry => String(entry.id) === String(id) ? { ...entry, locked: !entry.locked } : entry)
  const saved = await saveCalendarioItems(next)
  renderCalendario()
  calendarioSetStatus(`${item.locked ? 'Voce sbloccata' : 'Voce bloccata'}${saved.remote ? '.' : ' localmente.'}`, saved.remote ? 'ok' : '')
}

async function deleteCalendarioItem(id) {
  const saved = await saveCalendarioItems(calendarioItems.filter(item => String(item.id) !== String(id)))
  renderCalendario()
  calendarioSetStatus(saved.remote ? 'Voce eliminata.' : 'Voce eliminata localmente.', saved.remote ? 'ok' : '')
}

async function clearCalendario() {
  if (!calendarioItems.length) {
    calendarioSetStatus('Calendario gia vuoto.')
    return
  }
  const locked = calendarioItems.filter(item => item.locked)
  const unlocked = calendarioItems.filter(item => !item.locked)
  if (!unlocked.length) {
    calendarioSetStatus('Tutte le voci sono bloccate: non cancello nulla.')
    return
  }
  const message = locked.length
    ? `Cancellare ${unlocked.length} voc${unlocked.length === 1 ? 'e non bloccata' : 'i non bloccate'}? ${locked.length} voc${locked.length === 1 ? 'e bloccata restera' : 'i bloccate resteranno'} nel calendario.`
    : 'Cancellare tutte le voci del calendario?'
  if (!confirm(message)) return
  const saved = await saveCalendarioItems(locked)
  renderCalendario()
  calendarioSetStatus(locked.length
    ? `${unlocked.length} voc${unlocked.length === 1 ? 'e cancellata' : 'i cancellate'}; ${locked.length} bloccat${locked.length === 1 ? 'a conservata' : 'e conservate'}.`
    : (saved.remote ? 'Calendario svuotato.' : 'Calendario svuotato localmente.'), saved.remote ? 'ok' : '')
}

async function addAppointmentVariantToCalendar(variantId) {
  const variant = lastAppointmentScheduleVariants.find(item => item.id === variantId)
  if (!variant || !variant.scheduled?.length) {
    setAppointmentCalendarStatus('Nessuna lezione piazzata da importare.', 'err')
    return
  }
  const imported = variant.scheduled.map(item => ({
    id: newCalendarItemId(),
    day: item.day,
    start: item.start,
    end: item.lessonEnd,
    title: item.targetName,
    location: item.location || '',
    note: [variant.title, item.heatOverlap ? 'fascia calda' : '', item.routeIsItinerary ? `${item.routeStartLabel || ''} -> ${item.routeEndLabel || ''}` : ''].filter(Boolean).join(' · '),
    source: 'appuntamenti',
    targetId: item.targetId,
    variantId,
  }))
  const saved = await saveCalendarioItems([...calendarioItems, ...imported])
  importedAppointmentVariantIds.add(String(variantId))
  document.querySelectorAll('.appointment-schedule-variant[data-appointment-variant-id]').forEach(card => {
    if (card.dataset.appointmentVariantId === String(variantId)) card.classList.add('is-in-calendar')
  })
  setAppointmentCalendarStatus(`${imported.length} lezion${imported.length === 1 ? 'e aggiunta' : 'i aggiunte'} al calendario${saved.remote ? '.' : ' localmente.'}`, saved.remote ? 'ok' : '')
}

function setAppointmentCalendarStatus(text, cls = '') {
  const el = document.getElementById('appointments-calendar-status')
  if (!el) return
  el.className = `appointments-status ${cls}`.trim()
  el.textContent = text || ''
}

// ── Analisi didattica ────────────────────────────────────────────────

const ANALYSIS_PERIODS = [
  { value: '30', label: 'Ultimi 30 giorni' },
  { value: '90', label: 'Ultimi 90 giorni' },
  { value: '180', label: 'Ultimi 6 mesi' },
  { value: '365', label: 'Ultimo anno' },
  { value: 'all', label: 'Tutto lo storico' },
]

const ANALYSIS_BRANCHES = [
  { id: 'stance', label: 'STANCE', aliases: ['stance', 'equilibrio', 'stabilita', 'stabilità'] },
  { id: 'gait', label: 'GAIT', aliases: ['gait', 'andatura', 'passo', 'spinta'] },
  { id: 'rotation', label: 'ROTATION', aliases: ['rotation', 'rotazione'] },
  { id: 'braking', label: 'BRAKING', aliases: ['braking', 'break', 'frenata', 'freno'] },
]

const ANALYSIS_BIOMECHANIC_METRICS = [
  { id: 'forze', label: 'Forze' },
  { id: 'verticalizzazione', label: 'Verticalizzazione' },
  { id: 'rotazione', label: 'Rotazione' },
  { id: 'tempo', label: 'Tempo' },
  { id: 'stabilita', label: 'Stabilita' },
  { id: 'asimmetria', label: 'Asimmetria' },
  { id: 'coordinazione', label: 'Coordinazione' },
]

const ANALYSIS_MOCK_LESSONS = Object.freeze([
  { id: 'mock-1', data: '2026-01-08', durata_min: 60, tipo: 'individuale', mockNames: ['Allievo demo'], mockSkills: ['Spinta base', 'Frenata a T'] },
  { id: 'mock-2', data: '2026-01-15', durata_min: 75, tipo: 'gruppo', mockNames: ['Gruppo demo'], mockSkills: ['Curve base', 'Stabilita monopodalica'] },
  { id: 'mock-3', data: '2026-02-02', durata_min: 60, tipo: 'individuale', mockNames: ['Allievo demo'], mockSkills: ['Rotazione 180', 'Frenata a T'] },
])

function analysisDateFromIso(value) {
  const iso = String(value || '').slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const date = new Date(`${iso}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function analysisIsoFromDate(date) {
  return date.toISOString().slice(0, 10)
}

function analysisLessonDate(lesson) {
  return analysisDateFromIso(lesson?.data)
}

function analysisPeriodRange(period) {
  if (period === 'all') return { from: null, to: null, days: null }
  const days = Number(period) || 90
  const to = new Date()
  to.setHours(12, 0, 0, 0)
  const from = new Date(to)
  from.setDate(to.getDate() - days + 1)
  return { from, to, days }
}

function analysisBranchId(raw) {
  const normalized = normalizeText(raw)
  const found = ANALYSIS_BRANCHES.find(branch => branch.aliases.some(alias => normalized.includes(normalizeText(alias))))
  return found?.id || 'other'
}

function analysisBranchLabel(id) {
  return ANALYSIS_BRANCHES.find(branch => branch.id === id)?.label || 'EXTRA'
}

function analysisSkillByName(name) {
  const normalized = normalizeText(name)
  return allSkills.find(skill => normalizeText(skill.nome) === normalized) || null
}

function analysisSkillFromLessonRow(row) {
  const nested = row?.skills || {}
  const name = nested.nome || row?.skill_nome || row?.nome || ''
  return analysisSkillByName(name) || nested || { nome: name }
}

function analysisLessonParticipants(lesson) {
  if (lesson?.mockNames) return lesson.mockNames.map(name => ({ id: '', label: name, gruppo: '' }))
  return (lesson?.lezioni_allievi || [])
    .map(row => row?.allievi || row?.allievo || null)
    .filter(Boolean)
    .map(allievo => ({
      id: allievo.id || '',
      label: lezioneTargetLabelAllievo(allievo),
      gruppo: allievo.gruppo || '',
    }))
}

function analysisLessonSkills(lesson) {
  if (lesson?.mockSkills) {
    return lesson.mockSkills.map(name => ({
      nome: name,
      stadio: 1,
      dimensioni: {},
      skill: analysisSkillByName(name) || { nome: name, ramo: name.includes('Frenata') ? 'Frenata' : name.includes('Rotazione') ? 'Rotazione' : 'Andatura' },
    }))
  }
  return (lesson?.lezioni_skills || [])
    .map(row => {
      const skill = analysisSkillFromLessonRow(row)
      const nome = skill?.nome || row?.skills?.nome || row?.skill_nome || ''
      if (!nome || isFakieSkillName(nome)) return null
      return {
        nome,
        stadio: Number(row?.stadio_raggiunto || row?.stadio || 0),
        dimensioni: row?.dimensioni || {},
        skill,
      }
    })
    .filter(Boolean)
}

function analysisTargetOptions() {
  const students = ordinaAllieviLista(allieviVisibiliGod().filter(a => a.stato !== 'archiviato'))
  const groups = [...new Set(students.map(a => a.gruppo).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  return `
    <option value="all">Tutti</option>
    ${students.length ? `<optgroup label="Allievi">${students.map(a => `<option value="allievo:${esc(a.id)}">${esc(lezioneTargetLabelAllievo(a))}</option>`).join('')}</optgroup>` : ''}
    ${groups.length ? `<optgroup label="Gruppi">${groups.map(group => `<option value="gruppo:${esc(group)}">${esc(group)}</option>`).join('')}</optgroup>` : ''}`
}

function analysisSelectedFilters() {
  return {
    period: document.getElementById('analysis-period')?.value || '90',
    target: document.getElementById('analysis-target')?.value || 'all',
    branch: document.getElementById('analysis-branch')?.value || 'all',
    status: document.getElementById('analysis-status')?.value || 'all',
  }
}

function analysisMetricValue(skill, metricId) {
  if (!skill) return null
  const aliases = {
    forze: ['param_forze', 'forze', 'attr_forze'],
    verticalizzazione: ['param_verticalizzazione', 'verticalizzazione', 'attr_verticalizzazione', 'baricentro', 'attr_baricentro'],
    rotazione: ['param_rotazione', 'rotazione', 'attr_rotazione', 'assi', 'attr_assi'],
    tempo: ['param_tempo', 'tempo', 'attr_tempo'],
    stabilita: ['param_stabilita', 'stabilita', 'stabilità', 'attr_stabilita', 'attr_stabilità'],
    asimmetria: ['param_asimmetria', 'asimmetria', 'attr_asimmetria'],
    coordinazione: ['param_coordinazione', 'coordinazione', 'attr_coordinazione'],
  }
  const key = (aliases[metricId] || [metricId]).find(alias => skill[alias] !== undefined && skill[alias] !== null && skill[alias] !== '')
  if (!key) return null
  const value = Number(skill[key])
  return Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : null
}

function analysisBranchForSkill(skill) {
  return analysisBranchId(skill?.ramo || skill?.branch || skill?.categoria || skill?.blocco || skill?.nome)
}

const AnalysisService = {
  async getOverview(filters) {
    if (!lezioniCache) await loadLezioni(true)
    const sourceLessons = lezioniCache?.length ? lezioniCache : ANALYSIS_MOCK_LESSONS
    const lessons = this.filteredLessons(sourceLessons, filters)
    const skillStats = this.skillStats(lessons)
    const branchStats = this.branchStats(skillStats)
    const biomechanicStats = this.biomechanicStats(skillStats)
    return {
      filters,
      isMock: !lezioniCache?.length,
      lessons,
      skillStats,
      branchStats,
      biomechanicStats,
      distribution: this.distribution(lessons, skillStats),
      timeline: this.timeline(lessons, filters.period),
      forgottenSkills: this.forgottenSkills(skillStats),
      criticalSkills: this.criticalSkills(skillStats),
      studentTimeline: this.studentTimeline(lessons, filters.target),
      insights: this.insights(lessons, branchStats, biomechanicStats, skillStats),
    }
  },

  filteredLessons(sourceLessons, filters) {
    const range = analysisPeriodRange(filters.period)
    return (sourceLessons || []).filter(lesson => {
      const date = analysisLessonDate(lesson)
      if (range.from && (!date || date < range.from || date > range.to)) return false
      if (filters.status !== 'all' && lessonStatus(lesson) !== filters.status) return false
      const participants = analysisLessonParticipants(lesson)
      if (filters.target.startsWith('allievo:')) {
        const id = filters.target.slice('allievo:'.length)
        if (!participants.some(p => String(p.id) === String(id))) return false
      }
      if (filters.target.startsWith('gruppo:')) {
        const group = filters.target.slice('gruppo:'.length)
        if (!participants.some(p => p.gruppo === group)) return false
      }
      if (filters.branch !== 'all' && !analysisLessonSkills(lesson).some(row => analysisBranchForSkill(row.skill) === filters.branch)) return false
      return true
    }).sort((a, b) => String(a.data || '').localeCompare(String(b.data || '')))
  },

  skillStats(lessons) {
    const stats = new Map()
    lessons.forEach(lesson => {
      const date = analysisLessonDate(lesson)
      analysisLessonSkills(lesson).forEach(row => {
        const key = normalizeText(row.nome)
        if (!stats.has(key)) {
          stats.set(key, {
            nome: row.nome,
            skill: row.skill,
            count: 0,
            minutes: 0,
            lastDate: null,
            maxStadio: 0,
            branches: new Map(),
          })
        }
        const stat = stats.get(key)
        stat.count += 1
        stat.minutes += Number(lesson.durata_min || 60) / Math.max(1, analysisLessonSkills(lesson).length)
        stat.maxStadio = Math.max(stat.maxStadio, Number(row.stadio || 0))
        if (date && (!stat.lastDate || date > stat.lastDate)) stat.lastDate = date
        const branch = analysisBranchForSkill(row.skill)
        stat.branches.set(branch, (stat.branches.get(branch) || 0) + 1)
      })
    })
    return [...stats.values()].sort((a, b) => b.count - a.count || a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }))
  },

  branchStats(skillStats) {
    const stats = new Map(ANALYSIS_BRANCHES.map(branch => [branch.id, { id: branch.id, label: branch.label, count: 0, minutes: 0 }]))
    stats.set('other', { id: 'other', label: 'ALTRO', count: 0, minutes: 0 })
    skillStats.forEach(skill => {
      const branch = [...skill.branches.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'other'
      const row = stats.get(branch) || stats.get('other')
      row.count += skill.count
      row.minutes += skill.minutes
    })
    return [...stats.values()].filter(row => row.count || row.id !== 'other')
  },

  biomechanicStats(skillStats) {
    return ANALYSIS_BIOMECHANIC_METRICS.map(metric => {
      const values = skillStats
        .map(stat => analysisMetricValue(stat.skill, metric.id))
        .filter(value => value !== null)
      const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
      return { ...metric, value: avg, count: values.length }
    })
  },

  distribution(lessons, skillStats) {
    const totalMinutes = lessons.reduce((sum, lesson) => sum + Number(lesson.durata_min || 60), 0)
    const open = lessons.filter(lesson => lessonStatus(lesson) === 'aperta').length
    return {
      totalMinutes,
      totalLessons: lessons.length,
      open,
      closed: Math.max(0, lessons.length - open),
      uniqueSkills: skillStats.length,
      avgSkills: lessons.length ? skillStats.reduce((sum, skill) => sum + skill.count, 0) / lessons.length : 0,
    }
  },

  timeline(lessons, period) {
    const range = analysisPeriodRange(period === 'all' ? '180' : period)
    const periodStart = range.from || (() => {
      const first = lessons.map(analysisLessonDate).filter(Boolean).sort((a, b) => a - b)[0] || new Date()
      const copy = new Date(first)
      copy.setHours(12, 0, 0, 0)
      return copy
    })()
    const periodEnd = range.to || (() => {
      const last = lessons.map(analysisLessonDate).filter(Boolean).sort((a, b) => b - a)[0] || new Date()
      const copy = new Date(last)
      copy.setHours(12, 0, 0, 0)
      return copy
    })()
    const from = new Date(periodStart)
    from.setDate(from.getDate() - ((from.getDay() + 6) % 7))
    const to = new Date(periodEnd)
    to.setDate(to.getDate() + (6 - ((to.getDay() + 6) % 7)))
    const days = Math.max(7, Math.round((to - from) / 86400000) + 1)
    const weeks = Math.ceil(days / 7)
    const map = new Map()
    lessons.forEach(lesson => {
      const iso = String(lesson.data || '').slice(0, 10)
      if (!iso) return
      if (!map.has(iso)) map.set(iso, [])
      map.get(iso).push(lesson)
    })
    let longestGap = 0
    let currentGap = 0
    const cells = []
    for (let i = 0; i < days; i++) {
      const date = new Date(from)
      date.setDate(from.getDate() + i)
      const iso = analysisIsoFromDate(date)
      const dayLessons = map.get(iso) || []
      const count = dayLessons.length
      const inRange = date >= periodStart && date <= periodEnd
      if (inRange) {
        if (count) {
          if (currentGap > longestGap) longestGap = currentGap
          currentGap = 0
        } else currentGap += 1
      }
      cells.push({ iso, count, lessons: dayLessons, inRange, weekIndex: Math.floor(i / 7) + 1, dayIndex: ((date.getDay() + 6) % 7) + 1, gapEnd: inRange && count > 0 && currentGap === 0 })
    }
    longestGap = Math.max(longestGap, currentGap)
    return { cells, longestGap, weeks }
  },

  forgottenSkills(skillStats) {
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    return skillStats
      .map(stat => ({
        ...stat,
        daysAgo: stat.lastDate ? Math.floor((today - stat.lastDate) / 86400000) : 999,
      }))
      .filter(stat => stat.daysAgo >= 21)
      .sort((a, b) => b.daysAgo - a.daysAgo || b.count - a.count)
      .slice(0, 8)
  },

  criticalSkills(skillStats) {
    return skillStats
      .filter(stat => stat.count >= 2 && stat.maxStadio < 3)
      .sort((a, b) => b.count - a.count || a.maxStadio - b.maxStadio)
      .slice(0, 6)
  },

  studentTimeline(lessons, target) {
    if (!target.startsWith('allievo:')) return []
    const id = target.slice('allievo:'.length)
    return lessons
      .filter(lesson => analysisLessonParticipants(lesson).some(p => String(p.id) === String(id)))
      .slice(-10)
      .reverse()
  },

  insights(lessons, branchStats, biomechanicStats, skillStats) {
    const insights = []
    const total = branchStats.reduce((sum, row) => sum + row.count, 0)
    const dominant = [...branchStats].sort((a, b) => b.count - a.count)[0]
    const weak = [...branchStats].filter(row => row.count > 0).sort((a, b) => a.count - b.count)[0]
    if (dominant && total && dominant.count / total > 0.48) insights.push(`Molto lavoro su ${dominant.label}: ${Math.round(dominant.count / total * 100)}% delle skill registrate.`)
    if (weak && total && weak.count / total < 0.16) insights.push(`${weak.label} e poco presente: valuta un richiamo nelle prossime lezioni.`)
    const missingMetrics = biomechanicStats.filter(row => !row.count).map(row => row.label)
    if (missingMetrics.length) insights.push(`Parametri biomeccanici mancanti per: ${missingMetrics.slice(0, 3).join(', ')}.`)
    const forgotten = this.forgottenSkills(skillStats)
    if (forgotten.length) insights.push(`${forgotten.length} skill non ricompaiono da almeno 21 giorni.`)
    const openCount = lessons.filter(lesson => lessonStatus(lesson) === 'aperta').length
    if (openCount) insights.push(`${openCount} lezion${openCount === 1 ? 'e aperta' : 'i aperte'}: chiuderle rende l'analisi piu affidabile.`)
    if (!insights.length) insights.push('Bilanciamento didattico regolare nel periodo selezionato.')
    return insights
  },
}

async function loadAnalisi() {
  const el = document.getElementById('analisi-content')
  if (!el) return
  el.innerHTML = '<div class="loading">Caricamento analisi...</div>'
  try {
    await renderAnalisi()
  } catch (error) {
    console.error('Analisi non caricata', error)
    el.innerHTML = `<div class="empty">${esc(error.message || 'Analisi non disponibile.')}</div>`
  }
}

async function renderAnalisi() {
  const el = document.getElementById('analisi-content')
  if (!el) return
  const previous = analysisSelectedFilters()
  const data = await AnalysisService.getOverview(previous)
  el.innerHTML = `
    <div class="analysis-hero">
      <div>
        <h2>Analisi</h2>
        <div class="analysis-subtitle">Dashboard didattica su lezioni, skill, rami e parametri biomeccanici.</div>
      </div>
      ${data.isMock ? '<span class="pill warn">Dati demo</span>' : '<span class="pill ok">Dati reali</span>'}
    </div>
    <div class="analysis-filters">
      <label class="field"><span>Periodo</span><select id="analysis-period" onchange="renderAnalisi()">${ANALYSIS_PERIODS.map(period => `<option value="${period.value}" ${period.value === previous.period ? 'selected' : ''}>${esc(period.label)}</option>`).join('')}</select></label>
      <label class="field"><span>Target</span><select id="analysis-target" onchange="renderAnalisi()">${analysisTargetOptions()}</select></label>
      <label class="field"><span>Ramo</span><select id="analysis-branch" onchange="renderAnalisi()"><option value="all">Tutti i rami</option>${ANALYSIS_BRANCHES.map(branch => `<option value="${branch.id}" ${branch.id === previous.branch ? 'selected' : ''}>${esc(branch.label)}</option>`).join('')}<option value="other" ${previous.branch === 'other' ? 'selected' : ''}>EXTRA</option></select></label>
      <label class="field"><span>Stato lezioni</span><select id="analysis-status" onchange="renderAnalisi()"><option value="all">Tutte</option><option value="chiusa" ${previous.status === 'chiusa' ? 'selected' : ''}>Chiuse</option><option value="aperta" ${previous.status === 'aperta' ? 'selected' : ''}>Aperte</option></select></label>
    </div>
    ${renderAnalysisKpis(data)}
    <div class="analysis-grid-2">
      ${renderAnalysisTimeline(data)}
      ${renderAnalysisBranchRadar(data)}
    </div>
    <div class="analysis-grid-2">
      ${renderAnalysisBiomechanics(data)}
      ${renderAnalysisDistribution(data)}
    </div>
    <div class="analysis-grid-3">
      ${renderAnalysisTopSkills(data)}
      ${renderAnalysisForgottenSkills(data)}
      ${renderAnalysisCriticalSkills(data)}
    </div>
    <div class="analysis-grid-2" style="margin-top:1rem">
      ${renderAnalysisStudentTimeline(data)}
      ${renderAnalysisInsights(data)}
    </div>`
  const targetEl = document.getElementById('analysis-target')
  if (targetEl && [...targetEl.options].some(option => option.value === previous.target)) targetEl.value = previous.target
}

function renderAnalysisKpis(data) {
  const d = data.distribution
  const kpis = [
    { icon: '▦', value: d.totalLessons, label: 'Lezioni', note: `${d.closed} chiuse, ${d.open} aperte` },
    { icon: '◷', value: Math.round(d.totalMinutes / 60 * 10) / 10, label: 'Ore didattiche', note: `${d.totalMinutes} minuti registrati` },
    { icon: '◈', value: d.uniqueSkills, label: 'Skill diverse', note: `${d.avgSkills.toFixed(1)} skill per lezione` },
    { icon: '▤', value: data.branchStats.filter(row => row.count).length, label: 'Rami attivi', note: 'STANCE, GAIT, ROTATION, BRAKING' },
  ]
  return `<div class="analysis-kpi-grid">${kpis.map(kpi => `
    <div class="analysis-kpi">
      <div class="analysis-kpi-top"><span>${kpi.icon}</span></div>
      <div class="analysis-kpi-value">${esc(kpi.value)}</div>
      <div class="analysis-kpi-label">${esc(kpi.label)}</div>
      <div class="analysis-kpi-note">${esc(kpi.note)}</div>
    </div>`).join('')}</div>`
}

function renderAnalysisTimeline(data) {
  const max = Math.max(1, ...data.timeline.cells.map(cell => cell.count))
  const weekdayLabels = ['L','M','M','G','V','S','D']
  return `<div class="card">
    <div class="analysis-section-head"><h3>Timeline lezioni</h3><span class="analysis-section-note">Intensita per giorno</span></div>
    <div class="analysis-timeline-layout">
      <div class="analysis-timeline-chart">
        <div class="analysis-heatmap-wrap">
          <div class="analysis-heatmap-weekdays">${weekdayLabels.map(label => `<span>${esc(label)}</span>`).join('')}</div>
          <div class="analysis-heatmap" style="--analysis-weeks:${Math.max(1, data.timeline.weeks || 1)}">${data.timeline.cells.map(cell => {
            const alpha = cell.count ? 0.18 + (cell.count / max) * 0.62 : 0
            const styleBits = [`grid-column:${cell.weekIndex}`, `grid-row:${cell.dayIndex}`]
            if (cell.count) styleBits.push(`background:rgba(110,231,249,${alpha.toFixed(2)})`)
            if (!cell.inRange) styleBits.push('opacity:.28')
            const style = `style="${styleBits.join(';')}"`
            const lessonLabels = [...new Set((cell.lessons || []).flatMap(lesson => {
              const names = analysisLessonParticipants(lesson).map(p => p.label).filter(Boolean)
              return names.length ? names : [tipoLabel(lesson.tipo)]
            }))]
            const more = lessonLabels.length > 6 ? ` +${lessonLabels.length - 6}` : ''
            const detail = lessonLabels.length ? ` · ${lessonLabels.slice(0, 6).join(' · ')}${more}` : ''
            const title = `${formatDate(cell.iso)}: ${cell.count} lezion${cell.count === 1 ? 'e' : 'i'}${detail}`
            return `<span class="analysis-day${cell.count ? ' has-lessons' : ''}${cell.gapEnd ? ' gap-end' : ''}" ${style} title="${esc(title)}" aria-label="${esc(title)}"></span>`
          }).join('')}</div>
        </div>
        <div class="analysis-heatmap-note">Colore piu intenso = piu lezioni. Lascia il mouse su un giorno per i dettagli.</div>
      </div>
      <div class="analysis-timeline-meta">
        <div class="analysis-meta-box"><strong>${data.timeline.longestGap} giorni</strong>Gap massimo senza lezioni nel periodo mostrato.</div>
        <div class="analysis-meta-box"><strong>${data.lessons.length ? formatDate(data.lessons[data.lessons.length - 1].data) : '-'}</strong>Ultima lezione nel filtro corrente.</div>
      </div>
    </div>
  </div>`
}

function renderAnalysisBranchRadar(data) {
  const max = Math.max(1, ...data.branchStats.map(row => row.count))
  return `<div class="card">
    <div class="analysis-section-head"><h3>Rami didattici</h3><span class="analysis-section-note">Distribuzione skill lavorate</span></div>
    <div class="analysis-bars">${data.branchStats.map(row => `
      <div class="analysis-bar-row">
        <strong>${esc(row.label)}</strong>
        <span class="analysis-bar-track"><span class="analysis-bar-fill" style="width:${Math.round(row.count / max * 100)}%"></span></span>
        <span>${row.count}</span>
      </div>`).join('')}</div>
  </div>`
}

function renderAnalysisBiomechanics(data) {
  const max = 5
  return `<div class="card">
    <div class="analysis-section-head"><h3>Parametri biomeccanici</h3><span class="analysis-section-note">Media 0-5 dalle skill</span></div>
    <div class="analysis-bars">${data.biomechanicStats.map(row => `
      <div class="analysis-bar-row">
        <strong>${esc(row.label)}</strong>
        <span class="analysis-bar-track"><span class="analysis-bar-fill" style="width:${Math.round(row.value / max * 100)}%"></span></span>
        <span>${row.count ? row.value.toFixed(1) : '-'}</span>
      </div>`).join('')}</div>
  </div>`
}

function renderAnalysisDistribution(data) {
  const rows = [
    ['Individuali', data.lessons.filter(lesson => lesson.tipo === 'individuale').length],
    ['Gruppo', data.lessons.filter(lesson => lesson.tipo === 'gruppo').length],
    ['Campo libero', data.lessons.filter(lesson => lesson.tipo === 'campo_libero').length],
    ['Skill totali', data.skillStats.reduce((sum, row) => sum + row.count, 0)],
  ]
  return `<div class="card">
    <div class="analysis-section-head"><h3>Distribuzione</h3><span class="analysis-section-note">Composizione lezioni</span></div>
    <table class="analysis-table"><tbody>${rows.map(([label, value]) => `<tr><th>${esc(label)}</th><td>${value}</td></tr>`).join('')}</tbody></table>
  </div>`
}

function renderAnalysisTopSkills(data) {
  const rows = data.skillStats.slice(0, 8)
  return `<div class="card">
    <div class="analysis-section-head"><h3>Top skill</h3><span class="analysis-section-note">Piu lavorate</span></div>
    ${rows.length ? `<table class="analysis-table"><tbody>${rows.map(row => `<tr><td><span class="analysis-skill-line"><strong>${esc(row.nome)}</strong><span class="analysis-pill">${esc(analysisBranchLabel(analysisBranchForSkill(row.skill)))}</span></span></td><td>${row.count}</td></tr>`).join('')}</tbody></table>` : '<div class="empty">Nessuna skill nel filtro.</div>'}
  </div>`
}

function renderAnalysisForgottenSkills(data) {
  const rows = data.forgottenSkills
  return `<div class="card">
    <div class="analysis-section-head"><h3>Skill dimenticate</h3><span class="analysis-section-note">Assenti da 21+ giorni</span></div>
    ${rows.length ? `<table class="analysis-table"><tbody>${rows.map(row => `<tr><td><span class="analysis-skill-line"><strong>${esc(row.nome)}</strong><span class="analysis-stage">${esc(row.lastDate ? formatDate(analysisIsoFromDate(row.lastDate)) : 'Mai ripresa')}</span></span></td><td>${row.daysAgo}g</td></tr>`).join('')}</tbody></table>` : '<div class="empty">Nessuna skill critica per oblio.</div>'}
  </div>`
}

function renderAnalysisCriticalSkills(data) {
  const rows = data.criticalSkills
  return `<div class="card">
    <div class="analysis-section-head"><h3>Skill critiche</h3><span class="analysis-section-note">Ripetute ma non consolidate</span></div>
    ${rows.length ? `<table class="analysis-table analysis-critical-table"><tbody>${rows.map(row => `
      <tr>
        <td><span class="analysis-skill-line"><strong>${esc(row.nome)}</strong><span class="analysis-stage">${esc(stadioLabel(row.maxStadio))}</span></span></td>
        <td>${row.count}x</td>
      </tr>`).join('')}</tbody></table>` : '<div class="empty">Nessuna criticita evidente.</div>'}
  </div>`
}

function renderAnalysisStudentTimeline(data) {
  if (!data.filters.target.startsWith('allievo:')) {
    return `<div class="card"><div class="analysis-section-head"><h3>Timeline allievo</h3><span class="analysis-section-note">Seleziona un allievo</span></div><div class="empty">Disponibile scegliendo un allievo specifico nel filtro Target.</div></div>`
  }
  const rows = data.studentTimeline
  return `<div class="card">
    <div class="analysis-section-head"><h3>Timeline allievo</h3><span class="analysis-section-note">Ultimi passaggi didattici</span></div>
    <div class="analysis-student-timeline">${rows.length ? rows.map(lesson => `
      <div class="analysis-timeline-item">
        <div class="analysis-timeline-date">${esc(formatDate(lesson.data))}</div>
        <div class="analysis-timeline-body"><strong>${esc((analysisLessonSkills(lesson).map(row => row.nome).slice(0, 4).join(', ')) || 'Nessuna skill')}</strong>${esc(lesson.note_speciali || lesson.luogo || tipoLabel(lesson.tipo))}</div>
      </div>`).join('') : '<div class="empty">Nessuna lezione per questo allievo nel filtro.</div>'}</div>
  </div>`
}

function renderAnalysisInsights(data) {
  return `<div class="card">
    <div class="analysis-section-head"><h3>Bilanciamento</h3><span class="analysis-section-note">Lettura didattica automatica</span></div>
    <div class="analysis-insight-list">${data.insights.map(text => `<div class="analysis-insight">${esc(text)}</div>`).join('')}</div>
  </div>`
}

// ── Appuntamenti / disponibilita ─────────────────────────────────────

function maestroAvailabilityStorageKey() {
  return `${MAESTRO_AVAILABILITY_STORAGE_PREFIX}:${currentUid || currentEmail || 'local'}`
}

function maestroExcludedStorageKey() {
  return `${MAESTRO_EXCLUDED_STORAGE_PREFIX}:${currentUid || currentEmail || 'local'}`
}

function availabilityDayOrder(day) {
  return (Number(day) + 6) % 7
}

function availabilityDayLabel(day, short = false) {
  const found = AVAILABILITY_DAYS.find(d => Number(d.value) === Number(day))
  return found ? (short ? found.short : found.label) : ''
}

function availabilityDayIndex(day) {
  return AVAILABILITY_DAYS.findIndex(d => Number(d.value) === Number(day))
}

function availabilityDayRange(startDay, endDay) {
  const startIndex = availabilityDayIndex(startDay)
  const endIndex = availabilityDayIndex(endDay)
  if (startIndex < 0 || endIndex < 0) return []
  const from = Math.min(startIndex, endIndex)
  const to = Math.max(startIndex, endIndex)
  return AVAILABILITY_DAYS.slice(from, to + 1).map(day => day.value)
}

function timeToMinutes(value) {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null
  return hours * 60 + minutes
}

function minutesToTime(value) {
  const minutes = Math.max(0, Math.min(24 * 60, Number(value) || 0))
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function newAvailabilityId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function mergeAvailabilityNotes(...notes) {
  const seen = new Set()
  return notes
    .flatMap(note => String(note || '').split(/\s+\|\s+|\n+/))
    .map(note => note.trim())
    .filter(note => {
      if (!note) return false
      const key = note.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .join(' | ')
}

function normalizeAvailabilitySlots(slots = []) {
  if (!Array.isArray(slots)) return []
  const clean = slots
    .map(slot => {
      const day = Number(slot.day ?? slot.giorno ?? slot.weekday)
      const start = String(slot.start || slot.inizio || '').slice(0, 5)
      const end = String(slot.end || slot.fine || '').slice(0, 5)
      const startMin = timeToMinutes(start)
      const endMin = timeToMinutes(end)
      if (!AVAILABILITY_DAYS.some(d => d.value === day) || startMin === null || endMin === null || endMin <= startMin) return null
      return {
        id: String(slot.id || newAvailabilityId()),
        day,
        start,
        end,
        note: String(slot.note || slot.luogo || '').trim(),
      }
    })
    .filter(Boolean)
    .sort((a, b) => availabilityDayOrder(a.day) - availabilityDayOrder(b.day) || timeToMinutes(a.start) - timeToMinutes(b.start) || timeToMinutes(a.end) - timeToMinutes(b.end))
  const merged = []
  clean.forEach(slot => {
    const previous = merged[merged.length - 1]
    if (!previous || Number(previous.day) !== Number(slot.day) || timeToMinutes(slot.start) >= timeToMinutes(previous.end)) {
      merged.push({ ...slot })
      return
    }
    const previousEnd = timeToMinutes(previous.end)
    const slotEnd = timeToMinutes(slot.end)
    previous.end = minutesToTime(Math.max(previousEnd, slotEnd))
    previous.note = mergeAvailabilityNotes(previous.note, slot.note)
  })
  return merged
}

function loadMaestroAvailabilitySlots(metadata = {}) {
  let local = []
  try { local = JSON.parse(safeStorage.getItem(maestroAvailabilityStorageKey()) || '[]') || [] } catch { local = [] }
  const remote = normalizeAvailabilitySlots(metadata?.[MAESTRO_AVAILABILITY_METADATA_KEY] || metadata?.disponibilita_maestro?.slots || [])
  const slots = remote.length ? remote : normalizeAvailabilitySlots(local)
  safeStorage.setItem(maestroAvailabilityStorageKey(), JSON.stringify(slots))
  return slots
}

function loadMaestroExcludedSlots(metadata = {}) {
  let local = []
  try { local = JSON.parse(safeStorage.getItem(maestroExcludedStorageKey()) || '[]') || [] } catch { local = [] }
  const remote = normalizeAvailabilitySlots(
    metadata?.[MAESTRO_EXCLUDED_METADATA_KEY] ||
    metadata?.disponibilita_maestro?.excluded_slots ||
    metadata?.disponibilita_maestro?.fasce_escluse ||
    []
  )
  const slots = remote.length ? remote : normalizeAvailabilitySlots(local)
  safeStorage.setItem(maestroExcludedStorageKey(), JSON.stringify(slots))
  return slots
}

function setAvailabilityStatus(owner, text, cls = '') {
  const el = document.getElementById(`${availabilityBaseOwner(owner)}-availability-status`)
  if (!el) return
  el.textContent = text || ''
  el.style.color = cls === 'err' ? 'var(--danger)' : (cls === 'ok' ? 'var(--success)' : 'var(--muted)')
}

function activeAppointmentAllievi() {
  return ordinaAllieviLista(allieviVisibiliGod().filter(a => a.stato !== 'archiviato' && !allievoInVacanza(a)))
}

function normalizeAllievoTier(value, vip = false) {
  const raw = String(value || '').trim().toUpperCase()
  if (raw === 'VIP' || vip === true) return 'VIP'
  if (['A', 'B', 'C'].includes(raw)) return raw
  return 'C'
}

function allievoTier(allievo = {}) {
  return normalizeAllievoTier(allievo.tier || allievo.profilo?.tier, allievo.vip)
}

function allievoTierListLabel(allievo = {}) {
  const tier = allievoTier(allievo)
  return tier === 'VIP' ? 'V' : tier
}

function allievoTierRank(allievo = {}) {
  return { VIP: 0, A: 1, B: 2, C: 3 }[allievoTier(allievo)] ?? 3
}

function appointmentSelectableAllievi() {
  return activeAppointmentAllievi()
}

function appointmentSelectionEntries(allievi = appointmentSelectableAllievi()) {
  const entries = []
  const grouped = new Set()
  allievi.forEach(allievo => {
    if (allievo.gruppo) {
      if (!grouped.has(allievo.gruppo)) {
        grouped.add(allievo.gruppo)
        const members = appointmentGroupMembers(allievo.gruppo)
        if (members.length) {
          entries.push({
            type: 'gruppo',
            id: appointmentGroupTargetValue(allievo.gruppo),
            gruppo: allievo.gruppo,
            label: allievo.gruppo,
            memberIds: members.map(member => String(member.id)),
            meta: `${members.length} alliev${members.length === 1 ? 'o' : 'i'} del gruppo`,
          })
        }
      }
      if (!appointmentIndividualLessonsActiveForAllievo(allievo)) return
    }
    entries.push({
      type: 'allievo',
      id: String(allievo.id),
      allievo,
      label: lezioneTargetLabelAllievo(allievo),
      memberIds: [String(allievo.id)],
      meta: [allievoTier(allievo), allievo.gruppo ? 'individuale' : '', allievo.gruppo, vacationLabel(allievo)].filter(Boolean).join(' · '),
    })
  })
  return entries
}

function appointmentSelectionEntryIsSelected(entry) {
  const selected = appointmentSelectedAllieviIds || new Set()
  return (entry.memberIds || []).length && entry.memberIds.every(id => selected.has(String(id)))
}

function appointmentSelectionEntryMode(entry) {
  if (entry.type === 'gruppo') return appointmentTargetPriorityMode({ memberIds: entry.memberIds || [] })
  return appointmentAllievoMode(entry.id)
}

function latestIsoDateValue(values = []) {
  let latest = ''
  let latestTime = -Infinity
  ;(values || []).forEach(value => {
    if (!value) return
    const raw = String(value)
    const parsed = Date.parse(raw)
    const fallback = Date.parse(`${raw.slice(0, 10)}T12:00:00`)
    const time = Number.isNaN(parsed) ? fallback : parsed
    if (!Number.isNaN(time) && time > latestTime) {
      latest = raw
      latestTime = time
    }
  })
  return latest
}

function appointmentAvailabilityUpdatedAtForAllievo(allievo = {}, mode = 'individuale') {
  const profilo = allievo?.profilo || {}
  if (mode === 'gruppo') {
    return latestIsoDateValue([
      profilo.disponibilita_gruppo_updated_at,
      profilo.disponibilita_gruppo_escluse_updated_at,
    ])
  }
  return latestIsoDateValue([
    profilo.disponibilita_updated_at,
    profilo.disponibilita_escluse_updated_at,
  ])
}

function appointmentAvailabilityUpdatedAtForTarget(target) {
  if (!target) return ''
  if (target.type === 'gruppo') {
    return latestIsoDateValue((target.members || []).flatMap(member => [
      appointmentAvailabilityUpdatedAtForAllievo(member, 'gruppo'),
    ]))
  }
  return appointmentAvailabilityUpdatedAtForAllievo(target.allievo, 'individuale')
}

function appointmentAvailabilityUpdatedHtml(target) {
  if (!target) return ''
  const updatedAt = appointmentAvailabilityUpdatedAtForTarget(target)
  const label = updatedAt ? formatDateWithWeekday(updatedAt) : 'non disponibile'
  return `<div class="appointments-availability-updated">Ultima modifica disponibilita: <strong>${esc(label)}</strong></div>`
}

function readAppointmentSelectedIds() {
  try {
    const raw = safeStorage.getItem(APPOINTMENT_SELECTION_STORAGE_KEY)
    if (raw === null) return null
    const ids = JSON.parse(raw || '[]')
    return Array.isArray(ids) ? ids.map(String) : []
  } catch {
    return null
  }
}

function writeAppointmentSelectedIds() {
  safeStorage.setItem(APPOINTMENT_SELECTION_STORAGE_KEY, JSON.stringify([...(appointmentSelectedAllieviIds || new Set())]))
}

function ensureAppointmentSelectionDefaults() {
  const activeIds = new Set(appointmentSelectableAllievi().map(a => String(a.id)))
  if (!appointmentSelectedAllieviIds) {
    const stored = readAppointmentSelectedIds()
    appointmentSelectedAllieviIds = new Set(stored === null ? [...activeIds] : stored.filter(id => activeIds.has(String(id))))
  }
  ;[...appointmentSelectedAllieviIds].forEach(id => {
    if (!activeIds.has(String(id))) appointmentSelectedAllieviIds.delete(id)
  })
  writeAppointmentSelectedIds()
}

function readAppointmentPriorityModes() {
  try {
    const rows = JSON.parse(safeStorage.getItem(APPOINTMENT_PRIORITY_STORAGE_KEY) || '{}')
    return new Map(Object.entries(rows || {}).filter(([, value]) => ['priority', 'flex'].includes(value)))
  } catch {
    return new Map()
  }
}

function writeAppointmentPriorityModes() {
  safeStorage.setItem(APPOINTMENT_PRIORITY_STORAGE_KEY, JSON.stringify(Object.fromEntries(appointmentPriorityModes)))
}

function ensureAppointmentPriorityModes() {
  if (!(appointmentPriorityModes instanceof Map) || !appointmentPriorityModes.size) appointmentPriorityModes = readAppointmentPriorityModes()
}

function appointmentAllievoMode(allievoId) {
  ensureAppointmentPriorityModes()
  return appointmentPriorityModes.get(String(allievoId)) || 'normal'
}

function appointmentTargetPriorityMode(target = {}) {
  const modes = (target.memberIds || []).map(id => appointmentAllievoMode(id))
  if (modes.includes('priority')) return 'priority'
  if (modes.length && modes.every(mode => mode === 'flex')) return 'flex'
  if (modes.includes('flex')) return 'flex'
  return 'normal'
}

function appointmentSelectionStats() {
  ensureAppointmentSelectionDefaults()
  const entries = appointmentSelectionEntries()
  const total = entries.length
  const selected = entries.filter(appointmentSelectionEntryIsSelected).length
  return { selected, total }
}

function appointmentFilteredStats(allievi = filteredAppointmentAllievi()) {
  const stats = appointmentSelectionStats()
  return {
    filtered: allievi.length,
    selected: stats.selected,
  }
}

function appointmentFilteredStatusHtml(allievi = filteredAppointmentAllievi()) {
  const stats = appointmentFilteredStats(allievi)
  return `${stats.filtered} alliev${stats.filtered === 1 ? 'o' : 'i'} nel filtro corrente · ${stats.selected} selezionat${stats.selected === 1 ? 'o' : 'i'} per il planner.`
}

function appointmentSelectedAllievi() {
  ensureAppointmentSelectionDefaults()
  const selected = appointmentSelectedAllieviIds || new Set()
  return activeAppointmentAllievi().filter(a => selected.has(String(a.id)))
}

function appointmentGroups() {
  return [...new Set(activeAppointmentAllievi().map(a => a.gruppo).filter(Boolean))].sort((a, b) => a.localeCompare(b))
}

function appointmentGroupTargetValue(gruppo) {
  return `${APPOINTMENT_GROUP_TARGET_PREFIX}${gruppo}`
}

function appointmentTargetIsGroup(value) {
  return String(value || '').startsWith(APPOINTMENT_GROUP_TARGET_PREFIX)
}

function appointmentGroupFromTarget(value) {
  return appointmentTargetIsGroup(value) ? String(value).slice(APPOINTMENT_GROUP_TARGET_PREFIX.length) : ''
}

function appointmentGroupMembers(gruppo) {
  return activeAppointmentAllievi().filter(a => a.gruppo === gruppo)
}

function appointmentTargetExists(value) {
  if (!value) return false
  if (appointmentTargetIsGroup(value)) return appointmentGroupMembers(appointmentGroupFromTarget(value)).length > 0
  return activeAppointmentAllievi().some(a => String(a.id) === String(value))
}

function selectedAppointmentTarget() {
  const selected = appuntamentiSelectedAllievoId
  if (!selected) return null
  if (appointmentTargetIsGroup(selected)) {
    const gruppo = appointmentGroupFromTarget(selected)
    const members = appointmentGroupMembers(gruppo)
    if (!members.length) return null
    return {
      type: 'gruppo',
      value: selected,
      gruppo,
      label: gruppo,
      members,
    }
  }
  const allievo = allievoById(selected)
  return allievo ? {
    type: 'allievo',
    value: String(allievo.id),
    allievo,
    label: lezioneTargetLabelAllievo(allievo),
    members: [allievo],
  } : null
}

function availabilityTargetOptions(selected = '') {
  const attivi = activeAppointmentAllievi()
  const gruppi = appointmentGroups()
  return `
    <option value="">— Scegli allievo o gruppo —</option>
    ${gruppi.length ? `
      <optgroup label="Gruppi">
        ${gruppi.map(gruppo => {
          const value = appointmentGroupTargetValue(gruppo)
          const count = appointmentGroupMembers(gruppo).length
          return `<option value="${esc(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${esc(gruppo)} (${count})</option>`
        }).join('')}
      </optgroup>` : ''}
    ${gruppi.map(gruppo => `
      <optgroup label="Allievi · ${esc(gruppo)}">
        ${attivi.filter(a => a.gruppo === gruppo).map(a => `<option value="${esc(a.id)}" ${String(a.id) === String(selected) ? 'selected' : ''}>${esc(lezioneTargetLabelAllievo(a))}</option>`).join('')}
      </optgroup>`).join('')}
    ${attivi.some(a => !a.gruppo) ? `
      <optgroup label="Senza gruppo">
        ${attivi.filter(a => !a.gruppo).map(a => `<option value="${esc(a.id)}" ${String(a.id) === String(selected) ? 'selected' : ''}>${esc(lezioneTargetLabelAllievo(a))}</option>`).join('')}
      </optgroup>` : ''}`
}

function selectedAppointmentAllievo() {
  const target = selectedAppointmentTarget()
  return target?.type === 'allievo' ? target.allievo : null
}

function availabilitySlotsForAllievo(allievo) {
  return normalizeAvailabilitySlots(allievo?.profilo?.disponibilita_slots || allievo?.profilo?.availability_slots || [])
}

function availabilityExcludedSlotsForAllievo(allievo) {
  return normalizeAvailabilitySlots(allievo?.profilo?.disponibilita_escluse_slots || allievo?.profilo?.availability_excluded_slots || [])
}

function availabilitySlotsSignature(slots = []) {
  return JSON.stringify(normalizeAvailabilitySlots(slots).map(slot => ({
    day: Number(slot.day),
    start: slot.start,
    end: slot.end,
    note: slot.note || '',
  })))
}

function availabilityGroupDedicatedSlotsForMember(member) {
  return normalizeAvailabilitySlots(member?.profilo?.disponibilita_gruppo_slots || member?.profilo?.group_availability_slots || [])
}

function availabilityGroupDedicatedExcludedSlotsForMember(member) {
  return normalizeAvailabilitySlots(member?.profilo?.disponibilita_gruppo_escluse_slots || member?.profilo?.group_availability_excluded_slots || [])
}

function availabilitySlotsForGroup(gruppo) {
  const members = appointmentGroupMembers(gruppo)
  const source = members.find(member => availabilityGroupDedicatedSlotsForMember(member).length)
  if (source) return availabilityGroupDedicatedSlotsForMember(source)
  const legacySource = members.find(member => availabilitySlotsForAllievo(member).length)
  return legacySource ? availabilitySlotsForAllievo(legacySource) : []
}

function availabilityExcludedSlotsForGroup(gruppo) {
  const members = appointmentGroupMembers(gruppo)
  const source = members.find(member => availabilityGroupDedicatedExcludedSlotsForMember(member).length)
  if (source) return availabilityGroupDedicatedExcludedSlotsForMember(source)
  const legacySource = members.find(member => availabilityExcludedSlotsForAllievo(member).length)
  return legacySource ? availabilityExcludedSlotsForAllievo(legacySource) : []
}

function availabilitySlotsForAppointmentTarget(target = selectedAppointmentTarget()) {
  if (!target) return []
  if (target.type === 'gruppo') return availabilitySlotsForGroup(target.gruppo)
  return availabilitySlotsForAllievo(target.allievo)
}

function availabilityExcludedSlotsForAppointmentTarget(target = selectedAppointmentTarget()) {
  if (!target) return []
  if (target.type === 'gruppo') return availabilityExcludedSlotsForGroup(target.gruppo)
  return availabilityExcludedSlotsForAllievo(target.allievo)
}

function availabilityNoteForAppointmentTarget(target = selectedAppointmentTarget()) {
  if (!target) return ''
  if (target.type === 'gruppo') {
    const dedicatedNotes = mergeAvailabilityNotes(...target.members.map(member => member.profilo?.disponibilita_gruppo))
    return dedicatedNotes || mergeAvailabilityNotes(...target.members.map(member => member.profilo?.disponibilita))
  }
  return target.allievo?.profilo?.disponibilita || ''
}

function normalizeAppointmentWeeklyCount(value) {
  const parsed = parseInt(value, 10)
  if (!Number.isFinite(parsed)) return APPOINTMENT_DEFAULT_WEEKLY_COUNT
  return Math.max(APPOINTMENT_DEFAULT_WEEKLY_COUNT, Math.min(APPOINTMENT_MAX_WEEKLY_COUNT, parsed))
}

function appointmentWeeklyCountForAllievo(allievo) {
  return normalizeAppointmentWeeklyCount(allievo?.profilo?.appuntamenti_settimanali || allievo?.profilo?.lezioni_settimanali || APPOINTMENT_DEFAULT_WEEKLY_COUNT)
}

function appointmentWeeklyCountForTarget(target = selectedAppointmentTarget()) {
  if (!target) return APPOINTMENT_DEFAULT_WEEKLY_COUNT
  if (target.type === 'gruppo') {
    const source = target.members.find(member => member.profilo?.appuntamenti_settimanali || member.profilo?.lezioni_settimanali)
    return appointmentWeeklyCountForAllievo(source || target.members[0])
  }
  return appointmentWeeklyCountForAllievo(target.allievo)
}

function lessonAllievoIds(lezione = {}) {
  return (lezione.lezioni_allievi || [])
    .map(row => row.allievo_id || row.allievi?.id)
    .filter(Boolean)
    .map(id => String(id))
}

function allievoHasIndividualLessonHistory(allievo) {
  if (!allievo?.id || !lezioniCache) return false
  const id = String(allievo.id)
  return (lezioniCache || []).some(lezione => {
    if (lezione?.tipo !== 'individuale') return false
    const ids = lessonAllievoIds(lezione)
    return ids.length === 1 && ids.includes(id)
  })
}

function appointmentIndividualLessonsActiveForAllievo(allievo) {
  if (!allievo?.gruppo) return true
  const profilo = allievo.profilo || {}
  if (profilo.appuntamenti_individuali_attivi === false) return false
  if (profilo.appuntamenti_individuali_attivi === true) return true
  return allievoHasIndividualLessonHistory(allievo)
}

function normalizeAppointmentConsecutiveMode(value, legacyAvoid = undefined) {
  const raw = String(value || '').toLowerCase()
  if (['prefer', 'preferibilmente', 'soft', 'preference'].includes(raw)) return APPOINTMENT_CONSECUTIVE_PREFER
  if (['strict', 'assolutamente', 'hard', 'absolute', 'assoluto'].includes(raw)) return APPOINTMENT_CONSECUTIVE_STRICT
  if (legacyAvoid === false) return APPOINTMENT_CONSECUTIVE_PREFER
  return APPOINTMENT_CONSECUTIVE_STRICT
}

function appointmentAvoidConsecutiveForAllievo(allievo) {
  return true
}

function appointmentConsecutiveModeForAllievo(allievo) {
  const profilo = allievo?.profilo || {}
  return normalizeAppointmentConsecutiveMode(profilo.appuntamenti_giorni_consecutivi, profilo.appuntamenti_evita_giorni_consecutivi)
}

function appointmentAvoidConsecutiveForTarget(target = selectedAppointmentTarget()) {
  return true
}

function appointmentConsecutiveModeForTarget(target = selectedAppointmentTarget()) {
  if (!target) return APPOINTMENT_CONSECUTIVE_STRICT
  if (target.type === 'gruppo') {
    const source = target.members.find(member => member.profilo && (
      Object.prototype.hasOwnProperty.call(member.profilo, 'appuntamenti_giorni_consecutivi') ||
      Object.prototype.hasOwnProperty.call(member.profilo, 'appuntamenti_evita_giorni_consecutivi')
    ))
    return appointmentConsecutiveModeForAllievo(source || target.members[0])
  }
  return appointmentConsecutiveModeForAllievo(target.allievo)
}

function appointmentConsecutiveModeLabel(mode) {
  return normalizeAppointmentConsecutiveMode(mode) === APPOINTMENT_CONSECUTIVE_STRICT
    ? 'Assolutamente non giorni consecutivi'
    : 'Preferibilmente non giorni consecutivi'
}

function appointmentConsecutiveModeIsStrict(mode) {
  return normalizeAppointmentConsecutiveMode(mode) === APPOINTMENT_CONSECUTIVE_STRICT
}

function normalizeAppointmentLessonDuration(value, fallback = APPOINTMENT_MIN_LESSON_MIN) {
  const parsed = parseInt(value, 10)
  const fallbackValue = Number.isFinite(Number(fallback)) ? Number(fallback) : APPOINTMENT_MIN_LESSON_MIN
  if (!Number.isFinite(parsed) || parsed <= 0) return Math.max(AVAILABILITY_STEP_MIN, fallbackValue)
  return Math.max(AVAILABILITY_STEP_MIN, availabilitySnap(parsed))
}

function appointmentLessonDurationForTarget(target = selectedAppointmentTarget(), fallback = APPOINTMENT_MIN_LESSON_MIN) {
  if (!target) return normalizeAppointmentLessonDuration(null, fallback)
  if (target.type === 'gruppo') {
    const duration = profiloComuneGruppo(target.members).durata_lezione
    return normalizeAppointmentLessonDuration(duration, fallback)
  }
  const allievo = target.allievo
  const logistica = logisticaIndividualeProfilo(allievo?.profilo || {}, !!allievo?.gruppo)
  return normalizeAppointmentLessonDuration(logistica.durata_lezione || allievo?.profilo?.durata_lezione, fallback)
}

function availabilitySlotsForOwner(owner) {
  if (owner === 'maestro') return normalizeAvailabilitySlots(maestroAvailabilitySlots)
  if (owner === 'maestro-excluded') return normalizeAvailabilitySlots(maestroExcludedSlots)
  if (owner === 'allievo-excluded') return availabilityExcludedSlotsForAppointmentTarget()
  return availabilitySlotsForAppointmentTarget()
}

function availabilityBaseOwner(owner) {
  return availabilityOwnerIsExcluded(owner) ? String(owner).replace(/-excluded$/, '') : owner
}

function availabilityTargetUndoKey(target = selectedAppointmentTarget()) {
  if (!target) return 'allievo:none'
  if (target.type === 'gruppo') return `gruppo:${target.gruppo}`
  return `allievo:${target.allievo?.id || 'none'}`
}

function availabilityOwnerKey(owner, target = selectedAppointmentTarget()) {
  if (owner === 'maestro') return 'maestro'
  if (owner === 'maestro-excluded') return 'maestro-excluded'
  if (owner === 'allievo-excluded') return `${availabilityTargetUndoKey(target)}:excluded`
  return availabilityTargetUndoKey(target)
}

function availabilityCanUndo(owner, target = selectedAppointmentTarget()) {
  return (availabilityUndoStacks.get(availabilityOwnerKey(owner, target)) || []).length > 0
}

function availabilityOwnerIsExcluded(owner) {
  return String(owner || '').endsWith('-excluded')
}

function availabilityModeKey(owner, target = selectedAppointmentTarget()) {
  return availabilityOwnerKey(availabilityBaseOwner(owner), target)
}

function availabilityPlannerMode(owner, target = selectedAppointmentTarget()) {
  return availabilityEditModes.get(availabilityModeKey(owner, target)) || ''
}

function availabilityPlannerIsEditable(owner, target = selectedAppointmentTarget()) {
  const mode = availabilityPlannerMode(owner, target)
  if (!mode) return false
  return availabilityOwnerIsExcluded(owner) ? mode === 'excluded' : mode === 'available'
}

function availabilityUndoSnapshot(slots = []) {
  return normalizeAvailabilitySlots(slots).map(slot => ({ ...slot }))
}

function pushAvailabilityUndo(owner, previousSlots, target = selectedAppointmentTarget()) {
  const key = availabilityOwnerKey(owner, target)
  const stack = availabilityUndoStacks.get(key) || []
  stack.push(availabilityUndoSnapshot(previousSlots))
  if (stack.length > 20) stack.shift()
  availabilityUndoStacks.set(key, stack)
}

function setAvailabilityPlannerMode(owner, mode) {
  const baseOwner = availabilityBaseOwner(owner)
  const key = availabilityModeKey(baseOwner)
  const normalizedMode = mode === 'excluded' ? 'excluded' : mode === 'available' ? 'available' : ''
  const currentMode = availabilityEditModes.get(key) || ''
  if (!normalizedMode || currentMode === normalizedMode) availabilityEditModes.delete(key)
  else availabilityEditModes.set(key, normalizedMode)
  renderAppuntamenti()
  const nextMode = availabilityEditModes.get(key) || ''
  setAvailabilityStatus(baseOwner, nextMode === 'excluded'
    ? 'Inserimento fasce escluse attivo.'
    : nextMode === 'available'
      ? 'Inserimento disponibilita attivo.'
      : 'Inserimento disattivato.',
    nextMode ? 'ok' : '')
}

function availabilityModeControlsHtml(owner) {
  const mode = availabilityPlannerMode(owner)
  const availableActive = mode === 'available'
  const excludedActive = mode === 'excluded'
  const excludedOwner = `${owner}-excluded`
  const availabilityCount = availabilitySlotsForOwner(owner).length
  const excludedCount = availabilitySlotsForOwner(excludedOwner).length
  return `
    <div class="availability-card-actions">
      <button type="button" class="btn ${availableActive ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="setAvailabilityPlannerMode('${owner}','available')">Inserisci disponibilita</button>
      <button type="button" class="btn ${excludedActive ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="setAvailabilityPlannerMode('${owner}','excluded')">Inserisci fasce escluse</button>
      <button type="button" class="btn btn-outline btn-sm" onclick="undoAvailability('${owner}')" ${availabilityCanUndo(owner) ? '' : 'disabled'}>Annulla disp.</button>
      <button type="button" class="btn btn-outline btn-sm" onclick="undoAvailability('${excludedOwner}')" ${availabilityCanUndo(excludedOwner) ? '' : 'disabled'}>Annulla escl.</button>
      <button type="button" class="btn btn-delete-soft btn-sm" onclick="clearAvailabilitySlots('${owner}')" ${availabilityCount ? '' : 'disabled'}>Cancella disp.</button>
      <button type="button" class="btn btn-delete-soft btn-sm" onclick="clearAvailabilitySlots('${excludedOwner}')" ${excludedCount ? '' : 'disabled'}>Cancella escl.</button>
    </div>`
}

function availabilityDeleteTargetLabel(owner, target = selectedAppointmentTarget()) {
  if (availabilityBaseOwner(owner) === 'maestro') return 'maestro'
  if (target?.type === 'gruppo') return `gruppo ${target.gruppo}`
  if (target?.type === 'allievo') return target.label
  return 'selezione corrente'
}

function availabilityDeleteKindLabel(owner, singular = false) {
  if (availabilityOwnerIsExcluded(owner)) return singular ? 'fascia esclusa' : 'fasce escluse'
  return singular ? 'disponibilita' : 'disponibilita'
}

async function clearAvailabilitySlots(owner) {
  const slots = availabilitySlotsForOwner(owner)
  if (!slots.length) {
    setAvailabilityStatus(owner, `Nessuna ${availabilityDeleteKindLabel(owner)} da cancellare.`)
    return
  }
  const targetLabel = availabilityDeleteTargetLabel(owner)
  const kind = availabilityDeleteKindLabel(owner)
  if (!confirm(`Cancellare tutte le ${kind} per ${targetLabel}?\nVerranno rimosse ${slots.length} fasc${slots.length === 1 ? 'ia' : 'e'}.`)) return
  try {
    await saveAvailabilitySlotsForOwner(owner, [], `Tutte le ${kind} sono state cancellate.`)
  } catch (e) {
    setAvailabilityStatus(owner, e.message || `Errore cancellazione ${kind}.`, 'err')
  }
}

async function undoAvailability(owner) {
  const target = availabilityBaseOwner(owner) === 'maestro' ? null : selectedAppointmentTarget()
  if (availabilityBaseOwner(owner) !== 'maestro' && !target) return
  const key = availabilityOwnerKey(owner, target)
  const stack = availabilityUndoStacks.get(key) || []
  const previousSlots = stack.pop()
  if (!previousSlots) {
    setAvailabilityStatus(owner, 'Nessuna modifica da annullare.')
    return
  }
  availabilityUndoStacks.set(key, stack)
  try {
    await saveAvailabilitySlotsForOwner(owner, previousSlots, 'Ultima modifica annullata.', { skipUndo: true })
  } catch (e) {
    stack.push(previousSlots)
    availabilityUndoStacks.set(key, stack)
    setAvailabilityStatus(owner, e.message || 'Errore annullamento disponibilita.', 'err')
  }
}

function availabilityGridHeight() {
  return ((AVAILABILITY_END_MIN - AVAILABILITY_START_MIN) / 60) * availabilityHourPx()
}

function availabilityHourPx() {
  return window.ResponsiveShell?.isMobile() ? 24 : AVAILABILITY_HOUR_PX
}

function availabilityGridRangeHtml() {
  return `<div class="availability-grid-range" aria-label="Orari visualizzati nella tabella">
    <span>Orari tabella</span>
    <label><span>Inizio</span><input type="time" value="${minutesToTime(AVAILABILITY_START_MIN)}" step="3600" onchange="setAvailabilityGridRange('start',this.value)"></label>
    <label><span>Fine</span><input type="time" value="${minutesToTime(AVAILABILITY_END_MIN)}" step="3600" onchange="setAvailabilityGridRange('end',this.value)"></label>
  </div>`
}

function setAvailabilityGridRange(bound, value) {
  const minutes = timeToMinutes(value)
  if (minutes == null) return
  const snapped = Math.round(minutes / 60) * 60
  if (bound === 'start') AVAILABILITY_START_MIN = Math.max(0, Math.min(AVAILABILITY_END_MIN - 60, snapped))
  if (bound === 'end') AVAILABILITY_END_MIN = Math.min(24 * 60, Math.max(AVAILABILITY_START_MIN + 60, snapped))
  renderAppuntamenti()
}

function availabilityHourLabels() {
  const labels = []
  for (let min = AVAILABILITY_START_MIN; min <= AVAILABILITY_END_MIN; min += 60) labels.push(min)
  return labels
}

function availabilityClampStart(value, duration = AVAILABILITY_STEP_MIN) {
  return Math.max(AVAILABILITY_START_MIN, Math.min(AVAILABILITY_END_MIN - duration, value))
}

function availabilityClampEnd(value, startMin) {
  return Math.max(startMin + AVAILABILITY_STEP_MIN, Math.min(AVAILABILITY_END_MIN, value))
}

function availabilitySnap(value) {
  return Math.round(value / AVAILABILITY_STEP_MIN) * AVAILABILITY_STEP_MIN
}

function availabilityMinutesFromEvent(event, col) {
  const rect = col.getBoundingClientRect()
  const raw = AVAILABILITY_START_MIN + ((event.clientY - rect.top) / availabilityHourPx()) * 60
  return Math.max(AVAILABILITY_START_MIN, Math.min(AVAILABILITY_END_MIN, availabilitySnap(raw)))
}

function availabilitySlotStyle(slot) {
  const startMin = timeToMinutes(slot.start)
  const endMin = timeToMinutes(slot.end)
  const top = ((startMin - AVAILABILITY_START_MIN) / 60) * availabilityHourPx()
  const height = Math.max(18, ((endMin - startMin) / 60) * availabilityHourPx())
  return `top:${top}px;height:${height}px`
}

function availabilitySlotBlockHtml(owner, slot, preview = false) {
  const excluded = availabilityOwnerIsExcluded(owner)
  const editable = !preview && availabilityPlannerIsEditable(owner)
  const cls = `${preview ? 'availability-drag-preview' : 'availability-slot-block'}${excluded ? ' is-excluded' : ''}${!preview && !editable ? ' is-inactive' : ''}${editable ? ' is-editable' : ''}`
  const title = `${excluded ? 'Esclusa · ' : ''}${availabilityDayLabel(slot.day)} ${slot.start}-${slot.end}${slot.note ? ` · ${slot.note}` : ''}`
  const handlers = preview || !editable
    ? ''
    : `onpointerdown="startAvailabilityMove(event,'${owner}',${jsArg(slot.id)})" ondblclick="editAvailabilitySlotNote('${owner}',${jsArg(slot.id)})"`
  return `
    <div class="${cls}" style="${availabilitySlotStyle(slot)}" title="${esc(title)}" ${handlers}>
      <span class="availability-slot-time"><span>${esc(slot.start)}</span><span>${esc(slot.end)}</span></span>
      ${slot.note ? `<span class="availability-slot-note">${esc(slot.note)}</span>` : ''}
      ${editable ? `<button type="button" class="availability-slot-delete" onclick="event.stopPropagation(); removeAvailabilitySlot('${owner}',${jsArg(slot.id)})" title="Elimina fascia">×</button><div class="availability-slot-resize" onpointerdown="startAvailabilityResize(event,'${owner}',${jsArg(slot.id)})"></div>` : ''}
    </div>`
}

function availabilityPlannerHtml(owner, slots, excludedSlots = []) {
  const normalized = normalizeAvailabilitySlots(slots)
  const normalizedExcluded = normalizeAvailabilitySlots(excludedSlots)
  const byDay = new Map(AVAILABILITY_DAYS.map(day => [day.value, []]))
  normalized.forEach(slot => byDay.get(Number(slot.day))?.push({ owner, slot }))
  normalizedExcluded.forEach(slot => byDay.get(Number(slot.day))?.push({ owner: `${owner}-excluded`, slot }))
  byDay.forEach(items => items.sort((a, b) => timeToMinutes(a.slot.start) - timeToMinutes(b.slot.start) || timeToMinutes(a.slot.end) - timeToMinutes(b.slot.end) || (availabilityOwnerIsExcluded(a.owner) ? 1 : 0) - (availabilityOwnerIsExcluded(b.owner) ? 1 : 0)))
  const style = `--availability-hour-px:${availabilityHourPx()}px;--availability-grid-height:${availabilityGridHeight()}px`
  const mode = availabilityPlannerMode(owner)
  const editable = !!mode
  return `
    <div class="availability-planner ${editable ? 'is-editing' : 'is-locked'}${mode === 'excluded' ? ' is-excluded-planner' : ''}" id="${owner}-availability-planner" data-owner="${owner}" style="${style}">
      <div class="availability-planner-help">${mode === 'excluded' ? 'Modalita fasce escluse: trascina per creare blocchi da sottrarre al planner.' : mode === 'available' ? 'Modalita disponibilita: trascina per creare orari utili al planner. Trascina un blocco per spostarlo, usa il bordo basso per ridimensionarlo, doppio click per una nota.' : 'Scegli Inserisci disponibilita o Inserisci fasce escluse prima di modificare la griglia.'}</div>
      <div class="availability-grid-wrap">
        <div class="availability-week-head">
          <div></div>
          ${AVAILABILITY_DAYS.map(day => `<div>${esc(day.short)}</div>`).join('')}
        </div>
        <div class="availability-week-body">
          <div class="availability-time-axis">
            ${availabilityHourLabels().map(min => `<div class="availability-time-label" style="top:${((min - AVAILABILITY_START_MIN) / 60) * availabilityHourPx()}px">${minutesToTime(min)}</div>`).join('')}
          </div>
          ${AVAILABILITY_DAYS.map(day => `
            <div class="availability-day-col" data-owner="${owner}" data-day="${day.value}" onpointerdown="startAvailabilityCreate(event,'${owner}',${day.value})">
              ${(byDay.get(day.value) || []).map(item => availabilitySlotBlockHtml(item.owner, item.slot)).join('')}
            </div>`).join('')}
        </div>
      </div>
      <div class="appointments-status">${normalized.length} disponibilita · ${normalizedExcluded.length} fasc${normalizedExcluded.length === 1 ? 'ia esclusa' : 'e escluse'}.</div>
    </div>`
}

function appointmentSelectionPanelHtml(allievi = []) {
  ensureAppointmentSelectionDefaults()
  ensureAppointmentPriorityModes()
  const stats = appointmentSelectionStats()
  const entries = appointmentSelectionEntries(allievi)
  return `
    <div class="appointment-selector-panel">
      <div class="appointment-selector-head">
        <strong>Elementi negli incroci</strong>
        <span>${stats.selected}/${stats.total} selezionati</span>
        <div class="appointment-selector-actions">
          <button type="button" class="btn btn-outline btn-xs" onclick="setAllAppointmentSelection(true)">Tutti</button>
          <button type="button" class="btn btn-outline btn-xs" onclick="setAllAppointmentSelection(false)">Nessuno</button>
        </div>
      </div>
      <div class="appointment-selector-list">
        ${entries.length ? entries.map(entry => {
          const checked = appointmentSelectionEntryIsSelected(entry)
          const mode = appointmentSelectionEntryMode(entry)
          const toggleCall = entry.type === 'gruppo'
            ? `toggleAppointmentGroupSelection(${jsArg(entry.gruppo)}, this.checked)`
            : `toggleAppointmentAllievoSelection(${jsArg(entry.id)}, this.checked)`
          const modeCall = entry.type === 'gruppo'
            ? `setAppointmentGroupPriorityMode(${jsArg(entry.gruppo)}, this.value)`
            : `setAppointmentPriorityMode(${jsArg(entry.id)}, this.value)`
          return `
            <label class="appointment-selector-row${checked ? ' is-selected' : ''}">
              <input type="checkbox" ${checked ? 'checked' : ''} onchange="${toggleCall}">
              <span class="appointment-selector-name">
                <strong>${entry.type === 'gruppo' ? 'Gruppo ' : ''}${esc(entry.label)}</strong>
                <small>${esc(entry.meta)}</small>
              </span>
              <select onchange="${modeCall}" ${checked ? '' : 'disabled'}>
                <option value="normal" ${mode === 'normal' ? 'selected' : ''}>Normale</option>
                <option value="priority" ${mode === 'priority' ? 'selected' : ''}>Priorita</option>
                <option value="flex" ${mode === 'flex' ? 'selected' : ''}>Flessibilita</option>
              </select>
            </label>`
        }).join('') : '<div class="availability-empty">Nessun elemento attivo disponibile.</div>'}
      </div>
    </div>`
}

function appointmentAgendaTypesHtml() {
  return `
    <div class="appointment-agenda-types">
      ${appointmentScheduleVariantDefinitions().map(variant => `
        <button type="button" class="btn ${appointmentCurrentVariant?.id === variant.id ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="generateAppointmentAgenda(${jsArg(variant.id)})">
          ${esc(variant.title)}
        </button>`).join('')}
    </div>`
}

async function loadAppuntamenti() {
  const el = document.getElementById('appuntamenti-content')
  if (!el) return
  if (!lezioniCache) {
    el.innerHTML = '<div class="loading">Caricamento…</div>'
    await loadLezioni(true)
  }
  if (visibleViewName() === 'appuntamenti') renderAppuntamenti()
}

function renderAppuntamenti() {
  const el = document.getElementById('appuntamenti-content')
  if (!el) return
  const attivi = activeAppointmentAllievi()
  ensureAppointmentSelectionDefaults()
  if (appuntamentiSelectedAllievoId && !appointmentTargetExists(appuntamentiSelectedAllievoId)) appuntamentiSelectedAllievoId = null
  if (!appuntamentiSelectedAllievoId && attivi.length) appuntamentiSelectedAllievoId = attivi[0].id
  const selectedTarget = selectedAppointmentTarget()
  const selectedSlots = availabilitySlotsForAppointmentTarget(selectedTarget)
  const selectedExcludedSlots = availabilityExcludedSlotsForAppointmentTarget(selectedTarget)
  const selectedNote = availabilityNoteForAppointmentTarget(selectedTarget)
  const selectedWeeklyCount = appointmentWeeklyCountForTarget(selectedTarget)
  const selectedConsecutiveMode = appointmentConsecutiveModeForTarget(selectedTarget)
  const selectedIndividualToggle = selectedTarget?.type === 'allievo' && !!selectedTarget.allievo?.gruppo
  const selectedIndividualActive = selectedIndividualToggle ? appointmentIndividualLessonsActiveForAllievo(selectedTarget.allievo) : false
  const filteredAllievi = filteredAppointmentAllievi()

  el.innerHTML = `
    <div class="appointments-grid">
      <div class="card">
        <div class="appointments-card-head">
          <div class="appointments-card-title">
            <h3>Disponibilita maestro</h3>
            <span>Unica griglia: inserisci disponibilita o fasce escluse scegliendo la modalita.</span>
          </div>
          ${availabilityModeControlsHtml('maestro')}
        </div>
        ${availabilityGridRangeHtml()}
        ${availabilityPlannerHtml('maestro', maestroAvailabilitySlots, maestroExcludedSlots)}
        <div class="appointments-status" id="maestro-availability-status"></div>
      </div>

      <div class="card">
        <div class="appointments-card-head">
          <div class="appointments-card-title">
            <h3>Disponibilita ${selectedTarget?.type === 'gruppo' ? 'gruppo' : 'allievo'}</h3>
            <span>${selectedTarget?.type === 'gruppo' ? 'Le fasce vengono salvate su tutti i membri attivi del gruppo selezionato.' : 'Le fasce vengono salvate nel profilo dell allievo selezionato.'}</span>
          </div>
          ${selectedTarget ? `
            ${availabilityModeControlsHtml('allievo')}` : ''}
        </div>
        <div class="field">
          <label>Allievo o gruppo</label>
          <select id="appointments-allievo-select" onchange="setAppuntamentiAllievo(this.value)">
            ${availabilityTargetOptions(appuntamentiSelectedAllievoId)}
          </select>
        </div>
        ${appointmentAvailabilityUpdatedHtml(selectedTarget)}
        ${selectedTarget ? `
          <div class="appointments-preferences">
            <div class="field">
              <label>Appuntamenti a settimana</label>
              <input type="number" id="appointments-weekly-count" min="${APPOINTMENT_DEFAULT_WEEKLY_COUNT}" max="${APPOINTMENT_MAX_WEEKLY_COUNT}" step="1" value="${selectedWeeklyCount}" onchange="saveSelectedAppointmentPreferences()">
            </div>
            ${selectedIndividualToggle ? `
              <label class="appointments-check">
                <input type="checkbox" id="appointments-individual-active" ${selectedIndividualActive ? 'checked' : ''} onchange="saveSelectedAppointmentPreferences()">
                <span>Includi anche lezioni individuali</span>
              </label>` : ''}
            <div class="appointments-consecutive-mode" role="radiogroup" aria-label="Giorni consecutivi">
              <label class="appointments-check">
                <input type="radio" name="appointments-consecutive-mode" value="${APPOINTMENT_CONSECUTIVE_PREFER}" ${selectedConsecutiveMode === APPOINTMENT_CONSECUTIVE_PREFER ? 'checked' : ''} onchange="saveSelectedAppointmentPreferences()">
                <span>Preferibilmente non giorni consecutivi</span>
              </label>
              <label class="appointments-check">
                <input type="radio" name="appointments-consecutive-mode" value="${APPOINTMENT_CONSECUTIVE_STRICT}" ${selectedConsecutiveMode === APPOINTMENT_CONSECUTIVE_STRICT ? 'checked' : ''} onchange="saveSelectedAppointmentPreferences()">
                <span>Assolutamente non giorni consecutivi</span>
              </label>
            </div>
          </div>
          ${availabilityPlannerHtml('allievo', selectedSlots, selectedExcludedSlots)}
          <div class="field" style="margin-top:.75rem">
            <label>Note disponibilita</label>
            <textarea id="appointments-allievo-note" placeholder="Testo libero, vincoli dei genitori, preferenze...">${esc(selectedNote)}</textarea>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="saveSelectedAllievoAvailabilityNote()">Salva note</button>
        ` : '<div class="availability-empty">Nessun allievo o gruppo attivo disponibile.</div>'}
        <div class="appointments-status" id="allievo-availability-status"></div>
      </div>

      <div class="card appointments-full">
        <div class="appointments-card-head">
          <div class="appointments-card-title">
            <h3>Incroci maestro-allievo</h3>
            <span>Seleziona chi entra nella proposta e scegli il tipo di agenda da generare.</span>
          </div>
        </div>
        <div class="appointments-toolbar">
          <div class="field">
            <label>Cerca allievo</label>
            <input type="search" id="appointments-search" value="${esc(appuntamentiAllieviQuery)}" placeholder="Nome, nickname, gruppo" oninput="setAppuntamentiQuery(this)">
          </div>
          <div class="field">
            <label>Durata lezione se mancante (min)</label>
            <input type="number" id="appointments-min-duration" min="${APPOINTMENT_MIN_LESSON_MIN}" step="5" value="${APPOINTMENT_MIN_LESSON_MIN}" oninput="clearAppointmentAgendaPreview()">
          </div>
        </div>
        <div class="appointments-status" id="appointments-filter-status">${appointmentFilteredStatusHtml(filteredAllievi)}</div>
        <div id="appointment-selection-panel-holder">${appointmentSelectionPanelHtml(filteredAllievi)}</div>
        <div class="appointments-explainer">
          <strong>Generazione agenda</strong>
          <span>Clicca una tipologia per generare una proposta. Ogni click sulla stessa tipologia prova un'alternativa diversa; le lezioni bloccate restano ferme.</span>
        </div>
        ${appointmentAgendaTypesHtml()}
        <div id="appointments-intersections"></div>
      </div>
    </div>`
  renderAppointmentAgendaPreview()
  requestAnimationFrame(() => motion.cards(el))
}

function setAppuntamentiAllievo(id) {
  appuntamentiSelectedAllievoId = id || null
  renderAppuntamenti()
}

function renderAppointmentSelectionOnly() {
  const filteredAllievi = filteredAppointmentAllievi()
  const status = document.getElementById('appointments-filter-status')
  if (status) status.textContent = appointmentFilteredStatusHtml(filteredAllievi)
  const holder = document.getElementById('appointment-selection-panel-holder')
  if (holder) holder.innerHTML = appointmentSelectionPanelHtml(filteredAllievi)
  renderAppointmentAgendaPreview()
}

function setAppuntamentiQuery(inputOrValue) {
  const input = inputOrValue && typeof inputOrValue === 'object' ? inputOrValue : null
  const value = input ? input.value : inputOrValue
  appuntamentiAllieviQuery = value || ''
  appointmentCurrentVariant = null
  renderAppointmentSelectionOnly()
}

function toggleAppointmentAllievoSelection(allievoId, checked) {
  ensureAppointmentSelectionDefaults()
  const id = String(allievoId)
  if (checked) appointmentSelectedAllieviIds.add(id)
  else appointmentSelectedAllieviIds.delete(id)
  writeAppointmentSelectedIds()
  appointmentCurrentVariant = null
  renderAppuntamenti()
}

function toggleAppointmentGroupSelection(gruppo, checked) {
  ensureAppointmentSelectionDefaults()
  appointmentGroupMembers(gruppo).forEach(member => {
    const id = String(member.id)
    if (checked) appointmentSelectedAllieviIds.add(id)
    else appointmentSelectedAllieviIds.delete(id)
  })
  writeAppointmentSelectedIds()
  appointmentCurrentVariant = null
  renderAppuntamenti()
}

function setAllAppointmentSelection(checked) {
  ensureAppointmentSelectionDefaults()
  const visibleIds = new Set()
  appointmentSelectionEntries(filteredAppointmentAllievi()).forEach(entry => {
    ;(entry.memberIds || []).forEach(id => visibleIds.add(String(id)))
  })
  visibleIds.forEach(id => {
    if (checked) appointmentSelectedAllieviIds.add(id)
    else appointmentSelectedAllieviIds.delete(id)
  })
  writeAppointmentSelectedIds()
  appointmentCurrentVariant = null
  renderAppuntamenti()
}

function setAppointmentPriorityMode(allievoId, mode, options = {}) {
  ensureAppointmentPriorityModes()
  const id = String(allievoId)
  if (mode === 'priority' || mode === 'flex') appointmentPriorityModes.set(id, mode)
  else appointmentPriorityModes.delete(id)
  writeAppointmentPriorityModes()
  appointmentCurrentVariant = null
  if (options.skipRender) return
  renderAppuntamenti()
}

function setAppointmentGroupPriorityMode(gruppo, mode) {
  appointmentGroupMembers(gruppo).forEach(member => setAppointmentPriorityMode(member.id, mode, { skipRender: true }))
  appointmentCurrentVariant = null
  renderAppuntamenti()
}

function clearAppointmentAgendaPreview() {
  appointmentCurrentVariant = null
  renderAppointmentAgendaPreview()
}

function filteredAppointmentAllievi() {
  const query = normalizeText(appuntamentiAllieviQuery)
  return activeAppointmentAllievi().filter(a => {
    if (!query) return true
    const haystack = normalizeText([a.nome, a.cognome, a.nickname, a.gruppo, a.profilo?.disponibilita].filter(Boolean).join(' '))
    return haystack.includes(query)
  })
}

async function saveAvailabilitySlotsForOwner(owner, slots, message = 'Disponibilita salvata.', options = {}) {
  const baseOwner = availabilityBaseOwner(owner)
  const target = baseOwner === 'maestro' ? null : selectedAppointmentTarget()
  const previousSlots = availabilityUndoSnapshot(availabilitySlotsForOwner(owner))
  if (!options.skipUndo && availabilitySlotsSignature(previousSlots) !== availabilitySlotsSignature(slots)) {
    pushAvailabilityUndo(owner, previousSlots, target)
  }
  if (availabilitySlotsSignature(previousSlots) !== availabilitySlotsSignature(slots)) {
    appointmentCurrentVariant = null
  }
  if (owner === 'maestro') {
    const saved = await saveMaestroAvailabilitySlots(slots)
    renderAppuntamenti()
    setAvailabilityStatus('maestro', saved.remote ? message : 'Salvata localmente. Sync online non disponibile.', saved.remote ? 'ok' : '')
    return
  }
  if (owner === 'maestro-excluded') {
    const saved = await saveMaestroExcludedSlots(slots)
    renderAppuntamenti()
    setAvailabilityStatus('maestro-excluded', saved.remote ? message : 'Salvata localmente. Sync online non disponibile.', saved.remote ? 'ok' : '')
    return
  }
  if (!target) return
  if (owner === 'allievo-excluded') {
    if (target.type === 'gruppo') {
      await saveGroupAvailabilityExclusions(target.gruppo, slots)
      renderAppuntamenti()
      setAvailabilityStatus('allievo', `${message} Salvata su ${target.members.length} sched${target.members.length === 1 ? 'a' : 'e'} del gruppo.`, 'ok')
      return
    }
    await saveAllievoAvailabilityExclusions(target.allievo.id, slots, { individualTarget: true })
    renderAppuntamenti()
    setAvailabilityStatus('allievo', message, 'ok')
    return
  }
  if (target.type === 'gruppo') {
    await saveGroupAvailability(target.gruppo, slots)
    renderAppuntamenti()
    setAvailabilityStatus('allievo', `${message} Salvata su ${target.members.length} sched${target.members.length === 1 ? 'a' : 'e'} del gruppo.`, 'ok')
    return
  }
  await saveAllievoAvailability(target.allievo.id, slots, undefined, { individualTarget: true })
  renderAppuntamenti()
  setAvailabilityStatus('allievo', message, 'ok')
}

function availabilityDayColumn(owner, day) {
  return document.querySelector(`.availability-day-col[data-owner="${availabilityBaseOwner(owner)}"][data-day="${day}"]`)
}

function availabilityDayFromPointer(owner, event) {
  const cols = [...document.querySelectorAll(`.availability-day-col[data-owner="${availabilityBaseOwner(owner)}"]`)]
  return cols.find(col => {
    const rect = col.getBoundingClientRect()
    return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
  }) || null
}

function availabilityCurrentDragSlots() {
  if (!availabilityDragState) return []
  return availabilityCurrentDragSlotsFromState(availabilityDragState)
}

function renderAvailabilityDragPreview() {
  document.querySelectorAll('.availability-drag-preview').forEach(el => el.remove())
  const slots = availabilityCurrentDragSlots()
  if (!slots.length || !availabilityDragState) return
  slots.forEach(slot => {
    const col = availabilityDayColumn(availabilityDragState.owner, slot.day)
    if (col) col.insertAdjacentHTML('beforeend', availabilitySlotBlockHtml(availabilityDragState.owner, slot, true))
  })
}

function bindAvailabilityDragEnd() {
  document.addEventListener('pointermove', handleAvailabilityPointerMove)
  document.addEventListener('pointerup', finishAvailabilityPointerDrag, { once: true })
  document.body.classList.add('availability-dragging')
}

function startAvailabilityCreate(event, owner, day) {
  const mode = availabilityPlannerMode(owner)
  if (!mode) {
    setAvailabilityStatus(owner, 'Scegli prima cosa inserire: disponibilita o fasce escluse.')
    return
  }
  const targetOwner = mode === 'excluded' ? `${owner}-excluded` : owner
  if (!availabilityPlannerIsEditable(targetOwner)) return
  if (event.button !== undefined && event.button !== 0) return
  if (event.target.closest('.availability-slot-block')) return
  const col = event.currentTarget
  const startMin = availabilityClampStart(availabilityMinutesFromEvent(event, col), AVAILABILITY_STEP_MIN)
  availabilityDragState = {
    mode: 'create',
    owner: targetOwner,
    startDay: day,
    endDay: day,
    startMin,
    endMin: startMin + AVAILABILITY_STEP_MIN,
  }
  event.preventDefault()
  bindAvailabilityDragEnd()
  renderAvailabilityDragPreview()
}

function startAvailabilityMove(event, owner, slotId) {
  if (!availabilityPlannerIsEditable(owner)) return
  if (event.button !== undefined && event.button !== 0) return
  if (event.target.closest('.availability-slot-delete, .availability-slot-resize')) return
  const slot = availabilitySlotsForOwner(owner).find(item => String(item.id) === String(slotId))
  const col = event.currentTarget.closest('.availability-day-col')
  if (!slot || !col) return
  availabilityDragState = {
    mode: 'move',
    owner,
    slotId,
    originalSlot: slot,
    pointerStartMin: availabilityMinutesFromEvent(event, col),
    currentSlot: slot,
  }
  event.preventDefault()
  event.stopPropagation()
  bindAvailabilityDragEnd()
}

function startAvailabilityResize(event, owner, slotId) {
  if (!availabilityPlannerIsEditable(owner)) return
  if (event.button !== undefined && event.button !== 0) return
  const slot = availabilitySlotsForOwner(owner).find(item => String(item.id) === String(slotId))
  if (!slot) return
  availabilityDragState = {
    mode: 'resize',
    owner,
    slotId,
    originalSlot: slot,
    currentSlot: slot,
  }
  event.preventDefault()
  event.stopPropagation()
  bindAvailabilityDragEnd()
  renderAvailabilityDragPreview()
}

function handleAvailabilityPointerMove(event) {
  if (!availabilityDragState) return
  const state = availabilityDragState
  if (state.mode === 'create') {
    const col = availabilityDayFromPointer(state.owner, event) || availabilityDayColumn(state.owner, state.endDay || state.startDay)
    if (!col) return
    state.endDay = Number(col.dataset.day)
    state.endMin = availabilityMinutesFromEvent(event, col)
  } else if (state.mode === 'move') {
    const col = availabilityDayFromPointer(state.owner, event) || availabilityDayColumn(state.owner, state.originalSlot.day)
    if (!col) return
    const duration = timeToMinutes(state.originalSlot.end) - timeToMinutes(state.originalSlot.start)
    const pointerMin = availabilityMinutesFromEvent(event, col)
    const delta = availabilitySnap(pointerMin - state.pointerStartMin)
    const startMin = availabilityClampStart(timeToMinutes(state.originalSlot.start) + delta, duration)
    state.currentSlot = {
      ...state.originalSlot,
      day: Number(col.dataset.day),
      start: minutesToTime(startMin),
      end: minutesToTime(startMin + duration),
    }
  } else if (state.mode === 'resize') {
    const col = availabilityDayColumn(state.owner, state.originalSlot.day)
    if (!col) return
    const startMin = timeToMinutes(state.originalSlot.start)
    const endMin = availabilityClampEnd(availabilityMinutesFromEvent(event, col), startMin)
    state.currentSlot = {
      ...state.originalSlot,
      end: minutesToTime(endMin),
    }
  }
  renderAvailabilityDragPreview()
}

async function finishAvailabilityPointerDrag() {
  document.removeEventListener('pointermove', handleAvailabilityPointerMove)
  document.body.classList.remove('availability-dragging')
  const state = availabilityDragState
  availabilityDragState = null
  document.querySelectorAll('.availability-drag-preview').forEach(el => el.remove())
  if (!state) return
  const dragSlots = availabilityCurrentDragSlotsFromState(state)
  if (!dragSlots.length) return
  const slots = availabilitySlotsForOwner(state.owner)
  const next = state.mode === 'create'
    ? [...slots, ...dragSlots.map(slot => ({ ...slot, id: newAvailabilityId() }))]
    : slots.map(item => String(item.id) === String(state.slotId) ? { ...dragSlots[0], id: item.id } : item)
  try {
    const excluded = availabilityOwnerIsExcluded(state.owner)
    await saveAvailabilitySlotsForOwner(state.owner, next, state.mode === 'create'
      ? (dragSlots.length > 1 ? (excluded ? 'Fasce escluse create.' : 'Fasce create.') : (excluded ? 'Fascia esclusa creata.' : 'Fascia creata.'))
      : (excluded ? 'Fascia esclusa aggiornata.' : 'Fascia aggiornata.'))
  } catch (e) {
    setAvailabilityStatus(state.owner, e.message || 'Errore salvataggio fascia.', 'err')
  }
}

function availabilityCurrentDragSlotsFromState(state) {
  if (state.mode === 'create') {
    const startMin = Math.min(state.startMin, state.endMin)
    const endMin = Math.max(state.startMin, state.endMin)
    if (endMin - startMin < AVAILABILITY_STEP_MIN) return []
    return availabilityDayRange(state.startDay, state.endDay || state.startDay).map(day => ({
      id: '__new__',
      day,
      start: minutesToTime(startMin),
      end: minutesToTime(endMin),
      note: '',
    }))
  }
  return state.currentSlot ? [state.currentSlot] : []
}

async function editAvailabilitySlotNote(owner, slotId) {
  if (!availabilityPlannerIsEditable(owner)) {
    setAvailabilityStatus(owner, 'Attiva la modalita corretta prima di cambiare questa fascia.')
    return
  }
  const slots = availabilitySlotsForOwner(owner)
  const slot = slots.find(item => String(item.id) === String(slotId))
  if (!slot) return
  const note = prompt('Nota per questa fascia', slot.note || '')
  if (note === null) return
  const next = slots.map(item => String(item.id) === String(slotId) ? { ...item, note: note.trim() } : item)
  try {
    await saveAvailabilitySlotsForOwner(owner, next, 'Nota fascia salvata.')
  } catch (e) {
    setAvailabilityStatus(owner, e.message || 'Errore salvataggio nota.', 'err')
  }
}

async function removeAvailabilitySlot(owner, slotId) {
  if (!availabilityPlannerIsEditable(owner)) {
    setAvailabilityStatus(owner, 'Attiva la modalita corretta prima di cambiare questa fascia.')
    return
  }
  const slots = availabilitySlotsForOwner(owner)
  const slot = slots.find(item => String(item.id) === String(slotId))
  if (!slot) return
  const kind = availabilityDeleteKindLabel(owner, true)
  const details = `${availabilityDayLabel(slot.day)} ${slot.start}-${slot.end}${slot.note ? ` · ${slot.note}` : ''}`
  if (!confirm(`Cancellare questa ${kind}?\n${details}`)) return
  try {
    const next = slots.filter(slot => String(slot.id) !== String(slotId))
    await saveAvailabilitySlotsForOwner(owner, next, availabilityOwnerIsExcluded(owner) ? 'Fascia esclusa rimossa.' : 'Fascia rimossa.')
  } catch (e) {
    setAvailabilityStatus(owner, e.message || 'Errore rimozione fascia.', 'err')
  }
}

async function saveMaestroAvailabilitySlots(slots) {
  maestroAvailabilitySlots = normalizeAvailabilitySlots(slots)
  safeStorage.setItem(maestroAvailabilityStorageKey(), JSON.stringify(maestroAvailabilitySlots))
  if (!sb?.auth) return { remote: false }
  const payload = {
    ...currentUserMetadata,
    [MAESTRO_AVAILABILITY_METADATA_KEY]: maestroAvailabilitySlots,
    disponibilita_maestro_updated_at: new Date().toISOString(),
  }
  const { user, error } = await updateCurrentUserMetadata(payload)
  if (error) return { remote: false, error }
  currentUserMetadata = user?.user_metadata || payload
  return { remote: true }
}

async function saveMaestroExcludedSlots(slots) {
  maestroExcludedSlots = normalizeAvailabilitySlots(slots)
  safeStorage.setItem(maestroExcludedStorageKey(), JSON.stringify(maestroExcludedSlots))
  if (!sb?.auth) return { remote: false }
  const payload = {
    ...currentUserMetadata,
    [MAESTRO_EXCLUDED_METADATA_KEY]: maestroExcludedSlots,
    disponibilita_maestro_escluse_updated_at: new Date().toISOString(),
  }
  const { user, error } = await updateCurrentUserMetadata(payload)
  if (error) return { remote: false, error }
  currentUserMetadata = user?.user_metadata || payload
  return { remote: true }
}

async function saveAllievoAvailability(allievoId, slots, noteValue = undefined, options = {}) {
  const allievo = allievoById(allievoId)
  if (!allievo) throw new Error('Allievo non trovato.')
  const normalizedSlots = normalizeAvailabilitySlots(slots)
  const profilo = {
    ...(allievo.profilo || {}),
    disponibilita_updated_at: new Date().toISOString(),
  }
  if (options.groupTarget) {
    profilo.disponibilita_gruppo_slots = normalizedSlots
    profilo.disponibilita_gruppo_updated_at = new Date().toISOString()
    if (noteValue !== undefined) profilo.disponibilita_gruppo = noteValue.trim() || null
    if (!appointmentIndividualLessonsActiveForAllievo(allievo)) {
      profilo.disponibilita_slots = normalizedSlots
      if (noteValue !== undefined) profilo.disponibilita = noteValue.trim() || null
    }
  } else {
    profilo.disponibilita_slots = normalizedSlots
    if (allievo.gruppo && options.individualTarget) profilo.disponibilita_individuale_attiva = true
    if (noteValue !== undefined) profilo.disponibilita = noteValue.trim() || null
  }
  let payload = { profilo, aggiornato_il: new Date().toISOString() }
  let { data, error } = await sb.from('allievi').update(payload).eq('id', allievoId).select().single()
  if (error && /aggiornato_il|updated_at|schema cache|column/i.test(error.message || error.details || error.hint || '')) {
    payload = { profilo }
    ;({ data, error } = await sb.from('allievi').update(payload).eq('id', allievoId).select().single())
  }
  if (error) throw error
  allAllievi = allAllievi.map(a => String(a.id) === String(allievoId) ? (data || { ...a, ...payload }) : a)
  logModificaLocale('allievo', allievoId, 'Aggiornate disponibilita')
}

async function saveAllievoAvailabilityExclusions(allievoId, slots, options = {}) {
  const allievo = allievoById(allievoId)
  if (!allievo) throw new Error('Allievo non trovato.')
  const normalizedSlots = normalizeAvailabilitySlots(slots)
  const profilo = {
    ...(allievo.profilo || {}),
    disponibilita_escluse_updated_at: new Date().toISOString(),
  }
  if (options.groupTarget) {
    profilo.disponibilita_gruppo_escluse_slots = normalizedSlots
    profilo.disponibilita_gruppo_escluse_updated_at = new Date().toISOString()
    if (!appointmentIndividualLessonsActiveForAllievo(allievo)) profilo.disponibilita_escluse_slots = normalizedSlots
  } else {
    profilo.disponibilita_escluse_slots = normalizedSlots
    if (allievo.gruppo && options.individualTarget) profilo.disponibilita_individuale_attiva = true
  }
  let payload = { profilo, aggiornato_il: new Date().toISOString() }
  let { data, error } = await sb.from('allievi').update(payload).eq('id', allievoId).select().single()
  if (error && /aggiornato_il|updated_at|schema cache|column/i.test(error.message || error.details || error.hint || '')) {
    payload = { profilo }
    ;({ data, error } = await sb.from('allievi').update(payload).eq('id', allievoId).select().single())
  }
  if (error) throw error
  allAllievi = allAllievi.map(a => String(a.id) === String(allievoId) ? (data || { ...a, ...payload }) : a)
  logModificaLocale('allievo', allievoId, 'Aggiornate fasce escluse disponibilita')
}

async function saveAllievoAppointmentPreferences(allievoId, preferences) {
  const allievo = allievoById(allievoId)
  if (!allievo) throw new Error('Allievo non trovato.')
  const consecutiveMode = normalizeAppointmentConsecutiveMode(preferences.consecutiveMode, preferences.avoidConsecutive)
  const profilo = {
    ...(allievo.profilo || {}),
    appuntamenti_settimanali: normalizeAppointmentWeeklyCount(preferences.weeklyCount),
    appuntamenti_giorni_consecutivi: consecutiveMode,
    appuntamenti_evita_giorni_consecutivi: true,
    appuntamenti_preferenze_updated_at: new Date().toISOString(),
  }
  if (allievo.gruppo && Object.prototype.hasOwnProperty.call(preferences, 'individualActive')) {
    profilo.appuntamenti_individuali_attivi = !!preferences.individualActive
  }
  let payload = { profilo, aggiornato_il: new Date().toISOString() }
  let { data, error } = await sb.from('allievi').update(payload).eq('id', allievoId).select().single()
  if (error && /aggiornato_il|updated_at|schema cache|column/i.test(error.message || error.details || error.hint || '')) {
    payload = { profilo }
    ;({ data, error } = await sb.from('allievi').update(payload).eq('id', allievoId).select().single())
  }
  if (error) throw error
  allAllievi = allAllievi.map(a => String(a.id) === String(allievoId) ? (data || { ...a, ...payload }) : a)
  logModificaLocale('allievo', allievoId, 'Aggiornate preferenze appuntamenti')
}

async function saveGroupAvailability(gruppo, slots, noteValue = undefined) {
  const members = appointmentGroupMembers(gruppo)
  if (!members.length) throw new Error('Gruppo non trovato.')
  for (const member of members) {
    await saveAllievoAvailability(member.id, slots, noteValue, { groupTarget: true })
  }
}

async function saveGroupAvailabilityExclusions(gruppo, slots) {
  const members = appointmentGroupMembers(gruppo)
  if (!members.length) throw new Error('Gruppo non trovato.')
  for (const member of members) {
    await saveAllievoAvailabilityExclusions(member.id, slots, { groupTarget: true })
  }
}

async function saveGroupAppointmentPreferences(gruppo, preferences) {
  const members = appointmentGroupMembers(gruppo)
  if (!members.length) throw new Error('Gruppo non trovato.')
  for (const member of members) {
    await saveAllievoAppointmentPreferences(member.id, preferences)
  }
}

async function saveSelectedAppointmentPreferences() {
  const target = selectedAppointmentTarget()
  if (!target) return
  const weeklyCount = normalizeAppointmentWeeklyCount(document.getElementById('appointments-weekly-count')?.value)
  const consecutiveMode = normalizeAppointmentConsecutiveMode(document.querySelector('input[name="appointments-consecutive-mode"]:checked')?.value)
  const individualCheckbox = document.getElementById('appointments-individual-active')
  const individualActive = individualCheckbox ? individualCheckbox.checked : undefined
  try {
    if (target.type === 'gruppo') {
      await saveGroupAppointmentPreferences(target.gruppo, { weeklyCount, consecutiveMode })
      document.getElementById('appointments-weekly-count').value = String(weeklyCount)
      setAvailabilityStatus('allievo', `Preferenze salvate su ${target.members.length} sched${target.members.length === 1 ? 'a' : 'e'} del gruppo.`, 'ok')
      clearAppointmentAgendaPreview()
      return
    }
    await saveAllievoAppointmentPreferences(target.allievo.id, { weeklyCount, consecutiveMode, individualActive })
    document.getElementById('appointments-weekly-count').value = String(weeklyCount)
    setAvailabilityStatus('allievo', 'Preferenze appuntamenti salvate.', 'ok')
    clearAppointmentAgendaPreview()
  } catch (e) {
    setAvailabilityStatus('allievo', e.message || 'Errore salvataggio preferenze.', 'err')
  }
}

async function saveSelectedAllievoAvailabilityNote() {
  const target = selectedAppointmentTarget()
  if (!target) return
  const note = document.getElementById('appointments-allievo-note')?.value || ''
  try {
    if (target.type === 'gruppo') {
      await saveGroupAvailability(target.gruppo, availabilitySlotsForAppointmentTarget(target), note)
      renderAppuntamenti()
      setAvailabilityStatus('allievo', `Note disponibilita salvate su ${target.members.length} sched${target.members.length === 1 ? 'a' : 'e'} del gruppo.`, 'ok')
      return
    }
    await saveAllievoAvailability(target.allievo.id, availabilitySlotsForAppointmentTarget(target), note, { individualTarget: true })
    renderAppuntamenti()
    setAvailabilityStatus('allievo', 'Note disponibilita salvate.', 'ok')
  } catch (e) {
    setAvailabilityStatus('allievo', e.message || 'Errore salvataggio note.', 'err')
  }
}

function slotsForDay(slots, day) {
  return normalizeAvailabilitySlots(slots)
    .filter(slot => Number(slot.day) === Number(day))
    .map(slot => ({ ...slot, startMin: timeToMinutes(slot.start), endMin: timeToMinutes(slot.end) }))
}

function subtractAvailabilityExclusions(slots, exclusions) {
  const excludedByDay = new Map()
  normalizeAvailabilitySlots(exclusions).forEach(slot => {
    const day = Number(slot.day)
    if (!excludedByDay.has(day)) excludedByDay.set(day, [])
    excludedByDay.get(day).push({
      startMin: timeToMinutes(slot.start),
      endMin: timeToMinutes(slot.end),
    })
  })
  excludedByDay.forEach(items => items.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin))
  const output = []
  normalizeAvailabilitySlots(slots).forEach(slot => {
    let segments = [{
      startMin: timeToMinutes(slot.start),
      endMin: timeToMinutes(slot.end),
    }]
    ;(excludedByDay.get(Number(slot.day)) || []).forEach(excluded => {
      const nextSegments = []
      segments.forEach(segment => {
        const overlapStart = Math.max(segment.startMin, excluded.startMin)
        const overlapEnd = Math.min(segment.endMin, excluded.endMin)
        if (overlapEnd <= overlapStart) {
          nextSegments.push(segment)
          return
        }
        if (segment.startMin < overlapStart) nextSegments.push({ startMin: segment.startMin, endMin: overlapStart })
        if (overlapEnd < segment.endMin) nextSegments.push({ startMin: overlapEnd, endMin: segment.endMin })
      })
      segments = nextSegments
    })
    segments
      .filter(segment => segment.endMin - segment.startMin >= AVAILABILITY_STEP_MIN)
      .forEach(segment => output.push({
        ...slot,
        id: `${slot.id}:${segment.startMin}-${segment.endMin}`,
        start: minutesToTime(segment.startMin),
        end: minutesToTime(segment.endMin),
      }))
  })
  return normalizeAvailabilitySlots(output)
}

function effectiveMaestroAvailabilitySlots() {
  return subtractAvailabilityExclusions(maestroAvailabilitySlots, maestroExcludedSlots)
}

function effectiveAvailabilitySlotsForAllievo(allievo) {
  return subtractAvailabilityExclusions(availabilitySlotsForAllievo(allievo), availabilityExcludedSlotsForAllievo(allievo))
}

function effectiveAvailabilitySlotsForGroup(gruppo) {
  return subtractAvailabilityExclusions(availabilitySlotsForGroup(gruppo), availabilityExcludedSlotsForGroup(gruppo))
}

function effectiveAvailabilitySlotsForAppointmentTarget(target = selectedAppointmentTarget()) {
  if (!target) return []
  if (target.type === 'gruppo') return effectiveAvailabilitySlotsForGroup(target.gruppo)
  return effectiveAvailabilitySlotsForAllievo(target.allievo)
}

function computeAvailabilityIntersectionsFromSources(appointmentSourcesInput, minDuration = APPOINTMENT_MIN_LESSON_MIN, bufferMin = APPOINTMENT_BUFFER_MIN) {
  const appointmentSources = (appointmentSourcesInput || []).filter(Boolean)
  if (!appointmentSources.length) return []
  const requiredDuration = minDuration + bufferMin
  const sources = [
    { id: 'maestro', label: 'Maestro', slots: effectiveMaestroAvailabilitySlots() },
    ...appointmentSources,
  ]
  if (sources.some(source => !normalizeAvailabilitySlots(source.slots).length)) return []
  const results = []
  AVAILABILITY_DAYS.forEach(day => {
    let windows = slotsForDay(sources[0].slots, day.value).map(slot => ({
      day: day.value,
      startMin: slot.startMin,
      endMin: slot.endMin,
      labels: [sources[0].label],
    }))
    for (const source of sources.slice(1)) {
      const nextSlots = slotsForDay(source.slots, day.value)
      const nextWindows = []
      windows.forEach(window => {
        nextSlots.forEach(slot => {
          const startMin = Math.max(window.startMin, slot.startMin)
          const endMin = Math.min(window.endMin, slot.endMin)
          if (endMin - startMin >= requiredDuration) {
            nextWindows.push({
              day: day.value,
              startMin,
              endMin,
              labels: [...window.labels, source.label],
            })
          }
        })
      })
      const deduped = new Map()
      nextWindows.forEach(window => deduped.set(`${window.day}-${window.startMin}-${window.endMin}`, window))
      windows = [...deduped.values()]
      if (!windows.length) break
    }
    results.push(...windows)
  })
  return results
    .map(window => ({
      ...window,
      start: minutesToTime(window.startMin),
      end: minutesToTime(window.endMin),
      duration: window.endMin - window.startMin,
      lessonDuration: Math.max(0, window.endMin - window.startMin - bufferMin),
      bufferMin,
    }))
    .sort((a, b) => availabilityDayOrder(a.day) - availabilityDayOrder(b.day) || a.startMin - b.startMin || a.endMin - b.endMin)
}

function computeAvailabilityIntersections(allievoIds, minDuration = APPOINTMENT_MIN_LESSON_MIN, bufferMin = APPOINTMENT_BUFFER_MIN) {
  const ids = (allievoIds || []).filter(Boolean)
  return computeAvailabilityIntersectionsFromSources(ids.map(id => {
    const allievo = allievoById(id)
    return { id, label: allievo ? lezioneTargetLabelAllievo(allievo) : id, slots: effectiveAvailabilitySlotsForAllievo(allievo) }
  }), minDuration, bufferMin)
}

function computeAvailabilityIntersectionsForTarget(target, minDuration = APPOINTMENT_MIN_LESSON_MIN, bufferMin = APPOINTMENT_BUFFER_MIN) {
  if (!target) return []
  if (target.type === 'gruppo') {
    return computeAvailabilityIntersectionsFromSources([{
      id: target.id,
      label: target.label,
      slots: effectiveAvailabilitySlotsForGroup(target.gruppo),
    }], minDuration, bufferMin)
  }
  return computeAvailabilityIntersections(target.memberIds, minDuration, bufferMin)
}

function availabilitySlotsForAppointmentScheduleTarget(target) {
  if (!target) return []
  return effectiveAvailabilitySlotsForAppointmentTarget(target)
}

function appointmentDayCombinations(days, count) {
  const results = []
  function visit(start, combo) {
    if (combo.length === count) {
      results.push(combo.slice())
      return
    }
    for (let index = start; index < days.length; index += 1) {
      combo.push(days[index])
      visit(index + 1, combo)
      combo.pop()
    }
  }
  visit(0, [])
  return results
}

function appointmentConsecutiveDayPairs(days) {
  const orders = days.map(day => availabilityDayOrder(day)).sort((a, b) => a - b)
  let pairs = 0
  for (let index = 1; index < orders.length; index += 1) {
    if (orders[index] - orders[index - 1] === 1) pairs += 1
  }
  if (orders.includes(0) && orders.includes(6)) pairs += 1
  return pairs
}

function appointmentDaySpreadScore(days) {
  const orders = days.map(day => availabilityDayOrder(day))
  let score = 0
  for (let i = 0; i < orders.length; i += 1) {
    for (let j = i + 1; j < orders.length; j += 1) {
      const distance = Math.abs(orders[i] - orders[j])
      score += Math.min(distance, 7 - distance)
    }
  }
  return score
}

function appointmentMaxNonConsecutiveDayCount(days = []) {
  const orderedDays = [...new Set(days)].sort((a, b) => availabilityDayOrder(a) - availabilityDayOrder(b))
  for (let size = orderedDays.length; size >= 1; size -= 1) {
    if (appointmentDayCombinations(orderedDays, size).some(combo => appointmentConsecutiveDayPairs(combo) === 0)) return size
  }
  return 0
}

function chooseAppointmentWeeklyPlan(windows, weeklyCount, consecutiveMode = APPOINTMENT_CONSECUTIVE_STRICT) {
  const needed = normalizeAppointmentWeeklyCount(weeklyCount)
  const byDay = new Map()
  normalizeAvailabilitySlots(windows).forEach(window => {
    if (!byDay.has(window.day)) byDay.set(window.day, [])
    byDay.get(window.day).push(window)
  })
  byDay.forEach(items => items.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start) || timeToMinutes(b.end) - timeToMinutes(a.end)))
  const days = [...byDay.keys()].sort((a, b) => availabilityDayOrder(a) - availabilityDayOrder(b))
  const planSize = Math.min(needed, days.length)
  if (!planSize) return []
  const strictMode = appointmentConsecutiveModeIsStrict(consecutiveMode)
  let combinations = appointmentDayCombinations(days, planSize)
  if (strictMode) {
    for (let size = planSize; size >= 1; size -= 1) {
      const strictCombinations = appointmentDayCombinations(days, size).filter(combo => appointmentConsecutiveDayPairs(combo) === 0)
      if (strictCombinations.length) {
        combinations = strictCombinations
        break
      }
    }
  }
  const ranked = combinations.map(combo => ({
    days: combo,
    consecutivePairs: appointmentConsecutiveDayPairs(combo),
    spreadScore: appointmentDaySpreadScore(combo),
    startSum: combo.reduce((sum, day) => sum + timeToMinutes(byDay.get(day)[0].start), 0),
  })).sort((a, b) => {
    if (!strictMode && a.consecutivePairs !== b.consecutivePairs) return a.consecutivePairs - b.consecutivePairs
    if (a.spreadScore !== b.spreadScore) return b.spreadScore - a.spreadScore
    return a.startSum - b.startSum
  })
  const best = ranked[0]?.days || []
  return best
    .map(day => byDay.get(day)[0])
    .sort((a, b) => availabilityDayOrder(a.day) - availabilityDayOrder(b.day) || timeToMinutes(a.start) - timeToMinutes(b.start))
}

function appointmentLocationForTarget(target) {
  if (!target) return ''
  if (target.type === 'gruppo') return profiloComuneGruppo(target.members).luogo_incontro || target.gruppo || ''
  const allievo = target.allievo
  const logistica = logisticaIndividualeProfilo(allievo?.profilo || {}, !!allievo?.gruppo)
  return logistica.luogo_incontro || allievo?.profilo?.luogo_incontro || visibleAllievoAddress(allievo).indirizzo || ''
}

function appointmentLocationRouteParts(location) {
  const text = String(location || '').trim()
  if (!text) return []
  return text
    .split(/\s*(?:->|→|–|—|\s-\s)\s*/g)
    .map(part => part.trim())
    .filter(Boolean)
}

function lessonLocationPartIsHome(part = '') {
  const key = normalizeMapMatchText(part)
  return !key || /^casa(?:\b|$)|^home(?:\b|$)|abitazione/.test(key)
}

function lessonLocationEntries(luogo, allieviIds = []) {
  const rawParts = appointmentLocationRouteParts(luogo)
  const parts = rawParts.length ? rawParts : [String(luogo || '').trim()].filter(Boolean)
  const linked = allieviIds.length === 1 ? allievoById(allieviIds[0]) : null
  return parts
    .map(part => {
      const clean = String(part || '').trim()
      if (!clean) return null
      const homeLike = lessonLocationPartIsHome(clean)
      const nome = homeLike && linked ? `Casa di ${mappaAllievoHomeName(linked)}` : clean
      return { raw: clean, nome, homeLike, allievo: homeLike ? linked : null }
    })
    .filter(Boolean)
}

function missingLessonLocationEntries(luogo, allieviIds = []) {
  return lessonLocationEntries(luogo, allieviIds).filter(entry => !locationRecordByName(entry.nome))
}

function appointmentHomeLocationRecord(allievo, fallbackName = 'casa') {
  const address = allievo ? visibleAllievoAddress(allievo) : {}
  const homeName = allievo ? `Casa di ${mappaAllievoHomeName(allievo)}` : fallbackName
  return locationRecordByName(homeName) || {
    nome: homeName,
    indirizzo: address.indirizzo || address.casa || '',
    latitudine: address.casa_latitudine,
    longitudine: address.casa_longitudine,
    tipologia: 'Casa allievo',
  }
}

function appointmentLocationPointInfo(part, allievo = null) {
  const label = String(part || '').trim()
  const key = normalizeMapMatchText(label)
  const homeLike = !label || /^casa(?:\b|$)|^home(?:\b|$)|abitazione/.test(key)
  const record = homeLike
    ? appointmentHomeLocationRecord(allievo, label || 'casa')
    : (locationRecordByName(label) || { nome: label, indirizzo: label, tipologia: 'Location' })
  const coords = locationMapCoords(record)
  const canonical = coords?.label || record.nome || record.indirizzo || label
  return {
    label: homeLike ? (record.nome || label || 'casa') : label,
    key: normalizeMapMatchText(canonical),
    point: coords ? mappaProjectCoord(coords) : null,
  }
}

function appointmentLocationInfoForTarget(target) {
  const location = appointmentLocationForTarget(target)
  const allievo = target?.allievo || target?.members?.[0] || null
  const parts = appointmentLocationRouteParts(location)
  const startInfo = appointmentLocationPointInfo(parts[0] || location, allievo)
  const endInfo = appointmentLocationPointInfo(parts.length > 1 ? parts[parts.length - 1] : (parts[0] || location), allievo)
  const key = startInfo.key === endInfo.key ? startInfo.key : `${startInfo.key}->${endInfo.key}`
  return {
    label: location,
    key,
    point: startInfo.point,
    startLabel: startInfo.label,
    startKey: startInfo.key,
    startPoint: startInfo.point,
    endLabel: endInfo.label,
    endKey: endInfo.key,
    endPoint: endInfo.point,
    isRoute: parts.length > 1 && startInfo.key !== endInfo.key,
  }
}

function hydrateAppointmentTarget(target, fallbackDuration) {
  target.memberIds = (target.memberIds || target.members?.map(member => member.id) || [])
    .map(id => String(id))
    .filter(Boolean)
  target.weeklyCount = appointmentWeeklyCountForTarget(target)
  target.avoidConsecutive = appointmentAvoidConsecutiveForTarget(target)
  target.consecutiveMode = appointmentConsecutiveModeForTarget(target)
  target.lessonDuration = appointmentLessonDurationForTarget(target, fallbackDuration)
  target.locationInfo = appointmentLocationInfoForTarget(target)
  target.location = target.locationInfo.label
  target.locationKey = target.locationInfo.key
  target.locationPoint = target.locationInfo.point
  target.routeStartLabel = target.locationInfo.startLabel
  target.routeStartKey = target.locationInfo.startKey
  target.routeStartPoint = target.locationInfo.startPoint
  target.routeEndLabel = target.locationInfo.endLabel
  target.routeEndKey = target.locationInfo.endKey
  target.routeEndPoint = target.locationInfo.endPoint
  target.routeIsItinerary = target.locationInfo.isRoute
  target.priorityMode = appointmentTargetPriorityMode(target)
  target.tierRank = Math.min(...(target.members || []).map(member => allievoTierRank(member)), 3)
  return target
}

function appointmentTargetForAllievo(allievo, fallbackDuration) {
  return hydrateAppointmentTarget({
    type: 'allievo',
    id: `allievo:${allievo.id}`,
    label: allievo.gruppo ? `${lezioneTargetLabelAllievo(allievo)} · individuale` : lezioneTargetLabelAllievo(allievo),
    allievo,
    members: [allievo],
    memberIds: [allievo.id],
  }, fallbackDuration)
}

function appointmentSchedulableTargets(filteredAllievi = []) {
  const fallbackDuration = appointmentCurrentFallbackDuration()
  const targets = []
  const grouped = new Set()
  const selectedIds = new Set(filteredAllievi.map(allievo => String(allievo.id)))
  filteredAllievi.forEach(allievo => {
    if (allievo.gruppo) {
      if (!grouped.has(allievo.gruppo)) {
        grouped.add(allievo.gruppo)
        const members = appointmentGroupMembers(allievo.gruppo)
          .filter(member => selectedIds.has(String(member.id)))
        if (members.length) {
          targets.push(hydrateAppointmentTarget({
            type: 'gruppo',
            id: appointmentGroupTargetValue(allievo.gruppo),
            label: allievo.gruppo,
            gruppo: allievo.gruppo,
            members,
            memberIds: members.map(member => member.id),
          }, fallbackDuration))
        }
      }
    }
    if (!allievo.gruppo || appointmentIndividualLessonsActiveForAllievo(allievo)) {
      targets.push(appointmentTargetForAllievo(allievo, fallbackDuration))
    }
  })
  return targets.sort((a, b) => String(a.label).localeCompare(String(b.label), 'it', { sensitivity: 'base' }))
}

function appointmentWindowHeatOverlap(startMin, endMin) {
  return Math.max(0, Math.min(endMin, APPOINTMENT_HEAT_END_MIN) - Math.max(startMin, APPOINTMENT_HEAT_START_MIN))
}

function appointmentTargetFromResult(result) {
  return {
    id: result.targetId,
    label: result.targetName,
    type: result.targetType,
    memberIds: (result.memberIds || []).map(id => String(id)).filter(Boolean),
    weeklyCount: result.weeklyCount,
    avoidConsecutive: result.avoidConsecutive,
    consecutiveMode: result.consecutiveMode,
    lessonDuration: result.lessonDuration,
    location: result.location,
    locationKey: result.locationKey,
    locationPoint: result.locationPoint,
    routeStartLabel: result.routeStartLabel,
    routeStartKey: result.routeStartKey,
    routeStartPoint: result.routeStartPoint,
    routeEndLabel: result.routeEndLabel,
    routeEndKey: result.routeEndKey,
    routeEndPoint: result.routeEndPoint,
    routeIsItinerary: result.routeIsItinerary,
    priorityMode: result.priorityMode,
    tierRank: result.tierRank,
  }
}

function buildAppointmentScheduleCandidates(results, bufferMin) {
  const candidates = []
  results.forEach(result => {
    const target = appointmentTargetFromResult(result)
    const lessonDuration = target.lessonDuration || APPOINTMENT_MIN_LESSON_MIN
    const requiredDuration = lessonDuration + bufferMin
    result.windows.forEach(window => {
      const latestStart = window.endMin - requiredDuration
      for (let startMin = window.startMin; startMin <= latestStart; startMin += AVAILABILITY_STEP_MIN) {
        const lessonEndMin = startMin + lessonDuration
        const blockEndMin = startMin + requiredDuration
        candidates.push({
          targetId: target.id,
          targetName: target.label,
          targetType: target.type,
          memberIds: target.memberIds || [],
          weeklyCount: target.weeklyCount,
          avoidConsecutive: target.avoidConsecutive,
          consecutiveMode: target.consecutiveMode,
          lessonDuration,
          location: target.location,
          locationKey: target.locationKey,
          locationPoint: target.locationPoint,
          routeStartLabel: target.routeStartLabel,
          routeStartKey: target.routeStartKey,
          routeStartPoint: target.routeStartPoint,
          routeEndLabel: target.routeEndLabel,
          routeEndKey: target.routeEndKey,
          routeEndPoint: target.routeEndPoint,
          routeIsItinerary: target.routeIsItinerary,
          priorityMode: target.priorityMode,
          tierRank: target.tierRank,
          day: window.day,
          startMin,
          lessonEndMin,
          blockEndMin,
          start: minutesToTime(startMin),
          lessonEnd: minutesToTime(lessonEndMin),
          blockEnd: minutesToTime(blockEndMin),
          heatOverlap: appointmentWindowHeatOverlap(startMin, lessonEndMin),
        })
      }
    })
  })
  const countByTarget = new Map()
  candidates.forEach(candidate => countByTarget.set(candidate.targetId, (countByTarget.get(candidate.targetId) || 0) + 1))
  candidates.forEach(candidate => { candidate.targetCandidateCount = countByTarget.get(candidate.targetId) || 0 })
  return candidates
}

function appointmentCandidateConflicts(candidate, scheduled) {
  return scheduled.some(item =>
    Number(item.day) === Number(candidate.day) &&
    candidate.startMin < item.blockEndMin &&
    candidate.blockEndMin > item.startMin
  )
}

function appointmentSameTargetSameDay(candidate, scheduled) {
  return scheduled.some(item => item.targetId === candidate.targetId && Number(item.day) === Number(candidate.day))
}

function appointmentMemberIdsForScheduleItem(item = {}) {
  if (Array.isArray(item.memberIds) && item.memberIds.length) return item.memberIds.map(id => String(id)).filter(Boolean)
  if (item.targetType === 'gruppo' || appointmentTargetIsGroup(item.targetId)) {
    return appointmentGroupMembers(appointmentGroupFromTarget(item.targetId)).map(member => String(member.id))
  }
  const rawId = String(item.targetId || '').replace(/^allievo:/, '')
  return rawId ? [rawId] : []
}

function appointmentSameMemberSameDay(candidate, scheduled) {
  const candidateIds = appointmentMemberIdsForScheduleItem(candidate)
  if (!candidateIds.length) return false
  const candidateSet = new Set(candidateIds)
  return scheduled.some(item =>
    Number(item.day) === Number(candidate.day) &&
    appointmentMemberIdsForScheduleItem(item).some(id => candidateSet.has(String(id)))
  )
}

function appointmentHasConsecutiveDay(candidate, scheduled) {
  const days = scheduled.filter(item => item.targetId === candidate.targetId).map(item => item.day)
  return days.some(day => appointmentConsecutiveDayPairs([day, candidate.day]) > 0)
}

function appointmentViolatesStrictConsecutive(candidate, scheduled) {
  return appointmentConsecutiveModeIsStrict(candidate.consecutiveMode) && appointmentHasConsecutiveDay(candidate, scheduled)
}

function appointmentTransitionEndpoints(a, b) {
  if (a.startMin >= b.blockEndMin) {
    return {
      fromKey: b.routeEndKey,
      fromPoint: b.routeEndPoint,
      toKey: a.routeStartKey,
      toPoint: a.routeStartPoint,
    }
  }
  if (b.startMin >= a.blockEndMin) {
    return {
      fromKey: a.routeEndKey,
      fromPoint: a.routeEndPoint,
      toKey: b.routeStartKey,
      toPoint: b.routeStartPoint,
    }
  }
  return {
    fromKey: b.routeEndKey || a.routeEndKey,
    fromPoint: b.routeEndPoint || a.routeEndPoint,
    toKey: a.routeStartKey || b.routeStartKey,
    toPoint: a.routeStartPoint || b.routeStartPoint,
  }
}

function appointmentSameLocation(candidate, item) {
  const transition = appointmentTransitionEndpoints(candidate, item)
  return transition.fromKey && transition.toKey && transition.fromKey === transition.toKey
}

function appointmentLocationDistance(candidate, item) {
  const transition = appointmentTransitionEndpoints(candidate, item)
  if (!transition.fromPoint || !transition.toPoint) return null
  const dx = transition.toPoint.x - transition.fromPoint.x
  const dy = transition.toPoint.y - transition.fromPoint.y
  return Math.sqrt(dx * dx + dy * dy)
}

function appointmentNearbyLocation(candidate, item) {
  if (appointmentSameLocation(candidate, item)) return true
  const distance = appointmentLocationDistance(candidate, item)
  return distance !== null && distance <= 75
}

function scoreAppointmentCandidate(candidate, scheduled, variant) {
  const sameDay = scheduled.filter(item => Number(item.day) === Number(candidate.day))
  const dayLoad = sameDay.length
  const scarcity = candidate.targetCandidateCount || 999
  let score = scarcity * 2 + availabilityDayOrder(candidate.day) * 6 + candidate.startMin / 60
  score += (candidate.tierRank || 0) * 8
  if (candidate.priorityMode === 'priority') score -= 120
  if (candidate.priorityMode === 'flex') score += 120
  if (appointmentHasConsecutiveDay(candidate, scheduled)) score += appointmentConsecutiveModeIsStrict(candidate.consecutiveMode) ? 10000 : 90
  if (variant.id === 'balanced') score += dayLoad * 16
  if (variant.id === 'max') score += dayLoad * 4
  if (variant.id === 'compact') {
    if (!sameDay.length) score += 28
    sameDay.forEach(item => {
      const gap = Math.min(Math.abs(candidate.startMin - item.blockEndMin), Math.abs(item.startMin - candidate.blockEndMin))
      const distance = appointmentLocationDistance(candidate, item)
      if (appointmentSameLocation(candidate, item)) score -= 140
      else if (appointmentNearbyLocation(candidate, item)) score -= 85
      if (gap <= 90) score -= 50 - (gap / 3)
      if (candidate.locationKey && item.locationKey && !appointmentNearbyLocation(candidate, item) && gap < 45) score += 95
      if (distance !== null && !appointmentSameLocation(candidate, item)) score += Math.min(70, distance / 3)
    })
  }
  if (variant.id === 'anti_heat') {
    score += candidate.heatOverlap ? 260 + candidate.heatOverlap : 0
    score += dayLoad * 7
  }
  if (variant.randomness) score += Math.random() * variant.randomness
  return score
}

function appointmentScheduledItemKey(item = {}) {
  return String(item.previewId || `${item.targetId}:${item.day}:${item.startMin}:${item.lessonEndMin}`)
}

function normalizeAppointmentLockedSlots(lockedSlots = []) {
  return (lockedSlots || []).map(item => ({
    ...item,
    locked: true,
    previewId: item.previewId || appointmentScheduledItemKey(item),
  }))
}

function buildAppointmentScheduleVariant(results, variant, bufferMin, options = {}) {
  const totalDemand = results.reduce((sum, result) => sum + result.weeklyCount, 0)
  const candidates = buildAppointmentScheduleCandidates(results, bufferMin)
  const remaining = new Map(results.map(result => [result.targetId, result.weeklyCount]))
  const scheduled = []
  normalizeAppointmentLockedSlots(options.lockedSlots).forEach(item => {
    if (!remaining.has(item.targetId)) return
    if ((remaining.get(item.targetId) || 0) <= 0) return
    if (appointmentSameTargetSameDay(item, scheduled) || appointmentSameMemberSameDay(item, scheduled)) return
    if (appointmentCandidateConflicts(item, scheduled)) return
    scheduled.push(item)
    remaining.set(item.targetId, Math.max(0, (remaining.get(item.targetId) || 0) - 1))
  })
  let guard = 0
  while (guard < totalDemand && scheduled.length < totalDemand) {
    guard += 1
    const viable = candidates
      .filter(candidate => (remaining.get(candidate.targetId) || 0) > 0)
      .filter(candidate => !appointmentSameTargetSameDay(candidate, scheduled))
      .filter(candidate => !appointmentSameMemberSameDay(candidate, scheduled))
      .filter(candidate => !appointmentViolatesStrictConsecutive(candidate, scheduled))
      .filter(candidate => !appointmentCandidateConflicts(candidate, scheduled))
    if (!viable.length) break
    viable.sort((a, b) => scoreAppointmentCandidate(a, scheduled, variant) - scoreAppointmentCandidate(b, scheduled, variant))
    const chosen = { ...viable[0], previewId: `${variant.id}:${appointmentGenerationNonce}:${scheduled.length}:${viable[0].targetId}:${viable[0].day}:${viable[0].startMin}` }
    scheduled.push(chosen)
    remaining.set(chosen.targetId, (remaining.get(chosen.targetId) || 0) - 1)
  }
  scheduled.sort((a, b) => availabilityDayOrder(a.day) - availabilityDayOrder(b.day) || a.startMin - b.startMin || String(a.targetName).localeCompare(String(b.targetName), 'it', { sensitivity: 'base' }))
  const unplaced = results
    .map(result => {
      const missing = remaining.get(result.targetId) || 0
      if (!missing) return null
      const availableDays = [...new Set(result.windows.map(window => window.day))].length
      const maxNonConsecutiveDays = appointmentMaxNonConsecutiveDayCount(result.windows.map(window => window.day))
      const scheduledForTarget = scheduled.filter(item => item.targetId === result.targetId).length
      let reason = 'finestre compatibili occupate da altri appuntamenti'
      if (!result.windows.length) reason = 'nessuna sovrapposizione utile con la disponibilita maestro'
      else if (appointmentConsecutiveModeIsStrict(result.consecutiveMode) && maxNonConsecutiveDays < result.weeklyCount) reason = `vincolo assoluto: al massimo ${maxNonConsecutiveDays} giorn${maxNonConsecutiveDays === 1 ? 'o non consecutivo' : 'i non consecutivi'}`
      else if (availableDays < result.weeklyCount) reason = `solo ${availableDays} giorn${availableDays === 1 ? 'o' : 'i'} disponibile${availableDays === 1 ? '' : 'i'} per ${result.weeklyCount} richiesti`
      else if (scheduledForTarget > 0) reason = 'non resta spazio senza sovrapporre lezioni gia piazzate'
      return {
        targetName: result.targetName,
        missing,
        reason,
      }
    })
    .filter(Boolean)
  return {
    ...variant,
    scheduled,
    totalDemand,
    placed: scheduled.length,
    missing: Math.max(0, totalDemand - scheduled.length),
    remaining,
    unplaced,
  }
}

function appointmentScheduleVariantDefinitions() {
  return [
    { id: 'max', title: 'Massima copertura', note: 'Piazza il maggior numero di lezioni, dando priorita a chi ha meno finestre disponibili.' },
    { id: 'compact', title: 'Compatta spostamenti', note: 'Tiene vicine nello stesso giorno le lezioni con stesso luogo, alias simili o coordinate vicine.' },
    { id: 'anti_heat', title: 'Anti-caldo', note: 'Evita il piu possibile le lezioni tra 13:00 e 15:30.' },
    { id: 'balanced', title: 'Distribuita', note: 'Distribuisce il carico sui giorni, utile quando non vuoi giornate troppo dense.' },
  ]
}

function buildAppointmentScheduleVariants(results, bufferMin) {
  const variants = appointmentScheduleVariantDefinitions()
  return variants.map(variant => buildAppointmentScheduleVariant(results, variant, bufferMin))
}

function readAppointmentTravelRules() {
  try {
    const rows = JSON.parse(safeStorage.getItem(APPOINTMENT_TRAVEL_STORAGE_KEY) || '[]')
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

function writeAppointmentTravelRules(rows = []) {
  safeStorage.setItem(APPOINTMENT_TRAVEL_STORAGE_KEY, JSON.stringify(rows))
}

function appointmentTravelRuleKey(fromKey, toKey) {
  const keys = [normalizeMapMatchText(fromKey), normalizeMapMatchText(toKey)].filter(Boolean).sort()
  return keys.length === 2 ? `${keys[0]}::${keys[1]}` : ''
}

function appointmentTravelRuleFor(fromKey, toKey) {
  const key = appointmentTravelRuleKey(fromKey, toKey)
  if (!key) return null
  return readAppointmentTravelRules().find(rule => rule.key === key) || null
}

function appointmentTravelMinutesBetween(a, b) {
  if (!a || !b) return 0
  const fromKey = a.routeEndKey || a.locationKey
  const toKey = b.routeStartKey || b.locationKey
  if (fromKey && toKey && normalizeMapMatchText(fromKey) === normalizeMapMatchText(toKey)) return 0
  const rule = appointmentTravelRuleFor(fromKey, toKey)
  if (rule) return Math.max(0, parseInt(rule.minutes, 10) || 0)
  return APPOINTMENT_BUFFER_MIN
}

function appointmentPreviewRangeStyle(startMin, endMin) {
  const dayStart = AVAILABILITY_START_MIN
  const dayEnd = AVAILABILITY_END_MIN
  const top = ((Math.max(dayStart, startMin) - dayStart) / (dayEnd - dayStart)) * 100
  const height = (Math.max(AVAILABILITY_STEP_MIN, Math.min(dayEnd, endMin) - Math.max(dayStart, startMin)) / (dayEnd - dayStart)) * 100
  return `top:${top.toFixed(3)}%;height:${Math.max(1.6, height).toFixed(3)}%`
}

function appointmentPreviewPointStyle(min) {
  const dayStart = AVAILABILITY_START_MIN
  const dayEnd = AVAILABILITY_END_MIN
  const top = ((Math.max(dayStart, Math.min(dayEnd, min)) - dayStart) / (dayEnd - dayStart)) * 100
  return `top:${top.toFixed(3)}%`
}

function appointmentPreviewHourLabelsHtml() {
  const labels = []
  for (let min = AVAILABILITY_START_MIN; min <= AVAILABILITY_END_MIN; min += 60) {
    labels.push(`<span class="appointment-preview-hour-label" style="${appointmentPreviewPointStyle(min)}">${minutesToTime(min)}</span>`)
  }
  return `
    <div class="appointment-preview-day appointment-preview-time-rail" aria-hidden="true">
      <div class="appointment-preview-time-title"></div>
      <div class="appointment-preview-lane appointment-preview-time-lane">
        ${labels.join('')}
      </div>
    </div>`
}

function appointmentPreviewExcludedBlocks(items = []) {
  const blocks = []
  normalizeAvailabilitySlots(maestroExcludedSlots).forEach(slot => blocks.push({ ...slot, label: 'Maestro', kind: 'maestro' }))
  ;(items || []).forEach(item => {
    const exclusions = item.targetType === 'gruppo'
      ? availabilityExcludedSlotsForGroup(appointmentGroupFromTarget(item.targetId))
      : availabilityExcludedSlotsForAllievo(allievoById(String(item.targetId).replace(/^allievo:/, '')))
    normalizeAvailabilitySlots(exclusions).forEach(slot => blocks.push({ ...slot, label: item.targetName, kind: 'allievo' }))
  })
  const deduped = new Map()
  blocks.forEach(slot => deduped.set(`${slot.kind}:${slot.label}:${slot.day}:${slot.start}:${slot.end}`, slot))
  return [...deduped.values()]
}

function appointmentScheduleByDayHtml(items) {
  if (!items.length) return '<div class="availability-empty">Nessuna lezione piazzabile con le disponibilita correnti.</div>'
  const excluded = appointmentPreviewExcludedBlocks(items)
  return `
    <div class="appointment-preview-calendar">
      ${appointmentPreviewHourLabelsHtml()}
      ${AVAILABILITY_DAYS.map(day => {
        const dayItems = items
          .filter(item => Number(item.day) === Number(day.value))
          .sort((a, b) => a.startMin - b.startMin || String(a.targetName).localeCompare(String(b.targetName), 'it', { sensitivity: 'base' }))
        const dayExcluded = excluded.filter(slot => Number(slot.day) === Number(day.value))
        const travelBlocks = dayItems.slice(0, -1).map((item, index) => {
          const next = dayItems[index + 1]
          const minutes = appointmentTravelMinutesBetween(item, next)
          if (!minutes) return null
          const startMin = Math.min(item.lessonEndMin, next.startMin)
          const endMin = Math.min(next.startMin, startMin + minutes)
          if (endMin <= startMin) return null
          return { startMin, endMin, from: item.targetName, to: next.targetName, minutes }
        }).filter(Boolean)
        return `
          <div class="appointment-preview-day" data-day="${day.value}" ondragover="event.preventDefault()" ondrop="dropAppointmentPreviewItem(event,${day.value})">
            <div class="appointment-preview-day-title">${esc(day.short)}</div>
            <div class="appointment-preview-lane">
              ${dayExcluded.map(slot => {
                const startMin = timeToMinutes(slot.start)
                const endMin = timeToMinutes(slot.end)
                return `<div class="appointment-preview-excluded" style="${appointmentPreviewRangeStyle(startMin, endMin)}" title="${esc(slot.label)} · ${esc(slot.start)}-${esc(slot.end)}"></div>`
              }).join('')}
              ${travelBlocks.map(block => `
                <div class="appointment-preview-travel" style="${appointmentPreviewRangeStyle(block.startMin, block.endMin)}" title="Spostamento ${esc(block.from)} → ${esc(block.to)} · ${block.minutes} min">
                  ${block.minutes}m
                </div>`).join('')}
              ${dayItems.map(item => {
                const optionsText = item.targetCandidateCount > 1 ? `${item.targetCandidateCount} opzioni` : '1 opzione'
                const modeText = item.priorityMode === 'priority' ? 'priorita' : item.priorityMode === 'flex' ? 'flessibile' : ''
                const detailsText = [optionsText, modeText, item.location].filter(Boolean).join(' · ')
                return `
                  <div class="appointment-preview-item${item.locked ? ' is-locked' : ''}" draggable="true" data-preview-id="${esc(appointmentScheduledItemKey(item))}" style="${appointmentPreviewRangeStyle(item.startMin, item.lessonEndMin)}" title="${esc(detailsText)}" ondragstart="startAppointmentPreviewDrag(event,${jsArg(appointmentScheduledItemKey(item))})">
                    <strong>${esc(item.targetName)}</strong>
                    <span>${esc(item.start)}-${esc(item.lessonEnd)}</span>
                    <button type="button" onclick="event.stopPropagation(); toggleAppointmentPreviewLock(${jsArg(appointmentScheduledItemKey(item))})" title="${item.locked ? 'Sblocca proposta' : 'Blocca proposta'}">${item.locked ? 'Fissa' : 'Blocca'}</button>
                  </div>`
              }).join('')}
            </div>
          </div>`
      }).join('')}
    </div>`
}

function appointmentScheduleByDayListHtml(items) {
  return AVAILABILITY_DAYS.map(day => {
    const dayItems = items.filter(item => Number(item.day) === Number(day.value))
    if (!dayItems.length) return ''
    return `
      <div class="appointment-agenda-day">
        <div class="appointment-agenda-day-title">${esc(day.label)}</div>
        ${appointmentDayRouteMapHtml(dayItems)}
        <div class="appointment-agenda-items">
          ${dayItems.map(item => `
            <div class="appointment-agenda-item">
              <strong>${esc(item.start)}-${esc(item.lessonEnd)}</strong>
              <span>${esc(item.targetName)} · ${item.lessonDuration} min · ${esc(appointmentConsecutiveModeIsStrict(item.consecutiveMode) ? 'no consecutivi assoluto' : 'no consecutivi preferibile')}${item.routeIsItinerary ? ` · ${esc(item.routeStartLabel || '')} → ${esc(item.routeEndLabel || '')}` : (item.location ? ` · ${esc(item.location)}` : '')}</span>
              ${item.heatOverlap ? '<small>fascia calda</small>' : ''}
            </div>`).join('')}
        </div>
      </div>`
  }).join('')
}

function appointmentPreviewItemById(previewId) {
  if (!appointmentCurrentVariant) return null
  const key = String(previewId)
  return appointmentCurrentVariant.scheduled.find(item => appointmentScheduledItemKey(item) === key) || null
}

function normalizePreviewScheduledItem(item) {
  const lessonDuration = item.lessonDuration || Math.max(AVAILABILITY_STEP_MIN, item.lessonEndMin - item.startMin)
  return {
    ...item,
    start: minutesToTime(item.startMin),
    lessonEndMin: item.startMin + lessonDuration,
    lessonEnd: minutesToTime(item.startMin + lessonDuration),
    blockEndMin: item.startMin + lessonDuration + APPOINTMENT_BUFFER_MIN,
    blockEnd: minutesToTime(item.startMin + lessonDuration + APPOINTMENT_BUFFER_MIN),
  }
}

function rerenderCurrentAppointmentPreview() {
  if (!appointmentCurrentVariant) return renderAppointmentAgendaPreview()
  appointmentCurrentVariant.scheduled.sort((a, b) => availabilityDayOrder(a.day) - availabilityDayOrder(b.day) || a.startMin - b.startMin || String(a.targetName).localeCompare(String(b.targetName), 'it', { sensitivity: 'base' }))
  renderAppointmentAgendaPreview()
}

function toggleAppointmentPreviewLock(previewId) {
  const item = appointmentPreviewItemById(previewId)
  if (!item) return
  item.locked = !item.locked
  rerenderCurrentAppointmentPreview()
}

function startAppointmentPreviewDrag(event, previewId) {
  appointmentPreviewDragId = String(previewId)
  event.dataTransfer?.setData('text/plain', appointmentPreviewDragId)
  event.dataTransfer?.setDragImage?.(event.currentTarget, 12, 12)
}

function dropAppointmentPreviewItem(event, day) {
  event.preventDefault()
  const previewId = event.dataTransfer?.getData('text/plain') || appointmentPreviewDragId
  const item = appointmentPreviewItemById(previewId)
  const lane = event.currentTarget.querySelector('.appointment-preview-lane')
  if (!item || !lane) return
  const rect = lane.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)))
  const duration = item.lessonDuration || Math.max(AVAILABILITY_STEP_MIN, item.lessonEndMin - item.startMin)
  const rawStart = AVAILABILITY_START_MIN + ratio * (AVAILABILITY_END_MIN - AVAILABILITY_START_MIN)
  const startMin = availabilityClampStart(availabilitySnap(rawStart), duration + APPOINTMENT_BUFFER_MIN)
  item.day = Number(day)
  item.startMin = startMin
  item.locked = true
  Object.assign(item, normalizePreviewScheduledItem(item))
  rerenderCurrentAppointmentPreview()
}

function appointmentPointDistance(a, b) {
  if (!a || !b) return null
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

function appointmentRouteItems(items) {
  const points = []
  items.forEach((item, index) => {
    const startPoint = item.routeStartPoint || item.locationPoint
    const endPoint = item.routeEndPoint || item.locationPoint
    if (startPoint) {
      points.push({
        point: startPoint,
        label: item.routeIsItinerary ? (item.routeStartLabel || item.location || item.targetName) : (item.location || item.targetName),
        targetName: item.targetName,
        marker: String(index + 1),
        title: `${index + 1}. ${item.targetName}${item.location ? ' · ' + item.location : ''}`,
      })
    }
    const samePoint = startPoint && endPoint && Math.abs(startPoint.x - endPoint.x) < 1 && Math.abs(startPoint.y - endPoint.y) < 1
    if (item.routeIsItinerary && endPoint && !samePoint) {
      points.push({
        point: endPoint,
        label: item.routeEndLabel || item.location || item.targetName,
        targetName: item.targetName,
        marker: `${index + 1}b`,
        title: `${index + 1}. fine · ${item.targetName}${item.routeEndLabel ? ' · ' + item.routeEndLabel : ''}`,
      })
    }
  })
  return points
}

function appointmentRouteStats(routeItems) {
  if (routeItems.length < 2) return null
  let total = 0
  for (let index = 1; index < routeItems.length; index += 1) {
    total += appointmentPointDistance(routeItems[index - 1].point, routeItems[index].point) || 0
  }
  const direct = appointmentPointDistance(routeItems[0].point, routeItems[routeItems.length - 1].point) || 0
  const ratio = direct > 1 ? total / direct : total > 1 ? 99 : 1
  const label = ratio > 1.7 && total > 90 ? 'poco lineare' : ratio > 1.25 && total > 70 ? 'migliorabile' : 'lineare'
  return { total, direct, ratio, label }
}

function appointmentDayRouteMapHtml(items) {
  const routeItems = appointmentRouteItems(items)
  if (routeItems.length < 2) return ''
  const stats = appointmentRouteStats(routeItems)
  const points = routeItems.map(item => `${item.point.x.toFixed(1)},${item.point.y.toFixed(1)}`).join(' ')
  const mappedLessons = items.filter(item => item.routeStartPoint || item.locationPoint).length
  return `
    <div class="appointment-route-map">
      <div class="appointment-route-meta">
        <strong>Tracciato giornata</strong>
        <span>${esc(stats?.label || 'tracciato')} · ${mappedLessons}/${items.length} lezioni in mappa</span>
      </div>
      <div class="appointment-route-stage">
        <img class="map-base-image" src="${MILANO_MAP_IMAGE}" alt="Mappa di Milano divisa per quartieri">
        <svg class="appointment-route-svg" viewBox="0 0 ${MILANO_MAP_VIEWBOX.width} ${MILANO_MAP_VIEWBOX.height}" role="img" aria-label="Tracciato giornata">
          <polyline class="appointment-route-line" points="${points}"></polyline>
          ${routeItems.map(item => `
            <g class="appointment-route-point" transform="translate(${item.point.x.toFixed(1)} ${item.point.y.toFixed(1)})">
              <title>${esc(item.title)}</title>
              <circle r="17"></circle>
              <text y="4" text-anchor="middle">${esc(item.marker)}</text>
            </g>`).join('')}
        </svg>
      </div>
    </div>`
}

function appointmentScheduleVariantHtml(variant) {
  const heatCount = variant.scheduled.filter(item => item.heatOverlap).length
  const score = `${variant.placed}/${variant.totalDemand} lezioni`
  const importedClass = importedAppointmentVariantIds.has(String(variant.id)) ? ' is-in-calendar' : ''
  return `
    <div class="appointment-schedule-variant${importedClass}" data-appointment-variant-id="${esc(variant.id)}">
      <div class="appointment-schedule-head">
        <div>
          <h4>${esc(variant.title)}</h4>
          <span>${esc(variant.note)}</span>
        </div>
        <div class="appointment-schedule-actions">
          <strong>${esc(score)}</strong>
          <button type="button" class="btn btn-outline btn-sm" onclick="addAppointmentVariantToCalendar(${jsArg(variant.id)})" ${variant.scheduled.length ? '' : 'disabled'}>Metti in calendario</button>
        </div>
      </div>
      <div class="appointment-schedule-meta">
        ${variant.missing ? `<span class="warn">${variant.missing} non piazzat${variant.missing === 1 ? 'a' : 'e'}</span>` : '<span class="ok">Tutte piazzate</span>'}
        ${heatCount ? `<span>${heatCount} in fascia calda</span>` : '<span>Zero fascia calda</span>'}
      </div>
      ${variant.unplaced?.length ? `<div class="appointment-unplaced">
        <strong>Non piazzate</strong>
        ${variant.unplaced.map(item => `<span>${esc(item.targetName)}: ${item.missing} · ${esc(item.reason)}</span>`).join('')}
      </div>` : ''}
      <div class="appointment-preview-toolbar">
        <span>Le lezioni bloccate restano ferme.</span>
        <button type="button" class="btn btn-outline btn-sm" onclick="generateAppointmentAgenda(${jsArg(variant.id)})">Nuovo suggerimento</button>
      </div>
      ${appointmentScheduleByDayHtml(variant.scheduled)}
    </div>`
}

function appointmentCurrentFallbackDuration() {
  const durationInput = document.getElementById('appointments-min-duration')
  const fallback = normalizeAppointmentLessonDuration(durationInput?.value || APPOINTMENT_MIN_LESSON_MIN, APPOINTMENT_MIN_LESSON_MIN)
  if (durationInput && Number(durationInput.value) !== fallback) durationInput.value = String(fallback)
  return fallback
}

function buildAppointmentPlannerResults() {
  const fallbackDuration = appointmentCurrentFallbackDuration()
  const filtered = appointmentSelectedAllievi()
  const missing = []
  const maestroSlots = normalizeAvailabilitySlots(maestroAvailabilitySlots)
  const effectiveMaestroSlots = effectiveMaestroAvailabilitySlots()
  if (!maestroSlots.length) missing.push('Maestro')
  else if (!effectiveMaestroSlots.length) missing.push('Maestro senza fasce utili dopo le esclusioni')
  const targets = appointmentSchedulableTargets(filtered)
  const withoutSlots = targets.filter(target => !availabilitySlotsForAppointmentScheduleTarget(target).length)
  if (withoutSlots.length) {
    const preview = withoutSlots.slice(0, 4).map(target => target.label).join(', ')
    missing.push(`${withoutSlots.length} element${withoutSlots.length === 1 ? 'o' : 'i'} senza fasce${preview ? ` (${preview}${withoutSlots.length > 4 ? ', ...' : ''})` : ''}`)
  }
  const targetResults = targets.map(target => {
    const windows = computeAvailabilityIntersectionsForTarget(target, target.lessonDuration, APPOINTMENT_BUFFER_MIN)
    return {
      targetId: target.id,
      targetName: target.label,
      targetType: target.type,
      memberIds: target.memberIds || [],
      weeklyCount: target.weeklyCount,
      avoidConsecutive: target.avoidConsecutive,
      consecutiveMode: target.consecutiveMode,
      lessonDuration: target.lessonDuration,
      location: target.location,
      locationKey: target.locationKey,
      locationPoint: target.locationPoint,
      routeStartLabel: target.routeStartLabel,
      routeStartKey: target.routeStartKey,
      routeStartPoint: target.routeStartPoint,
      routeEndLabel: target.routeEndLabel,
      routeEndKey: target.routeEndKey,
      routeEndPoint: target.routeEndPoint,
      routeIsItinerary: target.routeIsItinerary,
      priorityMode: target.priorityMode,
      tierRank: target.tierRank,
      windows,
      plan: chooseAppointmentWeeklyPlan(windows, target.weeklyCount, target.consecutiveMode),
    }
  })
  return { fallbackDuration, missing, targets, targetResults }
}

function generateAppointmentAgenda(variantId) {
  const el = document.getElementById('appointments-intersections')
  if (!el) return
  appointmentGenerationNonce += 1
  const { fallbackDuration, missing, targets, targetResults } = buildAppointmentPlannerResults()
  const definition = appointmentScheduleVariantDefinitions().find(item => item.id === variantId) || appointmentScheduleVariantDefinitions()[0]
  const lockedSlots = appointmentCurrentVariant?.scheduled?.filter(item => item.locked) || []
  const variant = buildAppointmentScheduleVariant(targetResults, { ...definition, randomness: 45 + (appointmentGenerationNonce % 7) * 9 }, APPOINTMENT_BUFFER_MIN, { lockedSlots })
  appointmentCurrentVariant = variant
  lastAppointmentScheduleVariants = [variant]
  renderAppointmentAgendaPreview({ fallbackDuration, missing, targets, targetResults })
}

function renderAppointmentAgendaPreview(context = null) {
  const el = document.getElementById('appointments-intersections')
  if (!el) return
  const data = context || buildAppointmentPlannerResults()
  const { fallbackDuration, missing, targets, targetResults } = data
  const totalDemand = targetResults.reduce((sum, result) => sum + result.weeklyCount, 0)
  if (!appointmentCurrentVariant) {
    el.innerHTML = `
      ${missing.length ? `<div class="appointments-warning">Disponibilita mancanti o incomplete: ${esc(missing.join(', '))}.</div>` : ''}
      <div class="availability-empty">Scegli una tipologia agenda per generare la preview. Verranno considerati ${targets.length} element${targets.length === 1 ? 'o' : 'i'} e ${totalDemand} lezion${totalDemand === 1 ? 'e' : 'i'} richieste.</div>`
    return
  }
  const scheduleVariants = [appointmentCurrentVariant]
  el.innerHTML = `
    ${missing.length ? `<div class="appointments-warning">Disponibilita mancanti o incomplete: ${esc(missing.join(', '))}.</div>` : ''}
    <div class="appointments-results">
      <div class="appointments-card-title">
        <h3>Preview agenda</h3>
        <span>${targets.length} element${targets.length === 1 ? 'o' : 'i'} da pianificare · ${scheduleVariants[0]?.totalDemand || 0} lezion${(scheduleVariants[0]?.totalDemand || 0) === 1 ? 'e' : 'i'} richieste · fallback ${fallbackDuration} min</span>
      </div>
      <div id="appointments-calendar-status" class="appointments-status"></div>
      <div>
        ${scheduleVariants.map(appointmentScheduleVariantHtml).join('')}
      </div>
    </div>`
}

function openLezione(id, fromAllievoId = null, fromGruppoNome = null) {
  lezioneBackAllievoId = fromAllievoId || null
  lezioneBackGruppoNome = fromGruppoNome || null
  showView('lezione', id)
}

function chiudiLezioneGuidata(id) {
  showView('nuova-lezione', `lezione:${id}`)
  let tries = 0
  const timer = setInterval(() => {
    tries += 1
    const check = document.getElementById('lz-check-bene')
    if (check || tries > 20) {
      clearInterval(timer)
      setLessonStatus('chiusa')
      document.getElementById('lz-title').textContent = 'Chiudi lezione'
      check?.focus()
      check?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 120)
}

function openLocation(luogo) {
  if (!luogo) return
  showView('location', luogo)
}

async function loadLocation(luogo) {
  const el = document.getElementById('location-content')
  const nome = String(luogo || '').trim()
  el.innerHTML = '<div class="loading">Caricamento…</div>'
  recordAppHistory('location', nome)
  if (!lezioniCache) await loadLezioni(true)
  await loadLocations()
  if (nome === '__index__') {
    const names = locationNamesFromLessons()
    el.innerHTML = `
      <button class="back-btn" onclick="showView('allievi')">← Dashboard</button>
      <div class="section-header"><h2>Location</h2><button class="btn btn-primary btn-sm" onclick="openLocation('Nuova location')">+ Nuova location</button></div>
      <div class="card">
        <div class="map-list" style="max-height:none">
        ${names.length ? names.map(name => {
          const rec = locationRecordByName(name)
          const record = {
            ...(rec || { nome: name }),
            nome: rec?.nome || name,
            tipologia: locationTipologia(rec || { nome: name }),
            tipo: locationType(rec || { nome: name }),
          }
          const linkedLessons = locationLessonsForRecord(record)
          record.lessonCount = linkedLessons.length
          record.ultimoUso = linkedLessons.map(l => String(l.data || '').slice(0, 10)).filter(Boolean).sort().pop() || ''
          record.coords = locationMapCoords(record)
          const selectedRow = normalizeText(record.nome) === normalizeText(mappaSelectedLocationName)
          const countText = `${record.lessonCount || 0} lezion${Number(record.lessonCount || 0) === 1 ? 'e' : 'i'}`
          const lastText = record.ultimoUso ? `ultimo uso: ${formatDate(record.ultimoUso)}` : 'ultimo uso: -'
          return `<div class="map-location-row${selectedRow ? ' is-selected' : ''}" role="button" tabindex="0" onclick="openLocation(${jsArg(record.nome)})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); openLocation(${jsArg(record.nome)})}">
            <div class="map-location-row-main">
              <strong>${esc(record.nome)}</strong>
              <span>${esc(record.indirizzo || 'Indirizzo da verificare')}</span>
              <span>${esc(countText)} · ${esc(lastText)}</span>
              ${renderLocationBadges(record)}
              ${renderLocationCardActions(record)}
            </div>
            <div class="map-location-row-preview">${renderMappaMiniPreview(record)}</div>
          </div>`
        }).join('') : '<div class="empty">Nessuna location registrata.</div>'}
        </div>
      </div>`
    return
  }
  const stored = locationRecordByName(nome) || {}
  const lezioni = (lezioniCache || []).filter(l => lessonLocationUsesName(l, nome))
  const allieviIds = [...new Set(lezioni.flatMap(l => (l.lezioni_allievi || []).map(la => la.allievi?.id).filter(Boolean)))]
  const allievi = allieviIds.map(id => allAllievi.find(a => a.id === id)).filter(Boolean)
  const casaDi = allievi.length === 1 ? `Casa di ${allievoDisplayName(allievi[0].id)}` : ''
  const tipologia = stored.tipologia || (/casa|home|abitazione/i.test(nome) || casaDi ? 'Casa allievo' : 'Location')
  const indirizzo = stored.indirizzo || allievi.map(a => visibleAllievoAddress(a).indirizzo).find(Boolean) || ''
  const coords = locationCoordinatesFromRecord(stored)
  const displayNome = stored.nome || casaDi || nome
  const editable = canEditLocation(stored)
  const disabledAttr = editable ? '' : ' disabled'
  el.innerHTML = `
    ${locationBackButtonHtml()}
    <div class="card">
      <div class="lezione-read-title">${esc(displayNome)}</div>
      <div class="scheda-meta">${esc(tipologia)}${indirizzo ? ` · ${esc(indirizzo)}` : ''}${coords ? ` · ${esc(formatMapCoordinate(coords.lat))}, ${esc(formatMapCoordinate(coords.lng))}` : ''}${stored.condivisa ? ' · condivisa' : ''}</div>
    </div>
    <p class="sec-title">Dati location</p>
    <div class="card">
      <div id="location-status" class="msg"></div>
      <div class="location-form-grid">
        <div class="field"><label>Nome</label><input id="loc-nome" value="${esc(stored.nome || nome)}"${disabledAttr}></div>
        <div class="field">
          <label>Categoria</label>
          <select id="loc-tipologia"${disabledAttr}>
            ${locationCategoryOptions(tipologia)}
          </select>
        </div>
      </div>
      <div class="field"><label>Indirizzo</label><input id="loc-indirizzo" value="${esc(indirizzo)}" placeholder="Via, civico, zona"${disabledAttr}></div>
      <div class="location-form-grid location-map-grid">
        <div class="field"><label>Latitudine</label><input id="loc-latitudine" value="${coords ? esc(formatMapCoordinate(coords.lat)) : ''}" placeholder="45.46420" inputmode="decimal"${disabledAttr}></div>
        <div class="field"><label>Longitudine</label><input id="loc-longitudine" value="${coords ? esc(formatMapCoordinate(coords.lng)) : ''}" placeholder="9.19000" inputmode="decimal"${disabledAttr}></div>
      </div>
      <div class="field"><label>Note</label><textarea id="loc-note" placeholder="Dettagli accesso, pavimentazione, criticita..."${disabledAttr}>${esc(stored.note || '')}</textarea></div>
      <label style="display:flex;align-items:center;gap:.5rem;margin-bottom:.8rem;color:var(--muted);font-size:.86rem;font-weight:700">
        <input type="checkbox" id="loc-condivisa" ${stored.condivisa ? 'checked' : ''}${disabledAttr}>
        Condivisa con altri maestri
      </label>
      <div style="display:flex;gap:.45rem;flex-wrap:wrap">
        ${editable ? `<button class="btn btn-primary btn-sm" onclick="salvaLocation(${jsArg(nome)})">Salva location</button>` : ''}
        <button class="btn btn-outline btn-sm" onclick="showView('mappa',${jsArg(displayNome)})">Apri in mappa</button>
      </div>
    </div>
    <p class="sec-title">Allievi collegati</p>
    <div class="card">
      ${allievi.length ? allievi.map(a => {
        const address = visibleAllievoAddress(a)
        return `<div class="lezione-read-person clickable" onclick="loadScheda('${a.id}')"><strong>${esc(allievoDisplayName(a.id))}</strong>${address.indirizzo ? `<span> · ${esc(address.indirizzo)}</span>` : ''}</div>`
      }).join('') : '<div class="empty">Nessun allievo collegato.</div>'}
    </div>
    <p class="sec-title">Lezioni in questa location</p>
    <div class="card">${lezioni.length ? renderLezioniTable(lezioni, { showYearGroups: false }) : '<div class="empty">Nessuna lezione registrata.</div>'}</div>
  `
}

function showLocationsIndex() {
  mappaPuntiEspansi = true
  mappaPuntiEspansiLoaded = true
  safeStorage.setItem(MAP_POINTS_EXPANDED_STORAGE_KEY, '1')
  showView('mappa', mappaSelectedLocationName || null)
}

function formatMapCoordinate(value) {
  const n = parseMapCoordinate(value)
  return n === null ? '' : n.toFixed(5)
}

function mappaAllievoHomeName(allievo) {
  return [allievo?.nome, allievo?.cognome].filter(Boolean).join(' ') || allievo?.nickname || allievoDisplayName(allievo?.id)
}

function mappaHomeRecordsFromAllievi() {
  return allieviVisibiliGod()
    .filter(allievo => allievo?.stato !== 'archiviato')
    .map(allievo => {
      const profilo = allievo.profilo || {}
      const visibleAddress = visibleAllievoAddress(allievo)
      const casa = String(visibleAddress.casa || '').trim()
      const zona = String(visibleAddress.indirizzo || '').trim()
      const indirizzo = casa || zona
      if (!indirizzo) return null
      const nome = `Casa di ${mappaAllievoHomeName(allievo)}`
      const record = locationWithLocalMapCoords({
        nome,
        tipologia: 'Casa allievo',
        indirizzo,
        latitudine: visibleAddress.casa_latitudine,
        longitudine: visibleAddress.casa_longitudine,
        note: casa && zona && normalizeText(casa) !== normalizeText(zona) ? `Zona: ${zona}` : '',
        condivisa: !!profilo.indirizzo_condiviso,
        source: 'allievo-casa',
        allievo_id: allievo.id,
      })
      return {
        ...record,
        lessonCount: 0,
        coords: locationMapCoords(record),
      }
    })
    .filter(Boolean)
}

function mappaLocationRecords() {
  const locationRecords = locationNamesFromLessons().map(nome => {
    const rec = locationRecordByName(nome) || { nome }
    const displayName = rec.nome || nome
    const linkedLessons = locationLessonsForRecord({ ...rec, nome: displayName })
    const lessonCount = linkedLessons.length
    const ultimoUso = linkedLessons.map(l => String(l.data || '').slice(0, 10)).filter(Boolean).sort().pop() || ''
    const coords = locationMapCoords({ ...rec, nome: displayName })
    return {
      ...rec,
      nome: displayName,
      tipologia: locationTipologia(rec),
      tipo: locationType(rec),
      lessonCount,
      ultimoUso,
      coords,
    }
  })
  const byKey = new Map()
  ;[...locationRecords, ...mappaHomeRecordsFromAllievi()].forEach(record => {
    const key = record.source === 'allievo-casa' ? `home:${record.allievo_id}` : `location:${normalizeText(record.nome)}`
    if (!byKey.has(key)) byKey.set(key, record)
  })
  return [...byKey.values()].sort((a, b) => {
    if (!!b.coords !== !!a.coords) return b.coords ? 1 : -1
    if ((a.coords?.source === 'stimato') !== (b.coords?.source === 'stimato')) return a.coords?.source === 'stimato' ? 1 : -1
    return String(a.nome || '').localeCompare(String(b.nome || ''), 'it', { sensitivity: 'base' })
  })
}

function locationLessonsForRecord(record = {}) {
  const id = locationDbId(record)
  return (lezioniCache || []).filter(lezione => {
    if (id && lezione.location_id && String(lezione.location_id) === String(id)) return true
    return lessonLocationUsesName(lezione, record.nome)
  })
}

function mappaTipoClass(tipologia = '') {
  const key = normalizeText(tipologia)
  if (/casa|home|abitazione|allievo/.test(key)) return 'type-home'
  if (/pista/.test(key)) return 'type-pista'
  if (/skate/.test(key)) return 'type-skatepark'
  if (/palestra|gym/.test(key)) return 'type-gym'
  if (/parco/.test(key)) return 'type-park'
  if (/strada|ciclabile/.test(key)) return 'type-road'
  if (/piazza/.test(key)) return 'type-square'
  if (/basket/.test(key)) return 'type-basket'
  return 'type-location'
}

function mappaProjectCoord(coordsOrLat, longitudine) {
  const directX = parseMapCoordinate(coordsOrLat?.x)
  const directY = parseMapCoordinate(coordsOrLat?.y)
  if (directX !== null && directY !== null) {
    return {
      x: Math.max(30, Math.min(MILANO_MAP_VIEWBOX.width - 30, directX)),
      y: Math.max(30, Math.min(MILANO_MAP_VIEWBOX.height - 30, directY)),
    }
  }
  const lat = parseMapCoordinate(coordsOrLat?.lat ?? coordsOrLat)
  const lng = parseMapCoordinate(coordsOrLat?.lng ?? longitudine)
  if (lat === null || lng === null) return null
  const rawX = ((lng - MILANO_MAP_BOUNDS.west) / (MILANO_MAP_BOUNDS.east - MILANO_MAP_BOUNDS.west)) * MILANO_MAP_VIEWBOX.width
  const rawY = ((MILANO_MAP_BOUNDS.north - lat) / (MILANO_MAP_BOUNDS.north - MILANO_MAP_BOUNDS.south)) * MILANO_MAP_VIEWBOX.height
  return {
    x: Math.max(30, Math.min(MILANO_MAP_VIEWBOX.width - 30, rawX)),
    y: Math.max(30, Math.min(MILANO_MAP_VIEWBOX.height - 30, rawY)),
  }
}

function mappaCoordFromPoint(x, y) {
  const lng = MILANO_MAP_BOUNDS.west + (x / MILANO_MAP_VIEWBOX.width) * (MILANO_MAP_BOUNDS.east - MILANO_MAP_BOUNDS.west)
  const lat = MILANO_MAP_BOUNDS.north - (y / MILANO_MAP_VIEWBOX.height) * (MILANO_MAP_BOUNDS.north - MILANO_MAP_BOUNDS.south)
  return { lat, lng }
}

function mappaShortName(name) {
  const clean = String(name || 'Location').replace(/\s+/g, ' ').trim()
  return clean.length > 18 ? clean.slice(0, 16) + '...' : clean
}

function clampMapPreview(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function renderMappaMiniPreview(record = {}) {
  if (record.preview_url) {
    return `<button type="button" class="map-mini-preview" title="Preview luogo" onclick="event.stopPropagation(); previewMappaLocation(${jsArg(record.nome)})"><img src="${esc(record.preview_url)}" alt=""></button>`
  }
  if (!record.coords || record.coords.source === 'stimato') {
    const coordLabel = record.coords?.source === 'stimato' ? 'GPS da verificare' : 'Preview non disponibile'
    return `<button type="button" class="map-mini-preview map-mini-placeholder" title="${esc(coordLabel)}" onclick="event.stopPropagation(); previewMappaLocation(${jsArg(record.nome)})">
      <span class="map-placeholder-pin">pin</span><span>${esc(coordLabel)}</span>
    </button>`
  }
  const point = mappaProjectCoord(record.coords)
  if (!point) return `<button type="button" class="map-mini-preview map-mini-placeholder" title="GPS da verificare" onclick="event.stopPropagation(); previewMappaLocation(${jsArg(record.nome)})"><span class="map-placeholder-pin">pin</span><span>GPS da verificare</span></button>`
  const viewW = 190
  const viewH = 142
  const viewX = clampMapPreview(point.x - viewW / 2, 0, MILANO_MAP_VIEWBOX.width - viewW)
  const viewY = clampMapPreview(point.y - viewH / 2, 0, MILANO_MAP_VIEWBOX.height - viewH)
  const selected = normalizeText(record.nome) === normalizeText(mappaSingleFocusName)
  return `
    <button type="button" class="map-mini-preview${selected ? ' is-selected' : ''}" title="Mostra solo questo punto sulla mappa"
      onclick="event.stopPropagation(); previewMappaLocation(${jsArg(record.nome)})">
      <svg viewBox="${viewX.toFixed(1)} ${viewY.toFixed(1)} ${viewW} ${viewH}" aria-hidden="true" focusable="false">
        <image href="${MILANO_MAP_IMAGE}" x="0" y="0" width="${MILANO_MAP_VIEWBOX.width}" height="${MILANO_MAP_VIEWBOX.height}" preserveAspectRatio="xMidYMid meet"></image>
        <circle class="map-mini-halo" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="18"></circle>
        <circle class="map-mini-core" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="9"></circle>
      </svg>
    </button>`
}

function previewMappaLocation(nome) {
  if (visibleViewName() === 'mappa') focusMappaLocation(nome)
  else showView('mappa', nome)
}

function locationBadgeLabels(record = {}) {
  const labels = []
  const tipo = normalizeText(locationType(record))
  const tipologia = normalizeText(locationTipologia(record))
  if (isPrivateLocation(record)) labels.push('privato')
  else if (/skate/.test(tipo + ' ' + tipologia)) labels.push('skatepark')
  else if (/strada|ciclabile|street/.test(tipo + ' ' + tipologia)) labels.push('street')
  else labels.push('spot')
  ;(record.tags || []).forEach(tag => {
    const clean = String(tag || '').trim()
    if (clean && !labels.some(label => normalizeText(label) === normalizeText(clean))) labels.push(clean)
  })
  if (!locationCoordinatesFromRecord(record)) labels.push('GPS da verificare')
  return labels.slice(0, 4)
}

function renderLocationBadges(record = {}) {
  return `<div class="map-location-badges">${locationBadgeLabels(record).map(label => `<span class="chip map-location-badge">${esc(label)}</span>`).join('')}</div>`
}

function renderLocationCardActions(record = {}) {
  const mapsUrl = locationGoogleMapsUrl(record)
  return `<div class="map-location-actions">
    ${mapsUrl ? `<button type="button" class="btn btn-outline btn-xs" onclick="event.stopPropagation(); openLocationMaps(${jsArg(record.id || record.nome)})">Maps</button>` : ''}
    <button type="button" class="btn btn-outline btn-xs" onclick="event.stopPropagation(); showView('location',${jsArg(record.nome)})">Modifica</button>
  </div>`
}

function renderMilanoMapSvg(records, selectedName) {
  const nearbyLabelCounts = new Map()
  const projectedRecords = records
    .filter(record => record.coords && record.coords.source !== 'stimato')
    .map(record => ({ record, point: mappaProjectCoord(record.coords) }))
    .filter(item => item.point)
  const points = projectedRecords
    .map(({ record, point }) => {
      const bucket = `${Math.round(point.x / 62)}:${Math.round(point.y / 62)}`
      const nearbyIndex = nearbyLabelCounts.get(bucket) || 0
      nearbyLabelCounts.set(bucket, nearbyIndex + 1)
      const selected = normalizeText(record.nome) === normalizeText(selectedName)
      const labelLeft = point.x > 720
      const labelLow = point.y < 100
      const stackSide = nearbyIndex % 2 === 0 ? 1 : -1
      const stackRow = Math.floor(nearbyIndex / 2)
      const stackOffsetX = nearbyIndex ? stackSide * (18 + stackRow * 6) : 0
      const stackOffsetY = nearbyIndex ? 12 + stackRow * 13 : 0
      const labelX = (labelLeft ? -12 : 12) + stackOffsetX
      const labelY = (labelLow ? 28 : -12) + stackOffsetY
      const anchor = labelLeft ? 'end' : 'start'
      const radius = Math.min(18, 9 + Math.max(0, Number(record.lessonCount || 0)) * 1.2)
      const inferred = record.coords?.source === 'stimato'
      const meta = [record.tipologia || 'Location', record.indirizzo || '', record.lessonCount ? `${record.lessonCount} lezioni` : '', inferred ? 'posizione stimata' : ''].filter(Boolean).join(' · ')
      return `
        <g class="map-location-point ${mappaTipoClass(record.tipologia)}${selected ? ' is-selected' : ''}${inferred ? ' is-inferred' : ''}" tabindex="0" role="button" aria-label="${esc(record.nome)}"
          transform="translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})"
          onclick="event.stopPropagation(); selectMappaLocation(${jsArg(record.nome)})"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); selectMappaLocation(${jsArg(record.nome)})}">
          <title>${esc(record.nome)}${meta ? ` · ${esc(meta)}` : ''}</title>
          <circle class="map-point-hit" r="${Math.max(radius + 16, 28)}"></circle>
          <circle class="map-point-halo" r="${radius + 9}"></circle>
          <circle class="map-point-core" r="${radius}"></circle>
          <text class="map-location-label" x="${labelX}" y="${labelY}" text-anchor="${anchor}">${esc(mappaShortName(record.nome))}</text>
        </g>`
    }).join('')

  const selectedRecord = projectedRecords.find(({ record }) => normalizeText(record.nome) === normalizeText(selectedName))
  const popup = selectedRecord ? renderMappaPopup(selectedRecord.record, selectedRecord.point) : ''

  return `
    <div class="map-image-stage">
      <img class="map-base-image" src="${MILANO_MAP_IMAGE}" alt="Mappa di Milano divisa per quartieri">
      <svg id="milano-map-svg" class="map-overlay-svg" viewBox="0 0 ${MILANO_MAP_VIEWBOX.width} ${MILANO_MAP_VIEWBOX.height}" role="img" aria-label="Mappa di Milano con punti location" onclick="handleMappaClick(event)">
        ${points || '<text class="map-location-label" x="557" y="520" text-anchor="middle" style="opacity:1">Nessun punto posizionato</text>'}
      </svg>
      ${popup}
    </div>`
}

function renderMappaPopup(record = {}, point = null) {
  if (!record || !point) return ''
  const left = (point.x / MILANO_MAP_VIEWBOX.width) * 100
  const top = (point.y / MILANO_MAP_VIEWBOX.height) * 100
  const mapsUrl = locationGoogleMapsUrl(record)
  return `<div class="map-marker-popup" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%" onclick="event.stopPropagation()">
    <strong>${esc(record.nome || 'Location')}</strong>
    <span>${Number(record.lessonCount || 0)} lezion${Number(record.lessonCount || 0) === 1 ? 'e' : 'i'}</span>
    <div class="map-marker-popup-actions">
      ${mapsUrl ? `<button type="button" class="btn btn-outline btn-xs" onclick="openLocationMaps(${jsArg(record.id || record.nome)})">Maps</button>` : ''}
    </div>
  </div>`
}

function mappaVisibleRecords(records) {
  if (mappaTipoFiltro === 'all') return records
  const target = normalizeText(mappaTipoFiltro)
  return records.filter(record => normalizeText(record.tipologia || 'Location') === target)
}

function renderTravelTimePanel(records = []) {
  const options = records
    .filter(record => record.nome)
    .sort((a, b) => String(a.nome).localeCompare(String(b.nome), 'it', { sensitivity: 'base' }))
  const rules = readAppointmentTravelRules()
  const optionHtml = '<option value="">Scegli location</option>' + options.map(record => `<option value="${esc(record.nome)}">${esc(record.nome)}</option>`).join('')
  return `
    <div class="map-panel">
      <h3>Spostamenti medi</h3>
      <div class="map-panel-meta">Questi tempi vengono mostrati nella preview appuntamenti come blocchi trasparenti tra due lezioni consecutive.</div>
      <div class="map-travel-form">
        <div class="field"><label>Da</label><select id="map-travel-from">${optionHtml}</select></div>
        <div class="field"><label>A</label><select id="map-travel-to">${optionHtml}</select></div>
        <div class="field"><label>Minuti</label><input id="map-travel-minutes" type="number" min="0" step="5" value="${APPOINTMENT_BUFFER_MIN}"></div>
        <button type="button" class="btn btn-outline btn-sm" onclick="saveMapTravelTime()">Salva</button>
      </div>
      <div id="map-travel-status" class="appointments-status"></div>
      <div class="map-travel-list">
        ${rules.length ? rules.map(rule => `
          <div class="map-travel-row">
            <span>${esc(rule.fromLabel)} - ${esc(rule.toLabel)}</span>
            <strong>${Number(rule.minutes || 0)} min</strong>
            <button type="button" class="btn btn-outline btn-xs" onclick="deleteMapTravelTime(${jsArg(rule.key)})">Rimuovi</button>
          </div>`).join('') : '<div class="map-empty-inline">Nessuno spostamento personalizzato.</div>'}
      </div>
    </div>`
}

function setMapTravelStatus(text, cls = '') {
  const el = document.getElementById('map-travel-status')
  if (!el) return
  el.textContent = text || ''
  el.style.color = cls === 'err' ? 'var(--danger)' : (cls === 'ok' ? 'var(--success)' : 'var(--muted)')
}

function saveMapTravelTime() {
  const fromLabel = document.getElementById('map-travel-from')?.value.trim() || ''
  const toLabel = document.getElementById('map-travel-to')?.value.trim() || ''
  const minutes = Math.max(0, parseInt(document.getElementById('map-travel-minutes')?.value, 10) || 0)
  const key = appointmentTravelRuleKey(fromLabel, toLabel)
  if (!key || normalizeMapMatchText(fromLabel) === normalizeMapMatchText(toLabel)) {
    setMapTravelStatus('Scegli due location diverse.', 'err')
    return
  }
  const rows = readAppointmentTravelRules().filter(rule => rule.key !== key)
  rows.push({ key, fromLabel, toLabel, minutes, updatedAt: new Date().toISOString() })
  rows.sort((a, b) => String(a.fromLabel).localeCompare(String(b.fromLabel), 'it', { sensitivity: 'base' }) || String(a.toLabel).localeCompare(String(b.toLabel), 'it', { sensitivity: 'base' }))
  writeAppointmentTravelRules(rows)
  if (appointmentCurrentVariant) rerenderCurrentAppointmentPreview()
  renderMappa(mappaSelectedLocationName)
}

function deleteMapTravelTime(key) {
  writeAppointmentTravelRules(readAppointmentTravelRules().filter(rule => rule.key !== key))
  if (appointmentCurrentVariant) rerenderCurrentAppointmentPreview()
  renderMappa(mappaSelectedLocationName)
}

async function renderMappa(selectedName) {
  const el = document.getElementById('mappa-content')
  if (!el) return
  if (arguments.length) mappaSelectedLocationName = selectedName || null
  if (!mappaPuntiEspansiLoaded) {
    mappaPuntiEspansi = safeStorage.getItem(MAP_POINTS_EXPANDED_STORAGE_KEY) === '1'
    mappaPuntiEspansiLoaded = true
  }
  el.innerHTML = '<div class="loading">Caricamento…</div>'
  if (!lezioniCache) await loadLezioni(true)
  await loadLocations()

  const records = mappaLocationRecords()
  const types = ['all', ...new Set(records.map(record => record.tipologia || 'Location'))]
  if (mappaTipoFiltro !== 'all' && !types.some(t => normalizeText(t) === normalizeText(mappaTipoFiltro))) mappaTipoFiltro = 'all'
  const visibleRecords = mappaVisibleRecords(records)
  const selected = records.find(record => normalizeText(record.nome) === normalizeText(mappaSelectedLocationName)) || null
  const focusedRecord = mappaSingleFocusName ? records.find(record => normalizeText(record.nome) === normalizeText(mappaSingleFocusName)) : null
  const mapRecords = focusedRecord ? [focusedRecord] : visibleRecords
  const selectedCoords = selected?.coords || null
  const placedCount = records.filter(record => record.coords && record.coords.source !== 'stimato').length
  const inferredCount = records.filter(record => record.coords?.source === 'stimato').length
  const pendingCount = Math.max(0, records.length - placedCount)
  const formTipologia = selected?.tipologia || 'Location'
  const selectedEditable = !selected || canEditLocation(selected)
  const selectedDisabledAttr = selectedEditable ? '' : ' disabled'
  const mergeTargets = selected && selected.source !== 'allievo-casa' && selectedEditable
    ? records.filter(record => normalizeText(record.nome) !== normalizeText(selected.nome))
    : []

  el.innerHTML = `
    <div class="map-shell">
      <div class="map-canvas-panel">
        <div class="map-canvas-head">
          <div class="map-canvas-title">
            <strong>Milano operativa</strong>
            <span>${focusedRecord ? `Vista singola: ${esc(focusedRecord.nome)}` : 'Mappa quartieri ricolorata con la palette del gestionale. Clicca sulla mappa per impostare il punto.'}</span>
          </div>
          <div class="map-filter-row">
            ${focusedRecord ? '<button type="button" class="chip chip-on" onclick="clearMappaSingleFocus()">Mostra tutti</button>' : ''}
            ${types.map(type => `<button type="button" class="chip${normalizeText(type) === normalizeText(mappaTipoFiltro) ? ' chip-on' : ''}" onclick="setMappaFiltro(${jsArg(type)})">${esc(type === 'all' ? 'Tutte' : type)}</button>`).join('')}
          </div>
        </div>
        <div class="map-canvas-wrap">${renderMilanoMapSvg(mapRecords, mappaSelectedLocationName)}</div>
      </div>

      <div class="map-side">
        <div class="map-panel">
          <h3>${selected ? 'Modifica punto' : 'Nuovo punto'}</h3>
          <div class="map-stat-row">
            <div class="map-stat"><strong>${records.length}</strong><span>Punti</span></div>
            <div class="map-stat"><strong>${placedCount}</strong><span>In mappa</span></div>
            <div class="map-stat"><strong>${inferredCount}</strong><span>Stimate</span></div>
          </div>
          <div id="map-status" class="msg"></div>
          <input type="hidden" id="map-loc-original" value="${esc(selected?.nome || '')}">
          <div class="map-form-grid">
            <div class="field map-form-full"><label>Nome</label><input id="map-loc-nome" value="${esc(selected?.nome || '')}" placeholder="Es. Pista Portello"${selectedDisabledAttr}></div>
            <div class="field">
              <label>Categoria</label>
              <select id="map-loc-tipologia"${selectedDisabledAttr}>
                ${locationCategoryOptions(formTipologia)}
              </select>
            </div>
            <div class="field"><label>Indirizzo / zona</label><input id="map-loc-indirizzo" value="${esc(selected?.indirizzo || '')}" placeholder="Via, quartiere, comune"${selectedDisabledAttr}></div>
            <div class="field"><label>Latitudine</label><input id="map-loc-latitudine" value="${selectedCoords ? esc(formatMapCoordinate(selectedCoords.lat)) : ''}" placeholder="45.46420" inputmode="decimal"${selectedDisabledAttr}></div>
            <div class="field"><label>Longitudine</label><input id="map-loc-longitudine" value="${selectedCoords ? esc(formatMapCoordinate(selectedCoords.lng)) : ''}" placeholder="9.19000" inputmode="decimal"${selectedDisabledAttr}></div>
            <div class="field map-form-full"><label>Note</label><textarea id="map-loc-note" placeholder="Accesso, superficie, riferimenti..."${selectedDisabledAttr}>${esc(selected?.note || '')}</textarea></div>
          </div>
          <label style="display:flex;align-items:center;gap:.5rem;margin:.2rem 0 .75rem;color:var(--muted);font-size:.86rem;font-weight:700">
            <input type="checkbox" id="map-loc-condivisa" ${selected?.condivisa ? 'checked' : ''}${selectedDisabledAttr}>
            Condivisa con altri maestri
          </label>
          <div class="map-panel-meta">${selectedCoords?.source === 'stimato' ? 'Coordinate stimate dal nome/indirizzo: salva il punto se la posizione e corretta.' : 'Per aggiungere o spostare un punto: seleziona la location, clicca sulla mappa e salva.'}</div>
          <div class="map-form-actions">
            ${selectedEditable ? '<button class="btn btn-primary btn-sm" onclick="salvaMappaLocation()">Salva punto</button>' : ''}
            <button class="btn btn-outline btn-sm" onclick="preparaNuovaMappaLocation()">Nuovo</button>
            ${selected ? selected.source === 'allievo-casa'
              ? `<button class="btn btn-outline btn-sm" onclick="loadScheda(${jsArg(selected.allievo_id)})">Allievo</button>`
              : `<button class="btn btn-outline btn-sm" onclick="showView('location',${jsArg(selected.nome)})">Scheda</button>`
            : ''}
          </div>
          ${selected && selected.source !== 'allievo-casa' && selectedEditable ? `
            <div class="map-panel-meta" style="margin-top:.85rem">Fondi questo punto in una location gia presente quando due nomi indicano lo stesso posto.</div>
            <div class="map-form-actions">
              <select id="map-merge-target" class="btn btn-outline btn-sm" style="min-width:180px;max-width:100%">
                <option value="">Fondi in...</option>
                ${mergeTargets.map(record => `<option value="${esc(record.nome)}">${esc(record.nome)}</option>`).join('')}
              </select>
              <button class="btn btn-outline btn-sm" onclick="mergeMappaLocation(${jsArg(selected.nome)})">Merge</button>
            </div>
          ` : ''}
        </div>

        ${renderTravelTimePanel(records)}

        <div class="map-panel map-points-panel${mappaPuntiEspansi ? ' is-expanded' : ''}">
          <div class="map-panel-title-row">
            <h3>Punti</h3>
            <button type="button" class="btn btn-outline btn-xs" onclick="toggleMappaPuntiEspansi()">${mappaPuntiEspansi ? 'Compatta' : 'Espandi'}</button>
          </div>
          <div class="map-list">
            ${visibleRecords.length ? visibleRecords.map(record => {
              const selectedRow = normalizeText(record.nome) === normalizeText(mappaSelectedLocationName)
              const countText = `${record.lessonCount || 0} lezion${Number(record.lessonCount || 0) === 1 ? 'e' : 'i'}`
              const lastText = record.ultimoUso ? `ultimo uso: ${formatDate(record.ultimoUso)}` : 'ultimo uso: -'
              return `<div class="map-location-row${selectedRow ? ' is-selected' : ''}" role="button" tabindex="0"
                onclick="selectMappaLocation(${jsArg(record.nome)})"
                onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); selectMappaLocation(${jsArg(record.nome)})}">
                <div class="map-location-row-main">
                  <strong>${esc(record.nome)}</strong>
                  <span>${esc(record.indirizzo || 'Indirizzo da verificare')}</span>
                  <span>${esc(countText)} · ${esc(lastText)}</span>
                  ${renderLocationBadges(record)}
                  ${renderLocationCardActions(record)}
                </div>
                <div class="map-location-row-preview">${renderMappaMiniPreview(record)}</div>
              </div>`
            }).join('') : '<div class="map-empty-inline">Nessuna location per questo filtro.</div>'}
          </div>
        </div>
      </div>
    </div>`
}

function toggleMappaPuntiEspansi() {
  mappaPuntiEspansi = !mappaPuntiEspansi
  mappaPuntiEspansiLoaded = true
  safeStorage.setItem(MAP_POINTS_EXPANDED_STORAGE_KEY, mappaPuntiEspansi ? '1' : '0')
  renderMappa(mappaSelectedLocationName)
}
window.toggleMappaPuntiEspansi = toggleMappaPuntiEspansi

function setMappaStatus(message, className = 'msg-info') {
  const status = document.getElementById('map-status')
  if (!status) return
  status.textContent = message
  status.className = `msg ${className} show`
}

function setMappaFiltro(tipologia) {
  mappaTipoFiltro = tipologia || 'all'
  mappaSingleFocusName = null
  renderMappa()
}

function selectMappaLocation(nome) {
  mappaSelectedLocationName = nome || null
  mappaSingleFocusName = null
  renderMappa(mappaSelectedLocationName)
}

function focusMappaLocation(nome) {
  mappaSelectedLocationName = nome || null
  mappaSingleFocusName = nome || null
  renderMappa(mappaSelectedLocationName)
}

function clearMappaSingleFocus() {
  mappaSingleFocusName = null
  renderMappa(mappaSelectedLocationName)
}

function preparaNuovaMappaLocation() {
  mappaSelectedLocationName = null
  mappaSingleFocusName = null
  if (visibleViewName() !== 'mappa') showView('mappa')
  else renderMappa(null)
  setTimeout(() => document.getElementById('map-loc-nome')?.focus(), 80)
}

function handleMappaClick(event) {
  if (event.target.closest?.('.map-location-point')) return
  const svg = event.currentTarget
  if (!svg?.createSVGPoint) return
  const point = svg.createSVGPoint()
  point.x = event.clientX
  point.y = event.clientY
  const ctm = svg.getScreenCTM()
  if (!ctm) return
  const local = point.matrixTransform(ctm.inverse())
  const x = Math.max(0, Math.min(MILANO_MAP_VIEWBOX.width, local.x))
  const y = Math.max(0, Math.min(MILANO_MAP_VIEWBOX.height, local.y))
  const coords = mappaCoordFromPoint(x, y)
  const latInput = document.getElementById('map-loc-latitudine')
  const lngInput = document.getElementById('map-loc-longitudine')
  if (latInput) latInput.value = formatMapCoordinate(coords.lat)
  if (lngInput) lngInput.value = formatMapCoordinate(coords.lng)
  setMappaStatus('Coordinate impostate. Salva il punto per renderlo visibile nella mappa.', 'msg-info')
}

async function salvaMappaLocation() {
  const nome = document.getElementById('map-loc-nome')?.value.trim()
  const originalName = document.getElementById('map-loc-original')?.value.trim() || nome
  if (!nome) {
    setMappaStatus('Inserisci il nome della location.', 'msg-err')
    return
  }
  const coords = readCoordinateInputs('map-loc-latitudine', 'map-loc-longitudine')
  if (coords.error) {
    setMappaStatus(coords.error, 'msg-err')
    return
  }
  const payload = buildLocationPayload({
    nome,
    tipologia: document.getElementById('map-loc-tipologia')?.value || 'Location',
    indirizzo: document.getElementById('map-loc-indirizzo')?.value.trim() || null,
    note: document.getElementById('map-loc-note')?.value.trim() || null,
    latitudine: coords.lat,
    longitudine: coords.lng,
    condivisa: document.getElementById('map-loc-condivisa')?.checked || false,
  })
  setMappaStatus('Salvataggio...', 'msg-info')
  const result = await persistLocationPayload(payload, originalName)
  if (!result.ok) {
    setMappaStatus(result.error?.message || 'Errore salvataggio location.', 'msg-err')
    return
  }
  luoghiLezioneCache.clear()
  logModificaLocale('location', nome, 'Aggiornato punto mappa')
  renderDashboard()
  await renderMappa(nome)
  setMappaStatus(result.localOnly
    ? 'Punto salvato localmente. Per salvarlo nel DB applica la migrazione locations.'
    : result.mapCoordsLocal
      ? 'Punto salvato. Coordinate salvate localmente: applica la migrazione mappa per condividerle.'
      : 'Punto salvato in mappa.',
    result.localOnly || result.mapCoordsLocal ? 'msg-info' : 'msg-ok')
}

function replaceLessonLocationPart(text, sourceName, targetName) {
  const sourceKey = normalizeText(sourceName)
  const cleanTarget = String(targetName || '').trim()
  const cleanText = String(text || '').trim()
  if (!sourceKey || !cleanTarget || !cleanText) return cleanText
  const parts = appointmentLocationRouteParts(cleanText)
  if (parts.length > 1) {
    let changed = false
    const replaced = parts.map(part => {
      if (normalizeText(part) !== sourceKey) return part
      changed = true
      return cleanTarget
    })
    return changed ? replaced.join(' - ') : cleanText
  }
  return normalizeText(cleanText) === sourceKey ? cleanTarget : cleanText
}

function removeLocalLocationByName(nome) {
  const key = normalizeText(nome)
  if (!key) return
  try {
    const local = JSON.parse(safeStorage.getItem('locationsLocal') || '[]')
      .filter(location => normalizeText(location.nome) !== key)
    safeStorage.setItem('locationsLocal', JSON.stringify(local))
  } catch {}
  saveLocationMapCoordsLocal(nome, null, null)
  allLocations = allLocations.filter(location => normalizeText(location.nome) !== key)
  locationsLoaded = true
}

async function deleteMergedLocationRecord(record) {
  if (!record?.id || !canEditLocation(record)) return null
  const { error } = await sb.from('locations').delete().eq('id', record.id)
  return error || null
}

async function mergeMappaLocation(sourceName) {
  const targetName = document.getElementById('map-merge-target')?.value.trim()
  if (!sourceName || !targetName) {
    setMappaStatus('Scegli la location in cui fondere questo punto.', 'msg-err')
    return
  }
  if (normalizeText(sourceName) === normalizeText(targetName)) {
    setMappaStatus('Scegli una location diversa.', 'msg-err')
    return
  }
  const sourceRecord = locationRecordByName(sourceName) || { nome: sourceName }
  if (sourceRecord.source === 'allievo-casa' || !canEditLocation(sourceRecord)) {
    setMappaStatus('Questo punto non puo essere fuso da qui.', 'msg-err')
    return
  }
  const ok = confirm(`Fondere "${sourceName}" in "${targetName}"?\nLe lezioni verranno aggiornate e il punto duplicato verra rimosso dove possibile.`)
  if (!ok) return

  setMappaStatus('Merge in corso...', 'msg-info')
  if (!lezioniCache) await loadLezioni(true)
  const updates = (lezioniCache || [])
    .map(lezione => {
      const nextLuogo = replaceLessonLocationPart(lezione.luogo, sourceName, targetName)
      return nextLuogo !== String(lezione.luogo || '').trim() ? { lezione, nextLuogo } : null
    })
    .filter(Boolean)

  try {
    for (const item of updates) {
      const { error } = await sb.from('lezioni').update({ luogo: item.nextLuogo }).eq('id', item.lezione.id)
      if (error) throw error
    }
    lezioniCache = (lezioniCache || []).map(lezione => {
      const found = updates.find(item => String(item.lezione.id) === String(lezione.id))
      return found ? { ...lezione, luogo: found.nextLuogo } : lezione
    })
    const deleteError = await deleteMergedLocationRecord(sourceRecord)
    removeLocalLocationByName(sourceName)
    await loadLocations(true)
    luoghiLezioneCache.clear()
    logModificaLocale('location', targetName, `Merge location: ${sourceName} -> ${targetName}`)
    renderDashboard()
    await renderMappa(targetName)
    setMappaStatus(deleteError
      ? `Merge completato su ${updates.length} lezion${updates.length === 1 ? 'e' : 'i'}, ma il punto sorgente non e stato cancellato dal DB: ${deleteError.message || 'permesso negato'}.`
      : `Merge completato: ${updates.length} lezion${updates.length === 1 ? 'e aggiornata' : 'i aggiornate'}.`,
      deleteError ? 'msg-info' : 'msg-ok')
  } catch (error) {
    setMappaStatus(error?.message || 'Errore durante il merge.', 'msg-err')
  }
}

async function salvaLocation(originalName) {
  const status = document.getElementById('location-status')
  const nome = document.getElementById('loc-nome')?.value.trim()
  if (!nome) {
    if (status) { status.textContent = 'Inserisci il nome della location.'; status.className = 'msg msg-err show' }
    return
  }
  const coords = readCoordinateInputs('loc-latitudine', 'loc-longitudine')
  if (coords.error) {
    if (status) { status.textContent = coords.error; status.className = 'msg msg-err show' }
    return
  }
  const payload = buildLocationPayload({
    nome,
    tipologia: document.getElementById('loc-tipologia')?.value || 'Location',
    indirizzo: document.getElementById('loc-indirizzo')?.value.trim() || null,
    note: document.getElementById('loc-note')?.value.trim() || null,
    latitudine: coords.lat,
    longitudine: coords.lng,
    condivisa: document.getElementById('loc-condivisa')?.checked || false,
  })
  if (status) { status.textContent = 'Salvataggio...'; status.className = 'msg msg-info show' }
  const result = await persistLocationPayload(payload, originalName)
  if (!result.ok) {
    if (status) { status.textContent = result.error?.message || 'Errore salvataggio location.'; status.className = 'msg msg-err show' }
    return
  }
  luoghiLezioneCache.clear()
  logModificaLocale('location', nome, 'Aggiornata location')
  if (status) {
    status.textContent = result.localOnly
      ? 'Salvata localmente. Per salvarla nel DB applica la migrazione locations.'
      : result.mapCoordsLocal
        ? 'Location salvata. Coordinate salvate localmente: applica la migrazione mappa per renderle condivise.'
        : 'Location salvata.'
    status.className = result.localOnly || result.mapCoordsLocal ? 'msg msg-info show' : 'msg msg-ok show'
  }
  renderDashboard()
}

async function ensureSingleLocationDaLezione(entry, allieviIds = []) {
  const nome = String(entry?.nome || '').trim()
  if (!nome || locationRecordByName(nome)) return
  const linked = entry?.allievo || (entry?.homeLike && allieviIds.length === 1 ? allievoById(allieviIds[0]) : null)
  const address = linked ? visibleAllievoAddress(linked) : {}
  const payload = {
    nome,
    tipologia: entry?.homeLike ? 'Casa allievo' : 'Location',
    indirizzo: entry?.homeLike && linked ? (address.casa || address.indirizzo || null) : null,
    latitudine: entry?.homeLike && linked ? (address.casa_latitudine ?? null) : null,
    longitudine: entry?.homeLike && linked ? (address.casa_longitudine ?? null) : null,
    allievo_id: linked?.id || null,
    maestro_id: currentUid || null,
    condivisa: false,
    updated_at: new Date().toISOString(),
  }
  const result = await persistLocationPayload(payload)
  const error = result.ok ? null : result.error
  if (error) {
    const text = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`
    if (/locations|schema cache|does not exist|could not find/i.test(text)) {
      const local = JSON.parse(safeStorage.getItem('locationsLocal') || '[]').filter(l => !localLocationMatches(l, payload, nome))
      local.push(payload)
      safeStorage.setItem('locationsLocal', JSON.stringify(local))
      allLocations = local.map(locationWithLocalMapCoords)
      locationsLoaded = true
    }
    return
  }
  await loadLocations(true)
}

async function ensureLocationDaLezione(luogo, allieviIds = []) {
  const entries = missingLessonLocationEntries(luogo, allieviIds)
  for (const entry of entries) {
    await ensureSingleLocationDaLezione(entry, allieviIds)
  }
}

async function apriSchedaAllievoDaLezione(allievoId) {
  lezioneBackAllievoId = allievoId || null
  lezioneBackGruppoNome = null
  await loadScheda(allievoId)
  switchSchedaTab('lezioni')
}

async function tornaDaLezione() {
  if (lezioneBackAllievoId) {
    const id = lezioneBackAllievoId
    await loadScheda(id)
    switchSchedaTab('lezioni')
    return
  }
  if (lezioneBackGruppoNome) {
    showView('gruppo', lezioneBackGruppoNome)
    return
  }
  showView('lezioni')
}

function lezioneBackLabel() {
  if (lezioneBackAllievoId) return '← Scheda allievo'
  if (lezioneBackGruppoNome) return '← Scheda gruppo'
  return '← Lezioni'
}

function allieviAttivi() {
  return allAllievi.filter(a => a.stato !== 'archiviato')
}

function gruppiEsistenti() {
  return [...new Set(allieviAttivi().map(a => a.gruppo).filter(Boolean))].sort((a, b) => a.localeCompare(b))
}

function maestroLabel(id) {
  if (!id) return 'Non assegnati'
  if (id === currentUid) return 'Il mio account'
  return 'Account ' + id.slice(0, 8)
}

function allieviVisibiliGod() {
  if (!isSuperMaestro() || !godMode || godScope === 'all') return allAllievi
  if (godScope === 'mine') return allAllievi.filter(a => a.maestro_id === currentUid)
  if (godScope === 'unassigned') return allAllievi.filter(a => !a.maestro_id)
  if (godScope.startsWith('maestro:')) {
    const id = godScope.slice('maestro:'.length)
    return allAllievi.filter(a => a.maestro_id === id)
  }
  return allAllievi
}

function ordinaAllieviLista(lista) {
  return [...lista].sort((a, b) => {
    const tierDelta = allievoTierRank(a) - allievoTierRank(b)
    if (tierDelta) return tierDelta
    return String(a.nome || '').localeCompare(String(b.nome || ''), 'it', { sensitivity: 'base' })
      || String(a.cognome || '').localeCompare(String(b.cognome || ''), 'it', { sensitivity: 'base' })
      || String(a.nickname || '').localeCompare(String(b.nickname || ''), 'it', { sensitivity: 'base' })
  })
}

function jsArg(value) {
  return esc(JSON.stringify(value))
}

function scheduleGlobalSearch() {
  clearTimeout(globalSearchTimer)
  globalSearchTimer = setTimeout(renderGlobalSearch, 120)
}

function resetGlobalSearchPanelPosition(panel) {
  if (!panel) return
  panel.classList.remove('is-fixed')
  panel.style.removeProperty('left')
  panel.style.removeProperty('top')
  panel.style.removeProperty('width')
  panel.style.removeProperty('max-height')
}

function positionGlobalSearchPanel() {
  const input = document.getElementById('global-search-input')
  const panel = document.getElementById('global-search-panel')
  if (!input || !panel || panel.hidden) return
  resetGlobalSearchPanelPosition(panel)
  const margin = 8
  const inputRect = input.getBoundingClientRect()
  const viewportW = window.innerWidth || document.documentElement.clientWidth || 0
  const viewportH = window.innerHeight || document.documentElement.clientHeight || 0
  const width = Math.min(430, Math.max(220, viewportW - margin * 2))
  let left = inputRect.right - width
  left = Math.min(Math.max(margin, left), Math.max(margin, viewportW - width - margin))
  const top = Math.min(inputRect.bottom + 6, Math.max(margin, viewportH - 180))
  const maxHeight = Math.max(160, viewportH - top - margin)
  panel.classList.add('is-fixed')
  panel.style.left = `${left}px`
  panel.style.top = `${top}px`
  panel.style.width = `${width}px`
  panel.style.maxHeight = `${maxHeight}px`
}

function globalSearchTokens(value = '') {
  return normalizeText(value).split(/\s+/).filter(Boolean)
}

function globalSearchRelationshipTokens() {
  return new Set(['madre', 'mamma', 'padre', 'papa', 'genitore', 'genitori', 'tutore', 'tutori', 'nonna', 'nonno', 'zia', 'zio'])
}

function globalSearchHasRelationshipToken(tokens = []) {
  const relationshipTokens = globalSearchRelationshipTokens()
  return tokens.some(token => relationshipTokens.has(token))
}

function globalSearchIsRelationshipOnly(tokens = []) {
  const relationshipTokens = globalSearchRelationshipTokens()
  return tokens.length > 0 && tokens.every(token => relationshipTokens.has(token))
}

function globalSearchMatches(parts = [], tokens = []) {
  const haystack = normalizeText(parts.filter(value => value !== undefined && value !== null && value !== '').join(' '))
  return tokens.length > 0 && tokens.every(token => haystack.includes(token))
}

function globalSearchResultRank(result, queryText) {
  const tokens = globalSearchTokens(queryText)
  const relationshipSearch = globalSearchHasRelationshipToken(tokens)
  const typeRanks = relationshipSearch ? {
    Referente: 5,
    Allievo: 30,
    Gruppo: 40,
    Location: 50,
    'Lezione aperta': 60,
    Lezione: 70,
    Skill: 80,
  } : {
    Allievo: 10,
    Referente: 20,
    Gruppo: 30,
    Location: 40,
    'Lezione aperta': 50,
    Lezione: 60,
    Skill: 70,
  }
  const typeRank = typeRanks[result.type] || 90
  const title = normalizeText(result.title)
  const query = normalizeText(queryText)
  const titleRank = title === query ? -6 : title.startsWith(query) ? -4 : title.includes(query) ? -2 : 0
  return typeRank + titleRank
}

function addGlobalSearchResult(results, seen, result, queryText) {
  const key = result.key || `${result.type}:${result.action}:${result.title}`
  if (seen.has(key)) return
  seen.add(key)
  results.push({ ...result, rank: globalSearchResultRank(result, queryText) })
}

function allievoSearchParts(allievo = {}) {
  const p = allievo.profilo || {}
  const address = visibleAllievoAddress(allievo)
  const individuale = logisticaIndividualeProfilo(p, !!allievo.gruppo)
  const gruppo = allievo.gruppo ? profiloComuneGruppo(gruppoMembri(allievo.gruppo, { includeArchived: true })) : {}
  return [
    allievoDisplayName(allievo.id),
    allievo.nome,
    allievo.cognome,
    allievo.nickname,
    allievo.gruppo,
    allievo.email,
    allievo.telefono,
    allievo.blocco_attuale,
    allievo.livello_attuale,
    allievo.note_generali,
    p.cultura,
    p.note_salute,
    p.competenze,
    p.obiettivi,
    p.talenti,
    p.paure,
    p.sport,
    p.equipaggiamento,
    address.indirizzo,
    address.casa,
    individuale.appuntamento,
    individuale.luogo_incontro,
    gruppo.appuntamento,
    gruppo.luogo_incontro,
  ]
}

function allievoFamiliariSearchRows(allievo = {}) {
  const familiari = Array.isArray(allievo.profilo?.familiari) ? allievo.profilo.familiari : []
  return familiari
    .map((familiare, index) => ({ ...normalizzaFamiliare(familiare), index }))
    .filter(familiare => familiare.nome || familiare.cognome || familiare.relazione || familiare.telefono)
}

function locationSearchRecords() {
  const byKey = new Map()
  ;[...mappaLocationRecords(), ...allLocations.map(locationWithLocalMapCoords)].forEach(record => {
    const nome = String(record?.nome || '').trim()
    if (!nome) return
    const key = record.source === 'allievo-casa' && record.allievo_id
      ? `home:${record.allievo_id}`
      : `location:${normalizeText(nome)}`
    if (!byKey.has(key)) byKey.set(key, record)
  })
  return [...byKey.values()]
}

async function renderGlobalSearch() {
  const input = document.getElementById('global-search-input')
  const panel = document.getElementById('global-search-panel')
  if (!input || !panel) return
  const queryText = input.value || ''
  const tokens = globalSearchTokens(queryText)
  if (!tokens.length) {
    panel.hidden = true
    panel.innerHTML = ''
    return
  }
  if (!lezioniCache) await loadLezioni(true)
  await loadLocations()
  const results = []
  const seen = new Set()
  const relationshipOnly = globalSearchIsRelationshipOnly(tokens)
  allieviVisibiliGod().forEach(a => {
    const name = allievoDisplayName(a.id)
    const address = visibleAllievoAddress(a)
    if (!relationshipOnly && globalSearchMatches(allievoSearchParts(a), tokens)) {
      const detail = [a.gruppo, a.nickname ? `Nick ${a.nickname}` : '', a.telefono, address.indirizzo || address.casa].filter(Boolean).join(' · ')
      addGlobalSearchResult(results, seen, { type: 'Allievo', title: name, detail, action: `loadScheda(${jsArg(a.id)})`, key: `allievo:${a.id}` }, queryText)
    }
    allievoFamiliariSearchRows(a).forEach(familiare => {
      const familiareName = [familiare.nome, familiare.cognome].filter(Boolean).join(' ') || familiare.telefono || 'Referente'
      const parts = [familiareName, familiare.nome, familiare.cognome, familiare.relazione, familiare.telefono, name, a.nome, a.cognome, a.nickname, a.gruppo]
      if (!globalSearchMatches(parts, tokens)) return
      const detail = [`${familiare.relazione || 'Referente'} di ${name}`, familiare.telefono].filter(Boolean).join(' · ')
      addGlobalSearchResult(results, seen, { type: 'Referente', title: familiareName, detail, action: `loadScheda(${jsArg(a.id)})`, key: `referente:${a.id}:${familiare.index}` }, queryText)
    })
  })
  if (relationshipOnly) {
    const limited = results.sort((a, b) => a.rank - b.rank || String(a.title || '').localeCompare(String(b.title || ''), 'it', { sensitivity: 'base' })).slice(0, 18)
    panel.innerHTML = limited.length
      ? limited.map(r => `<button type="button" class="search-result" onclick="closeGlobalSearch(); ${r.action}"><strong><span class="search-result-type">${esc(r.type)}</span>${esc(r.title)}</strong><span>${r.detail ? esc(r.detail) : ''}</span></button>`).join('')
      : '<div class="place-suggest-empty">Nessun referente trovato.</div>'
    panel.hidden = false
    requestAnimationFrame(positionGlobalSearchPanel)
    return
  }
  gruppiEsistenti().forEach(gruppo => {
    const membri = gruppoMembri(gruppo)
    const profilo = profiloComuneGruppo(membri)
    const parts = [
      gruppo,
      profilo.appuntamento,
      profilo.luogo_incontro,
      profilo.pagamento_metodo,
      profilo.pagamento_stato,
      ...membri.flatMap(a => [allievoDisplayName(a.id), a.nome, a.cognome, a.nickname]),
    ]
    if (!globalSearchMatches(parts, tokens)) return
    const detail = [`${membri.length} allievi`, profilo.luogo_incontro, profilo.appuntamento].filter(Boolean).join(' · ')
    addGlobalSearchResult(results, seen, { type: 'Gruppo', title: gruppo, detail, action: `showView('gruppo',${jsArg(gruppo)})`, key: `gruppo:${gruppo}` }, queryText)
  })
  allSkills.forEach(skill => {
    const parts = [skill.nome, skill.ramo, skill.blocco, skill.descrizione]
    if (globalSearchMatches(parts, tokens)) addGlobalSearchResult(results, seen, { type: 'Skill', title: skill.nome, detail: skillMetaLabel(skill), action: `openSkillDetailModal(${jsArg(skill.id)})`, key: `skill:${skill.id}` }, queryText)
  })
  locationSearchRecords().forEach(record => {
    const nome = String(record.nome || '').trim()
    const linkedAllievo = record.allievo_id ? allAllievi.find(a => String(a.id) === String(record.allievo_id)) : null
    const parts = [
      nome,
      normalizedLocationName(nome),
      record.indirizzo,
      record.tipologia,
      record.tipo,
      record.note,
      ...(record.tags || []),
      linkedAllievo ? allievoDisplayName(linkedAllievo.id) : '',
    ]
    if (!globalSearchMatches(parts, tokens)) return
    const detail = [locationTipologia(record), record.indirizzo, record.lessonCount ? `${record.lessonCount} lezioni` : '', linkedAllievo ? allievoDisplayName(linkedAllievo.id) : ''].filter(Boolean).join(' · ')
    addGlobalSearchResult(results, seen, { type: 'Location', title: nome, detail, action: `showView('mappa',${jsArg(nome)})`, key: `location:${record.source || ''}:${record.allievo_id || normalizeText(nome)}` }, queryText)
  })
  ;(lezioniCache || []).forEach(l => {
    const parsed = lessonParsedNotes(l)
    const parts = [formatLessonDate(l), labelPartecipantiLezione(l), l.luogo, parsed.ora, parsed.meteo, lessonSpecialNotes(l), parsed.bene, parsed.nonFatto, parsed.note]
    if (!globalSearchMatches(parts, tokens)) return
    addGlobalSearchResult(results, seen, { type: lessonStatus(l) === 'aperta' ? 'Lezione aperta' : 'Lezione', title: `${formatLessonDate(l)} · ${labelPartecipantiLezione(l)}`, detail: l.luogo || parsed.note || '', action: `openLezione(${jsArg(l.id)})`, key: `lezione:${l.id}` }, queryText)
  })

  const limited = results.sort((a, b) => a.rank - b.rank || String(a.title || '').localeCompare(String(b.title || ''), 'it', { sensitivity: 'base' })).slice(0, 18)
  panel.innerHTML = limited.length
    ? limited.map(r => `<button type="button" class="search-result" onclick="closeGlobalSearch(); ${r.action}"><strong><span class="search-result-type">${esc(r.type)}</span>${esc(r.title)}</strong><span>${r.detail ? esc(r.detail) : ''}</span></button>`).join('')
    : '<div class="place-suggest-empty">Nessun risultato.</div>'
  panel.hidden = false
  requestAnimationFrame(positionGlobalSearchPanel)
}

function closeGlobalSearch() {
  const panel = document.getElementById('global-search-panel')
  if (panel) {
    panel.hidden = true
    resetGlobalSearchPanelPosition(panel)
  }
}

function resetActionPanelPosition(panel) {
  if (!panel) return
  panel.classList.remove('is-fixed')
  panel.style.removeProperty('left')
  panel.style.removeProperty('top')
  panel.style.removeProperty('width')
  panel.style.removeProperty('max-height')
}

function positionInlineActionPanel(panel) {
  if (!panel || panel.hidden) return
  resetActionPanelPosition(panel)
  const margin = 8
  const menu = panel.closest('.inline-action-menu')
  const trigger = menu?.querySelector('button')
  const viewportW = window.innerWidth || document.documentElement.clientWidth || 0
  const viewportH = window.innerHeight || document.documentElement.clientHeight || 0
  if (!trigger || !viewportW || !viewportH) return
  const triggerRect = trigger.getBoundingClientRect()
  const measured = panel.getBoundingClientRect()
  const constrainedWidth = Math.min(Math.max(measured.width, 170), Math.max(170, viewportW - margin * 2))
  const naturalHeight = Math.min(measured.height, Math.max(140, viewportH - margin * 2))
  const spaceBelow = viewportH - triggerRect.bottom - margin
  const spaceAbove = triggerRect.top - margin
  const openUp = spaceBelow < naturalHeight && spaceAbove > spaceBelow
  const constrainedHeight = Math.min(naturalHeight, Math.max(80, openUp ? spaceAbove : spaceBelow))

  let left = Math.min(Math.max(margin, triggerRect.right - constrainedWidth), viewportW - constrainedWidth - margin)
  if (!Number.isFinite(left)) left = margin
  let top = openUp ? triggerRect.top - constrainedHeight - 6 : triggerRect.bottom + 6
  top = Math.min(Math.max(margin, top), Math.max(margin, viewportH - constrainedHeight - margin))

  panel.classList.add('is-fixed')
  panel.style.left = `${left}px`
  panel.style.top = `${top}px`
  panel.style.width = `${constrainedWidth}px`
  panel.style.maxHeight = `${constrainedHeight}px`

  const placed = panel.getBoundingClientRect()
  const dx = left - placed.left
  const dy = top - placed.top
  if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
    panel.style.left = `${left + dx}px`
    panel.style.top = `${top + dy}px`
  }
}

function closeActionMenus() {
  document.querySelectorAll('.inline-action-panel').forEach(panel => {
    panel.hidden = true
    resetActionPanelPosition(panel)
  })
  document.querySelectorAll('.inline-action-menu.action-menu-open, .card.action-menu-open').forEach(el => el.classList.remove('action-menu-open'))
}

function toggleActionMenu(id, event) {
  event?.stopPropagation()
  const panel = document.getElementById(id)
  const shouldOpen = !!panel?.hidden
  closeActionMenus()
  if (!panel || !shouldOpen) return
  panel.hidden = false
  panel.closest('.inline-action-menu')?.classList.add('action-menu-open')
  panel.closest('.card')?.classList.add('action-menu-open')
  requestAnimationFrame(() => positionInlineActionPanel(panel))
}

window.addEventListener('resize', () => {
  closeActionMenus()
  positionGlobalSearchPanel()
})
window.addEventListener('scroll', positionGlobalSearchPanel, { passive: true })

document.addEventListener('click', () => {
  closeActionMenus()
  closeGlobalSearch()
})

function formatDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return formatDate(String(value).slice(0, 10))
  return d.toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })
}

function allievoUpdatedAt(allievo) {
  return allievo?.aggiornato_il || allievo?.updated_at || allievo?.modified_at || allievo?.creato_il || ''
}

function modificaKey() {
  return 'bladingManagerModifiche'
}

function logModificaLocale(tipo, id, descrizione) {
  if (!id) return
  let rows = []
  try { rows = JSON.parse(safeStorage.getItem(modificaKey()) || '[]') || [] } catch { rows = [] }
  rows.unshift({ tipo, id, descrizione, quando: new Date().toISOString(), utente: currentEmail || '' })
  safeStorage.setItem(modificaKey(), JSON.stringify(rows.slice(0, 200)))
  sb?.from?.('modifiche_storico')?.insert?.({ tipo, entity_id: String(id), descrizione, maestro_id: currentUid || null }).then(({ error }) => {
    if (error && !/modifiche_storico|schema cache|does not exist|could not find/i.test(error.message || error.details || error.hint || '')) console.warn('Storico modifica non salvato nel DB', error)
  })
}

function modificheLocali(tipo, id) {
  try {
    return (JSON.parse(safeStorage.getItem(modificaKey()) || '[]') || [])
      .filter(row => row.tipo === tipo && String(row.id) === String(id))
  } catch {
    return []
  }
}

function valueForHistory(value) {
  if (value === null || value === undefined || value === '') return ''
  if (Array.isArray(value)) return JSON.stringify(value)
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function historyChangedFields(previous = {}, next = {}, labels = {}) {
  return Object.entries(labels).flatMap(([key, label]) => {
    return valueForHistory(previous?.[key]) === valueForHistory(next?.[key]) ? [] : [label]
  })
}

function historyDescription(base, changes = [], fallback = 'dettagli') {
  return changes.length ? `${base}: ${changes.join(', ')}` : `${base}: ${fallback}`
}

function openHistoryModal(tipo, id, title = 'Storico modifiche') {
  const rows = modificheLocali(tipo, id)
  const existing = document.getElementById('modal-history')
  if (existing) existing.remove()
  const overlay = document.createElement('div')
  overlay.id = 'modal-history'
  overlay.className = 'overlay'
  overlay.onclick = event => { if (event.target === overlay) overlay.remove() }
  overlay.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <h3>${esc(title)}</h3>
      <div style="display:grid;gap:.45rem">
        ${rows.length ? rows.map(row => `<div class="skill-detail-item"><strong>${esc(row.descrizione || 'Modifica')}</strong><span>${esc(formatDateTime(row.quando))}${row.utente ? ` · ${esc(row.utente)}` : ''}</span></div>`).join('') : '<div class="empty">Nessuna modifica registrata in locale.</div>'}
      </div>
      <div class="modal-footer"><button class="btn btn-outline" onclick="var modal=document.getElementById('modal-history'); if(modal) modal.remove()">Chiudi</button></div>
    </div>`
  document.body.appendChild(overlay)
}

function setLezioneFormMessage(message = '', className = 'msg-err') {
  const errEl = document.getElementById('lz-err')
  if (!errEl) return
  errEl.classList.remove('msg-err', 'msg-info', 'msg-ok', 'show')
  errEl.classList.add(className)
  errEl.textContent = message
  if (message) errEl.classList.add('show')
}

function clearLezioneFormMessage() {
  setLezioneFormMessage('')
}

function setLessonStatus(status) {
  const value = status === 'chiusa' ? 'chiusa' : 'aperta'
  const input = document.getElementById('lz-stato')
  if (input) input.value = value
  document.getElementById('lz-status-open')?.classList.toggle('is-on', value === 'aperta')
  document.getElementById('lz-status-done')?.classList.toggle('is-on', value === 'chiusa')
  syncLessonFeedbackVisibility()
  syncGroupStudentFeedbackVisibility()
}

function lessonStatus(lezione) {
  const explicit = String(lezione?.stato || lezione?.status || splitLessonNotes(lezione?.note || '').stato || '').toLowerCase()
  if (explicit === 'aperta') return 'aperta'
  return 'chiusa'
}

const LESSON_CHECK_MARKERS = {
  stato: '[[stato]]',
  ora: '[[ora]]',
  meteo: '[[meteo]]',
  speciali: '[[note_speciali]]',
  bene: '[[check_bene]]',
  nonFatto: '[[check_non_fatto]]',
  note: '[[note]]',
}

function splitLessonNotes(raw = '') {
  const text = String(raw || '')
  const hasMarkers = Object.values(LESSON_CHECK_MARKERS).some(marker => text.includes(marker))
  if (!hasMarkers) return { bene: '', nonFatto: '', note: text }
  const markerEntries = Object.entries(LESSON_CHECK_MARKERS)
  const read = key => {
    const start = LESSON_CHECK_MARKERS[key]
    const from = text.indexOf(start)
    if (from < 0) return ''
    const after = from + start.length
    const nextMarkerIndex = markerEntries
      .filter(([nextKey]) => nextKey !== key)
      .map(([, marker]) => text.indexOf(marker, after))
      .filter(index => index >= 0)
      .sort((a, b) => a - b)[0]
    return text.slice(after, nextMarkerIndex ?? text.length).trim()
  }
  return {
    stato: read('stato'),
    ora: read('ora'),
    meteo: read('meteo'),
    speciali: read('speciali'),
    bene: read('bene'),
    nonFatto: read('nonFatto'),
    note: read('note'),
  }
}

function composeLessonNotes(note, bene, nonFatto, speciali = '', stato = '', meteo = '', ora = '') {
  if (!bene && !nonFatto && !speciali && !stato && !meteo && !ora) return note || null
  return [
    LESSON_CHECK_MARKERS.stato,
    stato || '',
    LESSON_CHECK_MARKERS.ora,
    normalizeLessonTime(ora) || '',
    LESSON_CHECK_MARKERS.meteo,
    meteo || '',
    LESSON_CHECK_MARKERS.speciali,
    speciali || '',
    LESSON_CHECK_MARKERS.bene,
    bene || '',
    LESSON_CHECK_MARKERS.nonFatto,
    nonFatto || '',
    LESSON_CHECK_MARKERS.note,
    note || '',
  ].join('\n').trim()
}

function renderLessonCheckBlocks(lezione) {
  const parsed = lessonParsedNotes(lezione)
  return [
    parsed.bene ? `<p class="sec-title">Cosa e andato bene</p><div class="card"><div class="lezione-read-note">${esc(parsed.bene)}</div></div>` : '',
    parsed.nonFatto ? `<p class="sec-title">Non fatto / da riprendere</p><div class="card"><div class="lezione-read-note">${esc(parsed.nonFatto)}</div></div>` : '',
  ].join('')
}

function lessonParsedNotes(lezione) {
  const parsed = splitLessonNotes(lezione?.note || '')
  return {
    ...parsed,
    ora: normalizeLessonTime(lezione?.orario || lezione?.ora || lezione?.time || parsed.ora || ''),
    meteo: lezione?.meteo || parsed.meteo || '',
    bene: lezione?.check_bene || parsed.bene || '',
    nonFatto: lezione?.check_non_fatto || parsed.nonFatto || '',
  }
}

function normalizeLessonTime(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const match = raw.match(/^(\d{1,2})[:.](\d{2})(?::\d{2})?$/) || raw.match(/^(\d{1,2})(\d{2})$/)
  if (!match) return ''
  const h = Number(match[1])
  const m = Number(match[2])
  if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h > 23 || m < 0 || m > 59) return ''
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function lessonTime(lezione = {}) {
  return lessonParsedNotes(lezione).ora || ''
}

function formatLessonDate(lezione = {}) {
  const date = formatDate(lezione.data)
  const ora = lessonTime(lezione)
  return ora ? `${date} · ${ora}` : date
}

function formatLessonDateWithWeekday(lezione = {}) {
  const date = formatDateWithWeekday(lezione.data)
  const ora = lessonTime(lezione)
  return ora ? `${date} · ${ora}` : date
}

function lessonSortToken(lezione = {}) {
  const day = String(lezione.data || '').slice(0, 10) || '0000-00-00'
  return `${day}T${lessonTime(lezione) || '00:00'}`
}

function lessonSpecialNotes(lezione) {
  const parsed = lessonParsedNotes(lezione)
  return lezione?.note_speciali || parsed.speciali || lezione?.nota_speciale || lezione?.nota || ''
}

function normalizeHexCode(value) {
  const raw = String(value || '').trim()
  const match = raw.match(/^#?([0-9a-f]{6})$/i)
  return match ? `#${match[1].toUpperCase()}` : ''
}

function hexToRgb(hex) {
  const normalized = normalizeHexCode(hex)
  if (!normalized) return null
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  }
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map(value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

function darkerHex(hex, factor = 0.72) {
  const rgb = hexToRgb(hex)
  return rgb ? rgbToHex({ r: rgb.r * factor, g: rgb.g * factor, b: rgb.b * factor }) : DEFAULT_PRIMARY_DARK
}

function primaryColorLightValue(hex) {
  const rgb = hexToRgb(hex) || hexToRgb(DEFAULT_PRIMARY_COLOR)
  return `rgba(${rgb.r},${rgb.g},${rgb.b},.13)`
}

function readThemeColorPresets() {
  const raw = safeStorage.getItem(THEME_PRIMARY_COLOR_PRESETS_KEY)
  if (raw === null) {
    const seeded = [{ name: 'Aymara', hex: '#4FD8EB' }]
    safeStorage.setItem(THEME_PRIMARY_COLOR_PRESETS_KEY, JSON.stringify(seeded))
    return seeded
  }
  try {
    return (JSON.parse(raw || '[]') || [])
      .map(row => ({ name: String(row.name || '').trim(), hex: normalizeHexCode(row.hex) }))
      .filter(row => row.name && row.hex)
  } catch {
    return []
  }
}

function writeThemeColorPresets(rows = []) {
  safeStorage.setItem(THEME_PRIMARY_COLOR_PRESETS_KEY, JSON.stringify(rows))
}

function activePrimaryColorHex() {
  return normalizeHexCode(safeStorage.getItem(THEME_PRIMARY_COLOR_KEY)) || DEFAULT_PRIMARY_COLOR
}

function applyPrimaryColor(hex = activePrimaryColorHex()) {
  const normalized = normalizeHexCode(hex) || DEFAULT_PRIMARY_COLOR
  const rgb = hexToRgb(normalized) || hexToRgb(DEFAULT_PRIMARY_COLOR)
  const root = document.documentElement
  root.style.setProperty('--blu', normalized)
  root.style.setProperty('--blu-rgb', `${rgb.r},${rgb.g},${rgb.b}`)
  root.style.setProperty('--blu-scuro', normalized === DEFAULT_PRIMARY_COLOR ? DEFAULT_PRIMARY_DARK : darkerHex(normalized))
  root.style.setProperty('--blu-chiaro', primaryColorLightValue(normalized))
}

function applyPrimaryColorFromStorage() {
  applyPrimaryColor(activePrimaryColorHex())
}

function setThemeColorStatus(text = '', cls = 'msg-ok') {
  const status = document.getElementById('theme-color-status')
  if (!status) return
  status.className = `msg ${cls}${text ? ' show' : ''}`
  status.textContent = text
}

function renderThemeColorPanel() {
  const tbody = document.getElementById('theme-color-table-body')
  if (!tbody) return
  const active = activePrimaryColorHex()
  const savedPresets = readThemeColorPresets()
  const presets = [
    { name: 'Default', hex: DEFAULT_PRIMARY_COLOR, isDefault: true },
    ...savedPresets,
  ]
  tbody.innerHTML = presets.length ? presets.map((row, index) => {
    const savedIndex = index - 1
    return `
    <tr>
      <td><strong>${esc(row.name)}</strong>${row.hex === active ? '<span class="theme-color-active">attivo</span>' : ''}</td>
      <td>${esc(row.hex)}</td>
      <td><span class="theme-color-swatch" style="background:${esc(row.hex)}"></span></td>
      <td>
        <div class="theme-color-actions">
          <button type="button" class="btn btn-outline btn-xs theme-color-icon-btn" title="Usa colore" aria-label="Usa colore" onclick="${row.isDefault ? 'restoreDefaultPrimaryColor()' : `applyThemeColorPreset(${jsArg(row.hex)})`}">✓</button>
          ${row.isDefault ? '' : `
            <button type="button" class="btn btn-ghost btn-xs theme-color-icon-btn" title="Modifica" aria-label="Modifica" onclick="editThemeColorPreset(${jsArg(row.name)})">${editIcon()}</button>
            <button type="button" class="btn btn-ghost btn-xs theme-color-icon-btn" title="Sposta su" aria-label="Sposta su" onclick="moveThemeColorPreset(${jsArg(row.name)}, -1)" ${savedIndex <= 0 ? 'disabled' : ''}>↑</button>
            <button type="button" class="btn btn-ghost btn-xs theme-color-icon-btn" title="Sposta giù" aria-label="Sposta giù" onclick="moveThemeColorPreset(${jsArg(row.name)}, 1)" ${savedIndex >= savedPresets.length - 1 ? 'disabled' : ''}>↓</button>
            <button type="button" class="btn btn-ghost btn-xs theme-color-icon-btn" title="Cancella" aria-label="Cancella" onclick="deleteThemeColorPreset(${jsArg(row.name)})">×</button>
          `}
        </div>
      </td>
    </tr>`
  }).join('') : '<tr><td colspan="4" style="color:var(--muted)">Nessun colore salvato.</td></tr>'
  const nameInput = document.getElementById('theme-color-name')
  const hexInput = document.getElementById('theme-color-hex')
  if (nameInput && !nameInput.value) nameInput.value = ''
  if (hexInput && !hexInput.value) hexInput.value = active === DEFAULT_PRIMARY_COLOR ? '' : active
}

function previewThemeColorHex(value) {
  const hex = normalizeHexCode(value)
  if (!hex) return
  applyPrimaryColor(hex)
  setThemeColorStatus('Anteprima colore applicata. Salva per conservarla.', 'msg-info')
}

function applyThemeColorPreset(hex) {
  const normalized = normalizeHexCode(hex)
  if (!normalized) return
  safeStorage.setItem(THEME_PRIMARY_COLOR_KEY, normalized)
  applyPrimaryColor(normalized)
  renderThemeColorPanel()
  setThemeColorStatus(`Colore primario applicato: ${normalized}`, 'msg-ok')
}

function restoreDefaultPrimaryColor() {
  safeStorage.removeItem(THEME_PRIMARY_COLOR_KEY)
  applyPrimaryColor(DEFAULT_PRIMARY_COLOR)
  const nameInput = document.getElementById('theme-color-name')
  const hexInput = document.getElementById('theme-color-hex')
  if (nameInput) nameInput.value = ''
  if (hexInput) hexInput.value = ''
  editingThemeColorName = null
  renderThemeColorPanel()
  setThemeColorStatus('Colore primario ripristinato al default.', 'msg-ok')
}

function saveThemeColorPreset() {
  const nameInput = document.getElementById('theme-color-name')
  const hexInput = document.getElementById('theme-color-hex')
  const name = String(nameInput?.value || '').trim()
  const hex = normalizeHexCode(hexInput?.value)
  if (!name) {
    setThemeColorStatus('Dai un nome al colore.', 'msg-err')
    return
  }
  if (!hex) {
    setThemeColorStatus('Inserisci un hex code valido, es. #4FD8EB.', 'msg-err')
    return
  }
  const presets = readThemeColorPresets()
  const editingKey = normalizeText(editingThemeColorName)
  const existingIndex = editingKey
    ? presets.findIndex(row => normalizeText(row.name) === editingKey)
    : presets.findIndex(row => normalizeText(row.name) === normalizeText(name))
  const duplicateIndex = presets.findIndex(row => normalizeText(row.name) === normalizeText(name))
  if (editingKey && duplicateIndex >= 0 && duplicateIndex !== existingIndex) {
    setThemeColorStatus(`Esiste già un colore chiamato "${name}".`, 'msg-err')
    return
  }
  const next = { name, hex }
  if (existingIndex >= 0) presets[existingIndex] = next
  else presets.push(next)
  writeThemeColorPresets(presets)
  safeStorage.setItem(THEME_PRIMARY_COLOR_KEY, hex)
  applyPrimaryColor(hex)
  if (nameInput) nameInput.value = ''
  editingThemeColorName = null
  renderThemeColorPanel()
  setThemeColorStatus(`Colore "${name}" salvato e applicato.`, 'msg-ok')
}

function editThemeColorPreset(name) {
  const target = normalizeText(name)
  const found = readThemeColorPresets().find(row => normalizeText(row.name) === target)
  if (!found) return
  const nameInput = document.getElementById('theme-color-name')
  const hexInput = document.getElementById('theme-color-hex')
  if (nameInput) nameInput.value = found.name
  if (hexInput) hexInput.value = found.hex
  editingThemeColorName = found.name
  setThemeColorStatus(`Modifica "${found.name}" e premi Salva colore.`, 'msg-info')
}

function moveThemeColorPreset(name, direction = 0) {
  const presets = readThemeColorPresets()
  const from = presets.findIndex(row => normalizeText(row.name) === normalizeText(name))
  const to = from + Number(direction)
  if (from < 0 || to < 0 || to >= presets.length) return
  const [row] = presets.splice(from, 1)
  presets.splice(to, 0, row)
  writeThemeColorPresets(presets)
  renderThemeColorPanel()
}

function deleteThemeColorPreset(name) {
  const presets = readThemeColorPresets()
  const target = normalizeText(name)
  const found = presets.find(row => normalizeText(row.name) === target)
  if (!found) return
  const active = activePrimaryColorHex()
  writeThemeColorPresets(presets.filter(row => normalizeText(row.name) !== target))
  if (found.hex === active) {
    safeStorage.removeItem(THEME_PRIMARY_COLOR_KEY)
    applyPrimaryColor(DEFAULT_PRIMARY_COLOR)
  }
  if (normalizeText(editingThemeColorName) === target) editingThemeColorName = null
  renderThemeColorPanel()
  setThemeColorStatus(`Colore "${found.name}" cancellato.`, 'msg-ok')
}

function renderGodPanel() {
  const panel = document.getElementById('god-panel')
  const toggle = document.getElementById('god-toggle')
  const sel = document.getElementById('god-account-select')
  const canUseGodMode = isSuperMaestro()
  if (toggle) toggle.hidden = !canUseGodMode
  if (!canUseGodMode) {
    godMode = false
    godScope = 'all'
  }
  syncGodOnlyNav()
  panel.classList.toggle('show', godMode)
  toggle.classList.toggle('on', godMode)
  if (!godMode || !sel) return

  const ids = [...new Set(allAllievi.map(a => a.maestro_id).filter(Boolean))].sort()
  sel.innerHTML = `
    <option value="all">Tutti leggibili (${allAllievi.length})</option>
    <option value="mine">Il mio account (${allAllievi.filter(a => a.maestro_id === currentUid).length})</option>
    <option value="unassigned">Non assegnati (${allAllievi.filter(a => !a.maestro_id).length})</option>
    ${ids.filter(id => id !== currentUid).map(id => `<option value="maestro:${id}">${maestroLabel(id)} (${allAllievi.filter(a => a.maestro_id === id).length})</option>`).join('')}`
  sel.value = [...sel.options].some(o => o.value === godScope) ? godScope : 'all'
  godScope = sel.value
}

function syncGodOnlyNav() {
  document.querySelectorAll('.god-only-nav').forEach(el => { el.hidden = true })
}

function toggleGodMode() {
  if (!isSuperMaestro()) return
  godMode = !godMode
  if (!godMode) godScope = 'all'
  renderGodPanel()
  if (!godMode && ['tuning', 'theme-colors', 'app-notes'].includes(visibleViewName())) showView('allievi')
  renderAllievi()
  if (!document.getElementById('view-lezioni').hidden) loadLezioni()
}

function isMissingAppNotesTableError(error) {
  const text = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''} ${error?.code || ''}`
  return /app_notes|schema cache|could not find|does not exist|PGRST205|42P01/i.test(text)
}

function appNotesMissingTableMessage() {
  return 'Note salvate solo su questo dispositivo: manca la tabella online app_notes in Supabase.'
}

async function initAppNotes() {
  const textarea = document.getElementById('app-notes-text')
  const status = document.getElementById('app-notes-status')
  if (!textarea) return
  const localValue = safeStorage.getItem(APP_NOTES_KEY) || ''
  textarea.value = localValue
  if (status) {
    status.className = 'msg'
    status.textContent = ''
  }
  if (!sb) return
  setAppNotesStatus('Carico note online...', 'msg-info')
  const { data, error } = await sb
    .from('app_notes')
    .select('content, updated_at, updated_by')
    .eq('key', APP_NOTES_REMOTE_KEY)
    .maybeSingle()

  if (error) {
    appNotesRemoteAvailable = false
    if (isMissingAppNotesTableError(error)) {
      setAppNotesStatus(appNotesMissingTableMessage(), 'msg-info')
    } else {
      setAppNotesStatus(`Note locali caricate. Errore lettura online: ${error.message || 'sconosciuto'}`, 'msg-err')
    }
    return
  }

  appNotesRemoteAvailable = true
  if (data?.content !== undefined && data?.content !== null) {
    textarea.value = data.content
    safeStorage.setItem(APP_NOTES_KEY, data.content)
    const updated = data.updated_at ? ` Ultima modifica: ${formatDateTime(data.updated_at)}` : ''
    setAppNotesStatus(`Note online caricate.${updated}`, 'msg-ok')
  } else if (localValue) {
    setAppNotesStatus('Nessuna nota online: resta pronta la copia locale. Premi Salva note per pubblicarla.', 'msg-info')
  } else {
    setAppNotesStatus('', 'msg-ok')
  }
}

function setAppNotesStatus(text, cls = 'msg-ok') {
  const status = document.getElementById('app-notes-status')
  if (!status) return
  status.className = `msg ${cls}${text ? ' show' : ''}`
  status.textContent = text
}

async function saveAppNotes() {
  const textarea = document.getElementById('app-notes-text')
  if (!textarea) return
  const content = textarea.value || ''
  safeStorage.setItem(APP_NOTES_KEY, content)
  if (!sb) {
    setAppNotesStatus('Note salvate localmente. Supabase non disponibile.', 'msg-info')
    return
  }

  setAppNotesStatus('Salvataggio note online...', 'msg-info')
  const updatedAt = new Date().toISOString()
  const payload = {
    key: APP_NOTES_REMOTE_KEY,
    content,
    updated_by: currentUid || null,
    updated_at: updatedAt,
  }
  const { error } = await sb
    .from('app_notes')
    .upsert(payload, { onConflict: 'key' })

  if (error) {
    appNotesRemoteAvailable = false
    if (isMissingAppNotesTableError(error)) {
      setAppNotesStatus(appNotesMissingTableMessage(), 'msg-info')
    } else {
      setAppNotesStatus(`Note salvate localmente. Errore online: ${error.message || 'sconosciuto'}`, 'msg-err')
    }
    return
  }

  appNotesRemoteAvailable = true
  setAppNotesStatus(`Note salvate online. Ultima modifica: ${formatDateTime(updatedAt)}`, 'msg-ok')
}

function scheduleAppNotesSave() {
  clearTimeout(appNotesTimer)
  appNotesTimer = setTimeout(saveAppNotes, 450)
}

function setGodScope(scope) {
  godScope = scope
  renderAllievi()
  if (!document.getElementById('view-lezioni').hidden) loadLezioni()
}

// ── Allievi ───────────────────────────────────────────────────────────

function renderAllievi() {
  const el = document.getElementById('allievi-content')
  el.dataset.mobileCards = 'true'
  renderDashboard()
  const listaVisibile = allieviVisibiliGod()
  const gruppiCorrenti = allieviGroupNamesForCurrentMode(listaVisibile)
  const mostraToggleGruppi = gruppiCorrenti.length > 0 && filtroListaAllievi !== 'tutti'
  const tuttiGruppiEspansi = mostraToggleGruppi && gruppiCorrenti.every(g => gruppiEspansi.has(g))
  const chipsHtml = `
    <div class="allievi-filter-bar">
      <button type="button" onclick="setAllieviListMode('attivi')" class="chip${filtroListaAllievi === 'attivi' ? ' chip-on' : ''}">Attivi</button>
      <button type="button" onclick="setAllieviListMode('tutti')" class="chip${filtroListaAllievi === 'tutti' ? ' chip-on' : ''}">Tutti gli allievi</button>
      <button type="button" onclick="setAllieviListMode('gruppi')" class="chip${filtroListaAllievi === 'gruppi' ? ' chip-on' : ''}">Gruppi</button>
      <div class="allievi-filter-secondary">
        <button type="button" onclick="setAllieviListMode('vacanza')" class="chip${filtroListaAllievi === 'vacanza' ? ' chip-on' : ''}" title="Mostra solo chi e in vacanza">🏖 In vacanza</button>
        <button type="button" onclick="setAllieviListMode('archivio')" class="chip${filtroListaAllievi === 'archivio' ? ' chip-on' : ''}">Archivio</button>
        ${mostraToggleGruppi ? `<button type="button" onclick="toggleTuttiGruppi()" class="chip" title="${tuttiGruppiEspansi ? 'Raggruppa tutti i gruppi' : 'Espandi tutti i gruppi'}">${tuttiGruppiEspansi ? '▴ Raggruppa' : '▾ Espandi'}</button>` : ''}
      </div>
    </div>`

  const allieviColgroup = `
    <colgroup>
      <col style="width:46px">
      <col style="width:28%">
      <col style="width:16%">
      <col style="width:76px">
      <col style="width:13%">
      <col style="width:72px">
      <col>
      <col style="width:118px">
    </colgroup>`
  const allievoBadgesHtml = (a, { mobile = false } = {}) => {
    const margin = mobile ? '' : 'margin-left:4px;'
    const vacationColor = mobile ? '#fbbf24' : '#b45309'
    return `
      ${a.tipo === 'associazione' ? `<span style="font-size:.7rem;font-weight:700;background:var(--blu-chiaro);color:var(--blu);padding:1px 5px;border-radius:10px;${margin}">ass.</span>` : ''}
      ${a.stato === 'archiviato' ? `<span style="font-size:.7rem;font-weight:700;background:rgba(148,163,184,.14);color:var(--muted);padding:1px 5px;border-radius:10px;${margin}">arch.</span>` : ''}
      ${allievoInVacanza(a) ? `<span style="font-size:.7rem;font-weight:700;background:rgba(245,158,11,.13);color:${vacationColor};padding:1px 5px;border-radius:10px;${margin}">vacanza</span>` : ''}`
  }

  const renderAllievoRow = (a, extraClass = '') => `
    <tr class="${extraClass}" onclick="loadScheda('${a.id}')" style="${a.stato === 'archiviato' ? 'opacity:.55' : ''};cursor:pointer">
      <td style="width:42px;text-align:center;white-space:nowrap">${allievoTier(a) === 'VIP' ? '<span class="vip-star">★</span>' : ''}${vacationIconHtml(allievoInVacanza(a))}</td>
      <td>
        <strong>${esc(a.nome)}</strong>
        ${allievoBadgesHtml(a)}
      </td>
      <td>${a.tipo === 'associazione' ? '' : esc(a.cognome)}</td>
      <td style="color:var(--muted);font-size:.84rem;white-space:nowrap">${esc(allievoEtaLabel(a.data_nascita) || '')}</td>
      <td style="color:var(--muted);font-size:.85rem">${a.nickname ? esc(a.nickname) : ''}</td>
      <td><span class="chip" title="Tier ${esc(allievoTier(a))}">${esc(allievoTierListLabel(a))}</span></td>
      <td>${esc(a.blocco_attuale)}</td>
      <td style="width:40px;text-align:center">
        <div style="display:flex;justify-content:flex-end;gap:.25rem;flex-wrap:wrap">
          ${renderAllievoActionMenu(a, `allievo-list-actions-${a.id}`)}
        </div>
      </td>
    </tr>`

  const renderAllievoCard = (a, actionSuffix = '') => {
    const fullName = [a.nome, a.tipo === 'associazione' ? '' : a.cognome].filter(Boolean).join(' ')
    const actionId = `allievo-list-mobile-actions-${a.id}${actionSuffix ? `-${actionSuffix}` : ''}`
    const age = String(allievoEtaLabel(a.data_nascita) || '').replace(/\s*anni?$/i, 'y')
    return `
      <article class="allievi-mobile-card${a.stato === 'archiviato' ? ' is-archived' : ''}">
        <div class="allievi-mobile-card-head">
          <a class="allievi-mobile-card-open" href="#scheda:${esc(a.id)}" onclick="event.preventDefault(); loadScheda('${a.id}')">
            <div class="allievi-mobile-card-title">
              ${allievoTier(a) === 'VIP' ? '<span class="vip-star" aria-label="VIP">★</span>' : ''}
              <strong>${esc(fullName)}</strong>
            </div>
            <div class="allievi-mobile-meta">
              ${age ? `<span>${esc(age)}</span>` : ''}
              <span>Tier ${esc(allievoTierListLabel(a))}</span>
            </div>
          </a>
          ${renderAllievoActionMenu(a, actionId)}
        </div>
      </article>`
  }

  const renderGruppoRows = (gruppi, sourceList) => gruppi.map((gruppo, index) => {
      const membri = ordinaAllieviLista(sourceList.filter(a => a.gruppo === gruppo))
      const expanded = gruppiEspansi.has(gruppo)
      const blocchi = [...new Set(membri.map(a => a.blocco_attuale).filter(Boolean))].join(', ') || '—'
      const gruppoVacanza = groupRowInVacanza(gruppo, membri)
      const actionId = `gruppo-list-actions-${filtroListaAllievi}-${index}`
      return `
        <tr onclick="showView('gruppo',${jsArg(gruppo)})" style="cursor:pointer">
          <td style="width:42px;text-align:center;white-space:nowrap"><span class="group-count">[${membri.length}]</span>${vacationIconHtml(gruppoVacanza)}</td>
          <td><strong>${esc(gruppo)}</strong>${gruppoVacanza ? '<span style="font-size:.7rem;font-weight:700;background:rgba(245,158,11,.13);color:#b45309;padding:1px 5px;border-radius:10px;margin-left:4px">vacanza</span>' : ''}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>${esc(blocchi)}</td>
          <td style="width:40px;text-align:center">
            <div style="display:flex;justify-content:flex-end;gap:.25rem">
              <button class="btn btn-ghost btn-sm" title="${expanded ? 'Compatta membri' : 'Espandi membri'}" onclick="event.stopPropagation(); toggleGruppoLista(${jsArg(gruppo)})" style="padding:.2rem .45rem;font-size:.95rem">${expanded ? '▴' : '▾'}</button>
              ${renderGruppoActionMenu(gruppo, actionId)}
            </div>
          </td>
        </tr>
        ${expanded ? membri.map((m, i) => renderAllievoRow(m, [
          'group-member-row',
          i === 0 ? 'group-member-first' : '',
          i === membri.length - 1 ? 'group-member-last' : '',
        ].filter(Boolean).join(' '))).join('') : ''}`
    }).join('')

  const renderGruppoCards = (gruppi, sourceList) => gruppi.map((gruppo, index) => {
      const membri = ordinaAllieviLista(sourceList.filter(a => a.gruppo === gruppo))
      const expanded = gruppiEspansi.has(gruppo)
      const actionId = `gruppo-list-mobile-actions-${filtroListaAllievi}-${index}`
      return `
        <article class="allievi-mobile-card is-group">
          <div class="allievi-mobile-card-head">
            <a class="allievi-mobile-card-open" href="#gruppo:${encodeURIComponent(gruppo)}" onclick="event.preventDefault(); showView('gruppo',${jsArg(gruppo)})">
              <div class="allievi-mobile-card-title">
                <strong>${esc(gruppo)}</strong>
              </div>
              <div class="allievi-mobile-meta"><span>${membri.length} ${membri.length === 1 ? 'allievo' : 'allievi'}</span></div>
            </a>
            <div class="allievi-mobile-group-tools">
              <button class="btn btn-ghost btn-sm" type="button" title="${expanded ? 'Compatta membri' : 'Espandi membri'}" onclick="event.stopPropagation(); toggleGruppoLista(${jsArg(gruppo)})">${expanded ? '▴' : '▾'}</button>
              ${renderGruppoActionMenu(gruppo, actionId)}
            </div>
          </div>
        </article>
        ${expanded ? `<div class="allievi-mobile-members">${membri.map(m => renderAllievoCard(m, `group-${index}`)).join('')}</div>` : ''}`
    }).join('')

  const groupNames = list => [...new Set(list.map(a => a.gruppo).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  const byVacation = list => ({
    presenti: ordinaAllieviLista(list.filter(a => !allievoInVacanza(a))),
    vacanza: ordinaAllieviLista(list.filter(a => allievoInVacanza(a))),
  })
  const groupsByVacation = list => {
    const names = groupNames(list)
    return {
      presenti: names.filter(g => !groupRowInVacanza(g, list.filter(a => a.gruppo === g))),
      vacanza: names.filter(g => groupRowInVacanza(g, list.filter(a => a.gruppo === g))),
    }
  }
  const contentForCurrentMode = (renderStudent, renderGroups) => {
    if (filtroListaAllievi === 'tutti') {
      const split = byVacation(listaVisibile)
      return [...split.presenti, ...split.vacanza].map(a => renderStudent(a)).join('')
    }
    if (filtroListaAllievi === 'gruppi') {
      const split = groupsByVacation(listaVisibile)
      return renderGroups(split.presenti, listaVisibile) + renderGroups(split.vacanza, listaVisibile)
    }
    if (filtroListaAllievi === 'vacanza') {
      const inVacanza = listaVisibile.filter(a => allievoInVacanza(a))
      const privati = ordinaAllieviLista(inVacanza.filter(a => !a.gruppo))
      const gruppiVacanza = groupNames(listaVisibile).filter(g => groupRowInVacanza(g, listaVisibile.filter(a => a.gruppo === g)))
      return privati.map(a => renderStudent(a)).join('') + renderGroups(gruppiVacanza, listaVisibile)
    }
    const privati = listaVisibile.filter(a => !a.gruppo)
    const privatiSplit = byVacation(privati)
    const gruppiSplit = groupsByVacation(listaVisibile)
    return [
      privatiSplit.presenti.map(a => renderStudent(a)).join(''),
      renderGroups(gruppiSplit.presenti, listaVisibile),
      privatiSplit.vacanza.map(a => renderStudent(a)).join(''),
      renderGroups(gruppiSplit.vacanza, listaVisibile),
    ].join('')
  }

  const rowsHtml = contentForCurrentMode(renderAllievoRow, renderGruppoRows)
  const cardsHtml = contentForCurrentMode(renderAllievoCard, renderGruppoCards)
  if (!rowsHtml) {
    const emptyText = filtroListaAllievi === 'archivio'
      ? 'Nessun allievo archiviato.'
      : filtroListaAllievi === 'vacanza'
        ? 'Nessun allievo o gruppo in vacanza.'
        : filtroListaAllievi === 'gruppi'
          ? 'Nessun gruppo attivo.'
          : 'Nessun allievo ancora.<br>Premi "+ Nuovo allievo" per iniziare.'
    el.innerHTML = chipsHtml + `<div class="empty">${emptyText}</div>`
    return
  }

  el.innerHTML = chipsHtml + `
    <div class="table-wrap allievi-table-view">
      <table>
        ${allieviColgroup}
        <thead><tr><th></th><th>Nome / gruppo</th><th>Cognome</th><th>Età</th><th>Nick</th><th>Tier</th><th>Blocco</th><th></th></tr></thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
    <div class="allievi-mobile-list" aria-label="Elenco allievi">
      ${cardsHtml}
    </div>`
  requestAnimationFrame(() => motion.tableRows(el))
}

function groupRowInVacanza(gruppo, membri = []) {
  return gruppoInVacanza(gruppo) || (membri.length > 0 && membri.every(a => allievoInVacanza(a)))
}

function allieviGroupNamesForCurrentMode(lista = allieviVisibiliGod()) {
  const names = [...new Set(lista.map(a => a.gruppo).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  if (filtroListaAllievi === 'tutti') return []
  if (filtroListaAllievi === 'vacanza') return names.filter(g => groupRowInVacanza(g, lista.filter(a => a.gruppo === g)))
  return names
}

async function setAllieviListMode(mode = 'attivi') {
  const normalized = ['attivi', 'tutti', 'gruppi', 'vacanza', 'archivio'].includes(mode) ? mode : 'attivi'
  const nextArchivio = normalized === 'archivio'
  const serveRicarica = mostraArchiviati !== nextArchivio
  filtroListaAllievi = normalized
  mostraArchiviati = nextArchivio
  filtroVacanza = normalized === 'vacanza'
  filtroGruppo = null
  gruppiEspansi.clear()
  if (serveRicarica) await ricaricaAllievi()
  else renderAllievi()
}

function setFiltroGruppo(g) {
  filtroGruppo = g
  if (g === null) gruppiEspansi.clear()
  renderAllievi()
}

function toggleFiltroVacanza() {
  setAllieviListMode(filtroListaAllievi === 'vacanza' ? 'attivi' : 'vacanza')
}

async function mostraTuttiAllievi() {
  await setAllieviListMode('attivi')
}

function toggleGruppoLista(gruppo) {
  if (gruppiEspansi.has(gruppo)) gruppiEspansi.delete(gruppo)
  else gruppiEspansi.add(gruppo)
  renderAllievi()
}

function toggleTuttiGruppi() {
  const gruppi = allieviGroupNamesForCurrentMode()
  const tuttiEspansi = gruppi.length > 0 && gruppi.every(g => gruppiEspansi.has(g))
  gruppiEspansi.clear()
  if (!tuttiEspansi) gruppi.forEach(g => gruppiEspansi.add(g))
  renderAllievi()
}

function renderAllievoActionMenu(allievo, actionId = 'allievo-actions') {
  if (!allievo) return ''
  const canShare = canShareAllievo(allievo)
  const canShareGroup = allievo.gruppo && canShareGruppo(allievo.gruppo)
  return `
    <div class="inline-action-menu">
      <button class="btn btn-outline btn-sm" onclick="toggleActionMenu(${jsArg(actionId)}, event)" type="button">Azioni</button>
      <div class="inline-action-panel" id="${esc(actionId)}" hidden>
        ${godMode && !allievo.maestro_id ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); assegnaAllievoAMe('${allievo.id}')">Assegna a me</button>` : ''}
        ${canShare ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); apriCondividiAllievo('${allievo.id}')">Condividi allievo</button>` : ''}
        ${canShareGroup ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); apriCondividiGruppo(${jsArg(allievo.gruppo)})">Condividi gruppo</button>` : ''}
        ${allievo.stato !== 'archiviato' ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); showView('nuovo-allievo','${allievo.id}')">${editIcon()} Modifica</button>` : ''}
      </div>
    </div>`
}

function renderGruppoActionMenu(gruppo, actionId = 'gruppo-actions', options = {}) {
  const membriAttivi = gruppoMembri(gruppo)
  const isArchiviato = !membriAttivi.length && gruppoMembri(gruppo, { includeArchived: true }).length > 0
  const showScheda = options.showScheda !== false
  const canShare = !isArchiviato && canShareGruppo(gruppo)
  const inVacanza = gruppoInVacanza(gruppo)
  return `
    <div class="inline-action-menu">
      <button class="btn btn-outline btn-sm" onclick="toggleActionMenu(${jsArg(actionId)}, event)" type="button">Azioni</button>
      <div class="inline-action-panel" id="${esc(actionId)}" hidden>
        ${showScheda ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); showView('gruppo',${jsArg(gruppo)})">Scheda gruppo</button>` : ''}
        ${!isArchiviato ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); showView('nuovo-gruppo',${jsArg(gruppo)})">${editIcon()} Modifica</button>` : ''}
        ${!isArchiviato ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); toggleVacanzaGruppo(${jsArg(gruppo)})">${inVacanza ? 'Togli vacanza' : 'Metti in vacanza'}</button>` : ''}
        ${canShare ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); apriCondividiGruppo(${jsArg(gruppo)})">Condividi</button>` : ''}
        ${!isArchiviato ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); archiviaGruppo(${jsArg(gruppo)})">Archivia</button>` : '<div class="inline-action-meta">Gruppo archiviato</div>'}
      </div>
    </div>`
}

function profiloConVacanzaGruppo(profilo = {}, inVacanza = false) {
  const dedicata = profilo.logistica_gruppo && typeof profilo.logistica_gruppo === 'object'
    ? profilo.logistica_gruppo
    : null
  const logisticaBase = dedicata && (logisticaHaValori(dedicata) || hasVacationField(dedicata))
    ? dedicata
    : logisticaGruppoProfilo(profilo)
  const logisticaGruppo = { ...logisticaBase, in_vacanza: inVacanza }
  return { ...profilo, in_vacanza: inVacanza, logistica_gruppo: logisticaGruppo }
}

async function salvaProfiloAllievo(id, profilo) {
  let payload = { profilo, aggiornato_il: new Date().toISOString() }
  let { data, error } = await sb.from('allievi').update(payload).eq('id', id).select().single()
  if (error && /aggiornato_il|updated_at|schema cache|column/i.test(error.message || error.details || error.hint || '')) {
    payload = { profilo }
    ;({ data, error } = await sb.from('allievi').update(payload).eq('id', id).select().single())
  }
  if (error) throw error
  return data
}

async function toggleVacanzaGruppo(gruppo) {
  const membri = gruppoMembri(gruppo)
  if (!membri.length) {
    alert('Nessun allievo attivo da aggiornare in questo gruppo.')
    return
  }
  const nextVacanza = !gruppoInVacanza(gruppo)
  if (nextVacanza && !confirm(`Mettere il gruppo "${gruppo}" in vacanza? I ${membri.length} membri non compariranno nelle liste operative e negli appuntamenti finche resta in vacanza.`)) return

  try {
    const aggiornati = []
    for (const membro of membri) {
      const profilo = profiloConVacanzaGruppo(membro.profilo || {}, nextVacanza)
      const data = await salvaProfiloAllievo(membro.id, profilo)
      aggiornati.push(data || { ...membro, profilo })
    }
    const aggiornatiById = new Map(aggiornati.map(a => [String(a.id), a]))
    allAllievi = allAllievi.map(a => aggiornatiById.get(String(a.id)) || a)
    logModificaLocale('gruppo', gruppo, nextVacanza ? 'Gruppo messo in vacanza' : 'Gruppo tolto dalla vacanza')
    await ricaricaAllievi()
    if (document.body.dataset.view === 'gruppo' && currentGruppoNome === gruppo) await loadGruppo(gruppo)
    else renderAllievi()
  } catch (e) {
    alert('Errore aggiornamento vacanza gruppo: ' + (e.message || e))
  }
}

async function archiviaGruppo(gruppo) {
  const membri = gruppoMembri(gruppo)
  if (!membri.length) {
    alert('Nessun allievo attivo da archiviare in questo gruppo.')
    return
  }
  if (!confirm(`Archiviare il gruppo "${gruppo}" e i ${membri.length} allievi attivi collegati? Potrai ritrovarli dalla lista Archivio.`)) return

  try {
    const ids = membri.map(a => a.id)
    const { error } = await sb.from('allievi').update({ stato: 'archiviato' }).in('id', ids)
    if (error) throw error
    logModificaLocale('gruppo', gruppo, `Archiviato gruppo: ${membri.length} allievi`)
    mostraArchiviati = true
    filtroListaAllievi = 'archivio'
    filtroGruppo = null
    filtroVacanza = false
    gruppiEspansi.clear()
    await ricaricaAllievi()
    showView('allievi')
  } catch (e) {
    alert("Errore nell'archiviazione del gruppo: " + (e.message || e))
  }
}

async function setArchivio(on) {
  await setAllieviListMode(on ? 'archivio' : 'attivi')
}

function toggleVip() {
  const inp = document.getElementById('na-vip')
  const tier = document.getElementById('na-tier')
  if (!inp) return
  const isOn = inp.value === 'true'
  inp.value = String(!isOn)
  if (tier) tier.value = !isOn ? 'VIP' : 'C'
}

function syncTierVipIndicator() {
  const tier = document.getElementById('na-tier')?.value || 'C'
  const inp = document.getElementById('na-vip')
  if (inp) inp.value = String(tier === 'VIP')
}

function setDot(groupId, val) {
  const g = document.getElementById(groupId)
  if (!g) return
  g.dataset.val = val
  g.querySelectorAll('.dot').forEach(d => d.classList.toggle('filled', parseInt(d.dataset.v) <= val))
}

function initNuovoAllievo(id) {
  editingAllieviId = id || null
  const allievo = id ? allAllievi.find(a => a.id === id) : null
  const p = allievo?.profilo || {}
  const hasGruppo = !!allievo?.gruppo
  const logisticaIndividuale = logisticaIndividualeProfilo(p, hasGruppo)
  const addressVisible = canViewAllievoAddress(allievo)
  const addressEditable = canEditAllievoAddress(allievo)

  // Titolo e bottone back
  document.getElementById('na-titolo').textContent = allievo
    ? `Modifica allievo — ${allievo.nome} ${allievo.cognome}`
    : 'Nuovo allievo'
  const backBtn = document.getElementById('na-back-btn')
  backBtn.onclick = allievo ? () => loadScheda(id) : () => showView('allievi')
  backBtn.textContent = allievo ? '← Scheda' : '← Allievi'
  const label = allievo ? 'Aggiorna allievo' : 'Salva allievo'
  document.getElementById('btn-salva-al').textContent     = label
  document.getElementById('btn-salva-al-top').textContent = label
  document.getElementById('na-delete-actions').hidden = !allievo
  document.getElementById('btn-cancella-gruppo-da-allievo').hidden = !allievo?.gruppo

  document.getElementById('na-err').classList.remove('show')

  // La scheda allievo resta sempre individuale; i gruppi hanno un flusso dedicato.
  setTipoForm('individuale')

  // Campi base
  document.getElementById('na-nickname').value   = allievo?.nickname        || ''
  document.getElementById('na-nome').value        = allievo?.nome            || ''
  document.getElementById('na-cognome').value     = allievo?.cognome         || ''
  document.getElementById('na-nascita').value     = dateIsoToInput(allievo?.data_nascita)
  document.getElementById('na-iscrizione').value  = dateIsoToInput(allievo?.data_iscrizione || localDateIso())
  document.getElementById('na-email').value       = allievo?.email           || ''
  document.getElementById('na-tel').value         = allievo?.telefono        || ''
  document.getElementById('na-note').value        = allievo?.note_generali   || ''
  document.getElementById('na-note-lezione').value = allievoLessonNote(allievo)
  document.getElementById('na-blocco').value      = allievo?.blocco_attuale  || 'Base'
  document.getElementById('na-in-vacanza').checked = allievo ? allievoInVacanzaDiretta(allievo) : false
  calcolaEtaForm()

  // Tier / VIP
  const tierVal = allievo ? allievoTier(allievo) : 'C'
  document.getElementById('na-tier').value = tierVal
  document.getElementById('na-vip').value = String(tierVal === 'VIP')

  // Profilo logistica
  const indirizzoInput = document.getElementById('na-indirizzo')
  const casaInput = document.getElementById('na-casa')
  const casaLatInput = document.getElementById('na-casa-latitudine')
  const casaLngInput = document.getElementById('na-casa-longitudine')
  const indirizzoCondivisoInput = document.getElementById('na-indirizzo-condiviso')
  indirizzoInput.value = addressVisible ? (p.indirizzo || '') : ''
  casaInput.value = addressVisible ? (p.casa || '') : ''
  casaLatInput.value = addressVisible && parseMapCoordinate(p.casa_latitudine ?? p.casa_lat) !== null ? formatMapCoordinate(p.casa_latitudine ?? p.casa_lat) : ''
  casaLngInput.value = addressVisible && parseMapCoordinate(p.casa_longitudine ?? p.casa_lng ?? p.casa_lon) !== null ? formatMapCoordinate(p.casa_longitudine ?? p.casa_lng ?? p.casa_lon) : ''
  indirizzoInput.disabled = !addressEditable
  casaInput.disabled = !addressEditable
  casaLatInput.disabled = !addressEditable
  casaLngInput.disabled = !addressEditable
  indirizzoInput.placeholder = addressVisible ? 'Es. Milano Nord' : 'Privato del maestro proprietario'
  casaInput.placeholder = addressVisible ? 'Es. via e civico casa' : 'Privato del maestro proprietario'
  casaLatInput.placeholder = addressVisible ? '45.46420' : 'Privato'
  casaLngInput.placeholder = addressVisible ? '9.19000' : 'Privato'
  indirizzoCondivisoInput.checked = !!p.indirizzo_condiviso
  indirizzoCondivisoInput.disabled = !addressEditable
  document.getElementById('na-cultura').value      = p.cultura       || ''
  document.getElementById('na-note-salute').value  = p.note_salute   || ''
  document.getElementById('na-cert').value          = dateIsoToInput(p.scadenza_cert)
  document.getElementById('na-durata').value    = logisticaIndividuale.durata_lezione || ''
  document.getElementById('na-compenso').value  = logisticaIndividuale.compenso       || ''
  document.getElementById('na-appuntamento').value  = logisticaIndividuale.appuntamento   || ''
  document.getElementById('na-luogo-incontro').value= logisticaIndividuale.luogo_incontro || ''
  document.getElementById('na-disponibilita').value = p.disponibilita  || ''

  // Profilo tecnico
  document.getElementById('na-competenze').value   = p.competenze    || ''
  document.getElementById('na-obiettivi').value    = p.obiettivi     || ''
  document.getElementById('na-talenti').value      = p.talenti       || ''
  document.getElementById('na-paure').value        = p.paure         || ''
  document.getElementById('na-sport').value        = p.sport         || ''
  document.getElementById('na-equip').value        = p.equipaggiamento || ''
  const lato = document.getElementById('na-lato')
  if (lato) lato.value = p.lato_dominante || ''

  // Campi associazione, se usati
  document.getElementById('ass-gruppo').value       = allievo?.gruppo || ''
  document.getElementById('ass-appuntamento').value = p.appuntamento || ''
  document.getElementById('ass-durata').value       = p.durata_lezione || ''
  document.getElementById('ass-luogo').value        = p.luogo_incontro || ''
  document.getElementById('ass-nome').value         = allievo?.nome || ''
  document.getElementById('ass-cognome').value      = allievo?.cognome || ''
  document.getElementById('ass-nick').value         = allievo?.nickname || ''
  document.getElementById('ass-note').value         = allievo?.note_generali || ''

  // Gruppo
  document.getElementById('na-gruppo-cb').checked = hasGruppo
  document.getElementById('na-gruppo-panel').hidden = !hasGruppo
  document.getElementById('na-gruppo').value = allievo?.gruppo || ''
  renderGruppiNuovoAllievo(allievo?.gruppo || '')
  document.getElementById('na-compagni').textContent = ''
  if (hasGruppo) cercaCompagni()
  else renderLogisticaGruppoAllievo()

  // Familiari
  const famContainer = document.getElementById('na-familiari')
  famContainer.innerHTML = ''
  ;(p.familiari || []).forEach(f => {
    famContainer.appendChild(creaFamiliareRow(f))
  })

  // Dot ratings
  setDot('dot-coord',   p.capacita?.coordinazione          || 0)
  setDot('dot-prop',    p.capacita?.propriocezione         || 0)
  setDot('dot-vel',     p.capacita?.velocita_apprendimento || 0)
  setDot('dot-bil',     p.capacita?.bilateralita           || 0)
  setDot('dot-visivo',  p.apprendimento?.visivo            || 0)
  setDot('dot-teorico', p.apprendimento?.teorico           || 0)
  setDot('dot-pratico', p.apprendimento?.pratico           || 0)

  // Init click handler sui dot (una sola volta)
  if (!document.getElementById('view-nuovo-allievo').dataset.dotsInit) {
    document.querySelectorAll('#view-nuovo-allievo .dots-group').forEach(g => {
      g.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
          const v  = parseInt(dot.dataset.v)
          const nv = v === parseInt(g.dataset.val) ? 0 : v
          g.dataset.val = nv
          g.querySelectorAll('.dot').forEach(d => d.classList.toggle('filled', parseInt(d.dataset.v) <= nv))
        })
      })
    })
    document.getElementById('view-nuovo-allievo').dataset.dotsInit = '1'
  }
}

function setTipoForm(tipo) {
  document.getElementById('na-tipo').value = tipo
  const isAss = tipo === 'associazione'
  document.getElementById('form-individuale').hidden = isAss
  document.getElementById('form-associazione').hidden = !isAss
}

function toggleGruppo(cb) {
  document.getElementById('na-gruppo-panel').hidden = !cb.checked
  if (cb.checked) renderGruppiNuovoAllievo(document.getElementById('na-gruppo').value.trim())
  if (!cb.checked) {
    document.getElementById('na-gruppo').value = ''
    document.getElementById('na-compagni').textContent = ''
  }
  renderLogisticaGruppoAllievo()
}

function renderGruppiNuovoAllievo(selected = '') {
  const sel = document.getElementById('na-gruppo-select')
  if (!sel) return
  const gruppi = gruppiEsistenti()
  const hasSelected = selected && !gruppi.includes(selected)
  sel.innerHTML = `
    <option value="">— Scegli gruppo —</option>
    ${gruppi.map(g => `<option value="${esc(g)}">${esc(g)}</option>`).join('')}
    ${hasSelected ? `<option value="${esc(selected)}">${esc(selected)}</option>` : ''}
    <option value="__new__">+ Aggiungi nuovo gruppo</option>`
  sel.value = selected || ''
}

function setGruppoDaSelect(value) {
  const input = document.getElementById('na-gruppo')
  if (value === '__new__') {
    input.value = ''
    input.focus()
  } else {
    input.value = value
  }
  cercaCompagni()
  renderLogisticaGruppoAllievo()
}

function cercaCompagni() {
  const gruppo = document.getElementById('na-gruppo').value.trim()
  const el = document.getElementById('na-compagni')
  if (!gruppo) { el.textContent = ''; renderLogisticaGruppoAllievo(); return }
  const compagni = allAllievi.filter(a => a.gruppo === gruppo)
  el.textContent = compagni.length
    ? 'Gruppo esistente: ' + compagni.map(a => a.nome + ' ' + a.cognome).join(', ')
    : 'Nuovo gruppo — nessun allievo con questo nome ancora.'
  renderLogisticaGruppoAllievo()
}

function renderLogisticaGruppoAllievo() {
  const panel = document.getElementById('na-logistica-gruppo-panel')
  if (!panel) return
  const checked = document.getElementById('na-gruppo-cb')?.checked
  const gruppo = document.getElementById('na-gruppo')?.value.trim()
  const membri = checked && gruppo ? gruppoMembri(gruppo, { includeArchived: true }) : []
  const profilo = membri.length ? profiloComuneGruppo(membri) : {}
  const hasLogistica = !!(profilo.appuntamento || profilo.luogo_incontro || profilo.durata_lezione || profilo.compenso || profilo.pagamento_metodo || profilo.pagamento_stato || profilo.pagamento_note || profilo.in_vacanza)
  if (!checked || !gruppo || !membri.length || !hasLogistica) {
    panel.hidden = true
    panel.innerHTML = ''
    panel.removeAttribute('role')
    panel.removeAttribute('tabindex')
    panel.removeAttribute('aria-label')
    panel.onclick = null
    panel.onkeydown = null
    return
  }
  const item = (label, value) => value ? `<div class="group-logistics-item"><span>${esc(label)}</span>${esc(String(value))}</div>` : ''
  const pagamento = [profilo.pagamento_metodo, profilo.pagamento_stato].filter(Boolean).join(' · ')
  panel.hidden = false
  panel.setAttribute('role', 'button')
  panel.setAttribute('tabindex', '0')
  panel.setAttribute('aria-label', `Apri scheda gruppo ${gruppo}`)
  panel.onclick = () => openGruppoFromAllievoLogistica(gruppo)
  panel.onkeydown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openGruppoFromAllievoLogistica(gruppo)
    }
  }
  panel.innerHTML = `
    <div class="group-logistics-title">${esc(gruppo)}</div>
    <div class="group-logistics-grid">
      ${item('Appuntamento', profilo.appuntamento)}
      ${item('Durata', profilo.durata_lezione ? profilo.durata_lezione + ' min' : '')}
      ${item('Luogo di incontro', profilo.luogo_incontro)}
      ${item('Compenso', profilo.compenso ? '€ ' + Number(profilo.compenso).toFixed(2) : '')}
      ${item('Pagamento', pagamento)}
      ${item('Note pagamento', profilo.pagamento_note)}
      ${item('Stato lezioni', profilo.in_vacanza ? 'In vacanza' : '')}
    </div>`
}

function openGruppoFromAllievoLogistica(gruppo) {
  if (!gruppo || !gruppoMembri(gruppo, { includeArchived: true }).length) return
  showView('gruppo', gruppo)
}

function aggiungiFamiliare() {
  const container = document.getElementById('na-familiari')
  container.appendChild(creaFamiliareRow())
}

function normalizzaFamiliare(f = {}) {
  let nome = f.nome || ''
  let cognome = f.cognome || ''
  if (nome && !cognome && nome.trim().includes(' ')) {
    const parts = nome.trim().split(/\s+/)
    cognome = parts.pop()
    nome = parts.join(' ')
  }
  return { nome, cognome, relazione: f.relazione || '', telefono: f.telefono || '' }
}

function creaFamiliareRow(f = {}) {
  const container = document.getElementById('na-familiari')
  const data = normalizzaFamiliare(f)
  const n = container.children.length + 1
  const row = document.createElement('div')
  row.className = 'familiare-row familiare-row-contatto'
  row.style.cssText = 'align-items:end;position:relative'
  row.innerHTML = `
    <div class="field" style="margin:0"><label>Familiare ${n} — Nome</label><input type="text" class="fam-nome" placeholder="Nome" value="${esc(data.nome)}"></div>
    <div class="field" style="margin:0"><label>Cognome</label><input type="text" class="fam-cognome" placeholder="Cognome" value="${esc(data.cognome)}"></div>
    <div class="field" style="margin:0"><label>Relazione</label><input type="text" class="fam-relazione" placeholder="Madre, padre..." value="${esc(data.relazione)}"></div>
    <div class="field" style="margin:0;display:grid;grid-template-columns:1fr auto;gap:.3rem;align-items:end">
      <div><label>Telefono</label><input type="tel" class="fam-telefono" placeholder="+39 …" value="${esc(data.telefono)}"></div>
      <button type="button" class="btn btn-ghost btn-sm" style="padding:.4rem .5rem;color:var(--danger)" onclick="this.closest('.familiare-row').remove()">✕</button>
    </div>`
  return row
}

function cercaLogisticaAssoc() {
  const gruppo = document.getElementById('ass-gruppo').value.trim()
  const hint = document.getElementById('ass-logistica-hint')
  const gruppiHint = document.getElementById('ass-gruppi-hint')
  if (!gruppo) {
    hint.style.display = 'none'
    gruppiHint.textContent = ''
    return
  }

  const esistenti = allAllievi.filter(a => a.gruppo === gruppo)
  gruppiHint.textContent = esistenti.length
    ? 'Gruppo esistente: ' + esistenti.map(a => `${a.nome} ${a.cognome || ''}`.trim()).join(', ')
    : 'Nuovo gruppo / associazione.'

  const primo = esistenti.find(a => a.profilo)
  if (!primo) {
    hint.style.display = 'none'
    return
  }

  const p = logisticaGruppoProfilo(primo.profilo || {})
  const assAppuntamento = document.getElementById('ass-appuntamento')
  const assDurata = document.getElementById('ass-durata')
  const assLuogo = document.getElementById('ass-luogo')
  if (!assAppuntamento.value) assAppuntamento.value = p.appuntamento || ''
  if (!assDurata.value) assDurata.value = p.durata_lezione || ''
  if (!assLuogo.value) assLuogo.value = p.luogo_incontro || ''
  hint.style.display = (p.appuntamento || p.durata_lezione || p.luogo_incontro) ? 'block' : 'none'
}

function aggiungiAccompagnatore() {
  const container = document.getElementById('ass-accompagnatori')
  const row = document.createElement('div')
  row.className = 'familiare-row'
  row.innerHTML = `
    <div class="field" style="margin:0"><label>Nome</label><input type="text" placeholder="Nome e cognome"></div>
    <div class="field" style="margin:0"><label>Relazione</label><input type="text" placeholder="Referente, coach, tutor…"></div>
    <div class="field" style="margin:0;display:grid;grid-template-columns:1fr auto;gap:.3rem;align-items:end">
      <div><label>Telefono</label><input type="tel" placeholder="+39 …"></div>
      <button type="button" class="btn btn-ghost btn-sm" style="padding:.4rem .5rem;color:var(--danger)" onclick="this.closest('.familiare-row').remove()">✕</button>
    </div>`
  container.appendChild(row)
}

function calcolaEtaForm() {
  const dn = dateInputToIso(document.getElementById('na-nascita').value)
  const el = document.getElementById('na-eta')
  if (!dn) { el.value = ''; return }
  el.value = allievoEtaLabel(dn)
}

function formatDateField(input) {
  const digits = input.value.replace(/\D/g, '').slice(0, 8)
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean)
  input.value = parts.join('/')
}

function getDot(id) {
  return parseInt(document.getElementById(id)?.dataset.val || '0')
}

const LOGISTICA_KEYS = ['appuntamento', 'luogo_incontro', 'durata_lezione', 'compenso', 'pagamento_metodo', 'pagamento_stato', 'pagamento_note']

function estraiLogistica(profilo = {}) {
  return Object.fromEntries(LOGISTICA_KEYS.map(key => [key, profilo[key] ?? null]))
}

function logisticaHaValori(logistica = {}) {
  return LOGISTICA_KEYS.some(key => logistica[key] !== undefined && logistica[key] !== null && logistica[key] !== '')
}

function profiloSenzaLogisticaTopLevel(profilo = {}) {
  const clean = { ...profilo }
  LOGISTICA_KEYS.forEach(key => delete clean[key])
  return clean
}

function hasOwn(obj = {}, key) {
  return Object.prototype.hasOwnProperty.call(obj || {}, key)
}

function normalizeVacationFlag(value) {
  return value === true || value === 1 || value === '1' || String(value || '').toLowerCase() === 'true'
}

function hasVacationField(obj = {}) {
  return ['in_vacanza', 'inVacanza', 'vacanza'].some(key => hasOwn(obj, key))
}

function vacationValue(obj = {}) {
  if (hasOwn(obj, 'in_vacanza')) return normalizeVacationFlag(obj.in_vacanza)
  if (hasOwn(obj, 'inVacanza')) return normalizeVacationFlag(obj.inVacanza)
  if (hasOwn(obj, 'vacanza')) return normalizeVacationFlag(obj.vacanza)
  return false
}

function applyVacationField(base = {}, source = {}) {
  return hasVacationField(source) ? { ...base, in_vacanza: vacationValue(source) } : base
}

function logisticaGruppoProfilo(profilo = {}) {
  const dedicata = profilo.logistica_gruppo || {}
  if (logisticaHaValori(dedicata) || hasVacationField(dedicata)) return applyVacationField({ ...dedicata }, dedicata)
  return applyVacationField(estraiLogistica(profilo), profilo)
}

function logisticaIndividualeProfilo(profilo = {}, inGruppo = false) {
  if (!inGruppo) return applyVacationField(estraiLogistica(profilo), profilo)
  const dedicata = profilo.logistica_individuale || {}
  return logisticaHaValori(dedicata) || hasVacationField(dedicata) ? applyVacationField({ ...dedicata }, dedicata) : {}
}

function allievoInVacanzaDiretta(allievo = {}) {
  const profilo = allievo.profilo || {}
  const logisticaIndividuale = logisticaIndividualeProfilo(profilo, !!allievo.gruppo)
  return vacationValue(logisticaIndividuale) || vacationValue(profilo)
}

function gruppoInVacanza(nomeGruppo) {
  if (!nomeGruppo) return false
  const profilo = profiloComuneGruppo(gruppoMembri(nomeGruppo, { includeArchived: true }))
  return !!profilo.in_vacanza
}

function allievoInVacanza(allievo = {}) {
  return allievoInVacanzaDiretta(allievo) || (!!allievo.gruppo && gruppoInVacanza(allievo.gruppo))
}

function vacationIconHtml(active = true) {
  return active ? '<span class="vacation-icon" title="In vacanza" aria-label="In vacanza">🏖</span>' : ''
}

function vacationLabel(allievo = {}) {
  if (!allievoInVacanza(allievo)) return ''
  return allievo.gruppo && gruppoInVacanza(allievo.gruppo) && !allievoInVacanzaDiretta(allievo) ? 'In vacanza (gruppo)' : 'In vacanza'
}

function allievoLessonNote(allievo = {}) {
  const p = allievo?.profilo || {}
  return String(
    p.note_lezione ||
    p.promemoria_lezione ||
    p.note_per_lezione ||
    allievo?.note_lezione ||
    ''
  ).trim()
}

async function salvaAllievo() {
  const tipo    = document.getElementById('na-tipo').value
  const isAss   = tipo === 'associazione'
  const nome    = isAss ? document.getElementById('ass-nome').value.trim() : document.getElementById('na-nome').value.trim()
  const cognome = isAss ? document.getElementById('ass-cognome').value.trim() : document.getElementById('na-cognome').value.trim()
  const errEl   = document.getElementById('na-err')
  errEl.classList.remove('show')

  if (!nome || (!isAss && !cognome)) {
    errEl.textContent = isAss ? 'Il nome è obbligatorio.' : 'Nome e cognome sono obbligatori.'
    errEl.classList.add('show')
    return
  }

  const gruppoAttivo = !isAss && document.getElementById('na-gruppo-cb').checked
  const allievoOriginale = editingAllieviId ? (allAllievi.find(a => a.id === editingAllieviId) || null) : null
  const profiloOriginale = allievoOriginale?.profilo || {}
  const addressEditable = canEditAllievoAddress(allievoOriginale)
  const casaLatRaw = !isAss ? (document.getElementById('na-casa-latitudine')?.value.trim() || '') : ''
  const casaLngRaw = !isAss ? (document.getElementById('na-casa-longitudine')?.value.trim() || '') : ''
  const casaLat = parseMapCoordinate(casaLatRaw)
  const casaLng = parseMapCoordinate(casaLngRaw)
  if (!isAss && addressEditable && ((casaLatRaw || casaLngRaw) && (casaLat === null || casaLng === null))) {
    errEl.textContent = 'Inserisci sia latitudine sia longitudine GPS casa in formato numerico.'
    errEl.className = 'msg msg-err show'
    return
  }
  let profilo
  if (isAss) {
    profilo = {
      appuntamento:  document.getElementById('ass-appuntamento').value.trim() || null,
      durata_lezione: parseInt(document.getElementById('ass-durata').value)   || null,
      luogo_incontro: document.getElementById('ass-luogo').value.trim()       || null,
    }
  } else {
    const famRows = document.querySelectorAll('#na-familiari .familiare-row')
    const familiari = [...famRows].map(row => {
      return {
        nome: row.querySelector('.fam-nome')?.value.trim() || '',
        cognome: row.querySelector('.fam-cognome')?.value.trim() || '',
        relazione: row.querySelector('.fam-relazione')?.value.trim() || '',
        telefono: row.querySelector('.fam-telefono')?.value.trim() || '',
      }
    }).filter(f => f.nome || f.cognome || f.telefono)

    const inVacanza = !!document.getElementById('na-in-vacanza')?.checked
    const tierValue = normalizeAllievoTier(document.getElementById('na-tier')?.value || 'C')
    const logisticaIndividuale = {
      durata_lezione:   parseInt(document.getElementById('na-durata').value)        || null,
      compenso:         parseFloat(document.getElementById('na-compenso').value)   || null,
      appuntamento:     document.getElementById('na-appuntamento').value.trim()    || null,
      luogo_incontro:   document.getElementById('na-luogo-incontro').value.trim()  || null,
      in_vacanza:       inVacanza,
    }
    const baseProfilo = {
      ...profiloSenzaLogisticaTopLevel(profiloOriginale),
      indirizzo:        addressEditable ? (document.getElementById('na-indirizzo').value.trim() || null) : (profiloOriginale.indirizzo || null),
      casa:             addressEditable ? (document.getElementById('na-casa').value.trim() || null) : (profiloOriginale.casa || null),
      casa_latitudine:  addressEditable ? casaLat : (profiloOriginale.casa_latitudine ?? profiloOriginale.casa_lat ?? null),
      casa_longitudine: addressEditable ? casaLng : (profiloOriginale.casa_longitudine ?? profiloOriginale.casa_lng ?? profiloOriginale.casa_lon ?? null),
      indirizzo_condiviso: addressEditable ? !!document.getElementById('na-indirizzo-condiviso')?.checked : !!profiloOriginale.indirizzo_condiviso,
      tier:             tierValue,
      cultura:          document.getElementById('na-cultura').value.trim()      || null,
      note_lezione:     document.getElementById('na-note-lezione').value.trim() || null,
      note_salute:      document.getElementById('na-note-salute').value.trim()  || null,
      scadenza_cert:    dateInputToIso(document.getElementById('na-cert').value)        || null,
      disponibilita:    document.getElementById('na-disponibilita').value.trim()   || null,
      competenze:       document.getElementById('na-competenze').value.trim()   || null,
      obiettivi:        document.getElementById('na-obiettivi').value.trim()    || null,
      talenti:          document.getElementById('na-talenti').value.trim()      || null,
      paure:            document.getElementById('na-paure').value.trim()        || null,
      sport:            document.getElementById('na-sport').value.trim()        || null,
      equipaggiamento:  document.getElementById('na-equip').value.trim()        || null,
      lato_dominante:   document.getElementById('na-lato').value                || null,
      familiari,
      capacita: {
        coordinazione:          getDot('dot-coord'),
        propriocezione:         getDot('dot-prop'),
        velocita_apprendimento: getDot('dot-vel'),
        bilateralita:           getDot('dot-bil'),
      },
      apprendimento: {
        visivo:  getDot('dot-visivo'),
        teorico: getDot('dot-teorico'),
        pratico: getDot('dot-pratico'),
      }
    }

    if (gruppoAttivo) {
      const logisticaGruppo = profiloOriginale.logistica_gruppo || {}
      delete baseProfilo.in_vacanza
      profilo = {
        ...baseProfilo,
        ...(logisticaHaValori(logisticaGruppo) || hasVacationField(logisticaGruppo) ? { logistica_gruppo: logisticaGruppo } : {}),
        ...(logisticaHaValori(logisticaIndividuale) || inVacanza ? { logistica_individuale: logisticaIndividuale } : {}),
      }
    } else {
      profilo = {
        ...baseProfilo,
        ...logisticaIndividuale,
      }
      delete profilo.logistica_gruppo
      delete profilo.logistica_individuale
    }
  }

  const btn    = document.getElementById('btn-salva-al')
  const btnTop = document.getElementById('btn-salva-al-top')
  const labelOrig = btn.textContent
  btn.disabled = true;    btn.textContent    = 'Salvataggio…'
  btnTop.disabled = true; btnTop.textContent = 'Salvataggio…'

  let writeUid = currentUid
  try {
    if (!editingAllieviId) writeUid = await requireCurrentUidForWrite(errEl)
  } catch (e) {
    btn.disabled = false;    btn.textContent    = labelOrig
    btnTop.disabled = false; btnTop.textContent = labelOrig
    return
  }

  const savedId = editingAllieviId
  const originalAllievo = savedId ? (allAllievi.find(a => String(a.id) === String(savedId)) || {}) : {}
  const dataIscrizioneInput = dateInputToIso(document.getElementById('na-iscrizione').value)
  const dataIscrizione = dataIscrizioneInput || originalAllievo.data_iscrizione || localDateIso()
  const payload = {
    nome, cognome, tipo,
    nickname:        isAss ? (document.getElementById('ass-nick').value.trim() || null) : (document.getElementById('na-nickname').value.trim() || null),
    vip:             isAss ? false : normalizeAllievoTier(document.getElementById('na-tier')?.value || 'C') === 'VIP',
    blocco_attuale:  isAss ? 'Base' : document.getElementById('na-blocco').value,
    gruppo:          isAss ? (document.getElementById('ass-gruppo').value.trim() || null) : (gruppoAttivo ? (document.getElementById('na-gruppo').value.trim() || null) : null),
    data_nascita:    isAss ? null : (dateInputToIso(document.getElementById('na-nascita').value) || null),
    data_iscrizione: dataIscrizione,
    email:           isAss ? null : (document.getElementById('na-email').value.trim() || null),
    telefono:        isAss ? null : (document.getElementById('na-tel').value.trim() || null),
    note_generali:   isAss ? (document.getElementById('ass-note').value.trim() || null) : (document.getElementById('na-note').value.trim() || null),
    profilo,
    aggiornato_il:   new Date().toISOString(),
    ...(editingAllieviId ? {} : { maestro_id: writeUid }),
  }

  try {
    let data, error
    if (savedId) {
      ;({ data, error } = await sb.from('allievi').update(payload).eq('id', savedId).select().single())
      if (error && /aggiornato_il|updated_at|schema cache|column|tier/i.test(error.message || error.details || error.hint || '')) {
        const { aggiornato_il, ...compatPayload } = payload
        ;({ data, error } = await sb.from('allievi').update(compatPayload).eq('id', savedId).select().single())
      }
    } else {
      ;({ data, error } = await sb.from('allievi').insert(payload).select().single())
      if (error && /aggiornato_il|updated_at|schema cache|column|tier/i.test(error.message || error.details || error.hint || '')) {
        const { aggiornato_il, ...compatPayload } = payload
        ;({ data, error } = await sb.from('allievi').insert(compatPayload).select().single())
      }
    }

    if (error) throw error
    const changedFields = savedId ? historyChangedFields(originalAllievo, payload, {
      nome: 'nome',
      cognome: 'cognome',
      nickname: 'nickname',
      tier: 'tier',
      vip: 'VIP',
      blocco_attuale: 'blocco',
      gruppo: 'gruppo',
      data_nascita: 'data nascita',
      data_iscrizione: 'data iscrizione',
      email: 'email',
      telefono: 'telefono',
      note_generali: 'note',
      profilo: 'profilo tecnico'
    }) : []
    logModificaLocale('allievo', data?.id || savedId, savedId ? historyDescription('Aggiornata scheda allievo', changedFields) : 'Creata scheda allievo')

    // Reload lista da DB per sicurezza (evita dati stale in cache)
    const { data: fresh } = await sb.from('allievi').select('*').order('nome')
    allAllievi = fresh || []
    renderAllievi()

    const lessonDraft = loadLezioneDraft()
    if (!savedId && lessonDraft?.editingLezioneId) {
      pendingSpecialGuestId = data?.id || null
      showView('nuova-lezione', `lezione:${lessonDraft.editingLezioneId}`)
      return
    }

    if (savedId) {
      const destination = editReturnTarget
      editReturnTarget = null
      await goToReturnTarget(destination, { name: 'scheda', id: savedId })
    } else {
      editReturnTarget = null
      showView('allievi')
    }
  } catch (e) {
    errEl.textContent = saveErrorMessage(e)
    errEl.classList.add('show')
    btn.disabled = false;    btn.textContent    = labelOrig
    btnTop.disabled = false; btnTop.textContent = labelOrig
  } finally {
    if (!btn.disabled) return   // già resettato nel catch
    btn.disabled = false;    btn.textContent    = labelOrig
    btnTop.disabled = false; btnTop.textContent = labelOrig
  }
}

// ── Nuovo gruppo ─────────────────────────────────────────────────────

function initNuovoGruppo(nomeGruppo = null) {
  editingGruppoNome = nomeGruppo || null
  const membri = editingGruppoNome ? gruppoMembri(editingGruppoNome, { includeArchived: true }) : []
  const profilo = profiloComuneGruppo(membri)
  document.getElementById('gr-title').textContent = editingGruppoNome ? `Modifica gruppo — ${editingGruppoNome}` : 'Nuovo gruppo'
  document.getElementById('btn-salva-gr').textContent = editingGruppoNome ? 'Aggiorna gruppo' : 'Salva gruppo'
  document.getElementById('btn-salva-gr-top').textContent = editingGruppoNome ? 'Aggiorna gruppo' : 'Salva gruppo'
  document.getElementById('btn-cancella-gr').hidden = !editingGruppoNome
  document.getElementById('gr-nome').value = editingGruppoNome || ''
  document.getElementById('gr-orario').value = profilo.appuntamento || ''
  document.getElementById('gr-luogo').value = profilo.luogo_incontro || ''
  document.getElementById('gr-durata').value = profilo.durata_lezione || ''
  document.getElementById('gr-compenso').value = profilo.compenso || ''
  document.getElementById('gr-in-vacanza').checked = !!profilo.in_vacanza
  document.getElementById('gr-archiviato').checked = !!(membri.length && membri.every(a => a.stato === 'archiviato'))
  document.getElementById('gr-pagamento-metodo').value = profilo.pagamento_metodo || ''
  document.getElementById('gr-pagamento-stato').value = profilo.pagamento_stato || ''
  document.getElementById('gr-pagamento-note').value = profilo.pagamento_note || ''
  document.getElementById('gr-err').classList.remove('show')
  document.getElementById('gr-allievi').innerHTML = ''
  if (membri.length) membri.forEach(a => aggiungiAllievoGruppo(false, a))
  if (!membri.length) aggiungiAllievoGruppo()
  toggleAggiungiAllievoGruppoPanel(false)
  renderExistingAllieviGruppoPicker()
}

function aggiornaNumeriAllieviGruppo() {
  document.querySelectorAll('#gr-allievi .group-student').forEach((card, i) => {
    card.dataset.index = String(i + 1)
    aggiornaTitoloAllievoGruppo(card)
  })
}

function aggiungiAllievoGruppo(open = false, data = null) {
  const container = document.getElementById('gr-allievi')
  const card = document.createElement('div')
  card.className = `group-student${open ? ' is-open' : ''}`
  card.dataset.saved = data ? '1' : '0'
  if (data?.id) card.dataset.allievoId = data.id
  const profilo = data?.profilo || {}
  card.innerHTML = `
    <button type="button" class="group-student-head" onclick="toggleAllievoGruppo(this)">
      <span class="group-student-title">Allievo</span>
      <span class="group-student-actions">
        <span class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="event.stopPropagation(); this.closest('.group-student').remove(); aggiornaNumeriAllieviGruppo(); renderExistingAllieviGruppoPicker()">✕</span>
      </span>
    </button>
    <div class="group-student-body">
      <div class="form-grid3">
        <div class="field"><label>Nome *</label><input type="text" class="gr-al-nome" placeholder="Nome" value="${esc(data?.nome || '')}" oninput="segnaAllievoGruppoDaSalvare(this)"></div>
        <div class="field"><label>Cognome *</label><input type="text" class="gr-al-cognome" placeholder="Cognome" value="${esc(data?.cognome || '')}" oninput="segnaAllievoGruppoDaSalvare(this)"></div>
        <div class="field"><label>Nick</label><input type="text" class="gr-al-nick" placeholder="Nickname" value="${esc(data?.nickname || '')}" oninput="segnaAllievoGruppoDaSalvare(this)"></div>
      </div>
      <div class="referenti-head">
        <div style="font-size:.78rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em">Referenti</div>
        <button class="btn btn-outline btn-sm" onclick="aggiungiReferenteGruppo(this, true)" type="button">+ Aggiungi referente</button>
      </div>
      <div class="referenti-list"></div>
      <div class="field" style="margin-top:.85rem;margin-bottom:0">
        <label>Note allievo</label>
        <textarea class="gr-al-note" placeholder="Note specifiche per questo allievo…" oninput="segnaAllievoGruppoDaSalvare(this)">${esc(data?.note_generali || '')}</textarea>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:.85rem">
        <button class="btn btn-primary btn-sm" onclick="salvaTabAllievoGruppo(this)" type="button">Salva</button>
      </div>
    </div>`
  container.appendChild(card)
  const familiari = Array.isArray(profilo.familiari) ? profilo.familiari : []
  if (familiari.length) familiari.forEach(ref => aggiungiReferenteGruppo(card.querySelector('.referenti-head .btn-outline'), false, ref))
  else aggiungiReferenteGruppo(card.querySelector('.referenti-head .btn-outline'), false)
  if (data) card.classList.add('is-saved')
  aggiornaNumeriAllieviGruppo()
  renderExistingAllieviGruppoPicker()
}

function allieviIdsGiaNelFormGruppo() {
  return new Set([...document.querySelectorAll('#gr-allievi .group-student')]
    .map(row => row.dataset.allievoId)
    .filter(Boolean))
}

function toggleAggiungiAllievoGruppoPanel(force = null) {
  const panel = document.getElementById('gr-add-panel')
  if (!panel) return
  panel.hidden = force === null ? !panel.hidden : !force
  if (!panel.hidden) renderExistingAllieviGruppoPicker()
}

function aggiungiNuovoAllievoGruppoDaPanel() {
  aggiungiAllievoGruppo(true)
  toggleAggiungiAllievoGruppoPanel(false)
}

function renderExistingAllieviGruppoPicker() {
  const sel = document.getElementById('gr-existing-allievo')
  if (!sel) return
  const selected = allieviIdsGiaNelFormGruppo()
  const candidates = ordinaAllieviLista(allieviVisibiliGod()
    .filter(a => a.stato !== 'archiviato')
    .filter(a => !selected.has(String(a.id))))
  sel.innerHTML = `
    <option value="">— Scegli allievo —</option>
    ${candidates.map(a => {
      const meta = [a.cognome, a.nickname ? `(${a.nickname})` : '', a.gruppo ? `· ${a.gruppo}` : ''].filter(Boolean).join(' ')
      return `<option value="${esc(a.id)}">${esc(a.nome)}${meta ? ` ${esc(meta)}` : ''}</option>`
    }).join('')}`
  sel.disabled = !candidates.length
}

function aggiungiAllievoEsistenteGruppo() {
  const sel = document.getElementById('gr-existing-allievo')
  const errEl = document.getElementById('gr-err')
  const id = sel?.value || ''
  if (!id) {
    if (errEl) {
      errEl.textContent = 'Scegli un allievo già registrato da aggiungere al gruppo.'
      errEl.classList.add('show')
    }
    return
  }
  const allievo = allAllievi.find(a => String(a.id) === String(id))
  if (!allievo) return
  if (errEl) errEl.classList.remove('show')
  aggiungiAllievoGruppo(false, allievo)
  if (sel) sel.value = ''
  renderExistingAllieviGruppoPicker()
  toggleAggiungiAllievoGruppoPanel(false)
}

function toggleAllievoGruppo(head) {
  head.closest('.group-student').classList.toggle('is-open')
}

function segnaAllievoGruppoDaSalvare(el) {
  const card = el.closest('.group-student')
  card.dataset.saved = '0'
  card.classList.remove('is-saved')
  aggiornaTitoloAllievoGruppo(card)
}

function aggiornaTitoloAllievoGruppo(card) {
  const title = card.querySelector('.group-student-title')
  const nome = card.querySelector('.gr-al-nome')?.value.trim() || ''
  const cognome = card.querySelector('.gr-al-cognome')?.value.trim() || ''
  const nick = card.querySelector('.gr-al-nick')?.value.trim() || ''
  const n = card.dataset.index || '1'
  const fullName = [nome, cognome].filter(Boolean).join(' ')
  title.textContent = card.dataset.saved === '1' && fullName
    ? `${fullName}${nick ? ` (${nick})` : ''}`
    : `Allievo ${n}`
}

function salvaTabAllievoGruppo(btn) {
  const card = btn.closest('.group-student')
  const errEl = document.getElementById('gr-err')
  const nome = card.querySelector('.gr-al-nome').value.trim()
  const cognome = card.querySelector('.gr-al-cognome').value.trim()
  errEl.classList.remove('show')

  if (!nome || !cognome) {
    errEl.textContent = 'Per salvare la riga allievo inserisci nome e cognome.'
    errEl.classList.add('show')
    card.classList.add('is-open')
    return
  }

  card.dataset.saved = '1'
  card.classList.add('is-saved')
  card.classList.remove('is-open')
  aggiornaTitoloAllievoGruppo(card)

  const hasEmptyDraft = [...document.querySelectorAll('#gr-allievi .group-student')]
    .some(row => row !== card && row.dataset.saved !== '1' && !leggiAllievoGruppo(row).hasData)
  if (!hasEmptyDraft) aggiungiAllievoGruppo(false)
  aggiornaNumeriAllieviGruppo()
}

function aggiungiReferenteGruppo(btn, open = false, data = null) {
  const student = btn.closest('.group-student')
  const list = student.querySelector('.referenti-list')
  const row = document.createElement('div')
  row.className = `referente-row${open ? ' is-open' : ''}`
  row.dataset.saved = data ? '1' : '0'
  row.innerHTML = `
    <button type="button" class="referente-head" onclick="toggleReferenteGruppo(this)">
      <span class="referente-title">Referente</span>
      <span class="group-student-actions">
        <span class="btn btn-ghost btn-sm" style="padding:.25rem .45rem;color:var(--danger)" onclick="event.stopPropagation(); this.closest('.referente-row').remove()">✕</span>
      </span>
    </button>
    <div class="referente-body">
      <div class="field" style="margin:0"><label>Nome</label><input type="text" class="gr-ref-nome" placeholder="Nome" value="${esc(data?.nome || '')}" oninput="segnaReferenteGruppoDaSalvare(this)"></div>
      <div class="field" style="margin:0"><label>Cognome</label><input type="text" class="gr-ref-cognome" placeholder="Cognome" value="${esc(data?.cognome || '')}" oninput="segnaReferenteGruppoDaSalvare(this)"></div>
      <div class="field" style="margin:0"><label>Relazione</label><input type="text" class="gr-ref-relazione" placeholder="Padre, tata…" value="${esc(data?.relazione || '')}" oninput="segnaReferenteGruppoDaSalvare(this)"></div>
      <div class="field" style="margin:0"><label>Telefono</label><input type="tel" class="gr-ref-telefono" placeholder="+39 …" value="${esc(data?.telefono || '')}" oninput="segnaReferenteGruppoDaSalvare(this)"></div>
      <button type="button" class="btn btn-primary btn-sm" onclick="salvaTabReferenteGruppo(this)">Salva</button>
    </div>`
  list.appendChild(row)
  if (data) row.classList.add('is-saved')
  aggiornaTitoloReferenteGruppo(row)
}

function toggleReferenteGruppo(head) {
  head.closest('.referente-row').classList.toggle('is-open')
}

function segnaReferenteGruppoDaSalvare(el) {
  const row = el.closest('.referente-row')
  row.dataset.saved = '0'
  row.classList.remove('is-saved')
  aggiornaTitoloReferenteGruppo(row)
}

function aggiornaTitoloReferenteGruppo(row) {
  const title = row.querySelector('.referente-title')
  const nome = row.querySelector('.gr-ref-nome')?.value.trim() || ''
  const cognome = row.querySelector('.gr-ref-cognome')?.value.trim() || ''
  const relazione = row.querySelector('.gr-ref-relazione')?.value.trim() || ''
  const telefono = row.querySelector('.gr-ref-telefono')?.value.trim() || ''
  const fullName = [nome, cognome].filter(Boolean).join(' ')
  title.textContent = row.dataset.saved === '1' && (fullName || relazione || telefono)
    ? [fullName, relazione, telefono].filter(Boolean).join(' · ')
    : 'Referente'
}

function salvaTabReferenteGruppo(btn) {
  const row = btn.closest('.referente-row')
  const student = row.closest('.group-student')
  row.dataset.saved = '1'
  row.classList.add('is-saved')
  row.classList.remove('is-open')
  aggiornaTitoloReferenteGruppo(row)

  const hasEmptyDraft = [...student.querySelectorAll('.referente-row')]
    .some(ref => ref !== row && ref.dataset.saved !== '1' && !leggiReferenteGruppo(ref).hasData)
  if (!hasEmptyDraft) aggiungiReferenteGruppo(student.querySelector('.referenti-head .btn-outline'), false)
}

function leggiReferenteGruppo(ref) {
  const referente = {
    nome: ref.querySelector('.gr-ref-nome').value.trim(),
    cognome: ref.querySelector('.gr-ref-cognome').value.trim(),
    relazione: ref.querySelector('.gr-ref-relazione').value.trim(),
    telefono: ref.querySelector('.gr-ref-telefono').value.trim(),
  }
  return {
    referente,
    hasData: referente.nome || referente.cognome || referente.relazione || referente.telefono,
  }
}

function leggiAllievoGruppo(row) {
  const referenti = [...row.querySelectorAll('.referente-row')]
    .map(ref => leggiReferenteGruppo(ref))
    .filter(item => item.hasData)
    .map(item => item.referente)

  const allievo = {
    id: row.dataset.allievoId || null,
    nome: row.querySelector('.gr-al-nome').value.trim(),
    cognome: row.querySelector('.gr-al-cognome').value.trim(),
    nickname: row.querySelector('.gr-al-nick').value.trim(),
    note: row.querySelector('.gr-al-note').value.trim(),
    referenti,
  }

  return {
    allievo,
    hasData: allievo.nome || allievo.cognome || allievo.nickname || allievo.note || allievo.referenti.length,
  }
}

async function salvaGruppo() {
  const nomeGruppo = document.getElementById('gr-nome').value.trim()
  const orario = document.getElementById('gr-orario').value.trim()
  const luogo = document.getElementById('gr-luogo').value.trim()
  const durata = parseInt(document.getElementById('gr-durata').value) || null
  const compenso = parseFloat(document.getElementById('gr-compenso').value) || null
  const inVacanza = !!document.getElementById('gr-in-vacanza')?.checked
  const archiviato = !!document.getElementById('gr-archiviato')?.checked
  const pagamentoMetodo = document.getElementById('gr-pagamento-metodo').value || null
  const pagamentoStato = document.getElementById('gr-pagamento-stato').value || null
  const pagamentoNote = document.getElementById('gr-pagamento-note').value.trim() || null
  const errEl = document.getElementById('gr-err')
  errEl.classList.remove('show')

  if (!nomeGruppo) {
    errEl.textContent = 'Inserisci il nome del gruppo.'
    errEl.classList.add('show')
    return
  }

  const rows = [...document.querySelectorAll('#gr-allievi .group-student')]
  const allievi = rows.map(row => leggiAllievoGruppo(row)).filter(item => item.hasData).map(item => item.allievo)

  if (!editingGruppoNome && !allievi.length) {
    errEl.textContent = 'Aggiungi almeno un allievo al gruppo.'
    errEl.classList.add('show')
    return
  }
  if (allievi.some(a => !a.nome || !a.cognome)) {
    errEl.textContent = 'Per ogni allievo inserisci nome e cognome.'
    errEl.classList.add('show')
    return
  }

  const btn = document.getElementById('btn-salva-gr')
  const btnTop = document.getElementById('btn-salva-gr-top')
  btn.disabled = true; btn.textContent = 'Salvataggio…'
  btnTop.disabled = true; btnTop.textContent = 'Salvataggio…'

  let writeUid = currentUid
  try {
    if (allievi.some(a => !a.id)) writeUid = await requireCurrentUidForWrite(errEl)
  } catch (e) {
    btn.disabled = false; btn.textContent = 'Salva gruppo'
    btnTop.disabled = false; btnTop.textContent = 'Salva gruppo'
    return
  }

  const oggi = localDateIso()
  const commonLogistica = {
    appuntamento: orario || null,
    luogo_incontro: luogo || null,
    durata_lezione: durata,
    compenso,
    pagamento_metodo: pagamentoMetodo,
    pagamento_stato: pagamentoStato,
    pagamento_note: pagamentoNote,
    in_vacanza: inVacanza,
  }
  const commonProfile = {
    ...commonLogistica,
    logistica_gruppo: commonLogistica,
  }

  if (editingGruppoNome) {
    try {
      const membriOriginali = gruppoMembri(editingGruppoNome)
      const keptIds = new Set(allievi.map(a => a.id).filter(Boolean))
      const removedIds = membriOriginali.map(a => a.id).filter(id => !keptIds.has(id))
      if (removedIds.length) {
        const { error: removeError } = await sb.from('allievi').update({ gruppo: null }).in('id', removedIds)
        if (removeError) throw removeError
      }

      for (const a of allievi) {
        if (a.id) {
          const original = allAllievi.find(item => item.id === a.id) || {}
          const payloadUpdate = {
            nome: a.nome,
            cognome: a.cognome,
            nickname: a.nickname || null,
            gruppo: nomeGruppo,
            stato: archiviato ? 'archiviato' : 'attivo',
            note_generali: a.note || null,
            profilo: { ...(original.profilo || {}), ...commonProfile, familiari: a.referenti },
          }
          const { error } = await sb.from('allievi').update(payloadUpdate).eq('id', a.id)
          if (error) throw error
        } else {
          const { error } = await sb.from('allievi').insert({
            nome: a.nome,
            cognome: a.cognome,
            tipo: 'individuale',
            nickname: a.nickname || null,
            vip: false,
            blocco_attuale: 'Base',
            gruppo: nomeGruppo,
            stato: archiviato ? 'archiviato' : 'attivo',
            data_iscrizione: oggi,
            note_generali: a.note || null,
            profilo: { ...commonProfile, tier: 'C', familiari: a.referenti },
            maestro_id: writeUid,
          })
          if (error) throw error
        }
      }

      filtroGruppo = nomeGruppo
      const nextGroup = nomeGruppo
      const destination = editReturnTarget
      editReturnTarget = null
      editingGruppoNome = null
      if (archiviato) {
        mostraArchiviati = true
        filtroListaAllievi = 'archivio'
        filtroGruppo = null
        filtroVacanza = false
        gruppiEspansi.clear()
        await ricaricaAllievi()
        showView('allievi')
        return
      }
      await ricaricaAllievi()
      await goToReturnTarget(destination, { name: 'gruppo', id: nextGroup })
    } catch (e) {
      errEl.textContent = saveErrorMessage(e)
      errEl.classList.add('show')
    } finally {
      btn.disabled = false; btn.textContent = 'Salva gruppo'
      btnTop.disabled = false; btnTop.textContent = 'Salva gruppo'
    }
    return
  }

  try {
    const nuovi = []
    for (const a of allievi) {
      if (a.id) {
        const original = allAllievi.find(item => item.id === a.id) || {}
        const payloadUpdate = {
          nome: a.nome,
          cognome: a.cognome,
          nickname: a.nickname || null,
          gruppo: nomeGruppo,
          stato: archiviato ? 'archiviato' : 'attivo',
          note_generali: a.note || null,
          profilo: { ...(original.profilo || {}), ...commonProfile, familiari: a.referenti },
        }
        const { error } = await sb.from('allievi').update(payloadUpdate).eq('id', a.id)
        if (error) throw error
      } else {
        nuovi.push({
          nome: a.nome,
          cognome: a.cognome,
          tipo: 'individuale',
          nickname: a.nickname || null,
          vip: false,
          blocco_attuale: 'Base',
          gruppo: nomeGruppo,
          stato: archiviato ? 'archiviato' : 'attivo',
          data_iscrizione: oggi,
          note_generali: a.note || null,
          profilo: { ...commonProfile, tier: 'C', familiari: a.referenti },
          maestro_id: writeUid,
        })
      }
    }
    if (nuovi.length) {
      const { error } = await sb.from('allievi').insert(nuovi)
      if (error) throw error
    }
    filtroGruppo = nomeGruppo
    editReturnTarget = null
    if (archiviato) {
      mostraArchiviati = true
      filtroListaAllievi = 'archivio'
      filtroGruppo = null
      filtroVacanza = false
      gruppiEspansi.clear()
      await ricaricaAllievi()
      showView('allievi')
      return
    }
    await ricaricaAllievi()
    showView('gruppo', nomeGruppo)
  } catch (e) {
    errEl.textContent = saveErrorMessage(e)
    errEl.classList.add('show')
  } finally {
    btn.disabled = false; btn.textContent = 'Salva gruppo'
    btnTop.disabled = false; btnTop.textContent = 'Salva gruppo'
  }
}

// ── Scheda gruppo / allievo ───────────────────────────────────────────

function gruppoMembri(nomeGruppo, { includeArchived = false } = {}) {
  return ordinaAllieviLista(allieviVisibiliGod().filter(a => {
    if (a.gruppo !== nomeGruppo) return false
    return includeArchived || a.stato !== 'archiviato'
  }))
}

function profiloComuneGruppo(membri) {
  const profili = membri.map(a => logisticaGruppoProfilo(a.profilo || {}))
  const firstValue = key => profili.find(p => p[key] !== undefined && p[key] !== null && p[key] !== '')?.[key] || ''
  const firstVacationValue = profili.find(p => hasVacationField(p))
  return {
    appuntamento: firstValue('appuntamento'),
    luogo_incontro: firstValue('luogo_incontro'),
    durata_lezione: firstValue('durata_lezione'),
    compenso: firstValue('compenso'),
    pagamento_metodo: firstValue('pagamento_metodo'),
    pagamento_stato: firstValue('pagamento_stato'),
    pagamento_note: firstValue('pagamento_note'),
    in_vacanza: firstVacationValue ? vacationValue(firstVacationValue) : false,
  }
}

async function loadGruppo(nomeGruppo) {
  showView('gruppo')
  currentGruppoNome = nomeGruppo
  recordAppHistory('gruppo', nomeGruppo)
  const el = document.getElementById('gruppo-content')
  el.innerHTML = '<div class="loading">Caricamento…</div>'

  const membriAttivi = gruppoMembri(nomeGruppo)
  const membri = membriAttivi.length ? membriAttivi : gruppoMembri(nomeGruppo, { includeArchived: true })
  const gruppoArchiviato = !membriAttivi.length && membri.length > 0
  if (!membri.length) {
    el.innerHTML = `<button class="back-btn" onclick="showView('allievi')">← Allievi</button><div class="card"><div class="empty">Gruppo non trovato.</div></div>`
    return
  }

  const profilo = profiloComuneGruppo(membri)
  const ids = membri.map(a => a.id)
  let { data: laRows, error: lzErr } = await sb.from('lezioni_allievi')
      .select('lezione_id, lezioni(id, data, tipo, durata_min, luogo, meteo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome)))')
      .in('allievo_id', ids)
  if (isMissingLessonMeteoError(lzErr)) {
    ;({ data: laRows, error: lzErr } = await sb.from('lezioni_allievi')
      .select('lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome)))')
      .in('allievo_id', ids))
  }
  if (isMissingDimensioniError(lzErr)) {
    ;({ data: laRows, error: lzErr } = await sb.from('lezioni_allievi')
      .select('lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, skills(nome)))')
      .in('allievo_id', ids))
  }
  if (isMissingNoteSpecialiError(lzErr)) {
    ;({ data: laRows, error: lzErr } = await sb.from('lezioni_allievi')
      .select('lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, skills(nome)))')
      .in('allievo_id', ids))
    laRows = (laRows || []).map(row => ({
      ...row,
      lezioni: row.lezioni ? { ...row.lezioni, note_speciali: null } : row.lezioni
    }))
  }
  const viste = new Set()
  const lezioniGruppo = (laRows || [])
    .map(row => row.lezioni)
    .filter(Boolean)
    .filter(l => {
      if (viste.has(l.id)) return false
      viste.add(l.id)
      return true
    })
    .sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')))

  const membriHtml = membri.map(a => `
    <div class="gruppo-member-card" onclick="loadScheda('${a.id}')">
      <div>
        <div class="gruppo-member-name">${esc([a.nome, a.cognome].filter(Boolean).join(' '))}${a.nickname ? ` · ${esc(a.nickname)}` : ''}${vacationIconHtml(allievoInVacanza(a))}</div>
        <div class="gruppo-member-meta">Lv ${a.livello_attuale || '—'} · ${esc(a.blocco_attuale || '—')}${allievoInVacanza(a) ? ' · In vacanza' : ''}</div>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); showView('nuovo-allievo','${a.id}')">${editIcon()}</button>
    </div>`).join('')

  const lezioniHtml = lezioniGruppo.length
    ? renderLezioniTable(lezioniGruppo, { variant: 'lista', gruppoNome: nomeGruppo })
    : `<div class="empty">${lzErr ? esc(lzErr.message || 'Errore nel caricamento lezioni gruppo.') : 'Nessuna lezione registrata per questo gruppo.'}</div>`
  const info = (label, val) => val ? `<div><div class="info-label">${esc(label)}</div><div>${esc(String(val))}</div></div>` : ''
  const compenso = profilo.compenso ? `€ ${Number(profilo.compenso).toFixed(2)}` : ''

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">
      <button class="back-btn" onclick="showView('allievi')" style="margin-bottom:0">← Allievi</button>
      <div style="display:flex;gap:.45rem;flex-wrap:wrap">
        ${renderGruppoActionMenu(nomeGruppo, 'gruppo-scheda-actions', { showScheda: false })}
        ${gruppoArchiviato ? '' : `<button class="btn btn-primary btn-sm" onclick="showView('nuova-lezione',${jsArg('gruppo:' + nomeGruppo)})">+ Lezione gruppo</button>`}
      </div>
    </div>

    <div class="card">
      <div class="lezione-read-head">
        <div>
          <div class="lezione-read-title">${esc(nomeGruppo)}${vacationIconHtml(!!profilo.in_vacanza)}</div>
          <div class="scheda-meta">${membri.length} alliev${membri.length === 1 ? 'o' : 'i'} ${gruppoArchiviato ? 'archiviat' : 'attiv'}${membri.length === 1 ? 'o' : 'i'}${profilo.in_vacanza ? ' · In vacanza' : ''}</div>
        </div>
        <div class="lezione-read-when">
          ${profilo.appuntamento ? `<div class="lezione-read-date">${esc(profilo.appuntamento)}</div>` : '<span>Orario non indicato</span>'}
          ${profilo.luogo_incontro ? `<br>${esc(profilo.luogo_incontro)}` : ''}
        </div>
      </div>
    </div>

    <div class="lezione-read-grid">
      <div>
        <p class="sec-title">Membri</p>
        <div class="card"><div class="gruppo-member-list">${membriHtml}</div></div>
      </div>
      <div>
        <p class="sec-title">Logistica gruppo</p>
        <div class="card">
          <div class="info-grid">
            ${info('Appuntamento', profilo.appuntamento)}
            ${info('Durata lezione', profilo.durata_lezione ? profilo.durata_lezione + ' min' : null)}
            ${info('Luogo di incontro', profilo.luogo_incontro)}
            ${info('Compenso', compenso)}
            ${info('Pagamento', [profilo.pagamento_metodo, profilo.pagamento_stato].filter(Boolean).join(' · '))}
            ${info('Note pagamento', profilo.pagamento_note)}
            ${info('Stato lezioni', profilo.in_vacanza ? 'In vacanza' : '')}
          </div>
        </div>
      </div>
    </div>

    <p class="sec-title">Lezioni gruppo${lezioniGruppo.length ? ` (${lezioniGruppo.length})` : ''}</p>
    <div class="card">${lezioniHtml}</div>
  `
  requestAnimationFrame(() => motion.cards(el))
}

// ── Scheda allievo ────────────────────────────────────────────────────

async function loadScheda(id) {
  showView('scheda')
  currentSchedaId = id
  recordAppHistory('scheda', id)
  const prepShortcut = document.getElementById('scheda-prepara-lezione')
  prepShortcut.hidden = false
  prepShortcut.onclick = () => showView('nuova-lezione', `modo:prep:${id}`)
  document.getElementById('scheda-content').innerHTML = '<div class="loading">Caricamento…</div>'

  const allievo = allAllievi.find(a => a.id === id)

  const [{ data: progressiRaw }, { data: laRows }] = await Promise.all([
    sb.from('progressi_allievo')
      .select('skill_id, stadio, data_inizio, data_acquisizione, data_perfezionamento, note_maestro, skills(nome, ramo, livello, blocco)')
      .eq('allievo_id', id),
    sb.from('lezioni_allievi')
      .select('lezione_id')
      .eq('allievo_id', id)
  ])

  const progressiRawVisible = (progressiRaw || []).filter(p => !isFakieSkillName(p.skills?.nome))
  const progressi = progressiRawVisible.filter(p => p.stadio > 0)
  const progressiMap = Object.fromEntries(progressiRawVisible.map(p => [p.skill_id, p.stadio]))
  const fakieProgressMap = fakieProgressMapForAllievo(allievo)

  // Fetch lezioni per questo allievo. Avoid a large `.in(id, [...])` query:
  // heavy imports can easily push the URL past browser/proxy limits.
  let lezioniHtml = '<div class="empty">Nessuna lezione registrata.</div>'
  let lezioniCount = 0
  let lezioniScheda = []
  if (laRows?.length) {
    let { data: lzRows, error: lzErr } = await sb.from('lezioni_allievi')
      .select('lezione_id, lezioni(id, data, tipo, durata_min, luogo, meteo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(allievo_id, stadio_raggiunto, dimensioni, skills(nome)))')
      .eq('allievo_id', id)
    if (isMissingLessonMeteoError(lzErr)) {
      ;({ data: lzRows, error: lzErr } = await sb.from('lezioni_allievi')
        .select('lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(allievo_id, stadio_raggiunto, dimensioni, skills(nome)))')
        .eq('allievo_id', id))
    }
    if (isMissingDimensioniError(lzErr)) {
      ;({ data: lzRows, error: lzErr } = await sb.from('lezioni_allievi')
        .select('lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(allievo_id, stadio_raggiunto, skills(nome)))')
        .eq('allievo_id', id))
    }
    if (isMissingNoteSpecialiError(lzErr)) {
      ;({ data: lzRows, error: lzErr } = await sb.from('lezioni_allievi')
        .select('lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(allievo_id, stadio_raggiunto, skills(nome)))')
        .eq('allievo_id', id))
      lzRows = (lzRows || []).map(row => ({
        ...row,
        lezioni: row.lezioni ? { ...row.lezioni, note_speciali: null } : row.lezioni
      }))
    }

    if (lzErr) {
      lezioniHtml = `<div class="empty">${esc(lzErr.message || 'Errore nel caricamento lezioni.')}</div>`
    } else {
      const lz = (lzRows || [])
        .map(row => row.lezioni)
        .filter(Boolean)
        .sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')))
      lezioniScheda = lz
      lezioniCount = lz.length
      lezioniHtml = renderLezioniTable(lz, { variant: 'scheda', schedaId: id })
    }
  }

  // Raggruppa progressi per ramo
  const byRamo = {}
  ;(progressi || []).forEach(p => {
    const r = skillBranchName(p.skills?.ramo)
    if (!byRamo[r]) byRamo[r] = []
    byRamo[r].push(p)
  })

  const progressiHtml = Object.keys(byRamo).length
    ? Object.entries(byRamo).map(([ramo, rows]) => `
        <p class="ramo" style="margin-bottom:.5rem">${esc(ramo)}</p>
        <div class="table-wrap" style="margin-bottom:1rem">
          <table>
            <thead><tr><th>Skill</th><th>Lv.</th><th>Stadio</th><th>Acquisita</th></tr></thead>
            <tbody>
              ${rows.sort((a,b)=>a.skills.livello-b.skills.livello).map(p => `
                <tr>
                  <td>${esc(p.skills?.nome)}</td>
                  <td>${p.skills?.livello}</td>
                  <td><span class="st st${p.stadio}">${stadioLabel(p.stadio)}</span></td>
                  <td>${p.data_acquisizione ? formatDate(p.data_acquisizione) : '—'}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`).join('')
    : '<div class="empty">Nessuna skill registrata ancora.</div>'

	  const p = allievo.profilo || {}
	  const logisticaScheda = logisticaIndividualeProfilo(p, !!allievo.gruppo)
	  const logisticaGruppoScheda = allievo.gruppo ? profiloComuneGruppo(gruppoMembri(allievo.gruppo)) : {}
	  const addressScheda = visibleAllievoAddress(allievo)
	  const etaScheda = allievoEtaLabel(allievo.data_nascita)

  function dotsRo(val) {
    return [1,2,3].map(i => `<span class="dot-ro${i <= val ? ' filled' : ''}"></span>`).join('')
  }
  function infoRow(label, val, allowHtml = false) {
    if (!val) return ''
    return `<div><div class="info-label">${label}</div><div>${allowHtml ? val : esc(String(val))}</div></div>`
  }

  const famHtml = (p.familiari || []).length
    ? (p.familiari).map(f => `<div style="font-size:.87rem;padding:.3rem 0;border-bottom:1px solid var(--bordo)">
        <strong>${esc([f.nome, f.cognome].filter(Boolean).join(' '))}</strong>${f.relazione ? ` — ${esc(f.relazione)}` : ''}${f.telefono ? ` · <a href="tel:${esc(f.telefono)}" style="color:var(--blu)">${esc(f.telefono)}</a>` : ''}
      </div>`).join('')
    : '<span style="color:var(--muted);font-size:.87rem">Nessun familiare registrato.</span>'

  const compenso  = logisticaScheda.compenso ? '€ ' + Number(logisticaScheda.compenso).toFixed(2) : null
  const compensoGruppo = logisticaGruppoScheda.compenso ? '€ ' + Number(logisticaGruppoScheda.compenso).toFixed(2) : null
  const hasPagamento = !!(compenso || logisticaScheda.pagamento_metodo || logisticaScheda.pagamento_stato || logisticaScheda.pagamento_note)
  const hasLogisticaIndividuale = !!(logisticaScheda.appuntamento || logisticaScheda.luogo_incontro || logisticaScheda.durata_lezione || hasPagamento)
  const hasPagamentoGruppo = !!(compensoGruppo || logisticaGruppoScheda.pagamento_metodo || logisticaGruppoScheda.pagamento_stato || logisticaGruppoScheda.pagamento_note)
  const hasLogisticaGruppo = !!(logisticaGruppoScheda.appuntamento || logisticaGruppoScheda.luogo_incontro || logisticaGruppoScheda.durata_lezione || hasPagamentoGruppo || logisticaGruppoScheda.in_vacanza)
  const isAss     = allievo.tipo === 'associazione'
  const statoVacanza = vacationLabel(allievo)
  const noteLezione = allievoLessonNote(allievo)

  const headerExtra = isAss
    ? `<div class="scheda-meta" style="margin-top:.3rem">
         <span style="background:var(--blu-chiaro);color:var(--blu);font-size:.75rem;font-weight:700;padding:.15rem .5rem;border-radius:4px;text-transform:uppercase">Associazione</span>
         ${p.categoria_accompagnatori ? `<span style="margin-left:.5rem;color:var(--muted);font-size:.87rem">${esc(p.categoria_accompagnatori)}</span>` : ''}
       </div>`
	    : `<div class="scheda-meta" style="margin-bottom:0">
	         Livello ${allievo.livello_attuale} · ${esc(allievo.blocco_attuale)}
	         ${allievo.data_nascita ? ` · Nato il ${formatDate(allievo.data_nascita)}${etaScheda ? ` · ${esc(etaScheda)}` : ''}` : ''}
	       </div>`

  document.getElementById('scheda-content').innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap">
        <div>
          <div class="scheda-nome">
            ${esc(allievo.nome)}${!isAss && allievo.cognome ? ' ' + esc(allievo.cognome) : ''}${allievo.nickname ? ` <span style="font-size:1rem;color:var(--muted);font-weight:400">"${esc(allievo.nickname)}"</span>` : ''}${allievoTier(allievo) === 'VIP' ? ' <span class="vip-star">★</span>' : ''}${vacationIconHtml(!!statoVacanza)}
          </div>
          ${headerExtra}
       </div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap">
          <div class="inline-action-menu">
            <button class="btn btn-outline btn-sm" onclick="toggleActionMenu('scheda-actions-${id}', event)" type="button">Azioni</button>
            <div class="inline-action-panel" id="scheda-actions-${id}" hidden>
              <button class="btn btn-ghost btn-sm" onclick="showView('nuovo-allievo','${id}')">${editIcon()} Modifica</button>
              ${canShareAllievo(allievo) ? `<button class="btn btn-ghost btn-sm" onclick="apriCondividiAllievo('${id}')">Condividi</button>` : ''}
              <button class="btn btn-ghost btn-sm" onclick="toggleVacanzaAllievo('${id}')">${allievoInVacanzaDiretta(allievo) ? 'Togli vacanza' : 'Metti in vacanza'}</button>
              <button class="btn btn-ghost btn-sm" onclick="eliminaAllievo('${id}')">${allievo.stato === 'archiviato' ? 'Elimina definitivamente' : 'Archivia'}</button>
              <button class="btn btn-ghost btn-sm" onclick="esportaAllievo('${id}')">JSON</button>
              <button class="btn btn-ghost btn-sm" onclick="stampaScheda('${id}')">Stampa</button>
              <button class="btn btn-ghost btn-sm" onclick="openHistoryModal('allievo','${id}',${jsArg(`Storico ${allievoDisplayName(id)}`)})">Storico</button>
              ${allievoUpdatedAt(allievo) ? `<div class="inline-action-meta">Ultima modifica<br><strong>${esc(formatDateTime(allievoUpdatedAt(allievo)))}</strong></div>` : '<div class="inline-action-meta">Ultima modifica non disponibile</div>'}
            </div>
          </div>
        </div>
      </div>
      ${!isAss ? `<div class="scheda-lesson-note"><span>Promemoria lezione</span>${noteLezione ? esc(noteLezione) : '<span style="color:var(--muted);font-weight:600;text-transform:none;letter-spacing:0">Nessuna nota impostata.</span>'}</div>` : ''}
      ${!isAss && allievo.note_generali ? `<p style="font-size:.88rem;color:var(--muted);margin-top:.6rem">${esc(allievo.note_generali)}</p>` : ''}
    </div>

    ${!isAss ? `
    <div class="scheda-tabs">
      <button class="scheda-tab active" data-tab="profilo" onclick="switchSchedaTab('profilo')">Profilo</button>
      <button class="scheda-tab" data-tab="skill-tree" onclick="switchSchedaTab('skill-tree')">Skill Tree</button>
      <button class="scheda-tab" data-tab="lezioni" onclick="switchSchedaTab('lezioni')">Lezioni</button>
    </div>

    <div id="scheda-panel-profilo" class="scheda-panel active">
      <p class="sec-title">Contatti</p>
      <div class="card">
        ${(p.familiari||[]).length ? `<div style="margin-bottom:.75rem"><div class="info-label" style="margin-bottom:.3rem">Familiari / Tutori</div>${famHtml}</div>` : ''}
        <div class="info-grid">
          ${infoRow('Email', allievo.email ? `<a href="mailto:${esc(allievo.email)}" style="color:var(--blu)">${esc(allievo.email)}</a>` : null, true)}
	          ${infoRow('Telefono', allievo.telefono ? `<a href="tel:${esc(allievo.telefono)}" style="color:var(--blu)">${esc(allievo.telefono)}</a>` : null, true)}
	          ${infoRow('Iscritto il', allievo.data_iscrizione ? formatDate(allievo.data_iscrizione) : null)}
	          ${infoRow('Età', etaScheda)}
	          ${infoRow('Indirizzo', addressScheda.indirizzo)}
          ${infoRow('Casa', addressScheda.casa)}
          ${parseMapCoordinate(addressScheda.casa_latitudine) !== null && parseMapCoordinate(addressScheda.casa_longitudine) !== null ? infoRow('GPS casa', `${formatMapCoordinate(addressScheda.casa_latitudine)}, ${formatMapCoordinate(addressScheda.casa_longitudine)}`) : ''}
          ${p.indirizzo_condiviso ? infoRow('Privacy indirizzo', 'Condiviso con altri maestri') : ''}
          ${infoRow('Cultura / lingua', p.cultura)}
          ${infoRow('Gruppo', allievo.gruppo)}
          ${infoRow('Stato lezioni', statoVacanza)}
        </div>
      </div>

      ${p.note_salute ? `
      <p class="sec-title">Salute e attenzioni</p>
      <div class="card"><div class="lezione-read-note">${esc(p.note_salute)}</div></div>` : ''}

      ${(hasLogisticaIndividuale || hasLogisticaGruppo) ? `
      <p class="sec-title">Logistica</p>
      ${hasLogisticaIndividuale ? `
      <div class="card">
        ${allievo.gruppo ? '<div class="info-label" style="margin-bottom:.45rem">Lezioni individuali</div>' : ''}
        <div class="info-grid">
          ${infoRow('Appuntamento', logisticaScheda.appuntamento)}
          ${infoRow('Durata lezione', logisticaScheda.durata_lezione ? logisticaScheda.durata_lezione + ' min' : null)}
          ${infoRow('Luogo di incontro', logisticaScheda.luogo_incontro)}
          ${infoRow('Compenso lezione', compenso)}
          ${infoRow('Metodo pagamento', logisticaScheda.pagamento_metodo)}
          ${infoRow('Stato pagamento', logisticaScheda.pagamento_stato)}
          ${infoRow('Note pagamento', logisticaScheda.pagamento_note)}
        </div>
      </div>` : ''}
      ${hasLogisticaGruppo ? `
      <div class="card">
        <div class="info-label" style="margin-bottom:.45rem">Lezioni di gruppo${allievo.gruppo ? ` · ${esc(allievo.gruppo)}` : ''}</div>
        <div class="info-grid">
          ${infoRow('Appuntamento', logisticaGruppoScheda.appuntamento)}
          ${infoRow('Durata lezione', logisticaGruppoScheda.durata_lezione ? logisticaGruppoScheda.durata_lezione + ' min' : null)}
          ${infoRow('Luogo di incontro', logisticaGruppoScheda.luogo_incontro)}
          ${infoRow('Compenso lezione', compensoGruppo)}
          ${infoRow('Metodo pagamento', logisticaGruppoScheda.pagamento_metodo)}
          ${infoRow('Stato pagamento', logisticaGruppoScheda.pagamento_stato)}
          ${infoRow('Note pagamento', logisticaGruppoScheda.pagamento_note)}
          ${infoRow('Stato lezioni', logisticaGruppoScheda.in_vacanza ? 'In vacanza' : '')}
        </div>
      </div>` : ''}
      ` : ''}

      <p class="sec-title">Profilo psicomotorio</p>
      <div class="card">
        <div class="psy-grid">
          <div>
            <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:.6rem">Capacità motorie</div>
            <div class="psy-col">
              <div class="psy-row"><div class="info-label">Coordinazione</div><div class="psy-dots">${dotsRo(p.capacita?.coordinazione||0)}</div></div>
              <div class="psy-row"><div class="info-label">Propriocezione</div><div class="psy-dots">${dotsRo(p.capacita?.propriocezione||0)}</div></div>
              <div class="psy-row"><div class="info-label">Vel. apprendimento</div><div class="psy-dots">${dotsRo(p.capacita?.velocita_apprendimento||0)}</div></div>
              <div class="psy-row"><div class="info-label">Bilateralità</div><div class="psy-dots">${dotsRo(p.capacita?.bilateralita||0)}</div></div>
            </div>
          </div>
          <div>
            <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:.6rem">Canale di apprendimento</div>
            <div class="psy-col">
              <div class="psy-row"><div class="info-label">Visivo</div><div class="psy-dots">${dotsRo(p.apprendimento?.visivo||0)}</div></div>
              <div class="psy-row"><div class="info-label">Teorico</div><div class="psy-dots">${dotsRo(p.apprendimento?.teorico||0)}</div></div>
              <div class="psy-row"><div class="info-label">Pratico</div><div class="psy-dots">${dotsRo(p.apprendimento?.pratico||0)}</div></div>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid var(--bordo);margin-top:1rem;padding-top:1rem">
          <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:.6rem">Profilo tecnico</div>
          <div class="info-grid">
            ${infoRow('Lato dominante', p.lato_dominante)}
            ${infoRow('Competenze iniziali', p.competenze)}
            ${infoRow('Sport praticati', p.sport)}
            ${infoRow('Talenti / Punti di forza', p.talenti)}
            ${infoRow('Paure / Blocchi', p.paure)}
            ${infoRow('Equipaggiamento', p.equipaggiamento)}
            ${infoRow('Obiettivi', p.obiettivi)}
          </div>
        </div>
      </div>

      <p class="sec-title">Progressi skill</p>
      ${progressiHtml}
    </div>

    <div id="scheda-panel-skill-tree" class="scheda-panel">
      <div class="card">
        ${renderSkillTree(allSkills, progressiMap, id, fakieProgressMap)}
      </div>
    </div>

    <div id="scheda-panel-lezioni" class="scheda-panel">
      <div class="lesson-years-tools">
        <p class="sec-title" style="margin:0">Lezioni registrate${lezioniCount ? ` (${lezioniCount})` : ''}</p>
      </div>
      <div class="card">${lezioniHtml}</div>
    </div>` : ''}
  `
  requestAnimationFrame(() => motion.cards(document.getElementById('scheda-content')))
}

function switchSchedaTab(name) {
  document.querySelectorAll('.scheda-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === name))
  document.querySelectorAll('.scheda-panel').forEach(p => p.classList.toggle('active', p.id === 'scheda-panel-' + name))
  requestAnimationFrame(() => motion.cards(document.getElementById('scheda-panel-' + name)))
}

function renderSkillsCatalog() {
  const el = document.getElementById('skills-catalog-content')
  if (!el) return
  const total = allSkills?.length || 0
  const required = (allSkills || []).filter(skill => skill.obbligatoria).length
  const preferredBranches = ['Equilibrio', 'Andatura', 'Frenata', 'Rotazione', 'Air', 'Extra']
  const foundBranches = [...new Set((allSkills || []).map(skill => skillBranchName(skill.ramo)))]
  const branches = preferredBranches.filter(branch => branch === 'Extra' || foundBranches.includes(branch))
  catalogSkillBranchFilters.forEach(branch => {
    if (!branches.includes(branch)) catalogSkillBranchFilters.delete(branch)
  })
  el.innerHTML = `
    <div class="skill-tree-head">
      <div class="skill-tree-legend">
        <span style="font-weight:700;color:var(--testo)">${total} skill catalogo</span>
        <span>${required} nodi chiave</span>
        <span>${allPrereqs?.length || 0} prerequisiti</span>
      </div>
      <div class="skill-tree-actions">
        <div class="skill-catalog-filter" aria-label="Filtra per ramo">
          <button type="button" class="chip${catalogSkillBranchFilters.size === 0 ? ' chip-on' : ''}" aria-pressed="${catalogSkillBranchFilters.size === 0}" onclick="setCatalogSkillBranchFilter('all')">Tutti</button>
          <div class="skill-catalog-branch-buttons">
            ${branches.map(branch => `<button type="button" class="chip${catalogSkillBranchFilters.has(branch) ? ' chip-on' : ''}" aria-pressed="${catalogSkillBranchFilters.has(branch)}" onclick="toggleCatalogSkillBranchFilter(${jsArg(branch)})">${esc(branch)}</button>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div id="skills-catalog-status" class="msg" style="display:none"></div>
    ${renderCatalogSkillTree(catalogSkillBranchFilters)}`
  const btn = document.getElementById('skills-edit-toggle')
  if (btn) {
    btn.textContent = catalogSkillEditMode ? 'Fine modifica' : 'Modifica catalogo'
    btn.classList.toggle('btn-primary', catalogSkillEditMode)
    btn.classList.toggle('btn-outline', !catalogSkillEditMode)
  }
  requestAnimationFrame(() => motion.cards(el))
}

function setCatalogSkillBranchFilter(branch) {
  if (!branch || branch === 'all') catalogSkillBranchFilters.clear()
  renderSkillsCatalog()
}

function toggleCatalogSkillBranchFilter(branch) {
  if (!branch) return
  if (catalogSkillBranchFilters.has(branch)) catalogSkillBranchFilters.delete(branch)
  else catalogSkillBranchFilters.add(branch)
  renderSkillsCatalog()
}

function setCatalogSkillEditMode(on) {
  catalogSkillEditMode = !!on
  renderSkillsCatalog()
}

function renderCatalogSkillTree(branchFilters = new Set()) {
  const RAMI = ['Equilibrio', 'Andatura', 'Frenata', 'Rotazione', 'Air', 'Extra']
  const byRamo = { Equilibrio: [], Andatura: [], Frenata: [], Rotazione: [], Air: [], Extra: [] }
  ;(allSkills || []).forEach(skill => {
    const ramo = skillBranchName(skill.ramo)
    byRamo[ramo].push(skill)
  })
  const cols = RAMI.filter(ramo => byRamo[ramo].length && (!branchFilters.size || branchFilters.has(ramo)))
  if (!cols.length) return '<div class="empty">Nessuna skill nel catalogo.</div>'

  const colsHtml = cols.map(ramo => {
    const nodes = byRamo[ramo]
      .sort((a, b) => Number(a.livello || 0) - Number(b.livello || 0) || String(a.nome || '').localeCompare(String(b.nome || ''), 'it', { sensitivity: 'base' }))
      .map(skill => {
        const reqCount = allPrereqs.filter(row => row.skill_id === skill.id).length
        const unlockCount = allPrereqs.filter(row => row.richiede_skill_id === skill.id).length
        const variantInfo = variantParentInfoForSkill(skill)
        const nodeClass = [skill.obbligatoria ? 'sn2' : 'sn0', variantInfo ? 'variant' : ''].filter(Boolean).join(' ')
        return `<div class="skill-node ${nodeClass}" data-skill-id="${skill.id}" onclick="openSkillDetailModal('${skill.id}')">
          <div class="skill-node-main">
            <span class="sn-icon" style="${skill.obbligatoria ? 'color:var(--blu)' : 'color:var(--muted)'}">${skill.obbligatoria ? '●' : '○'}</span>
            <span class="sn-name">${esc(skill.nome)}</span>
            <span class="sn-lv">Lv ${esc(skill.livello || '-')}</span>
          </div>
          <div class="skill-node-tracks">
            <span class="skill-track-btn">${esc(openClosedLabel(skill.open_closed) || 'Open/Closed n.d.')}</span>
            ${variantInfo ? `<span class="skill-track-btn">Variante di ${esc(variantInfo.parentSkill?.nome || variantInfo.parentName || '-')}</span>` : ''}
            <span class="skill-track-btn">Req ${reqCount}</span>
            <span class="skill-track-btn">Sblocca ${unlockCount}</span>
          </div>
          ${catalogSkillEditMode ? `<button type="button" class="skill-delete-btn" title="Cancella skill" onclick="event.stopPropagation(); openSkillCatalogModal('catalog', null, '${skill.id}')">×</button>` : ''}
        </div>`
      }).join('')
    return `<div><div class="skill-col-header">${esc(ramo)}</div>${nodes}</div>`
  }).join('')

  return `<div class="skill-tree-wrap${catalogSkillEditMode ? ' is-editing' : ''}">${colsHtml}</div>`
}

function renderSkillTree(allSkills, progressiMap, allievoId, fakieProgressMap = {}) {
  const RAMI = ['Equilibrio', 'Andatura', 'Frenata', 'Rotazione', 'Air', 'Extra']
  const ICONS = ['○', '◐', '●', '★']
  const ICON_COLORS = ['color:var(--muted)', 'color:#facc15', 'color:var(--blu)', 'color:var(--success)']

  const byRamo = { Equilibrio: [], Andatura: [], Frenata: [], Rotazione: [], Air: [], Extra: [] }
  ;(allSkills || []).forEach(s => {
    const r = skillBranchName(s.ramo)
    byRamo[r].push(s)
  })

  const cols = RAMI.filter(r => byRamo[r].length)
  const acquired = (allSkills || []).filter(s => (progressiMap[s.id] ?? 0) >= 2).length
  const total = allSkills?.length ?? 0
  const pct = total ? Math.round(acquired / total * 100) : 0

  const head = `
    <div class="skill-tree-head">
      <div class="skill-tree-legend">
        <span><span style="color:var(--muted)">○</span> Non iniziata</span>
        <span><span style="color:#facc15">◐</span> In corso</span>
        <span><span style="color:var(--blu)">●</span> Raffinamento</span>
        <span><span style="color:var(--success)">★</span> Completata</span>
        <span style="font-weight:700;color:var(--testo)">${acquired}/${total} acquisite · ${pct}%</span>
      </div>
      <div class="skill-tree-actions">
        ${skillTreeEditMode
          ? `<button type="button" class="btn btn-outline btn-sm" onclick="setSkillTreeEditMode('${allievoId}',false)">Annulla</button>
             <button type="button" class="btn btn-outline btn-sm" onclick="openSkillCatalogModal('tree')">+ Skill</button>
             <button type="button" class="btn btn-primary btn-sm" onclick="salvaSkillTreeManuale('${allievoId}')">Salva skill tree</button>`
          : `<button type="button" class="btn btn-outline btn-sm" onclick="setSkillTreeEditMode('${allievoId}',true)">${editIcon()} Modifica manualmente</button>`}
      </div>
    </div>`

  const colsHtml = cols.map(ramo => {
    const nodes = byRamo[ramo].map(s => {
      const stadio = progressiMap[s.id] ?? 0
      const fakieStadio = Number(fakieProgressMap[s.id]?.stadio || 0)
      const nodeStadio = Math.max(stadio, fakieStadio)
      const variantInfo = variantParentInfoForSkill(s)
      return `<div class="skill-node sn${nodeStadio}${variantInfo ? ' variant' : ''}" data-skill-id="${s.id}" data-current-stadio="${stadio}" data-stadio="${stadio}" data-current-fakie-stadio="${fakieStadio}" data-fakie-stadio="${fakieStadio}" onclick="openSkillDetailFromNode(this)">
        <div class="skill-node-main">
          <span class="sn-icon" style="${ICON_COLORS[nodeStadio]}">${ICONS[nodeStadio]}</span>
          <span class="sn-name">${esc(s.nome)}</span>
          <span class="sn-lv">Lv ${s.livello}</span>
        </div>
        <div class="skill-node-tracks">
          ${renderSkillTrackButton('frontale', stadio, skillTreeEditMode)}
          ${renderSkillTrackButton('fakie', fakieStadio, skillTreeEditMode)}
          ${variantInfo ? `<span class="skill-track-btn">Variante</span>` : ''}
        </div>
        ${skillTreeEditMode ? `<button type="button" class="skill-delete-btn" title="Cancella skill" onclick="event.stopPropagation(); openSkillCatalogModal('tree', null, '${s.id}')">×</button>` : ''}
      </div>`
    }).join('')
    return `<div><div class="skill-col-header">${esc(ramo)}</div>${nodes}</div>`
  }).join('')

  return `
    ${head}
    <div id="skill-tree-status" class="msg" style="display:none"></div>
    <div class="skill-tree-wrap${skillTreeEditMode ? ' is-editing' : ''}">
      ${colsHtml}
    </div>`
}

function renderSkillTrackButton(track, stadio, editable) {
  const label = track === 'fakie' ? 'Fakie' : 'Frontale'
  const text = `${label} ${stadio ? stadio : '-'}`
  return `<button type="button" class="skill-track-btn sn${stadio}" data-track="${track}" ${editable ? 'onclick="event.stopPropagation(); toggleSkillTreeTrack(this)"' : 'disabled'}>${text}</button>`
}

function toggleSkillTreeTrack(btn) {
  const node = btn.closest('.skill-node')
  const track = btn.dataset.track || 'frontale'
  const key = track === 'fakie' ? 'fakieStadio' : 'stadio'
  const next = ((parseInt(node.dataset[key] || '0', 10) || 0) + 1) % 4
  node.dataset[key] = String(next)
  btn.textContent = `${track === 'fakie' ? 'Fakie' : 'Frontale'} ${next ? next : '-'}`
  btn.classList.remove('sn0', 'sn1', 'sn2', 'sn3')
  btn.classList.add(`sn${next}`)
  updateSkillTreeNodeVisual(node)
}

function updateSkillTreeNodeVisual(node) {
  const icons = ['○', '◐', '●', '★']
  const iconColors = ['color:var(--muted)', 'color:#facc15', 'color:var(--blu)', 'color:var(--success)']
  const next = Math.max(parseInt(node.dataset.stadio || '0', 10) || 0, parseInt(node.dataset.fakieStadio || '0', 10) || 0)
  node.classList.remove('sn0', 'sn1', 'sn2', 'sn3')
  node.classList.add(`sn${next}`)
  const icon = node.querySelector('.sn-icon')
  if (icon) {
    icon.textContent = icons[next]
    icon.setAttribute('style', iconColors[next])
  }
}

function stageLabelShort(stadio) {
  return stadio ? stadioLabel(stadio) : 'Non iniziata'
}

function skillDetailMeta(skill) {
  return [
    skillBranchName(skill.ramo),
    skill.blocco,
    skill.livello ? `Livello ${skill.livello}` : '',
    openClosedLabel(skill.open_closed),
    skill.obbligatoria ? 'Obbligatoria' : '',
    isVariantSkill(skill) ? 'Variante' : '',
  ].filter(Boolean)
}

function openClosedLabel(value) {
  const raw = String(value || '').toUpperCase()
  if (raw === 'CLOSED') return 'Closed: gesto definito'
  if (raw === 'OPEN') return 'Open: adattiva'
  return value || ''
}

function openClosedHelp(value) {
  const raw = String(value || '').toUpperCase()
  if (raw === 'CLOSED') return 'Closed significa che la skill ha una forma abbastanza precisa: partenza, gesto e criterio di riuscita sono chiari.'
  if (raw === 'OPEN') return 'Open significa che la skill si adatta molto al contesto: velocita, spazio, traiettoria o lettura della situazione contano piu di una forma unica.'
  return ''
}

function skillCharacteristicTags(skill) {
  const tags = []
  const nature = openClosedLabel(skill.open_closed)
  if (nature) tags.push(nature)
  if (skill.obbligatoria) tags.push('Nodo chiave')
  if (skill.lato_sx_nome || skill.lato_dx_nome) tags.push('Lavoro per lato')
  const params = declaredParamSnapshot(skill)
  params
    .filter(([, value,, declared]) => declared && value !== 'Non dichiarato')
    .forEach(([label, value]) => tags.push(`${label}: ${value}`))
  const hasAsimmetria = params.some(([, value, key, declared]) => key === 'asimmetria' && declared && value !== 'Non dichiarato')
  if (!hasAsimmetria && skill.e_bilaterale) tags.push('Asimmetria: Bilateralita richiesta')
  return [...new Set(tags)]
}

function renderSkillCharacteristicTags(skill) {
  const tags = skillCharacteristicTags(skill)
  if (!tags.length) return '<div class="empty">Nessuna caratteristica registrata.</div>'
  return `<div class="skill-characteristics">${tags.map(tag => `<span class="skill-characteristic">${esc(tag)}</span>`).join('')}</div>`
}

function splitVariantText(value) {
  return String(value || '')
    .split(/\n|,/)
    .map(item => item.trim())
    .filter(Boolean)
}

function skillVariants(skill) {
  const explicit = Array.isArray(skill.varianti) ? skill.varianti : []
  const fromDescription = String(skill.descrizione || '').match(/Varianti:\s*([^.\n]+)/i)
  return [...new Set([
    ...explicit,
    ...(fromDescription ? splitVariantText(fromDescription[1]) : []),
  ].map(item => String(item).trim()).filter(Boolean))]
}

function renderSkillVariants(skill) {
  const variants = skillVariants(skill)
  if (!variants.length) return '<div class="empty">Nessuna variante registrata.</div>'
  return `<div class="skill-characteristics">${variants.map(variant => `<span class="skill-characteristic">${esc(variant)}</span>`).join('')}</div>`
}

function skillDefinitionForSkill(skill) {
  if (!skill) return null
  const skillName = normalizeText(skill.nome)
  return (skillDefinitions || []).find(def =>
    (def.skill_id && String(def.skill_id) === String(skill.id)) ||
    normalizeText(def.skill_nome) === skillName
  ) || null
}

function variantMotherName(def) {
  return def?.variante_match?.skill_nome || def?.variante_di || ''
}

function variantMotherSkillId(def) {
  return def?.variante_match?.skill_id || null
}

function findSkillByDefinition(def) {
  if (!def) return null
  if (def.skill_id) {
    const byId = allSkills.find(skill => String(skill.id) === String(def.skill_id))
    if (byId) return byId
  }
  const name = normalizeText(def.skill_nome)
  return allSkills.find(skill => normalizeText(skill.nome) === name) || null
}

function variantParentInfoForSkill(skill) {
  const def = skillDefinitionForSkill(skill)
  if (!def?.e_variante) return null
  const parentId = variantMotherSkillId(def)
  const parentName = variantMotherName(def)
  const parentSkill = parentId
    ? allSkills.find(row => String(row.id) === String(parentId))
    : allSkills.find(row => normalizeText(row.nome) === normalizeText(parentName))
  return { def, parentSkill, parentName }
}

function variantChildrenForSkill(skill) {
  if (!skill) return []
  const targetId = String(skill.id)
  const targetName = normalizeText(skill.nome)
  return (skillDefinitions || [])
    .filter(def => def.e_variante)
    .filter(def => {
      const parentId = variantMotherSkillId(def)
      const parentName = variantMotherName(def)
      return (parentId && String(parentId) === targetId) || normalizeText(parentName) === targetName
    })
    .map(def => ({ def, skill: findSkillByDefinition(def) }))
    .filter(row => row.skill?.id !== skill.id)
    .sort((a, b) => String(a.skill?.nome || a.def.skill_nome || '').localeCompare(String(b.skill?.nome || b.def.skill_nome || ''), 'it', { sensitivity: 'base' }))
}

function isVariantSkill(skill) {
  return !!variantParentInfoForSkill(skill)
}

function renderVariantSkillList(rows) {
  if (!rows.length) return '<div class="empty">Nessuna skill variante collegata.</div>'
  return `<div class="skill-detail-list">${rows.map(row => {
    const name = row.skill?.nome || row.def.skill_nome || 'Variante senza nome'
    const meta = row.skill ? skillMetaLabel(row.skill) : 'Definita nel questionario, non ancora nel catalogo skill'
    const click = row.skill ? ` onclick="openSkillDetailModal('${row.skill.id}')"` : ''
    return `<div class="skill-detail-item"${click}>
      <strong>${esc(name)}</strong>
      <span>${esc(meta)}</span>
    </div>`
  }).join('')}</div>`
}

function relatedSkillRows(skillId, direction) {
  const rows = direction === 'requires'
    ? allPrereqs.filter(row => row.skill_id === skillId).map(row => ({ ...row, skill: allSkills.find(skill => skill.id === row.richiede_skill_id) }))
    : allPrereqs.filter(row => row.richiede_skill_id === skillId).map(row => ({ ...row, skill: allSkills.find(skill => skill.id === row.skill_id) }))
  return rows
    .filter(row => row.skill)
    .sort((a, b) => Number(a.skill.livello || 0) - Number(b.skill.livello || 0) || String(a.skill.nome || '').localeCompare(String(b.skill.nome || ''), 'it', { sensitivity: 'base' }))
}

function renderSkillDetailList(rows, emptyText) {
  if (!rows.length) return `<div class="empty">${esc(emptyText)}</div>`
  return `<div class="skill-detail-list">${rows.map(row => `
    <div class="skill-detail-item">
      <strong>${esc(row.skill.nome)}</strong>
      <span>${esc(skillMetaLabel(row.skill))}${row.stadio_minimo ? ` · stadio minimo ${esc(row.stadio_minimo)}` : ''}${row.note ? ` · ${esc(row.note)}` : ''}</span>
    </div>`).join('')}</div>`
}

function renderSkillDetailInfoRow(label, value) {
  if (value === undefined || value === null || value === '') return ''
  return `<div><div class="info-label">${esc(label)}</div><div>${esc(String(value))}</div></div>`
}

function openSkillDetailFromNode(node) {
  if (!node?.dataset.skillId) return
  openSkillDetailModal(node.dataset.skillId, {
    allievoId: currentSchedaId,
    stadio: parseInt(node.dataset.stadio || '0', 10) || 0,
    fakieStadio: parseInt(node.dataset.fakieStadio || '0', 10) || 0,
  })
}

function openSkillDetailModal(skillId, context = {}) {
  const skill = allSkills.find(s => s.id === skillId)
  const content = document.getElementById('skill-detail-content')
  if (!skill || !content) return
  const requires = relatedSkillRows(skillId, 'requires')
  const unlocks = relatedSkillRows(skillId, 'unlocks')
  const variantParent = variantParentInfoForSkill(skill)
  const variantChildren = variantChildrenForSkill(skill)
  const stadio = Number(context.stadio ?? (context.allievoId ? progressMapForAllievo(context.allievoId).get(skillId) : 0) ?? 0)
  const fakieStadio = Number(context.fakieStadio ?? (context.allievoId ? fakieProgressMapForAllievo(context.allievoId)[skillId]?.stadio : 0) ?? 0)
  const sideNames = [skill.lato_sx_nome && `sx: ${skill.lato_sx_nome}`, skill.lato_dx_nome && `dx: ${skill.lato_dx_nome}`].filter(Boolean).join(' · ')
  skillDetailContext = { skillId }

  content.innerHTML = `
    <div class="skill-detail-head">
      <div>
        <div class="skill-detail-title">${esc(skill.nome)}</div>
        <div class="skill-detail-meta">
          ${skillDetailMeta(skill).map(item => `<span class="skill-detail-chip">${esc(item)}</span>`).join('')}
        </div>
      </div>
      <div class="skill-detail-stage">
        <span class="st st${stadio}">Frontale: ${esc(stageLabelShort(stadio))}</span>
        <span class="st st${fakieStadio}">Fakie: ${esc(stageLabelShort(fakieStadio))}</span>
      </div>
    </div>

    <div class="skill-detail-section">
      <h4>Descrizione</h4>
      <div class="skill-detail-text">${skill.descrizione ? esc(skill.descrizione) : '<span class="empty">Nessuna descrizione registrata.</span>'}</div>
      ${openClosedHelp(skill.open_closed) ? `<div class="skill-detail-help">${esc(openClosedHelp(skill.open_closed))}</div>` : ''}
    </div>

    <div class="skill-detail-section">
      <h4>Caratteristiche</h4>
      ${renderSkillCharacteristicTags(skill)}
    </div>

    <div class="skill-detail-section">
      <h4>Varianti</h4>
      ${renderSkillVariants(skill)}
      <div class="skill-detail-help">Le varianti descrivono modi di eseguire la stessa skill. Se una variante richiede prerequisiti o progressione diversa, conviene crearla come skill autonoma e collegarla nei requisiti.</div>
    </div>

    ${variantParent ? `
      <div class="skill-detail-section">
        <h4>Variante di</h4>
        <div class="skill-detail-list">
          <div class="skill-detail-item"${variantParent.parentSkill ? ` onclick="openSkillDetailModal('${variantParent.parentSkill.id}')"` : ''}>
            <strong>${esc(variantParent.parentSkill?.nome || variantParent.parentName || 'Skill madre non agganciata')}</strong>
            <span>${esc(variantParent.parentSkill ? skillMetaLabel(variantParent.parentSkill) : 'Definita nel questionario')}</span>
          </div>
        </div>
      </div>` : ''}

    <div class="skill-detail-section">
      <h4>Skill varianti</h4>
      ${renderVariantSkillList(variantChildren)}
    </div>

    <div class="skill-detail-section">
      <h4>Requisiti</h4>
      ${renderSkillDetailList(requires, 'Nessun prerequisito registrato.')}
    </div>

    <div class="skill-detail-section">
      <h4>Sblocca</h4>
      ${renderSkillDetailList(unlocks, 'Nessuna skill dipendente registrata.')}
    </div>

    <div class="skill-detail-section">
      <h4>Dettagli tecnici</h4>
      <div class="info-grid">
        ${renderSkillDetailInfoRow('Tipo', skill.tipo)}
        ${renderSkillDetailInfoRow('Ramo', skill.ramo)}
        ${renderSkillDetailInfoRow('Blocco', skill.blocco)}
        ${renderSkillDetailInfoRow('Livello', skill.livello)}
        ${renderSkillDetailInfoRow('Open / closed', openClosedLabel(skill.open_closed))}
        ${renderSkillDetailInfoRow('Lati', sideNames)}
      </div>
    </div>`
  document.getElementById('modal-skill-detail').hidden = false
}

function chiudiSkillDetailModal() {
  document.getElementById('modal-skill-detail').hidden = true
  skillDetailContext = null
}

function openSkillCatalogFromDetail() {
  const skillId = skillDetailContext?.skillId || ''
  chiudiSkillDetailModal()
  openSkillCatalogModal('tree', null, skillId)
}

async function setSkillTreeEditMode(allievoId, on) {
  skillTreeEditMode = !!on
  await loadScheda(allievoId)
  switchSchedaTab('skill-tree')
}

function setSkillTreeStatus(text, kind = '') {
  const el = document.getElementById('skill-tree-status')
  if (!el) return
  el.className = `msg ${kind}`.trim()
  el.style.display = text ? 'block' : 'none'
  el.textContent = text || ''
}

async function salvaSkillTreeManuale(allievoId) {
  const nodes = [...document.querySelectorAll('.skill-tree-wrap.is-editing .skill-node[data-skill-id]')]
  if (!nodes.length) return
  const btn = document.querySelector('.skill-tree-actions .btn-primary')
  const oldText = btn?.textContent
  if (btn) { btn.disabled = true; btn.textContent = 'Salvataggio...' }
  setSkillTreeStatus('', '')

  try {
    const oggi = localDateIso()
    const changed = nodes
      .map(node => ({
        skill_id: node.dataset.skillId,
        stadio: parseInt(node.dataset.stadio || '0', 10) || 0,
        previous: parseInt(node.dataset.currentStadio || '0', 10) || 0,
        fakieStadio: parseInt(node.dataset.fakieStadio || '0', 10) || 0,
        previousFakie: parseInt(node.dataset.currentFakieStadio || '0', 10) || 0,
      }))
      .filter(row => row.stadio !== row.previous || row.fakieStadio !== row.previousFakie)

    for (const row of changed) {
      if (row.stadio !== row.previous) {
        const { error: deleteError } = await sb.from('progressi_allievo')
          .delete()
          .eq('allievo_id', allievoId)
          .eq('skill_id', row.skill_id)
        if (deleteError) throw deleteError

        if (row.stadio > 0) {
          const payload = {
            allievo_id: allievoId,
            skill_id: row.skill_id,
            stadio: row.stadio,
            data_inizio: oggi,
            data_acquisizione: row.stadio >= 2 ? oggi : null,
            data_perfezionamento: row.stadio >= 3 ? oggi : null,
          }
          const { error } = await sb.from('progressi_allievo').insert(payload)
          if (error) throw error
        }
      }
    }
    if (changed.some(row => row.fakieStadio !== row.previousFakie)) {
      await salvaFakieProgressiAllievo(allievoId, Object.fromEntries(changed
        .filter(row => row.fakieStadio !== row.previousFakie)
        .map(row => [row.skill_id, row.fakieStadio])))
    }
    const changedIds = new Set(changed.filter(row => row.stadio !== row.previous).map(row => row.skill_id))
    allProgressi = allProgressi
      .filter(row => !(row.allievo_id === allievoId && changedIds.has(row.skill_id)))
      .concat(changed.filter(row => row.stadio !== row.previous && row.stadio > 0).map(row => ({ allievo_id: allievoId, skill_id: row.skill_id, stadio: row.stadio })))

    skillTreeEditMode = false
    await loadScheda(allievoId)
    switchSchedaTab('skill-tree')
  } catch (e) {
    setSkillTreeStatus(e.message || 'Errore nel salvataggio della skill tree.', 'msg-err')
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = oldText }
  }
}

// ── Gestione catalogo skill ──────────────────────────────────────────

function skillCatalogBranchOptions(selected = '') {
  const preferred = ['Equilibrio', 'Andatura', 'Frenata', 'Rotazione', 'Air', 'Extra']
  const normalizedSelected = skillBranchName(selected)
  const found = [...new Set((allSkills || []).map(skill => skillBranchName(skill.ramo)))]
  const branches = [...preferred, ...found.filter(branch => !preferred.includes(branch)).sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))]
  return branches.map(branch => `<option value="${esc(branch)}" ${branch === normalizedSelected ? 'selected' : ''}>${esc(branch)}</option>`).join('')
}

function skillBranchName(raw) {
  const branch = String(raw || '').trim()
  const known = ['Equilibrio', 'Andatura', 'Frenata', 'Rotazione', 'Air', 'Extra']
  return known.includes(branch) ? branch : 'Extra'
}

function setSkillCatalogStatus(text, kind = '') {
  const el = document.getElementById('skill-catalog-status')
  if (!el) return
  el.className = `msg ${kind}`.trim()
  el.style.display = text ? 'block' : 'none'
  el.textContent = text || ''
}

function setSkillDeleteWarning(html = '') {
  const el = document.getElementById('skill-delete-warning')
  if (!el) return
  el.innerHTML = html || ''
  el.classList.toggle('show', !!html)
}

function refreshSkillDeleteOptions(selectedSkillId = '') {
  const select = document.getElementById('skill-delete-select')
  if (!select) return
  const skills = sortedSkillsForLesson()
  select.innerHTML = `<option value="">— Scegli skill —</option>${skills.map(skill => `<option value="${skill.id}" ${skill.id === selectedSkillId ? 'selected' : ''}>${esc(skill.nome)} · ${esc(skillMetaLabel(skill))}</option>`).join('')}`
  if (selectedSkillId && [...select.options].some(option => option.value === selectedSkillId)) select.value = selectedSkillId
  select.onchange = () => setSkillDeleteWarning('')
}

function refreshSkillVariantParentOptions(selectedSkillId = '') {
  const select = document.getElementById('skill-new-variant-parent')
  if (!select) return
  const skills = sortedSkillsForLesson()
  select.innerHTML = `<option value="">— Scegli skill madre —</option>${skills.map(skill => `<option value="${skill.id}" ${skill.id === selectedSkillId ? 'selected' : ''}>${esc(skill.nome)} · ${esc(skillMetaLabel(skill))}</option>`).join('')}`
}

function toggleNewSkillVariantParent() {
  const checked = !!document.getElementById('skill-new-is-variant')?.checked
  const field = document.getElementById('skill-new-variant-parent-field')
  if (field) field.hidden = !checked
  if (checked) refreshSkillVariantParentOptions(document.getElementById('skill-new-variant-parent')?.value || '')
}

function renderSkillParamControls() {
  const el = document.getElementById('skill-new-params')
  if (!el) return
  el.innerHTML = TUNING_PARAMS.map(param => `
    <div class="field">
      <label>${esc(param.label)}</label>
      <select class="skill-new-param" data-param="${esc(param.key)}">
        <option value="">— Non dichiarato —</option>
        ${param.scale.map((label, index) => `<option value="${index + 1}">${index + 1} · ${esc(label)}</option>`).join('')}
      </select>
    </div>`).join('')
}

function collectSkillParamValues() {
  const values = {}
  document.querySelectorAll('.skill-new-param[data-param]').forEach(select => {
    if (select.value) values[`param_${select.dataset.param}`] = Number(select.value)
  })
  return values
}

function resetSkillParamControls() {
  document.querySelectorAll('.skill-new-param[data-param]').forEach(select => { select.value = '' })
}

function openSkillCatalogModal(source = 'generic', ownerId = null, deleteSkillId = '') {
  skillCatalogContext = { source, ownerId }
  document.getElementById('skill-new-name').value = ''
  document.getElementById('skill-new-level').value = '1'
  document.getElementById('skill-new-description').value = ''
  document.getElementById('skill-new-variants').value = ''
  document.getElementById('skill-new-branch').innerHTML = skillCatalogBranchOptions('Equilibrio')
  document.getElementById('skill-new-block').value = 'Base'
  document.getElementById('skill-new-open-closed').value = 'OPEN'
  document.getElementById('skill-new-required').checked = false
  document.getElementById('skill-new-is-variant').checked = false
  refreshSkillVariantParentOptions()
  toggleNewSkillVariantParent()
  renderSkillParamControls()
  resetSkillParamControls()
  refreshSkillDeleteOptions(deleteSkillId)
  setSkillDeleteWarning('')
  setSkillCatalogStatus('', '')
  document.getElementById('modal-skill-catalog').hidden = false
  requestAnimationFrame(() => document.getElementById(deleteSkillId ? 'skill-delete-select' : 'skill-new-name')?.focus())
}

function chiudiSkillCatalogModal() {
  document.getElementById('modal-skill-catalog').hidden = true
  skillCatalogContext = null
}

function openSelectedSkillDetailFromCatalog() {
  const skillId = document.getElementById('skill-delete-select')?.value
  if (!skillId) { setSkillCatalogStatus('Scegli una skill da vedere.', 'msg-info'); return }
  document.getElementById('modal-skill-catalog').hidden = true
  openSkillDetailModal(skillId, { allievoId: currentSchedaId })
}

function collectSkillTreeEditState() {
  return [...document.querySelectorAll('.skill-tree-wrap.is-editing .skill-node[data-skill-id]')]
    .map(node => [node.dataset.skillId, {
      stadio: parseInt(node.dataset.stadio || '0', 10) || 0,
      fakieStadio: parseInt(node.dataset.fakieStadio || '0', 10) || 0,
    }])
}

function applySkillTreeEditState(entries) {
  const state = new Map(entries || [])
  document.querySelectorAll('.skill-tree-wrap.is-editing .skill-node[data-skill-id]').forEach(node => {
    const saved = state.get(node.dataset.skillId)
    if (!saved) return
    node.dataset.stadio = String(saved.stadio || 0)
    node.dataset.fakieStadio = String(saved.fakieStadio || 0)
    node.querySelectorAll('.skill-track-btn[data-track]').forEach(btn => {
      const value = btn.dataset.track === 'fakie' ? (saved.fakieStadio || 0) : (saved.stadio || 0)
      btn.textContent = `${btn.dataset.track === 'fakie' ? 'Fakie' : 'Frontale'} ${value ? value : '-'}`
      btn.classList.remove('sn0', 'sn1', 'sn2', 'sn3')
      btn.classList.add(`sn${value}`)
    })
    updateSkillTreeNodeVisual(node)
  })
}

async function refreshSkillCatalogConsumers(newSkillId = '') {
  refreshLessonSkillRows(newSkillId)
  refreshSkillDeleteOptions()
  refreshSkillVariantParentOptions()
  renderTuningStats()
  if (!document.getElementById('view-skills')?.hidden) renderSkillsCatalog()
  if (currentSchedaId && !document.getElementById('view-scheda')?.hidden && skillTreeEditMode) {
    const state = collectSkillTreeEditState()
    await loadScheda(currentSchedaId)
    switchSchedaTab('skill-tree')
    applySkillTreeEditState(state)
  }
}

function refreshLessonSkillRows(newSkillId = '') {
  const rows = [...document.querySelectorAll('.skill-row')]
  rows.forEach(row => {
    const branchSelect = row.querySelector('.skill-branch')
    const skillSelect = row.querySelector('.skill-select')
    if (!branchSelect || !skillSelect) return
    const selected = skillSelect.value
    const selectedSkill = allSkills.find(skill => skill.id === selected)
    const branch = selectedSkill?.ramo || branchSelect.value || ''
    branchSelect.innerHTML = renderLessonBranchOptions(branch)
    branchSelect.value = [...branchSelect.options].some(option => option.value === branch) ? branch : ''
    skillSelect.innerHTML = `<option value="">— Skill —</option>${renderLessonSkillOptions(selected, '', branchSelect.value)}`
    if ([...skillSelect.options].some(option => option.value === selected)) skillSelect.value = selected
  })

  const ownerId = skillCatalogContext?.source === 'lesson' ? skillCatalogContext.ownerId : null
  if (newSkillId && ownerId) selectNewSkillInLessonOwner(ownerId, newSkillId)
}

function selectNewSkillInLessonOwner(ownerId, skillId) {
  const skill = allSkills.find(s => s.id === skillId)
  const container = document.getElementById(`skill-rows-${ownerId}`)
  if (!skill || !container) return
  let row = [...container.querySelectorAll('.skill-row')].find(item => !item.querySelector('.skill-select')?.value)
  if (!row) {
    aggiungiSkillRow(ownerId)
    row = [...container.querySelectorAll('.skill-row')].at(-1)
  }
  const branchSelect = row?.querySelector('.skill-branch')
  const skillSelect = row?.querySelector('.skill-select')
  if (!branchSelect || !skillSelect) return
  branchSelect.value = skill.ramo || ''
  filterSkillRow(branchSelect)
  skillSelect.value = skillId
  onLessonSkillSelected(skillSelect)
}

async function creaSkillCatalogo() {
  const btn = document.getElementById('btn-create-skill')
  const oldText = btn?.textContent
  const nome = document.getElementById('skill-new-name')?.value.trim()
  const ramo = document.getElementById('skill-new-branch')?.value || 'Extra'
  const livello = parseInt(document.getElementById('skill-new-level')?.value || '1', 10) || 1
  const blocco = document.getElementById('skill-new-block')?.value || 'Base'
  const openClosed = document.getElementById('skill-new-open-closed')?.value || 'OPEN'
  const obbligatoria = !!document.getElementById('skill-new-required')?.checked
  const descrizione = document.getElementById('skill-new-description')?.value.trim() || null
  const varianti = splitVariantText(document.getElementById('skill-new-variants')?.value || '')
  const isVariant = !!document.getElementById('skill-new-is-variant')?.checked
  const parentSkillId = document.getElementById('skill-new-variant-parent')?.value || ''
  const parentSkill = allSkills.find(skill => skill.id === parentSkillId)
  const paramValues = collectSkillParamValues()

  if (!nome) { setSkillCatalogStatus('Inserisci il nome della skill.', 'msg-err'); return }
  if (allSkills.some(skill => normalizeText(skill.nome) === normalizeText(nome))) {
    setSkillCatalogStatus('Esiste gia una skill con questo nome.', 'msg-err')
    return
  }
  if (isVariant && !parentSkill) {
    setSkillCatalogStatus('Scegli la skill madre della variante.', 'msg-err')
    return
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Creo...' }
  setSkillCatalogStatus('', '')
  try {
    const descrizioneFinale = [
      descrizione,
      varianti.length ? `Varianti: ${varianti.join(', ')}.` : '',
    ].filter(Boolean).join('\n')
    let payload = {
      nome,
      ramo,
      livello,
      blocco,
      descrizione: descrizioneFinale || null,
      tipo: 'RAMO',
      open_closed: openClosed,
      obbligatoria,
      e_bilaterale: false,
      lato_sx_nome: null,
      lato_dx_nome: null,
      ...paramValues,
    }
    let { data, error } = await sb.from('skills').insert(payload).select('*').single()
    if (error && Object.keys(paramValues).some(key => (error.message || error.details || error.hint || '').includes(key))) {
      Object.keys(paramValues).forEach(key => delete payload[key])
      ;({ data, error } = await sb.from('skills').insert(payload).select('*').single())
    }
    if (error) throw error
    allSkills = [...allSkills, data].sort((a, b) => Number(a.livello || 0) - Number(b.livello || 0) || String(a.nome || '').localeCompare(String(b.nome || ''), 'it', { sensitivity: 'base' }))
    const variantDefinitionSaved = isVariant ? await salvaDefinizioneVarianteSkill(data, parentSkill, varianti) : true
    document.getElementById('skill-new-name').value = ''
    document.getElementById('skill-new-description').value = ''
    document.getElementById('skill-new-variants').value = ''
    document.getElementById('skill-new-is-variant').checked = false
    toggleNewSkillVariantParent()
    resetSkillParamControls()
    await refreshSkillCatalogConsumers(data.id)
    setSkillCatalogStatus(`Skill "${data.nome}" creata.${variantDefinitionSaved ? '' : ' La relazione variante resta da salvare nel questionario.'}`, 'msg-ok')
  } catch (e) {
    setSkillCatalogStatus(e.message || 'Errore durante la creazione della skill.', 'msg-err')
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = oldText }
  }
}

async function optionalDelete(table, column, value) {
  const { error } = await sb.from(table).delete().eq(column, value)
  if (error && !/does not exist|schema cache|column/i.test(error.message || '')) throw error
}

async function optionalUpdate(table, column, value, payload) {
  const { error } = await sb.from(table).update(payload).eq(column, value)
  if (error && !/does not exist|schema cache|column/i.test(error.message || '')) throw error
}

async function fetchSkillDeleteUsage(skillId) {
  const [{ data: progressi, error: progressiError }, { data: lezioniSkills, error: lezioniError }] = await Promise.all([
    sb.from('progressi_allievo').select('id, allievo_id, skill_id, stadio, stadio_lato_sx, stadio_lato_dx, data_inizio, data_acquisizione, data_perfezionamento, note_maestro').eq('skill_id', skillId),
    sb.from('lezioni_skills').select('id, allievo_id, lezione_id, skill_id, stadio_raggiunto, note, fakie, dimensioni').eq('skill_id', skillId)
  ])
  if (progressiError) throw progressiError
  if (lezioniError) throw lezioniError

  const rowsProgressi = progressi || []
  const rowsLezioni = lezioniSkills || []
  const allievoIds = [...new Set([...rowsProgressi, ...rowsLezioni].map(row => row.allievo_id).filter(Boolean))]
  const localAllievi = new Map((allAllievi || []).map(a => [a.id, a]))
  const missingIds = allievoIds.filter(id => !localAllievi.has(id))
  if (missingIds.length) {
    const { data, error } = await sb.from('allievi').select('id, nome, cognome, nickname, stato').in('id', missingIds)
    if (!error) (data || []).forEach(a => localAllievi.set(a.id, a))
  }

  const perAllievo = allievoIds.map(id => {
    const a = localAllievi.get(id)
    const progressiAllievo = rowsProgressi.filter(row => row.allievo_id === id)
    const lezioniAllievo = rowsLezioni.filter(row => row.allievo_id === id)
    const nome = a ? ([a.nome, a.cognome].filter(Boolean).join(' ') || a.nickname || id) : id
    return {
      id,
      nome,
      progressi: progressiAllievo.length,
      lezioni: new Set(lezioniAllievo.map(row => row.lezione_id).filter(Boolean)).size || lezioniAllievo.length
    }
  }).sort((a, b) => a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }))

  return {
    progressi: rowsProgressi,
    lezioniSkills: rowsLezioni,
    allievi: perAllievo,
    total: rowsProgressi.length + rowsLezioni.length
  }
}

function renderSkillDeleteUsageWarning(skill, usage) {
  const progressiCount = usage.progressi.length
  const lezioniCount = new Set(usage.lezioniSkills.map(row => row.lezione_id).filter(Boolean)).size || usage.lezioniSkills.length
  const shown = usage.allievi.slice(0, 10)
  const extra = usage.allievi.length - shown.length
  const righeAllievi = shown.map(a => {
    const parti = []
    if (a.progressi) parti.push(`${a.progressi} progresso/i`)
    if (a.lezioni) parti.push(`${a.lezioni} lezione/i`)
    return `<li><strong>${esc(a.nome)}</strong>${parti.length ? ` · ${esc(parti.join(', '))}` : ''}</li>`
  }).join('')

  return `
    <strong>Fermo: "${esc(skill.nome)}" risulta gia lavorata.</strong>
    <div style="margin-top:.36rem">Non la cancello secca perche e collegata a ${progressiCount} progresso/i e ${lezioniCount} lezione/i. Se va rimossa dal catalogo, sostituiscila con una skill corretta: lo storico verra spostato e nelle lezioni restera traccia del nome originale.</div>
    ${righeAllievi ? `<ul>${righeAllievi}${extra > 0 ? `<li><strong>+${extra}</strong> altri allievi</li>` : ''}</ul>` : ''}
    <div class="skill-delete-replace">
      <label for="skill-replace-select">Sostituisci con</label>
      <select id="skill-replace-select">${renderSkillReplacementOptions(skill.id)}</select>
      <button type="button" id="skill-replace-btn" class="btn btn-delete-soft btn-full" onclick="sostituisciSkillUsataDaCatalogo(${jsArg(skill.id)})">Sostituisci nello storico e rimuovi dal catalogo</button>
    </div>
    <div class="skill-delete-warning-note">Avviso rosso di compensazione: questa skill non viene persa, viene accorpata a quella scelta qui sopra.</div>`
}

function renderSkillReplacementOptions(oldSkillId) {
  return `<option value="">— Scegli skill sostitutiva —</option>${sortedSkillsForLesson()
    .filter(skill => String(skill.id) !== String(oldSkillId))
    .map(skill => `<option value="${skill.id}">${esc(skill.nome)} · ${esc(skillMetaLabel(skill))}</option>`)
    .join('')}`
}

function mergeTextNotes(...values) {
  const parts = values.map(value => String(value || '').trim()).filter(Boolean)
  return [...new Set(parts)].join(' / ') || null
}

function mergeSkillReplacementTrail(dimensioni = {}, oldSkill, replacementSkill) {
  const clean = { ...(dimensioni || {}) }
  const previous = Array.isArray(clean.skill_sostituzioni) ? clean.skill_sostituzioni : []
  delete clean.skill_sostituzioni
  return {
    ...clean,
    skill_sostituzioni: [
      ...previous,
      {
        da_id: oldSkill.id,
        da_nome: oldSkill.nome,
        a_id: replacementSkill.id,
        a_nome: replacementSkill.nome,
        sostituita_il: new Date().toISOString()
      }
    ]
  }
}

function mergeLessonDimensionsForReplacement(existing = {}, incoming = {}, oldSkill, replacementSkill) {
  const existingTrail = Array.isArray(existing?.skill_sostituzioni) ? existing.skill_sostituzioni : []
  const incomingTrail = Array.isArray(incoming?.skill_sostituzioni) ? incoming.skill_sostituzioni : []
  const cleanExisting = { ...(existing || {}) }
  const cleanIncoming = { ...(incoming || {}) }
  delete cleanExisting.skill_sostituzioni
  delete cleanIncoming.skill_sostituzioni
  const merged = mergeLessonDimensions(cleanExisting, cleanIncoming)
  merged.skill_sostituzioni = [
    ...existingTrail,
    ...incomingTrail,
    {
      da_id: oldSkill.id,
      da_nome: oldSkill.nome,
      a_id: replacementSkill.id,
      a_nome: replacementSkill.nome,
      sostituita_il: new Date().toISOString()
    }
  ]
  return merged
}

function latestSkillReplacementName(dimensioni = {}) {
  const trail = Array.isArray(dimensioni?.skill_sostituzioni) ? dimensioni.skill_sostituzioni : []
  return trail.length ? trail[trail.length - 1]?.da_nome : ''
}

function maxNullableNumber(a, b) {
  const values = [a, b].map(value => Number(value || 0)).filter(value => value > 0)
  return values.length ? Math.max(...values) : null
}

function earliestDate(...values) {
  const dates = values.map(value => String(value || '').trim()).filter(Boolean).sort()
  return dates[0] || null
}

function firstDate(...values) {
  return values.map(value => String(value || '').trim()).find(Boolean) || null
}

function progressReplacementPayload(oldRow, existingRow, replacementSkillId, oldSkill) {
  const marker = `Skill sostituita da "${oldSkill.nome}" il ${localDateIso()}.`
  return {
    allievo_id: oldRow.allievo_id,
    skill_id: replacementSkillId,
    stadio: Math.max(Number(existingRow?.stadio || 0), Number(oldRow.stadio || 0)),
    stadio_lato_sx: maxNullableNumber(existingRow?.stadio_lato_sx, oldRow.stadio_lato_sx),
    stadio_lato_dx: maxNullableNumber(existingRow?.stadio_lato_dx, oldRow.stadio_lato_dx),
    data_inizio: earliestDate(existingRow?.data_inizio, oldRow.data_inizio),
    data_acquisizione: firstDate(existingRow?.data_acquisizione, oldRow.data_acquisizione),
    data_perfezionamento: firstDate(existingRow?.data_perfezionamento, oldRow.data_perfezionamento),
    note_maestro: mergeTextNotes(existingRow?.note_maestro, oldRow.note_maestro, marker)
  }
}

async function mergeSkillProgressi(oldSkill, replacementSkill, usage) {
  if (!usage.progressi.length) return
  const allievoIds = [...new Set(usage.progressi.map(row => row.allievo_id).filter(Boolean))]
  const { data: existingRows, error: existingError } = await sb.from('progressi_allievo')
    .select('id, allievo_id, skill_id, stadio, stadio_lato_sx, stadio_lato_dx, data_inizio, data_acquisizione, data_perfezionamento, note_maestro')
    .eq('skill_id', replacementSkill.id)
    .in('allievo_id', allievoIds)
  if (existingError) throw existingError

  const existingByAllievo = new Map((existingRows || []).map(row => [row.allievo_id, row]))
  const payload = usage.progressi.map(row => progressReplacementPayload(row, existingByAllievo.get(row.allievo_id), replacementSkill.id, oldSkill))
  const { error: upsertError } = await sb.from('progressi_allievo').upsert(payload, { onConflict: 'allievo_id,skill_id' })
  if (upsertError) throw upsertError
  const { error: deleteError } = await sb.from('progressi_allievo').delete().eq('skill_id', oldSkill.id)
  if (deleteError) throw deleteError
}

async function mergeSkillLessonRows(oldSkill, replacementSkill, usage) {
  if (!usage.lezioniSkills.length) return
  const lezioneIds = [...new Set(usage.lezioniSkills.map(row => row.lezione_id).filter(Boolean))]
  const { data: existingRows, error: existingError } = await sb.from('lezioni_skills')
    .select('id, lezione_id, allievo_id, skill_id, stadio_raggiunto, note, fakie, dimensioni')
    .eq('skill_id', replacementSkill.id)
    .in('lezione_id', lezioneIds)
  if (existingError) throw existingError

  const existingByLessonStudent = new Map((existingRows || []).map(row => [`${row.lezione_id}:${row.allievo_id}`, row]))
  const oldIdsToDelete = []
  for (const oldRow of usage.lezioniSkills) {
    const key = `${oldRow.lezione_id}:${oldRow.allievo_id}`
    const existing = existingByLessonStudent.get(key)
    if (existing) {
      const { error: updateError } = await sb.from('lezioni_skills').update({
        stadio_raggiunto: Math.max(Number(existing.stadio_raggiunto || 0), Number(oldRow.stadio_raggiunto || 0)),
        note: mergeTextNotes(existing.note, oldRow.note),
        fakie: !!(existing.fakie || oldRow.fakie),
        dimensioni: mergeLessonDimensionsForReplacement(existing.dimensioni || {}, oldRow.dimensioni || {}, oldSkill, replacementSkill)
      }).eq('id', existing.id)
      if (updateError) throw updateError
      oldIdsToDelete.push(oldRow.id)
    } else {
      const { error: updateError } = await sb.from('lezioni_skills').update({
        skill_id: replacementSkill.id,
        dimensioni: mergeSkillReplacementTrail(oldRow.dimensioni || {}, oldSkill, replacementSkill)
      }).eq('id', oldRow.id)
      if (updateError) throw updateError
    }
  }
  if (oldIdsToDelete.length) {
    const { error: deleteError } = await sb.from('lezioni_skills').delete().in('id', oldIdsToDelete)
    if (deleteError) throw deleteError
  }
}

async function rewriteSkillPrerequisites(oldSkillId, replacementSkillId) {
  const { data: rows, error } = await sb.from('prerequisiti_skill').select('*').or(`skill_id.eq.${oldSkillId},richiede_skill_id.eq.${oldSkillId}`)
  if (error) throw error
  const rewrittenByKey = new Map()
  ;(rows || [])
    .map(row => ({
      skill_id: row.skill_id === oldSkillId ? replacementSkillId : row.skill_id,
      richiede_skill_id: row.richiede_skill_id === oldSkillId ? replacementSkillId : row.richiede_skill_id,
      stadio_minimo: row.stadio_minimo,
      note: row.note
    }))
    .filter(row => row.skill_id !== row.richiede_skill_id)
    .forEach(row => {
      const key = `${row.skill_id}:${row.richiede_skill_id}`
      const current = rewrittenByKey.get(key)
      rewrittenByKey.set(key, current ? {
        ...row,
        stadio_minimo: Math.min(Number(current.stadio_minimo || 2), Number(row.stadio_minimo || 2)),
        note: mergeTextNotes(current.note, row.note)
      } : row)
    })
  const rewritten = [...rewrittenByKey.values()]
  if (rewritten.length) {
    const { error: upsertError } = await sb.from('prerequisiti_skill').upsert(rewritten, { onConflict: 'skill_id,richiede_skill_id' })
    if (upsertError) throw upsertError
  }
  await optionalDelete('prerequisiti_skill', 'skill_id', oldSkillId)
  await optionalDelete('prerequisiti_skill', 'richiede_skill_id', oldSkillId)
}

async function sostituisciSkillUsataDaCatalogo(oldSkillId) {
  const oldSkill = allSkills.find(skill => String(skill.id) === String(oldSkillId))
  const replacementId = document.getElementById('skill-replace-select')?.value
  const replacementSkill = allSkills.find(skill => String(skill.id) === String(replacementId))
  if (!oldSkill) { setSkillCatalogStatus('Skill da sostituire non trovata.', 'msg-err'); return }
  if (!replacementSkill) { setSkillCatalogStatus('Scegli una skill sostitutiva.', 'msg-err'); return }
  if (oldSkill.id === replacementSkill.id) { setSkillCatalogStatus('La skill sostitutiva deve essere diversa.', 'msg-err'); return }
  if (!confirm(`Sostituire "${oldSkill.nome}" con "${replacementSkill.nome}" in progressi e lezioni, poi rimuovere "${oldSkill.nome}" dal catalogo?`)) return

  const btn = document.getElementById('skill-replace-btn')
  const oldText = btn?.textContent
  if (btn) { btn.disabled = true; btn.textContent = 'Sostituzione in corso...' }
  setSkillCatalogStatus('Sostituzione nello storico in corso...', 'msg-info')
  try {
    const usage = await fetchSkillDeleteUsage(oldSkill.id)
    await mergeSkillProgressi(oldSkill, replacementSkill, usage)
    await mergeSkillLessonRows(oldSkill, replacementSkill, usage)
    await rewriteSkillPrerequisites(oldSkill.id, replacementSkill.id)
    await optionalDelete('skill_definizioni', 'skill_id', oldSkill.id)
    await optionalUpdate('tuning_risposte', 'skill_id', oldSkill.id, { skill_id: replacementSkill.id })
    await optionalUpdate('tuning_risposte', 'skill_ref_id', oldSkill.id, { skill_ref_id: replacementSkill.id })
    const { error } = await sb.from('skills').delete().eq('id', oldSkill.id)
    if (error) throw error

    allSkills = allSkills.filter(skill => String(skill.id) !== String(oldSkill.id))
    skillDefinitions = skillDefinitions.filter(def => String(def.skill_id || '') !== String(oldSkill.id) && normalizeText(def.skill_nome) !== normalizeText(oldSkill.nome))
    const [{ data: freshPrereqs }, { data: freshProgressi }] = await Promise.all([
      sb.from('prerequisiti_skill').select('*'),
      sb.from('progressi_allievo').select('allievo_id, skill_id, stadio')
    ])
    if (freshPrereqs) allPrereqs = freshPrereqs
    if (freshProgressi) allProgressi = freshProgressi
    await refreshSkillCatalogConsumers()
    setSkillDeleteWarning('')
    setSkillCatalogStatus(`"${oldSkill.nome}" sostituita con "${replacementSkill.nome}". Storico conservato.`, 'msg-ok')
  } catch (e) {
    setSkillCatalogStatus(e.message || 'Errore durante la sostituzione della skill.', 'msg-err')
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = oldText }
  }
}

async function salvaDefinizioneVarianteSkill(skill, parentSkill, variants = []) {
  if (!skill || !parentSkill) return true
  const payload = {
    skill_id: skill.id,
    skill_nome: skill.nome,
    ramo: skillBranchName(skill.ramo),
    fascia_livello: skill.blocco || '',
    livello_num: Number(skill.livello || 0) || null,
    prerequisiti: [],
    prerequisiti_match: [],
    sblocca: [],
    sblocca_match: [],
    e_variante: true,
    variante_di: parentSkill.nome,
    variante_match: { skill_id: parentSkill.id, skill_nome: parentSkill.nome },
    cosa_fa: skill.descrizione || '',
    come_si_fa: '',
    varianti: variants,
    alias_nomi: [],
    catalog_note: '',
    note_revisione: null,
    stato: 'bozza',
    maestro_id: currentUid || null,
    aggiornato_il: new Date().toISOString()
  }
  const { error } = await sb.from('skill_definizioni').upsert(payload, { onConflict: 'skill_nome' })
  if (error) {
    const text = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`
    if (/skill_definizioni|schema cache|could not find the table|does not exist/i.test(text)) return false
    throw error
  }
  skillDefinitions = await loadSkillDefinitions()
  return true
}

async function cancellaSkillCatalogo() {
  const select = document.getElementById('skill-delete-select')
  const skillId = select?.value
  const skill = allSkills.find(s => s.id === skillId)
  if (!skill) { setSkillCatalogStatus('Scegli una skill da cancellare.', 'msg-err'); return }

  setSkillDeleteWarning('')
  setSkillCatalogStatus('Controllo utilizzi della skill...', 'msg-info')

  try {
    const usage = await fetchSkillDeleteUsage(skillId)
    if (usage.total > 0) {
      setSkillCatalogStatus('Skill non cancellata: prima serve compensarla.', 'msg-err')
      setSkillDeleteWarning(renderSkillDeleteUsageWarning(skill, usage))
      return
    }
    if (!confirm(`Cancellare "${skill.nome}" dal catalogo? Non risultano lezioni o progressi collegati.`)) {
      setSkillCatalogStatus('', '')
      return
    }
    setSkillCatalogStatus('Cancellazione in corso...', 'msg-info')
    await optionalDelete('prerequisiti_skill', 'skill_id', skillId)
    await optionalDelete('prerequisiti_skill', 'richiede_skill_id', skillId)
    await optionalDelete('skill_definizioni', 'skill_id', skillId)
    await optionalDelete('tuning_risposte', 'skill_id', skillId)
    await optionalDelete('tuning_risposte', 'skill_ref_id', skillId)
    const { error } = await sb.from('skills').delete().eq('id', skillId)
    if (error) throw error
    allSkills = allSkills.filter(s => s.id !== skillId)
    skillDefinitions = skillDefinitions.filter(def => String(def.skill_id || '') !== String(skillId) && normalizeText(def.skill_nome) !== normalizeText(skill.nome))
    allPrereqs = allPrereqs.filter(row => row.skill_id !== skillId && row.richiede_skill_id !== skillId)
    allProgressi = allProgressi.filter(row => row.skill_id !== skillId)
    await refreshSkillCatalogConsumers()
    setSkillDeleteWarning('')
    setSkillCatalogStatus(`Skill "${skill.nome}" cancellata.`, 'msg-ok')
  } catch (e) {
    setSkillCatalogStatus(e.message || 'Errore durante la cancellazione della skill.', 'msg-err')
  }
}

// ── Export / Import / Stampa ─────────────────────────────────────────

function chiudiCondividi() {
  document.getElementById('modal-condividi').hidden = true
  shareContext = null
}

function apriCondividiAllievo(id) {
  const allievo = allAllievi.find(a => a.id === id)
  if (!allievo) return
  if (!canShareAllievo(allievo)) {
    alert('Puoi condividere solo allievi assegnati al tuo account.')
    return
  }
  shareContext = { type: 'allievo', ids: [id], label: [allievo.nome, allievo.cognome].filter(Boolean).join(' ') }
  document.getElementById('condividi-title').textContent = 'Condividi allievo'
  document.getElementById('condividi-help').textContent = `Condividi ${shareContext.label} con un altro maestro. Potra vedere e modificare la scheda.`
  document.getElementById('condividi-email').value = ''
  document.getElementById('condividi-err').classList.remove('show')
  document.getElementById('condividi-ok').classList.remove('show')
  document.getElementById('modal-condividi').hidden = false
  document.getElementById('condividi-email').focus()
}

function apriCondividiGruppo(gruppo) {
  const membri = shareableGruppoMembri(gruppo)
  if (!membri.length) {
    alert('Puoi condividere solo gruppi con allievi attivi assegnati al tuo account.')
    return
  }
  shareContext = { type: 'gruppo', ids: membri.map(a => a.id), label: gruppo }
  document.getElementById('condividi-title').textContent = 'Condividi gruppo'
  document.getElementById('condividi-help').textContent = `Condividi il gruppo "${gruppo}" (${membri.length} allievi) con un altro maestro.`
  document.getElementById('condividi-email').value = ''
  document.getElementById('condividi-err').classList.remove('show')
  document.getElementById('condividi-ok').classList.remove('show')
  document.getElementById('modal-condividi').hidden = false
  document.getElementById('condividi-email').focus()
}

async function confermaCondividi() {
  const err = document.getElementById('condividi-err')
  const ok = document.getElementById('condividi-ok')
  err.classList.remove('show')
  ok.classList.remove('show')

  const email = document.getElementById('condividi-email').value.trim().toLowerCase()
  if (!shareContext) {
    err.textContent = 'Nessun elemento selezionato per la condivisione.'
    err.classList.add('show')
    return
  }
  if (!email) {
    err.textContent = "Inserisci l'email del maestro."
    err.classList.add('show')
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = 'Inserisci una email valida.'
    err.classList.add('show')
    return
  }
  if (email === currentEmail) {
    err.textContent = 'Questo maestro e gia il tuo account.'
    err.classList.add('show')
    return
  }

  try {
    const { data: maestroId, error: rpcError } = await sb.rpc('find_maestro_by_email', { email_input: email })
    if (rpcError) throw rpcError
    if (!maestroId) throw new Error('Maestro non trovato con questa email.')

    const payload = shareContext.ids.map(allievoId => ({
      allievo_id: allievoId,
      maestro_id: maestroId,
      condiviso_da: currentUid,
    }))
    const { error } = await sb.from('allievi_condivisi').upsert(payload, { onConflict: 'allievo_id,maestro_id' })
    if (error) throw error

    ok.textContent = shareContext.type === 'gruppo'
      ? `Gruppo condiviso con ${email}.`
      : `Allievo condiviso con ${email}.`
    ok.classList.add('show')
    await ricaricaAllievi()
  } catch (e) {
    err.textContent = e.message || 'Errore nella condivisione.'
    err.classList.add('show')
  }
}

async function assegnaAllievoAMe(id) {
  if (!currentUid) return
  if (!confirm('Assegnare questo allievo non ancora assegnato al tuo account?')) return
  try {
    const { error } = await sb.from('allievi').update({ maestro_id: currentUid }).eq('id', id).is('maestro_id', null)
    if (error) throw error
    await ricaricaAllievi()
  } catch (e) {
    alert("Errore nell'assegnazione: " + e.message)
  }
}

async function esportaAllievo(id) {
  const allievo = allAllievi.find(a => a.id === id)
  if (!allievo) return

  const { data: progressi } = await sb.from('progressi_allievo')
    .select('stadio, data_inizio, data_acquisizione, data_perfezionamento, note_maestro, skills(id, nome, ramo, livello, blocco)')
    .eq('allievo_id', id)

  const blob = new Blob([JSON.stringify({ allievo, progressi: progressi || [] }, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${allievo.nome}_${allievo.cognome}_backup.json`.replace(/\s+/g, '_')
  a.click()
  URL.revokeObjectURL(a.href)
}

async function esportaAllievi() {
  const allievi = ordinaAllieviLista(allieviVisibiliGod())
  if (!allievi.length) {
    alert('Nessun allievo da esportare.')
    return
  }

  const ids = allievi.map(a => a.id).filter(Boolean)
  const { data: progressi, error } = await sb.from('progressi_allievo')
    .select('allievo_id, stadio, data_inizio, data_acquisizione, data_perfezionamento, note_maestro, skills(id, nome, ramo, livello, blocco)')
    .in('allievo_id', ids)

  if (error) {
    alert('Errore esportazione: ' + error.message)
    return
  }

  const stato = mostraArchiviati ? 'archivio' : 'attivi'
  const modo = String(filtroListaAllievi || 'attivi').replace(/\s+/g, '_').replace(/[^\w-]/g, '')
  const oggi = localDateIso()
  const blob = new Blob([JSON.stringify({
    tipo: 'allievi_backup',
    esportato_il: new Date().toISOString(),
    filtro: { stato, modo: filtroListaAllievi },
    allievi,
    progressi: progressi || [],
  }, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `allievi_${stato}_${modo}_${oggi}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

function salvaBackupLocale(tipo, payload) {
  const key = 'bladingManagerBackups'
  let backups = []
  try {
    backups = JSON.parse(safeStorage.getItem(key) || '[]')
    if (!Array.isArray(backups)) backups = []
  } catch {
    backups = []
  }
  backups.unshift({
    tipo,
    salvato_il: new Date().toISOString(),
    payload,
  })
  safeStorage.setItem(key, JSON.stringify(backups.slice(0, 50)))
}

async function backupAllievoCompleto(id) {
  const allievo = allAllievi.find(a => a.id === id) || null
  const [progressiResult, lezioniAllieviResult, lezioniSkillsResult] = await Promise.all([
    sb.from('progressi_allievo').select('*').eq('allievo_id', id),
    sb.from('lezioni_allievi').select('*, lezioni(*)').eq('allievo_id', id),
    sb.from('lezioni_skills').select('*, skills(*)').eq('allievo_id', id),
  ])
  return {
    allievo,
    progressi: requiredQueryData(progressiResult, 'progressi del backup allievo'),
    lezioniAllievi: requiredQueryData(lezioniAllieviResult, 'presenze del backup allievo'),
    lezioniSkills: requiredQueryData(lezioniSkillsResult, 'skill del backup allievo'),
  }
}

async function toggleVacanzaAllievo(id) {
  const allievo = allAllievi.find(a => String(a.id) === String(id))
  if (!allievo) return
  const nextVacanza = !allievoInVacanzaDiretta(allievo)
  const nome = allievoDisplayName(id)
  if (nextVacanza && !confirm(`Mettere ${nome} in vacanza? Non comparira nelle liste operative e negli appuntamenti finche resta in vacanza.`)) return
  try {
    const profilo = { ...(allievo.profilo || {}), in_vacanza: nextVacanza }
    let payload = { profilo, aggiornato_il: new Date().toISOString() }
    let { data, error } = await sb.from('allievi').update(payload).eq('id', id).select().single()
    if (error && /aggiornato_il|updated_at|schema cache|column/i.test(error.message || error.details || error.hint || '')) {
      payload = { profilo }
      ;({ data, error } = await sb.from('allievi').update(payload).eq('id', id).select().single())
    }
    if (error) throw error
    allAllievi = allAllievi.map(a => String(a.id) === String(id) ? (data || { ...a, profilo }) : a)
    logModificaLocale('allievo', id, nextVacanza ? 'Messo in vacanza' : 'Tolto dalla vacanza')
    await loadScheda(id)
  } catch (e) {
    alert('Errore aggiornamento vacanza: ' + (e.message || e))
  }
}

async function eliminaAllievo(id) {
  const allievo = allAllievi.find(a => a.id === id)
  const isArchiviato = allievo?.stato === 'archiviato'

  if (!isArchiviato) {
    if (!confirm('Archiviare questo allievo? Potrai ritrovarlo dalla lista Archivio.')) return

    try {
      const { error } = await sb.from('allievi').update({ stato: 'archiviato' }).eq('id', id)
      if (error) throw error
      await ricaricaAllievi()
      showView('allievi')
    } catch (e) {
      alert("Errore nell'archiviazione: " + e.message)
    }
    return
  }

  if (!confirm('Eliminare definitivamente questo allievo archiviato dal database? I file di backup esportati non vengono toccati.')) return

  try {
    await sb.from('lezioni_skills').delete().eq('allievo_id', id)
    await sb.from('lezioni_allievi').delete().eq('allievo_id', id)
    await sb.from('progressi_allievo').delete().eq('allievo_id', id)

    const { error } = await sb.from('allievi').delete().eq('id', id)
    if (error) throw error

    await ricaricaAllievi()
    showView('allievi')
  } catch (e) {
    alert("Errore nell'eliminazione definitiva: " + e.message)
  }
}

async function cancellaAllievoInModifica() {
  if (!editingAllieviId) return
  const allievo = allAllievi.find(a => a.id === editingAllieviId)
  const nome = allievo ? [allievo.nome, allievo.cognome].filter(Boolean).join(' ') : 'questa scheda'
  if (!confirm(`Cancellare la scheda di ${nome}? Prima verra salvata una copia nel backup locale.`)) return

  const errEl = document.getElementById('na-err')
  errEl.classList.remove('show')
  try {
    const backup = await backupAllievoCompleto(editingAllieviId)
    salvaBackupLocale('allievo_cancellato', backup)
    await sb.from('lezioni_skills').delete().eq('allievo_id', editingAllieviId)
    await sb.from('lezioni_allievi').delete().eq('allievo_id', editingAllieviId)
    await sb.from('progressi_allievo').delete().eq('allievo_id', editingAllieviId)
    const { error } = await sb.from('allievi').delete().eq('id', editingAllieviId)
    if (error) throw error
    editingAllieviId = null
    await ricaricaAllievi()
    showView('allievi')
  } catch (e) {
    errEl.textContent = e.message || 'Errore nella cancellazione della scheda.'
    errEl.classList.add('show')
  }
}

async function cancellaGruppoInModifica() {
  if (!editingAllieviId) return
  const current = allAllievi.find(a => a.id === editingAllieviId)
  const gruppo = current?.gruppo
  if (!gruppo) return
  await cancellaGruppoConBackup(gruppo, document.getElementById('na-err'), () => {
    editingAllieviId = null
    showView('allievi')
  })
}

async function cancellaGruppoDaScheda() {
  if (!editingGruppoNome) return
  await cancellaGruppoConBackup(editingGruppoNome, document.getElementById('gr-err'), () => {
    editingGruppoNome = null
    showView('allievi')
  })
}

async function cancellaGruppoConBackup(gruppo, errEl, afterDelete) {
  const membri = allAllievi.filter(a => a.gruppo === gruppo)
  if (!membri.length) return
  if (!confirm(`Cancellare il gruppo "${gruppo}" e le ${membri.length} schede collegate? Prima verra salvata una copia nel backup locale.`)) return

  errEl.classList.remove('show')
  try {
    const backups = await Promise.all(membri.map(a => backupAllievoCompleto(a.id)))
    salvaBackupLocale('gruppo_cancellato', { gruppo, membri: backups })
    const ids = membri.map(a => a.id)
    await sb.from('lezioni_skills').delete().in('allievo_id', ids)
    await sb.from('lezioni_allievi').delete().in('allievo_id', ids)
    await sb.from('progressi_allievo').delete().in('allievo_id', ids)
    const { error } = await sb.from('allievi').delete().in('id', ids)
    if (error) throw error
    filtroGruppo = null
    await ricaricaAllievi()
    afterDelete?.()
  } catch (e) {
    errEl.textContent = e.message || 'Errore nella cancellazione del gruppo.'
    errEl.classList.add('show')
  }
}

async function importaAllievo(input) {
  const file = input.files[0]
  if (!file) return
  input.value = ''

  let parsed
  try { parsed = JSON.parse(await file.text()) } catch { alert('File JSON non valido.'); return }

  const src = parsed.allievo
  if (!src?.nome || !src?.cognome) { alert('Dati allievo mancanti nel file.'); return }

  // Rimuove id e campi auto-generati, forza maestro_id al corrente
  const { id: _old, creato_il, aggiornato_il, maestro_id: _mid, ...rest } = src
  let writeUid
  try {
    writeUid = await requireCurrentUidForWrite()
  } catch (e) {
    alert(e.message)
    return
  }
  const payload = { ...rest, maestro_id: writeUid, stato: rest.stato || 'attivo' }

  const { data, error } = await sb.from('allievi').insert(payload).select().single()
  if (error) { alert('Errore importazione: ' + error.message); return }

  allAllievi.push(data)
  allAllievi.sort((a, b) => a.nome.localeCompare(b.nome))
  renderAllievi()
  alert(`✅ "${data.nome} ${data.cognome}" importato correttamente.`)
}

function stampaScheda(id) {
  const allievo = allAllievi.find(a => a.id === id)
  if (!allievo) return
  const p = allievo.profilo || {}

  function dr(val) {
    return [1,2,3].map(i =>
      `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;border:1.5px solid #0891b2;background:${i<=val?'#0891b2':'transparent'};margin-right:4px;vertical-align:middle"></span>`
    ).join('')
  }
  function row(label, val) {
    if (!val) return ''
    return `<tr><td style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;padding:3px 10px 3px 0;white-space:nowrap;vertical-align:top;width:36%">${label}</td><td style="font-size:11px;padding:3px 0;color:#1a1a2e;vertical-align:top">${val}</td></tr>`
  }
  function fmtDate(d) {
    if (!d) return ''
    const [y,m,g] = d.slice(0,10).split('-'); return `${g}/${m}/${y}`
  }

  const famRows = (p.familiari||[]).map(f =>
    row(f.relazione||'Familiare', [f.nome, f.cognome].filter(Boolean).join(' ') + (f.telefono ? ' · ' + f.telefono : ''))
  ).join('')
  const address = visibleAllievoAddress(allievo)

  const html = `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8">
<title>${allievo.nome} ${allievo.cognome} — Scheda</title>
<style>
  @page { size: A4 portrait; margin: 16mm 15mm 14mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: #1a1a2e; line-height: 1.45; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  .header { padding-bottom: 9px; margin-bottom: 12px; border-bottom: 2px solid #0891b2; display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .header h1 { font-size: 19px; font-weight: 700; color: #0f172a; }
  .header .badge-lv { font-size: 10px; font-weight: 700; color: #0891b2; border: 1.5px solid #0891b2; border-radius: 4px; padding: 2px 7px; white-space: nowrap; }
  .header .meta { font-size: 10px; color: #64748b; margin-top: 3px; }

  .box { border: 1px solid #dde3ef; border-radius: 6px; padding: 9px 11px; margin-bottom: 10px; page-break-inside: avoid; }

  .sec-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; padding-bottom: 5px; margin-bottom: 7px; border-bottom: 1px solid #e5e7eb; }
  .sub-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin-bottom: 5px; margin-top: 8px; }
  .sub-title:first-child { margin-top: 0; }

  table { width: 100%; border-collapse: collapse; }

  .prog-table th { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #6b7280; padding: 3px 6px 3px 0; border-bottom: 1px solid #e5e7eb; }
  .prog-table td { padding: 4px 6px 4px 0; border-bottom: 1px solid #f3f4f6; font-size: 11px; color: #1a1a2e; }
  .ramo-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #0891b2; margin: 9px 0 4px; }

  .badge { display: inline-block; padding: 1px 6px; border-radius: 20px; font-size: 9px; font-weight: 700; }
  .st1 { background: #fef3c7; color: #92400e; }
  .st2 { background: #cffafe; color: #0e7490; }
  .st3 { background: #dcfce7; color: #166534; }

  .footer { margin-top: 14px; padding-top: 6px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #94a3b8; text-align: right; }
</style></head><body>

<div class="header">
  <div>
    <h1>${allievo.nome} ${allievo.cognome}${allievo.nickname ? ` <span style="font-size:13px;color:#64748b;font-weight:400">"${allievo.nickname}"</span>` : ''}${allievoTier(allievo) === 'VIP' ? ' <span style="color:#22b8cf">★</span>' : ''}</h1>
    <div class="meta">
      Iscritto il ${fmtDate(allievo.data_iscrizione)}${allievo.data_nascita ? ` · Nato il ${fmtDate(allievo.data_nascita)}` : ''}${allievo.gruppo ? ` · Gruppo: ${allievo.gruppo}` : ''}
    </div>
  </div>
  <div class="badge-lv">Lv. ${allievo.livello_attuale} · ${allievo.blocco_attuale}</div>
</div>

<div class="box">
  <div class="sec-title">Contatti</div>
  <table>${row('Email', allievo.email)}${row('Telefono', allievo.telefono)}${row('Indirizzo', address.indirizzo)}${row('Casa', address.casa)}${row('Cultura / lingua', p.cultura)}${famRows}</table>
</div>

${p.note_salute ? `<div class="box"><div class="sec-title">Salute e attenzioni</div><table>${row('Note', p.note_salute)}</table></div>` : ''}

<div class="box">
  <div class="sec-title">Logistica</div>
  <table>${row('Appuntamento', p.appuntamento)}${row('Durata lezione', p.durata_lezione ? p.durata_lezione + ' min' : null)}${row('Luogo di incontro', p.luogo_incontro)}${row('Compenso', p.compenso ? '€ ' + Number(p.compenso).toFixed(2) : null)}</table>
</div>

<div class="box">
  <div class="sec-title">Capacità motorie</div>
  <table>
    ${row('Coordinazione', dr(p.capacita?.coordinazione||0))}
    ${row('Propriocezione', dr(p.capacita?.propriocezione||0))}
    ${row('Vel. apprendimento', dr(p.capacita?.velocita_apprendimento||0))}
    ${row('Bilateralità', dr(p.capacita?.bilateralita||0))}
  </table>
</div>

<div class="box">
  <div class="sec-title">Canale di apprendimento</div>
  <table>
    ${row('Visivo', dr(p.apprendimento?.visivo||0))}
    ${row('Teorico', dr(p.apprendimento?.teorico||0))}
    ${row('Pratico', dr(p.apprendimento?.pratico||0))}
  </table>
</div>

${p.lato_dominante||p.competenze||p.sport||p.talenti||p.paure||p.obiettivi||p.equipaggiamento ? `
<div class="box">
  <div class="sec-title">Profilo tecnico</div>
  <table>
    ${row('Lato dominante', p.lato_dominante)}${row('Competenze iniziali', p.competenze)}
    ${row('Sport praticati', p.sport)}${row('Talenti', p.talenti)}
    ${row('Paure / blocchi', p.paure)}${row('Obiettivi', p.obiettivi)}
    ${row('Equipaggiamento', p.equipaggiamento)}
  </table>
</div>` : ''}

${allievo.note_generali ? `<div class="box-full"><div class="sec-title">Note generali</div><p style="font-size:11px;color:#374151;line-height:1.5">${allievo.note_generali}</p></div>` : ''}

<div id="prog-placeholder" class="box-full">
  <div class="sec-title">Progressi skill</div>
  <p style="color:#94a3b8;font-size:11px">Caricamento…</p>
</div>

<div class="footer">Blading Manager Big Ball of Mud · Stampato il ${new Date().toLocaleDateString('it-IT')}</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@1/dist/umd/supabase.min.js"><\/script>
<script>
(async () => {
  const placeholder = document.getElementById('prog-placeholder')
  const sb = supabase.createClient('${SUPA_URL}','${SUPA_KEY}')
  const { data: progressi } = await sb.from('progressi_allievo')
    .select('stadio, data_acquisizione, skills(nome, ramo, livello)')
    .eq('allievo_id', '${id}')
    .gt('stadio', 0)
    .order('skills(livello)')

  if (!progressi || !progressi.length) {
    placeholder.innerHTML = '<div class="sec-title">Progressi skill</div><p style="color:#94a3b8;font-size:11px">Nessuna skill registrata.</p>'
    window.print(); return
  }

  const byRamo = {}
  progressi.forEach(p => {
    const skill = p.skills || {}
    const r = skill.ramo || 'Altro'
    if (!byRamo[r]) byRamo[r] = []
    byRamo[r].push(p)
  })

  const html = Object.entries(byRamo).map(([ramo, rows]) => \`
    <div class="ramo-lbl">\${ramo}</div>
    <table class="prog-table" style="margin-bottom:6px;page-break-inside:avoid">
      <thead><tr><th style="width:46%">Skill</th><th style="width:8%">Lv.</th><th style="width:26%">Stadio</th><th style="width:20%">Acquisita</th></tr></thead>
      <tbody>\${rows.sort((a,b)=>(a.skills || {}).livello-(b.skills || {}).livello).map(p => {
        const labels = ['','In lavorazione','Raffinamento','Completato']
        const cls = ['','st1','st2','st3']
        const d = p.data_acquisizione
        const fmt = d ? d.slice(8,10)+'/'+d.slice(5,7)+'/'+d.slice(0,4) : '—'
        const skill = p.skills || {}
        return \`<tr><td>\${skill.nome||''}</td><td>\${skill.livello||''}</td><td><span class="badge \${cls[p.stadio]}">\${labels[p.stadio]}</span></td><td style="color:#64748b">\${fmt}</td></tr>\`
      }).join('')}</tbody>
    </table>
  \`).join('')

  placeholder.innerHTML = '<div class="sec-title">Progressi skill</div>' + html
  window.print()
})()
<\/script>
</body></html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
}

// ── Lezioni ───────────────────────────────────────────────────────────

function isMissingNoteSpecialiError(error) {
  return !!error && /note_speciali/i.test(error.message || error.details || error.hint || '')
}

function isMissingFakieError(error) {
  return !!error && /fakie/i.test(error.message || error.details || error.hint || '')
}

function isMissingDimensioniError(error) {
  return !!error && /dimensioni/i.test(error.message || error.details || error.hint || '')
}

function isMissingLessonStatusError(error) {
  return !!error && /\b(stato|status|updated_at)\b/i.test(error.message || error.details || error.hint || '')
}

function isMissingLessonCheckError(error) {
  return !!error && /\b(check_bene|check_non_fatto)\b/i.test(error.message || error.details || error.hint || '')
}

function isMissingLessonMeteoError(error) {
  return !!error && /\b(meteo|weather)\b/i.test(error.message || error.details || error.hint || '')
}

function isMissingLessonLocationIdError(error) {
  return !!error && /\blocation_id\b/i.test(error.message || error.details || error.hint || '')
}

function hasLessonSkillMetadata(payload = {}) {
  return !!payload?.dimensioni && Object.keys(payload.dimensioni).length > 0
}

function missingLessonSkillColumnError(column) {
  const details = column === 'dimensioni'
    ? 'Dimensioni ed esercizi sono salvati in lezioni_skills.dimensioni.'
    : 'Il flag Fakie e salvato in lezioni_skills.fakie.'
  return new Error(`${details} La colonna manca nel database: applica la migrazione lezioni_skills_meta e riprova.`)
}

async function loadLezioni(force = false) {
  if (lezioniCache && !force) {
    renderLezioni()
    return
  }

  const el = document.getElementById('lezioni-content')
  el.innerHTML = '<div class="loading">Caricamento…</div>'
  let { data, error } = await sb.from('lezioni')
    .select('id, data, tipo, durata_min, luogo, location_id, meteo, note, note_speciali, stato, check_bene, check_non_fatto, updated_at, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome))')
    .order('data', { ascending: false })
  if (isMissingLessonLocationIdError(error)) {
    ;({ data, error } = await sb.from('lezioni')
      .select('id, data, tipo, durata_min, luogo, meteo, note, note_speciali, stato, check_bene, check_non_fatto, updated_at, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome))')
      .order('data', { ascending: false }))
  }
  if (isMissingLessonMeteoError(error)) {
    ;({ data, error } = await sb.from('lezioni')
      .select('id, data, tipo, durata_min, luogo, note, note_speciali, stato, check_bene, check_non_fatto, updated_at, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome))')
      .order('data', { ascending: false }))
  }
  if (isMissingLessonCheckError(error)) {
    ;({ data, error } = await sb.from('lezioni')
      .select('id, data, tipo, durata_min, luogo, note, note_speciali, stato, updated_at, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome))')
      .order('data', { ascending: false }))
  }
  if (isMissingLessonStatusError(error)) {
    ;({ data, error } = await sb.from('lezioni')
      .select('id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome))')
      .order('data', { ascending: false }))
  }
  if (isMissingDimensioniError(error)) {
    ;({ data, error } = await sb.from('lezioni')
      .select('id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, skills(nome))')
      .order('data', { ascending: false }))
  }
  if (isMissingNoteSpecialiError(error)) {
    ;({ data, error } = await sb.from('lezioni')
      .select('id, data, tipo, durata_min, luogo, note, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, skills(nome))')
      .order('data', { ascending: false }))
    data = (data || []).map(l => ({ ...l, note_speciali: null }))
  }

  if (error) {
    lezioniCache = null
    el.innerHTML = `<div class="empty">${esc(error.message || 'Errore nel caricamento lezioni.')}</div>`
    return
  }

  lezioniCache = (data || []).sort((a, b) => lessonSortToken(b).localeCompare(lessonSortToken(a)) || String(b.id || '').localeCompare(String(a.id || '')))
  renderLezioni({ animate: true })
  renderDashboard()
}

function renderLezioni({ animate = false } = {}) {
  const el = document.getElementById('lezioni-content')
  aggiornaFiltroLezioni()
  aggiornaToggleDettagliLezioni()

  const sourceLezioni = lezioniCache || []
  const scopeIds = new Set(allieviVisibiliGod().map(a => a.id))
  const lezioni = godMode && godScope !== 'all'
    ? sourceLezioni.filter(l => l.lezioni_allievi?.some(la => scopeIds.has(la.allievi?.id)))
    : sourceLezioni
  renderLezioniSummary(lezioni)

  if (!lezioni.length) {
    el.innerHTML = '<div class="empty">Nessuna lezione ancora.</div>'
    return
  }

  const lezioniFiltrate = filtraLezioniPerSelezione(lezioni)
    .filter(l => !filtroLezioniAperte || lessonStatus(l) === 'aperta')

  if (!lezioniFiltrate.length) {
    el.innerHTML = `<div class="empty">${filtroLezioniAperte ? 'Nessuna lezione aperta per questa selezione.' : (filtroLezioni === 'all' ? 'Nessuna lezione per questo account.' : 'Nessuna lezione per questa selezione.')}</div>`
    return
  }

  el.innerHTML = renderLezioniTable(lezioniFiltrate)
  if (animate) requestAnimationFrame(() => motion.tableRows(el))
}

function renderLezioniSummary(lezioni = []) {
  const el = document.getElementById('lezioni-summary')
  if (!el) return
  const oggi = localDateIso()
  const todayLessons = lezioni.filter(l => String(l.data || '').slice(0, 10) === oggi)
  const aperte = lezioni.filter(l => lessonStatus(l) === 'aperta')
  el.innerHTML = `
    <div class="view-summary-grid">
      <button type="button" class="summary-tile" onclick="openDayLessonsWidget('${oggi}')">
        <strong>${todayLessons.length}</strong>
        <span>Lezioni oggi</span>
      </button>
      <button type="button" class="summary-tile" onclick="setFiltroLezioniAperte(true)">
        <strong>${aperte.length}</strong>
        <span>Lezioni aperte</span>
      </button>
    </div>`
}

function renderLezioniTable(lezioni, { showYearGroups = true, variant = 'lista', schedaId = null, gruppoNome = null } = {}) {
  const isScheda = variant === 'scheda'
  const html = `
    <div class="table-wrap">
      <table class="lesson-table ${lessonTableStateClasses()}">
        <thead><tr>${
          isScheda
            ? `${lessonColumnHeader('data', 'Data e orario')}<th>Skill lavorate</th>${lessonColumnHeader('note', 'Note speciali')}${lessonColumnHeader('luogo', 'Location')}`
            : `${lessonColumnHeader('data', 'Data e orario')}<th>Allievi</th>${lessonColumnHeader('note', 'Note speciali')}${lessonColumnHeader('luogo', 'Location')}`
        }</tr></thead>
        <tbody>
          ${renderRowsLezioni(lezioni, { showYearGroups, variant, schedaId, gruppoNome })}
        </tbody>
      </table>
    </div>`
  return html
}

function lessonTableStateClasses() {
  return Object.entries(lezioniColumnState)
    .map(([key, open]) => `lesson-col-${key}-${open ? 'open' : 'closed'}`)
    .join(' ')
}

function lessonColumnHeader(key, label) {
  const pressed = !!lezioniColumnState[key]
  return `<th class="lesson-toggle-th lesson-col-${key}">
    <button type="button" class="lesson-col-toggle" data-column="${esc(key)}" aria-label="${pressed ? 'Nascondi' : 'Mostra'} ${esc(label)}" aria-pressed="${pressed ? 'true' : 'false'}" title="${pressed ? 'Nascondi' : 'Mostra'} ${esc(label)}" onclick="event.stopPropagation(); toggleLezioniColumn('${esc(key)}')">${lessonColumnIcon(key)}</button>
  </th>`
}

function lessonColumnCell(key, content) {
  return `<td class="lesson-toggle-cell lesson-col-${key}"><span class="lesson-col-content">${content}</span></td>`
}

function lessonColumnIcon(key) {
  const icons = {
    data: '<svg class="lesson-col-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 2v4M16 2v4M3 10h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    luogo: '<svg class="lesson-col-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    note: '<svg class="lesson-col-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15 3v5h5M10 13h7M10 17h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  }
  return icons[key] || ''
}

function toggleLezioniColumn(key) {
  if (!(key in lezioniColumnState)) return
  lezioniColumnState[key] = !lezioniColumnState[key]
  refreshLessonColumnState()
}

function refreshLessonColumnState() {
  document.querySelectorAll('.lesson-table').forEach(table => {
    Object.entries(lezioniColumnState).forEach(([key, open]) => {
      table.classList.toggle(`lesson-col-${key}-open`, open)
      table.classList.toggle(`lesson-col-${key}-closed`, !open)
      const btn = table.querySelector(`.lesson-col-toggle[data-column="${key}"]`)
      if (btn) {
        const label = btn.getAttribute('data-label') || btn.title.replace(/^(Mostra|Nascondi)\s+/, '')
        btn.setAttribute('aria-pressed', open ? 'true' : 'false')
        btn.setAttribute('aria-label', `${open ? 'Nascondi' : 'Mostra'} ${label}`)
        btn.title = `${open ? 'Nascondi' : 'Mostra'} ${label}`
      }
    })
  })
}

function pastYearsForLezioni(lezioni) {
  const annoCorrente = new Date().getFullYear()
  return [...new Set((lezioni || [])
    .map(l => Number(String(l.data || '').slice(0, 4)))
    .filter(anno => anno && anno < annoCorrente))]
    .sort((a, b) => b - a)
}

async function setAnniLezioni(expanded, variant = 'lista', schedaId = null) {
  const target = variant === 'scheda' ? schedaLezioniAnniEspansi : lezioniAnniEspansi
  target.clear()
  if (expanded) {
    const lezioni = variant === 'scheda'
      ? await lezioniPerScheda(schedaId)
      : (lezioniCache || [])
    pastYearsForLezioni(lezioni).forEach(anno => target.add(anno))
  }
  if (variant === 'scheda' && schedaId) {
    await loadScheda(schedaId)
    switchSchedaTab('lezioni')
    return
  }
  renderLezioni()
}

async function lezioniPerScheda(allievoId) {
  if (!allievoId) return []
  const { data } = await sb.from('lezioni_allievi')
    .select('lezioni(id, data)')
    .eq('allievo_id', allievoId)
  return (data || []).map(row => row.lezioni).filter(Boolean)
}

function renderRowsLezioni(lezioni, { showYearGroups = true, variant = 'lista', schedaId = null, gruppoNome = null } = {}) {
  const annoCorrente = new Date().getFullYear()
  const passate = new Map()
  const rows = []

  ;[...(lezioni || [])]
    .sort((a, b) => lessonSortToken(b).localeCompare(lessonSortToken(a)) || String(b.id || '').localeCompare(String(a.id || '')))
    .forEach(l => {
    const anno = Number(String(l.data || '').slice(0, 4)) || annoCorrente
    if (showYearGroups && anno < annoCorrente) {
      if (!passate.has(anno)) passate.set(anno, [])
      passate.get(anno).push(l)
    } else {
      rows.push(renderLezioneListaRow(l, { variant, schedaId, gruppoNome }))
    }
  })

  const anniPassati = [...passate.keys()].sort((a, b) => b - a)
  ensureUltimoAnnoLezioniAperto(anniPassati, variant, schedaId)

  anniPassati.forEach(anno => {
    const lezioniAnno = passate.get(anno)
    const expanded = variant === 'scheda'
      ? schedaLezioniAnniEspansi.has(anno)
      : lezioniAnniEspansi.has(anno)
    const toggle = variant === 'scheda'
      ? `toggleAnnoLezioniScheda(${anno},'${schedaId}')`
      : `toggleAnnoLezioni(${anno})`
    const emptyLuogo = lessonColumnCell('luogo', '')
    const emptyNote = lessonColumnCell('note', '')
    rows.push(`
      <tr class="lezioni-year-row" onclick="${toggle}" style="cursor:pointer">
        ${lessonColumnCell('data', `${expanded ? '▾' : '▸'} ${anno}`)}
        <td><span class="year-count">${lezioniAnno.length} lezion${lezioniAnno.length === 1 ? 'e' : 'i'}</span></td>
        ${emptyNote}${emptyLuogo}
      </tr>`)
    if (expanded) rows.push(...lezioniAnno.map(l => renderLezioneListaRow(l, { variant, schedaId, gruppoNome })))
  })

  return rows.join('')
}

function ensureUltimoAnnoLezioniAperto(anni, variant = 'lista', schedaId = null) {
  if (!anni.length) return
  if (variant === 'scheda') {
    if (!schedaId || schedaLezioniAnniDefaultAperti.has(schedaId)) return
    schedaLezioniAnniEspansi.add(anni[0])
    schedaLezioniAnniDefaultAperti.add(schedaId)
    return
  }
  if (lezioniAnniDefaultAperto) return
  lezioniAnniEspansi.add(anni[0])
  lezioniAnniDefaultAperto = true
}

function renderLezioneListaRow(l, { variant = 'lista', schedaId = null, gruppoNome = null } = {}) {
  const nomi = labelPartecipantiLezione(l)
  const detail = lezioniDettagliEspansi ? renderDettaglioLezione(l, { gruppoNome }) : ''
  const status = lessonStatus(l) === 'aperta' ? '<span class="lesson-status-badge">Aperta</span>' : ''
  const dataLabel = formatLessonDate(l)
  const luogoLabel = l.luogo ? esc(l.luogo) : '—'
  const noteSpeciali = lessonSpecialNotes(l)
  if (variant === 'scheda') {
    return `<tr onclick="openLezione('${l.id}','${schedaId}')" style="cursor:pointer">
      ${lessonColumnCell('data', `<strong>${dataLabel}</strong> ${status}`)}
      <td style="font-size:.84rem">${renderSkillChipsLezione(l, schedaId)}</td>
      ${lessonColumnCell('note', `<div class="lezione-note-cell">${noteSpeciali ? esc(noteSpeciali) : '—'}</div>`)}
      ${lessonColumnCell('luogo', luogoLabel)}
    </tr>`
  }
  return `<tr onclick="openLezione(${jsArg(l.id)},null,${jsArg(gruppoNome)})" style="cursor:pointer">
    ${lessonColumnCell('data', `<strong>${dataLabel}</strong> ${status}`)}
    <td style="font-size:.84rem">${esc(nomi)}</td>
    ${lessonColumnCell('note', `<div class="lezione-note-cell">${noteSpeciali ? esc(noteSpeciali) : '—'}</div>`)}
    ${lessonColumnCell('luogo', luogoLabel)}
  </tr>${detail}`
}

function openDayLessonsWidget(date) {
  const day = String(date || '').slice(0, 10)
  const lessons = (lezioniCache || [])
    .filter(l => String(l.data || '').slice(0, 10) === day)
    .sort((a, b) => lessonSortToken(a).localeCompare(lessonSortToken(b)))
  const existing = document.getElementById('modal-day-lessons')
  if (existing) existing.remove()
  const overlay = document.createElement('div')
  overlay.id = 'modal-day-lessons'
  overlay.className = 'overlay'
  overlay.onclick = event => { if (event.target === overlay) overlay.remove() }
  overlay.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <h3>${esc(formatDateWithWeekday(day))}</h3>
      <div style="display:grid;gap:.45rem">
        ${lessons.length ? lessons.map(l => `
          <button type="button" class="btn btn-outline" style="justify-content:space-between;text-align:left" onclick="var modal=document.getElementById('modal-day-lessons'); if(modal) modal.remove(); openLezione(${jsArg(l.id)})">
            <span>${esc(lessonTime(l) ? `${lessonTime(l)} · ${labelPartecipantiLezione(l)}` : labelPartecipantiLezione(l))}</span>
            <span style="color:var(--muted)">${l.luogo ? esc(l.luogo) : '—'}</span>
          </button>`).join('') : '<div class="empty">Nessuna lezione in questo giorno.</div>'}
      </div>
      <div class="modal-footer"><button class="btn btn-outline" onclick="var modal=document.getElementById('modal-day-lessons'); if(modal) modal.remove()">Chiudi</button></div>
    </div>`
  document.body.appendChild(overlay)
}

function lessonResultCompactLabel(value) {
  const result = normalizedLessonResult(value)
  return result === 'bene' ? '' : lessonResultLabel(result)
}

function lessonSideFeedbackCompactLabel(value) {
  const side = normalizedLessonSideFeedback(value)
  return side === 'bilaterale' ? '' : lessonSideFeedbackLabel(side)
}

function lessonStudentResultFromRows(rows = []) {
  const row = (rows || []).find(r => r?.dimensioni?.esito)
  return row?.dimensioni?.esito ? normalizedLessonResult(row.dimensioni.esito) : ''
}

function renderSkillChipsLezione(lezione, allievoId = null) {
  const isGroupLesson = lezione?.tipo === 'gruppo'
  const viste = new Set()
  const skills = (lezione.lezioni_skills || [])
    .filter(ls => !allievoId || !ls.allievo_id || String(ls.allievo_id) === String(allievoId))
    .map(ls => ({ nome: ls.skills?.nome, stadio: ls.stadio_raggiunto || 0, esito: ls.dimensioni?.esito, latoFeedback: ls.dimensioni?.lato_feedback, originale: latestSkillReplacementName(ls.dimensioni) }))
    .filter(s => !isFakieSkillName(s.nome))
    .filter(s => {
      const key = `${s.nome || ''}-${s.stadio}-${normalizedLessonResult(s.esito)}-${normalizedLessonSideFeedback(s.latoFeedback)}-${s.originale || ''}`
      if (!s.nome || viste.has(key)) return false
      viste.add(key)
      return true
    })
  return skills.length
    ? skills.map(s => {
        const feedback = isGroupLesson ? '' : [lessonResultCompactLabel(s.esito), lessonSideFeedbackCompactLabel(s.latoFeedback)].filter(Boolean).join(' · ')
        return `<span class="st st${s.stadio}">${esc(s.nome)}${s.originale ? ` <span class="skill-origin-note">prima: ${esc(s.originale)}</span>` : ''}${feedback ? ` · ${esc(feedback)}` : ''}</span>`
      }).join(' ')
    : '—'
}

function toggleAnnoLezioni(anno) {
  if (lezioniAnniEspansi.has(anno)) lezioniAnniEspansi.delete(anno)
  else lezioniAnniEspansi.add(anno)
  renderLezioni()
}

async function toggleAnnoLezioniScheda(anno, allievoId) {
  if (schedaLezioniAnniEspansi.has(anno)) schedaLezioniAnniEspansi.delete(anno)
  else schedaLezioniAnniEspansi.add(anno)
  await loadScheda(allievoId)
  switchSchedaTab('lezioni')
}

function labelPartecipantiLezione(lezione) {
  const allievi = (lezione.lezioni_allievi || []).map(la => la.allievi).filter(Boolean)
  if (!allievi.length) return '—'
  const gruppi = [...new Set(allievi.map(a => a.gruppo).filter(Boolean))]
  if (lezione.tipo === 'gruppo' && gruppi.length === 1) return gruppi[0]
  return allievi.map(a => [a.nome, a.cognome].filter(Boolean).join(' ')).join(', ')
}

function toggleDettagliLezioni() {
  lezioniDettagliEspansi = !lezioniDettagliEspansi
  renderLezioni()
}

function aggiornaToggleDettagliLezioni() {
  const btn = document.getElementById('lezioni-dettagli-btn')
  if (!btn) return
  btn.textContent = lezioniDettagliEspansi ? 'Compatta' : 'Espandi'
  btn.classList.toggle('btn-primary', lezioniDettagliEspansi)
  btn.classList.toggle('btn-outline', !lezioniDettagliEspansi)
  const openBtn = document.getElementById('lezioni-aperte-btn')
  if (openBtn) {
    openBtn.classList.toggle('btn-primary', filtroLezioniAperte)
    openBtn.classList.toggle('btn-outline', !filtroLezioniAperte)
    openBtn.textContent = filtroLezioniAperte ? 'Solo aperte' : 'Aperte'
  }
}

function setFiltroLezioniAperte(value) {
  filtroLezioniAperte = !!value
  renderLezioni()
}

function toggleFiltroLezioniAperte() {
  setFiltroLezioniAperte(!filtroLezioniAperte)
}

function renderDettaglioLezione(lezione, { gruppoNome = null } = {}) {
  const skillRows = lezione.lezioni_skills || []
  const isGroupLesson = lezione?.tipo === 'gruppo'
  const skillSectionTitle = lezione?.tipo === 'campo_libero' ? 'Skill pianificate' : 'Skill lavorate'
  const viste = new Set()
  const skills = skillRows
    .map(ls => ({ nome: ls.skills?.nome, stadio: ls.stadio_raggiunto || 0, esercizi: normalizeExerciseList(ls.dimensioni?.esercizi), esito: ls.dimensioni?.esito, latoFeedback: ls.dimensioni?.lato_feedback, originale: latestSkillReplacementName(ls.dimensioni) }))
    .filter(s => !isFakieSkillName(s.nome))
    .filter(s => {
      const key = `${s.nome || ''}-${s.stadio}-${s.esercizi.join('|')}-${s.esito || ''}-${s.latoFeedback || ''}-${s.originale || ''}`
      if (!s.nome || viste.has(key)) return false
      viste.add(key)
      return true
    })
  const skillsHtml = skills.length
    ? skills.map(s => {
        const feedback = isGroupLesson ? '' : [s.esito ? lessonResultLabel(s.esito) : '', s.latoFeedback ? lessonSideFeedbackLabel(s.latoFeedback) : ''].filter(Boolean).join(' · ')
        return `<span class="st st${s.stadio}">${esc(s.nome)}${s.originale ? ` <span class="skill-origin-note">prima: ${esc(s.originale)}</span>` : ''}${feedback ? ` · ${esc(feedback)}` : ''}${s.esercizi.length ? ` · ${esc(s.esercizi.join(', '))}` : ''}</span>`
      }).join('')
    : '<span class="lezione-empty-detail">Nessuna skill registrata.</span>'
  const parsedNotes = lessonParsedNotes(lezione)
  const notePreview = [parsedNotes.meteo ? `Meteo: ${parsedNotes.meteo}` : '', parsedNotes.bene ? `Bene: ${parsedNotes.bene}` : '', parsedNotes.nonFatto ? `Da riprendere: ${parsedNotes.nonFatto}` : '', parsedNotes.note].filter(Boolean).join('\n')
  const noteHtml = notePreview
    ? `<div class="lezione-note-preview">${esc(notePreview)}</div>`
    : '<span class="lezione-empty-detail">Nessuna nota.</span>'

  return `
    <tr class="lezione-detail-row" onclick="openLezione(${jsArg(lezione.id)},null,${jsArg(gruppoNome)})" style="cursor:pointer">
      <td colspan="4" class="lezione-detail-cell">
        <div class="lezione-detail-grid">
          <div>
            <div class="lezione-detail-title">${skillSectionTitle}</div>
            <div class="lezione-skill-list">${skillsHtml}</div>
          </div>
          <div>
            <div class="lezione-detail-title">Note</div>
            ${noteHtml}
          </div>
        </div>
      </td>
    </tr>`
}

function aggiornaFiltroLezioni() {
  const sel = document.getElementById('lezioni-filtro')
  if (!sel) return
  const attivi = ordinaAllieviLista(allieviVisibiliGod().filter(a => a.stato !== 'archiviato'))
  const gruppi = [...new Set(attivi.map(a => a.gruppo).filter(Boolean))].sort()
  const valoriValidi = new Set(['all', ...gruppi.map(g => `gruppo:${g}`), ...attivi.map(a => `allievo:${a.id}`)])
  if (!valoriValidi.has(filtroLezioni)) filtroLezioni = 'all'

  sel.innerHTML = `
    <option value="all">Tutte le lezioni</option>
    ${gruppi.length ? `<optgroup label="Gruppi">${gruppi.map(g => `<option value="gruppo:${esc(g)}">${esc(g)}</option>`).join('')}</optgroup>` : ''}
    ${attivi.length ? `<optgroup label="Allievi">${attivi.map(a => `<option value="allievo:${a.id}">${esc([a.nome, a.cognome].filter(Boolean).join(' '))}</option>`).join('')}</optgroup>` : ''}
  `
  sel.value = filtroLezioni
}

function setFiltroLezioni(value) {
  filtroLezioni = value || 'all'
  renderLezioni()
}

function filtraLezioniPerSelezione(lezioni) {
  if (filtroLezioni === 'all') return lezioni
  if (filtroLezioni.startsWith('allievo:')) {
    const id = filtroLezioni.slice('allievo:'.length)
    return lezioni.filter(l => l.lezioni_allievi?.some(la => la.allievi?.id === id))
  }
  if (filtroLezioni.startsWith('gruppo:')) {
    const gruppo = filtroLezioni.slice('gruppo:'.length)
    return lezioni.filter(l => l.lezioni_allievi?.some(la => la.allievi?.gruppo === gruppo))
  }
  return lezioni
}

async function fetchLezioneCompleta(id) {
  let { data: lezione, error } = await sb.from('lezioni')
    .select('*, lezioni_allievi(allievo_id, allievi(id, nome, cognome, nickname, gruppo, profilo)), lezioni_skills(allievo_id, stadio_raggiunto, fakie, dimensioni, skills(nome, ramo, livello))')
    .eq('id', id)
    .single()
  if (isMissingDimensioniError(error)) {
    ;({ data: lezione, error } = await sb.from('lezioni')
      .select('*, lezioni_allievi(allievo_id, allievi(id, nome, cognome, nickname, gruppo)), lezioni_skills(allievo_id, stadio_raggiunto, fakie, skills(nome, ramo, livello))')
      .eq('id', id)
      .single())
  }
  if (isMissingFakieError(error)) {
    ;({ data: lezione, error } = await sb.from('lezioni')
      .select('*, lezioni_allievi(allievo_id, allievi(id, nome, cognome, nickname, gruppo)), lezioni_skills(allievo_id, stadio_raggiunto, skills(nome, ramo, livello))')
      .eq('id', id)
      .single())
  }
  if (isMissingNoteSpecialiError(error)) {
    ;({ data: lezione, error } = await sb.from('lezioni')
      .select('*, lezioni_allievi(allievo_id, allievi(id, nome, cognome, nickname, gruppo)), lezioni_skills(allievo_id, stadio_raggiunto, skills(nome, ramo, livello))')
      .eq('id', id)
      .single())
    if (lezione) lezione.note_speciali = null
  }
  return { lezione, error }
}

async function lezioneNavStessoAllievo(lezione, partecipanti) {
  const contextAllievoId = lezioneBackAllievoId && partecipanti.some(a => a.id === lezioneBackAllievoId)
    ? lezioneBackAllievoId
    : (partecipanti.length === 1 ? partecipanti[0].id : null)
  const gruppiLezione = [...new Set(partecipanti.map(a => a.gruppo).filter(Boolean))]
  const contextGruppoNome = contextAllievoId
    ? null
    : (lezioneBackGruppoNome && partecipanti.some(a => a.gruppo === lezioneBackGruppoNome)
      ? lezioneBackGruppoNome
      : (lezione.tipo === 'gruppo' && gruppiLezione.length === 1 ? gruppiLezione[0] : null))
  if (!contextAllievoId && !contextGruppoNome) return { allievoId: null, gruppoNome: null, prev: null, next: null }

  const query = sb.from('lezioni_allievi').select('lezione_id, lezioni(id, data)')
  const membriGruppo = contextGruppoNome ? gruppoMembri(contextGruppoNome, { includeArchived: true }) : []
  const { data, error } = contextAllievoId
    ? await query.eq('allievo_id', contextAllievoId)
    : await query.in('allievo_id', membriGruppo.map(a => a.id))
  if (error) return { allievoId: contextAllievoId, gruppoNome: contextGruppoNome, prev: null, next: null }

  const byId = new Map()
  ;(data || []).forEach(row => {
    const l = row.lezioni
    if (l?.id) byId.set(l.id, l)
  })
  const lezioni = [...byId.values()]
    .sort((a, b) => String(a.data || '').localeCompare(String(b.data || '')) || String(a.id).localeCompare(String(b.id)))
  const index = lezioni.findIndex(l => l.id === lezione.id)
  return {
    allievoId: contextAllievoId,
    gruppoNome: contextGruppoNome,
    prev: index > 0 ? lezioni[index - 1] : null,
    next: index >= 0 && index < lezioni.length - 1 ? lezioni[index + 1] : null,
  }
}

async function cancellaLezioneInModifica() {
  if (!editingLezioneId) return
  if (!confirm('Cancellare questa lezione? Prima verra salvata una copia nel backup locale.')) return

  const errEl = document.getElementById('lz-err')
  errEl.classList.remove('show')
  const buttons = [document.getElementById('btn-cancella-lz'), document.getElementById('btn-salva-lz'), document.getElementById('btn-salva-lz-top')].filter(Boolean)
  buttons.forEach(btn => { btn.disabled = true })
  try {
    const { lezione, error } = await fetchLezioneCompleta(editingLezioneId)
    if (error) throw error
    salvaBackupLocale('lezione_cancellata', lezione)
    await sb.from('lezioni_skills').delete().eq('lezione_id', editingLezioneId)
    await sb.from('lezioni_allievi').delete().eq('lezione_id', editingLezioneId)
    const { error: deleteError } = await sb.from('lezioni').delete().eq('id', editingLezioneId)
    if (deleteError) throw deleteError
    const backId = lezioneBackAllievoId
    editingLezioneId = null
    editingLezioneAllieviIds = []
    editingLezioneSkillRows = {}
    lezioniCache = null
    if (backId) {
      await loadScheda(backId)
      switchSchedaTab('lezioni')
    } else {
      showView('lezioni')
    }
  } catch (e) {
    errEl.textContent = e.message || 'Errore nella cancellazione della lezione.'
    errEl.classList.add('show')
    buttons.forEach(btn => { btn.disabled = false })
  }
}

async function loadLezione(id) {
  currentLezioneId = id
  recordAppHistory('lezione', id)
  const el = document.getElementById('lezione-content')
  el.innerHTML = '<div class="loading">Caricamento…</div>'

  const { lezione, error } = await fetchLezioneCompleta(id)
  if (error || !lezione) {
    el.innerHTML = `<button class="back-btn" onclick="tornaDaLezione()">${lezioneBackLabel()}</button><div class="card"><div class="empty">${esc(error?.message || 'Lezione non trovata.')}</div></div>`
    return
  }

  const partecipanti = (lezione.lezioni_allievi || [])
    .map(la => la.allievi)
    .filter(Boolean)
  const gruppiLezione = [...new Set(partecipanti.map(a => a.gruppo).filter(Boolean))]
  const titoloLezione = lezione.tipo === 'gruppo' && gruppiLezione.length === 1
    ? gruppiLezione[0]
    : labelPartecipantiLezione(lezione)
  const titoloLezioneHtml = lezione.tipo === 'gruppo' && gruppiLezione.length === 1
    ? `<button type="button" class="linkish lezione-read-title" onclick="showView('gruppo',${jsArg(gruppiLezione[0])})">${esc(titoloLezione)}</button>`
    : `<div class="lezione-read-title">${esc(titoloLezione)}</div>`
  const dettagliQuando = [
    lezione.durata_min ? `${lezione.durata_min} min` : '',
    lezione.luogo ? esc(lezione.luogo) : '',
  ].filter(Boolean).join('<br>')
  const navStessoAllievo = await lezioneNavStessoAllievo(lezione, partecipanti)
  const navArrow = (target, direction) => {
    const isPrev = direction === 'prev'
    const label = isPrev ? 'Lezione precedente' : 'Lezione successiva'
    const arrow = isPrev ? '‹' : '›'
    if (!target) return `<button type="button" class="lezione-nav-arrow" disabled aria-label="${label}">${arrow}</button>`
    return `<button type="button" class="lezione-nav-arrow" onclick="openLezione(${jsArg(target.id)},${jsArg(navStessoAllievo.allievoId)},${jsArg(navStessoAllievo.gruppoNome)})" title="${label}: ${esc(formatLessonDateWithWeekday(target))}" aria-label="${label}">${arrow}</button>`
  }
  const partecipantiHtml = partecipanti.length
    ? partecipanti.map(a => {
        const nomeCompleto = [a.nome, a.cognome].filter(Boolean).join(' ')
        return `
          <div class="lezione-read-person clickable" onclick="apriSchedaAllievoDaLezione('${a.id}')" title="Apri scheda allievo">
            ${a.nickname ? `<strong>${esc(a.nickname)}</strong>` : ''}
            ${nomeCompleto ? `<span>${a.nickname ? '· ' : ''}${esc(nomeCompleto)}</span>` : ''}
            ${a.gruppo ? `<span>· ${esc(a.gruppo)}</span>` : ''}
          </div>`
      }).join('')
    : '<div class="empty">Nessun allievo collegato.</div>'

  const skillsByAllievo = {}
  const skillSectionTitle = lezione.tipo === 'campo_libero' ? 'Skill pianificate' : 'Skill lavorate'
  ;(lezione.lezioni_skills || []).forEach(row => {
    if (isFakieSkillName(row.skills?.nome)) return
    const key = row.allievo_id || 'generale'
    if (!skillsByAllievo[key]) skillsByAllievo[key] = []
    skillsByAllievo[key].push(row)
  })

  const skillsHtml = Object.keys(skillsByAllievo).length
    ? Object.entries(skillsByAllievo).map(([allievoId, rows]) => {
        const allievo = partecipanti.find(a => a.id === allievoId)
        const titolo = allievo ? [allievo.nome, allievo.cognome].filter(Boolean).join(' ') : skillSectionTitle
        const studentResult = lezione.tipo === 'gruppo' ? lessonStudentResultFromRows(rows) : ''
        const titoloFeedback = studentResult ? ` · ${lessonResultLabel(studentResult)}` : ''
        const chips = rows
          .filter(r => r.skills?.nome)
          .map(r => {
            const direzione = r.dimensioni?.direzione || (r.fakie ? 'fakie' : '')
            const esercizi = normalizeExerciseList(r.dimensioni?.esercizi)
            const feedback = lezione.tipo === 'gruppo' ? [] : [r.dimensioni?.esito ? lessonResultLabel(r.dimensioni.esito) : '', r.dimensioni?.lato_feedback ? lessonSideFeedbackLabel(r.dimensioni.lato_feedback) : ''].filter(Boolean)
            const dimensionLabels = ['lato','superficie','piano','velocita','assistenza','stress'].map(key => dimensionValueLabel(r.dimensioni?.[key])).filter(Boolean)
            const extra = [...feedback, direzione, ...dimensionLabels, esercizi.length ? `esercizi: ${esercizi.join(', ')}` : ''].filter(Boolean).join(' · ')
            return `<span class="st st${r.stadio_raggiunto || 0}">${esc(r.skills.nome)}${extra ? ` · ${esc(extra)}` : ''}${r.skills.livello ? ` · Lv.${r.skills.livello}` : ''}</span>`
          })
          .join('')
        return `<div class="lezione-read-block">
          <h4>${esc(titolo)}${titoloFeedback ? `<span class="lesson-student-result">${esc(titoloFeedback)}</span>` : ''}</h4>
          <div class="lezione-skill-list">${chips || '<span class="lezione-empty-detail">Nessuna skill registrata.</span>'}</div>
        </div>`
      }).join('')
    : '<div class="empty">Nessuna skill registrata.</div>'

  const pickLessonField = keys => {
    for (const key of keys) {
      const value = lezione[key]
      if (value === null || value === undefined || value === '') continue
      if (Array.isArray(value) && !value.length) continue
      return Array.isArray(value) ? value.join('\n') : String(value)
    }
    return ''
  }
  const pianoLezione = [
    ['Teoria', pickLessonField(['teoria'])],
    ['Riscaldamento', pickLessonField(['riscaldamento'])],
    ['Lezione', pickLessonField(['lezione', 'struttura_lezione', 'programma_lezione'])],
    ['Gioco', pickLessonField(['gioco'])],
  ].filter(([, value]) => value)
  const pianoLezioneHtml = `<p class="sec-title">Lezione</p>
    <div class="card">
      ${pianoLezione.length ? `
        <table class="lezione-plan-table">
          <tbody>
            ${pianoLezione.map(([label, value]) => `<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`).join('')}
          </tbody>
        </table>` : '<div class="empty">Nessuna struttura lezione registrata.</div>'}
    </div>`
  const parsedNotes = lessonParsedNotes(lezione)
  const noteSpecialiRead = lessonSpecialNotes(lezione)

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">
      <button class="back-btn" onclick="tornaDaLezione()" style="margin-bottom:0">${lezioneBackLabel()}</button>
      <div style="display:flex;gap:.45rem;flex-wrap:wrap">
        ${lessonStatus(lezione) === 'aperta' ? `<button class="btn btn-primary btn-sm" onclick="chiudiLezioneGuidata(${jsArg(lezione.id)})">Chiudi lezione</button>` : ''}
        <button class="btn btn-outline btn-sm" onclick="openHistoryModal('lezione',${jsArg(lezione.id)},'Storico lezione')">Storico</button>
        <button class="btn btn-outline btn-sm" onclick="showView('nuova-lezione','lezione:${lezione.id}')">${editIcon()} Modifica</button>
      </div>
    </div>

    <div class="card">
      <div class="lezione-read-head">
        <div>
          ${titoloLezioneHtml}
          ${lessonStatus(lezione) === 'aperta' ? '<div style="margin-top:.4rem"><span class="lesson-status-badge">Aperta</span></div>' : ''}
        </div>
        <div class="lezione-read-when">
          <div class="lezione-when-nav">
            ${navArrow(navStessoAllievo.prev, 'prev')}
            <div class="lezione-when-main">
              <button type="button" class="linkish lezione-read-date" onclick="openDayLessonsWidget(${jsArg(String(lezione.data || '').slice(0, 10))})">${formatLessonDateWithWeekday(lezione)}</button>
              ${dettagliQuando || '<span>Orario e luogo non indicati</span>'}
            </div>
            ${navArrow(navStessoAllievo.next, 'next')}
          </div>
        </div>
      </div>
      ${(lezione.updated_at || lezione.aggiornato_il) ? `<div style="color:var(--muted);font-size:.78rem;margin-top:.55rem">Ultima modifica: ${esc(formatDateTime(lezione.updated_at || lezione.aggiornato_il))}</div>` : ''}
    </div>

    ${noteSpecialiRead ? `
      <p class="sec-title">Note speciali</p>
      <div class="card"><div class="lezione-read-note">${esc(noteSpecialiRead)}</div></div>
    ` : ''}

    ${parsedNotes.meteo ? `
      <p class="sec-title">Meteo</p>
      <div class="card"><div class="lezione-read-note">${esc(parsedNotes.meteo)}</div></div>
    ` : ''}

    <div class="lezione-read-grid">
      <div>
        <p class="sec-title">Allievi presenti</p>
        <div class="card"><div class="lezione-read-list">${partecipantiHtml}</div></div>
      </div>
      <div>
        ${pianoLezioneHtml}
        <p class="sec-title">${skillSectionTitle}</p>
        <div class="card">${skillsHtml}</div>
      </div>
    </div>

    ${renderLessonCheckBlocks(lezione)}

    <p class="sec-title">Note</p>
    <div class="card">
      ${parsedNotes.note ? `<div class="lezione-read-note">${esc(parsedNotes.note)}</div>` : '<div class="empty">Nessuna nota registrata.</div>'}
    </div>
  `
  requestAnimationFrame(() => motion.cards(el))
}

// ── Nuova lezione ─────────────────────────────────────────────────────

function lezioneFormTitle(isEdit = false) {
  if (isEdit) return 'Modifica lezione'
  if (lezioneFormMode === 'prep') return 'Prepara lezione'
  return 'Nuova lezione'
}

function lezioneFormSaveLabel(isEdit = false) {
  if (isEdit) return 'Salva modifiche'
  return 'Salva lezione'
}

function syncLezioneFormLabels(isEdit = !!editingLezioneId) {
  document.getElementById('lz-title').textContent = lezioneFormTitle(isEdit)
  document.getElementById('btn-salva-lz').textContent = lezioneFormSaveLabel(isEdit)
  document.getElementById('btn-salva-lz-top').textContent = lezioneFormSaveLabel(isEdit)
  ;[document.getElementById('btn-salva-lz'), document.getElementById('btn-salva-lz-top')]
    .filter(Boolean)
    .forEach(btn => { btn.hidden = false })
}

async function initNuovaLezione(presetAllievoId = null) {
  editingLezioneId = null
  editingLezioneAllieviIds = []
  editingLezioneSkillRows = {}
  lezioneFormMode = 'standard'
  let editingLezioneTipo = ''
  let explicitLezioneMode = false
  if (typeof presetAllievoId === 'string' && presetAllievoId.startsWith('modo:prep')) {
    lezioneFormMode = 'prep'
    explicitLezioneMode = true
    presetAllievoId = presetAllievoId.startsWith('modo:prep:') ? presetAllievoId.slice('modo:prep:'.length) : null
  }
  const editId = typeof presetAllievoId === 'string' && presetAllievoId.startsWith('lezione:')
    ? presetAllievoId.slice('lezione:'.length)
    : null
  const groupPreset = typeof presetAllievoId === 'string' && presetAllievoId.startsWith('gruppo:')
    ? presetAllievoId.slice('gruppo:'.length)
    : null
  if (!editId && !groupPreset && !explicitLezioneMode) {
    showView('lezioni')
    return
  }
  lezionePresetAllievoId = editId || groupPreset ? null : presetAllievoId
  if (!editId) {
    lezioneBackAllievoId = groupPreset ? null : (presetAllievoId || null)
    lezioneBackGruppoNome = groupPreset || null
  }
  // Data di default = oggi
  document.getElementById('lz-data').value    = localDateIso()
  document.getElementById('lz-ora').value     = ''
  document.getElementById('lz-durata').value  = ''
  document.getElementById('lz-luogo').value   = ''
  const locationSelect = document.getElementById('lz-location-id')
  if (locationSelect) locationSelect.innerHTML = '<option value="">Luogo manuale / nessuna location</option>'
  document.getElementById('lz-meteo').value   = ''
  setLessonStatus('aperta')
  document.getElementById('lz-luogo-suggest').hidden = true
  document.getElementById('lz-luogo-suggest').innerHTML = ''
  document.getElementById('lz-note-speciali').value = ''
  document.getElementById('lz-check-bene').value = ''
  document.getElementById('lz-check-non-fatto').value = ''
  document.getElementById('lz-note').value    = ''
  const studentNotes = document.getElementById('lz-student-notes')
  if (studentNotes) {
    studentNotes.hidden = true
    studentNotes.innerHTML = ''
  }
  clearLezioneFormMessage()
  document.getElementById('lz-prep-board').hidden = true
  document.getElementById('lz-prep-board').innerHTML = ''
  document.getElementById('lz-skills-container').innerHTML = ''
  document.getElementById('lz-gruppo-panel').hidden = true
  document.getElementById('lz-gruppo-panel').innerHTML = ''
  document.getElementById('lz-allievi-list').innerHTML = ''
  document.getElementById('lz-hidden-checks').innerHTML = ''
  document.getElementById('lz-special-guest-panel').hidden = true
  document.getElementById('lz-special-guest-panel').innerHTML = ''
  editingLezioneGroupFeedback = {}
  syncLezioneFormLabels(!!editId)
  document.getElementById('btn-cancella-lz').hidden = !editId
  document.getElementById('lz-back-btn').textContent = lezioneBackLabel()
  renderLezioneTargetOptions()
  ensurePrepFallbackTarget(presetAllievoId)

  if (editId) {
    let { data: lezione, error } = await sb.from('lezioni')
      .select('id, data, tipo, durata_min, luogo, location_id, meteo, note, note_speciali, stato, check_bene, check_non_fatto, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni)')
      .eq('id', editId)
      .single()
    if (isMissingLessonLocationIdError(error)) {
      ;({ data: lezione, error } = await sb.from('lezioni')
        .select('id, data, tipo, durata_min, luogo, meteo, note, note_speciali, stato, check_bene, check_non_fatto, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni)')
        .eq('id', editId)
        .single())
    }
    if (isMissingLessonMeteoError(error)) {
      ;({ data: lezione, error } = await sb.from('lezioni')
        .select('id, data, tipo, durata_min, luogo, note, note_speciali, stato, check_bene, check_non_fatto, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni)')
        .eq('id', editId)
        .single())
    }
    if (isMissingLessonCheckError(error)) {
      ;({ data: lezione, error } = await sb.from('lezioni')
        .select('id, data, tipo, durata_min, luogo, note, note_speciali, stato, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni)')
        .eq('id', editId)
        .single())
    }
    if (isMissingLessonStatusError(error)) {
      ;({ data: lezione, error } = await sb.from('lezioni')
        .select('id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni)')
        .eq('id', editId)
        .single())
    }
    if (isMissingDimensioniError(error)) {
      ;({ data: lezione, error } = await sb.from('lezioni')
        .select('id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie)')
        .eq('id', editId)
        .single())
    }
    if (isMissingFakieError(error)) {
      ;({ data: lezione, error } = await sb.from('lezioni')
        .select('id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto)')
        .eq('id', editId)
        .single())
    }
    if (isMissingNoteSpecialiError(error)) {
      ;({ data: lezione, error } = await sb.from('lezioni')
        .select('id, data, tipo, durata_min, luogo, note, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto)')
        .eq('id', editId)
        .single())
      if (lezione) lezione.note_speciali = null
    }
    if (error || !lezione) {
      const errEl = document.getElementById('lz-err')
      errEl.textContent = error?.message || 'Lezione non trovata.'
      errEl.classList.add('show')
      renderLezionePartecipanti()
      return
    }

    editingLezioneId = editId
    editingLezioneTipo = lezione.tipo || ''
    editingLezioneAllieviIds = (lezione.lezioni_allievi || []).map(r => r.allievo_id).filter(Boolean)
    ;(lezione.lezioni_skills || []).forEach(r => {
      const ownerId = r.allievo_id || FREE_LESSON_SKILL_ROWS_KEY
      if (!editingLezioneSkillRows[ownerId]) editingLezioneSkillRows[ownerId] = []
      if (r.allievo_id) rememberGroupStudentFeedback(r.allievo_id, r.dimensioni || {})
      editingLezioneSkillRows[ownerId].push({
        skillId: r.skill_id,
        stadio: r.stadio_raggiunto || 1,
        fakie: !!r.fakie,
        dimensioni: lezione.tipo === 'gruppo' ? lessonSkillOnlyDimensions(r.dimensioni || {}) : (r.dimensioni || null),
      })
    })

    document.getElementById('lz-data').value = lezione.data || ''
    document.getElementById('lz-ora').value = lessonTime(lezione)
    document.getElementById('lz-durata').value = lezione.durata_min || ''
    document.getElementById('lz-luogo').value = lezione.luogo || ''
    renderLezioneLocationSelect(lezione.location_id || '', lezione.luogo || '')
    setLessonStatus(lessonStatus(lezione))
    const parsedNotes = lessonParsedNotes(lezione)
    document.getElementById('lz-meteo').value = parsedNotes.meteo || ''
    document.getElementById('lz-note-speciali').value = lezione.note_speciali || parsedNotes.speciali || ''
    document.getElementById('lz-check-bene').value = parsedNotes.bene || ''
    document.getElementById('lz-check-non-fatto').value = parsedNotes.nonFatto || ''
    document.getElementById('lz-note').value = parsedNotes.note || ''
  }

  renderLezioneTargetOptions()
  let restoredDraft = null
  let draftSelectedIds = []
  if (editId) {
    const draft = loadLezioneDraft()
    if (draft?.editingLezioneId && String(draft.editingLezioneId) === String(editId)) {
      restoredDraft = normalizeEditingLessonDraft(draft, editingLezioneTipo, editingLezioneAllieviIds)
      draftSelectedIds = restoreLezioneDraft(restoredDraft)
      setLezioneFormMessage(`Bozza locale ripristinata: il salvataggio online precedente non era riuscito. Riprova quando sei online.`, 'msg-info')
    } else {
      setLezioneTargetFromEditing(editingLezioneTipo)
    }
  } else if (groupPreset) {
    document.getElementById('lz-tipo').value = `gruppo:${groupPreset}`
  } else if (lezionePresetAllievoId) {
    document.getElementById('lz-tipo').value = `allievo:${lezionePresetAllievoId}`
  } else {
    document.getElementById('lz-tipo').value = ''
  }
  if (lezioneFormMode === 'prep' && !document.getElementById('lz-tipo').value) {
    document.getElementById('lz-tipo').value = 'campo_libero'
  }
  if (editId && !restoredDraft && currentLessonTargetIsGroup()) collapseCommonGroupSkillRows(editingLezioneAllieviIds)

  const draft = !editId && !explicitLezioneMode ? loadLezioneDraft() : null
  if (draft && !draft.editingLezioneId) {
    restoredDraft = draft
    draftSelectedIds = restoreLezioneDraft(draft)
  }
  if (draft?.formMode) lezioneFormMode = draft.formMode === 'prep' ? 'prep' : 'standard'
  syncLezioneFormLabels(!!editId)
  if (!editId) renderLezioneLocationSelect('', document.getElementById('lz-luogo')?.value || '')
  renderLezionePartecipanti()
  if (editId) {
    const desiredParticipantIds = draftSelectedIds.length ? draftSelectedIds : editingLezioneAllieviIds
    restoreEditingLessonParticipantSelection(desiredParticipantIds)
    desiredParticipantIds
      .filter(id => !selectedLezioneAllieviIds().includes(id))
      .forEach(id => addSpecialGuestToLesson(id))
  }
  draftSelectedIds
    .filter(id => !selectedLezioneAllieviIds().includes(id))
    .forEach(id => addSpecialGuestToLesson(id))
  if (pendingSpecialGuestId) {
    addSpecialGuestToLesson(pendingSpecialGuestId)
    pendingSpecialGuestId = null
    saveLezioneDraft({ keep: true })
  }
}

function renderLezionePartecipanti() {
  const target = document.getElementById('lz-tipo').value
  const listEl = document.getElementById('lz-allievi-list')
  const groupPanel = document.getElementById('lz-gruppo-panel')
  const hiddenChecks = document.getElementById('lz-hidden-checks')
  const errEl = document.getElementById('lz-err')
  document.getElementById('lz-skills-container').innerHTML = ''
  groupPanel.hidden = true
  groupPanel.innerHTML = ''
  listEl.innerHTML = ''
  hiddenChecks.innerHTML = ''
  if (target && errEl?.textContent === 'Seleziona allievo, gruppo o campo libero.') {
    errEl.classList.remove('show')
  }

  if (target === 'campo_libero') {
    renderLessonStudentNotes()
    renderFreeLessonSkillWorkspace()
    renderSpecialGuestPanel()
    renderPrepBoard()
    refreshSuggerimentiLuogoSeAperti()
    return
  }

  const attivi = allieviSelezionabiliLezione()
  if (!attivi.length) {
    renderLessonStudentNotes()
    renderSpecialGuestPanel()
    return
  }

  if (target.startsWith('allievo:')) {
    setLezioneAllievi([target.slice('allievo:'.length)])
  } else if (target.startsWith('gruppo:')) {
    const gruppo = target.slice('gruppo:'.length)
    const ids = allieviSelezionabiliLezione().filter(a => a.gruppo === gruppo).map(a => a.id)
    setLezioneAllievi(ids)
    renderGroupLessonPanel(gruppo)
    if (lezioneFormMode !== 'prep') renderGroupSkillWorkspace()
  }
  lezionePresetAllievoId = null
  applyDefaultLessonLocationFromTarget()
  renderLezioneLocationSelect(document.getElementById('lz-location-id')?.value || '', document.getElementById('lz-luogo')?.value || '')
  renderSpecialGuestPanel()
  renderLessonStudentNotes()
  renderPrepBoard()
  refreshSuggerimentiLuogoSeAperti()
}

function currentLessonTargetIsGroup() {
  return document.getElementById('lz-tipo')?.value?.startsWith('gruppo:')
}

function currentLessonTargetIsFree() {
  return document.getElementById('lz-tipo')?.value === 'campo_libero'
}

async function renderLezioneLocationSelect(selectedId = '', selectedLuogo = '') {
  const select = document.getElementById('lz-location-id')
  if (!select) return
  await loadLocations()
  const names = locationNamesFromLessons()
  const records = names.map(nome => locationRecordByName(nome) || { nome })
  const selectedRecord = selectedId
    ? locationRecordById(selectedId)
    : (selectedLuogo ? locationRecordByName(selectedLuogo) : null)
  const value = selectedId || selectedRecord?.id || ''
  const options = records
    .filter(record => record.id)
    .sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || ''), 'it', { sensitivity: 'base' }))
    .map(record => `<option value="${esc(record.id)}" ${String(record.id) === String(value) ? 'selected' : ''}>${esc(record.nome || '')}</option>`)
    .join('')
  select.innerHTML = `<option value="">Luogo manuale / nessuna location</option>${options}`
  select.value = value
}

function scegliLocationLezione(locationId) {
  const record = locationRecordById(locationId)
  if (!record) return
  const input = document.getElementById('lz-luogo')
  if (input) input.value = record.nome || ''
}

function defaultLessonLocationForTarget(targetValue = '') {
  if (targetValue.startsWith('gruppo:')) {
    const gruppo = targetValue.slice('gruppo:'.length)
    return profiloComuneGruppo(gruppoMembri(gruppo)).luogo_incontro || ''
  }
  if (targetValue.startsWith('allievo:')) {
    const allievo = allievoById(targetValue.slice('allievo:'.length))
    if (!allievo) return ''
    const logistica = logisticaIndividualeProfilo(allievo.profilo || {}, !!allievo.gruppo)
    return logistica.luogo_incontro || (!allievo.gruppo ? allievo.profilo?.luogo_incontro : '') || ''
  }
  return ''
}

function applyDefaultLessonLocationFromTarget() {
  if (editingLezioneId) return
  const input = document.getElementById('lz-luogo')
  const target = document.getElementById('lz-tipo')?.value || ''
  if (!input || input.value.trim()) return
  const luogo = defaultLessonLocationForTarget(target)
  if (luogo) {
    input.value = luogo
    renderLezioneLocationSelect('', luogo)
  }
}

function allievoById(id) {
  return allAllievi.find(a => a.id === id) || null
}

function allievoDisplayName(id) {
  const a = allievoById(id)
  if (!a) return id
  return [a.nome, a.cognome].filter(Boolean).join(' ') || a.nickname || id
}

function allieviSelezionabiliLezione({ includeArchived = false } = {}) {
  const visibili = allieviVisibiliGod()
  return includeArchived ? visibili : visibili.filter(a => a.stato !== 'archiviato')
}

function lezioneTargetLabelAllievo(a) {
  return `${[a.nome, a.cognome].filter(Boolean).join(' ')}${a.nickname ? ' · ' + a.nickname : ''}`
}

function renderLezioneTargetOptions(selected = '') {
  const sel = document.getElementById('lz-tipo')
  if (!sel) return
  let attivi = []
  let gruppi = []
  try {
    attivi = ordinaAllieviLista(allieviSelezionabiliLezione())
    gruppi = gruppiSelezionabiliLezione()
  } catch (error) {
    console.error('Lista allievi lezione non disponibile', error)
  }
  sel.innerHTML = `
    <option value="">— Seleziona allievo o gruppo —</option>
    ${attivi.length ? `<optgroup label="Allievi">${attivi.map(a => `<option value="allievo:${a.id}">${esc(lezioneTargetLabelAllievo(a))}</option>`).join('')}</optgroup>` : ''}
    ${gruppi.length ? `<optgroup label="Gruppi">${gruppi.map(g => `<option value="gruppo:${esc(g)}">${esc(g)}</option>`).join('')}</optgroup>` : ''}
    <option value="campo_libero">Campo libero</option>`
  sel.value = [...sel.options].some(option => option.value === selected) ? selected : ''
}

function lessonGroupTargetFromParticipants(ids = []) {
  const counts = new Map()
  ids.forEach(id => {
    const gruppo = allievoById(id)?.gruppo
    if (gruppo) counts.set(gruppo, (counts.get(gruppo) || 0) + 1)
  })
  if (lezioneBackGruppoNome && counts.has(lezioneBackGruppoNome)) return lezioneBackGruppoNome
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), 'it', { sensitivity: 'base' }))[0]?.[0] || ''
}

function editingLessonTarget(savedType = '', ids = editingLezioneAllieviIds) {
  const participantIds = [...new Set((ids || []).filter(Boolean))]
  if (!participantIds.length) return 'campo_libero'
  if (savedType === 'gruppo') {
    const gruppo = lessonGroupTargetFromParticipants(participantIds)
    if (gruppo) return `gruppo:${gruppo}`
  }
  if (savedType === 'individuale' || participantIds.length === 1) return `allievo:${participantIds[0]}`
  const gruppo = lessonGroupTargetFromParticipants(participantIds)
  return gruppo ? `gruppo:${gruppo}` : `allievo:${participantIds[0]}`
}

function setLezioneTargetFromEditing(savedType = '') {
  const sel = document.getElementById('lz-tipo')
  if (!sel) return
  const target = editingLessonTarget(savedType)
  sel.value = [...sel.options].some(option => option.value === target) ? target : (editingLezioneAllieviIds.length ? `allievo:${editingLezioneAllieviIds[0]}` : 'campo_libero')
}

function normalizeEditingLessonDraft(draft, savedType, participantIds) {
  const canonicalTarget = editingLessonTarget(savedType, participantIds)
  if (!canonicalTarget || draft.target !== 'campo_libero' || canonicalTarget === 'campo_libero') return draft
  const skillRows = { ...(draft.skillRows || {}) }
  const freeRows = skillRows[FREE_LESSON_SKILL_ROWS_KEY] || []
  if (freeRows.length) {
    const ownerId = canonicalTarget.startsWith('gruppo:')
      ? GROUP_SKILL_ROWS_KEY
      : canonicalTarget.slice('allievo:'.length)
    skillRows[ownerId] = [...(skillRows[ownerId] || []), ...freeRows]
    delete skillRows[FREE_LESSON_SKILL_ROWS_KEY]
  }
  return {
    ...draft,
    target: canonicalTarget,
    selectedIds: (draft.selectedIds || []).length ? draft.selectedIds : [...participantIds],
    skillRows,
  }
}

function restoreEditingLessonParticipantSelection(ids = []) {
  if (!currentLessonTargetIsGroup()) return
  const selected = new Set(ids)
  document.querySelectorAll('#lz-hidden-checks input[type=checkbox]').forEach(input => {
    input.checked = selected.has(input.value)
  })
  document.querySelectorAll('#lz-gruppo-panel input[type=checkbox][value]').forEach(input => {
    input.checked = selected.has(input.value)
    input.closest('.group-presence-row')?.querySelector('.group-student-feedback')?.classList.toggle('is-unselected', !input.checked)
  })
  refreshGroupExclusionControls()
  renderGroupIndividualControls()
  renderLessonStudentNotes()
}

function gruppiSelezionabiliLezione({ includeArchived = false } = {}) {
  return [...new Set(allieviSelezionabiliLezione({ includeArchived }).map(a => a.gruppo).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
}

function gruppoDaAllieviLezione(ids) {
  if (!ids?.length) return ''
  const idSet = new Set(ids)
  const gruppiDisponibili = gruppiSelezionabiliLezione({ includeArchived: true })
  const gruppoCompleto = gruppiDisponibili.find(gruppo => {
    const membri = allieviSelezionabiliLezione({ includeArchived: true }).filter(a => a.gruppo === gruppo).map(a => a.id)
    return membri.length && membri.every(id => idSet.has(id))
  })
  if (gruppoCompleto) return gruppoCompleto
  const gruppi = [...new Set(allAllievi.filter(a => ids.includes(a.id)).map(a => a.gruppo).filter(Boolean))]
  return gruppi.length === 1 ? gruppi[0] : ''
}

function renderAllieviGruppoLezione(gruppo, presentiSet = null) {
  const listEl = document.getElementById('lz-allievi-list')
  document.getElementById('lz-skills-container').innerHTML = ''
  if (!gruppo) {
    listEl.innerHTML = '<div class="empty">Seleziona un gruppo per vedere gli allievi.</div>'
    return
  }
  const membri = allieviSelezionabiliLezione().filter(a => a.gruppo === gruppo)
  if (!membri.length) {
    listEl.innerHTML = '<div class="empty">Nessun allievo attivo in questo gruppo.</div>'
    return
  }
  listEl.innerHTML = membri.map(a => `
    <label style="display:flex;align-items:center;gap:.6rem;padding:.4rem 0;font-size:.9rem">
      <input type="checkbox" value="${a.id}" ${presentiSet && !presentiSet.has(a.id) ? '' : 'checked'} onchange="toggleAllievo(this,${jsArg([a.nome, a.cognome].filter(Boolean).join(' '))})">
      ${esc([a.nome, a.cognome].filter(Boolean).join(' '))}
    </label>`).join('')
  ;[...listEl.querySelectorAll('input[type=checkbox]:checked')].forEach(cb => {
    const a = membri.find(m => m.id === cb.value)
    if (a) toggleAllievo(cb, [a.nome, a.cognome].filter(Boolean).join(' '))
  })
}

function renderGroupLessonPanel(gruppo) {
  const panel = document.getElementById('lz-gruppo-panel')
  const selected = new Set(selectedLezioneAllieviIds())
  const membri = allieviSelezionabiliLezione().filter(a => a.gruppo === gruppo)
  const guests = selectedLezioneAllieviIds()
    .map(id => allievoById(id))
    .filter(a => a && a.gruppo !== gruppo)
  panel.hidden = false
  panel.innerHTML = `
    <div class="card">
      <p class="form-sec" style="margin-top:0">Presenti</p>
      <div class="group-presence-grid">
        ${membri.map(a => `
          <div class="group-presence-row" data-allievo-id="${esc(a.id)}">
            <label class="group-presence-name">
              <input type="checkbox" value="${a.id}" ${selected.has(a.id) ? 'checked' : ''} onchange="togglePresenzaGruppoLezione(this)">
              <span>${esc(allievoDisplayName(a.id))}</span>
            </label>
            ${renderGroupStudentFeedbackControls(a.id, selected.has(a.id))}
          </div>`).join('')}
      </div>
      ${guests.length ? `<div class="group-presence-guests">
        <div class="lesson-skill-hint">Guest</div>
        ${guests.map(a => `
          <div class="group-presence-row" data-allievo-id="${esc(a.id)}">
            <div class="group-presence-name"><span>${esc(allievoDisplayName(a.id))}</span></div>
            ${renderGroupStudentFeedbackControls(a.id, true)}
          </div>`).join('')}
      </div>` : ''}
    </div>`
  syncGroupStudentFeedbackVisibility()
}

function togglePresenzaGruppoLezione(cb) {
  const hidden = [...document.querySelectorAll('#lz-hidden-checks input')].find(input => input.value === cb.value)
  if (hidden) hidden.checked = cb.checked
  else if (cb.checked) document.getElementById('lz-hidden-checks').insertAdjacentHTML('beforeend', `<input type="checkbox" value="${cb.value}" checked>`)
  cb.closest('.group-presence-row')?.querySelector('.group-student-feedback')?.classList.toggle('is-unselected', !cb.checked)
  refreshGroupExclusionControls()
  renderGroupIndividualControls()
  renderSpecialGuestPanel()
  renderLessonStudentNotes()
  renderPrepBoard()
  refreshSuggerimentiLuogoSeAperti()
  suggerisciDurataDaUltimaLezione()
}

function setLezioneAllievi(ids) {
  const holder = document.getElementById('lz-hidden-checks')
  document.getElementById('lz-skills-container').innerHTML = ''
  holder.innerHTML = ids.map(id => `<input type="checkbox" value="${id}" checked>`).join('')
  if (currentLessonTargetIsGroup()) {
    renderLessonStudentNotes()
    refreshSuggerimentiLuogoSeAperti()
    suggerisciDurataDaUltimaLezione()
    return
  }
  ids.forEach(id => {
    const a = allieviSelezionabiliLezione().find(x => x.id === id)
    if (a) toggleAllievo({ checked: true, value: id }, [a.nome, a.cognome].filter(Boolean).join(' '))
  })
  refreshSuggerimentiLuogoSeAperti()
  renderLessonStudentNotes()
  renderPrepBoard()
  suggerisciDurataDaUltimaLezione()
}

function selectedLezioneAllieviIds() {
  return [...document.querySelectorAll('#lz-hidden-checks input[type=checkbox]:checked')].map(input => input.value)
}

function renderLessonStudentNotes() {
  const panel = document.getElementById('lz-student-notes')
  if (!panel) return
  if (editingLezioneId) {
    panel.hidden = true
    panel.innerHTML = ''
    return
  }
  const rows = selectedLezioneAllieviIds()
    .map(id => allievoById(id))
    .filter(Boolean)
    .map(allievo => ({ allievo, note: allievoLessonNote(allievo) }))
    .filter(row => row.note)
  if (!rows.length) {
    panel.hidden = true
    panel.innerHTML = ''
    return
  }
  panel.hidden = false
  panel.innerHTML = `
    <div class="lesson-student-notes-title">${rows.length === 1 ? 'Promemoria allievo' : 'Promemoria allievi'}</div>
    ${rows.map(row => `
      <div class="lesson-student-note-row"><strong>${esc(allievoDisplayName(row.allievo.id))}</strong> · ${esc(row.note)}</div>
    `).join('')}`
}

function luoghiCacheKey(ids) {
  return [...new Set(ids || [])].sort().join('|')
}

async function luoghiFrequentatiAllievi(ids) {
  const cleanIds = [...new Set((ids || []).filter(Boolean))]
  if (!cleanIds.length) return []
  const key = luoghiCacheKey(cleanIds)
  if (luoghiLezioneCache.has(key)) return luoghiLezioneCache.get(key)

  const { data } = await sb.from('lezioni_allievi')
    .select('lezioni(luogo, data)')
    .in('allievo_id', cleanIds)

  const stats = new Map()
  const addStat = (luogo, count = 1, latest = '') => {
    const clean = String(luogo || '').trim()
    if (!clean) return
    const k = normalizeText(clean)
    const prev = stats.get(k) || { luogo: clean, count: 0, latest: '' }
    prev.count += count
    if (String(latest || '') > prev.latest) prev.latest = String(latest || '')
    stats.set(k, prev)
  }
  ;(data || []).forEach(row => {
    const luogo = row.lezioni?.luogo?.trim()
    if (!luogo) return
    addStat(luogo, 1, row.lezioni?.data)
    lessonLocationEntries(luogo, cleanIds).forEach(entry => addStat(entry.nome, 2, row.lezioni?.data))
  })
  ;(await loadLocations()).forEach(loc => {
    const luogo = String(loc.nome || '').trim()
    addStat(luogo, loc.tipologia === 'Casa allievo' ? 2 : 1)
  })
  cleanIds.map(id => allievoById(id)).filter(Boolean).forEach(allievo => {
    const logistica = logisticaIndividualeProfilo(allievo.profilo || {}, !!allievo.gruppo)
    const luogo = String(logistica.luogo_incontro || (!allievo.gruppo ? allievo.profilo?.luogo_incontro : '') || '').trim()
    addStat(luogo, 4)
  })
  const gruppi = [...new Set(cleanIds.map(id => allievoById(id)?.gruppo).filter(Boolean))]
  gruppi.forEach(gruppo => {
    const luogo = String(profiloComuneGruppo(gruppoMembri(gruppo)).luogo_incontro || '').trim()
    addStat(luogo, 5)
  })
  const luoghi = [...stats.values()]
    .sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest) || a.luogo.localeCompare(b.luogo, 'it', { sensitivity: 'base' }))
    .map(item => item.luogo)
  luoghiLezioneCache.set(key, luoghi)
  return luoghi
}

async function suggerisciDurataDaUltimaLezione() {
  if (editingLezioneId) return
  const input = document.getElementById('lz-durata')
  if (!input || input.value) return
  const ids = selectedLezioneAllieviIds()
  if (!ids.length) return
  const { data } = await sb.from('lezioni_allievi')
    .select('lezioni(durata_min, data)')
    .in('allievo_id', ids)
  const latest = (data || [])
    .map(row => row.lezioni)
    .filter(l => l?.durata_min)
    .sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')))[0]
  if (latest?.durata_min && !input.value) input.value = latest.durata_min
}

async function mostraSuggerimentiLuogo() {
  clearTimeout(luogoSuggestTimer)
  const panel = document.getElementById('lz-luogo-suggest')
  const input = document.getElementById('lz-luogo')
  if (!panel || !input) return
  const ids = selectedLezioneAllieviIds()
  if (!ids.length) {
    panel.hidden = true
    panel.innerHTML = ''
    return
  }

  const query = normalizeText(input.value)
  const luoghi = (await luoghiFrequentatiAllievi(ids))
    .filter(luogo => !query || normalizeText(luogo).includes(query))
    .slice(0, 8)

  const manualValue = input.value.trim()
  const missingEntries = manualValue ? missingLessonLocationEntries(manualValue, ids) : []
  const canCreate = missingEntries.length > 0
  const createLabel = missingEntries.length > 1 ? 'Crea location mancanti' : 'Crea nuova location'
  const createDetail = missingEntries.map(entry => entry.nome).join(' · ')

  if (!luoghi.length) {
    panel.innerHTML = `<div class="place-suggest-empty">Nessun luogo già registrato per i presenti.</div>${canCreate ? `<button type="button" class="place-suggest-btn" onmousedown="creaLocationDaLuogoLezione()"><strong>${esc(createLabel)}</strong><span>${esc(createDetail)}</span></button>` : ''}`
    panel.hidden = false
    return
  }

  panel.innerHTML = luoghi.map(luogo => `
    <button type="button" class="place-suggest-btn" onmousedown="scegliLuogoSuggerito(${jsArg(luogo)})">${esc(luogo)}</button>
  `).join('') + (canCreate ? `<button type="button" class="place-suggest-btn" onmousedown="creaLocationDaLuogoLezione()"><strong>${esc(createLabel)}</strong><span>${esc(createDetail)}</span></button>` : '')
  panel.hidden = false
}

function scegliLuogoSuggerito(luogo) {
  document.getElementById('lz-luogo').value = luogo
  renderLezioneLocationSelect('', luogo)
  const panel = document.getElementById('lz-luogo-suggest')
  if (panel) panel.hidden = true
}

async function creaLocationDaLuogoLezione() {
  const input = document.getElementById('lz-luogo')
  const nome = input?.value.trim()
  if (!nome) return
  const ids = selectedLezioneAllieviIds()
  await ensureLocationDaLezione(nome, ids)
  await renderLezioneLocationSelect('', nome)
  const entries = lessonLocationEntries(nome, ids)
  const record = entries.length === 1 ? locationRecordByName(entries[0].nome) : null
  const select = document.getElementById('lz-location-id')
  if (select && record?.id) select.value = record.id
  const panel = document.getElementById('lz-luogo-suggest')
  if (panel) panel.hidden = true
}

function nascondiSuggerimentiLuogoSoon() {
  clearTimeout(luogoSuggestTimer)
  luogoSuggestTimer = setTimeout(() => {
    const panel = document.getElementById('lz-luogo-suggest')
    if (panel) panel.hidden = true
  }, 160)
}

function refreshSuggerimentiLuogoSeAperti() {
  const panel = document.getElementById('lz-luogo-suggest')
  if (panel && !panel.hidden) mostraSuggerimentiLuogo()
}

function skillWorkKey(row) {
  return JSON.stringify({
    skillId: row.skillId || '',
    stadio: Number(row.stadio || 1),
    fakie: !!row.fakie,
    dimensioni: lessonSkillOnlyDimensions(row.dimensioni || {}),
  })
}

function collapseCommonGroupSkillRows(ids) {
  const presentIds = (ids || []).filter(id => editingLezioneSkillRows[id]?.length)
  if (presentIds.length < 2) return
  const counts = new Map()
  const rowByKey = new Map()
  presentIds.forEach(id => {
    const seen = new Set()
    ;(editingLezioneSkillRows[id] || []).forEach(row => {
      const key = skillWorkKey(row)
      if (seen.has(key)) return
      seen.add(key)
      counts.set(key, (counts.get(key) || 0) + 1)
      rowByKey.set(key, row)
    })
  })
  const commonKeys = [...counts.entries()].filter(([, count]) => count === presentIds.length).map(([key]) => key)
  if (!commonKeys.length) return
  const common = new Set(commonKeys)
  editingLezioneSkillRows[GROUP_SKILL_ROWS_KEY] = commonKeys.map(key => {
    const row = rowByKey.get(key)
    return { ...row, dimensioni: lessonSkillOnlyDimensions(row.dimensioni || {}), excludeIds: [] }
  })
  presentIds.forEach(id => {
    editingLezioneSkillRows[id] = (editingLezioneSkillRows[id] || []).filter(row => !common.has(skillWorkKey(row)))
  })
}

function renderGroupSkillWorkspace() {
  const container = document.getElementById('lz-skills-container')
  const savedGroupRows = editingLezioneSkillRows[GROUP_SKILL_ROWS_KEY] || []
  const groupActions = renderLessonWorkButtons(GROUP_SKILL_ROWS_KEY)
  container.innerHTML = `
    <div class="allievo-block">
      <h4>Lavoro di gruppo</h4>
      <div class="lesson-skill-tools">
        <div class="lesson-skill-hint">Inserisci una volta sola le skill o gli esercizi comuni. Per ogni riga puoi escludere chi non li ha fatti.</div>
        ${groupActions}
      </div>
      <div class="ripasso-panel" id="${ripassoPanelId(GROUP_SKILL_ROWS_KEY)}" hidden></div>
      <div id="skill-rows-${GROUP_SKILL_ROWS_KEY}"></div>
    </div>
    <div class="allievo-block">
      <h4>Lavori individuali</h4>
      <div class="lesson-skill-hint">Aggiungi qui esercizi o skill fatti solo da un allievo, incluso un guest.</div>
      <div id="lz-individual-tools"></div>
      <div id="lz-individual-skill-blocks"></div>
    </div>`

  if (savedGroupRows.length) savedGroupRows.forEach(row => aggiungiSkillRow(GROUP_SKILL_ROWS_KEY, row.skillId, row.stadio, row.dimensioni || {}, !!row.fakie, row.excludeIds || [], { collapseExisting: false }))

  Object.entries(editingLezioneSkillRows)
    .filter(([id, rows]) => id !== GROUP_SKILL_ROWS_KEY && rows?.length && selectedLezioneAllieviIds().includes(id))
    .forEach(([id, rows]) => addIndividualSkillWork(id, rows))
  renderGroupIndividualControls()
}

function renderFreeLessonSkillWorkspace() {
  const container = document.getElementById('lz-skills-container')
  const savedRows = editingLezioneSkillRows[FREE_LESSON_SKILL_ROWS_KEY] || []
  container.innerHTML = `
    <div class="allievo-block">
      <h4>Skill da preparare</h4>
      <div class="lesson-skill-tools">
      <div class="lesson-skill-hint">Prepara skill o esercizi per una lezione futura. Restano pianificati, senza allievo e senza aggiornare i progressi.</div>
        ${renderLessonWorkButtons(FREE_LESSON_SKILL_ROWS_KEY)}
      </div>
      <div id="skill-rows-${FREE_LESSON_SKILL_ROWS_KEY}"></div>
    </div>`
  if (savedRows.length) savedRows.forEach(row => aggiungiSkillRow(FREE_LESSON_SKILL_ROWS_KEY, row.skillId, row.stadio, row.dimensioni || {}, !!row.fakie, [], { collapseExisting: false }))
  else if (lezioneFormMode === 'prep') aggiungiSkillRow(FREE_LESSON_SKILL_ROWS_KEY, '', 1, {}, false, [], { collapseExisting: false })
}

function renderGroupIndividualControls() {
  const tools = document.getElementById('lz-individual-tools')
  if (!tools) return
  const existing = new Set([...document.querySelectorAll('#lz-individual-skill-blocks [data-individual-id]')].map(el => el.dataset.individualId))
  const options = selectedLezioneAllieviIds()
    .filter(id => !existing.has(id))
    .map(id => `<option value="${id}">${esc(allievoDisplayName(id))}</option>`)
    .join('')
  tools.innerHTML = `
    <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.5rem;align-items:end;margin-bottom:.65rem">
      <div class="field" style="margin:0">
        <label>Allievo</label>
        <select id="lz-individual-skill-select">
          <option value="">— Aggiungi lavoro individuale —</option>
          ${options}
        </select>
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="addIndividualSkillWorkFromSelect()">+ Aggiungi</button>
    </div>`
}

function addIndividualSkillWorkFromSelect() {
  const select = document.getElementById('lz-individual-skill-select')
  const id = select?.value
  if (!id) return
  addIndividualSkillWork(id)
  renderGroupIndividualControls()
}

function addIndividualSkillWork(id, rows = null) {
  const container = document.getElementById('lz-individual-skill-blocks')
  if (!container || document.getElementById(`individual-block-${id}`)) return
  const div = document.createElement('div')
  div.className = 'allievo-block'
  div.id = `individual-block-${id}`
  div.dataset.individualId = id
  div.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:.75rem">
      <h4>${esc(allievoDisplayName(id))}</h4>
      <button type="button" class="btn btn-ghost btn-sm" onclick="this.closest('[data-individual-id]').remove(); renderGroupIndividualControls()">✕</button>
    </div>
    <div style="margin:.25rem 0 .55rem">${renderLessonWorkButtons(id)}</div>
    <div class="ripasso-panel" id="${ripassoPanelId(id)}" hidden></div>
    <div id="skill-rows-${id}"></div>`
  container.appendChild(div)
  const savedRows = rows || editingLezioneSkillRows[id] || []
  if (savedRows.length) savedRows.forEach(row => aggiungiSkillRow(id, row.skillId, row.stadio, row.dimensioni || {}, !!row.fakie, [], { collapseExisting: false }))
}

function renderSpecialGuestPanel() {
  const panel = document.getElementById('lz-special-guest-panel')
  const selectedIds = new Set(selectedLezioneAllieviIds())
  const options = ordinaAllieviLista(allieviSelezionabiliLezione().filter(a => !selectedIds.has(a.id)))
  panel.hidden = false
  panel.innerHTML = `
    <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.5rem;align-items:end">
      <div class="field" style="margin:0">
        <label>Special guest</label>
        <select id="lz-special-guest-select" onchange="addSpecialGuestToLesson(this.value); this.value=''">
          <option value="">— Aggiungi allievo ospite —</option>
          ${options.map(a => `<option value="${a.id}">${esc(lezioneTargetLabelAllievo(a))}</option>`).join('')}
        </select>
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="creaSpecialGuestDaLezione()">+ Crea nuovo allievo</button>
    </div>`
}

function addSpecialGuestToLesson(id) {
  if (!id || selectedLezioneAllieviIds().includes(id)) return
  const holder = document.getElementById('lz-hidden-checks')
  holder.insertAdjacentHTML('beforeend', `<input type="checkbox" value="${id}" checked>`)
  const a = allieviSelezionabiliLezione().find(x => x.id === id) || allAllievi.find(x => x.id === id)
  if (currentLessonTargetIsGroup()) {
    const gruppo = document.getElementById('lz-tipo').value.slice('gruppo:'.length)
    renderGroupLessonPanel(gruppo)
    refreshGroupExclusionControls()
    renderGroupIndividualControls()
  } else if (a) {
    toggleAllievo({ checked: true, value: id }, [a.nome, a.cognome].filter(Boolean).join(' '))
  }
  renderSpecialGuestPanel()
  renderLessonStudentNotes()
  renderPrepBoard()
  refreshSuggerimentiLuogoSeAperti()
}

function creaSpecialGuestDaLezione() {
  saveLezioneDraft({ keep: true })
  pendingSpecialGuestId = null
  showView('nuovo-allievo')
}

function collectLezioneDraft() {
  const skillRows = {}
  const groupFeedback = currentLessonTargetIsGroup() ? collectGroupStudentFeedback() : {}
  const rowOwners = currentLessonTargetIsGroup()
    ? [GROUP_SKILL_ROWS_KEY, ...selectedLezioneAllieviIds()]
    : currentLessonTargetIsFree()
      ? [FREE_LESSON_SKILL_ROWS_KEY]
    : selectedLezioneAllieviIds()
  rowOwners.forEach(id => {
    skillRows[id] = [...document.querySelectorAll(`#skill-rows-${id} .skill-row`)]
      .map(row => ({
        skillId: row.querySelector('.skill-select')?.value || '',
        stadio: parseInt(row.querySelector('.stadio-toggle')?.dataset.stadio || '1', 10),
        fakie: skillRowFakie(row),
        dimensioni: skillRowDimensions(row),
        excludeIds: skillRowExcludedIds(row),
      }))
      .filter(row => row.skillId)
  })
  return {
    editingLezioneId: editingLezioneId || null,
    savedAt: new Date().toISOString(),
    data: document.getElementById('lz-data')?.value || '',
    ora: document.getElementById('lz-ora')?.value || '',
    durata: document.getElementById('lz-durata')?.value || '',
    stato: document.getElementById('lz-stato')?.value || 'aperta',
    locationId: document.getElementById('lz-location-id')?.value || '',
    luogo: document.getElementById('lz-luogo')?.value || '',
    meteo: document.getElementById('lz-meteo')?.value || '',
    noteSpeciali: document.getElementById('lz-note-speciali')?.value || '',
    checkBene: document.getElementById('lz-check-bene')?.value || '',
    checkNonFatto: document.getElementById('lz-check-non-fatto')?.value || '',
    note: document.getElementById('lz-note')?.value || '',
    target: document.getElementById('lz-tipo')?.value || '',
    selectedIds: selectedLezioneAllieviIds(),
    skillRows,
    groupFeedback,
    lezioneBackAllievoId,
    lezioneBackGruppoNome,
    formMode: lezioneFormMode,
  }
}

function saveLezioneDraft({ keep = false } = {}) {
  if (!keep) {
    safeStorage.removeItem(LEZIONE_DRAFT_KEY)
    return null
  }
  const draft = collectLezioneDraft()
  safeStorage.setItem(LEZIONE_DRAFT_KEY, JSON.stringify(draft))
  return draft
}

function loadLezioneDraft() {
  try {
    return JSON.parse(safeStorage.getItem(LEZIONE_DRAFT_KEY) || 'null')
  } catch {
    return null
  }
}

function restoreLezioneDraft(draft) {
  if (draft.formMode) lezioneFormMode = draft.formMode === 'prep' ? 'prep' : 'standard'
  document.getElementById('lz-data').value = draft.data || localDateIso()
  document.getElementById('lz-ora').value = normalizeLessonTime(draft.ora || '')
  document.getElementById('lz-durata').value = draft.durata || ''
  setLessonStatus(draft.stato || 'aperta')
  document.getElementById('lz-luogo').value = draft.luogo || ''
  renderLezioneLocationSelect(draft.locationId || '', draft.luogo || '')
  document.getElementById('lz-meteo').value = draft.meteo || ''
  document.getElementById('lz-note-speciali').value = draft.noteSpeciali || ''
  document.getElementById('lz-check-bene').value = draft.checkBene || ''
  document.getElementById('lz-check-non-fatto').value = draft.checkNonFatto || ''
  document.getElementById('lz-note').value = draft.note || ''
  renderLezioneTargetOptions(draft.target || '')
  editingLezioneSkillRows = draft.skillRows || {}
  editingLezioneGroupFeedback = draft.groupFeedback || {}
  if (draft.editingLezioneId) editingLezioneId = draft.editingLezioneId
  lezioneBackAllievoId = draft.lezioneBackAllievoId || lezioneBackAllievoId
  lezioneBackGruppoNome = draft.lezioneBackGruppoNome || lezioneBackGruppoNome
  return draft.selectedIds || []
}

function toggleAllievo(cb, nomeCompleto) {
  const container = document.getElementById('lz-skills-container')
  if (cb.checked) {
    const allievo = allieviSelezionabiliLezione().find(x => x.id === cb.value) || allAllievi.find(x => x.id === cb.value)
    const div = document.createElement('div')
    div.className = 'allievo-block'
    div.id = `block-${cb.value}`
    div.innerHTML = `
      <h4>${esc(nomeCompleto)}</h4>
      <div class="lesson-skill-tools">
        <div class="lesson-skill-hint">${lessonSkillHint(allievo)}</div>
        ${renderLessonWorkButtons(cb.value)}
      </div>
      <div class="ripasso-panel" id="${ripassoPanelId(cb.value)}" hidden></div>
      <div id="skill-rows-${cb.value}"></div>`
    container.appendChild(div)
    const savedRows = editingLezioneSkillRows[cb.value] || []
    if (savedRows.length) savedRows.forEach(row => aggiungiSkillRow(cb.value, row.skillId, row.stadio, row.dimensioni || {}, !!row.fakie, [], { collapseExisting: false }))
    else if (lezioneFormMode === 'prep') aggiungiSkillRow(cb.value, '', 1, {}, false, [], { collapseExisting: false })
  } else {
    document.getElementById(`block-${cb.value}`)?.remove()
  }
  renderLessonStudentNotes()
}

async function renderPrepBoard() {
  const board = document.getElementById('lz-prep-board')
  if (!board) return
  board.hidden = true
  board.innerHTML = ''
}

function sortedSkillsForLesson() {
  return [...(allSkills || [])].sort((a, b) => {
    return String(a.ramo || '').localeCompare(String(b.ramo || ''), 'it', { sensitivity: 'base' })
      || String(a.nome || '').localeCompare(String(b.nome || ''), 'it', { sensitivity: 'base' })
  })
}

function skillMetaLabel(skill) {
  return [skillBranchName(skill.ramo), skill.blocco, skill.livello ? `Lv.${skill.livello}` : ''].filter(Boolean).join(' · ')
}

function lessonSkillHint(allievo) {
  return allievo ? 'Aggiungi solo il lavoro effettivamente fatto in questa lezione.' : 'Aggiungi le skill da preparare per una lezione futura.'
}

function renderLessonWorkButtons(allieviId) {
  const ownerArg = jsArg(allieviId)
  const allowRipasso = allieviId !== FREE_LESSON_SKILL_ROWS_KEY
  return `
    <div style="display:flex;gap:.4rem;flex-wrap:wrap">
      <button type="button" class="btn btn-outline btn-sm" data-lesson-action="new-skill" data-owner-id="${esc(allieviId)}">+ Nuova skill</button>
      ${allowRipasso ? `<button type="button" class="btn btn-outline btn-sm" onclick="toggleRipassoPanel(${ownerArg})">Ripasso</button>` : ''}
      <button type="button" class="btn btn-outline btn-sm" onclick="lezioneFeatureSoon('Nuovo esercizio')">+ Nuovo esercizio</button>
      <button type="button" class="btn btn-outline btn-sm" onclick="lezioneFeatureSoon('Nuovo percorso')">+ Nuovo percorso</button>
    </div>`
}

function focusLessonSkillRow(row) {
  if (!row) return
  row.classList.remove('is-collapsed')
  row.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => row.querySelector('.skill-select')?.focus(), 120)
}

function addNewLessonSkillRow(ownerId) {
  const panel = document.getElementById(ripassoPanelId(ownerId))
  if (panel) panel.hidden = true
  const row = aggiungiSkillRow(ownerId, '', 1, {}, false, [], { collapseExisting: true, scrollIntoView: true })
  if (!row) {
    const err = document.getElementById('lz-err')
    if (err) {
      err.textContent = 'Non trovo il blocco dove aggiungere la skill. Ricarica la pagina e riprova.'
      err.classList.add('show')
    }
  }
}

function lezioneFeatureSoon(label) {
  const err = document.getElementById('lz-err')
  if (!err) return
  err.textContent = `${label}: lo definiamo nel prossimo passaggio.`
  err.classList.add('show')
  err.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function progressMapForAllievo(allievoId) {
  const map = new Map()
  ;(allProgressi || []).forEach(row => {
    if (row.allievo_id === allievoId) map.set(row.skill_id, Number(row.stadio || 0))
  })
  return map
}

function ripassoSkillIdsForOwner(ownerId) {
  const ownerIds = ownerId === GROUP_SKILL_ROWS_KEY ? selectedLezioneAllieviIds() : [ownerId]
  const skillIds = new Set()
  ownerIds.filter(Boolean).forEach(allievoId => {
    progressMapForAllievo(allievoId).forEach((stadio, skillId) => {
      if (Number(stadio || 0) > 0) skillIds.add(String(skillId))
    })
  })
  return skillIds
}

function ripassoPanelId(ownerId) {
  return `ripasso-panel-${String(ownerId).replace(/[^a-zA-Z0-9_-]/g, '_')}`
}

function workedSkillGroupsForOwner(ownerId) {
  const ownerIds = ownerId === GROUP_SKILL_ROWS_KEY ? selectedLezioneAllieviIds() : [ownerId]
  const bySkill = new Map()
  ownerIds.filter(Boolean).forEach(allievoId => {
    progressMapForAllievo(allievoId).forEach((stadio, skillId) => {
      if (!Number(stadio || 0)) return
      const key = String(skillId)
      const prev = bySkill.get(key) || { skillId: key, stadio: 0 }
      prev.stadio = Math.max(prev.stadio, Number(stadio || 0))
      bySkill.set(key, prev)
    })
  })
  const list = [...bySkill.values()]
    .map(item => ({ ...item, skill: allSkills.find(skill => String(skill.id) === item.skillId) }))
    .filter(item => item.skill)
    .sort(compareRipassoItems)
  return {
    work: list.filter(item => item.stadio < 3),
    done: list.filter(item => item.stadio >= 3),
  }
}

function compareRipassoItems(a, b) {
  const branches = lessonSkillBranches()
  const branchA = a.skill?.ramo || 'Altro'
  const branchB = b.skill?.ramo || 'Altro'
  return (branches.indexOf(branchA) === -1 ? 999 : branches.indexOf(branchA)) - (branches.indexOf(branchB) === -1 ? 999 : branches.indexOf(branchB))
    || Number(a.skill?.livello || 0) - Number(b.skill?.livello || 0)
    || a.stadio - b.stadio
    || String(a.skill?.nome || '').localeCompare(String(b.skill?.nome || ''), 'it', { sensitivity: 'base' })
}

function ripassoRowsByBranch(rows = []) {
  const grouped = new Map()
  rows.forEach(item => {
    const branch = item.skill?.ramo || 'Altro'
    if (!grouped.has(branch)) grouped.set(branch, [])
    grouped.get(branch).push(item)
  })
  const branches = lessonSkillBranches()
  return [...grouped.entries()]
    .sort(([a], [b]) => (branches.indexOf(a) === -1 ? 999 : branches.indexOf(a)) - (branches.indexOf(b) === -1 ? 999 : branches.indexOf(b)) || a.localeCompare(b, 'it', { sensitivity: 'base' }))
}

function renderRipassoSkillButton(ownerId, item) {
  const meta = [item.skill?.blocco, item.skill?.livello ? `Lv.${item.skill.livello}` : ''].filter(Boolean).join(' · ')
  const stadio = Number(item.stadio) || 1
  return `<button type="button" class="skill-suggest ripasso-skill" onclick="aggiungiRipassoSkill(${jsArg(ownerId)},${jsArg(item.skillId)})" title="${esc(skillMetaLabel(item.skill))}">
    <span class="ripasso-skill-name">${esc(item.skill.nome)}</span>
    ${meta ? `<span class="ripasso-skill-meta">${esc(meta)}</span>` : ''}
    <span class="ripasso-skill-stage st${stadio}">${esc(lessonStadioLabel(stadio))}</span>
  </button>`
}

function renderRipassoGroup(ownerId, title, rows) {
  return `<div class="ripasso-group">
    <div class="ripasso-title">${esc(title)}</div>
    ${rows.length ? ripassoRowsByBranch(rows).map(([branch, items]) => `
      <section class="ripasso-branch">
        <div class="ripasso-branch-title">
          <span>${esc(branch)}</span>
          <span>${items.length} skill</span>
        </div>
        <div class="lesson-skill-suggestions ripasso-skill-grid">
          ${items.map(item => renderRipassoSkillButton(ownerId, item)).join('')}
        </div>
      </section>`).join('') : '<span class="ripasso-empty">Nessuna skill in questo gruppo.</span>'}
  </div>`
}

function toggleRipassoPanel(ownerId) {
  const panel = document.getElementById(ripassoPanelId(ownerId))
  if (!panel) {
    aggiungiRipassoRow(ownerId)
    return
  }
  if (!panel.hidden) {
    panel.hidden = true
    return
  }
  const groups = workedSkillGroupsForOwner(ownerId)
  if (!groups.work.length && !groups.done.length) {
    panel.innerHTML = '<div class="ripasso-empty">Nessuna skill gia lavorata per questa selezione.</div>'
  } else {
    panel.innerHTML = [
      renderRipassoGroup(ownerId, 'Richiedono lavoro', groups.work),
      renderRipassoGroup(ownerId, 'Gia completate', groups.done),
    ].join('')
  }
  panel.hidden = false
}

function aggiungiRipassoSkill(ownerId, skillId, options = {}) {
  const skill = allSkills.find(s => String(s.id) === String(skillId))
  if (!skill) return
  const previous = workedSkillGroupsForOwner(ownerId)
  const item = [...previous.work, ...previous.done].find(row => row.skillId === String(skillId))
  aggiungiSkillRow(ownerId, skill.id, options.stadio || item?.stadio || 1, options.dimensioni || {}, !!options.fakie, [], { ripassoOnly: true, collapseExisting: options.collapseExisting })
}

function aggiungiRipassoRow(ownerId) {
  const workedSkillIds = ripassoSkillIdsForOwner(ownerId)
  const err = document.getElementById('lz-err')
  if (!workedSkillIds.size) {
    if (err) {
      err.textContent = 'Ripasso: nessuna skill gia lavorata per questa selezione.'
      err.classList.add('show')
      err.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }
  if (err) err.classList.remove('show')
  aggiungiSkillRow(ownerId, '', 1, {}, false, [], { ripassoOnly: true })
}

function fakieProgressMapForAllievo(allievoOrId) {
  const allievo = typeof allievoOrId === 'string'
    ? allAllievi.find(a => a.id === allievoOrId)
    : allievoOrId
  const raw = allievo?.profilo?.fakie_progress || {}
  return raw && typeof raw === 'object' ? raw : {}
}

async function salvaFakieProgressiAllievo(allievoId, updates) {
  const allievo = allAllievi.find(a => a.id === allievoId)
  if (!allievo) return
  const oggi = localDateIso()
  const profilo = { ...(allievo.profilo || {}) }
  const current = { ...(profilo.fakie_progress || {}) }
  Object.entries(updates || {}).forEach(([skillId, stadio]) => {
    const value = Number(stadio || 0)
    if (!value) {
      delete current[skillId]
      return
    }
    const prev = current[skillId] || {}
    current[skillId] = {
      ...prev,
      stadio: value,
      data_inizio: prev.data_inizio || oggi,
      data_acquisizione: value >= 2 ? (prev.data_acquisizione || oggi) : null,
      data_perfezionamento: value >= 3 ? (prev.data_perfezionamento || oggi) : null,
    }
  })
  profilo.fakie_progress = current
  const { error } = await sb.from('allievi').update({ profilo }).eq('id', allievoId)
  if (error) throw error
  allievo.profilo = profilo
}

async function aggiornaProgressiDaLezione(allievoId, skillId, stadio, { fakie = false } = {}) {
  const value = Number(stadio || 0)
  if (!allievoId || !skillId || !value) return
  if (fakie) {
    const current = Number(fakieProgressMapForAllievo(allievoId)[skillId]?.stadio || 0)
    if (value > current) await salvaFakieProgressiAllievo(allievoId, { [skillId]: value })
    return
  }

  const current = Number(progressMapForAllievo(allievoId).get(skillId) || 0)
  if (value <= current) return
  const oggi = localDateIso()
  const { error: deleteError } = await sb.from('progressi_allievo')
    .delete()
    .eq('allievo_id', allievoId)
    .eq('skill_id', skillId)
  if (deleteError) throw deleteError
  const { error } = await sb.from('progressi_allievo').insert({
    allievo_id: allievoId,
    skill_id: skillId,
    stadio: value,
    data_inizio: oggi,
    data_acquisizione: value >= 2 ? oggi : null,
    data_perfezionamento: value >= 3 ? oggi : null,
  })
  if (error) throw error
  allProgressi = allProgressi
    .filter(row => !(row.allievo_id === allievoId && row.skill_id === skillId))
    .concat({ allievo_id: allievoId, skill_id: skillId, stadio: value })
}

function skillProfileScore(skill, allievo, progressMap) {
  const livello = Number(allievo?.livello_attuale || 0)
  const blocco = String(allievo?.blocco_attuale || '')
  const knownLevels = sortedSkillsForLesson()
    .filter(s => (progressMap.get(s.id) || 0) > 0)
    .map(s => Number(s.livello || 0))
  const maxKnownLevel = knownLevels.length ? Math.max(...knownLevels) : livello
  const referenceLevel = maxKnownLevel || livello || Number(skill.livello || 0)
  const diff = referenceLevel ? Math.abs(Number(skill.livello || 0) - referenceLevel) : 2
  let score = Math.max(0, 10 - diff * 2)
  if (blocco && skill.blocco === blocco) score += 3
  if (skill.obbligatoria) score += 2
  if (skill.ramo && hasKnownSkillInRamo(skill.ramo, progressMap)) score += 1
  return score
}

function hasKnownSkillInRamo(ramo, progressMap) {
  return sortedSkillsForLesson().some(skill => (skill.ramo || 'Altro') === (ramo || 'Altro') && (progressMap.get(skill.id) || 0) > 0)
}

function rankSuggestedSkills(skills, allievo, progressMap) {
  return [...skills]
    .map(skill => ({ skill, score: skillProfileScore(skill, allievo, progressMap) }))
    .sort((a, b) => {
      return b.score - a.score
        || Number(a.skill.livello || 0) - Number(b.skill.livello || 0)
        || String(a.skill.ramo || '').localeCompare(String(b.skill.ramo || ''), 'it', { sensitivity: 'base' })
        || String(a.skill.nome || '').localeCompare(String(b.skill.nome || ''), 'it', { sensitivity: 'base' })
    })
    .map(item => item.skill)
}

function skillSuggestionGroupsForAllievo(allievo, limitPerGroup = 7) {
  const progressMap = progressMapForAllievo(allievo?.id)
  const ordered = sortedSkillsForLesson()
  if (!ordered.length) return []
  const sharedInLavorazione = sharedInLavorazioneSkills()
  const knownLevels = ordered
    .filter(skill => (progressMap.get(skill.id) || 0) > 0)
    .map(skill => Number(skill.livello || 0))
  const maxKnownLevel = knownLevels.length ? Math.max(...knownLevels) : Number(allievo?.livello_attuale || 0)
  const maiFatte = ordered.filter(skill => !progressMap.get(skill.id))
  const recuperare = maxKnownLevel
    ? rankSuggestedSkills(maiFatte.filter(skill => Number(skill.livello || 0) < maxKnownLevel), allievo, progressMap).slice(0, limitPerGroup)
    : []
  const daSistemare = rankSuggestedSkills(
    ordered.filter(skill => {
      const stadio = progressMap.get(skill.id) || 0
      return stadio === 1 || stadio === 2
    }),
    allievo,
    progressMap
  ).slice(0, limitPerGroup)
  const usedIds = new Set([...recuperare, ...daSistemare].map(skill => skill.id))
  const startMaxLevel = maxKnownLevel ? maxKnownLevel + 1 : Number(allievo?.livello_attuale || 0) + 1
  const daIniziare = rankSuggestedSkills(
    maiFatte.filter(skill => !usedIds.has(skill.id) && (!startMaxLevel || Number(skill.livello || 0) <= startMaxLevel)),
    allievo,
    progressMap
  ).slice(0, limitPerGroup)

  return [
    { title: 'In lavorazione per tutti', skills: sharedInLavorazione, shared: true },
    { title: 'Mai fatte da recuperare', skills: recuperare },
    { title: 'Da sistemare', skills: daSistemare },
    { title: 'Mai viste da iniziare', skills: daIniziare },
  ].filter(group => group.skills.length)
}

function sharedInLavorazioneSkills(limit = 10) {
  const selectedIds = selectedLezioneAllieviIds()
  if (selectedIds.length < 2) return []
  return sortedSkillsForLesson()
    .filter(skill => selectedIds.every(id => (progressMapForAllievo(id).get(skill.id) || 0) === 1))
    .slice(0, limit)
}

function isSkillInLavorazionePerTutti(skillId) {
  const selectedIds = selectedLezioneAllieviIds()
  if (selectedIds.length < 2) return false
  return selectedIds.every(id => (progressMapForAllievo(id).get(skillId) || 0) === 1)
}

function renderLessonSkillSuggestionGroups(allieviId, groups) {
  if (!groups?.length) return ''
  return groups.map(group => `
    <div class="lesson-suggestion-group">
      <div class="lesson-suggestion-title${group.shared ? ' shared-work' : ''}">${esc(group.title)}</div>
      <div class="lesson-skill-suggestions">
        ${group.skills.map(skill => {
          const sharedClass = (group.shared || isSkillInLavorazionePerTutti(skill.id)) ? ' skill-suggest-shared-work' : ''
          const title = `${skillMetaLabel(skill)}${sharedClass ? ' · In lavorazione per tutti i presenti' : ''}`
          return `<button type="button" class="skill-suggest${sharedClass}" onclick="aggiungiSkillRow('${allieviId}','${skill.id}',1)" title="${esc(title)}">${esc(skill.nome)}</button>`
        }).join('')}
      </div>
    </div>`).join('')
}

function lessonSkillBranches() {
  const preferred = ['Equilibrio', 'Andatura', 'Frenata', 'Rotazione', 'Air', 'Extra']
  const found = [...new Set((allSkills || []).map(skill => skillBranchName(skill.ramo)))]
  return [...preferred.filter(branch => found.includes(branch)), ...found.filter(branch => !preferred.includes(branch)).sort((a, b) => a.localeCompare(b))]
}

function renderLessonBranchOptions(selectedBranch = '') {
  const branches = lessonSkillBranches()
  return `<option value="">Tutti i rami</option>${branches.map(branch => `<option value="${esc(branch)}" ${branch === selectedBranch ? 'selected' : ''}>${esc(branch)}</option>`).join('')}`
}

function renderLessonSkillOptions(selectedSkillId = '', filter = '', branch = '', options = {}) {
  const q = normalizeText(filter)
  const selectedBranch = branch || ''
  const allowedSkillIds = options.allowedSkillIds || null
  const list = sortedSkillsForLesson().filter(skill => {
    if (allowedSkillIds && !allowedSkillIds.has(String(skill.id)) && String(skill.id) !== String(selectedSkillId)) return false
    if (selectedBranch && skillBranchName(skill.ramo) !== selectedBranch) return false
    if (!q) return true
    return normalizeText(skill.nome).includes(q)
  })
  if (!allSkills.length) return '<option value="">Catalogo vuoto</option>'
  if (!list.length) return '<option value="">Nessuna skill trovata</option>'
  return list.map(s => `<option value="${s.id}" data-name="${esc(s.nome || '')}" title="${esc(s.nome || '')}" ${String(s.id) === String(selectedSkillId) ? 'selected' : ''}>${esc(s.nome || '')}</option>`).join('')
}

function compactSelectedSkillOption(select) {
  if (!select?.value) return
  const selected = select.options[select.selectedIndex]
  if (selected?.dataset.name) selected.textContent = selected.dataset.name
}

function filterSkillRow(input) {
  const row = input.closest('.skill-row')
  const select = row?.querySelector('.skill-select')
  if (!select) return
  const selected = select.value
  const branch = row.querySelector('.skill-branch')?.value || ''
  const allowedSkillIds = row.dataset.ripassoOnly === '1' ? ripassoSkillIdsForOwner(row.dataset.allieviId) : null
  select.innerHTML = `<option value="">— Skill —</option>${renderLessonSkillOptions(selected, '', branch, { allowedSkillIds })}`
  if ([...select.options].some(option => option.value === selected)) select.value = selected
  compactSelectedSkillOption(select)
}

function lessonStadioLabel(stadio) {
  return {
    1: 'In lavorazione',
    2: 'Raffinamento',
    3: 'Completato',
  }[stadio] || 'In lavorazione'
}

const LESSON_STADIO_COLORS = {
  1: { border: 'rgba(251,191,36,.5)', color: '#facc15', background: 'rgba(251,191,36,.08)' },
  2: { border: 'rgba(52,211,153,.65)', color: 'var(--success)', background: 'rgba(52,211,153,.12)' },
  3: { border: 'rgba(56,189,248,.55)', color: '#67e8f9', background: 'rgba(56,189,248,.1)' },
}

function lessonStadioInlineStyle(stadio) {
  const colors = LESSON_STADIO_COLORS[Number(stadio) || 1] || LESSON_STADIO_COLORS[1]
  return `border-color:${colors.border} !important;color:${colors.color} !important;background-color:${colors.background} !important`
}

function applyLessonStadioVisual(btn, stadio) {
  const colors = LESSON_STADIO_COLORS[Number(stadio) || 1] || LESSON_STADIO_COLORS[1]
  btn.style.setProperty('border-color', colors.border, 'important')
  btn.style.setProperty('color', colors.color, 'important')
  btn.style.setProperty('background-color', colors.background, 'important')
}

function renderLessonStadioToggle(stadio = 1) {
  const value = Number(stadio) || 1
  return `<button type="button" class="btn btn-outline btn-sm stadio-toggle st st${value}" data-stadio="${value}" style="${lessonStadioInlineStyle(value)}" onclick="toggleLessonStadio(this)">${lessonStadioLabel(value)}</button>`
}

function toggleLessonStadio(btn) {
  const next = ((parseInt(btn.dataset.stadio || '1', 10) || 1) % 3) + 1
  btn.dataset.stadio = String(next)
  btn.textContent = lessonStadioLabel(next)
  btn.classList.remove('st1', 'st2', 'st3')
  btn.classList.add(`st${next}`)
  applyLessonStadioVisual(btn, next)
}

const LESSON_RESULT_OPTIONS = [
  { value: 'da_rivedere', label: 'Da rivedere', className: 'result-review' },
  { value: 'bene', label: 'Bene', className: 'result-good' },
  { value: 'ottimo', label: 'Ottimo', className: 'result-great' },
]

const LESSON_SIDE_FEEDBACK_OPTIONS = [
  { value: 'bilaterale', label: 'Bilaterale', className: '' },
  { value: 'meglio_sx', label: 'Meglio sx', className: 'side-good' },
  { value: 'meglio_dx', label: 'Meglio dx', className: 'side-good' },
  { value: 'male_sx', label: 'Male sx', className: 'side-issue' },
  { value: 'male_dx', label: 'Male dx', className: 'side-issue' },
]

function normalizedLessonResult(value) {
  const aliases = { da_rifare: 'da_rivedere', da_rivedere: 'da_rivedere', buono: 'bene', bene: 'bene', ottimo: 'ottimo' }
  const normalized = aliases[value] || value
  return LESSON_RESULT_OPTIONS.some(option => option.value === normalized) ? normalized : 'bene'
}

function normalizedLessonSideFeedback(value) {
  return LESSON_SIDE_FEEDBACK_OPTIONS.some(option => option.value === value) ? value : 'bilaterale'
}

function lessonOption(options, value) {
  return options.find(option => option.value === value) || options[0]
}

function renderLessonResultButtons(value = 'bene') {
  const selected = normalizedLessonResult(value)
  const option = lessonOption(LESSON_RESULT_OPTIONS, selected)
  return `<div class="lesson-result-choice" role="group" aria-label="Valutazione" data-result="${esc(selected)}">
    <button type="button" class="btn btn-outline btn-sm lesson-result-toggle ${option.className} is-selected" data-result="${esc(option.value)}" data-selected="on" aria-pressed="true" onclick="toggleLessonResult(this)">${esc(option.label)}</button>
  </div>`
}

function lessonFormIsOpen() {
  return document.getElementById('lz-stato')?.value !== 'chiusa'
}

function lessonFeedbackHiddenByState() {
  return lessonFormIsOpen()
}

function renderLessonFeedbackControls(result = 'bene', sideFeedback = 'bilaterale') {
  return `<div class="lesson-feedback-controls" ${lessonFeedbackHiddenByState() ? 'hidden' : ''}>
    ${renderLessonResultButtons(result)}
    ${renderLessonSideFeedbackToggle(sideFeedback)}
  </div>`
}

function syncLessonFeedbackVisibility() {
  const hidden = lessonFeedbackHiddenByState()
  document.querySelectorAll('.lesson-feedback-controls').forEach(el => { el.hidden = hidden })
}

function renderGroupStudentFeedbackControls(allievoId, selected = true) {
  const result = editingLezioneGroupFeedback?.[allievoId]?.esito || 'bene'
  return `<div class="group-student-feedback lesson-feedback-controls${selected ? '' : ' is-unselected'}" data-allievo-id="${esc(allievoId)}" ${lessonFeedbackHiddenByState() ? 'hidden' : ''}>
    ${renderLessonResultButtons(result)}
  </div>`
}

function syncGroupStudentFeedbackVisibility() {
  const hidden = lessonFeedbackHiddenByState()
  document.querySelectorAll('.group-student-feedback').forEach(el => {
    const row = el.closest('.group-presence-row')
    const checked = row?.querySelector('input[type=checkbox]')?.checked
    el.hidden = hidden
    el.classList.toggle('is-unselected', checked === false)
  })
}

function collectGroupStudentFeedback() {
  const feedback = {}
  if (lessonFeedbackHiddenByState()) return feedback
  document.querySelectorAll('.group-student-feedback[data-allievo-id]').forEach(el => {
    if (el.classList.contains('is-unselected')) return
    const result = normalizedLessonResult(el.querySelector('.lesson-result-toggle[data-selected="on"]')?.dataset.result)
    feedback[el.dataset.allievoId] = { esito: result }
  })
  return feedback
}

function groupStudentFeedbackDimensions(allievoId, feedback = collectGroupStudentFeedback()) {
  const result = feedback?.[allievoId]?.esito
  return result ? { esito: normalizedLessonResult(result) } : {}
}

function toggleLessonResult(btn) {
  const choice = btn.closest('.lesson-result-choice')
  if (!choice) return
  const buttons = [...choice.querySelectorAll('.lesson-result-toggle')]
  if (buttons.length === 1) {
    const current = normalizedLessonResult(btn.dataset.result)
    const index = LESSON_RESULT_OPTIONS.findIndex(option => option.value === current)
    const next = LESSON_RESULT_OPTIONS[(index + 1) % LESSON_RESULT_OPTIONS.length]
    btn.dataset.result = next.value
    btn.dataset.selected = 'on'
    btn.setAttribute('aria-pressed', 'true')
    btn.textContent = next.label
    btn.classList.remove(...LESSON_RESULT_OPTIONS.map(option => option.className))
    btn.classList.add(next.className, 'is-selected')
    choice.dataset.result = next.value
    return
  }
  choice.dataset.result = normalizedLessonResult(btn.dataset.result)
  buttons.forEach(option => {
    const active = option === btn
    option.dataset.selected = active ? 'on' : 'off'
    option.setAttribute('aria-pressed', active ? 'true' : 'false')
    option.classList.toggle('is-selected', active)
  })
}

function renderLessonSideFeedbackToggle(value = 'bilaterale') {
  const option = lessonOption(LESSON_SIDE_FEEDBACK_OPTIONS, normalizedLessonSideFeedback(value))
  return `<button type="button" class="btn btn-outline btn-sm lesson-side-toggle ${option.className}" data-side-feedback="${esc(option.value)}" onclick="toggleLessonSideFeedback(this)">${esc(option.label)}</button>`
}

function toggleLessonSideFeedback(btn) {
  const current = normalizedLessonSideFeedback(btn.dataset.sideFeedback)
  const index = LESSON_SIDE_FEEDBACK_OPTIONS.findIndex(option => option.value === current)
  const next = LESSON_SIDE_FEEDBACK_OPTIONS[(index + 1) % LESSON_SIDE_FEEDBACK_OPTIONS.length]
  btn.dataset.sideFeedback = next.value
  btn.textContent = next.label
  btn.classList.remove(...LESSON_SIDE_FEEDBACK_OPTIONS.map(option => option.className).filter(Boolean))
  if (next.className) btn.classList.add(next.className)
}

function skillRowResult(row) {
  if (row?.querySelector('.lesson-feedback-controls')?.hidden) return ''
  return normalizedLessonResult(row?.querySelector('.lesson-result-toggle[data-selected="on"]')?.dataset.result)
}

function skillRowSideFeedback(row) {
  if (row?.querySelector('.lesson-feedback-controls')?.hidden) return ''
  return normalizedLessonSideFeedback(row?.querySelector('.lesson-side-toggle')?.dataset.sideFeedback)
}

function lessonResultLabel(value) {
  return lessonOption(LESSON_RESULT_OPTIONS, normalizedLessonResult(value)).label
}

function lessonSideFeedbackLabel(value) {
  return lessonOption(LESSON_SIDE_FEEDBACK_OPTIONS, normalizedLessonSideFeedback(value)).label
}

function renderFakieToggle(active = false) {
  return `<button type="button" class="btn btn-outline btn-sm fakie-toggle${active ? ' is-on' : ''}" data-fakie="${active ? 'on' : 'off'}" onclick="toggleLessonFakie(this)">Fakie ${active ? 'on' : 'off'}</button>`
}

function toggleLessonFakie(btn) {
  const active = btn.dataset.fakie !== 'on'
  btn.dataset.fakie = active ? 'on' : 'off'
  btn.textContent = `Fakie ${active ? 'on' : 'off'}`
  btn.classList.toggle('is-on', active)
}

function skillRowFakie(row) {
  return row.querySelector('.fakie-toggle')?.dataset.fakie === 'on'
}

const SKILL_DIMENSION_OPTIONS = {
  lato: ['bilaterale', 'dx', 'sx'],
  superficie: ['marmo', 'liscio', 'ruvida', 'rovinata', 'crepe/buchi', 'fogliame', 'bagnato', 'prato'],
  piano: ['piano', 'rialzo', 'discesa', 'salita', 'bank discesa', 'bank salita', 'rampa discesa', 'rampa salita', 'pump down', 'pump up'],
  velocita: ['lenta', 'velocità adeguata', 'veloce'],
  assistenza: ['autonomo', 'assistito'],
  stress: ['senza stress', 'sotto stress'],
}

const SKILL_DIMENSION_LABELS = {
  lato: 'Lato',
  superficie: 'Superficie',
  piano: 'Piano',
  velocita: 'Velocità',
  assistenza: 'Assistenza',
  stress: 'Stress',
}

const LESSON_EXERCISE_OPTIONS = [
  'slalom',
  'slalom largo',
  'conetti a 8',
  'curva a 1/4 cerchio',
  'curva a 1/2 cerchio',
  'curva a cerchio',
  'curva a spirale',
  'ostacoli conetti',
  'ostacolo rialzo',
]

function renderDimensionSelect(key, selected = '') {
  const label = SKILL_DIMENSION_LABELS[key] || key
  const options = SKILL_DIMENSION_OPTIONS[key] || []
  const defaults = { lato: 'bilaterale', superficie: 'liscio', piano: 'piano', velocita: 'velocità adeguata', assistenza: 'autonomo', stress: 'senza stress' }
  let normalizedSelected = selected
  if (key === 'lato' && selected === 'entrambi') normalizedSelected = 'bilaterale'
  if (key === 'superficie' && ['normale', 'liscia'].includes(selected)) normalizedSelected = 'liscio'
  if (key === 'velocita' && selected === 'media') normalizedSelected = 'velocità adeguata'
  if (key === 'stress' && ['basso', 'medio', 'alto'].includes(selected)) normalizedSelected = 'sotto stress'
  const value = normalizedSelected || defaults[key] || ''
  return `<select class="skill-dimension${value ? ' has-value' : ''}" data-dimension="${key}" aria-label="${esc(label)}" title="${esc(label)}" onchange="this.classList.toggle('has-value', !!this.value)">
    ${options.map(option => `<option value="${esc(option)}" ${option === value ? 'selected' : ''}>${esc(option)}</option>`).join('')}
  </select>`
}

function hasSkillDimensions(dimensioni = {}) {
  return !!dimensioni && Object.keys(SKILL_DIMENSION_OPTIONS).some(key => dimensioni[key])
}

function renderDimensionToggle(active = false) {
  return `<button type="button" class="btn btn-outline btn-sm dimensions-toggle${active ? ' is-on' : ''}" data-dimensions="${active ? 'on' : 'off'}" onclick="toggleSkillDimensions(this)">Dimensioni ${active ? 'on' : 'off'}</button>`
}

function toggleSkillDimensions(btn) {
  const active = btn.dataset.dimensions !== 'on'
  btn.dataset.dimensions = active ? 'on' : 'off'
  btn.textContent = `Dimensioni ${active ? 'on' : 'off'}`
  btn.classList.toggle('is-on', active)
  const row = btn.closest('.skill-row')
  const dimensions = row?.querySelector('.skill-dimensions')
  if (dimensions) dimensions.hidden = !active
}

function renderSkillDimensions(dimensioni = {}, active = false) {
  return `<div class="skill-dimensions" ${active ? '' : 'hidden'}>${Object.keys(SKILL_DIMENSION_OPTIONS).map(key => renderDimensionSelect(key, dimensioni?.[key] || '')).join('')}</div>`
}

function normalizeExerciseList(value) {
  if (Array.isArray(value)) return [...new Set(value.flatMap(item => Array.isArray(item) ? item : [item]).map(item => String(item || '').trim()).filter(Boolean))]
  if (typeof value === 'string') return splitVariantText(value)
  return []
}

function renderExerciseToggle(active = false, count = 0) {
  return `<button type="button" class="btn btn-outline btn-sm exercise-toggle${active ? ' is-on' : ''}" data-exercises="${active ? 'on' : 'off'}" onclick="toggleSkillExercises(this)">Esercizi${count ? ` ${count}` : ''}</button>`
}

function toggleSkillExercises(btn) {
  const active = btn.dataset.exercises !== 'on'
  btn.dataset.exercises = active ? 'on' : 'off'
  const row = btn.closest('.skill-row')
  const selectedCount = skillRowExercises(row).length
  btn.textContent = `Esercizi${selectedCount ? ` ${selectedCount}` : ''}`
  btn.classList.toggle('is-on', active)
  const panel = row?.querySelector('.skill-exercises')
  if (panel) panel.hidden = !active
}

function renderSkillExercises(selected = [], active = false) {
  const selectedSet = new Set(normalizeExerciseList(selected))
  return `<div class="skill-exercises" ${active ? '' : 'hidden'}>${LESSON_EXERCISE_OPTIONS.map(name => `
    <button type="button" class="exercise-chip${selectedSet.has(name) ? ' is-on' : ''}" data-exercise="${esc(name)}" data-selected="${selectedSet.has(name) ? 'on' : 'off'}" onclick="toggleExerciseChip(this)">${esc(name)}</button>
  `).join('')}</div>`
}

function toggleExerciseChip(btn) {
  const selected = btn.dataset.selected !== 'on'
  btn.dataset.selected = selected ? 'on' : 'off'
  btn.classList.toggle('is-on', selected)
  const row = btn.closest('.skill-row')
  const toggle = row?.querySelector('.exercise-toggle')
  if (toggle) {
    const count = skillRowExercises(row).length
    toggle.textContent = `Esercizi${count ? ` ${count}` : ''}`
    toggle.classList.toggle('is-on', toggle.dataset.exercises === 'on' || count > 0)
  }
}

function skillRowExercises(row) {
  return [...(row?.querySelectorAll('.exercise-chip[data-selected="on"]') || [])]
    .map(btn => btn.dataset.exercise)
    .filter(Boolean)
}

function skillRowDimensions(row) {
  const dimensioni = {}
  const esito = skillRowResult(row)
  const latoFeedback = skillRowSideFeedback(row)
  if (esito) dimensioni.esito = esito
  if (latoFeedback) dimensioni.lato_feedback = latoFeedback
  if (row.querySelector('.dimensions-toggle')?.dataset.dimensions === 'on') {
    row.querySelectorAll('.skill-dimension[data-dimension]').forEach(select => {
      if (select.value) dimensioni[select.dataset.dimension] = select.value
    })
  }
  const esercizi = skillRowExercises(row)
  if (esercizi.length) dimensioni.esercizi = esercizi
  return dimensioni
}

function lessonSkillOnlyDimensions(dimensioni = {}) {
  const clean = { ...(dimensioni || {}) }
  delete clean.esito
  delete clean.lato_feedback
  return clean
}

function rememberGroupStudentFeedback(allievoId, dimensioni = {}) {
  const esito = dimensioni?.esito
  if (!allievoId || !esito || editingLezioneGroupFeedback[allievoId]?.esito) return
  editingLezioneGroupFeedback[allievoId] = { esito: normalizedLessonResult(esito) }
}

function mergeDimensionValue(a, b) {
  const values = []
  ;[a, b].forEach(value => {
    if (Array.isArray(value)) values.push(...value)
    else if (value !== undefined && value !== null && value !== '') values.push(value)
  })
  const unique = [...new Set(values.map(value => String(value).trim()).filter(Boolean))]
  if (!unique.length) return undefined
  return unique.length === 1 ? unique[0] : unique
}

function mergeLessonDimensions(a = {}, b = {}) {
  const merged = { ...(a || {}) }
  Object.entries(b || {}).forEach(([key, value]) => {
    const next = key === 'esercizi'
      ? normalizeExerciseList([...(normalizeExerciseList(merged[key])), ...(normalizeExerciseList(value))])
      : mergeDimensionValue(merged[key], value)
    if (next !== undefined && (!(Array.isArray(next)) || next.length)) merged[key] = next
  })
  return merged
}

function dimensionValueLabel(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ')
  return value || ''
}

function renderGroupExclusionChips(selectedIds = []) {
  const selected = new Set(selectedIds || [])
  const chips = selectedLezioneAllieviIds()
    .map(id => `<button type="button" class="group-exclude-chip${selected.has(id) ? ' is-excluded' : ''}" data-allievo-id="${esc(id)}" data-excluded="${selected.has(id) ? 'on' : 'off'}" onclick="toggleGroupExclusionChip(this)">${esc(allievoDisplayName(id))}</button>`)
    .join('')
  return `<div class="group-exclusion-box"><span class="group-exclusion-label">Escludi</span>${chips || '<span class="lezione-empty-detail">Nessun presente</span>'}</div>`
}

function toggleGroupExclusionChip(btn) {
  const excluded = btn.dataset.excluded !== 'on'
  btn.dataset.excluded = excluded ? 'on' : 'off'
  btn.classList.toggle('is-excluded', excluded)
}

function skillRowExcludedIds(row) {
  return [...row.querySelectorAll('.group-exclude-chip[data-excluded="on"]')].map(btn => btn.dataset.allievoId)
}

function refreshGroupExclusionControls() {
  document.querySelectorAll('.group-exclusion-box').forEach(box => {
    const selected = new Set([...box.querySelectorAll('.group-exclude-chip[data-excluded="on"]')].map(btn => btn.dataset.allievoId))
    box.innerHTML = `<span class="group-exclusion-label">Escludi</span>${selectedLezioneAllieviIds()
      .map(id => `<button type="button" class="group-exclude-chip${selected.has(id) ? ' is-excluded' : ''}" data-allievo-id="${esc(id)}" data-excluded="${selected.has(id) ? 'on' : 'off'}" onclick="toggleGroupExclusionChip(this)">${esc(allievoDisplayName(id))}</button>`)
      .join('') || '<span class="lezione-empty-detail">Nessun presente</span>'}`
  })
}

function ensureEmptySkillRow(allieviId) {
  const container = document.getElementById(`skill-rows-${allieviId}`)
  if (!container) return
  const rows = [...container.querySelectorAll('.skill-row')]
  const hasEmpty = rows.some(row => !row.querySelector('.skill-select')?.value)
  if (!hasEmpty) aggiungiSkillRow(allieviId)
}

function onLessonSkillSelected(select) {
  compactSelectedSkillOption(select)
  renderPrepSelectedSkills(select.closest('.skill-row')?.dataset.allieviId)
}

function removeSkillRow(btn) {
  const row = btn.closest('.skill-row')
  const ownerId = row?.dataset.allieviId
  row?.remove()
  renderPrepSelectedSkills(ownerId)
}

function skillRowSummaryText(row) {
  const select = row?.querySelector('.skill-select')
  const skillName = select?.selectedOptions?.[0]?.dataset?.name || select?.selectedOptions?.[0]?.textContent || 'Skill'
  const stadio = parseInt(row?.querySelector('.stadio-toggle')?.dataset.stadio || '1', 10) || 1
  const bits = [skillName.trim() || 'Skill', lessonStadioLabel(stadio)]
  const exercises = skillRowExercises(row)
  if (exercises.length) bits.push(`${exercises.length} esercizi`)
  if (row?.querySelector('.dimensions-toggle')?.dataset.dimensions === 'on') bits.push('dimensioni')
  if (skillRowFakie(row)) bits.push('fakie')
  return bits.join(' · ')
}

function collapseSkillRow(row) {
  if (!row || !row.querySelector('.skill-select')?.value) return
  const summary = row.querySelector('.skill-row-summary')
  if (summary) summary.textContent = skillRowSummaryText(row)
  row.classList.add('is-collapsed')
}

function expandSkillRow(btn) {
  btn.closest('.skill-row')?.classList.remove('is-collapsed')
}

function collapseExistingSkillRows(container) {
  container?.querySelectorAll('.skill-row').forEach(row => collapseSkillRow(row))
}

function aggiungiSkillRow(allieviId, selectedSkillId = '', selectedStadio = 1, selectedDimensioni = {}, selectedFakie = false, selectedExcludedIds = [], options = {}) {
  const container = document.getElementById(`skill-rows-${allieviId}`)
  if (!container) return
  if (options.collapseExisting !== false) collapseExistingSkillRows(container)
  const row = document.createElement('div')
  row.className = 'skill-row'
  row.dataset.allieviId = allieviId
  row.dataset.ripassoOnly = options.ripassoOnly ? '1' : '0'
  const selectedSkill = selectedSkillId ? allSkills.find(skill => String(skill.id) === String(selectedSkillId)) : null
  const selectedBranch = selectedSkill?.ramo || ''
  const allowedSkillIds = options.ripassoOnly ? ripassoSkillIdsForOwner(allieviId) : null
  const fakieActive = !!selectedFakie || selectedDimensioni?.direzione === 'fakie'
  const dimensionsActive = hasSkillDimensions(selectedDimensioni)
  const selectedExercises = normalizeExerciseList(selectedDimensioni?.esercizi)
  const exercisesActive = selectedExercises.length > 0
  const selectedResult = normalizedLessonResult(selectedDimensioni?.esito)
  const selectedSideFeedback = normalizedLessonSideFeedback(selectedDimensioni?.lato_feedback)
  const useSkillFeedback = !currentLessonTargetIsGroup()

  row.innerHTML = `
    <button type="button" class="btn btn-outline btn-sm skill-row-summary" onclick="expandSkillRow(this)">Skill</button>
    <select class="skill-branch" onchange="filterSkillRow(this)">
      ${renderLessonBranchOptions(selectedBranch)}
    </select>
    <select class="skill-select" onchange="onLessonSkillSelected(this)">
      <option value="">— Skill —</option>
      ${renderLessonSkillOptions(selectedSkillId, '', selectedBranch, { allowedSkillIds })}
    </select>
    ${renderFakieToggle(fakieActive)}
    ${renderDimensionToggle(dimensionsActive)}
    ${renderExerciseToggle(exercisesActive, selectedExercises.length)}
    ${useSkillFeedback ? renderLessonFeedbackControls(selectedResult, selectedSideFeedback) : ''}
    ${renderLessonStadioToggle(selectedStadio)}
    <button class="btn btn-ghost btn-sm" onclick="removeSkillRow(this)">✕</button>
    ${allieviId === GROUP_SKILL_ROWS_KEY ? renderGroupExclusionChips(selectedExcludedIds) : ''}
    ${renderSkillDimensions(selectedDimensioni, dimensionsActive)}
    ${renderSkillExercises(selectedExercises, exercisesActive)}`
  container.appendChild(row)
  compactSelectedSkillOption(row.querySelector('.skill-select'))
  if (options.scrollIntoView) focusLessonSkillRow(row)
  return row
}

async function snapshotLezioneRelazioni(lezioneId) {
  if (!lezioneId) return { allievi: [], skills: [] }
  const [{ data: allievi, error: allieviError }, { data: skills, error: skillsError }] = await Promise.all([
    sb.from('lezioni_allievi').select('*').eq('lezione_id', lezioneId),
    sb.from('lezioni_skills').select('*').eq('lezione_id', lezioneId),
  ])
  if (allieviError) throw allieviError
  if (skillsError) throw skillsError
  return { allievi: allievi || [], skills: skills || [] }
}

function sanitizeSnapshotRow(row) {
  const copy = { ...row }
  delete copy.id
  delete copy.created_at
  delete copy.updated_at
  return copy
}

function historySetSignature(values = []) {
  return [...new Set(values.map(valueForHistory))].sort().join('|')
}

function skillHistorySignature(row = {}) {
  return [
    row.allievo_id || '',
    row.skill_id || '',
    Number(row.stadio_raggiunto || row.stadio || 0),
    row.fakie ? 'fakie' : 'frontale',
    valueForHistory(row.dimensioni || {})
  ].join('::')
}

function pendingSkillHistorySignatures(pendingSkillsByAllievo) {
  const rows = []
  pendingSkillsByAllievo.forEach((skillMap, allievoId) => {
    skillMap.forEach(item => rows.push({
      allievo_id: allievoId,
      skill_id: item.skillId,
      stadio_raggiunto: item.stadio,
      fakie: item.fakie,
      dimensioni: item.dimensioni
    }))
  })
  return rows.map(skillHistorySignature)
}

function lessonHistoryChanges(originalLesson, payloadLezione, relationSnapshot, checkedAllievi, pendingSkillsByAllievo) {
  const changes = historyChangedFields(originalLesson || {}, payloadLezione, {
    data: 'data',
    durata_min: 'durata',
    tipo: 'tipo',
    luogo: 'luogo',
    meteo: 'meteo',
    note_speciali: 'note speciali',
    stato: 'stato',
    check_bene: 'cosa e andato bene',
    check_non_fatto: 'non fatto / da riprendere',
    note: 'note'
  })
  if (relationSnapshot) {
    const beforeAllievi = historySetSignature((relationSnapshot.allievi || []).map(row => row.allievo_id))
    const afterAllievi = historySetSignature((checkedAllievi || []).map(cb => cb.value))
    if (beforeAllievi !== afterAllievi) changes.push('allievi')
    const beforeSkills = historySetSignature((relationSnapshot.skills || []).map(skillHistorySignature))
    const afterSkills = historySetSignature(pendingSkillHistorySignatures(pendingSkillsByAllievo))
    if (beforeSkills !== afterSkills) changes.push(payloadLezione?.tipo === 'campo_libero' ? 'skill pianificate' : 'skill lavorate')
  }
  return changes
}

async function ripristinaRelazioniLezione(lezioneId, snapshot) {
  if (!lezioneId || !snapshot) return
  await sb.from('lezioni_skills').delete().eq('lezione_id', lezioneId)
  await sb.from('lezioni_allievi').delete().eq('lezione_id', lezioneId)
  const allievi = (snapshot.allievi || []).map(sanitizeSnapshotRow)
  const skills = (snapshot.skills || []).map(sanitizeSnapshotRow)
  if (allievi.length) {
    const { error } = await sb.from('lezioni_allievi').insert(allievi)
    if (error) throw error
  }
  if (skills.length) {
    const { error } = await sb.from('lezioni_skills').insert(skills)
    if (error) throw error
  }
}

async function salvaLezione() {
  const data   = document.getElementById('lz-data').value
  const ora = normalizeLessonTime(document.getElementById('lz-ora')?.value || '')
  const durata = parseInt(document.getElementById('lz-durata').value) || null
  const stato = document.getElementById('lz-stato')?.value === 'chiusa' ? 'chiusa' : 'aperta'
  const target = document.getElementById('lz-tipo').value
  const tipo   = target.startsWith('gruppo:') ? 'gruppo' : target.startsWith('allievo:') ? 'individuale' : 'campo_libero'
  const selectedLocationId = document.getElementById('lz-location-id')?.value || null
  const selectedLocation = selectedLocationId ? locationRecordById(selectedLocationId) : null
  if (selectedLocation?.nome && !document.getElementById('lz-luogo').value.trim()) document.getElementById('lz-luogo').value = selectedLocation.nome
  const luogo  = document.getElementById('lz-luogo').value.trim() || selectedLocation?.nome || null
  const meteo  = document.getElementById('lz-meteo')?.value.trim() || null
  const noteSpeciali = document.getElementById('lz-note-speciali').value.trim() || null
  const checkBene = document.getElementById('lz-check-bene')?.value.trim() || ''
  const checkNonFatto = document.getElementById('lz-check-non-fatto')?.value.trim() || ''
  const note   = composeLessonNotes(document.getElementById('lz-note').value.trim(), checkBene, checkNonFatto, noteSpeciali || '', stato, meteo || '', ora)
  clearLezioneFormMessage()

  if (!data) { setLezioneFormMessage('Inserisci la data.'); return }
  if (!target) { setLezioneFormMessage('Seleziona allievo, gruppo o campo libero.'); return }
  const checkedAllievi = [...document.querySelectorAll('#lz-hidden-checks input[type=checkbox]:checked')]
  if (!checkedAllievi.length && tipo !== 'campo_libero') { setLezioneFormMessage('Seleziona almeno un allievo.'); return }
  const lezioneAllieviIds = checkedAllievi.map(cb => cb.value)
  const locationEntries = lessonLocationEntries(luogo, lezioneAllieviIds)
  const effectiveLocationId = locationEntries.length === 1 ? selectedLocationId : null

  const buttons = [document.getElementById('btn-salva-lz'), document.getElementById('btn-salva-lz-top')].filter(Boolean)
  const saveText = lezioneFormSaveLabel(!!editingLezioneId)
  buttons.forEach(btn => { btn.disabled = true; btn.textContent = 'Salvataggio…' })

  const lezioneInModifica = editingLezioneId
  const originalLessonForHistory = lezioneInModifica ? ((lezioniCache || []).find(l => String(l.id) === String(lezioneInModifica)) || {}) : {}
  let lz = null
  let snapshot = null
  let relazioniSostituite = false
  let changedFieldsForHistory = []

  try {
    if (lezioneInModifica) snapshot = await snapshotLezioneRelazioni(lezioneInModifica)

    // 1 — crea o aggiorna lezione
    let e1
    const payloadLezione = { data, durata_min: durata, tipo, luogo, location_id: effectiveLocationId || null, meteo, note_speciali: noteSpeciali, note, stato, check_bene: checkBene || null, check_non_fatto: checkNonFatto || null }
    const payloadLezioneCompat = { data, durata_min: durata, tipo, luogo, note }
    const payloadLezioneNuova = { ...payloadLezione, maestro_id: currentUid || null }
    const payloadLezioneNuovaCompat = { ...payloadLezioneCompat, maestro_id: currentUid || null }
    if (lezioneInModifica) {
      let payloadCorrente = payloadLezione
      ;({ data: lz, error: e1 } = await sb.from('lezioni').update(payloadCorrente).eq('id', lezioneInModifica).select().single())
      if (isMissingLessonLocationIdError(e1)) {
        const { location_id: _locationId, ...withoutLocationId } = payloadCorrente
        payloadCorrente = withoutLocationId
        ;({ data: lz, error: e1 } = await sb.from('lezioni').update(payloadCorrente).eq('id', lezioneInModifica).select().single())
      }
      if (isMissingLessonMeteoError(e1)) {
        const { meteo: _meteo, ...withoutMeteo } = payloadCorrente
        payloadCorrente = withoutMeteo
        ;({ data: lz, error: e1 } = await sb.from('lezioni').update(payloadCorrente).eq('id', lezioneInModifica).select().single())
      }
      if (isMissingLessonCheckError(e1)) {
        const { check_bene, check_non_fatto, ...withoutCheck } = payloadCorrente
        payloadCorrente = withoutCheck
        ;({ data: lz, error: e1 } = await sb.from('lezioni').update(payloadCorrente).eq('id', lezioneInModifica).select().single())
      }
      if (isMissingLessonStatusError(e1)) {
        const { stato: _stato, ...withoutStatus } = payloadCorrente
        payloadCorrente = withoutStatus
        ;({ data: lz, error: e1 } = await sb.from('lezioni').update(payloadCorrente).eq('id', lezioneInModifica).select().single())
      }
      if (isMissingLessonCheckError(e1)) {
        const { stato: _stato, check_bene, check_non_fatto, ...withoutStatusAndCheck } = payloadCorrente
        payloadCorrente = withoutStatusAndCheck
        ;({ data: lz, error: e1 } = await sb.from('lezioni').update(payloadCorrente).eq('id', lezioneInModifica).select().single())
      }
      if (isMissingNoteSpecialiError(e1)) {
        ;({ data: lz, error: e1 } = await sb.from('lezioni').update(payloadLezioneCompat).eq('id', lezioneInModifica).select().single())
      }
    } else {
      let payloadCorrente = payloadLezioneNuova
      ;({ data: lz, error: e1 } = await sb.from('lezioni').insert(payloadCorrente).select().single())
      if (isMissingLessonLocationIdError(e1)) {
        const { location_id: _locationId, ...withoutLocationId } = payloadCorrente
        payloadCorrente = withoutLocationId
        ;({ data: lz, error: e1 } = await sb.from('lezioni').insert(payloadCorrente).select().single())
      }
      if (isMissingLessonMeteoError(e1)) {
        const { meteo: _meteo, ...withoutMeteo } = payloadCorrente
        payloadCorrente = withoutMeteo
        ;({ data: lz, error: e1 } = await sb.from('lezioni').insert(payloadCorrente).select().single())
      }
      if (isMissingLessonCheckError(e1)) {
        const { check_bene, check_non_fatto, ...withoutCheck } = payloadCorrente
        payloadCorrente = withoutCheck
        ;({ data: lz, error: e1 } = await sb.from('lezioni').insert(payloadCorrente).select().single())
      }
      if (isMissingLessonStatusError(e1)) {
        const { stato: _stato, ...withoutStatus } = payloadCorrente
        payloadCorrente = withoutStatus
        ;({ data: lz, error: e1 } = await sb.from('lezioni').insert(payloadCorrente).select().single())
      }
      if (isMissingLessonCheckError(e1)) {
        const { stato: _stato, check_bene, check_non_fatto, ...withoutStatusAndCheck } = payloadCorrente
        payloadCorrente = withoutStatusAndCheck
        ;({ data: lz, error: e1 } = await sb.from('lezioni').insert(payloadCorrente).select().single())
      }
      if (isMissingNoteSpecialiError(e1)) {
        ;({ data: lz, error: e1 } = await sb.from('lezioni').insert(payloadLezioneNuovaCompat).select().single())
      }
    }
    if (e1) throw e1

    if (lezioneInModifica) {
      const { error: skillsDeleteError } = await sb.from('lezioni_skills').delete().eq('lezione_id', lezioneInModifica)
      if (skillsDeleteError) throw skillsDeleteError
      const { error: allieviDeleteError } = await sb.from('lezioni_allievi').delete().eq('lezione_id', lezioneInModifica)
      if (allieviDeleteError) throw allieviDeleteError
      relazioniSostituite = true
    }

    const pendingSkillsByAllievo = new Map()
    const groupFeedback = tipo === 'gruppo' ? collectGroupStudentFeedback() : {}
    const queueSkillForAllievo = (aid, row, extraDimensioni = {}) => {
      const skillId = row.querySelector('.skill-select')?.value
      const stadio  = parseInt(row.querySelector('.stadio-toggle')?.dataset.stadio || '1', 10)
      const dimensioni = mergeLessonDimensions(skillRowDimensions(row), extraDimensioni)
      const fakie = skillRowFakie(row)
      if (!skillId) return
      if (!pendingSkillsByAllievo.has(aid)) pendingSkillsByAllievo.set(aid, new Map())
      const key = `${skillId}:${stadio}:${fakie ? 'fakie' : 'frontale'}`
      const pending = pendingSkillsByAllievo.get(aid)
      const current = pending.get(key)
      pending.set(key, current
        ? { ...current, dimensioni: mergeLessonDimensions(current.dimensioni, dimensioni) }
        : { skillId, stadio, fakie, dimensioni })
    }
    const flushSkills = async () => {
      for (const [aid, skillMap] of pendingSkillsByAllievo.entries()) {
        for (const item of skillMap.values()) {
          const { error: skillError } = await insertLezioneSkill({ lezione_id: lz.id, allievo_id: aid || null, skill_id: item.skillId, stadio_raggiunto: item.stadio, fakie: item.fakie, dimensioni: item.dimensioni })
          if (skillError) throw skillError
          if (stato === 'chiusa' && aid) {
            try {
              await aggiornaProgressiDaLezione(aid, item.skillId, item.stadio, { fakie: item.fakie })
            } catch (progressError) {
              console.warn('Progressi non aggiornati dopo salvataggio lezione', progressError)
            }
          }
        }
      }
    }

    // 2 — allievi + skill
    for (const cb of checkedAllievi) {
      const aid = cb.value
      const { error: allievoInsertError } = await sb.from('lezioni_allievi').insert({ lezione_id: lz.id, allievo_id: aid })
      if (allievoInsertError) throw allievoInsertError
    }
    await ensureLocationDaLezione(luogo, lezioneAllieviIds)

    if (tipo === 'gruppo') {
      const checkedIds = checkedAllievi.map(cb => cb.value)
      for (const row of document.querySelectorAll(`#skill-rows-${GROUP_SKILL_ROWS_KEY} .skill-row`)) {
        const excluded = new Set(skillRowExcludedIds(row))
        for (const aid of checkedIds.filter(id => !excluded.has(id))) {
          queueSkillForAllievo(aid, row, groupStudentFeedbackDimensions(aid, groupFeedback))
        }
      }
      for (const aid of checkedIds) {
        const rows = document.querySelectorAll(`#skill-rows-${aid} .skill-row`)
        for (const row of rows) queueSkillForAllievo(aid, row, groupStudentFeedbackDimensions(aid, groupFeedback))
      }
    } else {
      if (tipo === 'campo_libero') {
        const rows = document.querySelectorAll(`#skill-rows-${FREE_LESSON_SKILL_ROWS_KEY} .skill-row`)
        for (const row of rows) queueSkillForAllievo(null, row)
      } else {
        for (const cb of checkedAllievi) {
          const aid = cb.value
          const rows = document.querySelectorAll(`#skill-rows-${aid} .skill-row`)
          for (const row of rows) {
            queueSkillForAllievo(aid, row)
          }
        }
      }
    }
    if (lezioneInModifica) {
      changedFieldsForHistory = lessonHistoryChanges(originalLessonForHistory, payloadLezione, snapshot, checkedAllievi, pendingSkillsByAllievo)
    }
    await flushSkills()
    logModificaLocale('lezione', lz.id, lezioneInModifica
      ? historyDescription(`Aggiornata lezione (${stato})`, changedFieldsForHistory)
      : `Creata lezione (${stato}): ${checkedAllievi.length} allievi, ${pendingSkillHistorySignatures(pendingSkillsByAllievo).length} skill`)

    editingLezioneId = null
    editingLezioneAllieviIds = []
    editingLezioneSkillRows = {}
    lezioniCache = null
    luoghiLezioneCache.clear()
    safeStorage.removeItem(LEZIONE_DRAFT_KEY)
    const destination = editReturnTarget
    editReturnTarget = null
    await goToReturnTarget(destination, { name: 'lezione', id: lz.id })
  } catch (e) {
    if (lezioneInModifica && relazioniSostituite && snapshot) {
      try {
        await ripristinaRelazioniLezione(lezioneInModifica, snapshot)
      } catch (restoreError) {
        console.error('Ripristino relazioni lezione fallito', restoreError)
      }
    }
    saveLezioneDraft({ keep: true })
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false
    const reason = e.message || 'Errore nel salvataggio della lezione. Le presenze precedenti sono state mantenute quando possibile.'
    const localNote = offline
      ? 'Bozza salvata localmente su questo dispositivo: sei offline. Riprova il salvataggio quando torna la connessione.'
      : 'Bozza salvata localmente su questo dispositivo. Riprova il salvataggio quando il servizio online risponde.'
    setLezioneFormMessage(`${reason} ${localNote}`)
  } finally {
    buttons.forEach(btn => { btn.disabled = false; btn.textContent = saveText })
  }
}

async function insertLezioneSkill(payload) {
  let nextPayload = { ...payload }
  for (let attempt = 0; attempt < 3; attempt++) {
    const { error } = await sb.from('lezioni_skills').insert(nextPayload)
    if (!error) return { error: null }
    if (isMissingDimensioniError(error) && 'dimensioni' in nextPayload) {
      if (hasLessonSkillMetadata(nextPayload)) return { error: missingLessonSkillColumnError('dimensioni') }
      const { dimensioni, ...compatPayload } = nextPayload
      nextPayload = compatPayload
      continue
    }
    if (isMissingFakieError(error) && 'fakie' in nextPayload) {
      if (nextPayload.fakie) return { error: missingLessonSkillColumnError('fakie') }
      const { fakie, ...compatPayload } = nextPayload
      nextPayload = compatPayload
      continue
    }
    return { error }
  }
  return { error: null }
}

// ── Tuning metodologia ───────────────────────────────────────────────

const TUNING_PARAMS = [
  {
    key: 'verticalizzazione',
    label: 'Verticalizzazione',
    dbLabel: 'Baricentro',
    hint: 'Gestione del baricentro: abbassamento, carico, recupero asse.',
    scale: ['Rigido / centrale', 'Doppio supporto stabile', 'Trasferimento parziale', 'Carico dominante assistito', 'Instabilita controllata']
  },
  {
    key: 'forze',
    label: 'Forze',
    dbLabel: 'Forze',
    hint: 'Interazione col suolo: generare, guidare o dissipare energia.',
    scale: ['Quasi passivo', 'Forza reattiva', 'Forza guidata semplice', 'Forza ciclica/modulata', 'Forza intensa o esplosiva']
  },
  {
    key: 'rotazione',
    label: 'Rotazione',
    dbLabel: 'Assi',
    hint: 'Setup, pre-rotazione, dissociazione e controllo rotativo.',
    scale: ['Nessuna rotazione', 'Micro aggiustamenti', 'Orientamento/setup', 'Rotazione funzionale', 'Dissociazione complessa']
  },
  {
    key: 'tempo',
    label: 'Tempo',
    dbLabel: 'Tempo',
    hint: 'Sequenza, ritmo, timing e fasi del gesto.',
    scale: ['Statico o libero', 'Timing semplice', 'Sequenza breve', 'Ritmo continuo', 'Timing preciso multi-fase']
  },
  {
    key: 'stabilita',
    label: 'Stabilita',
    dbLabel: null,
    hint: 'Quanto equilibrio serve per tenere o attraversare la posizione.',
    scale: ['Base ampia', 'Stabile ma attiva', 'Equilibrio da gestire', 'Base ridotta/dinamica', 'Equilibrio critico']
  },
  {
    key: 'asimmetria',
    label: 'Asimmetria',
    dbLabel: 'Bilaterale',
    hint: 'Dominanza di lato, bilateralita o carichi non simmetrici.',
    scale: ['Simmetrica', 'Lieve preferenza', 'Un lato dominante', 'Bilateralita richiesta', 'Forte asimmetria tecnica']
  },
  {
    key: 'coordinazione',
    label: 'Coordinazione',
    dbLabel: null,
    hint: 'Numero e precisione dei segmenti corporei da coordinare.',
    scale: ['Gesto singolo', 'Due elementi', 'Catena semplice', 'Catena coordinata', 'Coordinazione fine complessa']
  },
  {
    key: 'difficolta',
    label: 'Difficolta',
    dbLabel: 'Livello',
    hint: 'Sintesi didattica: quanto costa apprenderla in progressione.',
    scale: ['Primo approccio', 'Facile guidata', 'Intermedia', 'Avanzata', 'Molto avanzata']
  }
]

async function initTuning() {
  tuningLocal = JSON.parse(safeStorage.getItem('tuningLocal') || '[]')
  tuningAlertCount = Number(safeStorage.getItem('tuningAlertCount') || 0)
  renderSkillLab()
  if (!skillLabLoaded && !skillLabLoading) await loadSkillLabUsage()
}

function setSkillLabStatus(text, kind = '') {
  const el = document.getElementById('skill-lab-status')
  if (!el) return
  el.className = `msg ${kind}`.trim()
  el.style.display = text ? 'block' : 'none'
  el.textContent = text || ''
}

async function loadSkillLabUsage({ force = false } = {}) {
  if (skillLabLoading || (skillLabLoaded && !force)) return
  skillLabLoading = true
  renderSkillLab()
  setSkillLabStatus('Aggiornamento degli utilizzi reali in corso…', 'msg-info')
  try {
    const { data, error } = await sb.from('lezioni_skills').select('skill_id,allievo_id,lezione_id')
    if (error) throw error
    skillLabUsageRows = data || []
    skillLabLoaded = true
    setSkillLabStatus(`Analisi aggiornata: ${skillLabUsageRows.length} registrazioni lezione esaminate.`, 'msg-ok')
  } catch (error) {
    skillLabUsageRows = []
    setSkillLabStatus(`Utilizzo nelle lezioni non disponibile: ${error.message || error}. Le altre analisi restano valide.`, 'msg-err')
  } finally {
    skillLabLoading = false
    renderSkillLab()
  }
}

function refreshSkillLab() {
  loadSkillLabUsage({ force: true })
}

function setSkillLabView(view) {
  skillLabView = view
  ;['overview', 'inventory', 'quality', 'anomalies', 'guided'].forEach(name => {
    document.getElementById(`skill-lab-tab-${name}`)?.classList.toggle('chip-on', name === view)
  })
  renderSkillLab()
}

function skillLabDefinitionQuality(skill) {
  const def = skillDefinitionForSkill(skill)
  const checks = [
    ['livello', Number(skill.livello || 0) > 0, 10],
    ['ramo', !!String(skill.ramo || '').trim(), 10],
    ['descrizione', !!String(skill.descrizione || '').trim(), 15],
    ['scheda definizione', !!def, 10],
    ['cosa fa', !!String(def?.cosa_fa || '').trim(), 20],
    ['come si fa', !!String(def?.come_si_fa || '').trim(), 20],
    ['prerequisiti', Number(skill.livello || 0) <= 1 || allPrereqs.some(row => String(row.skill_id) === String(skill.id)), 10],
    ['metadati essenziali', !!String(skill.blocco || '').trim(), 5],
  ]
  return {
    score: checks.reduce((sum, [, ok, weight]) => sum + (ok ? weight : 0), 0),
    missing: checks.filter(([, ok]) => !ok).map(([label]) => label),
    definition: def,
  }
}

function skillLabNameBigrams(value) {
  const text = ` ${normalizeText(value).replace(/[^a-z0-9à-ÿ]+/g, ' ').replace(/\s+/g, ' ').trim()} `
  const grams = new Set()
  for (let i = 0; i < text.length - 1; i++) grams.add(text.slice(i, i + 2))
  return grams
}

function skillLabNameSimilarity(a, b) {
  const left = skillLabNameBigrams(a)
  const right = skillLabNameBigrams(b)
  if (!left.size || !right.size) return 0
  let common = 0
  left.forEach(gram => { if (right.has(gram)) common++ })
  return (2 * common) / (left.size + right.size)
}

function skillLabCycles(outgoing) {
  const found = new Map()
  const visiting = new Set()
  const visited = new Set()
  const path = []
  const canonical = ids => {
    const ring = ids.slice(0, -1)
    const rotations = ring.map((_, index) => [...ring.slice(index), ...ring.slice(0, index)])
    rotations.sort((a, b) => a.join('|').localeCompare(b.join('|')))
    return rotations[0]
  }
  const walk = id => {
    if (visiting.has(id)) {
      const start = path.indexOf(id)
      if (start >= 0) {
        const cycle = canonical([...path.slice(start), id])
        found.set(cycle.join('|'), cycle)
      }
      return
    }
    if (visited.has(id)) return
    visiting.add(id)
    path.push(id)
    ;(outgoing.get(id) || []).forEach(walk)
    path.pop()
    visiting.delete(id)
    visited.add(id)
  }
  allSkills.forEach(skill => walk(String(skill.id)))
  return [...found.values()]
}

function buildSkillLabAnalysis() {
  const outgoing = new Map()
  const incoming = new Map()
  allSkills.forEach(skill => {
    outgoing.set(String(skill.id), [])
    incoming.set(String(skill.id), [])
  })
  allPrereqs.forEach(row => {
    const skillId = String(row.skill_id)
    const requirementId = String(row.richiede_skill_id)
    if (outgoing.has(skillId) && outgoing.has(requirementId)) {
      outgoing.get(skillId).push(requirementId)
      incoming.get(requirementId).push(skillId)
    }
  })

  const progressStudents = new Map()
  allProgressi.forEach(row => {
    const id = String(row.skill_id)
    if (!progressStudents.has(id)) progressStudents.set(id, new Set())
    if (row.allievo_id) progressStudents.get(id).add(String(row.allievo_id))
  })
  const actualLessons = new Map()
  const plannedLessons = new Map()
  skillLabUsageRows.forEach(row => {
    const id = String(row.skill_id)
    const target = row.allievo_id ? actualLessons : plannedLessons
    if (!target.has(id)) target.set(id, new Set())
    target.get(id).add(String(row.lezione_id || `${id}:${target.get(id).size}`))
  })

  const cycles = skillLabCycles(outgoing)
  const cycleIds = new Set(cycles.flat())
  const similarPairs = []
  for (let i = 0; i < allSkills.length; i++) {
    for (let j = i + 1; j < allSkills.length; j++) {
      const left = allSkills[i]
      const right = allSkills[j]
      const similarity = skillLabNameSimilarity(left.nome, right.nome)
      if (similarity >= .78) similarPairs.push({ left, right, similarity })
    }
  }
  similarPairs.sort((a, b) => b.similarity - a.similarity)
  const similarIds = new Set(similarPairs.flatMap(pair => [String(pair.left.id), String(pair.right.id)]))
  const inconsistentEdges = allPrereqs.map(row => {
    const skill = allSkills.find(item => String(item.id) === String(row.skill_id))
    const requirement = allSkills.find(item => String(item.id) === String(row.richiede_skill_id))
    return { row, skill, requirement }
  }).filter(item => item.skill && item.requirement && Number(item.requirement.livello || 0) > Number(item.skill.livello || 0))

  const records = allSkills.map(skill => {
    const id = String(skill.id)
    const prerequisites = outgoing.get(id)?.length || 0
    const children = incoming.get(id)?.length || 0
    const assigned = progressStudents.get(id)?.size || 0
    const lessons = actualLessons.get(id)?.size || 0
    const planned = plannedLessons.get(id)?.size || 0
    const quality = skillLabDefinitionQuality(skill)
    const anomalies = []
    if (!prerequisites && !children) anomalies.push('isolata')
    if (cycleIds.has(id)) anomalies.push('ciclo')
    if (similarIds.has(id)) anomalies.push('nome simile')
    if (prerequisites + children >= 8) anomalies.push('molti collegamenti')
    if (inconsistentEdges.some(edge => String(edge.skill.id) === id || String(edge.requirement.id) === id)) anomalies.push('livelli incoerenti')
    return {
      skill, id, prerequisites, children, assigned, lessons, planned, quality, anomalies,
      unused: assigned === 0 && lessons === 0,
    }
  }).sort((a, b) => Number(a.skill.livello || 0) - Number(b.skill.livello || 0) || String(a.skill.nome).localeCompare(String(b.skill.nome), 'it', { sensitivity: 'base' }))

  return { records, outgoing, incoming, cycles, cycleIds, similarPairs, inconsistentEdges }
}

function skillLabKpi(value, label) {
  return `<div class="skill-lab-kpi"><strong>${value}</strong><span>${esc(label)}</span></div>`
}

function skillLabBadge(label, tone = '') {
  return `<span class="skill-lab-badge ${tone}">${esc(label)}</span>`
}

function renderSkillLabBars(entries) {
  const max = Math.max(1, ...entries.map(([, value]) => value))
  return `<div class="skill-lab-bars">${entries.map(([label, value]) => `
    <div class="skill-lab-bar-row"><span>${esc(label)}</span><div class="skill-lab-bar-track"><span style="width:${Math.round(value / max * 100)}%"></span></div><strong>${value}</strong></div>`).join('')}</div>`
}

function skillLabRecordButton(record, extra = '') {
  const usage = record.lessons ? `${record.lessons} lezioni` : record.assigned ? `${record.assigned} allievi` : 'mai usata'
  return `<button type="button" class="skill-lab-item" onclick="openSkillDetailModal(${jsArg(record.skill.id)})">
    <span class="skill-lab-item-main"><strong>${esc(record.skill.nome)}</strong><span class="skill-lab-meta">${esc(skillBranchName(record.skill.ramo))} · Lv.${esc(record.skill.livello || '—')} · ${esc(usage)}${extra ? ` · ${esc(extra)}` : ''}</span></span>
    <span class="skill-lab-badges">${skillLabBadge(`${record.quality.score}%`, record.quality.score >= 80 ? 'good' : record.quality.score < 50 ? 'bad' : 'warn')}${record.anomalies.slice(0, 2).map(label => skillLabBadge(label, 'warn')).join('')}</span>
  </button>`
}

function renderSkillLabOverview(analysis) {
  const { records } = analysis
  const branchCounts = new Map()
  const levelCounts = new Map()
  records.forEach(record => {
    const branch = skillBranchName(record.skill.ramo) || 'Senza ramo'
    const level = `Livello ${record.skill.livello || '—'}`
    branchCounts.set(branch, (branchCounts.get(branch) || 0) + 1)
    levelCounts.set(level, (levelCounts.get(level) || 0) + 1)
  })
  const critical = records.filter(record => record.quality.score < 50).sort((a, b) => a.quality.score - b.quality.score).slice(0, 7)
  const unused = records.filter(record => record.unused).sort((a, b) => a.quality.score - b.quality.score).slice(0, 7)
  return `
    <div class="skill-lab-kpis">
      ${skillLabKpi(records.length, 'Skill catalogo')}
      ${skillLabKpi(records.filter(record => record.unused).length, 'Mai assegnate né usate')}
      ${skillLabKpi(records.filter(record => record.quality.score < 70).length, 'Documentazione incompleta')}
      ${skillLabKpi(records.filter(record => record.anomalies.includes('isolata')).length, 'Skill isolate')}
      ${skillLabKpi(analysis.cycles.length, 'Cicli nel grafo')}
      ${skillLabKpi(analysis.similarPairs.length, 'Nomi simili sospetti')}
    </div>
    <div class="skill-lab-grid">
      <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Distribuzione per ramo</h3><span>${branchCounts.size} rami</span></div>${renderSkillLabBars([...branchCounts.entries()].sort((a, b) => b[1] - a[1]))}</section>
      <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Distribuzione per livello</h3><span>struttura attuale</span></div>${renderSkillLabBars([...levelCounts.entries()].sort((a, b) => Number(a[0].replace(/\D/g, '')) - Number(b[0].replace(/\D/g, ''))))}</section>
      <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Priorità documentazione</h3><span>completezza sotto il 50%</span></div><div class="skill-lab-list">${critical.length ? critical.map(record => skillLabRecordButton(record, record.quality.missing.join(', '))).join('') : '<div class="empty">Nessuna criticità grave.</div>'}</div></section>
      <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Candidati alla pulizia</h3><span>nessun uso reale rilevato</span></div><div class="skill-lab-list">${unused.length ? unused.map(record => skillLabRecordButton(record, `${record.prerequisites} prereq · ${record.children} figli`)).join('') : '<div class="empty">Tutte le skill risultano utilizzate.</div>'}</div></section>
    </div>`
}

function skillLabFilteredRecords(analysis) {
  const query = normalizeText(skillLabFilters.query)
  return analysis.records.filter(record => {
    if (query && !normalizeText(`${record.skill.nome} ${record.skill.descrizione || ''} ${record.skill.ramo || ''}`).includes(query)) return false
    if (skillLabFilters.branch && skillBranchName(record.skill.ramo) !== skillLabFilters.branch) return false
    if (skillLabFilters.usage === 'unused' && !record.unused) return false
    if (skillLabFilters.usage === 'never-assigned' && record.assigned > 0) return false
    if (skillLabFilters.usage === 'never-lessons' && record.lessons > 0) return false
    if (skillLabFilters.usage === 'used' && record.lessons === 0 && record.assigned === 0) return false
    if (skillLabFilters.quality === 'critical' && record.quality.score >= 50) return false
    if (skillLabFilters.quality === 'incomplete' && (record.quality.score < 50 || record.quality.score >= 80)) return false
    if (skillLabFilters.quality === 'good' && record.quality.score < 80) return false
    if (skillLabFilters.quality === 'anomaly' && !record.anomalies.length) return false
    return true
  })
}

function setSkillLabFilter(key, value) {
  skillLabFilters[key] = value
  renderSkillLab()
  if (key === 'query') {
    requestAnimationFrame(() => {
      const input = document.getElementById('skill-lab-query')
      if (!input) return
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    })
  }
}

function setSkillLabPreset(preset) {
  skillLabFilters = { query: '', branch: '', usage: '', quality: '' }
  if (preset === 'unused') skillLabFilters.usage = 'unused'
  if (preset === 'critical') skillLabFilters.quality = 'critical'
  if (preset === 'anomaly') skillLabFilters.quality = 'anomaly'
  renderSkillLab()
}

function renderSkillLabInventory(analysis) {
  const branches = [...new Set(analysis.records.map(record => skillBranchName(record.skill.ramo)))].sort((a, b) => a.localeCompare(b, 'it'))
  const records = skillLabFilteredRecords(analysis)
  return `
    <div class="skill-lab-filters">
      <input id="skill-lab-query" aria-label="Cerca skill" placeholder="Cerca nome, descrizione o ramo…" value="${esc(skillLabFilters.query)}" oninput="setSkillLabFilter('query',this.value)">
      <select aria-label="Filtra ramo" onchange="setSkillLabFilter('branch',this.value)"><option value="">Tutti i rami</option>${branches.map(branch => `<option value="${esc(branch)}"${skillLabFilters.branch === branch ? ' selected' : ''}>${esc(branch)}</option>`).join('')}</select>
      <select aria-label="Filtra utilizzo" onchange="setSkillLabFilter('usage',this.value)"><option value="">Qualsiasi utilizzo</option><option value="unused"${skillLabFilters.usage === 'unused' ? ' selected' : ''}>Mai assegnate né usate</option><option value="never-assigned"${skillLabFilters.usage === 'never-assigned' ? ' selected' : ''}>Mai assegnate</option><option value="never-lessons"${skillLabFilters.usage === 'never-lessons' ? ' selected' : ''}>Mai in lezione</option><option value="used"${skillLabFilters.usage === 'used' ? ' selected' : ''}>Utilizzate</option></select>
      <select aria-label="Filtra qualità" onchange="setSkillLabFilter('quality',this.value)"><option value="">Qualsiasi qualità</option><option value="critical"${skillLabFilters.quality === 'critical' ? ' selected' : ''}>Critica (&lt;50%)</option><option value="incomplete"${skillLabFilters.quality === 'incomplete' ? ' selected' : ''}>Incompleta (50–79%)</option><option value="good"${skillLabFilters.quality === 'good' ? ' selected' : ''}>Buona (80%+)</option><option value="anomaly"${skillLabFilters.quality === 'anomaly' ? ' selected' : ''}>Con anomalie</option></select>
    </div>
    <div class="skill-lab-presets"><button class="btn btn-outline btn-sm" onclick="setSkillLabPreset('unused')">Inutilizzate</button><button class="btn btn-outline btn-sm" onclick="setSkillLabPreset('critical')">Qualità critica</button><button class="btn btn-outline btn-sm" onclick="setSkillLabPreset('anomaly')">Con anomalie</button><button class="btn btn-outline btn-sm" onclick="setSkillLabPreset('reset')">Azzera filtri</button></div>
    <div class="skill-lab-section-title"><h3>${records.length} skill</h3><span>clicca il nome per aprire la scheda</span></div>
    <div class="skill-lab-results">${records.length ? records.map(record => `
      <article class="skill-lab-result">
        <div><button class="skill-lab-result-action" onclick="openSkillDetailModal(${jsArg(record.skill.id)})"><strong>${esc(record.skill.nome)}</strong><span class="skill-lab-meta">${esc(skillBranchName(record.skill.ramo))} · Lv.${esc(record.skill.livello || '—')}</span></button></div>
        <div><span class="skill-lab-result-label">Uso</span><span class="skill-lab-result-value">${record.lessons} lez. · ${record.assigned} all.</span></div>
        <div><span class="skill-lab-result-label">Grafo</span><span class="skill-lab-result-value">${record.prerequisites} prereq · ${record.children} figli</span></div>
        <div><span class="skill-lab-result-label">Qualità</span>${skillLabBadge(`${record.quality.score}%`, record.quality.score >= 80 ? 'good' : record.quality.score < 50 ? 'bad' : 'warn')}</div>
        <div><span class="skill-lab-result-label">Segnali</span><span class="skill-lab-result-value">${record.anomalies.length ? esc(record.anomalies.join(', ')) : '—'}</span></div>
      </article>`).join('') : '<div class="empty">Nessuna skill corrisponde ai filtri.</div>'}</div>`
}

function renderSkillLabQuality(analysis) {
  const records = [...analysis.records].sort((a, b) => a.quality.score - b.quality.score || String(a.skill.nome).localeCompare(String(b.skill.nome), 'it'))
  const missingCounts = new Map()
  records.forEach(record => record.quality.missing.forEach(label => missingCounts.set(label, (missingCounts.get(label) || 0) + 1)))
  const groups = [
    ['Critica', records.filter(record => record.quality.score < 50), 'bad'],
    ['Da completare', records.filter(record => record.quality.score >= 50 && record.quality.score < 80), 'warn'],
    ['Buona', records.filter(record => record.quality.score >= 80), 'good'],
  ]
  return `<div class="skill-lab-grid">
    <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Campi mancanti</h3><span>conteggio sul catalogo</span></div>${renderSkillLabBars([...missingCounts.entries()].sort((a, b) => b[1] - a[1]))}</section>
    <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Criterio provvisorio</h3><span>0–100%</span></div><p class="tuning-context">Livello 10, ramo 10, descrizione 15, scheda definizione 10, “cosa fa” 20, “come si fa” 20, prerequisiti 10, metadati 5. Il modello definitivo aggiungerà esercizi, errori comuni, media e revisione editoriale.</p></section>
  </div>${groups.map(([label, rows, tone]) => `<section><div class="skill-lab-section-title"><h3>${esc(label)}</h3><span>${rows.length} skill</span></div><div class="skill-lab-results">${rows.map(record => `<article class="skill-lab-result"><div><button class="skill-lab-result-action" onclick="openSkillDetailModal(${jsArg(record.skill.id)})"><strong>${esc(record.skill.nome)}</strong><span class="skill-lab-meta">${esc(skillBranchName(record.skill.ramo))} · Lv.${esc(record.skill.livello || '—')}</span></button></div><div>${skillLabBadge(`${record.quality.score}%`, tone)}</div><div style="grid-column:span 3"><span class="skill-lab-result-label">Manca</span><span class="skill-lab-result-value">${record.quality.missing.length ? esc(record.quality.missing.join(', ')) : 'Nessun campo essenziale'}</span></div></article>`).join('')}</div></section>`).join('')}`
}

function renderSkillLabAnomalies(analysis) {
  const recordById = new Map(analysis.records.map(record => [record.id, record]))
  const isolated = analysis.records.filter(record => record.anomalies.includes('isolata'))
  const hubs = analysis.records.filter(record => record.anomalies.includes('molti collegamenti')).sort((a, b) => (b.prerequisites + b.children) - (a.prerequisites + a.children))
  return `<div class="skill-lab-kpis">${skillLabKpi(analysis.cycles.length, 'Cicli')}${skillLabKpi(analysis.inconsistentEdges.length, 'Prerequisiti di livello superiore')}${skillLabKpi(isolated.length, 'Isolate')}${skillLabKpi(hubs.length, 'Molti collegamenti')}${skillLabKpi(analysis.similarPairs.length, 'Coppie di nomi simili')}</div>
    <div class="skill-lab-grid">
      <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Prerequisiti circolari</h3><span>da risolvere prima di automatizzare</span></div><div class="skill-lab-list">${analysis.cycles.length ? analysis.cycles.map(cycle => `<div class="skill-lab-item"><span class="skill-lab-item-main"><strong>${cycle.map(id => recordById.get(id)?.skill.nome || id).join(' → ')} → ${recordById.get(cycle[0])?.skill.nome || cycle[0]}</strong><span class="skill-lab-meta">Il percorso torna al punto di partenza.</span></span>${skillLabBadge('ciclo', 'bad')}</div>`).join('') : '<div class="empty">Nessun ciclo rilevato.</div>'}</div></section>
      <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Livelli incoerenti</h3><span>prerequisito più avanzato della skill</span></div><div class="skill-lab-list">${analysis.inconsistentEdges.length ? analysis.inconsistentEdges.slice(0, 20).map(edge => `<div class="skill-lab-item"><span class="skill-lab-item-main"><strong>${esc(edge.skill.nome)} richiede ${esc(edge.requirement.nome)}</strong><span class="skill-lab-meta">Lv.${edge.skill.livello} richiede Lv.${edge.requirement.livello}</span></span>${skillLabBadge('verificare', 'warn')}</div>`).join('') : '<div class="empty">Nessuna incoerenza di livello rilevata.</div>'}</div></section>
      <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Skill isolate</h3><span>senza prerequisiti né figli</span></div><div class="skill-lab-list">${isolated.length ? isolated.map(record => skillLabRecordButton(record)).join('') : '<div class="empty">Nessuna skill isolata.</div>'}</div></section>
      <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Nomi simili</h3><span>suggerimenti, non duplicati certi</span></div><div class="skill-lab-list">${analysis.similarPairs.length ? analysis.similarPairs.slice(0, 20).map(pair => `<div class="skill-lab-item"><span class="skill-lab-item-main"><strong>${esc(pair.left.nome)} / ${esc(pair.right.nome)}</strong><span class="skill-lab-meta">Somiglianza ${Math.round(pair.similarity * 100)}%</span></span>${skillLabBadge('confrontare', 'warn')}</div>`).join('') : '<div class="empty">Nessun nome molto simile.</div>'}</div></section>
      <section class="skill-lab-panel"><div class="skill-lab-panel-head"><h3>Nodi molto collegati</h3><span>soglia provvisoria: 8</span></div><div class="skill-lab-list">${hubs.length ? hubs.map(record => skillLabRecordButton(record, `${record.prerequisites + record.children} collegamenti`)).join('') : '<div class="empty">Nessun nodo supera la soglia.</div>'}</div></section>
    </div>`
}

function renderSkillLabGuided() {
  return `<div class="tuning-top"><div class="tuning-modes"><button class="chip" id="tune-mode-parametri" onclick="setTuningMode('parametri')" type="button">Parametri</button><button class="chip" id="tune-mode-requisiti" onclick="setTuningMode('requisiti')" type="button">Requisiti</button><button class="chip" id="tune-mode-progressione" onclick="setTuningMode('progressione')" type="button">Progressione</button><button class="chip" id="tune-mode-livelli" onclick="setTuningMode('livelli')" type="button">Livelli</button></div><select id="tune-scope" onchange="nextTuningCard()" style="max-width:220px"><option value="">Tutti i rami</option>${['Equilibrio','Andatura','Frenata','Rotazione','Air','Extra'].map(branch => `<option value="${branch}">${branch}</option>`).join('')}</select></div><div class="tuning-card" id="tuning-card"><div class="loading">Caricamento scheda…</div></div><div class="tuning-stats" id="tuning-stats"></div>`
}

function renderSkillLab() {
  const el = document.getElementById('skill-lab-content')
  if (!el) return
  ;['overview', 'inventory', 'quality', 'anomalies', 'guided'].forEach(name => document.getElementById(`skill-lab-tab-${name}`)?.classList.toggle('chip-on', name === skillLabView))
  if (skillLabLoading && !skillLabLoaded) {
    el.innerHTML = '<div class="loading">Analisi dello Skill Tree e degli utilizzi reali…</div>'
    return
  }
  if (skillLabView === 'guided') {
    el.innerHTML = renderSkillLabGuided()
    setTuningMode(tuningMode, true)
    renderTuningStats()
    return
  }
  const analysis = buildSkillLabAnalysis()
  if (skillLabView === 'inventory') el.innerHTML = renderSkillLabInventory(analysis)
  else if (skillLabView === 'quality') el.innerHTML = renderSkillLabQuality(analysis)
  else if (skillLabView === 'anomalies') el.innerHTML = renderSkillLabAnomalies(analysis)
  else el.innerHTML = renderSkillLabOverview(analysis)
}

function setTuningMode(mode, keepCard = false) {
  tuningMode = mode
  ;['parametri','requisiti','progressione','livelli'].forEach(m => {
    document.getElementById(`tune-mode-${m}`)?.classList.toggle('chip-on', m === mode)
  })
  if (!keepCard) nextTuningCard()
  else if (!tuningCard) nextTuningCard()
}

function tuningSkills() {
  const scope = document.getElementById('tune-scope')?.value || ''
  return (allSkills || [])
    .filter(s => !scope || skillBranchName(s.ramo) === scope)
    .sort((a, b) => (a.livello - b.livello) || String(a.nome).localeCompare(String(b.nome)))
}

function pickTuningSkill() {
  const list = tuningSkills()
  if (!list.length) return null
  const fresh = list.filter(s => !tuningRecentSkillIds.includes(s.id))
  const pool = fresh.length ? fresh : list
  return pool[Math.floor(Math.random() * pool.length)]
}

function rememberTuningCard(card = tuningCard) {
  if (!card?.skill?.id) return
  tuningRecentSkillIds.push(card.skill.id)
  if (card.refSkill?.id) tuningRecentSkillIds.push(card.refSkill.id)
  tuningRecentSkillIds = [...new Set(tuningRecentSkillIds)].slice(-12)
}

function skillById(id) {
  return allSkills.find(s => s.id === id) || null
}

function shortSkillMeta(skill) {
  if (!skill) return ''
  return `${skillBranchName(skill.ramo)} · Lv.${skill.livello}`
}

function getRequirementContext(skill) {
  const sameRamo = allSkills
    .filter(s => (s.ramo || 'Altro') === (skill.ramo || 'Altro') && s.id !== skill.id)
    .sort((a, b) => (a.livello - b.livello) || String(a.nome).localeCompare(String(b.nome)))

  const prev = sameRamo.filter(s => s.livello <= skill.livello).slice(-3)
  const next = sameRamo.filter(s => s.livello >= skill.livello).slice(0, 3)
  const peers = allSkills
    .filter(s => s.id !== skill.id && s.livello === skill.livello && (s.ramo || 'Altro') !== (skill.ramo || 'Altro'))
    .sort((a, b) => String(a.ramo || '').localeCompare(String(b.ramo || '')) || String(a.nome).localeCompare(String(b.nome)))
    .slice(0, 6)

  const requires = allPrereqs
    .filter(p => p.skill_id === skill.id)
    .map(p => ({ ...p, skill: skillById(p.richiede_skill_id) }))
    .filter(p => p.skill)
    .sort((a, b) => (a.skill.livello - b.skill.livello) || String(a.skill.nome).localeCompare(String(b.skill.nome)))

  const unlocks = allPrereqs
    .filter(p => p.richiede_skill_id === skill.id)
    .map(p => ({ ...p, skill: skillById(p.skill_id) }))
    .filter(p => p.skill)
    .sort((a, b) => (a.skill.livello - b.skill.livello) || String(a.skill.nome).localeCompare(String(b.skill.nome)))

  return { requires, unlocks, prev, next, peers }
}

function declaredParamSnapshot(skill) {
  const aliases = {
    verticalizzazione: ['param_verticalizzazione', 'verticalizzazione', 'attr_verticalizzazione', 'baricentro', 'attr_baricentro'],
    forze: ['param_forze', 'forze', 'attr_forze'],
    rotazione: ['param_rotazione', 'rotazione', 'attr_rotazione', 'assi', 'attr_assi'],
    tempo: ['param_tempo', 'tempo', 'attr_tempo'],
    stabilita: ['param_stabilita', 'stabilita', 'stabilità', 'attr_stabilita', 'attr_stabilità'],
    asimmetria: ['param_asimmetria', 'asimmetria', 'attr_asimmetria'],
    coordinazione: ['param_coordinazione', 'coordinazione', 'attr_coordinazione'],
    difficolta: ['param_difficolta', 'difficolta', 'difficoltà', 'attr_difficolta', 'attr_difficoltà']
  }

  return TUNING_PARAMS.map(param => {
    const key = aliases[param.key]?.find(k => skill[k] !== undefined && skill[k] !== null && skill[k] !== '')
    const value = key ? skill[key] : 'Non dichiarato'
    return [param.label, value, param.key, !!key]
  })
}

function nextTuningCard() {
  const el = document.getElementById('tuning-card')
  const skills = tuningSkills()
  if (!skills.length) {
    tuningCard = null
    el.innerHTML = '<div class="empty">Nessuna skill in questo filtro.</div>'
    renderTuningStats()
    return
  }

  rememberTuningCard()
  if (tuningMode === 'parametri') tuningCard = buildParamCard()
  if (tuningMode === 'requisiti') tuningCard = buildRequirementCard()
  if (tuningMode === 'progressione') tuningCard = buildProgressionCard()
  if (tuningMode === 'livelli') tuningCard = buildLevelCard()
  renderTuningCard()
}

function buildParamCard() {
  const skill = pickTuningSkill()
  const param = TUNING_PARAMS[Math.floor(Math.random() * TUNING_PARAMS.length)]
  return {
    tipo: 'parametri',
    skill,
    parametro: param.key,
    paramKey: param.key,
    scale: param.scale,
    paramSnapshot: declaredParamSnapshot(skill),
    title: `Quanto vale ${param.label} per "${skill.nome}"?`,
    context: `${skill.ramo || 'Neutra'} · livello ${skill.livello} · ${skill.blocco}. ${param.hint}`,
    value: null,
    outcome: '',
    note: ''
  }
}

function buildRequirementCard() {
  const skill = pickTuningSkill()
  const reqContext = getRequirementContext(skill)
  return {
    tipo: 'requisiti',
    skill,
    reqContext,
    title: `"${skill.nome}" ha prerequisiti corretti e completi?`,
    context: 'Guarda cosa richiede, cosa sblocca e le skill vicine prima di decidere se manca un ponte o se il collegamento e corretto.',
    value: null,
    outcome: '',
    note: ''
  }
}

function buildProgressionCard() {
  const skills = tuningSkills()
  const ordered = skills.filter(s => s.ramo).sort((a, b) => (a.ramo || '').localeCompare(b.ramo || '') || a.livello - b.livello)
  const base = ordered.length > 1 ? ordered : skills
  const i = Math.max(0, Math.floor(Math.random() * Math.max(1, base.length - 1)))
  const a = base[i]
  const b = base[i + 1] || base[0]
  return {
    tipo: 'progressione',
    skill: a,
    refSkill: b,
    title: `L'ordine "${a.nome}" -> "${b.nome}" funziona?`,
    context: `${a.ramo || 'Neutra'} · livelli ${a.livello} e ${b.livello}. La freccia indica una progressione diretta proposta: ${a.nome} prima di ${b.nome}.`,
    value: null,
    outcome: '',
    note: ''
  }
}

function buildLevelCard() {
  const skill = pickTuningSkill()
  const levelContext = getRequirementContext(skill)
  return {
    tipo: 'livelli',
    skill,
    levelContext,
    title: `Il livello ${skill.livello} di "${skill.nome}" e corretto?`,
    context: `${skill.ramo || 'Neutra'} · ${skill.blocco}. Alza = spostarla a un livello piu alto; Abbassa = anticiparla a un livello piu basso.`,
    value: null,
    outcome: '',
    note: ''
  }
}

function tuningChoicesFor(card) {
  if (card.tipo === 'progressione') {
    return [
      ['ok', 'Si, diretto'],
      ['ok-bridge', 'Si, ma serve bridge'],
      ['no', 'No'],
      ['contrario', 'Contrario'],
      ['contrario-bridge', 'Contrario con bridge'],
      ['non-collegare', 'Non collegare'],
      ['non-so', 'Non so']
    ]
  }
  if (card.tipo === 'livelli') {
    return [
      ['ok', 'Ok'],
      ['alza', 'Alza'],
      ['abbassa', 'Abbassa']
    ]
  }
  if (card.tipo === 'requisiti') {
    return [
      ['ok', 'Va bene'],
      ['rivedere', 'Da rivedere'],
      ['manca-bridge', 'Manca bridge'],
      ['contrario', 'Contrario'],
      ['contrario-bridge', 'Contrario con bridge'],
      ['non-collegare', 'Non collegare'],
      ['non-so', 'Non so']
    ]
  }
  return [
    ['ok', 'Va bene'],
    ['rivedere', 'Da rivedere'],
    ['manca-bridge', 'Manca bridge'],
    ['non-so', 'Non so']
  ]
}

function renderTuningCard() {
  const el = document.getElementById('tuning-card')
  const card = tuningCard
  if (!card) return
  const progress = Math.min(100, tuningCount * 10)
  const body = card.tipo === 'parametri'
    ? `<div class="rating-5">${[1,2,3,4,5].map(v => `
        <button class="btn btn-outline${card.value === v ? ' active' : ''}" onclick="setTuningValue(${v})">
          <span class="rating-num">${v}</span>
          <span class="rating-caption">${esc(card.scale?.[v - 1] || '')}</span>
        </button>`).join('')}</div>`
    : `<div class="choice-grid${card.tipo === 'progressione' ? ' choice-grid-progressione' : ''}">
        ${tuningChoicesFor(card).map(([v, label]) => `<button class="btn btn-outline${card.outcome === v ? ' active' : ''}" onclick="setTuningOutcome('${v}')">${label}</button>`).join('')}
      </div>`
  const requirementContext = card.tipo === 'requisiti' ? renderRequirementContext(card.reqContext) : ''
  const levelContext = card.tipo === 'livelli' ? renderLevelContext(card.levelContext) : ''
  const paramContext = card.tipo === 'parametri' ? renderParamSnapshot(card.paramSnapshot, card.paramKey) : ''

  el.innerHTML = `
    <div class="tuning-progress">
      <div class="tuning-bar"><span style="width:${progress}%"></span></div>
      <span>${tuningCount}/10</span>
    </div>
    <div id="tune-status" class="msg" style="display:none;margin-bottom:.65rem"></div>
    <div class="tuning-kicker"><span>${card.tipo}</span><span>·</span><span>${esc(skillBranchName(card.skill?.ramo))}</span></div>
    <h3 class="tuning-title">${esc(card.title)}</h3>
    <p class="tuning-context">${esc(card.context)} Le risposte non chiudono la skill: potra tornare nei ripassi.</p>
    ${paramContext}
    ${requirementContext}
    ${levelContext}
    ${body}
    <div class="field" style="margin:0">
      <label>Nota rapida</label>
      <textarea id="tune-note" placeholder="Motivo, dubbio, prerequisito mancante, variante specifica..." oninput="tuningCard.note=this.value">${esc(card.note || '')}</textarea>
    </div>
    <div class="tuning-actions">
      <button class="btn btn-primary" onclick="saveTuningAnswer()">Salva risposta</button>
      <button class="btn btn-outline" onclick="saveTuningAlert()">Salva avviso</button>
      <button class="btn btn-outline" onclick="nextTuningCard()">Salta</button>
    </div>`
  requestAnimationFrame(() => motion.cards(el))
}

function renderParamSnapshot(rows, currentParam) {
  if (!rows?.length) return ''
  return `
    <div class="req-box">
      <h4>8 parametri della skill</h4>
      <div class="param-snapshot">
        ${rows.map(([label, value, key, declared]) => `
          <div class="param-pill" style="${currentParam && key === currentParam ? 'border-color:var(--blu)' : ''};${!declared ? 'opacity:.62' : ''}">
            <span>${esc(label)}</span>
            <strong>${esc(value)}</strong>
          </div>`).join('')}
      </div>
    </div>`
}

function renderReqList(items, emptyText, withStage = false) {
  if (!items?.length) return `<p class="req-empty">${esc(emptyText)}</p>`
  return `<div class="req-list">${items.map(item => {
    const skill = item.skill || item
    const stage = withStage ? `Stadio ${item.stadio_minimo ?? '-'}` : shortSkillMeta(skill)
    return `<div class="req-item"><span>${esc(skill.nome)}</span><span>${esc(stage)}</span></div>`
  }).join('')}</div>`
}

function renderRequirementContext(ctx) {
  if (!ctx) return ''
  return `
    <div class="req-context">
      <div class="req-context-grid">
        <div class="req-box">
          <h4>Prerequisiti attuali</h4>
          ${renderReqList(ctx.requires, 'Nessun prerequisito esplicito nel grafo.', true)}
        </div>
        <div class="req-box">
          <h4>Sblocca / serve a</h4>
          ${renderReqList(ctx.unlocks, 'Nessuna skill dipendente registrata.', true)}
        </div>
      </div>
      <div class="req-context-grid">
        <div class="req-box">
          <h4>Prima nello stesso ramo</h4>
          ${renderReqList(ctx.prev, 'Nessuna skill precedente nello stesso ramo.')}
        </div>
        <div class="req-box">
          <h4>Dopo nello stesso ramo</h4>
          ${renderReqList(ctx.next, 'Nessuna skill successiva nello stesso ramo.')}
        </div>
        <div class="req-box">
          <h4>Stesso livello altrove</h4>
          ${renderReqList(ctx.peers, 'Nessuna skill pari livello in altri rami.')}
        </div>
      </div>
    </div>`
}

function renderLevelContext(ctx) {
  if (!ctx) return ''
  return `
    <div class="req-context">
      <div class="req-context-grid">
        <div class="req-box">
          <h4>Prima nello stesso ramo</h4>
          ${renderReqList(ctx.prev, 'Nessuna skill precedente nello stesso ramo.')}
        </div>
        <div class="req-box">
          <h4>Dopo nello stesso ramo</h4>
          ${renderReqList(ctx.next, 'Nessuna skill successiva nello stesso ramo.')}
        </div>
        <div class="req-box">
          <h4>Stesso livello altrove</h4>
          ${renderReqList(ctx.peers, 'Nessuna skill pari livello in altri rami.')}
        </div>
      </div>
    </div>`
}

function setTuningValue(value) {
  tuningCard.value = value
  renderTuningCard()
}

function setTuningOutcome(value) {
  tuningCard.outcome = value
  renderTuningCard()
}

function setTuneStatus(text, kind = '') {
  const el = document.getElementById('tune-status')
  if (!el) return
  el.className = `msg ${kind}`.trim()
  el.style.display = text ? 'block' : 'none'
  el.textContent = text || ''
}

function buildTuningPayload({ avviso = false } = {}) {
  if (!tuningCard) return null
  return {
    tipo: tuningCard.tipo,
    skill_id: tuningCard.skill?.id || null,
    skill_ref_id: tuningCard.refSkill?.id || null,
    variante: tuningCard.skill?.nome || null,
    parametro: tuningCard.parametro || null,
    valore: avviso ? null : (tuningCard.value || null),
    esito: avviso ? 'avviso' : (tuningCard.outcome || null),
    note: tuningCard.note || null,
    maestro_id: currentUid,
    payload: {
      avviso,
      stato_tuning: avviso ? 'avviso_da_revisionare' : 'risposta_da_rivedere_in_futuro',
      skill_nome: tuningCard.skill?.nome,
      skill_ref_nome: tuningCard.refSkill?.nome,
      ramo: tuningCard.skill?.ramo || null,
      livello: tuningCard.skill?.livello || null,
      blocco: tuningCard.skill?.blocco || null,
      valori_skill_correnti: tuningCard.paramSnapshot ? Object.fromEntries(tuningCard.paramSnapshot) : null,
      verifica_livello: tuningCard.tipo === 'livelli' ? {
        livello_corrente: tuningCard.skill?.livello || null,
        blocco_corrente: tuningCard.skill?.blocco || null,
        esito: tuningCard.outcome || null
      } : null,
      progressione_proposta: tuningCard.tipo === 'progressione' ? {
        prima_id: tuningCard.skill?.id || null,
        prima_nome: tuningCard.skill?.nome || null,
        dopo_id: tuningCard.refSkill?.id || null,
        dopo_nome: tuningCard.refSkill?.nome || null,
        interpretazione_esito: tuningCard.outcome || null
      } : null,
      prerequisiti_correnti: tuningCard.reqContext?.requires?.map(r => ({
        id: r.richiede_skill_id,
        nome: r.skill?.nome,
        stadio_minimo: r.stadio_minimo
      })),
      sblocca_correnti: tuningCard.reqContext?.unlocks?.map(r => ({
        id: r.skill_id,
        nome: r.skill?.nome,
        stadio_minimo: r.stadio_minimo
      }))
    }
  }
}

async function persistTuningPayload(payload) {
  const { error } = await sb.from('tuning_risposte').insert(payload)
  if (error) {
    const localPayload = { ...payload, creato_il: new Date().toISOString(), errore_remoto: error.message }
    tuningLocal.push(localPayload)
    safeStorage.setItem('tuningLocal', JSON.stringify(tuningLocal))
  }
  return error
}

async function saveTuningAnswer() {
  if (!tuningCard) return
  const missing = tuningCard.tipo === 'parametri' ? !tuningCard.value : !tuningCard.outcome
  if (missing) {
    setTuneStatus('Scegli una risposta prima di salvare, oppure usa Salva avviso per registrare solo la nota.', 'msg-info')
    return
  }

  await persistTuningPayload(buildTuningPayload())

  tuningCount += 1
  renderTuningStats()
  nextTuningCard()
}

async function saveTuningAlert() {
  if (!tuningCard) return
  tuningCard.note = document.getElementById('tune-note')?.value?.trim() || tuningCard.note || ''
  if (!tuningCard.note) {
    setTuneStatus('Scrivi una nota prima di creare un avviso.', 'msg-info')
    return
  }

  await persistTuningPayload(buildTuningPayload({ avviso: true }))

  tuningAlertCount += 1
  safeStorage.setItem('tuningAlertCount', String(tuningAlertCount))
  renderTuningStats()
  nextTuningCard()
}

function resetTuningSession() {
  tuningCount = 0
  nextTuningCard()
  renderTuningStats()
}

function renderTuningStats() {
  const el = document.getElementById('tuning-stats')
  if (!el) return
  el.innerHTML = `
    <div class="stat-tile"><strong>${tuningCount}</strong><span>Sessione</span></div>
    <div class="stat-tile"><strong>${tuningAlertCount}</strong><span>Avvisi</span></div>
    <div class="stat-tile"><strong>${tuningLocal.length}</strong><span>Fallback locale</span></div>
    <div class="stat-tile"><strong>${allSkills.length}</strong><span>Skill catalogo</span></div>`
}

async function importSkilltreeCatalog(btn) {
  const status = document.getElementById('tuning-import-status')
  const setStatus = (text, kind = '') => {
    if (!status) return
    status.className = `msg ${kind}`.trim()
    status.style.display = text ? 'block' : 'none'
    status.textContent = text || ''
  }
  const nodes = window.SKILLTREE_NODES || []
  if (!nodes.length) {
    setStatus('Catalogo locale non trovato.', 'msg-err')
    return
  }

  const branchMap = { stance: 'Equilibrio', gait: 'Andatura', break: 'Frenata', rotation: 'Rotazione', air: 'Air' }
  const bloccoFor = level => level <= 3 ? 'Base' : level <= 5 ? 'Intermedio' : level <= 7 ? 'Avanzato' : 'Master'
  const isBilat = node => /dx\/sx|entrambi|bilaterale|switch naturale|senso orario\/antiorario/i.test((node.variants || []).join(', '))
  const descFor = node => [node.note, node.variants?.length ? 'Varianti: ' + node.variants.join(', ') + '.' : ''].filter(Boolean).join(' ') || null

  const oldText = btn?.textContent
  if (btn) { btn.disabled = true; btn.textContent = 'Importo...' }
  setStatus(`Import in corso: ${nodes.length} skill dal catalogo locale...`)

  try {
    const { data: existing, error: readError } = await sb.from('skills').select('id,nome')
    if (readError) throw readError

    const existingNames = new Set((existing || []).map(s => String(s.nome).toLowerCase()))
    const payload = nodes
      .filter(node => !existingNames.has(String(node.name).toLowerCase()))
      .map(node => {
        const bilat = isBilat(node)
        return {
          nome: node.name,
          descrizione: descFor(node),
          tipo: 'RAMO',
          ramo: branchMap[node.branch] || 'Equilibrio',
          livello: node.level,
          blocco: bloccoFor(node.level),
          open_closed: node.key ? 'CLOSED' : 'OPEN',
          obbligatoria: !!node.key,
          e_bilaterale: bilat,
          lato_sx_nome: bilat ? 'sx' : null,
          lato_dx_nome: bilat ? 'dx' : null
        }
      })

    if (payload.length) {
      const { error: insertError } = await sb.from('skills').insert(payload)
      if (insertError) throw insertError
    }

    const { data: freshSkills, error: freshError } = await sb.from('skills').select('*').order('livello')
    if (freshError) throw freshError
    const byName = new Map((freshSkills || []).map(s => [String(s.nome).toLowerCase(), s.id]))

    const edgePayload = []
    nodes.forEach(node => {
      const skillId = byName.get(String(node.name).toLowerCase())
      ;(node.prereq || []).forEach(reqName => {
        const reqId = byName.get(String(reqName).toLowerCase())
        if (skillId && reqId && skillId !== reqId) {
          edgePayload.push({ skill_id: skillId, richiede_skill_id: reqId, stadio_minimo: 2, note: 'Import skill tree metodologica' })
        }
      })
    })

    if (edgePayload.length) {
      const { error: edgeError } = await sb
        .from('prerequisiti_skill')
        .upsert(edgePayload, { onConflict: 'skill_id,richiede_skill_id', ignoreDuplicates: true })
      if (edgeError) throw edgeError
    }

    allSkills = freshSkills || []
    renderTuningStats()
    nextTuningCard()
    setStatus(`Catalogo caricato. Skill nuove: ${payload.length}. Prerequisiti elaborati: ${edgePayload.length}.`, 'msg-ok')
  } catch (e) {
    setStatus('Import non riuscito: ' + (e.message || e), 'msg-err')
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = oldText }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────

function formatDate(d) {
  if (!d) return '—'
  const [y, m, g] = d.slice(0,10).split('-')
  return `${g}/${m}/${y}`
}

function formatDateWithWeekday(d) {
  if (!d) return '—'
  const iso = String(d).slice(0, 10)
  const date = new Date(`${iso}T12:00:00`)
  const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
  return `${days[date.getDay()]} ${formatDate(iso)}`
}

function dateIsoToInput(d) {
  if (!d) return ''
  const match = String(d).slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return match ? `${match[3]}/${match[2]}/${match[1]}` : String(d)
}

function dateInputToIso(d) {
  if (!d) return ''
  const raw = String(d).trim()
  let match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (match) {
    const day = match[1].padStart(2, '0')
    const month = match[2].padStart(2, '0')
    return `${match[3]}-${month}-${day}`
  }
  match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return match ? raw : ''
}

function allievoEtaLabel(dataNascita) {
  const iso = dateInputToIso(dataNascita) || String(dataNascita || '').slice(0, 10)
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return ''
  const [y, m, d] = match.slice(1).map(Number)
  const nascita = new Date(y, m - 1, d)
  if (Number.isNaN(nascita.getTime()) || nascita.getFullYear() !== y || nascita.getMonth() !== m - 1 || nascita.getDate() !== d) return ''
  const oggi = new Date()
  if (nascita > oggi) return ''
  let anni = oggi.getFullYear() - y
  if (oggi.getMonth() < m - 1 || (oggi.getMonth() === m - 1 && oggi.getDate() < d)) anni--
  if (anni >= 2) return `${anni} anni`
  const mesi = Math.max(0, Math.floor((oggi - nascita) / (1000 * 60 * 60 * 24 * 30.44)))
  return `${mesi} mes${mesi === 1 ? 'e' : 'i'}`
}

function stadioLabel(s) {
  return ['Mai fatto','In lavorazione','Raffinamento','Completato'][s] ?? s
}

function tipoLabel(t) {
  return { individuale: 'Individuale', gruppo: 'Gruppo', campo_libero: 'Campo libero' }[t] ?? t
}

function normalizeText(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

function isFakieSkillName(name) {
  return /\bfakie\b/i.test(String(name || ''))
}

function visibleCatalogSkills(rows = []) {
  return (rows || []).filter(row => !isFakieSkillName(row?.nome || row?.skill_nome))
}

function editIcon() {
  return '<svg class="edit-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
}

function esc(s) {
  if (!s) return ''
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

// Enter su email e password
document.getElementById('login-email').addEventListener('keydown', e => { if (e.key === 'Enter') loginSubmit(e) })
document.getElementById('login-pw').addEventListener('keydown',    e => { if (e.key === 'Enter') loginSubmit(e) })
