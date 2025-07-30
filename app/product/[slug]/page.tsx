import ProductDetailPage from "@/components/product-detail/product-detail-page"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  return <ProductDetailPage slug={slug} />
} 