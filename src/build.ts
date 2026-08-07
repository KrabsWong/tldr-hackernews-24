import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildSite } from "./site.js";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const startedAt = performance.now();
const result = await buildSite(rootDirectory);
const elapsed = Math.round(performance.now() - startedAt);

console.log(`已生成 ${result.postCount} 期日报（最新 ${result.latestDate}），耗时 ${elapsed}ms`);
