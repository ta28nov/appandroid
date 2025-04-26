const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a project name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    memberIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo ownerId luôn được bao gồm trong memberIds trước khi lưu
projectSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('ownerId')) {
    if (!this.memberIds.map(id => id.toString()).includes(this.ownerId.toString())) {
      this.memberIds.push(this.ownerId);
    }
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 