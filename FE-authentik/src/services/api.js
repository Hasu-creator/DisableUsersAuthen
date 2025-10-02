// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const userAPI = {
  // Lấy danh sách tất cả người dùng đang hoạt động
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách người dùng');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Vô hiệu hóa tài khoản người dùng
  disableUser: async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/disable_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Không thể vô hiệu hóa tài khoản');
      }
      
      return result;
    } catch (error) {
      console.error('Error disabling user:', error);
      throw error;
    }
  }
};