import axios from "axios";

const API_URL = "http://localhost:5090";


export const createDocument = async (documentData) => {
    try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!userId || !token) {
            throw new Error("User information is missing. Please log in again.");
        }

        const formData = new FormData();
        formData.append("title", documentData.get("title"));
        formData.append("description", documentData.get("description"));
        formData.append("subject", documentData.get("subject"));
        formData.append("uploadedBy", documentData.get("uploadedBy"));
        if (documentData.get("file")) {
            formData.append("file", documentData.get("file"));
        }

        console.log("FormData before sending:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": ", pair[1]);
        }

        const response = await axios.post(`${API_URL}/api/document/documents`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
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


export const editDocument = async (documentId, documentData) => {
    try {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("title", documentData.get("title"));
        formData.append("description", documentData.get("description"));
        formData.append("subject", documentData.get("subject"));
        formData.append("uploadedBy", documentData.get("uploadedBy"));
        if (documentData.get("file")) {
            formData.append("file", documentData.get("file"));
        }

        const response = await axios.put(`${API_URL}/api/document/documents/${documentId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
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



export const downloadDocument = async (documentId, fileName) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/document/documents/${documentId}/download`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
        });

        const contentDisposition = response.headers["content-disposition"];
        let suggestedFileName = fileName || "document.pdf"; // Tên mặc định

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match && match[1]) {
                suggestedFileName = match[1];
            }
        }

        // Kiểm tra loại file để tránh tải nhầm HTML
        const contentType = response.headers["content-type"];
        if (!contentType || contentType.includes("text/html")) {
            const text = await response.data.text();
            console.error("Phản hồi không phải file:", text);
            throw new Error("Lỗi: API không trả về file đúng.");
        }

        // Tạo URL để tải xuống file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", suggestedFileName);
        document.body.appendChild(link);
        link.click();
        link.remove();

        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải tài liệu:", error);
        throw error;
    }
};

