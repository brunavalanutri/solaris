import {createAdmin,errorResponse} from './server.ts';
const OWNER='brunavalanutri@gmail.com';
export async function POST(req:Request){try{
 if(Number(req.headers.get('content-length'))>2048)throw new Error('413|Conteúdo muito grande.');
 const body=await req.json();const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
 const portal=body.portal;if(email.length>254||!/^\S+@\S+\.\S+$/.test(email)||!['patient','team'].includes(portal))throw new Error('422|Confira o e-mail informado.');
 const db=createAdmin();const {data:row,error}=await db.from('solaris_state').select('payload').eq('id','main').maybeSingle();
 if(error)throw new Error('503|Não foi possível verificar o cadastro.');
 const person=row?.payload?.people?.find((p:any)=>p.email===email&&p.active);
 const bootstrap=!row&&email===OWNER&&portal==='team';
 const eligible=bootstrap||(person&&(portal==='team'?person.role!=='participante':person.role==='participante'));
 if(eligible){
  if(bootstrap){const {error:createError}=await db.auth.admin.createUser({email,email_confirm:true});if(createError&&!['email_exists','user_already_exists'].includes(createError.code||''))throw new Error('503|Não foi possível preparar o acesso.');}
  const {error:sendError}=await db.auth.signInWithOtp({email,options:{shouldCreateUser:false}});
  if(sendError){if(sendError.status===429)throw new Error('422|Aguarde um minuto antes de pedir outro código.');throw new Error('503|Não foi possível enviar o código agora. Tente novamente em alguns minutos.');}
 }
 return Response.json({message:'Se o e-mail estiver cadastrado nesta área, o código será enviado. Confira também o spam.'},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return errorResponse(e)}}
