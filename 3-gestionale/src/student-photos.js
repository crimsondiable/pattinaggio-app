/* Private student portraits. No image data or signed URLs in localStorage/export. */
const studentPhotoCache = new Map()
let studentPhotoEditor = null

function studentPhotoPath(student) {
  const path = student?.foto_path || ''
  return path.startsWith(student.id + '/') && /^[a-zA-Z0-9/-]+\.jpg$/.test(path) ? path : ''
}

function studentAvatarHtml(student, large = false) {
  const initials = student.avatar_sigla || [student.nome, student.cognome].filter(Boolean).map(s => s[0]).join('').slice(0, 2).toUpperCase() || '?'
  const path = studentPhotoPath(student)
  return `<span class="student-avatar${large ? ' student-avatar-large' : ''}" aria-hidden="true"><span>${esc(initials)}</span>${path ? `<img data-student-photo="${esc(path)}" data-photo-bucket="${esc(student.photo_bucket || 'student-photos')}" alt="" hidden>` : ''}</span>`
}

function studentPhotoControls(student) {
  if (student.tipo === 'associazione') return ''
  return `<div class="student-photo-controls">${studentAvatarHtml(student, true)}<button type="button" class="btn btn-outline btn-sm" onclick="openStudentPhotoEditor('${student.id}')">${studentPhotoPath(student) ? 'Modifica foto' : 'Aggiungi foto'}</button></div>`
}

async function hydrateStudentPhotos() {
  if (typeof currentUid === 'undefined' || !currentUid || typeof sb === 'undefined' || !sb) return
  const uid = currentUid
  const images = Array.from(document.querySelectorAll('img[data-student-photo]'))
  await Promise.all(images.map(async img => {
    const path = img.dataset.studentPhoto
    const bucketName = img.dataset.photoBucket || 'student-photos'
    const key = uid + ':' + bucketName + ':' + path
    if (img.dataset.photoLoading || (img.dataset.photoKey === key && Number(img.dataset.photoExpiry) > Date.now())) return
    img.dataset.photoLoading = '1'
    try {
      let entry = studentPhotoCache.get(key)
      if (!entry || entry.expires < Date.now()) {
        entry = { expires: Date.now() + 240000, promise: sb.storage.from(bucketName).createSignedUrl(path, 600) }
        studentPhotoCache.set(key, entry)
      }
      const result = await entry.promise
      if (result.error) throw result.error
      const url = result.data?.signedUrl || result.signedURL || result.data?.signedURL
      if (!url) throw new Error('Foto non disponibile')
      if (currentUid !== uid || !img.isConnected) return
      img.onload = () => { img.hidden = false }
      img.onerror = () => { img.hidden = true }
      img.dataset.photoKey = key
      img.dataset.photoExpiry = String(entry.expires)
      img.src = url
    } catch (_) {
      // Keep initials and retry after a short backoff if the network is unavailable.
      img.dataset.photoKey = key
      img.dataset.photoExpiry = String(Date.now() + 30000)
      studentPhotoCache.delete(key)
      img.hidden = true
    } finally { delete img.dataset.photoLoading }
  }))
}

function studentPhotoCrop(width, height, zoom = 1, x = 0, y = 0) {
  const side = Math.min(width, height) / zoom
  return { side, x: (width - side) * (x + 100) / 200, y: (height - side) * (y + 100) / 200 }
}

function drawStudentPhotoCrop() {
  const editor = studentPhotoEditor
  if (!editor?.image) return
  const canvas = document.getElementById('student-photo-preview')
  const crop = studentPhotoCrop(editor.image.naturalWidth, editor.image.naturalHeight,
    Number(document.getElementById('student-photo-zoom').value),
    Number(document.getElementById('student-photo-x').value), Number(document.getElementById('student-photo-y').value))
  canvas.getContext('2d').drawImage(editor.image, crop.x, crop.y, crop.side, crop.side, 0, 0, 512, 512)
}

function closeStudentPhotoEditor() {
  if (studentPhotoEditor?.busy) return
  const editor = studentPhotoEditor
  document.getElementById('student-photo-dialog')?.remove()
  studentPhotoEditor = null
  editor?.returnFocus?.focus()
}

function openStudentPhotoEditor(id, groupName = null) {
  if (studentPhotoEditor) return
  const student = groupName ? groupAvatarRecord(groupName) : allAllievi.find(a => a.id === id)
  if (!student || !currentUid) return
  studentPhotoEditor = { id, groupName, originalInitials: groupName ? student.avatar_sigla : null, uid: currentUid, original: student.foto_path || null, busy: false, returnFocus: document.activeElement }
  const modal = document.createElement('div')
  modal.id = 'student-photo-dialog'
  modal.className = 'student-photo-overlay'
  modal.innerHTML = `<div class="card student-photo-dialog" role="dialog" aria-modal="true" aria-labelledby="student-photo-title">
    <h2 id="student-photo-title">Foto di ${esc(student.nome)}</h2>
    ${groupName ? `${studentAvatarHtml(student, true)}<label class="student-photo-file">Sigla anteprima<input id="group-photo-initials" type="text" maxlength="4" value="${esc(student.avatar_sigla)}" oninput="refreshGroupInitialsPreview(this)" aria-describedby="group-photo-help"></label><p id="group-photo-help" style="font-size:.82rem;color:var(--muted)">Da 1 a 4 lettere o numeri. Compare quando manca la foto.</p>` : ''}
    <label class="student-photo-file">Scegli una foto o scattala dal telefono<input id="student-photo-file" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onchange="selectStudentPhoto(this)"></label>
    <div id="student-photo-crop" hidden><canvas id="student-photo-preview" width="512" height="512" aria-label="Anteprima del ritaglio"></canvas>
    <label>Ingrandimento<input id="student-photo-zoom" type="range" min="1" max="3" step="0.05" value="1" oninput="drawStudentPhotoCrop()"></label>
    <label>Sposta orizzontalmente<input id="student-photo-x" type="range" min="-100" max="100" value="0" oninput="drawStudentPhotoCrop()"></label>
    <label>Sposta verticalmente<input id="student-photo-y" type="range" min="-100" max="100" value="0" oninput="drawStudentPhotoCrop()"></label></div>
    <p id="student-photo-status" role="status" aria-live="polite"></p>
    <div class="student-photo-actions"><button type="button" class="btn btn-primary" id="student-photo-save" ${groupName ? '' : 'disabled'} onclick="saveStudentPhoto(false)">${groupName ? 'Salva' : 'Salva foto'}</button>
    ${studentPhotoPath(student) ? '<button type="button" class="btn btn-outline" onclick="saveStudentPhoto(true)">Rimuovi foto</button>' : ''}
    <button type="button" class="btn btn-ghost" onclick="closeStudentPhotoEditor()">Annulla</button></div></div>`
  document.body.appendChild(modal)
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); closeStudentPhotoEditor() }
    if (e.key === 'Tab') {
      const items = Array.from(modal.querySelectorAll('button:not(:disabled),input:not(:disabled)')).filter(el => !el.closest('[hidden]'))
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  })
  document.getElementById('student-photo-file').focus()
}

async function selectStudentPhoto(input) {
  const editor = studentPhotoEditor
  const file = input.files?.[0]
  if (!file || !editor || editor.busy) return
  editor.image = null
  const selection = editor.selection = (editor.selection || 0) + 1
  document.getElementById('student-photo-save').disabled = !editor.groupName
  document.getElementById('student-photo-crop').hidden = true
  const status = document.getElementById('student-photo-status')
  status.textContent = ''
  if (file.size > 20 * 1024 * 1024) { status.textContent = 'Scegli una foto inferiore a 20 MB.'; return }
  if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) { status.textContent = 'Scegli una foto JPEG, PNG o WebP.'; return }
  const url = URL.createObjectURL(file)
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Foto non leggibile. Prova a esportarla come JPEG.'))
      img.src = url
    })
    if (studentPhotoEditor !== editor || editor.selection !== selection) return
    if (image.naturalWidth * image.naturalHeight > 80000000) throw new Error('Foto troppo grande. Scegli una versione ridotta.')
    editor.image = image
    ;['zoom', 'x', 'y'].forEach(key => { document.getElementById('student-photo-' + key).value = key === 'zoom' ? '1' : '0' })
    document.getElementById('student-photo-crop').hidden = false
    drawStudentPhotoCrop()
    document.getElementById('student-photo-save').disabled = false
  } catch (error) {
    if (studentPhotoEditor === editor && editor.selection === selection) status.textContent = error.message
  } finally { URL.revokeObjectURL(url) }
}

async function persistStudentPhoto(editor, blob) {
  if (editor.groupName) return persistGroupPhoto(editor, blob)
  if (currentUid !== editor.uid) throw new Error('La sessione è cambiata. Accedi di nuovo.')
  const bucket = sb.storage.from('student-photos')
  const path = blob ? editor.id + '/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.jpg' : null
  if (blob) {
    if (blob.size > 524288) throw new Error('Foto troppo pesante. Scegli un’immagine più semplice.')
    const upload = await bucket.upload(path, blob, { contentType: 'image/jpeg', upsert: false, cacheControl: '60' })
    if (upload.error) throw upload.error
  }
  try {
    if (currentUid !== editor.uid) throw new Error('La sessione è cambiata. Accedi di nuovo.')
    let query = sb.from('allievi').update({ foto_path: path }).eq('id', editor.id)
    query = editor.original ? query.eq('foto_path', editor.original) : query.is('foto_path', null)
    const result = await query.select('id,foto_path').single()
    if (result.error || !result.data) {
      const error = new Error(result.error?.code === 'PGRST116' || !result.error ? 'La foto è stata modificata altrove. Ricarica la pagina prima di riprovare.' : result.error.message)
      error.code = result.error?.code
      error.confirmedRejection = !result.data && (!result.error || ['PGRST116', '42501', '23514', 'PGRST204'].includes(result.error.code))
      throw error
    }
    allAllievi.forEach(a => { if (a.id === editor.id) a.foto_path = path })
  } catch (error) {
    // Only delete after a confirmed rejection. A lost network response may follow
    // a committed update: preserve the file in that ambiguous case.
    if (path && (error.code === '42501' || error.confirmedRejection)) await bucket.remove([path]).catch(() => {})
    throw error
  }
  // The new reference is committed; failure to clean up must not undo that success.
  let cleanupFailed = false
  if (editor.original && editor.original.startsWith(editor.id + '/')) {
    try { const removed = await bucket.remove([editor.original]); cleanupFailed = !!removed.error } catch (_) { cleanupFailed = true }
  }
  studentPhotoCache.clear()
  return { path, cleanupFailed }
}

async function saveStudentPhoto(remove) {
  const editor = studentPhotoEditor
  if (!editor || editor.busy || (!remove && !editor.image && !editor.groupName)) return
  if (remove && !confirm('Rimuovere questa foto?')) return
  if (editor.groupName) {
    editor.initials = document.getElementById('group-photo-initials').value.trim().toUpperCase()
    editor.remove = !!remove
  }
  const status = document.getElementById('student-photo-status')
  editor.busy = true
  document.querySelectorAll('#student-photo-dialog button, #student-photo-dialog input').forEach(el => { el.disabled = true })
  status.textContent = remove ? 'Rimozione in corso…' : 'Salvataggio in corso…'
  let saved = false
  try {
    const blob = remove || !editor.image ? null : await new Promise(resolve => document.getElementById('student-photo-preview').toBlob(resolve, 'image/jpeg', 0.82))
    if (!remove && editor.image && !blob) throw new Error('Impossibile preparare la foto. Prova con un’altra immagine.')
    const result = await persistStudentPhoto(editor, blob)
    saved = true
    editor.busy = false
    closeStudentPhotoEditor()
    renderAllievi()
    if (editor.groupName) {
      if (currentGruppoNome === editor.groupName) await loadGruppo(editor.groupName)
    } else if (currentSchedaId === editor.id) await loadScheda(editor.id)
    if (result.cleanupFailed) alert('Foto aggiornata. Non è stato possibile eliminare il vecchio file: riprova la pulizia quando la connessione è disponibile.')
  } catch (error) {
    if (saved) { console.warn('Foto salvata; aggiornare la scheda per rivederla.'); return }
    status.textContent = error.message || 'Impossibile salvare la foto. Riprova.'
    editor.busy = false
    document.querySelectorAll('#student-photo-dialog button, #student-photo-dialog input').forEach(el => { el.disabled = false })
    document.getElementById('student-photo-save').disabled = !editor.image && !editor.groupName
  }
}

// Hydrate portraits after existing views replace their HTML, without changing routing.
if (typeof MutationObserver !== 'undefined') {
  let scheduled = false
  new MutationObserver(records => {
    if (scheduled || !records.some(record => record.addedNodes.length)) return
    scheduled = true
    setTimeout(() => { scheduled = false; hydrateStudentPhotos() }, 0)
  }).observe(document.body, { childList: true, subtree: true })
  setInterval(hydrateStudentPhotos, 60000)
}
