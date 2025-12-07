/**
 * Kinguin Kings Drop - Main Entry Point
 * Detects current page and initializes appropriate handler
 */

import { detectPageType, PageType, getRouteDescription } from './config/routes.js';
import { log } from './utils/dom.js';
import { createOverlay } from './utils/styles.js';

// Page handler imports
import { initCheckoutPage } from './pages/checkout.js';
import { initGamePage } from './pages/game-page.js';
import { initDashboardPage } from './pages/dashboard.js';

/**
 * Route handlers mapped to page types
 */
const PAGE_HANDLERS = {
  [PageType.CHECKOUT]: initCheckoutPage,
  [PageType.GAME_PAGE]: initGamePage,
  [PageType.DASHBOARD]: initDashboardPage,
};

/**
 * Main initialization function
 * Called when script loads on any matched page
 */
function init() {
  const url = window.location.href;
  const pageType = detectPageType(url);
  const routeDescription = getRouteDescription(url);
  
  log(`Page detected: ${pageType} (${routeDescription})`);
  log(`URL: ${url}`);
  
  const handler = PAGE_HANDLERS[pageType];
  
  if (handler) {
    log(`Initializing ${pageType} handler...`);
    try {
      handler();
      log(`${pageType} handler initialized successfully`);
    } catch (error) {
      log(`Error initializing ${pageType} handler:`, error);
      createOverlay(`Error: ${error.message}`, { 
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
        autoRemove: 5000 
      });
    }
  } else {
    log(`No handler registered for page type: ${pageType}`);
    // Show status overlay only on known pages without handlers yet
    if (pageType !== PageType.UNKNOWN) {
      createOverlay(`KingsDrop: ${routeDescription} (handler pending)`, {
        backgroundColor: 'rgba(33, 150, 243, 0.9)',
        autoRemove: 3000
      });
    }
  }
}

/**
 * Initialize when DOM is ready
 */
function bootstrap() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already ready
    init();
  }
}

// Start the application
log('Script loaded, bootstrapping...');
bootstrap();