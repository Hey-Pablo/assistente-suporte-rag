---
id: artigo-014
titulo: "Como resolver erros de comunicação do QR Code na NF-e"
categoria: "NF-e"
---

## Como resolver erros de comunicação do QR Code na NF-e

O QR Code é obrigatório nas NF-e a partir de 2016. Erros na geração ou leitura do QR Code podem causar rejeições na autorização.

### Erros mais comuns

#### Erro "URL inválida"

- **Mensagem**: "UrlInvalida", "UrlNaoAprovada"
- **Causa**: URL não conforme padrão da SEFAZ
- **Solução**: Verifique formato: `https://nfe.sefaz.[uf].gov.br/[nfe|csc]/qrcode?...&versao=DOC`

#### Erro "CSC inválido"

- **Mensagem**: "CscInvalido", "ChaveDeAcessoInvalida"
- **Causa**: Conteúdo do QR Code não corresponde ao CSC fornecido
- **Solução**: Regenere o QR Code com CSC correto

#### Erro "Timestamp fora do prazo"

- **Mensagem**: "TimestampExpirado", "DataInvalida"
- **Causa**: Data de emissão posterior a validade do certificado
- **Solução**: Sincronize com servidor NTP e reemita

### Como verificar o QR Code

1. **Acesse o XML da NF-e** - Localize a tag `<pNFE>` ou `<link>`
2. **Compare com QR Code impresso** - Valores devem ser idênticos
3. **Teste no leitor** - Use aplicativo da SEFAZ para validar

### Geração correta do QR Code

#### Passos para validação

1. **Monte a string de condição** - Dados obrigatórios na ordem correta
2. **Aplique SHA-256** - Hash da string usando CSC
3. **Concatene resultado** - Emite o QR Code completo

#### Exemplo de string de condição

```
AC=NFe|AM=12345678000195|AN=Numeracao|AP=55|AS=12345678|DV=90|CPFCNPJ=12345678000195|EE=2024-03-15T14:30:00|EM=123456780001950100000000000000000000000000|ET=0|TV=1234.56
```

### Configurações no sistema

1. **Verifique CSC na aplicação** - Arquivo ou variável de ambiente
2. **Teste geração QR Code** - Função de teste do software
3. **Compare com homologação** - Valores idênticos em ambiente de teste

### Quando a SEFAZ rejeita

1. **Consulte portal da Sefaz** - Estado fornece detalhe da rejeição
2. **Verifique manual da SEFAZ** - Documentação atualizada
3. **Teste em ambiente de homologação** - Antes de emitir em produção

### Scripts de validação

```bash
# Verificar formato do QR Code
python -c "
import hashlib
string = 'AC=NFe|...'  # string de condição
csc = '12345678'  # código do CSC
hash_result = hashlib.sha256((string + '&' + csc).encode()).hexdigest()
print('Hash gerado:', hash_result)
"
```