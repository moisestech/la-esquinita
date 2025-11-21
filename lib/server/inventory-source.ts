import { createClient } from "@supabase/supabase-js"
import { InventoryProduct, inventoryProducts, mapSupabaseProduct } from "@/lib/inventory-data"
import { Database } from "@/types/supabase"

type Source = "supabase" | "static"

const TABLE = process.env.SUPABASE_INVENTORY_TABLE || "products"
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const getClient = () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  return createClient<Database>(SUPABASE_URL, SUPABASE_KEY)
}

const staticResponse = (item?: InventoryProduct | null) => ({
  source: "static" as Source,
  item: item ?? null,
})

export async function getInventoryList() {
  const client = getClient()
  if (client) {
    try {
      const { data, error } = await client
        .from(TABLE)
        .select("*")
        .eq("status", "active")
        .not("inventory_number", "is", null)
        .order("inventory_number", { ascending: true })

      if (error) throw error
      if (data) {
        return {
          source: "supabase" as Source,
          items: data.map(mapSupabaseProduct),
        }
      }
    } catch (err) {
      console.error("[inventory] Supabase fetch failed:", err)
    }
  }

  return {
    source: "static" as Source,
    items: inventoryProducts,
  }
}

export async function getInventoryItem(identifier: string) {
  const client = getClient()
  if (client) {
    try {
      const number = Number(identifier)
      const query = client.from(TABLE).select("*").eq("status", "active").limit(1)

      if (!Number.isNaN(number)) {
        query.eq("inventory_number", number)
      } else {
        query.eq("slug", identifier)
      }

      const { data, error } = await query.maybeSingle()
      if (error && error.code !== "PGRST116") throw error
      if (data) {
        return {
          source: "supabase" as Source,
          item: mapSupabaseProduct(data),
        }
      }
    } catch (err) {
      console.error("[inventory] Supabase lookup failed:", err)
    }
  }

  const fallback =
    inventoryProducts.find(
      (product) =>
        product.slug === identifier ||
        product.inventoryNumber === Number(identifier)
    ) || null

  return staticResponse(fallback)
}
