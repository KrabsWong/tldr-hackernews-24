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

## Cloudflare Pages

在 Cloudflare Pages 连接此仓库，并设置：

- Production branch：`main`
- Framework preset：`None`
- Build command：`npm run build`
- Build output directory：`dist`
- Root directory：留空（仓库根目录）
- Preview deployments：对非生产分支启用

Node.js 版本由仓库中的 `.node-version` 固定为 `22`，不需要额外环境变量。项目不需要 Pages Functions、Jekyll、Ruby 或构建期密钥。推送非生产分支会生成 Preview deployment，合并到 `main` 后会自动触发 Production deployment。
