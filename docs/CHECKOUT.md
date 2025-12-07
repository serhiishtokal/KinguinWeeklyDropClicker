# Checkout Page Documentation

## Purpose and Use Case

The checkout page handler automates the final step of the King's Drop purchase workflow. It fills in the Kinguin balance input field and highlights the Pay button for easy manual confirmation.

**URL Pattern:** `https://www.kinguin.net/new-checkout/review*`

**Source File:** [`src/pages/checkout.js`](../src/pages/checkout.js)

## What It Does

1. **Sets the balance value** to `999` (maximum) in the Kinguin balance input field
2. **Waits** for the Pay button to appear
3. **Highlights** the Pay button with a highly visible pulsing animation
4. **Does NOT auto-click** the Pay button (safety feature)

## Step-by-Step Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  1. Page Load Detection                                          │
│     └── URL matches: kinguin.net/checkout*                       │
├──────────────────────────────────────────────────────────────────┤
│  2. initCheckoutPage() called                                    │
│     └── Shows overlay: "KinguinClicker: Checkout - Automating..."│
├──────────────────────────────────────────────────────────────────┤
│  3. Wait 500ms for page stabilization                            │
├──────────────────────────────────────────────────────────────────┤
│  4. setAndPay() execution                                        │
│     ├── a. Find balance input field                              │
│     ├── b. Click input (human-like)                              │
│     ├── c. Clear existing value                                  │
│     ├── d. Type "999" with human-like delays                     │
│     ├── e. Dispatch change event                                 │
│     ├── f. Wait 1000ms for UI update                             │
│     ├── g. Wait for Pay button (timeout: 5000ms)                 │
│     └── h. Highlight Pay button                                  │
├──────────────────────────────────────────────────────────────────┤
│  5. Display result overlay                                       │
│     ├── Success: "KinguinClicker: Ready to Pay!"                 │
│     └── Failure: "KinguinClicker: Could not find checkout..."    │
└──────────────────────────────────────────────────────────────────┘
```

## CSS Selectors Used

| Element | Selector | Type |
|---------|----------|------|
| Balance Input | `#kinguin-balance-value` | CSS ID |
| Pay Button | `#kps__pay-btn` | CSS ID |

### Selector Definitions

```javascript
const SELECTORS = {
  BALANCE_INPUT: '#kinguin-balance-value',
  PAY_BUTTON: '#kps__pay-btn',
};
```

**Location:** [`checkout.js:13-16`](../src/pages/checkout.js:13)

## Configuration Options

The [`setAndPay()`](../src/pages/checkout.js:133) function accepts configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | string | `'999'` | Balance value to fill in |
| `preDelay` | number | `1000` | Delay in ms before waiting for button |
| `timeout` | number | `5000` | Max time in ms to wait for Pay button |
| `shouldClick` | boolean | `false` | Whether to auto-click the Pay button |

### Default Configuration

```javascript
const {
  preDelay = 1000,
  timeout = 5000,
  shouldClick = false, // Default to false - just highlight
} = options;
```

**Location:** [`checkout.js:135-138`](../src/pages/checkout.js:135)

## Visual Feedback

### Status Overlays

The checkout page displays floating status messages:

| State | Message | Color | Duration |
|-------|---------|-------|----------|
| Starting | "KingsDrop: Checkout - Automating..." | Green | 2000ms |
| Success | "KingsDrop: Ready to Pay!" | Green | 3000ms |
| Failure | "KingsDrop: Could not find checkout elements" | Red | 5000ms |

### Pay Button Highlight Animation

When the Pay button is found, it receives a **highly visible pulsing animation**:

```css
@keyframes kinguin-pay-pulse {
  0%, 100% {
    box-shadow: 0 0 15px 5px rgba(255, 0, 0, 0.7),
                0 0 30px 10px rgba(255, 255, 0, 0.5),
                inset 0 0 10px rgba(255, 255, 0, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 25px 10px rgba(255, 0, 0, 0.9),
                0 0 50px 20px rgba(255, 255, 0, 0.7),
                inset 0 0 20px rgba(255, 255, 0, 0.5);
    transform: scale(1.02);
  }
}
```

**Location:** [`checkout.js:22-37`](../src/pages/checkout.js:22)

### Button Styling

The highlighted Pay button receives these inline styles:

```javascript
{
  backgroundColor: '#ff3333',
  background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 50%, #ff4444 100%)',
  border: '4px solid #ffff00',
  borderRadius: '8px',
  outline: '3px solid #ff0000',
  outlineOffset: '2px',
  color: 'white',
  fontWeight: 'bold',
  textShadow: '0 0 5px #000, 0 0 10px #ff0',
  animation: 'kinguin-pay-pulse 1s ease-in-out infinite',
  zIndex: '9999',
}
```

**Location:** [`checkout.js:104-118`](../src/pages/checkout.js:104)

## Key Functions

### `initCheckoutPage()`

The main entry point called by the router.

```javascript
export async function initCheckoutPage() {
  log('Initializing checkout page handler...');
  
  createOverlay('KingsDrop: Checkout - Automating...', {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    autoRemove: 2000,
  });

  await sleep(500);
  const success = await setAndPay('999', { shouldClick: false });
  
  // Display success/failure overlay...
}
```

**Location:** [`checkout.js:169-196`](../src/pages/checkout.js:169)

### `setMaxValueForKinguinBalance(value)`

Fills the balance input with human-like typing.

```javascript
async function setMaxValueForKinguinBalance(value = '999') {
  const input = $(SELECTORS.BALANCE_INPUT);
  if (!input) return false;

  humanLikeClick(input);
  await humanDelay(50, 100);

  input.setSelectionRange(0, input.value.length);
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await humanDelay(50, 100);

  const typed = await humanLikeType(input, value, 25, 75);
  
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.blur();

  return typed;
}
```

**Location:** [`checkout.js:44-70`](../src/pages/checkout.js:44)

### `highlightPayButton()`

Applies the pulsing highlight effect to the Pay button.

**Location:** [`checkout.js:93-122`](../src/pages/checkout.js:93)

## Code Examples for Customization

### Change the Default Balance Value

To use a different balance value, modify the call in [`initCheckoutPage()`](../src/pages/checkout.js:181):

```javascript
// Change from '999' to your preferred value
const success = await setAndPay('100', { shouldClick: false });
```

### Enable Auto-Click (Not Recommended)

To enable automatic clicking of the Pay button (use with caution):

```javascript
const success = await setAndPay('999', { shouldClick: true });
```

⚠️ **Warning:** Auto-clicking the Pay button bypasses manual confirmation. Use at your own risk.

### Change Highlight Colors

Modify the [`PAY_BUTTON_PULSE_CSS`](../src/pages/checkout.js:22) constant:

```javascript
const PAY_BUTTON_PULSE_CSS = `
  @keyframes kinguin-pay-pulse {
    0%, 100% {
      box-shadow: 0 0 15px 5px rgba(0, 255, 0, 0.7), /* Green glow */
                  0 0 30px 10px rgba(0, 255, 0, 0.5);
    }
    50% {
      box-shadow: 0 0 25px 10px rgba(0, 255, 0, 0.9),
                  0 0 50px 20px rgba(0, 255, 0, 0.7);
    }
  }
`;
```

### Adjust Timing

Modify the delays in [`setAndPay()`](../src/pages/checkout.js:133):

```javascript
const success = await setAndPay('999', {
  preDelay: 2000,  // Wait 2 seconds before looking for Pay button
  timeout: 10000,  // Wait up to 10 seconds for Pay button
});
```

## Error Handling

The checkout handler gracefully handles failures:

1. **Balance input not found** - Returns `false`, logs error, shows failure overlay
2. **Pay button not found** - Returns `false`, logs timeout, shows failure overlay
3. **Any exception** - Caught by main.js, displayed in error overlay

## Console Logging

All actions are logged with the `[KingsDrop]` prefix:

```
[KingsDrop] Initializing checkout page handler...
[KingsDrop] setMaxValueForKinguinBalance: set value to 999
[KingsDrop] Pay button highlighted with enhanced visibility
```

## Related Documentation

- [Overview](./OVERVIEW.md) - General project overview
- [Game Page](./GAME-PAGE.md) - Game page automation
- [Dashboard](./DASHBOARD.md) - Dashboard automation