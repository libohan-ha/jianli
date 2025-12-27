import { Request, Response } from 'express';
import {
  createAnalysisTask,
  executeAnalysis,
  getAnalysisProgress,
  getAnalysisResult,
  getAnalysisTask,
  acceptSuggestions,
} from '../services/analysisService';
import { analyzeResume } from '../services/llmService';
import { error, success } from '../utils/response';

// 开始分析
export async function startAnalysis(req: Request, res: Response): Promise<void> {
  const { fileId, content, targetPosition } = req.body;

  // 验证参数
  if (!fileId && !content) {
    error(res, 400, '请提供fileId或content', 'VALIDATION_ERROR');
    return;
  }

  // 获取简历内容
  let resumeContent = content;
  if (fileId && !content) {
    // TODO: 从存储中获取文件内容
    // 暂时要求直接传content
    error(res, 400, '请直接提供content参数', 'VALIDATION_ERROR');
    return;
  }

  if (!resumeContent || resumeContent.length < 50) {
    error(res, 400, '简历内容过短', 'VALIDATION_ERROR');
    return;
  }

  try {
    // 创建分析任务
    const task = createAnalysisTask(resumeContent, targetPosition || '通用', fileId);

    // 异步执行分析（不阻塞响应）
    executeAnalysis(task.id).catch((err) => {
      console.error('分析执行错误:', err);
    });

    success(res, {
      analysisId: task.id,
      status: 'pending',
      estimatedTime: 30,
    }, '分析任务已创建');
  } catch (err) {
    console.error('创建分析任务失败:', err);
    error(res, 500, '创建分析任务失败', 'INTERNAL_ERROR');
  }
}

// 同步分析 - 直接返回结果（用于测试）
export async function analyzeSync(req: Request, res: Response): Promise<void> {
  const { content, targetPosition } = req.body;

  if (!content || content.length < 50) {
    error(res, 400, '请提供简历内容（至少50字符）', 'VALIDATION_ERROR');
    return;
  }

  try {
    console.log('开始调用DeepSeek API...');
    const result = await analyzeResume(content, targetPosition || '通用');
    console.log('DeepSeek API调用成功');
    
    success(res, {
      overallScore: result.overallScore,
      scoreLevel: result.scoreLevel,
      dimensions: result.dimensions,
      problems: result.problems,
      suggestions: result.suggestions,
      optimizedContent: result.optimizedContent,
    }, '分析完成');
  } catch (err) {
    console.error('AI分析失败:', err);
    error(res, 500, err instanceof Error ? err.message : 'AI分析失败', 'ANALYSIS_ERROR');
  }
}

// 查询进度
export async function getProgress(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    error(res, 400, '请提供分析任务ID', 'VALIDATION_ERROR');
    return;
  }

  const progress = getAnalysisProgress(id);
  if (!progress) {
    error(res, 404, '分析任务不存在', 'NOT_FOUND');
    return;
  }

  success(res, progress);
}

// 获取结果
export async function getResult(req: Request, res: Response): Promise<void> {
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

  if (task.status === 'pending' || task.status === 'processing') {
    error(res, 400, '分析尚未完成', 'PROCESSING');
    return;
  }

  if (task.status === 'failed') {
    error(res, 500, task.error || '分析失败', 'ANALYSIS_FAILED');
    return;
  }

  const result = getAnalysisResult(id);
  if (!result) {
    error(res, 500, '获取结果失败', 'INTERNAL_ERROR');
    return;
  }

  success(res, result);
}

// 采纳修改
export async function acceptChanges(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { suggestionIds, acceptAll } = req.body;

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

  // 验证参数
  if (!acceptAll && (!suggestionIds || !Array.isArray(suggestionIds))) {
    error(res, 400, '请提供suggestionIds数组或设置acceptAll为true', 'VALIDATION_ERROR');
    return;
  }

  const result = acceptSuggestions(id, suggestionIds || [], acceptAll === true);
  if (!result) {
    error(res, 500, '采纳修改失败', 'INTERNAL_ERROR');
    return;
  }

  success(res, {
    acceptedCount: result.acceptedCount,
    finalContent: result.finalContent,
  }, '修改已采纳');
}