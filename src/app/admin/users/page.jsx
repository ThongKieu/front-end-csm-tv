'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function UsersPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerLocations, setWorkerLocations] = useState({});

  useEffect(() => {
    // Kiểm tra quyền truy cập
    if (user && !['admin', 'manager'].includes(user.role)) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    // Chỉ fetch data khi user có quyền truy cập
    if (user && ['admin', 'manager'].includes(user.role)) {
      const fetchWorkers = async () => {
        try {
          const response = await axios.get('/api/admin/workers');
          setWorkers(response.data);
        } catch (error) {
          console.error('Error fetching workers:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchWorkers();
    }
  }, [user]);

  // Hiển thị loading khi đang kiểm tra quyền hoặc đang tải dữ liệu
  if (!user || loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Chuyển hướng nếu không có quyền
  if (!['admin', 'manager'].includes(user.role)) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý thợ</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý thông tin và trạng thái của đội ngũ thợ
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Danh sách thợ */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Danh sách thợ</h2>
              <div className="space-y-4">
                {workers.map((worker) => (
                  <div
                    key={worker.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedWorker(worker)}
                  >
                    <h3 className="font-medium">{worker.name}</h3>
                    <p className="text-sm text-gray-500">{worker.role}</p>
                    <p className="text-sm text-gray-500">Trạng thái: {worker.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Thông tin chi tiết</h2>
              {selectedWorker ? (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg">{selectedWorker.name}</h3>
                  <div className="mt-4 space-y-2">
                    <p><span className="font-medium">Vị trí:</span> {selectedWorker.position}</p>
                    <p><span className="font-medium">Kinh nghiệm:</span> {selectedWorker.experience} năm</p>
                    <p><span className="font-medium">Đánh giá:</span> {selectedWorker.rating}/5</p>
                    <p><span className="font-medium">Trạng thái:</span> {selectedWorker.status}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Chọn một thợ để xem thông tin chi tiết</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 