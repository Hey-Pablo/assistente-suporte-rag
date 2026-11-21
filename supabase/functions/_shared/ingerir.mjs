import { dividirTexto } from './trechos.mjs';

export async function ingerir(artigo, { embeddings, repositorio, tamanho = 375, sobreposicao = 50 }) {
  if (!artigo?.id || typeof artigo.conteudo !== 'string' || !artigo.conteudo.trim() || artigo.conteudo.length > 200000) throw new Error('Artigo inválido');
  const textos = dividirTexto(artigo.conteudo, tamanho, sobreposicao);
  const trechos = [];
  for (const [ordem, conteudo] of textos.entries()) {
    const embedding = await embeddings.gerar(conteudo);
    if (!Array.isArray(embedding) || !embedding.length || !embedding.every(Number.isFinite)) throw new Error('Embedding inválido');
    trechos.push({ ordem, conteudo, embedding });
  }
  await repositorio.substituir(artigo.id, trechos);
  return trechos.length;
}
