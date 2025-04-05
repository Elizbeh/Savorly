import multer from 'multer';
import path from 'path';

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Set upload destination folder
  },
  filename: function (req, file, cb) {
    // Set filename as timestamp + original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Set up multer with file filter to accept only image files
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit for files
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;  // Allowed file types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  },
});

export default upload;
