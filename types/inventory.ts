export type InventoryAvailability = "available" | "reserved" | "sold"
export type InventoryStatus = "active" | "sold" | "reserved" | "coming_soon"

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
  status: InventoryStatus
  dimensions?: string | null
  squareSku?: string | null
  isUnique: boolean
  soldAt?: string | null
  squareCatalogObjectId?: string | null
}
