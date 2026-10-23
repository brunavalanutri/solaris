# Solaris

Aplicativo independente de acompanhamento de oito semanas: Nutrição + Endocrinologia.

A área da participante foi desenhada para celular, com Início, Desafios, Agenda, Perfil e Comunidade. O painel da equipe tem cadastros, agenda, check-ins, avaliações, planos alimentares e configuração semanal.

## Projetos independentes

- Repositório: `brunavalanutri/solaris`.
- Supabase: `SOLARIS`, referência `siffjzbdeqgycpokvrcg`, São Paulo.
- Banco, arquivos, autenticação e configurações próprios; não depende do APP-PACIENTE ou do WhatsApp.
- A prévia publicada anteriormente em ChatGPT Sites continua separada. Esta versão usa Next.js e Supabase e precisa de uma hospedagem de frontend, como Vercel.

## Recursos

- Objetivos e conselho da semana configurados pela equipe.
- Hábitos diários, quatro missões por dia e check-in semanal.
- Pontos calculados no servidor; somente a participante vê a própria posição, e a equipe autorizada vê a classificação completa.
- Calendário mensal com histórico de desafios, pontos validados, avaliações e eventos coletivos.
- Bloqueio de registros retroativos e duplicações.
- Perfil com nome de exibição, apresentação opcional e telefone.
- Plano alimentar em texto/PDF, avaliações e respostas profissionais.
- Feed textual opcional com denúncia e remoção; dados clínicos não aparecem na comunidade.
- Fotos de comprovação privadas, com pontos somente após validação.
- Perfis de administradora, nutri, endócrino, assistente e participante, com autorização no servidor.

## Configuração

Requer Node.js 22 ou superior.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Preencha as variáveis apenas no ambiente local ou no servidor de hospedagem:

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL exclusiva do projeto Solaris; já consta no exemplo. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave publicável do projeto Solaris. |
| `SUPABASE_SECRET_KEY` | Chave secreta do projeto, somente no servidor. |
| `SOLARIS_ADMIN_EMAIL` | E-mail da administradora inicial. |

Não coloque a chave secreta em variáveis `NEXT_PUBLIC_`, arquivos publicados ou no navegador. O aplicativo valida a referência do projeto para impedir conexão acidental ao banco de outro app.

## Implantação do banco

A migração inicial em `supabase/migrations/20261023125519_solaris_initial_schema.sql` já foi aplicada no projeto Solaris indicado em `supabase/project.json`. Não a reaplique manualmente nesse mesmo projeto. Ela contém a tabela transacional `solaris_state`, permissões restritas ao servidor e o bucket privado `solaris-private` (até 5 MB por arquivo).

O acesso direto à tabela é negado aos clientes `anon` e `authenticated`. A API Next.js valida a identidade com Supabase Auth, confere o perfil e retorna somente os registros autorizados. A chave secreta existe apenas no servidor. Arquivos são fornecidos pela API somente após autorização.

Esta primeira versão usa um documento transacional JSONB com revisão otimista para a turma pequena inicial. Para turmas maiores, normalize as entidades e adote paginação. O registro de auditoria fica dentro do documento e depende das permissões do servidor; não é um log imutável externo.

## Publicar o frontend

1. Importe este repositório como **novo projeto** na Vercel, sem reutilizar os projetos existentes.
2. Cadastre as quatro variáveis acima no novo projeto.
3. No Supabase Auth, configure `Site URL` e a URL permitida de retorno `https://SEU-DOMINIO/auth/callback` com o endereço real da nova hospedagem.
4. Publique e faça o primeiro acesso com o e-mail definido em `SOLARIS_ADMIN_EMAIL`.

O Supabase hospeda o banco, a autenticação e os arquivos; ele não publica a interface Next.js. O código não contém chaves secretas e ainda não é um deploy Vercel.

## Primeiro acesso

A administradora escolhe a própria senha (pelo menos 12 caracteres) em **Primeiro acesso**, confirma o e-mail e entra. Somente o e-mail configurado no servidor pode inicializar a administração. Depois, a equipe cadastra as participantes e profissionais por e-mail; cada pessoa cria seu próprio acesso. Uma conta Auth sem cadastro no programa não tem acesso aos dados. Cadastrar uma pessoa no painel não envia mensagens automaticamente.

Não há importação de pacientes, senhas ou dados dos outros aplicativos. A base publicada começa vazia. As sessões são renovadas pelo Supabase conforme as configurações de autenticação; não se promete sessão permanente.

## Verificação

```sh
npm run typecheck
npm test
npm run build
```

Os testes verificam identidade, inicialização restrita da administradora, perfis, consentimento, bloqueio de datas anteriores, duplicações, pontuação, empates, privacidade da classificação, isolamento de registros, eventos da turma, avaliações privadas e bloqueio de acesso inativo. Usam armazenamento e identidade simulados; a homologação real de login, envio de e-mails e upload depende da hospedagem e das variáveis de produção.

Ainda não incluídos: questionário pré-consulta dedicado, foto de perfil, fotos no feed, conquistas com critérios configuráveis, notificações push/e-mail, lembretes automáticos fora do app, relatório exportável e integração com WebDiet.
