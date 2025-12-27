import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = '在此粘贴您的简历内容...',
  disabled = false,
  rows = 6,
}) => {
  return (
    <div className="relative group">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-5 py-4 border border-gray-200 rounded-xl
          text-gray-700 placeholder-gray-400 leading-relaxed font-mono text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          resize-none transition-all duration-200 shadow-sm
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-gray-300'}
        `}
      />
      <div className={`
        absolute bottom-4 right-4 text-xs font-medium px-2 py-1 rounded backdrop-blur-sm pointer-events-none transition-colors duration-200
        ${value.length > 0 ? 'text-blue-600 bg-blue-50' : 'text-gray-400 bg-gray-50'}
      `}>
        {value.length} 字符
      </div>
    </div>
  );
};

export default TextInput;