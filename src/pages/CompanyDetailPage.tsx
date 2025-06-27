"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { type Company, type CompanyDetail, dummyCompanyDetails } from "../data/companies"
import { useAuth } from "../contexts/AuthContext"
import FinancialChart from "../components/FinancialChart"
import NewsList from "../components/NewsList"

const CompanyDetailPage: React.FC = () => {
    const { companyName } = useParams<{ companyName: string }>()
    const navigate = useNavigate()
    const { user, addToFavorites, removeFromFavorites } = useAuth()

    const [company, setCompany] = useState<Company | null>(null)
    const [companyDetail, setCompanyDetail] = useState<CompanyDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const isFavorite = company ? user?.favorites.includes(company.id) || false : false

    useEffect(() => {
        if (companyName) {
            const decodedName = decodeURIComponent(companyName)
            fetchCompanyDetail(decodedName)
        }
    }, [companyName])

    const fetchCompanyDetail = async (name: string) => {
        setIsLoading(true)
        setError(null)

        try {
            // API 연동필요 - GET /company/search?name={name}
            // 실제로는 DART API, 뉴스 API, Groq AI API를 통합 호출

            // 더미 데이터 사용
            const detail = dummyCompanyDetails[name]

            if (detail) {
                setTimeout(() => {
                    setCompany(detail.company)
                    setCompanyDetail(detail)
                    setIsLoading(false)
                }, 1500) // 로딩 시뮬레이션
            } else {
                // 검색된 기업의 경우 기본 구조 생성
                const dummyCompany: Company = {
                    id: 999,
                    name: name,
                    category: "검색결과",
                    summary: `${name}에 대한 검색 결과입니다.`,
                }

                const defaultDetail: CompanyDetail = {
                    company: dummyCompany,
                    aiSummary: `${name}에 대한 상세 분석 정보를 준비 중입니다. AI 기반 요약과 최신 재무 정보를 곧 제공해드리겠습니다.`,
                    financialData: [],
                    news: [],
                }

                setTimeout(() => {
                    setCompany(dummyCompany)
                    setCompanyDetail(defaultDetail)
                    setIsLoading(false)
                }, 1500)
            }
        } catch (err) {
            setError("기업 정보를 불러오는데 실패했습니다.")
            setIsLoading(false)
        }
    }

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">기업 정보를 분석하고 있습니다...</p>
                    <p className="text-sm text-gray-500 mt-2">DART 공시정보, 뉴스, AI 요약을 수집 중</p>
                </div>
            </div>
        )
    }

    if (error || !companyDetail || !company) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <p className="text-gray-600 mb-4">{error || "기업 정보를 찾을 수 없습니다."}</p>
                    <button onClick={handleBack} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md">
                        돌아가기
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 헤더 */}
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

                {/* 기업 기본 정보 */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{companyDetail.company.name}</h1>
                            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {companyDetail.company.category}
                            </span>
                        </div>
                    </div>
                </div>

                {/* AI 요약 섹션 */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mr-2">
                            🤖 AI 분석 요약
                        </span>
                    </h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg">{companyDetail.aiSummary}</p>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        * Groq AI를 통해 생성된 요약입니다. 투자 결정의 참고용으로만 활용하세요.
                    </div>
                </div>

                {/* 재무 정보와 뉴스를 나란히 배치 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 재무 정보 차트 */}
                    <div>
                        <FinancialChart data={companyDetail.financialData} />
                        {companyDetail.financialData.length === 0 && (
                            <div className="mt-4 text-sm text-gray-500 text-center">
                                * DART API 연동 후 실제 재무 데이터가 표시됩니다.
                            </div>
                        )}
                    </div>

                    {/* 관련 뉴스 */}
                    <div>
                        <NewsList news={companyDetail.news} />
                        {companyDetail.news.length === 0 && (
                            <div className="mt-4 text-sm text-gray-500 text-center">
                                * 네이버 뉴스 API 연동 후 최신 뉴스가 표시됩니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetailPage
