# Carpinteiro Orchestrator

Serviço central do workflow de spikes de interesse.

## Responsabilidades

- receber e validar uma ideia;
- solicitar a geração de uma landing page;
- coordenar build e deploy;
- criar e controlar campanhas de mídia;
- consolidar métricas das páginas, CRM e plataformas de anúncios;
- calcular conversão, tração, CPL e status da hipótese;
- manter máquina de estados, idempotência e auditoria.

Não armazena o contato bruto do lead e não renderiza a interface administrativa.

## Casca executável

```bash
docker compose up --build
curl http://localhost:3002/health
```

A especificação inicial completa foi preservada em `docs/product-spec-original.md`. As decisões deste `README.md` e do `AGENTS.md` prevalecem onde a especificação antiga assumir um monorepo.
