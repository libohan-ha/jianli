import React from 'react';
import type { Suggestion } from '../../../types';

interface SuggestionListProps {
  suggestions: Suggestion[];
}

export const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions }) => {
  // 按类别分组
  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      if (!acc[suggestion.category]) {
        acc[suggestion.category] = [];
      }
      acc[suggestion.category].push(suggestion);
      return acc;
    },
    {} as Record<string, Suggestion[]>
  );

  return (
    <div className="h-full">
      <div className="space-y-8">
        {Object.entries(groupedSuggestions).map(([category, items]) => (
          <div key={category} className="group/category">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              {category}
            </h4>

            <div className="space-y-4">
              {items.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="relative overflow-hidden border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 bg-white"
                >
                  <div className="grid gap-4 relative z-10">
                     {/* 原文部分 */}
                    <div className="relative pl-4 border-l-2 border-red-200">
                      <p className="text-xs font-bold text-red-500 mb-1 uppercase tracking-wider">Original</p>
                      <p className="text-sm text-gray-600 line-through decoration-red-200 decoration-2 break-words">{suggestion.original}</p>
                    </div>

                    {/* 建议部分 */}
                    <div className="relative pl-4 border-l-2 border-green-400 bg-green-50/50 -mx-5 px-9 py-3 my-1">
                       <p className="text-xs font-bold text-green-600 mb-1 uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Optimized
                      </p>
                      <p className="text-sm text-gray-900 font-medium break-words">{suggestion.optimized}</p>
                    </div>

                    {/* 原因 */}
                    {suggestion.reason && (
                      <div className="flex gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg items-start">
                        <span className="text-lg leading-none mt-px">💡</span>
                         <span className="leading-relaxed font-medium">{suggestion.reason}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-gray-900 font-medium mb-1">本次分析没有发现明显的优化点</p>
           <p className="text-sm text-gray-500">您的简历已经非常出色！</p>
        </div>
      )}
    </div>
  );
};

export default SuggestionList;