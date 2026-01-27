# Diana Tsiolkovska Portfolio Website

A modern, performant portfolio website for UGC & AI Creator Diana Tsiolkovska.

## 🚀 Features

- **Clean Architecture**: Modular JavaScript ES6 classes
- **Performance Optimized**: Lazy loading, debouncing, throttling, CSS containment
- **Fully Accessible**: ARIA labels, keyboard navigation, reduced motion support
- **Mobile-First**: Optimized for both desktop and mobile devices
- **Modern Stack**: ES6 modules, CSS custom properties, async/await

## 📁 Project Structure

```
/1Portfolio
├── index.html                 # Main HTML file
├── assets/                    # Images, videos, logos
│   ├── me.png
│   ├── logos/
│   ├── reviews/
│   └── video/
└── src/                       # Source files
    ├── js/                    # JavaScript modules
    │   ├── main.js            # Application initialization
    │   ├── utils.js           # Utility functions (debounce, throttle, etc.)
    │   ├── svgs.js            # SVG icon library
    │   ├── MarqueeComponent.js
    │   ├── PortfolioFilter.js
    │   ├── PortfolioRenderer.js
    │   ├── VideoPlayer.js     # Advanced video player with lazy loading
    │   ├── ReviewsComponent.js
    │   └── ReviewsSlider.js
    ├── css/                   # Modular CSS
    │   ├── main.css           # CSS entry point (imports all)
    │   ├── variables.css      # CSS custom properties
    │   ├── base.css           # Base styles & resets
    │   └── components/
    │       ├── background.css
    │       ├── hero.css
    │       ├── marquee.css
    │       └── features-portfolio-reviews.css
    └── data/                  # JSON data files
        ├── config.json        # Brands & categories
        ├── portfolio.json     # Portfolio items
        └── reviews.json       # Customer reviews
```

## 🛠 Technologies

- **HTML5**: Semantic markup, accessibility features
- **CSS3**: Custom properties, Grid, Flexbox, backdrop-filter, CSS containment
- **JavaScript ES6+**: Modules, Classes, async/await, Fetch API
- **APIs**: Intersection Observer, Media Query API

## ⚡ Performance Optimizations

### JavaScript
- **Modular architecture** with ES6 classes
- **Lazy loading** for videos (preload="none")
- **Debounced** event handlers
- **Throttled** mousemove events
- **IntersectionObserver** for scroll-based actions
- **Error handling** for all async operations
- **Cached DOM queries** in class constructors

### CSS
- **Reduced blur filters** (80px desktop, 50px mobile)
- **CSS containment** for better paint performance
- **Optimized transitions** (only transform/opacity)
- **Lighter backdrop-filters** on mobile (12px → 8px)
- **CSS custom properties** for maintainability

### HTML
- **Preload** critical assets
- **fetchpriority="high"** on hero image
- **loading="lazy"** on review images
- **Width/height attributes** to prevent layout shift
- **rel="noopener noreferrer"** on external links

## ♿ Accessibility Features

- **ARIA labels** on all interactive elements
- **Keyboard navigation** for reviews slider
- **Reduced motion support** via @media query
- **Semantic HTML5** elements
- **Focus management** throughout
- **Screen reader friendly** SVGs with aria-hidden

## 🚦 Getting Started

### Development Server

```bash
# Start a local server (Python 3)
python3 -m http.server 8080

# Or use Node.js
npx http-server -p 8080

# Or use PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

### Important: ES6 Modules

This project uses **ES6 modules** (`import`/`export`), which require a web server to work. Opening `index.html` directly in a browser (file://) will not work due to CORS restrictions.

## 📝 Configuration

### Adding New Portfolio Items

Edit `src/data/portfolio.json`:

```json
{
  "folder": "your_video_folder",
  "category": "beauty",
  "title": "Video Title",
  "brand": "Brand Name"
}
```

Place video files in: `assets/video/your_video_folder/`
- `video.mp4` - The video file
- `poster.png` - Poster/thumbnail image

### Adding New Reviews

Edit `src/data/reviews.json`:

```json
{
  "type": "instagram",
  "brand": "Brand Name",
  "platform": "Instagram",
  "logo": "assets/logos/logo_brand.png",
  "image": "assets/reviews/review_brand.png"
}
```

### Modifying Categories

Edit `src/data/config.json`:

```json
{
  "filter": "category_id",
  "name": "Display Name",
  "active": 1
}
```

Set `"active": 1` for the default category.

## 🎨 Customization

### Colors

Edit `src/css/variables.css`:

```css
:root {
    --bg-color: #03000a;
    --accent-color: #7b2cbf;
    /* ... more variables */
}
```

### Typography

Fonts are loaded from Google Fonts. To change fonts, update both:
1. Font link in `index.html`
2. Font variables in `src/css/variables.css`

## 📄 License

© 2026 Diana Tsiolkovska | All rights reserved

---

**Built with ❤️ and best practices**
