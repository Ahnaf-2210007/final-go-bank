# QuickStart Guide - GoBank Local & Production Deployment

## Local Development (5 minutes)

### 1. Verify Environment Files
```bash
# Check that environment files exist
ls -la .env.local frontend/.env.local
```

Both files should exist with proper configuration.

### 2. Start Backend (Terminal 1)
```bash
# From project root
go run .
```

Expected output:
```
JSON API server is running on :3000
```

### 3. Start Frontend (Terminal 2)
```bash
# From a new terminal
cd frontend
npm install  # if needed
npm run dev
```

Expected output:
```
> next dev
▲ Next.js 16.0.0
- Local: http://localhost:8080
```

### 4. Test Connection
- Open http://localhost:8080 in your browser
- Frontend should load and communicate with backend
- Check DevTools Network tab → see requests to `http://localhost:3000`

## Production Deployment (30 minutes)

### Step 1: Deploy Backend to Vercel

```bash
# 1. Push to GitHub (if not already pushed)
git add .
git commit -m "Add deployment configuration"
git push origin main

# 2. Go to https://vercel.com
# 3. "Add New" → "Project"
# 4. Select your repository (Ahnaf-2210007/final-go-bank)
# 5. Configure:
#    - Framework: Other
#    - Build Command: go build -o api .
#    - Install Command: go mod download
#    - Root Directory: / (root)
# 6. Click "Deploy"
# 7. Wait for deployment to complete
# 8. Get your backend URL (e.g., https://final-go-bank-api.vercel.app)
```

### Step 2: Add Environment Variables to Backend

In your backend Vercel project:
1. Go to Settings → Environment Variables
2. Add these variables (values from `.env.local`):

```
DATABASE_URL = postgresql://neondb_owner:npg_EwZxA1DWeBy8@ep-proud-leaf-atdgz1if-pooler.c-9.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
JWT_SECRET = NhDmIdl2BeGZbwklk8pBv2yIBZWsC8tI4x3o993aWwo
SMTP_EMAIL = ahnaf.shahriar2003@gmail.com
SMTP_PASSWORD = oiyo jwqw bflo cgwa
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
COUPON_CODE = OFFER1000
WEBAUTHN_RP_ORIGIN = https://final-go-bank.vercel.app
WEBAUTHN_RP_ID = final-go-bank.vercel.app
```

3. Click "Save" and redeploy

### Step 3: Update Frontend Environment

1. Edit `frontend/.env.production`
2. Replace backend URL:

```
NEXT_PUBLIC_API_URL=https://final-go-bank-api.vercel.app
```

(Use the URL from Step 1, Step 8)

3. Commit and push:

```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push origin main
```

### Step 4: Deploy Frontend to Vercel

```bash
# 1. Go to https://vercel.com
# 2. "Add New" → "Project"
# 3. Select same repository
# 4. Configure:
#    - Framework: Next.js
#    - Root Directory: ./frontend
#    - Environment Variables: Add NEXT_PUBLIC_API_URL (from Step 3)
# 5. Click "Deploy"
# 6. Get your frontend URL (e.g., https://final-go-bank.vercel.app)
```

### Step 5: Update Backend WebAuthn Settings

Update backend Vercel project environment variables:

```
WEBAUTHN_RP_ORIGIN = https://final-go-bank.vercel.app
WEBAUTHN_RP_ID = final-go-bank.vercel.app
```

Redeploy backend to apply changes.

## Verify Everything Works

### Local
- [ ] http://localhost:3000/health returns `{"status":"ok"}`
- [ ] http://localhost:8080 loads
- [ ] Can register and login
- [ ] Account details show correct balance

### Production
- [ ] https://final-go-bank-api.vercel.app/health returns `{"status":"ok"}`
- [ ] https://final-go-bank.vercel.app loads
- [ ] Can register and login
- [ ] Account details show correct balance

## Environment Variables Quick Reference

### Backend (.env.local)
```
DATABASE_URL=postgresql://...         # Neon connection
JWT_SECRET=...                        # Secret for JWT
SMTP_EMAIL=...                        # Email sender
SMTP_PASSWORD=...                     # Email password
SMTP_HOST=smtp.gmail.com              # Email host
SMTP_PORT=587                         # Email port
COUPON_CODE=OFFER1000                 # Promo code
WEBAUTHN_RP_ORIGIN=http://localhost:8080
WEBAUTHN_RP_ID=localhost
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://final-go-bank-api.vercel.app
```

## Troubleshooting

### "Connection refused" when frontend tries to reach backend
- [ ] Backend running on port 3000? (`go run .`)
- [ ] Frontend has correct NEXT_PUBLIC_API_URL? (check `.env.local`)
- [ ] Check browser DevTools → Network tab

### "Database connection failed"
- [ ] DATABASE_URL correct in `.env.local`?
- [ ] Neon account has active projects?
- [ ] Try: `psql $DATABASE_URL` to test

### Frontend shows blank page
- [ ] Check browser console for errors
- [ ] Verify Next.js built successfully
- [ ] Check that NEXT_PUBLIC_API_URL doesn't have trailing slash

### Login not working
- [ ] Check JWT_SECRET is set
- [ ] Check SMTP is configured (or disabled logs)
- [ ] Check database has accounts table

## Files Reference

- `DEPLOYMENT.md` - Detailed deployment guide
- `scripts/verify-setup.sh` - Automated setup checker
- `.env.local` - Backend local config (don't commit!)
- `.env.production` - Backend production config (don't commit!)
- `frontend/.env.local` - Frontend local config (don't commit!)
- `frontend/.env.production` - Frontend production config (don't commit!)
- `vercel.json` - Backend Vercel configuration
- `config.go` - Backend config loader

## Architecture at a Glance

```
┌─────────────────────────────────────────┐
│         Vercel (Production)             │
├──────────────────┬──────────────────────┤
│  Frontend        │  Backend (Go)        │
│  Next.js         │  Vercel Functions    │
│  React 19        │  Port: 443           │
│  Port: 443       │                      │
└──────────────────┴──────────────────────┘
           │
           │ (HTTPS)
           │
┌──────────┴───────────────────────────────┐
│      Neon PostgreSQL (Shared)            │
│  Database for local + production         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│      Local Development                   │
├──────────────────┬──────────────────────┤
│  Frontend        │  Backend (Go)        │
│  http://loc..80  │  http://localhost:   │
│                  │  3000                │
└──────────────────┴──────────────────────┘
           │
           │ (HTTP)
           │
└──────────┴───────────────────────────────┘
```

## Next: Custom Domain (Optional)

To use a custom domain instead of vercel.app:

1. Buy domain from registrar (GoDaddy, Namecheap, etc.)
2. Vercel Project → Settings → Domains
3. Add custom domain and update DNS records
4. Update WEBAUTHN_RP_ORIGIN and WEBAUTHN_RP_ID in backend
5. Redeploy backend

For detailed guide, see `DEPLOYMENT.md`.
