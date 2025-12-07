/**
 * CSS and styling utilities
 */

/**
 * Inject CSS into the page
 * @param {string} css - CSS content
 * @param {string} id - Style element ID (prevents duplicates)
 * @returns {HTMLStyleElement}
 */
export function injectStyles(css, id = 'kings-drop-styles') {
  // Remove existing style if present
  const existing = document.getElementById(id);
  if (existing) {
    existing.textContent = css;
    return existing;
  }
  
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}

/**
 * Default keyframe animations for visual feedback
 */
export const DEFAULT_ANIMATIONS = `
  @keyframes kings-drop-pulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
  }
  
  @keyframes kings-drop-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes kings-drop-glow-success {
    0% { box-shadow: 0 0 5px #4CAF50; }
    50% { box-shadow: 0 0 20px #4CAF50; }
    100% { box-shadow: 0 0 5px #4CAF50; }
  }
  
  @keyframes kings-drop-glow-warning {
    0% { box-shadow: 0 0 5px #FF9800; }
    50% { box-shadow: 0 0 20px #FF9800; }
    100% { box-shadow: 0 0 5px #FF9800; }
  }
  
  @keyframes kings-drop-glow-error {
    0% { box-shadow: 0 0 5px #f44336; }
    50% { box-shadow: 0 0 20px #f44336; }
    100% { box-shadow: 0 0 5px #f44336; }
  }
`;

/**
 * Highlight types with their corresponding styles
 */
const HIGHLIGHT_STYLES = {
  success: {
    border: '3px solid #4CAF50',
    animation: 'kings-drop-glow-success 1.5s infinite',
  },
  warning: {
    border: '3px solid #FF9800',
    animation: 'kings-drop-glow-warning 1.5s infinite',
  },
  error: {
    border: '3px solid #f44336',
    animation: 'kings-drop-glow-error 1.5s infinite',
  },
  attention: {
    border: '3px solid #FFC107',
    animation: 'kings-drop-pulse 1.5s infinite',
  },
};

/**
 * Highlight an element with visual feedback
 * @param {Element} element - DOM element
 * @param {string} type - Highlight type: 'success', 'warning', 'error', 'attention'
 * @param {number} duration - Duration in ms (0 for permanent)
 */
export function highlightElement(element, type = 'attention', duration = 0) {
  if (!element) return;
  
  // Ensure animations are injected
  injectStyles(DEFAULT_ANIMATIONS, 'kings-drop-animations');
  
  const styles = HIGHLIGHT_STYLES[type] || HIGHLIGHT_STYLES.attention;
  const originalStyles = {
    border: element.style.border,
    animation: element.style.animation,
  };
  
  Object.assign(element.style, styles);
  
  if (duration > 0) {
    setTimeout(() => {
      element.style.border = originalStyles.border;
      element.style.animation = originalStyles.animation;
    }, duration);
  }
}

/**
 * Create a floating status overlay
 * @param {string} text - Overlay text
 * @param {Object} options - Options
 * @returns {HTMLDivElement}
 */
export function createOverlay(text, options = {}) {
  const {
    position = 'bottom-right',
    backgroundColor = 'rgba(0, 0, 0, 0.85)',
    color = '#fff',
    autoRemove = 0,
  } = options;
  
  // Remove existing overlay
  const existing = document.getElementById('kings-drop-overlay');
  if (existing) existing.remove();
  
  const overlay = document.createElement('div');
  overlay.id = 'kings-drop-overlay';
  overlay.textContent = text;
  
  const positions = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
  };
  
  Object.assign(overlay.style, {
    position: 'fixed',
    padding: '12px 18px',
    borderRadius: '8px',
    backgroundColor,
    color,
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    fontWeight: 'bold',
    zIndex: '999999',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    ...positions[position],
  });
  
  document.body.appendChild(overlay);
  
  if (autoRemove > 0) {
    setTimeout(() => overlay.remove(), autoRemove);
  }
  
  return overlay;
}

/**
 * Remove the status overlay
 */
export function removeOverlay() {
  const overlay = document.getElementById('kings-drop-overlay');
  if (overlay) overlay.remove();
}