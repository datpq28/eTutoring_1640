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
