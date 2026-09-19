import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiFilter, FiX, FiMapPin } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHotels, clearFilters } from '../store/slices/hotelSlice'
import HotelCard from '../components/hotel/HotelCard'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import api from '../utils/api'

const CATEGORIES = ['budget', 'standard', 'deluxe', 'luxury', 'boutique', 'resort', 'hostel']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
]
const POPULAR_CITIES = ['Goa', 'Agra', 'Manali', 'Jaipur', 'Udaipur', 'Mumbai', 'Delhi', 'Kerala', 'Varanasi', 'Coorg']

export default function HotelsPage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('city') || '')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [localFilters, setLocalFilters] = useState({ minPrice: '', maxPrice: '', rating: '', category: '' })
  const [page, setPage] = useState(1)
  const dispatch = useDispatch()
  const { hotels, loading, pagination } = useSelector((s) => s.hotels)

  // Load hotels when params change
  useEffect(() => {
    loadHotels()
  }, [page, sort])

  // Load from URL param on mount
  useEffect(() => {
    if (searchParams.get('city')) loadHotels()
  }, [])

  const loadHotels = () => {
    dispatch(fetchHotels({ city: search, sort, page, limit: 12, ...localFilters }))
  }

  const fetchSuggestions = useCallback(async (q) => {
    if (q.length < 2) { setSuggestions([]); return }
    try {
      const { data } = await api.get(`/hotels/search-suggestions?q=${q}`)
      setSuggestions(data.data)
    } catch { setSuggestions([]) }
  }, [])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearch(val)
    fetchSuggestions(val)
    setShowSuggestions(true)
  }

  const handleSelectSuggestion = (s) => {
    setSearch(s)
    setShowSuggestions(false)
    setSuggestions([])
    setPage(1)
    dispatch(fetchHotels({ city: s, sort, page: 1, limit: 12, ...localFilters }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setShowSuggestions(false)
    setPage(1)
    dispatch(fetchHotels({ city: search, sort, page: 1, limit: 12, ...localFilters }))
  }

  const handleApplyFilters = () => {
    setPage(1)
    setShowFilters(false)
    dispatch(fetchHotels({ city: search, sort, page: 1, limit: 12, ...localFilters }))
  }

  const handleClearAll = () => {
    setSearch('')
    setLocalFilters({ minPrice: '', maxPrice: '', rating: '', category: '' })
    setPage(1)
    dispatch(fetchHotels({ page: 1, limit: 12 }))
  }

  const activeFilterCount = Object.values(localFilters).filter(Boolean).length + (search ? 1 : 0)

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20 pb-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-black text-slate-100 mb-1">Find Your Perfect <span className="gradient-text">Stay</span></h1>
            <p className="text-slate-400">{pagination.total > 0 ? `${pagination.total} hotels found across India` : 'Discover verified hotels across India'}</p>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="glass rounded-2xl p-4 space-y-3">
            {/* Top row */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text" value={search} onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search by city, state or hotel name..."
                  className="input-field pl-11 h-12 text-sm"
                />
                {/* Suggestions dropdown */}
                <AnimatePresence>
                  {showSuggestions && (suggestions.length > 0) && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 right-0 mt-1 glass border border-white/15 rounded-xl overflow-hidden z-50 shadow-2xl">
                      {suggestions.map((s) => (
                        <button key={s} type="button" onClick={() => handleSelectSuggestion(s)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-indigo-500/10 text-slate-300 text-sm text-left transition-colors">
                          <FiMapPin size={12} className="text-indigo-400 flex-shrink-0" />{s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field h-12 text-sm w-full sm:w-48">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary h-12 px-6 text-sm whitespace-nowrap">
                Search Hotels
              </motion.button>
              <button type="button" onClick={() => setShowFilters(!showFilters)}
                className={`h-12 px-4 rounded-xl border text-sm flex items-center gap-2 transition-all ${showFilters || activeFilterCount > 0 ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
                <FiFilter size={15} />
                Filters {activeFilterCount > 0 && <span className="w-5 h-5 bg-indigo-500 rounded-full text-white text-xs flex items-center justify-center">{activeFilterCount}</span>}
              </button>
            </form>

            {/* Popular cities quick links */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <span className="text-slate-500 text-xs flex-shrink-0 self-center">Quick:</span>
              {POPULAR_CITIES.map((city) => (
                <button key={city} onClick={() => handleSelectSuggestion(city)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all ${search === city ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300' : 'border-white/10 text-slate-400 hover:border-indigo-500/40 hover:text-slate-200'}`}>
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} className="overflow-hidden">
                <div className="glass rounded-2xl p-5 mt-3 border border-indigo-500/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Min Price (₹/night)</label>
                      <input type="number" value={localFilters.minPrice} onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })} placeholder="500" className="input-field py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Max Price (₹/night)</label>
                      <input type="number" value={localFilters.maxPrice} onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })} placeholder="50000" className="input-field py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Minimum Rating</label>
                      <select value={localFilters.rating} onChange={(e) => setLocalFilters({ ...localFilters, rating: e.target.value })} className="input-field py-2 text-sm">
                        <option value="">Any Rating</option>
                        {[3, 3.5, 4, 4.5].map((r) => <option key={r} value={r}>{r}+ ⭐</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
                      <select value={localFilters.category} onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value })} className="input-field py-2 text-sm capitalize">
                        <option value="">All Categories</option>
                        {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <motion.button whileHover={{ scale: 1.02 }} onClick={handleApplyFilters} className="btn-primary px-6 py-2 text-sm">Apply Filters</motion.button>
                    <button onClick={handleClearAll} className="btn-ghost px-5 py-2 text-sm flex items-center gap-1.5"><FiX size={14} />Clear All</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <div key={i} className="card h-80 skeleton" />)}
            </div>
          ) : hotels.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="text-7xl mb-5">🔍</div>
              <h3 className="text-2xl font-bold text-slate-300 mb-3">No hotels found</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                {search ? `No results for "${search}". Try a different city or clear your filters.` : 'Try adjusting your search or filters.'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {POPULAR_CITIES.slice(0, 5).map((city) => (
                  <motion.button key={city} whileHover={{ scale: 1.05 }} onClick={() => handleSelectSuggestion(city)}
                    className="badge-primary px-4 py-2 text-sm cursor-pointer">
                    Try {city}
                  </motion.button>
                ))}
              </div>
              <button onClick={handleClearAll} className="btn-secondary flex items-center gap-2 mx-auto"><FiX size={16} />Clear All Filters</button>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-slate-400 text-sm">
                  <span className="text-slate-200 font-semibold">{pagination.total}</span> hotels found
                  {search && <span> for "<span className="text-indigo-400">{search}</span>"</span>}
                </p>
                {activeFilterCount > 0 && (
                  <button onClick={handleClearAll} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"><FiX size={12} />Clear filters</button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {hotels.map((hotel, i) => <HotelCard key={hotel._id} hotel={hotel} index={i} />)}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10 flex-wrap">
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 300) }}
                    disabled={page === 1} className="px-4 py-2 rounded-xl glass border border-white/10 text-slate-400 text-sm disabled:opacity-30">← Prev</motion.button>
                  {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                    let p = i + 1
                    if (pagination.pages > 7 && page > 4) p = page - 3 + i
                    if (p > pagination.pages) return null
                    return (
                      <motion.button key={p} whileHover={{ scale: 1.05 }} onClick={() => { setPage(p); window.scrollTo(0, 300) }}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-amber-400 text-dark-900' : 'glass border border-white/10 text-slate-400 hover:text-slate-200'}`}>
                        {p}
                      </motion.button>
                    )
                  })}
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setPage(p => Math.min(pagination.pages, p + 1)); window.scrollTo(0, 300) }}
                    disabled={page === pagination.pages} className="px-4 py-2 rounded-xl glass border border-white/10 text-slate-400 text-sm disabled:opacity-30">Next →</motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
