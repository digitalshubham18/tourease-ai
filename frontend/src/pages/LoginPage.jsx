import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
    if (params.get('error') === 'google_failed') toast.error('Google login failed. Please try again.')
    return () => dispatch(clearError())
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center" style={{ background: 'linear-gradient(135deg, #003060 0%, #0f4a8c 100%)' }}>
        <div className="floating-orb w-96 h-96 bg-indigo-600 -top-20 -left-20 opacity-20" />
        <div className="floating-orb w-80 h-80 bg-cyan-400 bottom-0 right-0 opacity-20" style={{ animationDelay: '3s' }} />
        <div className="relative z-10 p-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-8 text-4xl">✈️</div>
            <h2 className="text-4xl font-black text-white mb-4">TourEase <span className="gradient-text">AI</span></h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">India's smartest tourism platform. Plan trips, book hotels, and explore with AI.</p>
            <div className="mt-10 space-y-3">
              {['🤖 AI-powered trip planning', '🏨 1200+ verified hotels', '🔒 Secure & encrypted', '📍 Real-time safety alerts'].map((f) => (
                <div key={f} className="glass rounded-xl px-4 py-3 text-left"><span className="text-slate-300 text-sm">{f}</span></div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">T</div>
              <span className="text-xl font-bold gradient-text">TourEase AI</span>
            </Link>
            <h1 className="text-3xl font-black text-slate-100 mb-2">Welcome back 👋</h1>
            <p className="text-slate-400">Sign in to continue your journey</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
              ⚠️ {error}
            </motion.div>
          )}

          <motion.button whileHover={{ scale: 1.01 }} onClick={() => window.location.href = '/api/auth/google'}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 font-medium transition-all mb-6">
            <FcGoogle size={20} />Continue with Google
          </motion.button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="input-field pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</Link>
            </div>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-50">
              {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><span>Sign In</span><FiArrowRight size={16} /></>}
            </motion.button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-8">
            No account? <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300">Create one free</Link>
          </p>

          {/* <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-xs text-indigo-300 font-semibold mb-2">🔑 Demo Credentials</p>
            <p className="text-xs text-slate-400">Admin: <span className="text-slate-300">admin@tourease.ai / Admin@123456</span></p>
            <p className="text-xs text-slate-400">Owner: <span className="text-slate-300">owner@tourease.ai / Owner@123456</span></p>
          </div> */}
        </motion.div>
      </div>
    </div>
  )
}
