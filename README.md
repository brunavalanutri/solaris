# Solaris

Aplicativo estático de acompanhamento de Nutrição + Endocrinologia. Importe este repositório na Vercel; vercel.json configura a publicação. Não são necessárias variáveis de ambiente na Vercel.

## Acesso

Login: e-mail cadastrado pela administradora. Senha inicial: data de nascimento no formato DDMMAAAA, sem barras. Ao cadastrar uma participante ou profissional, a administradora informa nome, e-mail e data de nascimento. O servidor cria a conta no Supabase e libera o acesso ao salvar, sem cadastro público de participantes.

Somente a administradora cadastra pessoas. As regras de autorização e os dados permanecem na API solaris-api do Supabase SOLARIS. A senha não é gravada no documento da turma ou na auditoria. A demonstração foi retirada da tela de entrada.

## Ativação inicial da administradora

Na tela de entrada, Primeiro acesso da administradora permite ativar somente brunavalanutri@gmail.com, com confirmação por e-mail. Informe sua própria data de nascimento e confirme o e-mail antes de entrar. Essa é uma exceção para iniciar a administração; os demais acessos são cadastrados dentro da plataforma.

No Supabase Authentication > URL Configuration, configure Site URL com https://solaris-pi-black.vercel.app e inclua https://solaris-pi-black.vercel.app/ nas Redirect URLs para o retorno da confirmação inicial.

## Código

index.html: interface pronta. static-src: componentes de origem. supabase/functions/solaris-api: API publicada. O código Next.js anterior permanece como referência; a publicação usa somente o HTML estático.

Testes de cadastro administrativo, datas, senha, duplicação e falha de gravação passaram com Auth simulado. A navegação da tela de entrada foi testada em DOM. Login de uma pessoa real ainda depende da ativação e cadastro.

## Endereços separados

Pacientes: https://solaris-pi-black.vercel.app/paciente

Administradora e profissionais: https://solaris-pi-black.vercel.app/equipe

A página inicial também abre o login da paciente. A ativação inicial da administradora aparece somente em /equipe. Após a autenticação, o perfil validado pelo servidor determina a área correta.

## Paciente modelo

Foi criada uma conta Auth marcada pelo servidor como modelo. Ela permite somente visualizar uma jornada fictícia com cinco páginas, sem ler o banco da turma, seus arquivos ou publicações reais. Credenciais de teste são fornecidas diretamente à administradora. O acesso não usa parâmetros de URL para atribuir permissões. Não há link público de demonstração.
