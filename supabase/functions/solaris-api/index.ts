import * as state from './routes.ts';
import * as files from './files.ts';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Cache-Control':'private, no-store'};
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 const path=new URL(req.url).pathname.replace(/\/$/,'');
 const handler=path.endsWith('/solaris-api')||path.endsWith('/solaris-api/state')?state:path.endsWith('/solaris-api/files')?files:null;
 let response:Response;
 if(path.endsWith('/solaris-api/auth-code'))return Response.json({error:'Entre com seu e-mail e senha.'},{status:410,headers:cors});
 if(!handler)response=Response.json({error:'Rota não encontrada.'},{status:404});
 else if(req.method==='GET')response=await handler.GET(req);
 else if(req.method==='POST')response=await handler.POST(req);
 else response=Response.json({error:'Método não permitido.'},{status:405});
 const headers=new Headers(response.headers);for(const [k,v] of Object.entries(cors))headers.set(k,v);
 return new Response(response.body,{status:response.status,headers});
});
