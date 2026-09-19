# ✈️ TourEase AI - Smart Tourism Platform

> **Smart India Hackathon 2024** | Full-Stack AI-Powered Tourism Platform for India

![TourEase AI](https://img.shields.io/badge/TourEase-AI-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

---

## 🚀 Features

- 🤖 **AI Trip Planner** - Generate personalized day-by-day itineraries
- 🏨 **Hotel Booking** - Search, filter, book verified hotels across India
- 🔐 **Full Auth System** - JWT + Google OAuth + Email OTP verification
- 💬 **AI Chatbot** - Real-time Socket.IO powered travel assistant
- 🔒 **Safety Alerts** - Real-time destination safety information
- 📊 **Admin Panel** - Full platform management dashboard
- 🌙 **Dark Mode UI** - Modern glassmorphism design
- 📱 **Fully Responsive** - Works on all devices

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, Framer Motion, Redux Toolkit |
| Backend | Node.js, Express.js, Socket.IO |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT, Passport.js, Google OAuth 2.0, bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| Storage | Cloudinary (image uploads) |
| Real-time | Socket.IO |

---

## 📁 Project Structure

```
tourease-ai/
├── backend/
│   ├── config/          # DB, Cloudinary, Passport
│   ├── controllers/     # Auth, Hotel, Booking, Admin
│   ├── middleware/      # Auth, Error handling
│   ├── models/          # User, Hotel, Booking, Review, Trip, Destination
│   ├── routes/          # All API routes
│   ├── services/        # Email service
│   ├── utils/           # JWT helpers, Data seeder
│   └── server.js        # Main entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, HotelCard, Chatbot, etc.
│   │   ├── pages/       # All 13 pages
│   │   ├── store/       # Redux slices
│   │   └── utils/       # Axios API instance
│   └── index.html
├── docker-compose.yml
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud Console project (for OAuth)
- Gmail account (for Nodemailer)
- Cloudinary account (for image uploads)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** - copy `backend/.env.example` to `backend/.env` and fill in:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tourease
JWT_SECRET=your_very_long_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@tourease.ai
ADMIN_PASSWORD=Admin@123456
```

### 3. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit: **http://localhost:5173**

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

---

## 📧 Gmail Setup for Nodemailer

1. Enable 2-Step Verification on Gmail
2. Go to Google Account → Security → App Passwords
3. Generate an App Password for "Mail"
4. Use that password as `EMAIL_PASS` in `.env`

---

## ☁️ Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, API Secret from the Dashboard
3. Add to `.env`

---

## 🗄️ MongoDB Atlas Setup

1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string and add to `MONGODB_URI`

**Note:** The app auto-seeds sample data (destinations, hotels, admin user) on first run!

---

## 📡 API Documentation

### Auth Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/forgot-password` | Send reset link |
| PUT | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |
| POST | `/api/auth/logout` | Logout |

### Hotel Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels` | List hotels (with filters) |
| GET | `/api/hotels/featured` | Featured hotels |
| GET | `/api/hotels/:id` | Hotel details |
| POST | `/api/hotels` | Create hotel (owner) |
| PUT | `/api/hotels/:id` | Update hotel (owner) |
| DELETE | `/api/hotels/:id` | Delete hotel |
| POST | `/api/hotels/:id/reviews` | Add review |
| POST | `/api/hotels/:id/wishlist` | Toggle wishlist |

### Booking Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | User's bookings |
| GET | `/api/bookings/:id` | Booking details |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |

### Trip Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trips/ai-generate` | AI generate trip |
| POST | `/api/trips` | Save trip |
| GET | `/api/trips` | User's trips |
| DELETE | `/api/trips/:id` | Delete trip |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform analytics |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/toggle-status` | Toggle user |
| GET | `/api/admin/hotels` | All hotels |
| PUT | `/api/admin/hotels/:id/verify` | Verify hotel |

---

## 🐳 Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build

# Stop containers
docker-compose down
```

---

## 🌐 Deployment

### Backend (Railway / Render)
1. Push to GitHub
2. Connect to Railway/Render
3. Add environment variables
4. Deploy

### Frontend (Vercel / Netlify)
1. Push to GitHub
2. Connect to Vercel
3. Set `VITE_API_URL` to your backend URL
4. Deploy

### Update CORS in backend for production:
```env
CLIENT_URL=https://your-frontend-domain.vercel.app
```

---

## 👥 Demo Accounts

After seeding, these accounts are ready:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tourease.ai | Admin@123456 |
| Hotel Owner | owner@tourease.ai | Owner@123456 |

---

## 📄 License

MIT License - Built for Smart India Hackathon 2024

---

**Made with ❤️ for Incredible India 🇮🇳**
