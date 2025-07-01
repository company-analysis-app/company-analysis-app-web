import React, { useEffect, useState } from "react";
import { type CompanyDetail } from "../../data/companies";
import axios from "axios";

interface CompanyInfoProps {
    companyDetail?: CompanyDetail; 
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ companyDetail }) => {

    useEffect(() => {
        const getInfo = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/darts?name=${companyDetail?.company.name}`);
                const code = res.data;

                const induInfo = await axios.get(`http://127.0.0.1:8000/darts/getInfos?code=${code}`);
                const result = induInfo.data
                console.log(result['adres'])
                console.log(result['corp_cls'])
                console.log(result['est_dt'])
                console.log(result['hm_url'])
                const induCode = parseInt(result["induty_code"])
                console.log(induCode)

                const finRes = await axios.get(`http://127.0.0.1:8000/darts/mapping?code=${induCode}`);
                console.log(finRes.data)
            } catch (error) {
                console.error("에러 발생:", error);
            }
        }
        getInfo()
    }, [])
    


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