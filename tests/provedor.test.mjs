import { test } from 'node:test';
import assert from 'node:assert/strict';
import { provedorFake, provedorCompativel } from '../supabase/functions/_shared/provedor.mjs';

test('provedor falso não acessa rede e retorna valores definidos', async () => {
  const fake = provedorFake({ vetor: [1, 0], resposta: 'Teste [1]' });
  assert.deepEqual(await fake.embeddings.gerar('texto'), [1, 0]);
  assert.equal(await fake.chat.responder([]), 'Teste [1]');
});

test('provedor envia chave apenas ao endpoint configurado', async () => {
  let destino, opcoes;
  const p = provedorCompativel({ baseUrl: 'https://exemplo.invalid/v1', apiKey: 'falsa', embeddingModel: 'teste', fetchImpl: async (url, opts) => { destino = url; opcoes = opts; return { ok: true, json: async () => ({ data: [{ embedding: [1] }] }) }; } });
  assert.deepEqual(await p.embeddings.gerar('teste'), [1]);
  assert.equal(destino, 'https://exemplo.invalid/v1/embeddings');
  assert.equal(opcoes.redirect, 'error');
});

test('solicita dimensões e registra modelo informado pelo provedor', async () => {
  let corpo; const modelos = [];
  const p = provedorCompativel({ baseUrl: 'https://exemplo.invalid/v1', apiKey: 'falsa', embeddingModel: 'teste', dimensoes: 1536, aoReceberModelo: (tipo, modelo) => modelos.push([tipo, modelo]), fetchImpl: async (_url, opts) => { corpo = JSON.parse(opts.body); return { ok: true, json: async () => ({ model: 'modelo-real', data: [{ embedding: [1] }] }) }; } });
  await p.embeddings.gerar('teste');
  assert.equal(corpo.dimensions, 1536);
  assert.deepEqual(modelos, [['embeddings', 'modelo-real']]);
});
