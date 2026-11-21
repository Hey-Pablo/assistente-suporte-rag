# Assistente de Suporte com RAG

> **Demonstração:** em breve

> **Status: em desenvolvimento.** O backend inicial está em construção; os artigos fictícios e a avaliação formal ainda estão em desenvolvimento.

## Problema e solução

O suporte precisa localizar procedimentos sem inventar respostas. O backend divide artigos em trechos, gera embeddings e busca até cinco trechos por similaridade. A resposta recebe os trechos e deve citá-los; abaixo do limiar, ou quando o modelo não apresenta citações válidas, o sistema informa que não encontrou e registra uma lacuna. A revisão humana continua necessária: citações válidas não provam que o texto gerado está correto.

## Componentes

- `web/`: login, chat, fontes, avaliações e painel de lacunas.
- `supabase/migrations/`: tabelas, pgvector, busca, RLS, substituição transacional e limite diário.
- `supabase/functions/ingerir/`: ingestão autenticada, disponível somente a administradores.
- `supabase/functions/perguntar/`: pergunta autenticada, busca, geração e registro de mensagens.
- `supabase/functions/_shared/`: lógica independente do runtime e adaptadores de provedor, inclusive falso para testes.
- `tests/`: testes Node e SQL com PGlite e pgvector, sem banco externo.

## Configurar sua chave

Cada instalação usa suas próprias credenciais. Configure o [FreeLLMAPI](https://github.com/ou-pingping/FreeLLMAPI) ou outro provedor compatível com a API OpenAI. O FreeLLMAPI é um gateway que precisa estar instalado e configurado; seus provedores e modelos disponíveis variam. Crie uma chave no painel do gateway e configure um modelo de embeddings de **1536 dimensões** e um modelo de chat. Confirme que o plano escolhido é gratuito antes de utilizá-lo.

Copie `.env.example` para `.env` e preencha `BASE_URL`, `API_KEY`, `EMBEDDING_MODEL` e `MODEL`. O exemplo usa `http://localhost:3001/v1` para desenvolvimento local; em uma Edge Function remota, `localhost` aponta para o ambiente da função, não para o computador pessoal. Use um endpoint HTTPS acessível pela função. A chave é usada somente no servidor e não deve ser enviada ao navegador nem ao GitHub. Defina `LIMIAR_SIMILARIDADE` entre 0 e 1; o padrão é 0,75. Trocar de modelo de embedding exige reingerir todos os artigos.

## Executar e testar

Requisitos: Node.js, npm e Supabase CLI com Docker para o ambiente Supabase local. Para executar apenas os testes automatizados, Docker não é necessário:

```sh
npm ci --ignore-scripts
npm test
```

Para iniciar a interface, copie `web/.env.example` para `web/.env` e configure a URL e a chave **pública** (anon/publishable) do Supabase local. Não coloque a chave do provedor de IA nem a service role em variáveis `VITE_`. A sessão fica somente na memória da página; atualizar exige novo login. Configure `WEB_ORIGIN=http://localhost:5173` no ambiente da Edge Function, com a origem exata da interface. Em produção use a origem HTTPS autorizada.

```sh
cd web
npm ci --ignore-scripts
npm test
npm run build
npm run dev
```

O administrador precisa estar cadastrado em `administradores` pelo operador. O painel depende da RLS, não da ocultação do botão. A fonte abre o artigo e destaca o trecho quando ele está presente literalmente; caso contrário, mostra o trecho citado junto ao artigo.

No computador com Supabase CLI e Docker, inicie o Supabase local, aplique as migrações e sirva as funções com o arquivo de ambiente:

```sh
supabase init
supabase start
supabase db reset
supabase functions serve --env-file .env
```

Crie um usuário pelo Supabase Auth. Para habilitar ingestão, um operador do banco deve inserir o UUID desse usuário em `public.administradores`; usuários comuns não podem se promover. Cadastre um artigo fictício em `artigos` como administrador e invoque `ingerir` com seu JWT e `{ "artigo_id": "UUID" }`. Crie uma conversa própria e invoque `perguntar` com seu JWT e `{ "conversa_id": "UUID", "pergunta": "Como reiniciar a fila?" }`. Use o endereço e a chave pública do projeto Supabase para as chamadas; as funções recebem `SUPABASE_URL` e `SUPABASE_ANON_KEY` do ambiente Supabase. Não use dados reais ou segredos em exemplos.

No PC, valide também a autenticação real, as políticas RLS com dois usuários e um administrador, ingestão, modelo com vetor de 1536 dimensões, citações, recusa, lacunas e limite de 20 perguntas por usuário por dia UTC. Os testes PGlite simulam `auth.uid()` e não substituem essa integração real. O limite conta tentativas, inclusive falhas posteriores à reserva. O contador é atualizado atomicamente no banco.

## Base de conhecimento

`base/` reúne 30 artigos fictícios de suporte a ERP (impressora fiscal, NF-e, acesso remoto, boleto, rede e atendimento), em Markdown com frontmatter (`id`, `titulo`, `categoria`). `avaliacao/perguntas.csv` tem 40 perguntas com resposta e artigo esperados; 8 são propositalmente alheias à base e devem ser recusadas. `tests/validar-base.test.cjs` confere frontmatter, ids únicos, existência dos artigos citados e a proporção de perguntas fora da base. Todo o conteúdo é fictício.


## Decisões e limitações

A divisão aproxima 500 tokens por 375 palavras, com sobreposição de 50 palavras; não usa tokenizador específico. A busca é exata e usa distância de cosseno, sem índice vetorial nesta fase. O limiar inicial ainda precisa de avaliação formal. Artigos e trechos são compartilhados entre usuários autenticados; conversas e mensagens são isoladas por usuário, enquanto administradores também podem ler lacunas. O prompt orienta o modelo a ignorar instruções nos trechos, mas isso não é uma barreira de segurança nem garante ausência de alucinação. Não envie informações sensíveis ao provedor. O projeto ainda não possui 30 artigos fictícios, avaliação formal ou deploy.

Próximos passos: criar a base fictícia e avaliar recuperação e respostas antes de ajustar o limiar. A IA foi usada como apoio à implementação; o código e os testes devem ser revisados pelo autor.

## Autor

Pablo Dilio · [Portfólio](https://hey-pablo.github.io/pablo-dilio-portfolio/) · [LinkedIn](https://www.linkedin.com/in/pablo-dilio-4063991b2)
