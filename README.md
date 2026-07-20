# Macropage Admin

NestJS monorepo (Nest CLI monorepo mode) with three apps:

- **`macropage-connect`** — fully built admin backend (customers, plans, message logs/stats, notifications, tags, ads, templates, dashboard stats, support tickets + live chat). This is the app to run right now.
- **`macropage`** — placeholder app, not yet built out.
- **`mrfuels-transact`** — placeholder app, not yet built out.

Shared code (filters, interceptors, decorators, pagination helper) lives in `libs/common`, importable as `@app/common`.

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
| `auth` | `POST /auth/login` | JWT admin login, roles: `super-admin`, `support-agent` |
| `customers` | `/customers`, `/customers/:id/profile` | CRUD + aggregated profile (plan history + message stats) |
| `plans` | `/plans`, `/plans/purchase`, `/plans/customer/:id` | Plan catalog + purchase/renewal log |
| `messages` | `/messages/logs`, `/messages/stats` | Message send logs, day/month/custom-range stats |
| `tags` | `/tags`, `/tags/assign` | Customer tags |
| `templates` | `/templates` | Message templates with `{{variable}}` placeholders |
| `notifications` | `/notifications/broadcast`, `/notifications/send` | WhatsApp (Twilio) send to all or to tag/customer targets |
| `ads` | `/ads`, `/ads/active` | Popups/banners, targeting all/tag/customer |
| `stats` | `/stats/dashboard` | Total customers, enrolled, messages sent/failed today |
| `support/tickets` | `/support/tickets` | Support ticket CRUD |
| `support/chat` | Socket.io `/support-chat` | Live chat, JWT-authenticated handshake, rooms per `ticketId` (events: `joinTicket`, `sendMessage`, `history`, `newMessage`) |

## Scripts

- `npm run build` / `build:macropage-connect` / `build:macropage` / `build:mrfuels-transact` / `build:all`
- `npm run start:dev:macropage-connect` (and equivalents for the other two apps)
- `npm run seed:admin` — upserts an admin user from `.env`
- `npm run lint`, `npm test`
