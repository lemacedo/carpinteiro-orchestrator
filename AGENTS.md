# Contexto para agentes — Carpinteiro Orchestrator

## Responsabilidade exclusiva

Este módulo é o cérebro do sistema. Ele coordena os outros serviços por API, mantém o estado dos spikes e centraliza métricas sem armazenar PII.

## Limites

- não conter componentes visuais de landing page ou dashboard;
- não persistir e-mail ou telefone de leads;
- não importar código dos repositórios irmãos;
- usar clientes HTTP/eventos versionados;
- toda ação externa deve ser idempotente;
- campanhas devem nascer pausadas;
- ativação exige aprovação explícita e limites de gasto;
- manter Docker como caminho oficial de execução.

## Máquina de estados inicial

```text
DRAFT -> VALIDATED -> PAGE_CREATED -> BUILT -> DEPLOYED
      -> CAMPAIGN_DRAFTED -> AWAITING_APPROVAL -> ACTIVE
      -> PAUSED | COMPLETED | FAILED
```

## Métricas mínimas

Visitantes únicos, cadastros únicos, conversão, gasto, CPL, CTR e conclusão do formulário. A classificação da hipótese deve ser determinística e explicar os critérios utilizados.
