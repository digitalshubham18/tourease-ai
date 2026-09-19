const mongoose = require('mongoose');

// ===== BOOKING MODEL =====
const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
    },
    rooms: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'online' },
    paymentId: { type: String, default: '' },
    orderId: { type: String, default: '' },
    bookingId: { type: String, unique: true },
    specialRequests: String,
    cancellationReason: String,
  },
  { timestamps: true }
);

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'TRE' + Date.now().toString().slice(-8).toUpperCase();
  }
  next();
});

// ===== REVIEW MODEL =====
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    images: [String],
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ hotel: 1, user: 1 }, { unique: true });

// ===== TRIP MODEL =====
const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    duration: { type: Number, required: true },
    budget: { type: Number, required: true },
    travelType: {
      type: String,
      enum: ['solo', 'couple', 'family', 'group', 'business'],
      default: 'solo',
    },
    interests: [String],
    itinerary: [
      {
        day: Number,
        title: String,
        activities: [
          {
            time: String,
            activity: String,
            location: String,
            duration: String,
            cost: Number,
            notes: String,
          },
        ],
      },
    ],
    hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
    estimatedCost: {
      accommodation: Number,
      food: Number,
      transport: Number,
      activities: Number,
      total: Number,
    },
    aiGenerated: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['planning', 'upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'planning',
    },
    notes: String,
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ===== DESTINATION MODEL =====
const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    state: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    mainImage: String,
    category: {
      type: String,
      enum: ['beach', 'mountain', 'heritage', 'wildlife', 'city', 'religious', 'adventure', 'wellness'],
    },
    highlights: [String],
    bestTime: String,
    avgTemperature: String,
    coordinates: { lat: Number, lng: Number },
    rating: { type: Number, default: 4.0 },
    visitorsPerYear: Number,
    tags: [String],
    nearbyAttractions: [String],
    isFeatured: { type: Boolean, default: false },
    safetyRating: { type: Number, default: 4, min: 1, max: 5 },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
const Review = mongoose.model('Review', reviewSchema);
const Trip = mongoose.model('Trip', tripSchema);
const Destination = mongoose.model('Destination', destinationSchema);

module.exports = { Booking, Review, Trip, Destination };

// Re-export with payment fields added (patch via mongoose schema modification)
// Payment fields are added to bookingSchema above: paymentId, orderId
