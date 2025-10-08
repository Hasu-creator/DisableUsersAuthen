import React, { useState } from 'react';
import { AlertCircle, UserX, Loader2, Calendar, FileText, X, User, Mail, Shield } from 'lucide-react';

export default function ConfirmDisableModal({ user, onConfirm, onCancel, isProcessing }) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [resignDate, setResignDate] = useState('');

  const reasons = [
    { value: 'Nghỉ việc theo đơn xin thôi việc', icon: '📄' },
    { value: 'Hết hạn hợp đồng', icon: '📅' },
    { value: 'Chấm dứt hợp đồng', icon: '⚠️' },
    { value: 'Nghỉ hưu', icon: '🎉' },
    { value: 'Chuyển công tác', icon: '🔄' },
    { value: 'Khác', icon: '📝' }
  ];

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    return maxDate.toISOString().split('T')[0];
  };

  const handleSubmit = () => {
    if (!reason) {
      alert('Vui lòng chọn lý do nghỉ việc');
      return;
    }
    if (!resignDate) {
      alert('Vui lòng chọn ngày nghỉ việc');
      return;
    }
    
    onConfirm({
      username: user.username,
      reason,
      note,
      resignDate,
      processedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                <AlertCircle className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Xác nhận vô hiệu hóa</h2>
                <p className="text-orange-100 text-sm mt-1">Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</p>
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
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-100 rounded-2xl p-6 shadow-inner">
            <h3 className="font-bold text-indigo-900 mb-4 text-lg">Thông tin nhân viên</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Họ và tên</p>
                  <p className="font-bold text-gray-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
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
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Mail className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resign Date */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar size={20} className="text-indigo-600" />
              Ngày nghỉ việc
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">Bắt buộc</span>
            </label>
            <input
              type="date"
              value={resignDate}
              onChange={(e) => setResignDate(e.target.value)}
              max={getMaxDate()}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-gray-900 font-medium"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Có thể chọn ngày trong tương lai (tối đa 2 tháng) cho trường hợp nghỉ việc theo lịch
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={20} className="text-indigo-600" />
              Lý do nghỉ việc
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">Bắt buộc</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reasons.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setReason(r.value)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    reason === r.value
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <span className={`text-sm font-medium ${
                    reason === r.value ? 'text-indigo-900' : 'text-gray-700'
                  }`}>
                    {r.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              Ghi chú thêm
              <span className="ml-2 text-xs text-gray-500 font-normal">(Không bắt buộc)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Đã bàn giao công việc, hoàn tất thủ tục, thanh toán lương..."
              rows={4}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 resize-none text-gray-900"
            />
          </div>

          {/* Warning */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-red-900 mb-3 text-lg">⚠️ Cảnh báo quan trọng</p>
                <ul className="space-y-2 text-sm text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0">•</span>
                    <span>Tài khoản sẽ <strong>ngay lập tức bị vô hiệu hóa</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0">•</span>
                    <span>Nhân viên <strong>không thể đăng nhập</strong> vào hệ thống</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0">•</span>
                    <span>Hành động này được <strong>ghi lại trong lịch sử</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0">•</span>
                    <span>Đảm bảo nhân viên đã <strong>hoàn tất thủ tục nghỉ việc</strong></span>
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
            disabled={isProcessing || !reason || !resignDate}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Đang xử lý...
              </>
            ) : (
              <>
                <UserX size={20} />
                Xác nhận vô hiệu hóa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}