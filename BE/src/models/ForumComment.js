const mongoose = require('mongoose');

const forumCommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ForumPost',
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Vui lòng thêm nội dung bình luận'],
      trim: true,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
      // Tùy chọn: nếu bình luận có thể được thích
    },
  },
  {
    timestamps: true,
  }
);

// Chỉ mục để tìm nạp bình luận cho một bài đăng, được sắp xếp theo thứ tự thời gian
forumCommentSchema.index({ postId: 1, createdAt: 1 });

const ForumComment = mongoose.model('ForumComment', forumCommentSchema);

module.exports = ForumComment; 