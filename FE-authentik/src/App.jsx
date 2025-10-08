import React, { useState, useEffect } from 'react';
import { Users, Ban } from 'lucide-react';

// Components
import Header from './components/Header';
import Notification from './components/Notification';
import SearchBar from './components/SearchBar';
import UserTable from './components/UserTable';
import InactiveUserTable from './components/InactiveUserTable';
import ConfirmDisableModal from './components/ConfirmDisableModal';
import ConfirmActivateModal from './components/ConfirmActivateModal';
import EditUserModal from './components/EditUserModal';
import AuditHistory from './components/AuditHistory';
import ScrollToTop from './components/ScrollToTop';

// Custom Hooks
import { useUsers } from './hooks/useUsers';
import { useSearch } from './hooks/useSearch';
import { useModals } from './hooks/useModals';
import { useNotification } from './hooks/useNotification';

// Handlers
import { handleDisableUser, handleActivateUser, handleEditUser } from './handlers/userActionsHandler';
import { handleExportHistory, handleExportAuditJSON, handleExportAuditCSV } from './handlers/exportHandlers';

// Services
import { historyService, auditService } from './services';

import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('active');
  const [history, setHistory] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Custom hooks - không cần truyền activeTab vào useUsers nữa
  const { 
    users, 
    setUsers, 
    inactiveUsers, 
    setInactiveUsers, 
    loading, 
    error, 
    fetchAllData 
  } = useUsers();
  
  const { searchTerm, setSearchTerm, filteredUsers } = useSearch(users, inactiveUsers, activeTab);
  
  const { 
    showDisableModal, 
    showActivateModal, 
    showEditModal, 
    selectedUser, 
    isProcessing, 
    setIsProcessing,
    openDisableModal, 
    openActivateModal, 
    openEditModal, 
    closeAllModals 
  } = useModals();
  
  const { notification, showNotification, closeNotification } = useNotification();

  // Load initial data
  useEffect(() => {
    loadHistory();
    loadAuditLogs();
  }, []);

  // Show error notification
  useEffect(() => {
    if (error) {
      showNotification('error', error);
    }
  }, [error, showNotification]);

  const loadHistory = () => {
    const historyData = historyService.getHistory();
    setHistory(historyData);
  };

  const loadAuditLogs = () => {
    const logs = auditService.getAuditLogs();
    setAuditLogs(logs);
  };

  // Handler wrappers
  const onConfirmDisable = (data) => {
    handleDisableUser({
      data,
      selectedUser,
      setIsProcessing,
      showNotification,
      setHistory,
      setAuditLogs,
      setUsers,
      setInactiveUsers, // ✅ Thêm để cập nhật danh sách inactive
      closeModal: closeAllModals,
    });
  };

  const onConfirmActivate = (data) => {
    handleActivateUser({
      data,
      selectedUser,
      setIsProcessing,
      showNotification,
      setHistory,
      setAuditLogs,
      setUsers, // ✅ Thêm để cập nhật danh sách active
      setInactiveUsers,
      closeModal: closeAllModals,
    });
  };

  const onConfirmEdit = (data) => {
    handleEditUser({
      data,
      selectedUser,
      activeTab,
      setIsProcessing,
      showNotification,
      setAuditLogs,
      setUsers,
      setInactiveUsers,
      closeModal: closeAllModals,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header 
          onRefresh={fetchAllData} 
          loading={loading}
          userCount={activeTab === 'active' ? users.length : inactiveUsers.length}
        />
        
        {/* Notification */}
        <Notification 
          type={notification?.type} 
          message={notification?.message}
          onClose={closeNotification}
        />
        
        {/* Audit History */}
        <AuditHistory 
          auditLogs={auditLogs}
          onExportJSON={() => handleExportAuditJSON(showNotification)}
          onExportCSV={() => handleExportAuditCSV(showNotification)}
        />

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users size={20} />
              Tài khoản hoạt động
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'active' ? 'bg-white bg-opacity-20' : 'bg-gray-200'
              }`}>
                {users.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('inactive')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                activeTab === 'inactive'
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Ban size={20} />
              Tài khoản bị vô hiệu hóa
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'inactive' ? 'bg-white bg-opacity-20' : 'bg-gray-200'
              }`}>
                {inactiveUsers.length}
              </span>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalUsers={activeTab === 'active' ? users.length : inactiveUsers.length}
          filteredCount={filteredUsers.length}
        />
        
        {/* User Tables */}
        {activeTab === 'active' ? (
          <UserTable 
            users={filteredUsers}
            loading={loading}
            onDisableClick={openDisableModal}
            onEditClick={openEditModal}
            searchTerm={searchTerm}
          />
        ) : (
          <InactiveUserTable 
            users={filteredUsers}
            loading={loading}
            onActivateClick={openActivateModal}
            onEditClick={openEditModal}
            searchTerm={searchTerm}
          />
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-6 max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-lg mb-2">Lưu ý quan trọng</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {activeTab === 'active' 
                    ? 'Chỉ vô hiệu hóa tài khoản khi nhân viên đã hoàn tất đầy đủ thủ tục nghỉ việc và bàn giao công việc.'
                    : 'Chỉ kích hoạt lại tài khoản khi nhân viên quay lại làm việc và được phê duyệt bởi quản lý.'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 text-xs mt-4">
            © 2025 Hệ thống quản lý tài khoản - Phòng Nhân sự
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Modals */}
      {showDisableModal && selectedUser && (
        <ConfirmDisableModal
          user={selectedUser}
          onConfirm={onConfirmDisable}
          onCancel={closeAllModals}
          isProcessing={isProcessing}
        />
      )}

      {showActivateModal && selectedUser && (
        <ConfirmActivateModal
          user={selectedUser}
          onConfirm={onConfirmActivate}
          onCancel={closeAllModals}
          isProcessing={isProcessing}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onConfirm={onConfirmEdit}
          onCancel={closeAllModals}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}

export default App;