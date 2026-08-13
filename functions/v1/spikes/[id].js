import { spikes } from "../../../src/spikes.js";

export function onRequestGet({ params }) {
  const spike = spikes.find(({ id }) => id === params.id);

  if (!spike) {
    return Response.json({ error: "spike_not_found" }, { status: 404 });
  }

  return Response.json(spike);
}
