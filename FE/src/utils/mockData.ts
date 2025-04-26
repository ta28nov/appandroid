// Dữ liệu mẫu cho ứng dụng Digital Workspace Pro
// Sẽ được thay thế bằng dữ liệu từ API trong môi trường sản phẩm thực tế

import { TASK_STATUS, PRIORITY_LEVELS, PRESENCE_STATUS } from './constants';

// Dữ liệu công việc
export const mockTasks = [
  {
    id: '1',
    title: 'Hoàn thành báo cáo tài chính Q2',
    description: 'Phân tích số liệu và hoàn thiện báo cáo tài chính quý 2',
    assignedTo: 'user1',
    priority: 'High',
    completed: false,
    dueDate: '2025-04-18',
    overdue: true,
  },
  {
    id: '2',
    title: 'Họp với team Marketing',
    description: 'Thảo luận kế hoạch marketing cho sản phẩm mới',
    assignedTo: 'user2',
    priority: 'Medium',
    completed: true,
    dueDate: '2025-04-15',
    overdue: false,
  },
  {
    id: '3',
    title: 'Cập nhật website công ty',
    description: 'Cập nhật nội dung và hình ảnh mới trên website',
    assignedTo: 'user3',
    priority: 'Low',
    completed: false,
    dueDate: '2025-04-20',
    overdue: false,
  },
  {
    id: '4',
    title: 'Phân tích dữ liệu khách hàng',
    description: 'Phân tích hành vi và xu hướng của khách hàng trong Q2',
    assignedTo: 'user1',
    priority: 'Medium',
    completed: false,
    dueDate: '2025-04-22',
    overdue: false,
  },
  {
    id: '5',
    title: 'Kiểm tra lỗi ứng dụng di động',
    description: 'Rà soát và sửa các lỗi trong bản cập nhật mới',
    assignedTo: 'user4',
    priority: 'High',
    completed: false,
    dueDate: '2025-04-17',
    overdue: false,
  },
];

// Dữ liệu tài liệu
export const mockDocuments = [
  {
    id: '1',
    title: 'Báo cáo tài chính Q1 2025.pdf',
    description: 'Báo cáo tài chính quý 1 năm 2025',
    type: 'pdf',
    size: '4.2 MB',
    createdBy: 'user1',
    createdAt: '2025-04-10T08:30:00Z',
    updatedAt: '2025-04-11T13:45:00Z',
    shared: true,
    tags: ['Tài chính', 'Báo cáo', 'Q1'],
  },
  {
    id: '2',
    title: 'Kế hoạch Marketing Q2.docx',
    description: 'Kế hoạch marketing chi tiết cho quý 2',
    type: 'doc',
    size: '2.8 MB',
    createdBy: 'user2',
    createdAt: '2025-04-05T14:20:00Z',
    updatedAt: '2025-04-15T09:10:00Z',
    shared: true,
    tags: ['Marketing', 'Kế hoạch', 'Q2'],
  },
  {
    id: '3',
    title: 'Phân tích dữ liệu khách hàng.xlsx',
    description: 'Phân tích chi tiết dữ liệu khách hàng',
    type: 'xls',
    size: '5.6 MB',
    createdBy: 'user3',
    createdAt: '2025-04-08T11:40:00Z',
    updatedAt: '2025-04-12T15:30:00Z',
    shared: false,
    tags: ['Phân tích', 'Dữ liệu', 'Khách hàng'],
  },
  {
    id: '4',
    title: 'Bản trình bày sản phẩm mới.pptx',
    description: 'Slide giới thiệu sản phẩm mới cho khách hàng',
    type: 'ppt',
    size: '8.1 MB',
    createdBy: 'user1',
    createdAt: '2025-04-02T09:15:00Z',
    updatedAt: '2025-04-14T16:20:00Z',
    shared: true,
    tags: ['Sản phẩm', 'Trình bày', 'Kinh doanh'],
  },
  {
    id: '5',
    title: 'Hướng dẫn sử dụng ứng dụng.pdf',
    description: 'Tài liệu hướng dẫn sử dụng ứng dụng cho người dùng',
    type: 'pdf',
    size: '3.4 MB',
    createdBy: 'user4',
    createdAt: '2025-04-07T13:50:00Z',
    updatedAt: '2025-04-09T10:25:00Z',
    shared: false,
    tags: ['Hướng dẫn', 'Tài liệu', 'Ứng dụng'],
  },
];

// Dữ liệu thời tiết
export const mockWeather = {
  temperature: 28,
  condition: 'Sunny',
  city: 'Hà Nội',
  description: 'Trời nắng đẹp, ít mây',
  humidity: 65,
  wind: 12,
  visibility: 10,
};

// Dữ liệu thông báo
export const mockNotifications = [
  {
    id: '1',
    title: 'Nhắc nhở công việc',
    message: 'Công việc "Hoàn thành báo cáo tài chính Q2" sắp đến hạn.',
    type: 'reminder',
    read: false,
    time: '2025-04-16T08:30:00Z',
  },
  {
    id: '2',
    title: 'Bình luận mới',
    message: 'Trần Bình đã bình luận về tài liệu của bạn.',
    type: 'comment',
    read: false,
    time: '2025-04-15T14:45:00Z',
  },
  {
    id: '3',
    title: 'Lời mời họp',
    message: 'Bạn đã được mời tham gia cuộc họp "Kế hoạch Q2".',
    type: 'invitation',
    read: true,
    time: '2025-04-15T10:15:00Z',
  },
  {
    id: '4',
    title: 'Tài liệu mới được chia sẻ',
    message: 'Lê Minh đã chia sẻ một tài liệu mới với bạn.',
    type: 'share',
    read: false,
    time: '2025-04-14T16:30:00Z',
  },
  {
    id: '5',
    title: 'Cập nhật hệ thống',
    message: 'Hệ thống đã được cập nhật lên phiên bản mới nhất.',
    type: 'system',
    read: true,
    time: '2025-04-13T09:00:00Z',
  },
];

// Dữ liệu hoạt động của đội nhóm
export const mockTeamActivity = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      presence: 'online',
    },
    action: 'đã tạo tài liệu mới',
    target: 'Kế hoạch Q2',
    time: '15 phút trước',
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Trần Bình',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      presence: 'busy',
    },
    action: 'đã bình luận về',
    target: 'Báo cáo Tài chính',
    time: '1 giờ trước',
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Lê Minh',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      presence: 'offline',
    },
    action: 'đã hoàn thành công việc',
    target: 'Cập nhật website',
    time: '3 giờ trước',
  },
  {
    id: '4',
    user: {
      id: 'user4',
      name: 'Phạm Hà',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      presence: 'online',
    },
    action: 'đã tạo dự án mới',
    target: 'Ứng dụng di động',
    time: '5 giờ trước',
  },
  {
    id: '5',
    user: {
      id: 'user5',
      name: 'Hoàng Minh Tuấn',
      avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      presence: 'away',
    },
    action: 'đã gửi tin nhắn đến',
    target: 'Phòng Marketing',
    time: '1 ngày trước',
  },
];

// Dữ liệu thống kê
export const mockStatistics = {
  taskCount: 24,
  documentCount: 37,
  messageCount: 128,
  forumPosts: 15,
  documentNew: 5,
  weeklyActivity: [5, 8, 15, 9, 12, 8, 6],
  taskCompletion: {
    completed: 18,
    inProgress: 12,
    overdue: 4,
  },
  storageUsage: {
    used: 4.7,
    total: 15,
  },
}; 