const Conversation = require("../../models/ConversationModel");
const Message = require("../../models/MesagesModel");

const createConversation = async (req, res) => {
  const { participants } = req.body;
  try {
    let conversation = await Conversation.findOne({
      participants: { $size: participants.length, $all: participants },
    });

    if (!conversation) {
      conversation = new Conversation({ participants });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả các cuộc trò chuyện của một người
const getConversations = async (req, res) => {
  const { userId, userModel } = req.params;

  try {
    const conversations = await Conversation.find({
      participants: {
        $elemMatch: { participantId: userId, participantModel: userModel },
      },
    }).sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getConversationById = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      conversationId: conversation._id,
      participants: conversation.participants,
      messages: messages.map((message) => ({
        senderId: message.senderId,
        senderModel: message.senderModel,
        contents: message.contents,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa một cuộc trò chuyện
const deleteConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    await Conversation.findByIdAndDelete(conversationId);
    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm thành viên vào nhóm
const addParticipantsToGroup = async (req, res) => {
  const { conversationId } = req.params;
  const { newParticipants } = req.body;

  try {
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $addToSet: { participants: { $each: newParticipants } } },
      { new: true }
    );

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Xóa thành viên khỏi nhóm
// const removeParticipantFromGroup = async (req, res) => {
//   const { conversationId } = req.params;
//   const { participantId, participantModel } = req.body;

//   try {
//     const conversation = await Conversation.findByIdAndUpdate(
//       conversationId,
//       { $pull: { participants: { participantId, participantModel } } },
//       { new: true }
//     );

//     if (!conversation)
//       return res.status(404).json({ message: "Conversation not found" });
//     res.status(200).json(conversation);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// Xóa toàn bộ cuộc trò chuyện luôn vì là nhắn tin 1 1
const removeParticipantFromGroup = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const conversation = await Conversation.findByIdAndDelete(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả các cuộc trò chuyện trong hệ thống
const getAllConversations = async (req, res) => {
  try {
    // Lấy tất cả các cuộc trò chuyện, sắp xếp theo thời gian cập nhật gần nhất
    const conversations = await Conversation.find({})
      .sort({ updatedAt: -1 })
      .lean(); // Sử dụng .lean() để tăng hiệu suất nếu không cần đối tượng Mongoose đầy đủ

    if (!conversations || conversations.length === 0) {
      return res
        .status(200)
        .json({ message: "No conversations found", data: [] });
    }

    res.status(200).json({
      message: "All conversations retrieved successfully",
      data: conversations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  deleteConversation,
  addParticipantsToGroup,
  removeParticipantFromGroup,
  getAllConversations,
};
