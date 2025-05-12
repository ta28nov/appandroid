// MongoDB Sample Data Setup Script
// ---------------------------------
// Hướng dẫn sử dụng:
// 1. Kết nối tới MongoDB bằng mongosh.
// 2. use digital_workspace_db;
// 3. Dán toàn bộ file này vào mongosh để tạo dữ liệu mẫu.

db.users.insertMany([
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    password: "hashed_password_1",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Developer yêu thích công nghệ và du lịch.",
    privacySettings: { showEmail: false, showActivityStatus: true },
    createdAt: new Date("2024-01-10T08:00:00Z"),
    updatedAt: new Date("2024-04-15T10:30:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
    name: "Trần Thị Bình",
    email: "binh.tran@example.com",
    password: "hashed_password_2",
    avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    bio: "Designer đam mê sáng tạo và ẩm thực.",
    privacySettings: { showEmail: true, showActivityStatus: false },
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-04-16T11:00:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
    name: "Lê Minh Cường",
    email: "cuong.le@example.com",
    password: "hashed_password_3",
    avatarUrl: "https://randomuser.me/api/portraits/men/28.jpg",
    bio: "Project Manager",
    privacySettings: { showEmail: false, showActivityStatus: true },
    createdAt: new Date("2024-02-01T14:00:00Z"),
    updatedAt: new Date("2024-04-14T09:00:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f4"),
    name: "Phạm Thị Dung",
    email: "dung.pham@example.com",
    password: "hashed_password_4",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "",
    privacySettings: { showEmail: false, showActivityStatus: true },
    createdAt: new Date("2024-02-20T11:00:00Z"),
    updatedAt: new Date("2024-03-30T15:00:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f5"),
    name: "Hoàng Minh Tuấn",
    email: "tuan.hoang@example.com",
    password: "hashed_password_5",
    avatarUrl: "https://randomuser.me/api/portraits/men/78.jpg",
    bio: "Tester, thích automation và thể thao.",
    privacySettings: { showEmail: true, showActivityStatus: true },
    createdAt: new Date("2024-03-10T08:00:00Z"),
    updatedAt: new Date("2024-04-15T10:30:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f6"),
    name: "Nguyễn Thị Mai",
    email: "mai.nguyen@example.com",
    password: "hashed_password_6",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Scrum Master, yêu thích đọc sách.",
    privacySettings: { showEmail: false, showActivityStatus: false },
    createdAt: new Date("2024-03-15T10:00:00Z"),
    updatedAt: new Date("2024-04-16T11:00:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f7"),
    name: "Vũ Quốc Đạt",
    email: "dat.vu@example.com",
    password: "hashed_password_7",
    avatarUrl: "https://randomuser.me/api/portraits/men/90.jpg",
    bio: "DevOps, thích cloud và CI/CD.",
    privacySettings: { showEmail: true, showActivityStatus: true },
    createdAt: new Date("2024-04-01T14:00:00Z"),
    updatedAt: new Date("2024-04-14T09:00:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f8"),
    name: "Lê Thị Hồng",
    email: "hong.le@example.com",
    password: "hashed_password_8",
    avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    bio: "Business Analyst, thích phân tích dữ liệu.",
    privacySettings: { showEmail: false, showActivityStatus: true },
    createdAt: new Date("2024-04-10T11:00:00Z"),
    updatedAt: new Date("2024-04-15T15:00:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f9"),
    name: "Trần Văn Cường",
    email: "cuong.tran@example.com",
    password: "hashed_password_9",
    avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg",
    bio: "Fullstack Developer, thích du lịch phượt.",
    privacySettings: { showEmail: true, showActivityStatus: false },
    createdAt: new Date("2024-04-20T11:00:00Z"),
    updatedAt: new Date("2024-04-20T15:00:00Z")
  }
]);

db.tasks.insertMany([
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e801"),
    title: "Hoàn thành báo cáo tháng 4",
    completed: false,
    priority: "high",
    dueDate: new Date("2025-04-25T17:00:00Z"),
    createdAt: new Date("2025-04-10T09:00:00Z"),
    updatedAt: new Date("2025-04-15T11:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e801"),
    title: "Thiết kế wireframe cho tính năng mới",
    completed: true,
    priority: "medium",
    dueDate: new Date("2025-04-18T17:00:00Z"),
    createdAt: new Date("2025-04-12T10:00:00Z"),
    updatedAt: new Date("2025-04-16T14:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    title: "Review code PR #123",
    completed: false,
    priority: "medium",
    createdAt: new Date("2025-04-16T15:00:00Z"),
    updatedAt: new Date("2025-04-16T15:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e802"),
    title: "Lên kế hoạch Sprint 5",
    completed: false,
    priority: "high",
    dueDate: new Date("2025-04-20T17:00:00Z"),
    createdAt: new Date("2025-04-17T11:00:00Z"),
    updatedAt: new Date("2025-04-17T11:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f4"),
    title: "Cập nhật tài liệu API User",
    completed: true,
    priority: "low",
    dueDate: new Date("2025-04-22T17:00:00Z"),
    createdAt: new Date("2025-04-14T16:00:00Z"),
    updatedAt: new Date("2025-04-18T09:30:00Z")
  }
]);

db.projects.insertMany([
  {
    _id: ObjectId("60d5ed0aa1b2c3a4b5d6e801"),
    name: "Project Alpha",
    description: "Phát triển ứng dụng quản lý công việc nội bộ.",
    ownerId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
    memberIds: [
      ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f2")
    ],
    status: "active",
    createdAt: new Date("2024-03-01T09:00:00Z"),
    updatedAt: new Date("2024-04-10T10:00:00Z")
  },
  {
    _id: ObjectId("60d5ed0aa1b2c3a4b5d6e802"),
    name: "Project Beta",
    description: "Nâng cấp hệ thống website công ty.",
    ownerId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
    memberIds: [
      ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f4")
    ],
    status: "active",
    createdAt: new Date("2024-04-01T10:00:00Z"),
    updatedAt: new Date("2024-04-15T11:00:00Z")
  },
  {
    _id: ObjectId("60d5ed0aa1b2c3a4b5d6e803"),
    name: "Archived Project Gamma",
    description: "Dự án thử nghiệm đã hoàn thành.",
    ownerId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    memberIds: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1")],
    status: "archived",
    createdAt: new Date("2023-11-01T00:00:00Z"),
    updatedAt: new Date("2024-02-28T00:00:00Z")
  }
]);

db.chats.insertMany([
  {
    _id: ObjectId("60d5ee1fa1b2c3a4b5d6e811"),
    participants: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), ObjectId("60d5ec49a1b2c3a4b5d6e7f2")],
    lastMessage: null,
    createdAt: new Date("2024-04-01T10:00:00Z"),
    updatedAt: new Date("2024-04-01T10:00:00Z")
  },
  {
    _id: ObjectId("60d5ee1fa1b2c3a4b5d6e812"),
    participants: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), ObjectId("60d5ec49a1b2c3a4b5d6e7f3")],
    lastMessage: null,
    createdAt: new Date("2024-04-10T11:00:00Z"),
    updatedAt: new Date("2024-04-10T11:00:00Z")
  },
  {
    _id: ObjectId("60d5ee1fa1b2c3a4b5d6e813"),
    participants: [ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), ObjectId("60d5ec49a1b2c3a4b5d6e7f4")],
    lastMessage: null,
    createdAt: new Date("2024-04-15T14:00:00Z"),
    updatedAt: new Date("2024-04-15T14:00:00Z")
  }
]);

db.chatMessages.insertMany([
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e821"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e811"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    text: "Chào Bình, bạn xem qua thiết kế mới chưa?",
    timestamp: new Date("2025-04-16T09:30:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1")]
  },
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e822"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e811"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
    text: "Chào An, mình xem rồi, đẹp lắm!",
    timestamp: new Date("2025-04-16T09:35:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), ObjectId("60d5ec49a1b2c3a4b5d6e7f2")]
  },
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e823"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e811"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    text: "Ok, vậy mình triển khai nhé.",
    timestamp: new Date("2025-04-16T09:40:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), ObjectId("60d5ec49a1b2c3a4b5d6e7f2")]
  },
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e824"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e812"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
    text: "An ơi, báo cáo dự án Alpha thế nào rồi?",
    timestamp: new Date("2025-04-17T10:00:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7f3")]
  },
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e825"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e812"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    text: "Chào anh, em đang hoàn thiện phần tổng kết, mai em gửi ạ.",
    timestamp: new Date("2025-04-17T10:05:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), ObjectId("60d5ec49a1b2c3a4b5d6e7f3")]
  }
]);

db.forumPosts.insertMany([
  {
    _id: ObjectId("60d5f0a0a1b2c3a4b5d6e831"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    title: "Cách triển khai giao diện người dùng hiện đại với React Native",
    content: "Tôi đang tìm kiếm các giải pháp UX/UI hiện đại cho ứng dụng di động React Native. Các bạn có kinh nghiệm hoặc đề xuất gì không? Đặc biệt quan tâm đến animation và performance.",
    tags: ["UI/UX", "Mobile", "Design", "React Native", "Performance"],
    likesCount: 24,
    commentsCount: 2,
    createdAt: new Date("2025-04-15T10:30:00Z"),
    updatedAt: new Date("2025-04-16T11:00:00Z")
  },
  {
    _id: ObjectId("60d5f0a0a1b2c3a4b5d6e832"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
    title: "Thảo luận về Design System: Nên tự xây dựng hay dùng thư viện?",
    content: "Team mình đang phân vân giữa việc xây dựng Design System riêng từ đầu hoặc sử dụng một thư viện có sẵn như Material UI (adapt cho RN) hoặc các bộ UI kit khác. Mọi người chia sẻ ưu nhược điểm giúp mình với!",
    tags: ["Design System", "UI/UX", "React Native", "Frontend"],
    likesCount: 18,
    commentsCount: 1,
    createdAt: new Date("2025-04-14T14:45:00Z"),
    updatedAt: new Date("2025-04-14T14:45:00Z")
  },
  {
    _id: ObjectId("60d5f0a0a1b2c3a4b5d6e833"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
    title: "Kinh nghiệm quản lý dự án Agile trong team remote",
    content: "Chia sẻ kinh nghiệm áp dụng Agile/Scrum hiệu quả cho các team làm việc từ xa. Các công cụ, quy trình nào mọi người thấy hữu ích?",
    tags: ["Agile", "Scrum", "Project Management", "Remote Work"],
    likesCount: 35,
    commentsCount: 0,
    createdAt: new Date("2025-04-13T09:15:00Z"),
    updatedAt: new Date("2025-04-13T09:15:00Z")
  }
]);

db.forumComments.insertMany([
  {
    postId: ObjectId("60d5f0a0a1b2c3a4b5d6e831"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
    content: "Mình thấy dùng Lottie cho animation khá hiệu quả và nhẹ nhàng đó An.",
    likesCount: 5,
    createdAt: new Date("2025-04-15T11:00:00Z"),
    updatedAt: new Date("2025-04-15T11:00:00Z")
  },
  {
    postId: ObjectId("60d5f0a0a1b2c3a4b5d6e831"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f4"),
    content: "Về performance, nên chú ý dùng FlatList thay vì ScrollView cho danh sách dài, và dùng useMemo/useCallback hợp lý.",
    likesCount: 8,
    createdAt: new Date("2025-04-16T09:00:00Z"),
    updatedAt: new Date("2025-04-16T09:00:00Z")
  },
  {
    postId: ObjectId("60d5f0a0a1b2c3a4b5d6e832"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    content: "Mình nghĩ tùy quy mô dự án. Dự án nhỏ hoặc MVP thì dùng thư viện cho nhanh. Dự án lớn, dài hạn thì nên xây dựng riêng để kiểm soát tốt hơn.",
    likesCount: 10,
    createdAt: new Date("2025-04-14T15:30:00Z"),
    updatedAt: new Date("2025-04-14T15:30:00Z")
  }
]);

db.userLikesPost.insertMany([
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e831"), createdAt: new Date("2025-04-15T10:35:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f4"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e831"), createdAt: new Date("2025-04-15T11:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e832"), createdAt: new Date("2025-04-14T15:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e833"), createdAt: new Date("2025-04-13T10:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e833"), createdAt: new Date("2025-04-13T10:05:00Z") }
]);

db.documents.insertMany([
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e841"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e801"),
    title: "Báo cáo tiến độ dự án Alpha - Tháng 4",
    description: "Tổng hợp công việc đã hoàn thành và kế hoạch tháng 5.",
    type: "pdf",
    sizeBytes: 1258291,
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/docs/alpha_report_apr.pdf",
    tags: ["báo cáo", "project alpha", "tiến độ"],
    sharedWith: [
      { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), permission: "read" }
    ],
    createdAt: new Date("2025-04-18T10:00:00Z"),
    updatedAt: new Date("2025-04-18T10:00:00Z")
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e842"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e801"),
    title: "Thiết kế UI Kit - Project Alpha",
    description: "Bộ thành phần giao diện cho dự án Alpha.",
    type: "fig",
    sizeBytes: 5242880,
    storageUrl: "https://www.figma.com/file/xyz...",
    tags: ["design", "ui kit", "project alpha", "figma"],
    sharedWith: [
      { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), permission: "edit" },
      { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), permission: "read" }
    ],
    createdAt: new Date("2024-03-15T14:00:00Z"),
    updatedAt: new Date("2024-04-10T16:30:00Z")
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e843"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7f4"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e802"),
    title: "Tài liệu API Người dùng v2",
    description: "Mô tả chi tiết các endpoint API cho module User.",
    type: "docx",
    sizeBytes: 314572,
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/docs/user_api_v2.docx",
    tags: ["api", "tài liệu", "project beta", "backend"],
    sharedWith: [],
    createdAt: new Date("2024-04-14T09:00:00Z"),
    updatedAt: new Date("2024-04-18T09:00:00Z")
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e844"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    title: "Ghi chú cuộc họp 10/04",
    description: "Nội dung trao đổi về kế hoạch Sprint 5.",
    type: "txt",
    sizeBytes: 10240,
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/notes/meeting_notes_apr10.txt",
    tags: ["họp", "ghi chú"],
    sharedWith: [],
    createdAt: new Date("2025-04-10T11:30:00Z"),
    updatedAt: new Date("2025-04-10T11:30:00Z")
  }
]);

db.userFavoritesDocument.insertMany([
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e843"), createdAt: new Date("2025-04-15T08:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e842"), createdAt: new Date("2025-04-16T09:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e842"), createdAt: new Date("2025-04-11T10:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e841"), createdAt: new Date("2025-04-18T11:00:00Z") }
]);

db.notifications.insertMany([
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    type: "comment",
    title: "Bình luận mới trên bài đăng của bạn",
    message: 'Trần Thị Bình đã bình luận về "Cách triển khai giao diện người dùng hiện đại..."',
    read: false,
    relatedEntity: { entityType: "post", entityId: ObjectId("60d5f0a0a1b2c3a4b5d6e831") },
    createdAt: new Date("2025-04-15T11:00:01Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    type: "comment",
    title: "Bình luận mới trên bài đăng của bạn",
    message: 'Phạm Thị Dung đã bình luận về "Cách triển khai giao diện người dùng hiện đại..."',
    read: false,
    relatedEntity: { entityType: "post", entityId: ObjectId("60d5f0a0a1b2c3a4b5d6e831") },
    createdAt: new Date("2025-04-16T09:00:01Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
    type: "comment",
    title: "Bình luận mới trên bài đăng của bạn",
    message: 'Nguyễn Văn An đã bình luận về "Thảo luận về Design System..."',
    read: true,
    relatedEntity: { entityType: "post", entityId: ObjectId("60d5f0a0a1b2c3a4b5d6e832") },
    createdAt: new Date("2025-04-14T15:30:01Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    type: "reminder",
    title: "Nhắc nhở công việc sắp hết hạn",
    message: 'Công việc "Hoàn thành báo cáo tháng 4" sắp đến hạn vào ngày mai.',
    read: false,
    relatedEntity: { entityType: "task", entityId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1") },
    createdAt: new Date("2025-04-24T08:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
    type: "document",
    title: "Tài liệu mới được chia sẻ",
    message: 'Nguyễn Văn An đã chia sẻ tài liệu "Báo cáo tiến độ dự án Alpha - Tháng 4" với bạn.',
    read: false,
    relatedEntity: { entityType: "document", entityId: ObjectId("60d5f23ba1b2c3a4b5d6e841") },
    createdAt: new Date("2025-04-18T10:00:01Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    type: "project",
    title: "Bạn đã được thêm vào dự án mới",
    message: 'Lê Minh Cường đã thêm bạn vào dự án "Project Beta".',
    read: true,
    relatedEntity: { entityType: "project", entityId: ObjectId("60d5ed0aa1b2c3a4b5d6e802") },
    createdAt: new Date("2024-04-01T10:05:00Z")
  }
]);

// ----- END OF SCRIPT -----