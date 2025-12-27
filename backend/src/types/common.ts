// 统一响应格式
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
  error?: {
    type: string;
    details?: Array<{ field: string; message: string }>;
  };
}

// 上传文件响应
export interface UploadResponse {
  fileId: string;
  fileName: string;
  content: string;
  pageCount?: number;
  fileSize: number;
}

// 文本上传响应
export interface TextUploadResponse {
  fileId: string;
  content: string;
}