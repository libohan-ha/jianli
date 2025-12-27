import { Router } from 'express';
import { exportMarkdown, exportPDF } from '../controllers/exportController';

const router = Router();

// GET /api/v1/export/:id/pdf - 导出PDF
router.get('/:id/pdf', exportPDF);

// GET /api/v1/export/:id/markdown - 导出Markdown
router.get('/:id/markdown', exportMarkdown);

export default router;