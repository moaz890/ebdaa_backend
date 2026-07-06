const jwt = require('jsonwebtoken');

/**
 * Middleware: verifies the Bearer JWT token.
 * Attaches `req.admin` payload on success, returns 401 on failure.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح — يرجى تسجيل الدخول',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'انتهت صلاحية الجلسة — يرجى تسجيل الدخول مجدداً'
        : 'رمز المصادقة غير صالح';

    return res.status(401).json({ success: false, message });
  }
}

module.exports = authMiddleware;
