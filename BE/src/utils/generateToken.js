const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Ví dụ: token hết hạn sau 30 ngày
  });
};

module.exports = generateToken; 