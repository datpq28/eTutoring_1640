import axios from "axios";

const API_URL = "http://localhost:5080/api";

/**
 * Lấy danh sách cuộc họp
 */
export const fetchMeetings = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/meeting/all`);
    return data.meetings;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cuộc họp:", error);
    throw error;
  }
};

/**
 * Lấy danh sách học sinh của tutor
 * @param {string} tutorId - ID của tutor
 */
export const fetchStudentsOfTutor = async (tutorId) => {
  try {
    const { data } = await axios.get(`${API_URL}/tutor/${tutorId}`);
    return data.studentId || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học sinh của tutor:", error);
    throw error;
  }
};

/**
 * Tạo cuộc họp mới
 * @param {Object} meetingData - Dữ liệu cuộc họp
 */
export const createMeeting = async (meetingData) => {
  try {
    await axios.post(`${API_URL}/meeting/create`, meetingData);
  } catch (error) {
    console.error("Lỗi khi tạo cuộc họp:", error);
    throw error;
  }
};
