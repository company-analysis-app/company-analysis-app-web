"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchIndustries } from '../data/users';

interface IndustryCategory {
  id: number;
  name_1?: string;
  name_2?: string;
  name_3?: string;
  name_4?: string;
  name_5?: string;
  code_1?: string;
  code_2?: string;
  code_3?: string;
  code_4?: string;
  code_5?: string;
  [key: string]: string | number | undefined;
}

interface IndustrySelectorProps {
  value: string[];
  onChange: (codes: string[]) => void;
  onNameChange?: (name: string | undefined, level: number | undefined) => void;
}

const LEVEL_KEYS = ['name_1', 'name_2', 'name_3', 'name_4', 'name_5'];
const CODE_KEYS = ['code_1', 'code_2', 'code_3', 'code_4', 'code_5'];

const clearBelow = (prev: Record<string, string | undefined>, idx: number) => {
  const cleared = { ...prev };
  LEVEL_KEYS.slice(idx).forEach(k => cleared[k] = undefined);
  return cleared;
};

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({ value, onChange, onNameChange }) => {
  const [industries, setIndustries] = useState<IndustryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<string, string | undefined>>({});
  const [industryFavorites, setIndustryFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (user && Array.isArray(user.industryfavorites)) {
      setIndustryFavorites(user.industryfavorites.map((v: any) => String(v)));
    }
  }, [user]);

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

  const lastSelectedIdx = useMemo(
    () => LEVEL_KEYS.reduce((acc, key, idx) => (selected[key] ? idx : acc), -1),
    [selected]
  );

  const lastSelectedName = useMemo(() => {
    if (lastSelectedIdx < 0) return undefined;
    const key = LEVEL_KEYS[lastSelectedIdx]; // name_1 ~ name_5
    return selected[key];
  }, [lastSelectedIdx, selected]);

  useEffect(() => {
    if (onNameChange) {
      onNameChange(lastSelectedName, lastSelectedIdx >= 0 ? lastSelectedIdx : undefined);
    }
  }, [lastSelectedName, lastSelectedIdx, onNameChange]);


  // codeField 안전성 개선: lastSelectedIdx가 -1일 경우 대비
  const codeField = lastSelectedIdx >= 0 ? CODE_KEYS[lastSelectedIdx] : undefined;

  const canAdd = useMemo(() => {
    if (lastSelectedIdx < 1) return false; // 최소 2단계(name_1, name_2)까지 선택해야 활성화
    const selectedIndustry = industries.find(item =>
      LEVEL_KEYS.slice(0, lastSelectedIdx + 1).every(key => item[key] === selected[key])
    );
    return selectedIndustry && codeField !== undefined && !value.includes(String(selectedIndustry[codeField]));
  }, [industries, lastSelectedIdx, selected, value, codeField]);

  const handleAdd = () => {
    if (!canAdd || codeField === undefined) return;
    const selectedIndustry = industries.find(item =>
      LEVEL_KEYS.slice(0, lastSelectedIdx + 1).every(key => item[key] === selected[key])
    );
    if (selectedIndustry) {
      const codeToAdd = String(selectedIndustry[codeField]);
      console.log('추가되는 코드:', codeToAdd);
      if (!value.includes(codeToAdd)) onChange([...value, codeToAdd]);
    }
  };
  

  // 삭제 핸들러 추가
  const handleDelete = (codeToDelete: string) => {
    onChange(value.filter(code => code !== codeToDelete));
  };
  console.log(value, industries) 



  const getOptions = (level: number): string[] => {
    let filtered = industries;
    for (let i = 0; i < level; i++) {
      const key = LEVEL_KEYS[i];
      if (!selected[key]) return [];
      filtered = filtered.filter(item => item[key] === selected[key]);
    }
    const key = LEVEL_KEYS[level];
    return Array.from(new Set(filtered.map(item => item[key]).filter(Boolean) as string[]));
  };

  // 선택된 경로 표시
  const selectedNames = LEVEL_KEYS.map(key => selected[key]).filter(Boolean).join(' > ');

  if (loading || industries.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex flex-col gap-3 w-full max-w-md mb-4">
        {LEVEL_KEYS.map((key, idx) => {
          const options = getOptions(idx);
          if (idx === 0 || selected[LEVEL_KEYS[idx - 1]]) {
            return (
              <select
                key={key}
                value={selected[key] || ''}
                onChange={e => setSelected(prev => clearBelow({ ...prev, [key]: e.target.value }, idx + 1))}
                className="border rounded-lg px-4 py-2 w-full"
              >
                <option value="">{idx + 1}분류 선택</option>
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
          className={`mt-2 px-4 py-2 rounded-lg font-semibold w-full ${canAdd ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
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

        <div className="mt-4 bg-blue-50 p-3 rounded-md">
        <span className="text-sm font-medium text-blue-800">선택된 산업군: </span>
        {value.length > 0 ? (
          value.map(code => {
            const industry = industries.find(ind =>
              CODE_KEYS.some(key => String(ind[key]) === String(code))
            );

            const codeIdx = industry
              ? CODE_KEYS.findIndex(key => String(industry[key]) === String(code))
              : -1;

            const path = (industry && codeIdx >= 0)
              ? LEVEL_KEYS.slice(0, codeIdx + 1).map(key => industry[key]).filter(Boolean).join(' > ')
              : `알 수 없는 코드(${code})`;

            return (
              <span
                key={code}
                className="text-sm text-blue-700 ml-1 flex items-center gap-1"
              >
                {path}
                <button
                  onClick={() => handleDelete(code)}
                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  aria-label="삭제"
                  type="button"
                >
                  ×
                </button>
              </span>
            );
          })
        ) : (
          <span className="text-gray-400">아직 선택된 산업군이 없습니다.</span>
        )}
      </div>
    </div>
  );
};

export default IndustrySelector;
