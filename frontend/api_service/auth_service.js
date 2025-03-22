import axios from "axios";

const API_URL = "http://localhost:5080";

export const loginUser = async (email, password) => {
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

export const registerVerifyOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/registerVerifyOTP`, {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    console.error("Error verify OTP:", error);
    throw error;
  }
};

export const registerSendOTP = async (
  firstname,
  lastname,
  email,
  password,
  role,
  description,
  filed,
  blogId
) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/registerSendOTP`, {
      firstname,
      lastname,
      email,
      password,
      role,
      description,
      filed,
      blogId,
    });
    return response.data;
  } catch (error) {
    console.error("Error during login", error);
    throw error;
  }
};
