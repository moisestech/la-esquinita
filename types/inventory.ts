export type InventoryAvailability = "available" | "reserved" | "sold"

export interface InventoryRecord {
  inventoryNumber: number
  numberPadded: string
  label: string
  labelSlug: string
  title: string
  displayNumber: string
  slug: string
  description: string
  altText: string
  price: number
  category: string
  tags: string[]
  primaryImage: string
  undersideImage?: string
  gallery: string[]
  availability: InventoryAvailability
  dimensions?: string | null
  squareSku?: string | null
  isUnique: boolean
  soldAt?: string | null
  squareCatalogObjectId?: string | null
}
