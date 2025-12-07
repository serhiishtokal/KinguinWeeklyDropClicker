/**
 * Simulation utilities for human-like interactions
 */

/**
 * Random delay between min and max milliseconds
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 * @returns {number} Random delay value
 */
export function randomDelay(min = 50, max = 150) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Human-like delay - returns a promise that resolves after random delay
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 * @returns {Promise<void>}
 */
export function humanDelay(min = 50, max = 150) {
  return sleep(randomDelay(min, max));
}

/**
 * Simulate realistic mouse click with proper event sequence
 * Triggers: mouseover -> mousedown -> mouseup -> click -> focus
 * @param {Element} element - DOM element to click
 * @returns {boolean} Success status
 */
export function humanLikeClick(element) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Use unsafeWindow when available (Tampermonkey sandboxed mode) for MouseEvent view property
  const viewWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  
  const eventOptions = {
    bubbles: true,
    cancelable: true,
    view: viewWindow,
    clientX: centerX,
    clientY: centerY,
  };
  
  // Simulate realistic mouse event sequence
  element.dispatchEvent(new MouseEvent('mouseover', eventOptions));
  element.dispatchEvent(new MouseEvent('mousedown', eventOptions));
  element.dispatchEvent(new MouseEvent('mouseup', eventOptions));
  element.dispatchEvent(new MouseEvent('click', eventOptions));
  
  if (element.focus) {
    element.focus();
  }
  
  return true;
}

/**
 * Simulate typing text into an input with human-like delays
 * @param {Element} element - Input element
 * @param {string} text - Text to type
 * @param {number} minDelay - Min delay between keystrokes
 * @param {number} maxDelay - Max delay between keystrokes
 * @returns {Promise<boolean>} Success status
 */
export async function humanLikeType(element, text, minDelay = 50, maxDelay = 150) {
  if (!element) return false;
  
  element.focus();
  element.value = '';
  
  for (const char of text) {
    // Dispatch keydown event BEFORE changing value
    element.dispatchEvent(new KeyboardEvent('keydown', {
      key: char,
      code: `Key${char.toUpperCase()}`,
      bubbles: true,
      cancelable: true
    }));
    
    // Use native setter to ensure React/Vue detects the change
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(element, element.value + char);
    
    // Dispatch input event (bubbles for framework detection)
    element.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Dispatch keyup event AFTER value change
    element.dispatchEvent(new KeyboardEvent('keyup', {
      key: char,
      code: `Key${char.toUpperCase()}`,
      bubbles: true,
      cancelable: true
    }));
    
    // Random delay between keystrokes for human-like typing
    await humanDelay(minDelay, maxDelay);
  }
  
  // Final change event
  element.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

/**
 * Simulate simple input value change (faster, no typing animation)
 * @param {Element} element - Input element
 * @param {string} value - Value to set
 * @returns {boolean} Success status
 */
export function simulateInput(element, value) {
  if (!element) return false;
  
  element.focus();
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.blur();
  
  return true;
}