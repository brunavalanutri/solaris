-- Projeto novo e exclusivo Solaris. Sem dependências dos outros aplicativos.
create table public.solaris_state (
  id text primary key check (id = 'main'),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  revision bigint not null default 0 check (revision >= 0)
);

-- Os dados clínicos são lidos e filtrados exclusivamente pela API do servidor.
-- Clientes anon/authenticated não têm acesso direto ao estado da turma.
alter table public.solaris_state enable row level security;
revoke all on table public.solaris_state from public, anon, authenticated;
grant select, insert, update on table public.solaris_state to service_role;
create policy solaris_server_only on public.solaris_state
  for all to service_role using (true) with check (true);

-- Sem bucket público nem políticas de leitura para clientes anônimos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('solaris-private', 'solaris-private', false, 5242880,
  array['application/pdf','image/jpeg','image/png','image/webp']);
