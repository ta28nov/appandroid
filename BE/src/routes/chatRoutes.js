const express = require('express');
const {
  getChats,
  createChat,
  getChatMessages,
  sendChatMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Tất cả các route chat đều yêu cầu xác thực

router.route('/').get(getChats).post(createChat);
router.route('/:chatId/messages').get(getChatMessages).post(sendChatMessage);

// Tương lai: Thêm các route để đánh dấu tin nhắn là đã đọc một cách rõ ràng nếu cần
// router.put('/:chatId/messages/:messageId/read', markMessageAsRead);

module.exports = router; 