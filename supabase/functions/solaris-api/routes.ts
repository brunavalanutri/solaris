import {createAdmin} from './server.ts';
import { z } from 'npm:zod@3.25.76';
import { load, save, assertRole, ensureOrigin, errorResponse } from './server.ts';
import { dateToday, weekIndex, diffDays, view } from './model.ts';

const text=(max=2000)=>z.string().trim().max(max);
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>!Number.isNaN(Date.parse(s+'T12:00:00Z')),'Data inválida');
export async function GET(req:Request) {try{const c=await load(req);return Response.json(view(c.state,c.me),{headers:{'Cache-Control':'no-store'}})}catch(e){return errorResponse(e)}}
export async function POST(req:Request) {let createdUserId:string|null=null;try {
 ensureOrigin(req);if(Number(req.headers.get('content-length'))>100000)throw new Error('413|Conteúdo muito grande.');
 const body:any=await req.json();const c=await load(req);const {state:s,me}=c;const action=z.string().parse(body.action);const d=body.data||{};let message='Salvo com sucesso.';
 const clinical=['admin','nutri','endo'];const nutrition=['admin','nutri'];const team=['admin','nutri','endo','assistente'];const today=dateToday();const wi=weekIndex(s,today);const scoring=wi>=0&&wi<6&&today<=s.config.end;
 const participant=(id:string)=>{const p=s.people.find(p=>p.id===id&&p.role==='participante');if(!p)throw new Error('404|Participante não encontrada.');return p;};
 if(action==='person') {
  assertRole(me,['admin']);const p=z.object({id:z.string().optional(),name:text(100).min(2),email:z.string().trim().email().transform(s=>s.toLowerCase()),birthDate:date.refine(v=>{const t=Date.parse(v+'T12:00:00Z');return Number.isFinite(t)&&v===new Date(t).toISOString().slice(0,10)&&v<dateToday()},'Data de nascimento inválida'),phone:text(30).optional(),goal:text(1000).optional(),role:z.enum(['admin','nutri','endo','assistente','participante']).default('participante')}).parse(d);
  if(p.role!=='participante')assertRole(me,['admin']);
  const existing=p.id?s.people.find(v=>v.id===p.id):undefined;
  if(existing?.id===s.owner&&p.role!=='admin')throw new Error('403|A administradora principal não pode ser rebaixada.');
  if(existing?.role!=='participante'&&existing)assertRole(me,['admin']);
  if(s.people.some(v=>v.email===p.email&&v.id!==p.id))throw new Error('422|Este e-mail já está cadastrado.');
  if(me.role==='assistente'&&p.goal)throw new Error('403|Objetivos clínicos são definidos pelas profissionais.');
  if(existing){
   if(existing.email!==p.email)throw new Error('422|O e-mail de uma conta existente não pode ser alterado neste cadastro.');
   Object.assign(existing,p);
  }else{
   const password=p.birthDate.slice(8,10)+p.birthDate.slice(5,7)+p.birthDate.slice(0,4);
   const {data:account,error}=await createAdmin().auth.admin.createUser({email:p.email,password,email_confirm:true});
   if(error||!account.user)throw new Error('422|Não foi possível criar o acesso. Confira o e-mail; ele pode já ter uma conta.');
   createdUserId=account.user.id;
   s.people.push({...p,id:account.user.id,active:true});
   message='Cadastro salvo. O acesso já está liberado com o e-mail e a data de nascimento (DDMMAAAA).';
  }
 } else if(action==='active'||action==='kit') {assertRole(me,team); const p=participant(z.string().parse(d.person));if(action==='active') {assertRole(me,['admin','nutri']);p.active=z.boolean().parse(d.value)}else p.kit=z.boolean().parse(d.value);
 } else if(action==='config') {assertRole(me,nutrition);const config=z.object({title:text(100).min(1),start:date,scoringStart:date,end:date,support:text(1500)}).parse(d);if(config.start>config.scoringStart||config.scoringStart>config.end)throw new Error('422|Confira a sequência das datas.');s.config=config;
 } else if(action==='week') {assertRole(me,nutrition);const index=z.number().int().min(0).max(5).parse(d.index);s.weeks[index]=z.object({title:text(100).min(1),main:text(800),food:text(800),move:text(800),care:text(800),proof:z.boolean(),advice:text(1500).optional()}).parse(d);
 } else if(action==='plan') {assertRole(me,nutrition);const p=participant(z.string().parse(d.person));p.plan=text(15000).parse(d.plan);
 } else if(action==='profile') {assertRole(me,['participante']);const v=z.object({displayName:text(50).min(2),bio:text(500),phone:text(30)}).parse(d);Object.assign(me,v);
 } else if(action==='consent') {if(me.role!=='participante')throw new Error('403|Esta confirmação pertence à participante.');me.consent=z.literal(true).parse(d.value);
 } else if(action==='habits'||action==='mission'||action==='checkin') {
  assertRole(me,['participante']); if(!me.consent)throw new Error('422|Leia e aceite os termos de participação primeiro.');
  if(today<s.config.start||today>s.config.end)throw new Error('422|Os registros estão disponíveis durante o programa.');
  if(d.date!==today)throw new Error('422|Registros anteriores estão disponíveis apenas para consulta.');
  let type=action;let value:any;let points=0;let status:'validado'|'pendente'='validado';
  if(action==='habits'){value=z.object({water:z.number().min(0).max(15),sleep:z.number().min(0).max(24),mood:z.number().int().min(1).max(5),notes:text(2000)}).parse(d.value);points=scoring?5:0;}
  if(action==='mission'){if(!scoring)throw new Error('422|Os desafios começam na fase de aplicação.');const task=z.enum(['main','food','move','care','photo']).parse(d.task);type='mission:'+task;
   if(task==='photo'){if(!s.weeks[wi].proof)throw new Error('422|Não há atividade fotográfica nesta semana.');const file=s.files.find(f=>f.id===d.file&&f.person===me.id&&f.kind==='proof');if(!file)throw new Error('422|Envie uma foto de comprovação.');value={file:file.id};points=5;status='pendente';}
   else{if(!s.weeks[wi][task])throw new Error('422|A equipe ainda vai publicar esta missão.');value={label:s.weeks[wi][task]};points=task==='main'?15:10;}
  }
  if(action==='checkin') {value=z.object({adherence:z.number().int().min(1).max(5),energy:z.number().int().min(1).max(5),digestion:text(1000),wins:text(2000).min(1),difficulty:text(2000),question:text(2000)}).parse(d.value);const sameWeek=s.entries.some(e=>e.person===me.id&&e.type==='checkin'&&weekIndex(s,e.date)===wi);if(sameWeek)throw new Error('422|Você já enviou o check-in deste período.');points=scoring?20:0;}
  if(s.entries.some(e=>e.person===me.id&&e.date===today&&e.type===type))throw new Error('422|Você já registrou esta atividade hoje.');
  s.entries.push({id:crypto.randomUUID(),person:me.id,date:today,type,value,points,status});
 } else if(action==='reply') {assertRole(me,clinical);const e=s.entries.find(e=>e.id===d.id&&e.type==='checkin');if(!e)throw new Error('404|Check-in não encontrado.');e.value.reply=text(3000).parse(d.reply);
 } else if(action==='validate') {assertRole(me,nutrition);const e=s.entries.find(e=>e.id===d.id&&e.type==='mission:photo');if(!e)throw new Error('404|Registro não encontrado.');e.status=z.enum(['validado','recusado']).parse(d.status);
 } else if(action==='appointment') {assertRole(me,team);const v=z.object({person:z.string(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),type:text(100).min(1),location:text(300),title:text(120).optional()}).parse(d);if(v.person==='*'&&v.type!=='Evento da turma')throw new Error('422|Use o tipo Evento da turma para encontros coletivos.');if(v.person!=='*')participant(v.person);s.appointments.push({...v,id:crypto.randomUUID()});
 } else if(action==='deleteAppointment') {assertRole(me,team);s.appointments=s.appointments.filter(a=>a.id!==d.id);
 } else if(action==='evaluation') {assertRole(me,clinical);const v=z.object({person:z.string(),date,weight:text(20),muscle:text(20),fat:text(20),waist:text(20),notes:text(3000)}).parse(d);participant(v.person);for(const key of ['weight','muscle','fat','waist'] as const)if(v[key]&&(!Number.isFinite(Number(v[key].replace(',','.')))||Number(v[key].replace(',','.'))<0))throw new Error('422|Confira os valores da avaliação.');s.evaluations.push({...v,id:crypto.randomUUID()});
 } else if(action==='post') {assertRole(me,['admin','nutri','endo','participante']);if(me.role==='participante'&&!me.consent)throw new Error('422|Aceite os termos de participação.');if(d.publish!==true)throw new Error('422|Confirme que deseja compartilhar com a comunidade.');s.posts.push({id:crypto.randomUUID(),person:me.id,name:me.displayName||me.name,text:text(3000).min(1).parse(d.text),date:new Date().toISOString(),hidden:false,reported:false});
 } else if(action==='report') {const p=s.posts.find(p=>p.id===d.id);if(!p)throw new Error('404|Publicação não encontrada.');p.reported=true;
 } else if(action==='hidePost') {const p=s.posts.find(p=>p.id===d.id);if(!p)throw new Error('404|Publicação não encontrada.');if(p.person!==me.id)assertRole(me,nutrition);p.hidden=true;
 } else throw new Error('422|Ação não reconhecida.');
 await save(c,action);return Response.json({message,data:view(s,me)},{headers:{'Cache-Control':'no-store'}});
 }catch(e){if(createdUserId){await createAdmin().auth.admin.deleteUser(createdUserId).catch(()=>{});}if(e instanceof z.ZodError)return Response.json({error:'Confira os campos: '+e.issues.map(i=>i.path.join('.')||'formulário').join(', ')},{status:422});return errorResponse(e)}}
