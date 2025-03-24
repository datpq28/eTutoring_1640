import axios from "axios";

const API_URL = "http://localhost:5080";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/loginUser`, {
      email,
      password,
    });
    const token = response.data.token;

    if (token) {
      localStorage.setItem("token", token);
    }

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

export const approveAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/approveAdmin`);
    return response.data;
  } catch (error) {
    console.error("Error approving admin:", error);
    throw error;
  }
};

export const sendAdminApprovalRequest = async () => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  if (!token) {
    alert("Token is missing. Please log in again.");
    console.error("Token is missing.");
    throw new Error("Token is required.");
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/auth/sendAdminApprovalRequest`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending admin approval request:", error);
    throw error;
  }
};
