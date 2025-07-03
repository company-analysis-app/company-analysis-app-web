// src/components/CompanyDetail/CompanyInfo.tsx
import React, { useEffect, useState } from "react";
import { CompanyDetail } from "../../data/companies";

interface CompanyInfoProps {
    companyDetail: CompanyDetail;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ companyDetail }) => {
    const { company, extraInfo, financialData } = companyDetail;
    const [companyClassification, setCompanyClassification] = useState("")

    useEffect(() => {
        if (!financialData || financialData.length === 0) {
            setCompanyClassification("데이터 없음");
            return;
        }

        // 자산 유효 데이터
        const assetData = financialData.filter(
            (data) => typeof data.totalAssets === "number" && !isNaN(data.totalAssets)
        );

        // 매출 유효 데이터
        const revenueData = financialData.filter(
            (data) => typeof data.revenue === "number" && !isNaN(data.revenue)
        );

        // 자산 기준으로 대기업/중견 판단
        const assetLatest = [...assetData].sort((a, b) => Number(b.year) - Number(a.year))[0];

        // 매출 평균 계산 (최근 3년) -> 1500억원 이상이면 중견기업으로 분류
        const revenueSorted = [...revenueData].sort((a, b) => Number(b.year) - Number(a.year));
        const recent3Revenue = revenueSorted.slice(0, 3);
        const avgRevenue = recent3Revenue.length > 0
            ? recent3Revenue.reduce((sum, r) => sum + r.revenue, 0) / recent3Revenue.length
            : null;

        if (assetLatest && assetLatest.totalAssets >= 10_400_000_000_000) {
            setCompanyClassification("대기업");
        } else if (
            (assetLatest && assetLatest.totalAssets >= 500_000_000_000) ||
            (avgRevenue !== null && avgRevenue >= 150_000_000_000)
        ) {
            setCompanyClassification("중견기업");
        } else if (assetLatest || avgRevenue !== null) {
            setCompanyClassification("중소기업");
        } else {
            setCompanyClassification("데이터 없음");
        }
    }, [financialData]);
    

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
                                        : "기타 상장"}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {companyClassification}
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