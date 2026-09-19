import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiHome, FiStar, FiTrendingUp, FiTrash2, FiCheck, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import Navbar from '../components/common/Navbar'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const [tab, setTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [tab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'stats') { const { data } = await api.get('/admin/stats'); setStats(data.data) }
      if (tab === 'users') { const { data } = await api.get('/admin/users'); setUsers(data.data) }
      if (tab === 'hotels') { const { data } = await api.get('/admin/hotels'); setHotels(data.data) }
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  const toggleUser = async (id) => {
    try { await api.put(`/admin/users/${id}/toggle-status`); loadData(); toast.success('Status updated') } catch { toast.error('Failed') }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    try { await api.delete(`/admin/users/${id}`); loadData(); toast.success('User deleted') } catch { toast.error('Failed') }
  }

  const verifyHotel = async (id) => {
    try { await api.put(`/admin/hotels/${id}/verify`); loadData(); toast.success('Hotel verified') } catch { toast.error('Failed') }
  }

  const TABS = [{ key: 'stats', label: '📊 Analytics' }, { key: 'users', label: '👥 Users' }, { key: 'hotels', label: '🏨 Hotels' }]

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl">⚙️</div>
            <div><h1 className="text-2xl font-black text-slate-100">Admin Panel</h1><p className="text-slate-400 text-sm">Manage TourEase AI platform</p></div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-amber-400 text-dark-900' : 'glass border border-white/10 text-slate-400 hover:text-slate-200'}`}>{t.label}</button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map((i) => <div key={i} className="card h-28 skeleton" />)}</div>
          ) : (
            <>
              {/* Stats */}
              {tab === 'stats' && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Users', value: stats.totalUsers, icon: <FiUsers />, color: 'text-indigo-400' },
                      { label: 'Hotels', value: stats.totalHotels, icon: <FiHome />, color: 'text-cyan-400' },
                      { label: 'Bookings', value: stats.totalBookings, icon: <FiStar />, color: 'text-amber-400' },
                      { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: <FiTrendingUp />, color: 'text-emerald-400' },
                    ].map((s) => (
                      <div key={s.label} className="card p-5">
                        <div className={`${s.color} text-xl mb-2`}>{s.icon}</div>
                        <div className="text-2xl font-black text-slate-100">{s.value}</div>
                        <div className="text-slate-400 text-sm">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Bookings */}
                  <div className="card p-6">
                    <h2 className="font-bold text-slate-200 mb-4">Recent Bookings</h2>
                    <div className="space-y-3">
                      {stats.recentBookings?.map((b) => (
                        <div key={b._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                          <img src={b.user?.avatar || `https://ui-avatars.com/api/?name=${b.user?.name}&background=2571BC&color=fff`} alt="" className="w-9 h-9 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-200">{b.user?.name}</p>
                            <p className="text-xs text-slate-500">{b.hotel?.name} • {new Date(b.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className="text-indigo-400 font-bold text-sm">₹{b.totalAmount?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Users */}
              {tab === 'users' && (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="border-b border-white/10">{['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => <th key={h} className="text-left text-xs text-slate-400 font-semibold px-5 py-3">{h}</th>)}</tr></thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=2571BC&color=fff`} alt="" className="w-8 h-8 rounded-full" />
                                <div>
                                  <p className="text-sm font-medium text-slate-200">{u.name}</p>
                                  <p className="text-xs text-slate-500">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3"><span className="badge-primary capitalize text-xs">{u.role?.replace('_', ' ')}</span></td>
                            <td className="px-5 py-3"><span className={u.isActive ? 'badge-success' : 'badge-error'}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                            <td className="px-5 py-3 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="px-5 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => toggleUser(u._id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${u.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}>
                                  {u.isActive ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                                </button>
                                <button onClick={() => deleteUser(u._id)} className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-all">
                                  <FiTrash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Hotels */}
              {tab === 'hotels' && (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="border-b border-white/10">{['Hotel', 'Owner', 'Location', 'Price', 'Rating', 'Actions'].map((h) => <th key={h} className="text-left text-xs text-slate-400 font-semibold px-5 py-3">{h}</th>)}</tr></thead>
                      <tbody>
                        {hotels.map((h) => (
                          <tr key={h._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <img src={h.mainImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=60'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                <div>
                                  <p className="text-sm font-medium text-slate-200">{h.name}</p>
                                  {h.isVerified ? <span className="text-xs text-emerald-400">✓ Verified</span> : <span className="text-xs text-amber-400">Pending</span>}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-slate-400 text-sm">{h.owner?.name}</td>
                            <td className="px-5 py-3 text-slate-400 text-xs">{h.location?.city}, {h.location?.state}</td>
                            <td className="px-5 py-3 text-indigo-400 text-sm font-semibold">₹{h.pricePerNight?.toLocaleString()}</td>
                            <td className="px-5 py-3 text-amber-400 text-sm">★ {h.rating?.average?.toFixed(1)}</td>
                            <td className="px-5 py-3">
                              {!h.isVerified && (
                                <button onClick={() => verifyHotel(h._id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs transition-all">
                                  <FiCheck size={12} />Verify
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
