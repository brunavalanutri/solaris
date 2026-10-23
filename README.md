# Solaris

Aplicativo de Nutrição + Endocrinologia, com interface estática e API protegida no Supabase exclusivo do Solaris.

## Publicar na Vercel

Importe brunavalanutri/solaris, branch main. O vercel.json configura automaticamente a publicação apenas do index.html. Não precisa instalar ferramentas no computador nem cadastrar variáveis de ambiente na Vercel.

A API solaris-api já está publicada no projeto Supabase siffjzbdeqgycpokvrcg. Nenhuma chave secreta é incluída na interface. A chave pública permite iniciar login; a API verifica a identidade e o cadastro antes de retornar dados.

Antes de criar a conta, configure no Supabase Authentication > URL Configuration o Site URL com o endereço final da Vercel e inclua esse endereço com barra final nas Redirect URLs. O retorno desta versão é a página inicial.

A administradora inicial usa brunavalanutri@gmail.com, cria a própria senha com pelo menos 12 caracteres e confirma o e-mail. Depois, a equipe cadastra as participantes no painel.

## Organização

index.html contém a interface pronta para publicação. static-src preserva o código React usado para gerar a interface. supabase/functions/solaris-api preserva o código da API publicada. O código Next.js anterior foi preservado como referência; o vercel.json seleciona explicitamente a publicação estática.

Os testes de regras, permissões e navegação em DOM passaram. A API real rejeitou chamadas sem token e com token inválido. Login e arquivos com conta real precisam de validação após publicar.

APP-PACIENTE e WhatsApp usam projetos separados e não foram alterados.
