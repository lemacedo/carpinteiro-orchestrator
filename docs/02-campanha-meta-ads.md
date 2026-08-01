# Etapa 2 — Campanha Meta Ads

## Responsabilidade deste módulo

O Orchestrator mantém a relação entre spike, landing page, campanha, orçamento, métricas e estado operacional. A criação inicial pode ser realizada no Ads Manager, mas os IDs e parâmetros devem ser registrados aqui para automação futura.

## Pré-condições

- landing page publicada e acessível;
- política de privacidade válida;
- imagem e textos revisados;
- conta de anúncios, Página e forma de pagamento aptas;
- orçamento aprovado;
- CRM funcional antes de ativar a veiculação.

## Configuração inicial — Ritmo

```text
Nome: CARPINTEIRO | ritmo | TRAFFIC | BR
Destino: https://ritmo.carpinteiro.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=ritmo-validacao&utm_content=og-v1
Objetivo: Tráfego para o site
País: Brasil
Idade inicial: 18–45
Público: amplo, sem segmentação sensível
Limite total: R$ 20,00
Status inicial: PAUSADA
Criativo: imagem social da landing page Ritmo
```

O limite é total para o experimento, não um orçamento diário. Se o Ads Manager não permitir exatamente R$ 20 de orçamento vitalício devido a mínimos da conta ou duração, a campanha deve permanecer pausada e a limitação deve ser registrada; nunca aumentar o valor automaticamente.

## Ordem operacional

1. abrir o Meta Ads Manager na conta correta;
2. criar campanha com objetivo de tráfego;
3. nomear conforme o padrão;
4. desativar expansões de orçamento que possam superar o limite;
5. configurar orçamento vitalício de R$ 20;
6. direcionar ao domínio publicado com UTMs;
7. selecionar público amplo no Brasil, de 18 a 45 anos;
8. usar posicionamentos automáticos, salvo incompatibilidade do criativo;
9. criar anúncio com copy coerente e imagem aprovada;
10. revisar conta cobrada, período, URL e preview;
11. publicar em estado pausado;
12. salvar Campaign ID, Ad Set ID e Ad ID;
13. ativar somente após o CRM passar no teste de ponta a ponta.

## Copy inicial

```text
Texto principal: Metas grandes não precisam de planos impossíveis. Conheça o Ritmo e entre na lista para testar uma forma mais leve de avançar todos os dias.
Título: Menos planos abandonados. Mais dias que contam.
Descrição: Entre na lista de acesso antecipado.
CTA: Saiba mais
```

## Métricas

- impressões;
- alcance;
- cliques no link;
- visualizações da landing page;
- CTR;
- gasto;
- leads únicos;
- conversão da landing page;
- custo por lead.

## Critérios de aceite

- URL final aponta para o site correto;
- orçamento não pode ultrapassar R$ 20;
- campanha, conjunto e anúncio começam pausados;
- nenhuma segmentação sensível é usada;
- IDs e UTMs ficam registrados;
- ativação ocorre somente após o teste real do CRM.
