import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Notification({ type, message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  
  return (
    <div className={`mb-8 rounded-2xl shadow-2xl overflow-hidden border-2 animate-slideDown ${
      isSuccess 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
        : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
    }`}>
      <div className="p-6 flex items-center gap-4">
        <div className={`flex-shrink-0 p-3 rounded-xl ${
          isSuccess ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isSuccess ? (
            <CheckCircle className="text-green-600" size={28} />
          ) : (
            <AlertCircle className="text-red-600" size={28} />
          )}
        </div>
        
        <div className="flex-1">
          <p className={`font-bold text-lg ${
            isSuccess ? 'text-green-900' : 'text-red-900'
          }`}>
            {isSuccess ? '✓ Thành công' : '✗ Có lỗi xảy ra'}
          </p>
          <p className={`text-sm mt-1 ${
            isSuccess ? 'text-green-700' : 'text-red-700'
          }`}>
            {message}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
              isSuccess 
                ? 'hover:bg-green-100 text-green-600' 
                : 'hover:bg-red-100 text-red-600'
            }`}
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}