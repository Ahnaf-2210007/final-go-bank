# GoBank Deployment Guide

This guide explains how to deploy GoBank (backend + frontend) to both local development and production (Vercel).

## Architecture Overview

GoBank is a monorepo with two separate services:
- **Backend**: Go REST API (uses Neon PostgreSQL)
- **Frontend**: Next.js 16 + React 19 (TypeScript)
- **Database**: Neon PostgreSQL (shared between both environments)

## Local Development Setup

### Prerequisites
- Go 1.21+ installed
- Node.js 18+ and npm/pnpm installed
- Neon PostgreSQL credentials configured

### Step 1: Start the Backend

```bash
# From the project root
go run .
```

The backend will:
- Read `DATABASE_URL` from `.env.local` (Neon connection)
- Read JWT_SECRET and other configs from `.env.local`
- Listen on `http://localhost:3000`

### Step 2: Start the Frontend

```bash
# In a separate terminal, from the frontend directory
cd frontend
npm install  # if not already done
npm run dev
```

The frontend will:
- Read `NEXT_PUBLIC_API_URL=http://localhost:3000` from `.env.local`
- Run on `http://localhost:8080`
- Connect to the backend API at localhost:3000

### Step 3: Verify Connection

Both frontend and backend should now communicate:
- Navigate to http://localhost:8080
- Try logging in or creating an account
- Check browser DevTools Network tab to see API calls to `http://localhost:3000/...`

## Environment Variables

### Frontend

#### `.env.local` (Development)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### `.env.production` (Production)
```
NEXT_PUBLIC_API_URL=https://final-go-bank-api.vercel.app
```

Replace `final-go-bank-api.vercel.app` with your actual backend Vercel URL.

### Backend

#### `.env.local` (Development)
All variables already configured in `/vercel/share/v0-project/.env.local`:
- `DATABASE_URL`: Neon connection string
- `JWT_SECRET`: Secret for JWT tokens
- `SMTP_*`: Email configuration
- `WEBAUTHN_RP_ORIGIN`: http://localhost:8080 (local frontend)
- `WEBAUTHN_RP_ID`: localhost

#### `.env.production` (Production)
Set these on Vercel dashboard:
- `DATABASE_URL`: Use the same Neon URL from development
- `JWT_SECRET`: Keep it secret and secure
- `SMTP_*`: Email configuration (same as local)
- `WEBAUTHN_RP_ORIGIN`: https://frontend-url.vercel.app
- `WEBAUTHN_RP_ID`: frontend-domain.vercel.app

## Production Deployment

### Part 1: Deploy Backend to Vercel

#### Option A: Create a Separate Vercel Project for Backend

1. Go to [vercel.com](https://vercel.com)
2. Create a new project: "Connect Git Repository"
3. Select your `Ahnaf-2210007/final-go-bank` repository
4. Framework: Select "Other"
5. Root Directory: Leave as root `/`
6. Build Command: `go build -o api .`
7. Install Command: `go mod download`
8. Start Command: `./api` (or `vercel dev`)
9. Click "Deploy"

#### Step 2: Set Environment Variables on Vercel

After deployment, go to Project Settings → Environment Variables and add:

```
DATABASE_URL = postgresql://neondb_owner:...  (copy from .env.local)
JWT_SECRET = NhDmIdl2BeGZbwklk8pBv2yIBZWsC8tI4x3o993aWwo
SMTP_EMAIL = ahnaf.shahriar2003@gmail.com
SMTP_PASSWORD = oiyo jwqw bflo cgwa
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
COUPON_CODE = OFFER1000
WEBAUTHN_RP_ORIGIN = https://final-go-bank.vercel.app (production frontend URL)
WEBAUTHN_RP_ID = final-go-bank.vercel.app (production frontend domain)
```

#### Step 3: Note Your Backend URL

After deployment, you'll get a URL like: `https://final-go-bank-api.vercel.app`

This is your `BACKEND_URL` for the frontend configuration.

### Part 2: Deploy Frontend to Vercel

#### Option A: Create a Separate Vercel Project for Frontend

1. Go to [vercel.com](https://vercel.com)
2. Create a new project: "Connect Git Repository"
3. Select your repository again
4. Framework: "Next.js"
5. Root Directory: `./frontend`
6. Build Command: `npm run build`
7. Install Command: `npm install`
8. Environment Variables → Add:

```
NEXT_PUBLIC_API_URL = https://final-go-bank-api.vercel.app
```

(Replace with your actual backend URL from Part 1, Step 3)

9. Click "Deploy"

### Part 3: Update Backend WEBAUTHN Settings (if using WebAuthn)

If your frontend is deployed to `https://final-go-bank.vercel.app`, update the backend environment variables:

Go to backend Vercel project → Settings → Environment Variables:

```
WEBAUTHN_RP_ORIGIN = https://final-go-bank.vercel.app
WEBAUTHN_RP_ID = final-go-bank.vercel.app
```

Then redeploy the backend.

## Verification Checklist

### Local Development
- [ ] Backend runs on http://localhost:3000
- [ ] Frontend runs on http://localhost:8080
- [ ] NEXT_PUBLIC_API_URL=http://localhost:3000 in frontend/.env.local
- [ ] Frontend loads and can make API calls (check Network tab)
- [ ] Login/Register features work

### Production Deployment
- [ ] Backend deployed to Vercel (has HTTPS URL)
- [ ] Frontend deployed to Vercel (has HTTPS URL)
- [ ] NEXT_PUBLIC_API_URL points to backend URL in production
- [ ] Environment variables set on both Vercel projects
- [ ] Frontend loads and can make API calls to production backend
- [ ] Login/Register features work in production
- [ ] CORS allows frontend domain to access backend

## Troubleshooting

### Frontend can't connect to backend locally
**Problem**: `http://localhost:3000 refused to connect`

**Solution**:
1. Verify backend is running: `go run .`
2. Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3000`
3. Verify backend is on port 3000 (check logs)
4. Check browser console for CORS errors

### Frontend can't connect to backend in production
**Problem**: API requests to production backend fail (CORS or connection)

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set to the correct backend URL
2. Check backend's CORS middleware (already configured to allow `*`)
3. Verify backend environment variables are set on Vercel
4. Check Vercel deployment logs for errors

### Database connection errors
**Problem**: `failed to connect to database`

**Solution**:
1. Verify `DATABASE_URL` is set correctly in .env files
2. Test Neon connection: `psql $DATABASE_URL` (if psql installed)
3. Check Neon dashboard for active connections
4. Ensure password in DATABASE_URL is correct

### JWT errors after deployment
**Problem**: `invalid or expired token` after login

**Solution**:
1. Verify `JWT_SECRET` is set on Vercel
2. Ensure `JWT_SECRET` is the same on both local and production
3. Clear browser storage and try logging in again

## File Structure

```
final-go-bank/
├── .env.local                 # Backend local config
├── .env.production            # Backend production config
├── vercel.json               # Backend Vercel config
├── config.go                 # Backend config loader
├── api.go                    # Backend API routes + CORS
├── main.go                   # Backend entry point
├── go.mod                    # Go dependencies
├── frontend/
│   ├── .env.local           # Frontend local config
│   ├── .env.production      # Frontend production config
│   ├── next.config.ts       # Next.js config
│   ├── package.json         # Frontend dependencies
│   ├── lib/
│   │   └── api.ts           # API client (reads NEXT_PUBLIC_API_URL)
│   └── app/
│       └── page.tsx         # Frontend entry point
└── DEPLOYMENT.md            # This file
```

## Database Neon Integration

The project uses **Neon PostgreSQL** which is already configured:

### Current Setup
- Database host: ep-proud-leaf-atdgz1if-pooler.c-9.us-east-1.aws.neon.tech
- Database name: neondb
- User: neondb_owner
- Connection method: Pooled (for serverless apps)

### Using the Database
- Backend reads `DATABASE_URL` from env variables
- Neon connection string includes all credentials
- No need to set up a local PostgreSQL instance (using remote Neon)
- Backend can use the same database in local and production

## Next Steps

1. Test local development with both backend and frontend running
2. Deploy backend to Vercel first
3. Update frontend's NEXT_PUBLIC_API_URL with backend URL
4. Deploy frontend to Vercel
5. Test production deployment
6. Configure custom domain (optional)

## Support

For more details on Vercel deployment:
- [Vercel Go Deployment](https://vercel.com/docs/frameworks/other/go)
- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)

For Neon database issues:
- [Neon Documentation](https://neon.tech/docs)
