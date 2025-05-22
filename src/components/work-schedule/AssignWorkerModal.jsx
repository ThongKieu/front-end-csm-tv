import { Fragment, useState } from 'react'
import {  Dialog, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { assignWorker } from '@/store/slices/workerAssignmentSlice'

export default function AssignWorkerModal({ isOpen, onClose, work, onAssign }) {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.workerAssignment)
  const [selectedWorkerId, setSelectedWorkerId] = useState('')

  const handleAssign = async () => {
    if (!selectedWorkerId) return

    try {
      await dispatch(assignWorker({ workId: work.id, workerId: selectedWorkerId })).unwrap()
      onClose()
    } catch (error) {
      console.error('Failed to assign worker:', error)
    }
  }

  if (!work) return null

  return (
   <Transition appear show={isOpen} as={Fragment}>
  <Dialog as="div" className="fixed inset-0 z-40" onClose={onClose}> {/* z-40 hoặc thấp hơn */}
    <TransitionChild
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" />
    </TransitionChild>

    <div className="fixed inset-0 overflow-y-auto z-50"> {/* panel có z-50 để cho rõ */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all z-50">
            <DialogTitle
                  as="div"
                  className="flex items-center justify-between mb-4"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Phân công thợ
                  </h3>
                  <button
                    onClick={onClose}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </DialogTitle>

                <div className="mt-2 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Thông tin công việc</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Nội dung:</span> {work.work_content}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Khách hàng:</span> {work.name_cus}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Địa chỉ:</span> {work.street}, {work.district}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">SĐT:</span> {work.phone_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ghi chú:</span> {work.work_note}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="worker" className="block text-sm font-medium text-gray-700">
                      Chọn thợ
                    </label>
                    <select
                      id="worker"
                      value={selectedWorkerId}
                      onChange={(e) => setSelectedWorkerId(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Chọn thợ...</option>
                      {/* TODO: Add worker options from API */}
                      <option value="1">Thợ A</option>
                      <option value="2">Thợ B</option>
                      <option value="3">Thợ C</option>
                    </select>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600">
                      {error}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleAssign}
                    disabled={loading || !selectedWorkerId}
                  >
                    {loading ? 'Đang xử lý...' : 'Phân công'}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 