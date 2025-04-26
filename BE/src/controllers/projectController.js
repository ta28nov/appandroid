const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

// Hàm trợ giúp middleware để kiểm tra tư cách thành viên dự án
const checkProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Dự án không tồn tại');
  }
  // Kiểm tra xem ID người dùng có trong mảng memberIds không
  if (!project.memberIds.map(id => id.toString()).includes(userId.toString())) {
    throw new Error('Không được phép cho dự án này');
  }
  return project;
};

// Hàm trợ giúp middleware để kiểm tra quyền sở hữu dự án
const checkProjectOwner = async (projectId, userId) => {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Dự án không tồn tại');
    }
    if (project.ownerId.toString() !== userId.toString()) {
      throw new Error('Chỉ chủ sở hữu dự án mới có thể thực hiện hành động này');
    }
    return project;
  };

// @desc    Lấy dự án cho người dùng đã đăng nhập
// @route   GET /api/projects
// @access  Riêng tư
const getProjects = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, sortBy, sortOrder, page, limit } = req.query;

  const query = { memberIds: userId }; // Tìm dự án mà người dùng là thành viên
  const sort = {};

  // Lọc
  if (status && ['active', 'archived'].includes(status)) {
    query.status = status;
  }

  // Sắp xếp
  const sortField = sortBy || 'name';
  const order = sortOrder === 'desc' ? -1 : 1;
  sort[sortField] = order;

  // Phân trang
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10; 
  const skip = (pageNum - 1) * limitNum;

  const projects = await Project.find(query)
    .populate('ownerId', 'name email avatarUrl') // Populate thông tin chủ sở hữu
    // .populate('memberIds', 'name email avatarUrl') // Tùy chọn populate tất cả thành viên
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const totalProjects = await Project.countDocuments(query);

  res.json({
    projects,
    page: pageNum,
    pages: Math.ceil(totalProjects / limitNum),
    total: totalProjects,
  });
});

// @desc    Tạo một dự án mới
// @route   POST /api/projects
// @access  Riêng tư
const createProject = asyncHandler(async (req, res) => {
  const { name, description, memberIds } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Vui lòng cung cấp tên dự án');
  }

  // Chuẩn bị danh sách thành viên, luôn bao gồm người tạo
  let finalMemberIds = [req.user._id];
  if (memberIds && Array.isArray(memberIds)) {
    // Thêm các ObjectId hợp lệ, duy nhất, loại trừ chủ sở hữu (đã được thêm)
    const uniqueMembers = memberIds
      .filter(id => mongoose.Types.ObjectId.isValid(id) && id.toString() !== req.user._id.toString())
      .map(id => new mongoose.Types.ObjectId(id));
    finalMemberIds = [...new Set([...finalMemberIds, ...uniqueMembers].map(id => id.toString()))].map(id => new mongoose.Types.ObjectId(id));
  }
  
  // Xác thực xem memberIds được cung cấp có thực sự tồn tại dưới dạng người dùng hay không (tùy chọn nhưng được khuyến nghị)
  if (finalMemberIds.length > 1) {
      const membersExist = await User.countDocuments({ _id: { $in: finalMemberIds } });
      if (membersExist !== finalMemberIds.length) {
          console.warn("Đã cố gắng thêm người dùng không tồn tại vào dự án");
          // Quyết định cách xử lý: báo lỗi hay tiếp tục với người dùng hợp lệ?
          // Hiện tại, hãy tiếp tục với những người dùng hợp lệ được tìm thấy ngầm bởi tham chiếu mongoose sau này
      }
  }

  const project = new Project({
    name,
    description,
    ownerId: req.user._id,
    memberIds: finalMemberIds, 
  });

  const createdProject = await project.save();
  // Populate thông tin chủ sở hữu cho phản hồi
  const populatedProject = await Project.findById(createdProject._id).populate('ownerId', 'name email avatarUrl');
  res.status(201).json(populatedProject);
});

// @desc    Lấy một dự án theo ID
// @route   GET /api/projects/:id
// @access  Riêng tư
const getProjectById = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;

  try {
    // Kiểm tra tư cách thành viên bằng hàm trợ giúp
    const project = await checkProjectMember(projectId, userId);
    // Populate chủ sở hữu và thành viên cho chế độ xem chi tiết
    await project.populate([
        { path: 'ownerId', select: 'name email avatarUrl' },
        { path: 'memberIds', select: 'name email avatarUrl' }
    ]);
    res.json(project);
  } catch (error) {
    res.status(error.message.includes('Not authorized') ? 403 : 404);
    throw error;
  }
});

// @desc    Cập nhật một dự án
// @route   PUT /api/projects/:id
// @access  Riêng tư (Chỉ chủ sở hữu)
const updateProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user._id;
  const { name, description, status } = req.body;

  try {
    // Kiểm tra quyền sở hữu bằng hàm trợ giúp
    const project = await checkProjectOwner(projectId, userId);

    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    if (status && ['active', 'archived'].includes(status)) {
        project.status = status;
    }

    const updatedProject = await project.save();
    await updatedProject.populate('ownerId', 'name email avatarUrl'); // Populate chủ sở hữu cho phản hồi
    res.json(updatedProject);
  } catch (error) {
    res.status(error.message.includes('Only the project owner') ? 403 : 404);
    throw error;
  }
});

// @desc    Xóa một dự án
// @route   DELETE /api/projects/:id
// @access  Riêng tư (Chỉ chủ sở hữu)
const deleteProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user._id;

    try {
      // Kiểm tra quyền sở hữu bằng hàm trợ giúp
      const project = await checkProjectOwner(projectId, userId);
  
      // TODO: Xem xét phải làm gì với các tác vụ và tài liệu liên quan.
      // Tùy chọn 1: Xóa chúng (có thể nguy hiểm)
      // Tùy chọn 2: Hủy liên kết chúng (đặt projectId thành null)
      // Tùy chọn 3: Ngăn chặn xóa nếu tồn tại các phụ thuộc
  
      // Ví dụ: Hủy liên kết tác vụ
      // await Task.updateMany({ projectId: project._id }, { $set: { projectId: null } });
      // Ví dụ: Xóa tài liệu (nếu cần, xử lý cả việc xóa tệp khỏi bộ nhớ)
      // const documents = await Document.find({ projectId: project._id });
      // for (const doc of documents) { /* xóa tệp khỏi bộ nhớ */ }
      // await Document.deleteMany({ projectId: project._id });
  
      await project.deleteOne();
  
      res.json({ message: 'Dự án đã được xóa thành công', id: projectId });
    } catch (error) {
      res.status(error.message.includes('Only the project owner') ? 403 : 404);
      throw error;
    }
  });

// @desc    Add a member to a project
// @route   POST /api/projects/:id/members
// @access  Private (Owner only - simplified, could allow members too)
const addProjectMember = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const ownerId = req.user._id;
    const { userId } = req.body; // ID of the user to add

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400);
        throw new Error('Invalid user ID provided');
    }

    try {
        // Check ownership (only owner can add members in this implementation)
        const project = await checkProjectOwner(projectId, ownerId);

        const memberObjectId = new mongoose.Types.ObjectId(userId);

        // Check if user to add exists
        const memberExists = await User.findById(memberObjectId);
        if (!memberExists) {
            res.status(404);
            throw new Error('User to add not found');
        }

        // Check if already a member
        if (project.memberIds.map(id => id.toString()).includes(memberObjectId.toString())) {
            res.status(400);
            throw new Error('User is already a member of this project');
        }

        project.memberIds.push(memberObjectId);
        await project.save();
        
        // TODO: Create notification for the added user

        await project.populate([
            { path: 'ownerId', select: 'name email avatarUrl' },
            { path: 'memberIds', select: 'name email avatarUrl' }
        ]);
        res.json(project);

    } catch (error) {
        res.status(error.message.includes('Only the project owner') ? 403 : (error.message.includes('not found') ? 404 : 400));
        throw error;
    }
});

// @desc    Remove a member from a project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Owner only)
const removeProjectMember = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const memberToRemoveId = req.params.userId;
    const ownerId = req.user._id;

    if (!memberToRemoveId || !mongoose.Types.ObjectId.isValid(memberToRemoveId)) {
        res.status(400);
        throw new Error('Invalid member ID provided');
    }

    const memberToRemoveObjectId = new mongoose.Types.ObjectId(memberToRemoveId);

    try {
        // Check ownership
        const project = await checkProjectOwner(projectId, ownerId);

        // Prevent owner from removing themselves (they should delete the project instead)
        if (project.ownerId.equals(memberToRemoveObjectId)) {
            res.status(400);
            throw new Error('Cannot remove the project owner');
        }

        // Check if the user to remove is actually a member
        const initialLength = project.memberIds.length;
        project.memberIds = project.memberIds.filter(id => !id.equals(memberToRemoveObjectId));

        if (project.memberIds.length === initialLength) {
            res.status(404);
            throw new Error('User is not a member of this project');
        }

        await project.save();
        
        // TODO: Create notification for the removed user?

        await project.populate([
            { path: 'ownerId', select: 'name email avatarUrl' },
            { path: 'memberIds', select: 'name email avatarUrl' }
        ]);
        res.json(project);

    } catch (error) {
         res.status(error.message.includes('Only the project owner') ? 403 : (error.message.includes('not found') ? 404 : 400));
        throw error;
    }
});

// @desc    Get tasks for a specific project
// @route   GET /api/projects/:id/tasks
// @access  Private (Project members only)
const getProjectTasks = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user._id;
    const { completed, priority, sortBy, sortOrder, page, limit } = req.query;

    try {
        // Check membership using helper
        await checkProjectMember(projectId, userId);

        // Reuse the task fetching logic, but force the projectId filter
        const query = { projectId };
        const sort = {};
        
        if (completed !== undefined) {
            query.completed = completed === 'true';
        }
        if (priority) {
            query.priority = priority;
        }

        const sortField = sortBy || 'createdAt';
        const order = sortOrder === 'asc' ? 1 : -1;
        sort[sortField] = order;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const tasks = await Task.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);
            // Optionally populate assigned user if needed: .populate('userId', 'name avatarUrl');

        const totalTasks = await Task.countDocuments(query);

        res.json({
            tasks,
            page: pageNum,
            pages: Math.ceil(totalTasks / limitNum),
            total: totalTasks,
        });

    } catch (error) {
        res.status(error.message.includes('Not authorized') ? 403 : 404);
        throw error;
    }
});

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProjectTasks,
}; 