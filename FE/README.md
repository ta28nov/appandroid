# Digital Workspace Pro - Ứng dụng Quản lý Công việc Mobile

## Tổng quan

Digital Workspace Pro là một ứng dụng di động được phát triển bằng React Native và TypeScript, nhằm cung cấp giải pháp toàn diện cho quản lý công việc, tài liệu, giao tiếp nhóm và quản lý tác vụ. Ứng dụng được thiết kế với giao diện người dùng hiện đại, hỗ trợ chế độ sáng/tối và có thể hoạt động trên cả nền tảng iOS và Android.

## Cấu trúc dự án

Dự án được tổ chức theo cấu trúc thư mục sau:

```
src/
├── assets/          # Tài nguyên tĩnh như hình ảnh, font chữ
├── components/      # Các component có thể tái sử dụng
│   ├── common/      # Component dùng chung trong toàn ứng dụng
│   └── feature-specific/ # Component dành riêng cho tính năng cụ thể
├── config/          # Cấu hình ứng dụng
├── contexts/        # React Context cho quản lý state toàn cục
├── hooks/           # Custom hooks
├── navigation/      # Cấu hình điều hướng và định tuyến
├── screens/         # Các màn hình của ứng dụng
│   ├── Auth/        # Màn hình xác thực (đăng nhập, đăng ký)
│   └── Main/        # Màn hình chính của ứng dụng sau khi đăng nhập
├── styles/          # Kiểu dáng và theme toàn cục
├── types/           # Định nghĩa TypeScript
└── utils/           # Các tiện ích và hàm hỗ trợ
```

## Các tính năng chính

### 1. Hệ thống xác thực (Authentication)

- **Đăng nhập**: Xác thực người dùng với email và mật khẩu
- **Đăng ký**: Tạo tài khoản mới
- **Quên mật khẩu**: Khôi phục mật khẩu qua email

### 2. Màn hình Trang chủ (Dashboard)

- **Tổng quan thống kê**: Hiển thị số liệu về công việc, tài liệu và hoạt động
- **Tiến độ công việc**: Thanh tiến độ trực quan hiển thị tỉ lệ hoàn thành
- **Biểu đồ hoạt động**: Biểu đồ đường, biểu đồ tròn và biểu đồ cột
- **Thời tiết**: Hiển thị thông tin thời tiết hiện tại
- **Công việc gần đây**: Danh sách các tác vụ gần đây

### 3. Quản lý Tài liệu

- **Xem danh sách**: Hiển thị tài liệu dưới dạng danh sách hoặc lưới
- **Lọc & tìm kiếm**: Lọc theo danh mục (tất cả, gần đây, đã chia sẻ, yêu thích)
- **Quản lý tài liệu**: Tạo, xem, chia sẻ, xóa tài liệu
- **Đánh dấu yêu thích**: Thêm/xóa tài liệu khỏi danh sách yêu thích

### 4. Quản lý Công việc

- **Danh sách công việc**: Xem và quản lý các tác vụ
- **Thêm công việc mới**: Tạo tác vụ với tiêu đề, mức độ ưu tiên và ngày hạn
- **Đánh dấu hoàn thành**: Theo dõi tiến độ bằng cách đánh dấu tác vụ đã hoàn thành
- **Xóa công việc**: Loại bỏ tác vụ không cần thiết

### 5. Diễn đàn & Trao đổi

- **Xem bài đăng**: Danh sách các bài viết trên diễn đàn
- **Lọc theo chủ đề**: Các thẻ tag để phân loại bài viết
- **Tương tác**: Thích và bình luận bài viết

### 6. Nhắn tin

- **Danh sách chat**: Xem tất cả các cuộc trò chuyện
- **Tìm kiếm**: Tìm kiếm theo tên người dùng hoặc nội dung tin nhắn
- **Trạng thái**: Hiển thị người dùng đang trực tuyến/ngoại tuyến
- **Tin nhắn chưa đọc**: Đánh dấu và hiển thị số tin nhắn chưa đọc

### 7. Thông báo

- **Xem thông báo**: Danh sách tất cả thông báo
- **Phân loại**: Lọc theo loại thông báo (nhắc nhở, bình luận, công việc, tài liệu, tin nhắn)
- **Đánh dấu đã đọc**: Quản lý trạng thái đọc của thông báo

## Công nghệ sử dụngs

- **React Native**: Framework phát triển ứng dụng đa nền tảng
- **TypeScript**: Ngôn ngữ lập trình tăng cường khả năng type-safe
- **React Navigation**: Thư viện điều hướng giữa các màn hình
- **Context API**: Quản lý state toàn cục cho xác thực và theme
- **React Native Vector Icons**: Thư viện biểu tượng
- **Victory Native**: Thư viện vẽ biểu đồ

## Kế hoạch phát triển tiếp theo

1. Kết nối với backend API thực tế
2. Thêm chức năng đồng bộ offline
3. Tối ưu hiệu suất
4. Thêm tính năng thông báo đẩy (push notifications)
5. Cải thiện UX/UI dựa trên phản hồi người dùng
6. **Quản lý Dự án**: Gom nhóm công việc và tài liệu theo dự án.
7. **Lịch & Lên lịch**: Tích hợp chế độ xem lịch cho công việc và sự kiện.
8. **Quản lý Nhóm**: Cho phép tạo nhóm, thêm thành viên và phân quyền.
9. **Cải thiện Tìm kiếm**: Triển khai tìm kiếm nâng cao trên toàn bộ ứng dụng.
10. **Tích hợp bên thứ ba**: Kết nối với các dịch vụ khác (ví dụ: Lịch Google, Drive).
11. **Tích hợp AI**: Sử dụng AI để phân tích nội dung, đề xuất giải pháp và tối ưu hóa quy trình làm việc.
12. **Quản lý Phiên bản Tài liệu**: Thêm chức năng theo dõi và quản lý các phiên bản của tài liệu.
13. **Quản lý Hồ sơ Nâng cao**: Cho phép người dùng cập nhật chi tiết hồ sơ cá nhân và quản lý cài đặt quyền riêng tư.

## Hướng dẫn phát triển

### Cài đặt dự án

```bash
# Clone repository
git clone [url-repo]

# Di chuyển vào thư mục dự án
cd androidapp

# Cài đặt dependencies
npm install
```

### Chạy ứng dụng

```bash
# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Chạy trên web
npm run web
```

## Tài khoản thử nghiệm

Để thử nghiệm ứng dụng, bạn có thể sử dụng tài khoản mẫu:

- **Email**: an.nguyen@example.com
- **Mật khẩu**: 123456

## Lưu ý phát triển

1. Ứng dụng hiện sử dụng dữ liệu mẫu (mock data) thay vì gọi API thực tế
2. Chức năng xác thực hiện chỉ mô phỏng và không kết nối với backend thực tế
3. Ứng dụng hỗ trợ chế độ sáng/tối thông qua ThemeContext
4. Các component có thể tái sử dụng được tổ chức trong thư mục components

## Kiến trúc ứng dụng

### Quản lý state

- **AuthContext**: Quản lý trạng thái xác thực người dùng
- **ThemeContext**: Quản lý theme sáng/tối
- **Local State**: Sử dụng React Hooks (useState, useEffect) trong các component

### Điều hướng

Ứng dụng sử dụng React Navigation với cấu trúc sau:

- **AppNavigator**: Điều hướng cấp cao nhất, xác định luồng xác thực
- **AuthNavigator**: Điều hướng giữa các màn hình xác thực (đăng nhập, đăng ký, quên mật khẩu)
- **MainNavigator**: Điều hướng giữa các tab chính sau khi đăng nhập (trang chủ, tài liệu, công việc, diễn đàn, chat)

### Style & Theme

- **Theme**: Hệ thống theme với các màu sắc, font, và kích thước nhất quán
- **Global Styles**: Các style được tái sử dụng trong toàn ứng dụng
- **Component Styles**: Style cụ thể cho từng component

1. Các Tính Năng AI Tiềm Năng (Ngoài Chatbot):
   Tóm tắt Thông minh:
   Tài liệu: Nút "Tóm tắt bằng AI" trong màn hình chi tiết tài liệu để người dùng nắm nhanh ý chính.
   Thảo luận: Tóm tắt các chủ đề dài trên Diễn đàn.
   Đề xuất Thông minh:
   Công việc: Gợi ý mức độ ưu tiên, người thực hiện phù hợp, hoặc tự động phân rã công việc lớn.
   Tìm kiếm: Khi tìm kiếm, AI gợi ý các tài liệu/công việc/thảo luận liên quan mà người dùng có thể đã bỏ qua.
   Liên kết: Tự động gợi ý liên kết giữa các công việc và tài liệu liên quan.
   Phân tích & Cảnh báo:
   Phân tích tiến độ dự án (nếu có) và cảnh báo sớm về nguy cơ chậm deadline.
   Phát hiện các công việc bị trùng lặp hoặc có nội dung tương tự.

🎨🌟 Bộ UI/UX Hoàn chỉnh cho Digital Workplace (Modern & Bright)

Thành phần Màu gốc Hover Active/Focus
Header background #FAFAFA không đổi bóng mờ nhẹ (shadow)
Header text #2979FF #1C5DCC (tối nhẹ lại) gạch dưới (underline)
Background tổng thể #FAFAFA + #E0E0E0 làm mờ nhẹ khi hover section
Button chính (Primary) nền #2979FF, text #FFFFFF nền #1C5DCC, text #FFFFFF nền #004AAD
Button phụ (Secondary) nền #A0C4FF, text #2979FF nền #7EB8FF, text #2979FF nền #5AA4FF
CTA nổi bật nền #FFC300, text #424242 nền #FFB000, text #424242 nền #FF9F00
Text chính #424242 #2979FF khi hover link
Card viền/hover viền #2979FF viền đậm hơn + đổ bóng nhẹ shadow nổi bật hơn
Icon chính #2979FF đổi #1C5DCC khi hover
Icon phụ #A0C4FF #7EB8FF khi hover
✍️ Kiểu chữ đề xuất:

Loại text Font Family Font Weight Size
Tiêu đề lớn (H1) Poppins, sans-serif 700 (bold) 28–32px
Tiêu đề nhỏ (H2–H3) Poppins, sans-serif 600 (semi-bold) 20–24px
Nội dung chính Inter, sans-serif 400–500 14–16px
CTA/Buttons Inter hoặc Poppins 600 (semi-bold) 16px
Subtext/phụ đề Inter 400 12–14px
✅ Poppins → tròn nhẹ, hiện đại, thoáng đẹp.
✅ Inter → chữ body mảnh gọn, đọc rất sướng mắt trong app/business.

✨ Các hiệu ứng giao diện nên có:

Hiệu ứng Mô tả
Hover Button nền đậm hơn 10–15%, nhẹ nhàng (transition 0.3s)
Card Hover shadow nhẹ (0 2px 8px rgba(41,121,255,0.2)), scale 1.02
Link Hover màu text đổi sang #2979FF, underline mảnh
Input Focus viền #2979FF, glow nhẹ xung quanh input
Animation nhỏ fade-in nhẹ (opacity + move up 10px) khi load component
