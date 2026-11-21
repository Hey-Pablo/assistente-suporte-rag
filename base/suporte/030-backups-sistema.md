---
id: artigo-030
titulo: "Como realizar e verificar backups do sistema"
categoria: "Suporte"
---

## Como realizar e verificar backups do sistema

Backups são essenciais para recuperação de desastres. Este artigo explica como configurações corretas e verificação da integridade.

### Tipos de backup

| Tipo | Frequência | Retenção | Local |
|------|------------|----------|-------|
| Completo | Diário | 30 dias | Servidor local |
| Diferencial | Por hora | 7 dias | Servidor local |
| Incremental | Continuamente | 30 dias | Nuvem |
| Offsite | Semanal | 12 meses | Nuvem |

### Configuração do backup

#### Passo 1: Definir critérios

1. **Dados críticos**:
   - Banco de dados
   - Arquivos de configuração
   - Usuários e permissões
   - Chaves de criptografia

2. **Exclude list**:
   - Arquivos temporários
   - Logs antigos
   - Cache de sistema

#### Passo 2: Configurar ferramenta

```bash
# Exemplo com Bacula
# /etc/bacula/bacula-dir.conf

Job {
  Name = "Backup-Diario"
  JobDefs = "DefaultJob"
  Level = Full
  Client = sistema-fd
  FileSet = "Sistema-Files"
  Schedule = "DailyCycle"
  Storage = File
  RunAlwaysBeforeJob = "/scripts/pre-backup.sh"
}
```

#### Passo 3: Testar backup

```bash
# NoLinux
sudo bacula-console -t "run job=Backup-Diario"

# Verificar log
tail -f /var/log/bacula/bacula.log
```

### Verificação de integridade

#### Verificar tamanho

```bash
# Comparar diretório original com backup
du -sh /dados/original
du -sh /backup/dados-$(date +%Y%m%d)
```

#### Verificar arquivos críticos

```bash
# Verificar banco de dados
pg_dump -h localhost -U postgres sistema | md5sum
cat /backup/sistema-$(date +%Y%m%d).sql | md5sum
```

#### Testar restauração parcial

```bash
# Restaurar um arquivo de teste
tar -tzf /backup/sistema-$(date +%Y%m%d).tar.gz | head -10
```

### Regras de verificação

#### Diária

- [ ] Backup concluído sem erros
- [ ] Log de backup limpo
- [ ] Tamanho do backup dentro do esperado

#### Semanal

- [ ] Teste de restauração de arquivo aleatório
- [ ] Verificação de checksums
- [ ] Reavaliação de espaço em disco

#### Mensal

- [ ] Teste completo de restauração em ambiente de teste
- [ ] Verificação de cadeias de backup
- [ ] Auditoria de permissões

### Script de verificação automática

```bash
#!/bin/bash
# verifica_backup.sh

BACKUP_HOJE=$(ls -la /backup/sistema-$(date +%Y%m%d).tar.gz 2>/dev/null)
if [ -z "$BACKUP_HOJE" ]; then
  echo "ERRO: Backup de hoje não encontrado!"
  exit 1
fi

TAMANHO=$(echo "$BACKUP_HOJE" | awk '{print $5}')
if [ "$TAMANHO" -lt 100000000 ]; then
  echo "AVISO: Backup muito pequeno - pode indicar falha"
  exit 1
fi

echo "Backup verificado com sucesso: $TAMANHO bytes"
exit 0
```

### Recuperação de desastre

#### Plano de recuperação

1. **Identificar falha** - Hardware, software, humano
2. **Localizar backup mais recente válido**
3. **Preparar ambiente novo** - Servidor, rede, permissões
4. **Restaurar dados** - No sentido oposto ao backup
5. **Validar sistema** - Testes funcionais
6. **Retomar operações** - Comunicação dos usuários

#### Tempos de recuperação esperados (RTO)

- **Dados críticos**: < 4 horas
- **Sistema completo**: < 24 horas
- **Ambiente teste**: < 48 horas

### Quando chamar o suporte

- Backup falhou há mais de 2 dias seguidos
- Verificação contínua de integridade detectou corrupção
- Espaço em disco para backup esgotado
- Falha no software de backup sem solução imediata