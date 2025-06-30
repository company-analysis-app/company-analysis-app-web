import axios from 'axios';
export interface User {
    id: number;
    email: string;
    name: string;
    oauth_provider: string;
    oauth_sub: string;
    preferences: string[];  // 선호 카테고리 배열
    favorites: number[];
    created_at: string;
    updated_at: string;
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

export const categories = ["대기업", "중견기업", "공기업", "외국계", "자동차", "반도체", "AI", "바이오", "금융", "화학"]
