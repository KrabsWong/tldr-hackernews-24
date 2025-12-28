# homepage-collapse-toggle Specification

## Purpose
Provide users with control over content density on the homepage by allowing them to collapse and expand each date's article title list, reducing initial page length while maintaining easy access to all content.

## ADDED Requirements

### Requirement: Each post has a collapse/expand toggle button
Each post item on the homepage MUST include a toggle button that allows users to show or hide the article title list for that specific date.

#### Scenario: Toggle button appears in post header
Given a post displayed on the homepage
When the post is rendered
Then a toggle button should appear in the post header next to the date
And the button should display an arrow icon (▼ when collapsed, ▲ when expanded)
And the button should have an accessible label "展开/收起标题列表"
And the button should be visually distinct but not overwhelming

#### Scenario: Toggle button is keyboard accessible
Given a user navigating the homepage with keyboard
When the user tabs to a toggle button
Then the button should receive clear focus indication
And pressing Enter or Space should toggle the collapse/expand state
And the `aria-expanded` attribute should update accordingly

#### Scenario: Toggle button indicates current state
Given a post with titles either expanded or collapsed
When the user views the toggle button
Then the button's `aria-expanded` attribute should be "true" for expanded, "false" for collapsed
And the arrow icon should point down (▼) for collapsed, up (▲) for expanded via rotation
And screen readers should announce the current state

### Requirement: First post is expanded by default, others collapsed
On initial page load, the first (most recent) post MUST be expanded while all other posts are collapsed, balancing content visibility with page length.

#### Scenario: Initial page load state
Given the homepage loads with multiple posts
When the page finishes rendering
Then the first post's title list should be visible (expanded)
And the first post's toggle button should have `aria-expanded="true"`
And all other posts' title lists should be hidden (collapsed)
And all other toggle buttons should have `aria-expanded="false"`

#### Scenario: First post on each pagination page is expanded
Given the user navigates to page 2 of the post list
When the new page renders
Then the first post on page 2 should be expanded
And all other posts on page 2 should be collapsed
And the pagination should automatically call the expand function

#### Scenario: Manual toggle overrides default state
Given a user collapses the first post or expands a different post
When the user interacts with toggle buttons
Then the manually set states should be preserved until page navigation
And users can freely expand/collapse any combination of posts

### Requirement: Collapse/expand uses smooth CSS animations
The transition between collapsed and expanded states MUST be animated smoothly using CSS transitions for better user experience.

#### Scenario: Smooth expand animation
Given a user clicks a toggle button on a collapsed post
When the title list begins to expand
Then the content should animate from `max-height: 0` to `max-height: 1000px`
And the transition should take 0.3 seconds with ease timing
And the arrow icon should rotate 180 degrees smoothly
And no content should be clipped during animation

#### Scenario: Smooth collapse animation
Given a user clicks a toggle button on an expanded post
When the title list begins to collapse
Then the content should animate from `max-height: 1000px` to `max-height: 0`
And the transition should take 0.3 seconds with ease timing
And the arrow icon should rotate back to original position
And overflow should be hidden during and after animation

#### Scenario: Animation performance on mobile
Given the user views the homepage on a mobile device
When toggling multiple posts quickly
Then animations should remain smooth without lag
And the page should not flicker or jump
And scroll position should remain stable

### Requirement: Toggle state is managed independently per post
Each post's collapse/expand state MUST be managed independently, allowing users to have multiple posts expanded simultaneously if desired.

#### Scenario: Expand multiple posts simultaneously
Given the user has expanded the first post (default state)
When the user clicks to expand the second post
Then the second post should expand
And the first post should remain expanded
And no automatic collapsing of other posts should occur

#### Scenario: Collapse and expand different posts
Given the user has the first and third posts expanded
When the user collapses the first post and expands the fourth post
Then the first post should collapse
And the third post should remain expanded
And the fourth post should expand
And all state changes should be independent

### Requirement: Collapsed state hides content without removing from DOM
When collapsed, the title list MUST be hidden using CSS (`max-height: 0` and `overflow: hidden`) rather than removing elements from the DOM, ensuring fast toggle performance.

#### Scenario: Collapsed content is hidden but present
Given a post is in collapsed state
When inspecting the DOM
Then the `.post-titles` element should still exist in the DOM
And the element should have the `.collapsed` class applied
And the computed `max-height` should be 0
And `overflow: hidden` should prevent content from showing

#### Scenario: Expanded content is fully visible
Given a post is in expanded state
When viewing the post
Then the `.post-titles` element should not have the `.collapsed` class
And the `max-height` should be 1000px (or large enough for content)
And all article title links should be clickable and visible
And no scrollbars should appear within the title container

### Requirement: Toggle functionality integrates with pagination
The collapse/expand functionality MUST work seamlessly with client-side pagination, maintaining consistent behavior across page changes.

#### Scenario: First post expands after pagination
Given the user is on page 1 with the first post expanded
When the user navigates to page 2
Then all posts on page 1 should be hidden (via pagination)
And all posts on page 2 should initially be collapsed
And the first post on page 2 should auto-expand
And the `expandFirstVisiblePost()` function should be called

#### Scenario: Pagination doesn't affect hidden posts' state
Given the user has expanded posts 3 and 5 on page 1
When the user navigates to page 2 and then back to page 1
Then all posts on page 1 should reset to default state (first expanded, others collapsed)
And the system should not remember previous manual toggle states across pagination
And this behavior is acceptable as pagination re-initializes the view

### Requirement: Collapse/expand respects accessibility standards
The toggle functionality MUST be fully accessible to keyboard and screen reader users, following ARIA best practices.

#### Scenario: Screen reader announces toggle state changes
Given a screen reader user activates a toggle button
When the post expands or collapses
Then the screen reader should announce the new state (e.g., "expanded" or "collapsed")
And the `aria-expanded` attribute should update to reflect the new state
And the button's accessible label should remain clear

#### Scenario: Focus management during toggle
Given a user activates a toggle button with keyboard
When the title list expands or collapses
Then focus should remain on the toggle button
And the user should be able to tab into the expanded title links
And focus should follow a logical tab order

#### Scenario: Reduced motion preference
Given a user has enabled "prefers-reduced-motion" in their OS
When toggling posts
Then animations should still function but use instant transitions
And no rotation or smooth expand/collapse should occur
And content should appear/disappear immediately (optional future enhancement)

## Implementation Notes

### Files Modified
- `_layouts/default.html`: Added `.post-header`, toggle button, conditional `aria-expanded`, and `.collapsed` class
- `assets/js/toggle.js`: New file containing toggle logic and `expandFirstVisiblePost()` function
- `assets/js/pagination.js`: Modified `showPage()` to collapse all posts and call `expandFirstVisiblePost()`
- `assets/css/layout.css`: Added styles for `.post-header`, `.toggle-titles`, `.toggle-icon`, `.post-titles`, and `.collapsed` class

### Key Technical Decisions
1. **max-height transition vs height auto**: Using max-height with a large value (1000px) allows CSS transitions, whereas `height: auto` cannot be animated
2. **CSS-only animation**: Preferred over JavaScript animation for better performance and simpler implementation
3. **Independent toggle state**: Each post manages its own state rather than accordion-style (only one open)
4. **First post default**: Balances immediate content visibility with page length management
5. **Integration with pagination**: Pagination resets toggle states for consistency
