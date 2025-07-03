"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchIndustries, type IndustryCategory } from '../data/users';

export const IndustrySelector: React.FC = () => {
    const { user, addToIndustryFavorites, removeFromIndustryFavorites } = useAuth();
    const [industries, setIndustries] = useState<IndustryCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<number | null>(null);

    useEffect(() => {
        const loadIndustries = async () => {
            try {
                const data = await fetchIndustries();
                setIndustries(data);
            } catch (error) {
                console.error('산업군 목록을 불러오는데 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        loadIndustries();
    }, []);

    const handleIndustrySelect = async (industryId: number) => {
        if (!user || processing === industryId) return;

        setProcessing(industryId);
        try {
            if (user.industryfavorites?.includes(industryId)) {
                await removeFromIndustryFavorites(industryId);
            } else {
                await addToIndustryFavorites(industryId);
            }
        } catch (error) {
            console.error('산업군 선택 처리에 실패했습니다:', error);
        } finally {
            setProcessing(null);
        }
    };

    const getIndustryDisplayName = (industry: IndustryCategory): string => {
        const names = [industry.name_1, industry.name_2, industry.name_3, industry.name_4, industry.name_5]
            .filter(Boolean)
            .join(' > ');
        return names || `산업군 ${industry.id}`;
    };

    if (loading || !industries || industries.length === 0) {
        return (
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">관심 산업군</h2>
                <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span className="text-gray-600">산업군 데이터를 불러오는 중입니다...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">관심 산업군</h2>
            <p className="text-gray-600 mb-6">관심있는 산업군을 선택하면 맞춤형 추천을 받을 수 있습니다.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {industries.map((industry) => {
                    const isSelected = user?.industryfavorites?.includes(industry.id) || false;
                    const isProcessing = processing === industry.id;
                    
                    return (
                        <button
                            key={industry.id}
                            onClick={() => handleIndustrySelect(industry.id)}
                            disabled={isProcessing}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                                isSelected
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            } ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {getIndustryDisplayName(industry)}
                                </span>
                                <div className="flex items-center">
                                    {isProcessing && (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                                    )}
                                    <span className="text-lg">
                                        {isSelected ? '✓' : '○'}
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {user && user.industryfavorites.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">선택된 산업군 ({user.industryfavorites.length}개):</h4>
                    <div className="space-y-1">
                        {user.industryfavorites.map((industryId: number) => {
                            const industry = industries.find(ind => ind.id === industryId);
                            return (
                                <div key={industryId} className="text-sm text-blue-700 flex items-center">
                                    <span className="mr-2">•</span>
                                    {industry ? getIndustryDisplayName(industry) : `산업군 ${industryId}`}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndustrySelector; 