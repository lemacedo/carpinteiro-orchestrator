# Carpinteiro Orchestrator

Dashboard web e serviço central do workflow de spikes de interesse.

## Responsabilidades

- receber e validar uma ideia;
- solicitar a geração de uma landing page;
- coordenar build e deploy;
- criar e controlar campanhas de mídia;
- consolidar métricas das páginas, CRM e plataformas de anúncios;
- calcular conversão, tração, CPL e status da hipótese;
- manter máquina de estados, idempotência e auditoria.
- oferecer uma visão React Flow do pipeline, estados, métricas e bloqueios.

Não armazena o contato bruto do lead. A interface administrativa consome apenas dados agregados da API do próprio módulo.

## Casca executável

```bash
docker compose up --build
curl http://localhost:3002/health
```

Abra `http://localhost:3002` para acessar o dashboard. A mesma porta também expõe `GET /health`, `GET /v1/spikes` e `GET /v1/spikes/:id`.

Para desenvolvimento visual com atualização automática, `npm run dev` usa a porta `5173`; o caminho oficial de verificação continua sendo o Docker na porta `3002`.

A especificação inicial completa foi preservada em `docs/product-spec-original.md`. As decisões deste `README.md` e do `AGENTS.md` prevalecem onde a especificação antiga assumir um monorepo.
