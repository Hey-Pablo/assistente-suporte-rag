---
id: artigo-017
titulo: "Como configurar acesso SSH no Windows"
categoria: "Acesso Remoto"
---

## Como configurar acesso SSH no Windows

O SSH permite acesso remoto seguro via linha de comando. Este artigo explica como habilitar e configurar no Windows.

### Habilitar SSH Server

#### Método 1: Features do Windows

1. **Abra "Recursos opcionais"** - `Windows + R` > `optionalfeatures`
2. **Marque "Servidor SSH"** - Em "Recursos do Windows Subsystem para Linux"
3. **Clique em OK** - Aguarde instalação

#### Método 2: PowerShell (recomendado)

```powershell
# Como Administrador
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'
```

### Configurar firewall

```powershell
# Abrir porta 22
New-NetFirewallRule -Name sshd -DisplayName 'SSH Server' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

### Configurar usuário

1. **Usuário Windows padrão** - Pode acessar via SSH com senha
2. **Chave pública** - Gere e configure para uso futuro

#### Gerar par de chaves (no cliente SSH)

```bash
ssh-keygen -t ed25519 -C "seu_email@dominio.com"
# Ou
ssh-keygen -t rsa -b 4096 -C "seu_email@dominio.com"
```

#### Configurar chave pública no servidor

1. Copie conteúdo de `~/.ssh/id_ed25519.pub` (ou `id_rsa.pub`)
2. Cole em `C:\ProgramData\ssh\administrators_authorized_keys`
3. Reinicie o serviço: `Restart-Service sshd`

### Testar conexão

```bash
# Do cliente
ssh usuario@ip-do-servidor
# Ou
ssh usuario@nome-pc.local
```

### Problemas comuns

#### Erro "Connection refused"

- **Verifique**: Serviço SSH rodando (`Get-Service sshd`)
- **Firewall**: Porta 22 liberada?
- **IP**: Endereço correto?

#### Erro "Permission denied"

- **Senha**: Usuário e senha corretos?
- **Chave**: Permissões corretas nos arquivos
- **Usuário**: Usuário tem permissão de login

#### Timeout

- **Rede**: Conexão estável?
- **Porta**: Outro serviço usa a porta 22?

### Segurança avançada

#### Alterar porta padrão

1. Edite `C:\ProgramData\ssh/sshd_config`
2. Mude `Port 22` para outra porta (ex.: `Port 2222`)
3. Reinicie o serviço

#### Desabilitar senha, usar apenas chaves

1. Edite `C:\ProgramData\ssh/sshd_config`
2. Adicione `PasswordAuthentication no`
3. Salve e reinicie

#### Limitar usuários

Adicione no `sshd_config`:
```
AllowUsers usuario1 usuario2
```