import {readFileSync} from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'
function fixture(error=null){
 const requests=[], students=[{id:'A',gruppo:'Budosan Base',profilo:{other:'preserve',gruppo_avatar:{id:'group-id',sigla:'BB',foto_path:'group-id/old.jpg'}}},{id:'B',gruppo:'Budosan Base',profilo:{gruppo_avatar:{id:'group-id',sigla:'BB',foto_path:'group-id/old.jpg'}}},{id:'C',gruppo:'Fratelli Cabisto',profilo:{gruppo_avatar:{id:'cabisto-id',sigla:'FC'}}}];
 const c=vm.createContext({console,allAllievi:students,currentUid:'teacher',esc:String,jsArg:JSON.stringify,
 sb:{storage:{from(bucket){return {async upload(path){requests.push({type:'upload',bucket,path});return{}},async remove(paths){requests.push({type:'remove',paths});return{}}}}},async rpc(name,args){requests.push({type:'rpc',name,args});return error?{error}:{data:{id:'group-id',sigla:args.p_sigla,foto_path:args.p_photo_path}}}}});
 vm.runInContext(readFileSync(new URL('../src/group-appearance.js',import.meta.url),'utf8'),c);
 vm.runInContext(readFileSync(new URL('../src/student-photos.js',import.meta.url),'utf8'),c);
 const editor={id:'group-id',uid:'teacher',groupName:'Budosan Base',original:'group-id/old.jpg',originalInitials:'BB',initials:'BC'};
 return{c,requests,students,editor};
}
test('group previews use saved initials and the group bucket',()=>{
 const f=fixture();assert.equal(f.c.groupAvatarRecord('Budosan Base').avatar_sigla,'BB');
 assert.equal(f.c.groupAvatarRecord('Fratelli Cabisto').avatar_sigla,'FC');
 assert.match(f.c.groupAvatarHtml('Budosan Base'),/data-photo-bucket="group-photos"/);
 assert.match(f.c.groupAvatarHtml('Fratelli Cabisto'),/>FC</);
});
test('saving initials without selecting an image preserves the current photo and unrelated fields',async()=>{
 const f=fixture();const result=await f.c.persistStudentPhoto(f.editor,null);
 assert.equal(result.path,'group-id/old.jpg');assert.deepEqual(f.requests.map(x=>x.type),['rpc']);
 assert.equal(f.students[0].profilo.other,'preserve');assert.equal(f.students[1].profilo.gruppo_avatar.sigla,'BC');assert.equal(f.students[2].profilo.gruppo_avatar.sigla,'FC');
});
test('a new group image commits metadata before cleaning the old file',async()=>{
 const f=fixture();const result=await f.c.persistStudentPhoto(f.editor,{size:100});
 assert.notEqual(result.path,'group-id/old.jpg');assert.deepEqual(f.requests.map(x=>x.type),['upload','rpc','remove']);
 assert.equal(f.requests[0].bucket,'group-photos');assert.equal(f.requests[1].args.p_expected_sigla,'BB');
});
test('removing a photo restores initials and preserves the saved group id',async()=>{
 const f=fixture();f.editor.remove=true;await f.c.persistStudentPhoto(f.editor,null);
 assert.equal(f.students[0].profilo.gruppo_avatar.foto_path,null);assert.equal(f.students[0].profilo.gruppo_avatar.sigla,'BC');assert.equal(f.students[0].profilo.gruppo_avatar.id,'group-id');
});
test('stale group metadata rejects the upload and cleans only the newly uploaded file',async()=>{
 const f=fixture({code:'40001',message:'stale'});await assert.rejects(f.c.persistStudentPhoto(f.editor,{size:100}));
 assert.equal(f.requests[2].paths[0],f.requests[0].path);assert.equal(f.students[0].profilo.gruppo_avatar.sigla,'BB');
});
test('unknown network outcome preserves a potentially committed image',async()=>{
 const f=fixture({message:'connection lost'});await assert.rejects(f.c.persistStudentPhoto(f.editor,{size:100}));
 assert.deepEqual(f.requests.map(x=>x.type),['upload','rpc']);
});
test('invalid initials and changed sessions make no writes',async()=>{
 const f=fixture();f.editor.initials='TOO LONG';await assert.rejects(f.c.persistStudentPhoto(f.editor,null));
 f.editor.initials='BB';f.c.currentUid='other';await assert.rejects(f.c.persistStudentPhoto(f.editor,null));assert.equal(f.requests.length,0);
});
