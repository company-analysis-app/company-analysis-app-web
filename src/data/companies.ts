export interface Company {
    id: number
    name: string
    category: string
    summary: string
    logo?: string
    address: string
    corpCls: string
    foundedDate: string
    homepage: string
}

export interface FinancialData {
    year: string
    revenue: number
    operatingProfit: number
    netIncome: number
}

export interface NewsItem {
    id: number
    title: string
    link: string
    pubDate: string
    source: string
}

export interface CompanyDetail {
    company: Company
    aiSummary: string
    financialData: FinancialData[]
    news: NewsItem[]
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

// 더미 상세 데이터
export const dummyCompanyDetails: Record<string, CompanyDetail> = {
    삼성전자: {
        company: { id: 1, name: "삼성전자", category: "반도체", summary: "글로벌 반도체 및 전자제품 제조업체" },
        aiSummary:
            "삼성전자는 2023년 1분기 실적이 전년 대비 감소했으나, 메모리 반도체 시장 회복과 함께 하반기 실적 개선이 기대됩니다. AI 반도체와 파운드리 사업 확장을 통해 장기 성장동력을 확보하고 있습니다.",
        financialData: [
            { year: "2023", revenue: 258.9, operatingProfit: 15.8, netIncome: 23.4 },
            { year: "2022", revenue: 302.2, operatingProfit: 43.4, netIncome: 55.7 },
            { year: "2021", revenue: 279.6, operatingProfit: 51.6, netIncome: 51.8 },
        ],
        news: [
            { id: 1, title: "삼성전자, AI 반도체 투자 확대 발표", link: "#", pubDate: "2024-01-15", source: "전자신문" },
            {
                id: 2,
                title: "삼성전자 1분기 실적 발표, 메모리 회복 기대",
                link: "#",
                pubDate: "2024-01-10",
                source: "매일경제",
            },
            { id: 3, title: "삼성전자, 파운드리 사업 확장 계획", link: "#", pubDate: "2024-01-08", source: "한국경제" },
        ],
    },
    현대자동차: {
        company: { id: 2, name: "현대자동차", category: "자동차", summary: "국내 최대 자동차 제조업체" },
        aiSummary:
            "현대자동차는 전기차 전환과 수소차 기술 개발에 적극 투자하며 미래 모빌리티 시장을 선도하고 있습니다. 글로벌 시장에서의 경쟁력 강화를 위해 지속적인 R&D 투자를 진행하고 있습니다.",
        financialData: [
            { year: "2023", revenue: 162.7, operatingProfit: 8.9, netIncome: 7.3 },
            { year: "2022", revenue: 142.4, operatingProfit: 4.1, netIncome: 3.4 },
            { year: "2021", revenue: 117.6, operatingProfit: 6.7, netIncome: 5.5 },
        ],
        news: [
            { id: 1, title: "현대차, 전기차 신모델 출시 예정", link: "#", pubDate: "2024-01-12", source: "조선일보" },
            { id: 2, title: "현대차그룹, 수소차 기술 개발 가속화", link: "#", pubDate: "2024-01-09", source: "중앙일보" },
        ],
    },
}
