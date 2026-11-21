---
id: artigo-020
titulo: "Como validar e corrigir linha digitável do boleto"
categoria: "Boleto"
---

## Como validar e corrigir linha digitável do boleto

A linha digitável é a representação numérica do código de barras, permitindo pagamento manual. Sua validação evita erros de digitação e pagamentos rejeitados.

### Estrutura da linha digitável (47 dígitos)

```
Campo 1: 9 dígitos (código banco + moeda + 5 primeiros do campo livre) + 1 DV
Campo 2: 10 dígitos (próximos 10 do campo livre) + 1 DV
Campo 3: 10 dígitos (próximos 10 do campo livre) + 1 DV
Campo 4: 1 dígito (DV geral do código de barras)
Campo 5: 14 dígitos (fator de vencimento + valor)
```

**Total**: 5 campos = 47 caracteres numéricos

### Como validar a linha digitável

#### 1. Verifique comprimento
- Deve ter exatamente 47 dígitos numéricos (sem espaços, pontos ou barras)

#### 2. Valide DV de cada campo (Módulo 10)
Cada campo (1, 2, 3) tem seu próprio dígito verificador calculado pelo Módulo 10:

```
Algoritmo Módulo 10:
1. Multiplique dígitos alternados por 2 e 1 (da direita para esquerda)
2. Some todos os resultados (se multiplicação > 9, some os dígitos: 12 = 1+2=3)
3. DV = (10 - (soma % 10)) % 10
```

#### 3. Valide DV geral do código de barras (Módulo 11)
O campo 4 é o DV do código de barras completo (44 dígitos), calculado pelo Módulo 11:

```
Algoritmo Módulo 11 (base 2 a 9):
1. Multiplique cada dígito por peso (2,3,4,5,6,7,8,9,2,3...) da direita para esquerda
2. Some os resultados
4. DV = 11 - (soma % 11)
   - Se DV = 10 ou 11, use 0 ou 1 conforme regra do banco
```

#### 4. Valide fator de vencimento e valor (Campo 5)
- **Primeiros 4 dígitos**: Fator de vencimento (dias desde 07/10/1997)
- **Últimos 10 dígitos**: Valor em centavos (sem vírgula/ponto)
- Ex: Fator 10000 + Valor 123456 = `10000123456` (11 dígitos, completa com zero à esquerda)

### Ferramentas de validação

#### Script Python rápido
```python
def mod10(campo):
    soma = 0
    peso = 2
    for d in reversed(campo):
        mult = int(d) * peso
        soma += mult if mult < 10 else mult - 9
        peso = 1 if peso == 2 else 2
    return (10 - (soma % 10)) % 10

def mod11(codigo):
    soma = 0
    peso = 2
    for d in reversed(codigo):
        soma += int(d) * peso
        peso = peso + 1 if peso < 9 else 2
    dv = 11 - (soma % 11)
    return 0 if dv >= 10 else dv

linha = "001905009540144816069068093503143373700000010000"
# Campos: 001905009|5|4014481606|9|0680935031|4|3|373700000010000
print("DV Campo 1:", mod10(linha[0:9]))   # Deve ser 5
print("DV Campo 2:", mod10(linha[10:20])) # Deve ser 9
print("DV Campo 3:", mod10(linha[21:31])) # Deve ser 4
print("DV Geral:", mod11(linha[0:4]+linha[5:10]+linha[11:21]+linha[22:32]+linha[33:47])) # Deve ser 3
```

### Erros comuns e correções

| Erro na linha digitável | Causa provável | Correção |
|------------------------|----------------|----------|
| DV campo 1 inválido | Código banco/moeda errado | Confira banco (001=BB, 237=Bradesco, 341=Itaú, 033=Santander, 748=Sicredi) |
| DV campo 2 inválido | Nosso Número/agência/conta errados | Verifique dados do cedente no registro do banco |
| DV campo 3 inválido | Nosso Número/parcela errados | Confira sequência do Nosso Número |
| DV geral (campo 4) inválido | Qualquer dígito do código de barras errado | Recupere código de barras do PDF/XML e regenere linha digitável |
| Fator de vencimento errado | Data de vencimento incorreta | Recalcule: dias entre 07/10/1997 e data vencimento |
| Valor errado | Centavos não correspondem | Valor em centavos: R$ 100,00 = 10000 |

### Boas práticas

1. **Sempre gere pelo sistema** - Nunca digite manualmente
2. **Teste em homologação** - Valide com arquivo remessa antes de produção
3. **Use bibliotecas validadas** - `boleto.js`, `pyboleto`, `Boleto.Net`
4. **Compare com PDF** - Linha digitável do PDF = linha digitável do sistema
5. **Log de validação** - Registre validações falhadas para auditoria