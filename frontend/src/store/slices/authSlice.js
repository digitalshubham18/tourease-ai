import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const signupUser = createAsyncThunk('auth/signup', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/signup', formData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed')
  }
})

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout')
  localStorage.removeItem('token')
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    error: null,
    pendingVerification: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearError: (state) => { state.error = null },
    setPendingVerification: (state, action) => { state.pendingVerification = action.payload },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Signup
    builder.addCase(signupUser.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false
      state.pendingVerification = { userId: action.payload.userId, email: action.payload.email }
    })
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Fetch me
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.isAuthenticated = true
    })
    builder.addCase(fetchMe.rejected, (state) => {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      localStorage.removeItem('token')
    })

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    })
  },
})

export const { setUser, clearError, setPendingVerification } = authSlice.actions
export default authSlice.reducer
