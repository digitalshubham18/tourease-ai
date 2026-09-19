import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiHome, FiCalendar, FiDollarSign, FiStar, FiPlus, FiEdit2, FiEye, FiTrendingUp } from 'react-icons/fi'
import { MdHotel, MdPeople } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'

const statusColor = {
  confirmed: 'badge-success',
  pending: 'badge-warning',
  cancelled: 'badge-error',
  completed: 'badge-primary',
}

export default function OwnerDashboard() {
  const { user } = useSelector((s) => s.auth)
  const [hotels, setHotels] = useState([])
  const [bookings, setBookings] = useState([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/hotels/owner/my-hotels'),
      api.get('/hotels/owner/bookings'),
    ])
      .then(([h, b]) => {
        setHotels(h.data.data)
        setBookings(b.data.data)
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((s, b) => s + (b.totalAmount || 0), 0)

  const stats = [
    { label: 'My Hotels', value: hotels.length, icon: <FiHome />, color: 'text-indigo-400' },
    { label: 'Total Bookings', value: bookings.length, icon: <FiCalendar />, color: 'text-cyan-400' },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: 'text-emerald-400' },
    { label: 'Avg Rating', value: hotels.length ? (hotels.reduce((s, h) => s + (h.rating?.average || 0), 0) / hotels.length).toFixed(1) + '★' : 'N/A', icon: <FiStar />, color: 'text-amber-400' },
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'O')}&background=FFB703&color=003060`}
                alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/50"
              />
              <div>
                <h1 className="text-2xl font-black text-slate-100">
                  Hotel Owner Dashboard 🏨
                </h1>
                <p className="text-slate-400">{user?.name} · {user?.email}</p>
              </div>
            </div>
            <Link to="/owner/add-hotel">
              <motion.button whileHover={{ scale: 1.03 }} className="btn-primary flex items-center gap-2 text-sm">
                <FiPlus size={16} /> Add Hotel
              </motion.button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
                <div className={`${s.color} text-xl mb-2`}>{s.icon}</div>
                <div className="text-2xl font-black text-slate-100">{loading ? '...' : s.value}</div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[{ k: 'overview', l: '📊 Overview' }, { k: 'bookings', l: '📅 Bookings' }, { k: 'hotels', l: '🏨 My Hotels' }].map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.k ? 'bg-amber-400 text-dark-900' : 'glass border border-white/10 text-slate-400 hover:text-slate-200'}`}>
                {t.l}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent bookings */}
              <div className="card p-6">
                <h2 className="font-bold text-slate-200 mb-4">Recent Bookings</h2>
                {loading ? (
                  <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
                ) : bookings.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-6">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <img
                          src={b.user?.avatar || `https://ui-avatars.com/api/?name=${b.user?.name}&background=2571BC&color=fff`}
                          alt="" className="w-9 h-9 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 text-sm font-medium truncate">{b.user?.name}</p>
                          <p className="text-slate-500 text-xs">{b.hotel?.name} · {new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} → {new Date(b.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-indigo-400 font-bold text-sm">₹{b.totalAmount?.toLocaleString()}</p>
                          <span className={`text-xs ${statusColor[b.status]}`}>{b.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hotels performance */}
              <div className="card p-6">
                <h2 className="font-bold text-slate-200 mb-4">Hotels Performance</h2>
                {hotels.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-slate-500 text-sm mb-3">No hotels listed yet</p>
                    <Link to="/owner/add-hotel">
                      <button className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 mx-auto"><FiPlus size={14} />Add Your First Hotel</button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hotels.map((h) => (
                      <div key={h._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <img src={h.mainImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80'} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 text-sm font-medium truncate">{h.name}</p>
                          <p className="text-slate-500 text-xs">{h.location?.city} · ★ {h.rating?.average?.toFixed(1)} · {h.rating?.count} reviews</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-indigo-400 font-bold text-sm">₹{h.pricePerNight?.toLocaleString()}</p>
                          <p className="text-slate-500 text-xs">{h.availableRooms}/{h.totalRooms} rooms</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BOOKINGS TABLE */}
          {tab === 'bookings' && (
            <div className="card overflow-hidden">
              {loading ? (
                <div className="p-6 space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="h-14 skeleton rounded-xl" />)}</div>
              ) : bookings.length === 0 ? (
                <div className="p-10 text-center"><div className="text-4xl mb-3">📅</div><p className="text-slate-400">No bookings for your hotels yet</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Guest', 'Hotel', 'Dates', 'Rooms', 'Amount', 'Status', 'Booked On'].map((h) => (
                          <th key={h} className="text-left text-xs text-slate-400 font-semibold px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <img src={b.user?.avatar || `https://ui-avatars.com/api/?name=${b.user?.name}&background=2571BC&color=fff`} alt="" className="w-8 h-8 rounded-full" />
                              <div>
                                <p className="text-sm font-medium text-slate-200">{b.user?.name}</p>
                                <p className="text-xs text-slate-500">{b.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-sm text-slate-300">{b.hotel?.name}</p>
                            <p className="text-xs text-slate-500">{b.hotel?.location?.city}</p>
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-400">
                            {new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} →{' '}
                            {new Date(b.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </td>
                          <td className="px-5 py-3 text-sm text-slate-300">{b.rooms} room{b.rooms > 1 ? 's' : ''}</td>
                          <td className="px-5 py-3 text-indigo-400 font-bold text-sm">₹{b.totalAmount?.toLocaleString()}</td>
                          <td className="px-5 py-3"><span className={`badge text-xs capitalize ${statusColor[b.status]}`}>{b.status}</span></td>
                          <td className="px-5 py-3 text-xs text-slate-500">{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* MY HOTELS */}
          {tab === 'hotels' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-400 text-sm">{hotels.length} hotel{hotels.length !== 1 ? 's' : ''} listed</p>
                <Link to="/owner/add-hotel"><button className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2"><FiPlus size={14} />Add Hotel</button></Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {hotels.map((h) => (
                  <motion.div key={h._id} whileHover={{ y: -3 }} className="card overflow-hidden">
                    <div className="relative h-40">
                      <img src={h.mainImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'} alt={h.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {h.isVerified && <span className="badge-success text-xs">✓ Verified</span>}
                        {h.featured && <span className="badge-warning text-xs">⭐ Featured</span>}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-200 mb-1">{h.name}</h3>
                      <p className="text-slate-400 text-xs mb-3">{h.location?.city}, {h.location?.state}</p>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-indigo-400 font-bold">₹{h.pricePerNight?.toLocaleString()}/night</span>
                        <span className="text-amber-400">★ {h.rating?.average?.toFixed(1)} ({h.rating?.count})</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/hotels/${h._id}`} className="flex-1">
                          <button className="w-full btn-ghost text-xs py-2 flex items-center justify-center gap-1 border border-white/10"><FiEye size={12} />View</button>
                        </Link>
                        <button className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1"><FiEdit2 size={12} />Edit</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
