// src/components/CompanyDetail/CompanyInfo.tsx
import React from "react";
import { CompanyDetail } from "../../data/companies";

interface CompanyInfoProps {
    companyDetail: CompanyDetail;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ companyDetail }) => {
    const { company, extraInfo } = companyDetail;

    return (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                    <div className="flex items-center space-x-2 mt-1.5">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {extraInfo.corpCls === "Y"
                                ? "코스피 상장"
                                : extraInfo.corpCls === "K"
                                    ? "코스닥 상장"
                                    : extraInfo.corpCls === "N"
                                        ? "코넥스 상장"
                                        : "비상장"}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            대기업
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-6 text-gray-700 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                <div className="space-y-2">
                    <p><span className="font-bold">주소:</span> {extraInfo.address}</p>
                    <p><span className="font-bold">업종:</span> {extraInfo.industry}</p>
                </div>
                <div className="space-y-2">
                    <p><span className="font-bold">설립일자:</span> {extraInfo.foundedDate}</p>
                    <p>
                        <span className="font-bold">홈페이지:</span>{" "}
                        <a
                            href={extraInfo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            {extraInfo.homepage}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompanyInfo;