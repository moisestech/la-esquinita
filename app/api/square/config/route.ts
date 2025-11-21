import { NextResponse } from "next/server"
import { squareConfig, isSquareConfigured } from "@/lib/square/config"

export const revalidate = 60

export async function GET() {
  if (!isSquareConfigured) {
    return NextResponse.json(
      { error: "Square is not configured" },
      { status: 503 }
    )
  }

  return NextResponse.json({
    environment: squareConfig.env,
    applicationId: squareConfig.applicationId,
    locationId: squareConfig.locationId,
  })
}
