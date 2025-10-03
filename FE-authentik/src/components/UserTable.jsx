import React from 'react';
import { UserX, Loader2, Users, Mail, User, Shield } from 'lucide-react';

export default function UserTable({ users, loading, onDisableClick, searchTerm }) {
  // Hàm lấy initials từ tên
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ').filter(w => w.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Hàm tạo màu gradient dựa trên tên
  const getGradientColor = (name) => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-purple-500 to-pink-600',
      'from-pink-500 to-rose-600',
      'from-blue-500 to-indigo-600',
      'from-cyan-500 to-blue-600',
      'from-teal-500 to-cyan-600',
      'from-green-500 to-teal-600',
      'from-amber-500 to-orange-600',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative">
            <Loader2 className="animate-spin text-indigo-600" size={64} />
            <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl opacity-50"></div>
          </div>
          <span className="mt-6 text-gray-600 text-lg font-medium">Đang tải danh sách nhân viên...</span>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="text-center py-32">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
            <Users className="text-gray-400" size={48} />
          </div>
          <p className="text-gray-500 text-xl font-medium mb-2">
            {searchTerm ? 'Không tìm thấy nhân viên phù hợp' : 'Danh sách trống'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hiện tại không có nhân viên nào trong hệ thống'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Nhân viên
              </th>
              <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tài khoản
              </th>
              <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-8 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user, index) => (
              <tr 
                key={user.username} 
                className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {/* Avatar với initials */}
                    <div 
                      className={`w-12 h-12 min-w-[48px] bg-gradient-to-br ${getGradientColor(user.name)} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <span className="text-white font-bold text-lg">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-bold text-gray-900 truncate" title={user.name}>
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">ID: #{index + 1}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Shield className="text-indigo-500 flex-shrink-0" size={16} />
                    <span 
                      className="text-sm font-mono bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-3 py-2 rounded-lg font-semibold border border-indigo-100 truncate max-w-xs"
                      title={user.username}
                    >
                      {user.username}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="text-gray-400 flex-shrink-0" size={16} />
                    <a 
                      href={`mailto:${user.email}`}
                      className="text-sm hover:text-indigo-600 transition-colors hover:underline truncate"
                      title={user.email}
                    >
                      {user.email}
                    </a>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onDisableClick(user)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                      <UserX size={18} className="flex-shrink-0" />
                      <span>Vô hiệu hóa</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}