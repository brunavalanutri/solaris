import { createClient } from '@supabase/supabase-js';
import { publicConfig } from './config';
export function createAdmin(){
 const {url}=publicConfig();const secret=process.env.SUPABASE_SECRET_KEY;
 if(!secret)throw new Error('503|Configure a chave secreta do Solaris somente no servidor.');
 return createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
}
