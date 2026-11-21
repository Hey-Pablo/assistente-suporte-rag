create schema if not exists extensions;
create extension if not exists vector with schema extensions;
grant usage on schema extensions to authenticated;

create table public.administradores (
  usuario_id uuid primary key references auth.users(id) on delete cascade
);
create table public.artigos (
  id uuid primary key default gen_random_uuid(), titulo text not null, conteudo text not null,
  criado_em timestamptz not null default now()
);
create table public.trechos (
  id uuid primary key default gen_random_uuid(), artigo_id uuid not null references public.artigos(id) on delete cascade,
  ordem integer not null check (ordem >= 0), conteudo text not null, embedding extensions.vector(1536) not null,
  unique (artigo_id, ordem)
);
create table public.conversas (
  id uuid primary key default gen_random_uuid(), usuario_id uuid not null references auth.users(id) on delete cascade,
  criado_em timestamptz not null default now()
);
create table public.mensagens (
  id uuid primary key default gen_random_uuid(), conversa_id uuid not null references public.conversas(id) on delete cascade,
  papel text not null check (papel in ('usuario','assistente')), conteudo text not null,
  fontes jsonb not null default '[]', criado_em timestamptz not null default now()
);
create table public.avaliacoes (
  mensagem_id uuid primary key references public.mensagens(id) on delete cascade,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  positiva boolean not null
);
create table public.lacunas (
  id uuid primary key default gen_random_uuid(), usuario_id uuid not null references auth.users(id) on delete cascade,
  pergunta text not null, criado_em timestamptz not null default now()
);

create function public.eh_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.administradores where usuario_id = auth.uid());
$$;
revoke all on function public.eh_admin() from public;
grant execute on function public.eh_admin() to authenticated;

alter table public.administradores enable row level security;
alter table public.artigos enable row level security;
alter table public.trechos enable row level security;
alter table public.conversas enable row level security;
alter table public.mensagens enable row level security;
alter table public.avaliacoes enable row level security;
alter table public.lacunas enable row level security;
create policy artigos_leitura on public.artigos for select to authenticated using (true);
create policy artigos_admin on public.artigos for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy trechos_leitura on public.trechos for select to authenticated using (true);
create policy trechos_admin on public.trechos for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy conversas_proprias on public.conversas for all to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy mensagens_proprias on public.mensagens for all to authenticated using (exists (select 1 from public.conversas c where c.id = conversa_id and c.usuario_id = auth.uid())) with check (exists (select 1 from public.conversas c where c.id = conversa_id and c.usuario_id = auth.uid()));
create policy avaliacoes_proprias on public.avaliacoes for all to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid() and exists (select 1 from public.mensagens m join public.conversas c on c.id = m.conversa_id where m.id = mensagem_id and c.usuario_id = auth.uid() and m.papel = 'assistente'));
create policy lacunas_leitura on public.lacunas for select to authenticated using (usuario_id = auth.uid() or public.eh_admin());
create policy lacunas_insercao on public.lacunas for insert to authenticated with check (usuario_id = auth.uid());
grant select, insert, update, delete on public.artigos, public.trechos, public.conversas, public.mensagens, public.avaliacoes, public.lacunas to authenticated;

create function public.buscar_trechos(consulta extensions.vector(1536), quantidade integer default 5)
returns table(id uuid, artigo_id uuid, titulo text, conteudo text, similaridade double precision)
language sql stable security invoker set search_path = '' as $$
  select t.id, t.artigo_id, a.titulo, t.conteudo, 1 - (t.embedding operator(extensions.<=>) consulta)
  from public.trechos t join public.artigos a on a.id = t.artigo_id
  order by t.embedding operator(extensions.<=>) consulta limit least(greatest(quantidade, 1), 5);
$$;
revoke all on function public.buscar_trechos(extensions.vector, integer) from public;
grant execute on function public.buscar_trechos(extensions.vector, integer) to authenticated;
