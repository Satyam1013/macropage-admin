# Macropage Admin

NestJS monorepo (Nest CLI monorepo mode) with two apps:

- **`admin`** — the unified admin backend. One process, one deployment, one login, connects to **both** product databases (macropage-connect + mr-fuels) at once via two Mongoose connections, and exposes both under one URL: `/api/macropage-connect/*` and `/api/mr-fuels/*`.
- **`macropage`** — placeholder app (static site), not yet built out.

Shared code (filters, interceptors, decorators, pagination helper) lives in `libs/common`, importable as `@app/common`.

## Structure

```
apps/admin/src/
├── main.ts, app.module.ts       # dual MongooseModule.forRootAsync: default connection = macropage-connect DB, named 'mrFuels' connection = mr-fuels DB
├── auth/                        # SHARED login for both products — one `adminusers` collection, lives in the macropage-connect (default) DB
├── macropage-connect/           # everything mounted under /api/macropage-connect/*, models on the default connection
│   ├── customers/ plans/ messages/ tags/ templates/ notifications/ ads/ stats/ support/ help/ upload/
│   └── external/                # read-only mirrors of the real macropage-connect backend's schemas
└── mr-fuels/                    # everything mounted under /api/mr-fuels/*, models on the 'mrFuels' named connection
    ├── customers/ plans/ tags/ ads/ stats/ support/
    └── external/                # read-only mirrors of the real mr-fuels backend's schemas
```

One JWT (from `POST /api/auth/login`) works for every route in both namespaces.

## Important: this reads/writes two real, live product databases

Neither product's MongoDB is dedicated to this admin panel — both are the **live databases of the actual products**.

### macropage-connect (WhatsApp SaaS — [github.com/Satyam1013/macropage-connect](https://github.com/Satyam1013/macropage-connect))

A "customer" here is a tenant account: a `users` doc with `role: 'OWNER'`.

- `macropage-connect/external/schemas/` mirrors the real `User`, `Subscription`, `Payment`, `Message`, `Notification` schemas. **Read-only** except `Notification` — admin broadcasts are inserted there so tenants see them in their existing in-app notification feed (`{ tenantId, userId }` shape, matches the real backend's query exactly).
- Plan pricing (`plans/plans.catalog.ts`) mirrors the real portal's `PLAN_PRICING` (`billing.constants.ts`) exactly — the actual customer-facing pricing (monthly/quarterly/yearly, savings, badges, features), not the internal `billing/plans.config.ts` (Razorpay plan IDs only). Hardcoded — there is no "plans" DB collection. Keep in sync manually if the real portal's pricing changes.
- `notification_templates`, `tags`, `ads`, `tickets`, `chatmessages`, `adminbroadcasts` are collections **owned by this admin app** — safe to write freely. `notification_templates` is deliberately distinct from the real `templates` collection (Meta-approved WhatsApp Business templates — never touch it).
- `helpdocs`/`helpfaqs` (via the `help` module) **are** the real backend's live self-serve help-center collections — the admin app writes here directly (the real backend only ever exposed read endpoints for these).
- `upload` writes tutorial media to the real product's own DigitalOcean Spaces bucket, under a distinct `admin-tutorials/` key prefix.
- Customer tag membership lives on the `Tag` doc itself (`customerIds: string[]`), not on the real `users` doc.
- `customers`/`plans`/`messages` never create/update/delete against `users`/`subscriptions`/`payments`/`messages` — those are owned by the real product's own signup/billing/messaging flows.

### mr-fuels (petrol-pump SaaS — [github.com/Satyam1013/mr-fuels](https://github.com/Satyam1013/mr-fuels))

A completely different domain. A "customer" here is a pump-owner subscriber: **every** doc in the real `admins` collection (Manager/Staff accounts live in separate `managers`/`staffs` collections — no role filter is applied, since the real `role` field is missing on ~58 of 74 admin docs from before it existed).

- `mr-fuels/external/schemas/` mirrors the real `Admin` and `Subscription` schemas. **Read-only.** `password` always stripped from responses.
- Unlike macropage-connect, mr-fuels' **plan catalog is a real DB collection** (`plans`) — so `mr-fuels/plans` has **full CRUD**, mirroring the real `Plan` schema exactly (nested `duration`/`pricing`/`trial`/`tags`/`ui`).
- Each `Subscription` doc is one plan-selection event (never updated in place) — so `subscriptions` **is** the purchase/renewal history directly; no separate payment-gateway log exists yet in the real backend.
- No messaging/notification/WhatsApp infrastructure exists in the real backend — there is no `messages` or `notifications` module for mr-fuels.
- `tags`, `ads`, `tickets`, `chatmessages` are collections **owned by this admin app**, same pattern as macropage-connect, but stored in the mr-fuels DB (named `mrFuels` connection).
- `Subscription.adminId`/`planId` are stored as plain **strings** in the real data (not BSON ObjectId, despite the real Mongoose schema declaring `Types.ObjectId`) — the external schema mirrors intentionally use `String` so queries actually match.

## Setup

```bash
npm install
cp .env.example .env   # fill in MACROPAGE_CONNECT_MONGODB_URI, MRFUELS_TRANSACT_MONGODB_URI, JWT_SECRET, DO_SPACES_*, etc.
npm run seed:admin     # creates the one shared admin user from ADMIN_EMAIL/ADMIN_PASSWORD in .env
npm run start:dev:admin
```

Server listens on `PORT` (default 3000) with global prefix `/api`. All routes require a JWT (`Authorization: Bearer <token>`) except `POST /api/auth/login`.

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@macropage.com","password":"change-me-123"}' \
  | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

curl http://localhost:3000/api/macropage-connect/customers -H "Authorization: Bearer $TOKEN"
curl http://localhost:3000/api/mr-fuels/customers -H "Authorization: Bearer $TOKEN"
```

## Modules — macropage-connect (`/api/macropage-connect/*`)

| Module | Routes | Notes |
|---|---|---|
| `customers` | `/customers`, `/customers/:id`, `/customers/:id/profile` | Read-only over real `users` (`role: OWNER`); profile aggregates subscription + payment history + message stats + tags. Auth fields always stripped. |
| `plans` | `/plans`, `/plans/customer/:tenantId`, `/plans/customer/:tenantId/current` | Hardcoded portal pricing catalog + read-only over real `subscriptions`/`payments`. |
| `messages` | `/messages/logs`, `/messages/stats` | Read-only over real `messages`, `direction: OUTBOUND`; day/month/custom-range stats. |
| `tags` | `/tags`, `/tags/assign` | Admin-owned. |
| `templates` | `/templates` | Admin-owned `notification_templates`. |
| `notifications` | `/notifications/broadcast`, `/notifications/send` | `in_app` writes into real `notifications`; `whatsapp` sends via Twilio. |
| `ads` | `/ads`, `/ads/active` | Admin-owned popups/banners. |
| `stats` | `/stats/dashboard` | Totals + message counts. |
| `help/docs`, `help/faqs` | `/help/docs`, `/help/faqs` | Full CRUD over the real, live self-serve help-center collections. |
| `upload` | `POST /upload/tutorial` | Uploads media to DO Spaces, returns a public URL. |
| `support/tickets`, `support/chat` | `/support/tickets`, Socket.io `/macropage-connect/support-chat` | Admin-owned. |

## Modules — mr-fuels (`/api/mr-fuels/*`)

| Module | Routes | Notes |
|---|---|---|
| `customers` | `/customers`, `/customers/:id`, `/customers/:id/profile` | Read-only over real `admins`. |
| `plans` | `/plans` (full CRUD), `/plans/customer/:adminId`, `/plans/customer/:adminId/current` | Full CRUD over real `plans`; history/current from real `subscriptions`. |
| `tags` | `/tags`, `/tags/assign` | Admin-owned. |
| `ads` | `/ads`, `/ads/active` | Admin-owned. |
| `stats` | `/stats/dashboard` | Totals from `admins`/`subscriptions`. |
| `support/tickets`, `support/chat` | `/support/tickets`, Socket.io `/mr-fuels/support-chat` | Admin-owned. |

## Scripts

- `npm run build` / `build:admin` / `build:macropage` / `build:all`
- `npm run start:dev:admin` / `start:dev:macropage`
- `npm run seed:admin` — upserts the one shared admin user from `.env` (`ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME`)
- `npm run lint`, `npm test`
