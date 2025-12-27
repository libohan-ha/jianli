import React, { useCallback } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
  accept?: string[];
  maxSize?: number;
  disabled?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  onError,
  accept = ['.pdf'],
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.message.includes('file type')) {
          onError?.('仅支持 PDF 格式，请上传正确的文件');
        } else if (error.message.includes('larger')) {
          onError?.('文件大小超过 10MB 限制，请压缩后重试');
        } else {
          onError?.(error.message);
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, onError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': accept,
    },
    maxSize,
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        group relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
        transition-all duration-300 ease-in-out
        ${isDragActive && !isDragReject
          ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg'
          : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'
        }
        ${isDragReject ? 'border-red-500 bg-red-50' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed hover:border-gray-200 hover:shadow-none' : ''}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        <div className={`
          w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-300
          ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
        `}>
          <svg
            className="w-10 h-10 transition-transform duration-300 group-hover:-translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <div className="space-y-1">
          <p className={`text-lg font-semibold transition-colors duration-300 ${isDragActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`}>
            {isDragActive ? '释放文件即刻上传' : '点击或拖拽上传简历'}
          </p>
          <p className="text-sm text-gray-500">
            支持 PDF 格式，文件大小不超过 10MB
          </p>
        </div>
        
        {!isDragActive && (
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-300">
              推荐使用标准 PDF 格式
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;