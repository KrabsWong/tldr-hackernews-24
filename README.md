# TL;DR HackerNews 24

A Jekyll-based HackerNews daily aggregator with modern UI and dark/light theme support.

<img width="1672" height="941" alt="clipboard-image-1780577903" src="https://github.com/user-attachments/assets/550312fe-777e-4ab9-b22b-84123c7214fc" />

## Features

- 🎨 Modern, clean UI design
- 🌙 Dark/Light theme toggle with automatic system preference detection
- 📱 Fully responsive design (mobile, tablet, desktop)
- ♿ Accessible with WCAG AA compliant color contrast
- ⚡ Fast loading with minimal dependencies

## Theme System

The site uses CSS custom properties (CSS variables) for theming. Theme preferences are stored in `localStorage` and persist across sessions.

### Theme States

1. **Light**: Explicit light theme
2. **Dark**: Explicit dark theme
3. **Auto**: Follows system preference (default)

### Using the Theme

Click the theme toggle button in the header to cycle through themes:
- Light ☀️ → Dark 🌙 → Auto 🔄 → Light ☀️

The theme preference is automatically saved and will be applied when you return to the site.

## Development

### File Structure

```
assets/
  css/
    theme.css          # Theme variables and transitions
    layout.css         # Layout and responsive styles
    components.css     # Component-specific styles
  js/
    theme-toggle.js    # Theme management logic
_layouts/
  default.html        # Homepage layout
  post.html          # Post page layout
```

### Customization

To customize the color scheme, edit the CSS variables in `assets/css/theme.css`:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #202124;
  --accent-color: #1a73e8;
}
```

### Building the Site

```bash
bundle install
bundle exec jekyll serve
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Requirements

- CSS custom properties support
- ES6 JavaScript support
- `window.matchMedia` for system preference detection

## License

See LICENSE file for details.
