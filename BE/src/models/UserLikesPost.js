const mongoose = require('mongoose');

// Schema để theo dõi người dùng nào đã thích bài đăng nào
const userLikesPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ForumPost',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Chỉ theo dõi thời gian tạo
    collection: 'userLikesPost'
  }
);

// Chỉ mục phức hợp để đảm bảo người dùng chỉ có thể thích một bài đăng một lần
// Cũng hữu ích cho việc truy vấn lượt thích theo userId hoặc postId
userLikesPostSchema.index({ userId: 1, postId: 1 }, { unique: true });
userLikesPostSchema.index({ postId: 1 }); // Chỉ mục để tìm tất cả lượt thích cho một bài đăng

const UserLikesPost = mongoose.model('UserLikesPost', userLikesPostSchema);

module.exports = UserLikesPost; 