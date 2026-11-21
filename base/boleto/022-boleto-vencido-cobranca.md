---
id: artigo-022
titulo: "Como cobrar boleto vencido e negociar dívida"
categoria: "Boleto"
---

## Como cobrar boleto vencido e negociar dívida

Boletos vencidos exigem ações de cobrança e, muitas vezes, negociação. Este artigo cobre o fluxo desde o vencimento até a regularização.

### Fluxo padrão após vencimento

```
Vencimento (D+0)
    │
    ├── D+1 a D+5: Lembrete amigável (e-mail/WhatsApp)
    │
    ├── D+6 a D+15: Cobrança ativa (telefone, carta)
    │
    ├── D+16 a D+30: Cobrança formal (carta registrada, protesto)
    │
    └── D+31+: Negociação, protesto ou judicial
```

### Ações por faixa de atraso

#### 1 a 5 dias (Lembrete amigável)

- **Canal**: E-mail automático + WhatsApp (se opt-in)
- **Tom**: Cortês, informativo
- **Conteúdo**: "Seu boleto venceu em DD/MM. Para evitar juros, pague pelo link: [link 2ª via]"
- **Automatização**: Regra no ERP para disparo no D+1

#### 6 a 15 dias (Cobrança ativa)

- **Canal**: Telefone + E-mail com urgência
- **Tom**: Firme mas respeitoso
- **Conteúdo**: Valor atualizado com juros/multa, opção de parcelamento
- **Registro**: Gravar ligação ou registrar no CRM

#### 16 a 30 dias (Cobrança formal)

- **Canal**: Carta registrada (AR) + E-mail com aviso de protesto
- **Documento**: Carta de cobrança com dados completos (cedente, sacado, valor, vencimento, juros)
- **Aviso**: "Decorrido 30 dias, título será encaminhado a protesto cartorial"
- **Protesto**: Enviar instrução via remessa CNAB (código 06) se autorizado

#### 30+ dias (Negociação/Judicial)

- **Opções**:
  1. **Parcelamento** - Entrada + parcelas fixas (formalizar em termo)
  2. **Desconto à vista** - Até 20-30% sobre valor total
  3. **Protesto** - Cartório (custo por conta do devedor)
  4. **Negativação** - Serasa/SPC (se contrato permitir)
  5. **Judicial** - Ação de cobrança (último recurso)

### Negociação de dívida

#### Parâmetros negociáveis

| Item | Flexibilidade típica |
|------|---------------------|
| Entrada | 10-30% do valor total |
| Número de parcelas | 2x a 12x (conforme valor) |
| Juros de parcelamento | 1-2% a.m. (ou isento) |
| Desconto à vista | 10-30% sobre total |
| Carência | 15-30 dias para 1ª parcela |

#### Formalização

1. **Termo de confissão de dívida** - Assinado digital ou fisicamente
2. **Novos boletos** - Gerar parcelas com vencimentos acordados
3. **Baixa do título original** - Após pagamento da entrada (ou 1ª parcela)
4. **Registro no ERP** - Flag "Renegociado" no título original

### Protesto em cartório

#### Quando protestar

- Título > 30 dias vencido
- Tentativas de contato esgotadas
- Valor justifica custo (geralmente > R$ 100,00)

#### Procedimento

1. **Verifique se título permite protesto** - Alguns bancos/convênios não permitem
2. **Gere remessa CNAB** - Código ocorrência 06 (protestar)
3. **Aguarde retorno** - Código 19 (confirmado) ou 20 (sustado)
4. **Custos** - Emolumentos cartoriais + taxa banco (repassar ao devedor)

#### Após protesto

- Título fica "Protestado" no sistema
- Devedor deve pagar no cartório + custas
- Baixa via retorno CNAB (código 23)
- Para sustar: remessa código 09 → retorno código 24

### Juros e multa (conforme legislação)

| Item | Limite legal | Cálculo |
|------|-------------|---------|
| **Multa** | 2% (uma única vez) | Valor original × 2% |
| **Juros de mora** | 1% ao mês (pro rata die) | Valor original × (dias_atraso/30) × 1% |
| **Correção monetária** | Índice contratual (IGPM, IPCA) | Se previsto em contrato |

> **Nota**: Juros > 1% a.m. ou multa > 2% podem ser considerados abusivos (CDC Art. 52).

### Boletos de alto valor / PJ

- **Análise de crédito prévia** - Antes de negociar parcelamento longo
- **Garantias** - Cheque caução, nota promissória, alienação fiduciária
- **Contrato de confissão de dívida** - Com cláusula de execução extrajudicial
- **Advogado** - Envolver para valores > R$ 20.000,00

### Automação recomendada no ERP

1. **Régua de cobrança configurável** - Dias, canais, templates por faixa
2. **Cálculo automático** - Juros/multa atualizados diariamente
3. **Geração de 2ª via integrada** - Link no e-mail/WhatsApp
4. **Integração CNAB** - Remessa protesto/baixa / Retorno processamento
5. **Dashboard de inadimplência** - Aging, valores, ações pendentes
6. **Log de contatos** - Gravação/registro obrigatório para compliance

### Checklist de cobrança

- [ ] Boleto vencido identificado (relatório diário D+1)
- [ ] 2ª via gerada e link funcional
- [ ] Lembrete D+1 disparado
- [ ] Contato telefônico D+5 a D+10 registrado
- [ ] Carta AR D+15 enviada (se > R$ 500)
- [ ] Instrução protesto D+30 enviada (se aplicável)
- [ ] Negociação documentada (termo assinado)
- [ ] Novos boletos de parcelamento gerados
- [ ] Baixa original após entrada/1ª parcela
- [ ] Conciliação bancária conferida