# Kinguin Kings Drop

A Tampermonkey userscript that automates the weekly Kinguin King's Drop subscription workflow on Kinguin.net.

## Documentation

For detailed documentation on how the script works, see the [`docs/`](./docs/) folder:

| Document | Description |
|----------|-------------|
| [Overview](./docs/OVERVIEW.md) | General overview, workflow explanation, and safety considerations |
| [Checkout Page](./docs/CHECKOUT.md) | Checkout automation, balance input, Pay button highlighting |
| [Game Page](./docs/GAME-PAGE.md) | King's Drop product selection, glitch detection, Add to Cart automation |
| [Dashboard](./docs/DASHBOARD.md) | Subscription section navigation, "Get Now" button automation |

## Features

- **Checkout Page**: Automatically fills maximum Kinguin balance and highlights the Pay button
- **Game Page**: Handles King's Drop product pages with subscription purchase mode
- **Dashboard**: Scrolls to subscription section and clicks Get Now button
- **Visual Feedback**: Animated highlights and status overlays for user awareness

## Installation

### Option 1: Direct Install
1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Open `dist/kinguin-kings-drop.user.js`
3. Copy all contents
4. In Tampermonkey: Dashboard → Create new script → Paste → Save

### Option 2: Build from Source
```bash
npm install
npm run build
```
Then install `dist/kinguin-kings-drop.user.js` in Tampermonkey.

## Development

### Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Watch mode - rebuilds on file changes |
| `npm run build` | Production build (minified) |
| `npm run clean` | Remove dist folder |

### Project Structure
```
src/
├── main.js                 # Entry point with URL routing
├── config/
│   └── routes.js           # URL patterns and page detection
├── pages/
│   ├── checkout.js         # Checkout page handler
│   ├── game-page.js        # Game page handler
│   └── dashboard.js        # Dashboard handler
└── utils/
    ├── simulation.js       # Human-like mouse/keyboard events
    ├── dom.js              # DOM queries, waitForElement, XPath
    └── styles.js           # CSS injection, overlays, highlights
```

### Adding a New Page Handler

1. **Create the handler** in `src/pages/newpage.js`:
```javascript
import { log, waitForElement, humanLikeClick } from '../utils/index.js';

export async function initNewPage() {
  log('New page handler initialized');
  // Your automation logic here
}
```

2. **Add route pattern** in `src/config/routes.js`:
```javascript
export const PageType = {
  // ... existing types
  NEW_PAGE: 'new-page',
};

const ROUTE_PATTERNS = [
  // ... existing patterns
  {
    type: PageType.NEW_PAGE,
    pattern: /^https?:\/\/(www\.)?example\.com\/path/i,
    description: 'New page description',
  },
];
```

3. **Register handler** in `src/main.js`:
```javascript
import { initNewPage } from './pages/newpage.js';

const PAGE_HANDLERS = {
  // ... existing handlers
  [PageType.NEW_PAGE]: initNewPage,
};
```

4. **Add @match pattern** in `rollup.config.js` header.

5. **Build**: `npm run build`

## Supported Pages

| Page | URL Pattern | Features |
|------|-------------|----------|
| Checkout | `kinguin.net/new-checkout/review*` | Balance fill, Pay button highlight |
| Game Page | `kinguin.net/category/*` | King's Drop selection, glitch detection |
| Dashboard | `kinguin.net/app/dashboard/subscription*` | Auto-scroll, Get Now click |

## Shared Utilities

### simulation.js
- `humanLikeClick(element)` - Realistic mouse click sequence
- `humanLikeType(element, text)` - Type with random delays
- `humanDelay(min, max)` - Random delay promise
- `sleep(ms)` - Simple delay promise

### dom.js
- `$(selector)` / `$$(selector)` - CSS query helpers
- `$x(xpath)` / `$$x(xpath)` - XPath query helpers
- `waitForElement(selector, options)` - Wait for element to appear
- `waitForElementEnabled(selector, options)` - Wait for element to be enabled
- `scrollToElement(element)` - Smooth scroll to element
- `log(...args)` - Prefixed console logging

### styles.js
- `injectStyles(css, id)` - Add CSS to page
- `highlightElement(element, type, duration)` - Visual feedback (success/warning/error)
- `createOverlay(text, options)` - Floating status message
- `removeOverlay()` - Remove status overlay

## License

MIT