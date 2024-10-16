const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Check if the directory exists; if not, create it
const uploadDir = './public/upload';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory recursively
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Use the uploadDir variable
    },
    filename: function (req, file, cb) {
        // Remove spaces from the file name and replace them with underscores
        const sanitizedFileName = file.originalname.replace(/\s+/g, '_'); // Replace spaces with underscores
        cb(null, Date.now() + '_' + sanitizedFileName + path.extname(file.originalname)); // Append file extension
    }
});

const fileFilter = (req, file, cb) => {
    if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
    }
};

const img_upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50, // 50MB file size limit
    },
    fileFilter: fileFilter
})  // Specify that you're expecting a single file with the field name 'img'

module.exports = img_upload;
