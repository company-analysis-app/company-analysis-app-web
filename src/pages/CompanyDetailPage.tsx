// src/pages/CompanyDetailPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useCompanyDetail } from "../hooks/useCompanyDetail";
import LoadingSpinner from "../components/CompanyDetail/LoadingSpinner";
import ErrorDisplay from "../components/CompanyDetail/ErrorDisplay";
import CompanyHeader from "../components/CompanyDetail/CompanyHeader";
import CompanyInfo from "../components/CompanyDetail/CompanyInfo";
import AISummary from "../components/CompanyDetail/AISummary";
import FinancialChart from "../components/CompanyDetail/FinancialChart";
import NewsList from "../components/CompanyDetail/NewsList";

const CompanyDetailPage: React.FC = () => {
    const { companyName } = useParams<{ companyName: string }>();
    const { company, companyDetail, isLoading, error } = useCompanyDetail(companyName);

    if (isLoading) return <LoadingSpinner />;
    if (error || !company || !companyDetail) return <ErrorDisplay message={error || undefined} />;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <CompanyHeader company={company} />
                <CompanyInfo companyDetail={companyDetail} />
                <AISummary companyDetail={companyDetail} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FinancialChart financialData={companyDetail.financialData} />
                    <NewsList news={companyDetail.news} />
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailPage;