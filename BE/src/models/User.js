const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const privacySettingsSchema = new mongoose.Schema({
  showEmail: { type: Boolean, default: false },
  showActivityStatus: { type: Boolean, default: true },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng thêm tên'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng thêm email'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Vui lòng thêm email hợp lệ',
      ],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng thêm mật khẩu'],
      minlength: 6, // Ví dụ: yêu cầu độ dài mật khẩu tối thiểu
      select: false, // Không chọn mật khẩu theo mặc định khi truy vấn người dùng
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    privacySettings: {
      type: privacySettingsSchema,
      default: () => ({}), // Mặc định là một đối tượng trống, nhận giá trị mặc định từ sub-schema
    },
    // isAdmin: { // Tùy chọn: Cho vai trò quản trị viên
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
  },
  {
    timestamps: true, // Tự động thêm các trường createdAt và updatedAt
  }
);

// --- Middleware --- 

// Băm mật khẩu trước khi lưu người dùng (chỉ khi mật khẩu được sửa đổi)
userSchema.pre('save', async function (next) {
  // 'this' tham chiếu đến tài liệu người dùng đang được lưu
  if (!this.isModified('password')) {
    return next(); // Nếu mật khẩu không thay đổi, bỏ qua việc băm
  }

  try {
    const salt = await bcrypt.genSalt(10); // Tạo salt
    this.password = await bcrypt.hash(this.password, salt); // Băm mật khẩu
    next();
  } catch (error) {
    next(error); // Chuyển lỗi sang middleware xử lý lỗi
  }
});

// --- Methods --- 

// Phương thức để so sánh mật khẩu đã nhập với mật khẩu đã băm trong DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this' tham chiếu đến phiên bản tài liệu người dùng
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 