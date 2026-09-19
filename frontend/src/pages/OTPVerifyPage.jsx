import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import api from '../utils/api'
import { fetchMe } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function OTPVerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { pendingVerification } = useSelector((s) => s.auth)
  const userId = pendingVerification?.userId || location.state?.userId
  const email = pendingVerification?.email || location.state?.email

  useEffect(() => {
    if (!userId) navigate('/signup')
    const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next)
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) { toast.error('Please enter the 6-digit OTP'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/verify-otp', { userId, otp: code })
      localStorage.setItem('token', data.token)
      await dispatch(fetchMe())
      toast.success('Email verified! Welcome to TourEase AI 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
      setOtp(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await api.post('/auth/resend-otp', { userId })
      setCountdown(60); setOtp(['', '', '', '', '', ''])
      toast.success('New OTP sent to your email')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to resend') }
    finally { setResending(false) }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 text-4xl">📧</div>
        <h1 className="text-3xl font-black text-slate-100 mb-2">Verify Your Email</h1>
        <p className="text-slate-400 mb-2">We sent a 6-digit code to</p>
        <p className="text-indigo-400 font-semibold mb-8">{email || 'your email'}</p>

        <div className="flex gap-3 justify-center mb-8">
          {otp.map((digit, i) => (
            <input key={i} ref={(el) => (inputs.current[i] = el)} type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-dark-700 border-2 transition-all outline-none text-slate-100"
              style={{ borderColor: digit ? '#FFB703' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleVerify} disabled={loading}
          className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 mb-6">
          {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : '✓ Verify Email'}
        </motion.button>

        <p className="text-slate-400 text-sm">
          Didn't receive it?{' '}
          {countdown > 0 ? (
            <span className="text-slate-500">Resend in {countdown}s</span>
          ) : (
            <button onClick={handleResend} disabled={resending} className="text-indigo-400 font-semibold hover:text-indigo-300 disabled:opacity-50">
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </p>
      </motion.div>
    </div>
  )
}
