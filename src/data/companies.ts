// src/data/companies.ts
export interface Company {
    id: number;
    name: string;
    category: string;
    summary?: string;
    logo?: string;
    favoriteCount?: number;
}

export interface FinancialData {
    year: string;
    revenue: number;
    operatingProfit: number;
    netIncome: number;
}

export interface NewsItem {
    id: string;
    title: string;
    link: string;
    pubDate: string;
}

export interface ExtraInfo {
    address: string;
    corpCls: string;
    foundedDate: string;
    homepage: string;
    industry: string;
}

export interface CompanyDetail {
    company: Company;
    extraInfo: ExtraInfo;
    aiSummary: string;
    financialData: FinancialData[];
    // 카테고리별 뉴스 맵
    news: Record<string, NewsItem[]>;
}

export interface SummaryOut {
    id: number;
    company_name: string;
    summary_text: string;
    created_at: string;    // ISO string
    updated_at: string;    // ISO string
}


// 더미 기업 데이터
export const dummyCompanies: Company[] = [
    { id: 1, name: "삼성전자", category: "반도체", summary: "글로벌 반도체 및 전자제품 제조업체" },
    { id: 2, name: "현대자동차", category: "자동차", summary: "국내 최대 자동차 제조업체" },
    { id: 3, name: "네이버", category: "AI", summary: "국내 대표 IT 플랫폼 기업" },
    { id: 4, name: "카카오", category: "AI", summary: "모바일 플랫폼 및 콘텐츠 서비스 기업" },
    { id: 5, name: "SK하이닉스", category: "반도체", summary: "메모리 반도체 전문 기업" },
]

// 카테고리별 추천 기업 데이터
export const recommendationData: Record<string, Company[]> = {
    대기업: [
        { id: 1, name: "삼성전자", category: "대기업", summary: "글로벌 전자제품 제조업체" },
        { id: 2, name: "현대자동차", category: "대기업", summary: "국내 최대 자동차 제조업체" },
    ],
    반도체: [
        { id: 1, name: "삼성전자", category: "반도체", summary: "글로벌 반도체 제조업체" },
        { id: 5, name: "SK하이닉스", category: "반도체", summary: "메모리 반도체 전문 기업" },
    ],
    AI: [
        { id: 3, name: "네이버", category: "AI", summary: "AI 기술 기반 플랫폼 기업" },
        { id: 4, name: "카카오", category: "AI", summary: "AI 서비스 및 플랫폼 기업" },
    ],
    자동차: [
        { id: 2, name: "현대자동차", category: "자동차", summary: "친환경 자동차 선도 기업" },
        { id: 6, name: "기아", category: "자동차", summary: "글로벌 자동차 브랜드" },
    ],
}
