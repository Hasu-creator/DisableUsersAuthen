import React, { useState, useEffect } from 'react';
import { Edit, Loader2, X, User, Mail, Shield, AlertCircle } from 'lucide-react';

export default function EditUserModal({ user, onConfirm, onCancel, isProcessing }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // Loại bỏ username trong ngoặc nếu có
      const displayName = user.name.includes('(') 
        ? user.name.substring(0, user.name.indexOf('(')).trim() 
        : user.name;
      setName(displayName);
      setEmail(user.email);
    }
  }, [user]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onConfirm({
      username: user.username,
      name: name.trim(),
      email: email.trim()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                <Edit className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Chỉnh sửa thông tin</h2>
                <p className="text-blue-100 text-sm mt-1">Cập nhật thông tin tài khoản nhân viên</p>
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
          {/* Username - Không cho chỉnh sửa */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Shield size={20} className="text-blue-600" />
              Username
              <span className="ml-2 text-xs text-gray-500 font-normal">(Không thể thay đổi)</span>
            </label>
            <div className="w-full px-6 py-4 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 font-mono font-semibold">
              {user?.username}
            </div>
          </div>

          {/* Họ tên */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Họ và tên
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">Bắt buộc</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({...errors, name: null});
              }}
              placeholder="Nhập họ và tên đầy đủ"
              className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-xl focus:bg-white focus:ring-4 outline-none transition-all duration-200 text-gray-900 ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Mail size={20} className="text-blue-600" />
              Email
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">Bắt buộc</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({...errors, email: null});
              }}
              placeholder="example@company.com"
              className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-xl focus:bg-white focus:ring-4 outline-none transition-all duration-200 text-gray-900 ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <AlertCircle className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-blue-900 mb-3 text-lg">ℹ️ Lưu ý</p>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                    <span>Thông tin sẽ được <strong>cập nhật ngay lập tức</strong> trên hệ thống</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                    <span><strong>Username không thể thay đổi</strong> sau khi tạo tài khoản</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                    <span>Email phải là <strong>địa chỉ hợp lệ</strong> và duy nhất</span>
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
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Đang lưu...
              </>
            ) : (
              <>
                <Edit size={20} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}