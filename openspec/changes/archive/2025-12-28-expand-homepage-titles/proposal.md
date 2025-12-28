# expand-homepage-titles

## Why
Currently, the homepage displays only one truncated title per post as a preview (via `{{ post.excerpt }}`), which limits users' ability to quickly scan and determine if the daily content is relevant to their interests. Users must click through to individual posts to see all article titles, creating unnecessary friction in content discovery.

## What Changes
1. **Expand title display**: Modify the homepage to show all article titles (H2 headings) from each daily post, extracted from the post content, giving users a complete overview at a glance.
2. **Add pagination**: Implement client-side pagination to manage the increased content length, displaying a configurable number of posts per page (5 for mobile, 10 for desktop) with text-based navigation links.
3. **Add collapse/expand functionality**: Implement toggle buttons for each date's content to reduce initial page length, with the first post expanded by default and others collapsed.

This change introduces three new specs:
- **homepage-title-expansion**: Display all article titles on homepage
- **homepage-pagination**: Client-side pagination for post list
- **homepage-collapse-toggle**: Collapsible sections for each date's titles

## Dependencies
- Depends on existing `homepage-list-enhancement` spec (Jekyll post structure)
- No breaking changes to existing functionality

## Alternatives Considered
1. **Server-side pagination with Jekyll Paginate**: More complex, requires Jekyll rebuild
2. **Infinite scroll**: Less predictable, harder to navigate to specific dates
3. **Button-based pagination**: Changed to text links for cleaner, more minimal UI
4. **All posts expanded by default**: Would create very long page, chose collapse by default instead
5. **Accordion-style (only one open at a time)**: Less flexible, chose independent toggles instead

## Success Metrics
- Users can see all article titles without clicking through
- Page load time remains under 2 seconds
- Pagination controls are intuitive and responsive
- First post is visible by default, reducing cognitive load
- Page length is manageable with collapsed state
