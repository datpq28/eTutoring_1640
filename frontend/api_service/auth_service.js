import axios from "axios";

const API_URL = "http://localhost:5080";

const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/loginUser`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export default loginUser;
