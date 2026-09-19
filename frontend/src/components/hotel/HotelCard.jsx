import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiMapPin, FiStar, FiWifi } from 'react-icons/fi'
import { MdPool, MdSpa, MdRestaurant } from 'react-icons/md'
import { useSelector } from 'react-redux'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const amenityIcons = {
  'Free WiFi': <FiWifi size={12} />,
  'Swimming Pool': <MdPool size={12} />,
  'Spa': <MdSpa size={12} />,
  'Restaurant': <MdRestaurant size={12} />,
}

export default function HotelCard({ hotel, index = 0 }) {
  const { isAuthenticated } = useSelector((s) => s.auth)
  const [wishlisted, setWishlisted] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to save hotels')
      return
    }
    try {
      const { data } = await api.post(`/hotels/${hotel._id}/wishlist`)
      setWishlisted(data.wishlisted)
      toast.success(data.message)
    } catch {
      toast.error('Failed to update wishlist')
    }
  }

  const imgSrc = imgError
    ? `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600`
    : hotel.mainImage || hotel.images?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="card group cursor-pointer h-full"
    >
      <Link to={`/hotels/${hotel._id}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={imgSrc}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {hotel.featured && (
              <span className="badge-primary text-xs">⭐ Featured</span>
            )}
            {hotel.isVerified && (
              <span className="badge-success text-xs">✓ Verified</span>
            )}
          </div>

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              wishlisted
                ? 'bg-red-500/90 text-white'
                : 'bg-dark-900/60 text-slate-300 hover:bg-red-500/20 hover:text-red-400'
            } backdrop-blur-sm`}
          >
            <FiHeart size={16} className={wishlisted ? 'fill-current' : ''} />
          </motion.button>

          {/* Category */}
          <div className="absolute bottom-3 left-3">
            <span className="text-xs px-2 py-1 rounded-lg bg-dark-900/70 text-slate-300 capitalize backdrop-blur-sm">
              {hotel.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-200 text-sm leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <FiStar size={12} className="text-amber-400 fill-current" />
              <span className="text-amber-400 text-xs font-bold">{hotel.rating.average.toFixed(1)}</span>
              <span className="text-slate-500 text-xs">({hotel.rating.count})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
            <FiMapPin size={11} className="text-indigo-400" />
            <span>{hotel.location.city}, {hotel.location.state}</span>
          </div>

          {/* Amenities */}
          {hotel.amenities?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-3">
              {hotel.amenities.slice(0, 3).map((a) => (
                <span key={a} className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                  {amenityIcons[a] || null}
                  {a}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="text-xs text-slate-500">+{hotel.amenities.length - 3} more</span>
              )}
            </div>
          )}

          <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-indigo-400 font-bold text-lg">₹{hotel.pricePerNight.toLocaleString()}</span>
              <span className="text-slate-500 text-xs"> /night</span>
            </div>
            <span className="text-xs text-slate-500">
              {hotel.availableRooms} rooms left
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
