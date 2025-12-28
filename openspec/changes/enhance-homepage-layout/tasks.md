# Tasks: Homepage List Enhancement

## Task List

1. **Update mock preview environment with new layout**
   - Modify mock-preview/index.html to use left-right layout with sidebar
   - Remove page header entirely from desktop view
   - Remove all theme toggle buttons
   - Remove card styling, use plain text with font size hierarchy
   - Update post titles to show only dates (remove "HackerNews Daily" prefix)
   - Increase excerpt length to 3 lines (~300-350 characters)
   - Add sidebar with site title, tagline, and footer info
   - **Validation**: Verify new layout displays correctly in browser

2. **Add mobile fixed header with title and tagline**
   - Create mobile-header element with fixed positioning at top
   - Include site title and tagline in mobile header
   - Use flex-direction: column for title and tagline layout
   - Ensure mobile header has appropriate padding and styling
   - **Validation**: Verify mobile header stays fixed while scrolling

3. **Hide sidebar on mobile to avoid duplicate title**
   - Add CSS to hide entire site-info on mobile (both title and tagline in fixed header)
   - Ensure sidebar footer (build with info) remains visible at the bottom
   - **Validation**: Verify no duplicate titles on mobile, footer at bottom

4. **Simplify JavaScript to only follow system theme**
   - Remove all theme toggle button event listeners
   - Remove localStorage theme storage
   - Use only `window.matchMedia('(prefers-color-scheme: dark)')` for system theme detection
   - Add listener for system theme changes
   - **Validation**: Test that theme automatically changes when system theme changes

5. **Update index.md to use sidebar layout without header**
   - Modify homepage to use left-right layout structure similar to post.html
   - Remove any page header element from desktop view
   - Add mobile header with fixed positioning (title and tagline only)
   - Add sidebar with site info and footer info
   - Ensure proper HTML5 semantic structure
   - **Validation**: Manually verify sidebar and main content areas appear correctly

6. **Modify post titles to display dates only**
   - Change title display from "{{ post.title }}" to "{{ post.date | date: "%Y-%m-%d" }}"
   - Remove any redundant date lines
   - Ensure full title is preserved on post detail page
   - **Validation**: Check that homepage shows dates as titles

7. **Add 3-line content previews to post list items**
   - Add `{{ post.excerpt | strip_html | truncate: 350 }}` below title
   - Use CSS line-clamp to limit to exactly 3 lines
   - Apply appropriate font size hierarchy (larger for title, smaller for excerpt)
   - Test preview rendering on posts with varying content lengths
   - **Validation**: Verify previews display as 3 lines for all posts

8. **Remove card styling, use plain text layout**
   - Remove background, borders, and hover effects from post items
   - Use simple dividers or spacing between posts
   - Apply proper font sizes: ~1.35rem for titles, ~1rem for excerpts
   - Ensure proper line-height for readability
   - **Validation**: Check that posts display as plain text without card containers

9. **Implement sidebar structure with responsive behavior**
   - Add sidebar with site title "TL;DR.HackerNews24"
   - Add tagline "Read it 1000 years later" below title
   - Add footer info "Built with Jekyll and hosted on GitHub Pages" at the bottom
   - Ensure no page header exists on desktop
   - Hide sidebar site-info on mobile to avoid duplicate title with fixed header
   - **Validation**: Verify all sidebar elements display correctly with responsive behavior

10. **Update CSS for left-right layout with mobile header**
    - Use flexbox layout with 280px sidebar and flex-1 main content
    - Add proper spacing (gap: 2rem) between sidebar and content
    - Ensure responsive behavior: mobile header is fixed, sidebar site-info hidden on mobile
    - Add padding-top to container on mobile to account for fixed header
    - Add padding-bottom to container on mobile to ensure footer visibility
    - **Validation**: Test layout at 375px, 768px, 1024px, and 1440px breakpoints

11. **Test responsive behavior on mobile**
    - Verify fixed header stays at top while scrolling
    - Verify no duplicate titles (sidebar title hidden, fixed header shows title and tagline)
    - Ensure sidebar footer (build with info) stays at bottom of page
    - Ensure post list and 3-line previews are readable on mobile
    - Test that layout works on narrow screens (375px viewport)
    - **Validation**: Manually test on mobile browser or using Chrome DevTools

12. **Test responsive behavior on tablet and desktop**
    - Verify left-right layout works at 768px, 1024px, and 1440px
    - Ensure mobile header is hidden on tablet and desktop
    - Ensure sidebar displays title, tagline, and footer on larger screens
    - Check that content area fills remaining space appropriately
    - **Validation**: Manually test layout at various breakpoints

13. **Verify automatic theme switching works**
    - Ensure sidebar and content styling supports both light and dark themes
    - Test that theme automatically switches when system theme changes
    - Verify no manual theme toggle buttons exist
    - Verify color variables apply correctly to all elements
    - **Validation**: Change system theme settings and verify page responds

14. **Performance validation**
    - Measure page load time before and after changes
    - Ensure First Contentful Paint remains under 2 seconds
    - Verify no layout shifts or flash of unstyled content
    - **Validation**: Use Lighthouse or browser DevTools Performance tab

15. **Cross-browser testing**
    - Test in Chrome, Firefox, Safari, and Edge
    - Verify line-clamp CSS works correctly in all browsers
    - Check that fixed header positioning works consistently
    - Check that system theme detection works across browsers
    - **Validation**: Manual visual testing in multiple browsers

16. **Review and update documentation**
    - Update README.md if any new build or deployment steps are added
    - Document any new CSS classes or patterns for future reference
    - **Validation**: Ensure documentation accurately reflects changes

## Dependencies
- Tasks 1-3 can be completed in parallel (HTML structure and Liquid template changes)
- Tasks 4-6 can be completed in parallel (CSS styling)
- Task 7 depends on Tasks 1-6
- Task 8 depends on Tasks 4-6
- Task 9 depends on Tasks 5-6
- Tasks 10-12 depend on all previous tasks

## Notes
- All changes should be made to files in the main repository, not creating new files unless necessary
- Maintain backward compatibility with existing Jekyll configuration
- Keep CSS changes inline or in existing CSS files rather than creating new files
- Test locally before deploying to GitHub Pages
