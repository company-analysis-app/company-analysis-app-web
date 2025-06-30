import React, { useEffect, useState } from "react";
import NewsList from "./NewsList";
import type { NewsItem } from "../../../data/companies";

const NewsContainer: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = "삼성전자"; // 나중에 검색어를 state로 바꾸셔도 됨

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:8000/news?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("뉴스를 불러오는데 실패했습니다.");

        const data = await res.json();

        const formattedNews: NewsItem[] = data.articles.map((item: any, idx: number) => ({
          id: String(idx),
          title: item.title,
          link: item.url,
          source: extractSourceFromUrl(item.url),
          pubDate: item.pubDate,
        }));

        setNews(formattedNews);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query]);

  const extractSourceFromUrl = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      const parts = hostname.split(".");
      return parts.length > 2 ? parts.slice(1).join(".") : hostname;
    } catch {
      return "";
    }
  };

  if (loading) return <div>뉴스를 불러오는 중입니다...</div>;
  if (error) return <div>오류: {error}</div>;

  return <NewsList news={news} />;
};

export default NewsContainer;
