// Middleware để xử lý các route không tìm thấy
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Chuyển lỗi sang middleware tiếp theo (errorHandler)
};

// Middleware để xử lý các lỗi được ném ra trong các route handler
const errorHandler = (err, req, res, next) => {
  // Đôi khi lỗi đi kèm với statusCode, nếu không thì mặc định là 500 (Lỗi máy chủ nội bộ)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Phản hồi bằng JSON chứa thông báo lỗi
  // Trong môi trường production, bạn có thể không muốn gửi dấu vết ngăn xếp (stack trace)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler }; 