import { createHash } from "node:crypto";
import { copyFile, cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token.mjs";

const SITE = {
  origin: "https://tldr-24.krabs.wang",
  title: "TL;DR.HackerNews24",
  description: "Read it 1000 years later bro.",
  analyticsId: "G-NVV6SYBRDW",
};

const POST_FILE = /^(\d{4})-(\d{2})-(\d{2})-daily\.md$/;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const markdown = new MarkdownIt({
  html: true,
  linkify: false,
  typographer: false,
});

export interface Post {
  date: string;
  day: string;
  weekday: string;
  monthLabel: string;
  title: string;
  url: string;
  contentHash: string;
  contentHtml: string;
  headings: string[];
}

export interface BuildResult {
  postCount: number;
  latestDate: string;
}

interface IssueIndex {
  schemaVersion: 1;
  latestDate: string;
  issues: IssueSummary[];
}

interface IssueSummary {
  id: string;
  date: string;
  title: string;
  url: string;
  contentURL?: string;
  storyCount: number;
  headlines: string[];
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function textFromInline(token: Token | undefined): string {
  if (!token) return "";
  if (!token.children) return token.content.trim();

  return token.children
    .filter((child) => !["html_inline", "image"].includes(child.type))
    .map((child) => {
      if (child.type === "softbreak" || child.type === "hardbreak") return " ";
      return child.content;
    })
    .join("")
    .trim();
}

function extractH2Headings(tokens: Token[]): string[] {
  const headings: string[] = [];

  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index].type === "heading_open" && tokens[index].tag === "h2") {
      const title = textFromInline(tokens[index + 1]);
      if (title) headings.push(title);
    }
  }

  return headings;
}

function formatDate(date: string): { day: string; weekday: string; monthLabel: string } {
  const [year, month, day] = date.split("-");
  const weekday = WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
  return { day, weekday, monthLabel: `${year} 年 ${month} 月` };
}

function assertFrontMatterDate(value: unknown, expected: string, fileName: string): void {
  if (value === undefined) return;

  const actual = value instanceof Date
    ? value.toISOString().slice(0, 10)
    : String(value).slice(0, 10);

  if (actual !== expected) {
    throw new Error(`${fileName} 的 front matter 日期 ${actual} 与文件名日期 ${expected} 不一致`);
  }
}

async function loadPost(postsDirectory: string, fileName: string): Promise<Post> {
  const match = POST_FILE.exec(fileName);
  if (!match) throw new Error(`无效的日报文件名：${fileName}`);

  const [, year, month, day] = match;
  const date = `${year}-${month}-${day}`;
  const sourceBytes = await readFile(path.join(postsDirectory, fileName));
  const source = sourceBytes.toString("utf8");
  const parsed = matter(source);
  assertFrontMatterDate(parsed.data.date, date, fileName);

  const tokens = markdown.parse(parsed.content, {});
  const headings = extractH2Headings(tokens);
  if (headings.length === 0) throw new Error(`${fileName} 不包含任何二级标题`);

  const formatted = formatDate(date);
  return {
    date,
    ...formatted,
    title: typeof parsed.data.title === "string"
      ? parsed.data.title
      : `HackerNews Daily - ${date}`,
    url: `/${year}/${month}/${day}/daily/`,
    contentHash: createHash("sha256").update(sourceBytes).digest("hex").slice(0, 12),
    contentHtml: markdown.renderer.render(tokens, markdown.options, {}),
    headings,
  };
}

export async function loadPosts(rootDirectory: string): Promise<Post[]> {
  const postsDirectory = path.join(rootDirectory, "_posts");
  const entries = await readdir(postsDirectory, { withFileTypes: true });
  const fileNames = entries
    .filter((entry) => entry.isFile() && POST_FILE.test(entry.name))
    .map((entry) => entry.name);

  const posts = await Promise.all(fileNames.map((fileName) => loadPost(postsDirectory, fileName)));
  return posts.sort((left, right) => right.date.localeCompare(left.date));
}

function issueIndex(posts: Post[]): IssueIndex {
  return {
    schemaVersion: 1,
    latestDate: posts[0].date,
    issues: posts.map((post) => ({
      id: post.date,
      date: post.date,
      title: post.title,
      url: `${SITE.origin}${post.url}`,
      contentURL: `${SITE.origin}/api/v1/issues/${post.date}.md?v=${post.contentHash}`,
      storyCount: post.headings.length,
      headlines: post.headings,
    })),
  };
}

function analytics(): string {
  return `    <script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.analyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${SITE.analyticsId}');
    </script>`;
}

function documentHead(title: string, description: string, page: "home" | "post"): string {
  const themeVersion = page === "home" ? 14 : 17;
  const componentVersion = page === "home" ? 17 : 33;

  return `  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    <meta name="theme-color" content="#fdfdfc" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#1d1d1c" media="(prefers-color-scheme: dark)">
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">

    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">

    <link rel="preconnect" href="https://gw.alipayobjects.com" crossorigin>
    <link rel="stylesheet" href="/assets/css/jinkai.css?v=1">
    <link rel="stylesheet" href="/assets/css/theme.css?v=${themeVersion}">
    <link rel="stylesheet" href="/assets/css/layout.css?v=15">
    <link rel="stylesheet" href="/assets/css/components.css?v=${componentVersion}">
  </head>`;
}

function renderLatestStories(post: Post): string {
  return post.headings
    .slice(0, 3)
    .map((heading) => `              <li>${escapeHtml(heading)}</li>`)
    .join("\n");
}

function renderIssueRow(post: Post): string {
  const preview = post.headings
    .slice(1, 3)
    .map((heading) => escapeHtml(heading))
    .join('<span aria-hidden="true"> · </span>');

  return `                    <article class="issue-row">
                      <a href="${post.url}">
                        <time datetime="${post.date}">
                          <strong>${post.day}</strong>
                          <span>${post.weekday}</span>
                        </time>
                        <div class="issue-row-copy">
                          <h4>${escapeHtml(post.headings[0])}</h4>
                          <p>${preview}</p>
                        </div>
                        <span class="issue-row-count">${post.headings.length} 篇</span>
                      </a>
                    </article>`;
}

function renderArchive(posts: Post[]): string {
  const latest = posts[0];
  const months = new Map<string, Post[]>();

  for (const post of posts) {
    const monthPosts = months.get(post.monthLabel) ?? [];
    monthPosts.push(post);
    months.set(post.monthLabel, monthPosts);
  }

  return [...months.entries()]
    .map(([monthLabel, monthPosts], index) => {
      const rows = monthPosts
        .filter((post) => post.url !== latest.url)
        .map(renderIssueRow)
        .join("\n");

      return `            <section class="issue-month" aria-labelledby="month-${index + 1}">
              <h3 id="month-${index + 1}">${monthLabel}</h3>
              <div class="issue-list">
${rows}
              </div>
            </section>`;
    })
    .join("\n");
}

export function renderHome(posts: Post[]): string {
  const latest = posts[0];
  if (!latest) throw new Error("至少需要一篇日报才能生成首页");
  const [, month, day] = latest.date.split("-");

  return `<!DOCTYPE html>
<html lang="zh-CN">
${documentHead(SITE.title, SITE.description, "home")}
  <body class="home-page">
    <a class="skip-link" href="#main-content">跳到主要内容</a>

    <header class="site-header">
      <nav class="masthead" aria-label="主页导航">
        <a class="brand" href="/" aria-label="${SITE.title} 首页">
          <img src="/assets/favicon.svg" alt="" width="32" height="32">
          <span>TL;DR HackerNews</span>
        </a>
        <div class="site-nav">
          <a href="#latest">最新</a>
          <a href="#archive">往期</a>
        </div>
      </nav>
    </header>

    <main class="home-main" id="main-content">
      <a class="latest-issue" id="latest" href="${latest.url}">
        <picture class="latest-cover">
          <source media="(max-width: 640px)" srcset="/assets/images/crab-city-portrait.webp" type="image/webp">
          <img src="/assets/images/crab-city-cover.webp" alt="一只红色螃蟹在清晨的微缩城市中举起杠铃" width="1672" height="941" fetchpriority="high">
        </picture>
        <div class="latest-copy">
          <div class="latest-meta">
            <strong>最新一期</strong>
            <time datetime="${latest.date}">${latest.date.replaceAll("-", "/")}</time>
          </div>
          <h1>${month} 月 ${day} 日 · Hacker News 日报</h1>
          <p>本期收录 ${latest.headings.length} 篇热门文章，包含中文摘要、背景补充与评论分歧。</p>
          <ol class="latest-stories">
${renderLatestStories(latest)}
          </ol>
        </div>
      </a>

      <section class="issues-section" id="archive" aria-labelledby="archive-title">
        <header class="issues-heading">
          <div>
            <h2 id="archive-title">往期日报</h2>
            <p>${posts.length} 期 Hacker News 中文简报</p>
          </div>
        </header>

        <div class="issue-months">
${renderArchive(posts)}
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-meta">
        <div class="footer-identity">
          <strong>TL;DR HackerNews 24</strong>
          <span>每天少一点信息焦虑。</span>
        </div>
        <span class="footer-icp"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">浙ICP备2022010856号-1</a></span>
      </div>
      <p class="footer-credit">由 <span class="creator-name">Krabs</span> 构建与维护 · 界面参考并致敬 <a href="https://weekly.tw93.fun/" target="_blank" rel="noopener noreferrer">tw93 的「潮流周刊」</a></p>
    </footer>

${analytics()}
  </body>
</html>
`;
}

function postDescription(post: Post): string {
  return post.headings[0].slice(0, 160);
}

export function renderPost(post: Post): string {
  const [, month, day] = post.date.split("-");
  const displayDate = post.date.replaceAll("-", "/");
  const count = post.headings.length;

  return `<!DOCTYPE html>
<html lang="zh-CN">
${documentHead(post.title, postDescription(post), "post")}
  <body class="post-page">
    <a class="skip-link" href="#main-content">跳到主要内容</a>

    <main class="post-layout" id="main-content">
      <aside class="article-sidebar" id="article-sidebar" aria-label="本期文章目录">
        <a class="sidebar-brand" href="/" aria-label="${SITE.title} 首页">
          <img src="/assets/favicon.svg" alt="" width="32" height="32">
          <span>TL;DR HackerNews</span>
        </a>
        <div class="sidebar-meta">
          <time datetime="${post.date}">${displayDate}</time>
          <span>${count} 篇</span>
        </div>
        <button class="sidebar-close" id="sidebar-close" type="button" aria-label="关闭文章目录">×</button>
        <nav class="sidebar-outline" aria-label="本期文章">
          <ol id="outline-list"></ol>
        </nav>
      </aside>

      <div class="sidebar-overlay" id="sidebar-overlay" aria-hidden="true"></div>

      <section class="issue-column">
        <header class="mobile-reader-nav">
          <a class="mobile-brand" href="/" aria-label="返回日报首页">
            <img src="/assets/favicon.svg" alt="" width="32" height="32">
          </a>
          <span class="current-chapter">
            <span class="current-position" id="current-position">01 / ${count}</span>
            <span class="current-title" id="current-title">本期文章</span>
          </span>
          <button class="sidebar-open" id="sidebar-open" type="button" aria-label="打开文章目录" aria-controls="article-sidebar" aria-expanded="false">目</button>
        </header>

        <header class="issue-heading">
          <div class="issue-title-row">
            <h1>${month} 月 ${day} 日 · HN 日报</h1>
            <a class="issue-home" href="/" aria-label="返回日报首页">←</a>
          </div>
          <p>${displayDate} · ${count} 篇热门讨论</p>
        </header>

        <p class="issue-caption">从 Hacker News 每日的喧嚣里，拾起值得慢读的声音；以中文梳理脉络，也留下社区的回响。</p>

        <article class="post-content">
${post.contentHtml.trimEnd()}
        </article>

        <footer class="post-footer">
          <div>
            <span>发布于 ${displayDate}</span>
            <p class="footer-credit">由 <span class="creator-name">Krabs</span> 构建与维护 · 界面参考并致敬 <a href="https://weekly.tw93.fun/" target="_blank" rel="noopener noreferrer">tw93 的「潮流周刊」</a></p>
            <p class="footer-icp"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">浙ICP备2022010856号-1</a></p>
          </div>
          <a href="/">返回首页</a>
        </footer>
      </section>
    </main>

    <button class="back-to-top" aria-label="回到顶部"><span aria-hidden="true">↑</span></button>

    <script src="/assets/js/scale.fix.js"></script>
    <script src="/assets/js/post.js?v=22"></script>

${analytics()}
  </body>
</html>
`;
}

export async function buildSite(rootDirectory: string, outputDirectory = path.join(rootDirectory, "dist")): Promise<BuildResult> {
  const posts = await loadPosts(rootDirectory);
  if (posts.length === 0) throw new Error("_posts 中没有可构建的日报");

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  await cp(path.join(rootDirectory, "assets"), path.join(outputDirectory, "assets"), { recursive: true });
  await writeFile(path.join(outputDirectory, "index.html"), renderHome(posts));

  const apiDirectory = path.join(outputDirectory, "api", "v1");
  await mkdir(apiDirectory, { recursive: true });
  const issueContentDirectory = path.join(apiDirectory, "issues");
  await mkdir(issueContentDirectory, { recursive: true });
  await writeFile(
    path.join(apiDirectory, "issues.json"),
    `${JSON.stringify(issueIndex(posts), null, 2)}\n`,
  );

  await Promise.all(posts.map(async (post) => {
    const postDirectory = path.join(outputDirectory, post.url);
    await mkdir(postDirectory, { recursive: true });
    await Promise.all([
      writeFile(path.join(postDirectory, "index.html"), renderPost(post)),
      copyFile(
        path.join(rootDirectory, "_posts", `${post.date}-daily.md`),
        path.join(issueContentDirectory, `${post.date}.md`),
      ),
    ]);
  }));

  return { postCount: posts.length, latestDate: posts[0].date };
}
