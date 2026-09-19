const { Booking, Trip, Destination } = require('../models/index');
const Hotel = require('../models/Hotel');
const { asyncHandler } = require('../middleware/error');

// ===== BOOKING CONTROLLER =====
exports.createBooking = asyncHandler(async (req, res) => {
  const { hotelId, checkIn, checkOut, guests, rooms, specialRequests } = req.body;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  if (nights <= 0) return res.status(400).json({ success: false, message: 'Invalid dates' });

  const totalAmount = hotel.pricePerNight * nights * (rooms || 1);

  const booking = await Booking.create({
    user: req.user._id,
    hotel: hotelId,
    checkIn,
    checkOut,
    guests: guests || { adults: 1, children: 0 },
    rooms: rooms || 1,
    totalAmount,
    specialRequests,
    status: 'confirmed',
    paymentStatus: 'paid',
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate('hotel', 'name mainImage location pricePerNight')
    .populate('user', 'name email');

  res.status(201).json({
    success: true,
    message: 'Booking confirmed!',
    data: populatedBooking,
  });
});

exports.getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('hotel', 'name mainImage location pricePerNight rating')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
});

exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('hotel', 'name mainImage location pricePerNight policies')
    .populate('user', 'name email phone');

  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  res.json({ success: true, data: booking });
});

exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  if (booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Booking already cancelled' });
  }

  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason;
  await booking.save();

  res.json({ success: true, message: 'Booking cancelled', data: booking });
});

// ===== TRIP CONTROLLER =====
exports.createTrip = asyncHandler(async (req, res) => {
  const tripData = { ...req.body, user: req.user._id };
  const trip = await Trip.create(tripData);

  res.status(201).json({ success: true, message: 'Trip planned!', data: trip });
});

exports.getUserTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: trips });
});

exports.getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate('hotels', 'name mainImage location pricePerNight');
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

  res.json({ success: true, data: trip });
});

exports.deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

  if (trip.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await trip.deleteOne();
  res.json({ success: true, message: 'Trip deleted' });
});

// ===== AI TRIP PLANNER =====
exports.generateAITrip = asyncHandler(async (req, res) => {
  const { destination, days, budget, interests, travelType } = req.body;

  // Simulate AI trip generation (integrate with real AI API in production)
  const interestsArray = interests || ['sightseeing', 'food', 'culture'];

  const itinerary = [];
  const activities = {
    sightseeing: ['Visit historical monuments', 'City tour', 'Museum visit', 'Heritage walk'],
    food: ['Local street food tour', 'Traditional restaurant dinner', 'Cooking class', 'Food market visit'],
    adventure: ['Trekking', 'Water sports', 'Rock climbing', 'Camping'],
    culture: ['Cultural show', 'Temple visit', 'Art gallery', 'Folk music event'],
    wildlife: ['Wildlife sanctuary tour', 'Bird watching', 'Nature trail', 'Safari'],
    shopping: ['Local market shopping', 'Craft bazaar', 'Souvenir shopping'],
    wellness: ['Yoga session', 'Ayurvedic spa', 'Meditation retreat', 'Nature walk'],
  };

  for (let day = 1; day <= days; day++) {
    const dayActivities = [];
    const times = ['08:00 AM', '10:30 AM', '01:00 PM', '03:30 PM', '07:00 PM'];
    const durations = ['1.5 hours', '2 hours', '1 hour', '2.5 hours', '2 hours'];

    times.forEach((time, i) => {
      const interest = interestsArray[i % interestsArray.length];
      const actList = activities[interest] || activities['sightseeing'];
      dayActivities.push({
        time,
        activity: actList[Math.floor(Math.random() * actList.length)],
        location: `${destination} - Location ${i + 1}`,
        duration: durations[i],
        cost: Math.floor(Math.random() * 500 + 100),
        notes: `Enjoy the best of ${destination}`,
      });
    });

    itinerary.push({
      day,
      title: `Day ${day} - ${['Arrival & Explore', 'Adventure Day', 'Cultural Immersion', 'Nature & Relaxation', 'Shopping & Departure'][day % 5]}`,
      activities: dayActivities,
    });
  }

  const estimatedCost = {
    accommodation: Math.floor(budget * 0.4),
    food: Math.floor(budget * 0.2),
    transport: Math.floor(budget * 0.2),
    activities: Math.floor(budget * 0.15),
    total: budget,
  };

  const tripData = {
    user: req.user._id,
    title: `${days}-Day ${destination} Trip`,
    destination,
    duration: days,
    budget,
    travelType: travelType || 'solo',
    interests: interestsArray,
    itinerary,
    estimatedCost,
    aiGenerated: true,
    status: 'planning',
  };

  const trip = await Trip.create(tripData);

  res.status(201).json({
    success: true,
    message: 'AI trip plan generated!',
    data: trip,
  });
});

// ===== DESTINATIONS =====
exports.getDestinations = asyncHandler(async (req, res) => {
  const { category, featured, limit = 12 } = req.query;
  const query = {};

  if (category) query.category = category;
  if (featured === 'true') query.isFeatured = true;

  const destinations = await Destination.find(query).limit(Number(limit)).lean();
  res.json({ success: true, data: destinations });
});

exports.getDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });

  res.json({ success: true, data: destination });
});
