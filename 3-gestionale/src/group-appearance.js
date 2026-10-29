/* Group metadata is shared with the same teachers as the group's students. */
let groupPhotoOpening = false
function groupAppearance(name, members = allAllievi) {
  return members.find(a => a.gruppo === name && a.profilo?.gruppo_avatar?.id)?.profilo.gruppo_avatar || null
}
function groupAvatarRecord(name, members = allAllievi) {
  const config = groupAppearance(name, members)
  const fallback = String(name || '').trim().split(/\s+/).map(word => word[0]).slice(0, 2).join('').toUpperCase() || '?'
  return { id: config?.id || '', nome: name, avatar_sigla: config?.sigla || fallback, foto_path: config?.foto_path || null, photo_bucket: 'group-photos' }
}
function groupAvatarHtml(name, members = allAllievi, large = false) {
  return studentAvatarHtml(groupAvatarRecord(name, members), large)
}
function groupPhotoControls(name, members = allAllievi) {
  return `<div class="student-photo-controls">${groupAvatarHtml(name, members, true)}<button type="button" class="btn btn-outline btn-sm" onclick="openGroupPhotoEditor(${jsArg(name)})">Foto e sigla</button></div>`
}
function updateLocalGroupAppearance(name, config) {
  allAllievi.forEach(a => { if (a.gruppo === name) a.profilo = { ...(a.profilo || {}), gruppo_avatar: config } })
}
async function openGroupPhotoEditor(name) {
  if (groupPhotoOpening || studentPhotoEditor || !currentUid) return
  groupPhotoOpening = true
  const uid = currentUid
  try {
    const result = await sb.rpc('save_group_appearance', { p_group: name, p_sigla: groupAvatarRecord(name).avatar_sigla })
    if (result.error) throw result.error
    if (uid !== currentUid) return
    updateLocalGroupAppearance(name, result.data)
    openStudentPhotoEditor(result.data.id, name)
  } catch (error) { alert(error.message || 'Impossibile aprire foto e sigla del gruppo.') }
  finally { groupPhotoOpening = false }
}
function refreshGroupInitialsPreview(input) {
  const text = input.value.trim().toUpperCase()
  const span = document.querySelector('#student-photo-dialog .student-avatar > span')
  if (span) span.textContent = text || '?'
}
async function persistGroupPhoto(editor, blob) {
  if (currentUid !== editor.uid) throw new Error('La sessione è cambiata. Accedi di nuovo.')
  if (!/^[A-Z0-9À-ÖØ-Þ]{1,4}$/.test(editor.initials || '')) throw new Error('Usa da 1 a 4 lettere o numeri per la sigla.')
  const bucket = sb.storage.from('group-photos')
  const uploadedPath = blob ? editor.id + '/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.jpg' : null
  const path = uploadedPath || (editor.remove ? null : editor.original)
  if (blob) {
    if (blob.size > 524288) throw new Error('Foto troppo pesante.')
    const upload = await bucket.upload(uploadedPath, blob, { contentType: 'image/jpeg', upsert: false, cacheControl: '60' })
    if (upload.error) throw upload.error
  }
  try {
    if (currentUid !== editor.uid) throw new Error('La sessione è cambiata. Accedi di nuovo.')
    const result = await sb.rpc('save_group_appearance', {
      p_group: editor.groupName, p_action: 'save', p_sigla: editor.initials, p_photo_path: path,
      p_expected_photo_path: editor.original, p_expected_sigla: editor.originalInitials,
    })
    if (result.error) throw result.error
    updateLocalGroupAppearance(editor.groupName, result.data)
  } catch (error) {
    if (uploadedPath && ['40001', '42501', '22023'].includes(error.code)) await bucket.remove([uploadedPath]).catch(() => {})
    throw error
  }
  let cleanupFailed = false
  if (editor.original && editor.original !== path) {
    try { const result = await bucket.remove([editor.original]); cleanupFailed = !!result.error } catch (_) { cleanupFailed = true }
  }
  studentPhotoCache.clear()
  return { path, cleanupFailed }
}
