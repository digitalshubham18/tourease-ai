const User = require('../models/User');
const Hotel = require('../models/Hotel');
const { Booking, Review, Destination } = require('../models/index');
const { asyncHandler } = require('../middleware/error');

// @route GET /api/admin/stats
exports.getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalHotels, totalBookings, totalRevenue] = await Promise.all([
    User.countDocuments(),
    Hotel.countDocuments(),
    Booking.countDocuments(),
    Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
  ]);

  const recentBookings = await Booking.find()
    .populate('user', 'name email avatar')
    .populate('hotel', 'name mainImage location')
    .sort({ createdAt: -1 })
    .limit(5);

  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);

  const monthlyBookings = await Booking.aggregate([
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalHotels,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentBookings,
      usersByRole,
      monthlyBookings,
    },
  });
});

// @route GET /api/admin/users
exports.getUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20, search } = req.query;
  const query = {};

  if (role) query.role = role;
  if (search) query.$or = [
    { name: new RegExp(search, 'i') },
    { email: new RegExp(search, 'i') },
  ];

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  res.json({
    success: true,
    data: users,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

// @route PUT /api/admin/users/:id/toggle-status
exports.toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
    isActive: user.isActive,
  });
});

// @route DELETE /api/admin/users/:id
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

// @route GET /api/admin/hotels
exports.getAllHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find()
    .populate('owner', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: hotels });
});

// @route PUT /api/admin/hotels/:id/verify
exports.verifyHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true }
  );

  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

  res.json({ success: true, message: 'Hotel verified', data: hotel });
});

// @route DELETE /api/admin/reviews/:id
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

  // Update hotel rating
  const allReviews = await Review.find({ hotel: review.hotel, isApproved: true });
  const hotel = await Hotel.findById(review.hotel);
  if (hotel) {
    hotel.rating.count = allReviews.length;
    hotel.rating.average = allReviews.length
      ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
      : 0;
    hotel.reviews = hotel.reviews.filter((r) => r.toString() !== req.params.id);
    await hotel.save();
  }

  res.json({ success: true, message: 'Review deleted' });
});

// @route POST /api/admin/destinations
exports.createDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.create(req.body);
  res.status(201).json({ success: true, data: destination });
});

// @route GET /api/admin/support
exports.getSupportTickets = asyncHandler(async (req, res) => {
  const SupportTicket = require('../models/Support');
  const tickets = await SupportTicket.find()
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ success: true, data: tickets });
});

// @route GET /api/admin/bookings
exports.getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email avatar')
    .populate('hotel', 'name mainImage location')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ success: true, data: bookings, total: bookings.length });
});
