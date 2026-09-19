import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUpload, FiArrowRight } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useDispatch, useSelector } from 'react-redux'
import { signupUser, clearError } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'tourist', label: '🧳 Tourist', desc: 'Plan & book trips' },
  { value: 'hotel_owner', label: '🏨 Hotel Owner', desc: 'List your property' },
  { value: 'guide', label: '🗺️ Guide', desc: 'Offer local tours' },
]

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'tourist' })
  const [showPass, setShowPass] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, pendingVerification, isAuthenticated } = useSelector((s) => s.auth)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
    if (pendingVerification) navigate('/verify-otp')
    return () => dispatch(clearError())
  }, [isAuthenticated, pendingVerification])

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (file) { setAvatar(file); setPreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (k !== 'confirmPassword') fd.append(k, v) })
    if (avatar) fd.append('avatar', avatar)

    const result = await dispatch(signupUser(fd))
    if (signupUser.fulfilled.match(result)) {
      toast.success('Account created! Please verify your email.')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">T</div>
            <span className="text-xl font-bold gradient-text">TourEase AI</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-100 mb-2">Create Account 🚀</h1>
          <p className="text-slate-400">Join 10,000+ travelers on TourEase AI</p>
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
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-dark-700 border-2 border-dashed border-white/20 overflow-hidden flex-shrink-0">
              {preview ? <img src={preview} className="w-full h-full object-cover" alt="preview" /> : <div className="w-full h-full flex items-center justify-center text-slate-500"><FiUser size={24} /></div>}
            </div>
            <label className="cursor-pointer">
              <span className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors">
                <FiUpload size={14} />Upload Profile Photo (optional)
              </span>
              <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
            </label>
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                  className={`p-3 rounded-xl border text-center transition-all text-xs ${form.role === r.value ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300' : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'}`}>
                  <div className="text-lg mb-1">{r.label.split(' ')[0]}</div>
                  <div className="font-medium">{r.label.split(' ').slice(1).join(' ')}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="input-field pl-11" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="input-field pl-11" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 chars" className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat password" className="input-field pl-11" />
              </div>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-50">
            {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><span>Create Account</span><FiArrowRight size={16} /></>}
          </motion.button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
