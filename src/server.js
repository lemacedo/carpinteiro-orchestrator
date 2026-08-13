import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { spikes } from "./spikes.js";

const rootDirectory = fileURLToPath(new URL("..", import.meta.url));
const distDirectory = join(rootDirectory, "dist");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function serveDashboard(request, response) {
  const requestedPath = request.url === "/" ? "/index.html" : request.url;
  const cleanPath = normalize(requestedPath.split("?")[0]).replace(/^(\.\.(\/|\\|$))+/, "");
  let filePath = join(distDirectory, cleanPath);

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "content-type": contentTypes[extname(filePath)] ?? "application/octet-stream",
      "cache-control": extname(filePath) === ".html" ? "no-store" : "public, max-age=31536000, immutable",
    });
    response.end(body);
  } catch {
    try {
      filePath = join(distDirectory, "index.html");
      const body = await readFile(filePath);
      response.writeHead(200, { "content-type": contentTypes[".html"], "cache-control": "no-store" });
      response.end(body);
    } catch {
      sendJson(response, 503, { error: "dashboard_not_built" });
    }
  }
}

export function createOrchestratorServer() {
  return createServer((request, response) => {
    if (request.method === "GET" && request.url === "/health") {
      sendJson(response, 200, { service: "carpinteiro-orchestrator", status: "ok" });
      return;
    }

    if (request.method === "GET" && request.url === "/v1/spikes") {
      sendJson(response, 200, { data: spikes, meta: { total: spikes.length, status: "operational" } });
      return;
    }

    if (request.method === "GET" && request.url.startsWith("/v1/spikes/")) {
      const spike = spikes.find(({ id }) => id === request.url.slice("/v1/spikes/".length));
      sendJson(response, spike ? 200 : 404, spike ?? { error: "spike_not_found" });
      return;
    }

    if (request.method === "GET") {
      serveDashboard(request, response);
      return;
    }

    sendJson(response, 404, { error: "not_found" });
  });
}

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT ?? 3002);
  createOrchestratorServer().listen(port, "0.0.0.0", () => {
    console.log(JSON.stringify({ service: "carpinteiro-orchestrator", port, status: "listening" }));
  });
}
