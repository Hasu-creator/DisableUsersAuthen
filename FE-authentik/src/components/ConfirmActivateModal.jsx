// src/components/ConfirmActivateModal.jsx
import React, { useState } from 'react';
import { CheckCircle, UserCheck, Loader2, X, User, Mail, Shield, AlertCircle } from 'lucide-react';

export default function ConfirmActivateModal({ user, onConfirm, onCancel, isProcessing }) {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onConfirm({
      username: user.username,
      note,
      activatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                <CheckCircle className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Kích hoạt lại tài khoản</h2>
                <p className="text-green-100 text-sm mt-1">Khôi phục quyền truy cập cho nhân viên</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* User Info Card */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-100 rounded-2xl p-6 shadow-inner">
            <h3 className="font-bold text-green-900 mb-4 text-lg">Thông tin nhân viên</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Họ và tên</p>
                  <p className="font-bold text-gray-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Username</p>
                  <p className="font-mono font-bold text-gray-900 bg-white px-3 py-1 rounded-lg inline-block">
                    {user.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Mail className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              Lý do kích hoạt lại
              <span className="ml-2 text-xs text-gray-500 font-normal">(Không bắt buộc)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Nhân viên quay lại làm việc, kết thúc thời gian tạm nghỉ..."
              rows={3}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200 resize-none text-gray-900"
            />
          </div>

          {/* Info */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <AlertCircle className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-blue-900 mb-3 text-lg">ℹ️ Thông tin</p>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                    <span>Tài khoản sẽ <strong>ngay lập tức được kích hoạt</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                    <span>Nhân viên <strong>có thể đăng nhập lại</strong> vào hệ thống</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                    <span>Tất cả <strong>quyền truy cập cũ sẽ được khôi phục</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex gap-4 justify-end rounded-b-3xl">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base shadow-sm hover:shadow"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Đang xử lý...
              </>
            ) : (
              <>
                <UserCheck size={20} />
                Xác nhận kích hoạt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}