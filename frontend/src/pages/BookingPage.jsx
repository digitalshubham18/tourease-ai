import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowLeft, FiCalendar, FiUsers, FiCreditCard, FiCheck,
  FiShield, FiAlertCircle, FiChevronDown, FiChevronUp, FiInfo, FiLock
} from 'react-icons/fi'
import { MdOutlineVerified, MdAccountBalance } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHotel } from '../store/slices/hotelSlice'
import Navbar from '../components/common/Navbar'
import api from '../utils/api'
import toast from 'react-hot-toast'

/* ─── UPI apps ─── */
const UPI_APPS = [
  { id: 'gpay',    label: 'Google Pay',  emoji: '🟢', color: 'border-[#4285F4]/40 hover:border-[#4285F4]' },
  { id: 'phonepe', label: 'PhonePe',     emoji: '🟣', color: 'border-[#5f259f]/50 hover:border-[#7b3fc4]' },
  { id: 'paytm',   label: 'Paytm',       emoji: '🔵', color: 'border-[#00baf2]/40 hover:border-[#00baf2]' },
  { id: 'bhim',    label: 'BHIM UPI',    emoji: '🇮🇳', color: 'border-orange-500/40 hover:border-orange-400' },
  { id: 'amazon',  label: 'Amazon Pay',  emoji: '🟡', color: 'border-yellow-500/40 hover:border-yellow-400' },
  { id: 'whatsapp',label: 'WhatsApp Pay',emoji: '💬', color: 'border-green-500/40 hover:border-green-400' },
]

/* ─── Banks ─── */
const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda',
  'Canara Bank', 'Union Bank of India', 'Yes Bank',
  'IndusInd Bank', 'IDFC First Bank', 'Federal Bank', 'Other Bank'
]

/* ─── Card Networks ─── */
const CARD_LOGOS = ['VISA','Mastercard','RuPay','Amex','Diners']

/* ─── Wallets ─── */
const WALLETS = [
  { id: 'paytm_wallet', label: 'Paytm Wallet', emoji: '💙' },
  { id: 'mobikwik',     label: 'MobiKwik',     emoji: '💜' },
  { id: 'freecharge',   label: 'Freecharge',   emoji: '🧡' },
  { id: 'amazon_wallet',label: 'Amazon Pay',   emoji: '💛' },
  { id: 'ola_money',    label: 'Ola Money',    emoji: '💚' },
]

/* ─── EMI tenures ─── */
const EMI_BANKS = [
  { bank: 'HDFC Bank', tenures: [3, 6, 9, 12, 18, 24] },
  { bank: 'ICICI Bank', tenures: [3, 6, 9, 12] },
  { bank: 'SBI Card', tenures: [3, 6, 12] },
  { bank: 'Axis Bank', tenures: [3, 6, 9, 12] },
]

const formatCard   = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
const formatExpiry = v => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>=2?d.slice(0,2)+'/'+d.slice(2):d }

export default function BookingPage() {
  const { hotelId } = useParams()
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { currentHotel: hotel } = useSelector(s => s.hotels)
  const { user }    = useSelector(s => s.auth)

  const today    = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now()+86400000).toISOString().split('T')[0]

  const [step, setStep]     = useState(1)        // 1-details 2-payment 3-done
  const [loading, setLoading] = useState(false)
  const [bookingResult, setBookingResult] = useState(null)
  const [payTab, setPayTab] = useState('upi')     // upi | card | netbanking | emi | wallet | cod

  /* Booking form */
  const [form, setForm] = useState({ checkIn:today, checkOut:tomorrow, adults:1, children:0, rooms:1, specialRequests:'' })

  /* Payment state */
  const [selectedUpiApp, setSelectedUpiApp] = useState('')
  const [upiId, setUpiId]   = useState('')
  const [card,  setCard]    = useState({ number:'', name:'', expiry:'', cvv:'', saveCard:false })
  const [bank,  setBank]    = useState('')
  const [emiBank,setEmiBank]= useState('')
  const [emiTenure,setEmiTenure]=useState(3)
  const [wallet,setWallet]  = useState('')

  useEffect(() => { dispatch(fetchHotel(hotelId)); window.scrollTo(0,0) }, [hotelId])

  const nights  = Math.max(1, Math.ceil((new Date(form.checkOut)-new Date(form.checkIn))/86400000))
  const roomCost= hotel ? hotel.pricePerNight*nights*form.rooms : 0
  const gst     = Math.round(roomCost*0.12)
  const convFee = 199
  const total   = roomCost+gst+convFee

  /* EMI calculation */
  const emiRate    = 14   // % p.a.
  const emiMonthly = emiTenure ? Math.round((total*(emiRate/100/12))/( 1-Math.pow(1+emiRate/100/12,-emiTenure))) : 0

  /* ── Step 1 → 2 ── */
  const goToPayment = e => {
    e.preventDefault()
    if(new Date(form.checkOut)<=new Date(form.checkIn)){ toast.error('Check-out must be after check-in'); return }
    setStep(2); window.scrollTo(0,0)
  }

  /* ── Pay ── */
  const pay = async () => {
    /* Validate by tab */
    if(payTab==='upi' && !selectedUpiApp && !upiId.includes('@')){ toast.error('Choose a UPI app or enter a valid UPI ID'); return }
    if(payTab==='card'){
      if(card.number.replace(/\s/g,'').length<16){ toast.error('Enter 16-digit card number'); return }
      if(!card.name.trim()){ toast.error('Enter cardholder name'); return }
      if(card.expiry.length<5){ toast.error('Enter expiry as MM/YY'); return }
      if(card.cvv.length<3){ toast.error('Enter 3-digit CVV'); return }
    }
    if(payTab==='netbanking' && !bank){ toast.error('Select your bank'); return }
    if(payTab==='emi' && !emiBank){ toast.error('Select EMI bank'); return }
    if(payTab==='wallet' && !wallet){ toast.error('Select wallet'); return }

    setLoading(true)
    try {
      const orderRes = await api.post('/payment/create-order',{
        hotelId, checkIn:form.checkIn, checkOut:form.checkOut,
        guests:{adults:form.adults,children:form.children},
        rooms:form.rooms, amount:total,
      })
      const { orderId } = orderRes.data.data

      /* Simulate gateway delay */
      await new Promise(r=>setTimeout(r,2200))

      const verifyRes = await api.post('/payment/verify',{
        orderId, paymentId:`pay_${Date.now()}`, signature:'simulated',
        hotelId, checkIn:form.checkIn, checkOut:form.checkOut,
        guests:{adults:form.adults,children:form.children},
        rooms:form.rooms, specialRequests:form.specialRequests,
      })

      setBookingResult(verifyRes.data.data)
      setStep(3)
      toast.success('Payment successful! Booking confirmed 🎉')
      window.scrollTo(0,0)
    } catch(err){
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally { setLoading(false) }
  }

  if(!hotel) return <div className="min-h-screen bg-dark-900"><Navbar /></div>

  const imgSrc = hotel.mainImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'

  /* ═══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20 max-w-6xl mx-auto px-4 py-8">

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {[{n:1,l:'Booking Details'},{n:2,l:'Payment'},{n:3,l:'Confirmed'}].map((s,i)=>(
            <div key={s.n} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${step>=s.n?'bg-amber-400 text-dark-900':'glass border border-white/10 text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {step>s.n?<FiCheck size={12}/>:s.n}
                </span>
                {s.l}
              </div>
              {i<2&&<div className={`h-px w-6 ${step>s.n?'bg-indigo-500':'bg-white/10'}`}/>}
            </div>
          ))}
        </div>

        {/* ── STEP 3 – Confirmed ── */}
        {step===3 && bookingResult && (
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="max-w-xl mx-auto text-center">
            <div className="card p-10">
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',delay:0.2}}>
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6">
                  <FiCheck size={36} className="text-emerald-400"/>
                </div>
              </motion.div>
              <h1 className="text-3xl font-black text-slate-100 mb-2">Booking Confirmed! 🎉</h1>
              <p className="text-slate-400 mb-6">Your payment was successful.</p>
              <div className="glass rounded-2xl p-5 mb-6 text-left space-y-3 border border-white/10">
                {[
                  ['Booking ID', bookingResult.bookingId, 'text-indigo-400 font-bold'],
                  ['Hotel', bookingResult.hotel?.name, 'text-slate-200 font-medium'],
                  ['Check-in', new Date(bookingResult.checkIn).toLocaleDateString('en-IN',{weekday:'short',year:'numeric',month:'long',day:'numeric'}), 'text-slate-200'],
                  ['Check-out', new Date(bookingResult.checkOut).toLocaleDateString('en-IN',{weekday:'short',year:'numeric',month:'long',day:'numeric'}), 'text-slate-200'],
                  ['Guests', `${bookingResult.guests?.adults} Adults, ${bookingResult.guests?.children} Children`, 'text-slate-200'],
                ].map(([k,v,cls])=>(
                  <div key={k} className="flex justify-between text-sm"><span className="text-slate-400">{k}</span><span className={cls}>{v}</span></div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10">
                  <span className="text-slate-200">Total Paid</span>
                  <span className="text-emerald-400 text-base">₹{bookingResult.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm mb-6">Confirmation sent to <strong className="text-slate-300">{user?.email}</strong></p>
              <div className="flex gap-3 justify-center">
                <motion.button whileHover={{scale:1.02}} onClick={()=>navigate('/dashboard')} className="btn-primary px-8 py-3">Dashboard</motion.button>
                <motion.button whileHover={{scale:1.02}} onClick={()=>navigate('/hotels')} className="btn-secondary px-8 py-3">Book More</motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {step<3 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ──────── LEFT ──────── */}
            <div className="lg:col-span-3 space-y-5">

              {/* STEP 1 */}
              {step===1 && (
                <motion.form onSubmit={goToPayment} initial={{opacity:0}} animate={{opacity:1}} className="space-y-5">
                  {/* Dates */}
                  <div className="card p-6">
                    <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><FiCalendar className="text-indigo-400"/>Select Dates</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {[['Check-in','checkIn',today],['Check-out','checkOut',form.checkIn||today]].map(([lbl,key,mn])=>(
                        <div key={key}>
                          <label className="text-xs text-slate-400 mb-1.5 block">{lbl}</label>
                          <input type="date" min={mn} value={form[key]} required
                            onChange={e=>setForm({...form,[key]:e.target.value})} className="input-field text-sm"/>
                        </div>
                      ))}
                    </div>
                    <p className="text-indigo-400 text-sm mt-3 font-semibold">{nights} night{nights>1?'s':''} stay</p>
                  </div>

                  {/* Guests */}
                  <div className="card p-6">
                    <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2"><FiUsers className="text-indigo-400"/>Guests & Rooms</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {[['adults','Adults',1,10],['children','Children',0,10],['rooms','Rooms',1,hotel.totalRooms||20]].map(([key,lbl,mn,mx])=>(
                        <div key={key} className="text-center">
                          <label className="text-xs text-slate-400 mb-2 block">{lbl}</label>
                          <div className="flex items-center justify-center gap-2">
                            <button type="button" onClick={()=>setForm({...form,[key]:Math.max(mn,form[key]-1)})}
                              className="w-8 h-8 rounded-lg glass border border-white/10 text-slate-300 hover:bg-indigo-500/20 flex items-center justify-center font-bold transition-all">−</button>
                            <span className="w-8 text-center font-bold text-slate-200">{form[key]}</span>
                            <button type="button" onClick={()=>setForm({...form,[key]:Math.min(mx,form[key]+1)})}
                              className="w-8 h-8 rounded-lg glass border border-white/10 text-slate-300 hover:bg-indigo-500/20 flex items-center justify-center font-bold transition-all">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Guest info */}
                  <div className="card p-6">
                    <h2 className="font-bold text-slate-200 mb-4">Guest Information</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div><label className="text-xs text-slate-400 mb-1.5 block">Full Name</label><input className="input-field text-sm opacity-70" defaultValue={user?.name} readOnly/></div>
                      <div><label className="text-xs text-slate-400 mb-1.5 block">Email</label><input className="input-field text-sm opacity-70" defaultValue={user?.email} readOnly/></div>
                      <div className="col-span-2"><label className="text-xs text-slate-400 mb-1.5 block">Phone Number</label><input className="input-field text-sm" placeholder="+91 XXXXX XXXXX" defaultValue={user?.phone}/></div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Special Requests (optional)</label>
                      <textarea value={form.specialRequests} onChange={e=>setForm({...form,specialRequests:e.target.value})}
                        placeholder="E.g. early check-in, top floor room, vegetarian meals, honeymoon decor..." rows={3} className="input-field text-sm resize-none"/>
                    </div>
                  </div>

                  <motion.button whileHover={{scale:1.01}} type="submit" className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
                    Continue to Payment →
                  </motion.button>
                </motion.form>
              )}

              {/* STEP 2 – PAYMENT */}
              {step===2 && (
                <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="space-y-5">
                  <button onClick={()=>setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm">
                    ← Back to Details
                  </button>

                  {/* Secure badge */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <FiLock className="text-emerald-400" size={16}/>
                    <span className="text-emerald-300 text-sm font-medium">256-bit SSL Encrypted • Powered by Razorpay</span>
                    <div className="ml-auto flex gap-2">
                      {['razorpay','upi','visa','mastercard'].map(b=>(
                        <span key={b} className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300 uppercase font-semibold">{b}</span>
                      ))}
                    </div>
                  </div>

                  {/* Payment method tabs */}
                  <div className="card p-1 flex gap-1 flex-wrap">
                    {[
                      {key:'upi',       icon:'📱', label:'UPI'},
                      {key:'card',      icon:'💳', label:'Card'},
                      {key:'netbanking',icon:'🏦', label:'Net Banking'},
                      {key:'emi',       icon:'📅', label:'EMI'},
                      {key:'wallet',    icon:'👛', label:'Wallet'},
                      {key:'cod',       icon:'💵', label:'Pay at Hotel'},
                    ].map(t=>(
                      <button key={t.key} onClick={()=>setPayTab(t.key)}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex-1 justify-center ${payTab===t.key?'bg-amber-400 text-dark-900':'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                        <span>{t.icon}</span>{t.label}
                      </button>
                    ))}
                  </div>

                  {/* ── UPI ── */}
                  <AnimatePresence mode="wait">
                    {payTab==='upi' && (
                      <motion.div key="upi" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card p-6 space-y-5">
                        <h3 className="font-semibold text-slate-200">Pay via UPI</h3>

                        {/* App grid */}
                        <div>
                          <p className="text-xs text-slate-400 mb-3">Select UPI App</p>
                          <div className="grid grid-cols-3 gap-3">
                            {UPI_APPS.map(app=>(
                              <button key={app.id} type="button" onClick={()=>{setSelectedUpiApp(app.id);setUpiId('')}}
                                className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 text-sm font-medium transition-all ${selectedUpiApp===app.id?'border-indigo-400 bg-indigo-500/20 text-indigo-300':('border-white/10 text-slate-400 hover:bg-white/5 '+app.color)}`}>
                                <span className="text-2xl">{app.emoji}</span>
                                <span className="text-xs">{app.label}</span>
                                {selectedUpiApp===app.id && <FiCheck size={12} className="text-indigo-400"/>}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Manual UPI ID */}
                        <div>
                          <p className="text-xs text-slate-400 mb-2">Or enter UPI ID manually</p>
                          <div className="relative">
                            <input value={upiId} onChange={e=>{setUpiId(e.target.value);setSelectedUpiApp('')}}
                              placeholder="yourname@upi" className="input-field text-sm pr-16"/>
                            {upiId.includes('@') && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg">Valid</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1.5">Examples: name@gpay • mobile@paytm • 9876543210@ybl</p>
                        </div>

                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2">
                          <FiInfo size={14} className="text-blue-400 flex-shrink-0 mt-0.5"/>
                          <p className="text-blue-300 text-xs">A payment request will be sent to your UPI app. Open the app to approve payment.</p>
                        </div>
                      </motion.div>
                    )}

                    {/* ── CARD ── */}
                    {payTab==='card' && (
                      <motion.div key="card" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-200">Credit / Debit Card</h3>
                          <div className="flex gap-1.5">
                            {CARD_LOGOS.map(l=>(
                              <span key={l} className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300 font-semibold">{l}</span>
                            ))}
                          </div>
                        </div>

                        {/* Card preview */}
                        <div className="relative h-44 rounded-2xl overflow-hidden" style={{background:'linear-gradient(135deg,#2571BC,#164e91,#003060)'}}>
                          <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)'}}/>
                          <div className="absolute top-4 right-4 w-10 h-7 rounded-md border-2 border-yellow-400/60 bg-yellow-400/20"/>
                          <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-white font-mono text-xl tracking-widest mb-3">{card.number || '•••• •••• •••• ••••'}</p>
                            <div className="flex justify-between">
                              <p className="text-white/70 text-sm">{card.name || 'CARDHOLDER NAME'}</p>
                              <p className="text-white/70 text-sm">{card.expiry || 'MM/YY'}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 mb-1.5 block">Card Number</label>
                          <input value={card.number} onChange={e=>setCard({...card,number:formatCard(e.target.value)})}
                            placeholder="1234 5678 9012 3456" maxLength={19} className="input-field text-sm font-mono tracking-widest"/>
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 mb-1.5 block">Name on Card</label>
                          <input value={card.name} onChange={e=>setCard({...card,name:e.target.value.toUpperCase()})}
                            placeholder="AS ON CARD" className="input-field text-sm uppercase tracking-wide"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-slate-400 mb-1.5 block">Expiry Date</label>
                            <input value={card.expiry} onChange={e=>setCard({...card,expiry:formatExpiry(e.target.value)})}
                              placeholder="MM/YY" maxLength={5} className="input-field text-sm"/>
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 mb-1.5 block flex items-center gap-1">CVV <FiInfo size={11} className="text-slate-500" title="3-digit code on back"/></label>
                            <input type="password" value={card.cvv} onChange={e=>setCard({...card,cvv:e.target.value.replace(/\D/g,'').slice(0,4)})}
                              placeholder="•••" className="input-field text-sm"/>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={card.saveCard} onChange={e=>setCard({...card,saveCard:e.target.checked})} className="accent-indigo-500 w-4 h-4 rounded"/>
                          <span className="text-sm text-slate-400">Save card for future payments</span>
                        </label>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <FiShield size={12} className="text-emerald-400"/>
                          Your card data is encrypted and never stored on our servers.
                        </div>
                      </motion.div>
                    )}

                    {/* ── NET BANKING ── */}
                    {payTab==='netbanking' && (
                      <motion.div key="nb" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card p-6 space-y-4">
                        <h3 className="font-semibold text-slate-200 flex items-center gap-2"><MdAccountBalance className="text-indigo-400"/>Net Banking</h3>
                        <p className="text-xs text-slate-400">Select your bank to be redirected to its secure login page.</p>

                        {/* Popular banks */}
                        <div>
                          <p className="text-xs text-slate-500 mb-2">Popular Banks</p>
                          <div className="grid grid-cols-2 gap-2">
                            {BANKS.slice(0,8).map(b=>(
                              <button key={b} type="button" onClick={()=>setBank(b)}
                                className={`p-3 rounded-xl border text-sm text-left transition-all ${bank===b?'border-indigo-400 bg-indigo-500/20 text-indigo-300':'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'}`}>
                                <span className="flex items-center justify-between">{b}{bank===b&&<FiCheck size={13} className="text-indigo-400"/>}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* All banks dropdown */}
                        <div>
                          <label className="text-xs text-slate-400 mb-1.5 block">All Banks</label>
                          <select value={bank} onChange={e=>setBank(e.target.value)} className="input-field text-sm">
                            <option value="">Select Bank</option>
                            {BANKS.map(b=><option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                        {bank && (
                          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <p className="text-blue-300 text-xs">You will be redirected to <strong>{bank}</strong> secure portal to complete payment.</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ── EMI ── */}
                    {payTab==='emi' && (
                      <motion.div key="emi" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card p-6 space-y-5">
                        <h3 className="font-semibold text-slate-200">No-Cost EMI</h3>
                        <p className="text-xs text-slate-400">Interest charged by bank. Standard EMI rate: {emiRate}% p.a. (representative)</p>

                        {/* Bank cards */}
                        <div className="space-y-3">
                          {EMI_BANKS.map(eb=>(
                            <div key={eb.bank}>
                              <button type="button" onClick={()=>setEmiBank(emiBank===eb.bank?'':eb.bank)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${emiBank===eb.bank?'border-indigo-400 bg-indigo-500/10':'border-white/10 hover:border-white/20'}`}>
                                <span className="text-slate-200 font-medium text-sm">{eb.bank}</span>
                                {emiBank===eb.bank?<FiChevronUp className="text-indigo-400"/>:<FiChevronDown className="text-slate-400"/>}
                              </button>
                              <AnimatePresence>
                                {emiBank===eb.bank && (
                                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                                    <div className="grid grid-cols-3 gap-2 pt-3 pb-1 px-1">
                                      {eb.tenures.map(t=>{
                                        const mo=Math.round((total*(emiRate/100/12))/(1-Math.pow(1+emiRate/100/12,-t)))
                                        return(
                                          <button key={t} type="button" onClick={()=>setEmiTenure(t)}
                                            className={`p-3 rounded-xl border text-center text-xs transition-all ${emiTenure===t&&emiBank===eb.bank?'border-indigo-400 bg-indigo-500/20':'border-white/10 hover:border-white/20'}`}>
                                            <p className="font-bold text-slate-200">{t} months</p>
                                            <p className="text-indigo-400 font-semibold mt-0.5">₹{mo.toLocaleString()}/mo</p>
                                          </button>
                                        )
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>

                        {emiBank && (
                          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
                            <p className="font-semibold text-amber-300 mb-1">EMI Summary</p>
                            <div className="space-y-1 text-amber-200/80 text-xs">
                              <div className="flex justify-between"><span>Total Amount</span><span>₹{total.toLocaleString()}</span></div>
                              <div className="flex justify-between"><span>Tenure</span><span>{emiTenure} months</span></div>
                              <div className="flex justify-between font-semibold text-amber-300"><span>Monthly EMI</span><span>₹{emiMonthly.toLocaleString()}</span></div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ── WALLET ── */}
                    {payTab==='wallet' && (
                      <motion.div key="wallet" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card p-6 space-y-4">
                        <h3 className="font-semibold text-slate-200">Pay via Wallet</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {WALLETS.map(w=>(
                            <button key={w.id} type="button" onClick={()=>setWallet(w.id)}
                              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${wallet===w.id?'border-indigo-400 bg-indigo-500/20 text-indigo-300':'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5'}`}>
                              <span className="text-2xl">{w.emoji}</span>
                              <div className="text-left">
                                <p className="font-medium text-sm">{w.label}</p>
                                {wallet===w.id && <p className="text-xs text-indigo-400 mt-0.5">Selected ✓</p>}
                              </div>
                            </button>
                          ))}
                        </div>
                        {wallet && (
                          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <p className="text-blue-300 text-xs">Make sure your {WALLETS.find(w=>w.id===wallet)?.label} has sufficient balance of ₹{total.toLocaleString()}</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ── PAY AT HOTEL ── */}
                    {payTab==='cod' && (
                      <motion.div key="cod" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card p-6 space-y-4">
                        <h3 className="font-semibold text-slate-200">Pay at Hotel</h3>
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                          {['No advance payment needed','Pay on arrival at the hotel','Keep your booking ID handy','Accepted: Cash, Card, UPI at hotel'].map(l=>(
                            <div key={l} className="flex items-center gap-2 text-emerald-300 text-sm"><FiCheck size={14}/>{l}</div>
                          ))}
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <p className="text-amber-300 text-xs">⚠️ Booking holds until 6 PM on check-in date. Cancel 24h before to avoid penalty.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Demo notice */}
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <FiAlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={14}/>
                    <p className="text-amber-300 text-xs">Demo mode — no real money charged. Production uses live Razorpay with full PCI-DSS compliance.</p>
                  </div>

                  {/* Pay button */}
                  <motion.button whileHover={{scale:1.01}} whileTap={{scale:0.98}} onClick={pay} disabled={loading}
                    className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50">
                    {loading?(
                      <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"/>
                      <span>Processing{payTab==='upi'?' UPI Request':payTab==='card'?' Card Payment':' Payment'}…</span></>
                    ):(
                      <><FiShield size={18}/><span>Pay ₹{total.toLocaleString()} {payTab==='cod'?'at Hotel':'Securely'}</span></>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* ──────── RIGHT – Summary ──────── */}
            <div className="lg:col-span-2">
              <div className="card p-5 sticky top-24 space-y-4">
                <h3 className="font-bold text-slate-200">Booking Summary</h3>
                <img src={imgSrc} alt={hotel.name} className="w-full h-36 object-cover rounded-xl"
                  onError={e=>e.target.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}/>
                <div>
                  <p className="font-semibold text-slate-200 text-sm">{hotel.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{hotel.location?.city}, {hotel.location?.state}</p>
                  <p className="text-amber-400 text-xs mt-1">★ {hotel.rating?.average?.toFixed(1)} ({hotel.rating?.count} reviews)</p>
                </div>
                <div className="space-y-2 text-sm border-t border-white/10 pt-3">
                  {[
                    ['Check-in', new Date(form.checkIn).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})],
                    ['Check-out', new Date(form.checkOut).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})],
                    ['Duration', `${nights} night${nights>1?'s':''}`],
                    ['Guests', `${form.adults+form.children} (${form.rooms} room${form.rooms>1?'s':''})`],
                  ].map(([k,v])=>(
                    <div key={k} className="flex justify-between text-slate-400"><span>{k}</span><span className="text-slate-300">{v}</span></div>
                  ))}
                </div>
                <div className="space-y-2 text-sm border-t border-white/10 pt-3">
                  <div className="flex justify-between text-slate-400">
                    <span>₹{hotel.pricePerNight?.toLocaleString()} × {nights}n × {form.rooms}rm</span>
                    <span className="text-slate-300">₹{roomCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400"><span>GST (12%)</span><span className="text-slate-300">₹{gst.toLocaleString()}</span></div>
                  <div className="flex justify-between text-slate-400"><span>Convenience fee</span><span className="text-slate-300">₹{convFee}</span></div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                    <span className="text-slate-200">Total</span>
                    <span className="text-indigo-400">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-1.5 border-t border-white/10 pt-3">
                  {['Free cancellation before check-in','Instant booking confirmation','Secure 256-bit SSL payment','No hidden charges'].map(t=>(
                    <div key={t} className="flex items-center gap-2 text-xs text-emerald-400">
                      <MdOutlineVerified size={13}/>{t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
