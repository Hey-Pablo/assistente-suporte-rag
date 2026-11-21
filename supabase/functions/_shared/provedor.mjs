export function provedorCompativel({ baseUrl, apiKey, embeddingModel, chatModel, fetchImpl = fetch }) {
  if (!baseUrl || !apiKey) throw new Error('Provedor não configurado');
  const url = new URL(baseUrl);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) throw new Error('URL do provedor inválida');
  async function requisitar(path, body) {
    const resposta = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body), redirect: 'error', signal: AbortSignal.timeout(30000),
    });
    if (!resposta.ok) throw new Error('Falha no provedor');
    return resposta.json();
  }
  return {
    embeddings: { async gerar(texto) { return (await requisitar('embeddings', { model: embeddingModel, input: texto })).data?.[0]?.embedding; } },
    chat: { async responder(mensagens) { return (await requisitar('chat/completions', { model: chatModel, messages: mensagens, max_tokens: 700 })).choices?.[0]?.message?.content; } },
  };
}

export function provedorFake({ vetor, resposta }) {
  return { embeddings: { gerar: async () => [...vetor] }, chat: { responder: async () => resposta } };
}
