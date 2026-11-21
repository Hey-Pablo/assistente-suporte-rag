---
id: artigo-021
titulo: "Como processar arquivo retorno CNAB 400 para baixa de boletos"
categoria: "Boleto"
---

## Como processar arquivo retorno CNAB 400 para baixa de boletos

O arquivo retorno CNAB 400 (layout 400 posições) é o padrão bancário para informar liquidações, baixas, protestos e outras ocorrências. O processamento correto mantém a conciliação bancária atualizada.

### Estrutura do arquivo CNAB 400

Cada linha tem **exatamente 400 caracteres**. Principais segmentos:

| Segmento | Posição | Descrição |
|----------|---------|-------------|
| Header | 1 | Identificação do arquivo (código banco, cedente, data geração) |
| Detalhe | 2-399 | Uma linha por título/ocorrência |
| Trailer | 400 | Totais e controle |

### Códigos de ocorrência principais (posição 108-109 do detalhe)

| Código | Descrição | Ação no sistema |
|--------|-----------|-----------------|
| **02** | Entrada confirmada | Marcar boleto como "Registrado" |
| **03** | Entrada rejeitada | Verificar motivo (pos. 110-111), corrigir e reenviar |
| **06** | Liquidação normal | Baixar título, data pagamento = pos. 110-115 |
| **09** | Baixa automática | Título baixado pelo banco (vencido > X dias) |
| **10** | Baixa por solicitação | Confirmação de baixa solicitada via remessa |
| **11** | Títulos em cartório | Encaminhar para protesto |
| **12** | Abatimento concedido | Atualizar valor com abatimento (pos. 220-232) |
| **13** | Abatimento cancelado | Restaurar valor original |
| **14** | Vencimento alterado | Atualizar data vencimento (pos. 146-151) |
| **19** | Confirmação instrução protesto | Título em cartório confirmado |
| **20** | Sustar protesto | Retirar de cartório |
| **23** | Protesto realizado | Baixar com flag protestado |
| **24** | Sustação protesto confirmada | Título retirado de cartório |

### Campos essenciais do detalhe (liquidação - código 06)

| Posição | Tamanho | Campo | Descrição |
|---------|---------|-------|-----------|
| 1 | 1 | Código registro | "1" = detalhe |
| 2-4 | 3 | Código banco | Ex: 001, 237, 341 |
| 5-8 | 4 | Agência | Com dígito |
| 9-17 | 9 | Conta corrente | Com dígito |
| 18-25 | 8 | Nosso Número | Identificador do título |
| 26-26 | 1 | Carteira | Tipo de cobrança |
| 108-109 | 2 | Código ocorrência | "06" = liquidação |
| 110-115 | 6 | Data pagamento | DDMMAA |
| 116-129 | 14 | Valor pago | Em centavos (sem vírgula) |
| 130-143 | 14 | Valor juros/mora | Em centavos |
| 144-157 | 14 | Valor desconto | Em centavos |
| 158-171 | 14 | Valor abatimento | Em centavos |
| 172-173 | 2 | Código moeda | "09" = Real |
| 174-179 | 6 | Data crédito | DDMMAA (crédito em conta) |
| 218-225 | 8 | Data vencimento | DDMMAA |
| 226-233 | 8 | Data emissão | DDMMAA |

### Processamento passo a passo

#### 1. Receba o arquivo

- Download via portal do banco, API ou e-mail
- Salve em pasta de processamento (ex: `/retornos/bb_20240315.ret`)

#### 2. Valide estrutura

```bash
# Verificar linhas = 400 chars
awk 'length != 400 {print NR ": " length}' retorno.txt

# Verificar header (primeira linha)
head -1 retorno.txt | cut -c1  # Deve ser "0"

# Verificar trailer (última linha)
tail -1 retorno.txt | cut -c1  # Deve ser "9"
```

#### 3. Parse e processe cada detalhe

```python
def processar_retorno(caminho_arquivo):
    with open(caminho_arquivo, 'r') as f:
        linhas = f.readlines()
    
    # Header
    header = linhas[0]
    banco = header[1:4]
    data_geracao = header[94:100]  # DDMMAA
    
    # Detalhes
    for linha in linhas[1:-1]:
        if len(linha) != 400:
            continue  # Log erro
        
        codigo_ocorrencia = linha[107:109]
        nosso_numero = linha[17:25].strip()
        
        if codigo_ocorrencia == '06':  # Liquidação
            data_pagto = linha[109:115]  # DDMMAA
            valor_pago = int(linha[115:129]) / 100
            valor_juros = int(linha[129:143]) / 100
            valor_desc = int(linha[143:157]) / 100
            data_credito = linha[173:179]  # DDMMAA
            
            # Atualizar no sistema
            baixar_titulo(nosso_numero, data_pagto, valor_pago, 
                         valor_juros, valor_desc, data_credito)
        
        elif codigo_ocorrencia == '02':  # Entrada confirmada
            confirmar_registro(nosso_numero)
        
        elif codigo_ocorrencia == '03':  # Rejeitado
            motivo = linha[109:111]
            registrar_rejeicao(nosso_numero, motivo)
    
    # Trailer
    trailer = linhas[-1]
    total_titulos = int(trailer[17:23])
    valor_total = int(trailer[23:37]) / 100
```

#### 4. Conciliação pós-processamento

- Compare total processado vs. trailer do arquivo
- Gere relatório de exceções (ocorrências não tratadas)
- Confirme créditos em conta corrente no extrato bancário

### Arquivo remessa (envio de instruções)

Para solicitar baixas, protestos ou alterações, gere arquivo remessa CNAB 400:

| Instrução | Código (pos. 108-109) | Uso |
|-----------|----------------------|-----|
| Baixa | 02 | Solicitar baixa de título vencido |
| Protestar | 06 | Enviar a cartório |
| Sustar protesto | 09 | Retirar de cartório |
| Alterar vencimento | 04 | Nova data em pos. 146-151 |
| Conceder abatimento | 07 | Valor em pos. 220-232 |
| Cancelar abatimento | 08 | - |
| Alterar dados pagador | 31 | Novo nome/endereço |

### Problemas comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| Nosso Número não encontrado | Diferença de formatação (zeros à esquerda) | Padronize: sempre 8-17 dígitos conforme banco |
| Valor pago diferente | Juros/desconto não esperados | Sistema deve aceitar valor pago ≠ valor original |
| Data crédito ≠ data pagamento | Banco credita no dia útil seguinte | Use data crédito para conciliação financeira |
| Linha com tamanho errado | Arquivo corrompido ou layout diferente | Valide layout com manual do banco |
| Ocorrência não tratada | Código novo ou raro | Log e trate manualmente; atualize parser |

### Boas práticas

1. **Processe diariamente** - Não acumule arquivos retorno
2. **Log completo** - Guarde arquivo original + log de processamento
3. **Idempotência** - Reprocessar mesmo arquivo não duplica baixas
4. **Validação cruzada** - Confira com extrato bancário (API ou OFX)
5. **Teste em homologação** - Use arquivos de teste do banco antes de produção