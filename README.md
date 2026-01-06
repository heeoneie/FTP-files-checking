# FTP File Checking

실시간 FTP 파일 작업 추적 시스템

## 프로젝트 배경

회사에서 여러 작업자가 FTP 서버의 같은 파일을 동시에 수정하는 상황이 발생하여, 작업 충돌과 덮어쓰기 문제가 빈번하게 일어났습니다. 이를 해결하기 위해 누가 어떤 경로를 작업 중인지 실시간으로 공유하고 추적할 수 있는 시스템을 개발했습니다.

## 주요 기능

- **실시간 작업 현황 공유**: 누가 어떤 경로를 작업 중인지 팀원들이 실시간으로 확인
- **중복 작업 방지**: 다른 사람이 사용 중인 경로를 시각적으로 표시하여 충돌 방지
- **간편한 체크인/체크아웃**: 작업 시작과 종료를 버튼 클릭만으로 간단하게 기록
- **내 작업 우선 표시**: 자신이 작업 중인 경로를 상단에 우선 정렬하여 빠른 확인
- **동시성 제어**: Firebase Transaction을 활용한 안전한 동시 접근 제어

## 기술 스택

### Frontend
- **React 19** + **TypeScript**: 타입 안정성과 최신 React 기능 활용
- **Vite**: 빠른 개발 환경과 최적화된 빌드
- **Zustand**: 경량 상태 관리 라이브러리

### Backend & Database
- **Firebase Realtime Database**: 실시간 데이터 동기화
  - Transaction 기반 동시성 제어로 데이터 무결성 보장
  - 자동 재로그인 기능으로 사용자 경험 개선

### UI/UX
- **TailwindCSS**: 유틸리티 기반 스타일링
- **Lucide React**: 아이콘 시스템
- **React Hot Toast**: 사용자 피드백

## 해결한 주요 문제

### 1. 동시 작업 충돌 방지
**문제**: 여러 작업자가 같은 파일을 동시에 수정하여 작업 내용이 덮어써지는 문제

**해결**:
- Firebase Transaction을 사용한 원자적 작업 상태 업데이트
- 사용 중인 경로를 시각적으로 구분하여 표시
- 코드 위치: [LoginForm.tsx:52-68](src/components/LoginForm.tsx#L52-L68)

### 2. 세션 관리
**문제**: 브라우저를 닫았다가 다시 열면 매번 로그인해야 하는 불편함

**해결**:
- localStorage 기반 세션 유지
- 자동 재로그인 기능 구현
- 코드 위치: [userStore.ts:19-61](src/store/userStore.ts#L19-L61)

### 3. 실시간 데이터 동기화
**문제**: 다른 사람의 작업 상태 변경을 즉시 확인할 수 없음

**해결**:
- Firebase Realtime Database의 onValue 리스너 활용
- 모든 작업자의 변경사항을 실시간으로 반영

## 설치 및 실행

### 환경 변수 설정
`.env` 파일을 생성하고 Firebase 설정 정보를 입력합니다:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 사용 방법

1. **로그인**: 작업자 이름을 입력하여 워크스페이스에 입장
2. **경로 추가**: 작업할 FTP 경로를 입력하고 체크인
3. **작업 확인**: 다른 작업자들의 사용 현황을 실시간으로 확인
4. **작업 완료**: 작업이 끝나면 체크아웃하여 다른 작업자에게 알림

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── LoginForm.tsx   # 로그인 폼 + 동시성 제어
│   └── SourceManager.tsx # 메인 대시보드
├── lib/
│   └── firebase.ts     # Firebase 초기화 및 설정
├── store/
│   └── userStore.ts    # Zustand 상태 관리
└── types/
    └── index.ts        # TypeScript 타입 정의
```

## 주요 기술적 결정

### Firebase Transaction 사용
동시에 여러 사용자가 로그인하거나 같은 경로를 체크인할 때 발생할 수 있는 race condition을 방지하기 위해 Transaction을 사용했습니다.

### sessionStorage → localStorage 변경
초기에는 sessionStorage를 사용했으나, 사용자 경험 개선을 위해 localStorage로 변경하여 브라우저를 닫아도 세션이 유지되도록 개선했습니다.

## 배포

Vercel을 통해 배포할 수 있습니다:

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

또는 GitHub 연동을 통한 자동 배포를 설정할 수 있습니다.

## 향후 개선 계획

- [ ] 작업 히스토리 기록 및 통계
- [ ] 모바일 반응형 UI 최적화
- [ ] 알림 기능 (다른 사람이 내 경로를 체크아웃 요청 시)
- [ ] 테스트 코드 작성

## 라이선스

MIT

---

**실무에서 직접 사용되는 프로젝트입니다.** 실제 팀 협업 환경에서 발생하는 문제를 해결하기 위해 개발되었으며, 현재도 활발히 사용 중입니다.
