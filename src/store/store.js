import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import  customerOld  from './slices/oldCusSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    oldCustomer: customerOld
  },
})

export default store 