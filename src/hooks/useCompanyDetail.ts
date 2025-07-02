// src/hooks/useCompanyDetail.ts
import { useState, useEffect } from "react";
import axios from "axios";
import {
    dummyCompanies,
    Company,
    CompanyDetail,
    FinancialData,
    NewsItem,
    ExtraInfo,
    SummaryOut
} from "../data/companies";

const API_BASE_URL = process.env.REACT_APP_DBAPI_URL || "http://localhost:8000";

export function useCompanyDetail(
    companyName?: string
): {
    company: Company | null;
    companyDetail: CompanyDetail | null;
    isLoading: boolean;
    error: string | null;
} {
    const [company, setCompany] = useState<Company | null>(null);
    const [companyDetail, setCompanyDetail] = useState<CompanyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!companyName) return;

        const fetchAll = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 1) 기본 회사 정보
                const found = dummyCompanies.find((c) => c.name === companyName);
                if (!found) throw new Error("해당 기업을 찾을 수 없습니다.");
                setCompany(found);

                // 2) DART 공시 추가 정보
                const codeRes = await axios.get<string>(
                    `${API_BASE_URL}/darts?name=${encodeURIComponent(found.name)}`
                );
                const corpCode = codeRes.data;

                const infoRes = await axios.get<any>(
                    `${API_BASE_URL}/darts/getInfos?code=${corpCode}`
                );
                const info = infoRes.data;
                const industry = info.induty_name;

                const extraInfo: ExtraInfo = {
                    address: info.adres,
                    corpCls: info.corp_cls,
                    foundedDate: `${info.est_dt.slice(0, 4)}-${info.est_dt.slice(4, 6)}-${info.est_dt.slice(6)}`,
                    homepage: info.hm_url.startsWith("http")
                        ? info.hm_url
                        : `https://${info.hm_url}`,
                    industry,
                };

                // 3) 재무 데이터
                const finRes = await axios.get<Record<string, any>>(
                    `${API_BASE_URL}/darts/getValues?code=${corpCode}`
                );
                const rawFin = finRes.data;
                const financialData: FinancialData[] = Object.entries(rawFin).map(
                    ([year, vals]) => ({
                        year,
                        revenue: vals['매출액'],
                        operatingProfit: vals['영업이익'],
                        netIncome: vals['당기순이익'],
                    })
                );

                // 4) 뉴스 카테고리별 전체 호출
                const newsRes = await axios.get<Record<string, NewsItem[]>>(
                    `${API_BASE_URL}/naver/news/all?company=${encodeURIComponent(found.name)}`
                );
                const newsMap = newsRes.data;

                // 5) AI 요약
                const formattedNews: Record<string, NewsItem[]> = {};
                Object.entries(newsMap).forEach(([category, articles]) => {
                    formattedNews[category] = articles.map((a) => ({
                        ...a,
                        pubDate: new Date(a.pubDate).toISOString(),
                    }));
                });
                const summaryReqBody = {
                    company_name: found.name,
                    financial: financialData,
                    news: formattedNews
                };
                const aiSummaryRes = await axios.post<SummaryOut>(
                    `${API_BASE_URL}/summary`,
                    summaryReqBody
                );
                const aiSummary = aiSummaryRes.data.summary_text;

                setCompanyDetail({
                    company: found,
                    extraInfo,
                    aiSummary,
                    financialData,
                    news: newsMap,
                });

            } catch (err: any) {
                setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [companyName]);

    return { company, companyDetail, isLoading, error };
}