const SupportTicket = require('../models/Support');
const { asyncHandler } = require('../middleware/error');
const { sendEmail } = require('../services/emailService');

const WORKING_HOURS = { start: 9, end: 21 }; // 9 AM to 9 PM IST

const isWithinWorkingHours = () => {
  const now = new Date();
  const IST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const hour = IST.getHours();
  return hour >= WORKING_HOURS.start && hour < WORKING_HOURS.end;
};

const AUTO_REPLIES = {
  booking: {
    keywords: ['booking', 'cancel', 'reservation', 'check-in', 'check-out'],
    reply: `Thank you for reaching out about your booking! 🏨\n\nHere's what you can do:\n• To cancel: Go to Dashboard → My Bookings → Cancel\n• Check-in is usually 2 PM, check-out 11 AM (varies by hotel)\n• For modifications, please contact the hotel directly\n\nIf you need further help, our team will respond shortly. Booking ID can be found in your dashboard.`,
  },
  payment: {
    keywords: ['payment', 'refund', 'charge', 'bill', 'invoice', 'money', 'paid'],
    reply: `We understand your payment concern! 💳\n\nImportant info:\n• Refunds for cancellations take 5-7 business days\n• Payment receipts are available in Dashboard → Payment History\n• We support Razorpay, UPI, Cards, and Net Banking\n• For failed payments, try again or use a different method\n\nOur finance team will review your case and respond within 24 hours.`,
  },
  hotel: {
    keywords: ['hotel', 'room', 'amenity', 'facility', 'property', 'staff', 'service'],
    reply: `Thank you for your hotel feedback! 🏨\n\nFor hotel-related issues:\n• Minor issues: Contact hotel reception directly\n• Review complaints: Use our review system on the hotel page\n• Safety concerns: Marked as HIGH PRIORITY — we'll respond within 2 hours\n• Property discrepancy: We'll verify with the hotel owner\n\nYour feedback helps us maintain quality standards for all guests.`,
  },
  account: {
    keywords: ['account', 'login', 'password', 'email', 'profile', 'verify', 'otp'],
    reply: `Let's get your account sorted! 🔐\n\nQuick fixes:\n• Forgot password: Use "Forgot Password" on the login page\n• OTP not received: Check spam, or click "Resend OTP"\n• Email change: Currently not supported — contact us for manual update\n• Account locked: Usually resolves in 30 minutes\n\nFor security issues, we'll prioritize your ticket!`,
  },
  default: {
    reply: `Hello! Thank you for contacting TourEase AI Support! 🙏\n\nWe've received your message and here's what happens next:\n\n${isWithinWorkingHours() ? '✅ We are currently online (9 AM–9 PM IST). A support agent will respond within 30 minutes!' : '⏰ Our team is currently offline. Working hours: 9 AM – 9 PM IST. We\'ll respond first thing tomorrow!'}\n\nFor urgent issues:\n📞 Call: +91 98765 43210\n📧 Email: support@tourease.ai\n\nTicket ID has been assigned. Please keep it for reference.`,
  },
};

const getAutoReply = (subject, message) => {
  const text = (subject + ' ' + message).toLowerCase();
  for (const [key, data] of Object.entries(AUTO_REPLIES)) {
    if (key === 'default') continue;
    if (data.keywords.some(kw => text.includes(kw))) return data.reply;
  }
  return AUTO_REPLIES.default.reply;
};

// @route POST /api/support/ticket
exports.createTicket = asyncHandler(async (req, res) => {
  const { subject, message, category, priority, relatedBooking } = req.body;

  const autoReply = getAutoReply(subject, message);
  const withinHours = isWithinWorkingHours();

  const ticket = await SupportTicket.create({
    user: req.user._id,
    subject,
    category: category || 'other',
    priority: priority || 'medium',
    relatedBooking: relatedBooking || undefined,
    messages: [
      { sender: 'user', senderRef: req.user._id, message },
      {
        sender: 'bot',
        message: autoReply,
        timestamp: new Date(Date.now() + 2000), // 2 second delay simulation
      },
    ],
  });

  // Send confirmation email
  try {
    await sendEmail({
      to: req.user.email,
      subject: `✅ Support Ticket #${ticket.ticketId} Created - TourEase AI`,
      html: `
        <div style="font-family: sans-serif; background: #0a0f1e; padding: 20px; color: #e2e8f0;">
          <div style="max-width: 600px; margin: 0 auto; background: #1a1f3a; border-radius: 16px; padding: 32px; border: 1px solid rgba(99,102,241,0.3);">
            <h2 style="color: #6366f1; margin: 0 0 16px;">Support Ticket Created ✅</h2>
            <p>Hi <strong>${req.user.name}</strong>,</p>
            <p>Your support ticket has been created successfully.</p>
            <div style="background: rgba(99,102,241,0.1); border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #6366f1;">
              <p style="margin: 0;"><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
              <p style="margin: 8px 0 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 8px 0 0;"><strong>Status:</strong> Open</p>
              <p style="margin: 8px 0 0;"><strong>Expected Response:</strong> ${withinHours ? 'Within 30 minutes' : 'Next business day (9 AM IST)'}</p>
            </div>
            <p style="color: #94a3b8; font-size: 14px;">Working Hours: 9 AM – 9 PM IST, 7 days a week</p>
          </div>
        </div>
      `,
    });
  } catch (e) { /* email not critical */ }

  const populated = await SupportTicket.findById(ticket._id).populate('user', 'name email avatar');

  res.status(201).json({
    success: true,
    message: 'Ticket created! Auto-reply sent.',
    data: populated,
    withinWorkingHours: withinHours,
  });
});

// @route GET /api/support/tickets
exports.getUserTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('relatedBooking', 'bookingId hotel')
    .lean();
  res.json({ success: true, data: tickets });
});

// @route POST /api/support/tickets/:id/reply
exports.replyToTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

  const isAdmin = req.user.role === 'admin';
  const isOwner = ticket.user.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) return res.status(403).json({ success: false, message: 'Not authorized' });

  ticket.messages.push({
    sender: isAdmin ? 'support' : 'user',
    senderRef: req.user._id,
    message: req.body.message,
  });

  if (isAdmin && req.body.status) ticket.status = req.body.status;
  if (req.body.status === 'resolved') ticket.resolvedAt = new Date();

  await ticket.save();
  res.json({ success: true, data: ticket });
});

// @route GET /api/support/faq
exports.getFAQ = asyncHandler(async (req, res) => {
  const faqs = [
    { category: 'Booking', q: 'How do I cancel my booking?', a: 'Go to Dashboard → My Bookings → Select booking → Click Cancel. Cancellations made 24+ hours before check-in are fully refunded.' },
    { category: 'Booking', q: 'Can I modify my booking dates?', a: 'Currently, modifications require cancelling and re-booking. Contact the hotel directly for special arrangements.' },
    { category: 'Payment', q: 'What payment methods are accepted?', a: 'We accept all major Credit/Debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Wallets via Razorpay.' },
    { category: 'Payment', q: 'When will I receive my refund?', a: 'Refunds are processed within 24 hours of cancellation and take 5-7 business days to reflect in your account.' },
    { category: 'Account', q: 'How do I verify my email?', a: 'An OTP is sent to your registered email after signup. Enter it on the verification page. Check your spam folder if not received.' },
    { category: 'Account', q: 'Can I sign in with Google?', a: 'Yes! Click "Continue with Google" on the login page. Your Google account will be linked automatically.' },
    { category: 'Hotels', q: 'Are all hotels verified?', a: 'We verify hotel details and ownership. Verified hotels show a ✓ badge. Always check reviews before booking.' },
    { category: 'Hotels', q: 'How does the AI Trip Planner work?', a: 'Enter your destination, budget, duration, and interests. Our AI generates a complete day-by-day itinerary with activity suggestions and budget breakdown.' },
    { category: 'Safety', q: 'What are the safety ratings?', a: 'Safety ratings (1-5) are based on local incident reports, traveler feedback, and official tourism advisories. 5 = Safest.' },
    { category: 'Safety', q: 'What should I do in an emergency?', a: 'India emergency numbers: Police 100, Ambulance 108, Fire 101. Tourist helpline: 1800-11-1363 (toll-free). Always share your itinerary with family.' },
  ];
  res.json({ success: true, data: faqs });
});

// @route POST /api/support/chat
exports.chatSupport = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const withinHours = isWithinWorkingHours();

  const responses = {
    refund: 'Refunds for cancelled bookings are processed within 24 hours and take 5-7 business days to reflect. Check your payment history in Dashboard.',
    cancel: 'To cancel: Dashboard → My Bookings → Select booking → Cancel. Free cancellation if done 24h before check-in.',
    book: 'To book a hotel: Browse Hotels → Select hotel → Click "Book Now" → Choose dates → Complete payment. Instant confirmation!',
    payment: 'We accept UPI, Cards, Net Banking via Razorpay. All transactions are 256-bit SSL encrypted.',
    safety: 'India emergency: Police 100, Ambulance 108. Tourist helpline: 1800-11-1363. Stay safe and share your itinerary!',
    guide: 'Local guides can be found on hotel detail pages. For custom guide bookings, create a support ticket.',
    hotel: `We have ${isWithinWorkingHours() ? '1200+' : '1200+'} verified hotels across India. Use the search and filter on the Hotels page to find your perfect stay.`,
    ai: 'Our AI Planner generates complete itineraries! Go to AI Planner → Enter destination, budget, days & interests → Get instant plan!',
    default: `${withinHours ? '🟢 Support team is online! We\'re here to help.' : '🔴 Support team is offline (returns 9 AM IST).'}\n\nI can help with: bookings, payments, cancellations, account issues, and travel tips! What do you need?`,
  };

  const text = message.toLowerCase();
  let reply = responses.default;
  for (const [key, resp] of Object.entries(responses)) {
    if (key !== 'default' && text.includes(key)) { reply = resp; break; }
  }

  res.json({
    success: true,
    reply,
    withinWorkingHours: withinHours,
    timestamp: new Date().toISOString(),
  });
});
