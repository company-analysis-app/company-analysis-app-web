# 기업 분석 웹 애플리케이션

React와 TypeScript로 구축된 기업 분석 플랫폼입니다. 사용자가 기업 정보를 검색하고, AI 기반 분석을 통해 기업에 대한 인사이트를 얻을 수 있는 웹 애플리케이션입니다.

## 🚀 주요 기능

### 1. 사용자 인증
- Google/Kakao 소셜 로그인
- 사용자 프로필 관리
- 관심 카테고리 설정

### 2. 기업 검색 및 분석
- 실시간 기업 검색
- AI 기반 기업 분석 요약
- 재무 데이터 시각화
- 관련 뉴스 제공

### 3. 개인화 기능
- 맞춤형 기업 추천
- 관심기업 즐겨찾기
- 사용자 선호도 기반 콘텐츠

### 4. 데이터 시각화
- 재무 정보 차트
- 반응형 디자인
- 직관적인 UI/UX

## 🛠 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스 구축
- **TypeScript** - 타입 안정성
- **React Router DOM** - 클라이언트 사이드 라우팅
- **Tailwind CSS** - 스타일링 (CDN 방식)

### 상태 관리
- **React Context API** - 전역 상태 관리
- **React Hooks** - 컴포넌트 상태 관리

### 개발 도구
- **Create React App** - 프로젝트 설정
- **ESLint** - 코드 품질 관리

## 📁 프로젝트 구조

```
src/
├── components/                 # 재사용 가능한 컴포넌트
│   ├── SearchBar.tsx           # 검색 바 컴포넌트
│   ├── CompanyCard.tsx         # 기업 카드 컴포넌트
│   ├── CompanyList.tsx         # 기업 목록 컴포넌트
│   ├── FinancialChart.tsx      # 재무 차트 컴포넌트
│   ├── NewsList.tsx            # 뉴스 목록 컴포넌트
│   └── NavBar.tsx              # 네비게이션 바
├── pages/                      # 페이지 컴포넌트
│   ├── LoginPage.tsx           # 로그인 페이지
│   ├── DashboardPage.tsx       # 대시보드 페이지
│   ├── CompanyDetailPage.tsx   # 기업 상세 페이지
│   ├── CompanySearchPage.tsx   # 기업 검색 페이지
│   └── ProfilePage.tsx         # 프로필 설정 페이지
├── contexts/                   # React Context
│   └── AuthContext.tsx         # 인증 컨텍스트
├── data/                       # 데이터 타입 및 더미 데이터
│   ├── companies.ts            # 기업 관련 더미 데이터
│   └── users.ts                # 사용자 관련 더미 데이터
├── App.tsx                     # 메인 앱 컴포넌트
└── index.tsx                   # 앱 진입점
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 16.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
```bash
$ git clone https://github.com/company-analysis-app/company-analysis-app-web.git
$ cd company-analysis-app-web
```

2. **의존성 설치**
```bash
npm install
```

3. **개발 서버 실행**
```bash
npm start
```

4. **브라우저에서 확인**
```
http://localhost:3000
```

### 빌드

프로덕션 빌드를 생성하려면:
```bash
npm run build
```

## 📱 주요 페이지

### 1. 로그인 페이지 (\`/login\`)
- Google/Kakao 소셜 로그인
- 자동 회원가입 기능

### 2. 대시보드 (\`/dashboard\`)
- 개인화된 기업 추천
- 검색 기능
- 인기 기업 목록

### 3. 기업 검색 (\`/search\`)
- 실시간 기업 검색
- 검색 결과 필터링
- 빠른 검색 키워드

### 4. 기업 상세 (\`/company/:companyName\`)
- AI 기반 기업 분석
- 재무 데이터 차트
- 관련 뉴스
- 관심기업 추가/제거

### 5. 프로필 설정 (\`/profile\`)
- 관심 카테고리 설정
- 개인정보 관리
- 관심기업 목록

## 🔧 주요 컴포넌트

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

## 🎨 스타일링

- **Tailwind CSS**를 CDN 방식으로 사용
- 반응형 디자인 구현
- 일관된 디자인 시스템

## 🔮 향후 개발 계획

### 백엔드 API 연동
- [ ] OAuth 로그인 구현
- [ ] DART API 연동 (공시정보)
- [ ] 뉴스 API 연동
- [ ] Groq AI 통합

### 추가 기능
- [ ] 차트 라이브러리 추가 (Chart.js, Recharts)
- [ ] 브레드크럼 네비게이션
- [ ] 검색 히스토리 기능
- [ ] 즐겨찾기 페이지
- [ ] 모바일 반응형 네비게이션
- [ ] 페이지 전환 애니메이션

### 성능 최적화
- [ ] 코드 스플리팅
- [ ] 이미지 최적화
- [ ] 캐싱 전략
- [ ] SEO 최적화


## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 \`LICENSE\` 파일을 참조하세요.
