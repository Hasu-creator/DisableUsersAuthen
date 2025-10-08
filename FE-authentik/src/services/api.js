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
        throw new Error(data.message || data.detail || 'Không thể vô hiệu hóa tài khoản');
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
        throw new Error(data.message || data.detail || 'Không thể kích hoạt tài khoản');
      }
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },

  // ✅ Chỉnh sửa thông tin user (bao gồm cả username) - THÊM keep_sessions
  editUser: async (username, updateData) => {
    try {
      const payload = {
        username,
        name: updateData.name,
        email: updateData.email
      };
      
      // Chỉ thêm new_username nếu có
      if (updateData.new_username) {
        payload.new_username = updateData.new_username;
        // 🔥 THÊM FLAG keep_sessions = true để KHÔNG revoke sessions
        payload.keep_sessions = true;
      }
      
      const response = await fetch(`${API_BASE_URL}/edit_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 409) {
          throw new Error(data.detail || 'Username đã tồn tại trong hệ thống');
        } else if (response.status === 403) {
          throw new Error(data.detail || 'Bạn không có quyền chỉnh sửa tài khoản này');
        } else if (response.status === 404) {
          throw new Error(data.detail || 'Không tìm thấy tài khoản');
        }
        throw new Error(data.message || data.detail || 'Không thể cập nhật thông tin tài khoản');
      }
      
      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },
};