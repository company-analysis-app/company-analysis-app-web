"use client"

import React from "react"
import type { Company } from "../data/companies"
import CompanyCard from "./CompanyCard"

interface CompanyListProps {
    companies: Company[]
    onCompanyClick: (company: Company) => void
    title?: string
    showFavoriteButton?: boolean
    showFavoriteCount?: boolean
}

const CompanyList: React.FC<CompanyListProps> = ({
    companies,
    onCompanyClick,
    title,
    showFavoriteButton = true,
    showFavoriteCount = false,
}) => {
    if (companies.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-lg">검색 결과가 없습니다.</div>
                <p className="text-gray-500 mt-2">다른 기업명으로 검색해보세요.</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
            {/* 중앙 정렬 + 고정된 카드 폭 */}
            <div className="flex flex-wrap gap-6 justify-center">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="flex-shrink-0 w-full sm:w-72 md:w-80 lg:w-80"
                    >
                        <CompanyCard
                            company={company}
                            onClick={onCompanyClick}
                            showFavoriteButton={showFavoriteButton}
                            showFavoriteCount={showFavoriteCount}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CompanyList
