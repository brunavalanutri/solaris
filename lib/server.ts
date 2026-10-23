import { getIdentity } from './auth';
import {readState,initState,compareAndSwap} from './store';
import {newState,type Person} from './model';
export async function load(){
 const identity=await getIdentity();if(!identity)throw new Error('401|Entre com sua conta para continuar.');
 let row=await readState();
 if(!row){const owner=process.env.SOLARIS_ADMIN_EMAIL?.trim().toLowerCase();if(!owner||identity.email!==owner)throw new Error('403|A equipe ainda vai liberar o seu acesso ao Solaris.');await initState(newState(identity.userId,identity.email,'Bruna Vala'));row=await readState();}
 if(!row)throw new Error('503|Não foi possível abrir o programa.');
 const me=row.state.people.find(p=>p.id===identity.userId||p.email===identity.email);
 if(!me?.active)throw new Error('403|Seu acesso não está ativo. Entre em contato com a equipe Solaris.');
 return {state:row.state,me,revision:row.revision};
}
export async function save(ctx:Awaited<ReturnType<typeof load>>,action:string){
 ctx.state.audit.push({date:new Date().toISOString(),actor:ctx.me.name,action});
 if(!await compareAndSwap(ctx.state,ctx.revision))throw new Error('409|Outro registro foi salvo ao mesmo tempo. Atualize e tente novamente.');
}
export function assertRole(me:Person,roles:string[]){if(!roles.includes(me.role))throw new Error('403|Você não tem permissão para esta ação.');}
export function ensureOrigin(req:Request){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)throw new Error('403|Origem não permitida.');}
export function errorResponse(error:unknown){const raw=error instanceof Error?error.message:'';const m=/^(401|403|404|409|413|422|503)\|(.*)$/.exec(raw);if(!m)console.error('Solaris request failed',error);return Response.json({error:m?m[2]:'Não foi possível concluir. Tente novamente.'},{status:m?Number(m[1]):500,headers:{'Cache-Control':'private, no-store'}});}
