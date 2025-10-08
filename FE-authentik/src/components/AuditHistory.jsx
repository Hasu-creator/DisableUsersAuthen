import React, { useState } from 'react';
import { Clock, Calendar, FileText, User, Download, Ban, CheckCircle, Edit, ArrowRight, AlertTriangle, Filter, ChevronDown, ChevronUp, Shield, Zap } from 'lucide-react';

export default function AuditHistory({ auditLogs, onExportJSON, onExportCSV }) {
  const [filterAction, setFilterAction] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!auditLogs || auditLogs.length === 0) return null;

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (filterSeverity !== 'all' && log.severity !== filterSeverity) return false;
    return true;
  });

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ').filter(w => w.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarStyle = (name, action) => {
    const actionStyles = {
      'DISABLE_USER': {
        gradient: 'from-rose-400 via-red-500 to-pink-600',
        ring: 'ring-rose-300',
        shadow: 'shadow-rose-500/50',
        glow: 'bg-rose-500'
      },
      'ACTIVATE_USER': {
        gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
        ring: 'ring-emerald-300',
        shadow: 'shadow-emerald-500/50',
        glow: 'bg-emerald-500'
      },
      'EDIT_USER': {
        gradient: 'from-blue-400 via-indigo-500 to-purple-600',
        ring: 'ring-blue-300',
        shadow: 'shadow-blue-500/50',
        glow: 'bg-blue-500'
      },
      'CHANGE_USERNAME': {
        gradient: 'from-amber-400 via-orange-500 to-red-600',
        ring: 'ring-amber-300',
        shadow: 'shadow-amber-500/50',
        glow: 'bg-amber-500'
      },
      'CHANGE_USERNAME_AND_INFO': {
        gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
        ring: 'ring-violet-300',
        shadow: 'shadow-violet-500/50',
        glow: 'bg-violet-500'
      }
    };

    return actionStyles[action] || {
      gradient: 'from-slate-400 via-gray-500 to-zinc-600',
      ring: 'ring-slate-300',
      shadow: 'shadow-slate-500/50',
      glow: 'bg-slate-500'
    };
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'DISABLE_USER':
        return <Ban className="text-white" size={16} />;
      case 'ACTIVATE_USER':
        return <CheckCircle className="text-white" size={16} />;
      case 'EDIT_USER':
        return <Edit className="text-white" size={16} />;
      case 'CHANGE_USERNAME':
      case 'CHANGE_USERNAME_AND_INFO':
        return <Zap className="text-white" size={16} />;
      default:
        return <FileText className="text-white" size={16} />;
    }
  };

  const getActionBadge = (log) => {
    const badges = {
      'DISABLE_USER': {
        gradient: 'from-rose-500 to-red-600',
        text: 'text-white',
        label: '🚫 Vô hiệu hóa',
        shadow: 'shadow-rose-500/30'
      },
      'ACTIVATE_USER': {
        gradient: 'from-emerald-500 to-teal-600',
        text: 'text-white',
        label: '✨ Kích hoạt',
        shadow: 'shadow-emerald-500/30'
      },
      'EDIT_USER': {
        gradient: 'from-blue-500 to-indigo-600',
        text: 'text-white',
        label: '✏️ Chỉnh sửa',
        shadow: 'shadow-blue-500/30'
      },
      'CHANGE_USERNAME': {
        gradient: 'from-amber-500 to-orange-600',
        text: 'text-white',
        label: '🔄 Đổi Username',
        shadow: 'shadow-amber-500/30'
      },
      'CHANGE_USERNAME_AND_INFO': {
        gradient: 'from-violet-500 to-purple-600',
        text: 'text-white',
        label: '⚡ Đổi Username + Info',
        shadow: 'shadow-violet-500/30'
      }
    };

    const badge = badges[log.action] || { 
      gradient: 'from-slate-500 to-gray-600', 
      text: 'text-white', 
      label: log.action,
      shadow: 'shadow-slate-500/30'
    };
    
    return (
      <div className="flex items-center gap-2">
        <span className={`bg-gradient-to-r ${badge.gradient} ${badge.text} text-xs px-3 py-1 rounded-full font-bold ${badge.shadow} shadow-md`}>
          {badge.label}
        </span>
        {log.severity === 'critical' && (
          <span className="bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg shadow-red-500/40 animate-pulse">
            <AlertTriangle size={12} />
            CRITICAL
          </span>
        )}
      </div>
    );
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 font-extrabold',
      high: 'text-orange-600 font-bold',
      medium: 'text-amber-600 font-semibold',
      low: 'text-emerald-600 font-medium'
    };
    return colors[severity] || 'text-slate-600';
  };

  const renderCombinedChanges = (log) => {
    if (!log.changes || log.changes.length === 0) return null;

    const hasUsernameChange = log.changes.some(c => c.field === 'username');

    return (
      <div className={`${
        hasUsernameChange 
          ? 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-2 border-violet-300' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300'
      } rounded-2xl p-5 shadow-lg ${hasUsernameChange ? 'shadow-violet-200' : 'shadow-blue-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl ${
            hasUsernameChange 
              ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/40' 
              : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40'
          }`}>
            {hasUsernameChange ? (
              <Shield className="text-white" size={20} />
            ) : (
              <Edit className="text-white" size={20} />
            )}
          </div>
          <p className={`font-bold text-base ${
            hasUsernameChange ? 'text-violet-900' : 'text-blue-900'
          }`}>
            {hasUsernameChange ? '⚡ Thay đổi Thông tin Quan trọng (bao gồm Username)' : '📝 Thay đổi Thông tin'}
          </p>
        </div>
        
        <div className="space-y-3">
          {log.changes.map((change, idx) => {
            const isCritical = change.critical || change.field === 'username';
            
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                  isCritical 
                    ? 'bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-2 border-red-300 shadow-md shadow-red-200' 
                    : 'bg-white border-2 border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Field Label */}
                <div className={`flex items-center gap-2 min-w-[110px] ${
                  isCritical ? 'text-red-700' : 'text-slate-700'
                } font-bold text-sm`}>
                  {change.field === 'username' && (
                    <div className="p-1 bg-red-100 rounded-lg">
                      <Shield size={16} className="text-red-600" />
                    </div>
                  )}
                  {change.field === 'email' && (
                    <span className="text-lg">📧</span>
                  )}
                  {change.field === 'name' && (
                    <span className="text-lg">👤</span>
                  )}
                  <span>{change.label || change.field}</span>
                </div>
                
                {/* Old Value */}
                <code className={`px-4 py-2 ${
                  isCritical 
                    ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-900 border-2 border-red-300 shadow-sm' 
                    : 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-2 border-slate-300'
                } rounded-lg font-mono text-xs font-bold line-through`}>
                  {change.oldValue}
                </code>
                
                {/* Arrow */}
                <div className={`p-2 rounded-lg ${
                  isCritical 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30'
                }`}>
                  <ArrowRight className="text-white" size={18} />
                </div>
                
                {/* New Value */}
                <code className={`px-4 py-2 ${
                  isCritical 
                    ? 'bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/50' 
                    : 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/40'
                } rounded-lg font-mono text-xs font-bold ring-2 ring-white/20`}>
                  {change.newValue}
                </code>
              </div>
            );
          })}
        </div>
        
        {/* Warning nếu có username change */}
        {hasUsernameChange && (
          <div className="mt-4 bg-gradient-to-r from-violet-100 via-purple-100 to-fuchsia-100 border-2 border-violet-400 rounded-xl p-4 shadow-lg shadow-violet-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-violet-500 rounded-lg flex-shrink-0 shadow-md">
                <AlertTriangle className="text-white" size={18} />
              </div>
              <div className="flex-1 space-y-2">
                <p className="font-bold text-violet-900 text-sm">⚠️ Thông tin quan trọng về Username:</p>
                <div className="space-y-1.5 text-xs text-violet-800">
                  <div className="flex items-start gap-2">
                    <span className="text-violet-600 font-bold">•</span>
                    <p>Username đã được thay đổi từ <code className="bg-violet-200 text-violet-900 px-2 py-0.5 rounded font-bold">{log.username}</code> sang <code className="bg-violet-200 text-violet-900 px-2 py-0.5 rounded font-bold">{log.newUsername}</code></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-violet-600 font-bold">•</span>
                    <p className="text-emerald-700 font-semibold">Sessions và tokens được giữ nguyên - User tiếp tục đăng nhập bình thường</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-slate-200 mb-8">
      {/* Header - Gradient đẹp hơn */}
      <div 
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-b-4 border-purple-600 px-8 py-6 cursor-pointer hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 relative overflow-hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-32 translate-y-32"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/30">
              <Clock className="text-white" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-white drop-shadow-lg">Lịch sử Audit Log</h2>
                <span className="bg-white/30 backdrop-blur-xl text-white text-sm px-4 py-1.5 rounded-full font-bold shadow-lg border border-white/40">
                  {filteredLogs.length} logs
                </span>
              </div>
              <p className="text-purple-100 text-sm mt-1 font-medium">
                {filterAction !== 'all' || filterSeverity !== 'all' ? '🔍 Đang lọc - ' : ''}
                Click để {isExpanded ? 'thu gọn ▲' : 'mở rộng ▼'}
              </p>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            className="p-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xl border-2 border-white/40 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="text-white" size={24} />
            ) : (
              <ChevronDown className="text-white" size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <>
          {/* Filters & Export - Gradient mới */}
          <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b-2 border-indigo-100 px-8 py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Filters */}
              <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg border-2 border-indigo-200 flex-wrap">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                  <Filter size={20} className="text-indigo-600" />
                  <span>Lọc:</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="px-5 py-3 bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-300 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 hover:border-indigo-400 transition-all cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <option value="all">📋 Tất cả</option>
                    <option value="DISABLE_USER">🚫 Vô hiệu hóa</option>
                    <option value="ACTIVATE_USER">✨ Kích hoạt</option>
                    <option value="EDIT_USER">✏️ Chỉnh sửa</option>
                    <option value="CHANGE_USERNAME">🔄 Đổi username</option>
                    <option value="CHANGE_USERNAME_AND_INFO">⚡ Đổi username + info</option>
                  </select>
                  
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-5 py-3 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-300 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-500 hover:border-purple-400 transition-all cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <option value="all">🎯 Tất cả mức độ</option>
                    <option value="critical">🔴 Critical</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-3">
                {onExportJSON && (
                  <button
                    onClick={onExportJSON}
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-xl shadow-blue-500/40 hover:shadow-2xl transform hover:-translate-y-1 active:scale-95"
                  >
                    <Download size={18} className="group-hover:animate-bounce" />
                    <span>JSON</span>
                  </button>
                )}
                {onExportCSV && (
                  <button
                    onClick={onExportCSV}
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-xl shadow-emerald-500/40 hover:shadow-2xl transform hover:-translate-y-1 active:scale-95"
                  >
                    <Download size={18} className="group-hover:animate-bounce" />
                    <span>CSV</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content - Cards đẹp hơn */}
          <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="space-y-5">
              {filteredLogs.slice(0, 10).map((log) => {
                const avatarStyle = getAvatarStyle(log.userDisplayName || log.username, log.action);
                
                return (
                  <div 
                    key={log.id} 
                    className="group relative bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-indigo-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-300"></div>
                    
                    <div className="flex items-start justify-between gap-4 relative z-10">
                      <div className="flex-1 space-y-4">
                        {/* User info với avatar đẹp */}
                        <div className="flex items-center gap-4">
                          {/* Avatar với hiệu ứng đẹp */}
                          <div className="relative group/avatar">
                            <div className={`absolute -inset-1 bg-gradient-to-r ${avatarStyle.gradient} rounded-2xl  opacity-50 group-hover/avatar:opacity-100 transition duration-300 animate-pulse`}></div>
                            
                            <div className={`relative w-14 h-14 bg-gradient-to-br ${avatarStyle.gradient} rounded-2xl flex items-center justify-center shadow-xl ring-4 ${avatarStyle.ring} ring-opacity-50 transition-all duration-300 group-hover/avatar:scale-110`}>
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 rounded-2xl"></div>
                              
                              <span className="relative text-white font-black text-lg drop-shadow-lg">
                                {getInitials(log.userDisplayName || log.username)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                              <span className="font-black text-slate-900 text-lg truncate">{log.userDisplayName || log.username}</span>
                              <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-lg font-mono font-bold">
                                {log.username}
                              </span>
                              {getActionBadge(log)}
                            </div>
                            <p className="text-sm text-slate-500 font-medium truncate">📧 {log.email}</p>
                          </div>
                        </div>

                        {/* Combined Changes */}
                        {(log.action === 'EDIT_USER' || log.action === 'CHANGE_USERNAME' || log.action === 'CHANGE_USERNAME_AND_INFO') && renderCombinedChanges(log)}

                        {/* Disable Details */}
                        {log.action === 'DISABLE_USER' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {log.reason && (
                              <div className="flex items-start gap-3 bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-xl p-4">
                                <FileText className="text-rose-600 flex-shrink-0 mt-0.5" size={18} />
                                <div>
                                  <p className="text-rose-600 text-xs font-bold mb-1">Lý do</p>
                                  <p className="text-slate-900 font-semibold text-sm">{log.reason}</p>
                                </div>
                              </div>
                            )}
                            
                            {log.resignDate && (
                              <div className="flex items-start gap-3 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4">
                                <Calendar className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
                                <div>
                                  <p className="text-purple-600 text-xs font-bold mb-1">Ngày nghỉ việc</p>
                                  <p className="text-slate-900 font-semibold text-sm">
                                    {new Date(log.resignDate).toLocaleDateString('vi-VN')}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Note */}
                        {log.note && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                            <p className="text-xs text-blue-700 font-bold mb-2 flex items-center gap-2">
                              <FileText size={14} />
                              Ghi chú:
                            </p>
                            <p className="text-sm text-slate-700 font-medium">{log.note}</p>
                          </div>
                        )}

                        {/* Performed By */}
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User size={14} />
                          <span>Thực hiện bởi: <strong className="text-slate-700">{log.performedBy || 'System'}</strong></span>
                          <span className={`ml-2 font-black px-2 py-0.5 rounded-full ${getSeverityColor(log.severity)}`}>
                            [{log.severity?.toUpperCase()}]
                          </span>
                        </div>
                      </div>

                      {/* Timestamp với gradient */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`px-4 py-0.5 rounded-xl shadow-lg ${
                          log.severity === 'critical' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' :
                          log.severity === 'high' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white' :
                          log.severity === 'medium' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' :
                          'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                        }`}>
                          <span className="text-xs font-black">
                            {new Date(log.timestamp).toLocaleDateString('vi-VN', { 
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-bold bg-slate-100 px-5 py-0.5 rounded-lg">
                          {new Date(log.timestamp).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredLogs.length > 10 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600 bg-white px-6 py-3 rounded-full inline-block shadow-md border-2 border-slate-200 font-semibold">
                  Hiển thị 10 trong số {filteredLogs.length} hoạt động
                </p>
              </div>
            )}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                <div className="text-slate-400 text-6xl mb-4">📭</div>
                <p className="text-slate-600 font-bold text-lg">Không có log nào phù hợp với bộ lọc</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}