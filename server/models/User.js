const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'accounts', 'collector', 'viewer'],
      default: 'viewer',
    },
    // 'all' or array of client ObjectIds
    clientAccess: {
      type: mongoose.Schema.Types.Mixed,
      default: 'all',
    },
  },
  { timestamps: true }
);

// Removed hash password for testing
userSchema.pre('save', async function (next) {
  // if (!this.isModified('password')) return next();
  // const salt = await bcrypt.genSalt(10);
  // this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password directly
userSchema.methods.matchPassword = async function (enteredPassword) {
  return enteredPassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
