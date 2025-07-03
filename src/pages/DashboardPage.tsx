// pages/DashboardPage.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { type Company, recommendationData } from "../data/companies"
import SearchBar from "../components/SearchBar"
import CompanyList from "../components/CompanyList"
import CompanySearchPage from "./CompanySearchPage"
import axios from "axios"


const API_BASE_URL = process.env.REACT_APP_DBAPI_URL || "http://localhost:8000";


const DashboardPage: React.FC = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [recommendations, setRecommendations] = useState<Company[]>([])
    const [bestCompanies, setBestCompanies] = useState<Company[]>([])
    const [isLoading, setIsLoading] = useState(false)
     // URL 검색 파라미터 훅
    const [searchParams, setSearchParams] = useSearchParams()
    const rawQuery = searchParams.get("query") || ""
    // 인코딩된 query 디코딩
    const query = decodeURIComponent(rawQuery)
    const isSearching = query.trim().length > 0

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.preferences.length > 0) {
                generateRecommendations()
            }

            try {
                const res = await axios.post<any>(`${API_BASE_URL}/dartsSearch/bestCompanies`)
                const results = res.data;
                console.log("Bestcompany Raw Data: ", results)

                const companyData: Company[] = results
                    .filter((item: any) => item.favorite_count > 0) 
                    .map((item: any) => ({
                        id: Number(item.corp_code),
                        name: item.corp_name,
                        category: "더미데이터입니다",
                        logo: item.logo,
                        favoriteCount: item.favorite_count,
                    }));
                console.log("Bestcompany Map Data: ", results)
                setBestCompanies(companyData);
            } catch (error) {
                console.error("인기 기업 가져오기 실패:", error);
            }
        };

        fetchData();
    }, [user])

    const generateRecommendations = () => {
        if (!user || user.preferences.length === 0) {
            setRecommendations([])
            return
        }
        const recommended: Company[] = []
        const addedIds = new Set<number>()

        user.preferences.forEach((category) => {
            const list = recommendationData[category] || []
            list.slice(0, 2).forEach((comp) => {
                if (!addedIds.has(comp.id)) {
                    recommended.push(comp)
                    addedIds.add(comp.id)
                }
            })
        })
        setRecommendations(recommended)
    }

    // 검색 실행 시 URL 갱신
    const handleSearch = (searchText: string) => {
        setSearchParams({ query: encodeURIComponent(searchText) })
    }

    // 기업 클릭 시 상세 페이지 이동
    const handleCompanyClick = (company: Company) => {
        navigate(`/company/${encodeURIComponent(company.name)}`)
    }

    const handleProfileSetup = () => {
        navigate("/profile")
    }

    if (!user) {
        return <div className="p-8 text-center">로그인이 필요합니다.</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 검색 섹션 */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">기업 정보를 검색하세요</h1>
                    <p className="text-xl text-gray-600 mb-8">AI 기반 분석과 최신 뉴스로 기업을 깊이 있게 이해하세요</p>
                    <SearchBar defaultValue={query} onSearch={handleSearch} />
                </div>


                {/* 검색 모드 */}
                {isSearching ? (
                    <CompanySearchPage
                        query={query}
                        onCompanyClick={handleCompanyClick}
                    />
                ) : (
                    <>
                        {/* 추천 기업 섹션 */}
                        {recommendations.length > 0 && (
                            <div className="mb-12">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}님을 위한 추천 기업</h2>
                                    <p className="text-gray-600">선호 카테고리: {user.preferences.join(", ")}</p>
                                </div>
                                <CompanyList companies={recommendations} onCompanyClick={handleCompanyClick} />
                            </div>
                        )}

                        {/* 선호 카테고리 미설정 */}
                        {user.preferences.length === 0 && (
                            <div className="text-center py-12">
                                <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">관심 카테고리를 설정해보세요</h3>
                                    <p className="text-gray-600 mb-6">
                                        선호하는 업종이나 기업 유형을 설정하면 맞춤형 추천을 받을 수 있습니다.
                                    </p>
                                    <button
                                        onClick={handleProfileSetup}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
                                    >
                                        프로필 설정하기
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 인기 기업 섹션 */}
                        <div className="mt-16">
                          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">인기 기업</h2>
                          <CompanyList
                            companies={bestCompanies}
                            onCompanyClick={handleCompanyClick}
                            showFavoriteCount={true}
                          />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default DashboardPage
