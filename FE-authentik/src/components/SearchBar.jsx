import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange, totalUsers, filteredCount }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={22} />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, username, email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-2 px-4 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <Filter className="text-indigo-600" size={18} />
          <div className="text-sm">
            <span className="font-bold text-indigo-700">{filteredCount}</span>
            <span className="text-gray-500 mx-1">/</span>
            <span className="text-gray-600">{totalUsers}</span>
          </div>
        </div>
      </div>
      
      {searchTerm && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-500">Đang tìm:</span>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
            {searchTerm}
          </span>
          <button
            onClick={() => onSearchChange('')}
            className="text-gray-400 hover:text-gray-600 text-sm underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}