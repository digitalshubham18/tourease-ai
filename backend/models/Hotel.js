const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      address: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: 'India' },
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    images: [{ type: String }],
    mainImage: { type: String, default: '' },
    amenities: [String],
    category: {
      type: String,
      enum: ['budget', 'standard', 'deluxe', 'luxury', 'boutique', 'resort', 'hostel'],
      default: 'standard',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    totalRooms: { type: Number, default: 10 },
    availableRooms: { type: Number, default: 10 },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    policies: {
      checkIn: { type: String, default: '14:00' },
      checkOut: { type: String, default: '11:00' },
      cancellation: { type: String, default: '24 hours before check-in' },
      petFriendly: { type: Boolean, default: false },
      smokingAllowed: { type: Boolean, default: false },
    },
    tags: [String],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  },
  { timestamps: true }
);

hotelSchema.index({ 'location.city': 1, pricePerNight: 1, 'rating.average': -1 });
hotelSchema.index({ name: 'text', 'location.city': 'text', tags: 'text' });

module.exports = mongoose.model('Hotel', hotelSchema);
