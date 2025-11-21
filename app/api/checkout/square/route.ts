import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { getSquareClient } from "@/lib/square/client"
import { squareConfig, isSquareConfigured } from "@/lib/square/config"
import { getSupabaseAdmin, INVENTORY_TABLE } from "@/lib/server/supabase-admin"

type CartItemPayload = {
  id: string
  name: string
  price: number
  quantity: number
  slug: string
}

type CheckoutRequest = {
  cartItems: CartItemPayload[]
  sourceId: string
  customerEmail?: string
  totalAmount?: number
}

const currency = "USD"

const cents = (value: number) => Math.round(value * 100)

export async function POST(request: Request) {
  if (!isSquareConfigured) {
    return NextResponse.json(
      { error: "Square credentials missing" },
      { status: 503 }
    )
  }

  try {
    const body = (await request.json()) as CheckoutRequest

    if (!body.sourceId) {
      return NextResponse.json(
        { error: "Missing payment source" },
        { status: 400 }
      )
    }

    if (!Array.isArray(body.cartItems) || body.cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      )
    }

    const lineItems = body.cartItems.map((item) => ({
      name: item.name,
      quantity: String(item.quantity || 1),
      basePriceMoney: {
        amount: BigInt(cents(item.price)),
        currency,
      },
      catalogObjectId: item.id,
    }))

    const subtotalCents = body.cartItems.reduce(
      (sum, item) => sum + cents(item.price) * (item.quantity || 1),
      0
    )
    const requestedTotalCents = body.totalAmount ? cents(body.totalAmount) : subtotalCents
    const totalAmountCents = Math.min(subtotalCents, Math.max(0, requestedTotalCents))
    const discountCents = Math.max(0, subtotalCents - totalAmountCents)

    const client = getSquareClient()
    const { ordersApi, paymentsApi } = client

    const orderResponse = await ordersApi.createOrder({
      order: {
        idempotencyKey: randomUUID(),
        locationId: squareConfig.locationId,
        lineItems,
        discounts:
          discountCents > 0
            ? [
                {
                  uid: randomUUID(),
                  name: "Cart Discount",
                  amountMoney: {
                    amount: BigInt(discountCents),
                    currency,
                  },
                },
              ]
            : undefined,
      },
    })

    const orderId = orderResponse.result.order?.id

    const paymentResponse = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId: body.sourceId,
      locationId: squareConfig.locationId,
      amountMoney: {
        amount: BigInt(totalAmountCents),
        currency,
      },
      orderId: orderId,
      autocomplete: true,
      buyerEmailAddress: body.customerEmail,
    })

    const supabase = getSupabaseAdmin()
    const soldAt = new Date().toISOString()
    const slugs = body.cartItems.map((item) => item.slug)

    if (slugs.length) {
      const { error: updateError } = await supabase
        .from(INVENTORY_TABLE)
        .update({
          status: "sold",
          sold_at: soldAt,
          square_order_id: orderId || paymentResponse.result.payment?.id || null,
        })
        .in("slug", slugs)

      if (updateError) {
        console.error("[square] Failed to update Supabase status", updateError)
      }
    }

    return NextResponse.json({
      payment: paymentResponse.result.payment,
      orderId,
    })
  } catch (error) {
    console.error("[square] checkout error", error)
    const message =
      error instanceof Error ? error.message : "Unknown Square error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
