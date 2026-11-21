/** Divide por palavras, aproximando tokens; tamanho e sobreposição são configuráveis. */
export function dividirTexto(texto, tamanho = 375, sobreposicao = 50) {
  if (!Number.isInteger(tamanho) || !Number.isInteger(sobreposicao) || tamanho < 1 || sobreposicao < 0 || sobreposicao >= tamanho) {
    throw new RangeError('Tamanho e sobreposição inválidos');
  }
  const palavras = texto.trim().split(/\s+/u).filter(Boolean);
  const trechos = [];
  for (let inicio = 0; inicio < palavras.length; inicio += tamanho - sobreposicao) {
    trechos.push(palavras.slice(inicio, inicio + tamanho).join(' '));
    if (inicio + tamanho >= palavras.length) break;
  }
  return trechos;
}
