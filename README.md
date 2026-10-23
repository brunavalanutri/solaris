# Solaris

Aplicativo estático com API protegida no Supabase exclusivo do SOLARIS.

## Acesso por e-mail e código

Pacientes: https://solaris-pi-black.vercel.app/paciente
Equipe: https://solaris-pi-black.vercel.app/equipe
Paciente modelo isolada: https://solaris-pi-black.vercel.app/modelo

As sessões da equipe, pacientes e modelo são independentes. Uma sessão de paciente não redireciona a área da equipe. A API valida a identidade e o perfil; a URL não concede permissões.

Somente e-mails ativos cadastrados na área correta recebem código. Não há cadastro público de participantes. A administradora inicial usa brunavalanutri@gmail.com na área da equipe. O servidor prepara sua conta inicial sem senha; somente o código recebido por e-mail permite entrar.

A administradora cria os cadastros de participantes e profissionais dentro da plataforma, sem definir senha. Data de nascimento é opcional e não é credencial de acesso. Não há link público de demonstração.

## Configuração do e-mail no Supabase

Em Authentication > Email Templates > Magic Link, configure assunto "Seu código de acesso ao Solaris" e conteúdo:

```html
<h2>Seu acesso ao Solaris</h2>
<p>Digite este código no aplicativo:</p>
<p style="font-size:28px;font-weight:bold;letter-spacing:4px">{{ .Token }}</p>
<p>Se você não solicitou este acesso, ignore este e-mail.</p>
```

Este ajuste é necessário para receber o código numérico no lugar do link padrão. Não configure chaves secretas na Vercel.

## Publicação

Importe este repositório na Vercel. vercel.json publica somente index.html. static-src preserva o código React e supabase/functions/solaris-api a API.

A paciente modelo usa uma conta Auth identificada pelo servidor e recebe somente dados fictícios em modo de visualização, sem ler o banco da turma ou suas publicações. Não usa os códigos de e-mail de pacientes reais.

Testes cobrem envio restrito, perfis, sessões independentes, código, ausência de senha, cadastro, proteção de dados e isolamento do modelo. O envio real de e-mail depende da configuração do modelo e do serviço de e-mail do projeto Supabase.
