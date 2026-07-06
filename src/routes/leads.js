const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
} = require('../controllers/leadsController');

// ─── Validation rules for POST /api/leads ────────────────────────────────────
const leadValidationRules = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('الاسم الثلاثي مطلوب')
    .isLength({ min: 3, max: 100 }).withMessage('الاسم يجب أن يكون بين 3 و 100 حرف'),

  body('phone')
    .trim()
    .notEmpty().withMessage('رقم الجوال مطلوب')
    .customSanitizer((val) => val.replace(/[\s-]/g, ''))
    .matches(/^\d{9,10}$/)
    .withMessage('يرجى إدخال رقم جوال صحيح يتكون من 9 أو 10 أرقام'),

  body('isQualified')
    .isBoolean().withMessage('يرجى تحديد العمر')
    .toBoolean(),

  body('state')
    .trim()
    .isIn(['citizen', 'resident']).withMessage('يرجى تحديد ما إذا كنت مواطناً أو مقيماً'),

  body('monthlySalary')
    .notEmpty().withMessage('الراتب الشهري مطلوب')
    .isFloat({ min: 0 }).withMessage('الراتب الشهري يجب أن يكون رقماً موجباً')
    .toFloat(),

  body('monthlyObligations')
    .notEmpty().withMessage('الالتزامات الشهرية مطلوبة')
    .isFloat({ min: 0 }).withMessage('الالتزامات الشهرية يجب أن تكون رقماً موجباً')
    .toFloat(),

  body('hasRealEstateLoan')
    .isBoolean().withMessage('يرجى تحديد وجود قرض عقاري')
    .toBoolean(),

  body('workSector')
    .trim()
    .isIn(['government', 'private_company', 'private_establishment', 'retired'])
    .withMessage('يرجى تحديد قطاع العمل'),

  body('serviceDuration')
    .trim()
    .isIn(['less_than_3_months', 'more_than_3_months'])
    .withMessage('يرجى تحديد مدة الخدمة'),
];

// Middleware: collect express-validator errors and respond
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'يرجى التحقق من البيانات المدخلة',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Public
router.post('/', leadValidationRules, validateRequest, createLead);

// Protected (admin only)
router.get('/',          authMiddleware, getLeads);
router.patch('/:id',     authMiddleware, updateLead);
router.delete('/:id',    authMiddleware, deleteLead);

module.exports = router;
