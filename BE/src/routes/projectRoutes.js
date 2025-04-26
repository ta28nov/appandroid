const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController'); // Điều chỉnh đường dẫn nếu cần
const { protect } = require('../middleware/authMiddleware'); // Điều chỉnh đường dẫn nếu cần

// Áp dụng middleware protect cho tất cả các route dự án
router.use(protect);

// Các route cho /api/projects
router.route('/')
  .get(getProjects)    // GET /api/projects - Lấy các dự án của người dùng
  .post(createProject); // POST /api/projects - Tạo một dự án mới

// Các route cho /api/projects/:id
router.route('/:id')
  .get(getProjectById)    // GET /api/projects/:id - Lấy một dự án cụ thể
  .put(updateProject)     // PUT /api/projects/:id - Cập nhật một dự án cụ thể
  .delete(deleteProject); // DELETE /api/projects/:id - Xóa một dự án cụ thể

module.exports = router; 