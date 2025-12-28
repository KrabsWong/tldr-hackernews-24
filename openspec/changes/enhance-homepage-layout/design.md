# Design: Homepage List Enhancement

## Overview
This design enhances the homepage by improving content presentation, adding structural elements (header/footer), and optimizing the layout for better user experience across devices.

## Technical Approach

### Content Preview Implementation
Use Jekyll's built-in `page.excerpt` which automatically generates excerpts from the first paragraph or content before `---`. If needed, implement a custom Liquid filter to:
1. Strip HTML tags to ensure clean text preview
2. Truncate to 200-300 characters with an ellipsis
3. Handle edge cases (short content, empty excerpts)

Example Liquid filter approach:
```liquid
{{ post.excerpt | strip_html | truncate: 250 }}
```

### Layout Structure
Modify the homepage layout to use left-right layout similar to post detail page without a header:
- **No Header (Desktop)**: Remove page header entirely on desktop
- **Mobile Header**: On mobile devices, show a fixed header with site title and tagline
- **Sidebar (Left)**:
  - Site title "TL;DR.HackerNews24" - hidden on mobile
  - Tagline "Read it 1000 years later" - hidden on mobile
  - Footer info: "Built with Jekyll and hosted on GitHub Pages"
- **Mobile Footer (Only)**: Separate footer element that displays "Built with Jekyll and hosted on GitHub Pages" at the bottom of the page on mobile
- **Main Content (Right)**:
  - List of posts with plain text styling
  - Each post shows date as title and 3-line excerpt
- **Responsive**: On mobile, show fixed header with title and tagline, sidebar hidden, site-footer visible at bottom

### Width Optimization
Apply CSS constraints to ensure content stays within optimal reading width:
```css
.homepage-container {
  max-width: 850px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

### HTML Structure
```
<header class="mobile-header">
  <span class="mobile-title">{{ site.title }}</span>
  <span class="mobile-tagline">Read it 1000 years later</span>
</header>

<div class="container">
  <aside class="sidebar">
    <div class="site-info">
      <h1><a href="/">{{ site.title }}</a></h1>
      <p>Read it 1000 years later</p>
    </div>

    <div class="sidebar-footer">
      Built with <a href="https://jekyllrb.com" target="_blank">Jekyll</a> and hosted on <a href="https://pages.github.com" target="_blank">GitHub Pages</a>.
    </div>
  </aside>

  <main class="content">
    <ul class="post-list">
      <li class="post-item">
        <a href="{{ post.url }}" class="post-link">
          <h2>{{ post.date | date: "%Y-%m-%d" }}</h2>
        </a>
        <p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 350 }}</p>
      </li>
    </ul>
  </main>
</div>

<footer class="site-footer">
  Built with <a href="https://jekyllrb.com" target="_blank">Jekyll</a> and hosted on <a href="https://pages.github.com" target="_blank">GitHub Pages</a>.
</footer>
```

## Architecture Decisions

### 1. Minimal Layout Separation
**Decision**: Use the existing `default` layout for homepage rather than creating a dedicated `home` layout.
**Rationale**: The homepage is already defined in `index.md` using the `default` layout. Adding header/footer to this layout provides consistency with minimal changes.

### 2. Content Preview Strategy
**Decision**: Use Jekyll's `excerpt` feature with HTML stripping via Liquid filters.
**Rationale**: Jekyll's excerpt is reliable and well-tested. Stripping HTML ensures previews are clean text without formatting artifacts.

### 3. Responsive Width
**Decision**: Use relative units (rem, %) with a max-width constraint rather than fixed pixel values.
**Rationale**: Ensures better adaptation across devices while maintaining readability on large screens.

### 4. Header/Footer Positioning
**Decision**: Use semantic HTML5 elements (`<header>`, `<footer>`) with standard block flow. Mobile header uses fixed positioning.
**Rationale**: Provides better accessibility and SEO. Fixed mobile header allows easy navigation while scrolling.

### 5. Theme Management
**Decision**: Use automatic theme detection only, no manual toggle buttons.
**Rationale**: Simpler implementation, follows modern best practices for theme switching. CSS `@media (prefers-color-scheme: dark)` handles automatic switching.

## CSS Considerations

### Typography
- Maintain consistent font sizes with the existing theme
- Use slightly lighter color for excerpts to visually distinguish from titles
- Ensure adequate line-height for readability

### Theme Management
- Theme automatically follows system preference (light/dark mode)
- No manual theme toggle buttons or controls
- Uses CSS `@media (prefers-color-scheme: dark)` for automatic theme switching

### Spacing
- Add consistent vertical spacing between post items (1.5-2rem)
- Ensure header and footer have proper padding (1-1.5rem)
- Use consistent horizontal padding for container on mobile

### Hover States
- Maintain existing hover effects on titles
- Add subtle hover effect on entire post item for better interactivity

## Migration Strategy
1. Update `index.md` content to include header/footer structure
2. Modify CSS in `default.html` or add inline styles
3. Test responsive behavior at breakpoints: 375px, 768px, 1024px, 1440px
4. Verify excerpt generation across all existing posts

## Performance Impact
- Minimal: Adding header/footer and excerpts doesn't require additional HTTP requests
- Content previews may increase DOM size slightly but remains within acceptable limits
- No JavaScript changes required (maintain existing theme toggle)

## Accessibility Considerations
- Use semantic HTML5 elements (`header`, `main`, `footer`)
- Ensure color contrast ratios meet WCAG AA standards
- Maintain focus states for keyboard navigation
- Use proper heading hierarchy (H2 for post titles)
