import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for fetching works
export const fetchWorks = createAsyncThunk(
  'work/fetchWorks',
  async (date, { rejectWithValue }) => {
    try {
      // Fetch both works and work assignments
      const [worksResponse, assignmentsResponse] = await Promise.all([
        fetch(`https://csm.thoviet.net/api/web/works?dateCheck=${date}`),
        fetch(`https://csm.thoviet.net/api/web/work-assignment?dateCheck=${date}`)
      ])

      if (!worksResponse.ok || !assignmentsResponse.ok) {
        const error = await worksResponse.json()
        return rejectWithValue(error.message)
      }

      const works = await worksResponse.json()
      const assignments = await assignmentsResponse.json()

      // Merge work assignments into works data
      const mergedData = works.map(workCategory => {
        const assignmentCategory = assignments.find(
          assignment => assignment.kind_worker.id === workCategory.kind_worker.id
        )

        if (assignmentCategory) {
          // Merge work data with assignment data
          const mergedWorks = workCategory.data.map(work => {
            const assignment = assignmentCategory.data.find(
              assignment => assignment.id_work === work.id
            )
            return {
              ...work,
              ...assignment,
              worker_full_name: assignment?.worker_full_name,
              worker_code: assignment?.worker_code,
              worker_phone_company: assignment?.worker_phone_company,
              his_work: assignment?.his_work
            }
          })

          return {
            ...workCategory,
            data: mergedWorks
          }
        }

        return workCategory
      })

      return mergedData
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  works: [],
  selectedWorkerType: 'all',
  selectedDate: new Date().toISOString().split('T')[0],
  loading: false,
  error: null,
}

const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    setSelectedWorkerType: (state, action) => {
      state.selectedWorkerType = action.payload
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorks.fulfilled, (state, action) => {
        state.loading = false
        state.works = action.payload
      })
      .addCase(fetchWorks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setSelectedWorkerType, setSelectedDate, clearError } = workSlice.actions

// Selectors
export const selectWorks = (state) => state.work.works
export const selectSelectedWorkerType = (state) => state.work.selectedWorkerType
export const selectSelectedDate = (state) => state.work.selectedDate
export const selectLoading = (state) => state.work.loading
export const selectError = (state) => state.work.error

export default workSlice.reducer 