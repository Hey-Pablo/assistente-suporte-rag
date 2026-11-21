create table public.uso_diario (
  usuario_id uuid not null references auth.users(id) on delete cascade,
  dia date not null, quantidade integer not null check (quantidade > 0),
  primary key (usuario_id, dia)
);
alter table public.uso_diario enable row level security;
create function public.consumir_limite() returns boolean
language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  if auth.uid() is null then raise exception 'Não autenticado' using errcode = '42501'; end if;
  insert into public.uso_diario(usuario_id, dia, quantidade) values (auth.uid(), (now() at time zone 'UTC')::date, 1)
  on conflict (usuario_id, dia) do update set quantidade = public.uso_diario.quantidade + 1
  where public.uso_diario.quantidade < 20 returning quantidade into n;
  return n is not null;
end;
$$;
revoke all on function public.consumir_limite() from public;
grant execute on function public.consumir_limite() to authenticated;
