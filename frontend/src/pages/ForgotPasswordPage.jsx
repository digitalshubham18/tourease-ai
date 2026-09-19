import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Reset link sent!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-8 transition-colors">
          <FiArrowLeft size={16} />Back to Login
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 text-4xl">✅</div>
            <h1 className="text-3xl font-black text-slate-100 mb-3">Check Your Email!</h1>
            <p className="text-slate-400 mb-2">We sent a password reset link to</p>
            <p className="text-indigo-400 font-semibold mb-8">{email}</p>
            <p className="text-slate-500 text-sm">The link expires in 30 minutes. Check your spam folder if you don't see it.</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 text-3xl">🔑</div>
            <h1 className="text-3xl font-black text-slate-100 mb-2">Forgot Password?</h1>
            <p className="text-slate-400 mb-8">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-field pl-11" />
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.01 }} type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Send Reset Link'}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
