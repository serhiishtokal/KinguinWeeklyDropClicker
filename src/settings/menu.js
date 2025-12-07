/**
 * Tampermonkey Menu Command Registration
 * Provides quick toggle via Tampermonkey menu
 */

import { getSetting, toggleSetting } from './index.js';
import { log } from '../utils/dom.js';
import { createOverlay } from '../utils/styles.js';

let menuCommandId = null;

/**
 * Get menu label based on current setting
 * @returns {string} Menu label with status indicator
 */
function getMenuLabel() {
  const isEnabled = getSetting('autoClickPay');
  return `${isEnabled ? '✅' : '❌'} Auto-Click Pay Button`;
}

/**
 * Handle menu command click
 */
function handleToggle() {
  const newValue = toggleSetting('autoClickPay');
  log(`Auto-click pay toggled: ${newValue}`);
  
  // Show feedback overlay
  createOverlay(
    `Auto-Click Pay: ${newValue ? 'ENABLED' : 'DISABLED'}`,
    {
      backgroundColor: newValue 
        ? 'rgba(76, 175, 80, 0.9)'   // Green for enabled
        : 'rgba(255, 152, 0, 0.9)', // Orange for disabled
      autoRemove: 2000,
    }
  );
  
  // Re-register menu to update label
  registerMenuCommand();
}

/**
 * Register/update the menu command
 */
export function registerMenuCommand() {
  // Unregister existing command if any
  if (menuCommandId !== null) {
    GM_unregisterMenuCommand(menuCommandId);
  }
  
  // Register with current label
  menuCommandId = GM_registerMenuCommand(
    getMenuLabel(),
    handleToggle,
    'p'  // Keyboard shortcut: Alt+P
  );
}