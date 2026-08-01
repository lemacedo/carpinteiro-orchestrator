# Etapa 3 — Dashboard local do Orchestrator

## Responsabilidade

O dashboard é a interface operacional do Carpinteiro. Ele representa visualmente o pipeline de cada spike, consolida métricas agregadas e explica por que uma etapa está concluída, bloqueada ou aguardando.

Ele não armazena PII, não substitui as landing pages e não ativa campanhas automaticamente.

## Arquitetura

- React para a interface;
- React Flow para o mapa interativo do processo;
- API e arquivos estáticos servidos pelo mesmo processo Node;
- um único container Docker;
- porta oficial local `3002`.

## Endpoints

```text
GET /                  Dashboard
GET /health            Saúde do serviço
GET /v1/spikes         Lista consolidada
GET /v1/spikes/:id     Detalhes de um spike
```

## Dados permitidos

- nome, hipótese, estado e categoria do spike;
- URLs públicas e IDs operacionais;
- métricas agregadas;
- status e bloqueios das etapas;
- orçamento e gasto.

Nome, e-mail e telefone de leads não podem aparecer neste módulo.

## Execução

```bash
docker compose up --build -d
```

Acesso: `http://localhost:3002`.

## Critérios de aceite

- dashboard e API respondem pela porta `3002`;
- mapa permite zoom, pan, seleção e reposicionamento dos nós;
- seleção de uma etapa atualiza seu painel de detalhes;
- estado do Ritmo corresponde aos recursos realmente criados;
- bloqueios do Meta estão visíveis;
- execução oficial ocorre pelo Docker.
