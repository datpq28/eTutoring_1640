const Message = require("../../models/MesagesModel");

// Gửi tin nhắn
const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, senderModel, content } = req.body;

    // Tìm tin nhắn theo conversationId và senderId
    const message = await Message.findOneAndUpdate(
      { conversationId, senderId, senderModel },
      {
        $push: { contents: { content } },
        $set: { updatedAt: Date.now() },
      },
      { new: true, upsert: true } // Tạo mới nếu không tìm thấy
    );

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sửa tin nhắn
const updateMessage = async (req, res) => {
  try {
    const { messageId, contentIndex } = req.params;
    const { senderId, content } = req.body;

    const message = await Message.findOneAndUpdate(
      { _id: messageId, senderId },
      {
        $set: {
          [`contents.${contentIndex}.content`]: content,
          updatedAt: Date.now(),
        },
      },
      { new: true }
    );

    if (!message) {
      return res
        .status(404)
        .json({
          message: "Tin nhắn không tồn tại hoặc bạn không có quyền sửa.",
        });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa tin nhắn
const deleteMessage = async (req, res) => {
  try {
    const { messageId, contentIndex } = req.params;
    const { senderId } = req.body;

    const message = await Message.findOneAndUpdate(
      { _id: messageId, senderId },
      {
        $pull: { contents: { _id: contentIndex } },
        $set: { updatedAt: Date.now() },
      },
      { new: true }
    );

    if (!message) {
      return res
        .status(404)
        .json({
          message: "Tin nhắn không tồn tại hoặc bạn không có quyền xóa.",
        });
    }

    res
      .status(200)
      .json({ message: "Đã xóa tin nhắn thành công.", data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendMessage, updateMessage, deleteMessage };
