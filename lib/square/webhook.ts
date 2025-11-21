import crypto from "crypto"

const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || ""
const notificationUrlEnv = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL || ""

export const isSquareWebhookConfigured = Boolean(signatureKey && notificationUrlEnv)

export function verifySquareSignature(request: Request, rawBody: string) {
  if (!isSquareWebhookConfigured) {
    return false
  }

  const signatureHeader = request.headers.get("x-square-signature")
  if (!signatureHeader) return false

  const notificationUrl = notificationUrlEnv
  const hmac = crypto.createHmac("sha1", signatureKey)
  hmac.update(notificationUrl + rawBody)
  const digest = hmac.digest("base64")
  const signatureBuffer = Buffer.from(signatureHeader)
  const digestBuffer = Buffer.from(digest)
  if (signatureBuffer.length !== digestBuffer.length) return false
  return crypto.timingSafeEqual(signatureBuffer, digestBuffer)
}
