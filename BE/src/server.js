require('dotenv').config(); // Tải các biến môi trường từ tệp .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const chatRoutes = require('./routes/chatRoutes');
const forumRoutes = require('./routes/forumRoutes');
const documentRoutes = require('./routes/documentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Cho phép Chia sẻ Tài nguyên Nguồn gốc Chéo (CORS) để kết nối với frontend
app.use(express.json()); // Phân tích cú pháp body yêu cầu dạng JSON
app.use(express.urlencoded({ extended: true })); // Phân tích cú pháp body được mã hóa URL

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/chats', chatRoutes);
// app.use('/api/forum', forumRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/documents', documentRoutes);

// --- Chỗ giữ chỗ cho việc tải lên tệp (phục vụ tĩnh) nếu cần cục bộ ---
// Ví dụ: Nếu lưu trữ các tệp tải lên trong thư mục 'uploads' ở thư mục gốc BE
// const path = require('path');
// app.use('/uploads', express.static(path.join(__dirname, '../../uploads'))); 
// LƯU Ý: Đối với môi trường production, hãy sử dụng lưu trữ đám mây (S3, v.v.) thay vì lưu trữ cục bộ.
// ----------------------------------------------------------------------

// Default route for testing
app.get('/', (req, res) => {
  res.send('Digital Workspace API is running...');
});

// Error Handling Middleware (Should be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Máy chủ đang chạy trên cổng ${PORT}`)); 