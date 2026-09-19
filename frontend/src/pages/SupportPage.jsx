import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiPlus, FiChevronDown, FiChevronUp, FiCheck, FiClock, FiMessageCircle, FiPhone, FiMail, FiZap } from 'react-icons/fi'
import { RiRobotLine } from 'react-icons/ri'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'booking', label: '🏨 Booking Issue' },
  { value: 'payment', label: '💳 Payment Problem' },
  { value: 'hotel', label: '🏠 Hotel Complaint' },
  { value: 'account', label: '👤 Account Help' },
  { value: 'technical', label: '🔧 Technical Issue' },
  { value: 'other', label: '💬 Other' },
]

export default function SupportPage() {
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const [tab, setTab] = useState('chat')
  const [tickets, setTickets] = useState([])
  const [faqs, setFaqs] = useState([])
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: '👋 Hi! I\'m TourEase Support AI. I can answer questions about bookings, payments, hotels, and more. How can I help you today?', time: new Date() }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '', category: 'booking' })
  const [submitting, setSubmitting] = useState(false)
  const chatEndRef = useRef(null)
  const isOnline = new Date().getHours() >= 9 && new Date().getHours() < 21

  useEffect(() => { loadFAQs() }, [])
  useEffect(() => { if (isAuthenticated && tab === 'tickets') loadTickets() }, [tab, isAuthenticated])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  const loadFAQs = async () => {
    try { const { data } = await api.get('/support/faq'); setFaqs(data.data) } catch {}
  }
  const loadTickets = async () => {
    try { const { data } = await api.get('/support/tickets'); setTickets(data.data) } catch {}
  }

  const sendChat = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: new Date() }])
    setChatLoading(true)
    try {
      const { data } = await api.post('/support/chat', { message: userMsg })
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: 'bot', text: data.reply, time: new Date() }])
        setChatLoading(false)
      }, 800)
    } catch {
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I\'m having trouble connecting. Please try again or raise a ticket.', time: new Date() }])
      setChatLoading(false)
    }
  }

  const submitTicket = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to create a support ticket'); return }
    setSubmitting(true)
    try {
      await api.post('/support/ticket', ticketForm)
      toast.success('Support ticket created! Check your email for confirmation.')
      setTicketForm({ subject: '', message: '', category: 'booking' })
      setTab('tickets')
      loadTickets()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create ticket') }
    finally { setSubmitting(false) }
  }

  const statusColors = { open: 'badge-warning', in_progress: 'badge-primary', resolved: 'badge-success', closed: 'text-slate-500 bg-slate-500/20 border border-slate-500/30' }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <div className="py-14 hero-gradient text-center relative overflow-hidden">
          <div className="floating-orb w-64 h-64 bg-indigo-600 -top-20 left-1/4 opacity-10" />
          <div className="relative max-w-2xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-xl text-sm font-medium ${isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                {isOnline ? '🟢 Support Online (9 AM–9 PM IST)' : '⭕ Support Offline — Back at 9 AM IST'}
              </div>
              <h1 className="text-4xl font-black text-slate-100 mb-3">How can we <span className="gradient-text">help?</span></h1>
              <p className="text-slate-400">24/7 AI Support + Human agents 9 AM–9 PM IST, 7 days a week</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Quick contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <FiPhone className="text-indigo-400" size={20} />, title: 'Call Us', value: '+91 98765 43210', sub: isOnline ? 'Available now' : 'Calls 9 AM–9 PM' },
              { icon: <FiMail className="text-cyan-400" size={20} />, title: 'Email Us', value: 'support@tourease.ai', sub: 'Reply within 24h' },
              { icon: <FiZap className="text-amber-400" size={20} />, title: 'Response Time', value: isOnline ? '< 30 minutes' : 'Next morning', sub: isOnline ? 'We\'re online now' : 'Send us a ticket' },
            ].map((c) => (
              <div key={c.title} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center flex-shrink-0">{c.icon}</div>
                <div><p className="text-xs text-slate-500">{c.title}</p><p className="font-semibold text-slate-200 text-sm">{c.value}</p><p className="text-xs text-slate-500">{c.sub}</p></div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[{ key: 'chat', label: '🤖 AI Chat' }, { key: 'ticket', label: '🎫 New Ticket' }, { key: 'tickets', label: '📋 My Tickets' }, { key: 'faq', label: '❓ FAQ' }].map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-amber-400 text-dark-900' : 'glass border border-white/10 text-slate-400 hover:text-slate-200'}`}>{t.label}</button>
            ))}
          </div>

          {/* Chat */}
          {tab === 'chat' && (
            <div className="card overflow-hidden" style={{ height: '520px', display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-indigo-500/10">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><RiRobotLine className="text-white" size={18} /></div>
                <div><p className="font-semibold text-slate-200 text-sm">TourEase Support AI</p><div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><span className="text-xs text-slate-400">Always available</span></div></div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-dark-700 text-slate-300 rounded-bl-sm border border-white/10'}`}>
                      {msg.text}
                      <p className="text-xs opacity-40 mt-1">{msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-dark-700 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">{[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}</div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              {/* Quick prompts */}
              <div className="px-4 py-2 flex gap-2 overflow-x-auto">
                {['How to cancel?', 'Refund status?', 'Change booking', 'Safety tips'].map(p => (
                  <button key={p} onClick={() => { setChatInput(p); }} className="whitespace-nowrap text-xs px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 flex-shrink-0">{p}</button>
                ))}
              </div>
              <form onSubmit={sendChat} className="p-4 pt-0 flex gap-2">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask anything about your booking or travel..." className="flex-1 input-field text-sm py-2.5" />
                <motion.button whileTap={{ scale: 0.9 }} type="submit" disabled={!chatInput.trim() || chatLoading} className="btn-primary w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 disabled:opacity-50"><FiSend size={15} /></motion.button>
              </form>
            </div>
          )}

          {/* New Ticket */}
          {tab === 'ticket' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <div className="card p-8">
                <h2 className="font-bold text-slate-200 text-xl mb-2">Create Support Ticket</h2>
                <p className="text-slate-400 text-sm mb-6">Our team will respond {isOnline ? 'within 30 minutes' : 'next business day (9 AM IST)'}.</p>
                {!isAuthenticated && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-amber-300 text-sm">⚠️ Please login to create a support ticket and track your issues.</div>
                )}
                <form onSubmit={submitTicket} className="space-y-5">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((c) => (
                        <button key={c.value} type="button" onClick={() => setTicketForm({ ...ticketForm, category: c.value })}
                          className={`p-3 rounded-xl border text-sm text-left transition-all ${ticketForm.category === c.value ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Subject</label>
                    <input required value={ticketForm.subject} onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })} placeholder="Brief description of your issue" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Describe your issue</label>
                    <textarea required rows={5} value={ticketForm.message} onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })} placeholder="Please provide as much detail as possible, including booking IDs, dates, and what happened..." className="input-field text-sm resize-none" />
                  </div>
                  <motion.button whileHover={{ scale: 1.01 }} type="submit" disabled={submitting || !isAuthenticated}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiPlus size={16} />Create Support Ticket</>}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* My Tickets */}
          {tab === 'tickets' && (
            <div>
              {!isAuthenticated ? (
                <div className="card p-10 text-center"><p className="text-slate-400">Please login to view your tickets.</p></div>
              ) : tickets.length === 0 ? (
                <div className="card p-10 text-center"><div className="text-4xl mb-3">🎫</div><p className="text-slate-400 mb-4">No support tickets yet</p><button onClick={() => setTab('ticket')} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 mx-auto"><FiPlus size={14} />Create Ticket</button></div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <motion.div key={ticket._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-semibold text-slate-200">{ticket.subject}</p>
                          <p className="text-xs text-slate-500 mt-0.5">#{ticket.ticketId} • {new Date(ticket.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`badge capitalize ${statusColors[ticket.status]}`}>{ticket.status.replace('_', ' ')}</span>
                          <span className="badge-primary capitalize">{ticket.category}</span>
                        </div>
                      </div>
                      {/* Messages */}
                      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {ticket.messages?.map((msg, i) => (
                          <div key={i} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-3 py-2 rounded-xl text-xs max-w-[80%] whitespace-pre-line ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : msg.sender === 'bot' ? 'bg-purple-500/20 text-purple-200 border border-purple-500/20' : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/20'}`}>
                              <p className="font-medium opacity-60 mb-0.5">{msg.sender === 'bot' ? '🤖 Auto-reply' : msg.sender === 'support' ? '👤 Support' : '👤 You'}</p>
                              {msg.message}
                            </div>
                          </div>
                        ))}
                      </div>
                      {ticket.status === 'open' && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-slate-500">
                          <FiClock size={12} />{isOnline ? 'Agent will respond within 30 minutes' : 'Agent will respond next business day'}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FAQ */}
          {tab === 'faq' && (
            <div className="max-w-3xl space-y-3">
              {Object.entries(faqs.reduce((acc, faq) => { (acc[faq.category] = acc[faq.category] || []).push(faq); return acc }, {})).map(([cat, items]) => (
                <div key={cat}>
                  <h3 className="text-sm font-semibold text-indigo-400 mb-2 flex items-center gap-2"><span className="w-px h-4 bg-indigo-500 rounded" />{cat}</h3>
                  {items.map((faq, i) => (
                    <motion.div key={i} className="card mb-2 overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setExpandedFaq(expandedFaq === `${cat}-${i}` ? null : `${cat}-${i}`)}>
                        <p className="font-medium text-slate-200 text-sm pr-4">{faq.q}</p>
                        {expandedFaq === `${cat}-${i}` ? <FiChevronUp className="text-slate-400 flex-shrink-0" /> : <FiChevronDown className="text-slate-400 flex-shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {expandedFaq === `${cat}-${i}` && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                            <p className="px-4 pb-4 text-slate-400 text-sm border-t border-white/5 pt-3 leading-relaxed">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
