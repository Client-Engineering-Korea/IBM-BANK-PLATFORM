# Teller Web

Modern teller front-end for IBM Bank, built with **React** and the **IBM Carbon Design System**, talking to the core banking API.

## 🚀 Features

- **로그인 페이지**: Carbon Form 컴포넌트를 사용한 인증
- **대시보드**: IBM Bank 브랜딩과 실시간 백엔드 상태 표시기
- **잔액 조회**: IBAN 입력 및 통화 포매팅
- **거래 내역**: 정렬 및 검색 가능한 Carbon DataTable
- **계좌 이체**: 출발/도착 IBAN, 금액 입력 및 확인 모달
- **마이너스 통장 요청**: 한도 요청 및 메시지 생성
- **계좌 상세 조회**: 계좌 정보, 잔액, 최근 거래 내역

## 🛠️ Tech Stack

- **React 18** - UI 라이브러리
- **IBM Carbon Design System v11** - UI 컴포넌트
- **Vite** - 빌드 도구
- **React Router DOM** - 라우팅
- **Axios** - HTTP 클라이언트
- **SCSS** - 스타일링

## 📋 Prerequisites

- Node.js 18 이상
- npm 또는 yarn

## 🔧 Installation

1. 프로젝트 디렉토리로 이동:
```bash
cd apps/teller-web
```

2. 의존성 설치:
```bash
npm install
```

3. 환경 변수 설정:
```bash
cp .env.example .env
```

`.env` 파일을 열어 필요한 값을 설정:
```env
VITE_API_BASE_URL=https://ibm-corebanking.2alcc5emod4t.us-south.codeengine.appdomain.cloud
VITE_DEFAULT_USERNAME=teller1
VITE_DEFAULT_PASSWORD=teller1pass
VITE_HEALTH_CHECK_INTERVAL=30000
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

애플리케이션이 `http://localhost:5173`에서 실행됩니다.

### Production Build

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
apps/teller-web/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── AccountDetails.jsx
│   │   ├── BackendStatus.jsx
│   │   ├── BalanceInquiry.jsx
│   │   ├── OverdraftRequest.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── TransactionHistory.jsx
│   │   └── Transfer.jsx
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── DashboardPage.jsx
│   │   └── LoginPage.jsx
│   ├── services/           # API 서비스
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── bankService.js
│   ├── utils/              # 유틸리티 함수
│   │   └── formatters.js
│   ├── App.jsx             # 메인 앱 컴포넌트
│   ├── App.scss            # 글로벌 스타일
│   └── main.jsx            # 엔트리 포인트
├── index.html
├── package.json
├── vite.config.js
└── .env.example
```

## 🔐 Authentication

애플리케이션은 OAuth2 password flow를 사용하여 인증합니다:

1. 사용자가 로그인 페이지에서 자격 증명 입력
2. `POST /token` 엔드포인트로 인증 요청
3. 받은 액세스 토큰을 localStorage에 저장
4. 모든 API 요청에 Bearer 토큰 포함
5. 401 응답 시 자동으로 로그인 페이지로 리다이렉트

## 🎨 Carbon Design System

이 애플리케이션은 IBM Carbon Design System v11을 사용합니다:

- **컴포넌트**: Button, TextInput, DataTable, Modal, Tabs, Header 등
- **아이콘**: @carbon/icons-react
- **디자인 토큰**: 색상, 간격, 타이포그래피
- **반응형 그리드**: Carbon Grid 시스템

## 🔗 API Contract

### Backend URL
- **Production**: `https://ibm-corebanking.2alcc5emod4t.us-south.codeengine.appdomain.cloud`
- **Local**: `http://127.0.0.1:8000`

### Main Endpoints
- `POST /token` - 인증
- `GET /health` - 헬스 체크
- `GET /accounts` - 계좌 목록
- `GET /accounts/{account_id}` - 계좌 상세
- `GET /accounts/{account_id}/balance` - 잔액 조회
- `GET /accounts/{account_id}/transactions` - 거래 내역
- `POST /transfer` - 계좌 이체
- `POST /overdraft-request` - 마이너스 통장 요청

## 📝 Reference Implementation

이 애플리케이션은 [`services/teller-cli/teller_client.py`](../../services/teller-cli/teller_client.py)의 기능을 웹 인터페이스로 구현한 것입니다.

## 🧪 Testing

브라우저에서 다음 기능들을 테스트할 수 있습니다:

1. **로그인**: 기본 자격 증명으로 로그인
2. **잔액 조회**: IBAN 입력 후 잔액 확인
3. **거래 내역**: 계좌의 모든 거래 내역 조회 및 검색
4. **계좌 이체**: 두 계좌 간 금액 이체
5. **마이너스 통장 요청**: 한도 요청 메시지 생성
6. **계좌 상세**: 계좌의 전체 정보 조회

## 🐛 Troubleshooting

### CORS 에러
백엔드 API가 CORS를 허용하는지 확인하세요.

### 인증 실패
`.env` 파일의 자격 증명이 올바른지 확인하세요.

### 빌드 에러
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

이 프로젝트는 IBM Bank 플랫폼의 일부입니다.

## 🤝 Contributing

커밋 메시지는 Conventional Commits 형식을 따릅니다:
```
feat(teller-web): 새로운 기능 추가
fix(teller-web): 버그 수정
docs(teller-web): 문서 업데이트
```

자세한 내용은 프로젝트 루트의 커밋 컨벤션을 참조하세요.
