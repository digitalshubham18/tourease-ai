const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

const emailTemplates = {
  otp: (name, otp) => ({
    subject: '🔐 TourEase AI - Email Verification OTP',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: 'Segoe UI', sans-serif; background: #0a0f1e; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1f3a 0%, #0d1117 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(99, 102, 241, 0.3);">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">✈️ TourEase AI</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Smart Tourism Platform</p>
            </div>
            <div style="padding: 40px;">
              <h2 style="color: #e2e8f0; margin: 0 0 16px;">Hello, ${name}! 👋</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">Your email verification OTP is:</p>
              <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <span style="font-size: 48px; font-weight: 900; color: white; letter-spacing: 12px;">${otp}</span>
              </div>
              <p style="color: #64748b; font-size: 14px;">⏰ This OTP expires in <strong style="color: #f59e0b;">10 minutes</strong></p>
              <p style="color: #64748b; font-size: 14px;">🔒 Never share this OTP with anyone.</p>
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(99,102,241,0.2);">
                <p style="color: #475569; font-size: 12px; text-align: center;">© 2024 TourEase AI | Smart India Hackathon</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  resetPassword: (name, resetUrl) => ({
    subject: '🔑 TourEase AI - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: 'Segoe UI', sans-serif; background: #0a0f1e; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1f3a 0%, #0d1117 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(99, 102, 241, 0.3);">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">✈️ TourEase AI</h1>
            </div>
            <div style="padding: 40px;">
              <h2 style="color: #e2e8f0;">Hello, ${name}! 👋</h2>
              <p style="color: #94a3b8; font-size: 16px;">We received a request to reset your password.</p>
              <a href="${resetUrl}" style="display: block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; text-align: center; font-weight: 700; font-size: 16px; margin: 24px 0;">Reset Password</a>
              <p style="color: #64748b; font-size: 14px;">⏰ This link expires in <strong style="color: #f59e0b;">30 minutes</strong></p>
              <p style="color: #64748b; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  welcome: (name) => ({
    subject: '🎉 Welcome to TourEase AI - Your Journey Begins!',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: 'Segoe UI', sans-serif; background: #0a0f1e; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1f3a 0%, #0d1117 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(99, 102, 241, 0.3);">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Welcome Aboard!</h1>
            </div>
            <div style="padding: 40px;">
              <h2 style="color: #e2e8f0;">Hey ${name}, you're in! 🚀</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.8;">Your TourEase AI account is all set. Start exploring India's beautiful destinations with AI-powered trip planning!</p>
              <div style="display: grid; gap: 12px; margin: 24px 0;">
                <div style="background: rgba(99,102,241,0.1); border-radius: 8px; padding: 16px; border-left: 3px solid #6366f1;">🗺️ <strong style="color: #e2e8f0;">AI Trip Planner</strong> - Plan your perfect trip in seconds</div>
                <div style="background: rgba(6,182,212,0.1); border-radius: 8px; padding: 16px; border-left: 3px solid #06b6d4;">🏨 <strong style="color: #e2e8f0;">Hotel Booking</strong> - Find and book top hotels across India</div>
                <div style="background: rgba(16,185,129,0.1); border-radius: 8px; padding: 16px; border-left: 3px solid #10b981;">🤖 <strong style="color: #e2e8f0;">AI Chatbot</strong> - 24/7 travel assistance</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

const sendEmail = async ({ to, ...templateData }) => {
  try {
    const transporter = createTransporter();
    const template = templateData;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'TourEase AI <noreply@tourease.ai>',
      to,
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    // Don't throw - log and continue
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail, emailTemplates };
