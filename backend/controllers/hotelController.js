const Hotel = require('../models/Hotel');
const { Review, Booking } = require('../models/index');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/error');

// @route GET /api/hotels
exports.getHotels = asyncHandler(async (req, res) => {
  const { city, state, minPrice, maxPrice, rating, category, amenities, page = 1, limit = 12, sort = 'newest', search } = req.query;

  const query = { isActive: true };

  // Flexible city search - partial match, case-insensitive
  if (city && city.trim()) {
    query.$or = [
      { 'location.city': new RegExp(city.trim(), 'i') },
      { 'location.state': new RegExp(city.trim(), 'i') },
      { name: new RegExp(city.trim(), 'i') },
      { tags: new RegExp(city.trim(), 'i') },
    ];
  }
  if (state && state.trim()) query['location.state'] = new RegExp(state.trim(), 'i');
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
  }
  if (rating) query['rating.average'] = { $gte: Number(rating) };
  if (amenities) query.amenities = { $in: amenities.split(',') };
  if (search && search.trim()) {
    query.$or = [
      { name: new RegExp(search.trim(), 'i') },
      { 'location.city': new RegExp(search.trim(), 'i') },
      { 'location.state': new RegExp(search.trim(), 'i') },
      { tags: new RegExp(search.trim(), 'i') },
      { description: new RegExp(search.trim(), 'i') },
    ];
  }

  const sortOptions = {
    'price-asc': { pricePerNight: 1 },
    'price-desc': { pricePerNight: -1 },
    'rating': { 'rating.average': -1 },
    'newest': { createdAt: -1 },
    'popular': { 'rating.count': -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Hotel.countDocuments(query);
  const hotels = await Hotel.find(query)
    .populate('owner', 'name avatar phone bio location')
    .sort(sortOptions[sort] || { createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  res.json({
    success: true,
    data: hotels,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) },
  });
});

// @route GET /api/hotels/featured
exports.getFeaturedHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({ isActive: true, featured: true })
    .populate('owner', 'name avatar phone bio')
    .limit(9).lean();
  res.json({ success: true, data: hotels });
});

// @route GET /api/hotels/search-suggestions
exports.getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, data: [] });

  const cities = await Hotel.distinct('location.city');
  const states = await Hotel.distinct('location.state');
  const allLocations = [...new Set([...cities, ...states])];
  const suggestions = allLocations.filter(l => l && l.toLowerCase().includes(q.toLowerCase())).slice(0, 8);

  res.json({ success: true, data: suggestions });
});

// @route GET /api/hotels/:id
exports.getHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
    .populate('owner', 'name avatar email phone bio location createdAt')
    .populate({ path: 'reviews', populate: { path: 'user', select: 'name avatar' }, options: { sort: { createdAt: -1 }, limit: 20 } });

  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
  res.json({ success: true, data: hotel });
});

// @route POST /api/hotels
exports.createHotel = asyncHandler(async (req, res) => {
  req.body.owner = req.user._id;
  const images = req.files ? req.files.map(f => f.path) : [];
  if (images.length > 0) { req.body.mainImage = images[0]; req.body.images = images; }

  // Parse amenities if string
  if (typeof req.body.amenities === 'string') req.body.amenities = req.body.amenities.split(',').map(a => a.trim());

  const hotel = await Hotel.create(req.body);
  res.status(201).json({ success: true, message: 'Hotel listed successfully!', data: hotel });
});

// @route PUT /api/hotels/:id
exports.updateHotel = asyncHandler(async (req, res) => {
  let hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
  if (hotel.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  if (req.files?.length > 0) {
    const newImages = req.files.map(f => f.path);
    req.body.images = [...(hotel.images || []), ...newImages];
    if (!req.body.mainImage) req.body.mainImage = req.body.images[0];
  }
  hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, message: 'Hotel updated', data: hotel });
});

// @route DELETE /api/hotels/:id
exports.deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
  if (hotel.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  await hotel.deleteOne();
  res.json({ success: true, message: 'Hotel deleted' });
});

// @route POST /api/hotels/:id/reviews
exports.addReview = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

  const existing = await Review.findOne({ hotel: req.params.id, user: req.user._id });
  if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this hotel' });

  const review = await Review.create({ ...req.body, hotel: req.params.id, user: req.user._id });
  hotel.reviews.push(review._id);

  const allReviews = await Review.find({ hotel: req.params.id, isApproved: true });
  hotel.rating.count = allReviews.length;
  hotel.rating.average = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await hotel.save();

  const populated = await Review.findById(review._id).populate('user', 'name avatar');
  res.status(201).json({ success: true, data: populated });
});

// @route POST /api/hotels/:id/wishlist
exports.toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const hotelId = req.params.id;
  const idx = user.wishlist.findIndex(id => id.toString() === hotelId);
  if (idx > -1) {
    user.wishlist.splice(idx, 1);
    await user.save();
    return res.json({ success: true, wishlisted: false, message: 'Removed from wishlist' });
  }
  user.wishlist.push(hotelId);
  await user.save();
  res.json({ success: true, wishlisted: true, message: 'Added to wishlist' });
});

// @route GET /api/hotels/owner/my-hotels
exports.getOwnerHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({ owner: req.user._id })
    .populate({ path: 'reviews', populate: { path: 'user', select: 'name avatar' } })
    .lean();
  res.json({ success: true, data: hotels });
});

// @route GET /api/hotels/owner/bookings - Owner sees bookings for their hotels
exports.getOwnerBookings = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({ owner: req.user._id }).select('_id');
  const hotelIds = hotels.map(h => h._id);

  const bookings = await Booking.find({ hotel: { $in: hotelIds } })
    .populate('hotel', 'name mainImage location pricePerNight')
    .populate('user', 'name email avatar phone')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings, total: bookings.length });
});
