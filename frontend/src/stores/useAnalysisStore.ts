import { create } from 'zustand';
import type {
    AnalysisProgress,
    AnalysisResult,
    DiffChange,
    ExportConfig,
} from '../types';

interface OriginalContent {
  type: 'file' | 'text';
  fileName: string | null;
  content: string;
}

interface AnalysisState {
  // 当前分析会话
  currentSession: {
    id: string | null;
    status: AnalysisProgress['status'];
    progress: number;
    currentStep: string;
  };

  // 原始输入
  originalContent: OriginalContent;

  // 分析结果
  result: AnalysisResult | null;

  // Diff状态
  diff: {
    changes: DiffChange[];
    acceptedIds: string[];
  };

  // 导出配置
  exportConfig: ExportConfig;

  // Actions
  setOriginalContent: (content: OriginalContent) => void;
  startAnalysis: (id: string) => void;
  updateProgress: (progress: number, step: string) => void;
  setResult: (result: AnalysisResult) => void;
  setError: () => void;
  acceptChange: (id: string) => void;
  rejectChange: (id: string) => void;
  acceptAllChanges: () => void;
  resetChanges: () => void;
  setExportConfig: (config: Partial<ExportConfig>) => void;
  reset: () => void;
}

const initialState = {
  currentSession: {
    id: null,
    status: 'idle' as const,
    progress: 0,
    currentStep: '',
  },
  originalContent: {
    type: 'text' as const,
    fileName: null,
    content: '',
  },
  result: null,
  diff: {
    changes: [],
    acceptedIds: [],
  },
  exportConfig: {
    format: 'pdf' as const,
    template: 'simple',
    fileName: '我的简历_优化版',
  },
};

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  ...initialState,

  setOriginalContent: (content) =>
    set({ originalContent: content }),

  startAnalysis: (id) =>
    set({
      currentSession: {
        id,
        status: 'analyzing',
        progress: 0,
        currentStep: '正在准备分析...',
      },
    }),

  updateProgress: (progress, step) =>
    set((state) => ({
      currentSession: {
        ...state.currentSession,
        progress,
        currentStep: step,
      },
    })),

  setResult: (result) =>
    set({
      currentSession: {
        ...get().currentSession,
        status: 'completed',
        progress: 100,
        currentStep: '分析完成',
      },
      result,
    }),

  setError: () =>
    set((state) => ({
      currentSession: {
        ...state.currentSession,
        status: 'error',
      },
    })),

  acceptChange: (id) =>
    set((state) => ({
      diff: {
        ...state.diff,
        acceptedIds: [...state.diff.acceptedIds, id],
      },
    })),

  rejectChange: (id) =>
    set((state) => ({
      diff: {
        ...state.diff,
        acceptedIds: state.diff.acceptedIds.filter((i) => i !== id),
      },
    })),

  acceptAllChanges: () =>
    set((state) => {
      // 从 result.suggestions 获取所有 suggestion IDs
      const allIds = state.result?.suggestions?.map((s) => s.id) || [];
      return {
        diff: {
          ...state.diff,
          acceptedIds: allIds,
        },
      };
    }),

  resetChanges: () =>
    set((state) => ({
      diff: {
        ...state.diff,
        acceptedIds: [],
      },
    })),

  setExportConfig: (config) =>
    set((state) => ({
      exportConfig: {
        ...state.exportConfig,
        ...config,
      },
    })),

  reset: () => set(initialState),
}));

export default useAnalysisStore;