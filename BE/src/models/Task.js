const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Tham chiếu đến model User
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project', // Tham chiếu đến model Project
      index: true,
      default: null, // Cho phép null rõ ràng nếu tác vụ không thuộc dự án nào
    },
    title: {
      type: String,
      required: [true, 'Vui lòng thêm tiêu đề tác vụ'],
      trim: true, // Xóa khoảng trắng ở đầu/cuối
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'], // Các giá trị được phép
      default: 'medium',
      index: true,
    },
    dueDate: {
      type: Date,
      index: true,
      default: null,
    },
  },
  {
    timestamps: true, // Tự động thêm các trường createdAt và updatedAt
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 