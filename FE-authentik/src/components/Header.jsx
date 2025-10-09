import React from 'react';
import { Users, RefreshCw } from 'lucide-react';

export default function Header({ onRefresh, loading, userCount }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-xl p-8 mb-8 border-2 border-slate-600">
      {/* Colorful decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500 to-transparent opacity-15 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500 to-transparent opacity-15 rounded-full blur-3xl -ml-40 -mb-40"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-purple-500 to-transparent opacity-10 rounded-full blur-3xl -ml-32 -mt-32"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {/* Gradient Avatar Icon */}
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 p-3.5 rounded-xl shadow-lg" style={{ boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                  <Users className="text-white" size={32} strokeWidth={2.5} />
                </div>
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl blur-xl opacity-30 -z-10"></div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                  Quản lý Tài khoản Nhân viên
                </h1>
                <p className="text-slate-300 text-sm mt-1 font-medium">
                  Hệ thống quản lý - Phòng Nhân sự
                </p>
              </div>
            </div>
            
            {/* Stats Badge - Colorful gradient */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border-2 border-white/20 shadow-lg">
              <div>
                <p className="text-slate-200 text-xs font-semibold">Tổng số tài khoản</p>
                <p className="text-white text-2xl font-bold tracking-tight">{userCount}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onRefresh}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/30"
            style={{ boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(59, 130, 246, 0.2)' }}
          >
            <RefreshCw 
              className={loading ? 'animate-spin' : ''} 
              size={20} 
              strokeWidth={2.5}
            />
            <span className="hidden sm:inline">
              {loading ? 'Đang tải...' : 'Làm mới'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}