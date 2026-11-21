---
id: artigo-022
titulo: "Como validar e configurar o RECV (Registro Eletrônico de Controle de Boletos) do cedente"
categoria: "Boleto"
---

## Como validar e configurar o RECV (Registro Eletrônico de Controle de Boletos) do cedente

O RECV é um documento eletrônico emitido pelo Banco Central para controlar a compensação de boletos. Erros na configuração causam problemas na liquidação.

### O que é o RECV

O RECV é um código de 14 dígitos que identifica:
- **Banco emissor** - Código do banco
- **Agência** - Código da agência
- **Conta** - Número da conta corrente
- **DV** - Dígito verificador do registro

### Estrutura do RECV

```
[Banco][Agência][Conta][DV]
[ 3  ][  4  ][10-17][1]
```

**Exemplo**: 0010000100002345678901

### Como obter o RECV

1. **Solicite ao banco** - Via site, app ou agência
2. **Documentação necessária**:
   - CNPJ da empresa
   - Dados da conta corrente
   - Uso do Registro (boletos, DOC/TED, etc.)

3. **Prazo de validade**: Geralmente 2 anos ou conforme contrato

### Validação do RECV

```python
def validar_recv(codigo):
    """Valida o formato do RECV"""
    if len(codigo) != 24:  # 14 dígitos + 10 caracteres de máscara
        return False, "RECV deve ter 14 dígitos"
    
    if not codigo.replace('-', '').isdigit():
        return False, "RECV deve conter apenas números"
    
    # Validar código do banco
    codigo_banco = codigo[0:3]
    bancos_validos = ['001', '104', '237', '341', '338', '054', '389']
    if codigo_banco not in bancos_validos:
        return False, f"Código de banco inválido: {codigo_banco}"
    
    return True, "RECV válido"

def calcular_recv_dv(codigo_completo):
    """Calcula o DV do RECV usando módulo 11"""
    pesos = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7]
    soma = sum(int(d) * p for d, p in zip(codigo_completo, pesos))
    resto = soma % 11
    return str(resto) if resto < 10 else '0'
```

### Configuração no sistema

#### Passos para configuração

1. **Acesse o cadastro do cedente**
2. **Localize campo "Código de Compensação"**
3. **Insira o RECV completo**
4. **Salve as configurações**
5. **Teste geração de boleto**

#### Campos associados

- **Código dacompensação** - 14 dígitos do RECV
- **Número da agência** - 4 dígitos
- **Número da conta** - 10-17 dígitos
- **DV da agência** - 1 dígito
- **DV da conta** - 1 dígito

### Erros comuns

#### RECV incorreto

- **Problema**: Código com 13 ou 15 dígitos
- **Solução**: Verificar com o banco e corrigir

#### Agência sem DV

- **Problema**: "1234" em vez de "1234-5"
- **Solução**: Completa com DV correspondente

#### Conta com barra

- **Problema**: "12345-6" em vez de "123456"
- **Solução**: Remover caracteres de formatação

### Validação na emissão

```python
def validar_boleto_emissao(dados):
    """Valida dados antes da emissão do boleto"""
    errors = []
    
    # Validar RECV
    if not validar_recv(dados['recv']):
        errors.append(f"RECV inválido: {dados['recv']}")
    
    # Validar código do banco
    if len(dados['codigo_banco']) != 3:
        errors.append("Código do banco deve ter 3 dígitos")
    
    # Validar CNPJ cedente
    if len(dados['cnpj_cedente']) != 14:
        errors.append("CNPJ cedente deve ter 14 dígitos")
    
    return errors
```

### Quando problemas ocorrem

1. **Boleto não liquida** - Verifique RECV no portal do banco
2. **Baixa divergente** - Consulte o RECV emitido
3. **Rejeição na compensação** - Entre em contato com o gerente do banco

### Dicas importantes

- **Mantenha backup do RECV** - Documento legal
- **Atualize quando houver mudança** - Nova conta ou agência
- **Teste sempre com dados novos** - Gere boleto teste