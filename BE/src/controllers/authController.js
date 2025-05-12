const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); // Chúng ta cần tạo tiện ích này
const logger = require('../utils/logger');

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Công khai
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Kiểm tra xem người dùng đã tồn tại chưa
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Tạo người dùng (việc băm mật khẩu được xử lý bởi middleware của mongoose)
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Không gửi lại mật khẩu, kể cả hash
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      data: {
        ...userResponse,
        token: generateToken(user._id),
      }
    });

    logger.info(`User registered: ${email}`);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Xác thực người dùng
// @route   POST /api/auth/login
// @access  Công khai
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Tìm người dùng theo email, chọn rõ ràng mật khẩu (mặc định bị loại trừ)
  const user = await User.findOne({ email }).select('+password');

  // Kiểm tra người dùng tồn tại và mật khẩu khớp
  if (user && (await user.matchPassword(password))) {
    const userResponse = user.toObject();
    delete userResponse.password; // Xóa hash mật khẩu trước khi gửi

    res.json({
      data: {
        ...userResponse,
        token: generateToken(user._id),
      }
    });

    logger.info(`User login: ${email}`);
  } else {
    res.status(401); // Không được phép
    throw new Error('Invalid email or password');
  }
});

// @desc    Lấy thông tin hồ sơ người dùng hiện tại
// @route   GET /api/auth/me
// @access  Riêng tư (yêu cầu token)
const getMe = asyncHandler(async (req, res) => {
  // Người dùng được gắn vào đối tượng req bởi middleware `protect`
  if (req.user) {
    res.json({ data: req.user }); // Đáp ứng frontend: trả về user trong trường data
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};