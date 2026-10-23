import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {client} from './client';
import Solaris from './solaris';
import Login from './login';
import SetPassword from './set-password';
function App(){
 const [signedIn,setSignedIn]=useState<boolean|null>(null);
 useEffect(()=>{client.auth.getSession().then(({data:{session}})=>setSignedIn(!!session));const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>setSignedIn(!!session));return()=>subscription.unsubscribe()},[]);
 if(new URLSearchParams(window.location.hash.slice(1)).has('definir-senha'))return <SetPassword/>;
 if(signedIn===null)return <main className="welcome"><div className="welcome-center"><h1>Solaris</h1><p>Abrindo sua jornada…</p></div></main>;
 if(!signedIn)return <Login/>;
 return <Solaris key={String(signedIn)} signedIn={signedIn}/>;
}
createRoot(document.getElementById('root')!).render(<App/>);
