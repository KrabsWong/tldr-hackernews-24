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
- **THEN** the button MUST be positioned 20px from the right edge
- **AND** the button MUST be positioned 20px from the bottom edge
- **AND** the button MUST use fixed positioning to stay in view while scrolling
- **AND** the button MUST be 36px in diameter

#### Scenario: Clicking button scrolls to top
- **WHEN** a user clicks the back-to-top button
- **THEN** the page MUST smoothly scroll to the top (y-position: 0)
- **AND** the scroll behavior MUST be smooth, not instant

#### Scenario: Button has appropriate styling
- **WHEN** the back-to-top button is displayed
- **THEN** it MUST have subtle styling (bg-secondary background, border)
- **AND** it MUST show a hover state with accent color when the user hovers over it
- **AND** it MUST have an accessible label (aria-label: "回到顶部")

### Requirement: Mobile Hamburger Menu
The post page MUST provide a hamburger menu button on mobile devices that opens a slide-out drawer containing the table of contents.

#### Scenario: Hamburger button visible only on mobile
- **WHEN** a user views a post page on a device with viewport width < 768px
- **THEN** a hamburger menu button MUST be visible in the bottom-right corner
- **AND** the button MUST be positioned above the back-to-top button (bottom: 64px)
- **WHEN** viewport width >= 768px
- **THEN** the hamburger menu button MUST be hidden
- **AND** the traditional sidebar TOC MUST be visible

#### Scenario: Hamburger button has correct styling
- **WHEN** the hamburger button is displayed on mobile
- **THEN** it MUST be 36px in diameter (matching back-to-top button)
- **AND** it MUST have subtle styling (bg-secondary background, border)
- **AND** it MUST display a hamburger icon (three horizontal lines)
- **AND** it MUST show a hover state with accent color

### Requirement: Mobile Slide-out Drawer
The post page MUST provide a slide-out drawer panel on mobile that contains the full table of contents.

#### Scenario: Drawer opens from right side
- **WHEN** a user taps the hamburger menu button
- **THEN** a drawer panel MUST slide in from the right side of the screen
- **AND** an overlay MUST appear covering the rest of the page
- **AND** body scroll MUST be disabled while drawer is open

#### Scenario: Drawer contains full TOC
- **WHEN** the drawer is open
- **THEN** it MUST display a header with "目录" title and close button
- **AND** it MUST display all h2 headings as navigation links
- **AND** the links MUST have the same styling as desktop TOC (rounded corners, border-left accent on active)

#### Scenario: Drawer link navigation
- **WHEN** a user taps a link in the drawer
- **THEN** the drawer MUST close
- **AND** the page MUST smoothly scroll to the corresponding article
- **AND** the scroll MUST account for fixed header (scroll-margin-top: 80px)

#### Scenario: Drawer closing methods
- **WHEN** the drawer is open
- **THEN** tapping the overlay MUST close the drawer
- **AND** tapping the close button MUST close the drawer
- **AND** pressing ESC key MUST close the drawer

#### Scenario: Active state in drawer
- **WHEN** a user scrolls through the post (with drawer closed or open)
- **THEN** the link corresponding to the currently visible article MUST be highlighted
- **AND** the active link MUST use accent color and border-left indicator
- **AND** the active state MUST match the desktop TOC styling

### Requirement: Navigation Accessibility
The scroll navigation features MUST be accessible to users with assistive technologies.

#### Scenario: Back to top button has accessible label
- **WHEN** a screen reader user encounters the back-to-top button
- **THEN** the button MUST have aria-label="回到顶部"

#### Scenario: Hamburger button has accessible attributes
- **WHEN** the hamburger button is rendered
- **THEN** it MUST have aria-label="打开目录菜单"
- **AND** it MUST have aria-expanded attribute indicating drawer state

#### Scenario: Drawer has accessible structure
- **WHEN** the drawer is rendered
- **THEN** it MUST have aria-hidden attribute indicating visibility
- **AND** the close button MUST have aria-label="关闭目录"

### Requirement: Click-through Prevention
The fixed navigation buttons MUST NOT trigger elements beneath them when tapped on touch devices.

#### Scenario: Touch events are properly handled
- **WHEN** a user taps a fixed button (hamburger, back-to-top)
- **THEN** the tap MUST NOT trigger any elements beneath the button
- **AND** only the button's intended action MUST occur

#### Scenario: CSS touch properties are set
- **WHEN** fixed buttons are rendered
- **THEN** they MUST have touch-action: manipulation
- **AND** they MUST have -webkit-tap-highlight-color: transparent
- **AND** they MUST have user-select: none

### Requirement: Visual Integration
The scroll navigation features MUST integrate smoothly with the existing page layout without causing visual conflicts or layout issues.

#### Scenario: Navigation does not overlap critical content
- **WHEN** scroll navigation is displayed
- **THEN** the back-to-top button MUST NOT obscure important page content
- **AND** the hamburger button MUST NOT obscure important page content

#### Scenario: Navigation respects z-index hierarchy
- **WHEN** multiple fixed elements are present
- **THEN** the mobile nav drawer MUST have z-index: 1100
- **AND** the back-to-top button MUST have z-index: 1000
- **AND** the hamburger button MUST have z-index: 1000

#### Scenario: Navigation adapts to theme changes
- **WHEN** the system theme changes from light to dark or vice versa
- **THEN** all navigation elements MUST adopt appropriate colors for the current theme
- **AND** colors MUST maintain sufficient contrast for visibility

### Requirement: Smooth Scrolling Behavior
All navigation features MUST provide smooth, predictable scrolling behavior that enhances user experience.

#### Scenario: Scroll to top is smooth
- **WHEN** a user clicks the back-to-top button from any scroll position
- **THEN** the page MUST scroll smoothly to the top

#### Scenario: Scroll to article accounts for fixed header
- **WHEN** a user clicks a TOC link (desktop or mobile drawer)
- **THEN** the page MUST scroll smoothly to the target article's h2 heading
- **AND** the heading MUST be visible (not hidden behind fixed header)
- **AND** scroll-margin-top MUST be set appropriately (80px on mobile)

#### Scenario: Scroll tracking updates active state correctly
- **WHEN** the user manually scrolls through the page
- **THEN** the active link indicator MUST update when crossing article boundaries
- **AND** both desktop TOC and mobile drawer links MUST stay in sync
