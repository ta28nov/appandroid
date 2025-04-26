const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Giả sử đường dẫn đến User model

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Kiểm tra token trong header Authorization (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token từ header (tách 'Bearer' và token)
      token = req.headers.authorization.split(' ')[1];

      // Xác minh token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy người dùng từ payload của token (id) và gắn vào đối tượng request
      // Loại trừ trường mật khẩu
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); // Chuyển sang middleware/route handler tiếp theo
    } catch (error) {
      console.error('Xác minh token thất bại:', error.message);
      res.status(401); // Không được phép
      throw new Error('Không được phép, token không hợp lệ');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Không được phép, không có token');
  }
});

// Tùy chọn: Middleware cho việc ủy quyền Admin (nếu cần sau này)
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) { // Giả sử User model có trường isAdmin
    next();
  } else {
    res.status(403); // Bị cấm
    throw new Error('Không được phép với tư cách quản trị viên');
  }
};

module.exports = { protect, admin }; 