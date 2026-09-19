import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { RiRobotLine, RiSendPlaneLine } from 'react-icons/ri'
import { FiX, FiMinimize2 } from 'react-icons/fi'
import { toggleChat } from '../../store/slices/uiSlice'
import { io } from 'socket.io-client'

const QUICK_PROMPTS = [
  'Plan my Goa trip',
  'Best hotels in Agra',
  'Safety tips for solo travel',
  'Budget travel in India',
]

const INITIAL_MSG = {
  id: 1,
  type: 'bot',
  text: "👋 Hi! I'm TourEase AI assistant. I can help you plan trips, find hotels, and explore India's beautiful destinations. What's on your mind?",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}

export default function Chatbot() {
  const { isChatOpen } = useSelector((s) => s.ui)
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const [messages, setMessages] = useState([INITIAL_MSG])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  useEffect(() => {
    if (isChatOpen && !socketRef.current) {
      socketRef.current = io(window.location.origin.replace('5173', '5000'), {
        transports: ['websocket'],
      })

      socketRef.current.on('chat_reply', (data) => {
        setTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: 'bot',
            text: data.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      })
    }
    return () => {
      if (!isChatOpen && socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [isChatOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    const msg = text || input.trim()
    if (!msg) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'user',
        text: msg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setInput('')
    setTyping(true)

    if (socketRef.current?.connected) {
      socketRef.current.emit('chat_message', { message: msg, userId: user?._id })
    } else {
      // Fallback responses
      setTimeout(() => {
        setTyping(false)
        const responses = [
          "Great choice! India has so many amazing places to explore. Let me suggest some popular spots for you.",
          "I can help you plan an amazing trip! Tell me your budget and preferred travel dates.",
          "Based on your interest, I'd recommend visiting between October and March for the best weather.",
          "For the best experience, consider hiring a local guide who can show you hidden gems!",
        ]
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: 'bot',
            text: responses[Math.floor(Math.random() * responses.length)],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }, 1200)
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center text-dark-900 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #FFB703, #ffc72c)', boxShadow: '0 6px 24px rgba(255,183,3,0.4)' }}
      >
        <motion.div animate={{ rotate: isChatOpen ? 180 : 0 }}>
          {isChatOpen ? <FiX size={22} /> : <RiRobotLine size={22} />}
        </motion.div>
        {!isChatOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-dark-900 animate-pulse" />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] glass rounded-2xl flex flex-col overflow-hidden"
            style={{ border: '1px solid rgba(142,202,230,0.35)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10"
              style={{ background: 'linear-gradient(135deg, rgba(37,113,188,0.45), rgba(142,202,230,0.15))' }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <RiRobotLine size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-200 text-sm">TourEase AI</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-xs text-slate-400">Always online</span>
                </div>
              </div>
              <button onClick={() => dispatch(toggleChat())} className="ml-auto text-slate-500 hover:text-slate-300">
                <FiMinimize2 size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.type === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-dark-700 text-slate-300 rounded-bl-sm border border-white/10'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-50 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-dark-700 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto custom-scrollbar">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="whitespace-nowrap text-xs px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all flex-shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 pt-2 border-t border-white/10">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage() }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 input-field text-sm py-2"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center flex-shrink-0 disabled:opacity-50"
                >
                  <RiSendPlaneLine size={16} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
