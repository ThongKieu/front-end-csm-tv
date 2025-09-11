'use client'

import { useState, useEffect } from 'react'
import WorkTable from '@/components/features/work-schedule/WorkTable'
import { Calendar } from 'lucide-react'
import { getWorksByDate } from '@/data/demoWorks'

export default function WorksPage() {
  const [works, setWorks] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setIsLoading(true)
        // Sử dụng dữ liệu demo thay vì gọi API
        const demoData = getWorksByDate(selectedDate)
        
        // Nhóm công việc theo loại
        const groupedWorks = demoData.reduce((acc, work) => {
          const kindWork = work.kind_work
          if (!acc[kindWork]) {
            acc[kindWork] = {
              kind_worker: {
                id: kindWork,
                numberOfWork: 0
              },
              data: []
            }
          }
          acc[kindWork].data.push(work)
          acc[kindWork].kind_worker.numberOfWork++
          return acc
        }, {})

        // Chuyển đổi thành mảng
        const formattedWorks = Object.values(groupedWorks)
        setWorks(formattedWorks)
      } catch (error) {
        console.error('Error fetching works:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorks()
  }, [selectedDate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col p-6 h-full">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Quản lý công việc</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-1 py-1 rounded border"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
          </div>
        ) : (
          <WorkTable data={works} />
        )}
      </div>
    </div>
  )
} 