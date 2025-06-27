"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { dummyCompanies, type Company } from "../data/companies"
import SearchBar from "../components/SearchBar"
import CompanyList from "../components/CompanyList"

const CompanySearchPage: React.FC = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchResults, setSearchResults] = useState<Company[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = async (query: string) => {
        setIsLoading(true)
        setSearchQuery(query)
        setHasSearched(true)

        try {
            // API 연동필요 - GET /company/search?name={query}
            console.log("검색 쿼리:", query)

            // 더미 검색 로직 - 실제로는 백엔드 API 호출
            const results = dummyCompanies.filter(
                (company) =>
                    company.name.toLowerCase().includes(query.toLowerCase()) ||
                    company.category.toLowerCase().includes(query.toLowerCase()),
            )

            setTimeout(() => {
                setSearchResults(results)
                setIsLoading(false)
            }, 1000)
        } catch (error) {
            console.error("검색 실패:", error)
            setSearchResults([])
            setIsLoading(false)
        }
    }

    const handleCompanyClick = (company: Company) => {
        navigate(`/company/${encodeURIComponent(company.name)}`)
    }

    if (!user) {
        return <div>로그인이 필요합니다.</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 검색 섹션 */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">기업 검색</h1>
                    <p className="text-lg text-gray-600 mb-8">관심있는 기업을 검색하여 상세 분석 정보를 확인하세요</p>
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                </div>

                {/* 로딩 상태 */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">검색 중...</p>
                    </div>
                )}

                {/* 검색 결과 */}
                {!isLoading && hasSearched && (
                    <div className="mb-12">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                "{searchQuery}" 검색 결과 ({searchResults.length}개)
                            </h2>
                        </div>

                        {searchResults.length > 0 ? (
                            <CompanyList companies={searchResults} onCompanyClick={handleCompanyClick} />
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-4">검색 결과가 없습니다</div>
                                <p className="text-gray-500 mb-6">다른 키워드로 검색해보시거나, 정확한 기업명을 입력해주세요.</p>
                                <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                                    <h3 className="font-semibold text-blue-900 mb-2">검색 팁</h3>
                                    <ul className="text-sm text-blue-800 text-left space-y-1">
                                        <li>• 정확한 기업명을 입력해보세요</li>
                                        <li>• 업종명으로도 검색 가능합니다</li>
                                        <li>• 띄어쓰기를 확인해보세요</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 인기 검색어 또는 추천 기업 (검색 전 상태) */}
                {!hasSearched && (
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">인기 기업</h2>
                            <CompanyList companies={dummyCompanies.slice(0, 6)} onCompanyClick={handleCompanyClick} />
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 검색</h3>
                            <div className="flex flex-wrap gap-2">
                                {["삼성전자", "현대자동차", "네이버", "카카오", "SK하이닉스"].map((keyword) => (
                                    <button
                                        key={keyword}
                                        onClick={() => handleSearch(keyword)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                                    >
                                        {keyword}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CompanySearchPage;
