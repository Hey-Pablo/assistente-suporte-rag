import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ingerir } from '../supabase/functions/_shared/ingerir.mjs';

test('gera embeddings antes de substituir todos os trechos', async () => {
  const gravados = [];
  const n = await ingerir({ id: 'artigo', conteudo: 'um dois tres quatro cinco' }, {
    embeddings: { gerar: async texto => [texto.length, 1] },
    repositorio: { substituir: async (id, trechos) => gravados.push({ id, trechos }) },
    tamanho: 3, sobreposicao: 1,
  });
  assert.equal(n, 2);
  assert.deepEqual(gravados[0].trechos.map(t => t.conteudo), ['um dois tres', 'tres quatro cinco']);
});

test('falha de embedding não altera os trechos anteriores', async () => {
  let gravou = false;
  await assert.rejects(ingerir({ id: 'artigo', conteudo: 'texto' }, { embeddings: { gerar: async () => { throw Error('falha'); } }, repositorio: { substituir: async () => { gravou = true; } } }));
  assert.equal(gravou, false);
});
