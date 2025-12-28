# Proposal: Enhance Homepage List Layout

## Summary
Improve the homepage (list page) to provide a more engaging user experience with content previews, better layout adaptation, and added header/footer sections.

## Motivation
The current homepage displays only post titles with redundant date information, making it plain and less engaging. Users cannot preview content without clicking through to each post, which reduces discoverability. The layout also needs better adaptation across different screen sizes, and the site lacks proper header and footer sections for branding and acknowledgments.

## Goals
1. **Simplify Title Display**: Remove redundant date display since titles already contain date information, change titles to display only dates
2. **Add Content Previews**: Display first 300+ characters (approximately 3 lines) of each post to give users a preview of the content
3. **Optimize Layout Structure**: Use left-right layout similar to post detail page with sidebar and main content area
4. **Add Sidebar**: Include a sidebar with site title "TL;DR.HackerNews24", tagline "Read it 1000 years later", theme toggle, and footer information
5. **Remove Card Style**: Use plain text styling with font size differentiation instead of card-based design

## Non-Goals
- Modify post detail page layout (only homepage changes)
- Change content management workflow
- Add advanced features like search, filtering, or pagination
- Modify existing theme toggle functionality

## Risks
- Content preview may clutter the homepage if not properly formatted (HTML tags, excessive length)
- Narrower layout may feel too constrained on large screens if not balanced well
- Header/footer may impact mobile viewport if not responsive
- Excerpt generation may need custom Liquid filters if default Jekyll excerpt is insufficient

## Success Criteria
- Homepage displays concise titles without redundant date information
- Each post shows a clean text preview of ~200-300 characters
- Layout maintains optimal reading width across all devices (max-width ~800-900px)
- Header displays "Read it 1000 years later" prominently
- Footer displays copyright and acknowledges Jekyll and GitHub
- Page load performance is not significantly impacted
- Responsive design works well on mobile (375px+), tablet (768px+), and desktop (1024px+)

## Alternatives Considered
1. **Use Jekyll's default excerpt**: Accepted as the primary approach, will customize length if needed
2. **Keep full width layout**: Rejected as user specifically requested narrow area for better adaptation
3. **Use JavaScript for dynamic content loading**: Rejected as unnecessary complexity for static site
4. **Keep date display in some format**: Rejected per user request (title already contains date)
