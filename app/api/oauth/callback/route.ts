import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }

  // Exchange code for token
  console.log("SQUARE_PROD_ID:", process.env.SQUARE_PROD_ID)
  console.log("SQUARE_PROD_SECRET exists:", !!process.env.SQUARE_PROD_SECRET)
  console.log("SQUARE_PROD_SECRET length:", process.env.SQUARE_PROD_SECRET?.length)

  const payload = {
    client_id: process.env.SQUARE_PROD_ID,
    client_secret: process.env.SQUARE_PROD_SECRET,
    code,
    grant_type: "authorization_code",
  }

  console.log("OAuth payload:", JSON.stringify(payload))

  const response = await fetch("https://connect.squareup.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Square-Version": "2024-07-17",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error("OAuth token exchange failed:", data)
    return NextResponse.json({ error: data }, { status: 500 })
  }

  // Return the token in a nice format
  return new NextResponse(
    `
    <html>
      <body style="font-family: monospace; padding: 20px;">
        <h1>OAuth Token Generated!</h1>
        <p><strong>Access Token:</strong></p>
        <textarea readonly style="width: 100%; height: 100px; font-family: monospace;">${data.access_token}</textarea>

        <p><strong>Refresh Token:</strong></p>
        <textarea readonly style="width: 100%; height: 100px; font-family: monospace;">${data.refresh_token}</textarea>

        <p><strong>Expires:</strong> ${data.expires_at}</p>

        <p>Copy the access token above and set it as SQUARE_PROD_TOKEN in Vercel!</p>

        <pre>${JSON.stringify(data, null, 2)}</pre>
      </body>
    </html>
    `,
    {
      headers: { "Content-Type": "text/html" },
    }
  )
}
