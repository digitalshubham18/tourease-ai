import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiHeart, FiMapPin, FiTrendingUp, FiPlus, FiExternalLink } from 'react-icons/fi'
import { MdHotel } from 'react-icons/md'
import { RiRobotLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'

const QUICK_ACTIONS = [
  { to: '/ai-planner', icon: <RiRobotLine size={20} />, label: 'AI Trip Planner', color: 'from-indigo-500 to-indigo-700', text: 'text-white', desc: 'Generate itinerary' },
  { to: '/hotels', icon: <MdHotel size={20} />, label: 'Browse Hotels', color: 'from-amber-400 to-amber-500', text: 'text-dark-900', desc: 'Find perfect stay' },
  { to: '/profile', icon: <FiMapPin size={20} />, label: 'My Profile', color: 'from-cyan-400 to-cyan-500', text: 'text-dark-900', desc: 'Update details' },
]

export default function DashboardPage() {
  const { user } = useSelector((s) => s.auth)
  const [bookings, setBookings] = useState([])
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/bookings'), api.get('/trips')])
      .then(([b, t]) => { setBookings(b.data.data); setTrips(t.data.data) })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  const statusColor = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-error', completed: 'badge-primary' }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=2571BC&color=fff&size=80`} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50" />
            <div>
              <h1 className="text-2xl font-black text-slate-100">Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}!</span> 👋</h1>
              <p className="text-slate-400 capitalize">{user?.role?.replace('_', ' ')} Account</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: <FiCalendar />, color: 'text-indigo-400' },
            { label: 'Trips Planned', value: trips.length, icon: <FiMapPin />, color: 'text-cyan-400' },
            { label: 'Wishlist', value: user?.wishlist?.length || 0, icon: <FiHeart />, color: 'text-pink-400' },
            { label: 'Total Spent', value: `₹${bookings.reduce((s, b) => s + (b.totalAmount || 0), 0).toLocaleString()}`, icon: <FiTrendingUp />, color: 'text-emerald-400' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
              <div className={`${stat.color} text-xl mb-2`}>{stat.icon}</div>
              <div className="text-2xl font-black text-slate-100">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.div key={action.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={action.to}>
                <motion.div whileHover={{ scale: 1.02 }} className="card p-5 flex items-center gap-4 cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center ${action.text || 'text-white'} group-hover:scale-110 transition-transform`}>{action.icon}</div>
                  <div>
                    <p className="font-semibold text-slate-200">{action.label}</p>
                    <p className="text-slate-500 text-sm">{action.desc}</p>
                  </div>
                  <FiExternalLink className="ml-auto text-slate-500 group-hover:text-indigo-400 transition-colors" size={16} />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-200 text-lg">Recent Bookings</h2>
              <Link to="/hotels" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1"><FiPlus size={14} />Book Hotel</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="card h-20 skeleton" />)}</div>
            ) : bookings.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-3">🏨</div>
                <p className="text-slate-400 mb-4">No bookings yet</p>
                <Link to="/hotels"><motion.button whileHover={{ scale: 1.03 }} className="btn-primary px-6 py-2.5 text-sm">Browse Hotels</motion.button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
                  <motion.div key={b._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-4 flex gap-3">
                    <img src={b.hotel?.mainImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-200 text-sm truncate">{b.hotel?.name || 'Hotel'}</p>
                      <p className="text-slate-500 text-xs">{b.hotel?.location?.city} • {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={statusColor[b.status] || 'badge-primary'}>{b.status}</span>
                        <span className="text-indigo-400 text-xs font-semibold">₹{b.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* My Trips */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-200 text-lg">My AI Trips</h2>
              <Link to="/ai-planner" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1"><FiPlus size={14} />New Trip</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="card h-20 skeleton" />)}</div>
            ) : trips.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-3">🗺️</div>
                <p className="text-slate-400 mb-4">No trips planned yet</p>
                <Link to="/ai-planner"><motion.button whileHover={{ scale: 1.03 }} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 mx-auto"><RiRobotLine size={16} />Plan with AI</motion.button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.slice(0, 5).map((t) => (
                  <motion.div key={t._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-4">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-slate-200 text-sm">{t.title}</p>
                      {t.aiGenerated && <span className="badge-primary text-xs">🤖 AI</span>}
                    </div>
                    <p className="text-slate-500 text-xs">{t.destination} • {t.duration} days • ₹{t.budget?.toLocaleString()}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="badge-primary capitalize text-xs">{t.travelType}</span>
                      <span className="badge-warning capitalize text-xs">{t.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
