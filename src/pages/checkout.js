/**
 * Checkout Page Handler
 * Automates balance input and highlights pay button
 */

import { waitForElement, log } from '../utils/dom.js';
import { humanLikeClick, humanLikeType, humanDelay, sleep } from '../utils/simulation.js';
import { highlightElement, injectStyles, createOverlay } from '../utils/styles.js';

/**
 * Selectors for checkout page elements
 */
const SELECTORS = {
  BALANCE_INPUT: '#kinguin-balance-value',
  PAY_BUTTON: '#kps__pay-btn',
};

/**
 * Enhanced pulse animation for pay button
 * Creates a highly visible pulsing effect
 */
const PAY_BUTTON_PULSE_CSS = `
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
`;

/**
 * Set max value for Kinguin balance input with human-like typing
 * @param {string} value - The value to input (default: '999')
 * @returns {Promise<boolean>} Success status
 */
async function setMaxValueForKinguinBalance(value = '999') {
  const input = await waitForElement(SELECTORS.BALANCE_INPUT, { timeout: 5000 });
  if (!input) {
    log('setMaxValueForKinguinBalance: input not found', SELECTORS.BALANCE_INPUT);
    return false;
  }

  // Focus on the input with a human-like click approach
  humanLikeClick(input);
  await humanDelay(50, 100);

  // Clear the field first
  input.setSelectionRange(0, input.value.length);
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await humanDelay(50, 100);

  // Type the value with human-like delays
  const typed = await humanLikeType(input, value, 25, 75);
  
  // Blur to trigger change
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.blur();

  log(`setMaxValueForKinguinBalance: set value to ${value}`);
  return typed;
}

/**
 * Click the pay button with human-like interaction
 * @returns {Promise<boolean>} Success status
 */
async function clickPayButton() {
  const button = await waitForElement(SELECTORS.PAY_BUTTON, { timeout: 5000 });
  if (!button) {
    log('clickPayButton: pay button not found', SELECTORS.PAY_BUTTON);
    return false;
  }

  humanLikeClick(button);
  log('clickPayButton: clicked pay button');
  return true;
}

/**
 * Highlight the pay button with enhanced visibility
 * Creates a highly visible pulsing red/yellow effect
 * @returns {Promise<boolean>} Success status
 */
async function highlightPayButton() {
  const button = await waitForElement(SELECTORS.PAY_BUTTON, { timeout: 5000 });
  if (!button) {
    log('highlightPayButton: pay button not found', SELECTORS.PAY_BUTTON);
    return false;
  }

  // Inject enhanced pulse animation
  injectStyles(PAY_BUTTON_PULSE_CSS, 'kinguin-pay-pulse-animation');

  // Apply highly visible highlighting styles
  Object.assign(button.style, {
    transition: 'all 0.3s ease',
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
    position: 'relative',
    zIndex: '9999',
  });

  log('Pay button highlighted with enhanced visibility');
  return true;
}

/**
 * Main checkout flow: Set balance and optionally click or highlight pay button
 * @param {string} value - Balance value to set (default: '999')
 * @param {Object} options - Configuration options
 * @param {number} options.preDelay - Delay before waiting for button (default: 1000)
 * @param {number} options.timeout - Max time to wait for button (default: 5000)
 * @param {boolean} options.shouldClick - Whether to click (true) or highlight (false) the button
 * @returns {Promise<boolean>} Success status
 */
async function setAndPay(value = '999', options = {}) {
  const {
    preDelay = 1000,
    timeout = 5000,
    shouldClick = false, // Default to false - just highlight
  } = options;

  // 1) Set the balance value
  const balanceSet = await setMaxValueForKinguinBalance(String(value));
  if (!balanceSet) {
    log('setAndPay: failed to set balance value');
    return false;
  }

  // 2) Short pre-delay to let the UI update
  await sleep(preDelay);

  // 3) Wait for the pay button to appear
  const button = await waitForElement(SELECTORS.PAY_BUTTON, { timeout });
  if (!button) {
    log('setAndPay: pay button did not appear', { timeout });
    return false;
  }

  // 4) Action: Click or Highlight
  if (shouldClick) {
    return await clickPayButton();
  } else {
    return highlightPayButton();
  }
}

/**
 * Initialize checkout page handler
 * Main entry point called by the router
 */
export async function initCheckoutPage() {
  log('Initializing checkout page handler...');
  
  createOverlay('KinguinClicker: Checkout - Automating...', {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    autoRemove: 2000,
  });

  // Wait a bit for page to stabilize
  await sleep(500);

  // Execute the main flow
  const success = await setAndPay('999', { shouldClick: false });
  
  if (success) {
    createOverlay('KinguinClicker: Ready to Pay!', {
      backgroundColor: 'rgba(76, 175, 80, 0.9)',
      autoRemove: 3000,
    });
  } else {
    createOverlay('KinguinClicker: Could not find checkout elements', {
      backgroundColor: 'rgba(244, 67, 54, 0.9)',
      autoRemove: 5000,
    });
  }

  return success;
}