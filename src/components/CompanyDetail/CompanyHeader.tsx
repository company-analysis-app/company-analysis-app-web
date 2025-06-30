import React from "react";
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom";
import { type Company } from "../../data/companies";

interface CompanyHeaderProps {
    company?: Company; 
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
    const { user, addToFavorites, removeFromFavorites } = useAuth()
    const isFavorite = company ? user?.favorites.includes(company.id) || false : false
    const navigate = useNavigate();
    const handleFavoriteToggle = () => {
        if (company) {
            if (isFavorite) {
                removeFromFavorites(company.id)
            } else {
                addToFavorites(company.id)
            }
        }
    }

    const handleBack = () => {
        navigate(-1) // 이전 페이지로 이동
    }

    return (
        <div className="flex items-center justify-between mb-8">
            <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                돌아가기
            </button>

            {user && (
                <button
                    onClick={handleFavoriteToggle}
                    className={`flex items-center px-4 py-2 rounded-md font-medium ${isFavorite ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <svg
                        className="w-5 h-5 mr-2"
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
                    {isFavorite ? "관심기업 해제" : "관심기업 추가"}
                </button>
            )}
        </div>
    );
};

export default CompanyHeader;