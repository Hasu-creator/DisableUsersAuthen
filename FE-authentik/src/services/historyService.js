// src/services/historyService.js
const HISTORY_KEY = 'disableHistory';
const MAX_HISTORY_RECORDS = 50;

export const historyService = {
  // Lấy lịch sử
  getHistory: () => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  },

  // Thêm record mới vào lịch sử
  addRecord: (record) => {
    try {
      const history = historyService.getHistory();
      history.unshift(record); // Thêm vào đầu mảng
      
      // Giới hạn số lượng records
      const limitedHistory = history.slice(0, MAX_HISTORY_RECORDS);
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
      return limitedHistory;
    } catch (error) {
      console.error('Error saving history:', error);
      return [];
    }
  },

  // Xóa toàn bộ lịch sử
  clearHistory: () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  },

  // Export lịch sử ra JSON file
  exportHistory: () => {
    const history = historyService.getHistory();
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `disable-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
};