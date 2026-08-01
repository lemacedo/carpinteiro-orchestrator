import { useCallback, useEffect, useMemo, useState } from "react";
import { Background, Controls, Handle, MarkerType, MiniMap, Position, ReactFlow, applyNodeChanges } from "@xyflow/react";

const statusLabels = { done: "Concluído", blocked: "Bloqueado", waiting: "Em espera" };

function FlowNode({ data, selected }) {
  return (
    <article className={`flow-node flow-node--${data.status} ${selected ? "is-selected" : ""}`}>
      <Handle type="target" position={Position.Left} />
      <div className="flow-node__topline"><span>{data.order}</span><span className="status-dot" aria-hidden="true" /></div>
      <strong>{data.label}</strong>
      <p>{data.detail}</p>
      <small>{statusLabels[data.status]}</small>
      <Handle type="source" position={Position.Right} />
    </article>
  );
}

const nodeTypes = { spikeStep: FlowNode };
const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function App() {
  const [spikes, setSpikes] = useState([]);
  const [selectedSpikeId, setSelectedSpikeId] = useState("ritmo");
  const [selectedStepId, setSelectedStepId] = useState("meta");
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/v1/spikes")
      .then((response) => {
        if (!response.ok) throw new Error("Não foi possível carregar os spikes.");
        return response.json();
      })
      .then(({ data }) => setSpikes(data))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const spike = spikes.find(({ id }) => id === selectedSpikeId) ?? spikes[0];

  useEffect(() => {
    if (!spike) return;
    setNodes(spike.steps.map((step, index) => ({
      id: step.id,
      type: "spikeStep",
      position: { x: index * 245, y: index % 2 === 0 ? 70 : 210 },
      data: { ...step, order: String(index + 1).padStart(2, "0") },
    })));
  }, [spike]);

  const edges = useMemo(() => {
    if (!spike) return [];
    return spike.steps.slice(0, -1).map((step, index) => {
      const next = spike.steps[index + 1];
      const blocked = next.status === "blocked" || step.status === "blocked";
      const color = blocked ? "#d8795c" : "#76a873";
      return {
        id: `${step.id}-${next.id}`,
        source: step.id,
        target: next.id,
        animated: !blocked && next.status === "done",
        markerEnd: { type: MarkerType.ArrowClosed, color },
        style: { stroke: color, strokeWidth: 2, strokeDasharray: blocked ? "7 7" : undefined },
      };
    });
  }, [spike]);

  const onNodesChange = useCallback((changes) => setNodes((current) => applyNodeChanges(changes, current)), []);
  const selectedStep = spike?.steps.find(({ id }) => id === selectedStepId) ?? spike?.steps[0];

  if (loading) return <main className="state-screen">Carregando a oficina…</main>;
  if (error || !spike) return <main className="state-screen state-screen--error">{error || "Nenhum spike encontrado."}</main>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand__mark">C</span>
          <div><strong>carpinteiro</strong><small>oficina de spikes</small></div>
        </div>

        <nav aria-label="Navegação principal">
          <button className="nav-item is-active"><span>01</span> Fluxo operacional</button>
          <button className="nav-item"><span>02</span> Métricas</button>
          <button className="nav-item"><span>03</span> Infraestrutura</button>
        </nav>

        <div className="sidebar__section">
          <p>Spikes ativos</p>
          {spikes.map((item) => (
            <button className={`spike-picker ${item.id === selectedSpikeId ? "is-active" : ""}`} key={item.id} onClick={() => setSelectedSpikeId(item.id)}>
              <span>{item.name.slice(0, 1)}</span>
              <div><strong>{item.name}</strong><small>{item.category}</small></div>
              <i aria-label="Requer atenção" />
            </button>
          ))}
        </div>

        <div className="system-card">
          <span className="pulse" />
          <div><strong>Sistema local</strong><small>API e dashboard online</small></div>
          <code>:3002</code>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Pipeline de validação</p>
            <h1>{spike.name}</h1>
            <p>{spike.hypothesis}</p>
          </div>
          <div className="topbar__actions">
            <a href={spike.publicUrl} target="_blank" rel="noreferrer">Abrir landing <span>↗</span></a>
            <button title="Atualizar dados" onClick={() => window.location.reload()}>Atualizar</button>
          </div>
        </header>

        <section className="metric-grid" aria-label="Métricas do spike">
          <article><span>Visitantes</span><strong>{spike.metrics.visitors}</strong><small>Aguardando tráfego</small></article>
          <article><span>Leads reais</span><strong>{spike.metrics.leads}</strong><small>CRM operacional</small></article>
          <article><span>Conversão</span><strong>{spike.metrics.conversionRate.toFixed(1)}%</strong><small>Meta inicial: 8%</small></article>
          <article><span>Investimento</span><strong>{money(spike.metrics.spend)}</strong><small>de {money(spike.metrics.budget)}</small></article>
        </section>

        <section className="board-section">
          <div className="section-heading">
            <div><p className="eyebrow">Mapa do processo</p><h2>Da hipótese à tração</h2></div>
            <div className="legend"><span className="done">Concluído</span><span className="blocked">Bloqueado</span><span className="waiting">Em espera</span></div>
          </div>
          <div className="flow-wrap">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onNodeClick={(_, node) => setSelectedStepId(node.id)}
              nodesConnectable={false}
              deleteKeyCode={null}
              fitView
              fitViewOptions={{ padding: 0.16 }}
              minZoom={0.55}
              maxZoom={1.4}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#39362f" gap={22} size={1} />
              <MiniMap pannable zoomable nodeColor={(node) => node.data.status === "done" ? "#76a873" : node.data.status === "blocked" ? "#d8795c" : "#706c63"} />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
        </section>
      </main>

      <aside className="inspector">
        <div className="inspector__header"><span>Detalhes da etapa</span><small>{selectedStep?.label}</small></div>
        <div className={`stage-status stage-status--${selectedStep?.status}`}>
          <span className="status-dot" />
          <div><small>Status atual</small><strong>{statusLabels[selectedStep?.status]}</strong></div>
        </div>

        <section>
          <p className="eyebrow">Resumo</p>
          <h3>{selectedStep?.detail}</h3>
          <p>O fluxo permanece seguro: campanhas começam pausadas e nenhum orçamento é liberado enquanto houver um bloqueio operacional.</p>
        </section>

        {selectedStep?.id === "meta" && (
          <section>
            <p className="eyebrow">Pendências Meta</p>
            <ul className="blocker-list">{spike.campaign.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}</ul>
          </section>
        )}

        {selectedStep?.id === "creative" && (
          <section>
            <p className="eyebrow">Pacote inicial</p>
            <div className="creative-summary">
              <div><span>Limite do lote</span><strong>{spike.creative.maxInitialAssets} peças</strong></div>
              <div><span>Gate</span><strong>Aprovação explícita</strong></div>
            </div>
            <ul className="creative-list">
              {spike.creative.concepts.map((concept) => <li key={concept}>{concept}</li>)}
            </ul>
            <ul className="blocker-list creative-blockers">
              {spike.creative.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
            </ul>
          </section>
        )}

        {selectedStep?.id === "meta" && (
          <section>
            <p className="eyebrow">Identificadores</p>
            <dl className="id-list">
              <div><dt>Campaign</dt><dd>{spike.campaign.id}</dd></div>
              <div><dt>Ad Set</dt><dd>{spike.campaign.adSetId}</dd></div>
              <div><dt>Ad</dt><dd>{spike.campaign.adId}</dd></div>
            </dl>
          </section>
        )}

        <section className="ports">
          <p className="eyebrow">Serviços locais</p>
          <div><span>Dashboard</span><code>localhost:3002</code></div>
          <div><span>Painel web</span><code>localhost:3000</code></div>
          <div><span>CRM</span><code>localhost:3001</code></div>
          <div><span>Landing</span><code>localhost:8787</code></div>
        </section>
      </aside>
    </div>
  );
}

export default App;
