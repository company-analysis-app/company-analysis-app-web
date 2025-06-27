"use client"

import type React from "react"
import type { Company } from "../data/companies"
import { useAuth } from "../contexts/AuthContext"

interface CompanyCardProps {
    company: Company
    onClick: (company: Company) => void
    showFavoriteButton?: boolean
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onClick, showFavoriteButton = true }) => {
    const { user, addToFavorites, removeFromFavorites } = useAuth()
    const isFavorite = user?.favorites.includes(company.id) || false

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isFavorite) {
            removeFromFavorites(company.id)
        } else {
            addToFavorites(company.id)
        }
    }

    return (
        <div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            onClick={() => onClick(company)}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h3>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {company.category}
                    </span>
                </div>
                {showFavoriteButton && user && (
                    <button
                        onClick={handleFavoriteClick}
                        className={`p-2 rounded-full transition-colors ${isFavorite ? "text-red-500 hover:bg-red-50" : "text-gray-400 hover:bg-gray-50"
                            }`}
                    >
                        <svg
                            className="w-6 h-6"
                            fill={isFavorite ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                )}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{company.summary}</p>
            <div className="mt-4">
                <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">자세히 보기 →</button>
            </div>
        </div>
    )
}

export default CompanyCard
