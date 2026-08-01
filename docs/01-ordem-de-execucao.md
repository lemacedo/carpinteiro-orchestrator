# Ordem de execução de um spike

Cada spike deve seguir a mesma sequência e só avançar quando os critérios da etapa anterior forem demonstrados.

```text
1. Pages: gerar, testar, fazer push, publicar e configurar domínio
2. CRM: disponibilizar captura, persistência e integrar o formulário
3. Validação: cadastrar lead sintético e verificar atribuição
4. Criativos: gerar briefing, conceitos, imagens, vídeos e copies; revisar e aprovar
5. Meta Ads: criar campanha com teto de gasto e deixá-la pausada
6. Ativação: ativar somente depois do fluxo completo funcionar
7. Métricas: consolidar visitas, leads, conversão, gasto e CPL
```

## Gates obrigatórios

- não criar campanha antes de existir URL pública estável;
- não ativar campanha antes de o CRM confirmar um lead real;
- não enviar um criativo ao Meta antes de ele estar em estado `APPROVED`;
- não gerar mais de seis peças no primeiro lote sem uma decisão explícita;
- não avançar orçamento sem nova decisão explícita;
- não considerar sucesso apenas por cliques;
- registrar URLs, commits, deploys, Campaign ID, Ad Set ID e Ad ID;
- uma falha deve pausar a sequência sem apagar recursos anteriores.

## Documentos por responsabilidade

- Pages: `pages/docs/01-landing-page-e-cloudflare.md`;
- Meta Ads: `orchestrator/docs/02-campanha-meta-ads.md`;
- CRM: `crm/docs/03-api-de-leads.md`.
- Criativos: `orchestrator/docs/04-processo-de-criativos.md`.

Cada documento é a referência operacional do módulo. O Orchestrator apenas coordena as transições e não deve incorporar a implementação interna dos outros repositórios.
