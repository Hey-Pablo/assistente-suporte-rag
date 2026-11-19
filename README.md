# Assistente de Suporte com RAG

> **Status: em desenvolvimento.** O código entra aos poucos; abaixo está o planejamento do projeto.

## O que é

Chat que responde dúvidas de suporte usando apenas uma base de conhecimento, cita os artigos de origem e admite quando não sabe. As perguntas sem resposta viram lista de lacunas para o administrador.

## O que prova

IA aplicada com responsabilidade: busca semântica, resposta fundamentada, medição de qualidade e segurança das chaves.

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
├─ avaliacao/
│  ├─ perguntas.csv             # 40 perguntas, resposta e artigo esperados
│  ├─ avaliar.ts
│  └─ relatorios/
└─ README.md
```

## Plano

1. Escreva 30 artigos fictícios de procedimentos: impressora fiscal, rejeição de NF-e, acesso remoto, boleto.
2. Banco: tabelas, pgvector e função SQL de busca por similaridade.
3. Ingestão: divisão em trechos de cerca de 500 tokens com sobreposição, embeddings e gravação.
4. Função `perguntar`: embedding da pergunta, busca dos 5 trechos, envio dos trechos como documentos e instrução de responder só com eles.
5. Chat com fontes clicáveis, que abrem o artigo no trecho citado.
6. Limite de similaridade: abaixo dele, o assistente diz que não encontrou e sugere abrir chamado.
7. Avaliação positiva ou negativa de cada resposta e painel de perguntas sem resposta.
8. Avaliação formal em três medidas: o artigo certo está entre os 5 trechos? A resposta confere com o gabarito? Pergunta fora da base é recusada?
9. Ajuste de tamanho de trecho, quantidade de trechos e prompt com base nos números.
10. Segurança: chave de API só no servidor, limite de uso por usuário e RLS.
11. Publicação e README com as métricas antes e depois dos ajustes.

## Como deve funcionar

- "Como reinicio a fila de impressão?" recebe resposta em passos, com a citação do artigo.
- "Qual o salário do gerente?" recebe "não encontrei na base".
- O administrador vê as perguntas sem resposta e cria artigos para cobrir as lacunas.
- A chave de API não aparece no código do navegador.

## Prazo

3 a 4 semanas.

## Autor

Pablo Dilio · [Portfólio](https://hey-pablo.github.io/pablo-dilio-portfolio/) · [LinkedIn](https://www.linkedin.com/in/pablo-dilio-4063991b2)
