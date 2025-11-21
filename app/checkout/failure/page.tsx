import CheckoutFailureScreen from "./failure-screen"

export default function CheckoutFailurePage({ searchParams }: any) {
  const reasonParam = searchParams?.reason
  const reason = Array.isArray(reasonParam) ? reasonParam[0] : reasonParam || null
  return <CheckoutFailureScreen reason={reason} />
}
