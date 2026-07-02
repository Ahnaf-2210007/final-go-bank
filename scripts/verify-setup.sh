#!/bin/bash

# GoBank Setup Verification Script
# This script verifies that your local development environment is properly configured

echo "🔍 GoBank Setup Verification"
echo "=============================="
echo ""

# Check for Go
echo "Checking Go installation..."
if command -v go &> /dev/null; then
    GO_VERSION=$(go version | awk '{print $3}')
    echo "✅ Go is installed: $GO_VERSION"
else
    echo "❌ Go is not installed. Please install Go 1.21+"
    exit 1
fi
echo ""

# Check for Node.js
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js is installed: $NODE_VERSION"
else
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi
echo ""

# Check for npm/pnpm
echo "Checking package manager..."
if command -v pnpm &> /dev/null; then
    PKG_VERSION=$(pnpm --version)
    echo "✅ pnpm is installed: $PKG_VERSION"
elif command -v npm &> /dev/null; then
    PKG_VERSION=$(npm --version)
    echo "✅ npm is installed: $PKG_VERSION"
else
    echo "❌ npm or pnpm is not installed"
    exit 1
fi
echo ""

# Check environment files
echo "Checking environment files..."
if [ -f ".env.local" ]; then
    echo "✅ Backend .env.local exists"
    if grep -q "DATABASE_URL" .env.local; then
        echo "   ✅ DATABASE_URL is configured"
    else
        echo "   ⚠️  DATABASE_URL not found in .env.local"
    fi
    if grep -q "JWT_SECRET" .env.local; then
        echo "   ✅ JWT_SECRET is configured"
    else
        echo "   ⚠️  JWT_SECRET not found in .env.local"
    fi
else
    echo "❌ Backend .env.local not found"
    exit 1
fi
echo ""

if [ -f "frontend/.env.local" ]; then
    echo "✅ Frontend .env.local exists"
    if grep -q "NEXT_PUBLIC_API_URL" frontend/.env.local; then
        API_URL=$(grep "NEXT_PUBLIC_API_URL" frontend/.env.local | cut -d '=' -f 2)
        echo "   ✅ NEXT_PUBLIC_API_URL is set to: $API_URL"
    else
        echo "   ⚠️  NEXT_PUBLIC_API_URL not found in frontend/.env.local"
    fi
else
    echo "❌ Frontend .env.local not found"
    exit 1
fi
echo ""

# Check Go dependencies
echo "Checking Go dependencies..."
if [ -f "go.mod" ]; then
    echo "✅ go.mod exists"
else
    echo "❌ go.mod not found"
    exit 1
fi
echo ""

# Check frontend dependencies
echo "Checking frontend setup..."
if [ -f "frontend/package.json" ]; then
    echo "✅ frontend/package.json exists"
    if [ -d "frontend/node_modules" ]; then
        echo "✅ frontend/node_modules exists (dependencies installed)"
    else
        echo "⚠️  frontend/node_modules not found (run: cd frontend && npm install)"
    fi
else
    echo "❌ frontend/package.json not found"
    exit 1
fi
echo ""

# Check Neon database connectivity (if psql is available)
echo "Checking database connectivity..."
if command -v psql &> /dev/null; then
    if grep -q "DATABASE_URL" .env.local; then
        DB_URL=$(grep "^DATABASE_URL" .env.local | cut -d '=' -f 2-)
        echo "Testing connection to Neon..."
        if PGPASSWORD=$(echo "$DB_URL" | grep -oP '(?<=:).*(?=@)') psql "$DB_URL" -c "SELECT 1;" &> /dev/null; then
            echo "✅ Database connection successful"
        else
            echo "⚠️  Could not connect to database (but backend may still work)"
        fi
    fi
else
    echo "⚠️  psql not installed (skipping database connection test)"
fi
echo ""

echo "=============================="
echo "✅ Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Start the backend: go run ."
echo "2. Start the frontend: cd frontend && npm run dev"
echo "3. Visit http://localhost:8080"
echo ""
