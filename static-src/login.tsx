import {useState,useEffect} from 'react';
import {Sun,ArrowRight} from 'lucide-react';
import {createClient,URL,KEY} from './client';
const TEAM=window.location.pathname.startsWith('/equipe');
const MODEL=window.location.pathname.startsWith('/modelo');
export default function Login(){
 const [email,setEmail]=useState(''),[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[cooldown,setCooldown]=useState(0);
 useEffect(()=>{const error=sessionStorage.getItem('solaris-login-error');if(error){setMessage(error);sessionStorage.removeItem('solaris-login-error')}},[]);
 useEffect(()=>{if(!cooldown)return;const t=setTimeout(()=>setCooldown(c=>c-1),1000);return()=>clearTimeout(t)},[cooldown]);
 async function sendCode(){
  const r=await fetch(URL+'/functions/v1/solaris-api/auth-code',{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},body:JSON.stringify({email:email.trim().toLowerCase(),portal:TEAM?'team':'patient'})});const data=await r.json();if(!r.ok)throw Error(data.error);setSent(true);setCooldown(60);setMessage(data.message);
 }
 return <main className="welcome"><div className="welcome-brand"><Sun size={40} strokeWidth={1}/><span>SOLARIS</span></div><div className="welcome-center" style={{maxWidth:440}}><span className="eyebrow">{MODEL?'PACIENTE MODELO':TEAM?'ESPAÇO DA EQUIPE':'ESPAÇO DA PACIENTE'}</span><h1 style={{fontSize:52}}>Bem-vinda<br/>ao Solaris.</h1><p>{MODEL?'Conheça a jornada com dados fictícios, somente para visualização.':sent?'Digite o código que chegou ao seu e-mail.':TEAM?'Entre com seu e-mail de administradora ou profissional.':'Entre com o e-mail cadastrado pela administradora.'}</p><form onSubmit={async e=>{
  e.preventDefault();if(busy)return;setBusy(true);setMessage('');const f=new FormData(e.currentTarget);
  try{
   const client=createClient();
   if(MODEL){const {error}=await client.auth.signInWithPassword({email:'paciente.modelo@solaris.test',password:'01011990'});if(error)throw error;window.location.assign('/modelo');}
   else if(!sent)await sendCode();
   else{
    const token=String(f.get('token')).replace(/\s/g,'');if(!/^\d{6,10}$/.test(token))throw Error('Digite o código numérico recebido por e-mail.');
    const {error}=await client.auth.verifyOtp({email:email.trim().toLowerCase(),token,type:'email'});if(error)throw Error('Código inválido ou expirado. Confira o e-mail ou solicite outro código.');
    window.location.assign(TEAM?'/equipe':'/paciente');
   }
  }catch(e){setMessage(e instanceof Error?e.message:'Não foi possível concluir. Tente novamente.')}finally{setBusy(false)}
 }}>
 {!MODEL&&<label className="field">E-mail<input name="email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} readOnly={sent} required/></label>}
 {sent&&<label className="field">Código de acesso<input key={email} name="token" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="Código recebido por e-mail" pattern="[0-9]{6,10}" minLength={6} maxLength={10} required autoFocus/></label>}
 <button disabled={busy}>{busy?'Aguarde…':MODEL?'Entrar na paciente modelo':sent?'Entrar':'Receber código'}<ArrowRight size={17}/></button></form>
 {message&&<p role="status" style={{marginTop:20,fontSize:13}}>{message}</p>}
 {sent&&<div className="button-row" style={{marginTop:16}}><button className="link-button" disabled={busy||cooldown>0} onClick={async()=>{setBusy(true);try{await sendCode()}catch(e){setMessage(e instanceof Error?e.message:'Não foi possível reenviar.')}finally{setBusy(false)}}}>{cooldown?`Reenviar em ${cooldown}s`:'Reenviar código'}</button><button className="link-button" disabled={busy} onClick={()=>{setSent(false);setMessage('')}}>Alterar e-mail</button></div>}
 {!MODEL&&<p style={{fontSize:12,marginTop:20}}>Sem senha. O acesso depende do cadastro nesta área.</p>}
 {TEAM&&<p style={{fontSize:12}}>Para o primeiro acesso da administradora, use brunavalanutri@gmail.com.</p>}
 </div><div className="welcome-foot">Nutrição + Endocrinologia<span>Cuidado que acompanha você.</span></div></main>;
}
