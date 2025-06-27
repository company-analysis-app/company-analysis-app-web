export interface User {
    id: number
    name: string
    email: string
    preferences: string[]
    favorites: number[]
}

export const categories = ["대기업", "중견기업", "공기업", "외국계", "자동차", "반도체", "AI", "바이오", "금융", "화학"]

// 더미 사용자 데이터
export const dummyUser: User = {
    id: 1,
    name: "홍길동",
    email: "hong@example.com",
    preferences: ["반도체", "AI"],
    favorites: [1, 3],
}
