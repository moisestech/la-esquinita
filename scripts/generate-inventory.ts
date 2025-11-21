import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"
import { InventoryRecord } from "../types/inventory"

const INVENTORY_DIR = path.resolve(process.cwd(), "public", "La_Esquinita_Inventory")
const OUTPUT_DIR = path.resolve(process.cwd(), "data")
const OUTPUT_FILE = path.join(OUTPUT_DIR, "generated-inventory.json")
const args = process.argv.slice(2)
const shouldSyncSupabase = args.includes("--supabase")

type MetadataDefaults = {
  price: number
  category: string
  tags: string[]
}

const EGG_METADATA: MetadataDefaults = {
  price: 60,
  category: "ceramic-object",
  tags: ["egg", "ceramic", "limited"],
}

const LABEL_METADATA: Record<string, MetadataDefaults> = {
  pie: { price: 140, category: "ceramic-object", tags: ["pie", "ceramic", "one-of-one"] },
  parrot: { price: 175, category: "ceramic-object", tags: ["parrot", "ceramic", "one-of-one"] },
  "cake-topper": { price: 70, category: "ceramic-object", tags: ["cake", "topper", "ceramic"] },
  "tuba-ash-tray": { price: 55, category: "ceramic-object", tags: ["tuba", "ashtray", "ceramic"] },
  "wounded-mug": { price: 70, category: "ceramic-object", tags: ["mug", "ceramic", "limited"] },
}

const DEFAULT_METADATA: MetadataDefaults = {
  price: 160,
  category: "ceramic-object",
  tags: ["ceramic", "limited"],
}

type PriceRule = {
  test: (slug: string) => boolean
  price: number
}

const PRICE_RULES: PriceRule[] = [
  { test: (slug) => slug.includes("et-and-ufo"), price: 100 },
  { test: (slug) => slug.includes("et") && !slug.includes("ufo"), price: 75 },
  { test: (slug) => slug === "ufo" || slug.endsWith("-ufo"), price: 100 },
  { test: (slug) => slug.includes("yoda"), price: 200 },
  { test: (slug) => slug.includes("pie"), price: 50 },
  { test: (slug) => slug.includes("egg"), price: 60 },
  { test: (slug) => slug.includes("fragile"), price: 100 },
  { test: (slug) => slug.includes("parrot"), price: 200 },
  { test: (slug) => slug.includes("tuba"), price: 75 },
  { test: (slug) => slug.includes("cake"), price: 60 },
  { test: (slug) => slug.includes("flamingo"), price: 100 },
  { test: (slug) => slug.includes("club-dish"), price: 60 },
  { test: (slug) => slug.includes("broken-swan"), price: 50 },
  { test: (slug) => slug.includes("swan"), price: 200 },
  { test: (slug) => slug.includes("potato"), price: 75 },
  { test: (slug) => slug.includes("diamond"), price: 60 },
  { test: (slug) => slug.includes("lobster"), price: 75 },
  { test: (slug) => slug.includes("ornate-pitcher"), price: 200 },
  { test: (slug) => slug.includes("cat-head"), price: 100 },
  { test: (slug) => slug.includes("baby"), price: 100 },
  { test: (slug) => slug.includes("wall") && slug.includes("fish"), price: 75 },
  { test: (slug) => slug.includes("wave"), price: 100 },
  { test: (slug) => slug.includes("dish"), price: 200 },
]

const STATUS_OVERRIDES: Record<number, { status: "sold"; soldAt?: string }> = {
  6: { status: "sold" },
  181: { status: "sold" },
  246: { status: "sold" },
  269: { status: "sold" },
}

function applyPriceRules(slug: string, basePrice: number) {
  const match = PRICE_RULES.find((rule) => rule.test(slug))
  return match ? match.price : basePrice
}

type ParsedAsset = {
  number: number
  label: string
  variant: number
  filename: string
}

const LABEL_NAME_OVERRIDES: Record<string, string> = {
  tubaash: "Tuba Ash Tray",
  woundmug: "Wounded Mug",
  woundedmug: "Wounded Mug",
  etandufo: "ET and UFO",
  etandufoufo: "ET and UFO",
}

const IMAGE_PATTERN =
  /^(\d+)_([A-Za-z0-9-]+(?:_[A-Za-z0-9-]+)*)_(\d+)\.(jpg|jpeg|png)$/i

function titleize(label: string) {
  return label
    .split(/[_\s-]+/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(" ")
}

function slugify(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
}

function humanizeLabel(raw: string) {
  const overrideKey = raw.replace(/[^A-Za-z0-9]/g, "").toLowerCase()
  if (LABEL_NAME_OVERRIDES[overrideKey]) {
    return LABEL_NAME_OVERRIDES[overrideKey]
  }

  return raw
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function padNumber(value: number) {
  return String(value).padStart(3, "0")
}

function descriptionFor(title: string) {
  return `Hand-poured ceramic ${title} from the La Esquinita inventory.`
}

function altTextFor(displayNumber: string, title: string) {
  return `${displayNumber} ${title} ceramic object`
}

function parseFiles(): ParsedAsset[] {
  if (!fs.existsSync(INVENTORY_DIR)) {
    throw new Error(`Inventory folder missing: ${INVENTORY_DIR}`)
  }

  const files = fs.readdirSync(INVENTORY_DIR)
  const assets: ParsedAsset[] = []

  for (const filename of files) {
    const match = filename.match(IMAGE_PATTERN)

    if (!match) {
      console.warn(`Skipping unrecognized filename: ${filename}`)
      continue
    }

    const [, numberRaw, labelRaw, variantRaw] = match
    assets.push({
      number: Number(numberRaw),
      label: labelRaw,
      variant: Number(variantRaw),
      filename,
    })
  }

  return assets
}

function groupAssets(assets: ParsedAsset[]) {
  const grouped = new Map<
    string,
    { number: number; label: string; images: ParsedAsset[] }
  >()

  for (const asset of assets) {
    const key = `${asset.number}_${asset.label.toLowerCase()}`
    if (!grouped.has(key)) {
      grouped.set(key, { number: asset.number, label: asset.label, images: [] })
    }

    grouped.get(key)!.images.push(asset)
  }

  return grouped
}

function buildRecords(grouped: Map<string, { number: number; label: string; images: ParsedAsset[] }>) {
  const records: InventoryRecord[] = []

  for (const { number, label, images } of Array.from(grouped.values()).sort(
    (a, b) => a.number - b.number
  )) {
    const humanLabel = humanizeLabel(label)
    const normalizedLabel = humanLabel.replace(/\s+/g, "_")
    const labelSlug = slugify(humanLabel)
    const title = titleize(humanLabel)
    const padded = padNumber(number)
    const slug = `${padded}-${labelSlug}`
    const displayNumber = `No. ${number}`
    const metadata = LABEL_METADATA[labelSlug] ?? (labelSlug.startsWith("egg-") ? EGG_METADATA : DEFAULT_METADATA)
    const price = applyPriceRules(labelSlug, metadata.price)

    const gallery = images
      .sort((a, b) => a.variant - b.variant)
      .map((asset) => `/La_Esquinita_Inventory/${asset.filename}`)

    if (gallery.length === 0) {
      console.warn(`No images found for ${displayNumber} (${label})`)
      continue
    }

    const record: InventoryRecord = {
      inventoryNumber: number,
      numberPadded: padded,
      label: normalizedLabel,
      labelSlug,
      title,
      displayNumber,
      slug,
      description: descriptionFor(title),
      altText: altTextFor(displayNumber, title),
      price,
      category: metadata.category,
      tags: metadata.tags,
      primaryImage: gallery[0],
      undersideImage: gallery[1],
      gallery,
      availability: "available",
      status: "active",
      dimensions: null,
      squareSku: null,
      isUnique: true,
      soldAt: null,
      squareCatalogObjectId: null,
    }

    const override = STATUS_OVERRIDES[number]
    if (override) {
      record.status = override.status
      record.availability = "sold"
      record.soldAt = override.soldAt ?? new Date().toISOString()
    }

    records.push(record)
  }

  return records
}

async function syncRecordsToSupabase(records: InventoryRecord[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.warn("Supabase credentials missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to sync.")
    return
  }

  const table = process.env.SUPABASE_INVENTORY_TABLE || "products"
  const supabase = createClient(supabaseUrl, serviceKey)
  const payload = records.map((record) => ({
    slug: record.slug,
    name: `${record.displayNumber} · ${record.title}`,
    price: record.price,
    description: record.description,
    image_urls: record.gallery,
    status: record.availability === "sold" ? "archived" : "active",
    category: record.category,
    tags: record.tags,
    inventory_number: record.inventoryNumber,
    display_number: record.displayNumber,
    primary_image: record.primaryImage,
    underside_image: record.undersideImage ?? null,
    square_catalog_object_id: record.squareCatalogObjectId,
    square_sku: record.squareSku,
    dimensions: record.dimensions,
    sold_at: record.soldAt,
    is_unique: record.isUnique,
  }))

  const { error } = await supabase.from(table).upsert(payload, {
    onConflict: "slug",
  })

  if (error) {
    throw error
  }

  console.log(`Synced ${payload.length} inventory rows → Supabase table "${table}"`)
}

async function run() {
  const parsed = parseFiles()
  const grouped = groupAssets(parsed)
  const records = buildRecords(grouped)

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(records, null, 2))
  console.log(
    `Generated ${records.length} inventory items → ${path.relative(process.cwd(), OUTPUT_FILE)}`
  )

  if (shouldSyncSupabase) {
    await syncRecordsToSupabase(records)
  } else {
    console.log('Skipping Supabase sync (run with "--supabase" to push rows).')
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
