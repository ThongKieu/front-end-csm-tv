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
      console.log('authSlice login: Payload nhận được:', payload)
      console.log('authSlice login: Payload.token:', payload.token)
      console.log('authSlice login: Payload.user:', payload.user)
      
      state.user = payload.user
      state.token = payload.token
      state.isAuthenticated = true
      state.isLoading = false
      
      console.log('authSlice login: State sau khi cập nhật:', {
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading
      })
      
      console.log('authSlice login: Lưu auth data...')
      saveAuthData(payload.token, payload.user)
      console.log('authSlice login: Đã lưu auth data')
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