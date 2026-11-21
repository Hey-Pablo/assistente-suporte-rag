---
id: artigo-019
titulo: "Como emitir segunda via de boleto"
categoria: "Boleto"
---

## Como emitir segunda via de boleto

A segunda via permite ao pagador quitar o título com data de vencimento atualizada, mantendo a mesma dívida original.

### Quando emitir segunda via

- Boleto vencido e cliente solicita novo prazo
- Boleto perdido ou danificado
- Alteração de dados do sacado (endereço, nome)
- Necessidade de novo vencimento acordado com cliente

### Procedimento no sistema

1. **Localize o título original** - Busque por número do documento, CPF/CNPJ do sacado ou número do boleto

2. **Verifique status** - Título deve estar "Em aberto" ou "Vencido" (não pode estar baixado, protestado ou liquidado)

3. **Selecione "Emitir segunda via"** - Opção geralmente no menu de ações do título

4. **Defina nova data de vencimento** - Data futura, respeitando regras do banco (mínimo 1 dia útil)

5. **Confirme dados do sacado** - Nome, CPF/CNPJ, endereço (atualize se necessário)

6. **Gere o novo boleto** - Sistema cria novo registro com mesma referência, novo código de barras e linha digitável

### Regras importantes

- **Nosso Número** - Mantém o mesmo do título original (identifica a dívida)
- **Valor** - Mantém valor original (juros/multa calculados pelo banco no pagamento)
- **Código de barras** - Novo, com nova data de vencimento
- **Linha digitável** - Nova, correspondente ao novo código de barras
- **Limite de segundas vias** - Bancos costumam limitar (ex: máx. 3 por título)

### Envio ao cliente

1. **E-mail** - Anexo PDF ou link para portal
2. **WhatsApp** - Imagem ou PDF
3. **Portal do cliente** - Disponível para download
4. **Correios** - Se solicitado (custo por conta do cedente)

### Após pagamento da segunda via

- Baixa automática via arquivo retorno CNAB
- Título original e segunda via são liquidados juntos
- Verifique conciliação bancária no dia útil seguinte

### Problemas comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| Erro "Nosso Número duplicado" | Tentativa de gerar 2ª via com Nosso Número já usado | Use função específica "Segunda via", não "Novo boleto" |
| Vencimento não aceito | Data inferior a hoje ou feriado | Escolha dia útil futuro |
| Valor diferente | Juros/multa inclusos indevidamente | Sistema calcula apenas no pagamento; boleto sai com valor original |