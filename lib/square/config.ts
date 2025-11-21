const env = process.env.SQUARE_ENV || "sandbox"

const APPLICATION_IDS = {
  sandbox: process.env.SQUARE_SANDBOX_ID,
  production: process.env.SQUARE_PROD_ID,
}

const ACCESS_TOKENS = {
  sandbox: process.env.SQUARE_SANDBOX_TOKEN,
  production: process.env.SQUARE_PROD_TOKEN,
}

const locationId = process.env.LOCATION_ID || ""

export const squareConfig = {
  env,
  applicationId: APPLICATION_IDS[env as "sandbox" | "production"] || "",
  accessToken: ACCESS_TOKENS[env as "sandbox" | "production"] || "",
  locationId,
}

export const isSquareConfigured =
  Boolean(squareConfig.applicationId && squareConfig.accessToken && squareConfig.locationId)
