import axios from "axios";

const API_URL = "http://localhost:5080";

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
