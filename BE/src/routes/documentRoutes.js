const express = require('express');
const {
  getDocuments,
  uploadDocument,
  getDocumentById,
  downloadDocument, // Chỗ giữ chỗ - có thể trả về URL hoặc luồng
  updateDocument,
  deleteDocument,
  shareDocument,
  toggleFavoriteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Middleware để xử lý việc tải lên tệp

const router = express.Router();

router.use(protect); // Tất cả các route tài liệu đều yêu cầu xác thực

router.route('/')
    .get(getDocuments)
    .post(upload.single('file'), uploadDocument); // Sử dụng middleware multer cho việc tải lên một tệp duy nhất có tên là 'file'

router.route('/:id')
    .get(getDocumentById)
    .put(updateDocument)    // Kiểm tra chủ sở hữu bên trong controller
    .delete(deleteDocument); // Kiểm tra chủ sở hữu bên trong controller

router.get('/:id/download', downloadDocument); // Kiểm tra quyền truy cập bên trong controller
router.post('/:id/share', shareDocument);       // Kiểm tra chủ sở hữu bên trong controller
router.post('/:id/favorite', toggleFavoriteDocument);

module.exports = router; 