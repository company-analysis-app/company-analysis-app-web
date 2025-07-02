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
} from "../data/companies";

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
            try {
                setIsLoading(true);
                setError(null);

                // 1) DART 코드 가져오기 -> 존재하지 않으면 오류 발생시킴.
                const codeRes = await axios.get<string>(
                    `http://127.0.0.1:8000/darts?name=${encodeURIComponent(companyName)}`
                );
                const corpCode = codeRes.data;
                if (typeof corpCode === "object" && "message" in corpCode) {
                    throw new Error(corpCode["message"]);
                }
                
                // 2) 회사 기본정보 가져오고 company 값 변경, extraInfo 변수 생성
                const infoRes = await axios.get<any>(
                    `http://127.0.0.1:8000/darts/getInfos?code=${corpCode}`
                );
                const info = infoRes.data;
                const industry = info.induty_name;
                const found: Company = {
                    id: info.corp_code,
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
                

                // 3) AI 요약 (더미)
                const detailFromDummy = ({} as Record<string, CompanyDetail>)[companyName];
                const aiSummary = detailFromDummy?.aiSummary || '';

                // 4) 재무 데이터
                const finRes = await axios.get<Record<string, any>>(
                    `http://127.0.0.1:8000/darts/getValues?code=${corpCode}`
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

                // 5) 뉴스 카테고리별 전체 호출
                const newsRes = await axios.get<Record<string, NewsItem[]>>(
                    `http://127.0.0.1:8000/naver/news/all?company=${encodeURIComponent(found.name)}`
                );
                const newsMap = newsRes.data;

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