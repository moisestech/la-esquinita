# Sprint Plan v12 – La Esquinita 250-Item Storefront

## Sprint 1 – Inventory Assets & Metadata Pipeline
- [x] Document the naming convention for `public/La_Esquinita_Inventory` (number_label_variant.jpg) and lock rules for generating slugs, titles, and display numbers from filenames. *(See `docs/inventory-playbook.md` for canonical rules: `No. 21` display, zero-padded slugs like `021-parrot`, `_1` hero / `_2` underside, lookup-table metadata, etc.)*
- [x] Build a Node script (`scripts/generate-inventory.ts`) that scans the folder, pairs each `_1`/`_2` image, and emits structured data (inventory_number, name, slug, description placeholder, price, status, image_urls) for seeding/testing.
- [x] Wire the script to optionally push rows into Supabase via service-role key or dump JSON so we can load the first 3 objects now and the remaining ~247 as soon as assets arrive.
- [x] Define required metadata per object (price, category/tag taxonomy, dimensions, Square SKU, “sold_at”, “is_unique”) and capture it in a shared schema file (`types/inventory.ts`).
- [x] Add lightweight docs (`docs/inventory-playbook.md`) that explain how to rerun the ingestion whenever new numbered pairs show up.

## Sprint 2 – Supabase Schema & API Layer
- [x] Extend the `products` table (or create `inventory_items`) with columns for `inventory_number` (int), `display_number` (string), `primary_image`, `underside_image`, `square_catalog_object_id`, `sold_at`, and `is_unique`.
- [x] Write SQL migrations / seed data for Supabase (reference existing scripts in `docs/archive`) and regenerate `types/supabase.ts` so the frontend can rely on typed fields.
- [ ] Update `lib/supabase.ts` helpers to fetch by number, search both name & inventory number, and expose mutations for marking an item sold/reserved.
- [x] Add server-side API routes (`app/api/inventory/route.ts`, `app/api/inventory/[number]/route.ts`) that sit in front of Supabase for the storefront and for future admin tooling.
- [ ] Prototype an admin-only mutation (protected by service role key) to flip status back to `available` in case we need to restock or undo a Square sale.

## Sprint 3 – Storefront & Product Experience Refresh
- [ ] Replace placeholder product arrays with live Supabase queries so `/storefront` and `/product/[slug]` render real inventory (SSR for fast mobile loads, fallback client fetch for hydration).
- [ ] Add a sticky search input at the top of the storefront that filters by number while typing (“19” should match `19`, `190`, `191`, etc.) and scroll-locks to the first hit on mobile.
- [ ] Surface the inventory number on `ProductCard` and `ProductDetailPage`, add hover/secondary image swaps (`_2` photo) so shoppers immediately see the stamped number.
- [ ] Update cart behavior so unique objects are limited to quantity 1, and automatically disable “Add to cart” when Supabase says `status = sold` or when another shopper is checking out.
- [ ] Design a sold-out overlay/badge plus optional “text us about restocks” CTA so gallery visitors know an object is gone even if they still hold it physically.

## Sprint 4 – Square Checkout & Fulfillment Sync
- [ ] Configure Square environment variables (application ID, location ID, access token) in `.env.local` and create a server route (`app/api/checkout/square/route.ts`) that builds Square orders from the current cart.
- [ ] Implement the Square Web Payments SDK (or Checkout API redirect) so the drawer’s Checkout button actually starts a payment flow that works on desktop + mobile Safari.
- [ ] Upon checkout creation, soft-reserve items in Supabase (set `status = reserved`, store `square_order_id`, and expiration timestamp) to prevent double-selling.
- [ ] Add Square webhook handling (`app/api/square/webhook/route.ts`) to verify signatures, mark items `sold` on payment success, and release reservations on failure/timeout.
- [ ] Build success + failure pages that Square redirects back to, showing order summary, pickup instructions, and a button to keep browsing.

## Sprint 5 – Bulk Load, QA, and Launch Ops
- [ ] Run the ingestion pipeline on the initial 3 sample objects, validate the storefront end-to-end, then repeat for the remaining ~247 files as soon as they land.
- [ ] Stress-test the search bar, product page, and checkout on actual phones in the gallery (focus on 3G/poor Wi-Fi) and log any perf issues or Square latency.
- [ ] Create monitoring/alerts (Simple logging + Supabase row auditing) so we can confirm each Square order updates the DB and no duplicate numbers slip through.
- [ ] Document the nightly operation checklist: ingest new items, verify counts vs. physical shelf, reconcile Square payouts, and mark any manually sold pieces as `sold`.
- [ ] Prepare deployment steps (env secrets, Supabase URL/key swap, Vercel redeploy) and a rollback plan in case Square or Supabase acts up opening night.

[ ] lets make the mosquito bigger 
