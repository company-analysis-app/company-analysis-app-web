// pages/CompanySearchPage.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { dummyCompanies, type Company } from "../data/companies"
import SearchBar from "../components/SearchBar"
import CompanyList from "../components/CompanyList"
import axios from "axios"

interface Props {
    /** DashboardPage 또는 URL에서 전달된 검색어 */
    query: string
    /** 기업 클릭 시 대시보드의 네비게이션 로직을 재사용하기 위한 콜백 */
    onCompanyClick: (company: Company) => void
}
const API_BASE_URL = process.env.REACT_APP_DBAPI_URL || "http://localhost:8000";

const CompanySearchPage: React.FC<Props> = ({ query, onCompanyClick }) => {
    const { user } = useAuth()

    // 검색창에 보일 현재 값
    const [inputValue, setInputValue] = useState<string>(query)
    // API 결과
    const [searchResults, setSearchResults] = useState<Company[]>([])
    // 로딩 및 검색 여부
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [hasSearched, setHasSearched] = useState<boolean>(false)

    // 실제 검색 함수
    const handleSearch = async (keyword: string) => {
        setIsLoading(true)
        setInputValue(keyword)
        setHasSearched(true)

        try {
            const res = await axios.get(
                `${API_BASE_URL}/dartsSearch?keyword=${encodeURIComponent(keyword)}`
            )
            const data = res.data as any[]

            // console.log("검색결과 Data: ", data)

            // 해당 데이터로 results 데이터 만들어서 searchResults 상태 변환
            const results: Company[] = data.map((item: any) => ({
                id: Number(item.corp_code),
                name: item.corp_name,
                category: item.industry || "분류 없음",
                summary: item.summary || "설명 없음",
            }))

            // 걸러낼 패턴 총정리
            // 1) \d+호스팩      => “123호스팩” 등
            // 2) 스팩\d+호      => “스팩123호” 등
            // 3) 기업인수목적    => “기업인수목적”이 포함된 모든 이름
            const filterPattern = /(?:\d+호스팩|스팩\d+호|기업인수목적)/i

            // 패턴에 매칭되는 회사명은 걸러내기
            const filteredResults = results.filter(
                (company) => !filterPattern.test(company.name)
            )

            // UX상 잠깐 로딩 스피너 보이기
            setTimeout(() => {
                setSearchResults(filteredResults)
                setIsLoading(false)
            }, 500)
        } catch (error) {
            console.error("검색 실패:", error)
            setSearchResults([])
            setIsLoading(false)
        }
    }

    // query prop이 바뀌면(뒤로가기 복원 포함) 자동으로 검색
    useEffect(() => {
        if (query.trim()) {
            handleSearch(query)
        }
    }, [query])

    if (!user) {
        return <div className="p-8 text-center">로그인이 필요합니다.</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* 로딩 스피너 */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">검색 중...</p>
                    </div>
                )}

                {/* 검색 결과 */}
                {!isLoading && hasSearched && (
                    <div className="mb-12">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                "{inputValue}" 검색 결과 ({searchResults.length}개)
                            </h2>
                        </div>

                        {searchResults.length > 0 ? (
                            <CompanyList companies={searchResults} onCompanyClick={onCompanyClick} />
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-4">검색 결과가 없습니다</div>
                                <p className="text-gray-500 mb-6">
                                    다른 키워드로 검색해보시거나, 정확한 기업명을 입력해주세요.
                                </p>
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

                {/* 검색 전: 인기 기업 & 빠른 검색 */}
                {!hasSearched && (
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                                인기 기업
                            </h2>
                            <CompanyList companies={dummyCompanies.slice(0, 6)} onCompanyClick={onCompanyClick} />
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 검색</h3>
                            <div className="flex flex-wrap gap-2">
                                {["삼성전자", "현대자동차", "NAVER", "카카오", "SK하이닉스"].map((keyword) => (
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

export default CompanySearchPage
