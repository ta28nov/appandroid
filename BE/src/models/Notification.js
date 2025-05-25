const mongoose = require('mongoose');

const relatedEntitySchema = new mongoose.Schema({
  entityType: {
    type: String,
    required: true,
    enum: ['task', 'project', 'post', 'comment', 'document', 'user', 'message', 'chat'],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Lưu ý: Không có 'ref' trực tiếp ở đây vì entityType xác định model được tham chiếu
  },
}, { _id: false });

const notificationSchema = new mongoose.Schema(
  {
    userId: { // Người dùng nhận thông báo
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['reminder', 'comment', 'task', 'document', 'message', 'mention', 'project', 'share'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Vui lòng thêm tiêu đề thông báo'],
    },
    message: {
      type: String,
      required: [true, 'Vui lòng thêm nội dung thông báo'],
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedEntity: {
      type: relatedEntitySchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Chỉ mục cho truy vấn chính: tìm nạp thông báo cho người dùng, tùy chọn lọc theo trạng thái đọc, sắp xếp theo ngày
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 }); // Chỉ mục để sắp xếp chung theo ngày tạo

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 