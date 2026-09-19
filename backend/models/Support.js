const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticketId: { type: String, unique: true },
  subject: { type: String, required: true },
  category: { type: String, enum: ['booking', 'payment', 'hotel', 'account', 'technical', 'other'], default: 'other' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  messages: [{
    sender: { type: String, enum: ['user', 'support', 'bot'], required: true },
    senderRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
  }],
  resolvedAt: Date,
  relatedBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
}, { timestamps: true });

supportTicketSchema.pre('save', function(next) {
  if (!this.ticketId) {
    this.ticketId = 'TKT' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
