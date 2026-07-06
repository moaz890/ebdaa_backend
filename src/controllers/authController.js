const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: { success, token }
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'اسم المستخدم وكلمة المرور مطلوبان',
      });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة',
      });
    }

    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      message: 'تم تسجيل الدخول بنجاح',
    });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

/**
 * GET /api/auth/me
 * Protected — fetch current admin username
 */
async function getProfile(req, res) {
  try {
    const admin = await Admin.findById(req.admin.adminId).select('username');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'المسؤول غير موجود' });
    }
    res.json({ success: true, data: { username: admin.username } });
  } catch (err) {
    console.error('[auth/me]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

/**
 * PUT /api/auth/settings
 * Protected — update admin username and/or password
 */
async function updateSettings(req, res) {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const adminId = req.admin.adminId;

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الحالية مطلوبة لتأكيد التغييرات',
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'المسؤول غير موجود',
      });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة',
      });
    }

    if (username && username.trim().toLowerCase() !== admin.username) {
      const cleanUsername = username.trim().toLowerCase();
      if (cleanUsername.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل',
        });
      }
      const existing = await Admin.findOne({ username: cleanUsername });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'اسم المستخدم هذا مستخدم بالفعل',
        });
      }
      admin.username = cleanUsername;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
        });
      }
      await admin.setPassword(newPassword);
    }

    await admin.save();

    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      message: 'تم تحديث الإعدادات بنجاح',
    });
  } catch (err) {
    console.error('[auth/settings]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

module.exports = { login, getProfile, updateSettings };
