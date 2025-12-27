import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { ProblemList, RadarChart, ScoreCard, SuggestionList } from '../../components/analysis';
import { Button, Footer, Header, Loading } from '../../components/common';
import { getAnalysisResult } from '../../services';
import { useAnalysisStore } from '../../stores';
import type { AnalysisResult } from '../../types';

export const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { result: storeResult, setResult, reset } = useAnalysisStore();
  const [loading, setLoading] = useState(false);
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

  const handleReAnalyze = () => {
    reset();
    navigate('/', { replace: true });
  };

  const handleViewDiff = () => {
    navigate(`/diff/${id}`);
  };

  const handleExport = () => {
    navigate(`/export/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 selection:bg-blue-100 selection:text-blue-900">
      <Header
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleReAnalyze} className="!border-gray-200 hover:!border-blue-500 hover:!text-blue-600">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重新分析
              </span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleViewDiff} className="!border-gray-200 hover:!border-blue-500 hover:!text-blue-600">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                查看对比
              </span>
            </Button>
            <Button size="sm" onClick={handleExport} className="shadow-lg shadow-blue-500/30">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出报告
              </span>
            </Button>
          </div>
        }
      />

      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        {/* 标题区域 */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
              分析结果概览
            </h1>
            <p className="text-gray-600 mt-2 ml-4">
              AI 已完成深度诊断，为您生成了详细的优化方案
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            分析完成于 {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* 核心指标卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
             <ScoreCard
              score={result.overallScore}
              percentile={65} // 这里后续可以对接真实排名数据
            />
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 ml-2">五维能力模型</h3>
            <div className="h-[300px] w-full flex items-center justify-center">
              <RadarChart data={result.dimensions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 问题列表 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                需改进问题
                <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full border border-red-100">{result.problems.length}</span>
              </h3>
            </div>
            <ProblemList problems={result.problems} />
          </div>

          {/* 优化建议 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                智能优化建议
                <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full border border-blue-100">{result.suggestions.length}</span>
              </h3>
            </div>
            <SuggestionList suggestions={result.suggestions} />
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex justify-center pb-8">
          <Button
            size="lg"
            onClick={handleViewDiff}
            className="w-full sm:w-80 h-14 text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform"
          >
            <span className="flex items-center justify-center gap-2">
              查看修改前后对比
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultPage;