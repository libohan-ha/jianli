import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Footer, Header, Loading } from '../../components/common';
import { getAnalysisResult, getExportMarkdownUrl, getExportPdfUrl } from '../../services';
import { useAnalysisStore } from '../../stores';
import type { AnalysisResult, ExportFormat } from '../../types';

const templateOptions = [
  { value: 'simple', label: '简洁专业' },
  { value: 'creative', label: '创意设计' },
  { value: 'academic', label: '学术风格' },
];

export const ExportPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { result: storeResult, setResult, exportConfig, setExportConfig } = useAnalysisStore();

  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setLocalResult] = useState<AnalysisResult | null>(storeResult);
  const [editedContent, setEditedContent] = useState<string>('');

  // 初始化编辑内容
  useEffect(() => {
    if (result?.optimizedContent) {
      setEditedContent(result.optimizedContent);
    }
  }, [result?.optimizedContent]);

  // 处理内容编辑
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  }, []);

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

  const handleBack = () => {
    navigate(-1);
  };

  const handleFormatChange = (format: ExportFormat) => {
    setExportConfig({ format });
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const url =
        exportConfig.format === 'pdf'
          ? getExportPdfUrl(id!)
          : getExportMarkdownUrl(id!);

      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportConfig.fileName}.${exportConfig.format === 'pdf' ? 'pdf' : 'md'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('导出成功！');
    } catch {
      toast.error('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white selection:bg-blue-100 selection:text-blue-900">
      <Header
        showBackButton
        onBack={handleBack}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleExport()}
              disabled={isExporting}
              className="shadow-sm"
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                下载 PDF
              </span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setExportConfig({ format: 'markdown' });
                handleExport();
              }}
              disabled={isExporting}
              className="shadow-sm"
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                下载 MD
              </span>
            </Button>
          </div>
        }
      />

      <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
            导出优化后的简历
          </h1>
          <p className="text-gray-500 mt-2 ml-4">
            选择导出格式和模板，预览并下载您的简历
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧设置面板 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">导出设置</h3>
                  <p className="text-xs text-gray-500">配置导出选项</p>
                </div>
              </div>

              {/* 格式选择 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  选择格式
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`
                      relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${exportConfig.format === 'pdf'
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="format"
                      checked={exportConfig.format === 'pdf'}
                      onChange={() => handleFormatChange('pdf')}
                      className="sr-only"
                    />
                    <svg className={`w-8 h-8 ${exportConfig.format === 'pdf' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className={`text-sm font-medium ${exportConfig.format === 'pdf' ? 'text-blue-700' : 'text-gray-600'}`}>PDF</span>
                    {exportConfig.format === 'pdf' && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </label>
                  <label
                    className={`
                      relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${exportConfig.format === 'markdown'
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="format"
                      checked={exportConfig.format === 'markdown'}
                      onChange={() => handleFormatChange('markdown')}
                      className="sr-only"
                    />
                    <svg className={`w-8 h-8 ${exportConfig.format === 'markdown' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className={`text-sm font-medium ${exportConfig.format === 'markdown' ? 'text-blue-700' : 'text-gray-600'}`}>Markdown</span>
                    {exportConfig.format === 'markdown' && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* PDF模板选择 */}
              {exportConfig.format === 'pdf' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    选择模板
                  </label>
                  <div className="space-y-2">
                    {templateOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                          ${exportConfig.template === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="template"
                          checked={exportConfig.template === option.value}
                          onChange={() => setExportConfig({ template: option.value })}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          exportConfig.template === option.value ? 'border-blue-500' : 'border-gray-300'
                        }`}>
                          {exportConfig.template === option.value && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          exportConfig.template === option.value ? 'text-blue-700' : 'text-gray-600'
                        }`}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* 文件名 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  文件名
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={exportConfig.fileName}
                    onChange={(e) => setExportConfig({ fileName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="输入文件名"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    .{exportConfig.format === 'pdf' ? 'pdf' : 'md'}
                  </span>
                </div>
              </div>

              {/* 导出按钮 */}
              <Button
                className="w-full h-12 text-base shadow-lg shadow-blue-500/20"
                onClick={handleExport}
                loading={isExporting}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  确认导出
                </span>
              </Button>
            </div>
          </div>

          {/* 右侧预览区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">实时预览</h3>
                    <p className="text-xs text-gray-500">优化后的简历效果</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium text-green-700">已优化</span>
                </div>
              </div>

              {/* 可编辑预览框 */}
              <div className="border border-gray-100 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 p-4 overflow-hidden">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <textarea
                    value={editedContent}
                    onChange={handleContentChange}
                    className="w-full h-[600px] p-6 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 border-none"
                    placeholder="在此编辑简历内容..."
                  />
                </div>
              </div>

              {/* 预览控制 */}
              <div className="flex items-center justify-between mt-4 px-2">
                <span className="text-sm text-gray-500 font-medium">第 1 页 / 共 1 页</span>
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5">
                  <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-700 font-medium min-w-[3rem] text-center">100%</span>
                  <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExportPage;