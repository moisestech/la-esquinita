import ProductDetailPage from "@/components/product-detail/product-detail-page"
import { getInventoryItem, getInventoryList } from "@/lib/server/inventory-source"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const [itemResult, listResult] = await Promise.all([
    getInventoryItem(slug),
    getInventoryList(),
  ])

  return (
    <ProductDetailPage
      slug={slug}
      initialProduct={itemResult.item}
      initialSource={itemResult.source}
      relatedProducts={listResult.items}
    />
  )
}
