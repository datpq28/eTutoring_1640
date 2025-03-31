import axios from "axios";

const API_URL = "http://localhost:5090";

export const viewListUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/viewListUser`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const lockUser = async (email) => {
  try {
    const response = await axios.put(`${API_URL}/api/auth/lockUser`, { email });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const unLockUser = async (email) => {
  try {
    const response = await axios.put(`${API_URL}/api/auth/unLockUser`, { email });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteUser = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/deleteUser`, {
      email, 
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// 🆕 Lấy danh sách các cuộc họp đang chờ duyệt
export const fetchAllMeetings = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/meetings/all`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cuộc họp chờ duyệt:", error);
    throw error;
  }
};

// 🆕 Cập nhật trạng thái cuộc họp (duyệt hoặc từ chối)
export const updateMeetingStatus = async (meetingId, status) => {
  try {
    const response = await axios.put(`${API_URL}/api/auth/meetings/${meetingId}/status`, { status }); // ⚠️ Kiểm tra đường dẫn
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái cuộc họp ${status}:`, error.response?.data || error.message);
    throw error;
  }
};

export const assignTutorToStudentAll = async (studentIds, tutorId) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/assignTutorToStudentAll`, {
      studentIds,
      tutorId,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gán tutor cho học sinh:", error);
    throw error;
  }
};

export const viewListStudentByTutor = async (tutorId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/auth/viewListStudentByTutor/${tutorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học sinh theo tutor:", error);
    throw error;
  }
};
