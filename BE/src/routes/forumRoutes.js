const express = require('express');
const {
  getForumPosts,
  createForumPost,
  getForumPostById,
  updateForumPost,
  deleteForumPost,
  toggleLikePost,
  getPostComments,
  createPostComment,
  deleteForumComment,
  getForumTags,
} = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Các route công khai (không yêu cầu xác thực)
router.get('/posts', getForumPosts); // Truyền middleware protect sau nếu cần
router.get('/posts/:postId', getForumPostById);
router.get('/posts/:postId/comments', getPostComments);
router.get('/tags', getForumTags);

// Các route riêng tư (yêu cầu xác thực)
router.post('/posts', protect, createForumPost);
router.put('/posts/:postId', protect, updateForumPost); // Kiểm tra tác giả bên trong controller
router.delete('/posts/:postId', protect, deleteForumPost); // Kiểm tra tác giả bên trong controller
router.post('/posts/:postId/like', protect, toggleLikePost);
router.post('/posts/:postId/comments', protect, createPostComment);
router.delete('/comments/:commentId', protect, deleteForumComment); // Kiểm tra tác giả bên trong controller

module.exports = router; 