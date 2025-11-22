import { squareConfig, isSquareConfigured } from "./config"
// The Square SDK is CommonJS-only; require + loosen typing to keep Next.js happy.
const squareSdk = require("square") as any
const { SquareClient, SquareEnvironment } = squareSdk

type SquareClientInstance = any
let cachedClient: SquareClientInstance | null = null

export const getSquareClient = () => {
  console.log("[square client] getSquareClient called")
  console.log("[square client] isSquareConfigured=%s", isSquareConfigured)

  if (!isSquareConfigured) {
    console.error("[square client] Square not configured!")
    throw new Error("Square credentials are not configured. Check environment variables.")
  }

  if (cachedClient) {
    console.log("[square client] Returning cached client")
    return cachedClient
  }

  const environment =
    squareConfig.env === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox

  console.log("[square client] Creating new SquareClient")
  console.log("[square client] environment=%s", environment)
  console.log("[square client] accessToken prefix=%s", squareConfig.accessToken?.slice(0, 6))

  cachedClient = new SquareClient({
    accessToken: squareConfig.accessToken,
    environment,
  })

  console.log("[square client] SquareClient created successfully")
  return cachedClient
}
