const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Chat',
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Message text cannot be empty'],
      trim: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Dấu thời gian sẽ được thêm bởi tùy chọn { timestamps: true }
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false }, // Sử dụng trường 'timestamp' cho thời gian tạo
  }
);

// Chỉ mục phức hợp để tìm nạp hiệu quả các tin nhắn cho một cuộc trò chuyện, được sắp xếp theo thời gian
chatMessageSchema.index({ chatId: 1, timestamp: -1 });
chatMessageSchema.index({ timestamp: -1 }); // Chỉ mục cho các truy vấn dựa trên thời gian chung nếu cần

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage; 