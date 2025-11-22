import { NextResponse } from "next/server"
import { getInventoryList } from "@/lib/server/inventory-source"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const { items } = await getInventoryList()
    return NextResponse.json({ products: items })
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
