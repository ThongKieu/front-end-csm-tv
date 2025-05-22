import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for assigning a worker to a work
export const assignWorker = createAsyncThunk(
  'workerAssignment/assignWorker',
  async ({ workId, workerId }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/works/assign-worker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workId, workerId }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.message)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  assignments: [],
  loading: false,
  error: null,
}

const workerAssignmentSlice = createSlice({
  name: 'workerAssignment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignWorker.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(assignWorker.fulfilled, (state, action) => {
        state.loading = false
        state.assignments.push(action.payload)
      })
      .addCase(assignWorker.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = workerAssignmentSlice.actions

export default workerAssignmentSlice.reducer 