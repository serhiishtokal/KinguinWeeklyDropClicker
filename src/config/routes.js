/**
 * Route configuration for Kinguin King's Drop pages
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
 *
 * Actual Kinguin URLs:
 * - Checkout: https://www.kinguin.net/new-checkout/review
 * - Game Page: https://www.kinguin.net/category/[id]/[name]
 * - Dashboard: https://www.kinguin.net/app/dashboard/subscription
 */
const ROUTE_PATTERNS = [
  {
    type: PageType.CHECKOUT,
    pattern: /^https?:\/\/(www\.)?kinguin\.net\/new-checkout\/review/i,
    description: 'Checkout review page',
  },
  {
    type: PageType.DASHBOARD,
    pattern: /^https?:\/\/(www\.)?kinguin\.net\/app\/dashboard\/subscription/i,
    description: 'Dashboard subscription page',
  },
  {
    type: PageType.GAME_PAGE,
    pattern: /^https?:\/\/(www\.)?kinguin\.net\/category\/\d+\/.+/i,
    description: 'Game product page',
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