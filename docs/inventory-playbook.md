# La Esquinita Inventory Naming & Metadata Rules

## File System Structure
- All source images live inside `public/La_Esquinita_Inventory/`.
- Each object has two required images: `{number}_{label}_1.jpg` (hero) and `{number}_{label}_2.jpg` (underside showing the number). Any optional alternates would follow `{number}_{label}_3.jpg`, etc., and get appended to galleries automatically.

## Numbering & Titles
- The numeric prefix is the single source of truth for the object’s identity. We display it as `No. XX` (no padding in the UI) but store a zero-padded string for sorting/search (`021`).
- Titles are auto-generated from the filename label: `"Parrot"` becomes `Parrot`, `snake_planter` becomes `Snake Planter`. We can layer manual overrides via a JSON map if needed later.
- Slugs follow the format `{zero-padded-number}-{kebab-label}` → `021-parrot`.

## Metadata Defaults
- Each item receives: `inventory_number` (int), `display_number` (`"No. 21"`), `slug`, `title`, `description` (generic template), `alt_text` (generic), `primary_image`, `secondary_image`, `gallery` (array), `status` (`available` by default), and optional `square_catalog_object_id`.
- Pricing, categories, and tags come from a lookup table keyed on the label (e.g., `parrot`, `pie`, `ashtray`). Anything unknown falls back to a generic “Object” category until we override it.
- Descriptions stay neutral: `"Hand-built ceramic Parrot from the La Esquinita inventory."`
- Additional Supabase columns added in `docs/supabase-inventory-migration.sql` (underside image, Square catalog IDs/SKUs, `is_unique`, `sold_at`, and optional dimensions) are filled automatically by the generator.

## Image Pairing Logic
- `_1` is always the clean product beauty shot used for cards and hero.
- `_2` shows the underside/number and appears as the second gallery slide and as the rollover image for cards.
- `_3+` images are optional; if present we simply append them to the gallery in numeric order.

## Status & Square Integration
- Every ingest sets `status = "available"` and clears `sold_at`.
- When we kick off the Square checkout integration, the checkout route will mark items `reserved` before payment, then `sold` with `sold_at` timestamp + `square_order_id` on success. Reservations auto-expire via cron/script.
- Since the inventory number is canonical, Square catalog objects, Supabase rows, and storefront cards all reference the same number to avoid mismatches.

## Overrides & Future-proofing
- Any exceptions (custom titles, specific descriptions, manual prices) live in `inventory-overrides.json` which the ingestion script merges after parsing filenames.
- The script also emits a JSON preview for manual QA before pushing rows into Supabase.

Locking these rules now keeps the eventual 250-object import fast, search-friendly, and in sync with the gallery flow.  🎂🦩

## Generation Script
- Run `npm run inventory:generate` anytime new assets land in `public/La_Esquinita_Inventory/`.
- Add `--supabase` to push rows straight into Supabase (`NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` required, table defaults to `products` but can be overridden with `SUPABASE_INVENTORY_TABLE`).
- The command compiles `scripts/generate-inventory.ts`, scans the folder, and writes `/data/generated-inventory.json` which powers the storefront and product detail previews.
