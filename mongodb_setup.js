// MongoDB Sample Data Setup Script
// ---------------------------------
// Hướng dẫn sử dụng:
// 1. Kết nối tới MongoDB bằng mongosh.
// 2. use digital_workspace_db;
// 3. Dán toàn bộ file này vào mongosh để tạo dữ liệu mẫu.

// 1. USERS
// Mật khẩu hash cho '123456': $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8

db.users.deleteMany({});
db.users.insertMany([
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    password: "$2a$10$spyRps1oZgsmrG7BH1oTOuzV/wV4hPpS5lyOLnTzFERYADEjn63Hm",
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
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
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
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
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
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
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
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
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
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
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
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
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
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
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
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
    avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg",
    bio: "Fullstack Developer, thích du lịch phượt.",
    privacySettings: { showEmail: true, showActivityStatus: false },
    createdAt: new Date("2024-04-20T11:00:00Z"),
    updatedAt: new Date("2024-04-20T15:00:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"),
    name: "Admin Master",
    email: "admin@example.com",
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
    avatarUrl: "https://randomuser.me/api/portraits/men/99.jpg",
    bio: "Admin hệ thống, quản lý toàn bộ workspace.",
    privacySettings: { showEmail: true, showActivityStatus: true },
    createdAt: new Date("2024-01-01T08:00:00Z"),
    updatedAt: new Date("2025-04-20T10:00:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7fb"),
    name: "Guest User",
    email: "guest@example.com",
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
    avatarUrl: "https://randomuser.me/api/portraits/men/98.jpg",
    bio: "Khách tham quan hệ thống.",
    privacySettings: { showEmail: false, showActivityStatus: false },
    createdAt: new Date("2024-02-01T08:00:00Z"),
    updatedAt: new Date("2025-04-20T10:00:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7fc"),
    name: "Ngô Văn Không Avatar",
    email: "noavatar@example.com",
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
    avatarUrl: "",
    bio: "Khách hàng sử dụng hệ thống với bio rất dài. ".repeat(20),
    privacySettings: { showEmail: true, showActivityStatus: true },
    createdAt: new Date("2024-05-01T08:00:00Z"),
    updatedAt: new Date("2025-05-01T10:00:00Z")
  },
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7fd"),
    name: "Nguyễn Không Bio",
    email: "nobio@example.com",
    password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1r6Qe/5p8b2y3Q1r6Qe/5p8",
    avatarUrl: "https://randomuser.me/api/portraits/men/97.jpg",
    bio: "",
    privacySettings: { showEmail: false, showActivityStatus: false },
    createdAt: new Date("2024-05-02T08:00:00Z"),
    updatedAt: new Date("2025-05-02T10:00:00Z")
  }
]);

// 2. PROJECTS

db.projects.deleteMany({});
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
  },
  {
    _id: ObjectId("60d5ed0aa1b2c3a4b5d6e804"),
    name: "Project Omega",
    description: "Dự án thử nghiệm lớn với nhiều thành viên.",
    ownerId: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"),
    memberIds: [
      ObjectId("60d5ec49a1b2c3a4b5d6e7fa"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7fb"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f4")
    ],
    status: "active",
    createdAt: new Date("2025-01-01T09:00:00Z"),
    updatedAt: new Date("2025-04-20T10:00:00Z")
  },
  {
    _id: ObjectId("60d5ed0aa1b2c3a4b5d6e805"),
    name: "Project Không Member",
    description: "Project này chưa có thành viên nào.",
    ownerId: ObjectId("60d5ec49a1b2c3a4b5d6e7fc"),
    memberIds: [],
    status: "pending",
    createdAt: new Date("2025-05-01T09:00:00Z"),
    updatedAt: new Date("2025-05-01T10:00:00Z")
  }
]);

// 3. TASKS

db.tasks.deleteMany({});
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
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e804"),
    title: "Setup CI/CD cho Project Omega",
    completed: false,
    priority: "high",
    dueDate: new Date("2025-05-30T17:00:00Z"),
    createdAt: new Date("2025-04-20T09:00:00Z"),
    updatedAt: new Date("2025-04-20T09:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fb"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e804"),
    title: "Viết tài liệu hướng dẫn sử dụng hệ thống",
    completed: false,
    priority: "medium",
    dueDate: new Date("2025-06-10T17:00:00Z"),
    createdAt: new Date("2025-04-21T09:00:00Z"),
    updatedAt: new Date("2025-04-21T09:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e804"),
    title: "Thiết kế dashboard cho admin",
    completed: true,
    priority: "high",
    dueDate: new Date("2025-05-10T17:00:00Z"),
    createdAt: new Date("2025-04-22T09:00:00Z"),
    updatedAt: new Date("2025-04-23T09:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fc"),
    title: "Task cá nhân không thuộc project",
    completed: false,
    priority: "low",
    dueDate: new Date("2025-04-01T17:00:00Z"), // overdue
    createdAt: new Date("2025-03-01T09:00:00Z"),
    updatedAt: new Date("2025-04-01T10:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fd"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e805"),
    title: "Task đã hoàn thành",
    completed: true,
    priority: "medium",
    dueDate: new Date("2025-05-10T17:00:00Z"),
    createdAt: new Date("2025-05-01T09:00:00Z"),
    updatedAt: new Date("2025-05-10T10:00:00Z")
  }
]);

// 4. CHATS

db.chats.deleteMany({});
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
  },
  {
    _id: ObjectId("60d5ee1fa1b2c3a4b5d6e814"),
    participants: [
      ObjectId("60d5ec49a1b2c3a4b5d6e7fa"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7fb"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f2")
    ],
    lastMessage: null,
    createdAt: new Date("2025-04-20T10:00:00Z"),
    updatedAt: new Date("2025-04-20T10:00:00Z")
  },
  {
    _id: ObjectId("60d5ee1fa1b2c3a4b5d6e815"),
    participants: [
      ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f3"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7f4"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7fc"),
      ObjectId("60d5ec49a1b2c3a4b5d6e7fd")
    ],
    lastMessage: null,
    createdAt: new Date("2025-05-01T10:00:00Z"),
    updatedAt: new Date("2025-05-01T10:00:00Z")
  }
]);

// 5. CHAT MESSAGES

db.chatMessages.deleteMany({});
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
  },
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e826"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e814"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"),
    text: "Chào mọi người, đây là chat nhóm Project Omega!",
    timestamp: new Date("2025-04-20T10:01:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7fa")]
  },
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e827"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e814"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7fb"),
    text: "Hello admin, mình là guest user.",
    timestamp: new Date("2025-04-20T10:02:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7fa"), ObjectId("60d5ec49a1b2c3a4b5d6e7fb")]
  },
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e828"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e814"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    text: "Chào mọi người, mình là An.",
    timestamp: new Date("2025-04-20T10:03:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7fa"), ObjectId("60d5ec49a1b2c3a4b5d6e7fb"), ObjectId("60d5ec49a1b2c3a4b5d6e7f1")]
  },
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e829"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e815"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7fc"),
    text: "👋 Xin chào mọi người!",
    timestamp: new Date("2025-05-01T10:01:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7fc")]
  },
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e82a"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e815"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7fd"),
    text: "Tin nhắn chỉ có emoji 😁😁😁",
    timestamp: new Date("2025-05-01T10:02:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7fd")]
  },
  {
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e82b"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e815"),
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    text: "Đây là một tin nhắn rất dài. ".repeat(30),
    timestamp: new Date("2025-05-01T10:03:00Z"),
    readBy: []
  }
]);

// 6. DOCUMENTS

db.documents.deleteMany({});
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
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e845"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e804"),
    title: "Ảnh demo hệ thống",
    description: "Ảnh chụp màn hình dashboard.",
    type: "jpg",
    sizeBytes: 204800,
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/images/demo_dashboard.jpg",
    tags: ["demo", "dashboard", "image"],
    sharedWith: [
      { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fb"), permission: "read" }
    ],
    createdAt: new Date("2025-04-20T10:10:00Z"),
    updatedAt: new Date("2025-04-20T10:10:00Z")
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e846"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7fb"),
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e804"),
    title: "Bảng tính ngân sách dự án Omega",
    description: "File excel quản lý ngân sách.",
    type: "xlsx",
    sizeBytes: 1048576,
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/excel/budget_omega.xlsx",
    tags: ["budget", "excel", "project omega"],
    sharedWith: [
      { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"), permission: "edit" }
    ],
    createdAt: new Date("2025-04-20T10:15:00Z"),
    updatedAt: new Date("2025-04-20T10:15:00Z")
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e847"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"),
    title: "Slide thuyết trình dự án",
    description: "File PowerPoint trình bày dự án.",
    type: "pptx",
    sizeBytes: 2097152,
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/pptx/project_presentation.pptx",
    tags: ["presentation", "pptx", "project"],
    sharedWith: [],
    createdAt: new Date("2025-04-20T10:20:00Z"),
    updatedAt: new Date("2025-04-20T10:20:00Z")
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e848"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7fc"),
    title: "Video hướng dẫn sử dụng",
    description: "Video mp4 demo.",
    type: "mp4",
    sizeBytes: 10485760,
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/video/huongdan.mp4",
    tags: ["video", "demo"],
    sharedWith: [],
    createdAt: new Date("2025-05-01T10:10:00Z"),
    updatedAt: new Date("2025-05-01T10:10:00Z")
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e849"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7fd"),
    title: "Tệp nén tài liệu",
    description: "File zip tổng hợp.",
    type: "zip",
    sizeBytes: 2048000,
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/zip/tailieu.zip",
    tags: ["zip", "archive"],
    sharedWith: [],
    createdAt: new Date("2025-05-01T10:15:00Z"),
    updatedAt: new Date("2025-05-01T10:15:00Z")
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e84a"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7fc"),
    title: "Document thiếu projectId",
    description: "Document cá nhân không thuộc project.",
    type: "txt",
    sizeBytes: 1024,
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/notes/personal_note.txt",
    tags: ["note", "personal"],
    sharedWith: [],
    createdAt: new Date("2025-05-01T10:20:00Z"),
    updatedAt: new Date("2025-05-01T10:20:00Z")
  }
]);

// 7. FORUM POSTS

db.forumPosts.deleteMany({});
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
  },
  {
    _id: ObjectId("60d5f0a0a1b2c3a4b5d6e834"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"),
    title: "Hỏi đáp về bảo mật hệ thống",
    content: "Mọi người có kinh nghiệm về bảo mật API, xác thực JWT, chia sẻ giúp mình với!",
    tags: ["security", "api", "jwt", "backend"],
    likesCount: 10,
    commentsCount: 2,
    createdAt: new Date("2025-04-20T10:30:00Z"),
    updatedAt: new Date("2025-04-20T10:30:00Z")
  },
  {
    _id: ObjectId("60d5f0a0a1b2c3a4b5d6e835"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7fc"),
    title: "Chia sẻ kinh nghiệm sử dụng hệ thống",
    content: "Bạn đã gặp vấn đề gì khi sử dụng? Hãy chia sẻ ở đây!",
    tags: ["feedback", "trải nghiệm", "hỏi đáp", "support", "longtag1", "longtag2", "longtag3"],
    likesCount: 0,
    commentsCount: 2,
    createdAt: new Date("2025-05-01T10:30:00Z"),
    updatedAt: new Date("2025-05-01T10:30:00Z")
  }
]);

// 8. FORUM COMMENTS

db.forumComments.deleteMany({});
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
  },
  {
    postId: ObjectId("60d5f0a0a1b2c3a4b5d6e834"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"),
    content: "Bạn nên dùng middleware kiểm tra token ở mọi request.",
    likesCount: 2,
    createdAt: new Date("2025-04-20T10:35:00Z"),
    updatedAt: new Date("2025-04-20T10:35:00Z")
  },
  {
    postId: ObjectId("60d5f0a0a1b2c3a4b5d6e834"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7fb"),
    content: "JWT nên đặt thời gian sống ngắn và refresh token hợp lý.",
    likesCount: 3,
    createdAt: new Date("2025-04-20T10:36:00Z"),
    updatedAt: new Date("2025-04-20T10:36:00Z")
  },
  {
    postId: ObjectId("60d5f0a0a1b2c3a4b5d6e835"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7fd"),
    content: "Đây là một comment rất dài. ".repeat(20),
    likesCount: 0,
    createdAt: new Date("2025-05-01T10:35:00Z"),
    updatedAt: new Date("2025-05-01T10:35:00Z")
  },
  {
    postId: ObjectId("60d5f0a0a1b2c3a4b5d6e835"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7fc"),
    content: "👍👍👍",
    likesCount: 0,
    createdAt: new Date("2025-05-01T10:36:00Z"),
    updatedAt: new Date("2025-05-01T10:36:00Z")
  }
]);

// 9. USER LIKES POST

db.userLikesPost.deleteMany({});
db.userLikesPost.insertMany([
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e831"), createdAt: new Date("2025-04-15T10:35:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f4"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e831"), createdAt: new Date("2025-04-15T11:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e832"), createdAt: new Date("2025-04-14T15:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e833"), createdAt: new Date("2025-04-13T10:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e833"), createdAt: new Date("2025-04-13T10:05:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e834"), createdAt: new Date("2025-04-20T10:40:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fb"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e834"), createdAt: new Date("2025-04-20T10:41:00Z") }
]);

// 10. USER FAVORITES DOCUMENT

db.userFavoritesDocument.deleteMany({});
db.userFavoritesDocument.insertMany([
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e843"), createdAt: new Date("2025-04-15T08:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e842"), createdAt: new Date("2025-04-16T09:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e842"), createdAt: new Date("2025-04-11T10:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e841"), createdAt: new Date("2025-04-18T11:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e845"), createdAt: new Date("2025-04-20T10:50:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fb"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e846"), createdAt: new Date("2025-04-20T10:51:00Z") }
]);

// 11. NOTIFICATIONS

db.notifications.deleteMany({});
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
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"),
    type: "task",
    title: "Bạn được giao task mới",
    message: 'Bạn vừa được giao task "Setup CI/CD cho Project Omega".',
    read: false,
    relatedEntity: { entityType: "task", entityId: ObjectId("60d5ec49a1b2c3a4b5d6e7fa") },
    createdAt: new Date("2025-04-20T11:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fb"),
    type: "document",
    title: "Tài liệu mới được chia sẻ",
    message: 'Admin Master đã chia sẻ tài liệu "Ảnh demo hệ thống" với bạn.',
    read: false,
    relatedEntity: { entityType: "document", entityId: ObjectId("60d5f23ba1b2c3a4b5d6e845") },
    createdAt: new Date("2025-04-20T11:01:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fa"),
    type: "project",
    title: "Project Omega vừa được cập nhật",
    message: 'Có thành viên mới tham gia Project Omega.',
    read: false,
    relatedEntity: { entityType: "project", entityId: ObjectId("60d5ed0aa1b2c3a4b5d6e804") },
    createdAt: new Date("2025-04-20T11:02:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fc"),
    type: "system",
    title: "Thông báo hệ thống",
    message: "Hệ thống sẽ bảo trì vào ngày 25/05/2025.",
    read: false,
    relatedEntity: { entityType: "system", entityId: null },
    createdAt: new Date("2025-05-01T11:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7fd"),
    type: "system",
    title: "Thông báo hệ thống",
    message: "Hệ thống sẽ bảo trì vào ngày 25/05/2025.",
    read: false,
    relatedEntity: { entityType: "system", entityId: null },
    createdAt: new Date("2025-05-01T11:00:00Z")
  }
]);

// ----- END OF SCRIPT -----