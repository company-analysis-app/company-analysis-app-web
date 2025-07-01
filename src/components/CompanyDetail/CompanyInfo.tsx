import React, { useEffect, useState } from "react";
import { type CompanyDetail } from "../../data/companies";
import axios from "axios";

interface CompanyInfoProps {
    companyDetail?: CompanyDetail; 
}

interface ExtraInfo {
  address: string;
  corpCls: string;
  foundedDate: string;
  homepage: string;
  industry: string;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ companyDetail }) => {
    const [extraInfo, setExtraInfo] = useState<ExtraInfo | null>(null);

    useEffect(() => {
        const getInfo = async () => {
            try {
                if (!companyDetail?.company.name) return;

                const res = await axios.get(`http://127.0.0.1:8000/darts?name=${companyDetail?.company.name}`);
                const code = res.data;

                const induInfo = await axios.get(`http://127.0.0.1:8000/darts/getInfos?code=${code}`);
                const result = induInfo.data
                const induCode = parseInt(result["induty_code"])

                const finRes = await axios.get(`http://127.0.0.1:8000/darts/mapping?code=${induCode}`);
                const industryName = finRes.data;

                setExtraInfo({
                    address: result["adres"],
                    corpCls: result["corp_cls"],
                    foundedDate: formatDate(result["est_dt"]),
                    homepage: formatHomepage(result["hm_url"]),
                    industry: industryName,
                });


            } catch (error) {
                console.error("에러 발생:", error);
            }
        }
        getInfo()
    }, [companyDetail])

    const formatDate = (yyyymmdd: string): string => {
        return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6)}`;
    };

    const formatHomepage = (url: string): string => {
        return url.startsWith("http") ? url : `https://${url}`;
    };
        


    return (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-start justify-between">
                <div className="flex items-start">
                    <h1 className="text-3xl font-bold text-gray-900">{companyDetail?.company.name}</h1>

                    <div className="flex items-center space-x-2 ml-5 mt-1.5 relative top-[1px]">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {extraInfo?.corpCls === "Y"
                        ? "코스피 상장"
                        : extraInfo?.corpCls === "K"
                        ? "코스닥 상장"
                        : extraInfo?.corpCls === "N"
                        ? "코넥스 상장"
                        : "비상장"}
                    </span>

                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        대기업
                    </span>
                    </div>
                </div>
            </div>
            {extraInfo && (
                <div className="mt-6 text-gray-700 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                    <div className="space-y-2">
                    <p><span className="font-bold">주소:</span> {extraInfo.address}</p>
                    <p><span className="font-bold">업종:</span> {extraInfo.industry}</p>
                    </div>
                    <div className="space-y-2">
                    <p><span className="font-bold">설립일자:</span> {extraInfo.foundedDate}</p>
                    <p>
                        <span className="font-bold">홈페이지:</span>{" "}
                        <a
                        href={extraInfo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                        >
                        {extraInfo.homepage}
                        </a>
                    </p>
                    </div>
                </div>
            )}
        </div>

        
    );
};

export default CompanyInfo;