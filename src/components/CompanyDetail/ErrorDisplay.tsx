import React from "react";
import { useNavigate } from "react-router-dom";

interface ErrorDisplayProps {
    message?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-red-500 text-xl mb-4">⚠️</div>
                <p className="text-gray-600 mb-4">{message || "기업 정보를 찾을 수 없습니다."}</p>
                <button
                    onClick={handleBack}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                    돌아가기
                </button>
            </div>
        </div>
    );
};

export default ErrorDisplay;