/**
 * DOM utilities and helpers
 */

const DEBUG = true;

/**
 * Conditional logging with script prefix
 * @param  {...any} args - Arguments to log
 */
export function log(...args) {
  if (DEBUG) {
    console.log('[KingsDrop]', ...args);
  }
}

/**
 * Query single element (CSS selector)
 * @param {string} selector - CSS selector
 * @param {Element|Document} parent - Parent element context
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Query multiple elements (CSS selector)
 * @param {string} selector - CSS selector
 * @param {Element|Document} parent - Parent element context
 * @returns {Element[]}
 */
export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Query element by XPath
 * @param {string} xpath - XPath expression
 * @param {Element|Document} parent - Parent element context
 * @returns {Element|null}
 */
export function $x(xpath, parent = document) {
  const result = document.evaluate(
    xpath,
    parent,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  return result.singleNodeValue;
}

/**
 * Query multiple elements by XPath
 * @param {string} xpath - XPath expression
 * @param {Element|Document} parent - Parent element context
 * @returns {Element[]}
 */
export function $$x(xpath, parent = document) {
  const result = document.evaluate(
    xpath,
    parent,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  const elements = [];
  for (let i = 0; i < result.snapshotLength; i++) {
    elements.push(result.snapshotItem(i));
  }
  return elements;
}

/**
 * Wait for element to appear in DOM
 * @param {string} selector - CSS selector
 * @param {Object} options - Options
 * @param {number} options.timeout - Max wait time in ms (default: 10000)
 * @param {boolean} options.visible - Wait for visible element (default: true)
 * @param {Element|Document} options.parent - Parent element context
 * @returns {Promise<Element|null>}
 */
export function waitForElement(selector, options = {}) {
  const { timeout = 10000, visible = true, parent = document } = options;
  
  return new Promise((resolve) => {
    // Check if element already exists
    const existing = parent.querySelector(selector);
    if (existing && (!visible || isVisible(existing))) {
      return resolve(existing);
    }
    
    const observer = new MutationObserver((mutations, obs) => {
      const el = parent.querySelector(selector);
      if (el && (!visible || isVisible(el))) {
        obs.disconnect();
        resolve(el);
      }
    });
    
    observer.observe(parent === document ? document.body : parent, {
      childList: true,
      subtree: true,
      attributes: visible,
    });
    
    // Timeout fallback
    setTimeout(() => {
      observer.disconnect();
      const el = parent.querySelector(selector);
      resolve(el && (!visible || isVisible(el)) ? el : null);
    }, timeout);
  });
}

/**
 * Wait for element to appear in DOM using XPath
 * @param {string} xpath - XPath expression
 * @param {Object} options - Options
 * @param {number} options.timeout - Max wait time in ms (default: 10000)
 * @param {number} options.pollInterval - Polling interval in ms (default: 200)
 * @param {boolean} options.visible - Wait for visible element (default: true)
 * @param {Element|Document} options.parent - Parent element context
 * @returns {Promise<Element|null>}
 */
export function waitForXPath(xpath, options = {}) {
  const { timeout = 10000, pollInterval = 200, visible = true, parent = document } = options;

  return new Promise((resolve) => {
    const startTime = Date.now();

    const check = () => {
      const result = document.evaluate(
        xpath,
        parent,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      const el = result.singleNodeValue;

      if (el && (!visible || isVisible(el))) {
        resolve(el);
        return;
      }

      if (Date.now() - startTime >= timeout) {
        resolve(null);
        return;
      }

      setTimeout(check, pollInterval);
    };

    check();
  });
}

/**
 * Wait for element to be enabled (not disabled)
 * @param {string} selector - CSS selector
 * @param {Object} options - Options
 * @param {number} options.timeout - Max wait time in ms
 * @param {number} options.pollInterval - Polling interval in ms
 * @returns {Promise<Element|null>}
 */
export function waitForElementEnabled(selector, options = {}) {
  const { timeout = 10000, pollInterval = 200 } = options;
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const check = () => {
      const el = document.querySelector(selector);
      if (el && !el.disabled && isVisible(el)) {
        resolve(el);
        return;
      }
      
      if (Date.now() - startTime >= timeout) {
        resolve(null);
        return;
      }
      
      setTimeout(check, pollInterval);
    };
    
    check();
  });
}

/**
 * Check if element is visible
 * @param {Element} element - DOM element
 * @returns {boolean}
 */
export function isVisible(element) {
  if (!element) return false;
  return element.offsetParent !== null || 
         getComputedStyle(element).display !== 'none';
}

/**
 * Scroll element into view smoothly
 * @param {Element} element - DOM element
 * @param {Object} options - ScrollIntoView options
 */
export function scrollToElement(element, options = {}) {
  if (!element) return;
  
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    ...options,
  });
}