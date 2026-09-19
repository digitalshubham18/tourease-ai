#!/bin/bash
echo "🚀 Starting TourEase AI..."
echo ""

# Check Node
if ! command -v node &> /dev/null; then echo "❌ Node.js not found. Install from nodejs.org"; exit 1; fi
echo "✅ Node.js $(node -v)"

# Backend setup
echo ""
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  Created backend/.env — please fill in your credentials!"
fi
npm install
echo "✅ Backend ready"

# Frontend setup
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
echo "✅ Frontend ready"

echo ""
echo "============================================"
echo "  ✈️  TourEase AI is ready to launch!"
echo "============================================"
echo ""
echo "  Run in separate terminals:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "  Then open: http://localhost:5173"
echo ""
echo "  Demo accounts:"
echo "    Admin:  admin@tourease.ai / Admin@123456"
echo "    Owner:  owner@tourease.ai / Owner@123456"
echo "    Tourist: tourist@demo.com / Demo@1234"
echo "============================================"
