/**
 * Dashboard Subscription Page Handler
 * Automates scrolling to subscription and clicking Get Now
 */

import { waitForXPath, $$, scrollToElement, log } from '../utils/dom.js';
import { humanLikeClick, sleep, humanDelay } from '../utils/simulation.js';
import { createOverlay } from '../utils/styles.js';

/**
 * Selectors for dashboard page elements
 */
const SELECTORS = {
  SUBSCRIPTION_SECTION_XPATH: '//*[@id="c-page__content"]/div/div[2]/div/div/div/div[1]/section',
};

/**
 * Scroll to the subscription section using XPath
 * @returns {Promise<Element|null>} The section element or null if not found
 */
async function scrollToSubscriptionSection() {
  const xpath = SELECTORS.SUBSCRIPTION_SECTION_XPATH;
  
  log('scrollToSubscriptionSection: waiting for element...', xpath);
  const el = await waitForXPath(xpath, { timeout: 10000, pollInterval: 200 });

  if (!el) {
    log('scrollToSubscriptionSection: element not found after timeout', xpath);
    return null;
  }

  // Use fast scroll behavior for quicker navigation
  el.scrollIntoView({ behavior: 'auto', block: 'center' });
  log('Scrolled to subscription section');
  
  return el;
}

/**
 * Click the "Get Now" button within the subscription section
 * @param {Element} sectionElement - The subscription section element
 * @returns {Promise<boolean>} Success status
 */
async function clickGetNowButton(sectionElement) {
  if (!sectionElement) {
    log('clickGetNowButton: section element is null');
    return false;
  }

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

  if (!getButton) {
    log('clickGetNowButton: "Get Now" button not found in section');
    return false;
  }

  log('Found "Get Now" button');
  
  // Use human-like click for natural interaction
  humanLikeClick(getButton);
  log('Clicked "Get Now" button successfully');
  
  return true;
}

/**
 * Main dashboard flow: Scroll to subscription and click Get Now
 * @returns {Promise<boolean>} Success status
 */
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

/**
 * Initialize dashboard page handler
 * Main entry point called by the router
 */
export async function initDashboardPage() {
  log('Initializing dashboard page handler...');

  createOverlay('KinguinClicker: Dashboard - Automating...', {
    position: 'top-left',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    autoRemove: 2000,
  });

  // Wait a bit for page to stabilize
  await sleep(500);

  // Execute the main flow
  const success = await scrollAndClickGetNow();

  if (success) {
    createOverlay('KinguinClicker: Subscription Activated!', {
      position: 'top-left',
      backgroundColor: 'rgba(76, 175, 80, 0.9)',
      autoRemove: 3000,
    });
  } else {
    createOverlay('KinguinClicker: Could not find subscription elements', {
      position: 'top-left',
      backgroundColor: 'rgba(244, 67, 54, 0.9)',
      autoRemove: 5000,
    });
  }

  return success;
}