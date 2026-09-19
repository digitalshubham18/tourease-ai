import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiHome } from 'react-icons/fi'
import { MdHotel } from 'react-icons/md'
import { RiRobotLine } from 'react-icons/ri'
import { logoutUser } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setProfileOpen(false) }, [location.pathname])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Logged out')
    navigate('/')
  }

  const navLinks = [
    { to: '/hotels', label: 'Hotels', icon: <MdHotel size={16} /> },
    { to: '/ai-planner', label: 'AI Planner', icon: <RiRobotLine size={16} /> },
    { to: '/about', label: 'About', icon: null },
    { to: '/support', label: 'Support', icon: null },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">T</div>
            <span className="text-xl font-bold gradient-text">TourEase AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.to) ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                {link.icon}{link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2571BC&color=fff`}
                    alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500/50"
                  />
                  <span className="text-slate-200 text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-60 glass rounded-2xl p-2 border border-white/10 shadow-2xl">
                      <div className="px-3 py-2 mb-2 border-b border-white/10">
                        <p className="font-semibold text-slate-200 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.role?.replace('_', ' ')}</p>
                      </div>
                      {[
                        { to: '/dashboard', label: 'Dashboard', icon: <FiHome size={14} /> },
                        { to: '/profile', label: 'My Profile', icon: <FiUser size={14} /> },
                        ...(user.role === 'hotel_owner' ? [{ to: '/owner', label: 'Owner Dashboard', icon: <MdHotel size={14} /> }] : []),
                        ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel', icon: <FiSettings size={14} /> }] : []),
                      ].map((item) => (
                        <Link key={item.to} to={item.to} onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all">
                          {item.icon}{item.label}
                        </Link>
                      ))}
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all mt-1">
                        <FiLogOut size={14} />Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden glass border-t border-white/10">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all ${isActive(link.to) ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                  {link.icon}{link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 text-sm"><FiHome size={16} />Dashboard</Link>
                  {user?.role === 'hotel_owner' && <Link to="/owner" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 text-sm"><MdHotel size={16} />Owner Dashboard</Link>}
                  {user?.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 text-sm"><FiSettings size={16} />Admin Panel</Link>}
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm"><FiLogOut size={16} />Logout</button>
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <Link to="/login" className="block w-full text-center btn-secondary text-sm py-2.5">Login</Link>
                  <Link to="/signup" className="block w-full text-center btn-primary text-sm py-2.5">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
