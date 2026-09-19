import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiArrowRight, FiStar, FiShield, FiZap, FiMapPin } from 'react-icons/fi'
import { RiRobotLine, RiMapPinLine } from 'react-icons/ri'
import { MdHotel, MdPeople, MdExplore } from 'react-icons/md'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeaturedHotels } from '../store/slices/hotelSlice'
import HotelCard from '../components/hotel/HotelCard'

const STATS = [
  { value: '500+', label: 'Destinations', icon: <RiMapPinLine /> },
  { value: '10K+', label: 'Happy Travelers', icon: <MdPeople /> },
  { value: '1200+', label: 'Hotels Listed', icon: <MdHotel /> },
  { value: '4.9★', label: 'Average Rating', icon: <FiStar /> },
]

const FEATURES = [
  { icon: <RiRobotLine size={28} />, title: 'AI Trip Planner', desc: 'Generate complete day-by-day itineraries with budget breakdown instantly using advanced AI.', color: 'from-indigo-500 to-indigo-700', text: 'text-white', glow: 'rgba(37,113,188,0.35)' },
  { icon: <MdHotel size={28} />, title: 'Smart Hotel Booking', desc: 'Browse verified hotels, compare prices, read real reviews, and book with one click.', color: 'from-amber-400 to-amber-500', text: 'text-dark-900', glow: 'rgba(255,183,3,0.35)' },
  { icon: <FiShield size={28} />, title: 'Safety Alerts', desc: 'Real-time safety updates, travel advisories, and emergency contacts for every destination.', color: 'from-cyan-400 to-cyan-500', text: 'text-dark-900', glow: 'rgba(142,202,230,0.35)' },
  { icon: <MdExplore size={28} />, title: 'Local Guide Connect', desc: 'Find certified local guides who know every hidden gem in their city.', color: 'from-blue-500 to-indigo-700', text: 'text-white', glow: 'rgba(37,113,188,0.35)' },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', location: 'Mumbai, Maharashtra', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=2571BC&color=fff', rating: 5, text: 'TourEase AI planned my entire Kerala trip in minutes! The AI itinerary was spot-on and the hotel recommendations were perfect. Saved hours of research!' },
  { name: 'Arjun Mehta', location: 'Bangalore, Karnataka', avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=FFB703&color=003060', rating: 5, text: 'Booked a last-minute trip to Rajasthan. Found a luxury hotel at a great price. The AI chatbot helped me pack and plan in real-time. Outstanding!' },
  { name: 'Sneha Patel', location: 'Ahmedabad, Gujarat', avatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=8ECAE6&color=003060', rating: 5, text: 'As a solo female traveler, the safety alerts feature gave me so much confidence. The local guide feature helped me discover hidden gems in Varanasi!' },
]

const DESTINATIONS = [
  { name: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', tag: 'Beach Paradise' },
  { name: 'Rajasthan', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400', tag: 'Royal Desert' },
  { name: 'Kerala', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400', tag: "God's Own Country" },
  { name: 'Manali', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', tag: 'Mountain Haven' },
  { name: 'Agra', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400', tag: 'Taj Mahal' },
  { name: 'Varanasi', img: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=400', tag: 'Spiritual Capital' },
]

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { featuredHotels } = useSelector((s) => s.hotels)

  useEffect(() => { dispatch(fetchFeaturedHotels()) }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/hotels?city=${searchQuery}`)
  }

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-16">
        <div className="floating-orb w-96 h-96 bg-indigo-600 top-10 -left-20" />
        <div className="floating-orb w-80 h-80 bg-cyan-400 bottom-20 -right-20" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#8ECAE6 1px, transparent 1px), linear-gradient(90deg, #8ECAE6 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 badge-primary mb-6 text-sm px-4 py-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              🏆 Smart India Hackathon 2024
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
              Explore India with{' '}
              <span className="gradient-text">AI-Powered</span>
              <br /><span className="text-slate-200">Smart Tourism</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Plan perfect trips, book verified hotels, get real-time safety alerts, and discover hidden gems — all powered by AI.
            </p>

            <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
              <div className="flex-1 relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Where do you want to go? (e.g. Goa, Manali...)" className="input-field pl-11 h-14 text-base" />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary h-14 px-8 text-base flex items-center gap-2 whitespace-nowrap">
                <FiSearch size={18} />Search Hotels
              </motion.button>
            </motion.form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/ai-planner">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                  <RiRobotLine size={20} />Plan Trip with AI<FiArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to="/hotels">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-secondary flex items-center gap-2 text-base">
                  <MdHotel size={20} />Browse Hotels
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-16 flex flex-wrap justify-center gap-4">
            {['🤖 AI-Powered Planning', '🔒 Secure Payments', '⭐ Verified Hotels', '📍 Real-time Alerts'].map((b) => (
              <span key={b} className="glass px-4 py-2 rounded-xl text-sm text-slate-300 border border-white/10">{b}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center">
                <div className="text-indigo-400 flex justify-center mb-2 text-2xl">{stat.icon}</div>
                <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="badge-primary mb-4">🗺️ Explore India</span>
          <h2 className="section-title">Popular <span className="gradient-text">Destinations</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">From snow-capped Himalayas to sun-kissed beaches, discover India's incredible diversity</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DESTINATIONS.map((dest, i) => (
            <motion.div key={dest.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group" style={{ height: i === 0 || i === 5 ? '280px' : '200px' }}
              onClick={() => navigate(`/hotels?city=${dest.name}`)}>
              <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/30 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-lg">{dest.name}</p>
                <p className="text-slate-300 text-xs">{dest.tag}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="badge-primary mb-4">⚡ Powered by AI</span>
            <h2 className="section-title">Smart Features for <span className="gradient-text">Smart Travelers</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} className="card p-6 flex gap-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center ${f.text || 'text-white'} flex-shrink-0`}>{f.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-200 text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
            <Link to="/ai-planner">
              <motion.button whileHover={{ scale: 1.03 }} className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto">
                <FiZap size={18} />Try AI Planner Free<FiArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURED HOTELS */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
          <div>
            <span className="badge-primary mb-4">🏨 Top Picks</span>
            <h2 className="section-title">Featured <span className="gradient-text">Hotels</span></h2>
            <p className="text-slate-400">Handpicked luxury and budget stays across India</p>
          </div>
          <Link to="/hotels" className="btn-secondary text-sm hidden md:flex items-center gap-2">View All <FiArrowRight size={14} /></Link>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHotels.length > 0
            ? featuredHotels.slice(0, 3).map((hotel, i) => <HotelCard key={hotel._id} hotel={hotel} index={i} />)
            : [1,2,3].map((i) => <div key={i} className="card h-80 skeleton" />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/hotels"><motion.button whileHover={{ scale: 1.02 }} className="btn-secondary flex items-center gap-2 mx-auto">Explore All Hotels <FiArrowRight size={16} /></motion.button></Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge-primary mb-4">💬 Reviews</span>
            <h2 className="section-title">What Travelers <span className="gradient-text">Say</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
                <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, j) => <FiStar key={j} size={14} className="text-amber-400 fill-current" />)}</div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-indigo-500/50" />
                  <div>
                    <p className="font-semibold text-slate-200 text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(37,113,188,0.15), rgba(142,202,230,0.15))' }}>
          <div className="floating-orb w-60 h-60 bg-indigo-600 -top-20 -left-20 opacity-10" />
          <div className="floating-orb w-60 h-60 bg-cyan-400 -bottom-20 -right-20 opacity-10" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">Start Your <span className="gradient-text">Dream Trip</span> Today</h2>
            <p className="text-slate-400 mb-8 text-lg">Join 10,000+ travelers who plan smarter with TourEase AI</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup"><motion.button whileHover={{ scale: 1.03 }} className="btn-primary text-base px-10 py-4">🚀 Get Started Free</motion.button></Link>
              <Link to="/ai-planner"><motion.button whileHover={{ scale: 1.03 }} className="btn-secondary text-base flex items-center gap-2"><RiRobotLine size={18} />Try AI Planner</motion.button></Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
