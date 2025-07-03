"use client"

import React from "react"
import type { Company } from "../data/companies"
import { useAuth } from "../contexts/AuthContext"

interface CompanyCardProps {
    company: Company
    onClick: (company: Company) => void
    showFavoriteButton?: boolean
    showFavoriteCount?: boolean
}

const DEFAULT_LOGO_URL =
    "https://aicreation-file.miricanvas.com/a13/production/private/txt2img/2025/07/03/16/434722f6-7ab9-4883-b80b-ad5715f81c94.png"

const CompanyCard: React.FC<CompanyCardProps> = ({
    company,
    onClick,
    showFavoriteButton = true,
    showFavoriteCount = false,
}) => {
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

    // 카테고리 리스트 처리
    const categories: string[] = Array.isArray((company as any).categories)
        ? (company as any).categories
        : company.category
            ? [company.category]
            : []

    return (
        <div
            className="max-w-md sm:w-96 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 w-full"
            onClick={() => onClick(company)}
        >
            <div className="flex">
                {/* 좌측 1/3: 로고 영역 */}
                <div className="w-1/3 flex items-center justify-center">
                    <img
                        src={company.logo || DEFAULT_LOGO_URL}
                        alt={`${company.name} logo`}
                        className="w-full h-auto object-contain"
                    />
                </div>

                {/* 우측 2/3: 내용 영역 */}
                <div className="w-2/3 flex flex-col justify-between pl-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                        {showFavoriteButton && user && (
                            <button
                                onClick={handleFavoriteClick}
                                className={`p-2 rounded-full transition-colors ${isFavorite
                                    ? "text-red-500 hover:bg-red-50"
                                    : "text-gray-400 hover:bg-gray-50"
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

                    {/* 카테고리 리스트 */}
                    <div className="mt-3 flex flex-wrap">
                        {categories.map((cat, idx) => (
                            <span
                                key={idx}
                                className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded mr-2 mb-1"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 관심 수 */}
            {showFavoriteCount && company.favoriteCount !== undefined && (
                <div className="mt-5 text-sm text-gray-500">
                    ❤️ {company.favoriteCount.toLocaleString()}명이 관심 있어요
                </div>
            )}
        </div>
    )
}

export default CompanyCard
