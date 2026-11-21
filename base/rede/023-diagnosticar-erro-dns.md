---
id: artigo-023
titulo: "Como diagnosticar e resolver erros de DNS"
categoria: "Rede"
---

## Como diagnosticar e resolver erros de DNS

Erros de DNS são responsáveis por quebra de conexões, páginas não carregando e mensagens como "Este site não pode ser atingido". Este artigo guia no diagnóstico e solução.

### Sintomas comuns

- "Site não pode ser atingido"
- "DNS_PROBE_FINISHED_NXDOMAIN"
- "ERR_NAME_NOT_RESOLVED"
- Pings falhando para nomes de domínio

### Diagnóstico passo a passo

#### Passo 1: Verificar resolução

```bash
# Windows
nslookup google.com
ping google.com

# Linux/macOS
dig google.com
nslookup google.com
ping google.com
```

#### Passo 2: Testar com IP direto

```bash
# Se funciona com IP, é problema de DNS
ping 8.8.8.8
```

#### Passo 3: Verificar configurações de rede

```bash
# Windows
ipconfig /all

# Linux/macOS
ifconfig
cat /etc/resolv.conf
```

### Configurações de DNS recomendadas

#### DNS público da Google

```
DNS Primário: 8.8.8.8
DNS Secundário: 8.8.4.4
```

#### DNS público da Cloudflare

```
DNS Primário: 1.1.1.1
DNS Secundário: 1.0.0.1
```

#### DNS da Cloudflare (IPv6)

```
DNS Primário: 2606:4700:4700::1111
DNS Secundário: 2606:4700:4700::1001
```

### Configuração manual do DNS

#### Windows

1. **Abrir "Conexões de Rede"** - Painel de Controle
2. **Clicar com botão direito na conexão** - "Propriedades"
3. **Selecionar "Protocolo Internet versão 4"** - "Propriedades"
4. **Usar seguintes endereços de servidor DNS** - Inserir valores
5. **OK e reiniciar** - Conexão

#### Linux

Edite o arquivo `/etc/resolv.conf`:

```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

#### macOS

1. **Preferências do Sistema** > **Rede**
2. **Selecionar conexão ativa** > **Avançado**
3. **DNS** > **Adicionar servidores**
4. **Adicionar 8.8.8.8 e 8.8.4.4**
5. **OK e Aplicar**

### Flush do cache DNS

#### Windows

```cmd
ipconfig /flushdns
```

#### Linux

```bash
sudo systemd-resolve --flush-caches
# Ou
sudo /etc/init.d/networking restart
```

#### macOS

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### Problemas específicos

#### DNS não responde

- **Verifique cabos** - Ethernet ou Wi-Fi
- **Teste outro dispositivo** - Para isolar problema
- **Reinicie roteador** - Desligar por 30 segundos

#### DNS lento

- **Mude para DNS rápido** - Cloudflare ou Google
- **Verifique bloatware** - Programas de segurança podem interferir
- **Desative IPv6** - Se não usado

#### Domínio não resolvido

- **Verifique se existe** - whois.domaintools.com
- **Verifique configuração DNS** - Registro no provedor
- **Teste em navegadores diferentes** - Para descartar cache

### Diagnóstico avançado

```bash
# Verificar roteamento
tracert google.com  # Windows
traceroute google.com  # Linux/macOS

# Verificar portas
telnet google.com 80
nc -zv google.com 53  # Porta DNS

# Verificar configuração do adaptador
netsh interface ipv4 show config  # Windows
```