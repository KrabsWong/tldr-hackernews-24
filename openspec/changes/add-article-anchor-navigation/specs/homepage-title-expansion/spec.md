## MODIFIED Requirements

### Requirement: Titles maintain clickability to post detail
Each displayed article title MUST be clickable and navigate to the full post detail page, allowing users to read the complete article.

#### Scenario: Click title to navigate to post with anchor
- **WHEN** a user clicks on an article title displayed on the homepage
- **THEN** the browser MUST navigate to the full post detail page with an anchor fragment (e.g., `/2025/12/28/daily/#heading-0-article-title`)
- **AND** the page MUST automatically scroll to the specific article heading
- **AND** the scroll behavior MUST be smooth
- **AND** the scroll position MUST account for any fixed header offset

#### Scenario: Anchor ID generation matches between homepage and detail page
- **WHEN** Jekyll builds the homepage and detail pages
- **THEN** the anchor ID generated for each article title on the homepage MUST match the ID assigned to the corresponding H2 heading on the detail page
- **AND** the ID format MUST be `heading-{index}-{normalized-title}` where index is the 0-based position of the H2 in the post content
- **AND** normalized-title MUST be lowercase, with special characters removed and spaces replaced by hyphens

#### Scenario: Title links have proper accessibility
- **WHEN** article titles are rendered as clickable links
- **THEN** each title link MUST have descriptive text (e.g., "阅读文章: 标题")
- **AND** links MUST be keyboard accessible (tab navigation)
- **AND** focus indicators MUST be clearly visible

## ADDED Requirements

### Requirement: Detail page handles anchor navigation on load
The post detail page MUST detect and scroll to the target element when the URL contains an anchor fragment.

#### Scenario: Page loads with anchor in URL
- **WHEN** a user navigates to a post detail page with an anchor fragment (e.g., `/2025/12/28/daily/#heading-0-article-title`)
- **THEN** the page MUST wait for the DOM to be fully loaded
- **AND** the page MUST locate the element with the matching ID
- **AND** the page MUST smoothly scroll to that element
- **AND** the scroll position MUST account for any fixed header (using scroll-margin-top or equivalent offset)

#### Scenario: Page loads without anchor
- **WHEN** a user navigates to a post detail page without an anchor fragment
- **THEN** the page MUST display from the top as usual
- **AND** no automatic scrolling MUST occur

#### Scenario: Anchor element not found
- **WHEN** a user navigates to a post detail page with an invalid anchor fragment
- **THEN** the page MUST display from the top without errors
- **AND** no JavaScript errors MUST be thrown
