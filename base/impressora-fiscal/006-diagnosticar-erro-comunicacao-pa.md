---
id: artigo-006
titulo: "Como diagnosticar erro de comunicação com o PA"
categoria: "Impressora Fiscal"
---

## Como diagnosticar erro de comunicação com o PA (Autorizador)

O módulo de comunicação com o PA (Provedor de Autorização) é crítico para a emissão de NF-e. Quando ocorre erro de comunicação, a impressora não consegue autorizar documentos fiscais.

### Sintomas comuns

- Mensagens como "Sem conexão com PA", "Timeout", ou "Erro de comunicação"
- NF-e não sendo autorizadas
- Impressora em modo de espera
- LED de comunicação aceso em vermelho

### Diagnóstico passo a passo

1. **Verifique a rede** - Certifique-se de que a rede está funcionando. Teste com outro dispositivo.

2. **Cheque as conexões** - Verifique cabos Ethernet e Wi-Fi (se aplicável).

3. **Acesse o menu de rede** - Localizado em "Configurações" > "Rede" ou "Comunicação".

4. **Verifique IP** - A impressora deve ter IP válido na rede (ex.: 192.168.1.100).

5. **Teste conectividade** - Use a função de "Ping" para testar conexão com gateway.

6. **Verifique DNS** - O PA precisa resover nomes de servidor (ex.: "pa.fazenda.gov.br").

### Soluções comuns

- **Renove DHCP** - Reinicie o router ou configure IP manualmente
- **Verifique firewall** - Portas 443 e 80 podem estar bloqueadas
- ** atualização de firmware** - Verifique se há atualizações disponíveis
- **Reinicie a impressora** - Limpa conexões estabelecidas

### Quando chamar o suporte

Se após todos os testes a comunicação permanecer falhando, pode haver problema na placa de rede interna ou necessidade de troca do equipamento.