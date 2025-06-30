import React from "react";
import { type CompanyDetail } from "../../data/companies";

interface CompanyInfoProps {
    companyDetail?: CompanyDetail; 
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ companyDetail }) => {

    return (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{companyDetail?.company.name}</h1>
                    <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {companyDetail?.company.category}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CompanyInfo;