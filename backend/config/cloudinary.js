const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return false;
  const placeholderPattern = /^(your_|placeholder|xxx|changeme)/i;
  if (placeholderPattern.test(CLOUDINARY_CLOUD_NAME)) return false;
  if (placeholderPattern.test(CLOUDINARY_API_KEY)) return false;
  if (placeholderPattern.test(CLOUDINARY_API_SECRET)) return false;
  return true;
};

const uploadToCloudinary = async (file, folder = 'notes') => {
  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `smart-notes/${folder}`,
        resource_type: 'auto',
      });
      try { fs.unlinkSync(file.path); } catch (_) {}
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        storage: 'cloudinary',
      };
    } catch (error) {
      console.error('Cloudinary upload failed, falling back to local storage:', error.message);
    }
  }

  // Local fallback — file is already on disk via multer
  const filename = path.basename(file.path);
  const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  return {
    url: `${baseUrl}/uploads/${filename}`,
    publicId: `local:${filename}`,
    format: path.extname(file.originalname).replace('.', '').toLowerCase(),
    storage: 'local',
  };
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  if (publicId.startsWith('local:')) {
    const filename = publicId.slice('local:'.length);
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Local file deletion error:', error.message);
    }
    return;
  }
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured };
