export const spikes = [
  {
    id: "ritmo",
    name: "Ritmo",
    category: "Aplicativo de produtividade",
    hypothesis: "Planos diários curtos aumentam a consistência sem culpa.",
    state: "AWAITING_APPROVAL",
    health: "attention",
    publicUrl: "https://ritmo.carpinteiro.app",
    crmUrl: "https://crm.carpinteiro.app",
    metrics: { visitors: 0, leads: 0, conversionRate: 0, spend: 0, budget: 20, ctr: 0, cpl: null },
    creative: {
      status: "UPLOAD_BLOCKED",
      approvalGate: "EXPLICIT_APPROVAL",
      maxInitialAssets: 6,
      concepts: ["Problema reconhecível", "Transformação possível", "Demonstração do produto"],
      formats: ["1:1 · 1080 × 1080", "4:5 · 1080 × 1350", "9:16 · 1080 × 1920"],
      primaryCreativeId: "ritmo-c03-demonstracao-4x5",
      assets: [
        { id: "ritmo-c01-problema-4x5", concept: "Problema reconhecível", status: "APPROVED" },
        { id: "ritmo-c02-transformacao-4x5", concept: "Transformação possível", status: "APPROVED" },
        { id: "ritmo-c03-demonstracao-4x5", concept: "Demonstração do produto", status: "READY_TO_UPLOAD" },
      ],
      blockers: [
        "Upload de arquivos desabilitado no navegador conectado",
        "Saldo pendente na conta Meta",
        "Página do Facebook indisponível",
        "Erro de permissão #1487194"
      ],
    },
    campaign: {
      id: "120255839923790715",
      adSetId: "120255839923800715",
      adId: "120255839923810715",
      status: "BLOCKED",
      blockers: [
        "Pagamento pendente na conta Meta",
        "Página do Facebook não disponível",
        "Permissão do criativo recusada (#1487194)",
      ],
    },
    steps: [
      { id: "idea", label: "Ideia", status: "done", detail: "Hipótese e público definidos" },
      { id: "page", label: "Landing", status: "done", detail: "ritmo.carpinteiro.app" },
      { id: "deploy", label: "Cloudflare", status: "done", detail: "Build e domínio ativos" },
      { id: "crm", label: "CRM", status: "done", detail: "D1 e captura validados" },
      { id: "creative", label: "Criativos", status: "blocked", detail: "3 aprovados · upload bloqueado" },
      { id: "meta", label: "Meta Ads", status: "blocked", detail: "Rascunho pausado · R$ 20" },
      { id: "metrics", label: "Tração", status: "waiting", detail: "Aguardando campanha" },
    ],
    updatedAt: "2026-08-01T19:05:00.000Z",
  },
];
