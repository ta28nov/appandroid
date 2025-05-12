const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Tất cả các route tác vụ đều yêu cầu xác thực
router.use(protect);

router.route('/')
  .get(getTasks)
  .post([
    body('title').notEmpty().withMessage('Task title is required'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    body('dueDate').optional().isISO8601().toDate().withMessage('Due date must be a valid date'),
  ], createTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;