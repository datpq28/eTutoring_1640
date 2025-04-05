const express = require("express");
const router = express.Router();
const {
  sendMessage,
  updateMessage,
  deleteMessage,
  getAllMessages,
} = require("../controllers/mesages/mesController");
const {
  createConversation,
  getConversations,
  getConversationById,
  deleteConversation,
  addParticipantsToGroup,
  removeParticipantFromGroup,
  getAllConversations,
} = require("../controllers/conversation/conversationController");

// Routes cho tin nhắn
router.get("/messages/all", getAllMessages); // Lấy tất cả tin
router.post("/messages", sendMessage); // Gửi tin nhắn
router.put("/messages/:messageId", updateMessage); // Sửa tin nhắn
router.delete("/messages/:messageId", deleteMessage); // Xóa tin nhắn

// Routes cho cuộc trò chuyện
router.get("/conversations", getAllConversations); // Lấy tất cả cuộc trò chuyện
router.post("/createconversations", createConversation); // Tạo cuộc trò chuyện
router.get("/conversations/:userId/:userModel", getConversations); // Lấy tất cả cuộc trò chuyện của một người dùng
router.get("/conversations/:conversationId", getConversationById); // Lấy chi tiết một cuộc trò chuyện
router.delete("/conversations/:conversationId", deleteConversation); // Xóa cuộc trò chuyện

// Routes thêm/xóa thành viên vào nhóm
router.post(
  "/conversations/:conversationId/participants",
  addParticipantsToGroup
); // Thêm thành viên vào nhóm
router.delete(
  "/conversations/:conversationId/participants",
  removeParticipantFromGroup
); // Xóa thành viên khỏi nhóm

module.exports = router;
