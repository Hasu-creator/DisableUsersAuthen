
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Notification({ type, message }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  
  return (
    <div className={`mb-6 p-4 rounded-lg shadow-md flex items-center gap-3 ${
      isSuccess 
        ? 'bg-green-50 text-green-800 border border-green-200' 
        : 'bg-red-50 text-red-800 border border-red-200'
    }`}>
      {isSuccess ? (
        <CheckCircle className="text-green-600" size={24} />
      ) : (
        <AlertCircle className="text-red-600" size={24} />
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
}