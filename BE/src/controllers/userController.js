console.log('--- Loading userController.js ---'); // Log khi file bắt đầu chạy
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

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
    user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
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

// Log ngay trước khi export
console.log('--- userController.js: Defining exports ---');
console.log('typeof getCurrentUserProfile:', typeof getCurrentUserProfile); 
console.log('typeof updateCurrentUserProfile:', typeof updateCurrentUserProfile);
console.log('typeof searchUsers:', typeof searchUsers);
console.log('typeof getUserProfileById:', typeof getUserProfileById);

module.exports = {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  searchUsers,
  getUserProfileById,
}; 