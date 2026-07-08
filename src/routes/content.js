const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  getContent,
  getAdminContent,
  updateContent,
  seedContentHandler,
  uploadContentImage,
  VALID_SECTIONS,
  FORM_LABEL_KEYS,
} = require('../controllers/contentController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

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

/**
 * Section-specific validation after express-validator base checks.
 */
function validateSectionPayload(req, res, next) {
  const { section, data } = req.body;

  try {
    switch (section) {
      case 'hero': {
        if (data.trustBadges && (!Array.isArray(data.trustBadges) || data.trustBadges.length !== 3)) {
          return res.status(422).json({
            success: false,
            message: 'يجب أن يحتوي hero.trustBadges على 3 عناصر بالضبط',
          });
        }
        break;
      }

      case 'formLabels': {
        const unknown = Object.keys(data).filter((k) => !FORM_LABEL_KEYS.includes(k));
        if (unknown.length > 0) {
          return res.status(422).json({
            success: false,
            message: `مفاتيح غير معروفة في تسميات النموذج: ${unknown.join(', ')}`,
          });
        }
        break;
      }

      case 'features': {
        if (data.items && (!Array.isArray(data.items) || data.items.length !== 4)) {
          return res.status(422).json({
            success: false,
            message: 'يجب أن يحتوي features.items على 4 عناصر بالضبط',
          });
        }
        if (data.shopPromo) {
          const required = ['imageUrl', 'heading', 'storeUrl', 'ctaText'];
          const missing = required.filter((k) => !data.shopPromo[k]);
          if (missing.length > 0) {
            return res.status(422).json({
              success: false,
              message: `حقول shopPromo المطلوبة: ${missing.join(', ')}`,
            });
          }
        }
        break;
      }

      case 'testimonials': {
        const items = Array.isArray(data) ? data : data.testimonials;
        if (!Array.isArray(items)) {
          return res.status(422).json({
            success: false,
            message: 'testimonials يجب أن تكون مصفوفة',
          });
        }
        if (items.length > 20) {
          return res.status(422).json({
            success: false,
            message: 'لا يمكن أن يتجاوز عدد آراء العملاء 20',
          });
        }
        break;
      }

      case 'faqs': {
        const items = Array.isArray(data) ? data : data.faqs;
        if (!Array.isArray(items)) {
          return res.status(422).json({
            success: false,
            message: 'faqs يجب أن تكون مصفوفة',
          });
        }
        if (items.length > 30) {
          return res.status(422).json({
            success: false,
            message: 'لا يمكن أن يتجاوز عدد الأسئلة 30',
          });
        }
        break;
      }

      case 'logoUrl': {
        const url = typeof data === 'string' ? data : data?.logoUrl;
        if (!url || typeof url !== 'string' || !url.trim()) {
          return res.status(422).json({
            success: false,
            message: 'رابط الشعار مطلوب',
          });
        }
        break;
      }

      case 'footer': {
        if (data.whatsapp && !/^\d{10,15}$/.test(String(data.whatsapp))) {
          return res.status(422).json({
            success: false,
            message: 'رقم الواتساب يجب أن يكون أرقاماً فقط (10–15 رقم)',
          });
        }
        break;
      }

      default:
        break;
    }

    next();
  } catch (err) {
    console.error('[content/validateSection]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

const updateValidationRules = [
  body('section')
    .trim()
    .isIn(VALID_SECTIONS)
    .withMessage(`القسم يجب أن يكون أحد: ${VALID_SECTIONS.join(', ')}`),
  body('data').exists().withMessage('بيانات القسم مطلوبة'),
];

// Public read
router.get('/', getContent);

// Protected read/write
router.get('/admin', authMiddleware, getAdminContent);
router.put('/', authMiddleware, updateValidationRules, validateRequest, validateSectionPayload, updateContent);
router.post('/seed', authMiddleware, seedContentHandler);
router.post('/upload', authMiddleware, upload.single('file'), uploadContentImage);

module.exports = router;
