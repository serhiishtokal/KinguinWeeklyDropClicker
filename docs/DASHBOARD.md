# Dashboard Page Documentation

## Purpose and Use Case

The dashboard page handler automates the subscription initiation process on the Kinguin dashboard. It scrolls to the subscription section and clicks the "Get Now" button to start the KinguinPass subscription workflow.

**URL Pattern:** `https://kinguin.net/dashboard/subscriptions*`

**Source File:** [`src/pages/dashboard.js`](../src/pages/dashboard.js)

## What It Does

1. **Scrolls to the subscription section** using XPath navigation
2. **Finds the "Get Now" button** within the subscription section
3. **Clicks the button** with human-like interaction to initiate the subscription

## Step-by-Step Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  1. Page Load Detection                                          │
│     └── URL matches: kinguin.net/dashboard/subscriptions*        │
├──────────────────────────────────────────────────────────────────┤
│  2. initDashboardPage() called                                   │
│     └── Shows overlay: "KinguinClicker: Dashboard - Automating..."│
├──────────────────────────────────────────────────────────────────┤
│  3. Wait 500ms for page stabilization                            │
├──────────────────────────────────────────────────────────────────┤
│  4. scrollAndClickGetNow() execution                             │
│     ├── a. Find subscription section (via XPath)                 │
│     ├── b. Scroll section to center of viewport                  │
│     ├── c. Human-like delay (200-400ms)                          │
│     ├── d. Find "Get Now" button within section                  │
│     └── e. Click button with human-like interaction              │
├──────────────────────────────────────────────────────────────────┤
│  5. Display result overlay                                       │
│     ├── Success: "KinguinClicker: Subscription Activated!"       │
│     └── Failure: "KinguinClicker: Could not find subscription..."|
└──────────────────────────────────────────────────────────────────┘
```

## XPath Selectors Used

| Element | XPath |
|---------|-------|
| Subscription Section | `//*[@id="c-page__content"]/div/div[2]/div/div/div/div[1]/section` |

### Selector Definition

```javascript
const SELECTORS = {
  SUBSCRIPTION_SECTION_XPATH: '//*[@id="c-page__content"]/div/div[2]/div/div/div/div[1]/section',
};
```

**Location:** [`dashboard.js:13-15`](../src/pages/dashboard.js:13)

### Why XPath?

XPath is used because:
1. The subscription section doesn't have a unique CSS ID or class
2. The DOM structure requires navigating through multiple nested divs
3. XPath provides precise element targeting in complex layouts

## Button Finding Strategy

Instead of using a direct selector for the "Get Now" button, the script:

1. First locates the subscription section container
2. Queries all buttons within that section
3. Filters buttons by text content matching "Get Now"

```javascript
async function clickGetNowButton(sectionElement) {
  // Find all buttons within the section
  const buttons = $$('button', sectionElement);
  let getButton = null;

  // Search for button with "Get Now" text
  for (const button of buttons) {
    if (button.textContent && button.textContent.includes('Get Now')) {
      getButton = button;
      break;
    }
  }
  
  // ...
}
```

**Location:** [`dashboard.js:42-63`](../src/pages/dashboard.js:42)

This approach is more resilient to DOM changes because:
- Button class names or attributes may change
- The text "Get Now" is less likely to change
- Searching within the section scope avoids false matches

## Scroll Behavior

The script uses instant scrolling (not smooth animation) for faster navigation:

```javascript
el.scrollIntoView({ behavior: 'auto', block: 'center' });
```

**Location:** [`dashboard.js:31`](../src/pages/dashboard.js:31)

### Scroll Options

| Option | Value | Description |
|--------|-------|-------------|
| `behavior` | `'auto'` | Instant scroll (not animated) |
| `block` | `'center'` | Position element in vertical center |

### Why Fast Scrolling?

- **Efficiency**: Reduces overall automation time
- **Reliability**: No need to wait for scroll animation to complete
- **Consistency**: Same behavior across different viewport sizes

## Key Functions

### `initDashboardPage()`

The main entry point called by the router.

```javascript
export async function initDashboardPage() {
  log('Initializing dashboard page handler...');

  createOverlay('KinguinClicker: Dashboard - Automating...', {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    autoRemove: 2000,
  });

  await sleep(500);
  const success = await scrollAndClickGetNow();

  // Display success/failure overlay...
}
```

**Location:** [`dashboard.js:104-131`](../src/pages/dashboard.js:104)

### `scrollToSubscriptionSection()`

Finds and scrolls to the subscription section.

```javascript
async function scrollToSubscriptionSection() {
  const xpath = SELECTORS.SUBSCRIPTION_SECTION_XPATH;
  const el = $x(xpath);

  if (!el) {
    log('scrollToSubscriptionSection: element not found', xpath);
    return null;
  }

  el.scrollIntoView({ behavior: 'auto', block: 'center' });
  log('Scrolled to subscription section');
  
  return el;
}
```

**Location:** [`dashboard.js:21-35`](../src/pages/dashboard.js:21)

### `clickGetNowButton(sectionElement)`

Finds and clicks the "Get Now" button within the subscription section.

```javascript
async function clickGetNowButton(sectionElement) {
  if (!sectionElement) {
    log('clickGetNowButton: section element is null');
    return false;
  }

  const buttons = $$('button', sectionElement);
  let getButton = null;

  for (const button of buttons) {
    if (button.textContent && button.textContent.includes('Get Now')) {
      getButton = button;
      break;
    }
  }

  if (!getButton) {
    log('clickGetNowButton: "Get Now" button not found in section');
    return false;
  }

  humanLikeClick(getButton);
  log('Clicked "Get Now" button successfully');
  
  return true;
}
```

**Location:** [`dashboard.js:42-72`](../src/pages/dashboard.js:42)

### `scrollAndClickGetNow()`

Main flow that combines scrolling and clicking.

```javascript
async function scrollAndClickGetNow() {
  // 1) Scroll to subscription section
  const section = await scrollToSubscriptionSection();
  if (!section) {
    log('scrollAndClickGetNow: failed to find subscription section');
    return false;
  }

  // 2) Small delay to let scroll complete
  await humanDelay(200, 400);

  // 3) Click the Get Now button
  const clicked = await clickGetNowButton(section);
  if (!clicked) {
    log('scrollAndClickGetNow: failed to click Get Now button');
    return false;
  }

  log('scrollAndClickGetNow: completed successfully');
  return true;
}
```

**Location:** [`dashboard.js:78-98`](../src/pages/dashboard.js:78)

## Visual Feedback

### Status Overlays

| State | Message | Color | Duration |
|-------|---------|-------|----------|
| Starting | "KinguinClicker: Dashboard - Automating..." | Green | 2000ms |
| Success | "KinguinClicker: Subscription Activated!" | Green | 3000ms |
| Failure | "KinguinClicker: Could not find subscription elements" | Red | 5000ms |

## Code Examples for Customization

### Change Scroll Behavior to Smooth

Modify [`scrollToSubscriptionSection()`](../src/pages/dashboard.js:31):

```javascript
el.scrollIntoView({ behavior: 'smooth', block: 'center' });
```

Note: You may need to add a delay after scrolling to wait for the animation.

### Adjust Post-Scroll Delay

Modify the delay in [`scrollAndClickGetNow()`](../src/pages/dashboard.js:87):

```javascript
// Wait longer for scroll to settle
await humanDelay(500, 800);
```

### Change Button Search Text

To search for a different button text, modify the search in [`clickGetNowButton()`](../src/pages/dashboard.js:53):

```javascript
// Search for different button text
if (button.textContent && button.textContent.includes('Subscribe Now')) {
  getButton = button;
  break;
}
```

### Add Multiple Button Support

To click multiple buttons sequentially:

```javascript
async function clickAllSubscriptionButtons(sectionElement) {
  const buttons = $$('button', sectionElement);
  let clickedCount = 0;
  
  for (const button of buttons) {
    if (button.textContent && button.textContent.includes('Get Now')) {
      humanLikeClick(button);
      await humanDelay(100, 200);
      clickedCount++;
    }
  }
  
  return clickedCount > 0;
}
```

## Error Handling

The dashboard handler handles failures gracefully:

1. **Subscription section not found** - Returns `false`, logs error, shows failure overlay
2. **"Get Now" button not found** - Returns `false`, logs error, shows failure overlay
3. **Any exception** - Caught by main.js, displayed in error overlay

## Console Logging

All actions are logged with the `[KinguinClicker]` prefix:

```
[KinguinClicker] Initializing dashboard page handler...
[KinguinClicker] Scrolled to subscription section
[KinguinClicker] Found "Get Now" button
[KinguinClicker] Clicked "Get Now" button successfully
[KinguinClicker] scrollAndClickGetNow: completed successfully
```

Or on failure:

```
[KinguinClicker] scrollToSubscriptionSection: element not found //*[@id="c-page__content"]/div/div[2]/div/div/div/div[1]/section
[KinguinClicker] scrollAndClickGetNow: failed to find subscription section
```

## Integration with Other Pages

After clicking "Get Now" on the dashboard:

1. **User is redirected** to a game page or product selection
2. **Game page handler** takes over to select KinguinPass pricing
3. **Checkout handler** completes the process

See [Overview](./OVERVIEW.md) for the complete workflow diagram.

## Related Documentation

- [Overview](./OVERVIEW.md) - General project overview
- [Checkout](./CHECKOUT.md) - Checkout page automation
- [Game Page](./GAME-PAGE.md) - Game page automation