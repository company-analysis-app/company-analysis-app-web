import type React from "react"
import type { FinancialData } from "../../data/companies"

interface FinancialChartProps {
  data: FinancialData[]
}

const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">재무 정보</h3>
        <p className="text-gray-500">재무 데이터를 불러올 수 없습니다.</p>
      </div>
    )
  }

  // 최대값을 구해서 차트 스케일 조정
  const maxValue = Math.max(...data.flatMap((d) => [d.revenue, d.operatingProfit, d.netIncome]))

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">최근 3년 재무 현황 (단위: 조원)</h3>

      {/* 간단한 막대 차트 구현 */}
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="space-y-3">
            <h4 className="font-medium text-gray-700">{item.year}년</h4>

            {/* 매출 */}
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm text-gray-600">매출</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(item.revenue / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="w-16 text-sm font-medium text-right">{item.revenue}조</span>
            </div>

            {/* 영업이익 */}
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm text-gray-600">영업이익</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(item.operatingProfit / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="w-16 text-sm font-medium text-right">{item.operatingProfit}조</span>
            </div>

            {/* 순이익 */}
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm text-gray-600">순이익</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(item.netIncome / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="w-16 text-sm font-medium text-right">{item.netIncome}조</span>
            </div>
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex justify-center space-x-6 mt-6 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">매출</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">영업이익</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-gray-600">순이익</span>
        </div>
      </div>
    </div>
  )
}

export default FinancialChart
