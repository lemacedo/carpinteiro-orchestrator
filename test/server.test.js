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
