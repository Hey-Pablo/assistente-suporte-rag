---
id: artigo-011
titulo: "Como diagnosticar rejeição por campo XML inválido na NF-e"
categoria: "NF-e"
---

## Como diagnosticar rejeição por campo XML inválido na NF-e

Quando a NF-e é rejeitada, o motivo está no retorno da SEFAZ. Este artigo ajuda a identificar e corrigir os principais códigos de rejeição.

### Passos para diagnóstico

1. **Acesse o retorno da rejeição** - Consulte o XML de rejeição ou o protocolo de autorização no portal da SEFAZ.

2. **Identifique o código de rejeição** - O código numérico indica o motivo exato.

3. **Localize o campo problemático** - No XML, procure pela tag mencionada na mensagem de erro.

4. **Corrija e reenvie** - Após a correção, transmita novamente a NF-e.

### Principais códigos de rejeição e soluções

#### Rejeição 204 - Duplicidade de NF-e

- **Mensagem**: "Rejeicao: Duplicidade de NF-e [nRec:999999999999999]"
- **Causa**: Já existe NF-e autorizada com mesma chave de acesso (modelo, série, número, CNPJ emitente)
- **Solução**: Verifique numeração no sistema; se número já foi usado, incremente para o próximo disponível; evite retransmissão de NF-e já autorizada

#### Rejeição 301 - Irregularidade fiscal do emitente

- **Mensagem**: "Rejeicao: Irregularidade fiscal do emitente"
- **Causa**: CNPJ do emitente com pendências no cadastro da SEFAZ (suspenso, baixado, ou impedido)
- **Solução**: Consulte situação cadastral no portal da SEFAZ do estado; regularize pendências (débitos, omissões); aguarde atualização do cadastro antes de emitir

#### Rejeição 302 - Irregularidade fiscal do destinatário

- **Mensagem**: "Rejeicao: Irregularidade fiscal do destinatario"
- **Causa**: CNPJ/CPF do destinatário com pendências no cadastro da SEFAZ
- **Solução**: Solicite ao destinatário que regularize situação cadastral; para consumidor final (CPF), verifique se é operação interestadual com ICMS-ST

#### Rejeição 539 - Duplicidade de chave de acesso (EPEC/Contingência)

- **Mensagem**: "Rejeicao: Duplicidade de chave de acesso [chNFe:...]"
- **Causa**: Chave de acesso já foi utilizada em EPEC ou contingência anterior
- **Solução**: Gere nova chave com numeração sequencial correta; não reutilize chaves de NF-e canceladas ou denegadas

#### Rejeição 778 - NCM inválido

- **Mensagem**: "Rejeicao: NCM invalido [cProd:...]"
- **Causa**: NCM informado não existe na tabela vigente ou tem menos de 8 dígitos
- **Solução**: Consulte tabela NCM atualizada no portal Comex Stat; complete com zeros à esquerda se necessário (ex: `1234` → `00001234`); verifique se NCM foi alterado em atualizações recentes

### Outros códigos comuns

| Código | Descrição | Ação rápida |
|--------|-----------|-------------|
| 205 | NF-e já está cancelada | Não cancele novamente |
| 217 | NF-e não encontrada na base | Verifique se foi autorizada |
| 218 | NF-e já está inutilizada | Use numeração correta |
| 230 | IE do emitente inválida | Atualize IE no cadastro |
| 231 | IE do destinatário inválida | Confira IE do cliente |
| 255 | NF-e complementar sem referenciada | Informe chave da NF-e original |
| 381 | Valor total difere do somatório | Recalcule totais no XML |
| 382 | Valor do ICMS difere do calculado | Confira alíquotas e base |
| 531 | Total do ICMS-ST difere do somatório | Revise substituição tributária |
| 720 | CFOP inexistente | Use CFOP da tabela vigente |

### Como corrigir no sistema

1. **Valide antes da emissão** - Implemente validações automáticas no ERP
2. **Mantenha tabelas atualizadas** - NCM, CFOP, CST/CSOSN sincronizados com SEFAZ
3. **Use ambiente de homologação** - Teste emissões antes de produção
4. **Monitore rejeições** - Dashboard com códigos mais frequentes
5. **Documente correções** - Registre em base de conhecimento interna

### Ferramentas úteis

- Portal da SEFAZ do estado (consulta cadastro, manual de rejeições)
- Validador oficial da NF-e (homologação)
- Tabela NCM Comex Stat (comexstat.mdic.gov.br)
- Script de validação local pré-emissão
