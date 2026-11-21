import { test } from 'node:test';
import assert from 'node:assert/strict';
import { perguntar } from '../supabase/functions/_shared/perguntar.mjs';

test('recusa pergunta sem similaridade suficiente e registra lacuna sem chamar chat', async () => {
  let lacuna, chamou = false;
  const resposta = await perguntar('Qual salário?', { embeddings: { gerar: async () => [1] }, repositorio: { buscar: async () => [{ similaridade: 0.2 }], registrarLacuna: async p => { lacuna = p; } }, chat: { responder: async () => { chamou = true; } }, limiar: 0.7 });
  assert.match(resposta.resposta, /não encontrei/i);
  assert.equal(lacuna, 'Qual salário?');
  assert.equal(chamou, false);
});

test('usa somente trechos acima do limiar e retorna fontes identificadas', async () => {
  let mensagens;
  const trechos = [{ id: 't1', artigo_id: 'a1', titulo: 'Fila', conteudo: 'Reinicie.', similaridade: 0.9 }, { id: 't2', similaridade: 0.1 }];
  const resposta = await perguntar('Como reiniciar?', { embeddings: { gerar: async () => [1] }, repositorio: { buscar: async () => trechos }, chat: { responder: async m => { mensagens = m; return 'Reinicie [1].'; } }, limiar: 0.7 });
  assert.equal(resposta.fontes.length, 1);
  assert.equal(resposta.fontes[0].id, 't1');
  assert.match(JSON.stringify(mensagens), /Reinicie/);
  assert.doesNotMatch(JSON.stringify(mensagens), /t2/);
});

test('recusa resposta sem citação válida e registra lacuna', async () => {
  let lacuna = false;
  const resultado = await perguntar('Pergunta', { embeddings: { gerar: async () => [1] }, repositorio: { buscar: async () => [{ id: 't', artigo_id: 'a', titulo: 'T', conteudo: 'Fonte', similaridade: 0.9 }], registrarLacuna: async () => { lacuna = true; } }, chat: { responder: async () => 'Resposta sem referência' } });
  assert.match(resultado.resposta, /não encontrei/i);
  assert.equal(lacuna, true);
});
