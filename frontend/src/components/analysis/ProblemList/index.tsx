import React, { useState } from 'react';
import type { Problem, ProblemType } from '../../../types';

interface ProblemListProps {
  problems: Problem[];
}

const typeStyles: Record<string, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-700', label: '严重' },
  major: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '中等' },
  suggestion: { bg: 'bg-blue-100', text: 'text-blue-700', label: '建议' },
};

const defaultStyle = { bg: 'bg-gray-100', text: 'text-gray-700', label: '提示' };

export const ProblemList: React.FC<ProblemListProps> = ({ problems }) => {
  const [expanded, setExpanded] = useState(false);
  const displayProblems = expanded ? problems : problems.slice(0, 3);

  return (
    <div className="h-full">
      <div className="space-y-4">
        {displayProblems.map((problem) => {
          const style = typeStyles[problem.type] || defaultStyle;
          return (
            <div
              key={problem.id}
              className="group flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-red-100 hover:shadow-sm transition-all duration-200"
            >
              <div className="shrink-0 mt-0.5">
               <span
                  className={`
                    inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide
                    ${style.bg} ${style.text} ring-1 ring-inset ring-black/5
                  `}
                >
                  {style.label}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium leading-relaxed group-hover:text-gray-900">{problem.description}</p>
                 <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400 group-hover:text-gray-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  位置: {problem.location}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {problems.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            {expanded ? (
               <>
                收起列表
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
               </>
            ) : (
              <>
                查看全部 {problems.length} 个问题
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {problems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">
            暂未发现明显问题，简历质量很棒！ 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default ProblemList;