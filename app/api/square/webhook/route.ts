import { NextResponse } from "next/server"
import { getSupabaseAdmin, INVENTORY_TABLE } from "@/lib/server/supabase-admin"
import { verifySquareSignature, isSquareWebhookConfigured } from "@/lib/square/webhook"

export async function POST(request: Request) {
  const rawBody = await request.text()

  if (!verifySquareSignature(request, rawBody)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  try {
    const payload = JSON.parse(rawBody)
    const eventType = payload?.type
    const payment = payload?.data?.object?.payment

    if (!payment) {
      return NextResponse.json({ message: "No payment payload" })
    }

    const orderId = payment.orderId
    const paymentStatus = payment.status
    const paidAt = payment.updatedAt || payment.createdAt || new Date().toISOString()

    if (!orderId) {
      return NextResponse.json({ message: "No order id" })
    }

    const supabase = getSupabaseAdmin()

    if (paymentStatus === "COMPLETED") {
      const { error } = await supabase
        .from(INVENTORY_TABLE)
        .update({
          status: "active",
          sold_at: paidAt,
          square_order_id: orderId,
        })
        .eq("square_order_id", orderId)

      if (error) {
        console.error("[square webhook] failed to mark sold", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else if (paymentStatus === "CANCELED" || paymentStatus === "FAILED") {
      const { error } = await supabase
        .from(INVENTORY_TABLE)
        .update({
          status: "active",
          sold_at: null,
          square_order_id: null,
        })
        .eq("square_order_id", orderId)

      if (error) {
        console.error("[square webhook] failed to revert", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[square webhook] error", error)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
}
