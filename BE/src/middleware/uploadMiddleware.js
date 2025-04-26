const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ Multer (Ví dụ: lưu vào bộ nhớ để xử lý thêm)
// Đối với môi trường production, bạn thường sẽ sử dụng multer-s3, multer-google-storage, v.v.
// hoặc xử lý luồng tải lên trực tiếp mà không cần lưu cục bộ.

// Tùy chọn 1: Lưu trữ Bộ nhớ (Tốt để truyền bộ đệm cho các hàm tải lên đám mây)
const storage = multer.memoryStorage();

// Tùy chọn 2: Lưu trữ Đĩa (Ví dụ - nếu bạn cần lưu trữ tạm thời cục bộ)
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // QUAN TRỌNG: Tạo thư mục './uploads/' trong thư mục gốc BE hoặc điều chỉnh đường dẫn
    cb(null, './uploads/'); // Các tệp sẽ được lưu ở đây
  },
  filename: function (req, file, cb) {
    // Tạo tên tệp duy nhất để tránh xung đột
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
*/

// Hàm lọc tệp (tùy chọn - ví dụ: chỉ cho phép các loại tài liệu/hình ảnh phổ biến)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Loại tệp không được phép: ' + file.mimetype), false);
};

// Cấu hình Multer
const upload = multer({
  storage: storage, // Sử dụng lưu trữ bộ nhớ hoặc lưu trữ đĩa
  limits: {
    fileSize: 1024 * 1024 * 10 // Giới hạn kích thước tệp (ví dụ: 10MB)
  },
  fileFilter: fileFilter // Áp dụng bộ lọc tệp
});

module.exports = upload; 