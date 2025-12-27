import { Router } from 'express';
import { acceptChanges, analyzeSync, getProgress, getResult, startAnalysis } from '../controllers/analysisController';

const router = Router();

// POST /api/v1/analysis/start - 开始分析（异步）
router.post('/start', startAnalysis);

// POST /api/v1/analysis/sync - 同步分析（直接返回结果，用于测试）
router.post('/sync', analyzeSync);

// GET /api/v1/analysis/:id/progress - 查询进度
router.get('/:id/progress', getProgress);

// GET /api/v1/analysis/:id/result - 获取结果
router.get('/:id/result', getResult);

// POST /api/v1/analysis/:id/accept - 采纳修改
router.post('/:id/accept', acceptChanges);

export default router;