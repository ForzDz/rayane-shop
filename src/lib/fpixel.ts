export const FB_PIXEL_ID = "1192117281445404";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

const IS_DEV = import.meta.env.DEV;

/**
 * Log debugging information if in development mode
 */
const debugLog = (message: string, ...args: any[]) => {
  if (IS_DEV) {
    console.log(`%c[Meta Pixel] ${message}`, 'background: #1877f2; color: #fff; padding: 2px 5px; border-radius: 3px;', ...args);
  }
};

/**
 * Initialize Facebook Pixel
 */
export const init = () => {
  if (typeof window === 'undefined') return;
  if (window.fbq) return;

  const fbq = function (...args: any[]) {
    const self = fbq as any;
    self.callMethod ? self.callMethod.apply(self, args) : self.queue.push(args);
  };

  const f = fbq as any;
  if (!window._fbq) window._fbq = f;
  f.push = f;
  f.loaded = true;
  f.version = '2.0';
  f.queue = [];

  window.fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  window.fbq('init', FB_PIXEL_ID);
  debugLog('Initialized with ID:', FB_PIXEL_ID);
};

/**
 * Track PageView
 */
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
    debugLog('Event: PageView');
  } else {
    debugLog('Cannot track PageView: fbq not found');
  }
};

/**
 * Track Standard and Custom Events
 */
export const event = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
    debugLog(`Event: ${name}`, options);
  } else {
    debugLog(`Cannot track ${name}: fbq not found`, options);
  }
};
