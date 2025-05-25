const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');
const UserFavoritesDocument = require('../models/UserFavoritesDocument');
const Notification = require('../models/Notification');
const Project = require('../models/Project'); // Cần thiết cho việc xác thực projectId
const User = require('../models/User'); // Import trực tiếp User model
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// --- Lưu file vật lý, trả về URL tĩnh ---
const uploadFileToCloud = async (filePath, filename) => {
  // Trả về đường dẫn URL tĩnh cho FE
  return `/uploads/${path.basename(filePath)}`;
};
const deleteFileFromCloud = async (storageUrl) => {
  // Xóa file vật lý khỏi uploads
  try {
    const filePath = path.join(__dirname, '../../', storageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return true;
  } catch (err) {
    console.error('Lỗi xóa file vật lý:', err);
    return false;
  }
};
const getPresignedUrl = async (storageUrl) => {
  // Trả về URL tĩnh (không cần ký)
  return storageUrl;
};

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

// Helper to check document access permission
const checkDocumentAccess = async (documentId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
        throw { status: 400, message: 'Invalid Document ID' };
    }
    const doc = await Document.findById(documentId);
    if (!doc) {
        throw { status: 404, message: 'Document not found' };
    }
    const isOwner = doc.createdBy.equals(userId);
    const canRead = doc.sharedWith.some(share => share.userId.equals(userId) && ['read', 'edit'].includes(share.permission));
    const canEdit = doc.sharedWith.some(share => share.userId.equals(userId) && share.permission === 'edit');

    if (!isOwner && !canRead && !canEdit) {
        throw { status: 403, message: 'Not authorized to access this document' };
    }
    return { doc, isOwner, canEdit };
};

// @desc    Lấy các tài liệu có thể truy cập cho người dùng
// @route   GET /api/documents
// @access  Riêng tư
const getDocuments = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { projectId, type, tag, shared, favorites, q, sortBy, sortOrder, page, limit } = req.query;

    const query = {
        $or: [
            { createdBy: userId }, // Người dùng đã tạo tài liệu
            { 'sharedWith.userId': userId } // Tài liệu được chia sẻ với người dùng
        ]
    };
    const sort = {};

    // Lọc
    if (projectId) query.projectId = projectId;
    if (type) query.type = type.toLowerCase();
    if (tag) query.tags = tag;
    if (shared === 'true') query['sharedWith.0'] = { $exists: true }; // Kiểm tra xem sharedWith có trống không
    if (q) {
        const regex = new RegExp(q, 'i'); // Tìm kiếm không phân biệt chữ hoa chữ thường
        query.$and = query.$and || [];
        query.$and.push({ $or: [{ title: regex }, { description: regex }, { tags: regex }] });
    }

    // Lọc theo mục yêu thích yêu cầu một truy vấn riêng biệt trước
    let favoriteDocIds = null;
    if (favorites === 'true') {
        const userFavs = await UserFavoritesDocument.find({ userId }).select('documentId');
        favoriteDocIds = userFavs.map(fav => fav.documentId);
        query._id = { $in: favoriteDocIds }; // Lọc theo ID yêu thích
    }

    // Sắp xếp
    const sortField = sortBy || 'updatedAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    sort[sortField] = order;

    // Phân trang
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    let docs = await Document.find(query)
        .populate('createdBy', 'name avatarUrl') // Populate thông tin người tạo
        // Tùy chọn populate projectId: .populate('projectId', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(); // Sử dụng lean

    // Thêm trường isFavorite
    if (!favoriteDocIds && userId) { // Chỉ tìm nạp mục yêu thích nếu chưa được lọc theo chúng
         const userFavs = await UserFavoritesDocument.find({ userId, documentId: { $in: docs.map(d => d._id)} }).select('documentId');
         favoriteDocIds = userFavs.map(fav => fav.documentId);
    }
    const favoriteSet = new Set((favoriteDocIds || []).map(id => id.toString()));
    docs = docs.map(doc => ({
        ...doc,
        isFavorite: favoriteSet.has(doc._id.toString()),
    }));

    const totalDocuments = await Document.countDocuments(query);

    res.json({
        documents: docs,
        page: pageNum,
        pages: Math.ceil(totalDocuments / limitNum),
        total: totalDocuments,
    });
});

// @desc    Tải lên một tài liệu mới
// @route   POST /api/documents
// @access  Riêng tư
const uploadDocument = asyncHandler(async (req, res) => {
    // Lấy 'type' từ req.body, đặt tên là bodyType để rõ ràng
    const { title, description, tags, projectId, type: bodyType } = req.body;
    const file = req.file; // Đối tượng tệp từ multer

    // --- Khai báo biến cho thông tin file và tài liệu ---
    let fileUrl = null;
    let originalFilename = null;
    let fileMimeType = null; // Mime type của file nếu có
    let fileSize = null;
    let documentType = bodyType; // Ưu tiên type từ body

    // --- Kiểm tra các trường bắt buộc cơ bản ---
    if (!title || title.trim() === '') {
        res.status(400);
        throw new Error('Tiêu đề tài liệu là bắt buộc.');
    }
    // Nếu không có type từ body VÀ không có file (để suy luận type), thì báo lỗi
    if ((!documentType || documentType.trim() === '') && !file) {
        res.status(400);
        throw new Error('Loại tài liệu là bắt buộc.');
    }
    // Nếu có type từ body nhưng rỗng, cũng báo lỗi (trừ khi có file để suy luận)
    if (documentType && documentType.trim() === '' && !file) {
        res.status(400);
        throw new Error('Loại tài liệu không được để trống.');
    }

    // --- Xử lý file nếu có ---
    if (file) {
        const tempFilePath = file.path;
        const fileExtension = path.extname(file.originalname);
        const baseFilename = path.basename(file.originalname, fileExtension);
        const uniqueFilename = `${baseFilename.replace(/[^a-zA-Z0-9_.-]/g, '_')}-${Date.now()}${fileExtension}`;
        const destinationPath = path.join(__dirname, '../../uploads', uniqueFilename);
        const uploadsDir = path.join(__dirname, '../../uploads');

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        try {
            fs.renameSync(tempFilePath, destinationPath);
            fileUrl = await uploadFileToCloud(destinationPath, uniqueFilename);
            originalFilename = file.originalname;
            fileMimeType = file.mimetype;
            fileSize = file.size;

            // Nếu type từ body không được cung cấp hoặc không hợp lệ, thử suy luận từ file
            if (!documentType || documentType.trim() === '' || documentType.toLowerCase() === 'unknown') {
                const inferredType = path.extname(originalFilename).substring(1).toLowerCase() || 
                               (fileMimeType ? fileMimeType.split('/')[1] : 'unknown');
                documentType = inferredType; // Cập nhật documentType với type suy luận được
            }
        } catch (error) {
            console.error('Lỗi lưu file:', error);
            if (fs.existsSync(tempFilePath)) {
                try { fs.unlinkSync(tempFilePath); } catch (e) { console.error('Lỗi xóa file tạm:', e); }
            }
            res.status(500);
            throw new Error('Không thể lưu tệp lên server. Chi tiết: ' + error.message);
        }
    } else {
        // Không có file, đảm bảo documentType đã được cung cấp từ body và không rỗng
        if (!documentType || documentType.trim() === '') {
            res.status(400);
            throw new Error('Loại tài liệu là bắt buộc và không được để trống khi không tải tệp lên.');
        }
    }
    // --- Kết thúc Xử lý file --- 

    // Đảm bảo documentType không phải là 'unknown' hoặc rỗng sau tất cả các bước
    if (!documentType || documentType.trim() === '' || documentType.toLowerCase() === 'unknown') {
        res.status(400);
        throw new Error('Không thể xác định loại tài liệu. Vui lòng cung cấp loại tài liệu hợp lệ.');
    }

    // Tạo siêu dữ liệu tài liệu trong DB
    const documentData = {
        createdBy: req.user._id,
        projectId: projectId || null,
        title: title.trim(),
        description: description ? description.trim() : '',
        type: documentType.toLowerCase(),
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [],
        fileUrl,
        originalFilename,
        mimeType: fileMimeType,
        fileSize,
    };

    const document = new Document(documentData);
    const createdDocument = await document.save();
    await createdDocument.populate('createdBy', 'name avatarUrl');
    res.status(201).json(createdDocument);
});

// @desc    Lấy siêu dữ liệu tài liệu theo ID
// @route   GET /api/documents/:id
// @access  Riêng tư (Chủ sở hữu hoặc Được chia sẻ)
const getDocumentById = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const userId = req.user._id;

    try {
        const { doc } = await checkDocumentAccess(documentId, userId);
        await doc.populate('createdBy', 'name avatarUrl');
        await doc.populate('sharedWith.userId', 'name avatarUrl'); // Populate người dùng được chia sẻ
        
        // Kiểm tra trạng thái yêu thích
        const isFavorite = await UserFavoritesDocument.exists({ userId, documentId });
        
        const docObject = doc.toObject();
        docObject.isFavorite = !!isFavorite;

        res.json(docObject);
    } catch (error) {
        res.status(error.status || 500);
        throw new Error(error.message || 'Server Error');
    }
});

// @desc    Lấy URL tải xuống hoặc luồng cho tài liệu
// @route   GET /api/documents/:id/download
// @access  Riêng tư (Chủ sở hữu hoặc Được chia sẻ)
const downloadDocument = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const userId = req.user._id;

    try {
        const { doc } = await checkDocumentAccess(documentId, userId);
        
        // --- Lấy URL/Luồng Tải xuống --- 
        // Tùy chọn 1: Tạo và trả về một URL đã ký trước (Được đề xuất cho lưu trữ đám mây)
        const downloadUrl = await getPresignedUrl(doc.storageUrl);
        res.json({ downloadUrl });

        // Tùy chọn 2: Nếu tệp được lưu trữ cục bộ (KHÔNG được đề xuất cho production)
        // const filePath = path.join(__dirname, '../../../uploads', path.basename(doc.storageUrl)); // Điều chỉnh đường dẫn nếu cần
        // res.download(filePath, doc.title + path.extname(doc.storageUrl));
        // --- Kết thúc Tải xuống --- 

    } catch (error) {
        res.status(error.status || 500);
        throw new Error(error.message || 'Server Error');
    }
});

// @desc    Cập nhật siêu dữ liệu tài liệu
// @route   PUT /api/documents/:id
// @access  Riêng tư (Chỉ chủ sở hữu)
const updateDocument = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const userId = req.user._id;
    const { title, description, tags } = req.body;

    try {
        const { doc, isOwner } = await checkDocumentAccess(documentId, userId);

        if (!isOwner) {
            res.status(403);
            throw new Error('Chỉ chủ sở hữu tài liệu mới có thể cập nhật siêu dữ liệu');
        }

        doc.title = title || doc.title;
        doc.description = description !== undefined ? description : doc.description;
        if (tags) {
            try {
                doc.tags = JSON.parse(tags);
            } catch (e) { /* bỏ qua lỗi phân tích cú pháp */ }
        }

        const updatedDocument = await doc.save();
        await updatedDocument.populate('createdBy', 'name avatarUrl');
        res.json(updatedDocument);

    } catch (error) {
        res.status(error.status || 500);
        throw new Error(error.message || 'Server Error');
    }
});

// @desc    Xóa một tài liệu
// @route   DELETE /api/documents/:id
// @access  Riêng tư (Chỉ chủ sở hữu)
const deleteDocument = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const userId = req.user._id;

    try {
        const { doc, isOwner } = await checkDocumentAccess(documentId, userId);

        if (!isOwner) {
            res.status(403);
            throw new Error('Chỉ chủ sở hữu tài liệu mới có thể xóa tài liệu');
        }

        // --- Xóa Tệp khỏi Đám mây --- 
        await deleteFileFromCloud(doc.storageUrl);
        // --- Kết thúc Xóa Tệp --- 

        // Xóa các mục yêu thích liên quan
        await UserFavoritesDocument.deleteMany({ documentId: doc._id });
        // Xóa siêu dữ liệu tài liệu
        await doc.deleteOne();

        res.json({ message: 'Tài liệu đã được xóa thành công', id: documentId });

    } catch (error) {
         // Xử lý các lỗi xóa đám mây tiềm ẩn cụ thể nếu cần
         console.error("Lỗi trong quá trình xóa tài liệu:", error);
        res.status(error.status || 500);
        throw new Error(error.message || 'Failed to delete document');
    }
});

// @desc    Chia sẻ tài liệu với người dùng khác
// @route   POST /api/documents/:id/share
// @access  Riêng tư (Chỉ chủ sở hữu)
const shareDocument = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const ownerId = req.user._id;
    const { userId, permission } = req.body; // userId để chia sẻ, quyền ('read' hoặc 'edit')

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
         res.status(400); throw new Error('Invalid user ID to share with');
    }
    if (!permission || !['read', 'edit'].includes(permission)) {
         res.status(400); throw new Error("Quyền không hợp lệ được chỉ định (phải là 'read' hoặc 'edit')");
    }

    const shareWithUserId = new mongoose.Types.ObjectId(userId);

    if (ownerId.equals(shareWithUserId)) {
        res.status(400); throw new Error('Không thể chia sẻ tài liệu với chính mình');
    }

    try {
        const { doc, isOwner } = await checkDocumentAccess(documentId, ownerId);

        if (!isOwner) {
            res.status(403);
            throw new Error('Chỉ chủ sở hữu tài liệu mới có thể chia sẻ tài liệu');
        }

        // Kiểm tra xem người dùng để chia sẻ có tồn tại không
        const shareUser = await User.findById(shareWithUserId);
        if (!shareUser) {
            res.status(404); throw new Error('Không tìm thấy người dùng để chia sẻ');
        }

        const existingShareIndex = doc.sharedWith.findIndex(share => share.userId.equals(shareWithUserId));

        if (existingShareIndex > -1) {
            // Cập nhật quyền hiện có
            doc.sharedWith[existingShareIndex].permission = permission;
        } else {
            // Thêm mục chia sẻ mới
            doc.sharedWith.push({ userId: shareWithUserId, permission });
        }

        const updatedDocument = await doc.save();
        await updatedDocument.populate('sharedWith.userId', 'name avatarUrl');
        
        // Tạo thông báo cho người dùng được chia sẻ
        createNotification(
            shareWithUserId,
            'share',
            `${req.user.name} đã chia sẻ tài liệu với bạn`,
            `Tài liệu "${doc.title}" đã được chia sẻ với quyền ${permission}.`,
            { entityType: 'document', entityId: doc._id }
        );

        res.json(updatedDocument.sharedWith);

    } catch (error) {
        res.status(error.status || 500);
        throw new Error(error.message || 'Failed to share document');
    }
});

// @desc    Chuyển đổi trạng thái yêu thích cho tài liệu
// @route   POST /api/documents/:id/favorite
// @access  Riêng tư
const toggleFavoriteDocument = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const userId = req.user._id;

    // Trước tiên, kiểm tra xem người dùng có thể truy cập tài liệu không
    try {
       await checkDocumentAccess(documentId, userId);
    } catch (error) {
         res.status(error.status || 500);
        throw new Error(error.message || 'Không thể yêu thích tài liệu');
    }

    const existingFavorite = await UserFavoritesDocument.findOne({ userId, documentId });

    let isFavorite = false;
    if (existingFavorite) {
        await existingFavorite.deleteOne();
        isFavorite = false;
    } else {
        await UserFavoritesDocument.create({ userId, documentId });
        isFavorite = true;
    }

    res.json({ isFavorite });
});

module.exports = {
  getDocuments,
  uploadDocument,
  getDocumentById,
  downloadDocument,
  updateDocument,
  deleteDocument,
  shareDocument,
  toggleFavoriteDocument,
};