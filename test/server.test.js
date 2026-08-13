import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { onRequestGet as pagesHealth } from "../functions/health.js";
import { onRequestGet as pagesSpike } from "../functions/v1/spikes/[id].js";
import { onRequestGet as pagesSpikes } from "../functions/v1/spikes.js";
import { createOrchestratorServer } from "../src/server.js";

let server;
let baseUrl;

before(async () => {
  server = createOrchestratorServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("reports service health", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { service: "carpinteiro-orchestrator", status: "ok" });
});

test("returns the Ritmo spike without PII", async () => {
  const response = await fetch(`${baseUrl}/v1/spikes/ritmo`);
  const spike = await response.json();

  assert.equal(response.status, 200);
  assert.equal(spike.id, "ritmo");
  assert.equal(spike.metrics.budget, 20);
  assert.equal(spike.creative.status, "UPLOAD_BLOCKED");
  assert.equal(spike.creative.maxInitialAssets, 6);
  assert.equal(spike.creative.assets.length, 3);
  assert.equal(spike.steps.some(({ id }) => id === "creative"), true);
  assert.equal(spike.campaign.status, "BLOCKED");
  assert.equal(JSON.stringify(spike).includes("email"), false);
  assert.equal(JSON.stringify(spike).includes("phone"), false);
});

test("serves the React dashboard after build", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Carpinteiro/);
  assert.match(html, /src=\"\/assets\//);
});

test("Cloudflare Pages functions return JSON for API routes", async () => {
  const health = pagesHealth();
  const spikes = pagesSpikes();
  const spike = pagesSpike({ params: { id: "ritmo" } });

  assert.equal(health.headers.get("content-type"), "application/json");
  assert.deepEqual(await health.json(), { service: "carpinteiro-orchestrator", status: "ok" });

  assert.equal(spikes.headers.get("content-type"), "application/json");
  assert.equal((await spikes.json()).data[0].id, "ritmo");

  assert.equal(spike.headers.get("content-type"), "application/json");
  assert.equal((await spike.json()).campaign.status, "BLOCKED");
});

test("Cloudflare Pages function reports missing spikes as JSON 404", async () => {
  const response = pagesSpike({ params: { id: "missing" } });

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("content-type"), "application/json");
  assert.deepEqual(await response.json(), { error: "spike_not_found" });
});
