const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project'); // Cần thiết để kiểm tra tư cách thành viên dự án nếu lọc theo dự án

// @desc    Lấy tác vụ cho người dùng đã đăng nhập
// @route   GET /api/tasks
// @access  Riêng tư
const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { projectId, completed, priority, sortBy, sortOrder, page, limit } = req.query;

  const query = { userId };
  const sort = {};

  // Filtering
  if (projectId) {
    // Tùy chọn: Kiểm tra xem người dùng có phải là thành viên của dự án không trước khi cho phép lọc
    const project = await Project.findOne({ _id: projectId, memberIds: userId });
    if (!project) {
        res.status(403);
        throw new Error('Không được phép truy cập tác vụ cho dự án này');
    }
    query.projectId = projectId;
  }
  if (completed !== undefined) {
    query.completed = completed === 'true';
  }
  if (priority) {
    query.priority = priority;
  }

  // Sorting
  const sortField = sortBy || 'createdAt';
  const order = sortOrder === 'asc' ? 1 : -1;
  sort[sortField] = order;

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10; // Mặc định 10 tác vụ mỗi trang
  const skip = (pageNum - 1) * limitNum;

  const tasks = await Task.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .populate('projectId', 'name'); // Tùy chọn populate tên dự án

  const totalTasks = await Task.countDocuments(query);

  res.json({
    tasks,
    page: pageNum,
    pages: Math.ceil(totalTasks / limitNum),
    total: totalTasks,
  });
});

// @desc    Tạo một tác vụ mới
// @route   POST /api/tasks
// @access  Riêng tư
const createTask = asyncHandler(async (req, res) => {
  const { title, priority, dueDate, projectId } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Vui lòng thêm tiêu đề tác vụ');
  }

  // Tùy chọn: Nếu projectId được cung cấp, kiểm tra xem người dùng có phải là thành viên không
  if (projectId) {
    const project = await Project.findOne({ _id: projectId, memberIds: req.user._id });
    if (!project) {
        res.status(403);
        throw new Error('Không được phép thêm tác vụ vào dự án này');
    }
  }

  const task = new Task({
    userId: req.user._id,
    title,
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
    projectId: projectId || null, 
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

// @desc    Lấy một tác vụ theo ID
// @route   GET /api/tasks/:id
// @access  Riêng tư
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Kiểm tra xem tác vụ có thuộc về người dùng đã đăng nhập không
  if (task.userId.toString() !== req.user._id.toString()) {
    res.status(403); // Bị cấm
    throw new Error('Không được phép truy cập tác vụ này');
  }

  res.json(task);
});

// @desc    Cập nhật một tác vụ
// @route   PUT /api/tasks/:id
// @access  Riêng tư
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Kiểm tra xem tác vụ có thuộc về người dùng đã đăng nhập không
  if (task.userId.toString() !== req.user._id.toString()) {
    res.status(403); // Bị cấm
    throw new Error('Không được phép cập nhật tác vụ này');
  }

  // Cập nhật các trường
  task.title = req.body.title || task.title;
  task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate !== undefined ? (req.body.dueDate ? new Date(req.body.dueDate) : null) : task.dueDate;
  // Lưu ý: Việc cập nhật projectId có thể yêu cầu kiểm tra bổ sung

  const updatedTask = await task.save();
  res.json(updatedTask);
});

// @desc    Xóa một tác vụ
// @route   DELETE /api/tasks/:id
// @access  Riêng tư
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Kiểm tra xem tác vụ có thuộc về người dùng đã đăng nhập không
  if (task.userId.toString() !== req.user._id.toString()) {
    res.status(403); // Bị cấm
    throw new Error('Không được phép xóa tác vụ này');
  }

  await task.deleteOne(); // Sử dụng deleteOne() trong Mongoose v6+

  res.json({ message: 'Tác vụ đã được xóa thành công', id: req.params.id });
});

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
}; 