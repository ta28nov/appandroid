const express = require('express');
const {
  getNotifications,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Tất cả các route thông báo đều yêu cầu xác thực

router.route('/').get(getNotifications).delete(clearAllNotifications);
router.post('/read', markNotificationsAsRead);
router.post('/read-all', markAllNotificationsAsRead);
router.delete('/:id', deleteNotification);

module.exports = router; 