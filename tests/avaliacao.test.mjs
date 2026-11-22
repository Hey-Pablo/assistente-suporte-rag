import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avaliarCasos } from '../avaliacao/avaliar.mjs';

test('calcula as três medidas com denominadores distintos', async () => {
  const casos = [
    { pergunta: 'A', resposta_esperada: 'sim', artigo_esperado: 'a' },
    { pergunta: 'B', resposta_esperada: 'não', artigo_esperado: 'b' },
    { pergunta: 'C', resposta_esperada: '', artigo_esperado: '' },
  ];
  const resultados = [
    { encontrados: [{ artigo_id: 'a' }], resposta: 'sim', recusada: false },
    { encontrados: [{ artigo_id: 'outro' }], resposta: 'errado', recusada: false },
    { encontrados: [], resposta: 'não sei', recusada: true },
  ];
  let i = 0;
  const resultado = await avaliarCasos(casos, async () => resultados[i++], async ({ resposta }) => resposta === 'sim');
  assert.deepEqual(resultado.metricas, { recuperacao: { acertos: 1, total: 2 }, respostas: { acertos: 1, total: 2 }, recusas: { acertos: 1, total: 1 } });
});

test('interpreta CSV com vírgula e aspas escapadas', async () => {
  const { lerCsv } = await import('../avaliacao/avaliar.mjs');
  assert.deepEqual(lerCsv('pergunta,resposta_esperada,artigo_esperado\n"O que, agora?","Diga ""sim""",a\n'), [{ pergunta: 'O que, agora?', resposta_esperada: 'Diga "sim"', artigo_esperado: 'a' }]);
  assert.throws(() => lerCsv('pergunta,resposta_esperada,artigo_esperado\n"incompleta'), /aspas/);
});

test('falha quando o juiz não retorna um veredito válido', async () => {
  await assert.rejects(avaliarCasos([{ pergunta: 'A', resposta_esperada: 'sim', artigo_esperado: 'a' }], async () => ({ encontrados: [], resposta: 'x' }), async () => 'talvez'), /booleano/);
});
