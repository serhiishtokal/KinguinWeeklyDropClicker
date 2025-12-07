/**
 * Settings Manager for Kinguin Kings Drop
 * Uses Tampermonkey GM APIs for persistent storage
 */

const SETTINGS_KEY = 'kinguin_kings_drop_settings';

const DEFAULT_SETTINGS = {
  autoClickPay: false,  // Default: just highlight, don't click
};

/**
 * Get all settings with defaults
 * @returns {Object} Current settings
 */
export function getSettings() {
  const stored = GM_getValue(SETTINGS_KEY, null);
  if (!stored) return { ...DEFAULT_SETTINGS };
  
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Get a specific setting value
 * @param {string} key - Setting key
 * @returns {*} Setting value
 */
export function getSetting(key) {
  return getSettings()[key];
}

/**
 * Update a specific setting
 * @param {string} key - Setting key
 * @param {*} value - New value
 */
export function setSetting(key, value) {
  const settings = getSettings();
  settings[key] = value;
  GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
}

/**
 * Toggle a boolean setting
 * @param {string} key - Setting key
 * @returns {boolean} New value
 */
export function toggleSetting(key) {
  const newValue = !getSetting(key);
  setSetting(key, newValue);
  return newValue;
}