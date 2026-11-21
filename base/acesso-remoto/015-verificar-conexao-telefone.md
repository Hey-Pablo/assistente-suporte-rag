---
id: artigo-015
titulo: "Como verificar conexão remota via telefone"
categoria: "Acesso Remoto"
---

## Como verificar conexão remota via telefone

O acesso remoto via telefone é útil para suporte técnico rápido. Este artigo explica como diagnosticar e resolver problemas de conexão.

### Quando a conexão falha

- Cliente não consegue ligar para a máquina remota
- Ligação cai automaticamente
- Som de conversa distorcido
- Conexão lenta ou intermitente

### Diagnóstico passo a passo

1. **Verifique linha telefônica** - Funcionamento da linha
2. **Teste modem** - Verifique status no painel do modem
3. **Confira configurações** - Número de acesso e senha corretos
4. **Verifique portas** - Porta série ou USB do modem
5. **Teste com comando** - Use AT commands para diagnóstico

### Comandos úteis

```bash
# No prompt de comando do modem
AT                    # Teste de comunicação (deve retornar OK)
AT+CGMI              # Identificação do fabricante
AT+CGMM              # Modelo do modem
AT+CSQ               # Sinal de recepção (0-31)
ATDT[numero]        # Discagem do número
ATH                  # Desligar chamada
```

### Configurações necessárias

#### No servidor de acesso

1. **Número de discrogem** - Deve estar ativo
2. **Senha de acesso** - Configurada e testada
3. **Porta COM correta** - Conexão física do modem
4. **Taxa de transmissão** - Geralmente 115200 baud

#### No cliente

1. **Software de terminal** - HyperTerminal, TeraTerm, ou similar
2. **Configurações da porta** - 8N1 (8 bits, sem paridade, 1 stop bit)
3. **Velocidade** - Deve conferir com o servidor

### Problemas comuns

#### Modem não responde

- Verifique cabo USB/serial
- Teste em outra máquina
- Verifique driver do dispositivo

#### Número inválido

- Confira formatação (com DCG ou sem)
- Teste discrimação manual
- Verifique se o número está ativo

#### Som distorcido

- Verifique linha telefônica limpa
- Ajuste taxa de transmissão
- Substitua cabo se necessário

### Segurança

- Use senha forte para acesso remoto
- Registre tentativas de conexão
- Desative dial-up quando não usar