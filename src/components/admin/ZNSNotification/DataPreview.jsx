'use client'

export default function DataPreview({ 
  preview 
}) {
  if (!preview.length) return null

  return (
    <div className="mb-8 flex-1 overflow-hidden flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Xem trước dữ liệu
      </h3>
      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {Object.keys(preview[0]).map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {preview.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Hiển thị {preview.length} dòng đầu tiên
      </p>
    </div>
  )
} 