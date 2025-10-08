import React from 'react';
import { UserX, Loader2, Users, Mail, User, Shield, Edit, Sparkles } from 'lucide-react';

export default function UserTable({ users, loading, onDisableClick, onEditClick, searchTerm }) {
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ').filter(w => w.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarStyle = (name) => {
    const styles = [
      {
        gradient: 'from-indigo-500 via-purple-500 to-pink-500',
        ring: 'ring-indigo-200',
        shadow: 'shadow-indigo-500/50',
        glow: 'bg-indigo-400'
      },
      {
        gradient: 'from-blue-500 via-cyan-500 to-teal-500',
        ring: 'ring-blue-200',
        shadow: 'shadow-blue-500/50',
        glow: 'bg-blue-400'
      },
      {
        gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
        ring: 'ring-purple-200',
        shadow: 'shadow-purple-500/50',
        glow: 'bg-purple-400'
      },
      {
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        ring: 'ring-emerald-200',
        shadow: 'shadow-emerald-500/50',
        glow: 'bg-emerald-400'
      },
      {
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        ring: 'ring-orange-200',
        shadow: 'shadow-orange-500/50',
        glow: 'bg-orange-400'
      },
      {
        gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
        ring: 'ring-rose-200',
        shadow: 'shadow-rose-500/50',
        glow: 'bg-rose-400'
      },
      {
        gradient: 'from-violet-500 via-purple-500 to-indigo-500',
        ring: 'ring-violet-200',
        shadow: 'shadow-violet-500/50',
        glow: 'bg-violet-400'
      },
      {
        gradient: 'from-sky-500 via-blue-500 to-indigo-500',
        ring: 'ring-sky-200',
        shadow: 'shadow-sky-500/50',
        glow: 'bg-sky-400'
      }
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % styles.length;
    return styles[index];
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
      <div className="bg-white rounded-2xl  overflow-hidden border border-gray-100">
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
            {users.map((user, index) => {
              const avatarStyle = getAvatarStyle(user.name);
              
              return (
                <tr 
                  key={user.username} 
                  className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {/* Beautiful Avatar with Multiple Effects */}
                      <div className="relative group/avatar">
                        {/* Outer glow ring */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${avatarStyle.gradient} rounded-2xl blur opacity-30 group-hover/avatar:opacity-60 transition duration-300`}></div>
                        
                        {/* Main avatar */}
                        <div className={`relative w-14 h-14 bg-gradient-to-br ${avatarStyle.gradient} rounded-2xl flex items-center justify-center shadow-xl ${avatarStyle.shadow} ring-4 ${avatarStyle.ring} ring-opacity-50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Sparkle icon - appears on hover */}
                          <Sparkles 
                            className="absolute -top-1 -right-1 text-yellow-300 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 drop-shadow-lg animate-pulse" 
                            size={16} 
                          />
                          
                          {/* Initials */}
                          <span className="relative text-white font-bold text-xl drop-shadow-lg">
                            {getInitials(user.name)}
                          </span>
                          
                          {/* Animated border on hover */}
                          <div className="absolute inset-0 rounded-2xl border-2 border-white/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Status indicator dot */}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${avatarStyle.glow} rounded-full border-2 border-white shadow-lg animate-pulse`}></div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors" title={user.name}>
                          {user.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">ID: #{index + 1}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Active</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Shield className="text-indigo-500 flex-shrink-0" size={16} />
                      <span 
                        className="text-sm font-mono bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-3 py-2 rounded-lg font-semibold border border-indigo-100 truncate max-w-xs hover:border-indigo-300 transition-colors"
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
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEditClick(user)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 whitespace-nowrap"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit size={18} className="flex-shrink-0" />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => onDisableClick(user)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 whitespace-nowrap"
                        title="Vô hiệu hóa tài khoản"
                      >
                        <UserX size={18} className="flex-shrink-0" />
                        <span>Vô hiệu hóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}