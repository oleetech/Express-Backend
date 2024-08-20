const multer = require('multer');
const path = require('path');
const {
  destination,
  generateFileName,
  limitFileSize,
  fileFilter,
  sanitizeFileName,
} = require('../utils/uploadHelper');

// Directory where files will be uploaded
const uploadDirectory = path.join(__dirname, '../uploads');

// Configure storage
const storage = multer.diskStorage({
  destination: destination(uploadDirectory), // Use the helper method to set the destination
  filename: (req, file, cb) => {
    console.log( "your file is",file);
    const sanitizedFileName = sanitizeFileName(file.originalname);
    const ext = path.extname(sanitizedFileName);
    const baseName = path.basename(sanitizedFileName, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

// Configure Multer with advanced options
const upload = multer({
  storage: storage,
  limits: limitFileSize(5 * 1024 * 1024), // Limit file size to 5MB
  fileFilter: fileFilter(/jpeg|jpg|png|gif|pdf|docx|webp/), // Allow specific file types
});

module.exports = upload;
