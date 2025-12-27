import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Footer, Header, Loading } from '../../components/common';
import { DiffControls, DiffStats, DiffViewer } from '../../components/diff';
import { acceptChanges, getAnalysisResult } from '../../services';
import { useAnalysisStore } from '../../stores';
import type { AnalysisResult, DiffChange } from '../../types';

export const DiffPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    result: storeResult,
    setResult,
    diff,
    acceptChange,
    rejectChange,
    acceptAllChanges,
    resetChanges,
  } = useAnalysisStore();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setLocalResult] = useState<AnalysisResult | null>(storeResult);

  useEffect(() => {
    // 如果store中有结果，直接使用
    if (storeResult) {
      setLocalResult(storeResult);
      return;
    }

    // 如果没有结果但有id，从后端获取
    if (id && !storeResult) {
      setLoading(true);
      getAnalysisResult(id)
        .then((response) => {
          if (response.code === 200) {
            setLocalResult(response.data);
            setResult(response.data);
          } else {
            toast.error(response.message || '获取分析结果失败');
            navigate('/');
          }
        })
        .catch((error) => {
          toast.error(error.message || '获取分析结果失败');
          navigate('/');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!id) {
      navigate('/');
    }
  }, [id, storeResult, setResult, navigate]);

  // 从建议中生成diff changes
  const changes: DiffChange[] = useMemo(() => {
    if (!result) return [];
    return result.suggestions.map((suggestion, index) => ({
      id: suggestion.id,
      lineNumber: index + 1,
      type: 'modify' as const,
      original: suggestion.original,
      modified: suggestion.optimized,
      description: `${suggestion.category}: ${suggestion.reason || '优化建议'}`,
    }));
  }, [result]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loading text="加载分析结果中..." />
        </main>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleExport = async () => {
    if (!id) return;

    // 如果用户选择了要采纳的建议，先调用后端API
    if (diff.acceptedIds.length > 0) {
      setSubmitting(true);
      try {
        const response = await acceptChanges(id, { suggestionIds: diff.acceptedIds });
        if (response.code === 200) {
          toast.success(`已采纳 ${response.data.acceptedCount} 条修改`);
        }
      } catch (error) {
        toast.error('采纳修改失败，请重试');
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }

    navigate(`/export/${id}`);
  };

  const handleAcceptAllAndExport = async () => {
    if (!id) return;

    setSubmitting(true);
    try {
      const response = await acceptChanges(id, { acceptAll: true });
      if (response.code === 200) {
        toast.success(`已采纳全部 ${response.data.acceptedCount} 条修改`);
        acceptAllChanges(); // 同步更新本地状态
      }
    } catch (error) {
      toast.error('采纳修改失败，请重试');
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    navigate(`/export/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white selection:bg-blue-100 selection:text-blue-900">
      <Header
        showBackButton
        onBack={handleBack}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={resetChanges} disabled={submitting} className="text-gray-500 hover:text-gray-700">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重置
              </span>
            </Button>
            <Button variant="secondary" size="sm" onClick={handleAcceptAllAndExport} disabled={submitting} loading={submitting}>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                全部采纳并导出
              </span>
            </Button>
            <Button size="sm" onClick={handleExport} disabled={submitting} loading={submitting} className="shadow-lg shadow-blue-500/20">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出选中
              </span>
            </Button>
          </div>
        }
      />

      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
            简历对比与修改
          </h1>
          <p className="text-gray-500 mt-2 ml-4">
            对比原始简历和优化后的版本，逐条确认或忽略修改建议
          </p>
        </div>

        {/* 统计信息 */}
        <div className="mb-6">
          <DiffStats changes={changes} />
        </div>

        {/* Diff视图 */}
        <div className="mb-8">
          <DiffViewer
            original={result.originalContent}
            modified={result.optimizedContent}
          />
        </div>

        {/* 修改控制列表 */}
        <div className="mb-8">
          <DiffControls
            changes={changes}
            acceptedIds={diff.acceptedIds}
            onAccept={acceptChange}
            onReject={rejectChange}
            onAcceptAll={acceptAllChanges}
            onReset={resetChanges}
          />
        </div>

        {/* 底部操作 */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
          <Button
            size="lg"
            variant="secondary"
            onClick={handleExport}
            disabled={submitting || diff.acceptedIds.length === 0}
            loading={submitting}
            className="w-full sm:w-64 h-14 text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              导出选中 ({diff.acceptedIds.length})
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Button>
          <Button
            size="lg"
            onClick={handleAcceptAllAndExport}
            disabled={submitting}
            loading={submitting}
            className="w-full sm:w-64 h-14 text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform"
          >
            <span className="flex items-center justify-center gap-2">
              全部采纳并导出
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiffPage;