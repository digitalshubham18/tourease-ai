const crypto = require('crypto');
const { Booking } = require('../models/index');
const Hotel = require('../models/Hotel');
const { asyncHandler } = require('../middleware/error');

// Simulate Razorpay-style payment flow
// In production: npm install razorpay and use real Razorpay SDK

// @route POST /api/payment/create-order
exports.createOrder = asyncHandler(async (req, res) => {
  const { hotelId, checkIn, checkOut, guests, rooms, amount } = req.body;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  if (nights <= 0) return res.status(400).json({ success: false, message: 'Invalid dates' });

  const baseAmount = hotel.pricePerNight * nights * (rooms || 1);
  const tax = Math.round(baseAmount * 0.12);
  const totalAmount = baseAmount + tax;

  // Generate a mock order ID (in production this comes from Razorpay)
  const orderId = 'order_' + crypto.randomBytes(10).toString('hex').toUpperCase();

  // Store pending payment info in session or temp store
  res.json({
    success: true,
    data: {
      orderId,
      amount: totalAmount * 100, // paise for Razorpay
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      hotelName: hotel.name,
      nights,
      breakdown: {
        roomCost: baseAmount,
        tax,
        total: totalAmount,
      },
      // Razorpay key for frontend (use env var in production)
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_key',
    },
  });
});

// @route POST /api/payment/verify
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature, hotelId, checkIn, checkOut, guests, rooms, specialRequests } = req.body;

  // In production: verify Razorpay signature
  // const generatedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  // if (generatedSig !== signature) return res.status(400).json({ success: false, message: 'Payment verification failed' });

  // Simulate successful verification
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  const baseAmount = hotel.pricePerNight * nights * (rooms || 1);
  const tax = Math.round(baseAmount * 0.12);
  const totalAmount = baseAmount + tax;

  const booking = await Booking.create({
    user: req.user._id,
    hotel: hotelId,
    checkIn,
    checkOut,
    guests: guests || { adults: 1, children: 0 },
    rooms: rooms || 1,
    totalAmount,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'razorpay',
    paymentId: paymentId || `pay_demo_${Date.now()}`,
    orderId,
    specialRequests,
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate('hotel', 'name mainImage location pricePerNight policies')
    .populate('user', 'name email phone');

  res.status(201).json({
    success: true,
    message: 'Payment successful! Booking confirmed.',
    data: populatedBooking,
  });
});

// @route GET /api/payment/history
exports.getPaymentHistory = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
    paymentStatus: 'paid',
  })
    .populate('hotel', 'name mainImage location')
    .sort({ createdAt: -1 })
    .lean();

  const history = bookings.map(b => ({
    id: b._id,
    bookingId: b.bookingId,
    orderId: b.orderId,
    paymentId: b.paymentId,
    hotel: b.hotel,
    amount: b.totalAmount,
    date: b.createdAt,
    status: b.paymentStatus,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
  }));

  res.json({ success: true, data: history });
});
