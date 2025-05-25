'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Phone, Mail, User, Clock, Navigation } from 'lucide-react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('@/components/map/WorkerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-lg bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Đang tải bản đồ...</p>
    </div>
  ),
});

const WorkersPage = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerLocations, setWorkerLocations] = useState({});

  useEffect(() => {
    fetchWorkers();
    // Set up interval to fetch worker locations every 30 seconds
    const interval = setInterval(fetchWorkerLocations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get('https://csm.thoviet.net/api/web/workers');
      setWorkers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải danh sách thợ');
      setLoading(false);
    }
  };

  const fetchWorkerLocations = async () => {
    try {
      const response = await axios.get('https://csm.thoviet.net/api/web/worker-locations');
      setWorkerLocations(response.data);
    } catch (err) {
      console.error('Error fetching worker locations:', err);
    }
  };

  const filteredWorkers = workers.filter(worker =>
    worker.worker_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.worker_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWorkerStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý thợ</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm thợ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Danh sách thợ */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách thợ</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Đang tải...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : (
              filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedWorker?.id === worker.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedWorker(worker)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {worker.worker_full_name}
                        </h3>
                        <p className="text-sm text-gray-500">{worker.worker_code}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getWorkerStatusColor(
                        workerLocations[worker.id]?.status || 'offline'
                      )}`}
                    >
                      {workerLocations[worker.id]?.status || 'offline'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Thông tin chi tiết và bản đồ */}
        <div className="lg:col-span-2 space-y-6">
          {selectedWorker ? (
            <>
              {/* Thông tin chi tiết */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin chi tiết
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedWorker.worker_full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mã thợ</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedWorker.worker_code}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedWorker.worker_phone_company}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedWorker.worker_email || 'Chưa có'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className="text-sm font-medium text-gray-900">
                      {workerLocations[selectedWorker.id]?.status || 'offline'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                    <p className="text-sm font-medium text-gray-900">
                      {workerLocations[selectedWorker.id]?.last_update
                        ? new Date(workerLocations[selectedWorker.id].last_update).toLocaleString()
                        : 'Chưa có dữ liệu'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bản đồ */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Vị trí hiện tại
                </h2>
                <div className="h-[400px] rounded-lg overflow-hidden">
                  <MapWithNoSSR
                    worker={selectedWorker}
                    location={workerLocations[selectedWorker.id]}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Chọn một thợ để xem thông tin chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkersPage; 