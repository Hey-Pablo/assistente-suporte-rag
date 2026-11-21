import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite-pgvector';

test('migração isola conversas por usuário e busca trechos semelhantes', async () => {
  const db = await PGlite.create({ extensions: { vector } });
  try {
  await db.exec(`create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$; grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`);
  await db.exec(await readFile('supabase/migrations/20261121000000_rag.sql', 'utf8'));
  await db.exec(await readFile('supabase/migrations/20261121000001_ingestao.sql', 'utf8'));
  await db.exec(await readFile('supabase/migrations/20261121000002_limite.sql', 'utf8'));
  const a = '00000000-0000-0000-0000-000000000001', b = '00000000-0000-0000-0000-000000000002';
  await db.query('insert into auth.users values ($1), ($2)', [a,b]);
  await db.query("insert into public.conversas(id, usuario_id) values ('10000000-0000-0000-0000-000000000001',$1), ('10000000-0000-0000-0000-000000000002',$2)", [a,b]);
  const vetor = `[${[1, ...Array(1535).fill(0)].join(',')}]`;
  const artigo = (await db.query("insert into public.artigos(titulo, conteudo) values ('Impressora', 'Reinicie a fila') returning id")).rows[0].id;
  await db.query('insert into public.trechos(artigo_id, ordem, conteudo, embedding) values ($1, 0, $2, $3)', [artigo, 'Reinicie a fila', vetor]);
  await db.exec('set role authenticated');
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [a]);
  assert.equal((await db.query('select * from public.conversas')).rows.length, 1);
  const busca = await db.query('select titulo, similaridade from public.buscar_trechos($1)', [vetor]);
  assert.equal(busca.rows[0].titulo, 'Impressora');
  assert.equal(busca.rows[0].similaridade, 1);
  await assert.rejects(db.query('insert into public.conversas(usuario_id) values ($1)', [b]));
  for (let i = 0; i < 20; i++) assert.equal((await db.query('select public.consumir_limite() as permitido')).rows[0].permitido, true);
  assert.equal((await db.query('select public.consumir_limite() as permitido')).rows[0].permitido, false);
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [b]);
  assert.equal((await db.query('select public.consumir_limite() as permitido')).rows[0].permitido, true);
  await assert.rejects(db.query('select * from public.uso_diario'));
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [a]);
  await assert.rejects(db.query('select public.substituir_trechos($1, $2::jsonb)', [artigo, JSON.stringify([{ordem: 0, conteudo: 'forjado', embedding: JSON.parse(vetor)}])]));
  assert.equal((await db.query('select conteudo from public.trechos')).rows[0].conteudo, 'Reinicie a fila');
  await db.exec('reset role');
  await db.query('insert into public.administradores values ($1)', [a]);
  await db.exec('set role authenticated');
  await assert.rejects(db.query('select public.substituir_trechos($1, $2::jsonb)', [artigo, JSON.stringify([{ordem: 0, conteudo: 'inválido', embedding: [1]}])]));
  assert.equal((await db.query('select conteudo from public.trechos')).rows[0].conteudo, 'Reinicie a fila');
  } finally { await db.close(); }
});
