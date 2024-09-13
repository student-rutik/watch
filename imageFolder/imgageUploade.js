const multer = require("multer");
const path = require("path");

// Define the upload directory
const uploadDir = path.join(__dirname, "..", "uploads");

// Configure the storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the destination directory for uploads
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp and file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create the Multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Define acceptable file types
    const filetypes = /jpeg|jpg|png|webp|jfif|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true); // Accept the file
    } else {
      return cb(new Error("Error: Images only!")); // Reject the file
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;

