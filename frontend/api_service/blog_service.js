import axios from "axios";

const API_URL = "http://localhost:5080";

// Tạo bài blog
export const createBlog = async (blogData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/api/blogs`, blogData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

// Lấy danh sách blog
export const getBlogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Lấy bài blog theo ID
export const getBlogById = async (blogId) => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs/${blogId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    throw error;
  }
};

// Sửa bài blog
export const editBlog = async (blogId, blogData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/api/blogs/${blogId}`, blogData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing blog:", error);
    throw error;
  }
};

// Thích bài blog
export const likeBlog = async (blogId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/api/blogs/${blogId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error liking blog:", error);
    throw error;
  }
};

// Xóa bài blog
export const deleteBlog = async (blogId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/api/blogs/${blogId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};
