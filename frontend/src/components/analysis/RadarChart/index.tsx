import React from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
} from 'recharts';
import type { DimensionScore } from '../../../types';

interface RadarChartProps {
  data: DimensionScore[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    dimension: item.name,
    score: item.score,
    fullMark: 100,
  }));

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-1 w-full min-h-[280px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData}>
            <PolarGrid stroke="#E5E7EB" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="评分"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="#3B82F6"
              fillOpacity={0.2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      {/* 维度详情 */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 px-2 text-center sm:text-left">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col sm:flex-row items-center sm:justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-500 mb-1 sm:mb-0">{item.name}</span>
            <span className={`text-sm font-bold ${
              item.score >= 80 ? 'text-green-600' :
              item.score >= 60 ? 'text-blue-600' :
              'text-orange-500'
            }`}>{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadarChart;