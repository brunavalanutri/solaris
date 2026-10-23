import {createClient as supabase} from '@supabase/supabase-js';
export const URL='https://siffjzbdeqgycpokvrcg.supabase.co';
export const KEY='sb_publishable_jRzdUHtL75UljFN2RJJ7iw_uXvGgM0J';
export const client=supabase(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'solaris-auth'}});
export const createClient=()=>client;
const nativeFetch=window.fetch.bind(window);
window.fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
 const path=typeof input==='string'?input:'';
 if(!path.startsWith('/api/'))return nativeFetch(input,init);
 if(!/^\/api\/(solaris|files)(\?|$)/.test(path))throw new Error('Rota inválida.');
 const {data:{session}}=await client.auth.getSession();
 const headers=new Headers(init?.headers);headers.set('apikey',KEY);
 if(session)headers.set('Authorization','Bearer '+session.access_token);
 const endpoint=path.replace('/api/solaris','/state').replace('/api/files','/files');
 return nativeFetch(URL+'/functions/v1/solaris-api'+endpoint,{...init,headers,credentials:'omit'});
};
document.addEventListener('click',async e=>{
 const link=(e.target as Element)?.closest('a');
 if(!link||!link.getAttribute('href')?.startsWith('/api/files?'))return;
 e.preventDefault();
 const tab=window.open('about:blank','_blank');
 if(tab)tab.document.body.textContent='Abrindo arquivo privado…';
 try{
  const response=await fetch(link.getAttribute('href')!);
  if(!response.ok){const data=await response.json();throw new Error(data.error||'Não foi possível abrir o arquivo.');}
  const url=window.URL.createObjectURL(await response.blob());
  if(tab)tab.location.href=url;else{const download=document.createElement('a');download.href=url;download.download='solaris-arquivo';download.click();}
  setTimeout(()=>window.URL.revokeObjectURL(url),300000);
 }catch(error){if(tab)tab.close();window.alert(error instanceof Error?error.message:'Não foi possível abrir o arquivo.');}
});
document.addEventListener('submit',e=>{
 const form=e.target as HTMLFormElement;
 if(form.getAttribute('action')!=='/auth/signout')return;
 e.preventDefault();client.auth.signOut().then(()=>window.location.assign('/'));
});
