import { Router } from 'express';
import analysisRouter from './analysis';
import exportRouter from './export';
import uploadRouter from './upload';

const router = Router();

// 上传相关路由
router.use('/upload', uploadRouter);

// 分析相关路由
router.use('/analysis', analysisRouter);

// 导出相关路由
router.use('/export', exportRouter);

export default router;