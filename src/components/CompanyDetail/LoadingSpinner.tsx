import React from "react";

const LoadingSpinner: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">기업 정보를 분석하고 있습니다...</p>
                <p className="text-sm text-gray-500 mt-2">DART 공시정보, 뉴스, AI 요약을 수집 중</p>
            </div>
        </div>
    )
}



export default LoadingSpinner;