---
id: artigo-016
titulo: "Como configurar TeamViewer para acesso remoto"
categoria: "Acesso Remoto"
---

## Como configurar TeamViewer para acesso remoto

O TeamViewer é uma ferramenta popular de acesso remoto. Esta configuração é útil para suporte técnico rápido e sem necessidade de navegador.

### Instalação

1. **Faça download oficial** - site.teamviewer.com
2. **Execute instalador** - Como usuário comum (não administrador)
3. **Aceite termos** - Instalação padrão é suficiente

### Configuração inicial

1. **Abra o TeamViewer** - Será executado automaticamente após instalação
2. **Veja o ID** - Mostrado na janela principal (ex.: 123 456 789)
3. **Veja a senha temporária** - Altera a cada reinício

### Configurações recomendadas

#### Acesso permanente

1. Clique em "Opções" > "Segurança"
2. Ative "Conexão com senha fixa"
3. Defina senha forte (mínimo 8 caracteres)
4. Salve as configurações

#### Desconexão automática

1. Em "Opções" > "Conexão"
2. Configure "Desconectar após" - 15 minutos de inatividade
3. Ative "Solicitar confirmação" - Ao conectar

#### Controle completo

1. Em "Opções" > "Segurança"
2. Ative "Permitir controle total"
3. Desative "Somente visualização"

### Permissões do sistema

#### Windows

- **Firewall**: Adicionar exceção para TeamViewer
- **Controle de contas**: Permitir acesso remoto
- **Usuário final**: TeamViewer pode estar em "Segurança do Windows Defender SmartScreen"

#### Linux

- Verifique permissões do usuário
- Instale via repositório oficial para melhor integração

### Como conectar

1. **Forneça o ID** - Do cliente para o suporte
2. **Forneça a senha** - Ou configure senha fixa
3. **Clique em "Conectar"** - Na interface do suporte

### Monitoramento

1. **Verifique quem está conectado** - Aba "Sessões"
2. **Desconecte sessões** - Botão "Desconectar"
3. **Bloqueie IP** - Em "Lista de bloqueio" se necessário

### Segurança adicional

- **Lista branca**: Adicione apenas IDs de confiança
- **Bloqueio por IP**: Limite conexões suspeitas
- **Logs**: Ative registro de conexões
- **Senha fixa**: Use senha forte e única