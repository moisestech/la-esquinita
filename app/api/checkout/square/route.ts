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

type ShippingAddress = {
  name: string
  address: string
  city: string
  state: string
  zip: string
  email: string
  phone: string
}

type CheckoutRequest = {
  cartItems: CartItemPayload[]
  sourceId: string
  customerEmail?: string
  totalAmount?: number
  needsShipping?: boolean
  shippingAddress?: ShippingAddress | null
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

    console.log("[square] Creating order with raw API...")
    const orderPayload = {
      idempotency_key: randomUUID(),
      order: {
        location_id: squareConfig.locationId,
        line_items: lineItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          base_price_money: {
            amount: Number(item.basePriceMoney.amount),
            currency: item.basePriceMoney.currency,
          },
          // Don't include catalog_object_id - we're not using Square catalog
        })),
        discounts: discountCents > 0 ? [{
          uid: randomUUID(),
          name: "Cart Discount",
          amount_money: {
            amount: discountCents,
            currency,
          },
        }] : undefined,
      }
    }

    console.log("[square] Order payload:", JSON.stringify(orderPayload))

    const orderResponse = await fetch("https://connect.squareup.com/v2/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${squareConfig.accessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-07-17",
      },
      body: JSON.stringify(orderPayload)
    })

    const orderData = await orderResponse.json()
    console.log("[square] Order response status:", orderResponse.status)

    if (!orderResponse.ok) {
      throw new Error(`Order creation failed: ${JSON.stringify(orderData)}`)
    }

    console.log("[square] Order created successfully, orderId=%s", orderData.order?.id)

    const orderId = orderData.order?.id

    console.log("[square] Creating payment with raw API...")
    const paymentPayload = {
      idempotency_key: randomUUID(),
      source_id: body.sourceId,
      location_id: squareConfig.locationId,
      amount_money: {
        amount: totalAmountCents,
        currency,
      },
      order_id: orderId,
      autocomplete: true,
      buyer_email_address: body.customerEmail,
    }
    console.log("[square] Payment payload:", JSON.stringify(paymentPayload))

    const paymentResponse = await fetch("https://connect.squareup.com/v2/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${squareConfig.accessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-07-17",
      },
      body: JSON.stringify(paymentPayload)
    })

    const paymentData = await paymentResponse.json()
    console.log("[square] Payment response status:", paymentResponse.status)

    if (!paymentResponse.ok) {
      throw new Error(`Payment creation failed: ${JSON.stringify(paymentData)}`)
    }

    console.log("[square] Payment created successfully, paymentId=%s", paymentData.payment?.id)

    const soldAt = new Date().toISOString()
    const slugs = body.cartItems.map((item) => item.slug)
    const paymentId = paymentData.payment?.id || null
    const orderIdentifier = orderId || paymentData.payment?.order_id || paymentId

    if (slugs.length) {
      try {
        const supabase = getSupabaseAdmin()
      console.log("[square] Updating Supabase - marking items as sold:", slugs)
      const { error: updateError } = await supabase
        .from(INVENTORY_TABLE)
        .update({
          status: "active",  // Keep status as active, sold_at indicates it's sold
          sold_at: soldAt,
          square_order_id: orderIdentifier,
        })
        .in("slug", slugs)

      console.log("[square] Supabase update complete, error:", updateError)

        if (updateError) {
          console.error("[square] Failed to update Supabase status", updateError)
        }
      } catch (err) {
        console.error("[square] Supabase admin unavailable", err)
      }
    }

    // Send shipping email if needed
    if (body.needsShipping && body.shippingAddress) {
      try {
        console.log("[square] Sending shipping notification email...")
        const emailBody = `
New Order Requires Shipping!

Order ID: ${orderIdentifier}
Payment ID: ${paymentId}
Total Amount: $${(totalAmountCents / 100).toFixed(2)}

SHIPPING ADDRESS:
${body.shippingAddress.name}
${body.shippingAddress.address}
${body.shippingAddress.city}, ${body.shippingAddress.state} ${body.shippingAddress.zip}
Email: ${body.shippingAddress.email}
Phone: ${body.shippingAddress.phone}

ITEMS TO SHIP:
${body.cartItems.map((item) => `- ${item.name} (x${item.quantity}) - $${item.price.toFixed(2)} each`).join('\n')}

Please pull these items from the gallery and arrange shipping.
`

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "La Esquinita <onboarding@resend.dev>",
            to: ["brett.m.potter@gmail.com"],
            subject: `🚚 Shipping Order #${orderIdentifier?.slice(-8)}`,
            text: emailBody
          })
        })
        console.log("[square] Shipping notification email sent")
      } catch (emailError) {
        console.error("[square] Failed to send shipping email:", emailError)
        // Don't fail the checkout if email fails
      }
    }

    console.log("[square] ========== CHECKOUT SUCCESS ==========")
    return NextResponse.json({
      payment: paymentData.payment,
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
