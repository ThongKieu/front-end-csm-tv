import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

// Async thunk để verify token
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/check')
      if (!response.ok) {
        throw new Error('Token không hợp lệ')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.error = null
      // Lưu token vào cookie
      Cookies.set('token', token, { expires: 7 }) // Hết hạn sau 7 ngày
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      // Xóa token khỏi cookie
      Cookies.remove('token')
    },
    setUser: (state, action) => {
      const { user } = action.payload
      state.user = user
      state.isAuthenticated = true
      state.error = null
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = Cookies.get('token')
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = action.payload || 'Phiên đăng nhập đã hết hạn'
        Cookies.remove('token')
      })
  }
})

export const { login, logout, setUser, setError } = authSlice.actions
export default authSlice.reducer 