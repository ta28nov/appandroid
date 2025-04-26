const mongoose = require('mongoose');

// Schema để theo dõi người dùng nào đã yêu thích tài liệu nào
const userFavoritesDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Document',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Chỉ theo dõi thời gian tạo
  }
);

// Chỉ mục phức hợp để đảm bảo người dùng chỉ có thể yêu thích một tài liệu một lần
// Cũng hữu ích cho việc truy vấn các mục yêu thích theo userId hoặc documentId
userFavoritesDocumentSchema.index({ userId: 1, documentId: 1 }, { unique: true });
userFavoritesDocumentSchema.index({ documentId: 1 }); // Chỉ mục để tìm tất cả các mục yêu thích cho một tài liệu

const UserFavoritesDocument = mongoose.model(
  'UserFavoritesDocument',
  userFavoritesDocumentSchema
);

module.exports = UserFavoritesDocument; 