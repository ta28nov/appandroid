const mongoose = require('mongoose');

const lastMessageSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String },
  timestamp: { type: Date },
}, { _id: false });

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },
    ],
    lastMessage: {
      type: lastMessageSchema,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt (updatedAt hữu ích để sắp xếp các cuộc trò chuyện)
  }
);

// Chỉ mục để truy vấn các cuộc trò chuyện dựa trên người tham gia
chatSchema.index({ participants: 1 });
// Chỉ mục để sắp xếp các cuộc trò chuyện theo hoạt động gần đây
chatSchema.index({ updatedAt: -1 }); 

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat; 