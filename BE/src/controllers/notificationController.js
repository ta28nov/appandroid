const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Gửi notification real-time qua Socket.IO nếu có
function emitNotificationToUser(req, notification) {
  try {
    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');
    const socketId = userSocketMap.get(notification.userId.toString());
    if (io && socketId) {
      io.to(socketId).emit('notification', notification);
    }
  } catch (err) {
    // Không log lỗi nhỏ ở production
  }
}

const createNotificationAndEmit = async (req, notificationData) => {
  const notification = await Notification.create(notificationData);
  emitNotificationToUser(req, notification.toObject());
  return notification;
};

// @desc    Lấy thông báo cho người dùng đã đăng nhập
// @route   GET /api/notifications
// @access  Riêng tư
const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { read, type, page, limit } = req.query;

    const query = { userId };
    const sort = { createdAt: -1 }; // Luôn sắp xếp mới nhất trước

    // Lọc
    if (read !== undefined) {
        query.read = read === 'true';
    }
    if (type) {
        query.type = type;
    }

    // Phân trang
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const notifications = await Notification.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        // Tùy chọn populate chi tiết relatedEntity nếu cần, nhưng có thể phức tạp
        // .populate('relatedEntity.entityId') // Điều này cần xử lý cẩn thận dựa trên entityType
        .lean();

    const totalNotifications = await Notification.countDocuments(query);
    // Cũng lấy số lượng chưa đọc riêng biệt để hiển thị huy hiệu, v.v.
    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.json({
        notifications,
        page: pageNum,
        pages: Math.ceil(totalNotifications / limitNum),
        total: totalNotifications,
        unreadCount: unreadCount
    });
});

// @desc    Đánh dấu các thông báo cụ thể là đã đọc
// @route   POST /api/notifications/read
// @access  Riêng tư
const markNotificationsAsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { notificationIds } = req.body; // Mong đợi một mảng các ID

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
        res.status(400);
        throw new Error('Vui lòng cung cấp một mảng các ID thông báo');
    }

    // Xác thực ObjectIds
    const validIds = notificationIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
        res.status(400);
        throw new Error('Không có ID thông báo hợp lệ nào được cung cấp');
    }

    const result = await Notification.updateMany(
        { _id: { $in: validIds }, userId: userId, read: false }, // Nhắm mục tiêu các thông báo cụ thể, chưa đọc của người dùng
        { $set: { read: true } }
    );

    res.json({ 
        message: `${result.modifiedCount} thông báo đã được đánh dấu là đã đọc.`, 
        modifiedCount: result.modifiedCount 
    });
});

// @desc    Đánh dấu tất cả thông báo là đã đọc cho người dùng
// @route   POST /api/notifications/read-all
// @access  Riêng tư
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const result = await Notification.updateMany(
        { userId: userId, read: false },
        { $set: { read: true } }
    );

    res.json({ 
        message: `Tất cả thông báo chưa đọc (${result.modifiedCount}) đã được đánh dấu là đã đọc.`, 
        modifiedCount: result.modifiedCount 
    });
});

// @desc    Xóa (delete) tất cả thông báo cho người dùng
// @route   DELETE /api/notifications
// @access  Riêng tư
const clearAllNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const result = await Notification.deleteMany({ userId: userId });

    res.json({ 
        message: `Tất cả thông báo (${result.deletedCount}) đã được xóa.`, 
        deletedCount: result.deletedCount 
    });
});

// @desc    Xóa một thông báo cụ thể
// @route   DELETE /api/notifications/:id
// @access  Riêng tư
const deleteNotification = asyncHandler(async (req, res) => {
    const notificationId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        res.status(400); throw new Error('Invalid Notification ID');
    }

    const notification = await Notification.findOne({
        _id: notificationId,
        userId: userId // Đảm bảo thông báo thuộc về người dùng
    });

    if (!notification) {
        res.status(404);
        throw new Error('Không tìm thấy thông báo hoặc bạn không được phép');
    }

    await notification.deleteOne();

    res.json({ message: 'Thông báo đã được xóa thành công', id: notificationId });
});


module.exports = {
    getNotifications,
    markNotificationsAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    deleteNotification,
    createNotificationAndEmit,
};