'use client'

import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WorkTable from '@/components/work-schedule/WorkTable'
import { Calendar } from 'lucide-react'
import { 
  fetchAssignedWorks,
  fetchUnassignedWorks,
  fetchWorkers,
  setSelectedDate, 
  selectSelectedDate, 
  selectAssignedWorks,
  selectUnassignedWorks,
  selectWorkers,
  selectLoading 
} from '@/store/slices/workSlice'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const selectedDate = useSelector(selectSelectedDate)
  const assignedWorks = useSelector(selectAssignedWorks)
  const unassignedWorks = useSelector(selectUnassignedWorks)
  const workers = useSelector(selectWorkers)
  const loading = useSelector(selectLoading)

  const handleDateChange = useCallback((e) => {
    const newDate = e.target.value
    dispatch(setSelectedDate(newDate))
    dispatch(fetchAssignedWorks(newDate))
    dispatch(fetchUnassignedWorks(newDate))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchAssignedWorks(selectedDate))
    dispatch(fetchUnassignedWorks(selectedDate))
    dispatch(fetchWorkers())
  }, []) // Empty dependency array

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  return (
    <div className="h-[calc(100vh-65px)] bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="h-full max-w-[1920px] mx-auto flex flex-col p-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-2 mb-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Phân công công việc
          </h1>
          <div className="flex items-center space-x-3 bg-blue-50 rounded-lg px-4 py-1">
            <Calendar className="w-3 h-3 text-blue-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="bg-transparent border-none focus:ring-0 text-blue-900 font-medium"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 min-h-0">
          {/* Unassigned Works */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100 flex flex-col h-full">
            <div className="p-1 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-lg font-semibold text-blue-900 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Công việc chưa phân công
                <span className="ml-2 text-sm font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {unassignedWorks.reduce((acc, cat) => acc + cat.data.length, 0)}
                </span>
              </h2>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <WorkTable works={unassignedWorks} workers={workers} />
            </div>
          </div>

          {/* Assigned Works */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 flex flex-col h-full">
            <div className="p-1 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-lg font-semibold text-green-900 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Công việc đã phân công
                <span className="ml-2 text-sm font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  {assignedWorks.reduce((acc, cat) => acc + cat.data.length, 0)}
                </span>
              </h2>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <WorkTable works={assignedWorks} workers={workers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 