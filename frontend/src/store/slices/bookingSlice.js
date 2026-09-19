import { createSlice } from '@reduxjs/toolkit'

// ===== BOOKING SLICE =====
export const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
  },
  reducers: {
    setBookings: (state, action) => { state.bookings = action.payload },
    setCurrentBooking: (state, action) => { state.currentBooking = action.payload },
    addBooking: (state, action) => { state.bookings.unshift(action.payload) },
  },
})

export const { setBookings, setCurrentBooking, addBooking } = bookingSlice.actions
export default bookingSlice.reducer
