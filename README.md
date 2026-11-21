# Assistente de Suporte com RAG

> **Status: Passo 1 em revisão.** Criação da base de conhecimento em andamento.

## O que é

Chat que responde dúvidas de suporte usando apenas uma base de conhecimento, cita os artigos de origem e admite quando não sabe. As perguntas sem resposta viram lista de lacunas para o administrador.

## O que prova

IA aplicada com responsabilidade: busca semântica, resposta fundamentada, medição de qualidade e segurança das chaves.

## Passo 1 em Andamento

**Base de conhecimento:** 32 artigos fictícios em Markdown com procedimentos de suporte ERP organizados por categoria:

### Estrutura dos Artigos

| Categoria | Quantidade | Exemplos |
|-----------|------------|----------|
| Impressora Fiscal | 12 artigos | Reinício, limpeza, reset, diagnóstico, calibragem, bateria, tiração, fila de impressão, relatórios fiscais, selo fiscal |
| NF-e | 4 artigos | Rejeição de campos XML, UF do destinatário, certificado digital, QR Code |
| Acesso Remoto | 4 artigos | Acesso via telefone, TeamViewer, SSH, VPN corporativa |
| Boleto | 4 artigos | Configuração de código do banco, validação linha digitável, baixa CNAB, negociação de vencido |
| Rede | 2 artigos | Diagnóstico de DNS, teste de conectividade |
| Suporte | 6 artigos | Classificação de chamados, gestão de tempo, fechamento, backups, atendimento múltiplo, limpeza temporários |

### Formato Dos Artigos

Cada artigo segue o padrão Markdown com frontmatter YAML:

```yaml
---
id: artigo-XXX
titulo: "Como fazer algo específico"
categoria: "Categoria do Artigo"
---
```

### Como Validar

1. Executar `npm run validate` para verificar:
   - Frontmatter válido (id, titulo, categoria)
   - Todos os artigos referenciados em perguntas existem
   - Perguntas CSV está consistente

2. Executar `npm test` para testes automatizados

**Perguntas de avaliação:** 40 perguntas em `avaliacao/perguntas.csv`
- 32 perguntas com artigo_esperado referenciando a base
- 8 perguntas fora da base (não aplicáveis)

## Stack

React e TypeScript. Supabase com PostgreSQL, extensão pgvector, Auth e Edge Functions. Um modelo de embeddings para a busca. Claude (`claude-opus-5-5` como padrão) para a resposta, com o recurso de citações da API: os trechos entram como blocos de documento e a resposta volta apontando o trecho usado.

## Estrutura

```
assistente-suporte-rag/
├─ web/                         # chat, fontes, painel de lacunas
├─ supabase/
│  ├─ migrations/               # artigos, trechos (vector), conversas,
│  │                            # mensagens, função de busca, RLS
│  └─ functions/
│     ├─ ingerir/               # divide, gera embeddings, grava
│     └─ perguntar/             # busca, monta o prompt, responde
├─ base/                        # 30 artigos fictícios em Markdown
│  ├─ impressora-fiscal/
│  ├─ nfe/
│  ├─ acesso-remoto/
│  ├─ boleto/
│  ├─ rede/
│  └─ suporte/
├─ avaliacao/
│  ├─ perguntas.csv             # 40 perguntas, resposta e artigo esperados
│  ├─ validar.ts                # script de validação
│  └─ relatorios/
│  └─ README.md
└─ package.json
```

## Validação

### Executar testes

```bash
npm install
npm test
```

### Executar script de validação

```bash
npm run validate
```

## Próximos passos

2. Banco: tabelas, pgvector e função SQL de busca por similaridade.
3. Ingestão: divisão em trechos de cerca de 500 tokens com sobreposição, embeddings e gravação.
4. Função `perguntar`: embedding da pergunta, busca dos 5 trechos, envio dos trechos como documentos e instrução de responder só com eles.

## Como deve funcionar

- "Como reinicio a fila de impressão?" recebe resposta em passos, com a citação do artigo.
- "Qual o salário do gerente?" recebe "não encontrei na base".
- O administrador vê as perguntas sem resposta e cria artigos para cobrir as lacunas.
- A chave de API não aparece no código do navegador.

## Prazo restante

2 a 3 semanas (passo 1 concluído em 1 dia).

## Demonstração

> **Demonstração:** em breve

## Autor

Pablo Dilio · [Portfólio](https://hey-pablo.github.io/pablo-dilio-portfolio/) · [LinkedIn](https://www.linkedin.com/in/pablo-dilio-4063991b2)