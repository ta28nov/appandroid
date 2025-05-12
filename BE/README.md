# Digital Workspace - Backend API

Backend API cho ứng dụng Không gian làm việc số, được xây dựng bằng Node.js, Express, và MongoDB.

## Mục lục

- [Yêu cầu](#yêu-cầu)
- [Cài đặt](#cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Biến môi trường](#biến-môi-trường)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Tài liệu API](#tài-liệu-api)
- [Tài khoản mẫu để test](#tài-khoản-mẫu-để-test)

## Yêu cầu

- [Node.js](https://nodejs.org/) (>= 16.x)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance hoặc Atlas cluster)

## Cài đặt

1.  **Clone repository (nếu có) hoặc di chuyển vào thư mục `BE`:**
    ```bash
    cd BE
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    # hoặc
    yarn install
    ```

3.  **Thiết lập biến môi trường:**
    *   Tạo một file `.env` trong thư mục gốc `BE`.
    *   Sao chép nội dung từ `.env.example` (Bạn cần tự tạo file này nếu chưa có) vào `.env`:
        ```dotenv
        PORT=5001
        MONGODB_URI=mongodb://localhost:27017/digital_workspace_db
        JWT_SECRET=your_super_secret_key_change_this
        ```
    *   Chỉnh sửa các giá trị trong `.env` cho phù hợp với môi trường của bạn.

## Chạy ứng dụng

-   **Chế độ Development (với nodemon, tự động restart khi có thay đổi):**
    ```bash
    npm run dev
    # hoặc
    yarn dev
    ```

-   **Chế độ Production:**
    ```bash
    npm start
    # hoặc
    yarn start
    ```

Ứng dụng sẽ chạy trên cổng được định nghĩa trong file `.env` (ví dụ: `http://localhost:5001`).

## Biến môi trường

Các biến môi trường cần thiết được định nghĩa trong file `.env`:

-   `PORT`: Cổng mà server Express sẽ lắng nghe.
-   `MONGODB_URI`: Chuỗi kết nối MongoDB.
-   `JWT_SECRET`: Khóa bí mật để tạo và xác minh JWT.

## Cấu trúc thư mục

```
BE/
├── src/
│   ├── config/       # Cấu hình (db.js)
│   ├── controllers/  # Logic xử lý request/response (authController.js, userController.js, ...)
│   ├── middleware/   # Middleware (authMiddleware.js, errorMiddleware.js, uploadMiddleware.js)
│   ├── models/       # Mongoose models (User.js, Task.js, Project.js, ...)
│   ├── routes/       # Định nghĩa các routes API (authRoutes.js, userRoutes.js, ...)
│   ├── services/     # (Tùy chọn) Logic nghiệp vụ phức tạp (vd: cloudStorageService.js)
│   ├── utils/        # Các hàm tiện ích (generateToken.js)
│   └── server.js     # Entry point của ứng dụng
├── .env              # Biến môi trường (không commit)
├── .env.example      # Mẫu biến môi trường (cần tạo thủ công)
├── .gitignore        # Các file/thư mục bị bỏ qua bởi Git
├── package.json      # Metadata và dependencies
└── README.md         # Tài liệu hướng dẫn
```

Tổng hợp API đã có trong BE
Authentication (/api/auth)
POST /auth/register: Đăng ký user mới
POST /auth/login: Đăng nhập, nhận token
GET /auth/me: Lấy thông tin user hiện tại (yêu cầu token)
Users (/api/users)
GET /users/me: Lấy thông tin user hiện tại
PUT /users/me: Cập nhật thông tin user hiện tại
GET /users/search: Tìm kiếm user theo tên/email
GET /users/:id: Lấy thông tin public của user khác
Tasks (/api/tasks)
GET /tasks: Lấy danh sách tasks (filter, pagination)
POST /tasks: Tạo task mới
GET /tasks/:id: Lấy chi tiết task
PUT /tasks/:id: Cập nhật task
DELETE /tasks/:id: Xóa task
Projects (/api/projects)
GET /projects: Lấy danh sách projects user là thành viên
POST /projects: Tạo project mới
GET /projects/:id: Lấy chi tiết project
PUT /projects/:id: Cập nhật project
DELETE /projects/:id: Xóa project
POST /projects/:id/members: Thêm thành viên vào project
DELETE /projects/:id/members/:userId: Xóa thành viên khỏi project
GET /projects/:id/tasks: Lấy danh sách tasks của project
Chats (/api/chats)
GET /chats: Lấy danh sách chat của user
POST /chats: Tạo hoặc lấy chat 1-1 với user khác
GET /chats/:chatId/messages: Lấy tin nhắn trong chat
POST /chats/:chatId/messages: Gửi tin nhắn
Forum (/api/forum)
GET /forum/posts: Lấy danh sách bài đăng
POST /forum/posts: Tạo bài đăng mới
GET /forum/posts/:postId: Lấy chi tiết bài đăng
PUT /forum/posts/:postId: Cập nhật bài đăng
DELETE /forum/posts/:postId: Xóa bài đăng
POST /forum/posts/:postId/like: Like/unlike bài đăng
GET /forum/posts/:postId/comments: Lấy bình luận của bài đăng
POST /forum/posts/:postId/comments: Tạo bình luận mới
DELETE /forum/comments/:commentId: Xóa bình luận
GET /forum/tags: Lấy danh sách tags
Documents (/api/documents)
GET /documents: Lấy danh sách tài liệu user có quyền truy cập
POST /documents: Upload tài liệu mới
GET /documents/:id: Lấy metadata tài liệu
GET /documents/:id/download: Lấy URL download
PUT /documents/:id: Cập nhật metadata tài liệu
DELETE /documents/:id: Xóa tài liệu
POST /documents/:id/share: Chia sẻ tài liệu
POST /documents/:id/favorite: Yêu thích/bỏ yêu thích tài liệu
Notifications (/api/notifications)
GET /notifications: Lấy danh sách thông báo
POST /notifications/read: Đánh dấu các thông báo đã đọc
POST /notifications/read-all: Đánh dấu tất cả đã đọc
DELETE /notifications: Xóa tất cả thông báo
DELETE /notifications/:id: Xóa thông báo cụ thể

*(Chi tiết về request body, response format và các mã lỗi có thể xem trực tiếp trong code controllers hoặc sử dụng công cụ như Postman/Insomnia để kiểm thử)*

---

## Tài khoản mẫu để test

Bạn có thể sử dụng các tài khoản mẫu sau để đăng nhập và kiểm thử ứng dụng (mật khẩu mặc định: 123456):

| Tên người dùng     | Email                  | Mật khẩu  | Vai trò   |
|--------------------|------------------------|-----------|-----------|
| Nguyễn Văn An      | an.nguyen@example.com  | 123456    | user      |
| Trần Bình          | binh.tran@example.com  | 123456    | user      |
| Lê Minh            | minh.le@example.com    | 123456    | user      |
| Phạm Hà            | ha.pham@example.com    | 123456    | user      |
| Dung Pham          | dung.pham@example.com  | 123456    | user      |
| Hoàng Minh Tuấn    | tuan.hoang@example.com | 123456    | user      |
| Nguyễn Thị Mai     | mai.nguyen@example.com | 123456    | user      |
| Vũ Quốc Đạt        | dat.vu@example.com     | 123456    | user      |
| Lê Thị Hồng        | hong.le@example.com    | 123456    | user      |
| Trần Văn Cường     | cuong.tran@example.com | 123456    | user      |

> Lưu ý: Nếu bạn muốn thêm nhiều tài khoản hơn, hãy chỉnh sửa file mongodb_setup.js và chạy lại script để cập nhật dữ liệu.

---

3. Mức độ "Sẵn sàng sử dụng" và Những điểm cần hoàn thiện:
Backend này là một nền tảng vững chắc và có thể chạy được, nhưng chưa phải là hoàn chỉnh 100% để đưa vào sử dụng thực tế ngay lập tức. Các điểm quan trọng cần bạn hoàn thiện thêm bao gồm:
Xử lý Upload File thực tế: Phần quan trọng nhất còn thiếu là logic thực tế để upload file lên cloud storage (S3, Google Cloud Storage, Cloudinary,...) trong src/controllers/documentController.js. Hiện tại chỉ là placeholder. Bạn cần thay thế các hàm uploadFileToCloud, deleteFileFromCloud, getPresignedUrl bằng logic thực tế sử dụng SDK của dịch vụ cloud bạn chọn.
Tạo và Gửi Notification Real-time: Logic tạo notification trong DB đã có (thông qua hàm createNotification), nhưng việc gửi thông báo đó tới client ngay lập tức (real-time) cần được triển khai thêm, thường là sử dụng WebSockets (ví dụ: Socket.IO). Bạn cần tích hợp Socket.IO vào server.js và phát sự kiện notification khi hàm createNotification được gọi.
Xử lý Xóa Dependencies: Khi xóa một project hoặc một bài đăng forum, logic hiện tại chưa xử lý việc xóa các task/document/comment/like liên quan. Bạn cần quyết định chiến lược (xóa theo, bỏ liên kết, hay chặn xóa) và triển khai nó trong các hàm deleteProject, deleteForumPost.
Validation Đầu vào Chi tiết: Nên bổ sung validation chi tiết hơn cho request body và query params (ví dụ dùng express-validator) để đảm bảo dữ liệu đầu vào luôn đúng định dạng và hợp lệ.
Phân quyền Chi tiết hơn: Logic phân quyền hiện tại khá cơ bản (kiểm tra owner, member). Tùy theo yêu cầu, bạn có thể cần thêm vai trò (admin) hoặc các quyền chi tiết hơn (ví dụ: member có được mời member khác không?).



Hiện tại, một số màn hình trong FE vẫn đang import và sử dụng mockData, cụ thể là:

DocumentScreen.tsx
NotificationScreen.tsx
HomeScreen.tsx
GlobalSearchResultsScreen.tsx
Để đảm bảo mọi thứ kết nối đúng chuẩn với API BE và không còn dùng mockData, mình sẽ:

Loại bỏ mọi import và sử dụng mockData ở các màn hình trên.
Thay thế bằng gọi API thật (dùng axios từ services/api.ts).
Đảm bảo mọi thao tác lấy dữ liệu, phân trang, tìm kiếm, upload/download file, notification... đều lấy từ BE.
Mình sẽ tự động sửa lần lượt các file này, bắt đầu với DocumentScreen.tsx.