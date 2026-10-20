import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'

const script = readFileSync(new URL('../src/lesson-time-input.js', import.meta.url), 'utf8')
function fixture() {
  function element() {
    return { value: '', hidden: true, children: [], events: [], attributes: {}, handlers: {},
      appendChild(child) { this.children.push(child) },
      addEventListener(name, callback) { this.handlers[name] = callback },
      setAttribute(name, value) { this.attributes[name] = value },
      dispatchEvent(event) { this.events.push(event.type) },
      focus() { this.focused = true }, contains(target) { return target === this },
    }
  }
  const ids = ['lz-ora', 'lz-ora-toggle', 'lz-ora-picker', 'lz-ora-hours', 'lz-ora-minutes', 'lz-ora-done']
  const nodes = Object.fromEntries(ids.map(id => [id, element()]))
  const doc = { ...element(), getElementById: id => nodes[id], createElement: element }
  const context = vm.createContext({ document: doc, Event: class { constructor(type) { this.type = type } }, window: {
    normalizeLessonTime(value) {
      if (value === '1430') return '14:30'
      return /^\d\d:\d\d$/.test(value) ? value : ''
    },
  } })
  vm.runInContext(script, context)
  return { nodes, doc }
}

test('picker offers all 24 hours and 60 minutes without AM/PM', () => {
  const { nodes: n } = fixture()
  assert.equal(n['lz-ora-hours'].children.length, 24)
  assert.equal(n['lz-ora-hours'].children[23].value, '23')
  assert.equal(n['lz-ora-minutes'].children.length, 60)
  assert.equal(n['lz-ora-minutes'].children[59].value, '59')
})
test('typed time initializes the picker; selections update the saved field and draft events', () => {
  const { nodes: n } = fixture()
  n['lz-ora'].value = '1430'
  n['lz-ora-toggle'].handlers.click()
  assert.equal(n['lz-ora'].value, '14:30')
  assert.equal(n['lz-ora-hours'].value, '14')
  assert.equal(n['lz-ora-minutes'].value, '30')
  n['lz-ora-hours'].value = '23'
  n['lz-ora-minutes'].value = '59'
  n['lz-ora-minutes'].handlers.change()
  assert.equal(n['lz-ora'].value, '23:59')
  assert.deepEqual(n['lz-ora'].events, ['input', 'change'])
  n['lz-ora-done'].handlers.click()
  assert.equal(n['lz-ora-picker'].hidden, true)
})
test('opening and dismissing an empty picker does not assign an hour', () => {
  const { nodes: n, doc } = fixture()
  n['lz-ora-toggle'].handlers.click()
  doc.handlers.keydown({ key: 'Escape' })
  assert.equal(n['lz-ora'].value, '')
  assert.equal(n['lz-ora-picker'].hidden, true)
})
