# post-page-navigation Specification

## ADDED Requirements

### Requirement: Back to Top Button
The post page MUST provide a back-to-top button that allows users to quickly scroll to the page top on both desktop and mobile devices.

#### Scenario: Button is always visible
- **WHEN** a user views a post page
- **THEN** a back-to-top button MUST be visible in the bottom-right corner
- **AND** the button MUST remain visible regardless of scroll position

#### Scenario: Button positioned correctly
- **WHEN** a user views a post page on any device
- **THEN** the button MUST be positioned 20-30px from the right edge
- **AND** the button MUST be positioned 20-30px from the bottom edge
- **AND** the button MUST use fixed positioning to stay in view while scrolling

#### Scenario: Clicking button scrolls to top
- **WHEN** a user clicks the back-to-top button
- **THEN** the page MUST smoothly scroll to the top (y-position: 0)
- **AND** the scroll behavior MUST be smooth, not instant

#### Scenario: Button has appropriate styling
- **WHEN** the back-to-top button is displayed
- **THEN** it MUST be clearly visible with sufficient contrast against the background
- **AND** it MUST show a hover state when the user hovers over it
- **AND** it MUST have an accessible label (aria-label or text content)

### Requirement: Mobile Dot Navigation
The post page MUST provide a dot-based navigation system on mobile devices that allows quick navigation between articles while conserving screen space.

#### Scenario: Dot navigation visible only on mobile
- **WHEN** a user views a post page on a device with viewport width < 768px
- **THEN** a dot navigation MUST be visible on the right side of the screen
- **AND** the traditional TOC list MUST be hidden
- **AND** when viewport width >= 768px
- **THEN** the traditional TOC list MUST be visible
- **AND** the dot navigation MUST be hidden

#### Scenario: Dot represents each article
- **WHEN** a post page has multiple h2 headings (articles)
- **THEN** each h2 heading MUST be represented by one circular dot
- **AND** dots MUST be arranged vertically in document order
- **AND** dots MUST be approximately 10px in diameter with 8px spacing between them

#### Scenario: Active dot indicates current position
- **WHEN** a user scrolls through the post
- **THEN** the dot corresponding to the currently visible article MUST be highlighted
- **AND** the active dot MUST use the accent color
- **AND** inactive dots MUST use a muted secondary color
- **AND** the active state MUST update automatically as the user scrolls

#### Scenario: Clicking dot navigates to article
- **WHEN** a user taps on a dot in the navigation
- **THEN** the page MUST smoothly scroll to the corresponding article
- **AND** the dot MUST become active after navigation completes
- **AND** the scroll behavior MUST be smooth

#### Scenario: Dot navigation positioned correctly on mobile
- **WHEN** the dot navigation is displayed on mobile
- **THEN** it MUST be positioned on the right side of the screen
- **AND** it MUST use fixed positioning to remain visible during scroll
- **AND** it MUST be vertically centered or positioned near the middle of the viewport
- **AND** it MUST have sufficient spacing from the screen edge (8-12px)

#### Scenario: Dots have adequate touch targets
- **WHEN** a user interacts with dot navigation on mobile
- **THEN** each dot MUST have a touch target of at least 32px x 32px
- **AND** the visible dot MUST be centered within the touch target area
- **AND** dots MUST provide visual feedback when tapped

### Requirement: Navigation Accessibility
The scroll navigation features MUST be accessible to users with assistive technologies.

#### Scenario: Back to top button has accessible label
- **WHEN** a screen reader user encounters the back-to-top button
- **THEN** the button MUST have an aria-label or visible text indicating its purpose
- **AND** the label MUST be in the page's primary language (e.g., "回到顶部" for Chinese)

#### Scenario: Dot navigation has accessible structure
- **WHEN** the dot navigation is rendered
- **THEN** it MUST be wrapped in a `<nav>` element with an aria-label
- **AND** dots MUST be rendered as a list structure (ul/li)
- **AND** each dot MUST be a focusable element (button or link)

#### Scenario: Navigation responds to keyboard interaction
- **WHEN** a keyboard user tabs to navigation elements
- **THEN** the back-to-top button MUST be keyboard focusable
- **AND** the button MUST be activatable with Enter or Space key
- **AND** dots in mobile navigation MUST be keyboard focusable
- **AND** dots MUST be activatable with Enter or Space key

### Requirement: Visual Integration
The scroll navigation features MUST integrate smoothly with the existing page layout without causing visual conflicts or layout issues.

#### Scenario: Navigation does not overlap critical content
- **WHEN** scroll navigation is displayed
- **THEN** the back-to-top button MUST NOT obscure important page content
- **AND** the mobile dot navigation MUST NOT obscure content in the main content area
- **AND** appropriate z-index values MUST prevent unintended overlapping

#### Scenario: Navigation respects existing z-index hierarchy
- **WHEN** multiple fixed/absolute elements are present
- **THEN** the back-to-top button MUST have z-index: 1000
- **AND** the mobile dot navigation MUST have z-index: 999
- **AND** these values MUST NOT conflict with the mobile header (z-index: 1000)

#### Scenario: Navigation adapts to theme changes
- **WHEN** the system theme changes from light to dark or vice versa
- **THEN** the back-to-top button MUST adopt appropriate colors for the current theme
- **AND** the dot navigation MUST adopt appropriate colors for the current theme
- **AND** colors MUST maintain sufficient contrast for visibility

### Requirement: Smooth Scrolling Behavior
All navigation features MUST provide smooth, predictable scrolling behavior that enhances user experience.

#### Scenario: Scroll to top is smooth and consistent
- **WHEN** a user clicks the back-to-top button from any scroll position
- **THEN** the page MUST scroll smoothly to the top
- **AND** the scroll duration MUST be reasonable (not too fast or slow)
- **AND** the scroll MUST complete without janking or interruptions

#### Scenario: Scroll to article is smooth and accurate
- **WHEN** a user clicks a dot in mobile navigation
- **THEN** the page MUST scroll smoothly to the target article's h2 heading
- **AND** the heading MUST be positioned near the top of the viewport after scrolling
- **AND** the scroll MUST account for any fixed headers (scroll-margin-top)

#### Scenario: Scroll tracking updates active state correctly
- **WHEN** the user manually scrolls through the page
- **THEN** the active dot/link indicator MUST update when crossing article boundaries
- **AND** the update MUST be smooth without rapid flickering
- **AND** the correct article MUST be indicated based on viewport position
