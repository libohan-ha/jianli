import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button, Footer, Header } from '../../components/common';
import { FileDropzone, TextInput } from '../../components/upload';
import { startAnalysis, submitText, uploadFile, validateFile } from '../../services';
import { useAnalysisStore } from '../../stores';

const positionOptions = [
  { value: '', label: '通用' },
  { value: 'frontend', label: '前端工程师' },
  { value: 'backend', label: '后端工程师' },
  { value: 'fullstack', label: '全栈工程师' },
  { value: 'product', label: '产品经理' },
  { value: 'design', label: 'UI/UX设计师' },
  { value: 'data', label: '数据分析师' },
  { value: 'devops', label: 'DevOps工程师' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setOriginalContent, startAnalysis: startStore, setResult, updateProgress } = useAnalysisStore();

  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetPosition, setTargetPosition] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error!);
      return;
    }
    setSelectedFile(file);
    setInputMode('file');
    toast.success(`已选择文件: ${file.name}`);
  };

  const handleFileError = (error: string) => {
    toast.error(error);
  };

  const handleTextChange = (value: string) => {
    setTextContent(value);
    if (value.trim()) {
      setInputMode('text');
      setSelectedFile(null);
    }
  };

  const canStartAnalysis = () => {
    if (inputMode === 'file' && selectedFile) return true;
    if (inputMode === 'text' && textContent.trim().length > 50) return true;
    return false;
  };

  const handleStartAnalysis = async () => {
    if (!canStartAnalysis()) {
      toast.error('请先上传简历文件或输入简历内容（至少50字符）');
      return;
    }

    setIsLoading(true);

    try {
      let content: string;

      if (inputMode === 'file' && selectedFile) {
        // 调用后端上传PDF接口
        const uploadResponse = await uploadFile(selectedFile);
        if (uploadResponse.code !== 200) {
          throw new Error(uploadResponse.message || '上传失败');
        }
        content = uploadResponse.data.content;
        
        setOriginalContent({
          type: 'file',
          fileName: selectedFile.name,
          content: content,
        });
      } else {
        // 调用后端提交文本接口
        const textResponse = await submitText(textContent);
        if (textResponse.code !== 200) {
          throw new Error(textResponse.message || '提交失败');
        }
        content = textResponse.data.content;
        
        setOriginalContent({
          type: 'text',
          fileName: null,
          content: content,
        });
      }

      // 调用后端开始分析接口
      const analysisResponse = await startAnalysis({
        content,
        targetPosition: targetPosition || '通用',
      });
      
      if (analysisResponse.code !== 200) {
        throw new Error(analysisResponse.message || '启动分析失败');
      }

      const analysisId = analysisResponse.data.analysisId;
      startStore(analysisId);
      navigate('/analyzing');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '操作失败，请重试';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100">
          {/* 标题区域 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-lg mb-4">
              <span className="text-blue-600 font-medium text-sm px-2">🚀 AI 驱动的简历优化助手</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              让 AI 打造你的<span className="text-blue-600">完美简历</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              基于专业 HR 视角，深度分析简历内容，提供智能优化建议，助你轻松斩获心仪 Offer。
            </p>
          </div>

          {/* 上传区域 */}
          <div className="space-y-8">
            <FileDropzone
              onFileSelect={handleFileSelect}
              onError={handleFileError}
              disabled={isLoading}
            />

            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">已选择: {selectedFile.name}</span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="ml-auto text-green-600 hover:text-green-800"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* 分隔线 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">或</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* 文本输入 */}
            <TextInput
              value={textContent}
              onChange={handleTextChange}
              placeholder="在此粘贴您的简历内容（至少50个字符）..."
              disabled={isLoading}
            />

            {/* 目标岗位选择 */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                目标岗位
              </label>
              <select
                value={targetPosition}
                onChange={(e) => setTargetPosition(e.target.value)}
                className="flex-1 bg-transparent border-none text-gray-900 font-medium focus:ring-0 cursor-pointer text-base"
                disabled={isLoading}
              >
                {positionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 开始分析按钮 */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleStartAnalysis}
                disabled={!canStartAnalysis()}
                loading={isLoading}
                className="w-48"
              >
                开始分析
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;