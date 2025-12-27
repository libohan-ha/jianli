import type { AcceptChangesResult, AnalysisProgress, AnalysisResult, ApiResponse, StartAnalysisResult } from '../types';
import api from './api';

/**
 * 开始分析
 */
export async function startAnalysis(params: {
  fileId?: string;
  content?: string;
  targetPosition?: string;
}): Promise<ApiResponse<StartAnalysisResult>> {
  const response = await api.post('/analysis/start', params, {
    timeout: 60000,
  });
  return response as unknown as ApiResponse<StartAnalysisResult>;
}

/**
 * 查询分析进度
 */
export async function getAnalysisProgress(
  analysisId: string
): Promise<ApiResponse<AnalysisProgress>> {
  const response = await api.get(`/analysis/${analysisId}/progress`);
  return response as unknown as ApiResponse<AnalysisProgress>;
}

/**
 * 获取分析结果
 */
export async function getAnalysisResult(
  analysisId: string
): Promise<ApiResponse<AnalysisResult>> {
  const response = await api.get(`/analysis/${analysisId}/result`);
  return response as unknown as ApiResponse<AnalysisResult>;
}

/**
 * 采纳修改
 * @param analysisId 分析任务ID
 * @param options 采纳选项，可传入 suggestionIds 数组或 acceptAll: true
 */
export async function acceptChanges(
  analysisId: string,
  options: { suggestionIds?: string[]; acceptAll?: boolean }
): Promise<ApiResponse<AcceptChangesResult>> {
  const response = await api.post(`/analysis/${analysisId}/accept`, options);
  return response as unknown as ApiResponse<AcceptChangesResult>;
}

/**
 * 导出PDF
 */
export function getExportPdfUrl(analysisId: string): string {
  return `/api/v1/export/${analysisId}/pdf`;
}

/**
 * 导出Markdown
 */
export function getExportMarkdownUrl(analysisId: string): string {
  return `/api/v1/export/${analysisId}/markdown`;
}

/**
 * 轮询分析进度
 */
export function pollAnalysisProgress(
  analysisId: string,
  onProgress: (progress: AnalysisProgress) => void,
  onComplete: (result: AnalysisResult) => void,
  onError: (error: Error) => void,
  interval = 1000
): () => void {
  let timeoutId: number;
  let stopped = false;

  const poll = async () => {
    if (stopped) return;

    try {
      const progressRes = await getAnalysisProgress(analysisId);
      
      if (progressRes.code === 200) {
        onProgress(progressRes.data);

        if (progressRes.data.status === 'completed') {
          const resultRes = await getAnalysisResult(analysisId);
          if (resultRes.code === 200) {
            onComplete(resultRes.data);
          }
          return;
        }

        if (progressRes.data.status === 'error') {
          onError(new Error('分析失败'));
          return;
        }
      }

      timeoutId = window.setTimeout(poll, interval);
    } catch (error) {
      onError(error as Error);
    }
  };

  poll();

  // 返回取消函数
  return () => {
    stopped = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}