import axios from "axios";

const API_URL = "http://localhost:5090";

export const fetchStudentsByTutor = async (tutorId) => {
    try {
      const response = await fetch(`${API_URL}/api/meeting/students/${tutorId}`);
      if (!response.ok) throw new Error("Lỗi khi lấy danh sách học sinh");
  
      const data = await response.json();
      return data.students || []; // Trả về danh sách students thay vì studentIds
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  export const createMeeting = async (meetingData) => {
    try {
      const response = await fetch(`${API_URL}/api/meeting/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meetingData),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Lỗi khi tạo cuộc họp");
  
      return data;
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  };

  export const fetchMeetingsByTutor = async (tutorId) => {
    try {
      const response = await fetch(`${API_URL}/api/meeting/meetings/${tutorId}`);
      if (!response.ok) throw new Error("Lỗi khi lấy danh sách cuộc họp");
  
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  export const fetchMeetingsByStudent = async (studentId) => {
    try {
      const response = await fetch(`${API_URL}/api/meeting/meetings/student/${studentId}`);
      if (!response.ok) {
        throw new Error(`Lỗi khi lấy danh sách cuộc họp: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error fetching meetings for student:", error);
      return [];
    }
  };
  
  