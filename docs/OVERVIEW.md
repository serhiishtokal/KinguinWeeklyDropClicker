# Kinguin Kings Drop Overview

## What is Kings Drop?

Kings Drop is a Tampermonkey userscript designed to automate the weekly **King's Drop subscription workflow** on Kinguin.net. It streamlines the process of claiming your weekly King's Drop game, handling the subscription purchase flow, and completing checkout with Kinguin balance.

## Purpose and Use Case

### King's Drop Subscription Workflow

King's Drop is Kinguin's weekly subscription benefit that offers free or discounted games. The typical workflow for claiming your weekly King's Drop involves:

1. **Starting from the dashboard** subscription page
2. **Selecting the subscription price** on the King's Drop product page
3. **Completing checkout** using Kinguin balance

This script automates each step, saving time and reducing repetitive clicking.

## Overall Workflow

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   DASHBOARD PAGE    │ --> │    GAME PAGE        │ --> │   CHECKOUT PAGE     │
│                     │     │                     │     │                     │
│  • Scroll to        │     │  • Select           │     │  • Fill max balance │
│    subscription     │     │    KinguinPass      │     │  • Highlight Pay    │
│  • Click "Get Now"  │     │  • Add to Cart      │     │    button           │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

### 1. Dashboard Page (`/app/dashboard/subscription`)

The entry point for managing King's Drop subscriptions. The script:
- Automatically scrolls to the subscription section
- Clicks the "Get Now" button to initiate the subscription process

### 2. Game Page (`/category/[id]/[name]`)

King's Drop product pages where you select the subscription pricing option. The script:
- Clicks the subscription price button to select the discounted price
- Waits for the UI to update
- Clicks the "Add to Cart" button
- **Detects glitch states** where the button incorrectly shows "SUBSCRIBE AND ADD TO CART"

### 3. Checkout Page (`/new-checkout/review`)

The final step where you complete the purchase. The script:
- Automatically fills in the maximum Kinguin balance value (`999`)
- Highlights the Pay button with a pulsing animation for easy visibility
- **Does NOT auto-click** the Pay button for safety

## How the Pages Work Together

The three page handlers are **independent but complementary**. Each page:

1. **Detects** when you're on a relevant Kinguin URL
2. **Initializes** automatically via the URL router in [`main.js`](../src/main.js:28)
3. **Executes** its automation sequence
4. **Provides feedback** via visual overlays

The routing system in [`routes.js`](../src/config/routes.js:19) uses regex patterns to match URLs:

| Page Type | URL Pattern | Handler |
|-----------|-------------|---------|
| Dashboard | `kinguin.net/app/dashboard/subscription*` | [`initDashboardPage()`](../src/pages/dashboard.js:104) |
| Game Page | `kinguin.net/category/*` | [`initGamePage()`](../src/pages/game-page.js:208) |
| Checkout | `kinguin.net/new-checkout/review*` | [`initCheckoutPage()`](../src/pages/checkout.js:169) |

## Safety Considerations

### Human-Like Interaction

The script uses human-like interaction patterns to:
- Avoid detection by anti-bot systems
- Provide natural timing between actions
- Simulate realistic mouse and keyboard events

Key utilities from [`simulation.js`](../src/utils/simulation.js):
- `humanLikeClick()` - Dispatches mousedown, mouseup, and click events with realistic timing
- `humanLikeType()` - Types characters with random delays between keystrokes
- `humanDelay()` - Adds variable delays between actions

### No Auto-Payment

The checkout page **intentionally does not auto-click** the Pay button. Instead, it:
- Fills in the balance value
- Highlights the Pay button with a highly visible animation
- Waits for **manual user confirmation** before payment

This design ensures you always have final control over your purchases.

### Glitch Detection

The game page includes **glitch detection** to prevent accidental subscriptions. If the "Add to Cart" button shows "SUBSCRIBE AND ADD TO CART" text (indicating a UI glitch), the script:
- **Stops execution** - Does not click the button
- **Shows a warning** - Displays a blinking red message
- **Recommends action** - Prompts you to refresh the page

### Visual Feedback

All actions provide clear visual feedback via:
- **Status overlays** - Floating messages in the bottom-right corner
- **Element highlighting** - Pulsing borders on interactive elements
- **Console logging** - Detailed logs prefixed with `[KingsDrop]`

### Graceful Failure

If any element is not found or an action fails:
- The script logs the failure
- Displays an error overlay
- Does not attempt to continue with subsequent steps that depend on the failed action

## Architecture Overview

```
src/
├── main.js                 # Entry point, URL routing, handler dispatch
├── config/
│   └── routes.js           # URL patterns, page type detection
├── pages/
│   ├── checkout.js         # Checkout automation
│   ├── game-page.js        # Game page automation
│   └── dashboard.js        # Dashboard automation
└── utils/
    ├── dom.js              # DOM queries, element waiting, XPath
    ├── simulation.js       # Human-like interactions
    └── styles.js           # CSS injection, overlays, highlights
```

## Browser Compatibility

The script is designed for use with:
- **Tampermonkey** browser extension
- **Chromium-based browsers** (Chrome, Edge, Brave)
- **Firefox** with Tampermonkey/Greasemonkey

## Further Reading

- [Checkout Page Documentation](./CHECKOUT.md)
- [Game Page Documentation](./GAME-PAGE.md)
- [Dashboard Page Documentation](./DASHBOARD.md)