'use client'

import { useState, useEffect } from 'react'
import CustomerSearch from '@/components/features/customer/CustomerSearch'
import { Plus, Users, Search, Filter, Download } from 'lucide-react'
import axios from 'axios'
import { getClientApiUrl, CONFIG } from '@/config/constants'

const CustomerClient = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    searching: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(getClientApiUrl("/api/web/old-cus-search"))
        const data = response.data.data || response.data
        
        setStats({
          total: data.length,
          new: data.filter(customer => {
            const createdDate = new Date(customer.created_at)
            const now = new Date()
            const diffTime = Math.abs(now - createdDate)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 30 // Khách hàng mới trong 30 ngày
          }).length,
          searching: data.filter(customer => customer.cus_show === "1").length
        })
      } catch (error) {
        console.error("Error fetching customer stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleSearchResults = (count) => {
    setSearchResults(count)
  }

  return (
    <div className="space-y-2">
      {/* Stats Cards - Minimal Layout */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-sm shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
            <Users className="w-3 h-3 text-white" />
          </div>
          <div>
            <span className="font-medium text-gray-600">Tổng:</span>
            <span className="ml-1 font-bold text-gray-900">
              {loading ? (
                <div className="w-8 h-3 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                stats.total.toLocaleString()
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-gradient-to-br from-green-500 to-green-600 shadow-sm">
            <Plus className="w-3 h-3 text-white" />
          </div>
          <div>
            <span className="font-medium text-gray-600">Mới:</span>
            <span className="ml-1 font-bold text-gray-900">
              {loading ? (
                <div className="w-8 h-3 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                stats.new.toLocaleString()
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
            <Search className="w-3 h-3 text-white" />
          </div>
          <div>
            <span className="font-medium text-gray-600">Tìm:</span>
            <span className="ml-1 font-bold text-gray-900">
              {loading ? (
                <div className="w-8 h-3 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                searchResults.toLocaleString()
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Search Table */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <CustomerSearch onSearchResults={handleSearchResults} />
      </div>
    </div>
  )
}

export default CustomerClient 