import { Request, Response } from 'express';
import { getAnalysisResult, getAnalysisTask } from '../services/analysisService';
import { generateMarkdown, generatePDF } from '../services/exportService';
import { error } from '../utils/response';

// 导出PDF
export async function exportPDF(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    error(res, 400, '请提供分析任务ID', 'VALIDATION_ERROR');
    return;
  }

  const task = getAnalysisTask(id);
  if (!task) {
    error(res, 404, '分析任务不存在', 'NOT_FOUND');
    return;
  }

  if (task.status !== 'completed') {
    error(res, 400, '分析尚未完成', 'PROCESSING');
    return;
  }

  const result = getAnalysisResult(id);
  if (!result) {
    error(res, 500, '获取结果失败', 'INTERNAL_ERROR');
    return;
  }

  try {
    const pdfBuffer = await generatePDF(result);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume_optimized.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('生成PDF失败:', err);
    error(res, 500, '生成PDF失败', 'EXPORT_ERROR');
  }
}

// 导出Markdown
export async function exportMarkdown(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    error(res, 400, '请提供分析任务ID', 'VALIDATION_ERROR');
    return;
  }

  const task = getAnalysisTask(id);
  if (!task) {
    error(res, 404, '分析任务不存在', 'NOT_FOUND');
    return;
  }

  if (task.status !== 'completed') {
    error(res, 400, '分析尚未完成', 'PROCESSING');
    return;
  }

  const result = getAnalysisResult(id);
  if (!result) {
    error(res, 500, '获取结果失败', 'INTERNAL_ERROR');
    return;
  }

  try {
    const markdown = generateMarkdown(result);

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="resume_optimized.md"');
    res.send(markdown);
  } catch (err) {
    console.error('生成Markdown失败:', err);
    error(res, 500, '生成Markdown失败', 'EXPORT_ERROR');
  }
}