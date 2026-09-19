import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { motion } from 'framer-motion'

const sections = [
  { title: '1. Information We Collect', content: `We collect information you provide directly:\n\n• **Account Data**: Name, email, phone number, and profile photo when you register.\n• **Booking Data**: Check-in/check-out dates, guest details, payment confirmation tokens.\n• **Usage Data**: Pages visited, search queries, clicked hotels, device type, and IP address.\n• **Communications**: Messages sent through our support chat or contact form.\n\nWe do NOT store your full card number, CVV, or bank credentials — these are handled securely by Razorpay.` },
  { title: '2. How We Use Your Information', content: `We use collected information to:\n\n• Create and manage your account\n• Process bookings and send confirmations\n• Generate AI-powered trip recommendations tailored to you\n• Send booking reminders, updates, and promotional offers (you can opt out)\n• Improve our platform through analytics\n• Respond to support requests\n• Prevent fraud and ensure platform security` },
  { title: '3. Data Sharing', content: `We share data only when necessary:\n\n• **Hotels**: Booking details (name, phone, dates) are shared with the hotel you book.\n• **Payment Processors**: Razorpay processes payments under their own privacy policy.\n• **Legal Compliance**: We disclose data when required by Indian law or court orders.\n• **Business Transfers**: In case of merger/acquisition, data may transfer to the new entity.\n\nWe never sell your personal data to third parties.` },
  { title: '4. Data Security', content: `We implement robust security measures:\n\n• 256-bit SSL/TLS encryption for all data in transit\n• Bcrypt hashing for passwords (never stored in plain text)\n• JWT tokens with expiry for session management\n• Regular security audits and vulnerability assessments\n• MongoDB Atlas with IP whitelisting and access controls\n• Cloudinary for secure media storage` },
  { title: '5. Your Rights', content: `Under applicable data protection laws, you have the right to:\n\n• **Access**: Request a copy of your personal data we hold\n• **Rectification**: Correct inaccurate or incomplete data\n• **Deletion**: Request deletion of your account and associated data\n• **Portability**: Receive your data in a machine-readable format\n• **Opt-out**: Unsubscribe from marketing emails at any time\n\nTo exercise these rights, email: privacy@tourease.ai` },
  { title: '6. Cookies', content: `We use cookies and similar technologies for:\n\n• **Authentication**: Keeping you logged in securely\n• **Preferences**: Remembering your language and currency settings\n• **Analytics**: Google Analytics to understand platform usage\n• **Advertising**: None — TourEase AI products are ad-free\n\nYou can disable non-essential cookies in your browser settings without affecting core functionality.` },
  { title: '7. Children\'s Privacy', content: `TourEase AI is not directed at children under 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, contact us immediately at privacy@tourease.ai and we will delete it promptly.` },
  { title: '8. Changes to This Policy', content: `We may update this Privacy Policy to reflect changes in our practices or applicable laws. We will notify you of material changes by:\n\n• Email notification to your registered address\n• A prominent notice on the TourEase AI platform\n• Updating the "Last Updated" date below\n\nContinued use of the platform after changes constitutes acceptance.` },
  { title: '9. Contact Us', content: `For privacy-related questions or requests:\n\n📧 Email: privacy@tourease.ai\n📞 Phone: +91 98765 43210\n📍 Address: TourEase AI, New Delhi, India 110001\n\nWe aim to respond to all privacy inquiries within 72 hours.` },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-10">
            <span className="badge-primary mb-4">🔒 Legal</span>
            <h1 className="text-4xl font-black text-slate-100 mb-3">Privacy Policy</h1>
            <p className="text-slate-400">Last updated: December 1, 2024 · Effective: December 1, 2024</p>
            <div className="mt-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
              TourEase AI respects your privacy. This policy explains how we collect, use, and protect your information when you use our platform.
            </div>
          </div>
          <div className="space-y-6">
            {sections.map((sec, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="card p-6">
                <h2 className="font-bold text-slate-200 text-lg mb-4">{sec.title}</h2>
                <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                  {sec.content.split('\n').map((line, j) => (
                    <p key={j} className={line.startsWith('•') ? 'ml-4 mb-1' : line.startsWith('**') ? 'font-semibold text-slate-300 mb-1' : 'mb-2'}>{line.replace(/\*\*/g, '')}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
