import rawInventory from "@/data/generated-inventory.json"
import { Product } from "@/lib/supabase"
import { InventoryRecord, InventoryStatus } from "@/types/inventory"

const BASE_TIMESTAMP = "2024-11-01T00:00:00.000Z"

export type InventoryProduct = Product & {
  inventoryNumber: number
  displayNumber: string
  primaryImage: string
  undersideImage?: string | null
  inventoryStatus: InventoryStatus
}

export const inventoryRecords = rawInventory as InventoryRecord[]

const toProductStatus = (status: InventoryStatus): Product["status"] => {
  if (status === "sold") return "archived"
  if (status === "reserved" || status === "coming_soon") return "coming_soon"
  return "active"
}

const recordToProduct = (record: InventoryRecord): Product => {
  const inventoryStatus = record.status ?? (record.availability === "sold" ? "sold" : "active")

  return {
    id: record.slug,
    slug: record.slug,
    name: `${record.displayNumber} · ${record.title}`,
    price: record.price,
    description: record.description,
    image_urls: record.gallery,
    status: toProductStatus(inventoryStatus),
    category: record.category,
    tags: record.tags,
    created_at: BASE_TIMESTAMP,
    updated_at: BASE_TIMESTAMP,
    inventory_number: record.inventoryNumber,
    display_number: record.displayNumber,
    primary_image: record.primaryImage,
    underside_image: record.undersideImage ?? null,
    square_catalog_object_id: record.squareCatalogObjectId ?? null,
    square_order_id: null,
    square_sku: record.squareSku ?? null,
    sold_at: record.soldAt ?? null,
    is_unique: record.isUnique,
    dimensions: record.dimensions ?? null,
    inventoryStatus,
  } as Product & { inventoryStatus: InventoryStatus }
}

const deriveInventoryNumberFromSlug = (slug: string): number | null => {
  const prefix = slug.split("-")[0]
  const value = Number(prefix)
  return Number.isFinite(value) ? value : null
}

const buildDisplayNumber = (value?: number | null, fallback?: string) => {
  if (value && Number.isFinite(value)) return `No. ${value}`
  return fallback ?? "Untitled Object"
}

const fromProductStatus = (status: Product["status"]): InventoryStatus => {
  if (status === "archived") return "sold"
  if (status === "coming_soon") return "reserved"
  return "active"
}

export const mapSupabaseProduct = (product: Product): InventoryProduct => {
  const derivedNumber = product.inventory_number ?? deriveInventoryNumberFromSlug(product.slug)
  const displayNumber = product.display_number ?? buildDisplayNumber(derivedNumber, product.name)
  const primaryImage = product.primary_image ?? product.image_urls?.[0] ?? ""
  const existingStatus = (product as InventoryProduct).inventoryStatus
  const derivedStatus = fromProductStatus(product.status || "active")
  const inventoryStatus = product.sold_at
    ? "sold"
    : existingStatus ?? derivedStatus

  return {
    ...product,
    inventoryNumber: derivedNumber ?? 0,
    displayNumber,
    primaryImage,
    undersideImage: product.underside_image ?? null,
    inventoryStatus,
  }
}

export const inventoryProducts: InventoryProduct[] = inventoryRecords.map((record) =>
  mapSupabaseProduct(recordToProduct(record))
)
