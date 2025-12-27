import { Router } from 'express';
import { uploadFile, uploadText } from '../controllers/uploadController';
import { uploadMiddleware } from '../middlewares/upload';

const router = Router();

// POST /api/v1/upload - 上传PDF文件
router.post('/', uploadMiddleware.single('file'), uploadFile);

// POST /api/v1/upload/text - 直接提交文本
router.post('/text', uploadText);

export default router;