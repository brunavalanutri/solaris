import { createClient } from './supabase/server';
export async function getIdentity(){
 const client=await createClient();const {data,error}=await client.auth.getUser();
 if(error||!data.user?.email||!data.user.email_confirmed_at)return null;
 return {userId:data.user.id,email:data.user.email.toLowerCase()};
}
