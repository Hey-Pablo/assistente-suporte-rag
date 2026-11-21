create function public.substituir_trechos(p_artigo_id uuid, p_trechos jsonb) returns void
language plpgsql security invoker set search_path = '' as $$
begin
  if not public.eh_admin() then raise exception 'Acesso negado' using errcode = '42501'; end if;
  if jsonb_typeof(p_trechos) <> 'array' or jsonb_array_length(p_trechos) < 1 or jsonb_array_length(p_trechos) > 1000 then
    raise exception 'Trechos inválidos';
  end if;
  delete from public.trechos where artigo_id = p_artigo_id;
  insert into public.trechos(artigo_id, ordem, conteudo, embedding)
  select p_artigo_id, (item->>'ordem')::integer, item->>'conteudo', (item->'embedding')::text::extensions.vector
  from jsonb_array_elements(p_trechos) item;
end;
$$;
revoke all on function public.substituir_trechos(uuid, jsonb) from public;
grant execute on function public.substituir_trechos(uuid, jsonb) to authenticated;
