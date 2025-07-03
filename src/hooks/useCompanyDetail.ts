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
                // 1) DART 코드 가져오기 -> 존재하지 않으면 오류 발생시킴.
                const infoRes = await axios.get<any>(
                    `http://127.0.0.1:8000/darts/getInfos?name=${encodeURIComponent(companyName)}`
                );
                const info = infoRes.data;
                const corpCode = info.corp_code;
                
                if (typeof info === "object" && "message" in info) {
                    throw new Error(info["message"]);
                }
                
                const industry = info.induty_name;
                const found: Company = {
                    id: Number(info.corp_code),
                    name: info.corp_name,
                    category: "더미데이터입니다",
                    summary: "더미데이터입니다",
                };
                setCompany(found);
                

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
                    financial: rawFin,
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
                setError(err.response?.data?.detail || err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [companyName]);

    return { company, companyDetail, isLoading, error };
}