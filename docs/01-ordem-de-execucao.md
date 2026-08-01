# Ordem de execução de um spike

Cada spike deve seguir a mesma sequência e só avançar quando os critérios da etapa anterior forem demonstrados.

```text
1. Pages: gerar, testar, fazer push, publicar e configurar domínio
2. Meta Ads: criar campanha com teto de gasto e deixá-la pausada
3. CRM: criar API, persistência e integrar o formulário
4. Validação: cadastrar lead real de teste e verificar atribuição
5. Ativação: ativar a campanha somente depois do fluxo completo funcionar
6. Métricas: consolidar visitas, leads, conversão, gasto e CPL
```

## Gates obrigatórios

- não criar campanha antes de existir URL pública estável;
- não ativar campanha antes de o CRM confirmar um lead real;
- não avançar orçamento sem nova decisão explícita;
- não considerar sucesso apenas por cliques;
- registrar URLs, commits, deploys, Campaign ID, Ad Set ID e Ad ID;
- uma falha deve pausar a sequência sem apagar recursos anteriores.

## Documentos por responsabilidade

- Pages: `pages/docs/01-landing-page-e-cloudflare.md`;
- Meta Ads: `orchestrator/docs/02-campanha-meta-ads.md`;
- CRM: `crm/docs/03-api-de-leads.md`.

Cada documento é a referência operacional do módulo. O Orchestrator apenas coordena as transições e não deve incorporar a implementação interna dos outros repositórios.
