# 해당 프로젝트 사용 가능 Skills 정리

현재 `tarot` 프로젝트의 기술 스택(`package.json` 기준)과 기존 사용 내역을 바탕으로, `~/.agent/skills` 에 존재하는 전체 854개의 스킬 중 본 프로젝트에 활용하기 적합한 핵심 스킬들을 분류하여 정리했습니다.

## 1. 프론트엔드 최적화 및 UI/UX
- **`nextjs-best-practices` / `nextjs-app-router-patterns`** : Next.js 15, App Router 환경에서의 최적화 및 패턴
- **`react-best-practices` / `react-patterns` / `react-ui-patterns`** : React 18 기본 컴포넌트 설계 및 상태 관리 방안
- **`tailwind-design-system` / `tailwind-patterns`** : Tailwind CSS를 활용한 디자인 시스템 구축 및 스타일링 가이드
- **`radix-ui-design-system`** : 현재 적용된 @radix-ui 훅 및 컴포넌트의 접근성 높은 결합 패턴
- **`web-performance-optimization`** : 프론트엔드 로딩/렌더링 성능 최적화 (이전 대화에서도 활용됨)
- **`frontend-dev-guidelines`** : 전반적인 프론트엔드 개발 컨벤션 및 모범 사례 가이드

## 2. 백엔드 및 서비스 연동
- **`nodejs-backend-patterns`** : Node.js 기반의 API 라우트/서비스 코드 설계 패턴 (이전 대화에서 활용됨)
- **`firebase`** : 프로젝트 내 포함된 Firebase 서버리스 환경 연동 베스트 프랙티스
- **`api-design-principles` / `api-patterns`** : REST 원칙에 맞는 리소스 지향적 API 설계
- **`backend-dev-guidelines`** : 백엔드 로직 작성에 대한 전반적인 가이드라인

## 3. 프로그래밍 언어 및 코드 퀄리티
- **`typescript-expert` / `typescript-pro`** : TypeScript 5 환경의 명시적 타입 지정과 안전성 확충
- **`clean-code`** : 클린 코드 작성, Single Responsibility Principle(단일 책임 원칙) 구현
- **`code-refactoring-refactor-clean`** / **`code-refactoring-tech-debt`** : 기존 코드의 리팩토링 및 기술 부채 해결
- **`error-handling-patterns`** : 전역 에러 핸들링(Global Error Handler) 로직 및 일관성 있는 예외 처리 패턴

## 4. AI(Genkit) 및 프롬프트 연동
- **`prompt-engineer` / `prompt-engineering-patterns`** : Genkit을 활용한 AI 에이전트 프롬프트 엔지니어링 및 고도화
- **`llm-app-patterns`** : LLM 모델을 적용한 서비스에서의 아키텍처 및 앱 패턴
- **`ai-engineer`** : AI 모델과 상호작용하는 레이어 개발 가이드

## 5. 테스트 및 디버깅
- **`testing-patterns` / `javascript-testing-patterns`** : 자동화 테스트(초기 구성 시) 및 모의 객체 활용 가이드
- **`debugger` / `debugging-strategies`** : 버그 추적, Sentry 등의 트레이스 분석 및 시스템 진단
- **`error-diagnostics-smart-debug`** : 문제 상황에 대한 스마트한 분석 및 해결 전략
