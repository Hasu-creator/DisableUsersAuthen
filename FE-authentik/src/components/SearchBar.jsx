// src/components/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange, totalUsers, filteredCount }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, username hoặc email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        Hiển thị {filteredCount} / {totalUsers} tài khoản đang hoạt động
      </div>
    </div>
  );
}