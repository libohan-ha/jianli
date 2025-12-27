import React from 'react';

interface ScoreCardProps {
  score: number;
  level?: string;
  percentile?: number;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};

const getLevel = (score: number): string => {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 60) return '及格';
  return '需改进';
};

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  level,
  percentile,
}) => {
  const displayLevel = level || getLevel(score);
  const scoreColor = getScoreColor(score);

  return (
    <div className="h-full flex flex-col items-center justify-center py-4">
      <h3 className="text-gray-500 font-medium mb-6">综合竞争力评分</h3>
      
      <div className="relative mb-6">
        <svg className="w-40 h-40 transform drop-shadow-sm" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {score >= 80 ? (
                <>
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </>
              ) : score >= 60 ? (
                <>
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#a16207" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </>
              )}
            </linearGradient>
          </defs>
          {/* 背景圆环 */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* 进度圆环 */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${score * 2.64} 264`}
            strokeDashoffset="0"
            transform="rotate(-90 50 50)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-extrabold tracking-tight ${scoreColor}`}>{score}</span>
          <span className="text-xs text-gray-400 font-medium uppercase mt-1">Total Score</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className={`text-2xl font-bold ${scoreColor}`}>
          {displayLevel}
        </div>
        {percentile && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-600 font-medium">
              超越 {percentile}% 的求职者
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;