import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';

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

// Validate and parse MAX_FILE_SIZE environment variable
const parseMaxFileSize = (): number => {
  const defaultSize = 5242880; // 5MB default
  const envValue = process.env.MAX_FILE_SIZE;

  if (!envValue) {
    return defaultSize;
  }

  const parsedValue = parseInt(envValue, 10);

  // Check if the parsed value is a valid number and positive
  if (isNaN(parsedValue) || parsedValue <= 0) {
    console.warn(`Invalid MAX_FILE_SIZE value: "${envValue}". Using default: ${defaultSize} bytes`);
    return defaultSize;
  }

  return parsedValue;
};

const maxSize = parseMaxFileSize();

// File filter to allow only image files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed MIME types for images
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  // Check if the file's MIME type is allowed
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file with an error
    cb(new Error(`Invalid file type. Only image files are allowed. Received: ${file.mimetype}`));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter
});

export default upload;
