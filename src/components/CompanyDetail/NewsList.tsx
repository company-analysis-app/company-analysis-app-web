import React, { useState, useEffect } from "react";
import type { NewsItem } from "../../data/companies";

interface NewsListProps {
  query: string;
}

const NewsList: React.FC<NewsListProps> = ({ query }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractSourceFromUrl = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      const parts = hostname.split(".");
      return parts.length > 2 ? parts.slice(1).join(".") : hostname;
    } catch {
      return "알 수 없는 출처";
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/naver/news?query=${encodeURIComponent(query)}`);
        if (!res.ok) {
          throw new Error(`뉴스 정보를 가져오지 못했습니다. (Status: ${res.status})`);
        }
        const data = await res.json();
        const formattedNews: NewsItem[] = (data.articles || []).map((item: any, idx: number) => ({
          id: String(idx),
          title: item.title.replace(/<b>/g, "").replace(/<\/b>/g, ""),
          link: item.url,
          source: extractSourceFromUrl(item.url),
          pubDate: item.pubDate,
        }));
        setNews(formattedNews);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [query]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">관련 뉴스</h3>
        <p className="text-gray-500">뉴스를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">관련 뉴스</h3>
        <p className="text-red-500">오류: {error}</p>
        <p className="text-gray-500 mt-2">백엔드 서버가 실행 중인지, CORS 설정이 올바른지 확인해주세요.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">관련 뉴스</h3>
      {news.length > 0 ? (
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
