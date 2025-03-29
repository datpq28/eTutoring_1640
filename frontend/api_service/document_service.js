import axios from "axios";

const API_URL = "http://localhost:5090";

// Tạo tài liệu
export const createDocument = async (documentData) => {
    try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");

        if (!userId || !role || !token) {
            throw new Error("User information is missing. Please log in again.");
        }

        const response = await axios.post(`${API_URL}/api/document/documents`, {
            ...documentData,
            uploadedBy: userId,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        console.error("Error creating document:", error);
        throw error;
    }
};

// Lấy danh sách tài liệu
export const getDocuments = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/document/documents`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
    }
};


// Lấy tài liệu theo ID
export const getDocumentById = async (documentId) => {
    try {
        const response = await axios.get(`${API_URL}/api/document/documents/${documentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching document by ID:", error);
        throw error;
    }
};

// Cập nhật tài liệu
export const editDocument = async (documentId, documentData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(`${API_URL}/api/document/documents/${documentId}`, documentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error editing document:", error);
        throw error;
    }
};

// Xóa tài liệu
export const deleteDocument = async (documentId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/api/document/documents/${documentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
};

// Thêm bình luận vào tài liệu
export const addCommentToDocument = async (documentId, commentData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/api/document/documents/${documentId}/comments`, commentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};
