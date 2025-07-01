// src/components/CompanyDetail/FinancialChart.tsx
import React from "react";
import type { CompanyDetail, FinancialData } from "../../data/companies";

interface FinancialChartProps {
  financialData: FinancialData[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ financialData }) => {
  if (!financialData || financialData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">재무 정보</h3>
        <p className="text-gray-500">재무 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 최대값
  const maxValue = Math.max(
    ...financialData.flatMap((d) => [d.revenue, d.operatingProfit, d.netIncome])
  );

  const formatValue = (value: number) => {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(1)}조`;
    if (abs >= 1e8) return `${sign}${(abs / 1e8).toFixed(1)}억`;
    if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)}백만`;
    if (abs >= 1e4) return `${sign}${(abs / 1e4).toFixed(1)}만`;
    return `${sign}${abs.toLocaleString()}원`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">최근 3년 재무 현황 (단위: 조원)</h3>
      <div className="space-y-6">
        {financialData.map((item) => (
          <div key={item.year} className="space-y-3">
            <h4 className="font-medium text-gray-700">{item.year}년</h4>
            {(['revenue', 'operatingProfit', 'netIncome'] as const).map((key) => (
              <div className="flex items-center space-x-3" key={key}>
                <span className="w-16 text-sm text-gray-600">
                  {{ revenue: '매출', operatingProfit: '영업이익', netIncome: '순이익' }[key]}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${(item[key] / maxValue) * 100}%` }}
                  />
                </div>
                <span className="w-16 text-sm font-medium text-right">
                  {formatValue(item[key])}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialChart;