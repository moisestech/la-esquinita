import { squareConfig, isSquareConfigured } from "./config"
// The Square SDK is CommonJS-only; require + loosen typing to keep Next.js happy.
const squareSdk = require("square") as any
const { SquareClient, SquareEnvironment } = squareSdk

type SquareClientInstance = any
let cachedClient: SquareClientInstance | null = null

export const getSquareClient = () => {
  if (!isSquareConfigured) {
    throw new Error("Square credentials are not configured. Check environment variables.")
  }

  if (cachedClient) return cachedClient

  const environment =
    squareConfig.env === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox

  cachedClient = new SquareClient({
    accessToken: squareConfig.accessToken,
    environment,
  })

  return cachedClient
}
