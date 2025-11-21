import { Client, Environment } from "square"
import { squareConfig, isSquareConfigured } from "./config"

let cachedClient: Client | null = null

export const getSquareClient = () => {
  if (!isSquareConfigured) {
    throw new Error("Square credentials are not configured. Check environment variables.")
  }

  if (cachedClient) return cachedClient

  cachedClient = new Client({
    accessToken: squareConfig.accessToken,
    environment: squareConfig.env === "production" ? Environment.Production : Environment.Sandbox,
  })

  return cachedClient
}
