---
id: artigo-013
titulo: "Como configurar e validar o certificado digital para emissão de NF-e"
categoria: "NF-e"
---

## Como configurar e validar o certificado digital para emissão de NF-e

O certificado digital é obrigatório para assinar electronicamente as NF-e. Configuração incorreta é uma das causas mais comuns de falhas na emissão.

### Requisitos

- Certificado ICP EA 12 ou EA 27 (A1 ou A3)
- Software de associação instalação
- Horário do computador sincronizado com NTP
- Usuário com permissão de leitura do certificado

### Passos para configuração

1. **Instale o certificado** - Use o instalador fornecido pela autoridade certificadora.

2. **Associe ao software Siscal** - No sistema, aponte para o certificado instalado.

3. **Configure senha do certificado** - Senha única, fornecida na compra.

4. **Teste assinatura** - Use função de teste do software.

5. **Verifique validade** - Certificado deve ter validade superior a 30 dias.

### Validação do certificado

#### Verificar validade

1. **No Windows** - Clique duplo no arquivo .pfx
2. **No certificado** - Verifique "Data de expiração"
3. **No sistema Siscal** - Consulte "Status do certificado"

#### Verificar cadeia de certificação

1. Acesse "Detalhes" do certificado
2. Procure "Cadeia de certificação"
3. Certifique-se de que todos os certificados intermediários estão instalados

### Problemas comuns

#### Erro "Senha incorreta"

- **Solução**: Verifique caps lock, digitação ou senha fornecida
- **Dica**: Teste em "Certificados do usuário" do Windows (certmgr.msc)

#### Erro "Certificado não encontrado"

- **Solução**: Instale em "Usuário atual" e não em "Computador local"
- **Verifique**: Caminho correto do certificado no software Siscal

#### Erro "Certificado revogado"

- **Verificação**: Consulte site da autoridade certificadora
- **Solução**: Renove certificado antes da expiração

### Scripts de validação

```bash
# Verificar certificados instalados
certutil -viewstore -user my

# Verificar validade de certificado específico
certutil -verifystore my "ID_DO_CERTIFICADO"
```

### Registro de emissão

1. **Horário do sistema** - Mantenha sincronizado
2. **Logs de assinatura** - Ative para auditoria
3. **Backup do certificado** - Guarde cópia segura da senha