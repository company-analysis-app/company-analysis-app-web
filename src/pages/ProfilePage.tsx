"use client"

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { categories } from "../data/users"
import IndustrySelector from "../components/IndustrySelector"

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, updatePreferences } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(user?.preferences || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => prev.includes(category)
      ? prev.filter(c => c !== category) : [...prev, category]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 선호 카테고리 저장
      await updatePreferences(selectedCategories);
      
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

          {/* 선호 카테고리 설정 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">관심 카테고리</h2>
            <p className="text-gray-600 mb-6">관심있는 업종이나 기업 유형을 선택하면 맞춤형 추천을 받을 수 있습니다.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${selectedCategories.includes(category)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {selectedCategories.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>선택된 카테고리:</strong> {selectedCategories.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* 관심기업 목록 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">관심기업</h2>
            {user.favorites.length > 0 ? (
              <div className="text-gray-600">현재 {user.favorites.length}개의 기업을 관심기업으로 등록했습니다.</div>
            ) : (
              <div className="text-gray-500">아직 관심기업이 없습니다. 기업 검색 후 관심기업으로 추가해보세요.</div>
            )}
          </div>

          {/* 관심산업군 선택 */}
          <div className="mb-8">
            <IndustrySelector />
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

