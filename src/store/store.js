import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import workReducer from './slices/workSlice'
import workerAssignmentReducer from './slices/workerAssignmentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    work: workReducer,
    workerAssignment: workerAssignmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store 