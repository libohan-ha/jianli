import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { error } from '../utils/response';

// 全局错误处理中间件
export function errorHandler(
  err: Error & { code?: string },
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Multer错误
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error(res, 413, '文件大小超过10MB限制', 'FILE_TOO_LARGE');
      return;
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error(res, 400, '请使用字段名"file"上传PDF文件', 'INVALID_FIELD_NAME');
      return;
    }
  }

  // 文件格式错误
  if (err.message === 'UNSUPPORTED_FORMAT') {
    error(res, 415, '仅支持PDF格式文件', 'UNSUPPORTED_FORMAT');
    return;
  }

  // 其他错误
  console.error('服务器错误:', err);
  error(res, 500, '服务器内部错误', 'INTERNAL_ERROR');
}