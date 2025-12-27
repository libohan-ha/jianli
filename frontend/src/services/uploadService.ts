import type { ApiResponse, TextSubmitResult, UploadResult } from '../types';
import api from './api';

/**
 * 上传PDF文件
 */
export async function uploadFile(file: File): Promise<ApiResponse<UploadResult>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 文件上传超时时间延长到60秒
  });

  return response as unknown as ApiResponse<UploadResult>;
}

/**
 * 提交文本内容
 */
export async function submitText(content: string): Promise<ApiResponse<TextSubmitResult>> {
  const response = await api.post('/upload/text', { content });
  return response as unknown as ApiResponse<TextSubmitResult>;
}

/**
 * 验证文件
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // 检查文件类型
  if (file.type !== 'application/pdf') {
    return {
      valid: false,
      error: '仅支持 PDF 格式，请上传正确的文件',
    };
  }

  // 检查文件大小 (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '文件大小超过 10MB 限制，请压缩后重试',
    };
  }

  return { valid: true };
}