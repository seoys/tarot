# Clean Code 품질 점검 보고서

`@clean-code` 스킬에서 강조하는 핵심 원칙(클래스/함수의 단일 책임, 의미 있는 이름, 중복 제거, 올바른 주석 처리 등)을 바탕으로 주요 파일인 `src/app/page.tsx`와 `src/services/tarot-card-analysis.ts`를 점검했습니다.

## 1. `src/app/page.tsx` (개선 필요: 높음)

**현재 상태:**
파일의 길이가 800줄 이상이며, UI 렌더링, 상태 관리, 복잡한 애니메이션 수학 로직, 유틸리티 함수가 모두 한 파일에 혼재되어 있습니다. 이는 **단일 책임 원칙(SRP)**을 크게 위반합니다.

**수정 제안 (리팩토링 포인트):**
1. **유틸리티 분리**: `shuffleArray`, `shuffleWithReversed` 같은 순수 함수는 파일 내에 두지 않고 `src/lib/utils.ts` 또는 `src/lib/tarot-utils.ts`로 이동해야 합니다. 
2. **비즈니스/애니메이션 로직 분리**: 화면에 카드를 뿌리는 3가지 방식(`burst`, `spiral`, `cascade`)에 대한 복잡한 위치 계산 로직(`SHUFFLE_VARIANTS` 등)은 커스텀 훅(예: `useTarotShuffle.ts`)이나 별도의 상수/로직 파일로 완전히 분리해야 합니다.
3. **컴포넌트 분할 (Small Functions/Classes)**: 
   - 카드 로딩 컴포넌트(`LoadingIndicator`)
   - 타로 카드 렌더링 영역 (보드)
   - 질문 입력 폼
   - 카드 해석 결과 모달(`isOutputModalOpen` 부분)
   위 요소들을 분할하여 `src/components/features/...` 와 같이 작은 독립적 컴포넌트로 만들고 메인 `page.tsx`에서는 이를 조립만 해야 가독성이 높아집니다.
4. **Magic Numbers 제거**: 위치/스케일 계산에 사용된 수많은 상수들(`0.45`, `0.8`, `120` 등)은 변수화하여 어떤 의미인지 파악하기 쉽게 해야 합니다.

## 2. `src/services/tarot-card-analysis.ts` (개선 필요: 낮음~중간)

**현재 상태:**
명확한 네이밍(`analyzeTarotCards`)과 단일 책임을 잘 따르고 있어 깔끔한 편입니다.

**수정 제안 (Clean Code 관점):**
1. **불필요한 주석 제거**:
   - `// Log request body`, `// Log response status`, `// Throw an error to be caught below` 와 같은 주석은 코드가 이미 그 사실을 명백히 보여주고 있으므로 불필요한 노이즈(Redundant Comments)입니다. 삭제하는 것이 좋습니다.
2. **에러 핸들링 (Error Handling)**:
   - `catch` 블록에서 API 호출 실패 시 에러를 던지지 않고 기본값(빈 배열)을 리턴하며 오류를 삼키고 있습니다. `Clean Code`에서는 에러 상황을 명시적으로 예외 처리(throw Error)하여 호출자(UI 측)가 정확히 에러 상황인지, 결과가 없는 것인지 구분할 수 있도록 하는 것이 좋다고 조언합니다.

## 종합 의견
현재 서비스의 핵심인 `tarot-card-analysis.ts`는 준수하지만, 프론트엔드쪽 핵심인 `page.tsx`의 덩치가 너무 커져서 유지보수성(Viscosity & Rigidity)이 떨어지는 상태입니다. **UI와 로직을 관심사별로 분리하는 리팩토링**을 진행하시는 것을 적극 권장합니다. 리팩토링을 시작할까요?
