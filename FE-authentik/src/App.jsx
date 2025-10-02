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
      showNotification('success', `Đã tải ${data.length} tài khoản đang hoạt động`);
    } catch (error) {
      showNotification('error', error.message || 'Lỗi kết nối đến server');
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
      
      showNotification('success', `✓ Đã vô hiệu hóa tài khoản "${data.username}" thành công`);
      
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
      showNotification('error', `Lỗi: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header onRefresh={fetchUsers} loading={loading} />
        
        <Notification 
          type={notification?.type} 
          message={notification?.message} 
        />
        
        <DisableHistory history={disableHistory} />
        
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
        <div className="mt-6 text-center text-sm text-gray-600 bg-white rounded-lg shadow p-4">
          <p>
            ⚠️ <strong>Lưu ý:</strong> Chỉ vô hiệu hóa tài khoản khi nhân viên đã hoàn tất đầy đủ thủ tục nghỉ việc và bàn giao công việc.
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