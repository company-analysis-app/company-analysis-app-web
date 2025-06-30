import type React from "react"
import type { NewsItem } from "../../../data/companies"

interface NewsListProps {
  news: NewsItem[]
}

const NewsList: React.FC<NewsListProps> = ({ news }) => {
  if (!news || news.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">관련 뉴스</h3>
        <p className="text-gray-500">관련 뉴스를 불러올 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">관련 뉴스</h3>
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
    </div>
  )
}

export default NewsList
