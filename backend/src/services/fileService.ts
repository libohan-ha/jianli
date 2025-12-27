import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';

export interface ParsedPDF {
  content: string;
  pageCount: number;
}

// 解析PDF文件
export async function parsePDF(filePath: string): Promise<ParsedPDF> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  return {
    content: data.text,
    pageCount: data.numpages,
  };
}

// 生成文件ID
export function generateFileId(prefix: string = 'file'): string {
  return `${prefix}_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
}

// 删除临时文件
export function deleteTempFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('删除临时文件失败:', err);
  }
}

// 确保上传目录存在
export function ensureUploadDir(): void {
  const uploadDir = path.join(process.cwd(), 'tmp', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}