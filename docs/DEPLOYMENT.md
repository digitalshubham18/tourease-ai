# TourEase AI — Deployment Guide

## Option 1: Docker (Recommended)

```bash
# 1. Configure backend/.env with production values
# 2. Build and launch
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Option 2: Manual Deployment

### Backend on Railway / Render / Heroku

1. Push backend folder to GitHub
2. Connect repo to Railway/Render
3. Set all environment variables from `.env.example`
4. Deploy — your API URL will be something like `https://tourease-api.up.railway.app`

### Frontend on Vercel / Netlify

1. Update `frontend/vite.config.js` proxy target to your live API URL
2. Push frontend to GitHub
3. Import on Vercel/Netlify
4. Set `VITE_API_URL` if using env vars
5. Deploy

---

## Option 3: VPS (Ubuntu)

```bash
# 1. SSH into server
ssh user@your-server-ip

# 2. Install Node, Nginx, PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
npm install -g pm2

# 3. Clone and setup
git clone https://github.com/your-team/tourease-ai
cd tourease-ai/backend
cp .env.example .env && nano .env
npm install

# 4. Start backend with PM2
pm2 start server.js --name tourease-backend
pm2 save && pm2 startup

# 5. Build frontend
cd ../frontend && npm install && npm run build

# 6. Nginx config for both
sudo nano /etc/nginx/sites-available/tourease
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/tourease-frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/tourease /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## Environment Variables Checklist

| Variable | Required | Notes |
|---|---|---|
| MONGODB_URI | ✅ | MongoDB Atlas connection string |
| JWT_SECRET | ✅ | Long random string (32+ chars) |
| GOOGLE_CLIENT_ID | ✅ | Google Cloud Console |
| GOOGLE_CLIENT_SECRET | ✅ | Google Cloud Console |
| GOOGLE_CALLBACK_URL | ✅ | Must match OAuth redirect URI |
| EMAIL_USER | ✅ | Gmail address |
| EMAIL_PASS | ✅ | Gmail App Password (not regular password) |
| CLOUDINARY_CLOUD_NAME | ✅ | Cloudinary dashboard |
| CLOUDINARY_API_KEY | ✅ | Cloudinary dashboard |
| CLOUDINARY_API_SECRET | ✅ | Cloudinary dashboard |
| SESSION_SECRET | ✅ | Random string |
| CLIENT_URL | ✅ | Frontend URL for CORS |

---

## Setting up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → OAuth 2.0 Credentials
3. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
4. Copy Client ID and Client Secret to `.env`

## Setting up Gmail App Password

1. Enable 2FA on Gmail
2. Google Account → Security → App Passwords
3. Generate password for "Mail" → copy to `EMAIL_PASS`

## Setting up Cloudinary

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Dashboard → copy Cloud Name, API Key, API Secret
