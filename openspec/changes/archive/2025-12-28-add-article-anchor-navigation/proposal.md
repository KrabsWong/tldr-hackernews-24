# Change: 首页文章标题点击后自动滚动到对应位置

## Why

用户在首页展开某个日期的文章列表后，点击具体文章标题会跳转到文章详情页，但页面默认从顶部开始展示。用户需要手动滚动或在目录中查找才能定位到想看的文章，体验不够流畅。

## What Changes

- 首页的文章标题链接增加锚点（anchor），使用简单序号格式 `#article-1`, `#article-2`, ...
- 文章详情页通过 JS 在运行时将所有 H2 标题的 ID 重写为序号格式，确保与首页锚点匹配
- 详情页加载时，如果 URL 包含锚点，自动平滑滚动到对应位置
- 详情页的目录导航（桌面端侧边栏和移动端汉堡菜单）使用重写后的 ID

## Impact

- Affected specs: `homepage-title-expansion`（修改标题链接的行为）
- Affected code:
  - `_layouts/default.html`：修改文章标题链接生成逻辑，使用序号锚点
  - `_layouts/post.html`：JS 运行时重写 H2 ID，处理锚点滚动和目录导航
