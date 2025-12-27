# Repository Guidelines

## Project Structure & Module Organization
Vite 기반 React 앱은 `src/main.tsx`와 `src/App.tsx`에서 시작하며, 재사용 가능한 UI는 `src/components/`, 애니메이션 리소스는 `src/assets/`에 둡니다. 상태 로직은 `src/store/`(Zustand)와 `src/hooks/`에 모으고, Firebase 접근 함수는 `src/lib/`에서 관리합니다. 전역 스타일과 Tailwind 레이어는 `src/index.css`에 집중되어 있으며, 정적 리소스는 `public/`, 번들 결과는 `dist/`에 위치합니다. 공용 타입은 `src/types/`에 보관해 기능 간 계약을 명확히 유지하세요.

## Build, Test, and Development Commands
`npm run dev`는 Vite 개발 서버와 HMR을 실행하며, Firebase 연결을 위해 `.env.local`이 로드되어야 합니다. `npm run build`는 TypeScript 프로젝트 레퍼런스를 우선 빌드한 뒤 `dist/`로 번들합니다. `npm run preview`는 프로덕션 번들을 로컬에서 검증할 때 사용합니다. `npm run lint`는 루트 `eslint.config.js` 규칙으로 전체 소스를 검사하니 PR 전에 경고를 해결하세요.

## Coding Style & Naming Conventions
모든 모듈은 TypeScript, 2칸 들여쓰기, 세미콜론을 사용합니다(`src/App.tsx` 참고). React 컴포넌트/파일은 PascalCase(`SourceManager.tsx`), 훅은 `use` 접두어의 camelCase, Zustand 스토어는 `src/store/<Feature>Store.ts`로 명명합니다. 진입점 외에는 named export를 선호하세요. 스타일은 Tailwind 유틸리티와 `clsx`·`class-variance-authority`로 구성하고, 필요할 때만 인라인 스타일을 씁니다. 커밋 전 ESLint(필요 시 Prettier)를 실행해 서식을 맞춥니다.

## Testing Guidelines
현재 자동화 테스트가 없으므로 Vitest + React Testing Library 도입을 고려하세요. 스펙 파일은 기능 인접 경로(`src/components/__tests__/SourceManager.test.tsx`)나 `src/__tests__/`에 둡니다. 로그인 검증, Firebase 트랜잭션, Zustand 상태 변화를 시나리오 중심으로 검증하고 숫자 기반 커버리지 대신 의미 있는 케이스를 우선시합니다. `test` 스크립트 추가 후 `npx vitest run`으로 CI와 동일한 환경을 재현하세요.

## Commit & Pull Request Guidelines
기존 기록은 Conventional Commits(`feat:`, `fix:`)를 따르므로 같은 규칙을 유지하고 제목은 72자 이하로 작성합니다. 작업 시 `feature/source-filtering`처럼 명확한 브랜치 명을 사용하고, PR 본문에는 동기와 테스트 결과, 관련 이슈 링크를 포함하세요. UI/UX 변경 시 전후 스크린샷 또는 짧은 Loom을 첨부하고, 마이그레이션이나 환경 변수 변경이 있다면 별도 섹션으로 강조합니다.

## Security & Configuration Tips
`src/lib/firebase.ts`는 필수 `VITE_FIREBASE_*` 값이 없으면 바로 예외를 던집니다. `.env.local`에 아래와 같이 정의하세요.
```
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_DATABASE_URL=https://<project>.firebaseio.com
```
비밀 키는 절대 커밋하지 말고, 필요 시 `.env.example`에 더미 값을 남겨 문서를 대체합니다. 디버깅 시 자격 증명이나 전체 Firebase 페이로드를 로그에 남기지 말고 식별자나 익명화된 메타데이터만 남기세요.
