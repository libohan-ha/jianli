import { v4 as uuidv4 } from 'uuid';
import {
  AnalysisProgress,
  AnalysisResult,
  AnalysisStep,
  AnalysisTask,
} from '../types/analysis';
import { analyzeResume } from './llmService';

// 内存存储（生产环境应使用Redis/数据库）
const analysisTasks = new Map<string, AnalysisTask>();

// 分析步骤定义
const ANALYSIS_STEPS: Array<{ name: string; progress: number }> = [
  { name: '内容解析', progress: 10 },
  { name: '结构识别', progress: 25 },
  { name: '技能提取', progress: 45 },
  { name: '岗位匹配', progress: 65 },
  { name: '生成建议', progress: 85 },
  { name: '完成报告', progress: 100 },
];

// 生成分析ID
function generateAnalysisId(): string {
  return `analysis_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
}

// 创建分析任务
export function createAnalysisTask(
  content: string,
  targetPosition: string = '通用',
  fileId?: string
): AnalysisTask {
  const id = generateAnalysisId();
  const now = new Date();

  const steps: AnalysisStep[] = ANALYSIS_STEPS.map((s) => ({
    name: s.name,
    status: 'pending',
  }));

  const task: AnalysisTask = {
    id,
    fileId,
    content,
    targetPosition,
    status: 'pending',
    progress: 0,
    currentStep: '等待开始',
    steps,
    createdAt: now,
    updatedAt: now,
  };

  analysisTasks.set(id, task);
  return task;
}

// 获取分析任务
export function getAnalysisTask(id: string): AnalysisTask | undefined {
  return analysisTasks.get(id);
}

// 更新任务进度
function updateTaskProgress(
  task: AnalysisTask,
  stepIndex: number,
  status: 'processing' | 'completed'
): void {
  const step = ANALYSIS_STEPS[stepIndex];
  task.steps[stepIndex].status = status;
  task.progress = step.progress;
  task.currentStep = step.name;
  task.updatedAt = new Date();

  if (status === 'processing') {
    task.status = 'processing';
  }
}

// 执行分析任务
export async function executeAnalysis(taskId: string): Promise<void> {
  const task = analysisTasks.get(taskId);
  if (!task) {
    throw new Error('任务不存在');
  }

  try {
    // 模拟分析步骤进度
    for (let i = 0; i < ANALYSIS_STEPS.length - 1; i++) {
      updateTaskProgress(task, i, 'processing');
      await delay(500); // 模拟处理时间
      updateTaskProgress(task, i, 'completed');
    }

    // 调用LLM进行实际分析
    updateTaskProgress(task, ANALYSIS_STEPS.length - 1, 'processing');
    const llmResult = await analyzeResume(task.content, task.targetPosition);

    // 构建完整结果
    const result: AnalysisResult = {
      analysisId: task.id,
      createdAt: task.createdAt.toISOString(),
      targetPosition: task.targetPosition,
      overallScore: llmResult.overallScore,
      scoreLevel: llmResult.scoreLevel,
      dimensions: llmResult.dimensions,
      problems: llmResult.problems,
      suggestions: llmResult.suggestions,
      originalContent: task.content,
      optimizedContent: llmResult.optimizedContent,
    };

    task.result = result;
    task.status = 'completed';
    updateTaskProgress(task, ANALYSIS_STEPS.length - 1, 'completed');
  } catch (err) {
    task.status = 'failed';
    task.error = err instanceof Error ? err.message : '分析失败';
    task.updatedAt = new Date();
    console.error('分析任务失败:', err);
  }
}

// 获取分析进度
export function getAnalysisProgress(taskId: string): AnalysisProgress | null {
  const task = analysisTasks.get(taskId);
  if (!task) {
    return null;
  }

  return {
    status: task.status,
    progress: task.progress,
    currentStep: task.currentStep,
    steps: task.steps,
    estimatedRemaining: task.status === 'processing' 
      ? Math.ceil((100 - task.progress) / 10) 
      : undefined,
  };
}

// 获取分析结果
export function getAnalysisResult(taskId: string): AnalysisResult | null {
  const task = analysisTasks.get(taskId);
  if (!task || !task.result) {
    return null;
  }
  return task.result;
}

// 采纳修改建议
export function acceptSuggestions(
  taskId: string,
  suggestionIds: string[],
  acceptAll: boolean = false
): { acceptedCount: number; finalContent: string } | null {
  const task = analysisTasks.get(taskId);
  if (!task || !task.result) {
    return null;
  }

  const result = task.result;
  let finalContent = result.originalContent;
  let acceptedCount = 0;

  // 如果采纳全部，直接使用优化后的内容
  if (acceptAll) {
    finalContent = result.optimizedContent;
    acceptedCount = result.suggestions.length;
  } else {
    // 逐条应用选中的建议
    const selectedSuggestions = result.suggestions.filter(s =>
      suggestionIds.includes(s.id)
    );

    for (const suggestion of selectedSuggestions) {
      if (suggestion.original && suggestion.optimized) {
        finalContent = finalContent.replace(suggestion.original, suggestion.optimized);
        acceptedCount++;
      }
    }
  }

  // 更新任务的最终内容
  task.result.optimizedContent = finalContent;
  task.updatedAt = new Date();

  return {
    acceptedCount,
    finalContent,
  };
}

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}