import ProductDetailPage from "@/components/product-detail/product-detail-page"
import { getInventoryItem, getInventoryList } from "@/lib/server/inventory-source"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 60

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const listResult = await getInventoryList()
  const listMatch =
    listResult.items.find(
      (item) => item.slug === slug || item.inventoryNumber === Number(slug)
    ) ?? null

  const itemResult = listMatch
    ? { item: listMatch, source: listResult.source }
    : await getInventoryItem(slug)

  return (
    <ProductDetailPage
      slug={slug}
      initialProduct={itemResult.item}
      initialSource={itemResult.source}
      relatedProducts={listResult.items}
    />
  )
}
