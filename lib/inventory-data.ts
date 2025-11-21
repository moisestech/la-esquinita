import rawInventory from "@/data/generated-inventory.json"
import { Product } from "@/lib/supabase"
import { InventoryRecord } from "@/types/inventory"

const BASE_TIMESTAMP = "2024-11-01T00:00:00.000Z"

export type InventoryProduct = Product & {
  inventoryNumber: number
  displayNumber: string
  primaryImage: string
  undersideImage?: string | null
}

export const inventoryRecords = rawInventory as InventoryRecord[]

const recordToProduct = (record: InventoryRecord): Product => ({
  id: `inventory-${record.numberPadded}`,
  slug: record.slug,
  name: `${record.displayNumber} · ${record.title}`,
  price: record.price,
  description: record.description,
  image_urls: record.gallery,
  status: "active",
  category: record.category,
  tags: record.tags,
  created_at: BASE_TIMESTAMP,
  updated_at: BASE_TIMESTAMP,
  inventory_number: record.inventoryNumber,
  display_number: record.displayNumber,
  primary_image: record.primaryImage,
  underside_image: record.undersideImage ?? null,
  square_catalog_object_id: record.squareCatalogObjectId,
  square_sku: record.squareSku,
  sold_at: record.soldAt ?? null,
  is_unique: record.isUnique,
  dimensions: record.dimensions ?? null,
})

const deriveInventoryNumberFromSlug = (slug: string): number | null => {
  const prefix = slug.split("-")[0]
  const value = Number(prefix)
  return Number.isFinite(value) ? value : null
}

const buildDisplayNumber = (value?: number | null, fallback?: string) => {
  if (value && Number.isFinite(value)) return `No. ${value}`
  return fallback ?? "Untitled Object"
}

export const mapSupabaseProduct = (product: Product): InventoryProduct => {
  const derivedNumber = product.inventory_number ?? deriveInventoryNumberFromSlug(product.slug)
  const displayNumber = product.display_number ?? buildDisplayNumber(derivedNumber, product.name)
  const primaryImage = product.primary_image ?? product.image_urls?.[0] ?? ""

  return {
    ...product,
    inventoryNumber: derivedNumber ?? 0,
    displayNumber,
    primaryImage,
    undersideImage: product.underside_image ?? null,
  }
}

export const inventoryProducts: InventoryProduct[] = inventoryRecords.map((record) =>
  mapSupabaseProduct(recordToProduct(record))
)
