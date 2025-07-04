"use client"

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { categories, updateUserPreferences, updateIndustryFavorites } from "../data/users"
import IndustrySelector from "../components/IndustrySelector"

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, updatePreferences } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(user?.preferences || []);
  const [isSaving, setIsSaving] = useState(false);
  const [industryFavorites, setIndustryFavorites] = useState<string[]>(
    user && Array.isArray(user.industryfavorites)
      ? user.industryfavorites.map((v: any) => String(v))
      : []
  );

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => prev.includes(category)
      ? prev.filter(c => c !== category) : [...prev, category]);
  };

  const handleIndustryFavoritesChange = (codes: string[]) => {
    setIndustryFavorites(codes);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 선호 카테고리 저장
      await updatePreferences(selectedCategories);
      // 관심 산업군 저장 (code 값으로 저장)
      const updated = await updateIndustryFavorites(industryFavorites);
      console.log("저장된 산업군:", updated);
      alert("설정이 저장되었습니다!");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1) // 이전 페이지로 이동
  }

  if (!user) return <div>로그인이 필요합니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            돌아가기
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">프로필 설정</h1>

          {/* 사용자 정보 */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">{user.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">{user.email}</div>
              </div>
            </div>
          </div>

          {/* 관심산업군 선택 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">관심 회사 산업군</h2>
            <p className="text-gray-600 mb-6">관심있는 산업군을 선택하면 그에 맞는 맞춤형 기업 추천을 받을 수 있습니다.</p>
            
            <IndustrySelector value={industryFavorites} onChange={handleIndustryFavoritesChange} />
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-8 py-3 rounded-md font-medium flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  저장 중...
                </>
              ) : (
                "설정 저장"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

