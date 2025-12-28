# Spec: Homepage List Enhancement

## MODIFIED Requirements

### Requirement: Homepage displays simplified post list
The homepage MUST display a list of posts with simplified, date-only title presentation.

#### Scenario: View homepage with date-only titles
Given the site has multiple posts
When a user visits the homepage
Then each post title should display only the date (e.g., "2025-12-27")
And no "HackerNews Daily" prefix should appear in the title
And no redundant date information should be shown below the title

#### Scenario: Homepage title format
Given a post with the title "HackerNews Daily - 2025-12-27"
When the post is displayed on the homepage
Then the title should display as "2025-12-27"
And the full title should only be shown on the post detail page

### Requirement: Homepage shows content previews
The homepage MUST display a text preview of each post's content to help users discover relevant posts.

#### Scenario: View post content preview
Given a post with substantial content
When the post is displayed on the homepage
Then a text preview of approximately 300-350 characters should be displayed below the title
And the preview should display as approximately 3 lines of text
And the preview should be plain text without HTML formatting
And the preview should use line-clamp to limit to 3 lines

#### Scenario: Preview handles short content
Given a post with less than 200 characters of content
When the post is displayed on the homepage
Then the full content should be displayed as the preview
And no ellipsis should be added

#### Scenario: Preview handles empty content
Given a post with no content beyond front matter
When the post is displayed on the homepage
Then an empty or minimal preview area should be displayed
And the layout should not break

### Requirement: Homepage uses plain text styling
The homepage MUST use plain text styling without card-based design for the post list.

#### Scenario: View homepage with plain text styling
Given the homepage is displaying a list of posts
When a user views the homepage
Then each post should be displayed without a card container or background
And titles and excerpts should use different font sizes to distinguish hierarchy
And posts should be separated by simple dividers or spacing only

#### Scenario: Post item styling hierarchy
Given a post item on the homepage
When the post is rendered
Then the title should have a larger font size (e.g., 1.35rem) and use accent color
And the excerpt should have a smaller font size (e.g., 1rem) and use secondary text color
And no background color or border should surround the post item

### Requirement: Homepage maintains optimal reading width
The homepage MUST constrain content width to maintain readability across different screen sizes.

#### Scenario: View homepage on desktop (1024px+)
Given a user visits the homepage on a desktop browser
When the viewport width is 1024px or greater
Then the post list should not exceed 850px in width
And the content should be centered in the viewport

#### Scenario: View homepage on tablet (768px-1023px)
Given a user visits the homepage on a tablet device
When the viewport width is between 768px and 1023px
Then the post list should fill most of the available width (up to 850px)
And comfortable horizontal padding should be maintained

#### Scenario: View homepage on mobile (<768px)
Given a user visits the homepage on a mobile device
When the viewport width is less than 768px
Then the post list should use the full viewport width
And horizontal padding of approximately 1rem should be applied on both sides

### Requirement: Homepage includes sidebar with site info
The homepage MUST include a sidebar with site title, tagline, and attribution information. On mobile, a fixed header should be provided and the sidebar footer should be visible at the page bottom.

#### Scenario: View homepage sidebar on desktop
Given a user visits the homepage on a desktop device
When the page loads
Then a sidebar should be visible on the left side of the page
And the sidebar should display the site title "TL;DR.HackerNews24"
And the sidebar should display the tagline "Read it 1000 years later" below the title
And the sidebar should display "Built with Jekyll and hosted on GitHub Pages" at the bottom
And no page header should exist on desktop
And no theme toggle buttons should be present
And the site-footer should be hidden on desktop

#### Scenario: View homepage on mobile with fixed header
Given a user views the homepage on a mobile device
When the page loads
Then a fixed header should be visible at the top of the screen
And the mobile header should display the site title
And the mobile header should display the tagline below the title
And the mobile header should remain visible when scrolling
And the sidebar should be completely hidden (title and tagline already in fixed header)
And the sidebar-footer should be hidden on mobile
And a separate site-footer should be visible at the bottom of the page
And the site-footer should display "Built with Jekyll and hosted on GitHub Pages"
And the site-footer should be centered and have appropriate styling

#### Scenario: Theme automatically follows system preference
Given the homepage is displayed
When the system theme is set to dark mode
Then the page should automatically switch to dark theme
And when the system theme is set to light mode
Then the page should automatically switch to light theme
And no manual theme toggle buttons should be provided

### Requirement: Homepage maintains responsive design
The homepage MUST maintain good visual presentation and usability across all device sizes.

#### Scenario: Homepage responsive breakpoints
Given the homepage is displayed on any device
When the viewport width changes
Then the layout should smoothly adapt without horizontal scrolling
And the content should remain readable at all breakpoints

#### Scenario: Mobile touch targets
Given the homepage is displayed on a mobile device
When a user interacts with post links
Then the clickable area for each post should be at least 44px in height
And links should be easily tappable without zooming
