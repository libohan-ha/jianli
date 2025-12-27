import { Request, Response } from 'express';
import { deleteTempFile, generateFileId, parsePDF } from '../services/fileService';
import { TextUploadResponse, UploadResponse } from '../types/common';
import { error, success } from '../utils/response';

// 上传PDF文件
export async function uploadFile(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;

    if (!file) {
      error(res, 400, '请选择文件上传', 'VALIDATION_ERROR');
      return;
    }

    // 解析PDF
    const parsed = await parsePDF(file.path);

    // 生成文件ID
    const fileId = generateFileId('file');

    // 异步删除临时文件
    setImmediate(() => deleteTempFile(file.path));

    const response: UploadResponse = {
      fileId,
      fileName: file.originalname,
      content: parsed.content,
      pageCount: parsed.pageCount,
      fileSize: file.size,
    };

    success(res, response, '上传成功');
  } catch (err) {
    // 删除临时文件
    if (req.file) {
      deleteTempFile(req.file.path);
    }

    error(res, 422, 'PDF解析失败，请检查文件是否损坏', 'PROCESSING_ERROR');
  }
}

// 直接提交文本
export async function uploadText(req: Request, res: Response): Promise<void> {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    error(res, 400, '请提供简历文本内容', 'VALIDATION_ERROR');
    return;
  }

  if (content.length < 100 || content.length > 20000) {
    error(res, 400, '文本长度需在100-20000字符之间', 'VALIDATION_ERROR');
    return;
  }

  const fileId = generateFileId('text');

  const response: TextUploadResponse = {
    fileId,
    content,
  };

  success(res, response, '提交成功');
}