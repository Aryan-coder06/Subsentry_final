<p align="center">
  <img src="client/public/logo.svg" alt="SubSentry logo" width="96" />
</p>
<h1 align="center">SubSentry</h1>
<p align="center"><em>Subscription Visibility & Gmail Intelligence Platform</em></p>

SubSentry is a **privacy‑first subscription intelligence system** that helps users discover, track, and optimize recurring payments. It combines **manual subscription management** with **Gmail‑based ingestion (read‑only)** to surface hidden subscriptions, renewal risks, and spending trends.

This repository contains the **final Week‑6 production‑ready build** of the system.

---

## 🚩 The Problem It Solves

Most users don’t know:
- **What they are subscribed to** across apps and services
- **When renewals happen** (and what’s about to charge)
- **How much they spend monthly / yearly**

Subscriptions are scattered across emails and apps. Many are silent renewals or trial traps. SubSentry makes recurring charges **visible, structured, and actionable**.

---

## ✅ How SubSentry Solves It

1. **Gmail Ingestion (Read‑Only)**
   - Connect Gmail safely via OAuth
   - Fetch transaction receipts

2. **Parsing + Intelligence**
   - Parse email content into vendor, plan, price, date
   - Normalize vendor names
   - Score confidence and dedupe noisy signals

3. **Subscription System of Record**
   - Create clean subscription entries
   - Track renewal date, billing cycle, status, trial

4. **Insights & Alerts**
   - Analytics: monthly/annual spend, category breakdown, trends
   - Alerts: renewals within user‑defined window

---

## 🧠 System Flow (End‑to‑End)

```
Gmail OAuth (Read‑Only)
  → Fetch Emails
  → Parse + Score
  → Candidate Store (dedupe)
  → Save to Subscriptions

Manual Create
  → Subscription Store
  → Analytics / Alerts / Renewals UI
```

---

## 🧩 Core Intelligence Modules

**Vendor Resolver**
- Normalizes provider names (e.g., “YouTube Premium” → “YouTube”).

**Confidence Scoring**
- Assigns reliability scores to parsed results (amount, billing, category, etc.).

**Candidate Dedupe**
- Dedupe hashes prevent repeated subscriptions from multiple receipts.

**Analytics Engine**
- Aggregates monthly/annual spend + category breakdown + trend series.

**Alert Rule Engine**
- User‑defined renewal window (3/7/14/30 days) for upcoming notifications.

---

## 🏗️ Architecture

**Frontend** — Next.js (App Router) + Clerk
- Secure authentication (Clerk)
- Dashboard: subscriptions, analytics, renewals, settings

**Backend** — Express + MongoDB (Mongoose)
- REST API: subscriptions, Gmail, analytics, alerts
- Encrypted OAuth token storage
- Modular services for parsing + saving

---

## ✅ Features Included

## ✨ Features (OpenCode MVP)

- 🔐 Authentication using **Clerk**
- 📊 Subscription dashboard with monthly & yearly spend
- ✏️ Add, edit, and delete subscriptions
- ⏰ Track upcoming renewals and free trials
- 📥 Gmail email ingestion (read‑only, keyword‑based)
- 🗂️ Filter subscriptions by category, status, and billing cycle
- 📈 Dashboard summary widgets + spend trends
- 🧠 Vendor normalization + confidence scoring
- 🧩 Candidate dedupe to avoid repeated subscriptions
- 🔔 Renewal alert rules with configurable windows
- 💸 Currency switching for totals (USD/INR/EUR/GBP)

### Authentication
- Clerk sign in/out
- Protected dashboard routes

### Subscription Management
- Create, update, delete subscriptions
- Status, category, billing cycle, source, trial tracking

### Gmail Integration
- OAuth (read‑only)
- Fetch + parse + save pipeline
- Candidate scoring + dedupe

### Analytics
- Monthly + yearly spend
- Category breakdown
- Trend series over recent months

### Renewal Alerts
- Configurable alert windows
- Upcoming renewals API

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
        ├── services/     # Parsing, saving, resolver, confidence scoring
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

## ⚠️ Known Limitations

- Currency conversion uses static rates (demo‑grade)
- Alert rules are API‑level only (no external notifications yet)
- Candidate approval flow is API‑side (UI can be expanded)

---

## 🚀 Future Extensions

- Dark‑pattern firewall extension
- Auto‑cancel workflows and vendor notifications
- ML‑driven vendor classification
- Spend optimization recommendations
- Family plan sharing

---

If you want to deploy, connect MongoDB Atlas + Clerk production keys + verified Google OAuth, then push to Vercel (client) + Render/Fly.io (server).
