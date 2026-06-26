# GoBank Frontend - Phase 1

## Overview
This is the frontend for the GoBank online banking system. Phase 1 includes authentication pages (Login, Register, Email Verification) and a basic dashboard.

## Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Theme**: Dark mode

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   └── verify/          # Email verification page
│   ├── (dashboard)/         # Protected dashboard routes
│   │   └── dashboard/       # Dashboard home
│   ├── page.tsx             # Home redirect page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── lib/
│   ├── api.ts              # API client
│   ├── auth.ts             # Authentication utilities
│   └── types.ts            # TypeScript types
└── public/                  # Static assets
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Update `.env.local` with your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production:
```
NEXT_PUBLIC_API_URL=https://your-production-domain.vercel.app
```

### 3. Run Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### 4. Build for Production
```bash
npm run build
npm start
```

## Features - Phase 1

### Authentication Pages
- **Login**: Email and password login with JWT token management
- **Register**: Create new account with name, email, and password
- **Email Verification**: Verify email with confirmation code

### Dashboard (Protected)
- Account information display
- Account balance view
- Logout functionality
- Automatic redirect to login if not authenticated

## API Integration

The frontend connects to the backend Go API with the following endpoints:

### Authentication
- `POST /login` - Login with email and password
- `POST /account` - Register new account
- `POST /account/verification` - Verify email with code
- `GET /account` - Get account details (requires JWT token)
- `GET /health` - Health check endpoint

## Dark Theme
The application uses a dark theme with:
- Black background (`#000000`)
- Neutral 950 cards (`#0a0a0a`)
- Neutral 800 borders
- Blue accents (`#0ea5e9`)
- White text

## Token Management
Authentication tokens are stored in localStorage:
- `auth_token` - JWT token for API authentication
- `auth_user` - User information

## Next Steps (Phase 2)
- Money transfer functionality
- Transaction history
- Coupon redemption system
- WebAuthn biometric authentication
- Enhanced dashboard with more analytics

## Troubleshooting

### API Connection Issues
1. Ensure backend is running on `http://localhost:3000`
2. Check CORS is enabled on backend (should be by default)
3. Verify `NEXT_PUBLIC_API_URL` environment variable is correct

### Authentication Issues
1. Check browser localStorage for tokens
2. Verify email verification code from backend
3. Check browser console for specific error messages

### Styling Issues
1. Clear Tailwind cache: `rm -rf .next && npm run dev`
2. Restart dev server
3. Clear browser cache

## Deployment

### Deploy to Vercel
```bash
vercel deploy
```

Set environment variables in Vercel project settings:
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.vercel.app
```

## Support
For issues or questions, refer to the backend documentation in the root project.
