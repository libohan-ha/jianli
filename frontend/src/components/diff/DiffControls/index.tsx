import React from 'react';
import type { DiffChange } from '../../../types';
import Button from '../../common/Button';

interface DiffControlsProps {
  changes: DiffChange[];
  acceptedIds: string[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onAcceptAll: () => void;
  onReset: () => void;
}

export const DiffControls: React.FC<DiffControlsProps> = ({
  changes,
  acceptedIds,
  onAccept,
  onReject,
  onAcceptAll,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">修改建议列表</h3>
            <p className="text-xs text-gray-500">逐条审核并选择采纳或忽略</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 mr-2">
            已采纳 {acceptedIds.length}/{changes.length}
          </span>
          <Button variant="ghost" size="sm" onClick={onReset} className="text-gray-500">
            重置
          </Button>
          <Button variant="secondary" size="sm" onClick={onAcceptAll}>
            全部采纳
          </Button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-auto">
        {changes.map((change, index) => {
          const isAccepted = acceptedIds.includes(change.id);
          return (
            <div
              key={change.id}
              className={`
                group px-6 py-4 border-b border-gray-50 last:border-b-0
                flex items-start gap-4 transition-all duration-200
                ${isAccepted ? 'bg-green-50/50' : 'hover:bg-gray-50/50'}
              `}
            >
              <div className="pt-0.5">
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAccepted}
                    onChange={() => (isAccepted ? onReject(change.id) : onAccept(change.id))}
                    className="sr-only peer"
                  />
                  <div className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                    ${isAccepted
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 group-hover:border-blue-400'
                    }
                  `}>
                    {isAccepted && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-500 shrink-0">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-sm font-medium text-gray-800">{change.description}</p>
                <div className="text-xs space-y-1">
                  {change.type === 'add' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 text-green-700">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      新增内容
                    </span>
                  )}
                  {change.type === 'delete' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-700">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                      删除内容
                    </span>
                  )}
                  {change.type === 'modify' && (
                    <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="line-through text-red-500 break-all">{change.original}</span>
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="text-green-600 font-medium break-all">{change.modified}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {isAccepted ? (
                  <button
                    onClick={() => onReject(change.id)}
                    className="text-xs font-medium text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    撤销
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onAccept(change.id)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      采纳
                    </button>
                    <button
                      onClick={() => onReject(change.id)}
                      className="text-xs font-medium text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      忽略
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {changes.length === 0 && (
        <div className="px-6 py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">暂无修改建议</p>
          <p className="text-gray-400 text-sm mt-1">您的简历已经非常完善</p>
        </div>
      )}
    </div>
  );
};

export default DiffControls;