const cloudinary = require('cloudinary').v2;

const FOLDER = 'aleabda';

function hasSignedCredentials() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function hasUnsignedPreset() {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET);
}

function isConfigured() {
  return hasSignedCredentials() || hasUnsignedPreset();
}

function ensureConfigured() {
  if (!isConfigured()) {
    const err = new Error('إعدادات Cloudinary غير مكتملة');
    err.status = 503;
    throw err;
  }
}

function configureSignedSdk() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const MAX_WIDTH_BY_TYPE = {
  hero: 1920,
  logo: 400,
  feature: 800,
  shop: 1280,
  testimonial: 200,
};

function cloudinaryPermissionError(err) {
  const detail = err?.error?.message || err?.message || '';
  return (
    err?.http_code === 403 ||
    /missing permissions|forbidden/i.test(detail)
  );
}

function formatCloudinaryError(err) {
  const formatted = new Error(err?.error?.message || err?.message || 'فشل رفع الصورة إلى Cloudinary');
  formatted.http_code = err?.http_code;
  formatted.error = err?.error;
  formatted.name = err?.name;
  return formatted;
}

/**
 * Unsigned upload via preset — works when API key is read-only.
 * Create preset: Cloudinary → Settings → Upload → Add upload preset → Signing Mode: Unsigned.
 */
async function uploadViaUnsignedPreset(buffer, options = {}) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const type = options.type || 'hero';

  const form = new FormData();
  form.append('file', new Blob([buffer]), 'upload');
  form.append('upload_preset', preset);
  form.append('folder', FOLDER);
  form.append('tags', `cms,${type}`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = formatCloudinaryError({
      message: data?.error?.message || `Cloudinary upload failed (${res.status})`,
      http_code: res.status,
      error: data?.error,
    });
    throw err;
  }

  return data;
}

/**
 * Signed server-side upload (requires API key with upload/write permission).
 */
function uploadViaSignedSdk(buffer, options = {}) {
  configureSignedSdk();

  const type = options.type || 'hero';
  const maxWidth = options.maxWidth || MAX_WIDTH_BY_TYPE[type] || 1920;

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: 'image',
        transformation: [{ width: maxWidth, crop: 'limit' }],
        quality: 'auto:good',
        fetch_format: 'auto',
        tags: [`cms`, type],
      },
      (err, result) => {
        if (err) return reject(formatCloudinaryError(err));
        resolve(result);
      }
    );

    upload.end(buffer);
  });
}

/**
 * Upload image buffer to Cloudinary with auto format/quality optimization.
 * Prefers unsigned preset when CLOUDINARY_UPLOAD_PRESET is set (read-only API keys).
 * @param {Buffer} buffer
 * @param {{ type?: string, maxWidth?: number }} options
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
async function uploadImageBuffer(buffer, options = {}) {
  ensureConfigured();

  if (hasUnsignedPreset()) {
    return uploadViaUnsignedPreset(buffer, options);
  }

  if (!hasSignedCredentials()) {
    const err = new Error(
      'أضف CLOUDINARY_UPLOAD_PRESET (موصى به) أو مفاتيح API كاملة بصلاحية الرفع'
    );
    err.status = 503;
    throw err;
  }

  try {
    return await uploadViaSignedSdk(buffer, options);
  } catch (err) {
    if (cloudinaryPermissionError(err)) {
      const hint = new Error(
        'مفتاح Cloudinary للقراءة فقط — أنشئ Upload Preset غير موقّع في لوحة Cloudinary وأضف CLOUDINARY_UPLOAD_PRESET إلى .env'
      );
      hint.status = 503;
      hint.http_code = 403;
      hint.cause = err;
      throw hint;
    }
    throw err;
  }
}

module.exports = {
  uploadImageBuffer,
  isConfigured,
  MAX_WIDTH_BY_TYPE,
  cloudinaryPermissionError,
};
