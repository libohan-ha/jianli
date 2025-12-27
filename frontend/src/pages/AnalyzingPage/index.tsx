import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button, Header } from '../../components/common';
import { pollAnalysisProgress } from '../../services';
import { useAnalysisStore } from '../../stores';
import type { AnalysisStep, StepStatus } from '../../types';

const defaultSteps: AnalysisStep[] = [
  { name: '文件解析完成', status: 'pending' },
  { name: '内容结构识别', status: 'pending' },
  { name: '技能关键词提取', status: 'pending' },
  { name: '岗位匹配分析', status: 'pending' },
  { name: '生成优化建议', status: 'pending' },
  { name: '完成分析报告', status: 'pending' },
];

const getStepIcon = (status: StepStatus) => {
  switch (status) {
    case 'completed':
      return (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'processing':
      return (
        <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
};

export const AnalyzingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentSession, setResult, setError, updateProgress } = useAnalysisStore();
  const [steps, setSteps] = useState<AnalysisStep[]>(defaultSteps);
  const [estimatedTime, setEstimatedTime] = useState(30);

  useEffect(() => {
    if (!currentSession.id) {
      navigate('/', { replace: true });
      return;
    }

    // 调用真实后端接口轮询进度
    const cancelPolling = pollAnalysisProgress(
      currentSession.id,
      (progress) => {
        updateProgress(progress.progress, progress.currentStep);
        if (progress.steps) {
          setSteps(progress.steps);
        }
        // 根据后端返回的estimatedRemaining计算剩余时间
        if (progress.estimatedRemaining !== undefined) {
          setEstimatedTime(progress.estimatedRemaining);
        } else {
          setEstimatedTime(Math.max(0, Math.round((100 - progress.progress) * 0.3)));
        }
      },
      (result) => {
        setResult(result);
        toast.success('分析完成！');
        navigate(`/result/${currentSession.id}`, { replace: true });
      },
      (error) => {
        setError();
        toast.error(error.message || '分析失败，请重试');
        navigate('/', { replace: true });
      },
      2000 // 每2秒轮询一次
    );

    return () => {
      cancelPolling();
    };
  }, [currentSession.id, navigate, setResult, setError, updateProgress]);

  const handleCancel = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* 动画图标 */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center relative z-10">
              <svg
                className="w-12 h-12 text-blue-600 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-100/50 rounded-full animate-pulse z-0" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              AI 正在深度分析您的简历
            </h1>
            <p className="text-gray-500">
              我们可以为您挖掘简历中的每一个亮点，请稍候...
            </p>
          </div>

          {/* 进度条 */}
          <div className="mb-10 px-4">
            <div className="flex justify-between text-sm font-medium text-gray-600 mb-3">
              <span className="text-blue-600">{currentSession.currentStep}</span>
              <span className="text-gray-500">{currentSession.progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full relative"
                style={{ width: `${currentSession.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              预计剩余时间: 约 {estimatedTime} 秒
            </p>
          </div>

          {/* 步骤列表 */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">分析流程与状态</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-300
                    ${step.status === 'completed' ? 'bg-green-50 border-green-200 text-green-500' :
                      step.status === 'processing' ? 'bg-blue-50 border-blue-200 text-blue-500 animate-pulse' :
                      'bg-gray-100 border-gray-200 text-gray-300'}
                  `}>
                    {step.status === 'completed' && (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {step.status === 'processing' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                    )}
                    {step.status === 'pending' && (
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      step.status === 'pending'
                        ? 'text-gray-400'
                        : step.status === 'processing'
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700 font-medium'
                    }`}
                  >
                    {step.name}
                    {step.status === 'processing' && (
                      <span className="ml-2 text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full font-normal">进行中...</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 取消按钮 */}
          <div className="mt-8">
            <Button variant="ghost" onClick={handleCancel}>
              取消分析
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyzingPage;