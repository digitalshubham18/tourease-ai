const crypto = require('crypto');
const User = require('../models/User');
const { sendTokenResponse, generateToken } = require('../utils/jwt');
const { sendEmail, emailTemplates } = require('../services/emailService');
const { asyncHandler } = require('../middleware/error');

// @route   POST /api/auth/signup
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'tourist',
    avatar: req.file?.path || '',
  });

  // Generate OTP
  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  // Send verification email
  await sendEmail({
    to: email,
    ...emailTemplates.otp(name, otp),
  });

  res.status(201).json({
    success: true,
    message: 'Account created! Please verify your email with the OTP sent.',
    userId: user._id,
    email: user.email,
  });
});

// @route   POST /api/auth/verify-otp
exports.verifyOTP = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId).select('+emailOTP +emailOTPExpire');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ success: false, message: 'Email already verified' });
  }

  if (user.emailOTP !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  if (user.emailOTPExpire < Date.now()) {
    return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
  }

  user.isEmailVerified = true;
  user.emailOTP = undefined;
  user.emailOTPExpire = undefined;
  await user.save({ validateBeforeSave: false });

  // Send welcome email
  await sendEmail({ to: user.email, ...emailTemplates.welcome(user.name) });

  sendTokenResponse(user, 200, res, 'Email verified successfully! Welcome to TourEase AI!');
});

// @route   POST /api/auth/resend-otp
exports.resendOTP = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ success: false, message: 'Email already verified' });
  }

  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  await sendEmail({ to: user.email, ...emailTemplates.otp(user.name, otp) });

  res.json({ success: true, message: 'OTP resent to your email' });
});

// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!user.password) {
    return res.status(400).json({
      success: false,
      message: 'This account uses Google login. Please sign in with Google.',
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!user.isEmailVerified) {
    // Resend OTP
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });
    await sendEmail({ to: user.email, ...emailTemplates.otp(user.name, otp) });

    return res.status(403).json({
      success: false,
      message: 'Please verify your email. OTP sent.',
      userId: user._id,
      requiresVerification: true,
    });
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Login successful');
});

// @route   GET /api/auth/google/callback - handled by passport
exports.googleCallback = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id);

  res.cookie('token', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}`);
});

// @route   POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'No account found with this email' });
  }

  const resetToken = user.generateResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendEmail({ to: user.email, ...emailTemplates.resetPassword(user.name, resetUrl) });

  res.json({ success: true, message: 'Password reset link sent to your email' });
});

// @route   PUT /api/auth/reset-password/:token
exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

// @route   GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist', 'name mainImage pricePerNight location rating')
    .populate('bookings', 'bookingId status checkIn checkOut totalAmount hotel')
    .lean();

  res.json({ success: true, user });
});

// @route   PUT /api/auth/update-profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'bio', 'location', 'preferences'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (req.file) updates.avatar = req.file.path;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, message: 'Profile updated successfully', user });
});

// @route   PUT /api/auth/change-password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password changed successfully');
});

// @route   POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.json({ success: true, message: 'Logged out successfully' });
});
