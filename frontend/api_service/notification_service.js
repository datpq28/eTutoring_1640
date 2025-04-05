import axios from "axios";

const API_URL = "http://localhost:5090";

// Lấy danh sách thông báo theo tutorId
export const getNotificationsByTutor = async (tutorId) => {
    try {
      const response = await fetch(`${API_URL}/api/notification/tutor/${tutorId}`);
      
      if (!response.ok) throw new Error("Lỗi khi lấy danh sách thông báo cho tutor");
  
      const data = await response.json();
      return data || []; // Trả về danh sách thông báo hoặc mảng rỗng nếu không có dữ liệu
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  // Lấy danh sách thông báo theo studentId
  export const getNotificationsByStudent = async (studentId) => {
    try {
      const response = await fetch(`${API_URL}/api/notification/student/${studentId}`);
      
      if (!response.ok) throw new Error("Lỗi khi lấy danh sách thông báo cho student");
  
      const data = await response.json();
      return data || []; // Trả về danh sách thông báo hoặc mảng rỗng nếu không có dữ liệu
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await fetch(`${API_URL}/api/notification/${notificationId}/read`, {
            method: "PUT",
        });

        if (!response.ok) throw new Error("Lỗi khi đánh dấu thông báo là đã đọc");

        return await response.json();
    } catch (error) {
        console.error(error);
    }
};