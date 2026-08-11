# TL;DR HackerNews 24

Hacker News 中文日报的纯 TypeScript 静态站点。构建产物只有 HTML、CSS、图片和原生 JavaScript，可以直接部署到 Cloudflare Pages。

## 技术方案

- `gray-matter` 读取日报 front matter
- `markdown-it` 将 `_posts/*.md` 转成 HTML
- TypeScript 模板生成首页和日报页
- 原有 CSS、字体、DOM 结构与 `post.js` 交互保持不变
- 无 React/Vue、无 hydration、无服务端运行时

日报 Markdown 是仓库内受信任的构建输入，因此解析器允许其中已有的原生 HTML，用于保留摘要来源说明等现有内容。

## 本地开发

推荐 Node.js 22，最低支持 Node.js 20。

```bash
npm install
npm run dev
```

默认访问 <http://127.0.0.1:4000>。修改 `_posts` 或 `assets` 后会自动重新构建。

## 构建与检查

```bash
npm run build
npm run typecheck
npm test
```

构建结果写入 `dist/`。每篇 `_posts/YYYY-MM-DD-daily.md` 对应：

```text
/YYYY/MM/DD/daily/
```

构建同时生成供原生客户端消费的版本化静态索引：

```text
/api/v1/issues.json
/api/v1/issues/YYYY-MM-DD.md
```

每篇 `_posts/YYYY-MM-DD-daily.md` 会按原始字节复制到对应的 Markdown 详情地址。索引包含每期日报的稳定 ID、日期、canonical HTML URL、文章数、标题列表，以及供原生阅读器按需加载的可选 `contentURL`：

```json
{
  "id": "2026-08-10",
  "url": "https://tldr-24.krabs.wang/2026/08/10/daily/",
  "contentURL": "https://tldr-24.krabs.wang/api/v1/issues/2026-08-10.md?v=0123456789ab"
}
```

`contentURL` 的 `v` 参数是原始 Markdown 的 SHA-256 摘要前 12 位；内容不变时 URL 稳定，内容变化时 URL 随之变化，便于客户端和 CDN 安全缓存。`url` 始终保留为分享和浏览器打开所用的 canonical HTML 地址。索引、Markdown 与 HTML 在同一次构建中生成，不需要 Pages Functions、数据库或运行时密钥。

## Cloudflare Pages

在 Cloudflare Pages 连接此仓库，并设置：

- Production branch：`main`
- Framework preset：`None`
- Build command：`npm run build`
- Build output directory：`dist`
- Root directory：留空（仓库根目录）
- Preview deployments：对非生产分支启用

Node.js 版本由仓库中的 `.node-version` 固定为 `22`，不需要额外环境变量。项目不需要 Pages Functions、Jekyll、Ruby 或构建期密钥。推送非生产分支会生成 Preview deployment，合并到 `main` 后会自动触发 Production deployment。
