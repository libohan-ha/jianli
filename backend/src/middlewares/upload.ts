import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 文件大小限制：10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 临时文件存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'tmp', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}.pdf`;
    cb(null, uniqueName);
  },
});

// 文件类型过滤
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('UNSUPPORTED_FORMAT'));
  }
};

// 导出multer实例
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});