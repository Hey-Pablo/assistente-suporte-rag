---
id: artigo-031
titulo: "Como reiniciar a fila de impressao no Windows"
categoria: "Impressora Fiscal"
---

## Como reiniciar a fila de impressao no Windows

Quando a impressora fiscal trava na fila de impressao ou nao processa documentos, reiniciar o spooler de impressao resolve a maioria dos problemas.

### Passos para reiniciar a fila de impressao

1. **Abra o Gerenciador de Tarefas** - Pressione `Ctrl + Shift + Esc` ou clique com botao direito na barra de tarefas e selecione "Gerenciador de Tarefas".

2. **Acesse Serviços** - Clique em "Detalhes" > "Servicos" ou pressione `Win + R`, digite `services.msc` e pressione Enter.

3. **Localize o servico Spooler** - Role ate encontrar "Spooler de Impressao" (spoolsv).

4. **Pare o servico** - Clique com botao direito em "Spooler de Impressao" > "Parar". Aguarde alguns segundos ate que o status mude para "Parado".

5. **Limpe arquivos pendentes** - Navegue ate `C:\Windows\system32\spool\PRINTERS\` e exclua todos os arquivos `.SPL` e `.SHD` que estiverem la.

6. **Reinicie o servico** - Clique com botao direito em "Spooler de Impressao" > "Iniciar".

7. **Verifique o status** - O status deve mostrar "Em Execução".

### Comando alternativo via Prompt

Se preferir usar o prompt de comando:

```cmd
net stop spooler
del /Q C:\Windows\system32\spool\PRINTERS\*
net start spooler
```

Execute como administrador (clique com botao direito > "Executar como administrador").

### Quando a fila nao reinicia

- **Permissoes**: Certifique-se de estar logado como administrador
- **Arquivos travados**: Feche todos os programas de impressao antes de parar o servico
- **Reinicie o computador**: Se o spooler nao responder, faça um reinício completo do sistema

### Precaucoes

- Faça backup de documentos importantes antes de limpar a fila
- Não exclua pastas, apenas os arquivos dentro de `PRINTERS`
- Alguns documentos podem precisar ser reenviados após a limpeza

### Frequencia recomendada

- Limpar fila manualmente: quando a impressora travar
- Monitorar logs: verifique o Event Viewer para erros de spooler
- Reiniciar periodicamente: se houver frequentes trancamentos

### Referencias

- Verifique tambem o artigo sobre relatórios fiscais lentos
- Consulte o manual da impressora para reset de hardware especifico