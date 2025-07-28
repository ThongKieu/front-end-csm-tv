import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk for fetching assigned works
export const fetchAssignedWorks = createAsyncThunk(
  'work/fetchAssignedWorks',
  async (date) => {
    const response = await axios.post('/api/jobs/assigned', { date })
    return response.data
  }
)

// Async thunk for fetching unassigned works
export const fetchUnassignedWorks = createAsyncThunk(
  'work/fetchUnassignedWorks',
  async (date) => {
    const response = await axios.post('/api/jobs', { date })
    return response.data
  }
)

// Async thunk for fetching workers
export const fetchWorkers = createAsyncThunk(
  'work/fetchWorkers',
  async () => {
    const response = await axios.get('https://csm.thoviet.net/api/web/workers')
    return response.data
  }
)

// Async thunk for assigning worker
export const assignWorker = createAsyncThunk(
  'work/assignWorker',
  async ({ work, worker, extraWorker, dateCheck, authId }) => {
    const data_hisWork = [
      {
        id_auth: authId,
        id_worker: null,
        action: "guitho",
        time: new Date().toLocaleTimeString(),
      },
    ];

    const data = {
      id_work: work.id,
      id_worker: worker,
      id_phu: extraWorker,
      work_note: work.work_note,
      auth_id: authId,
      his_work: JSON.stringify(data_hisWork),
      dateCheck: dateCheck,
    };

    const response = await axios.post(
      `https://csm.thoviet.net/api/web/work-assignment?dateCheck=${dateCheck}`,
      data
    );
    return response.data;
  }
)

// Async thunk for changing worker
export const changeWorker = createAsyncThunk(
  'work/changeWorker',
  async ({ workAssignment, worker, extraWorker, authId }) => {
    const data_hisWork = [
      {
        id_auth: authId,
        id_worker: null,
        action: "doitho",
        time: new Date().toLocaleTimeString(),
      },
    ];

    const data = {
      id_work_ass: workAssignment.id,
      id_worker: worker || "",
      auth_id: authId,
      id_phu: extraWorker || "",
      his_work: JSON.stringify(data_hisWork),
    };

    const response = await axios.post(
      'https://csm.thoviet.net/api/web/work-assignment/change-worker',
      data
    );
    return response.data;
  }
)

const initialState = {
  assignedWorks: [],
  unassignedWorks: [],
  workers: [],
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
    updateAssignedWork: (state, action) => {
      const { workId, data } = action.payload;
      const categoryIndex = state.assignedWorks.findIndex(
        category => category.data.some(work => work.id === workId)
      );
      if (categoryIndex !== -1) {
        const workIndex = state.assignedWorks[categoryIndex].data.findIndex(
          work => work.id === workId
        );
        if (workIndex !== -1) {
          state.assignedWorks[categoryIndex].data[workIndex] = {
            ...state.assignedWorks[categoryIndex].data[workIndex],
            ...data
          };
        }
      }
    },
    updateUnassignedWork: (state, action) => {
      const { workId, data } = action.payload;
      const categoryIndex = state.unassignedWorks.findIndex(
        category => category.data.some(work => work.id === workId)
      );
      if (categoryIndex !== -1) {
        const workIndex = state.unassignedWorks[categoryIndex].data.findIndex(
          work => work.id === workId
        );
        if (workIndex !== -1) {
          state.unassignedWorks[categoryIndex].data[workIndex] = {
            ...state.unassignedWorks[categoryIndex].data[workIndex],
            ...data
          };
        }
      }
    },
    removeAssignedWork: (state, action) => {
      const workId = action.payload;
      state.assignedWorks = state.assignedWorks.map(category => ({
        ...category,
        data: category.data.filter(work => work.id !== workId)
      }));
    },
    removeUnassignedWork: (state, action) => {
      const workId = action.payload;
      state.unassignedWorks = state.unassignedWorks.map(category => ({
        ...category,
        data: category.data.filter(work => work.id !== workId)
      }));
    },
    moveWorkToAssigned: (state, action) => {
      const { work, categoryId } = action.payload;
      state.unassignedWorks = state.unassignedWorks.map(category => ({
        ...category,
        data: category.data.filter(w => w.id !== work.id)
      }));
      const categoryIndex = state.assignedWorks.findIndex(
        cat => cat.kind_worker.id === categoryId
      );
      if (categoryIndex !== -1) {
        state.assignedWorks[categoryIndex].data.push(work);
      }
    },
    moveWorkToUnassigned: (state, action) => {
      const { work, categoryId } = action.payload;
      state.assignedWorks = state.assignedWorks.map(category => ({
        ...category,
        data: category.data.filter(w => w.id !== work.id)
      }));
      const categoryIndex = state.unassignedWorks.findIndex(
        cat => cat.kind_worker.id === categoryId
      );
      if (categoryIndex !== -1) {
        state.unassignedWorks[categoryIndex].data.push(work);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Assigned Works
      .addCase(fetchAssignedWorks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAssignedWorks.fulfilled, (state, action) => {
        state.loading = false
        state.assignedWorks = action.payload
      })
      .addCase(fetchAssignedWorks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Unassigned Works
      .addCase(fetchUnassignedWorks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUnassignedWorks.fulfilled, (state, action) => {
        state.loading = false
        state.unassignedWorks = action.payload
      })
      .addCase(fetchUnassignedWorks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Workers
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false
        state.workers = action.payload
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Assign Worker
      .addCase(assignWorker.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(assignWorker.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(assignWorker.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Change Worker
      .addCase(changeWorker.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changeWorker.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(changeWorker.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { 
  setSelectedWorkerType, 
  setSelectedDate, 
  clearError,
  updateAssignedWork,
  updateUnassignedWork,
  removeAssignedWork,
  removeUnassignedWork,
  moveWorkToAssigned,
  moveWorkToUnassigned
} = workSlice.actions

// Selectors
export const selectAssignedWorks = (state) => state.work.assignedWorks
export const selectUnassignedWorks = (state) => state.work.unassignedWorks
export const selectWorkers = (state) => state.work.workers
export const selectSelectedWorkerType = (state) => state.work.selectedWorkerType
export const selectSelectedDate = (state) => state.work.selectedDate
export const selectLoading = (state) => state.work.loading
export const selectError = (state) => state.work.error

export default workSlice.reducer 