# Design Document: Scroll Navigation Features

## Context
The post page currently has a table of contents (TOC) that works well on desktop but creates navigation challenges on mobile. Users need better ways to:
- Return to the top of long pages
- Navigate between articles without scrolling back to the TOC

## Goals / Non-Goals

### Goals
- Add a universal back-to-top button for both desktop and mobile
- Provide full TOC access on mobile through hamburger menu + slide-out drawer
- Maintain smooth scrolling and active state tracking
- Ensure consistent styling between desktop TOC and mobile drawer
- Ensure no visual conflicts with existing layout elements

### Non-Goals
- Changing the desktop TOC implementation (keep as-is)
- Adding complex animations beyond smooth scrolling and drawer slide
- Supporting keyboard-only navigation (focus on touch/click for now)

## Decisions

### Decision 1: Back to Top Button - Always Visible
**Choice**: Button is always visible, not conditional on scroll position
**Rationale**: 
- Simpler implementation without scroll event listeners
- Consistent UX - users always know where to find it
- No layout shift or pop-in animations
- User explicitly requested "always visible"

**Alternatives considered**:
- Show only after scrolling 300-500px: More traditional pattern, but adds complexity

### Decision 2: Hamburger Menu with Slide-out Drawer
**Choice**: Hamburger button that opens a slide-out drawer panel from the right side
**Rationale**:
- Provides full TOC functionality identical to desktop
- Familiar pattern that users understand
- Drawer panel has enough space for all navigation items with proper styling
- User explicitly chose this over dot navigation

**Alternatives considered**:
- Dot navigation: Too ugly according to user feedback, difficult to tap accurately
- Bottom tab bar: Takes more space, conflicts with browser UI

### Decision 3: Button Styling - Subtle and Unified
**Choice**: Both buttons use subtle styling (36px, bg-secondary background, border, no solid accent color)
**Rationale**:
- Consistent sizing between hamburger and back-to-top buttons
- Subtle appearance doesn't distract from content
- Accent color only appears on hover for visual feedback
- User explicitly requested smaller, less prominent buttons

### Decision 4: Mobile Drawer Styling - Match Desktop TOC
**Choice**: Drawer links use same styling as desktop TOC (rounded corners, border-left accent, hover effects)
**Rationale**:
- Visual consistency across platforms
- Users have same experience regardless of device
- User explicitly requested this consistency

### Decision 5: Active State Tracking
**Choice**: Use scroll event listener to update active link based on viewport position
**Rationale**:
- Already implemented for existing TOC
- Provides visual feedback of current position
- Reuse existing logic for both desktop TOC and mobile drawer

### Decision 6: Desktop vs Mobile Display
**Choice**: Use CSS media query at 768px breakpoint
**Rationale**:
- Consistent with existing responsive breakpoints in layout.css
- Desktop shows sidebar TOC, mobile shows hamburger + drawer
- Simple CSS toggle without JavaScript detection

## Technical Approach

### HTML Structure
```html
<!-- Back to Top Button (both desktop & mobile) -->
<button class="back-to-top" aria-label="回到顶部">↑</button>

<!-- Mobile Navigation Menu (hamburger button) -->
<button class="mobile-menu-toggle" aria-label="打开目录菜单" aria-expanded="false">
  <span class="hamburger-icon"></span>
</button>

<!-- Mobile Navigation Drawer -->
<div class="mobile-nav-drawer" aria-hidden="true">
  <div class="mobile-nav-overlay"></div>
  <aside class="mobile-nav-panel">
    <div class="mobile-nav-header">
      <h3>目录</h3>
      <button class="mobile-nav-close" aria-label="关闭目录">&times;</button>
    </div>
    <nav class="mobile-nav-content">
      <ul id="mobile-nav-list"></ul>
    </nav>
  </aside>
</div>
```

### CSS Styling Approach
- `.back-to-top`: Fixed positioning (bottom: 20px, right: 20px), 36px size, z-index: 1000
- `.mobile-menu-toggle`: Fixed positioning (bottom: 64px, right: 20px), 36px size, z-index: 1000
- `.mobile-nav-drawer`: Full-screen overlay with slide-out panel, z-index: 1100
- `.mobile-nav-link`: Same styling as desktop `.outline a` (rounded corners, border-left accent)
- Touch-action CSS properties to prevent click-through issues

### JavaScript Logic Flow
1. On page load, detect all h2 headings
2. Generate IDs for headings (existing logic)
3. Populate both desktop TOC links and mobile drawer links
4. Attach click handlers for smooth scrolling
5. Attach scroll listener to update active states
6. Handle drawer open/close with proper event handling (stopImmediatePropagation)
7. Handle touchend events to prevent click-through on mobile

### Z-Index Management
- Mobile nav drawer: z-index: 1100
- Back-to-top button: z-index: 1000
- Mobile menu toggle: z-index: 1000
- Mobile header: z-index: 1000 (existing)

## Risks / Trade-offs

### Risk: Click-through on touch devices
**Impact**: Tapping fixed buttons may trigger elements beneath
**Mitigation**:
- Use touchend event handlers with stopImmediatePropagation
- Add CSS touch-action: manipulation and -webkit-tap-highlight-color: transparent
- Tested and resolved

### Risk: Scroll offset hiding content
**Impact**: After scrolling to anchor, fixed header may cover content
**Mitigation**:
- Use scroll-margin-top CSS property on target elements
- Set appropriate values (80px on mobile) to account for fixed header

## Migration Plan
No migration needed - this is purely additive functionality. No existing behavior changes.

## Open Questions
None - all key decisions have been made based on user preferences.
