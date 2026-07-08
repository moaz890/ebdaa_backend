const SiteContent = require('../models/SiteContent');
const { DEFAULT_SITE_CONTENT } = require('../data/contentDefaults');
const { seedContent, SITE_CONTENT_ID } = require('../lib/seedContent');
const { uploadImageBuffer, MAX_WIDTH_BY_TYPE } = require('../lib/cloudinary');

const VALID_SECTIONS = [
  'hero',
  'leadFormSection',
  'formLabels',
  'features',
  'testimonials',
  'faqs',
  'footer',
  'logoUrl',
  'seo',
  'successPage',
];

const FORM_LABEL_KEYS = Object.keys(DEFAULT_SITE_CONTENT.formLabels);

/**
 * Deep-merge CMS document with defaults so missing fields never leak as undefined.
 */
function mergeWithDefaults(doc) {
  const merged = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));

  if (!doc) return merged;

  for (const key of Object.keys(merged)) {
    if (key === '_id') continue;
    if (doc[key] !== undefined && doc[key] !== null) {
      merged[key] = doc[key];
    }
  }

  if (doc.updatedAt) {
    merged.updatedAt = doc.updatedAt;
  }

  return merged;
}

function formatContentResponse(doc) {
  const plain = doc?.toObject ? doc.toObject() : doc;
  const { __v, ...rest } = plain || {};
  return mergeWithDefaults(rest);
}

/**
 * Build a MongoDB $set update from a section + partial data payload.
 * Pattern: { section: "hero", data: { ctaText: "..." } }
 * logoUrl section accepts a string or { logoUrl: "..." }.
 */
function buildSectionUpdate(section, data) {
  if (section === 'logoUrl') {
    const url = typeof data === 'string' ? data : data?.logoUrl;
    if (!url || typeof url !== 'string') {
      const err = new Error('رابط الشعار مطلوب');
      err.status = 400;
      throw err;
    }
    return { $set: { logoUrl: url.trim() } };
  }

  if (['testimonials', 'faqs'].includes(section) && Array.isArray(data)) {
    return { $set: { [section]: data } };
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    const err = new Error('بيانات القسم غير صالحة');
    err.status = 400;
    throw err;
  }

  if (section === 'formLabels') {
    const unknownKeys = Object.keys(data).filter((k) => !FORM_LABEL_KEYS.includes(k));
    if (unknownKeys.length > 0) {
      const err = new Error(`مفاتيح غير معروفة في تسميات النموذج: ${unknownKeys.join(', ')}`);
      err.status = 422;
      throw err;
    }
  }

  const $set = {};
  for (const [key, value] of Object.entries(data)) {
    $set[`${section}.${key}`] = value;
  }

  return { $set };
}

// ─── GET /api/content ─────────────────────────────────────────────────────────
/**
 * Public — return full site content. Auto-seeds on first request if missing.
 */
async function getContent(req, res) {
  try {
    let doc = await SiteContent.findById(SITE_CONTENT_ID);

    if (!doc) {
      doc = await seedContent();
    }

    res.json({
      success: true,
      data: formatContentResponse(doc),
    });
  } catch (err) {
    console.error('[content/get]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

// ─── GET /api/content/admin ───────────────────────────────────────────────────
/**
 * Protected — same payload as public GET (reserved for future admin metadata).
 */
async function getAdminContent(req, res) {
  return getContent(req, res);
}

// ─── PUT /api/content ─────────────────────────────────────────────────────────
/**
 * Protected — partial update by section.
 * Body: { section: "hero", data: { ctaText: "..." } }
 */
async function updateContent(req, res) {
  try {
    const { section, data } = req.body;

    if (!section || !VALID_SECTIONS.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `القسم غير صالح. الأقسام المسموحة: ${VALID_SECTIONS.join(', ')}`,
      });
    }

    if (data === undefined || data === null) {
      return res.status(400).json({
        success: false,
        message: 'بيانات القسم مطلوبة',
      });
    }

    const update = buildSectionUpdate(section, data);

    const doc = await SiteContent.findByIdAndUpdate(
      SITE_CONTENT_ID,
      update,
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'محتوى الموقع غير موجود — قم بتشغيل البذرة أولاً',
      });
    }

    res.json({
      success: true,
      message: 'تم حفظ المحتوى بنجاح',
      data: formatContentResponse(doc),
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(422).json({ success: false, message: 'بيانات غير صحيحة', errors });
    }

    if (err.status) {
      return res.status(err.status).json({ success: false, message: err.message });
    }

    console.error('[content/update]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

// ─── POST /api/content/seed ───────────────────────────────────────────────────
/**
 * Protected — idempotent seed from contentDefaults (dev/setup).
 */
async function seedContentHandler(req, res) {
  try {
    const doc = await seedContent();

    res.json({
      success: true,
      message: 'تم تهيئة المحتوى بنجاح',
      data: formatContentResponse(doc),
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(422).json({ success: false, message: 'بيانات غير صحيحة', errors });
    }

    console.error('[content/seed]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

// ─── POST /api/content/upload ─────────────────────────────────────────────────
/**
 * Protected — upload image to Cloudinary, returns optimized secure_url.
 * multipart field: file. Optional body/query: type = hero|logo|feature|shop
 */
async function uploadContentImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'لم يتم اختيار ملف' });
    }

    const type = String(req.body?.type || req.query?.type || 'hero');
    if (!MAX_WIDTH_BY_TYPE[type]) {
      return res.status(400).json({
        success: false,
        message: `نوع الصورة غير صالح. الأنواع المسموحة: ${Object.keys(MAX_WIDTH_BY_TYPE).join(', ')}`,
      });
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/octet-stream'];
    const ext = (req.file.originalname || '').toLowerCase();
    const hasImageExt = /\.(jpe?g|png|webp|gif)$/.test(ext);
    if (!allowed.includes(req.file.mimetype) && !hasImageExt) {
      return res.status(422).json({
        success: false,
        message: 'نوع الملف غير مدعوم — استخدم JPG أو PNG أو WebP',
      });
    }

    const maxSize = 10 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(422).json({
        success: false,
        message: 'حجم الملف كبير جداً — الحد الأقصى 10 ميجابايت',
      });
    }

    const result = await uploadImageBuffer(req.file.buffer, { type });

    res.json({
      success: true,
      message: 'تم رفع الصورة بنجاح',
      data: { url: result.secure_url },
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ success: false, message: err.message });
    }
    if (err.http_code === 401) {
      return res.status(503).json({
        success: false,
        message: 'إعدادات Cloudinary غير صحيحة — تحقق من CLOUDINARY_CLOUD_NAME و API keys',
      });
    }
    if (err.http_code === 403 || err.status === 503) {
      return res.status(503).json({
        success: false,
        message:
          err.message ||
          'مفتاح Cloudinary لا يملك صلاحية الرفع — أنشئ Upload Preset غير موقّع وأضف CLOUDINARY_UPLOAD_PRESET',
      });
    }
    console.error('[content/upload]', err.cause || err);
    res.status(500).json({ success: false, message: 'فشل رفع الصورة' });
  }
}

module.exports = {
  getContent,
  getAdminContent,
  updateContent,
  seedContentHandler,
  uploadContentImage,
  VALID_SECTIONS,
  FORM_LABEL_KEYS,
};
