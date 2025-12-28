## MODIFIED Requirements

### Requirement: Titles maintain clickability to post detail
Each displayed article title MUST be clickable and navigate to the full post detail page, allowing users to read the complete article.

#### Scenario: Click title to navigate to post with anchor
- **WHEN** a user clicks on an article title displayed on the homepage
- **THEN** the browser MUST navigate to the full post detail page with an anchor fragment (e.g., `/2025/12/28/daily/#article-1`)
- **AND** the page MUST automatically scroll to the specific article heading
- **AND** the scroll behavior MUST be smooth
- **AND** the scroll position MUST account for any fixed header offset

#### Scenario: Anchor ID uses simple sequential format
- **WHEN** the homepage generates article title links
- **THEN** the anchor ID MUST use the format `article-{n}` where n is the 1-based position of the article in the post
- **AND** the detail page MUST rewrite all H2 heading IDs to match this format at runtime via JavaScript

#### Scenario: Title links have proper accessibility
- **WHEN** article titles are rendered as clickable links
- **THEN** each title link MUST have descriptive text (e.g., "阅读文章: 标题")
- **AND** links MUST be keyboard accessible (tab navigation)
- **AND** focus indicators MUST be clearly visible

## ADDED Requirements

### Requirement: Detail page handles anchor navigation on load
The post detail page MUST detect and scroll to the target element when the URL contains an anchor fragment.

#### Scenario: Page loads with anchor in URL
- **WHEN** a user navigates to a post detail page with an anchor fragment (e.g., `/2025/12/28/daily/#article-5`)
- **THEN** the page MUST wait for the DOM to be fully loaded
- **AND** the page MUST rewrite all H2 IDs to sequential format before processing the anchor
- **AND** the page MUST locate the element with the matching ID
- **AND** the page MUST smoothly scroll to that element

#### Scenario: Page loads without anchor
- **WHEN** a user navigates to a post detail page without an anchor fragment
- **THEN** the page MUST display from the top as usual
- **AND** no automatic scrolling MUST occur

#### Scenario: Anchor element not found
- **WHEN** a user navigates to a post detail page with an invalid anchor fragment
- **THEN** the page MUST display from the top without errors
- **AND** no JavaScript errors MUST be thrown

### Requirement: Detail page TOC uses rewritten IDs
The table of contents on the post detail page MUST use the same sequential ID format for navigation links.

#### Scenario: Desktop sidebar TOC links
- **WHEN** the desktop sidebar TOC is generated
- **THEN** each link MUST use the rewritten H2 ID (e.g., `#article-1`)
- **AND** clicking a link MUST smoothly scroll to the corresponding heading

#### Scenario: Mobile drawer TOC links
- **WHEN** the mobile navigation drawer TOC is generated
- **THEN** each link MUST use the rewritten H2 ID (e.g., `#article-1`)
- **AND** clicking a link MUST close the drawer and smoothly scroll to the corresponding heading
