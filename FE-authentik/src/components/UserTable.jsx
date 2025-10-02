// src/components/UserTable.jsx
import React from 'react';
import { UserX, Loader2, Users } from 'lucide-react';

export default function UserTable({ users, loading, disablingUser, onDisableUser, searchTerm }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <span className="ml-3 text-gray-600 text-lg">Đang tải danh sách...</span>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="text-center py-20">
          <Users className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'Không tìm thấy người dùng phù hợp' : 'Không có người dùng nào'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tên hiển thị
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.username} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                    {user.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onDisableUser(user.username)}
                    disabled={disablingUser === user.username}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {disablingUser === user.username ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <UserX size={16} />
                        Vô hiệu hóa
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}