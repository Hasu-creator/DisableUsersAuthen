import React from 'react';
import { Users, Loader2, RefreshCw } from 'lucide-react';

export default function Header({ onRefresh, loading, userCount }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-2xl p-8 mb-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                <Users className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Quản lý Tài khoản Nhân viên
                </h1>
                <p className="text-indigo-100 text-sm mt-1">
                  Hệ thống vô hiệu hóa tài khoản - Phòng Nhân sự
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6 mt-4">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-indigo-100 text-xs">Tài khoản đang hoạt động</p>
                <p className="text-white text-2xl font-bold">{userCount}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onRefresh}
            disabled={loading}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RefreshCw 
              className={loading ? 'animate-spin' : ''} 
              size={20} 
            />
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
      </div>
    </div>
  );
}