import React from 'react';
import { UserCheck, Loader2, Users, Mail, User, Shield, Ban, AlertCircle } from 'lucide-react';

export default function InactiveUserTable({ users, loading, onActivateClick, searchTerm }) {
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
        gradient: 'from-gray-400 via-gray-500 to-slate-500',
        ring: 'ring-gray-200',
        shadow: 'shadow-gray-500/30'
      },
      {
        gradient: 'from-slate-400 via-slate-500 to-zinc-500',
        ring: 'ring-slate-200',
        shadow: 'shadow-slate-500/30'
      },
      {
        gradient: 'from-zinc-400 via-zinc-500 to-gray-500',
        ring: 'ring-zinc-200',
        shadow: 'shadow-zinc-500/30'
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
            <Loader2 className="animate-spin text-gray-600" size={64} />
            <div className="absolute inset-0 bg-gray-100 rounded-full blur-xl opacity-50"></div>
          </div>
          <span className="mt-6 text-gray-600 text-lg font-medium">Đang tải danh sách...</span>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="text-center py-32">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
            <Ban className="text-gray-400" size={48} />
          </div>
          <p className="text-gray-500 text-xl font-medium mb-2">
            {searchTerm ? 'Không tìm thấy tài khoản phù hợp' : 'Không có tài khoản bị vô hiệu hóa'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Tất cả tài khoản đang hoạt động bình thường'}
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
                  className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {/* Grayscale Avatar */}
                      <div className="relative group/avatar">
                        {/* Outer glow ring - muted */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${avatarStyle.gradient} rounded-2xl blur opacity-20 group-hover/avatar:opacity-40 transition duration-300`}></div>
                        
                        {/* Main avatar*/}
                        <div className={`relative w-14 h-14 bg-gradient-to-br ${avatarStyle.gradient} rounded-2xl flex items-center justify-center shadow-xl ${avatarStyle.shadow} ring-4 ${avatarStyle.ring} ring-opacity-50 group-hover:scale-110 transition-all duration-300 grayscale`}>
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Inactive overlay */}
                          <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                          
                          {/* Initials */}
                          <span className="relative text-white font-bold text-xl drop-shadow-lg opacity-70">
                            {getInitials(user.name)}
                          </span>
                          
                          {/* Animated border on hover */}
                          <div className="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Status indicator - red inactive badge */}
                        <div className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 rounded-full p-1.5 border-2 border-white shadow-lg animate-pulse">
                          <Ban className="text-white" size={12} />
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-base font-bold text-gray-700 truncate group-hover:text-green-600 transition-colors" title={user.name}>
                            {user.name}
                          </div>
                          <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                            <AlertCircle size={12} />
                            Inactive
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">ID: #{index + 1}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Đã vô hiệu hóa</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Shield className="text-gray-400 flex-shrink-0" size={16} />
                      <span 
                        className="text-sm font-mono bg-gray-100 text-gray-600 px-3 py-2 rounded-lg font-semibold border border-gray-200 truncate max-w-xs hover:border-gray-300 transition-colors"
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
                        className="text-sm text-gray-600 hover:text-green-600 transition-colors hover:underline truncate"
                        title={user.email}
                      >
                        {user.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onActivateClick(user)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 whitespace-nowrap"
                        title="Kích hoạt lại tài khoản"
                      >
                        <UserCheck size={18} className="flex-shrink-0" />
                        <span>Kích hoạt lại</span>
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