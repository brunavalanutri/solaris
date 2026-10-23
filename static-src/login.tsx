import {useState} from 'react';
import {Sun,ArrowRight} from 'lucide-react';
import {createClient} from './client';
const OWNER='brunavalanutri@gmail.com';
export default function Login(){
 const [activate,setActivate]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 return <main className="welcome"><div className="welcome-brand"><Sun size={40} strokeWidth={1}/><span>SOLARIS</span></div><div className="welcome-center" style={{maxWidth:440}}><span className="eyebrow">SEU ESPAÇO DE CUIDADO</span><h1 style={{fontSize:52}}>Bem-vinda<br/>ao Solaris.</h1><p>{activate?'Ative o acesso inicial da administradora.':'Use o e-mail cadastrado pela administradora.'}</p><form onSubmit={async e=>{
  e.preventDefault();setBusy(true);setMessage('');const f=new FormData(e.currentTarget);
  try{
   const client=createClient();
   if(activate){
    const birth=String(f.get('birthDate')),parsed=new Date(birth+'T12:00:00Z');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(birth)||Number.isNaN(parsed.getTime())||parsed.toISOString().slice(0,10)!==birth||parsed>=new Date())throw Error();
    const password=birth.slice(8,10)+birth.slice(5,7)+birth.slice(0,4);
    const {error}=await client.auth.signUp({email:OWNER,password,options:{emailRedirectTo:window.location.origin+'/'}});
    if(error)throw error;
    setMessage('Confirme o e-mail enviado para '+OWNER+'. Depois entre usando sua data de nascimento como senha.');
   }else{
    const email=String(f.get('email')).trim().toLowerCase(),password=String(f.get('password')).replace(/\D/g,'');
    if(password.length!==8){setMessage('Digite sua data de nascimento com 8 números: DDMMAAAA.');return;}
    const {error}=await client.auth.signInWithPassword({email,password});if(error)throw error;
    window.location.assign('/');
   }
  }catch{setMessage(activate?'Não foi possível ativar. Se já confirmou o e-mail, volte para Entrar.':'Não foi possível entrar. Confira o e-mail cadastrado e a data de nascimento.')}finally{setBusy(false)}
 }}>
 {activate?<><label className="field">E-mail da administradora<input type="email" value={OWNER} readOnly/></label><label className="field">Sua data de nascimento<input name="birthDate" type="date" required max={new Date().toISOString().slice(0,10)}/></label></>:<><label className="field">E-mail<input name="email" type="email" autoComplete="username" required/></label><label className="field">Senha<input name="password" type="password" autoComplete="current-password" inputMode="numeric" placeholder="DDMMAAAA" required/></label><small style={{display:'block',marginBottom:20}}>Sua senha é a data de nascimento, sem barras. Exemplo: 15/03/1990 → 15031990.</small></>}
 <button disabled={busy}>{busy?'Aguarde…':activate?'Ativar administração':'Entrar'}<ArrowRight size={17}/></button></form>{message&&<p role="status" style={{marginTop:20,fontSize:13}}>{message}</p>}<p style={{fontSize:12,marginTop:20}}>O cadastro de participantes e profissionais é feito pela administradora.</p><button className="link-button" onClick={()=>{setActivate(!activate);setMessage('')}}>{activate?'Voltar para entrar':'Primeiro acesso da administradora'}</button></div><div className="welcome-foot">Nutrição + Endocrinologia<span>Cuidado que acompanha você.</span></div></main>;
}
