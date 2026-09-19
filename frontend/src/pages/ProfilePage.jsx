import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiLock, FiUpload } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMe } from '../store/slices/authSlice'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(false)
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '', location: { city: user?.location?.city || '', state: user?.location?.state || '' } })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (typeof v === 'object') Object.entries(v).forEach(([sk, sv]) => fd.append(`${k}[${sk}]`, sv)); else fd.append(k, v) })
      if (avatarFile) fd.append('avatar', avatarFile)
      await api.put('/auth/update-profile', fd)
      dispatch(fetchMe())
      toast.success('Profile updated!')
      setEditing(false)
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    finally { setLoading(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password') }
    finally { setLoading(false) }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)) }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
          <div className="card p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img src={avatarPreview || user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=2571BC&color=fff&size=100`} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/50" />
              {editing && (
                <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-colors">
                  <FiUpload size={12} className="text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-slate-100">{user?.name}</h1>
              <p className="text-slate-400">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="badge-primary capitalize">{user?.role?.replace('_', ' ')}</span>
                {user?.isEmailVerified && <span className="badge-success">✓ Verified</span>}
              </div>
            </div>
            {!editing ? (
              <motion.button whileHover={{ scale: 1.03 }} onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2 text-sm">
                <FiEdit2 size={14} />Edit Profile
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.03 }} onClick={handleSaveProfile} disabled={loading} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave size={14} />Save</>}
                </motion.button>
                <button onClick={() => setEditing(false)} className="btn-ghost text-sm px-4 py-2.5">Cancel</button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 glass rounded-xl p-1 mb-6">
            {['profile', 'security'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-amber-400 text-dark-900' : 'text-slate-400 hover:text-slate-200'}`}>{t}</button>
            ))}
          </div>

          {tab === 'profile' ? (
            <div className="card p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block flex items-center gap-1.5"><FiUser size={13} />Full Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={!editing} className="input-field text-sm disabled:opacity-60" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block flex items-center gap-1.5"><FiMail size={13} />Email</label>
                  <input value={user?.email} disabled className="input-field text-sm opacity-60" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block flex items-center gap-1.5"><FiPhone size={13} />Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!editing} placeholder="+91 98765 43210" className="input-field text-sm disabled:opacity-60" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block flex items-center gap-1.5"><FiMapPin size={13} />City</label>
                  <input value={form.location.city} onChange={(e) => setForm({ ...form, location: { ...form.location, city: e.target.value } })} disabled={!editing} placeholder="Your city" className="input-field text-sm disabled:opacity-60" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} disabled={!editing} placeholder="Tell us about yourself..." rows={3} className="input-field text-sm resize-none disabled:opacity-60" />
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="font-bold text-slate-200 mb-5 flex items-center gap-2"><FiLock className="text-indigo-400" />Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
                {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-sm text-slate-400 mb-2 block">{label}</label>
                    <input type="password" required value={pwForm[key]} onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })} placeholder="••••••••" className="input-field text-sm" />
                  </div>
                ))}
                <motion.button whileHover={{ scale: 1.01 }} type="submit" disabled={loading} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
                  {loading ? 'Changing...' : 'Change Password'}
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
