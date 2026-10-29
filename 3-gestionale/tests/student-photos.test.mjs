import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'
const source = readFileSync(new URL('../src/student-photos.js', import.meta.url), 'utf8')
function fixture(options = {}) {
  const requests = []
  const student = { id: 'A', nome: 'Anna', cognome: 'Test', foto_path: options.original ?? null, profilo: { unrelated: true } }
  const c = vm.createContext({ console, currentUid: 'teacher', allAllievi: [student], esc: String,
    sb: { storage: { from(bucket) { return {
      async upload(path, blob, settings) { requests.push({ type: 'upload', bucket, path, settings }); return options.uploadError ? { error: new Error('upload failed') } : {} },
      async remove(paths) { requests.push({ type: 'remove', paths }); return { error: options.cleanupError } }
    } } }, from(table) { return { update(payload) {
      const request = { type: 'update', table, payload, filters: [] }; requests.push(request)
      const query = { eq(k, v) { request.filters.push([k, v]); return query }, is(k, v) { request.filters.push([k, v]); return query }, select() { return query }, async single() {
        if (options.networkThrow) throw new Error('connection lost')
        return options.updateError ? { error: options.updateError } : { data: { id: 'A', ...payload } }
      } }; return query
    } } } }
  })
  vm.runInContext(source, c)
  return { c, requests, student, editor: { id: 'A', uid: 'teacher', original: options.original ?? null } }
}
test('crop stays inside landscape and portrait images at every slider extreme', () => {
  const { c } = fixture()
  for (const [w, h] of [[1600, 900], [900, 1600]]) for (const zoom of [1, 3]) for (const x of [-100, 100]) for (const y of [-100, 100]) {
    const crop = c.studentPhotoCrop(w, h, zoom, x, y)
    assert.ok(crop.x >= 0 && crop.y >= 0)
    assert.ok(crop.x + crop.side <= w && crop.y + crop.side <= h)
  }
})
test('first upload commits only the photo column with a null comparison', async () => {
  const f = fixture()
  const result = await f.c.persistStudentPhoto(f.editor, { size: 1000 })
  assert.match(result.path, /^A\/.+\.jpg$/)
  const update = f.requests.find(r => r.type === 'update')
  assert.deepEqual(Object.keys(update.payload), ['foto_path'])
  assert.equal(update.filters[1][0], 'foto_path'); assert.equal(update.filters[1][1], null)
  assert.equal(f.student.foto_path, result.path)
  assert.equal(f.student.profilo.unrelated, true)
})
test('replacement commits a unique file before deleting the previous one', async () => {
  const f = fixture({ original: 'A/old.jpg' })
  const result = await f.c.persistStudentPhoto(f.editor, { size: 1000 })
  assert.notEqual(result.path, 'A/old.jpg')
  assert.deepEqual(f.requests.map(r => r.type), ['upload', 'update', 'remove'])
  assert.equal(f.requests[1].filters[1][1], 'A/old.jpg')
  assert.equal(f.requests[2].paths[0], 'A/old.jpg')
})
test('failed upload preserves existing portrait and makes no database changes', async () => {
  const f = fixture({ original: 'A/old.jpg', uploadError: true })
  await assert.rejects(f.c.persistStudentPhoto(f.editor, { size: 1000 }), /upload failed/)
  assert.deepEqual(f.requests.map(r => r.type), ['upload'])
  assert.equal(f.student.foto_path, 'A/old.jpg')
})
test('concurrent replacement rejects and cleans only its newly uploaded file', async () => {
  const f = fixture({ original: 'A/old.jpg', updateError: { code: 'PGRST116' } })
  await assert.rejects(f.c.persistStudentPhoto(f.editor, { size: 1000 }), /modificata altrove/)
  assert.equal(f.requests[2].paths[0], f.requests[0].path)
  assert.equal(f.student.foto_path, 'A/old.jpg')
})
test('ambiguous network failure never deletes a potentially committed photo', async () => {
  const f = fixture({ original: 'A/old.jpg', networkThrow: true })
  await assert.rejects(f.c.persistStudentPhoto(f.editor, { size: 1000 }), /connection lost/)
  assert.deepEqual(f.requests.map(r => r.type), ['upload', 'update'])
})
test('removal clears reference before cleanup and reports a cleanup failure', async () => {
  const f = fixture({ original: 'A/old.jpg', cleanupError: { message: 'offline' } })
  const result = await f.c.persistStudentPhoto(f.editor, null)
  assert.equal(f.student.foto_path, null)
  assert.equal(result.cleanupFailed, true)
  assert.deepEqual(f.requests.map(r => r.type), ['update', 'remove'])
})
test('changed session and oversized JPEG cannot upload', async () => {
  const f = fixture()
  f.c.currentUid = 'other'
  await assert.rejects(f.c.persistStudentPhoto(f.editor, { size: 1000 }), /sessione/)
  f.c.currentUid = 'teacher'
  await assert.rejects(f.c.persistStudentPhoto(f.editor, { size: 524289 }), /pesante/)
  assert.equal(f.requests.length, 0)
})
test('foreign or malformed paths never render an image', () => {
  const { c } = fixture()
  for (const path of ['B/picture.jpg', 'https://example.com/p.jpg', 'A/../B/p.jpg', 'A/p.jpg" onerror="alert(1)']) {
    assert.equal(c.studentPhotoPath({ id: 'A', foto_path: path }), '')
  }
})
