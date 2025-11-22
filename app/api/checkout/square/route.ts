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
  console.log("[square] ========== CHECKOUT START ==========")
  console.log("[square] isSquareConfigured=%s", isSquareConfigured)

  if (!isSquareConfigured) {
    console.log("[square] ERROR: Square not configured")
    return NextResponse.json(
      { error: "Square credentials missing" },
      { status: 503 }
    )
  }

  console.log("[square] Config details:")
  console.log("  env=%s", squareConfig.env)
  console.log("  applicationId=%s", squareConfig.applicationId ? `${squareConfig.applicationId.slice(0, 10)}***` : "missing")
  console.log("  locationId=%s", squareConfig.locationId)
  console.log("  accessToken=%s", squareConfig.accessToken ? `${squareConfig.accessToken.slice(0, 6)}***` : "missing")
  console.log("  accessToken length=%s", squareConfig.accessToken?.length)

  try {
    const body = (await request.json()) as CheckoutRequest
    console.log("[square] Request body received:")
    console.log("  cartItems count=%s", body.cartItems?.length)
    console.log("  sourceId=%s", body.sourceId ? `${body.sourceId.slice(0, 10)}***` : "missing")
    console.log("  customerEmail=%s", body.customerEmail)
    console.log("  totalAmount=%s", body.totalAmount)

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

    console.log("[square] Payment calculations:")
    console.log("  subtotalCents=%s", subtotalCents)
    console.log("  totalAmountCents=%s", totalAmountCents)
    console.log("  discountCents=%s", discountCents)

    console.log("[square] Getting Square client...")
    const client = getSquareClient()
    console.log("[square] Client created successfully")

    console.log("[square] Creating order...")

    // DIAGNOSTIC: Try raw API call first
    console.log("[square] DIAGNOSTIC: Testing raw API call to Square...")
    const testPayload = {
      idempotency_key: randomUUID(),
      order: {
        location_id: squareConfig.locationId,
        line_items: lineItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          base_price_money: {
            amount: Number(item.basePriceMoney.amount),
            currency: item.basePriceMoney.currency,
          }
        }))
      }
    }

    console.log("[square] Raw API test payload:", JSON.stringify(testPayload))

    const rawResponse = await fetch("https://connect.squareup.com/v2/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${squareConfig.accessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-07-17",
      },
      body: JSON.stringify(testPayload)
    })

    const rawData = await rawResponse.json()
    console.log("[square] Raw API response status:", rawResponse.status)
    console.log("[square] Raw API response:", JSON.stringify(rawData))

    if (!rawResponse.ok) {
      throw new Error(`Raw API test failed: ${JSON.stringify(rawData)}`)
    }

    const orderPayload = {
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
    }
    console.log("[square] Order payload:", JSON.stringify(orderPayload, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    const orderResponse = await client.orders.create(orderPayload)
    console.log("[square] Order created successfully, orderId=%s", orderResponse.data?.order?.id)

    const orderId = orderResponse.data?.order?.id

    console.log("[square] Creating payment...")
    const paymentPayload = {
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
    }
    console.log("[square] Payment payload:", JSON.stringify(paymentPayload, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    const paymentResponse = await client.payments.create(paymentPayload)
    console.log("[square] Payment created successfully, paymentId=%s", paymentResponse.data?.payment?.id)

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

    console.log("[square] ========== CHECKOUT SUCCESS ==========")
    return NextResponse.json({
      payment: paymentResponse.data?.payment,
      orderId: orderIdentifier,
    })
  } catch (error) {
    console.error("[square] ========== CHECKOUT ERROR ==========")
    console.error("[square] Error caught:", error)

    // Log detailed error info
    if (error && typeof error === 'object') {
      const err = error as any
      console.error("[square] Error type:", err.constructor?.name)
      console.error("[square] Error statusCode:", err.statusCode)
      console.error("[square] Error errors:", JSON.stringify(err.errors, null, 2))
      console.error("[square] Error body:", JSON.stringify(err.body, null, 2))
      console.error("[square] Error message:", err.message)
      console.error("[square] Full error object:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2))
    }

    const message =
      error instanceof Error ? error.message : "Unknown Square error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
