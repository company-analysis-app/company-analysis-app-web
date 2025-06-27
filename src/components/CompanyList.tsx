"use client"

import type React from "react"
import type { Company } from "../data/companies"
import CompanyCard from "./CompanyCard"

interface CompanyListProps {
    companies: Company[]
    onCompanyClick: (company: Company) => void
    title?: string
    showFavoriteButton?: boolean
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, onCompanyClick, title, showFavoriteButton = true }) => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                    <CompanyCard
                        key={company.id}
                        company={company}
                        onClick={onCompanyClick}
                        showFavoriteButton={showFavoriteButton}
                    />
                ))}
            </div>
        </div>
    )
}

export default CompanyList
