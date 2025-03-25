import axios from "axios";

const API_URL = "http://localhost:5080";

// Hàm lấy một đoạn chat theo ID
export const getConversationById = async (conversationId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/messages/conversations/${conversationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Hàm lấy tất cả đoạn chat theo userId và userModel
export const getConversations = async (userId, userModel) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/messages/conversations/${userId}/${userModel}`,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Conversations fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error.response?.data || error.message);
      throw error;
    }
  };

export const getAllUser = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/viewListUser`);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  export const createConversations = async (participants) => {
    try {
      // Kiểm tra participants có phải là mảng và có phần tử không
      if (!Array.isArray(participants) || participants.length === 0) {
        throw new Error("Participants must be a non-empty array.");
      }
  
      // Đảm bảo mỗi participant có participantId và participantModel
      participants.forEach((p, index) => {
        if (!p.participantId || !p.participantModel) {
          throw new Error(`Participant at index ${index} is missing participantId or participantModel.`);
        }
      });
  
      // Gửi request tạo cuộc trò chuyện
      const response = await axios.post(
        `${API_URL}/api/messages/createconversations`,
        { participants }, // Truyền trực tiếp participants theo đúng format
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Conversation created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating conversation:", error.response?.data || error.message);
      throw error;
    }
  };
  
  
  