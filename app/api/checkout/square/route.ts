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
  console.log(
    "[square] checkout env=%s location=%s token=%s",
    squareConfig.env,
    squareConfig.locationId,
    squareConfig.accessToken ? `${squareConfig.accessToken.slice(0, 6)}***` : "missing"
  )

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

    const orderResponse = await client.orders.create({
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

    const orderId = orderResponse.data?.order?.id

    const paymentResponse = await client.payments.create({
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

    const soldAt = new Date().toISOString()
    const slugs = body.cartItems.map((item) => item.slug)
    const paymentId = paymentResponse.data?.payment?.id || null
    const orderIdentifier = orderId || paymentResponse.data?.payment?.orderId || paymentId

    if (slugs.length) {
      try {
        const supabase = getSupabaseAdmin()
      const { error: updateError } = await supabase
        .from(INVENTORY_TABLE)
        .update({
          status: "active",
          sold_at: soldAt,
          square_order_id: orderIdentifier,
        })
          .in("slug", slugs)

        if (updateError) {
          console.error("[square] Failed to update Supabase status", updateError)
        }
      } catch (err) {
        console.error("[square] Supabase admin unavailable", err)
      }
    }

    return NextResponse.json({
      payment: paymentResponse.data?.payment,
      orderId: orderIdentifier,
    })
  } catch (error) {
    console.error("[square] checkout error", error)
    const message =
      error instanceof Error ? error.message : "Unknown Square error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
