import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildSite, loadPosts } from "../src/site.js";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("builds every post with the existing routes and unchanged assets", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "tldr-site-"));
  const outputDirectory = path.join(temporaryRoot, "dist");

  try {
    const posts = await loadPosts(rootDirectory);
    const result = await buildSite(rootDirectory, outputDirectory);
    const homepage = await readFile(path.join(outputDirectory, "index.html"), "utf8");
    const issueIndex = JSON.parse(
      await readFile(path.join(outputDirectory, "api", "v1", "issues.json"), "utf8"),
    ) as {
      schemaVersion: number;
      latestDate: string;
      issues: Array<{
        id: string;
        date: string;
        title: string;
        url: string;
        storyCount: number;
        headlines: string[];
      }>;
    };
    const newestPost = posts[0];
    const newestOutput = path.join(outputDirectory, newestPost.url, "index.html");
    const postHtml = await readFile(newestOutput, "utf8");

    assert.equal(result.postCount, posts.length);
    assert.equal(result.latestDate, newestPost.date);
    assert.equal(issueIndex.schemaVersion, 1);
    assert.equal(issueIndex.latestDate, newestPost.date);
    assert.equal(issueIndex.issues.length, posts.length);
    assert.deepEqual(issueIndex.issues[0], {
      id: newestPost.date,
      date: newestPost.date,
      title: newestPost.title,
      url: `https://tldr-24.krabs.wang${newestPost.url}`,
      storyCount: newestPost.headings.length,
      headlines: newestPost.headings,
    });
    assert.equal(new Set(posts.map((post) => post.url)).size, posts.length);
    assert.match(homepage, new RegExp(`href="${newestPost.url}"`));
    assert.match(homepage, new RegExp(`${posts.length} 期 Hacker News 中文简报`));
    assert.match(homepage, /<span class="creator-name">Krabs<\/span> 构建与维护/);
    assert.match(homepage, /href="https:\/\/beian\.miit\.gov\.cn\/"[^>]*>浙ICP备2022010856号-1<\/a>/);
    assert.doesNotMatch(homepage, /href="https:\/\/github\.com\/KrabsWong"/);
    assert.match(postHtml, /class="post-layout"/);
    assert.match(postHtml, /src="\/assets\/js\/post\.js\?v=22"/);
    assert.match(postHtml, /<span class="creator-name">Krabs<\/span> 构建与维护/);
    assert.match(postHtml, /href="https:\/\/beian\.miit\.gov\.cn\/"[^>]*>浙ICP备2022010856号-1<\/a>/);
    assert.doesNotMatch(postHtml, /href="https:\/\/github\.com\/KrabsWong"/);

    for (const post of posts) {
      assert.equal(post.contentHtml.match(/<h2(?:\s|>)/g)?.length, post.headings.length);
      await assert.doesNotReject(readFile(path.join(outputDirectory, post.url, "index.html")));
    }

    const sourceAssets = await readdir(path.join(rootDirectory, "assets"), { recursive: true });
    for (const asset of sourceAssets) {
      const sourcePath = path.join(rootDirectory, "assets", asset);
      const outputPath = path.join(outputDirectory, "assets", asset);
      if (!(await stat(sourcePath)).isFile()) continue;
      await assert.doesNotReject(async () => {
        assert.deepEqual(await readFile(outputPath), await readFile(sourcePath));
      });
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
