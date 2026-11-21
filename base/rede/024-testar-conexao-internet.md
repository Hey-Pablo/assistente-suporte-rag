---
id: artigo-024
titulo: "Como testar a conectividade de internet passo a passo"
categoria: "Rede"
---

## Como testar a conectividade de internet passo a passo

Testar a conectividade de internet ajuda a identificar problemas de rede local, ISP ou configurações do computador. Este artigo apresenta um guia completo.

### Preparação

Antes de testar:
- Use outro dispositivo para comparação
- Anote horário dos testes
- Tenha em mãos o login da sua internet (se necessário)

### Teste 1: Verificar estado da rede

#### Windows

```cmd
ipconfig /all
# Verifique: IPv4, Gateway, DNS, Máscara
```

#### Linux/macOS

```bash
ifconfig
# ou
ip addr show
```

### Teste 2: Ping para gateway local

#### Windows

```cmd
ping 192.168.1.1  # Substitua pelo seu gateway
```

#### Linux/macOS

```bash
ping $(ip route | grep default | awk '{print $3}')
```

**Interpretação**:
- **Resposta normal**: Perda 0%, tempo < 5ms
- **Resposta lenta**: 5-50ms pode ser normal dependendo da rede
- **Timeout**: Problema na rede local

### Teste 3: Ping para o roteador

Se o gateway não responder, o problema está na rede local:

1. **Verifique cabos** - Ethernet ou conectividade sem fio
2. **Reinicie roteador** - Desligar por 30 segundos
3. **Conecte em outra porta** - Router pode ter porta defeituosa

### Teste 4: Ping para DNS público

```bash
# Google DNS
ping 8.8.8.8

# Cloudflare DNS
ping 1.1.1.1
```

**Interpretação**:
- **Resposta OK**: Problema é de DNS
- **Timeout**: Problema na internet ou ISP

### Teste 5: Resolver nomes de domínio

#### Windows

```cmd
nslookup google.com
```

#### Linux/macOS

```bash
nslookup google.com
# ou
dig google.com
```

**Se falhar**:
- DNS mal configurado
- Bloqueio de publicidade ou malware
- Problemas na provedora de DNS

### Teste 6: Verificar portas importantes

```bash
# Porta HTTP
telnet google.com 80

# Porta HTTPS
telnet google.com 443

# Porta DNS
telnet 8.8.8.8 53
```

### Teste 7: Traceroute

#### Windows

```cmd
tracert google.com
```

#### Linux/macOS

```bash
traceroute google.com
# ou
mtr google.com
```

**Analisar**:
- Onde o pacote para
- Quantos saltos até o problema
- Latência em cada salto

### Teste 8: Verificar speed de internet

#### Via site

- speedtest.net
- fast.com (Netflix)

#### Via linha de comando

```bash
# Instale speedtest-cli
pip install speedtest-cli
speedtest-cli
```

### Problemas comuns identificados

#### Nenhum IP (0.0.0.0)

- **Causa**: DHCP desativado ou falhou
- **Solução**: Configurar IP manualmente ou reiniciar roteador

#### Gateway não responde

- **Causa**: Problema na rede local
- **Solução**: Verificar cabos, reiniciar roteador

#### Internet lenta ou instável

- **Causa**: Congestionamento, ISP ou malware
- **Solução**: Verificar antivírus, testar horários diferentes

#### DNS não responde

- **Causa**: DNS bloqueado ou configurado errado
- **Solução**: Usar DNS alternativo (8.8.8.8, 1.1.1.1)

### Diagnostico rápido resumido

```bash
# Script de diagnóstico rápido
echo "Teste 1: IP Local"
ip addr | grep "inet " | head -1

echo "Teste 2: Gateway"
ping -c 3 $(ip route | grep default | awk '{print $3}')

echo "Teste 3: Internet"
ping -c 3 8.8.8.8

echo "Teste 4: DNS"
ping -c 3 google.com
```

### Registro de problemas

Ao contatar o suporte, forneça:
1. Resultados dos testes acima
2. Horário exato do problema
3. Dispositivos afetados
4. Testes com outros dispositivos