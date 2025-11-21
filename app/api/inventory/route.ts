import { NextResponse } from "next/server"
import { getInventoryList } from "@/lib/server/inventory-source"

export const revalidate = 60

export async function GET() {
  const { items, source } = await getInventoryList()
  return NextResponse.json(
    {
      items,
      count: items.length,
      source,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  )
}
