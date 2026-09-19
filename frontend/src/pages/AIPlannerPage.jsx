import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZap, FiMapPin, FiDollarSign, FiCalendar, FiUsers, FiSave, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { RiRobotLine } from 'react-icons/ri'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'

const INTERESTS = ['sightseeing','food','adventure','culture','wildlife','shopping','wellness','photography','history','beaches']
const TRAVEL_TYPES = [
  { value: 'solo', label: '🧑 Solo' },
  { value: 'couple', label: '💑 Couple' },
  { value: 'family', label: '👨‍👩‍👧 Family' },
  { value: 'group', label: '👥 Group' },
  { value: 'business', label: '💼 Business' },
]
const DESTINATIONS = ['Goa','Rajasthan','Kerala','Manali','Agra','Varanasi','Mumbai','Delhi','Darjeeling','Coorg','Andaman','Leh-Ladakh']

export default function AIPlannerPage() {
  const [form, setForm] = useState({ destination: '', days: 3, budget: 15000, interests: [], travelType: 'solo' })
  const [loading, setLoading] = useState(false)
  const [trip, setTrip] = useState(null)
  const [expandedDay, setExpandedDay] = useState(0)

  const toggleInterest = (i) => {
    setForm((f) => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] }))
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!form.destination) { toast.error('Please select a destination'); return }
    if (form.interests.length === 0) { toast.error('Please select at least one interest'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/trips/ai-generate', form)
      setTrip(data.data)
      setExpandedDay(0)
      toast.success('AI Trip Plan Generated! 🎉')
      window.scrollTo({ top: 400, behavior: 'smooth' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to generate plan') }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!trip) return
    toast.success('Trip saved to your dashboard!')
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <div className="relative py-16 overflow-hidden hero-gradient">
          <div className="floating-orb w-80 h-80 bg-indigo-600 -top-20 -left-20 opacity-15" />
          <div className="floating-orb w-72 h-72 bg-cyan-400 -bottom-10 -right-10 opacity-15" style={{ animationDelay: '3s' }} />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 text-3xl" style={{ boxShadow: '0 0 30px rgba(37,113,188,0.4)' }}>
                <RiRobotLine className="text-white" size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-100 mb-4">AI Trip <span className="gradient-text">Planner</span></h1>
              <p className="text-slate-400 text-lg">Tell us your preferences and our AI will create a perfect personalized itinerary in seconds.</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card p-8 mb-10">
            <form onSubmit={handleGenerate} className="space-y-7">
              {/* Destination */}
              <div>
                <label className="block font-semibold text-slate-200 mb-3 flex items-center gap-2"><FiMapPin className="text-indigo-400" />Where do you want to go?</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {DESTINATIONS.map((d) => (
                    <button key={d} type="button" onClick={() => setForm({ ...form, destination: d })}
                      className={`px-4 py-2 rounded-xl text-sm border transition-all ${form.destination === d ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300' : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'}`}>
                      {d}
                    </button>
                  ))}
                </div>
                <input type="text" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Or type any destination..." className="input-field text-sm" />
              </div>

              {/* Days & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-slate-200 mb-3 flex items-center gap-2"><FiCalendar className="text-indigo-400" />Trip Duration</label>
                  <div className="flex items-center gap-4">
                    <input type="range" min={1} max={30} value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} className="flex-1 accent-indigo-500" />
                    <span className="text-indigo-400 font-bold text-xl w-20">{form.days} days</span>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-3 flex items-center gap-2"><FiDollarSign className="text-indigo-400" />Total Budget (₹)</label>
                  <div className="flex items-center gap-4">
                    <input type="range" min={5000} max={500000} step={5000} value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} className="flex-1 accent-indigo-500" />
                    <span className="text-indigo-400 font-bold text-lg w-28">₹{form.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Travel Type */}
              <div>
                <label className="block font-semibold text-slate-200 mb-3 flex items-center gap-2"><FiUsers className="text-indigo-400" />Travel Type</label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_TYPES.map((t) => (
                    <button key={t.value} type="button" onClick={() => setForm({ ...form, travelType: t.value })}
                      className={`px-5 py-2.5 rounded-xl text-sm border transition-all ${form.travelType === t.value ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block font-semibold text-slate-200 mb-3">Interests ({form.interests.length} selected)</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <button key={i} type="button" onClick={() => toggleInterest(i)}
                      className={`px-4 py-2 rounded-xl text-sm border capitalize transition-all ${form.interests.includes(i) ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50">
                {loading ? (
                  <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /><span>AI is crafting your perfect trip...</span></>
                ) : (
                  <><FiZap size={20} /><span>Generate AI Trip Plan</span></>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Generated Trip */}
          <AnimatePresence>
            {trip && (
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Trip Header */}
                <div className="card p-6" style={{ background: 'linear-gradient(135deg, rgba(37,113,188,0.15), rgba(142,202,230,0.15))' }}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-100 mb-2">{trip.title}</h2>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="badge-primary">📍 {trip.destination}</span>
                        <span className="badge-primary">📅 {trip.duration} days</span>
                        <span className="badge-primary">👥 {trip.travelType}</span>
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} onClick={handleSave} className="btn-secondary flex items-center gap-2 text-sm">
                      <FiSave size={14} />Save Trip
                    </motion.button>
                  </div>

                  {/* Budget breakdown */}
                  {trip.estimatedCost && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Accommodation', val: trip.estimatedCost.accommodation, icon: '🏨' },
                        { label: 'Food', val: trip.estimatedCost.food, icon: '🍽️' },
                        { label: 'Transport', val: trip.estimatedCost.transport, icon: '🚗' },
                        { label: 'Activities', val: trip.estimatedCost.activities, icon: '🎯' },
                      ].map((item) => (
                        <div key={item.label} className="glass rounded-xl p-3 text-center border border-white/5">
                          <div className="text-xl mb-1">{item.icon}</div>
                          <div className="text-indigo-400 font-bold text-sm">₹{item.val?.toLocaleString()}</div>
                          <div className="text-slate-500 text-xs">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Itinerary */}
                <div>
                  <h3 className="text-xl font-bold text-slate-200 mb-4">📅 Day-by-Day Itinerary</h3>
                  <div className="space-y-3">
                    {trip.itinerary?.map((day, i) => (
                      <motion.div key={day.day} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card overflow-hidden">
                        <button className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors" onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{day.day}</div>
                            <div>
                              <p className="font-semibold text-slate-200">{day.title}</p>
                              <p className="text-xs text-slate-500">{day.activities?.length} activities</p>
                            </div>
                          </div>
                          {expandedDay === i ? <FiChevronUp className="text-slate-400" /> : <FiChevronDown className="text-slate-400" />}
                        </button>

                        <AnimatePresence>
                          {expandedDay === i && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                                {day.activities?.map((act, j) => (
                                  <div key={j} className="flex gap-3 p-3 rounded-xl bg-white/5">
                                    <div className="text-indigo-400 font-mono text-xs w-16 flex-shrink-0 pt-0.5">{act.time}</div>
                                    <div className="flex-1">
                                      <p className="font-medium text-slate-200 text-sm">{act.activity}</p>
                                      <p className="text-slate-500 text-xs mt-0.5">{act.location} • {act.duration}</p>
                                      {act.notes && <p className="text-slate-500 text-xs mt-1 italic">{act.notes}</p>}
                                    </div>
                                    {act.cost > 0 && <div className="text-emerald-400 text-xs font-semibold flex-shrink-0">₹{act.cost}</div>}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  )
}
