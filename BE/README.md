# Digital Workspace - Backend API

Backend API cho ứng dụng Không gian làm việc số, được xây dựng bằng Node.js, Express, và MongoDB.

## Mục lục

- [Yêu cầu](#yêu-cầu)
- [Cài đặt](#cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Biến môi trường](#biến-môi-trường)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Tài liệu API](#tài-liệu-api)

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

## Tài liệu API

API base URL: `/api`

Xác thực: Sử dụng JWT Bearer token trong `Authorization` header cho các route yêu cầu (`Private`).

### 1. Authentication (`/auth`)

-   `POST /register`: Đăng ký user mới.
-   `POST /login`: Đăng nhập, nhận token.
-   `GET /me`: (Private) Lấy thông tin user hiện tại.

### 2. Users (`/users`)

-   `GET /me`: (Private) Lấy thông tin user hiện tại.
-   `PUT /me`: (Private) Cập nhật thông tin user hiện tại.
-   `GET /search`: (Private) Tìm kiếm user theo tên/email (`?q=query`).
-   `GET /:id`: (Private) Lấy thông tin public của user khác.

### 3. Tasks (`/tasks`)

-   `GET /`: (Private) Lấy danh sách tasks (hỗ trợ filter `projectId`, `completed`, `priority` và pagination `page`, `limit`).
-   `POST /`: (Private) Tạo task mới.
-   `GET /:id`: (Private) Lấy chi tiết task.
-   `PUT /:id`: (Private) Cập nhật task.
-   `DELETE /:id`: (Private) Xóa task.

### 4. Projects (`/projects`)

-   `GET /`: (Private) Lấy danh sách projects user là thành viên.
-   `POST /`: (Private) Tạo project mới.
-   `GET /:id`: (Private) Lấy chi tiết project (chỉ thành viên).
-   `PUT /:id`: (Private) Cập nhật project (chỉ owner).
-   `DELETE /:id`: (Private) Xóa project (chỉ owner).
-   `POST /:id/members`: (Private) Thêm thành viên vào project (chỉ owner).
-   `DELETE /:id/members/:userId`: (Private) Xóa thành viên khỏi project (chỉ owner).
-   `GET /:id/tasks`: (Private) Lấy danh sách tasks của project (chỉ thành viên).

### 5. Chats (`/chats`)

-   `GET /`: (Private) Lấy danh sách chat của user.
-   `POST /`: (Private) Tạo hoặc lấy chat 1-1 với user khác.
-   `GET /:chatId/messages`: (Private) Lấy tin nhắn trong chat (hỗ trợ pagination `limit`, `before`).
-   `POST /:chatId/messages`: (Private) Gửi tin nhắn.

### 6. Forum (`/forum`)

-   `GET /posts`: (Public) Lấy danh sách bài đăng (hỗ trợ filter `tag`, pagination).
-   `POST /posts`: (Private) Tạo bài đăng mới.
-   `GET /posts/:postId`: (Public) Lấy chi tiết bài đăng.
-   `PUT /posts/:postId`: (Private) Cập nhật bài đăng (chỉ author).
-   `DELETE /posts/:postId`: (Private) Xóa bài đăng (chỉ author).
-   `POST /posts/:postId/like`: (Private) Like/unlike bài đăng.
-   `GET /posts/:postId/comments`: (Public) Lấy bình luận của bài đăng.
-   `POST /posts/:postId/comments`: (Private) Tạo bình luận mới.
-   `DELETE /comments/:commentId`: (Private) Xóa bình luận (chỉ author).
-   `GET /tags`: (Public) Lấy danh sách tags duy nhất.

### 7. Documents (`/documents`)

-   `GET /`: (Private) Lấy danh sách tài liệu user có quyền truy cập (hỗ trợ filter, search, pagination).
-   `POST /`: (Private) Upload tài liệu mới (dùng `multipart/form-data`, field `file`).
-   `GET /:id`: (Private) Lấy metadata tài liệu.
-   `GET /:id/download`: (Private) Lấy URL download (placeholder).
-   `PUT /:id`: (Private) Cập nhật metadata tài liệu (chỉ owner).
-   `DELETE /:id`: (Private) Xóa tài liệu (chỉ owner, bao gồm cả file storage - placeholder).
-   `POST /:id/share`: (Private) Chia sẻ tài liệu (chỉ owner).
-   `POST /:id/favorite`: (Private) Yêu thích/bỏ yêu thích tài liệu.

### 8. Notifications (`/notifications`)

-   `GET /`: (Private) Lấy danh sách thông báo (hỗ trợ filter `read`, `type`, pagination).
-   `POST /read`: (Private) Đánh dấu các thông báo cụ thể đã đọc.
-   `POST /read-all`: (Private) Đánh dấu tất cả đã đọc.
-   `DELETE /`: (Private) Xóa tất cả thông báo.
-   `DELETE /:id`: (Private) Xóa thông báo cụ thể.

*(Chi tiết về request body, response format và các mã lỗi có thể xem trực tiếp trong code controllers hoặc sử dụng công cụ như Postman/Insomnia để kiểm thử)*

--- 

3. Mức độ "Sẵn sàng sử dụng" và Những điểm cần hoàn thiện:
Backend này là một nền tảng vững chắc và có thể chạy được, nhưng chưa phải là hoàn chỉnh 100% để đưa vào sử dụng thực tế ngay lập tức. Các điểm quan trọng cần bạn hoàn thiện thêm bao gồm:
Xử lý Upload File thực tế: Phần quan trọng nhất còn thiếu là logic thực tế để upload file lên cloud storage (S3, Google Cloud Storage, Cloudinary,...) trong src/controllers/documentController.js. Hiện tại chỉ là placeholder. Bạn cần thay thế các hàm uploadFileToCloud, deleteFileFromCloud, getPresignedUrl bằng logic thực tế sử dụng SDK của dịch vụ cloud bạn chọn.
Tạo và Gửi Notification Real-time: Logic tạo notification trong DB đã có (thông qua hàm createNotification), nhưng việc gửi thông báo đó tới client ngay lập tức (real-time) cần được triển khai thêm, thường là sử dụng WebSockets (ví dụ: Socket.IO). Bạn cần tích hợp Socket.IO vào server.js và phát sự kiện notification khi hàm createNotification được gọi.
Xử lý Xóa Dependencies: Khi xóa một project hoặc một bài đăng forum, logic hiện tại chưa xử lý việc xóa các task/document/comment/like liên quan. Bạn cần quyết định chiến lược (xóa theo, bỏ liên kết, hay chặn xóa) và triển khai nó trong các hàm deleteProject, deleteForumPost.
Validation Đầu vào Chi tiết: Nên bổ sung validation chi tiết hơn cho request body và query params (ví dụ dùng express-validator) để đảm bảo dữ liệu đầu vào luôn đúng định dạng và hợp lệ.
Phân quyền Chi tiết hơn: Logic phân quyền hiện tại khá cơ bản (kiểm tra owner, member). Tùy theo yêu cầu, bạn có thể cần thêm vai trò (admin) hoặc các quyền chi tiết hơn (ví dụ: member có được mời member khác không?).