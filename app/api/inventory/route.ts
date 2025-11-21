import { NextResponse } from "next/server"
import { getInventoryList } from "@/lib/server/inventory-source"

export async function GET() {
  const { items, source } = await getInventoryList()
  return NextResponse.json({
    items,
    count: items.length,
    source,
  })
}
