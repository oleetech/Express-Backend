const path = require('path');
const fs = require('fs');

// 1. Helper Method: File Size Limit
const limitFileSize = (maxSize) => {
  return {
    fileSize: maxSize,
  };
};

// 2. Helper Method: File Type Filter
const fileFilter = (allowedTypes) => (req, file, cb) => {
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Only specified file types are allowed!'));
  }
};

// 3. Helper Method: Ensure Directory Exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 4. Helper Method: Generate Unique File Name
const generateFileName = (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(file.originalname);
  cb(null, file.fieldname + '-' + uniqueSuffix + ext);
};

// 5. Helper Method: Set Destination Directory
const destination = (dir) => (req, file, cb) => {
  ensureDirExists(dir); // Ensure the directory exists before saving files
  cb(null, dir);
};

// 6. Helper Method: Sanitize File Name
const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-z0-9\.-]/gi, '_').toLowerCase();
};

// 7. Helper Method: Delete File (for cleanup)
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// 8. Helper Method: Validate File Count
const limitNumberOfFiles = (maxFiles) => (req, res, next) => {
  if (req.files && req.files.length > maxFiles) {
    return res.status(400).json({ error: `You can upload a maximum of ${maxFiles} files.` });
  }
  next();
};

// Export the helper methods
module.exports = {
  limitFileSize,
  fileFilter,
  ensureDirExists,
  generateFileName,
  destination,
  sanitizeFileName,
  deleteFile,
  limitNumberOfFiles,
};
