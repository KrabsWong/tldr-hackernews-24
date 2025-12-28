# Design Document: Scroll Navigation Features

## Context
The post page currently has a table of contents (TOC) that works well on desktop but creates navigation challenges on mobile. Users need better ways to:
- Return to the top of long pages
- Navigate between articles without scrolling back to the TOC

## Goals / Non-Goals

### Goals
- Add a universal back-to-top button for both desktop and mobile
- Provide space-efficient navigation on mobile through dot indicators
- Maintain smooth scrolling and active state tracking
- Ensure no visual conflicts with existing layout elements

### Non-Goals
- Changing the desktop TOC implementation (keep as-is)
- Adding complex animations or transitions beyond smooth scrolling
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
- Show only after scrolling 300-500px: More traditional pattern, but adds complexity and the button is small enough to not be intrusive when always visible

### Decision 2: Mobile Dot Navigation Position
**Choice**: Vertical stack of dots on the right side, positioned using `position: fixed`
**Rationale**:
- Right-side positioning is conventional and expected by users
- Fixed positioning ensures always visible during scroll
- Vertical stack accommodates variable number of articles
- Small dot size (8-12px) minimizes screen real estate usage

**Alternatives considered**:
- Bottom tab bar: Takes more space, conflicts with browser UI
- Hamburger menu with drawer: Requires extra click, less discoverable

### Decision 3: Dot Navigation Implementation
**Choice**: Reuse existing outline generation logic, render differently based on screen size
**Rationale**:
- Leverages existing heading detection and ID generation
- Single source of truth for article structure
- CSS media queries handle display switching (TOC on desktop, dots on mobile)
- JavaScript manages both TOC links and dot clicks with shared scroll logic

### Decision 4: Active State Tracking
**Choice**: Use scroll event listener to update active dot/link based on viewport position
**Rationale**:
- Already implemented for existing TOC
- Provides visual feedback of current position
- Reuse existing logic for both desktop TOC and mobile dots

### Decision 5: Desktop vs Mobile Display
**Choice**: Use CSS media query at 768px breakpoint to show TOC on desktop, dots on mobile
**Rationale**:
- Consistent with existing responsive breakpoints in layout.css
- Simple CSS toggle without JavaScript detection
- Matches existing mobile header behavior

## Technical Approach

### HTML Structure
```html
<!-- Back to Top Button (both desktop & mobile) -->
<button class="back-to-top" aria-label="回到顶部">↑</button>

<!-- Existing desktop TOC (unchanged structure, add CSS for desktop-only) -->
<div class="outline-wrapper">
  <div class="outline">
    <h3>目录</h3>
    <ul id="outline-list"></ul>
  </div>
</div>

<!-- New mobile dot navigation -->
<nav class="mobile-dot-nav" aria-label="文章导航">
  <ul id="dot-nav-list"></ul>
</nav>
```

### CSS Styling Approach
- `.back-to-top`: Fixed positioning (bottom: 24px, right: 24px), z-index: 1000
- `.mobile-dot-nav`: Fixed positioning on right side, visible only on mobile (<768px)
- `.outline-wrapper`: Hidden on mobile, visible on desktop
- Dots: 10px diameter circles with 8px spacing, active state with accent color

### JavaScript Logic Flow
1. On page load, detect all h2 headings
2. Generate IDs for headings (existing logic)
3. Populate both TOC links and dot indicators
4. Attach click handlers for smooth scrolling
5. Attach scroll listener to update active states
6. Attach back-to-top button click handler

### Z-Index Management
- Back-to-top button: z-index: 1000
- Mobile dot navigation: z-index: 999
- Mobile header: z-index: 1000 (existing)
- No conflicts expected as elements don't overlap

## Risks / Trade-offs

### Risk: Too many articles creating too many dots
**Impact**: On posts with 20+ h2 headings, vertical dot stack could overflow viewport
**Mitigation**: 
- Use `max-height` with scrollable container if needed
- Most posts have 5-15 articles based on existing content
- Monitor and adjust if this becomes an issue

### Risk: Dots too small for touch targets on mobile
**Impact**: Users may struggle to tap dots accurately
**Mitigation**:
- Use 10px visible dots with 32px touch target padding
- Add visual feedback on tap
- Test on real devices during implementation

### Risk: Conflicts with existing scroll behavior
**Impact**: Multiple scroll handlers could cause performance issues
**Mitigation**:
- Reuse existing scroll tracking logic
- Throttle scroll events if performance issues arise
- Use passive event listeners for better performance

## Migration Plan
No migration needed - this is purely additive functionality. No existing behavior changes.

## Open Questions
None - all key decisions have been made based on user preferences.
