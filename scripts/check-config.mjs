const expected='siffjzbdeqgycpokvrcg.supabase.co';
const required=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','SUPABASE_SECRET_KEY','SOLARIS_ADMIN_EMAIL'];
const missing=required.filter(k=>!process.env[k]||process.env[k].includes('CONFIGURAR'));if(missing.length)throw new Error('Configuração pendente: '+missing.join(', '));
if(new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname!==expected)throw new Error('O endereço precisa ser o projeto exclusivo Solaris.');
console.log('Configuração Solaris presente; nenhum segredo foi impresso.');
