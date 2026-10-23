import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {newState,type Person,type State} from './model.ts';
export function createAdmin(){
 const url=Deno.env.get('SUPABASE_URL')||'';
 if(new URL(url).hostname!=='siffjzbdeqgycpokvrcg.supabase.co')throw new Error('503|Projeto Solaris incorreto.');
 return createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'',{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
}
export async function load(req:Request){
 const token=/^Bearer (\S+)$/i.exec(req.headers.get('authorization')||'')?.[1];
 if(!token)throw new Error('401|Entre com sua conta para continuar.');
 const db=createAdmin();
 const {data:auth,error:authError}=await db.auth.getUser(token);
 if(authError||!auth.user?.email||!auth.user.email_confirmed_at)throw new Error('401|Entre com sua conta confirmada para continuar.');
 const email=auth.user.email.toLowerCase(),id=auth.user.id;
 const read=async()=>{const {data,error}=await db.from('solaris_state').select('payload,revision').eq('id','main').maybeSingle();if(error)throw new Error('503|Não foi possível abrir o banco Solaris.');return data;};
 let row=await read();
 if(!row){
  if(email!=='brunavalanutri@gmail.com')throw new Error('403|A equipe ainda vai liberar o seu acesso ao Solaris.');
  const {error}=await db.from('solaris_state').insert({id:'main',payload:newState(id,email,'Bruna Vala'),revision:0});
  if(error&&error.code!=='23505')throw new Error('503|Não foi possível iniciar o programa.');
  row=await read();
 }
 if(!row)throw new Error('503|Não foi possível abrir o programa.');
 const state=row.payload as State;
 const me=state.people.find(p=>p.id===id||p.email===email);
 if(!me?.active)throw new Error('403|Seu acesso não está ativo. Entre em contato com a equipe Solaris.');
 return {state,me,revision:Number(row.revision)};
}
export async function save(ctx:Awaited<ReturnType<typeof load>>,action:string){
 ctx.state.audit.push({date:new Date().toISOString(),actor:ctx.me.name,action});
 const {data,error}=await createAdmin().from('solaris_state').update({payload:ctx.state,revision:ctx.revision+1}).eq('id','main').eq('revision',ctx.revision).select('id');
 if(error)throw new Error('503|Não foi possível salvar no banco Solaris.');
 if(data.length!==1)throw new Error('409|Outro registro foi salvo ao mesmo tempo. Atualize e tente novamente.');
}
export function assertRole(me:Person,roles:string[]){if(!roles.includes(me.role))throw new Error('403|Você não tem permissão para esta ação.');}
// Authentication uses an explicit bearer token, never cross-site cookies.
export function ensureOrigin(_req:Request){}
export function errorResponse(error:unknown){const raw=error instanceof Error?error.message:'';const m=/^(401|403|404|409|413|422|503)\|(.*)$/.exec(raw);return Response.json({error:m?m[2]:'Não foi possível concluir. Tente novamente.'},{status:m?Number(m[1]):500,headers:{'Cache-Control':'private, no-store'}});}
