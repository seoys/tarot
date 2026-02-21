# 프로젝트 변경 및 확장을 위한 Agent Skills 추천 💡

로직을 변경하거나 새로운 아이디어/기능을 추가할 때, 설치된 Agent 스킬(`~/.agent/skills/skills`)을 활용하면 목적에 맞는 최적의 가이드라인과 설계 패턴을 참고할 수 있습니다. 

다음은 목적별로 활용하기 좋은 스킬 목록입니다.

---

## 1. 전반적인 코드 품질 향상 및 리팩토링 (Refactoring & Clean Code)
- **`clean-code`**: 클린 코드 원칙(가독성, 단일 책임 원칙 등)을 적용하여 로직을 더 깔끔하고 유지보수하기 쉽게 다듬고 싶을 때 사용합니다.
- **`code-refactoring-refactor-clean`**: 복잡하게 얽힌 기존 로직을 안전하게 분리하고 구조를 개선하는 집중적인 리팩토링 작업에 적합합니다.

## 2. React / Next.js 특화 로직 개선
- **`react-best-practices`** / **`react-patterns`**: 컴포넌트 라이프사이클 훅(Hooks) 최적화, 불필요한 렌더링 방지, Custom Hook 분리 등 React 생태계의 모범 사례를 따르는 로직으로 변경할 때 유용합니다.
- **`nextjs-best-practices`** / **`nextjs-app-router-patterns`**: Next.js의 App Router 패턴, 서버/클라이언트 컴포넌트 분리, 데이터 페칭(Data Fetching) 로직 최적화, 캐싱 전략 등을 적용할 때 사용합니다.

## 3. 상태 관리 및 데이터 흐름 변경 (State Management)
- **`react-state-management`**: React 내에서 상태를 관리하는 로직(Context API, Zustand, Redux 등)을 설계하거나 개선할 때 도움을 받을 수 있습니다.
- **`zustand-store-ts`**: Zustand를 사용하여 전역 스토어 로직을 체계적으로 구축할 때 아주 유용합니다.

## 4. 아키텍처 및 디자인 패턴
- **`modern-javascript-patterns`**: 최신 문법과 디자인 패턴(Factory, Observer, Module 패턴 등)을 로직에 적용하고 싶을 때 적합합니다.
- **`architecture-patterns`** / **`c4-architecture-c4-architecture`**: 추가하려는 기능이 기존 시스템과 어떻게 상호작용할지 거시적인 시스템 아키텍처를 그리고 계층을 분리하고 싶을 때 사용합니다.

## 5. 새로운 아이디어 발상 및 기획 (Ideation & Planning)
- **`brainstorming`**: 프로젝트의 현재 상태를 바탕으로 창의적인 새 기능이나 방향성에 대한 아이디어를 넓게 논의하고 싶을 때 사용합니다.
- **`product-manager-toolkit`**: PM(프로덕트 매니저)의 관점에서 새로운 기능의 요구사항(PRD)을 정의하고, 사용자 시나리오를 구체화하며 개발 우선순위를 정할 때 유용합니다.

## 6. 풀스택 기능 구현 및 설계 (Feature Development)
- **`full-stack-orchestration-full-stack-feature`**: 클라이언트(UI)부터 서버(API), 데이터베이스까지 아우르는 새로운 핵심 기능 단위를 추가할 때 전 과정을 조율해 줍니다.
- **`backend-development-feature-development`**: 서버 측 비즈니스 로직(DB 스키마, API 설계) 확장에 집중하고 싶을 때 선택합니다.

## 7. AI 기능 도입 (AI & LLM Integration)
- **`llm-application-dev-ai-assistant`**: 챗봇, AI 피드백 등 앱 내에 AI 어시스턴트(예: AI 타로 마스터) 기능을 구현할 때 사용합니다.
- **`prompt-engineering`** / **`prompt-optimization`**: 타로 카드 해석을 더 자연스럽고 신비로우며 정확하게 만들어 줄 AI 프롬프트를 설계/개선할 때 적극 추천합니다.

## 8. UX/UI 최적화 및 새로운 디자인 시도
- **`ui-ux-pro-max`** / **`frontend-design`**: 기존 UI를 넘어선 혁신적인 모션, 최신 웹 디자인 트렌드(Glassmorphism, 3D 특수 효과 등), 몰입감 있는 인터랙션을 녹여내고 싶을 때 사용합니다.
- **`scroll-experience`**: 스크롤 애니메이션, 패럴랙스 등 웹 사이트에 생동감을 더하는 기능을 기획할 때 좋습니다.

---

### 📌 사용 방법 예시
프롬프트에 다음과 같이 **스킬 이름**을 명시하여 지시하면 해당 스킬의 규칙과 베스트 프랙티스를 적용하여 작업합니다.

> *"현재 타로 앱에 오늘의 운세 모델을 결합 기능을 만들고 싶어. `llm-application-dev-ai-assistant`와 `product-manager-toolkit` 스킬을 활용해서 기획부터 구체적인 구현 방안까지 설계해줘."*

> *"우리 앱의 상태 관리가 복잡해져서, `react-state-management` 스킬을 적용해 상태 로직을 분리해줘."*
