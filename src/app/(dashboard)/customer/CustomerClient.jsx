'use client'

import { useState, useEffect } from 'react'
import CustomerSearch from '@/components/customer/CustomerSearch'
import { Plus, Users, Search, Filter, Download } from 'lucide-react'
import axios from 'axios'

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
        const response = await axios.get("https://csm.thoviet.net/api/web/old-cus-search")
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
    <div className="space-y-3">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Tổng số khách hàng</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-0.5">
                {loading ? (
                  <div className="animate-pulse h-5 w-12 bg-gray-200 rounded"></div>
                ) : (
                  stats.total.toLocaleString()
                )}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-md">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Khách hàng mới</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-0.5">
                {loading ? (
                  <div className="animate-pulse h-5 w-12 bg-gray-200 rounded"></div>
                ) : (
                  stats.new.toLocaleString()
                )}
              </h3>
            </div>
            <div className="p-2 bg-green-50 rounded-md">
              <Plus className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Kết quả tìm kiếm</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-0.5">
                {loading ? (
                  <div className="animate-pulse h-5 w-12 bg-gray-200 rounded"></div>
                ) : (
                  searchResults.toLocaleString()
                )}
              </h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-md">
              <Search className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <CustomerSearch onSearchResults={handleSearchResults} />
      </div>
    </div>
  )
}

export default CustomerClient 