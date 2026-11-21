---
id: artigo-019
titulo: "Como resolver erros de impressão do Danfe"
categoria: "Boleto"
---

## Como resolver erros de impressão do Danfe

O DANFE (Documento Auxiliar de Nota Fiscal de Entrada e Saída) é a cópia física da NF-e. Problemas na impressão podem impedir a entrega ao cliente.

### Erros mais comuns

#### Erro "Formato inválido"

- **Mensagem**: "Danfe nao gerado", "Erro no layout"
- **Causa**: XML com dados inconsistentes
- **Solução**: Verificar e corrigir dados no XML

#### Erro "Fonte insuficiente"

- **Mensagem**: "Falta ink", "Bico vazio"
- **Causa**: Tinta ou toner baixo
- **Solução**: Trocar cartucho ou folhear

#### Erro "Corte automático falhou"

- **Mensagem**: "Papel preso", "Corte parcial"
- **Causa**: Papel na porta de saída
- **Solução**: Limpar mecanismo de corte

#### Erro "QR Code ilegível"

- **Mensagem**: "QR Code nao lido"
- **Causa**: Impressão desfocada ou com baixa resolução
- **Solução**: Verificar qualidade do papel e impressão

### Diagnóstico passo a passo

1. **Verifique o XML da NF-e** - Acesse portal da SEFAZ
2. **Baixe novo DANFE** - Geração novamente
3. **Teste impressão** - Use outra impressora
4. **Verifique driver** - Atualizado?

### Configurações de impressão

#### Configurações gerais

1. **Paper size** - A4 (210 x 297 mm)
2. **Orientation** - Portrait
3. **Margins** - Mínimas ou zero
4. **Quality** - 300 DPI ou superior
5. **Color** - Preto e branco (geralmente)

#### Configurações específicas

- **Scaling** - 100% (não redimensionar)
- **Fit to page** - Desativado
- **Print range** - All pages
- **Collate** - Desativado (apenas 1 página)

### Problemas específicos por impressora

#### Impressoras térmicas

1. **Verifique fita** - Substituir se vazia
2. **Temperatura** - Ajustar no painel da impressora
3. **Calibre papel** - Configurar tipo correto
4. **Limpeza** - Remover sujeira do caminho de papel

#### Impressoras a jato

1. **Teste de tinta** - Usar função de teste
2. **Alinhe cabeçote** - Menu de manutenção
3. **Verifique papel** - A4 com gramatura adequada
4. **Resfique impressora** - Aguardar 5 minutos após uso contínuo

### Geração correta do DANFE

#### Via portal da SEFAZ

1. **Acesse o portal** - nfe.sefaz.[uf].gov.br
2. **Consulte a NF-e** - Informe chave de acesso
3. **Clique em "Imprimir/Danfe"**
4. **Selecione "Impressão padrão"**
5. **Salve como PDF** - Para backup

#### Via sistema emissor

1. **Atualize sistema** - Última versão
2. **Verifique layout** - Conforme manual da SEFAZ
3. **Teste geração** - Em ambiente de teste
4. **Exportar PDF** - Para impressão posterior

### Quando a SEFAZ rejeita

1. **Consultar portal da Sefaz** - Estado fornece detalhe
2. **Verificar manual da SEFAZ** - Documentação atualizada
3. **Testar em homologação** - Antes de emitir em produção

### Scripts de validação

```bash
# Verificar tamanho do arquivo PDF gerado
ls -lh danfe.pdf

# Verificar integridade do PDF
pdfinfo danfe.pdf | grep Pages  # Deve mostrar 1 página
```