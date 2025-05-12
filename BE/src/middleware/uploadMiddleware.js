const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình lưu trữ Multer (Ví dụ: lưu vào bộ nhớ để xử lý thêm)
// Đối với môi trường production, bạn thường sẽ sử dụng multer-s3, multer-google-storage, v.v.
// hoặc xử lý luồng tải lên trực tiếp mà không cần lưu cục bộ.

// Tùy chọn: Lưu trữ Đĩa (Lưu file vào thư mục uploads trên server)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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
  storage: storage, // Sử dụng lưu trữ đĩa
  limits: {
    fileSize: 1024 * 1024 * 10 // Giới hạn kích thước tệp (ví dụ: 10MB)
  },
  fileFilter: fileFilter // Áp dụng bộ lọc tệp
});

module.exports = upload;