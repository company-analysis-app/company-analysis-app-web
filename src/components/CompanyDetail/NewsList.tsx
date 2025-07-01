// src/components/CompanyDetail/NewsList.tsx
import React, { useState } from "react";
import type { NewsItem } from "../../data/companies";

interface NewsListProps {
  news: Record<string, NewsItem[]>;
}

const categories = ["전체", "채용", "주가", "노사", "IT"];

// URL에서 도메인만 추출
function getDomain(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace('www.', '');
  } catch {
    return url;
  }
}


const NewsList: React.FC<NewsListProps> = ({ news }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const items = news[selectedCategory] || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">관련 뉴스</h3>
      <div className="flex space-x-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors focus:outline-none ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="border-b border-gray-100 pb-2 last:border-b-0">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-50 p-2 rounded transition-colors">
                <h4 className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 mb-1">{item.title}</h4>
                <div className="flex items-center text-sm text-gray-500 justify-between">
                  <span className="truncate max-w-xs text-blue-500">{getDomain(item.link)}</span>
                  <span className="whitespace-nowrap">{new Date(item.pubDate).toLocaleDateString('ko-KR')}</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">관련 뉴스가 없습니다.</p>
      )}
    </div>
  );
};

export default NewsList;