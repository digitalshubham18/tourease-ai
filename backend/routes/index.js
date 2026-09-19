const express = require('express');
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const hotelController = require('../controllers/hotelController');
const bookingController = require('../controllers/bookingController');
const adminController = require('../controllers/adminController');
const supportController = require('../controllers/supportController');
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { uploadProfile, uploadHotel } = require('../config/cloudinary');

const router = express.Router();

// ===== AUTH =====
router.post('/auth/signup', uploadProfile.single('avatar'), authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/verify-otp', authController.verifyOTP);
router.post('/auth/resend-otp', authController.resendOTP);
router.post('/auth/forgot-password', authController.forgotPassword);
router.put('/auth/reset-password/:token', authController.resetPassword);
router.get('/auth/me', protect, authController.getMe);
router.put('/auth/update-profile', protect, uploadProfile.single('avatar'), authController.updateProfile);
router.put('/auth/change-password', protect, authController.changePassword);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }), authController.googleCallback);

// ===== HOTELS =====
router.get('/hotels/search-suggestions', hotelController.getSearchSuggestions);
router.get('/hotels/featured', hotelController.getFeaturedHotels);
router.get('/hotels/owner/my-hotels', protect, authorize('hotel_owner', 'admin'), hotelController.getOwnerHotels);
router.get('/hotels/owner/bookings', protect, authorize('hotel_owner', 'admin'), hotelController.getOwnerBookings);
router.get('/hotels', hotelController.getHotels);
router.get('/hotels/:id', hotelController.getHotel);
router.post('/hotels', protect, authorize('hotel_owner', 'admin'), uploadHotel.array('images', 10), hotelController.createHotel);
router.put('/hotels/:id', protect, authorize('hotel_owner', 'admin'), uploadHotel.array('images', 10), hotelController.updateHotel);
router.delete('/hotels/:id', protect, authorize('hotel_owner', 'admin'), hotelController.deleteHotel);
router.post('/hotels/:id/reviews', protect, hotelController.addReview);
router.post('/hotels/:id/wishlist', protect, hotelController.toggleWishlist);

// ===== PAYMENT =====
router.post('/payment/create-order', protect, paymentController.createOrder);
router.post('/payment/verify', protect, paymentController.verifyPayment);
router.get('/payment/history', protect, paymentController.getPaymentHistory);

// ===== BOOKINGS =====
router.post('/bookings', protect, bookingController.createBooking);
router.get('/bookings', protect, bookingController.getUserBookings);
router.get('/bookings/:id', protect, bookingController.getBooking);
router.put('/bookings/:id/cancel', protect, bookingController.cancelBooking);

// ===== TRIPS =====
router.post('/trips/ai-generate', protect, bookingController.generateAITrip);
router.post('/trips', protect, bookingController.createTrip);
router.get('/trips', protect, bookingController.getUserTrips);
router.get('/trips/:id', protect, bookingController.getTrip);
router.delete('/trips/:id', protect, bookingController.deleteTrip);

// ===== DESTINATIONS =====
router.get('/destinations', bookingController.getDestinations);
router.get('/destinations/:id', bookingController.getDestination);

// ===== SUPPORT =====
router.post('/support/ticket', protect, supportController.createTicket);
router.get('/support/tickets', protect, supportController.getUserTickets);
router.post('/support/tickets/:id/reply', protect, supportController.replyToTicket);
router.get('/support/faq', supportController.getFAQ);
router.post('/support/chat', supportController.chatSupport);

// ===== ADMIN =====
router.get('/admin/stats', protect, authorize('admin'), adminController.getStats);
router.get('/admin/users', protect, authorize('admin'), adminController.getUsers);
router.put('/admin/users/:id/toggle-status', protect, authorize('admin'), adminController.toggleUserStatus);
router.delete('/admin/users/:id', protect, authorize('admin'), adminController.deleteUser);
router.get('/admin/hotels', protect, authorize('admin'), adminController.getAllHotels);
router.put('/admin/hotels/:id/verify', protect, authorize('admin'), adminController.verifyHotel);
router.delete('/admin/reviews/:id', protect, authorize('admin'), adminController.deleteReview);
router.post('/admin/destinations', protect, authorize('admin'), adminController.createDestination);
router.get('/admin/support', protect, authorize('admin'), adminController.getSupportTickets);
router.get('/admin/bookings', protect, authorize('admin'), adminController.getAllBookings);

module.exports = router;
