import React from 'react';
import type { DiffChange } from '../../../types';

interface DiffStatsProps {
  changes: DiffChange[];
}

export const DiffStats: React.FC<DiffStatsProps> = ({ changes }) => {
  const stats = changes.reduce(
    (acc, change) => {
      acc[change.type]++;
      acc.total++;
      return acc;
    },
    { add: 0, delete: 0, modify: 0, total: 0 }
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">总计修改</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
      </div>
      
      <div className="h-12 w-px bg-gray-100 hidden sm:block" />
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-red-50 border border-red-100">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-red-700">删除</span>
          <span className="text-lg font-bold text-red-600">{stats.delete}</span>
        </div>
        
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-green-50 border border-green-100">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-green-700">新增</span>
          <span className="text-lg font-bold text-green-600">{stats.add}</span>
        </div>
        
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-sm font-medium text-amber-700">修改</span>
          <span className="text-lg font-bold text-amber-600">{stats.modify}</span>
        </div>
      </div>
    </div>
  );
};

export default DiffStats;