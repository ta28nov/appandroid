require('dotenv').config(); // Tải các biến môi trường từ tệp .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const http = require('http');
const socketio = require('socket.io');

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
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO user map
const userSocketMap = new Map();
io.on('connection', (socket) => {
  socket.on('register', (userId) => {
    userSocketMap.set(userId, socket.id);
  });
  socket.on('disconnect', () => {
    for (const [userId, sid] of userSocketMap.entries()) {
      if (sid === socket.id) userSocketMap.delete(userId);
    }
  });
});
app.set('io', io);
app.set('userSocketMap', userSocketMap);

// Middleware
app.use(cors()); // Cho phép Chia sẻ Tài nguyên Nguồn gốc Chéo (CORS) để kết nối với frontend
app.use(express.json()); // Phân tích cú pháp body yêu cầu dạng JSON
app.use(express.urlencoded({ extended: true })); // Phân tích cú pháp body được mã hóa URL

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/documents', documentRoutes);

// Phục vụ file tĩnh trong thư mục uploads
const path = require('path');
const uploadsPath = path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsPath));

// Default route for testing
app.get('/', (req, res) => {
  res.send('Digital Workspace API is running...');
});

// Error Handling Middleware (Should be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Máy chủ đang chạy trên cổng ${PORT}`));