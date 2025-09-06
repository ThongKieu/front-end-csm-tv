import { createSlice } from '@reduxjs/toolkit'
import { saveAuthData, clearAuthData } from '@/utils/auth'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload }) => {
      
      // Cập nhật state với dữ liệu user mới
      state.user = {
        id: payload.user.id,
        name: payload.user.full_name || payload.user.name,
        user_name: payload.user.user_name,
        email: payload.user.email || payload.user.user_name,
        role: payload.user.role,
        type: payload.user.type,
        code: payload.user.code,
        full_name: payload.user.full_name,
        date_of_birth: payload.user.date_of_birth,
        address: payload.user.address,
        phone_business: payload.user.phone_business,
        phone_personal: payload.user.phone_personal,
        phone_family: payload.user.phone_family,
        avatar: payload.user.avatar
      }
      state.token = payload.token
      state.isAuthenticated = true
      state.isLoading = false
      
      
      saveAuthData(payload.token, state.user)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      
      clearAuthData()
    },
    restoreAuth: (state, { payload }) => {
      state.user = payload.user
      state.token = payload.token
      state.isAuthenticated = true
      state.isLoading = false
    },
    setLoading: (state, { payload }) => {
      state.isLoading = payload
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      
      clearAuthData()
    },
  },
})

export const { login, logout, restoreAuth, setLoading, clearAuth } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectToken = (state) => state.auth.token
export const selectAuthLoading = (state) => state.auth.isLoading 