const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'..')+'/';
function compile(file,overrides){const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(root+file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(n=>overrides[n]||require(n),m,m.exports);return m.exports;}
const model=compile('supabase/functions/solaris-api/model.ts',{});let state=model.newState('owner','brunavalanutri@gmail.com','Admin'),who='admin',failSave=false,failAuth=false;const created=[],deleted=[];
const server={load:async()=>{const copy=structuredClone(state);return {state:copy,me:who==='admin'?copy.people[0]:{id:'no-admin',name:'Teste',role:who,active:true},revision:0}},save:async c=>{if(failSave)throw new Error('409|Concorrência');state=c.state},assertRole:(me,roles)=>{if(!roles.includes(me.role))throw Error('403|Sem permissão')},ensureOrigin:()=>{},errorResponse:e=>Response.json({error:e.message},{status:Number(e.message.split('|')[0])||500}),createAdmin:()=>({auth:{admin:{createUser:async input=>{created.push(input);return failAuth?{data:{user:null},error:Error('exists')}:{data:{user:{id:'auth-'+created.length}},error:null}},deleteUser:async id=>{deleted.push(id);return {error:null}}}}})};
const route=compile('supabase/functions/solaris-api/routes.ts',{'./server.ts':server,'./model.ts':model,'npm:zod@3.25.76':require('zod')});
const person={name:'Participante teste',email:'teste@example.test',birthDate:'1990-03-05',phone:'',role:'participante'};
async function call(data){const r=await route.POST(new Request('https://solaris.test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'person',data})}));return {status:r.status,body:await r.json()};}
(async()=>{
 for(const role of ['nutri','assistente','participante']){who=role;assert.equal((await call(person)).status,403)}assert.equal(created.length,0);who='admin';
 for(const birthDate of ['2024-02-31','2099-01-01'])assert.equal((await call({...person,birthDate})).status,422);assert.equal(created.length,0);
 let r=await call(person);assert.equal(r.status,200);assert.equal(created[0].password,undefined);assert.equal(created[0].email_confirm,true);assert.equal(state.people[1].id,'auth-1');assert.equal(state.people[1].password,undefined);assert.equal((await call(person)).status,422);assert.equal(created.length,1);
 failSave=true;r=await call({...person,email:'conflict@example.test'});assert.equal(r.status,409);assert.deepEqual(deleted,['auth-2']);assert.equal(state.people.length,2);failSave=false;
 failAuth=true;r=await call({...person,email:'existing@example.test'});assert.equal(r.status,422);assert.equal(state.people.length,2);assert.equal(deleted.length,1);
 assert.equal(model.view(state,{id:'assistant',email:'a@example.test',name:'A',role:'assistente',active:true}).people[1].birthDate,undefined);
 console.log('PASS: admin-only provisioning, real date validation, passwordless account creation, confirmed Auth creation, duplicate handling, private DOB, no plaintext password stored and cleanup on save conflict.');
})().catch(e=>{console.error(e);process.exit(1)});
