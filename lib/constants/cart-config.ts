// Cart Configuration
// Toggle this to easily enable/disable cart functionality while developing

export const CART_CONFIG = {
  // Set to true to enable cart immediately (for development)
  // Set to false to use the unlock date
  OVERRIDE_UNLOCK: false,

  // Products unlock date
  UNLOCK_DATE: new Date('2025-11-14T00:00:00'),

  // Message to display when cart is locked
  LOCKED_MESSAGE: 'Products Unlock November 14th',
}

/**
 * Check if cart is currently enabled
 * @returns boolean - true if cart should be enabled
 */
export function isCartEnabled(): boolean {
  if (CART_CONFIG.OVERRIDE_UNLOCK) {
    return true
  }

  return new Date() >= CART_CONFIG.UNLOCK_DATE
}

/**
 * Get the message to display on disabled cart buttons
 * @returns string - message to display
 */
export function getCartLockedMessage(): string {
  return CART_CONFIG.LOCKED_MESSAGE
}
