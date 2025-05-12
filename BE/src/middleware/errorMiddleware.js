// Middleware để xử lý các route không tìm thấy
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Chuyển lỗi sang middleware tiếp theo (errorHandler)
};

// Middleware để xử lý các lỗi được ném ra trong các route handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    data: null,
    error: {
      message: err.message,
      code: statusCode,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    },
  });
};

module.exports = { notFound, errorHandler };