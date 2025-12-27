// 分析任务状态
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

// 问题类型
export type ProblemType = 'critical' | 'major' | 'minor';

// 优先级
export type Priority = 'high' | 'medium' | 'low';

// 维度评分
export interface Dimension {
  name: string;
  key: string;
  score: number;
  weight: number;
  comment: string;
}

// 问题
export interface Problem {
  id: string;
  type: ProblemType;
  title: string;
  description: string;
  location: string;
  suggestion: string;
}

// 优化建议
export interface Suggestion {
  id: string;
  category: string;
  priority: Priority;
  original: string;
  optimized: string;
  reason: string;
}

// 分析步骤
export interface AnalysisStep {
  name: string;
  status: 'pending' | 'processing' | 'completed';
}

// 分析进度响应
export interface AnalysisProgress {
  status: AnalysisStatus;
  progress: number;
  currentStep: string;
  steps: AnalysisStep[];
  estimatedRemaining?: number;
}

// 分析结果
export interface AnalysisResult {
  analysisId: string;
  createdAt: string;
  targetPosition: string;
  overallScore: number;
  scoreLevel: string;
  percentile?: number;
  dimensions: Dimension[];
  problems: Problem[];
  suggestions: Suggestion[];
  originalContent: string;
  optimizedContent: string;
}

// 分析任务存储
export interface AnalysisTask {
  id: string;
  fileId?: string;
  content: string;
  targetPosition: string;
  status: AnalysisStatus;
  progress: number;
  currentStep: string;
  steps: AnalysisStep[];
  result?: AnalysisResult;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// LLM响应格式
export interface LLMAnalysisResponse {
  overallScore: number;
  scoreLevel: string;
  dimensions: Dimension[];
  problems: Problem[];
  suggestions: Suggestion[];
  optimizedContent: string;
}