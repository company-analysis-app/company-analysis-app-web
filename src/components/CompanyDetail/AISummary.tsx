import React from "react";
import { type CompanyDetail } from "../../data/companies";

interface CompanyInfoProps {
    companyDetail?: CompanyDetail; 
}

const AISummary: React.FC<CompanyInfoProps> = ({ companyDetail }) => {

    return (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mr-2">
                    🤖 AI 분석 요약
                </span>
            </h2>
            <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{companyDetail?.aiSummary}</p>
            </div>
            <div className="mt-4 text-sm text-gray-500">
                * Groq AI를 통해 생성된 요약입니다. 투자 결정의 참고용으로만 활용하세요.
            </div>
        </div>
    );
};

export default AISummary;