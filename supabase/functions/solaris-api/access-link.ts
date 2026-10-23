import {createAdmin} from './server.ts';
export async function createAccessLink(email:string,role:string){
 const {data,error}=await createAdmin().auth.admin.generateLink({type:'recovery',email});
 const hash=data?.properties?.hashed_token;
 if(error||!hash)throw new Error('503|Não foi possível gerar o link de primeiro acesso.');
 return 'https://solaris-pi-black.vercel.app/'+(role==='participante'?'paciente':'equipe')+'#definir-senha='+encodeURIComponent(hash);
}
