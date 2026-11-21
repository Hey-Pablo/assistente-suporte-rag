# Assistente de Suporte com RAG

> **Status: Passo 1 concluído.** 30 artigos de procedimentos fictícios criados e validados.

## O que é

Chat que responde dúvidas de suporte usando apenas uma base de conhecimento, cita os artigos de origem e admite quando não sabe. As perguntas sem resposta viram lista de lacunas para o administrador.

## O que prova

IA aplicada com responsabilidade: busca semântica, resposta fundamentada, medição de qualidade e segurança das chaves.

## Passo 1 Concluído

**Base de conhecimento:** 30 artigos fictícios em Markdown com procedimentos de suporte ERP organizados por categoria:

- **Impressora Fiscal** (10 artigos): Reinício, limpeza, reset, diagnóstico, calibragem, bateria, tiração, QR Code
- **NF-e** (6 artigos): Rejeição de campos XML, UF do destinatário, certificado digital, QR Code
- **Acesso Remoto** (3 artigos): Acesso via telefone, TeamViewer, SSH
- **Boleto** (4 artigos): Configuração de código do banco, geração de código de barras, RECV
- **Rede** (2 artigos): Diagnóstico de DNS, teste de conectividade
- **Suporte** (5 artigos): Classificação de chamados, gestão de tempo, fechamento, backups, atendimento múltiplo

**Perguntas de avaliação:** 40 perguntas (23 com artigo esperado, 17 fora da base) em `avaliacao/perguntas.csv`

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