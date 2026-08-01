# Contexto para agentes — Carpinteiro Orchestrator

## Responsabilidade exclusiva

Este módulo é o cérebro do sistema. Ele coordena os outros serviços por API, mantém o estado dos spikes e centraliza métricas sem armazenar PII.

## Superfícies do módulo

- API de coordenação e métricas, sem PII;
- dashboard web local para visualizar o estado dos spikes e operar o fluxo;
- a API e o dashboard rodam no mesmo container e na mesma porta.

## Limites

- não reproduzir a landing page do produto validado;
- não persistir e-mail ou telefone de leads;
- não importar código dos repositórios irmãos;
- usar clientes HTTP/eventos versionados;
- toda ação externa deve ser idempotente;
- campanhas devem nascer pausadas;
- criativos nunca devem ser enviados ou publicados sem passar pelos gates de conteúdo, formato e aprovação;
- não repetir uploads ou publicações automaticamente após alertas de segurança, permissão, cobrança ou rate limit;
- ativação exige aprovação explícita e limites de gasto;
- manter Docker como caminho oficial de execução.

## Dashboard

O dashboard deve usar React e React Flow, consumir somente a API do próprio Orchestrator e representar visualmente a máquina de estados. Ele pode exibir totais agregados, URLs públicas, IDs operacionais e bloqueios, mas nunca PII dos leads.

## Máquina de estados inicial

```text
DRAFT -> VALIDATED -> PAGE_CREATED -> BUILT -> DEPLOYED
      -> CREATIVE_BRIEFED -> CREATIVE_GENERATED -> CREATIVE_APPROVED
      -> CAMPAIGN_DRAFTED -> AWAITING_APPROVAL -> ACTIVE
      -> PAUSED | COMPLETED | FAILED
```

## Métricas mínimas

Visitantes únicos, cadastros únicos, conversão, gasto, CPL, CTR e conclusão do formulário. A classificação da hipótese deve ser determinística e explicar os critérios utilizados.
