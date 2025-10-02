import React, { useState } from 'react';
import { AlertCircle, UserX, Loader2, Calendar, FileText } from 'lucide-react';

export default function ConfirmDisableModal({ user, onConfirm, onCancel, isProcessing }) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [resignDate, setResignDate] = useState('');

  const reasons = [
    'Nghỉ việc theo đơn xin thôi việc',
    'Hết hạn hợp đồng',
    'Chấm dứt hợp đồng',
    'Nghỉ hưu',
    'Chuyển công tác',
    'Khác'
  ];

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle className="text-orange-500" size={28} />
            Xác nhận vô hiệu hóa tài khoản
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin nhân viên */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Thông tin nhân viên:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Tên:</strong> {user.name}</p>
              <p><strong>Username:</strong> <span className="font-mono bg-white px-2 py-1 rounded">{user.username}</span></p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>

          {/* Ngày nghỉ việc */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              Ngày nghỉ việc <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={resignDate}
              onChange={(e) => setResignDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Lý do nghỉ việc */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              Lý do nghỉ việc <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            >
              <option value="">-- Chọn lý do --</option>
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ghi chú thêm (tuỳ chọn)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Đã bàn giao công việc, đã hoàn tất thủ tục..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Cảnh báo */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">⚠️ Lưu ý quan trọng:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Tài khoản sẽ <strong>ngay lập tức</strong> bị vô hiệu hóa</li>
                  <li>Nhân viên sẽ <strong>không thể đăng nhập</strong> vào hệ thống</li>
                  <li>Hành động này <strong>không thể hoàn tác</strong> tự động</li>
                  <li>Đảm bảo nhân viên đã <strong>hoàn tất thủ tục nghỉ việc</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !reason || !resignDate}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang xử lý...
              </>
            ) : (
              <>
                <UserX size={18} />
                Xác nhận vô hiệu hóa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}