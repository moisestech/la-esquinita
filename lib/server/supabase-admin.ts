import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
export const INVENTORY_TABLE = process.env.SUPABASE_INVENTORY_TABLE || "products"

export const getSupabaseAdmin = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error("Supabase admin credentials missing")
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY)
}
