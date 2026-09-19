import { motion } from 'framer-motion'
import { FiAward, FiUsers, FiMapPin, FiStar, FiArrowRight } from 'react-icons/fi'
import { RiRobotLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const TEAM = [
  { name: 'Aryan Sharma', role: 'AI & Backend Lead', avatar: 'https://ui-avatars.com/api/?name=Aryan+Sharma&background=2571BC&color=fff&size=128&bold=true', bio: 'Full-stack developer passionate about AI-driven products.' },
  { name: 'Priya Nair', role: 'Frontend & UX Lead', avatar: 'https://ui-avatars.com/api/?name=Priya+Nair&background=1f62a3&color=fff&size=128&bold=true', bio: 'Design-thinking engineer focused on beautiful, accessible UIs.' },
  { name: 'Rohan Mehta', role: 'Data & ML Engineer', avatar: 'https://ui-avatars.com/api/?name=Rohan+Mehta&background=FFB703&color=003060&size=128&bold=true', bio: 'ML practitioner specializing in NLP and recommendation systems.' },
  { name: 'Sneha Patel', role: 'Product & DevOps', avatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=8ECAE6&color=003060&size=128&bold=true', bio: 'Product strategist ensuring seamless deployment and delivery.' },
]

const VALUES = [
  { icon: '🇮🇳', title: 'Made for India', desc: 'Built specifically to promote domestic tourism and showcase India\'s incredible diversity to the world.' },
  { icon: '🤖', title: 'AI-First', desc: 'Every feature is enhanced by AI — from personalized itineraries to smart hotel recommendations.' },
  { icon: '🔒', title: 'Trust & Safety', desc: 'Verified hotels, secure payments, and real-time safety alerts keep every traveler protected.' },
  { icon: '🌱', title: 'Sustainable Tourism', desc: 'We promote eco-friendly travel options and support local communities and small businesses.' },
]

const MILESTONES = [
  { year: '2024', event: 'Founded at Smart India Hackathon 2024', icon: '🏆' },
  { year: '2024', event: 'Launched AI Trip Planner & Hotel Booking', icon: '🚀' },
  { year: '2024', event: '1,000+ hotels onboarded across India', icon: '🏨' },
  { year: '2025', event: 'Reached 10,000+ happy travelers', icon: '🎉' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <section className="py-20 relative overflow-hidden hero-gradient">
          <div className="floating-orb w-96 h-96 bg-indigo-600 -top-20 -left-20 opacity-10" />
          <div className="floating-orb w-80 h-80 bg-cyan-400 -bottom-10 -right-10 opacity-10" style={{ animationDelay: '3s' }} />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <span className="badge-primary mb-6 text-sm px-4 py-2">🏆 Smart India Hackathon 2024</span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-100 mb-6 leading-tight">
                Redefining Travel in <span className="gradient-text">Incredible India</span>
              </h1>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                TourEase AI is a full-stack, AI-powered tourism platform built to make travel planning effortless, safe, and deeply personal for every Indian traveler.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-14 border-y border-white/5">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '500+', label: 'Destinations', icon: <FiMapPin /> },
                { value: '10K+', label: 'Happy Travelers', icon: <FiUsers /> },
                { value: '1200+', label: 'Verified Hotels', icon: <FiAward /> },
                { value: '4.9★', label: 'Avg. Rating', icon: <FiStar /> },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center">
                  <div className="text-indigo-400 flex justify-center mb-2 text-2xl">{s.icon}</div>
                  <div className="text-3xl font-black gradient-text mb-1">{s.value}</div>
                  <div className="text-slate-400 text-sm">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="badge-primary mb-4">🎯 Our Mission</span>
              <h2 className="text-3xl font-black text-slate-100 mb-4">Making India's Tourism <span className="gradient-text">Smarter</span></h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                India has over 500 UNESCO-recognized heritage sites, 7,500 km of coastline, and some of the world's most breathtaking landscapes — yet tourism infrastructure remains fragmented. We're changing that.
              </p>
              <p className="text-slate-400 leading-relaxed">
                TourEase AI bridges the gap between travelers and India's incredible destinations with AI-driven planning, verified hotel listings, real-time safety information, and local guide connections.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              {VALUES.map((v) => (
                <div key={v.title} className="card p-5">
                  <div className="text-3xl mb-2">{v.icon}</div>
                  <h3 className="font-bold text-slate-200 text-sm mb-1">{v.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-dark-800/50">
          <div className="max-w-5xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <span className="badge-primary mb-4">👥 The Team</span>
              <h2 className="text-3xl font-black text-slate-100 mb-3">Built by <span className="gradient-text">Passionate Builders</span></h2>
              <p className="text-slate-400">A team of engineers and designers who love both technology and travel.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {TEAM.map((member, i) => (
                <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center">
                  <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-2xl mx-auto mb-3 border-2 border-indigo-500/40" />
                  <h3 className="font-bold text-slate-200 text-sm">{member.name}</h3>
                  <p className="text-indigo-400 text-xs mb-2">{member.role}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge-primary mb-4">📅 Journey</span>
            <h2 className="text-3xl font-black text-slate-100">Our <span className="gradient-text">Milestones</span></h2>
          </motion.div>
          <div className="relative space-y-6 before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-indigo-500/30">
            {MILESTONES.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-5 pl-16 relative">
                <div className="absolute left-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">{m.icon}</div>
                <div className="card p-4 flex-1">
                  <p className="text-indigo-400 text-xs font-bold mb-1">{m.year}</p>
                  <p className="text-slate-200 font-medium text-sm">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-12" style={{ background: 'linear-gradient(135deg, rgba(37,113,188,0.15), rgba(142,202,230,0.15))' }}>
            <h2 className="text-3xl font-black text-slate-100 mb-4">Ready to Explore <span className="gradient-text">India?</span></h2>
            <p className="text-slate-400 mb-8">Join thousands of travelers planning smarter trips with TourEase AI.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/signup"><motion.button whileHover={{ scale: 1.03 }} className="btn-primary px-8 py-3 flex items-center gap-2">🚀 Get Started <FiArrowRight size={16} /></motion.button></Link>
              <Link to="/ai-planner"><motion.button whileHover={{ scale: 1.03 }} className="btn-secondary px-8 py-3 flex items-center gap-2"><RiRobotLine size={18} />Try AI Planner</motion.button></Link>
            </div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
