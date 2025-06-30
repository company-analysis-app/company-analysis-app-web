import { useState, useEffect } from "react"
import { Company, CompanyDetail, dummyCompanyDetails } from "../data/companies"

export function useCompanyDetail(companyName: string | undefined) {
    const [company, setCompany] = useState<Company | null>(null)
    const [companyDetail, setCompanyDetail] = useState<CompanyDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!companyName) return
        const decoded = decodeURIComponent(companyName)
        fetchData(decoded)
    }, [companyName])

    const fetchData = async (name: string) => {
        setIsLoading(true)
        try {
            // 여기엔 실제 Dart API 호출, 뉴스 API 통합
            const detail = dummyCompanyDetails[name]
            if (detail) {
                setTimeout(() => {
                    setCompany(detail.company)
                    setCompanyDetail(detail)
                    setIsLoading(false)
                }, 1000)
            } else {
                setCompany({
                    id: 0,
                    name,
                    category: "검색결과",
                    summary: `${name}에 대한 검색 결과입니다.`
                })
                setCompanyDetail({
                    company: {
                        id: 0,
                        name,
                        category: "검색결과",
                        summary: ""
                    },
                    aiSummary: `${name}의 상세 정보를 준비 중입니다.`,
                    financialData: [],
                    news: []
                })
                setIsLoading(false)
            }
        } catch (err) {
            setError("기업 정보를 가져오는 데 실패했습니다.")
            setIsLoading(false)
        }
    }
    return { company, companyDetail, isLoading, error }
}