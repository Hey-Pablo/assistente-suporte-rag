import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dividirTexto } from '../supabase/functions/_shared/trechos.mjs';

test('divide texto com sobreposição sem perder palavras', () => {
  const texto = Array.from({ length: 12 }, (_, i) => `p${i}`).join(' ');
  assert.deepEqual(dividirTexto(texto, 5, 2), [
    'p0 p1 p2 p3 p4', 'p3 p4 p5 p6 p7', 'p6 p7 p8 p9 p10', 'p9 p10 p11'
  ]);
});

test('rejeita parâmetros inválidos e ignora texto vazio', () => {
  assert.deepEqual(dividirTexto('  '), []);
  assert.throws(() => dividirTexto('texto', 5, 5), RangeError);
  assert.throws(() => dividirTexto('texto', 0, 0), RangeError);
});
