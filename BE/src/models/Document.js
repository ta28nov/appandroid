const mongoose = require('mongoose');

const sharedWithSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  permission: {
    type: String,
    enum: ['read', 'edit'],
    required: true,
    default: 'read',
  },
}, { _id: false });

const documentSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Vui lòng thêm tiêu đề tài liệu'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: [true, 'Vui lòng chỉ định loại tài liệu (ví dụ: pdf, docx)'],
      lowercase: true, // Lưu trữ loại bằng chữ thường
      trim: true,
      index: true,
    },
    sizeBytes: {
      type: Number,
      min: 0,
    },
    storageUrl: {
      type: String,
      // Lý tưởng nhất là thêm xác thực cho định dạng URL
    },
    originalFilename: {
      type: String,
      default: null,
    },
    mimeType: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      index: true,
      default: [],
      // Xem xét chuyển đổi thẻ thành chữ thường khi lưu
    },
    sharedWith: {
      type: [sharedWithSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ createdAt: -1 });
documentSchema.index({ updatedAt: -1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ "sharedWith.userId": 1 });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document; 