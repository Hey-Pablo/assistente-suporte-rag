---
id: artigo-011
titulo: "Como diagnosticar rejeição por campo XML inválido na NF-e"
categoria: "NF-e"
---

## Como diagnosticar rejeição por campo XML inválido na NF-e

Quando a NF-e é rejeitada por campo XML inválido, o motivo costuma estar no XML enviado. Este artigo ajuda a identificar e corrigir os principais problemas.

### Passos para diagnóstico

1. **Acesse o retorno da rejeição** - Consulte o XML de rejeição ou o protocolo de autorização.

2. **Identifique o código de rejeição** - Exemplo: "CampoCpfCnpjInvalido", "CodigoSistemaNaoPermitido".

3. **Localize o campo problemático** - No XML, procure pela tag mencionada.

4. **Verifique formato** - Confira se o valor está dentro das regras de formatação.

### Problemas mais comuns

#### CNPJ/CPF com máscara incorreta

- **Problema**: Campo com pontos, traços ou espaços
- **Solução**: Use apenas números (14 dígitos para CNPJ, 11 para CPF)
- **Exemplo**: `12.345.678/0001-90` → `12345678000190`

#### Data com formato inválido

- **Problema**: Data em formato DD/MM/YYYY
- **Solução**: Use formato ISO `YYYY-MM-DD`
- **Exemplo**: `15/03/2024` → `2024-03-15`

#### Valor numérico com vírgula

- **Problema**: Usando vírgula como separador decimal
- **Solução**: Use ponto como separador decimal
- **Exemplo**: `1234,56` → `1234.56`

#### Código de produto (NCM/SH) inválido

- **Problema**: NCM com menos de 8 dígitos ou valor não existente
- **Solução**: Complete com zeros à direita se necessário
- **Exemplo**: `1234` → `00001234`

### Como corrigir no sistema

1. **Valide antes da emissão** - Use máscaras corretas no formulário
2. **Teste com dados reais** - Emissions de teste com XMLs válidos
3. **Atualize regras de validação** - Mapeie validações da SEFAZ
4. **Documente correções** - Registre em issue o motivo da rejeição

### Ferramentas úteis

- Validador online da SEFAZ
- Visualizador XML com destaque de erros
- Script de validação local (JavaScript/Python)