---
id: artigo-021
titulo: "Como gerar corretamente o código de barras do boleto"
categoria: "Boleto"
---

## Como gerar corretamente o código de barras do boleto

O código de barras é composto por 44 caracteres numéricos. Erros na geração causam rejeições na compensação. Este artigo explica a construção e validação.

### Estrutura do código de barras

#### Posicionamento

```
[Posição 1-3]    [Posição 4-9]   [Posição 10-16]  [Posição 17-22] [Posição 23-28]
Código do Banco  Moeda           Controle         Nosso Número  Fator Vencimento

[Posição 29-34] [Posição 35-42]  [Posição 43-44]
Valor Documento DV                Espaço

```

### Construção passo a passo

#### Passo 1: Dados iniciais

- **Código do Banco** (3 dígitos) - Ex.: 001
- **Moeda** (1 dígito) - Geralmente 9 (Real)
- **CNPJ Cedente** (14 dígitos)
- **Nosso Número** (varia por banco) - Ex.: 25 dígitos
- **Fator Vencimento** (4 dígitos) - Data conversão
- **Valor** (10 dígitos) - Sem pontos ou vírgula

#### Passo 2: Construir campo livre

Para **Banco do Brasil (001)**:
```
[CNPJ Cedente][Nosso Número][Sacado][Data Vencimento][Valor]
```

#### Passo 3: Gerar campos de controle

```python
def gerar_codigo_barras():
    # Exemplo simplificado
    codigo_banco = "001"
    moeda = "9"
    # ... demais campos
    
    # Construir string com 44 posições
    codigo_completo = codigo_banco + moeda + campo_controle + campo_livre
    
    # Calcular DV
    dv = calcular_dv(codigo_completo)
    
    # Posicionar DV na posição 1 e 2
    codigo_final = codigo_banco + dv + moeda + campo_controle + campo_livre
    
    return codigo_final
```

### Regra de cálculo do DV (Dígito Verificador)

Usa-se o **módulo 11** com pesos de 2 a 9 da direita para esquerda.

```python
def calcular_dv(codigo):
    """Calcula o DV usando módulo 11"""
    pesos = [2, 3, 4, 5, 6, 7, 8, 9]
    soma = 0
    for i, digito in enumerate(reversed(codigo)):
        soma += int(digito) * pesos[i % len(pesos)]
    resto = soma % 11
    dv = 11 - resto if resto != 0 else 0
    return str(dv) if dv < 10 else '0'
```

### Erros comuns

#### Código com caracteres especiais

- **Problema**: `"0019 1234 5678"` - Espaços
- **Solução**: Remover todos os caracteres não numéricos

#### Código com menos de 44 caracteres

- **Problema**: `"001912345..."` - Apenas 40 caracteres
- **Solução**: Verificar preenchimento dos campos

#### Data de vencimento inválida

- **Problema**: Fator vencimento = 7000 (data futura fora do limite)
- **Solução**: Calcular corretamente a data (01/03/1997 = 7000)

### Validação do código

```python
def validar_codigo_barras(codigo):
    """Valida o código de barras do boleto"""
    if len(codigo) != 44:
        return False, "Código deve ter 44 caracteres"
    
    if not codigo.isdigit():
        return False, "Código deve conter apenas números"
    
    # Validar código do banco
    codigo_banco = codigo[0:3]
    if codigo_banco not in ['001', '104', '237', '341', '338', '054']:
        return False, f"Código de banco inválido: {codigo_banco}"
    
    # Validar moeda
    moeda = codigo[3]
    if moeda != '9':
        return False, "Moeda deve ser 9 (Real)"
    
    # Validar DV
    codigo_sem_dv = codigo[3:43]
    dv_calculado = calcular_dv(codigo_sem_dv)
    dv_informado = codigo[43]
    
    if dv_calculado != dv_informado:
        return False, f"DV inválido. Esperado: {dv_informado}, Calculado: {dv_calculado}"
    
    return True, "Código de barras válido"

# Exemplo
validar_codigo_barras('00191923456789012345678900123456789012345678901234')
```

### Teste de leitura

1. **Imprima em alta qualidade** - 300 DPI ou superior
2. **Use papel branco** - Contraste ideal com o leitor
3. **Evite brilho** - Papel mate recomendado
4. **Teste com scanner** - Confirme leitura do código