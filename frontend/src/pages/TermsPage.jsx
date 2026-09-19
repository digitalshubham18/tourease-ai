import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { motion } from 'framer-motion'

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using TourEase AI ("Platform"), you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, please discontinue use of the Platform immediately. These terms apply to all users including tourists, hotel owners, guides, and administrators.' },
  { title: '2. User Accounts', content: 'You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your credentials and all activities under your account. Provide accurate, complete information during registration. Notify us immediately of any unauthorized account access at security@tourease.ai.' },
  { title: '3. Hotel Listings & Bookings', content: 'Hotel owners are responsible for the accuracy of their listings, pricing, availability, and policies. TourEase AI acts as a platform connecting travelers with hotels and is not a party to the accommodation contract. Prices are in Indian Rupees (INR) and inclusive of taxes unless stated otherwise. Availability is not guaranteed until booking is confirmed.' },
  { title: '4. Cancellations & Refunds', content: 'Cancellation policies vary by hotel and are displayed on each listing. Standard policy: Free cancellation if cancelled 24+ hours before check-in. Refunds are credited to the original payment method within 5-7 business days. No-shows are charged the full booking amount. Contact support within 48 hours for disputed charges.' },
  { title: '5. Payment Terms', content: 'All payments are processed securely via Razorpay. By making a payment, you authorize the charge to your selected payment method. TourEase AI charges a convenience fee of ₹199 per booking to cover payment processing costs. We do not store card details on our servers.' },
  { title: '6. Prohibited Conduct', content: 'You may not: post false or misleading hotel reviews; attempt to circumvent our payment system; use the platform for illegal activities; scrape, copy, or redistribute our content; impersonate other users or staff; use automated tools to make bookings; engage in any activity that disrupts the platform.' },
  { title: '7. AI Trip Planner', content: 'The AI Trip Planner generates suggestions based on your inputs and available data. These are recommendations only — not guarantees of availability, pricing, or experience quality. Verify all bookings, safety conditions, and travel requirements independently before traveling.' },
  { title: '8. Limitation of Liability', content: 'TourEase AI is not liable for: acts or omissions of hotels or third-party service providers; travel disruptions due to weather, strikes, or force majeure; personal injury, illness, or loss of property during travel; inaccuracies in AI-generated content. Our maximum liability is limited to the booking amount paid.' },
  { title: '9. Intellectual Property', content: 'All content on TourEase AI — including design, code, text, images, and AI outputs — is owned by TourEase AI or licensed to us. You may not reproduce, distribute, or create derivative works without written permission. User-generated content (reviews, photos) grants us a non-exclusive license to display it on the platform.' },
  { title: '10. Governing Law', content: 'These Terms are governed by the laws of India. Disputes shall be resolved in courts of New Delhi, India. For consumer disputes, you may also approach your local consumer forum under the Consumer Protection Act, 2019.' },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-10">
            <span className="badge-primary mb-4">📄 Legal</span>
            <h1 className="text-4xl font-black text-slate-100 mb-3">Terms of Service</h1>
            <p className="text-slate-400">Last updated: December 1, 2024 · Effective: December 1, 2024</p>
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
              Please read these terms carefully before using TourEase AI. Using our platform means you accept these terms.
            </div>
          </div>
          <div className="space-y-5">
            {sections.map((sec, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} className="card p-6">
                <h2 className="font-bold text-slate-200 text-lg mb-3">{sec.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{sec.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
