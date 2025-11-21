const env = process.env.SQUARE_ENV || "sandbox"

const APPLICATION_IDS = {
  sandbox: process.env.SQUARE_SANDBOX_ID,
  production: process.env.SQUARE_PROD_ID,
}

const ACCESS_TOKENS = {
  sandbox: process.env.SQUARE_SANDBOX_TOKEN,
  production: process.env.SQUARE_PROD_TOKEN,
}

// Debug: log what we're actually seeing
if (typeof window === "undefined") {
  console.log("[square config] SQUARE_ENV=%s", env)
  console.log("[square config] Has SQUARE_SANDBOX_TOKEN=%s", !!process.env.SQUARE_SANDBOX_TOKEN)
  console.log("[square config] Has SQUARE_PROD_TOKEN=%s", !!process.env.SQUARE_PROD_TOKEN)
  console.log("[square config] Selected token prefix=%s", ACCESS_TOKENS[env as "sandbox" | "production"]?.slice(0, 6))
}

const LOCATION_IDS = {
  sandbox: process.env.SQUARE_SANDBOX_LOCATION_ID || process.env.LOCATION_ID,
  production: process.env.SQUARE_PROD_LOCATION_ID || process.env.LOCATION_ID,
}

const locationId = LOCATION_IDS[env as "sandbox" | "production"] || ""

export const squareConfig = {
  env,
  applicationId: APPLICATION_IDS[env as "sandbox" | "production"] || "",
  accessToken: ACCESS_TOKENS[env as "sandbox" | "production"] || "",
  locationId,
}

export const isSquareConfigured =
  Boolean(squareConfig.applicationId && squareConfig.accessToken && squareConfig.locationId)
