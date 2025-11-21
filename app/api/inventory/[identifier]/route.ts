import { NextResponse } from "next/server"
import { getInventoryItem } from "@/lib/server/inventory-source"

interface ParamsPromise {
  identifier: string
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<ParamsPromise> }
) {
  const { identifier } = await params
  const { item, source } = await getInventoryItem(identifier)

  if (!item) {
    return NextResponse.json(
      { error: "Inventory item not found", source },
      { status: 404 }
    )
  }

  return NextResponse.json({ item, source })
}
