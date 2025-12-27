import { Response } from 'express';
import { ApiResponse } from '../types/common';

// 成功响应
export function success<T>(res: Response, data: T, message = '操作成功'): void {
  const response: ApiResponse<T> = {
    code: 200,
    message,
    data,
  };
  res.status(200).json(response);
}

// 错误响应
export function error(
  res: Response,
  code: number,
  message: string,
  errorType?: string,
  details?: Array<{ field: string; message: string }>
): void {
  const response: ApiResponse = {
    code,
    message,
  };
  if (errorType) {
    response.error = { type: errorType, details };
  }
  res.status(code).json(response);
}