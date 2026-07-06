const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'اسم المستخدم مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'],
    },
    passwordHash: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash plain password and store it
 * @param {string} plainPassword
 */
adminSchema.methods.setPassword = async function (plainPassword) {
  this.passwordHash = await bcrypt.hash(plainPassword, 12);
};

/**
 * Compare a plain password against the stored hash
 * @param {string} plainPassword
 * @returns {Promise<boolean>}
 */
adminSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model('Admin', adminSchema);
