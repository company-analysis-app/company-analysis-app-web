"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchIndustries } from '../data/users';
import axios from "axios";

// 타입 선언
interface IndustryCategory {
  id: number;
  name_1?: string;
  name_2?: string;
  name_3?: string;
  name_4?: string;
  name_5?: string;
  [key: string]: string | number | undefined;
}

interface IndustrySelectorProps {
    value: string[];
    onChange: (codes: string[]) => void;
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({ value, onChange }) => {
    const { user } = useAuth();
    const [industries, setIndustries] = useState<IndustryCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<number | null>(null);
    const [selected, setSelected] = useState<Record<string, string | undefined>>({});

    const LEVEL_KEYS = ['name_1', 'name_2', 'name_3', 'name_4', 'name_5'];

    useEffect(() => {
        const loadIndustries = async () => {
            try {
                const data = await fetchIndustries();
                setIndustries(data as IndustryCategory[]);
            } catch (error) {
                console.error('산업군 목록을 불러오는데 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        loadIndustries();
    }, []);

    const getIndustryDisplayName = (industry: IndustryCategory): string => {
        const names = [industry.name_1, industry.name_2, industry.name_3, industry.name_4, industry.name_5]
            .filter(Boolean)
            .join(' > ');
        return names || `산업군 ${industry.id}`;
    };

    // 대표 id 추출 함수 (선택한 마지막 단계까지 값이 있고 그 아래는 모두 비어있는 id)
    const getRepresentativeIndustryId = (): number | undefined => {
        const lastSelectedIdx = LEVEL_KEYS.reduce((acc, key, idx) => selected[key] ? idx : acc, -1);
        if (lastSelectedIdx < 1) return undefined; // 최소 name_2까지 선택돼야
        return industries.find(item =>
            LEVEL_KEYS.slice(0, lastSelectedIdx + 1).every(key => item[key as keyof IndustryCategory] === selected[key]) &&
            LEVEL_KEYS.slice(lastSelectedIdx + 1).every(key => !item[key as keyof IndustryCategory])
        )?.id;
    };

    // 선택 추가
    const handleAdd = () => {
        // 마지막으로 선택한 단계 인덱스
        const lastSelectedIdx = LEVEL_KEYS.reduce((acc, key, idx) => selected[key] ? idx : acc, -1);
        if (lastSelectedIdx < 1) return; // 최소 2단계(name_2)까지 선택해야

        // code 필드명 동적 생성 (예: code_2, code_3, ...)
        const codeField = `code_${lastSelectedIdx + 1}`;

        // 해당 경로의 하위 산업군에서 code_N 값만 추출
        const codesToAdd = industries
            .filter(item =>
                LEVEL_KEYS.slice(0, lastSelectedIdx + 1).every(key => item[key as keyof IndustryCategory] === selected[key])
            )
            .map(item => String(item[codeField]))
            .filter((code): code is string => !!code && !value.includes(code));

        if (codesToAdd.length === 0) return;
        onChange([...value, ...codesToAdd]);
    };

    // 삭제
    const handleRemove = (code: string) => {
        onChange(value.filter(c => c !== code));
    };

    // 드롭다운 옵션
    const getOptions = (level: number): string[] => {
        let filtered = industries;
        for (let i = 0; i < level; i++) {
            const key = LEVEL_KEYS[i];
            if (!selected[key]) return [];
            filtered = filtered.filter(item => item[key as keyof IndustryCategory] === selected[key]);
        }
        const key = LEVEL_KEYS[level];
        return Array.from(new Set(filtered.map(item => item[key as keyof IndustryCategory]).filter(Boolean) as string[]));
    };

    // 선택된 경로 표시
    const selectedNames = LEVEL_KEYS.map(key => selected[key]).filter(Boolean).join(' > ');

    // 추가 버튼 활성화 조건 (code 기반)
    const lastSelectedIdx = LEVEL_KEYS.reduce((acc, key, idx) => selected[key] ? idx : acc, -1);
    const codeField = `code_${lastSelectedIdx + 1}`;
    const canAdd = (() => {
        if (lastSelectedIdx < 1) return false; // 최소 2단계(name_2)까지 선택해야
        const codesToAdd = industries
            .filter(item =>
                LEVEL_KEYS.slice(0, lastSelectedIdx + 1).every(key => item[key as keyof IndustryCategory] === selected[key])
            )
            .map(item => String(item[codeField]))
            .filter(code => !!code && !value.includes(code));
        return codesToAdd.length > 0;
    })();

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
        <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">관심 회사 산업군</h2>
            <p className="text-gray-600 mb-6">관심있는 산업군을 선택하면 그에 맞는 맞춤형 기업 추천을 받을 수 있습니다.</p>
            {/* 5단계 드롭다운 세로 배치 */}
            <div className="flex flex-col gap-3 w-full max-w-md mb-4">
                {LEVEL_KEYS.map((key, idx) => {
                    const options = getOptions(idx);
                    if (idx === 0 || selected[LEVEL_KEYS[idx - 1]]) {
                        return (
                            <select
                                key={key}
                                value={selected[key] || ''}
                                onChange={e => setSelected(prev => {
                                    const cleared: Record<string, string | undefined> = { ...prev };
                                    LEVEL_KEYS.slice(idx).forEach(k => { cleared[k] = undefined; });
                                    cleared[key] = e.target.value;
                                    return cleared;
                                })}
                                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-full bg-white"
                            >
                                <option value="">{key.replace('name_', '')}분류 선택</option>
                                {options.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        );
                    }
                    return null;
                })}
                <button
                    onClick={handleAdd}
                    disabled={!canAdd}
                    className={`mt-2 px-4 py-2 rounded-lg font-semibold transition-all w-full ${canAdd ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                    추가
                </button>
            </div>
            {/* 선택 중인 산업군 pill */}
            <div className="mb-4">
                <span className="text-sm text-gray-700 font-medium">선택 중인 산업군: </span>
                {selectedNames ? (
                    <span className="inline-block bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold ml-2">{selectedNames}</span>
                ) : (
                    <span className="text-gray-400 ml-2">아직 선택된 산업군이 없습니다.</span>
                )}
            </div>
            {/* 선택된 산업군 pill 리스트 */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">선택된 산업군:</span>
                {value.length === 0 && (
                    <span className="text-gray-400">아직 선택된 산업군이 없습니다.</span>
                )}
                {/* 그룹핑: 선택한 depth까지의 경로로 묶기 */}
                {(() => {
                    // 마지막으로 선택한 단계 인덱스
                    const lastSelectedIdx = LEVEL_KEYS.reduce((acc, key, idx) => selected[key] ? idx : acc, -1);
                    const codeField = `code_${lastSelectedIdx + 1}`;
                    // value에 있는 code들을 선택한 depth까지의 경로로 그룹핑
                    const pathToCodes: Record<string, string[]> = {};
                    value.forEach((code) => {
                        const industry = industries.find(ind => ind[codeField] === code);
                        if (!industry) return;
                        const pathArr = LEVEL_KEYS.slice(0, lastSelectedIdx + 1).map(key => industry[key]).filter(Boolean);
                        const path = pathArr.join(' > ');
                        if (!path) return;
                        if (!pathToCodes[path]) pathToCodes[path] = [];
                        pathToCodes[path].push(code);
                    });
                    return Object.entries(pathToCodes).map(([path, codes]) => (
                        <button
                            key={path}
                            type="button"
                            className="px-4 py-3 rounded-lg border-2 text-sm font-medium flex items-center transition-all border-blue-500 bg-blue-50 text-blue-700 hover:border-blue-600 hover:bg-blue-100 whitespace-nowrap"
                            style={{ gap: '0.5rem' }}
                        >
                            {path}
                            <span
                                onClick={e => { e.stopPropagation(); onChange(value.filter(v => !codes.includes(v))); }}
                                className="ml-2 text-xs text-red-500 hover:text-red-700 cursor-pointer flex-shrink-0"
                                aria-label="삭제"
                            >✕</span>
                        </button>
                    ));
                })()}
            </div>
            {/* DB에 저장된 값(관심 산업군) pill 스타일로 표시 */}
            {user && Array.isArray(user.industryfavorites) && user.industryfavorites.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">내 관심 산업군 목록</h4>
                    <div className="flex flex-wrap gap-2">
                        {user.industryfavorites.map((industryId: number) => {
                            const industry = industries.find(ind => ind.id === industryId);
                            const namePath = [industry?.name_1, industry?.name_2, industry?.name_3, industry?.name_4, industry?.name_5].filter(Boolean).join(' > ');
                            return (
                                <span key={industryId} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                    {industry ? namePath : `산업군 ${industryId}`}
                                    {/* 삭제 버튼 (옵션) */}
                                    {/* <button onClick={() => handleRemove(industryId)} className="ml-2 text-xs text-red-500 hover:text-red-700">✕</button> */}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndustrySelector; 