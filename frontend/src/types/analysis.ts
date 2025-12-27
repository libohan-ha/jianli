// 维度评分
export interface DimensionScore {
  name: string;
  key?: string;
  score: number;
  weight?: number;
  comment: string;
}

// 问题类型
export type ProblemType = 'critical' | 'major' | 'suggestion';

// 问题
export interface Problem {
  id: string;
  type: ProblemType;
  title?: string;
  description: string;
  location: string;
  suggestion?: string;
}

// 优化建议优先级
export type SuggestionPriority = 'high' | 'medium' | 'low';

// 优化建议
export interface Suggestion {
  id: string;
  category: string;
  priority?: SuggestionPriority;
  original: string;
  optimized: string;
  reason: string;
}

// 分析结果
export interface AnalysisResult {
  analysisId?: string;
  createdAt?: string;
  targetPosition?: string;
  overallScore: number;
  scoreLevel?: string;
  dimensions: DimensionScore[];
  problems: Problem[];
  suggestions: Suggestion[];
  originalContent: string;
  optimizedContent: string;
}

// 分析步骤状态
export type StepStatus = 'pending' | 'processing' | 'completed';

// 分析步骤
export interface AnalysisStep {
  name: string;
  status: StepStatus;
}

// 分析进度
export interface AnalysisProgress {
  status: 'idle' | 'uploading' | 'analyzing' | 'processing' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  steps: AnalysisStep[];
  estimatedRemaining?: number;
}

// Diff变更
export interface DiffChange {
  id: string;
  lineNumber: number;
  type: 'add' | 'delete' | 'modify';
  original: string;
  modified: string;
  description: string;
}

// 导出格式
export type ExportFormat = 'pdf' | 'markdown';

// 导出配置
export interface ExportConfig {
  format: ExportFormat;
  template: string;
  fileName: string;
}