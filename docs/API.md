# TourEase AI — API Documentation

**Base URL:** `http://localhost:5000/api`

**Auth Header:** `Authorization: Bearer <token>`

---

## Authentication

### POST /auth/signup
Register user. Sends OTP to email.

**Body (multipart/form-data):** name, email, password, role, avatar(optional)

**Response 201:** `{ success, message, userId, email }`

### POST /auth/login
Login. Returns JWT token + user.

**Body:** `{ email, password }`

### POST /auth/verify-otp
Verify email OTP.

**Body:** `{ userId, otp }`

### GET /auth/google
Start Google OAuth flow.

### POST /auth/forgot-password
Send password reset email. Body: `{ email }`

### PUT /auth/reset-password/:token
Reset password. Body: `{ password }`

### GET /auth/me [Protected]
Get current user profile.

### POST /auth/logout [Protected]
Logout user.

---

## Hotels

### GET /hotels
List hotels. Query: city, state, minPrice, maxPrice, rating, category, sort, page, limit

### GET /hotels/featured
Get featured hotels.

### GET /hotels/:id
Hotel details with reviews.

### POST /hotels [Protected: hotel_owner]
Create hotel. Multipart form with images.

### POST /hotels/:id/reviews [Protected]
Add review. Body: `{ rating, title, comment }`

### POST /hotels/:id/wishlist [Protected]
Toggle wishlist.

---

## Bookings [Protected]

### POST /bookings
Create booking. Body: `{ hotelId, checkIn, checkOut, guests, rooms }`

### GET /bookings
My bookings list.

### PUT /bookings/:id/cancel
Cancel booking. Body: `{ reason }`

---

## AI Trips [Protected]

### POST /trips/ai-generate
Generate AI itinerary. Body: `{ destination, days, budget, interests, travelType }`

### GET /trips
My trips list.

### DELETE /trips/:id
Delete a trip.

---

## Admin [Protected: admin]

### GET /admin/stats — Platform analytics
### GET /admin/users — All users
### PUT /admin/users/:id/toggle-status — Toggle active
### DELETE /admin/users/:id — Delete user
### GET /admin/hotels — All hotels
### PUT /admin/hotels/:id/verify — Verify hotel
### DELETE /admin/reviews/:id — Delete review

---

## Socket.IO

- **chat_message** → send `{ message, userId }` → receive **chat_reply**
- **join_user_room** → join notification room with userId
