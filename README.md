# SubSentry — Subscription Visibility & Gmail Intelligence Platform

SubSentry is a privacy‑first subscription intelligence system that helps users **discover, track, and optimize recurring payments**. It combines **manual subscription management** with **Gmail‑based ingestion** (read‑only) to surface hidden subscriptions, renewal risks, and spending trends.

This repo contains the **final Week‑6 build** of the project, organized as a production‑ready, modular full‑stack app.

---

## ✨ What SubSentry Delivers

**Core problem:** Most users have no clear view of *what they are subscribed to*, *when renewals happen*, or *how much they spend monthly*. SubSentry solves this with a system that:

- Detects subscriptions from Gmail receipts (read‑only)
- Normalizes vendors and deduplicates signals
- Tracks renewals, trials, and categories
- Provides analytics dashboards and alerts

---

## 🧠 How It Works (System Flow)

```
Gmail OAuth (Read‑Only) → Email Fetch → Parse & Score → Candidate Store → Save to Subscriptions

Manual Create → Subscription Store → Analytics / Alerts / Renewals UI
```

**Key intelligence steps:**
1. **Ingestion**: Gmail OAuth collects read‑only transactional email data.
2. **Parsing**: Emails are parsed to extract merchant, plan, price, date, and renewal pattern.
3. **Vendor Resolver + Confidence Scoring**: Normalizes vendors (e.g., “YouTube Premium” → “YouTube”) and assigns confidence scores.
4. **Candidate Dedupe**: Creates a dedupe hash to avoid repeated subscriptions.
5. **Save Workflow**: Candidates can be saved as real subscriptions.
6. **Analytics + Alerts**: Monthly/annual spend, category breakdowns, and renewal alerts are computed server‑side.

---

## 🏗️ Architecture

**Frontend**: Next.js (App Router) + Clerk Auth
- Secure routes via Clerk
- Dashboard UI for subscriptions, analytics, renewals, settings

**Backend**: Express + MongoDB (Mongoose)
- REST API for subscriptions, analytics, alerts, Gmail flows
- Encryption for Gmail tokens
- Modular service layer for parsing + saving

---

## ✅ Features Included

### ✅ Authentication
- Clerk‑based sign in/out
- Protected routes for dashboard

### ✅ Subscription Management
- Create, update, delete subscriptions
- Status, category, billing cycle, source, trial tracking

### ✅ Analytics Engine
- Monthly + yearly spend summary
- Category spend breakdown
- Trend series across recent months

### ✅ Renewal Alerts
- Configurable alert window
- Upcoming renewals API

### ✅ Gmail Integration
- OAuth (read‑only)
- Email fetch + parse + save pipeline
- Candidate deduping + scoring

---

## 📁 Project Structure

```
Subsentry_final/
├── client/          # Next.js app
│   └── src/
│       ├── app/     # Pages: Dashboard, Subscriptions, Analytics, Renewals, Settings
│       └── lib/     # API helpers, currency utils, icons
└── server/          # Express + MongoDB API
    └── src/
        ├── controllers/  # Subscription, analytics, alerts, Gmail
        ├── models/       # Subscription, Candidate, GmailToken, AlertRule
        ├── services/     # Email parsing, saving, vendor resolver, confidence scoring
        └── routes/       # REST endpoints
```

---

## ⚙️ Local Setup

### Prerequisites
- Node 18+ / 20+
- MongoDB local or Atlas
- Clerk keys (frontend)
- Google OAuth client (backend)

### 1. Install dependencies

```bash
# client
cd client
pnpm install

# server
cd ../server
pnpm install
```

### 2. Environment Variables

Create `.env` inside `server/`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/subsentry

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback
TOKEN_ENCRYPTION_KEY=32_byte_hex_key
CLIENT_URL=http://localhost:3000
```

Create `.env.local` inside `client/`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### 3. Run Dev Servers

```bash
# server
cd server
pnpm dev

# client
cd ../client
pnpm dev
```

---

## 🔌 Key API Endpoints

**Subscriptions**
- `GET /api/subscriptions`
- `POST /api/subscriptions`
- `PUT /api/subscriptions/:id`
- `DELETE /api/subscriptions/:id`

**Analytics**
- `GET /api/analytics/overview`

**Alerts**
- `GET /api/alerts/rules`
- `POST /api/alerts/rules`
- `GET /api/alerts/upcoming`

**Gmail**
- `GET /api/gmail/auth`
- `GET /api/gmail/callback`
- `GET /api/gmail/status`
- `POST /api/gmail/disconnect`
- `GET /api/gmail/emails`
- `POST /api/gmail/parse`
- `POST /api/gmail/save`

---

## 🔐 Privacy & Security

- Gmail access is **read‑only**
- OAuth tokens are encrypted at rest
- No email content is permanently stored unless converted to a subscription record

---

## 📌 Future Extensions

- Dark‑pattern firewall extension
- Automatic vendor cancellation workflows
- Spend optimization tips
- Shared family subscription plans

---

If you want to deploy, connect MongoDB Atlas + Clerk production keys + verified Google OAuth, then push to Vercel (client) + Render/Fly.io (server).
