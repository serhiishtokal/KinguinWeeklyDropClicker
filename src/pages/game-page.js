/**
 * Game Page Handler
 * Automates KinguinPass selection and Add to Cart functionality
 */

import { $, $x, waitForElement, log } from '../utils/dom.js';
import { humanLikeClick, humanDelay, sleep } from '../utils/simulation.js';
import { highlightElement, injectStyles, createOverlay } from '../utils/styles.js';

/**
 * Selectors for game page elements
 */
const SELECTORS = {
  KINGUIN_PASS_PRICE_XPATH: '//*[@id="main-offer-wrapper"]/div[1]/button',
  ADD_TO_CART_XPATH: '//*[@id="main-offer-wrapper"]/div[2]/div/div/div/button',
  ADD_TO_CART_CSS: 'button[data-cy="standardCheckout"]',
};

/**
 * Glitch warning animation CSS
 */
const GLITCH_WARNING_CSS = `
  @keyframes kinguin-glitch-blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.5; }
  }
`;

/**
 * Wait for element to be enabled (not disabled)
 * Uses XPath to find the element
 * @param {string} xpath - XPath expression
 * @param {number} timeout - Max wait time in ms
 * @param {number} interval - Poll interval in ms
 * @returns {Promise<Element|null>}
 */
async function waitForXPathElementEnabled(xpath, timeout = 5000, interval = 50) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = $x(xpath);
    // Check if element exists, is visible, and is not disabled
    if (el && el.offsetParent !== null && !el.disabled && !el.classList.contains('disabled')) {
      return el;
    }
    await sleep(interval);
  }
  return null;
}

/**
 * Click the KinguinPass price option
 * @returns {Promise<boolean>} Success status
 */
async function clickKinguinPassPrice() {
  const el = $x(SELECTORS.KINGUIN_PASS_PRICE_XPATH);
  if (!el) {
    log('clickKinguinPassPrice: KinguinPass price option not found', SELECTORS.KINGUIN_PASS_PRICE_XPATH);
    return false;
  }

  humanLikeClick(el);
  log('clickKinguinPassPrice: clicked KinguinPass price option');
  return true;
}

/**
 * Display glitch warning on the page
 * @param {Element} button - The button element
 * @param {Element} parentContainer - Parent container for warning message
 */
function displayGlitchWarning(button, parentContainer) {
  // Highlight the button with red border to make error visible
  Object.assign(button.style, {
    border: '3px solid red',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    boxShadow: '0 0 10px red',
  });

  // Create warning message
  const warningMessage = document.createElement('div');
  warningMessage.textContent = 'refresh the page!!!';
  warningMessage.id = 'kinguin-glitch-warning';
  Object.assign(warningMessage.style, {
    color: 'red',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#ffeeee',
    border: '2px solid red',
    borderRadius: '4px',
    textAlign: 'center',
    animation: 'kinguin-glitch-blink 1s infinite',
  });

  // Inject glitch warning animation
  injectStyles(GLITCH_WARNING_CSS, 'kinguin-glitch-style');

  // Insert warning after the button or its parent container
  if (parentContainer) {
    parentContainer.insertAdjacentElement('afterend', warningMessage);
  } else {
    button.insertAdjacentElement('afterend', warningMessage);
  }
}

/**
 * Click the Add to Cart button
 * Includes glitch detection for "SUBSCRIBE AND ADD TO CART" text
 * @returns {Promise<boolean>} Success status
 */
async function clickAddToCart() {
  // Try CSS selector with data-cy attribute first (more reliable)
  let el = $(SELECTORS.ADD_TO_CART_CSS);

  // Fallback to XPath if CSS selector doesn't find it
  if (!el) {
    el = $x(SELECTORS.ADD_TO_CART_XPATH);
  }

  if (!el) {
    log('clickAddToCart: Add to Cart button not found', {
      selector: SELECTORS.ADD_TO_CART_CSS,
      xpath: SELECTORS.ADD_TO_CART_XPATH,
    });
    return false;
  }

  // Glitch detection: Check if button shows "SUBSCRIBE AND ADD TO CART"
  const buttonText = el.textContent || el.innerText || '';
  if (buttonText.toUpperCase().includes('SUBSCRIBE AND ADD TO CART')) {
    log('clickAddToCart: GLITCH DETECTED - Button shows "SUBSCRIBE AND ADD TO CART"');

    // Display visual warning
    const parentContainer = el.closest('div') || el.parentElement;
    displayGlitchWarning(el, parentContainer);

    // Show overlay warning
    createOverlay('⚠️ GLITCH DETECTED - Refresh the page!', {
      backgroundColor: 'rgba(244, 67, 54, 0.95)',
      autoRemove: 0, // Don't auto-remove - keep visible
    });

    // Abort - do NOT click the button
    return false;
  }

  humanLikeClick(el);
  log('clickAddToCart: clicked Add to Cart button');
  return true;
}

/**
 * Main game page flow: Select KinguinPass price and add to cart
 * @param {Object} options - Configuration options
 * @param {number} options.waitTimeout - Max time to wait for element to be enabled
 * @param {number} options.pollInterval - How often to check if element is enabled
 * @param {Object} options.betweenClicksDelay - Min/max delay between clicks
 * @returns {Promise<boolean>} Success status
 */
async function selectKinguinPassAndAddToCart(options = {}) {
  const {
    waitTimeout = 2000,
    pollInterval = 50,
    betweenClicksDelay = { min: 100, max: 400 },
  } = options;

  // 1) Click the KinguinPass price option
  const kinguinPassClicked = await clickKinguinPassPrice();
  if (!kinguinPassClicked) {
    log('selectKinguinPassAndAddToCart: failed to click KinguinPass price option');
    return false;
  }

  // 2) Wait for the KinguinPass price option to be fully enabled/processed
  log('selectKinguinPassAndAddToCart: waiting for element to be enabled');
  const enabledEl = await waitForXPathElementEnabled(
    SELECTORS.KINGUIN_PASS_PRICE_XPATH,
    waitTimeout,
    pollInterval
  );
  if (!enabledEl) {
    log('selectKinguinPassAndAddToCart: KinguinPass price option did not become enabled', {
      xpath: SELECTORS.KINGUIN_PASS_PRICE_XPATH,
      timeout: waitTimeout,
    });
    // Continue anyway, as the button might already be ready
  }

  // 3) Human-like delay between clicking price option and add to cart
  await humanDelay(betweenClicksDelay.min, betweenClicksDelay.max);

  // 4) Click the Add to Cart button
  const addToCartClicked = await clickAddToCart();
  if (!addToCartClicked) {
    log('selectKinguinPassAndAddToCart: failed to click Add to Cart button');
    return false;
  }

  log('selectKinguinPassAndAddToCart: completed successfully');
  return true;
}

/**
 * Initialize game page handler
 * Main entry point called by the router
 */
export async function initGamePage() {
  log('Initializing game page handler...');

  createOverlay('KinguinClicker: Game Page - Automating...', {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    autoRemove: 2000,
  });

  // Wait a bit for page to stabilize
  await sleep(500);

  // Execute the main flow
  const success = await selectKinguinPassAndAddToCart();

  if (success) {
    createOverlay('KinguinClicker: Added to Cart!', {
      backgroundColor: 'rgba(76, 175, 80, 0.9)',
      autoRemove: 3000,
    });
  } else {
    // Only show error if not a glitch (glitch shows its own warning)
    const glitchWarning = document.getElementById('kinguin-glitch-warning');
    if (!glitchWarning) {
      createOverlay('KinguinClicker: Could not complete game page automation', {
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
        autoRemove: 5000,
      });
    }
  }

  return success;
}