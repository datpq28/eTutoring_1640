const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      participantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "participantModel",
      },
      participantModel: {
        type: String,
        required: true,
        enum: ["tutor", "student"],
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
