# Change: 首页文章标题点击后自动滚动到对应位置

## Why

用户在首页展开某个日期的文章列表后，点击具体文章标题会跳转到文章详情页，但页面默认从顶部开始展示。用户需要手动滚动或在目录中查找才能定位到想看的文章，体验不够流畅。

## What Changes

- 首页的文章标题链接增加锚点（anchor），指向文章详情页中对应的 H2 标题
- 在 Jekyll 模板中提取文章标题时，同时生成与详情页一致的锚点 ID
- 文章详情页加载时，如果 URL 包含锚点，自动平滑滚动到对应位置

## Impact

- Affected specs: `homepage-title-expansion`（修改标题链接的行为）
- Affected code:
  - `_layouts/default.html`：修改文章标题链接生成逻辑，添加锚点
  - `_layouts/post.html`：确保锚点 ID 生成逻辑一致，并处理带锚点的页面加载
