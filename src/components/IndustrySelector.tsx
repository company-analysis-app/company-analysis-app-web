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
}

const LEVEL_KEYS = ['name_1', 'name_2', 'name_3', 'name_4', 'name_5'];
const CODE_KEYS = ['code_1', 'code_2', 'code_3', 'code_4', 'code_5'];

const clearBelow = (prev: Record<string, string | undefined>, idx: number) => {
  const cleared = { ...prev };
  LEVEL_KEYS.slice(idx).forEach(k => cleared[k] = undefined);
  return cleared;
};

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({ value, onChange }) => {
  const { user } = useAuth();
  const [industries, setIndustries] = useState<IndustryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<string, string | undefined>>({});

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

  // codeField 안전성 개선: lastSelectedIdx가 -1일 경우 대비
  const codeField = lastSelectedIdx >= 0 ? CODE_KEYS[lastSelectedIdx] : undefined;

  const canAdd = useMemo(() => {
    if (lastSelectedIdx < 0) return false;
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
      if (!value.includes(codeToAdd)) onChange([...value, codeToAdd]);
    }
  };

  // 삭제 핸들러 추가
  const handleDelete = (codeToDelete: string) => {
    onChange(value.filter(code => code !== codeToDelete));
  };

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

      <div className="mt-4 bg-blue-50 p-3 rounded-md">
        <span className="text-sm font-medium text-blue-800">선택된 산업군: </span>
        {value.length > 0 ? (
          value.map(code => {
            // 명시적 매칭: industries 중 codeField 중 하나라도 정확히 일치하는 항목 찾기
            const industry = industries.find(ind =>
              CODE_KEYS.some(key => ind[key] === code)
            );

            const path = [industry?.name_1, industry?.name_2, industry?.name_3, industry?.name_4, industry?.name_5]
              .filter(Boolean)
              .join(' > ');

            return (
              <span
                key={code}
                className="text-sm text-blue-700 ml-1 flex items-center gap-1"
              >
                {path || code}
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
          <span className="text-gray-500 ml-1">아직 저장된 산업군이 없습니다.</span>
        )}
      </div>
    </div>
  );
};

export default IndustrySelector;
