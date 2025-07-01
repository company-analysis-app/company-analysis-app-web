"use client"

import type React from "react"
import { useParams } from "react-router-dom"
import { useCompanyDetail } from "../hooks/useCompanyDetail" // 사용자 hook 추가
import LoadingSpinner from "../components/CompanyDetail/LoadingSpinner" // component로 관리
import ErrorDisplay from "../components/CompanyDetail/ErrorDisplay" // component로 관리
import CompanyHeader from "../components/CompanyDetail/CompanyHeader" // component로 관리
import CompanyInfo from "../components/CompanyDetail/CompanyInfo" // component로 관리
import AISummary from "../components/CompanyDetail/AISummary" // component로 관리
import FinancialChart from "../components/CompanyDetail/FinancialChart" // component로 관리
import NewsList from "../components/CompanyDetail/NewsList" // component로 관리


const CompanyDetailPage: React.FC = () => {
    const { companyName } = useParams<{ companyName: string }>()
    const { company, companyDetail, isLoading, error } = useCompanyDetail(companyName) // hook으로 관리

    if (isLoading) return <LoadingSpinner />

    if (error || !companyDetail || !company) return <ErrorDisplay message={error ?? undefined}/>

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 헤더 */}
                <CompanyHeader company={company} />

                {/* 기업 기본 정보 */}
                <CompanyInfo companyDetail={companyDetail}/>

                {/* AI 요약 섹션 */}
                <AISummary companyDetail={companyDetail}/>

                {/* 재무 정보와 뉴스를 나란히 배치 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 재무 정보 차트 */}
                    <div>
                        <FinancialChart name={companyName!} />
                    </div>

                    {/* 관련 뉴스 */}
                    <div>
                        {companyName && <NewsList query={companyName} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetailPage
