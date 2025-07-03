import axios from 'axios';

export interface User {
    id: number;
    email: string;
    name: string;
    oauth_provider: string;
    oauth_sub: string;
    preferences: string[];  // 선호 카테고리 배열
    favorites: number[];    // 관심기업 배열
    industryfavorites: number[];  // 관심 산업군 배열
    created_at: string;
    updated_at: string;
}

export interface IndustryCategory {
    id: number;
    name_1?: string;
    name_2?: string;
    name_3?: string;
    name_4?: string;
    name_5?: string;
}

const API_URL = process.env.REACT_APP_DBAPI_URL as string;

/** 내 정보 조회 */
export async function fetchMe(token: string): Promise<User> {
    const res = await axios.get<User>(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

/** 선호 카테고리 업데이트 */
export async function updateUserPreferences(
    token: string,
    preferences: string[],
): Promise<User> {
    const res = await axios.put<User>(
        `${API_URL}/users/preferences`,
        { preferences },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

/** 관심기업 추가 */
export async function addFavorite(
    token: string,
    companyId: number,
): Promise<User> {
    const res = await axios.post<User>(
        `${API_URL}/users/favorites`,
        { company_id: companyId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

/** 관심기업 제거 */
export async function removeFavorite(
    token: string,
    companyId: number,
): Promise<User> {
    const res = await axios.delete<User>(
        `${API_URL}/users/favorites/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

/** 산업군 목록 조회 */
export async function fetchIndustries(): Promise<IndustryCategory[]> {
    const res = await axios.get<IndustryCategory[]>(`${API_URL}/users/industries`);
    return res.data;
}

/** 관심 산업군 추가 */
export async function addIndustryFavorite(
    token: string,
    industryId: number,
): Promise<User> {
    const res = await axios.post<User>(
        `${API_URL}/users/industry-favorites`,
        { industry_id: industryId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

/** 관심 산업군 제거 */
export async function removeIndustryFavorite(
    token: string,
    industryId: number,
): Promise<User> {
    const res = await axios.delete<User>(
        `${API_URL}/users/industry-favorites/${industryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export const categories = ["대기업", "중견기업", "공기업", "외국계", "자동차", "반도체", "AI", "바이오", "금융", "화학"]
