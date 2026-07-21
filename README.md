# Macropage Admin

NestJS monorepo (Nest CLI monorepo mode) with three apps:

- **`macropage-connect`** — fully built admin backend (customers, plans, message logs/stats, notifications, tags, ads, templates, dashboard stats, support tickets + live chat).
- **`mrfuels-transact`** — fully built admin backend for the mr-fuels petrol-pump SaaS product (customers, plans, tags, ads, dashboard stats, support tickets + live chat).
- **`macropage`** — placeholder app, not yet built out.

Shared code (filters, interceptors, decorators, pagination helper) lives in `libs/common`, importable as `@app/common`.

## Important: this reads/writes the real macropage-connect product database

`macropage-connect`'s MongoDB is the **live database of the actual Macropage Connect WhatsApp SaaS product** (see [github.com/Satyam1013/macropage-connect](https://github.com/Satyam1013/macropage-connect)) — not a dedicated database for this admin panel. A "customer" here is a tenant account: a `users` doc with `role: 'OWNER'`.

- `apps/macropage-connect/src/external/schemas/` mirrors the real backend's `User`, `Subscription`, `Payment`, `Message`, `Notification` schemas. These are **read-only** except `Notification` — admin broadcasts are inserted there so tenants see them in their existing in-app notification feed (`{ tenantId, userId }` shape, matches the real backend's query exactly).
- Plan pricing (`plans/plans.catalog.ts`) is hardcoded, mirroring the real backend's `billing/plans.config.ts` — there is no "plans" collection. Keep it in sync manually if the real catalog changes.
- `notification_templates`, `tags`, `ads`, `tickets`, `chatmessages`, `adminusers`, `adminbroadcasts` are collections **owned by this admin app** — safe to write freely. Notably `notification_templates` is a deliberately different collection from the real backend's `templates` (which holds Meta-approved WhatsApp Business templates — an unrelated, live-data concept this app must never touch).
- Customer tag membership lives on the `Tag` doc itself (`customerIds: string[]`), not on the real `users` doc — this app never mutates the real backend's user records.
- `customers`, `plans`, `messages` endpoints never create/update/delete against `users`/`subscriptions`/`payments`/`messages` — those are owned by the real product's own signup/billing/messaging flows.

## Important: this also reads/writes the real mrfuels-transact (mr-fuels) product database

`mrfuels-transact`'s MongoDB is the **live database of the mr-fuels petrol-pump management SaaS** (see [github.com/Satyam1013/mr-fuels](https://github.com/Satyam1013/mr-fuels)) — a completely different domain from macropage-connect. A "customer" here is a pump-owner subscriber: **every** doc in the real `admins` collection (Manager/Staff accounts live in separate `managers`/`staffs` collections, so no role filter is needed or applied — the real `role` field is missing on ~58 of 74 admin docs from before it existed, so filtering by it would silently drop most customers).

- `apps/mrfuels-transact/src/external/schemas/` mirrors the real `Admin` and `Subscription` schemas. **Read-only.** `password` is always stripped from API responses.
- Unlike macropage-connect, mr-fuels' **plan catalog is a real DB collection** (`plans`) with no separate hardcoded config — so `plans` here has **full CRUD**, mirroring the real `Plan` schema exactly (nested `duration`/`pricing`/`trial`/`tags`/`ui`).
- Each `Subscription` doc is one plan-selection event (the real `AdminService.selectPlan` creates a new doc every time, never updates in place) — so the `subscriptions` collection **is** the purchase/renewal history directly; no separate payment-gateway log exists yet in the real backend (SaaS billing there is still "future Stripe/Razorpay").
- The real backend has **no messaging/notification/WhatsApp infrastructure at all** — so unlike macropage-connect, there is no `messages` or `notifications` module here. `payment`/`transactions` modules that exist in the real repo are the pump's own daily UPI/POS operational data, unrelated to SaaS billing.
- `tags`, `ads`, `tickets`, `chatmessages`, `adminusers` are collections **owned by this admin app**, same pattern as macropage-connect (tag membership lives on the `Tag` doc's `customerIds[]`).
- Note: in the real data, `Subscription.adminId`/`planId` are stored as plain **strings**, not BSON ObjectId, despite the real Mongoose schema declaring `Types.ObjectId` — the external schema mirrors intentionally use `String` so queries actually match.

## Setup

```bash
npm install
cp .env.example .env   # fill in MACROPAGE_CONNECT_MONGODB_URI, JWT_SECRET, TWILIO_* etc.
npm run seed:admin     # creates the first admin user from ADMIN_EMAIL/ADMIN_PASSWORD in .env
npm run start:dev:macropage-connect
```

Server listens on `PORT` (default 3000) with global prefix `/api`. All routes require a JWT (`Authorization: Bearer <token>`) except `POST /api/auth/login`.

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@macropage.com","password":"change-me-123"}'
```

## Modules (macropage-connect)

| Module | Routes | Notes |
|---|---|---|
| `auth` | `POST /auth/login` | JWT admin login, roles: `super-admin`, `support-agent`. Own `adminusers` collection, unrelated to the real product's `users`. |
| `customers` | `GET /customers`, `GET /customers/:id`, `GET /customers/:id/profile` | Read-only over the real `users` collection (`role: OWNER`); profile aggregates current subscription + payment history + message stats + tags. Auth fields (`password`, `twoFactorSecret`, etc.) are always stripped. |
| `plans` | `GET /plans`, `GET /plans/customer/:tenantId`, `GET /plans/customer/:tenantId/current` | Hardcoded catalog + read-only over real `subscriptions`/`payments` — each `Payment` doc is one purchase/renewal event. |
| `messages` | `/messages/logs`, `/messages/stats` | Read-only over the real `messages` collection, filtered to `direction: OUTBOUND`; day/month/custom-range stats. |
| `tags` | `/tags`, `/tags/assign` | Admin-owned. Membership lives on the `Tag` doc (`customerIds[]`), not on the real user doc. |
| `templates` | `/templates` | Admin-owned `notification_templates` collection — distinct from the real `templates` (WhatsApp Business templates). |
| `notifications` | `/notifications/broadcast`, `/notifications/send` | `channel: 'in_app'` writes into the real `notifications` collection (tenant sees it in their own feed); `channel: 'whatsapp'` sends via Twilio to the customer's phone. Send history logged in admin-owned `adminbroadcasts`. |
| `ads` | `/ads`, `/ads/active` | Admin-owned. Popups/banners, targeting all/tag/customer. |
| `stats` | `/stats/dashboard` | `totalCustomers` from `users` (OWNER), `totalEnrolledCustomers` from `subscriptions` (ACTIVE), message counts from real `messages`. |
| `support/tickets` | `/support/tickets` | Admin-owned, support ticket CRUD. |
| `support/chat` | Socket.io `/support-chat` | Admin-owned. Live chat, JWT-authenticated handshake, rooms per `ticketId` (events: `joinTicket`, `sendMessage`, `history`, `newMessage`). |

## Modules (mrfuels-transact)

| Module | Routes | Notes |
|---|---|---|
| `auth` | `POST /auth/login` | Own `adminusers` collection, separate database from macropage-connect. |
| `customers` | `GET /customers`, `GET /customers/:id`, `GET /customers/:id/profile` | Read-only over the real `admins` collection; profile aggregates current subscription + full plan history + tags. |
| `plans` | `/plans` (full CRUD), `/plans/customer/:adminId`, `/plans/customer/:adminId/current` | Full CRUD over the real `plans` collection; history/current read from real `subscriptions`. |
| `tags` | `/tags`, `/tags/assign` | Same pattern as macropage-connect. |
| `ads` | `/ads`, `/ads/active` | Same pattern as macropage-connect. |
| `stats` | `/stats/dashboard` | `totalCustomers` from `admins`, `totalEnrolledCustomers` from `subscriptions` (active). |
| `support/tickets`, `support/chat` | `/support/tickets`, Socket.io `/support-chat` | Same pattern as macropage-connect. |

## Scripts

- `npm run build` / `build:macropage-connect` / `build:macropage` / `build:mrfuels-transact` / `build:all`
- `npm run start:dev:macropage-connect` / `start:dev:mrfuels-transact` / `start:dev:macropage`
- `npm run seed:admin` — upserts a macropage-connect admin user from `.env` (`ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME`)
- `npm run seed:mrfuels-admin` — upserts an mrfuels-transact admin user from `.env` (`MRFUELS_TRANSACT_ADMIN_EMAIL`/`MRFUELS_TRANSACT_ADMIN_PASSWORD`/`MRFUELS_TRANSACT_ADMIN_NAME`)
- `npm run lint`, `npm test`
