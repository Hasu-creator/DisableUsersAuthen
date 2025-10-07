const API_BASE_URL = 'http://localhost:5000/api';

export const userAPI = {
  // Lấy tất cả users đang hoạt động
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách người dùng');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },

  // Lấy tất cả users đã bị vô hiệu hóa
  getInactiveUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/inactive`);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách người dùng đã vô hiệu hóa');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },

  // Vô hiệu hóa user
  disableUser: async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/disable_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể vô hiệu hóa tài khoản');
      }
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },

  // Kích hoạt lại user
  activateUser: async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activate_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể kích hoạt tài khoản');
      }
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },

  // Chỉnh sửa thông tin user
  editUser: async (username, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/edit_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username,
          name: updateData.name,
          email: updateData.email
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật thông tin tài khoản');
      }
      
      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },
};