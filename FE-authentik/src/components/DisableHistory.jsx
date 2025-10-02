// src/components/DisableHistory.jsx
import React from 'react';
import { Clock } from 'lucide-react';

export default function DisableHistory({ history }) {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="text-indigo-600" size={24} />
        Lịch sử vô hiệu hóa gần đây
      </h2>
      <div className="space-y-3">
        {history.slice(0, 5).map((record, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{record.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                    {record.username}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Lý do:</strong> {record.reason}</p>
                  <p><strong>Ngày nghỉ việc:</strong> {new Date(record.resignDate).toLocaleDateString('vi-VN')}</p>
                  {record.note && <p><strong>Ghi chú:</strong> {record.note}</p>}
                </div>
              </div>
              <div className="text-xs text-gray-500 text-right">
                <p>Xử lý lúc:</p>
                <p className="font-medium">{new Date(record.processedAt).toLocaleString('vi-VN')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}