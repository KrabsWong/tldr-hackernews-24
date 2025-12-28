# Design: expand-homepage-titles

## Architecture Overview
This change introduces three independent but complementary features to the homepage:

### 1. Title Expansion
- **Data extraction**: Parse post content to extract all H2 headings (article titles)
- **Display strategy**: Show titles as a list of clickable links within each post item
- **Rendering**: Server-side Liquid template extracts titles from HTML during build

### 2. Client-Side Pagination
- **State management**: Pure JavaScript approach with no dependencies
- **DOM manipulation**: Show/hide post items based on current page
- **Navigation**: Text-based Previous/Next links + page number display
- **Persistence**: Optional: Use URL hash to preserve page state on refresh

### 3. Collapse/Expand Toggle
- **Default state**: First post expanded, all others collapsed
- **Interaction**: Toggle button with rotating arrow icon (▼/▲)
- **Animation**: CSS max-height transition for smooth expand/collapse
- **Integration**: Works seamlessly with pagination (first post on each page expanded)

## Technical Approach

### Title Extraction: Server-Side HTML Parsing (Final Implementation)
**Pros:**
- No JavaScript parsing required
- Works without JS enabled
- SEO-friendly
- Accurate extraction from Jekyll-processed HTML

**Implementation:**
```liquid
{% raw %}
{% for post in site.posts %}
  <li class="post-item">
    <div class="post-header">
      <a href="{{ post.url }}" class="post-link">
        <h2>{{ post.date | date: "%Y-%m-%d" }}</h2>
      </a>
      <button class="toggle-titles" aria-label="展开/收起标题列表" 
              aria-expanded="{% if forloop.first %}true{% else %}false{% endif %}">
        <span class="toggle-icon">▼</span>
      </button>
    </div>
    <div class="post-titles {% unless forloop.first %}collapsed{% endunless %}">
      {% assign html_content = post.content %}
      {% assign h2_sections = html_content | split: "<h2" %}
      {% for section in h2_sections %}
        {% if forloop.first == false %}
          {% assign title_with_tag = section | split: "</h2>" | first %}
          {% assign title_text = title_with_tag | split: ">" | last | strip_html | strip %}
          {% unless title_text == "" %}
            <a href="{{ post.url }}" class="article-title">{{ title_text }}</a>
          {% endunless %}
        {% endif %}
      {% endfor %}
    </div>
  </li>
{% endfor %}
{% endraw %}
```

**Key decisions:**
- Parse HTML tags (`<h2>`) instead of markdown (`##`) since Jekyll converts markdown to HTML before passing to layouts
- First post uses `aria-expanded="true"` and no `.collapsed` class for default expanded state
- Toggle button positioned in header alongside date

## Pagination Architecture

### Data Structure
```javascript
const paginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: document.querySelectorAll('.post-item').length,
  totalPages: Math.ceil(totalItems / itemsPerPage)
};
```

### DOM Structure
```html
<div class="pagination-controls">
  <a href="#" class="pagination-prev" aria-label="上一页">← 上一页</a>
  <span class="pagination-info">第 <span id="current-page">1</span> 页 / 共 <span id="total-pages">5</span> 页</span>
  <a href="#" class="pagination-next" aria-label="下一页">下一页 →</a>
</div>
```

**Note:** Changed from `<button>` to `<a>` elements for cleaner, text-based navigation style.

### Algorithm
1. On page load, hide all items except first page
2. Calculate total pages based on item count
3. On navigation click:
   - Update current page
   - Hide all items and collapse all titles
   - Show items for current page
   - Expand first visible post on current page
   - Update link states (add .disabled class at boundaries)
   - Update page counter

## Collapse/Expand Architecture

### CSS Implementation
```css
.post-titles {
  max-height: 1000px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.post-titles.collapsed {
  max-height: 0;
}

.toggle-icon {
  transition: transform 0.3s ease;
  display: inline-block;
}

.toggle-titles[aria-expanded="true"] .toggle-icon {
  transform: rotate(-180deg);
}
```

**Rationale:** Using max-height transition instead of height:auto for smooth CSS-only animation.

### JavaScript Implementation
```javascript
// toggle.js
function initToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-titles');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const postItem = this.closest('.post-item');
      const titlesDiv = postItem.querySelector('.post-titles');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        titlesDiv.classList.add('collapsed');
      } else {
        this.setAttribute('aria-expanded', 'true');
        titlesDiv.classList.remove('collapsed');
      }
    });
  });
}

function expandFirstVisiblePost() {
  const visiblePosts = Array.from(document.querySelectorAll('.post-item'))
    .filter(item => item.style.display !== 'none');
  
  if (visiblePosts.length > 0) {
    const firstPost = visiblePosts[0];
    const button = firstPost.querySelector('.toggle-titles');
    const titlesDiv = firstPost.querySelector('.post-titles');
    
    if (button && titlesDiv) {
      button.setAttribute('aria-expanded', 'true');
      titlesDiv.classList.remove('collapsed');
    }
  }
}
```

**Integration with pagination:**
- `pagination.js` calls `expandFirstVisiblePost()` after changing pages
- Ensures consistent behavior: first post on each page is always expanded

## Responsive Considerations
- **Desktop**: 10 posts per page
- **Mobile**: 5 posts per page (adjust via media query or JS)
- Pagination controls remain fixed at bottom on mobile

## Accessibility
- Pagination links have ARIA labels and `aria-disabled` attribute
- Toggle buttons use `aria-expanded` to indicate state
- Keyboard navigation support (native button/link elements)
- Screen reader announces page changes via ARIA live region
- Focus management after page change
- Toggle button has descriptive `aria-label`: "展开/收起标题列表"

## Trade-offs

### Title Extraction
**Server-side HTML parsing (Final choice):**
- ✅ Works without JS
- ✅ Better SEO
- ✅ Accurate extraction from Jekyll-processed HTML
- ❌ Requires understanding Jekyll's Liquid templating
- ❌ More complex template logic than markdown parsing

### Pagination Strategy
**Client-side with text links (Final choice):**
- ✅ No server-side configuration
- ✅ Instant page changes
- ✅ Works with GitHub Pages
- ✅ Cleaner UI than button-based pagination
- ❌ Requires JavaScript
- ❌ Not SEO-friendly (all posts still in DOM)

### Collapse/Expand Behavior
**First post expanded, others collapsed (Final choice):**
- ✅ Balances discoverability and page length
- ✅ Most recent content immediately visible
- ✅ Users can easily expand older content if interested
- ✅ Consistent behavior when paginating (first post on each page expanded)
- ❌ Requires JavaScript for toggle functionality
- ❌ Adds slight interaction complexity

**Alternative: All collapsed by default**
- ✅ Shortest initial page length
- ❌ Requires extra click even for most recent content
- ❌ Reduces discoverability

**Alternative: All expanded by default**
- ✅ Maximum discoverability
- ❌ Very long page (defeats purpose of adding collapse feature)

## Implementation Sequence
1. **Phase 1**: Server-side title extraction in `_layouts/default.html` (HTML parsing approach)
2. **Phase 2**: Client-side pagination JavaScript in `assets/js/pagination.js` (text link version)
3. **Phase 3**: Collapse/expand functionality in `assets/js/toggle.js`
4. **Phase 4**: CSS styling for titles, pagination controls, and collapse animations
5. **Phase 5**: Integration between pagination and collapse (first post auto-expand)
6. **Phase 6**: Testing across devices and browsers

## Validation
- Test with 1, 5, 10, 20, 50 posts
- Verify pagination works on mobile/desktop
- Ensure titles are clickable and navigate correctly
- Check performance with large post counts
- Verify collapse/expand animations are smooth
- Test first post expansion after pagination
- Verify accessibility with screen readers and keyboard-only navigation
