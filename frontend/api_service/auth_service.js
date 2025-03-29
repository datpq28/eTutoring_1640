import axios from "axios";

const API_URL = "http://localhost:5090";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/loginUser`, {
      email,
      password,
    });

    const { token, role, userId } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      // const userInfo = {
      //   token,
      //   role,
      //   userId,
      // };
      // localStorage.setItem(userId, JSON.stringify(userInfo));
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

export const forgotPasswordSendOTP = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/forgotPasswordSendOTP`,
      {
        email,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const verifyOtpForgot = async (email, otp) => {
  try {
    console.log("Verifying OTP with data:", { email, otp });
    const response = await axios.post(`${API_URL}/api/auth/verifyOtp`, {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const updatePassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/updatePassword`, {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
