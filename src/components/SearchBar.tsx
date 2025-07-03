"use client"

import React, { useState, useEffect } from "react"

export interface SearchBarProps {
  /** 검색 버튼 클릭 시 호출 */
  onSearch: (query: string) => void
  /** 로딩 중일 때 버튼 비활성화 */
  isLoading?: boolean
  /** input의 초기값 (optional) */
  defaultValue?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
  defaultValue = "",
}) => {
  const [query, setQuery] = useState<string>(defaultValue)

  // defaultValue가 바뀌면 input도 동기화
  useEffect(() => {
    setQuery(defaultValue)
  }, [defaultValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="기업명을 입력하세요 (예: 삼성전자, 현대자동차)"
          className="w-full px-4 py-3 pr-12 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "검색"
          )}
        </button>
      </div>
    </form>
  )
}

export default SearchBar
