// Test Square OAuth token directly
const token = "EAAAlqmRVP_Br2ZWwJMWRTlK9WiNjLNYPaGN2TNeLPukbCK52meYCxRs1_6Z2Mqo"
const locationId = "LF4VBFSP4APJ8"

async function testSquareToken() {
  console.log("Testing Square OAuth token...")
  console.log("Token:", token.slice(0, 10) + "***")
  console.log("Location ID:", locationId)
  console.log("")

  // Test 1: Get location
  console.log("TEST 1: Fetching location...")
  const locationResponse = await fetch(`https://connect.squareup.com/v2/locations/${locationId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Square-Version": "2024-07-17",
    }
  })

  const locationData = await locationResponse.json()
  console.log("Location response status:", locationResponse.status)
  console.log("Location response:", JSON.stringify(locationData, null, 2))
  console.log("")

  // Test 2: Create a test order
  console.log("TEST 2: Creating test order...")
  const orderResponse = await fetch("https://connect.squareup.com/v2/orders", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Square-Version": "2024-07-17",
    },
    body: JSON.stringify({
      idempotency_key: `test-${Date.now()}`,
      order: {
        location_id: locationId,
        line_items: [
          {
            name: "Test Item",
            quantity: "1",
            base_price_money: {
              amount: 100,
              currency: "USD"
            }
          }
        ]
      }
    })
  })

  const orderData = await orderResponse.json()
  console.log("Order response status:", orderResponse.status)
  console.log("Order response:", JSON.stringify(orderData, null, 2))
  console.log("")

  if (orderResponse.status === 401) {
    console.error("❌ TOKEN IS UNAUTHORIZED!")
    console.error("This means the OAuth token doesn't have permission to create orders.")
  } else if (orderResponse.ok) {
    console.log("✅ TOKEN WORKS! Order created successfully!")
  } else {
    console.error("⚠️  Unexpected error:", orderData)
  }
}

testSquareToken().catch(console.error)
