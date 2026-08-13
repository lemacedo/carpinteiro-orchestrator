import { spikes } from "../../src/spikes.js";

export function onRequestGet() {
  return Response.json({ data: spikes, meta: { total: spikes.length, status: "operational" } });
}
