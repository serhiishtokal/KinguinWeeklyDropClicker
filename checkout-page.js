async function setMaxValueForKinguinBalance(value = '999') {
  const input = document.querySelector('#kinguin-balance-value');
  if (!input) {
    console.warn('setMaxValueForKinguinBalance: input not found', '#kinguin-balance-value');
    return;
  }
  
  // Hover and click to focus
  input.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  await new Promise(r => setTimeout(r, 70));
  
  input.click();
  input.focus();
  await new Promise(r => setTimeout(r, 70));
  
  // Clear the field first
  input.setSelectionRange(0, input.value.length);
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 50));
  
  // Type the value
  for (const char of value) {
    input.value += char;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
    await new Promise(r => setTimeout(r, 25));
  }
  
  // Blur
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.blur();
  input.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));

}

async function humanLikeClick(selector, opts = {}) {
  const { hoverDelay = 100 + Math.floor(Math.random() * 80), moveDelay = 40 + Math.floor(Math.random() * 40), holdDelay = 120 + Math.floor(Math.random() * 100) } = opts;
  const el = document.querySelector(selector);
  if (!el) {
    console.warn('humanLikeClick: element not found', selector);
    return;
  }

  el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  await new Promise(r => setTimeout(r, hoverDelay));
  el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
  await new Promise(r => setTimeout(r, moveDelay));
  el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, buttons: 1 }));
  await new Promise(r => setTimeout(r, holdDelay));
  el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, buttons: 1 }));
  el.click();
  el.focus();
  await new Promise(r => setTimeout(r, 50));
}

// Helper: wait for an element to appear in the DOM within a timeout
async function waitForElement(selector, timeout = 5000, interval = 20) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await new Promise(r => setTimeout(r, interval));
  }
  return null;
}

// Separate flow: click the pay button with a human-like click.
// This function ONLY performs the click. Use `waitForElement` separately
// if you need to wait for the button to appear.
// Returns `true` if clicked, `false` if the button wasn't found.
async function clickPayButton(opts = {}) {
  const el = document.querySelector('#kps__pay-btn');
  if (!el) {
    console.warn('clickPayButton: pay button not found', '#kps__pay-btn');
    return false;
  }

  await humanLikeClick('#kps__pay-btn', opts);
  return true;
}

async function setAndPay(value = '999', opts = {}) {
  const { preDelay = 500, timeout = 5000, pollInterval = 120, clickOpts = {} } = opts;

  // 1) Set the balance value (typing simulation)
  await setMaxValueForKinguinBalance(String(value));

  // 2) Short pre-delay to let the UI begin applying the new value
  await new Promise(r => setTimeout(r, preDelay));

  // 3) Wait for the pay button to appear
  const el = await waitForElement('#kps__pay-btn', timeout, pollInterval);
  if (!el) {
    console.warn('setAndPay: pay button did not appear', { selector: '#kps__pay-btn', timeout });
    return false;
  }

  // 4) Click the pay button using the human-like click helper
  const clicked = await clickPayButton(clickOpts);
  return !!clicked;
}

const ok = await setAndPay('999');

// Example usage:
// const ok = await setAndPay('999', { preDelay: 400, timeout: 8000, pollInterval: 120 });
// if (!ok) console.error('Full flow failed: pay button not clicked');
