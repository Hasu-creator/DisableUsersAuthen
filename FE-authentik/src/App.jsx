import React, { useState, useEffect } from 'react';
import { Users, Ban } from 'lucide-react';
import Header from './components/Header';
import Notification from './components/Notification';
import SearchBar from './components/SearchBar';
import UserTable from './components/UserTable';
import InactiveUserTable from './components/InactiveUserTable';
import ConfirmDisableModal from './components/ConfirmDisableModal';
import ConfirmActivateModal from './components/ConfirmActivateModal';
import EditUserModal from './components/EditUserModal';
import DisableHistory from './components/DisableHistory';
import { userAPI } from './services/api';
import { historyService } from './services/historyService';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('active');
  const [users, setUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);

  // Load users và history khi component mount
  useEffect(() => {
    fetchAllData();
    loadHistory();
  }, []);

  // Load lại data khi chuyển tab
  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  // Lọc users theo search term
  useEffect(() => {
    const currentList = activeTab === 'active' ? users : inactiveUsers;
    
    if (searchTerm.trim() === '') {
      setFilteredUsers(currentList);
    } else {
      const filtered = currentList.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users, inactiveUsers, activeTab]);

  const loadHistory = () => {
    const historyData = historyService.getHistory();
    setHistory(historyData);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'active') {
        const data = await userAPI.getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } else {
        const data = await userAPI.getInactiveUsers();
        setInactiveUsers(data);
        setFilteredUsers(data);
      }
    } catch (error) {
      showNotification('error', error.message || 'Không thể kết nối đến server. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableClick = (user) => {
    setSelectedUser(user);
    setShowDisableModal(true);
  };

  const handleActivateClick = (user) => {
    setSelectedUser(user);
    setShowActivateModal(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleConfirmDisable = async (data) => {
    setIsProcessing(true);
    try {
      await userAPI.disableUser(data.username);
      
      showNotification('success', `Đã vô hiệu hóa tài khoản "${data.username}" thành công. Nhân viên không thể đăng nhập vào hệ thống.`);
      
      // Lưu vào lịch sử với action = 'disable'
      const historyRecord = {
        ...selectedUser,
        reason: data.reason,
        note: data.note,
        resignDate: data.resignDate,
        processedAt: data.processedAt,
        action: 'disable'
      };
      
      const updatedHistory = historyService.addDisableRecord(historyRecord);
      setHistory(updatedHistory);
      
      setUsers(prev => prev.filter(u => u.username !== data.username));
      
      setShowDisableModal(false);
      setSelectedUser(null);
    } catch (error) {
      showNotification('error', `Không thể vô hiệu hóa tài khoản: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmActivate = async (data) => {
    setIsProcessing(true);
    try {
      await userAPI.activateUser(data.username);
      
      showNotification('success', `Đã kích hoạt lại tài khoản "${data.username}" thành công. Nhân viên có thể đăng nhập vào hệ thống.`);
      
      // Lưu vào lịch sử với action = 'activate'
      const historyRecord = {
        ...selectedUser,
        note: data.note,
        activatedAt: data.activatedAt,
        action: 'activate'
      };
      
      const updatedHistory = historyService.addActivateRecord(historyRecord);
      setHistory(updatedHistory);
      
      setInactiveUsers(prev => prev.filter(u => u.username !== data.username));
      
      setShowActivateModal(false);
      setSelectedUser(null);
    } catch (error) {
      showNotification('error', `Không thể kích hoạt tài khoản: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmEdit = async (data) => {
    setIsProcessing(true);
    try {
    // Chỉ gửi name thuần túy, không có (username)
    const nameOnly = data.name.includes('(') 
      ? data.name.split('(')[0].trim() 
      : data.name;
    
    const updatedUser = await userAPI.editUser(data.username, {
      name: nameOnly,  // ✅ Gửi name thuần túy
      email: data.email
    });
      
      showNotification('success', `Đã cập nhật thông tin tài khoản "${data.username}" thành công.`);
      
      // Cập nhật user trong danh sách
      if (activeTab === 'active') {
      setUsers(prev => prev.map(u => 
        u.username === data.username 
          ? { 
              ...u, 
              name: `${updatedUser.name} (${updatedUser.username})`,  // ✅ Format lại
              email: updatedUser.email 
            }
          : u
      ));
    } else {
      setInactiveUsers(prev => prev.map(u => 
        u.username === data.username 
          ? { 
              ...u, 
              name: `${updatedUser.name} (${updatedUser.username})`,  // ✅ Format lại
              email: updatedUser.email 
            }
          : u
      ));
    }
      
      setShowEditModal(false);
    setSelectedUser(null);
  } catch (error) {
    showNotification('error', `Không thể cập nhật tài khoản: ${error.message}`);
  } finally {
    setIsProcessing(false);
  }
};

  const handleCancelModal = () => {
    setShowDisableModal(false);
    setShowActivateModal(false);
    setShowEditModal(false);
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
          onRefresh={fetchAllData} 
          loading={loading}
          userCount={activeTab === 'active' ? users.length : inactiveUsers.length}
        />
        
        <Notification 
          type={notification?.type} 
          message={notification?.message}
          onClose={closeNotification}
        />
        
        <DisableHistory 
          history={history}
          onExport={handleExportHistory}
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
                activeTab === 'active'
                  ? 'bg-white bg-opacity-20'
                  : 'bg-gray-200'
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
                activeTab === 'inactive'
                  ? 'bg-white bg-opacity-20'
                  : 'bg-gray-200'
              }`}>
                {inactiveUsers.length}
              </span>
            </button>
          </div>
        </div>
        
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalUsers={activeTab === 'active' ? users.length : inactiveUsers.length}
          filteredCount={filteredUsers.length}
        />
        
        {/* Conditional Table Rendering */}
        {activeTab === 'active' ? (
          <UserTable 
            users={filteredUsers}
            loading={loading}
            onDisableClick={handleDisableClick}
            onEditClick={handleEditClick}
            searchTerm={searchTerm}
          />
        ) : (
          <InactiveUserTable 
            users={filteredUsers}
            loading={loading}
            onActivateClick={handleActivateClick}
            onEditClick={handleEditClick}
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

      {/* Modals */}
      {showDisableModal && selectedUser && (
        <ConfirmDisableModal
          user={selectedUser}
          onConfirm={handleConfirmDisable}
          onCancel={handleCancelModal}
          isProcessing={isProcessing}
        />
      )}

      {showActivateModal && selectedUser && (
        <ConfirmActivateModal
          user={selectedUser}
          onConfirm={handleConfirmActivate}
          onCancel={handleCancelModal}
          isProcessing={isProcessing}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onConfirm={handleConfirmEdit}
          onCancel={handleCancelModal}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}

export default App;