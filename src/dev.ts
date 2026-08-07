import { createReadStream, existsSync, statSync, watch } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildSite } from "./site.js";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(rootDirectory, "dist");
const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 4000);

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

let rebuilding = false;
let rebuildQueued = false;

async function buildAndReport(): Promise<void> {
  const startedAt = performance.now();
  const result = await buildSite(rootDirectory, outputDirectory);
  console.log(`构建完成：${result.postCount} 期，${Math.round(performance.now() - startedAt)}ms`);
}

async function rebuild(): Promise<void> {
  if (rebuilding) {
    rebuildQueued = true;
    return;
  }

  rebuilding = true;
  try {
    await buildAndReport();
  } catch (error) {
    console.error(error);
  } finally {
    rebuilding = false;
    if (rebuildQueued) {
      rebuildQueued = false;
      void rebuild();
    }
  }
}

await buildAndReport();

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? host}`);
  let relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
  if (!relativePath || relativePath.endsWith("/")) relativePath += "index.html";

  let filePath = path.resolve(outputDirectory, relativePath);
  if (!filePath.startsWith(`${outputDirectory}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  if (!existsSync(filePath) && path.extname(filePath) === "") {
    filePath = path.join(filePath, "index.html");
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": contentTypes[path.extname(filePath)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`本地预览：http://${host}:${port}`);
});

let debounceTimer: NodeJS.Timeout | undefined;
for (const directory of ["_posts", "assets"]) {
  watch(path.join(rootDirectory, directory), { recursive: true }, () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => void rebuild(), 80);
  });
}
