export const TABLES = {
  NEWSLETTER: 'newsletter',
} as const

export type TableName = typeof TABLES[keyof typeof TABLES] 