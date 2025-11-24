import CheckoutSuccessScreen from "./success-screen"

export default function CheckoutSuccessPage({ searchParams }: any) {
  const orderParam = searchParams?.orderId
  const paymentParam = searchParams?.paymentId
  const shippingParam = searchParams?.shipping
  const orderId = Array.isArray(orderParam)
    ? orderParam[0]
    : orderParam || (Array.isArray(paymentParam) ? paymentParam[0] : paymentParam) || null
  const needsShipping = shippingParam === "true"
  return <CheckoutSuccessScreen orderId={orderId} needsShipping={needsShipping} />
}
