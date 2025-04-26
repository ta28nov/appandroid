const asyncHandler = require('express-async-handler');
const ForumPost = require('../models/ForumPost');
const ForumComment = require('../models/ForumComment');
const UserLikesPost = require('../models/UserLikesPost');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Helper function (same as in chatController)
const createNotification = async (recipientId, type, title, message, relatedEntity = null) => {
    try {
        await Notification.create({
            userId: recipientId,
            type,
            title,
            message,
            relatedEntity
        });
        console.log(`Thông báo đã tạo cho người dùng ${recipientId}: ${title}`);
    } catch (error) {
        console.error(`Không thể tạo thông báo cho người dùng ${recipientId}:`, error);
    }
};

// @desc    Lấy tất cả bài đăng diễn đàn với bộ lọc và phân trang
// @route   GET /api/forum/posts
// @access  Công khai (có thể đặt Riêng tư bằng cách thêm middleware protect)
const getForumPosts = asyncHandler(async (req, res) => {
  const { tag, sortBy, sortOrder, page, limit } = req.query;
  const userId = req.user?._id; // Lấy userId nếu người dùng đã đăng nhập

  const query = {};
  const sort = {};

  // Filtering
  if (tag) {
    query.tags = tag; // Tìm bài đăng chứa thẻ
  }

  // Sorting
  const sortField = sortBy || 'createdAt'; // Mặc định sắp xếp theo ngày tạo
  const order = sortOrder === 'asc' ? 1 : -1; // Mặc định giảm dần
  sort[sortField] = order;

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 15; 
  const skip = (pageNum - 1) * limitNum;

  let posts = await ForumPost.find(query)
    .populate('authorId', 'name avatarUrl') // Populate thông tin tác giả
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .lean(); // Sử dụng lean() để có hiệu suất tốt hơn, trả về các đối tượng JS thuần túy

  // Add isLiked field if user is logged in
  if (userId) {
    const postIds = posts.map(p => p._id);
    const userLikes = await UserLikesPost.find({
      userId: userId,
      postId: { $in: postIds },
    }).select('postId'); // Chỉ cần postId
    
    const likedPostIds = new Set(userLikes.map(like => like.postId.toString()));
    posts = posts.map(post => ({
      ...post,
      isLiked: likedPostIds.has(post._id.toString()),
    }));
  }

  const totalPosts = await ForumPost.countDocuments(query);

  res.json({
    posts,
    page: pageNum,
    pages: Math.ceil(totalPosts / limitNum),
    total: totalPosts,
  });
});

// @desc    Tạo một bài đăng diễn đàn mới
// @route   POST /api/forum/posts
// @access  Riêng tư
const createForumPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const post = new ForumPost({
    authorId: req.user._id,
    title,
    content,
    tags: tags || [], // Đảm bảo tags là một mảng
  });

  const createdPost = await post.save();
  await createdPost.populate('authorId', 'name avatarUrl'); // Populate tác giả cho phản hồi
  res.status(201).json(createdPost);
});

// @desc    Lấy một bài đăng diễn đàn theo ID
// @route   GET /api/forum/posts/:postId
// @access  Công khai
const getForumPostById = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user?._id; // Lấy userId nếu người dùng đã đăng nhập

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400); throw new Error('Invalid Post ID');
    }

    const post = await ForumPost.findById(postId)
        .populate('authorId', 'name avatarUrl')
        .lean(); // Sử dụng lean

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Add isLiked field if user is logged in
    if (userId) {
        const liked = await UserLikesPost.findOne({ userId, postId });
        post.isLiked = !!liked;
    }

    res.json(post);
});

// @desc    Cập nhật một bài đăng diễn đàn
// @route   PUT /api/forum/posts/:postId
// @access  Riêng tư (Chỉ tác giả)
const updateForumPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  const { title, content, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400); throw new Error('Invalid Post ID');
  }

  const post = await ForumPost.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Kiểm tra xem người dùng đã đăng nhập có phải là tác giả không
  if (post.authorId.toString() !== userId.toString()) {
    res.status(403); // Bị cấm
    throw new Error('Không được phép cập nhật bài đăng này');
  }

  post.title = title || post.title;
  post.content = content || post.content;
  if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : post.tags; // Chỉ cập nhật nếu được cung cấp và là một mảng
  }

  const updatedPost = await post.save();
  await updatedPost.populate('authorId', 'name avatarUrl');
  res.json(updatedPost);
});

// @desc    Xóa một bài đăng diễn đàn
// @route   DELETE /api/forum/posts/:postId
// @access  Riêng tư (Chỉ tác giả)
const deleteForumPost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400); throw new Error('Invalid Post ID');
    }

    const post = await ForumPost.findById(postId);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
  
    // Kiểm tra xem người dùng đã đăng nhập có phải là tác giả không (hoặc có thể là admin sau này)
    if (post.authorId.toString() !== userId.toString()) {
      res.status(403); // Bị cấm
      throw new Error('Không được phép xóa bài đăng này');
    }
  
    // TODO: Xem xét xóa giao dịch hoặc xử lý các lỗi tiềm ẩn
    // Xóa các bình luận liên quan
    await ForumComment.deleteMany({ postId: post._id });
    // Xóa các lượt thích liên quan
    await UserLikesPost.deleteMany({ postId: post._id });
    // Xóa chính bài đăng
    await post.deleteOne(); 
  
    res.json({ message: 'Bài đăng và dữ liệu liên quan đã được xóa thành công', id: postId });
  });

// @desc    Thích hoặc bỏ thích một bài đăng diễn đàn
// @route   POST /api/forum/posts/:postId/like
// @access  Riêng tư
const toggleLikePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400); throw new Error('Invalid Post ID');
    }

    const post = await ForumPost.findById(postId); // Đảm bảo bài đăng tồn tại
    if (!post) {
        res.status(404); throw new Error('Post not found');
    }

    const existingLike = await UserLikesPost.findOne({ userId, postId });

    let isLiked = false;
    let updateOperation;

    if (existingLike) {
        // Người dùng đã thích, vì vậy bỏ thích
        await existingLike.deleteOne();
        updateOperation = { $inc: { likesCount: -1 } };
        isLiked = false;
    } else {
        // Người dùng chưa thích, vì vậy thích
        await UserLikesPost.create({ userId, postId });
        updateOperation = { $inc: { likesCount: 1 } };
        isLiked = true;
        
        // TODO: Tùy chọn tạo thông báo cho tác giả bài đăng (chỉ khi không thích bài đăng của chính mình)
        // if (post.authorId.toString() !== userId.toString()) {
        //     createNotification(...);
        // }
    }

    // Cập nhật likesCount trên bài đăng
    const updatedPost = await ForumPost.findByIdAndUpdate(postId, updateOperation, { new: true });

    res.json({ 
        likesCount: updatedPost ? updatedPost.likesCount : post.likesCount, // Trả về số lượng đã cập nhật
        isLiked: isLiked 
    });
});

// @desc    Lấy bình luận cho một bài đăng diễn đàn
// @route   GET /api/forum/posts/:postId/comments
// @access  Công khai
const getPostComments = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { page, limit } = req.query;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400); throw new Error('Invalid Post ID');
  }

  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20; 
  const skip = (pageNum - 1) * limitNum;

  const query = { postId };

  const comments = await ForumComment.find(query)
    .populate('authorId', 'name avatarUrl') // Populate thông tin tác giả
    .sort({ createdAt: 1 }) // Hiển thị bình luận cũ nhất trước
    .skip(skip)
    .limit(limitNum);

  const totalComments = await ForumComment.countDocuments(query);

  res.json({
    comments,
    page: pageNum,
    pages: Math.ceil(totalComments / limitNum),
    total: totalComments,
  });
});

// @desc    Tạo một bình luận mới trên một bài đăng diễn đàn
// @route   POST /api/forum/posts/:postId/comments
// @access  Riêng tư
const createPostComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400); throw new Error('Invalid Post ID');
  }

  if (!content || content.trim() === '') {
    res.status(400);
    throw new Error('Comment content cannot be empty');
  }

  // Check if post exists
  const post = await ForumPost.findById(postId);
  if (!post) {
      res.status(404); throw new Error('Post not found');
  }

  const comment = new ForumComment({
    postId,
    authorId: userId,
    content: content.trim(),
  });

  const createdComment = await comment.save();

  // Tăng commentsCount trên bài đăng
  post.commentsCount += 1;
  await post.save();

  // Populate author for the response
  await createdComment.populate('authorId', 'name avatarUrl');
  
  // Tạo thông báo cho tác giả bài đăng (nếu không bình luận trên bài đăng của chính mình)
  if (post.authorId.toString() !== userId.toString()) {
    createNotification(
        post.authorId,
        'comment',
        `${req.user.name} đã bình luận về bài đăng của bạn`,
        `"${content.trim().substring(0, 50)}..." trong "${post.title.substring(0, 30)}..."`,
        { entityType: 'post', entityId: post._id } // Có thể liên kết đến bài đăng hoặc bình luận
    );
  }

  res.status(201).json(createdComment);
});

// @desc    Xóa một bình luận diễn đàn
// @route   DELETE /api/forum/comments/:commentId
// @access  Riêng tư (Chỉ tác giả hoặc Admin)
const deleteForumComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        res.status(400); throw new Error('Invalid Comment ID');
    }

    const comment = await ForumComment.findById(commentId);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Kiểm tra xem người dùng có phải là tác giả không (hoặc admin trong tương lai)
    if (comment.authorId.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('Không được phép xóa bình luận này');
    }

    // Giảm commentsCount trên bài đăng
    await ForumPost.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });

    // Xóa bình luận
    await comment.deleteOne();

    res.json({ message: 'Bình luận đã được xóa thành công', id: commentId });
});

// @desc    Lấy các thẻ diễn đàn duy nhất
// @route   GET /api/forum/tags
// @access  Công khai
const getForumTags = asyncHandler(async (req, res) => {
    // Sử dụng distinct để lấy trực tiếp các thẻ duy nhất từ cơ sở dữ liệu
    const tags = await ForumPost.distinct('tags');
    res.json(tags.sort()); // Trả về các thẻ đã sắp xếp
});

module.exports = {
  getForumPosts,
  createForumPost,
  getForumPostById,
  updateForumPost,
  deleteForumPost,
  toggleLikePost,
  getPostComments,
  createPostComment,
  deleteForumComment,
  getForumTags,
}; 