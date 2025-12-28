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
  - Fixed positioning (20px from edges)
  - Subtle styling with border, matches hamburger menu button size (36px)
  
- Add hamburger menu with slide-out drawer on mobile devices
  - Small hamburger button (36px) fixed in bottom-right corner, above back-to-top button
  - Clicking opens a slide-out drawer panel from the right side
  - Drawer contains full TOC with same styling as desktop (rounded corners, hover effects)
  - Active state highlights the currently visible article
  - Clicking a link scrolls to the corresponding article and closes drawer
  - Overlay background closes drawer when clicked
  - ESC key closes drawer

## Impact
- Affected specs: New spec `post-page-navigation`
- Affected code:
  - `_layouts/post.html` - Add back-to-top button, hamburger menu, and mobile drawer
  - `assets/css/components.css` - Add styles for navigation elements
