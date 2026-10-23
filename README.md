# Solaris

Aplicativo de acompanhamento de Nutrição + Endocrinologia com interface estática e API protegida no Supabase exclusivo do SOLARIS.

## Acesso

- Pacientes: https://solaris-pi-black.vercel.app/paciente
- Administradora e profissionais: https://solaris-pi-black.vercel.app/equipe
- Paciente modelo isolada: https://solaris-pi-black.vercel.app/modelo

O login é por e-mail cadastrado e senha definida pela própria pessoa no primeiro acesso. As sessões de cada área são independentes.

## Cadastro e primeiro acesso

Somente a administradora cadastra participantes e profissionais. Ao salvar, o sistema cria a conta e mostra um link individual para definir senha. A administradora copia e compartilha esse link diretamente com a pessoa cadastrada. Não depende de envio de e-mail pelo Supabase, código numérico ou confirmação por e-mail.

Ao abrir o link, a pessoa vê o e-mail da conta validada, escolhe e confirma uma senha de pelo menos 8 caracteres. Depois entra normalmente com e-mail e senha.

Os links usam tokens nativos de uso único do Supabase Auth, com prazo de validade, no fragmento da URL. Nenhuma senha ou token de ativação é armazenado no documento da turma, na auditoria ou no GitHub. O link não deve ser compartilhado com outras pessoas.

A administradora pode gerar outro link usando "Link de acesso" no cadastro da pessoa ou na lista de profissionais. O novo link também permite redefinir uma senha esquecida.

A conta inicial da administradora usa brunavalanutri@gmail.com. Seu link de ativação é fornecido diretamente à titular e não consta neste repositório.

## Publicação e proteção

Importe este repositório na Vercel. vercel.json publica somente index.html. Não é necessário cadastrar variáveis na Vercel. static-src preserva o código React; supabase/functions/solaris-api preserva a API.

A API confere a identidade e o perfil antes de retornar dados. A URL não concede permissões. A paciente modelo recebe somente dados fictícios em modo de visualização, sem acessar registros reais.

As rotas antigas de solicitação de código estão desativadas. A data de nascimento é opcional no cadastro e não é senha.

## Validação

Testados: cadastro restrito à administradora, geração protegida de link, ausência de senha/token no estado, formulário de senha e confirmação, login nas duas áreas e isolamento do modelo. Um teste real com a conta modelo validou token de uso único, definição de senha e login com a senha definida; o acesso original do modelo foi restaurado após o teste.
