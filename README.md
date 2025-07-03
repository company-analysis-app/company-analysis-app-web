# Company Analysis App (Web)

![License](https://img.shields.io/badge/license-MIT-blue.svg)

React와 TypeScript로 구축된 기업 분석 플랫폼입니다. 사용자가 기업 정보를 검색하고, AI 기반 분석을 통해 기업에 대한 인사이트를 얻을 수 있는 웹 애플리케이션입니다.

## 목차
1. [주요 기능](#주요-기능)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [설치 및 실행](#설치-및-실행)
5. [주요 페이지](#주요-페이지)
6. [주요 컴포넌트](#주요-컴포넌트)
7. [향후 개발 계획](#향후-개발-계획)
8. [라이선스](#라이선스)

---

## 주요 기능

- **사용자 인증**  
  Google 소셜 로그인 및 프로필 관리
- **기업 검색 및 분석**  
  실시간 기업 검색, AI 기반 분석 요약, 재무 데이터 시각화, 관련 뉴스 제공
- **개인화 기능**  
  관심기업 즐겨찾기, 맞춤형 기업 추천
- **데이터 시각화**  
  재무 지표 차트, 반응형 디자인, 직관적인 UI/UX

---

## 기술 스택

- **Framework**: React 18  
- **언어**: TypeScript  
- **스타일링**: Tailwind CSS (CDN)  
- **라우팅**: React Router DOM  
- **상태 관리**: React Context API, Hooks  
- **HTTP 클라이언트**: Axios  
- **빌드 도구**: Create React App  
- **코드 품질**: ESLint, Prettier

---

## 프로젝트 구조

```
src/
├── components/                 # 재사용 가능한 컴포넌트
│   ├── CompanyDetail/          # 기업 상세 페이지 컴포넌트
│   │   ├── AISummary.tsx       # AI 요약 컴포넌트
│   │   ├── CompanyHeader.tsx   # 기업상세 헤더
│   │   ├── CompanyInfo.tsx     # 기업상세 부분
│   │   ├── ErrorDisplay.tsx    # 오류화면
│   │   ├── FinancialChart.tsx  # 재무 차트 컴포넌트
│   │   ├── LoadingSpinner.tsx  # 로딩스피너
│   │   └── NewsList.tsx        # 뉴스 목록 컴포넌트
│   ├── SearchBar.tsx           # 검색 바 컴포넌트
│   ├── CompanyCard.tsx         # 기업 카드 컴포넌트
│   ├── CompanyList.tsx         # 기업 목록 컴포넌트
│   └── NavBar.tsx              # 네비게이션 바
├── pages/                      # 페이지 컴포넌트
│   ├── LoginPage.tsx           # 로그인 페이지
│   ├── DashboardPage.tsx       # 대시보드 페이지
│   ├── CompanyDetailPage.tsx   # 기업 상세 페이지
│   ├── CompanySearchPage.tsx   # 기업 검색 페이지
│   └── ProfilePage.tsx         # 프로필 설정 페이지
├── contexts/                   # React Context
│   └── AuthContext.tsx         # 인증 컨텍스트
├── data/                       # 타입정의 및 데이터
│   ├── companies.ts            # 기업 관련
│   └── users.ts                # 사용자 관련
├── App.tsx                     # 메인 앱 컴포넌트
└── index.tsx                   # 앱 진입점
```

---

## 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/company-analysis-app/company-analysis-app-web.git
cd company-analysis-app-web
```

### 2. 의존성 설치
```bash
npm install
# or
# yarn install
```

### 3. 개발 서버 실행
```bash
npm start
# or
# yarn start
```

### 4. 빌드
```bash
npm run build
# or
# yarn build
```

---

## 주요 페이지

### 1. 로그인 페이지 (`/login`)
- Google 소셜 로그인
- 자동 회원가입 기능

### 2. 대시보드 (`/dashboard`)
- 개인화된 기업 추천
- 검색 기능
- 인기 기업 목록

### 3. 기업 검색 (`/search`)
- 실시간 기업 검색
- 검색 결과 필터링
- 빠른 검색 키워드

### 4. 기업 상세 (`/company/:companyName`)
- AI 기반 기업 분석
- 재무 데이터 차트
- 관련 뉴스
- 관심기업 추가/제거

### 5. 프로필 설정 (`/profile`)
- 관심 카테고리 설정
- 개인정보 관리
- 관심기업 목록

---

## 주요 컴포넌트

### AuthContext
- 사용자 인증 상태 관리
- 로그인/로그아웃 기능
- 사용자 선호도 관리

### SearchBar
- 기업 검색 입력
- 로딩 상태 표시
- 검색 결과 처리

### CompanyCard
- 기업 정보 카드
- 관심기업 토글
- 클릭 이벤트 처리

### FinancialChart
- 재무 데이터 시각화
- 반응형 차트
- 매출/영업이익/순이익 표시

---

## 향후 개발 계획

- 테마(다크/라이트) 모드 지원  
- 검색 히스토리 및 자동완성 기능  
- 그래프 라이브러리 다양화  
- PWA 지원  
- 진행중인 채용정보 연계(채용 접수 일정에 따라 상위노출)
- 성능 최적화(코드 스플리팅, 이미지 최적화, 캐싱 전략, SEO 최적화)

---

## 라이선스

MIT © Company Analysis App
