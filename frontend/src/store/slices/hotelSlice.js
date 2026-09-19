import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

// ===== HOTEL SLICE =====
export const fetchHotels = createAsyncThunk('hotels/fetchAll', async (params) => {
  const { data } = await api.get('/hotels', { params })
  return data
})

export const fetchFeaturedHotels = createAsyncThunk('hotels/fetchFeatured', async () => {
  const { data } = await api.get('/hotels/featured')
  return data
})

export const fetchHotel = createAsyncThunk('hotels/fetchOne', async (id) => {
  const { data } = await api.get(`/hotels/${id}`)
  return data
})

export const fetchDestinations = createAsyncThunk('hotels/fetchDestinations', async (params) => {
  const { data } = await api.get('/destinations', { params })
  return data
})

export const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    hotels: [],
    featuredHotels: [],
    currentHotel: null,
    destinations: [],
    pagination: { total: 0, page: 1, pages: 1 },
    filters: { city: '', minPrice: '', maxPrice: '', rating: '', category: '' },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    clearFilters: (state) => { state.filters = { city: '', minPrice: '', maxPrice: '', rating: '', category: '' } },
    clearCurrentHotel: (state) => { state.currentHotel = null },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHotels.pending, (state) => { state.loading = true })
    builder.addCase(fetchHotels.fulfilled, (state, action) => {
      state.loading = false
      state.hotels = action.payload.data
      state.pagination = action.payload.pagination
    })
    builder.addCase(fetchHotels.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
    builder.addCase(fetchFeaturedHotels.fulfilled, (state, action) => {
      state.featuredHotels = action.payload.data
    })
    builder.addCase(fetchHotel.fulfilled, (state, action) => {
      state.currentHotel = action.payload.data
    })
    builder.addCase(fetchDestinations.fulfilled, (state, action) => {
      state.destinations = action.payload.data
    })
  },
})

export const { setFilters, clearFilters, clearCurrentHotel } = hotelSlice.actions
export default hotelSlice.reducer
