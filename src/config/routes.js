/**
 * Route configuration for Kinguin pages
 */

/**
 * Page type enumeration
 */
export const PageType = {
  CHECKOUT: 'checkout',
  GAME_PAGE: 'game-page',
  DASHBOARD: 'dashboard',
  UNKNOWN: 'unknown',
};

/**
 * URL patterns for each page type
 * Order matters - first match wins
 */
const ROUTE_PATTERNS = [
  {
    type: PageType.CHECKOUT,
    pattern: /^https?:\/\/(www\.)?kinguin\.net\/checkout/i,
    description: 'Checkout page',
  },
  {
    type: PageType.DASHBOARD,
    pattern: /^https?:\/\/(www\.)?kinguin\.net\/dashboard\/subscriptions/i,
    description: 'Dashboard subscriptions page',
  },
  {
    type: PageType.GAME_PAGE,
    pattern: /^https?:\/\/(www\.)?kinguin\.net\/category\/.*\/product\//i,
    description: 'Individual game/product page',
  },
  {
    type: PageType.GAME_PAGE,
    pattern: /^https?:\/\/(www\.)?kinguin\.net\/category\//i,
    description: 'Category/game listing page',
  },
];

/**
 * Detect page type from URL
 * @param {string} url - Current page URL
 * @returns {string} PageType enum value
 */
export function detectPageType(url) {
  for (const route of ROUTE_PATTERNS) {
    if (route.pattern.test(url)) {
      return route.type;
    }
  }
  return PageType.UNKNOWN;
}

/**
 * Check if current page matches a specific type
 * @param {string} pageType - PageType to check
 * @returns {boolean}
 */
export function isPageType(pageType) {
  return detectPageType(window.location.href) === pageType;
}

/**
 * Get route description for a URL
 * @param {string} url - URL to check
 * @returns {string} Route description or 'Unknown page'
 */
export function getRouteDescription(url) {
  for (const route of ROUTE_PATTERNS) {
    if (route.pattern.test(url)) {
      return route.description;
    }
  }
  return 'Unknown page';
}