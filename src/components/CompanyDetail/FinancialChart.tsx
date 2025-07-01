import React, {useEffect, useState} from "react"
import axios from "axios"
import type { FinancialData } from "../../data/companies";

interface FinancialChartProps {
  name: string;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ name }) => {
  const [data, setData] = useState<FinancialData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const corpCodeRes = await axios.get(`http://127.0.0.1:8000/darts?name=${name}`)
        const corpCode = corpCodeRes.data
        console.log(corpCode)

        if (!corpCode) throw new Error("공시번호를 찾을 수 없습니다")

        const finRes = await axios.get(`http://127.0.0.1:8000/darts/getValues?code=${corpCode}`)
        const finalData = finRes.data
        console.log(finalData)

        const parsedData: FinancialData[] = Object.entries(finalData).map(
          ([year, values]: [string, any]) => ({
            year,
            revenue: values["매출액"],
            operatingProfit: values["영업이익"],
            netIncome: values["당기순이익"]
          })
        );

        setData(parsedData)
      } catch (err) {
        console.error(err)
        setError("재무 데이터를 불러오는 데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [name])

  const valueChange = (data: number): string => {
    const absData = Math.abs(data); // 음수 처리용
    const sign = data < 0 ? "-" : ""; // 부호 유지

    if (absData >= 1e12) {
      // 1조 이상
      return `${sign}${(absData / 1e12).toFixed(1)}조`;
    } else if (absData >= 1e8) {
      // 1억 이상
      return `${sign}${(absData / 1e8).toFixed(1)}억`;
    } else if (absData >= 1e7) {
      // 천만 이상
      return `${sign}${(absData / 1e7).toFixed(1)}천만`;
    } else if (absData >= 1e6) {
      // 백만 이상
      return `${sign}${(absData / 1e6).toFixed(1)}백만`;
    } else if (absData >= 1e4) {
      // 만 이상
      return `${sign}${(absData / 1e4).toFixed(1)}만원`;
    } else {
      // 그 이하
      return `${sign}${absData.toLocaleString()}원`;
    }
  };

  if (loading) {
    return <div className="p-6">불러오는 중...</div>
  }

  if (error || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">재무 정보</h3>
        <p className="text-gray-500">{error ?? "재무 데이터를 불러올 수 없습니다."}</p>
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
              <span className="w-16 text-sm font-medium text-right">{valueChange(item.revenue)}</span>
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
              <span className="w-16 text-sm font-medium text-right">{valueChange(item.operatingProfit)}</span>
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
              <span className="w-16 text-sm font-medium text-right">{valueChange(item.netIncome)}</span>
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
