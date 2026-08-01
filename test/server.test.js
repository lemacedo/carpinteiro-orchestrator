import assert from "node:assert/strict";
import { after, before, test } from "node:test";
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
