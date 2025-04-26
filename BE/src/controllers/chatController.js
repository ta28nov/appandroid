const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const Notification = require('../models/Notification'); // Để tạo thông báo
const mongoose = require('mongoose');

// Helper function to create notifications
const createNotification = async (recipientId, type, title, message, relatedEntity = null) => {
    try {
        await Notification.create({
            userId: recipientId,
            type,
            title,
            message,
            relatedEntity
        });
        // TODO: Triển khai gửi thông báo thời gian thực (ví dụ: WebSockets)
        console.log(`Thông báo đã tạo cho người dùng ${recipientId}: ${title}`);
    } catch (error) {
        console.error(`Không thể tạo thông báo cho người dùng ${recipientId}:`, error);
    }
};

// @desc    Lấy danh sách chat cho người dùng đã đăng nhập
// @route   GET /api/chats
// @access  Riêng tư
const getChats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { limit, page } = req.query;

  const limitNum = parseInt(limit, 10) || 20; // Mặc định 20 chat mỗi trang
  const pageNum = parseInt(page, 10) || 1;
  const skip = (pageNum - 1) * limitNum;

  const chats = await Chat.find({ participants: userId })
    .populate({
      path: 'participants',
      select: 'name email avatarUrl', // Chọn các trường cho người tham gia
      match: { _id: { $ne: userId } } // Loại trừ người dùng hiện tại khỏi những người tham gia được populate
    })
    .populate({
        path: 'lastMessage.senderId',
        select: 'name' // Populate tên người gửi của tin nhắn cuối cùng
    })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Lọc người dùng hiện tại khỏi mảng participants trong phản hồi
  // và tính toán số lượng chưa đọc (phần này có thể tốn kém về mặt tính toán)
  const chatPreviews = await Promise.all(chats.map(async (chat) => {
    const otherParticipant = chat.participants[0]; // Vì chúng ta đã lọc người dùng hiện tại
    const unreadCount = await ChatMessage.countDocuments({
        chatId: chat._id,
        senderId: { $ne: userId }, // Tin nhắn được gửi bởi người tham gia khác
        readBy: { $nin: [userId] } // Nơi người dùng hiện tại KHÔNG có trong mảng readBy
    });

    return {
        _id: chat._id,
        participant: otherParticipant,
        lastMessage: chat.lastMessage ? {
            text: chat.lastMessage.text,
            timestamp: chat.lastMessage.timestamp,
            senderName: chat.lastMessage.senderId ? chat.lastMessage.senderId.name : null,
            senderId: chat.lastMessage.senderId ? chat.lastMessage.senderId._id : null,
        } : null,
        unreadCount,
        updatedAt: chat.updatedAt,
    };
  }));

  const totalChats = await Chat.countDocuments({ participants: userId });

  res.json({
    chats: chatPreviews,
    page: pageNum,
    pages: Math.ceil(totalChats / limitNum),
    total: totalChats,
  });
});

// @desc    Tạo hoặc lấy một cuộc trò chuyện 1-1
// @route   POST /api/chats
// @access  Riêng tư
const createChat = asyncHandler(async (req, res) => {
  const { recipientId } = req.body;
  const senderId = req.user._id;

  if (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId)) {
    res.status(400);
    throw new Error('Invalid recipient ID');
  }

  if (senderId.equals(recipientId)) {
      res.status(400);
      throw new Error("Không thể tạo cuộc trò chuyện với chính mình");
  }

  // Kiểm tra xem người nhận có tồn tại không
  const recipientExists = await User.findById(recipientId);
  if (!recipientExists) {
      res.status(404);
      throw new Error("Recipient user not found");
  }

  // Kiểm tra xem cuộc trò chuyện đã tồn tại giữa hai người dùng này chưa
  let chat = await Chat.findOne({
    participants: { $all: [senderId, recipientId], $size: 2 }, // Chính xác hai người tham gia này
  }).populate('participants', 'name email avatarUrl');

  if (chat) {
    // Chat đã tồn tại, trả về nó
     // Lọc người dùng hiện tại cho phản hồi
     const otherParticipant = chat.participants.find(p => !p._id.equals(senderId));
     chat = chat.toObject(); // Chuyển đổi thành đối tượng thuần để sửa đổi
     chat.participant = otherParticipant;
     delete chat.participants;
    res.status(200).json(chat);
  } else {
    // Tạo chat mới
    const newChat = new Chat({
      participants: [senderId, recipientId],
    });
    const createdChat = await newChat.save();
    let populatedChat = await Chat.findById(createdChat._id)
        .populate('participants', 'name email avatarUrl');

    // Lọc người dùng hiện tại cho phản hồi
    const otherParticipant = populatedChat.participants.find(p => !p._id.equals(senderId));
    populatedChat = populatedChat.toObject();
    populatedChat.participant = otherParticipant;
    delete populatedChat.participants;

    res.status(201).json(populatedChat);
  }
});

// @desc    Lấy tin nhắn cho một cuộc trò chuyện cụ thể
// @route   GET /api/chats/:chatId/messages
// @access  Riêng tư
const getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;
  const { limit, before } = req.query; // `before` là messageId để phân trang

  // Xác thực chatId
   if (!mongoose.Types.ObjectId.isValid(chatId)) {
       res.status(400); throw new Error('Invalid chat ID');
   }

  // Kiểm tra xem người dùng có phải là thành viên của cuộc trò chuyện này không
  const chat = await Chat.findOne({ _id: chatId, participants: userId });
  if (!chat) {
    res.status(403);
    throw new Error('Not authorized to access this chat');
  }

  const query = { chatId };
  if (before && mongoose.Types.ObjectId.isValid(before)) {
      // Tìm các tin nhắn được tạo *trước* ID tin nhắn được chỉ định
      const anchorMessage = await ChatMessage.findById(before).select('timestamp');
      if(anchorMessage) {
          query.timestamp = { $lt: anchorMessage.timestamp };
      }
  }

  const limitNum = parseInt(limit, 10) || 30; // Mặc định 30 tin nhắn

  const messages = await ChatMessage.find(query)
    .populate('senderId', 'name avatarUrl') // Populate thông tin người gửi
    .sort({ timestamp: -1 }) // Lấy mới nhất trước (hoặc cũ nhất nếu cần, điều chỉnh FE)
    .limit(limitNum);

  // Đánh dấu các tin nhắn đã tìm nạp là đã đọc bởi người dùng hiện tại (chạy trong nền, không chờ đợi)
  const messageIds = messages.map(m => m._id);
  ChatMessage.updateMany(
    { _id: { $in: messageIds }, readBy: { $nin: [userId] } },
    { $addToSet: { readBy: userId } }
  ).exec(); // .exec() bắt đầu truy vấn mà không cần đợi nó

  res.json(messages.reverse()); // Đảo ngược để hiển thị cũ nhất trước trong lô (giao diện người dùng trò chuyện điển hình)
});

// @desc    Gửi tin nhắn trong một cuộc trò chuyện
// @route   POST /api/chats/:chatId/messages
// @access  Riêng tư
const sendChatMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { text } = req.body;
  const senderId = req.user._id;

   // Xác thực chatId
   if (!mongoose.Types.ObjectId.isValid(chatId)) {
       res.status(400); throw new Error('Invalid chat ID');
   }

  if (!text || text.trim() === '') {
    res.status(400);
    throw new Error('Message text cannot be empty');
  }

  // Kiểm tra xem người dùng có phải là thành viên của cuộc trò chuyện này không
  const chat = await Chat.findOne({ _id: chatId, participants: senderId });
  if (!chat) {
    res.status(403);
    throw new Error('Not authorized to send messages in this chat');
  }

  // Tạo tin nhắn
  const message = new ChatMessage({
    chatId,
    senderId,
    text: text.trim(),
    readBy: [senderId], // Người gửi rõ ràng đã đọc nó
  });

  const createdMessage = await message.save();

  // Cập nhật lastMessage và dấu thời gian updatedAt của cuộc trò chuyện
  chat.lastMessage = {
    messageId: createdMessage._id,
    senderId: senderId,
    text: createdMessage.text,
    timestamp: createdMessage.timestamp,
  };
  chat.updatedAt = Date.now();
  await chat.save();

  // Populate thông tin người gửi cho phản hồi
  const populatedMessage = await ChatMessage.findById(createdMessage._id)
        .populate('senderId', 'name avatarUrl');

  // Gửi thông báo cho (các) người tham gia khác
  const recipient = chat.participants.find(p => !p.equals(senderId));
  if (recipient) {
      createNotification(
          recipient,
          'message',
          `Tin nhắn mới từ ${req.user.name}`,
          populatedMessage.text,
          { entityType: 'chat', entityId: chat._id } // Có thể liên kết đến cuộc trò chuyện hoặc tin nhắn
      );
  }

  res.status(201).json(populatedMessage);
});

module.exports = {
  getChats,
  createChat,
  getChatMessages,
  sendChatMessage,
}; 