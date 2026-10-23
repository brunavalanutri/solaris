export const SOLARIS_PROJECT_REF = 'siffjzbdeqgycpokvrcg';
export function publicConfig() {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)throw new Error('503|Configure as variáveis do projeto Supabase Solaris.');
 if(new URL(url).hostname!==`${SOLARIS_PROJECT_REF}.supabase.co`)throw new Error('503|A configuração deve apontar exclusivamente para o projeto Solaris.');
 return {url,key};
}
