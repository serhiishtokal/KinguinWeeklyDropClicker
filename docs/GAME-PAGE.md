# Game Page Documentation

## Purpose and Use Case

The game page handler automates King's Drop price selection and adding items to cart on subscription product pages. It includes a critical **glitch detection** feature that prevents accidental subscription purchases when the UI is in an incorrect state.

**URL Pattern:**
- `https://www.kinguin.net/category/[id]/[name]` - Game product pages

**Source File:** [`src/pages/game-page.js`](../src/pages/game-page.js)

## What It Does

1. **Clicks the subscription price option** to select the discounted King's Drop price
2. **Waits for the UI to update** and become interactive
3. **Detects glitch states** that could cause unwanted subscriptions
4. **Adds the item to cart** (or shows a warning if glitch detected)

## Step-by-Step Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  1. Page Load Detection                                          │
│     └── URL matches: kinguin.net/category/[id]/*                 │
├──────────────────────────────────────────────────────────────────┤
│  2. initGamePage() called                                        │
│     └── Shows overlay: "KingsDrop: Game Page - Automating..."    │
├──────────────────────────────────────────────────────────────────┤
│  3. Wait 500ms for page stabilization                            │
├──────────────────────────────────────────────────────────────────┤
│  4. selectKinguinPassAndAddToCart() execution                    │
│     ├── a. Click subscription price button (via XPath)           │
│     ├── b. Wait for element to be enabled (2000ms timeout)       │
│     ├── c. Human-like delay (100-400ms)                          │
│     ├── d. Find Add to Cart button                               │
│     ├── e. **GLITCH CHECK**: Verify button text                  │
│     │      ├── If "SUBSCRIBE AND ADD TO CART" → ABORT + WARNING  │
│     │      └── If normal text → Continue                         │
│     └── f. Click Add to Cart button                              │
├──────────────────────────────────────────────────────────────────┤
│  5. Display result overlay                                       │
│     ├── Success: "KingsDrop: Added to Cart!"                     │
│     ├── Glitch: "⚠️ GLITCH DETECTED - Refresh the page!"         │
│     └── Failure: "KingsDrop: Could not complete..."              │
└──────────────────────────────────────────────────────────────────┘
```

## The Glitch Detection Feature

### Why It Exists

Sometimes the Kinguin website has a UI glitch where, even after selecting the subscription price, the "Add to Cart" button still shows "SUBSCRIBE AND ADD TO CART" text. Clicking this button would **initiate a new subscription** instead of just adding the item to cart.

### How It Works

Before clicking the Add to Cart button, the script checks the button text:

```javascript
const buttonText = el.textContent || el.innerText || '';
if (buttonText.toUpperCase().includes('SUBSCRIBE AND ADD TO CART')) {
  log('clickAddToCart: GLITCH DETECTED - Button shows "SUBSCRIBE AND ADD TO CART"');
  
  // Display visual warning
  displayGlitchWarning(el, parentContainer);
  
  // Show overlay warning
  createOverlay('⚠️ GLITCH DETECTED - Refresh the page!', {
    backgroundColor: 'rgba(244, 67, 54, 0.95)',
    autoRemove: 0, // Don't auto-remove - keep visible
  });
  
  // Abort - do NOT click the button
  return false;
}
```

**Location:** [`game-page.js:129-146`](../src/pages/game-page.js:129)

### Visual Warning

When a glitch is detected, the script:

1. **Highlights the button** with red styling:
```javascript
{
  border: '3px solid red',
  backgroundColor: 'rgba(255, 0, 0, 0.3)',
  boxShadow: '0 0 10px red',
}
```

2. **Creates a blinking warning message** below the button:
```javascript
{
  color: 'red',
  fontWeight: 'bold',
  fontSize: '16px',
  backgroundColor: '#ffeeee',
  border: '2px solid red',
  animation: 'kinguin-glitch-blink 1s infinite',
}
```

3. **Shows a persistent overlay** that doesn't auto-dismiss

**Location:** [`game-page.js:71-105`](../src/pages/game-page.js:71)

## XPath Selectors Used

| Element | XPath | Fallback CSS |
|---------|-------|--------------|
| Subscription Price Button | `//*[@id="main-offer-wrapper"]/div[1]/button` | N/A |
| Add to Cart Button | `//*[@id="main-offer-wrapper"]/div[2]/div/div/div/button` | `button[data-cy="standardCheckout"]` |

### Selector Definitions

```javascript
const SELECTORS = {
  SUBSCRIPTION_PRICE_XPATH: '//*[@id="main-offer-wrapper"]/div[1]/button',
  ADD_TO_CART_XPATH: '//*[@id="main-offer-wrapper"]/div[2]/div/div/div/button',
  ADD_TO_CART_CSS: 'button[data-cy="standardCheckout"]',
};
```

**Location:** [`game-page.js:13-17`](../src/pages/game-page.js:13)

### Why XPath?

XPath is used because:
1. The subscription price button doesn't have a reliable CSS selector
2. The DOM structure is nested and complex
3. XPath allows precise navigation to specific elements

### Fallback Strategy

For the Add to Cart button, the script first tries CSS selector (more reliable when available), then falls back to XPath:

```javascript
// Try CSS selector with data-cy attribute first (more reliable)
let el = $(SELECTORS.ADD_TO_CART_CSS);

// Fallback to XPath if CSS selector doesn't find it
if (!el) {
  el = $x(SELECTORS.ADD_TO_CART_XPATH);
}
```

**Location:** [`game-page.js:113-119`](../src/pages/game-page.js:113)

## Configuration Options

The [`selectKinguinPassAndAddToCart()`](../src/pages/game-page.js:161) function accepts configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `waitTimeout` | number | `2000` | Max time to wait for element to be enabled |
| `pollInterval` | number | `50` | How often to check if element is enabled |
| `betweenClicksDelay` | object | `{min: 100, max: 400}` | Random delay range between clicks |

### Default Configuration

```javascript
const {
  waitTimeout = 2000,
  pollInterval = 50,
  betweenClicksDelay = { min: 100, max: 400 },
} = options;
```

**Location:** [`game-page.js:162-166`](../src/pages/game-page.js:162)

## Warning States

### Glitch Detected

| Visual Element | Description |
|----------------|-------------|
| Button Border | 3px solid red |
| Button Background | Semi-transparent red |
| Button Box Shadow | Red glow effect |
| Warning Message | "refresh the page!!!" with blinking animation |
| Overlay | Red overlay that stays visible (doesn't auto-remove) |

### CSS Animation for Glitch Warning

```css
@keyframes kinguin-glitch-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.5; }
}
```

**Location:** [`game-page.js:22-27`](../src/pages/game-page.js:22)

## Key Functions

### `initGamePage()`

The main entry point called by the router.

```javascript
export async function initGamePage() {
  log('Initializing game page handler...');

  createOverlay('KingsDrop: Game Page - Automating...', {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    autoRemove: 2000,
  });

  await sleep(500);
  const success = await selectKinguinPassAndAddToCart();
  
  // Display success/failure overlay...
}
```

**Location:** [`game-page.js:208-239`](../src/pages/game-page.js:208)

### `clickSubscriptionPrice()`

Clicks the subscription price option button.

```javascript
async function clickSubscriptionPrice() {
  const el = $x(SELECTORS.SUBSCRIPTION_PRICE_XPATH);
  if (!el) {
    log('clickSubscriptionPrice: subscription price option not found');
    return false;
  }

  humanLikeClick(el);
  log('clickSubscriptionPrice: clicked subscription price option');
  return true;
}
```

**Location:** [`game-page.js:54-64`](../src/pages/game-page.js:54)

### `waitForXPathElementEnabled(xpath, timeout, interval)`

Waits for an XPath element to be enabled and interactive.

```javascript
async function waitForXPathElementEnabled(xpath, timeout = 5000, interval = 50) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = $x(xpath);
    if (el && el.offsetParent !== null && !el.disabled && !el.classList.contains('disabled')) {
      return el;
    }
    await sleep(interval);
  }
  return null;
}
```

**Location:** [`game-page.js:37-48`](../src/pages/game-page.js:37)

### `clickAddToCart()`

Clicks the Add to Cart button with glitch detection.

**Location:** [`game-page.js:112-151`](../src/pages/game-page.js:112)

### `displayGlitchWarning(button, parentContainer)`

Shows visual warning when glitch is detected.

**Location:** [`game-page.js:71-105`](../src/pages/game-page.js:71)

## Code Examples for Customization

### Change Timing Parameters

Modify the call in [`initGamePage()`](../src/pages/game-page.js:220) to adjust timing:

```javascript
const success = await selectKinguinPassAndAddToCart({
  waitTimeout: 3000,           // Wait longer for element to be enabled
  pollInterval: 100,           // Check less frequently
  betweenClicksDelay: {
    min: 200,                  // Minimum delay between clicks
    max: 600,                  // Maximum delay between clicks
  },
});
```

### Disable Glitch Detection (Not Recommended)

To bypass glitch detection (use at your own risk), modify [`clickAddToCart()`](../src/pages/game-page.js:112):

```javascript
async function clickAddToCart() {
  let el = $(SELECTORS.ADD_TO_CART_CSS);
  if (!el) {
    el = $x(SELECTORS.ADD_TO_CART_XPATH);
  }
  if (!el) return false;

  // REMOVED: Glitch detection code
  
  humanLikeClick(el);
  return true;
}
```

⚠️ **Warning:** Disabling glitch detection may cause unintended subscription purchases.

### Modify Warning Appearance

Change the warning message styling in [`displayGlitchWarning()`](../src/pages/game-page.js:71):

```javascript
Object.assign(warningMessage.style, {
  color: 'orange',              // Different color
  fontSize: '20px',             // Larger text
  backgroundColor: '#fff3e0',   // Orange-tinted background
  border: '3px solid orange',
});
```

## Error Handling

The game page handler handles failures gracefully:

1. **Subscription button not found** - Returns `false`, logs error, shows failure overlay
2. **Button doesn't become enabled** - Continues anyway (button may already be ready)
3. **Add to Cart button not found** - Returns `false`, logs error, shows failure overlay
4. **Glitch detected** - Returns `false`, shows persistent warning, does NOT click button
5. **Any exception** - Caught by main.js, displayed in error overlay

## Console Logging

All actions are logged with the `[KingsDrop]` prefix:

```
[KingsDrop] Initializing game page handler...
[KingsDrop] clickSubscriptionPrice: clicked subscription price option
[KingsDrop] selectKinguinPassAndAddToCart: waiting for element to be enabled
[KingsDrop] clickAddToCart: clicked Add to Cart button
[KingsDrop] selectKinguinPassAndAddToCart: completed successfully
```

Or when glitch is detected:

```
[KingsDrop] clickAddToCart: GLITCH DETECTED - Button shows "SUBSCRIBE AND ADD TO CART"
[KingsDrop] selectKinguinPassAndAddToCart: failed to click Add to Cart button
```

## Related Documentation

- [Overview](./OVERVIEW.md) - General project overview
- [Checkout](./CHECKOUT.md) - Checkout page automation
- [Dashboard](./DASHBOARD.md) - Dashboard automation