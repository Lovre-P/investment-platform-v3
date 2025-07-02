import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const maxSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // default 5MB

const upload = multer({
  storage,
  limits: { fileSize: maxSize }
});

export default upload;
