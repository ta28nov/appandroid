const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Vui lòng thêm tiêu đề bài đăng'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Vui lòng thêm nội dung bài đăng'],
    },
    tags: {
      type: [String],
      index: true,
      default: [],
      // Tùy chọn: thêm xác thực cho thẻ nếu cần (ví dụ: chữ thường, không có dấu cách)
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, 
    collection: 'forumPosts'
  }
);

forumPostSchema.index({ createdAt: -1 }); // Chỉ mục để sắp xếp bài đăng theo ngày tạo

// Virtual để populate lượt thích (tùy chọn, thay thế cho truy vấn UserLikesPost riêng biệt)
// forumPostSchema.virtual('likes', {
//   ref: 'UserLikesPost',
//   localField: '_id',
//   foreignField: 'postId',
//   count: true // Chỉ lấy số lượng
// });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = ForumPost; 