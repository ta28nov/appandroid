// MongoDB Setup Script (Vietnamese)
// -----------------------------------------
// Hướng dẫn sử dụng:
// 1. Kết nối tới MongoDB instance của bạn bằng mongosh:
//    mongosh "mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority" 
//    hoặc kết nối tới local instance: mongosh
// 2. Chọn hoặc tạo database mới (ví dụ: 'digital_workspace_db'):
//    use digital_workspace_db;
// 3. Sao chép và dán TOÀN BỘ nội dung của file này vào mongosh và nhấn Enter.
//    Các collection sẽ được tạo (nếu chưa có) và dữ liệu mẫu sẽ được chèn vào.
// 4. Kiểm tra lại bằng lệnh: show collections; db.users.find().pretty(); ...

// ================== SCHEMA & MOCK DATA ==================

// ---- 1. Users Collection ----
/* 
Schema: users
{
  _id: ObjectId, 
  name: String (Required),
  email: String (Required, Unique, Indexed),
  password: String (Required, Hashed), // Trong dữ liệu mẫu sẽ để rõ để dễ hình dung
  avatarUrl: String (Optional),
  bio: String (Optional),
  privacySettings: {
    showEmail: Boolean (Default: false),
    showActivityStatus: Boolean (Default: true)
  },
  createdAt: Date (Default: Now),
  updatedAt: Date (Default: Now)
}
Indexes: 
  db.users.createIndex({ email: 1 }, { unique: true });
*/
db.users.insertMany([
  {
    _id: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // Giữ ObjectId cố định để liên kết dữ liệu
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    password: "hashed_password_1", // Thay thế bằng hash thực tế
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
  }
]);
print("Users Collection: Schema described & mock data inserted.");

// ---- 2. Tasks Collection ----
/* 
Schema: tasks
{
  _id: ObjectId,
  userId: ObjectId (Required, Indexed, Ref: users),
  projectId: ObjectId (Optional, Indexed, Ref: projects),
  title: String (Required),
  completed: Boolean (Default: false, Indexed),
  priority: String (Enum: 'low', 'medium', 'high', Default: 'medium', Indexed),
  dueDate: Date (Optional, Indexed),
  createdAt: Date (Default: Now),
  updatedAt: Date (Default: Now)
}
Indexes: 
  db.tasks.createIndex({ userId: 1 });
  db.tasks.createIndex({ projectId: 1 });
  db.tasks.createIndex({ completed: 1 });
  db.tasks.createIndex({ priority: 1 });
  db.tasks.createIndex({ dueDate: 1 });
*/
db.tasks.insertMany([
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e801"), // Project Alpha
    title: "Hoàn thành báo cáo tháng 4",
    completed: false,
    priority: "high",
    dueDate: new Date("2025-04-25T17:00:00Z"),
    createdAt: new Date("2025-04-10T09:00:00Z"),
    updatedAt: new Date("2025-04-15T11:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), // Binh Tran
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e801"), // Project Alpha
    title: "Thiết kế wireframe cho tính năng mới",
    completed: true,
    priority: "medium",
    dueDate: new Date("2025-04-18T17:00:00Z"),
    createdAt: new Date("2025-04-12T10:00:00Z"),
    updatedAt: new Date("2025-04-16T14:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    title: "Review code PR #123",
    completed: false,
    priority: "medium",
    createdAt: new Date("2025-04-16T15:00:00Z"),
    updatedAt: new Date("2025-04-16T15:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), // Cuong Le
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e802"), // Project Beta
    title: "Lên kế hoạch Sprint 5",
    completed: false,
    priority: "high",
    dueDate: new Date("2025-04-20T17:00:00Z"),
    createdAt: new Date("2025-04-17T11:00:00Z"),
    updatedAt: new Date("2025-04-17T11:00:00Z")
  },
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f4"), // Dung Pham
    title: "Cập nhật tài liệu API User",
    completed: true,
    priority: "low",
    dueDate: new Date("2025-04-22T17:00:00Z"),
    createdAt: new Date("2025-04-14T16:00:00Z"),
    updatedAt: new Date("2025-04-18T09:30:00Z")
  }
]);
print("Tasks Collection: Schema described & mock data inserted.");

// ---- 3. Projects Collection ----
/*
Schema: projects
{
  _id: ObjectId,
  name: String (Required),
  description: String (Optional),
  ownerId: ObjectId (Required, Indexed, Ref: users),
  memberIds: [ObjectId] (Indexed, Ref: users), // Includes owner
  status: String (Enum: 'active', 'archived', Default: 'active', Indexed),
  createdAt: Date (Default: Now),
  updatedAt: Date (Default: Now)
}
Indexes: 
  db.projects.createIndex({ ownerId: 1 });
  db.projects.createIndex({ memberIds: 1 });
  db.projects.createIndex({ status: 1 });
*/
db.projects.insertMany([
  {
    _id: ObjectId("60d5ed0aa1b2c3a4b5d6e801"),
    name: "Project Alpha",
    description: "Phát triển ứng dụng quản lý công việc nội bộ.",
    ownerId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), // Cuong Le
    memberIds: [
      ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), // Cuong Le
      ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
      ObjectId("60d5ec49a1b2c3a4b5d6e7f2")  // Binh Tran
    ],
    status: "active",
    createdAt: new Date("2024-03-01T09:00:00Z"),
    updatedAt: new Date("2024-04-10T10:00:00Z")
  },
  {
    _id: ObjectId("60d5ed0aa1b2c3a4b5d6e802"),
    name: "Project Beta",
    description: "Nâng cấp hệ thống website công ty.",
    ownerId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), // Cuong Le
    memberIds: [
      ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), // Cuong Le
      ObjectId("60d5ec49a1b2c3a4b5d6e7f4")  // Dung Pham
    ],
    status: "active",
    createdAt: new Date("2024-04-01T10:00:00Z"),
    updatedAt: new Date("2024-04-15T11:00:00Z")
  },
  {
    _id: ObjectId("60d5ed0aa1b2c3a4b5d6e803"),
    name: "Archived Project Gamma",
    description: "Dự án thử nghiệm đã hoàn thành.",
    ownerId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    memberIds: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1")],
    status: "archived",
    createdAt: new Date("2023-11-01T00:00:00Z"),
    updatedAt: new Date("2024-02-28T00:00:00Z")
  }
]);
print("Projects Collection: Schema described & mock data inserted.");

// ---- 4. Chats Collection ----
/*
Schema: chats
{
  _id: ObjectId,
  participants: [ObjectId] (Required, Indexed, Size: 2 for 1-on-1, Ref: users),
  lastMessage: { // Denormalized for list view
    messageId: ObjectId (Ref: chatMessages),
    senderId: ObjectId (Ref: users),
    text: String,
    timestamp: Date
  },
  createdAt: Date (Default: Now),
  updatedAt: Date (Default: Now) // Update on new message
}
Indexes: 
  db.chats.createIndex({ participants: 1 });
  db.chats.createIndex({ updatedAt: -1 }); // Sort by recent activity
*/
// Lưu ý: lastMessage sẽ được cập nhật bởi logic backend khi có tin nhắn mới.
// Dữ liệu mẫu ở đây chỉ khởi tạo cấu trúc.
db.chats.insertMany([
  {
    _id: ObjectId("60d5ee1fa1b2c3a4b5d6e811"), // Chat An & Binh
    participants: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), ObjectId("60d5ec49a1b2c3a4b5d6e7f2")],
    lastMessage: null, // Sẽ được cập nhật sau khi chèn message
    createdAt: new Date("2024-04-01T10:00:00Z"),
    updatedAt: new Date("2024-04-01T10:00:00Z") 
  },
  {
    _id: ObjectId("60d5ee1fa1b2c3a4b5d6e812"), // Chat An & Cuong
    participants: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), ObjectId("60d5ec49a1b2c3a4b5d6e7f3")],
    lastMessage: null,
    createdAt: new Date("2024-04-10T11:00:00Z"),
    updatedAt: new Date("2024-04-10T11:00:00Z")
  },
  {
    _id: ObjectId("60d5ee1fa1b2c3a4b5d6e813"), // Chat Binh & Dung
    participants: [ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), ObjectId("60d5ec49a1b2c3a4b5d6e7f4")],
    lastMessage: null,
    createdAt: new Date("2024-04-15T14:00:00Z"),
    updatedAt: new Date("2024-04-15T14:00:00Z")
  }
]);
print("Chats Collection: Schema described & mock data inserted (lastMessage needs update).");

// ---- 5. ChatMessages Collection ----
/*
Schema: chatMessages
{
  _id: ObjectId,
  chatId: ObjectId (Required, Indexed, Ref: chats),
  senderId: ObjectId (Required, Indexed, Ref: users),
  text: String (Required),
  timestamp: Date (Default: Now, Indexed),
  readBy: [ObjectId] (Ref: users) // Users who have read this message
}
Indexes: 
  db.chatMessages.createIndex({ chatId: 1, timestamp: -1 }); // Get messages per chat, newest first
  db.chatMessages.createIndex({ senderId: 1 });
  db.chatMessages.createIndex({ timestamp: -1 });
*/
db.chatMessages.insertMany([
  // Chat An & Binh
  { 
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e821"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e811"), 
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An
    text: "Chào Bình, bạn xem qua thiết kế mới chưa?",
    timestamp: new Date("2025-04-16T09:30:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1")] 
  },
  { 
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e822"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e811"), 
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), // Binh
    text: "Chào An, mình xem rồi, đẹp lắm!",
    timestamp: new Date("2025-04-16T09:35:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), ObjectId("60d5ec49a1b2c3a4b5d6e7f2")] 
  },
   { 
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e823"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e811"), 
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An
    text: "Ok, vậy mình triển khai nhé.",
    timestamp: new Date("2025-04-16T09:40:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), ObjectId("60d5ec49a1b2c3a4b5d6e7f2")] // Giả sử Binh đọc ngay
  },
  // Chat An & Cuong
  { 
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e824"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e812"), 
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), // Cuong
    text: "An ơi, báo cáo dự án Alpha thế nào rồi?",
    timestamp: new Date("2025-04-17T10:00:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7f3")] 
  },
  { 
    _id: ObjectId("60d5ef5ea1b2c3a4b5d6e825"),
    chatId: ObjectId("60d5ee1fa1b2c3a4b5d6e812"), 
    senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An
    text: "Chào anh, em đang hoàn thiện phần tổng kết, mai em gửi ạ.",
    timestamp: new Date("2025-04-17T10:05:00Z"),
    readBy: [ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), ObjectId("60d5ec49a1b2c3a4b5d6e7f3")] // Giả sử Cường đọc
  }
]);
print("ChatMessages Collection: Schema described & mock data inserted.");

// Cập nhật lastMessage cho chats collection (Ví dụ thủ công, backend nên làm tự động)
db.chats.updateOne(
  { _id: ObjectId("60d5ee1fa1b2c3a4b5d6e811") },
  { $set: { 
      lastMessage: { 
        messageId: ObjectId("60d5ef5ea1b2c3a4b5d6e823"), 
        senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), 
        text: "Ok, vậy mình triển khai nhé.", 
        timestamp: new Date("2025-04-16T09:40:00Z") 
      },
      updatedAt: new Date("2025-04-16T09:40:00Z")
    } 
  }
);
db.chats.updateOne(
  { _id: ObjectId("60d5ee1fa1b2c3a4b5d6e812") },
  { $set: { 
      lastMessage: { 
        messageId: ObjectId("60d5ef5ea1b2c3a4b5d6e825"), 
        senderId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), 
        text: "Chào anh, em đang hoàn thiện phần tổng kết, mai em gửi ạ.", 
        timestamp: new Date("2025-04-17T10:05:00Z") 
      },
       updatedAt: new Date("2025-04-17T10:05:00Z")
    } 
  }
);
print("Chats Collection: lastMessage updated manually for demonstration.");

// ---- 6. ForumPosts Collection ----
/*
Schema: forumPosts
{
  _id: ObjectId,
  authorId: ObjectId (Required, Indexed, Ref: users),
  title: String (Required),
  content: String (Required),
  tags: [String] (Indexed),
  likesCount: Number (Default: 0),
  commentsCount: Number (Default: 0),
  createdAt: Date (Default: Now, Indexed),
  updatedAt: Date (Default: Now)
}
Indexes: 
  db.forumPosts.createIndex({ authorId: 1 });
  db.forumPosts.createIndex({ tags: 1 });
  db.forumPosts.createIndex({ createdAt: -1 });
*/
db.forumPosts.insertMany([
  {
    _id: ObjectId("60d5f0a0a1b2c3a4b5d6e831"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    title: "Cách triển khai giao diện người dùng hiện đại với React Native",
    content: "Tôi đang tìm kiếm các giải pháp UX/UI hiện đại cho ứng dụng di động React Native. Các bạn có kinh nghiệm hoặc đề xuất gì không? Đặc biệt quan tâm đến animation và performance.",
    tags: ["UI/UX", "Mobile", "Design", "React Native", "Performance"],
    likesCount: 24,
    commentsCount: 2, // Sẽ cập nhật khi thêm comment
    createdAt: new Date("2025-04-15T10:30:00Z"),
    updatedAt: new Date("2025-04-16T11:00:00Z")
  },
  {
    _id: ObjectId("60d5f0a0a1b2c3a4b5d6e832"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), // Binh Tran
    title: "Thảo luận về Design System: Nên tự xây dựng hay dùng thư viện?",
    content: "Team mình đang phân vân giữa việc xây dựng Design System riêng từ đầu hoặc sử dụng một thư viện có sẵn như Material UI (adapt cho RN) hoặc các bộ UI kit khác. Mọi người chia sẻ ưu nhược điểm giúp mình với!",
    tags: ["Design System", "UI/UX", "React Native", "Frontend"],
    likesCount: 18,
    commentsCount: 1, // Sẽ cập nhật khi thêm comment
    createdAt: new Date("2025-04-14T14:45:00Z"),
    updatedAt: new Date("2025-04-14T14:45:00Z")
  },
  {
    _id: ObjectId("60d5f0a0a1b2c3a4b5d6e833"),
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), // Cuong Le
    title: "Kinh nghiệm quản lý dự án Agile trong team remote",
    content: "Chia sẻ kinh nghiệm áp dụng Agile/Scrum hiệu quả cho các team làm việc từ xa. Các công cụ, quy trình nào mọi người thấy hữu ích?",
    tags: ["Agile", "Scrum", "Project Management", "Remote Work"],
    likesCount: 35,
    commentsCount: 0,
    createdAt: new Date("2025-04-13T09:15:00Z"),
    updatedAt: new Date("2025-04-13T09:15:00Z")
  }
]);
print("ForumPosts Collection: Schema described & mock data inserted.");

// ---- 7. ForumComments Collection ----
/*
Schema: forumComments
{
  _id: ObjectId,
  postId: ObjectId (Required, Indexed, Ref: forumPosts),
  authorId: ObjectId (Required, Indexed, Ref: users),
  content: String (Required),
  likesCount: Number (Default: 0), // Optional: if comments can be liked
  createdAt: Date (Default: Now, Indexed),
  updatedAt: Date (Default: Now)
}
Indexes: 
  db.forumComments.createIndex({ postId: 1, createdAt: 1 }); // Get comments per post, oldest first
  db.forumComments.createIndex({ authorId: 1 });
*/
db.forumComments.insertMany([
  {
    postId: ObjectId("60d5f0a0a1b2c3a4b5d6e831"), // Post "Cách triển khai..."
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), // Binh Tran
    content: "Mình thấy dùng Lottie cho animation khá hiệu quả và nhẹ nhàng đó An.",
    likesCount: 5,
    createdAt: new Date("2025-04-15T11:00:00Z"),
    updatedAt: new Date("2025-04-15T11:00:00Z")
  },
  {
    postId: ObjectId("60d5f0a0a1b2c3a4b5d6e831"), // Post "Cách triển khai..."
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f4"), // Dung Pham
    content: "Về performance, nên chú ý dùng FlatList thay vì ScrollView cho danh sách dài, và dùng useMemo/useCallback hợp lý.",
    likesCount: 8,
    createdAt: new Date("2025-04-16T09:00:00Z"),
    updatedAt: new Date("2025-04-16T09:00:00Z")
  },
  {
    postId: ObjectId("60d5f0a0a1b2c3a4b5d6e832"), // Post "Thảo luận về Design System..."
    authorId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    content: "Mình nghĩ tùy quy mô dự án. Dự án nhỏ hoặc MVP thì dùng thư viện cho nhanh. Dự án lớn, dài hạn thì nên xây dựng riêng để kiểm soát tốt hơn.",
    likesCount: 10,
    createdAt: new Date("2025-04-14T15:30:00Z"),
    updatedAt: new Date("2025-04-14T15:30:00Z")
  }
]);
print("ForumComments Collection: Schema described & mock data inserted.");

// Cập nhật commentsCount cho forumPosts (Ví dụ thủ công)
db.forumPosts.updateOne({ _id: ObjectId("60d5f0a0a1b2c3a4b5d6e831") }, { $set: { commentsCount: 2 } });
db.forumPosts.updateOne({ _id: ObjectId("60d5f0a0a1b2c3a4b5d6e832") }, { $set: { commentsCount: 1 } });
print("ForumPosts Collection: commentsCount updated manually.");

// ---- 8. UserLikesPost Collection ----
/*
Schema: userLikesPost (Relationship Table)
{
  _id: ObjectId,
  userId: ObjectId (Required, Ref: users),
  postId: ObjectId (Required, Ref: forumPosts),
  createdAt: Date (Default: Now)
}
Compound Index: 
  db.userLikesPost.createIndex({ userId: 1, postId: 1 }, { unique: true });
*/
db.userLikesPost.insertMany([
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e831"), createdAt: new Date("2025-04-15T10:35:00Z") }, // Binh likes An's post
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f4"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e831"), createdAt: new Date("2025-04-15T11:00:00Z") }, // Dung likes An's post
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e832"), createdAt: new Date("2025-04-14T15:00:00Z") }, // An likes Binh's post
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e833"), createdAt: new Date("2025-04-13T10:00:00Z") }, // An likes Cuong's post
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), postId: ObjectId("60d5f0a0a1b2c3a4b5d6e833"), createdAt: new Date("2025-04-13T10:05:00Z") }  // Binh likes Cuong's post
]);
print("UserLikesPost Collection: Schema described & mock data inserted.");

// ---- 9. Documents Collection ----
/*
Schema: documents
{
  _id: ObjectId,
  createdBy: ObjectId (Required, Indexed, Ref: users),
  projectId: ObjectId (Optional, Indexed, Ref: projects),
  title: String (Required),
  description: String (Optional),
  type: String (Required, Indexed), // e.g., 'pdf', 'docx', 'xlsx', 'png', 'jpg', 'txt'
  sizeBytes: Number (Required), 
  storageUrl: String (Required), // URL to file in cloud storage (e.g., S3)
  tags: [String] (Indexed),
  sharedWith: [ // Define sharing permissions
    {
      userId: ObjectId (Ref: users),
      permission: String (Enum: 'read', 'edit') 
    }
  ],
  createdAt: Date (Default: Now, Indexed),
  updatedAt: Date (Default: Now, Indexed)
}
Indexes: 
  db.documents.createIndex({ createdBy: 1 });
  db.documents.createIndex({ projectId: 1 });
  db.documents.createIndex({ type: 1 });
  db.documents.createIndex({ tags: 1 });
  db.documents.createIndex({ createdAt: -1 });
  db.documents.createIndex({ updatedAt: -1 });
  db.documents.createIndex({ "sharedWith.userId": 1 });
*/
db.documents.insertMany([
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e841"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e801"), // Project Alpha
    title: "Báo cáo tiến độ dự án Alpha - Tháng 4",
    description: "Tổng hợp công việc đã hoàn thành và kế hoạch tháng 5.",
    type: "pdf",
    sizeBytes: 1258291, // ~1.2 MB
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/docs/alpha_report_apr.pdf",
    tags: ["báo cáo", "project alpha", "tiến độ"],
    sharedWith: [
      { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), permission: "read" } // Share read-only with Cuong
    ],
    createdAt: new Date("2025-04-18T10:00:00Z"),
    updatedAt: new Date("2025-04-18T10:00:00Z")
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e842"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), // Binh Tran
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e801"), // Project Alpha
    title: "Thiết kế UI Kit - Project Alpha",
    description: "Bộ thành phần giao diện cho dự án Alpha.",
    type: "fig", // Giả sử là file Figma (hoặc link)
    sizeBytes: 5242880, // ~5 MB
    storageUrl: "https://www.figma.com/file/xyz...", 
    tags: ["design", "ui kit", "project alpha", "figma"],
     sharedWith: [
      { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), permission: "edit" }, // Share edit with An
      { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), permission: "read" }  // Share read with Cuong
    ],
    createdAt: new Date("2024-03-15T14:00:00Z"),
    updatedAt: new Date("2024-04-10T16:30:00Z")
  },
  {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e843"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7f4"), // Dung Pham
    projectId: ObjectId("60d5ed0aa1b2c3a4b5d6e802"), // Project Beta
    title: "Tài liệu API Người dùng v2",
    description: "Mô tả chi tiết các endpoint API cho module User.",
    type: "docx",
    sizeBytes: 314572, // ~300 KB
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/docs/user_api_v2.docx",
    tags: ["api", "tài liệu", "project beta", "backend"],
    sharedWith: [],
    createdAt: new Date("2024-04-14T09:00:00Z"),
    updatedAt: new Date("2024-04-18T09:00:00Z")
  },
    {
    _id: ObjectId("60d5f23ba1b2c3a4b5d6e844"),
    createdBy: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    title: "Ghi chú cuộc họp 10/04",
    description: "Nội dung trao đổi về kế hoạch Sprint 5.",
    type: "txt",
    sizeBytes: 10240, // 10 KB
    storageUrl: "https://your-storage-bucket.s3.amazonaws.com/notes/meeting_notes_apr10.txt",
    tags: ["họp", "ghi chú"],
    sharedWith: [],
    createdAt: new Date("2025-04-10T11:30:00Z"),
    updatedAt: new Date("2025-04-10T11:30:00Z")
  }
]);
print("Documents Collection: Schema described & mock data inserted.");

// ---- 10. UserFavoritesDocument Collection ----
/*
Schema: userFavoritesDocument (Relationship Table)
{
  _id: ObjectId,
  userId: ObjectId (Required, Ref: users),
  documentId: ObjectId (Required, Ref: documents),
  createdAt: Date (Default: Now)
}
Compound Index: 
  db.userFavoritesDocument.createIndex({ userId: 1, documentId: 1 }, { unique: true });
*/
db.userFavoritesDocument.insertMany([
  // An favorites the API doc and the UI Kit
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e843"), createdAt: new Date("2025-04-15T08:00:00Z") },
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e842"), createdAt: new Date("2025-04-16T09:00:00Z") },
  // Binh favorites the UI Kit
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e842"), createdAt: new Date("2025-04-11T10:00:00Z") },
   // Cuong favorites the Alpha report
  { userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), documentId: ObjectId("60d5f23ba1b2c3a4b5d6e841"), createdAt: new Date("2025-04-18T11:00:00Z") }
]);
print("UserFavoritesDocument Collection: Schema described & mock data inserted.");

// ---- 11. Notifications Collection ----
/*
Schema: notifications
{
  _id: ObjectId,
  userId: ObjectId (Required, Indexed, Ref: users), // Recipient
  type: String (Required, Indexed, Enum: 'reminder', 'comment', 'task', 'document', 'message', 'mention', 'project'),
  title: String (Required),
  message: String (Required),
  read: Boolean (Default: false, Indexed),
  relatedEntity: { // Link to the source
    entityType: String (Enum: 'task', 'project', 'post', 'comment', 'document', 'user'),
    entityId: ObjectId 
  },
  createdAt: Date (Default: Now, Indexed)
}
Indexes: 
  db.notifications.createIndex({ userId: 1, read: 1, createdAt: -1 }); // Primary query: Get unread/all for user, newest first
  db.notifications.createIndex({ userId: 1, type: 1 });
  db.notifications.createIndex({ createdAt: -1 });
*/
db.notifications.insertMany([
  // Notification for An about Binh's comment
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    type: "comment",
    title: "Bình luận mới trên bài đăng của bạn",
    message: 'Trần Thị Bình đã bình luận về "Cách triển khai giao diện người dùng hiện đại..."',
    read: false,
    relatedEntity: { entityType: "post", entityId: ObjectId("60d5f0a0a1b2c3a4b5d6e831") },
    createdAt: new Date("2025-04-15T11:00:01Z") // Slightly after the comment
  },
  // Notification for An about Dung's comment
   {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    type: "comment",
    title: "Bình luận mới trên bài đăng của bạn",
    message: 'Phạm Thị Dung đã bình luận về "Cách triển khai giao diện người dùng hiện đại..."',
    read: false,
    relatedEntity: { entityType: "post", entityId: ObjectId("60d5f0a0a1b2c3a4b5d6e831") },
    createdAt: new Date("2025-04-16T09:00:01Z")
  },
  // Notification for Binh about An's comment
   {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f2"), // Binh Tran
    type: "comment",
    title: "Bình luận mới trên bài đăng của bạn",
    message: 'Nguyễn Văn An đã bình luận về "Thảo luận về Design System..."',
    read: true, // Giả sử Bình đã đọc
    relatedEntity: { entityType: "post", entityId: ObjectId("60d5f0a0a1b2c3a4b5d6e832") },
    createdAt: new Date("2025-04-14T15:30:01Z") 
  },
  // Notification for An about upcoming task due date
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    type: "reminder",
    title: "Nhắc nhở công việc sắp hết hạn",
    message: 'Công việc "Hoàn thành báo cáo tháng 4" sắp đến hạn vào ngày mai.',
    read: false,
    relatedEntity: { entityType: "task", entityId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1") }, // Assuming task ID is the same as user for simplicity here, fix if needed
    createdAt: new Date("2025-04-24T08:00:00Z") 
  },
  // Notification for Cuong about document shared by An
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f3"), // Cuong Le
    type: "document",
    title: "Tài liệu mới được chia sẻ",
    message: 'Nguyễn Văn An đã chia sẻ tài liệu "Báo cáo tiến độ dự án Alpha - Tháng 4" với bạn.',
    read: false,
    relatedEntity: { entityType: "document", entityId: ObjectId("60d5f23ba1b2c3a4b5d6e841") },
    createdAt: new Date("2025-04-18T10:00:01Z") 
  },
   // Notification for An about being added to Project Beta (example)
  {
    userId: ObjectId("60d5ec49a1b2c3a4b5d6e7f1"), // An Nguyen
    type: "project",
    title: "Bạn đã được thêm vào dự án mới",
    message: 'Lê Minh Cường đã thêm bạn vào dự án "Project Beta".',
    read: true, 
    relatedEntity: { entityType: "project", entityId: ObjectId("60d5ed0aa1b2c3a4b5d6e802") },
    createdAt: new Date("2024-04-01T10:05:00Z") 
  }
]);
print("Notifications Collection: Schema described & mock data inserted.");


// ---- Index Creation ----
// Chạy các lệnh này sau khi đã chèn dữ liệu hoặc chạy trước nếu collection đã tồn tại
// (insertMany tự động tạo collection nếu chưa có)
print("Creating indexes (ignore errors if indexes already exist)...");
db.users.createIndex({ email: 1 }, { unique: true });

db.tasks.createIndex({ userId: 1 });
db.tasks.createIndex({ projectId: 1 });
db.tasks.createIndex({ completed: 1 });
db.tasks.createIndex({ priority: 1 });
db.tasks.createIndex({ dueDate: 1 });

db.projects.createIndex({ ownerId: 1 });
db.projects.createIndex({ memberIds: 1 });
db.projects.createIndex({ status: 1 });

db.chats.createIndex({ participants: 1 });
db.chats.createIndex({ updatedAt: -1 });

db.chatMessages.createIndex({ chatId: 1, timestamp: -1 }); 
db.chatMessages.createIndex({ senderId: 1 });
db.chatMessages.createIndex({ timestamp: -1 });

db.forumPosts.createIndex({ authorId: 1 });
db.forumPosts.createIndex({ tags: 1 });
db.forumPosts.createIndex({ createdAt: -1 });

db.forumComments.createIndex({ postId: 1, createdAt: 1 }); 
db.forumComments.createIndex({ authorId: 1 });

db.userLikesPost.createIndex({ userId: 1, postId: 1 }, { unique: true });

db.documents.createIndex({ createdBy: 1 });
db.documents.createIndex({ projectId: 1 });
db.documents.createIndex({ type: 1 });
db.documents.createIndex({ tags: 1 });
db.documents.createIndex({ createdAt: -1 });
db.documents.createIndex({ updatedAt: -1 });
db.documents.createIndex({ "sharedWith.userId": 1 });

db.userFavoritesDocument.createIndex({ userId: 1, documentId: 1 }, { unique: true });

db.notifications.createIndex({ userId: 1, read: 1, createdAt: -1 }); 
db.notifications.createIndex({ userId: 1, type: 1 });
db.notifications.createIndex({ createdAt: -1 });

print("----- MongoDB Setup Script Finished -----"); 