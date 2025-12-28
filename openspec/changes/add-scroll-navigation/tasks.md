# Implementation Tasks

## 1. Back to Top Button
- [x] 1.1 Add back-to-top button HTML element to `_layouts/post.html`
- [x] 1.2 Add CSS styles for back-to-top button (fixed positioning, 36px size, subtle styling)
- [x] 1.3 Implement scroll-to-top functionality in JavaScript with smooth scrolling
- [x] 1.4 Add touch event handlers to prevent click-through on mobile

## 2. Mobile Hamburger Menu
- [x] 2.1 Add hamburger button HTML with icon to `_layouts/post.html`
- [x] 2.2 Add CSS styles for hamburger button (36px size, matching back-to-top style)
- [x] 2.3 Create hamburger icon using CSS pseudo-elements
- [x] 2.4 Add touch event handlers to prevent click-through on mobile

## 3. Mobile Slide-out Drawer
- [x] 3.1 Add drawer HTML structure (overlay, panel, header, content)
- [x] 3.2 Add CSS styles for drawer (slide-in animation, overlay background)
- [x] 3.3 Populate drawer with TOC links matching desktop styling (rounded corners, border-left accent)
- [x] 3.4 Implement drawer open/close functionality
- [x] 3.5 Add click handler for overlay to close drawer
- [x] 3.6 Add ESC key handler to close drawer
- [x] 3.7 Prevent body scroll when drawer is open

## 4. Active State Tracking
- [x] 4.1 Reuse existing scroll tracking logic for both desktop TOC and mobile drawer
- [x] 4.2 Update active link styling on scroll
- [x] 4.3 Ensure active state consistency between desktop and mobile

## 5. Testing & Refinement
- [x] 5.1 Test back-to-top button behavior
- [x] 5.2 Test hamburger menu and drawer on various mobile screen sizes
- [x] 5.3 Verify smooth scrolling works correctly
- [x] 5.4 Check for any layout conflicts or z-index issues
- [x] 5.5 Validate responsive behavior at 768px breakpoint
