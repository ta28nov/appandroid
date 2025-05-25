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




. Thư mục FE/src/screens/Auth
ForgotPasswordScreen.tsx
Vị trí: Hàm handlePasswordReset (hoặc hàm xử lý sự kiện nhấn nút "Gửi link đặt lại").
Cần sửa: Hiện tại, màn hình này có thể chưa thực sự gọi API backend để yêu cầu gửi email đặt lại mật khẩu. Cần đảm bảo rằng có một API (ví dụ: POST /auth/forgot-password) được gọi với email của người dùng.
Kiểm tra lại: Trong lần review trước, chúng ta ghi nhận "hiện tại không kết nối với API backend". Cần bổ sung lệnh gọi API này.
2. Thư mục FE/src/screens/Main
Settings/IntegrationSettingsScreen.tsx
Vị trí: Toàn bộ file, đặc biệt là các hàm xử lý handleConnect, handleDisconnect.
Cần sửa: Màn hình này hiện chỉ giả lập trạng thái kết nối. Cần triển khai API calls thực sự:
Khi người dùng kết nối một dịch vụ (ví dụ: Google Calendar, Slack): Gọi API backend (ví dụ: POST /integrations/{serviceName}/connect) để khởi tạo quá trình OAuth hoặc lưu trữ token.
Khi người dùng ngắt kết nối: Gọi API backend (ví dụ: POST /integrations/{serviceName}/disconnect) để xóa thông tin kết nối.
Settings/PendingSyncScreen.tsx
Vị trí:
Hàm useEffect để tải danh sách thay đổi đang chờ.
Hàm handleSync để thực hiện đồng bộ.
Hàm handleResolveConflict để xử lý xung đột.
Cần sửa: Màn hình này đang dùng dữ liệu giả lập. Cần tích hợp API cho các chức năng sau:
Lấy danh sách thay đổi chờ: Thay vì setPendingChanges với dữ liệu giả, cần đọc từ một hàng đợi lưu trữ cục bộ (nếu thay đổi được lưu offline trước) hoặc gọi API để lấy danh sách thay đổi cần đồng bộ từ server (ít phổ biến hơn cho kịch bản này).
Thực hiện đồng bộ (handleSync):
Lặp qua từng pendingChange.
Gọi API backend tương ứng cho từng loại thay đổi (ví dụ: POST /tasks, PUT /documents/{id}, DELETE /comments/{id}).
Xử lý phản hồi từ API (thành công, thất bại, xung đột).
Giải quyết xung đột (handleResolveConflict):
Sau khi người dùng chọn cách giải quyết, gọi API backend để gửi lựa chọn đó và hoàn tất việc giải quyết xung đột.
Settings/SettingsScreen.tsx
Vị trí: Hàm handleLogout, cụ thể là logic bên trong hàm logout() của AuthContext được gọi từ đây.
Cần sửa (Cân nhắc): Hiện tại, logout() trong AuthContext chỉ xử lý ở client (xóa token cục bộ). Cân nhắc việc bổ sung một API call POST /auth/logout ở backend để vô hiệu hóa token phía server hoặc ghi log đăng xuất. Nếu quyết định thêm, hàm logout trong AuthContext.tsx cần được cập nhật.
Projects/ResourceViewScreen.tsx
Vị trí: Hàm fetchData (trong useEffect).
Cần sửa:
Hỗ trợ activeTab === 'team': Logic hiện tại chỉ lấy dữ liệu theo projectId. Nếu activeTab là 'team', cần gọi một API khác (ví dụ: apiGetTeamResourceAllocation(teamId, timeRange)) hoặc API apiGetProjectById cần được điều chỉnh để có thể truy vấn theo teamId nếu projectId không có.
Tích hợp timeRange: Tham số timeRange (tuần, tháng, quý, năm) hiện chưa được truyền vào API call. Hàm apiGetProjectById (và API cho team) cần nhận timeRange để backend trả về dữ liệu tương ứng.
Ví dụ: apiGetProjectById(projectId, timeRange)
Vị trí: Hàm handleTimeRangeChange.
Cần sửa: Sau khi setTimeRange(range), cần gọi lại fetchData() để tải dữ liệu mới theo timeRange vừa chọn.
Search/GlobalSearchResultsScreen.tsx
Vị trí: Hàm performSearch(query: string).
Cần sửa:
Tìm kiếm cho User, Message, Forum: Hiện tại, userResults, messageResults, forumResults đang là mảng rỗng. Cần bổ sung các API call tương ứng:
apiClient.get('/users', { params: { search: query, ...filters } })
apiClient.get('/messages', { params: { search: query, ...filters } }) (hoặc API tìm kiếm tin nhắn phù hợp)
apiClient.get('/forum/posts', { params: { search: query, ...filters } })
Tích hợp bộ lọc nâng cao: AdvancedSearchBar có các filterOptions (Loại, Ngày). Các giá trị lọc này cần được lấy ra và truyền vào tất cả các API call trong performSearch. Ví dụ: apiClient.get('/tasks', { params: { search: query, type: selectedTypeFilter, date: selectedDateFilter } }).
Lưu ý: Các API backend tương ứng (/tasks, /documents, /users, /messages, /forum/posts) cũng cần được cập nhật để hỗ trợ các tham số lọc này.
3. Thư mục FE/src/screens/Onboarding
OnboardingStepScreen.tsx (và component cha quản lý luồng onboarding)
Vị trí: Hàm onFinish được truyền vào OnboardingStepScreen (logic này thường nằm ở component cha điều phối các bước onboarding).
Cần sửa (Cân nhắc): Sau khi người dùng hoàn thành bước onboarding cuối cùng và hàm onFinish được gọi, có thể cần gọi một API để đánh dấu người dùng đã hoàn thành onboarding, ví dụ: POST /users/me/onboarding-status với body { completed: true }. Điều này giúp ứng dụng không hiển thị lại onboarding cho lần đăng nhập sau.


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
