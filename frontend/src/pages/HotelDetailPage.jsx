import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiStar, FiWifi, FiCheck, FiArrowLeft, FiHeart, FiShare2 } from 'react-icons/fi'
import { MdPool, MdSpa, MdRestaurant, MdLocalParking } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHotel } from '../store/slices/hotelSlice'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StarRating from '../components/common/StarRating'
import api from '../utils/api'
import toast from 'react-hot-toast'

const amenityIcons = { 'Free WiFi': <FiWifi />, 'Swimming Pool': <MdPool />, 'Spa': <MdSpa />, 'Restaurant': <MdRestaurant />, 'Parking': <MdLocalParking /> }

export default function HotelDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentHotel: hotel, loading } = useSelector((s) => s.hotels)
  const { isAuthenticated } = useSelector((s) => s.auth)
  const [activeImg, setActiveImg] = useState(0)
  const [review, setReview] = useState({ rating: 5, title: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchHotel(id))
    window.scrollTo(0, 0)
  }, [id])

  const handleReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to add a review'); return }
    setSubmitting(true)
    try {
      await api.post(`/hotels/${id}/reviews`, review)
      toast.success('Review added!')
      dispatch(fetchHotel(id))
      setReview({ rating: 5, title: '', comment: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add review') }
    finally { setSubmitting(false) }
  }

  if (loading || !hotel) return (
    <div className="min-h-screen bg-dark-900"><Navbar /><div className="pt-20"><LoadingSpinner size="lg" text="Loading hotel details..." /></div></div>
  )

  const images = hotel.images?.length ? hotel.images : [hotel.mainImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800']

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 transition-colors">
          <FiArrowLeft size={16} />Back to Hotels
        </button>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 h-72 md:h-96">
            <img src={images[activeImg]} alt={hotel.name} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} />
          </div>
          <div className="grid grid-rows-2 gap-3">
            {images.slice(1, 3).map((img, i) => (
              <div key={i} className="h-36 md:h-auto cursor-pointer" onClick={() => setActiveImg(i + 1)}>
                <img src={img} alt="" className="w-full h-full object-cover hover:opacity-80 transition-opacity" onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400'} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="badge-primary capitalize">{hotel.category}</span>
                    {hotel.isVerified && <span className="badge-success">✓ Verified</span>}
                    {hotel.featured && <span className="badge-warning">⭐ Featured</span>}
                  </div>
                  <h1 className="text-3xl font-black text-slate-100">{hotel.name}</h1>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 border border-white/10 transition-all"><FiHeart size={16} /></button>
                  <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-400 border border-white/10 transition-all"><FiShare2 size={16} /></button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5"><FiMapPin size={14} className="text-indigo-400" /><span className="text-slate-400">{hotel.location.address}, {hotel.location.city}, {hotel.location.state}</span></div>
                <div className="flex items-center gap-1.5"><FiStar size={14} className="text-amber-400 fill-current" /><span className="text-amber-400 font-bold">{hotel.rating.average.toFixed(1)}</span><span className="text-slate-500">({hotel.rating.count} reviews)</span></div>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="font-bold text-slate-200 mb-3">About this hotel</h2>
              <p className="text-slate-400 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="card p-5">
              <h2 className="font-bold text-slate-200 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities?.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">{amenityIcons[a] || <FiCheck size={12} />}</span>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="card p-5">
              <h2 className="font-bold text-slate-200 mb-4">Hotel Policies</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-500">Check-in:</span> <span className="text-slate-300">{hotel.policies?.checkIn || '14:00'}</span></div>
                <div><span className="text-slate-500">Check-out:</span> <span className="text-slate-300">{hotel.policies?.checkOut || '11:00'}</span></div>
                <div><span className="text-slate-500">Cancellation:</span> <span className="text-slate-300">{hotel.policies?.cancellation || 'Free cancellation 24h before'}</span></div>
                <div><span className="text-slate-500">Pets:</span> <span className="text-slate-300">{hotel.policies?.petFriendly ? 'Allowed' : 'Not allowed'}</span></div>
              </div>
            </div>

            {/* Reviews */}
            <div className="card p-5">
              <h2 className="font-bold text-slate-200 mb-4">Guest Reviews ({hotel.reviews?.length || 0})</h2>
              {hotel.reviews?.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {hotel.reviews.slice(0, 5).map((r) => (
                    <div key={r._id} className="pb-4 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={r.user?.avatar || `https://ui-avatars.com/api/?name=${r.user?.name}&background=2571BC&color=fff`} alt="" className="w-9 h-9 rounded-full" />
                        <div>
                          <p className="font-medium text-slate-200 text-sm">{r.user?.name}</p>
                          <StarRating rating={r.rating} size={12} />
                        </div>
                        <span className="ml-auto text-slate-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="font-medium text-slate-300 text-sm mb-1">{r.title}</p>
                      <p className="text-slate-400 text-sm">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-slate-500 text-sm mb-6">No reviews yet. Be the first!</p>}

              {/* Add Review */}
              {isAuthenticated && (
                <div>
                  <h3 className="font-semibold text-slate-300 mb-3">Write a Review</h3>
                  <form onSubmit={handleReview} className="space-y-3">
                    <div><label className="text-xs text-slate-400 mb-1.5 block">Rating</label><StarRating rating={review.rating} interactive onChange={(r) => setReview({ ...review, rating: r })} /></div>
                    <input required value={review.title} onChange={(e) => setReview({ ...review, title: e.target.value })} placeholder="Review title" className="input-field text-sm py-2.5" />
                    <textarea required value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Share your experience..." rows={3} className="input-field text-sm py-2.5 resize-none" />
                    <motion.button whileHover={{ scale: 1.01 }} type="submit" disabled={submitting} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </motion.button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right - Booking Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6 pb-4 border-b border-white/10">
                <span className="text-indigo-400 text-3xl font-black">₹{hotel.pricePerNight.toLocaleString()}</span>
                <span className="text-slate-500 text-sm"> / night</span>
              </div>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Available rooms</span><span className="text-emerald-400 font-medium">{hotel.availableRooms} left</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Category</span><span className="text-slate-300 capitalize">{hotel.category}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Rating</span><span className="text-amber-400">★ {hotel.rating.average.toFixed(1)}</span></div>
              </div>

              {hotel.owner && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-6">
                  <img src={hotel.owner.avatar || `https://ui-avatars.com/api/?name=${hotel.owner.name}&background=FFB703&color=003060`} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{hotel.owner.name}</p>
                    <p className="text-xs text-slate-500">Property Owner</p>
                  </div>
                </div>
              )}

              {isAuthenticated ? (
                <Link to={`/book/${hotel._id}`}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary w-full py-3.5 text-base">
                    Book Now 🏨
                  </motion.button>
                </Link>
              ) : (
                <Link to="/login">
                  <motion.button whileHover={{ scale: 1.02 }} className="btn-primary w-full py-3.5 text-base">
                    Login to Book
                  </motion.button>
                </Link>
              )}
              <p className="text-center text-slate-500 text-xs mt-3">No hidden charges • Instant confirmation</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
