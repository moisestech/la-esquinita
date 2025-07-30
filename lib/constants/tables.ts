export const TABLES = {
  NEWSLETTER: 'newsletter',
  PRODUCTS: 'products',
  EVENTS: 'events',
  SECRET_PASSES: 'secret_passes',
  RSVPS: 'rsvps',
  CONTENT: 'content',
} as const

export type TableName = typeof TABLES[keyof typeof TABLES] 