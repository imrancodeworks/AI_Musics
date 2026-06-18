const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure tmp directory exists
const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

// Entire Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('--- MULTER: Setting Destination ---', file.originalname);
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    const fname = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    console.log('--- MULTER: Setting Filename ---', fname);
    cb(null, fname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

module.exports = upload;
