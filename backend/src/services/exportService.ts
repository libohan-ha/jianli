import PDFDocument from 'pdfkit';
import { AnalysisResult } from '../types/analysis';

// 生成PDF文件
export async function generatePDF(result: AnalysisResult): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // 标题
    doc.fontSize(18).font('Helvetica-Bold').text('Optimized Resume', { align: 'center' });
    doc.moveDown();

    // 评分信息
    doc.fontSize(12).font('Helvetica-Bold').text(`Score: ${result.overallScore}/100 (${result.scoreLevel})`);
    doc.moveDown();

    // 简历内容
    doc.fontSize(11).font('Helvetica').text(result.optimizedContent || result.originalContent, {
      align: 'left',
      lineGap: 4,
    });

    doc.end();
  });
}

// 生成Markdown文件（只导出优化后的简历内容）
export function generateMarkdown(result: AnalysisResult): string {
  return result.optimizedContent || result.originalContent;
}