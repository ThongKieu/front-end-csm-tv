'use client'

import { useState, useEffect } from 'react'
import WorkTable from '@/components/work-schedule/WorkTable'
import { Calendar } from 'lucide-react'

export default function WorksPage() {
  const [works, setWorks] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`https://csm.thoviet.net/api/web/works?dateCheck=${selectedDate}`)
        const data = await response.json()
        setWorks(data)
      } catch (error) {
        console.error('Error fetching works:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorks()
  }, [selectedDate])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Quản lý công việc</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded px-1 py-1"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <WorkTable data={works} />
      )}
    </div>
  )
} 