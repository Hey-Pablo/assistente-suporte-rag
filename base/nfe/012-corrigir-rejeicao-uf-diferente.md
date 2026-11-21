---
id: artigo-012
titulo: "Como corrigir rejeição por UF do destinatário diferente do remetente"
categoria: "NF-e"
---

## Como corrigir rejeição por UF do destinatário diferente do remetente

Algumas SEFAZs não aceitam NF-e com destinatário de outra Unidade da Federação sem autorização prévia. Este artigo explica como identificar e corrigir esse problema.

### Quando ocorre a rejeição

O sistema Siscal retorna a rejeição com código relacionado a "UF do destinatário" quando:
- A empresa não tem autorização para operar em outra UF
- O destinatário precisa de autorização especial
- Há restrição de exportação ou operações interestaduais

### Diagnóstico passo a passo

1. **Verifique o parâmetro "RegimeEspecialTributario"**
   - Verifique se o destinatário tem regime especial habilitado

2. **Confira o "DataEmissao"**
   - Data não pode ser anterior à data de habilitação da UF

3. **Verifique "TipoOperacao"**
   - Operações interestaduais podem exigir tipo "1" (Baixa) ou "2" (Normal)

4. **Analise o "CnpjDestino"**
   - CNPJ do destinatário deve constar no cadastro da empresa emitente

### Configurações necessárias

#### Cadastro do destinatário

1. **Tipo de contribuinte** - Verifique se é MEI, Simples, Lucro Presumido, etc.

2. **Inscrição estadual** - Destinatário deve ter IE válida na UF

3. **Endereço completo** - Preencha todos os campos de endereço

4. **Código de país** - Brasil para operações nacionais, outros para importação

### Correções possíveis

#### Para operações interestaduais válidas

1. **Atualize cadastro de destinatário** - Inclua dados completos
2. **Verifique regimes tributários** - Alinhe com o destinatário
3. **Use NF-e de baixa** - Para revenda, use tipo de operação "2"

#### Para emissão em outra UF

1. **Solicite autorização prévia** - Documentação na SEFAZ da UF emitente
2. **Altere a CFOP** - Use códigos específicos para interestadual
3. **Verifique LC 123/2006** - Tramitação simplificada para exportação

### Exemplo de correção

```xml
<!-- Antes (rejeitado) -->
<dest>
  <CNPJ>12345678000195</CNPJ>
  <xNome>Empresa Teste SP</xNome>
  <enderDest>
    <UF>RJ</UF>
  </enderDest>
</dest>

<!-- Depois (corrigido) -->
<dest>
  <CNPJ>12345678000195</CNPJ>
  <xNome>Empresa Teste SP</xNome>
  <IE>12345678901234</IE>
  <enderDest>
    <CEP>12345678</CEP>
    <xLgr>Rua Teste</xLgr>
    <nro>100</nro>
    <xCidade>Cidade Teste</xCidade>
    <UF>RJ</UF>
  </enderDest>
  <indIEDet>1</indIEDet>
</dest>
```

### Quando chamar o suporte técnico

Se a autorização prévia foi emitida mas a rejeição persiste, pode haver problema na comunicação com a SEFAZ ou necessidade de análise no módulo fiscal.