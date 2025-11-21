import StorefrontPage from "@/components/storefront/storefront-page"
import { getInventoryList } from "@/lib/server/inventory-source"

export default async function Storefront() {
  const { items, source } = await getInventoryList()
  return <StorefrontPage initialProducts={items} initialSource={source} />
}
