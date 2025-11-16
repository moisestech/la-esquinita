[ ] Confirm single source of truth for product data and capture Square Catalog object IDs per item

[ ] Design edition-aware product schema (parent product + limited editions/photos) and define sold-out thresholds

[ ] Choose storage platform (Supabase, managed Postgres, SQLite + Prisma, or Square Catalog) based on simplicity + integration needs

[ ] Stand up the chosen DB client in Next.js and persist the current catalog with edition metadata, pricing, and storage locations

[ ] Store per-edition inventory counts, image sets, and pricing (max 250 items) in the database

[ ] Design checkout architecture (Square hosted checkout vs Web Payments SDK) and capture required buyer fields

[ ] Implement storefront/product detail UI for selecting specific editions, showing per-edition availability, and disabling sold-out selections

[ ] Surface low-stock messaging on storefront cards ("1 left!" / "2 left!") and hide or disable cart interactions for sold-out products

[ ] Build secure Next.js API route/server action that validates cart contents and creates Square orders/checkout links

[ ] Update cart UI (storefront + navigation drawer) to call the new checkout endpoint instead of the placeholder button

[ ] After payment confirmation webhook, decrement edition inventory and mark sold-out editions/products in the database

[ ] Create orders storage + admin view and keep inventory in sync after each successful purchase

[ ] Configure Square webhooks, store credentials in env vars, and add processing logic to confirm payments + update inventory

[ ] Add customer communication touchpoints (confirmation email/template + order history screen) tied to webhook outcomes

[ ] Run end-to-end tests in Square Sandbox, document launch checklist, and prep prod credentials for the art show
