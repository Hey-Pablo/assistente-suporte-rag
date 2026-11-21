---
id: artigo-018
titulo: "Como acessar a VPN da empresa para suporte remoto"
categoria: "Acesso Remoto"
---

## Como acessar a VPN da empresa para suporte remoto

A VPN (Rede Privada Virtual) permite acesso seguro à rede interna. Este artigo explica como se conectar e usar.

### Pré-requisitos

- Credenciais da VPN (usuário e senha)
- Cliente VPN instalado (OpenVPN, Cisco AnyConnect, etc.)
- Conexão com internet
- Máquina com Windows, macOS ou Linux

### Instalação do cliente VPN

#### OpenVPN

1. **Faça download** - openvpn.net.community-downloads
2. **Instale como administrador** - Permissão necessária
3. **Configure rede** - Arquivo .ovpn fornecido pela empresa

#### Cisco AnyConnect

1. **Instale via instalador da empresa**
2. **Primeira execução** - Baixa componentes necessários
3. **Autenticação** - Usuário, senha e token (se aplicável)

### Passos para conexão

1. **Abra o cliente VPN**
2. **Importe arquivo de configuração** - Normalmente .ovpn ou .pcf
3. **Clique em "Conectar"**
4. **Insira credenciais** - Usuário e senha fornecidos
5. **Aguarde conexão** - Ícone muda para "Conectado"

### Verificar conexão

1. **Abrir prompt de comando**
2. **Ping interno** - Tente acessar um servidor interno:
   ```bash
   ping 192.168.1.1  # IP do servidor interno
   nslookup intranetempresa.local
   ```

3. **Verificar IP** - Deve mostrar IP da VPN:
   ```bash
   ipconfig  # Windows
   ifconfig  # Linux/macOS
   ```

### Acesso a máquinas específicas

#### Via RDP (Windows)

1. **Abrir "Conexão de Área de Trabalho Remota"**
2. **Inserir IP interno** - Ex.: `192.168.1.50`
3. **Clique em "Conectar"**
4. **Insira usuário e senha do Windows interno**

#### Via SSH (Linux/macOS/Windows)

```bash
ssh usuario@192.168.1.100
```

#### Via TeamViewer/AnyDesk

1. **Instale no computador remoto** (se ainda não)
2. **Inicie o serviço** - Deve estar ativo
3. **Conecte pelo ID** - Usando a VPN para acesso rápido

### Problemas comuns

#### Falha na autenticação

- **Senha**: Usuário e senha corretos?
- **Token**: Se usar 2FA, token está válido?
- **Bloqueio**: Conta bloqueada por tentativas?

#### Tempo de conexão

- **Internet**: Qualidade de conexão?
- **Localização**: VPN remota pode ser lenta
- **Portas**: UDP 1194 ou TCP 443 bloqueadas?

#### Máquina não responde

- **VPN ativa** - Conexão realmente estabelecida?
- **Firewall interno** - Máquina permite conexões?
- **Serviços** - SSH, RDP, TeamViewer ativos?

### Segurança importante

- **Desconecte quando terminar** - Evita uso indevido
- **Mantenha cliente atualizado** - Patches de segurança
- **Não compartilhe credenciais** - Comunicação interna
- **VPN só para fins corporativos** - Uso autorizado