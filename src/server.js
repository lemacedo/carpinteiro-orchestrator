import { createServer } from "node:http";

export function createOrchestratorServer() {
  return createServer((request, response) => {
    response.setHeader("content-type", "application/json; charset=utf-8");

    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200);
      response.end(JSON.stringify({ service: "carpinteiro-orchestrator", status: "ok" }));
      return;
    }

    if (request.method === "GET" && request.url === "/v1/spikes") {
      response.writeHead(200);
      response.end(JSON.stringify({ data: [], meta: { status: "scaffold" } }));
      return;
    }

    response.writeHead(404);
    response.end(JSON.stringify({ error: "not_found" }));
  });
}

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT ?? 3002);
  createOrchestratorServer().listen(port, "0.0.0.0", () => {
    console.log(JSON.stringify({ service: "carpinteiro-orchestrator", port, status: "listening" }));
  });
}
