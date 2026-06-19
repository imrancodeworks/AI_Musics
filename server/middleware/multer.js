const multer = require('multer');

// On Vercel (and serverless environments), the only writable directory is /tmp.
// Locally, we also use /tmp for consistency (it exists on all OSes).
const tmpDir = '/tmp';

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
