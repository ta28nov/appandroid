const express = require('express');
// Import toàn bộ đối tượng controller
const userController = require('../controllers/userController'); 
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Tất cả các route người dùng đều yêu cầu xác thực
router.use(protect);

// Truy cập các phương thức thông qua đối tượng controller
router.route('/me')
  .get(userController.getCurrentUserProfile)
  .put(userController.updateCurrentUserProfile);

router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserProfileById);

module.exports = router; 