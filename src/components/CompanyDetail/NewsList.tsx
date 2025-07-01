import React, { useState, useEffect } from "react";
import type { NewsItem } from "../../data/companies";

interface NewsListProps {
  query: string;
}

const categories = ["전체", "채용", "주가", "노사", "IT"];

const categoryKeywords: { [key: string]: string[] } = {
  전체: [],
  채용: ["채용", "구인", "신입", "경력", "모집", "인사", "HR", "입사", "채용공고", "사원 모집"],
  주가: ["주가", "증시", "상승", "하락", "투자", "배당", "주식", "시세", "증권", "시장", "공모", "상장"],
  노사: ["노사", "파업", "임금", "단체교섭", "노조", "노동", "근로", "쟁의", "협상", "노무", "노동자", "노동조합"],
  IT: ["IT", "기술", "인공지능", "AI", "소프트웨어", "개발", "R&D", "특허", "혁신", "디지털", "ICT", "테크", "클라우드"]
};

const NewsList: React.FC<NewsListProps> = ({ query }) => {
  const [allNewsByCategory, setAllNewsByCategory] = useState<{ [key: string]: NewsItem[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8000/naver/news/all?company=${encodeURIComponent(query)}`)
      .then(res => {
        if (!res.ok) throw new Error('뉴스 정보를 가져오지 못했습니다.');
        return res.json();
      })
      .then(data => {
        setAllNewsByCategory(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [query]);

  const news = allNewsByCategory[selectedCategory] || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">관련 뉴스</h3>
      <div className="flex space-x-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors focus:outline-none ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-gray-500">뉴스를 불러오는 중입니다...</p>
      ) : error ? (
        <p className="text-red-500">오류: {error}</p>
      ) : news.length > 0 ? (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <h4 className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 mb-2">{item.title}</h4>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{item.source}</span>
                  <span>{new Date(item.pubDate).toLocaleDateString("ko-KR")}</span>
                </div>
                <div className="text-xs text-blue-500 break-all mt-1">{item.link}</div>
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
