console.log('--- Loading userController.js ---'); // Log khi file bắt đầu chạy
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const DEFAULT_AVATAR_URL = "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80";

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  // req.user is available from the protect middleware
  console.log('Executing getCurrentUserProfile'); // Thêm log trong hàm
  res.json(req.user);
});

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  console.log('Executing updateCurrentUserProfile'); // Thêm log trong hàm
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    // Nếu client gửi avatarUrl rỗng/null hoặc không gửi, set avatar mặc định
    if (req.body.avatarUrl === undefined || req.body.avatarUrl === null || req.body.avatarUrl === "") {
      user.avatarUrl = DEFAULT_AVATAR_URL;
    } else {
      user.avatarUrl = req.body.avatarUrl;
    }
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio; // Allow empty bio

    // Handle privacy settings update carefully
    if (req.body.privacySettings) {
      user.privacySettings.showEmail = req.body.privacySettings.showEmail !== undefined
        ? req.body.privacySettings.showEmail
        : user.privacySettings.showEmail;
      user.privacySettings.showActivityStatus = req.body.privacySettings.showActivityStatus !== undefined
        ? req.body.privacySettings.showActivityStatus
        : user.privacySettings.showActivityStatus;
    }

    // Note: Password updates should ideally be handled in a separate route/controller
    // if (req.body.password) {
    //   user.password = req.body.password; 
    // }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
      bio: updatedUser.bio,
      privacySettings: updatedUser.privacySettings,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Search users by name or email
// @route   GET /api/users/search?q=<query>
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
  console.log('Executing searchUsers'); // Thêm log trong hàm
  const query = req.query.q ? req.query.q : '';
  const limit = parseInt(req.query.limit) || 10; // Default limit 10

  if (!query) {
    return res.json([]);
  }

  // Case-insensitive search for name or email, exclude current user
  const users = await User.find({
    _id: { $ne: req.user._id }, // Exclude self
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
  })
  .limit(limit)
  .select('name email avatarUrl'); // Select only necessary fields

  res.json(users);
});

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private 
const getUserProfileById = asyncHandler(async (req, res) => {
  console.log('Executing getUserProfileById'); // Thêm log trong hàm
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Basic privacy check (can be enhanced)
  const canShowEmail = user.privacySettings?.showEmail || req.user._id.equals(user._id);

  res.json({
    _id: user._id,
    name: user.name,
    email: canShowEmail ? user.email : null,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    // Add other public fields as needed
    createdAt: user.createdAt,
  });
});

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Công khai
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, avatarUrl } = req.body;

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

  // Nếu không truyền avatarUrl thì set mặc định
  const finalAvatarUrl = (avatarUrl === undefined || avatarUrl === null || avatarUrl === "") ? DEFAULT_AVATAR_URL : avatarUrl;

  // Tạo người dùng (việc băm mật khẩu được xử lý bởi middleware của mongoose)
  const user = await User.create({
    name,
    email,
    password,
    avatarUrl: finalAvatarUrl,
  });

  if (user) {
    // Không gửi lại mật khẩu, kể cả hash
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      data: {
        ...userResponse,
        token: require('../utils/generateToken')(user._id),
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Log ngay trước khi export
console.log('--- userController.js: Defining exports ---');
console.log('typeof getCurrentUserProfile:', typeof getCurrentUserProfile); 
console.log('typeof updateCurrentUserProfile:', typeof updateCurrentUserProfile);
console.log('typeof searchUsers:', typeof searchUsers);
console.log('typeof getUserProfileById:', typeof getUserProfileById);
console.log('typeof registerUser:', typeof registerUser);

module.exports = {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  searchUsers,
  getUserProfileById,
  registerUser,
};