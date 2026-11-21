---
id: artigo-020
titulo: "Como configurar corretamente o número do banco no boleto"
categoria: "Boleto"
---

## Como configurar corretamente o número do banco no boleto

O número do banco é o primeiro campo obrigatório no boleto. Erros nesta configuração causam rejeições na compensação.

### Códigos de banco principais

| Banco | Código | Exemplo |
|-------|--------|---------|
| Banco do Brasil | 001 | BB |
| Itaú | 341 | ITAU |
| Bradesco | 237 | BB |
| Santander | 033 | BANDES |
| Caixa Econômica | 104 | CAIXA |
| Nubank | 318 | NUBANK |
| Inter | 054 | INTER |
| C6 Bank | 338 | C6 |

### Formato correto

#### Campo "Código do Banco"

- **3 dígitos** - Sempre com zeros à esquerda
- **Exemplo**: Banco do Brasil = "001"
- **Exemplo**: Nubank = "318"

#### Convenio/Agencia

- **4 dígitos** - Código da agência
- **Exemplo**: 1234

#### Conta Corrente

- **Sempre números** - Sem traços ou barras
- **Exemplo**: 12345-6 → "123456"

### Erros comuns

#### Código com caracteres

- **Problema**: "001-123" ou "BB"
- **Solução**: Use apenas números: "001"

#### Código com menos dígitos

- **Problema**: "1" em vez de "001"
- **Solução**: Complete com zeros à esquerda

#### Código do Cedente

- **Problema**: Número incorreto
- **Solução**: Verifique com o banco ou convênio

### Estrutura do boleto (Campos obrigatórios)

```
[001] [000977413] [RS]  - Código | Convênio | Cidade
[025] [001923456000000000000000000000000000000000000] - Nosso número
[18]  [12345678901234]             - CNPJ do cedente
[21]  [12345678901234567890]       - CNPJ do sacado
[54]  [123456789012345678901234567890123456789012345678901234567890] - Detalhe
```

### Validação do código

```python
def validar_codigo_banco(codigo):
    """Valida o código do banco"""
    if len(codigo) != 3:
        return False, "Código deve ter 3 dígitos"
    if not codigo.isdigit():
        return False, "Código deve conter apenas números"
    try:
        codigo_int = int(codigo)
        if codigo_int < 1 or codigo_int > 999:
            return False, "Código deve estar entre 001 e 999"
    except ValueError:
        return False, "Código inválido"
    return True, "Código válido"

# Exemplo de uso
validar_codigo_banco('001')  # True, "Código válido"
validar_codigo_banco('BB')   # False, "Código deve conter apenas números"
```

### Consulta com o banco

1. **Ligue para o SAC** - Use linha oficial
2. **Tenha em mãos**:
   - CNPJ da empresa
   - Conta corrente
   - Convênio (se existir)
   - Tipo de geração (regra normal ou variação)

### Teste de geração

1. **Gere boleto teste** - Com dados fictícios
2. **Verifique o código** - Deve aparecer corretamente
3. **Leia com scanner** - Confirme leitura do código de barras
4. **Valide no sistema** - Teste de reconhecimento