# Etapa 4 — Produção de imagens, vídeos e criativos

## Responsabilidade

Esta etapa transforma a hipótese do spike e o conteúdo da landing page em um pacote pequeno de peças para tráfego pago. Ela organiza briefing, conceitos, copies, imagens, vídeos, revisão, aprovação, armazenamento e feedback de desempenho.

Não cria orçamento, não ativa campanhas e não publica automaticamente em redes sociais. O Meta Ads recebe apenas arquivos que estejam em estado `APPROVED`.

## Objetivo inicial

Produzir diversidade suficiente para descobrir qual ângulo gera interesse sem criar dezenas de variações sem propósito ou fazer uploads repetitivos que aumentem o risco operacional da conta.

O primeiro lote de cada spike fica limitado a:

- 3 conceitos criativos;
- até 2 peças por conceito;
- máximo de 6 peças aprováveis;
- 2 copies principais e 3 títulos curtos;
- 1 CTA coerente com a landing page.

Qualquer expansão exige uma nova decisão baseada nas métricas do lote anterior.

## Entradas obrigatórias

- nome e slug do spike;
- hipótese que será validada;
- público pretendido e problema percebido;
- proposta de valor e CTA da landing page;
- URL pública e política de privacidade;
- restrições de marca, tom e alegações proibidas;
- plataforma, posicionamentos e objetivo da campanha;
- orçamento máximo aprovado.

Se alguma entrada essencial estiver ausente, a etapa permanece em `BRIEF_REQUIRED`.

## Processo

### 1. Briefing

A IA cria um briefing curto com:

- uma única promessa principal, sem garantias enganosas;
- dor ou desejo que será explorado;
- prova disponível de verdade;
- público e contexto de uso;
- tom visual e verbal;
- CTA e destino;
- riscos de política ou interpretação.

Estado resultante: `BRIEFED`.

### 2. Matriz de conceitos

Criar três conceitos com funções diferentes:

1. **Problema reconhecível:** ajuda a pessoa a se identificar com a situação;
2. **Transformação possível:** mostra o benefício sem prometer resultado garantido;
3. **Demonstração do produto:** apresenta como a experiência funcionaria.

Cada conceito deve ter hook, mensagem central, direção visual, copy, título e CTA.

### 3. Geração de imagens

Formatos iniciais:

| Uso | Proporção | Tamanho recomendado |
|---|---:|---:|
| Feed quadrado | `1:1` | `1080 × 1080` |
| Feed vertical | `4:5` | `1080 × 1350` |
| Stories/Reels | `9:16` | `1080 × 1920` |

Regras:

- respeitar área segura para textos e interfaces;
- não incluir logos, marcas ou pessoas reais sem autorização;
- não inventar depoimentos, avaliações, números ou selos;
- não gerar conteúdo sensível direcionado a atributos pessoais;
- manter texto curto e legível em tela pequena;
- salvar prompt, modelo, data, seed quando existir e versão do briefing.

### 4. Geração de vídeos

Pacote inicial:

- proporção `9:16`;
- duração preferencial entre 6 e 15 segundos;
- hook compreensível nos primeiros 2 segundos;
- mensagem compreensível sem áudio;
- legendas incorporadas;
- CTA final alinhado ao formulário da landing page;
- sem transições que prejudiquem leitura ou acessibilidade.

Antes do vídeo final, gerar roteiro, lista de cenas e storyboard. Não renderizar várias versões completas quando uma prévia de baixa resolução for suficiente para aprovação.

### 5. Copy e variações

Cada lote deve conter:

- texto principal curto e uma alternativa;
- até três títulos;
- descrição opcional;
- CTA suportado pela plataforma;
- UTMs definidas pelo Orchestrator, nunca digitadas manualmente no criativo.

Copy e imagem devem expressar a mesma promessa da landing page.

### 6. Quality Assurance

Toda peça passa pelos seguintes gates:

1. **Conteúdo:** ortografia, clareza, veracidade e coerência;
2. **Visual:** proporção, resolução, área segura, contraste e legibilidade;
3. **Marca:** nome, paleta, tom e uso autorizado de elementos;
4. **Política:** ausência de alegações proibidas, atributos pessoais e conteúdo enganoso;
5. **Destino:** CTA e promessa correspondem à landing page publicada;
6. **Técnico:** arquivo abre, duração e codec são aceitos e checksum foi registrado;
7. **Aprovação:** decisão humana ou aprovação explícita registrada pelo operador.

Falha em qualquer gate gera `REJECTED` com motivo. A peça não é enviada ao Meta.

## Estados

```text
BRIEF_REQUIRED -> BRIEFED -> CONCEPTED -> GENERATING
               -> IN_REVIEW -> APPROVED -> READY_TO_UPLOAD
               -> UPLOADED -> ACTIVE

IN_REVIEW -> REJECTED -> GENERATING
READY_TO_UPLOAD -> UPLOAD_BLOCKED
```

## Manifesto de cada peça

```json
{
  "creativeId": "ritmo-c01-v01-vertical",
  "spikeId": "ritmo",
  "batchId": "ritmo-2026-08-01-a",
  "concept": "problema-reconhecivel",
  "type": "image",
  "format": "9:16",
  "status": "IN_REVIEW",
  "briefVersion": 1,
  "promptVersion": 1,
  "copyVersion": 1,
  "source": {
    "provider": "generated",
    "model": "registrar-no-momento-da-geracao"
  },
  "checks": {
    "content": "pending",
    "visual": "pending",
    "brand": "pending",
    "policy": "pending",
    "destination": "pending",
    "technical": "pending",
    "approval": "pending"
  },
  "file": {
    "storageKey": null,
    "sha256": null
  }
}
```

O manifesto, briefing, prompts e copies podem ser versionados no Git. Imagens e vídeos finais devem ficar em armazenamento de objetos, como Cloudflare R2; vídeos grandes não devem ser adicionados diretamente ao GitHub.

## Proteção das contas

- gerar e revisar localmente antes de abrir o Meta Ads;
- fazer no máximo um upload por versão aprovada;
- usar nomes e checksums para impedir upload duplicado;
- não tentar novamente automaticamente após CAPTCHA, erro de permissão, cobrança, política ou rate limit;
- campanha, conjunto e anúncio permanecem pausados durante o upload;
- não trocar conta, Página, identidade ou método de pagamento para contornar um bloqueio;
- registrar o erro e devolver o fluxo para `UPLOAD_BLOCKED`;
- credenciais e tokens nunca entram em prompts, manifests ou Git.

## Métricas e aprendizagem

Por peça, registrar:

- impressão, alcance e frequência;
- cliques, CTR e visualizações da landing;
- gasto e CPM;
- leads atribuídos, conversão e CPL;
- retenção de vídeo em 3 segundos e conclusão, quando aplicável.

O próximo lote deve reutilizar o ângulo vencedor e variar apenas um elemento relevante por vez. Uma peça não é vencedora apenas por CTR alto se não gerar leads qualificados.

## Critérios de aceite

- lote inicial respeita o limite de seis peças;
- briefing e conceitos são rastreáveis;
- formatos necessários foram produzidos;
- nenhum arquivo chega ao Meta sem todos os gates aprovados;
- manifesto contém versão, origem e checksum;
- promessa, copy, CTA e landing são coerentes;
- falhas externas pausam o fluxo sem tentativas agressivas;
- resultado de cada peça pode ser ligado às métricas de conversão.
