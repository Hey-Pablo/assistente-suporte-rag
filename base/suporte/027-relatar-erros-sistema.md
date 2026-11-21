---
id: artigo-027
titulo: "Como relatar erros do sistema de forma eficaz"
categoria: "Suporte"
---

## Como relatar erros do sistema de forma eficaz

Relatar erros de forma clara e completa ajuda a equipe de desenvolvimento a resolver problemas mais rapidamente. Este artigo explica como criar um bug report eficaz.

### Estrutura do relato

#### 1. Título

- **Ruim**: "Não funciona"
- **Bom**: "Erro ao salvar cliente - campo CPF com máscara inválida"

#### 2. Descrição resumida

Conte de 1 a 3 frases explicando o problema em linguagem clara.

#### 3. Passos para reproduzir

Lista numerada das ações que levam ao erro:

1. Acesse "Cadastros" > "Clientes"
2. Clique em "Novo"
3. Preencha o CPF com máscara
4. Clique em "Salvar"
5. Observe a mensagem de erro

#### 4. Comportamento esperado

O que deveria acontecer. Ex.: "Cliente salvo com sucesso"

#### 5. Comportamento atual

O que acontece. Ex.: "Mensagem 'Formato inválido' aparece"

#### 6. Ambiente

```
Sistema: Sistema ERP v2.5.1
Browser: Chrome 120.0.6099.129
SO: Windows 11
Usuário: admin@empresa.com
```

#### 7. Anexos

- Captura de tela
- Arquivo de log
- Vídeo curto (se útil)

### Template de bug report

```markdown
## Título
[Descrição curta e específica]

## Descrição
[Explicação clara do problema]

## Passos para reproduzir
1. [Primeira ação]
2. [Segunda ação]
3. ...

## Comportamento esperado
[O que deveria acontecer]

## Comportamento atual
[O que está acontecendo]

## Ambiente
- Sistema: [Versão]
- Browser: [Nome e versão]
- SO: [Sistema operacional]
- Usuário: [Se relevante]

## Anexos
[Tela, logs, vídeos]
```

### Regra do "Reproduzível 100%"

Antes de enviar:
- Teste com outro usuário
- Teste em outro dispositivo
- Teste em horário diferente

### Informações úteis extras

- **ID do cliente**: Se problema específico
- **Horário exato**: Para verificar logs
- **Erros específicos**: Código de erro completo
- **Dados de teste**: CP/CNPJ fictício para validação

### Problemas recorrentes a documentar

#### Validações complicadas

- Máscara de CPF/CNPJ insensata
- Validações repetidas desnecessárias
- Mensagens de erro genéricas

#### Performance

- Tela carregando muito lento
- Busca sem resultado após timeout
- Download travando

#### Integração

- Conexão com bancos de dados
- Envio de e-mail falhando
- Exportação para Excel corrompendo

### Como evitar duplicação

Antes de reportar:
1. Pesquise por título semelhante
2. Use palavras-chave específicas
3. Consulte a lista de problemas conhecidos

### Quando a equipe deve investigar

- **Imediato**: Sistema offline, dados corrompidos
- **Urgente**: Erro em transação financeira
- **Normal**: Problemas recorrentes ou melhorias
- **Futuro**: Solicitações de funcionalidades