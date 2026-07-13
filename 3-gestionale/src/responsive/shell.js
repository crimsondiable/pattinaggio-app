(function () {
  'use strict'

  const MOBILE_SHELL_QUERY = '(max-width: 760px)'
  const media = window.matchMedia(MOBILE_SHELL_QUERY)
  const areas = {
    home: {
      views: ['home'],
      tabs: [],
    },
    allievi: {
      views: ['allievi', 'scheda', 'gruppo', 'nuovo-allievo', 'nuovo-gruppo'],
      tabs: [],
    },
    lezioni: {
      views: ['lezioni', 'lezione', 'nuova-lezione', 'percorsi'],
      tabs: [
        { label: 'Lezioni', view: 'lezioni', matches: ['lezioni', 'lezione', 'nuova-lezione'] },
        { label: 'Percorsi', view: 'percorsi', matches: ['percorsi'] },
      ],
    },
    pianifica: {
      views: ['lesson-radial-planner', 'calendario', 'appuntamenti'],
      tabs: [
        { label: 'Planner', view: 'lesson-radial-planner', matches: ['lesson-radial-planner'] },
        { label: 'Calendario', view: 'calendario', matches: ['calendario'] },
        { label: 'Orari', view: 'appuntamenti', matches: ['appuntamenti'] },
      ],
    },
    skills: {
      views: ['skills', 'analisi'],
      tabs: [
        { label: 'Skills', view: 'skills', matches: ['skills'] },
        { label: 'Analisi', view: 'analisi', matches: ['analisi'] },
      ],
    },
    mappa: {
      views: ['mappa', 'location'],
      tabs: [],
    },
  }

  function syncLayoutClass() {
    document.documentElement.dataset.shell = media.matches ? 'mobile' : 'desktop'
  }

  function currentView() {
    const visible = document.querySelector('#screen-app main > section:not([hidden])')
    return visible?.id?.replace(/^view-/, '') || 'home'
  }

  function ensureSectionTabs() {
    const main = document.querySelector('#screen-app main')
    if (!main) return null
    let tabs = document.getElementById('mobile-section-tabs')
    if (!tabs) {
      tabs = document.createElement('div')
      tabs.id = 'mobile-section-tabs'
      tabs.className = 'mobile-section-tabs'
      tabs.setAttribute('aria-label', 'Sezioni correlate')
      main.prepend(tabs)
    }
    return tabs
  }

  function syncMobileNavigation() {
    const view = currentView()
    const areaName = Object.keys(areas).find(name => areas[name].views.includes(view)) || 'home'
    document.querySelectorAll('.mobile-primary-nav').forEach(button => {
      const active = button.dataset.mobileArea === areaName
      button.classList.toggle('active', active)
      if (active) button.setAttribute('aria-current', 'page')
      else button.removeAttribute('aria-current')
    })

    const tabs = ensureSectionTabs()
    if (!tabs) return
    const items = areas[areaName].tabs
    tabs.replaceChildren(...items.map(item => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = `mobile-section-tab${item.matches.includes(view) ? ' active' : ''}`
      button.textContent = item.label
      if (item.matches.includes(view)) button.setAttribute('aria-current', 'page')
      button.addEventListener('click', () => window.showView(item.view))
      return button
    }))
  }

  function revealActiveDestination() {
    syncMobileNavigation()
  }

  function sync() {
    syncLayoutClass()
    syncMobileNavigation()
  }

  if (typeof media.addEventListener === 'function') media.addEventListener('change', sync)
  else if (typeof media.addListener === 'function') media.addListener(sync)

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync, { once: true })
  else sync()

  window.ResponsiveShell = Object.freeze({
    query: MOBILE_SHELL_QUERY,
    isMobile: () => media.matches,
    sync,
    revealActiveDestination,
    syncMobileNavigation,
  })
})()
