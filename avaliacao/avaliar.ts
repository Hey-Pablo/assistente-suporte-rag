// Execute com Node 22.18+ ou 24: node avaliacao/avaliar.ts <antes|depois>.
async function main() {
  const { executarAvaliacao } = await import('./avaliar.mjs');
  const fase = process.argv[2];
  if (fase !== 'antes' && fase !== 'depois') throw new Error('Informe antes ou depois');
  const config = fase === 'antes'
    ? { tamanho: 375, sobreposicao: 50, topK: 5 }
    : { tamanho: 200, sobreposicao: 40, topK: 3 };
  const nome = `${new Date().toISOString().replace(/[:.]/g, '-')}-${fase}`;
  const relatorio = await executarAvaliacao({ ...config, nome });
  console.log(JSON.stringify(relatorio.metricas, null, 2));
}
main().catch(erro => { console.error(erro.message); process.exitCode = 1; });
