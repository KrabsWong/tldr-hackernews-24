# Change: Add Scroll Navigation Features to Post Pages

## Why
On post pages, the table of contents (TOC) helps users quickly navigate to specific articles. However, on mobile devices, once users click a TOC item and scroll to the target position, they lose easy access to:
1. The TOC for navigating to other articles
2. A way to quickly return to the top of the page

This creates a poor mobile UX where users must manually scroll long distances to navigate between articles or return to the TOC.

## What Changes
- Add a "Back to Top" button in the bottom-right corner on both PC and mobile
  - Button is always visible regardless of scroll position
  - Clicking scrolls smoothly to the page top
  - Fixed positioning with appropriate spacing (20-30px from edges)
  
- Add dot navigation on mobile devices
  - Replace full TOC list with small circular dot indicators
  - Display as a floating element on the right side of the screen
  - Each dot represents one article (h2 heading)
  - Active dot highlights the currently visible article
  - Clicking a dot scrolls to the corresponding article
  - Space-efficient design suitable for mobile screens

## Impact
- Affected specs: New spec `post-page-navigation`
- Affected code:
  - `_layouts/post.html` - Add back-to-top button and mobile dot navigation
  - `assets/css/components.css` - Add styles for navigation elements
  - Potentially new JS file for navigation behavior
