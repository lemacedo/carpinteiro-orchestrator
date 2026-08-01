# Carpinteiro — Orquestrador de Spikes de Interesse

> Documento original de produto, preservado como referência histórica. A arquitetura atual usa quatro repositórios independentes (`pages`, `crm`, `orchestrator` e `web`). Em caso de conflito, o `README.md` e o `AGENTS.md` de cada módulo prevalecem sobre as referências antigas a um monorepo.

> Especificação de produto e plano de implementação para execução pelo Codex 5.6 Luna.
>
> Última revisão: 2026-08-01.

## 1. Visão do produto

Transformar o Carpinteiro em uma fábrica automatizada de experimentos de demanda para ideias de produtos digitais, como aplicativos, SaaS, jogos e serviços.

O usuário fornece uma ideia estruturada. O Carpinteiro deve:

1. criar um projeto isolado para a ideia;
2. gerar uma landing page baseada em um template de alta conversão;
3. validar e construir a página;
4. publicá-la em um subdomínio de `carpinteiro.app` por meio do Cloudflare Workers;
5. configurar a captura segura de e-mail e/ou celular;
6. criar a campanha, o conjunto de anúncios, os criativos e os anúncios no Meta Ads;
7. solicitar aprovação antes de começar a gastar dinheiro;
8. acompanhar visitas, cadastros, conversão e custo por lead;
9. permitir pausar, encerrar, comparar e exportar o resultado do experimento.

Exemplo:

```text
Ideia: aplicativo que cria treinos de corrida personalizados
Slug: treinador-corrida
URL: https://treinador-corrida.carpinteiro.app
Diretório: spikes/treinador-corrida/
Campanha: CARPINTEIRO | treinador-corrida | leads | pt-BR
```

## 2. Resultado esperado

O fluxo completo deverá ser reproduzível, auditável e idempotente: executar novamente uma etapa não pode criar recursos duplicados nem perder os IDs dos recursos externos já criados.

Ao final de cada spike, o sistema deverá responder objetivamente:

- quantas pessoas qualificadas visitaram a página;
- quantas começaram e concluíram o cadastro;
- qual foi a taxa de conversão da landing page;
- quanto foi gasto;
- qual foi o custo por lead;
- se os critérios definidos para validar ou invalidar a hipótese foram atingidos.

## 3. Decisões de arquitetura

### 3.1. Preservar o app macOS existente

O repositório atual contém um app SwiftUI para macOS que executa e acompanha serviços. Essa base não deve ser descartada.

A implementação deve ser dividida em duas camadas:

- **CLI/orquestrador:** fonte de verdade do fluxo, adequada a automação, testes e CI;
- **app SwiftUI:** interface que cria spikes, executa comandos do orquestrador e exibe estados, logs, URLs e métricas.

O app não deve conter regras críticas de deploy ou anúncios. Ele deve chamar o orquestrador e consumir respostas estruturadas em JSON. Dessa forma, todos os fluxos também funcionam sem a interface gráfica.

### 3.2. Um diretório e um Worker por spike

Cada ideia deverá viver em `spikes/<slug>/`, sem compartilhar arquivos mutáveis com outras ideias. O projeto é gerado a partir de uma versão do template, mas passa a ser independente depois da criação.

Cada spike terá:

- conteúdo e identidade visual próprios;
- configuração própria;
- testes próprios;
- build próprio;
- Worker próprio;
- subdomínio próprio;
- IDs externos próprios;
- histórico de execução próprio.

### 3.3. Cloudflare Workers com Static Assets

Usar Cloudflare Workers com Static Assets para servir a landing page e tratar rotas como `/api/leads`. O Worker será a origem do subdomínio e deverá usar um **Custom Domain**, por exemplo `treinador-corrida.carpinteiro.app`.

Essa escolha segue a recomendação atual do Cloudflare para novos projetos com conteúdo estático e lógica de Worker. Um Custom Domain é adequado quando o Worker é a origem e também permite que o Cloudflare cuide do registro DNS e do certificado do subdomínio.

Não usar o termo “Cloudflare Page” como unidade técnica nesta implementação. O recurso de publicação será um **Cloudflare Worker com Static Assets**.

### 3.4. Objetivo padrão de campanha: Leads

Embora a solicitação original mencione campanha de tráfego, o resultado de negócio é o cadastro de e-mail ou celular. Portanto:

- o objetivo padrão no Meta Ads será **Leads**;
- a localização da conversão será o website;
- o evento principal será `Lead`;
- o objetivo **Traffic** poderá ser selecionado explicitamente para um experimento que deseje somente visitas ou visualizações da landing page.

O Meta informa que Traffic é voltado a levar pessoas a um destino e recomenda Leads quando o objetivo é obter contatos. A decisão deverá permanecer configurável porque disponibilidade e nomes de parâmetros podem mudar entre versões da Marketing API.

### 3.5. Criação automática e ativação controlada

O sistema poderá criar automaticamente no Meta:

- campanha;
- conjunto de anúncios;
- criativo;
- anúncio.

Todos deverão ser criados inicialmente com status `PAUSED`. A mudança para `ACTIVE` exige uma aprovação explícita no CLI ou no app, mostrando pelo menos:

- URL final;
- criativos;
- público;
- posicionamentos;
- orçamento diário;
- limite total do experimento;
- data de início e de término;
- conta de anúncios que será cobrada.

Depois que o fluxo estiver validado em produção, poderá existir uma configuração opcional de autoativação, limitada por teto diário e teto total. O padrão continuará sendo exigir aprovação.

## 4. Estrutura proposta do repositório

```text
carpinteiro/
├── Sources/                         # app SwiftUI existente
├── Tests/                           # testes Swift existentes
├── orchestrator/                    # CLI e regras do fluxo
│   ├── src/
│   │   ├── commands/
│   │   ├── cloudflare/
│   │   ├── meta/
│   │   ├── generator/
│   │   ├── analytics/
│   │   ├── contracts/
│   │   └── state/
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
├── templates/
│   └── landing-v1/                  # template versionado e imutável
├── spikes/
│   └── <slug>/
│       ├── idea.yaml                # solicitação original normalizada
│       ├── spike.json               # configuração validada
│       ├── state.json               # estado e IDs externos, sem segredos
│       ├── README.md                # como executar este spike
│       ├── src/                     # página e componentes isolados
│       ├── public/                  # imagens, ícones e arquivos públicos
│       ├── worker/                  # API de leads e tracking
│       ├── tests/
│       ├── dist/                    # ignorado pelo Git
│       ├── package.json
│       └── wrangler.jsonc
├── platform/
│   ├── migrations/                  # banco central de leads e eventos
│   └── privacy/                     # textos e políticas versionadas
├── schemas/
│   ├── idea.schema.json
│   ├── state.schema.json
│   └── event.schema.json
├── docs/
│   ├── setup-cloudflare.md
│   ├── setup-meta.md
│   ├── privacidade-lgpd.md
│   └── operacao-e-incidentes.md
├── .env.example                     # somente nomes e exemplos fictícios
└── ORQUESTRADOR_DE_SPIKES.md
```

`dist/`, `.dev.vars`, `.wrangler/`, arquivos de credenciais e tokens devem ser ignorados pelo Git.

## 5. Contrato de entrada de uma ideia

O formato canônico será YAML, validado por JSON Schema antes de gerar qualquer arquivo ou recurso externo.

Exemplo:

```yaml
version: 1
name: Treinador de Corrida com IA
slug: treinador-corrida
product_type: app
locale: pt-BR

hypothesis:
  problem: Corredores iniciantes não sabem ajustar volume e intensidade.
  audience: Pessoas de 25 a 45 anos que começaram a correr recentemente.
  solution: Um aplicativo que cria e adapta o treino semanal.
  value_proposition: Receba um plano de corrida que evolui com você.

landing:
  primary_cta: Quero testar primeiro
  collect:
    - email
    - whatsapp
  allow_contact_choice: true
  visual_direction: Esportivo, acolhedor e confiável.
  proof: [] # nunca inventar depoimentos, números ou parceiros

campaign:
  objective: leads
  country: BR
  languages:
    - pt-BR
  age_min: 25
  age_max: 45
  audience_notes:
    - corrida de rua
    - iniciantes em atividade física
  daily_budget_brl: 30
  total_budget_cap_brl: 300
  duration_days: 10
  require_activation_approval: true

success:
  minimum_unique_visitors: 300
  minimum_leads: 20
  minimum_conversion_rate_percent: 5
  maximum_cost_per_lead_brl: 15
```

### 5.1. Campos obrigatórios

- `name`;
- `slug`, usando apenas letras minúsculas, números e hífen;
- `product_type`;
- problema;
- público;
- solução;
- proposta de valor;
- pelo menos um canal de contato;
- orçamento diário e limite total;
- duração;
- critérios mensuráveis de sucesso.

### 5.2. Regras de validação

- rejeitar slug já existente, salvo quando o comando for de atualização;
- impedir subdomínios reservados como `www`, `api`, `admin`, `app` e `status`;
- impedir orçamento diário ou total igual a zero ou negativo;
- impedir orçamento diário maior que o limite total;
- impedir ativação sem data final ou limite total;
- não publicar alegações, preços, resultados, depoimentos ou selos não fornecidos pelo usuário;
- pedir revisão quando o produto estiver em uma categoria regulada ou sensível;
- registrar a versão do template, do schema e do gerador.

## 6. Template de landing page

### 6.1. Objetivo

O template deve reduzir fricção e comunicar a hipótese com clareza. “Maior conversão possível” não deve significar manipulação, falsa urgência ou informação inventada.

### 6.2. Estrutura mínima

1. barra simples com nome ou marca;
2. hero com título, subtítulo, benefício principal e CTA;
3. formulário curto visível sem exigir navegação;
4. três benefícios concretos;
5. demonstração visual do conceito;
6. explicação em três passos;
7. prova social somente quando real e informada;
8. FAQ com objeções do público;
9. repetição do CTA;
10. rodapé com identificação do responsável, privacidade e contato.

### 6.3. Formulário

- solicitar somente e-mail, celular ou a escolha entre eles;
- normalizar telefone para E.164;
- validar os dados no cliente e novamente no servidor;
- informar claramente por que o dado será usado;
- exigir consentimento separado quando houver comunicação de marketing;
- ter links para política de privacidade e exercício de direitos;
- usar honeypot, rate limit e Cloudflare Turnstile;
- apresentar sucesso sem recarregar a página;
- nunca enviar o contato para ferramentas de analytics no navegador.

### 6.4. Eventos

Eventos mínimos:

```text
page_view
cta_click
form_start
form_validation_error
lead_submit
lead_success
lead_duplicate
```

Cada evento deverá carregar `spike_id`, `event_id`, horário, URL, UTMs e versão da página. Dados pessoais não devem ser incluídos em eventos de analytics.

### 6.5. Qualidade

- responsivo a partir de 320 px;
- acessível por teclado e compatível com leitores de tela;
- contraste conforme WCAG AA;
- HTML semântico;
- imagens dimensionadas e otimizadas;
- JavaScript mínimo;
- metas de SEO e compartilhamento social;
- `robots.txt` configurável para permitir ou bloquear indexação;
- nenhum erro no console;
- sem dependência de serviços remotos para renderizar o conteúdo essencial.

Metas iniciais de performance em dispositivo móvel:

- Lighthouse Performance >= 90;
- Accessibility >= 95;
- Best Practices >= 95;
- SEO >= 90;
- LCP <= 2,5 s;
- CLS <= 0,1.

Falhas nessas metas devem bloquear o deploy de produção, salvo aprovação registrada.

## 7. Captura, armazenamento e proteção de leads

### 7.1. Endpoint

Cada Worker deverá expor:

```http
POST /api/leads
Content-Type: application/json
```

Payload conceitual:

```json
{
  "email": "pessoa@exemplo.com",
  "phone": "+5511999999999",
  "contactPreference": "whatsapp",
  "consents": {
    "interestResearch": true,
    "marketing": false,
    "privacyPolicyVersion": "2026-08-01"
  },
  "attribution": {
    "utmSource": "meta",
    "utmCampaign": "treinador-corrida",
    "utmContent": "criativo-a"
  },
  "turnstileToken": "..."
}
```

### 7.2. Persistência

Usar inicialmente um banco Cloudflare D1 central, com isolamento lógico por `spike_id`. Isso simplifica relatórios e evita criar um banco por página. O código e o deploy de cada site continuam isolados.

Tabelas mínimas:

- `spikes`;
- `leads`;
- `consents`;
- `events`;
- `deployments`;
- `campaigns`;
- `audit_log`.

Dados de contato devem ser:

- normalizados;
- criptografados pela aplicação antes de persistir;
- deduplicados por HMAC do valor normalizado;
- excluíveis por spike ou por titular;
- protegidos por política de retenção configurável.

Não guardar IP completo. Quando necessário para segurança, guardar somente representação truncada ou hash rotativo, com prazo curto de retenção.

### 7.3. LGPD

A implementação deve fornecer controles técnicos, mas os textos legais e a definição da base legal precisam de validação do responsável pelo tratamento.

Requisitos mínimos:

- finalidade explícita;
- identificação do controlador;
- consentimentos versionados quando utilizados;
- minimização de dados;
- prazo de retenção;
- exportação e exclusão;
- trilha de auditoria;
- política de privacidade acessível;
- mecanismo de revogação de consentimento;
- não disparar Pixel, Conversions API ou cookies de marketing antes do consentimento aplicável.

## 8. Integração com Cloudflare

### 8.1. Pré-requisitos externos

O e-mail `contato@4m.dev.br` identifica a conta pretendida, mas não é suficiente para automação. Configurar externamente:

- `CLOUDFLARE_ACCOUNT_ID`;
- `CLOUDFLARE_ZONE_ID` da zona `carpinteiro.app`;
- `CLOUDFLARE_API_TOKEN` com o menor conjunto de permissões necessário;
- banco D1 e seu binding;
- Turnstile site key e secret;
- chave de criptografia/HMAC no Secrets Store ou em Worker Secrets.

Nenhum desses valores pode ser commitado.

### 8.2. Configuração por spike

Exemplo conceitual de `wrangler.jsonc`:

```jsonc
{
  "$schema": "../../node_modules/wrangler/config-schema.json",
  "name": "carpinteiro-treinador-corrida",
  "main": "worker/index.ts",
  "compatibility_date": "<data definida na geração>",
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "run_worker_first": ["/api/*"]
  },
  "routes": [
    {
      "pattern": "treinador-corrida.carpinteiro.app",
      "custom_domain": true
    }
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "carpinteiro-leads",
      "database_id": "<configuração externa>"
    }
  ]
}
```

IDs reais não devem ser escritos no template. A geração pode materializar IDs não secretos no arquivo específico do spike ou fornecê-los por ambiente.

### 8.3. Deploy seguro

Fluxo obrigatório:

1. validar schema e secrets necessários;
2. instalar dependências com lockfile;
3. executar lint, testes e build;
4. executar auditorias de conteúdo e privacidade;
5. publicar uma versão de preview;
6. executar smoke test e teste E2E no preview;
7. publicar em produção;
8. validar DNS, TLS, página, formulário e persistência;
9. salvar URL, versão e identificador do deploy em `state.json`;
10. disponibilizar rollback para a versão anterior.

## 9. Integração com Meta Ads

### 9.1. Pré-requisitos externos

- Business Manager configurado;
- conta de anúncios e forma de pagamento válidas;
- `META_AD_ACCOUNT_ID`;
- `META_PAGE_ID`;
- Instagram Actor ID, quando aplicável;
- Pixel/Dataset ID;
- token de System User com permissões mínimas necessárias;
- app Meta aprovado para os recursos utilizados;
- página, domínio e identidade do anunciante aptos a anunciar;
- versão da Graph/Marketing API fixada e testada.

O token deverá ficar em um gerenciador de segredos. Nunca gravá-lo em `idea.yaml`, `state.json`, logs ou comandos exibidos na interface.

### 9.2. Recursos criados

Para cada spike:

1. campanha;
2. conjunto de anúncios;
3. um ou mais criativos;
4. um ou mais anúncios;
5. parâmetros UTM únicos;
6. eventos Pixel e Conversions API, quando houver consentimento.

Padrão de nomes:

```text
Campaign: CARPINTEIRO | <slug> | LEADS | <YYYY-MM-DD>
Ad set:  <slug> | <country> | <audience-version>
Ad:      <slug> | <creative-id> | <copy-version>
```

### 9.3. Estado inicial e aprovação

- criar tudo como `PAUSED`;
- validar o link final e o preview do anúncio;
- apresentar resumo de custo e segmentação;
- exigir `carpinteiro ads approve <slug>`;
- somente depois executar a alteração para `ACTIVE`;
- salvar IDs e respostas sanitizadas da API;
- oferecer `pause` imediato em caso de erro ou teto atingido.

### 9.4. Pixel e Conversions API

Quando autorizados:

- emitir evento `Lead` no navegador após sucesso real do backend;
- emitir o mesmo evento no servidor pela Conversions API;
- reutilizar o mesmo `event_id` para deduplicação;
- não enviar e-mail ou telefone sem normalização e hash exigidos;
- respeitar a escolha de consentimento;
- manter fila/retry com limite e idempotência;
- registrar somente respostas sanitizadas.

### 9.5. Criativos

O gerador deverá produzir pelo menos:

- duas variações de texto principal;
- duas manchetes;
- uma descrição;
- dois conceitos visuais;
- CTA coerente com a landing page.

Nenhum criativo pode incluir alegação não comprovada, marca de terceiro sem autorização, depoimento fictício, antes/depois enganoso ou conteúdo incompatível com políticas do Meta.

## 10. Estados do workflow

```text
DRAFT
  -> VALIDATED
  -> GENERATED
  -> BUILT
  -> PREVIEW_DEPLOYED
  -> QA_PASSED
  -> PRODUCTION_DEPLOYED
  -> CAMPAIGN_DRAFTED
  -> AWAITING_APPROVAL
  -> ACTIVE
  -> PAUSED | COMPLETED
```

Qualquer etapa pode ir para `FAILED`, sempre com:

- código de erro estável;
- mensagem legível;
- etapa que falhou;
- possibilidade de retry;
- logs sanitizados;
- indicação clara de ações manuais necessárias.

`state.json` deve ser escrito atomicamente e conter apenas dados não secretos, incluindo:

```json
{
  "schemaVersion": 1,
  "spikeId": "uuid",
  "slug": "treinador-corrida",
  "status": "AWAITING_APPROVAL",
  "templateVersion": "landing-v1.0.0",
  "cloudflare": {
    "workerName": "carpinteiro-treinador-corrida",
    "productionUrl": "https://treinador-corrida.carpinteiro.app",
    "deploymentId": "..."
  },
  "meta": {
    "campaignId": "...",
    "adSetIds": ["..."],
    "adIds": ["..."],
    "status": "PAUSED"
  }
}
```

## 11. Interface de linha de comando

Comandos previstos:

```bash
carpinteiro spike new caminho/ideia.yaml
carpinteiro spike validate <slug>
carpinteiro spike generate <slug>
carpinteiro spike build <slug>
carpinteiro spike preview <slug>
carpinteiro spike deploy <slug>
carpinteiro spike run <slug> --until awaiting-approval

carpinteiro ads plan <slug>
carpinteiro ads create <slug>
carpinteiro ads approve <slug>
carpinteiro ads activate <slug>
carpinteiro ads pause <slug>

carpinteiro spike status <slug> --json
carpinteiro spike metrics <slug> --json
carpinteiro spike export-leads <slug>
carpinteiro spike stop <slug>
```

Regras:

- `--dry-run` deve existir para ações externas;
- saída humana vai para `stderr` e resposta JSON para `stdout` quando usado `--json`;
- erros devem retornar exit code diferente de zero;
- retries devem ser seguros;
- comandos destrutivos exigem confirmação e não fazem parte do fluxo padrão;
- `run --until awaiting-approval` é o fluxo automático inicial recomendado.

## 12. Integração com o app SwiftUI

Após estabilizar o CLI, adicionar ao app:

- lista de spikes e seus estados;
- formulário guiado para criar uma ideia;
- importação de `idea.yaml`;
- geração e preview da landing page;
- console de execução com logs sanitizados;
- link para o subdomínio;
- resumo da campanha e criativos;
- tela de aprovação de gasto;
- botões ativar, pausar e encerrar;
- dashboard com visitas, leads, conversão, gasto e CPL;
- alertas de erro e teto de orçamento.

O app deve chamar o CLI por meio do `ShellCommandRunner` existente, mas o runner precisará suportar:

- argumentos sem interpolação insegura de shell;
- streaming de stdout/stderr;
- cancelamento;
- timeout;
- parsing de eventos JSON;
- mascaramento de segredos.

## 13. Métricas e regras de decisão

Métricas mínimas:

- impressões;
- alcance;
- CPM;
- cliques no link;
- CTR;
- visualizações da landing page;
- cadastros válidos e únicos;
- taxa de conversão da landing page;
- gasto;
- custo por lead;
- distribuição por criativo e UTM.

Fórmulas:

```text
taxa de conversão = leads únicos / visitantes únicos
custo por lead = gasto / leads únicos
taxa de conclusão = lead_success / form_start
```

O sistema não deve declarar uma ideia “validada” apenas por CTR alto. A decisão deve considerar a amostra mínima, leads únicos, conversão e CPL definidos no arquivo da ideia.

O status analítico pode ser:

- `INSUFFICIENT_DATA`;
- `PROMISING`;
- `VALIDATED`;
- `INVALIDATED`;
- `INCONCLUSIVE`.

As regras que produzem o status devem ser determinísticas e aparecer no relatório.

## 14. Segurança e operação

- princípio do menor privilégio para tokens;
- segredos somente em keychain, ambiente local seguro ou secret manager;
- redaction central antes de qualquer log;
- dependências com lockfile e auditoria;
- validação estrita de toda entrada externa;
- rate limiting e proteção contra bots;
- Content Security Policy e headers de segurança;
- CORS restrito ao domínio do spike;
- backups e migrações do banco;
- trilha de auditoria para deploy, aprovação, ativação e pausa;
- botão/command de emergência para pausar todos os anúncios;
- alerta ao atingir 80% e 100% do teto total;
- pausa automática ao atingir o teto;
- monitoramento do formulário e do endpoint antes e durante a campanha.

Não implementar exclusão automática do Worker, banco, leads ou campanha ao encerrar um spike. O encerramento padrão apenas pausa anúncios, impede novos gastos e preserva dados para auditoria conforme a política de retenção.

## 15. Estratégia de testes

### 15.1. Unitários

- validação e normalização do YAML;
- slug e nomes de recursos;
- transições da máquina de estados;
- cálculo de métricas;
- normalização e deduplicação de contatos;
- sanitização de logs;
- limites de orçamento;
- geração determinística.

### 15.2. Integração

- Cloudflare e Meta com clientes HTTP simulados;
- D1 local;
- Turnstile em modo de teste;
- criação repetida sem duplicar recursos;
- retry depois de falha parcial;
- consentimento e envio condicional de eventos.

### 15.3. End-to-end

- geração de um spike de exemplo;
- build e preview local;
- preenchimento válido e inválido do formulário;
- proteção anti-bot;
- persistência e deduplicação;
- testes mobile e desktop;
- smoke test pós-deploy;
- teste de campanha somente em `PAUSED` ou conta de sandbox/teste.

Chamadas reais que gerem custo não podem fazer parte da suíte automática.

## 16. Fases de implementação

### Fase 0 — Descoberta e preparação

- confirmar que `carpinteiro.app` é uma zona ativa na conta Cloudflare correta;
- levantar Account ID, Zone ID e permissões mínimas;
- confirmar Business Manager, conta de anúncios, Page ID e Pixel/Dataset;
- definir controlador, política de privacidade e retenção;
- registrar decisões em `docs/`.

**Aceite:** checklist de acesso completo, sem segredos no Git.

### Fase 1 — Fundação do orquestrador

- criar CLI em TypeScript;
- criar schemas;
- implementar máquina de estados e escrita atômica;
- implementar `new`, `validate`, `generate`, `build` e `status`;
- adicionar testes e spike de exemplo sem dados reais.

**Aceite:** uma ideia YAML válida gera um projeto isolado e reproduzível.

### Fase 2 — Template de conversão

- construir `landing-v1`;
- implementar conteúdo configurável, formulário, eventos e página de sucesso;
- incluir acessibilidade, SEO, performance e testes E2E;
- bloquear alegações inventadas.

**Aceite:** build passa nos testes e metas de qualidade definidas.

### Fase 3 — Leads, consentimento e métricas

- criar schema e migrations D1;
- implementar API, Turnstile, rate limit, criptografia e deduplicação;
- implementar exportação e exclusão;
- implementar eventos e dashboard básico;
- revisar fluxo de consentimento e LGPD.

**Aceite:** lead válido é salvo uma vez, pode ser exportado/excluído e não vaza em logs.

### Fase 4 — Cloudflare

- criar adaptador Cloudflare;
- implementar preview, produção, Custom Domain e rollback;
- validar DNS, TLS e formulário depois do deploy;
- persistir IDs e URLs.

**Aceite:** dois spikes simultâneos ficam em subdomínios e Workers independentes.

### Fase 5 — Meta Ads

- implementar cliente versionado da Marketing API;
- criar campanha, ad set, criativos e ads pausados;
- implementar UTM, Pixel e Conversions API com deduplicação;
- implementar aprovação, ativação, pausa, teto e sync de métricas;
- testar primeiro com orçamento mínimo controlado.

**Aceite:** o sistema cria recursos pausados de forma idempotente e só ativa após aprovação explícita.

### Fase 6 — App macOS

- modelar Spike e Workflow no Swift;
- integrar os comandos JSON do CLI;
- criar telas de formulário, preview, aprovação, execução e métricas;
- adicionar notificações e ação de pausa emergencial.

**Aceite:** o fluxo principal pode ser operado no app sem esconder parâmetros de gasto.

### Fase 7 — Otimização

- variações de copy e criativos;
- testes A/B com amostra mínima;
- relatórios comparativos;
- alertas de anomalia;
- autoativação opcional com limites;
- fila para vários spikes.

**Aceite:** resultados podem ser comparados sem misturar visitantes, leads, custos ou IDs de campanhas.

## 17. Critérios de aceite do produto inicial

O MVP estará concluído quando:

- uma ideia estruturada criar um diretório isolado;
- a landing page puder ser gerada e alterada sem afetar outras;
- lint, testes, build e auditoria rodarem automaticamente;
- a página for publicada em `<slug>.carpinteiro.app`;
- o formulário aceitar e-mail e/ou celular com proteção contra abuso;
- o lead for persistido, deduplicado e exportável;
- consentimento e atribuição forem registrados;
- a campanha Meta completa for criada em `PAUSED`;
- orçamento, público e criativos forem exibidos para aprovação;
- nenhuma campanha for ativada sem consentimento explícito;
- métricas de site e mídia forem consolidadas por spike;
- o teto total pausar automaticamente a campanha;
- falhas parciais puderem ser retomadas sem duplicar recursos;
- segredos e PII não aparecerem no Git ou nos logs.

## 18. Fora do escopo inicial

- criação do produto final anunciado;
- envio massivo de e-mail, SMS ou WhatsApp;
- CRM completo;
- campanhas em Google, TikTok, LinkedIn ou outras redes;
- otimização autônoma ilimitada de orçamento;
- compra de domínios;
- decisão jurídica automática sobre base legal;
- garantia de uma taxa específica de conversão.

## 19. Instruções de execução para o Codex 5.6 Luna

Ao implementar este documento:

1. leia primeiro `README.md`, `Package.swift`, esta especificação e as instruções locais do repositório;
2. preserve o comportamento atual do app SwiftUI;
3. implemente as fases na ordem descrita;
4. comece pela Fase 1, salvo solicitação explícita diferente;
5. apresente um plano curto antes de alterações estruturais;
6. não invente IDs, tokens, textos legais, provas sociais ou dados de negócio;
7. use adaptadores e mocks antes de acessar serviços reais;
8. mantenha ações externas em `--dry-run` durante o desenvolvimento;
9. crie campanhas sempre em `PAUSED`;
10. não ative gasto sem aprovação explícita do usuário;
11. valide cada fase com testes automatizados e uma verificação funcional;
12. registre decisões arquiteturais relevantes em `docs/`;
13. atualize `README.md` com instalação e uso quando o CLI existir;
14. preserve alterações existentes do usuário que não façam parte da tarefa;
15. ao terminar uma fase, informe arquivos alterados, testes executados, riscos e próximo passo.

Prompt operacional recomendado:

```text
Implemente a próxima fase incompleta de ORQUESTRADOR_DE_SPIKES.md.
Preserve o app SwiftUI existente e trate o CLI como fonte de verdade.
Antes de editar, inspecione o repositório e identifique o estado da fase.
Não use credenciais fictícias como se fossem reais e não execute ações com custo.
Use mocks/dry-run para integrações externas, crie testes proporcionais ao risco e
só considere a fase concluída quando seus critérios de aceite forem demonstrados.
```

## 20. Referências oficiais

- [Cloudflare Workers — Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Workers — Routes and domains](https://developers.cloudflare.com/workers/configuration/routing/)
- [Cloudflare Workers — Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Cloudflare Wrangler — Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Meta — Traffic ad objective](https://www.facebook.com/business/ads/ad-objectives/traffic)
- [Meta — Lead ads](https://www.facebook.com/business/ads/ad-objectives/lead-generation)
- [Meta — About Conversions API](https://www.facebook.com/business/help/AboutConversionsAPI)

Essas referências devem ser consultadas novamente durante a implementação, pois versões, permissões, objetivos e parâmetros de APIs externas mudam com o tempo.
