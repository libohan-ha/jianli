// 用户信息
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// API响应基础结构
export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

// 上传文件结果
export interface UploadResult {
  fileId: string;
  fileName: string;
  content: string;
  pageCount: number;
  fileSize: number;
}

// 文本提交结果
export interface TextSubmitResult {
  fileId: string;
  content: string;
}

// 开始分析结果
export interface StartAnalysisResult {
  analysisId: string;
  status: string;
  estimatedTime?: number;
}

// 采纳修改结果
export interface AcceptChangesResult {
  acceptedCount: number;
  finalContent: string;
}

// 目标岗位选项
export interface PositionOption {
  value: string;
  label: string;
}

// 按钮变体
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

// 按钮尺寸
export type ButtonSize = 'sm' | 'md' | 'lg';