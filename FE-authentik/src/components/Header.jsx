
import React from 'react';
import { Users, Loader2 } from 'lucide-react';

export default function Header({ onRefresh, loading }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="text-indigo-600" size={36} />
            Quản lý Tài khoản Nhân viên Nghỉ việc
          </h1>
          <p className="text-gray-600 mt-2">
            Hệ thống vô hiệu hóa tài khoản cho Phòng Nhân sự
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : '🔄'}
          Làm mới
        </button>
      </div>
    </div>
  );
}