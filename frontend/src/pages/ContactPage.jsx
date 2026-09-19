import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { RiRobotLine } from 'react-icons/ri'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import toast from 'react-hot-toast'

const CONTACTS = [
  { icon: <FiMail className="text-indigo-400" size={20} />, label: 'Email', value: 'support@tourease.ai' },
  { icon: <FiPhone className="text-cyan-400" size={20} />, label: 'Phone', value: '+91 98765 43210' },
  { icon: <FiMapPin className="text-pink-400" size={20} />, label: 'Location', value: 'New Delhi, India' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('Message sent! We will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <div className="py-16 hero-gradient text-center relative overflow-hidden">
          <div className="floating-orb w-64 h-64 bg-indigo-600 -top-20 left-1/4 opacity-15" />
          <div className="relative max-w-2xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="badge-primary mb-4">📬 Get in Touch</span>
              <h1 className="text-4xl font-black text-slate-100 mb-3">Contact <span className="gradient-text">Us</span></h1>
              <p className="text-slate-400">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-slate-200 mb-6">Let's talk</h2>
              {CONTACTS.map((c) => (
                <motion.div key={c.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center">{c.icon}</div>
                  <div>
                    <p className="text-xs text-slate-500">{c.label}</p>
                    <p className="text-sm font-medium text-slate-200">{c.value}</p>
                  </div>
                </motion.div>
              ))}

              <div className="card p-5 mt-6" style={{ background: 'linear-gradient(135deg, rgba(37,113,188,0.15), rgba(142,202,230,0.15))' }}>
                <div className="flex items-center gap-3 mb-3">
                  <RiRobotLine size={24} className="text-indigo-400" />
                  <p className="font-semibold text-slate-200">AI Chatbot Available 24/7</p>
                </div>
                <p className="text-slate-400 text-sm">For instant help, use our AI chatbot. Click the robot icon at the bottom right!</p>
              </div>
            </div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 card p-8">
              <h2 className="text-xl font-bold text-slate-200 mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="input-field text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Subject</label>
                  <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." className="input-field text-sm resize-none" />
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
                  className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><FiSend size={16} />Send Message</>}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
