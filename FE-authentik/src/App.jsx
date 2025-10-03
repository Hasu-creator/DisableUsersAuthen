import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Notification from './components/Notification';
import SearchBar from './components/SearchBar';
import UserTable from './components/UserTable';
import ConfirmDisableModal from './components/ConfirmDisableModal';
import DisableHistory from './components/DisableHistory';
import { userAPI } from './services/api';
import { historyService } from './services/historyService';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [disableHistory, setDisableHistory] = useState([]);

  // Load users và history khi component mount
  useEffect(() => {
    fetchUsers();
    loadHistory();
  }, []);

  // Lọc users theo search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const loadHistory = () => {
    const history = historyService.getHistory();
    setDisableHistory(history);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
      showNotification('success', `Đã tải thành công ${data.length} tài khoản đang hoạt động`);
    } catch (error) {
      showNotification('error', error.message || 'Không thể kết nối đến server. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirmDisable = async (data) => {
    setIsProcessing(true);
    try {
      await userAPI.disableUser(data.username);
      
      showNotification('success', `Đã vô hiệu hóa tài khoản "${data.username}" thành công. Nhân viên không thể đăng nhập vào hệ thống.`);
      
      // Lưu vào lịch sử
      const historyRecord = {
        ...selectedUser,
        reason: data.reason,
        note: data.note,
        resignDate: data.resignDate,
        processedAt: data.processedAt
      };
      
      const updatedHistory = historyService.addRecord(historyRecord);
      setDisableHistory(updatedHistory);
      
      // Xóa user khỏi danh sách
      setUsers(prev => prev.filter(u => u.username !== data.username));
      
      // Đóng modal
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      showNotification('error', `Không thể vô hiệu hóa tài khoản: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleExportHistory = () => {
    historyService.exportHistory();
    showNotification('success', 'Đã xuất lịch sử thành công. Kiểm tra file tải về.');
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 6000);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          onRefresh={fetchUsers} 
          loading={loading}
          userCount={users.length}
        />
        
        <Notification 
          type={notification?.type} 
          message={notification?.message}
          onClose={closeNotification}
        />
        
        <DisableHistory 
          history={disableHistory}
          onExport={handleExportHistory}
        />
        
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalUsers={users.length}
          filteredCount={filteredUsers.length}
        />
        
        <UserTable 
          users={filteredUsers}
          loading={loading}
          onDisableClick={handleDisableClick}
          searchTerm={searchTerm}
        />

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
                  Chỉ vô hiệu hóa tài khoản khi nhân viên đã hoàn tất <strong>đầy đủ thủ tục nghỉ việc</strong> và 
                  <strong> bàn giao công việc</strong>. Đảm bảo đã kiểm tra kỹ thông tin trước khi thực hiện.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 text-xs mt-4">
            © 2025 Hệ thống quản lý tài khoản - Phòng Nhân sự
          </p>
        </div>
      </div>

      {/* Modal xác nhận */}
      {showModal && selectedUser && (
        <ConfirmDisableModal
          user={selectedUser}
          onConfirm={handleConfirmDisable}
          onCancel={handleCancelModal}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}

export default App;