# Sok

A boutique single-product e-commerce store with a full South African payment flow. Built with Next.js App Router, Supabase, Drizzle ORM, Auth.js, and PayFast.

> **Live demo:** *(add your Vercel URL here once deployed)*

---

## What it does

- Storefront with an auto-advancing product image carousel
- Shopping cart that persists across page refreshes
- Email + password authentication with bcrypt-hashed passwords
- Checkout that creates a real order server-side and redirects to PayFast
- PayFast ITN webhook with four-point security verification
- Order management admin panel (password gated)
- Fully custom White Coffee design system — no component library

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom design tokens |
| Database | PostgreSQL via Supabase |
| ORM | Drizzle |
| Auth | Auth.js (NextAuth v5 beta) |
| Payments | PayFast (sandbox + live) |
| State | Zustand (cart, persisted to localStorage) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Fraunces + Hanken Grotesk (self-hosted via Fontsource) |

---

## Running locally

### 1. Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A [Supabase](https://supabase.com) project
- A [PayFast sandbox](https://sandbox.payfast.co.za) account

### 2. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/sok.git
cd sok
pnpm install
```

### 3. Environment variables

Create a `.env.local` file in the root:

```env
# Database
DATABASE_URL="postgresql://postgres.YOUR_REF:PASSWORD@aws-X-REGION.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:PASSWORD@db.YOUR_REF.supabase.co:5432/postgres"

# Auth.js
AUTH_SECRET="run: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""

# PayFast sandbox
PAYFAST_MERCHANT_ID="10000100"
PAYFAST_MERCHANT_KEY="46f0cd694581a"
PAYFAST_PASSPHRASE="jt7NOE43FZPn"
PAYFAST_ENV="sandbox"
PUBLIC_BASE_URL="http://localhost:3000"

# Admin
ADMIN_PASSWORD="choose_a_password"
```

> **Supabase connection string:** In your Supabase dashboard click the **Connect** button at the top → copy the **Session pooler** string (port 5432) for `DATABASE_URL` and the **Direct** string for `DIRECT_URL`. Replace `[YOUR-PASSWORD]` with your database password.

### 4. Push the database schema

```bash
pnpm drizzle-kit push
```

### 5. Seed a product

In Supabase → SQL Editor run:

```sql
INSERT INTO "products" ("id", "slug", "name", "description", "priceCents", "imageUrl", "active")
VALUES (
  'sok-001', 'sok', 'Sok',
  'A single perfect pair. Merino-blend, reinforced heel, seamless toe.',
  24900, '/img/sock-basic.png', true
)
ON CONFLICT ("id") DO NOTHING;
```

### 6. Add a test user

Generate a bcrypt hash first:
```bash
node -e "require('bcryptjs').hash('yourpassword', 12).then(console.log)"
```

Then in Supabase → SQL Editor:
```sql
INSERT INTO "users" ("id", "name", "email", "passwordHash")
VALUES ('user-001', 'Your Name', 'you@example.com', 'PASTE_HASH_HERE');
```

### 7. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Testing PayFast payments locally

PayFast's ITN webhook can't reach `localhost` so you need a tunnel:

```bash
# Install cloudflared
winget install cloudflare.cloudflared   # Windows
brew install cloudflared                 # Mac

# Run the tunnel (in a second terminal while pnpm dev is running)
cloudflared tunnel --url http://localhost:3000
```

Copy the `https://xxxx.trycloudflare.com` URL and set it in `.env.local`:

```env
PUBLIC_BASE_URL="https://xxxx.trycloudflare.com"
```

Restart `pnpm dev`. Full payment flow now works end-to-end.

**Sandbox test card:**
- Card number: `4000000000000002`
- Expiry: any future date
- CVV: any 3 digits

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sok.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework preset will auto-detect as Next.js
4. Add all environment variables from your `.env.local` under **Environment Variables**
5. Set `PUBLIC_BASE_URL` to your Vercel URL (e.g. `https://sok.vercel.app`)
6. Click **Deploy**

No tunnel needed on Vercel — your URL is public so PayFast can POST the ITN directly.

---

## Going live with real payments

When you're ready to accept real money:

1. Create a live PayFast account at [payfast.io](https://payfast.io) → verify your identity and link your bank account
2. In Vercel → Project Settings → Environment Variables, update:
   ```
   PAYFAST_ENV=live
   PAYFAST_MERCHANT_ID=your_live_merchant_id
   PAYFAST_MERCHANT_KEY=your_live_merchant_key
   PAYFAST_PASSPHRASE=your_live_passphrase
   ```
3. Redeploy — the code already handles both environments

PayFast pays out to your linked bank account on a weekly schedule after deducting their transaction fee.

---

## Project structure

```
src/
  app/
    page.tsx                      # Storefront
    cart/page.tsx                 # Cart
    login/page.tsx                # Login
    account/page.tsx              # Delivery address
    admin/page.tsx                # Order management
    checkout/success/page.tsx     # Post-payment success
    checkout/cancel/page.tsx      # Cancelled payment
    api/
      checkout/route.ts           # Creates order + PayFast redirect
      payfast/itn/route.ts        # Payment webhook (source of truth)
      auth/[...nextauth]/route.ts # Auth.js handler
    actions/
      profile.ts                  # Save delivery address
      admin.ts                    # Fetch + update orders
  components/                     # UI components
  db/
    index.ts                      # Drizzle client
    schema.ts                     # Full database schema
  lib/
    payfast.ts                    # Signature + ITN verification
    cart.ts                       # Zustand cart store
    magic-link-email.ts           # Branded email template
  auth.ts                         # Auth.js config
```

---

## Security notes

- Payment totals are always recomputed server-side — the browser price is never trusted
- Order status only changes when the ITN webhook passes all four security checks — the success redirect is purely cosmetic
- Passwords are hashed with bcrypt (12 rounds)
- The admin gate is intentionally simple for demo purposes — a production setup should use role-based access via the users table

---

*Built by Dylan Gorrah*
