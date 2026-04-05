# 점술가 테마 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 우주/사이버 테마를 다크 벨벳 퍼플 컬러 + "이미 당신을 보고 있는" 점술가 어투로 전면 교체한다.

**Architecture:** CSS 변수 교체로 전체 색상을 한 번에 바꾸고, 이후 각 컴포넌트의 텍스트·카피를 점술가 어투로 교체한다. 로직·구조 변경 없이 텍스트와 색상만 변경한다.

**Tech Stack:** Next.js 15, Tailwind CSS, TypeScript

---

## 변경 파일 목록

| 파일 | 작업 |
|------|------|
| `src/app/globals.css` | CSS 컬러 토큰 전체 교체 |
| `src/app/page.tsx` | 배경 글로우 색상, 부제목, getHelperText, Toast 문구 |
| `src/components/ui/BirthdateStep.tsx` | 제목, 독백 인용구, 레이블, placeholder, 버튼 |
| `src/components/ui/MbtiQuizStep.tsx` | 진행 상태 텍스트, 질문 접두어 추가 |
| `src/components/ui/QuestionInput.tsx` | 레이블, placeholder |
| `src/components/ui/CardSelectionDialog.tsx` | 카운터, 힌트, 버튼, 다이얼로그 내용 |
| `src/components/ui/PreviewCardDialog.tsx` | 설명 문구, 닫기 버튼 |
| `src/components/ui/CardInterpretations.tsx` | 모달 제목, 아이콘, 재시작 버튼 |
| `src/components/ui/SelectedCardsSlots.tsx` | 최소 선택 안내 문구 |

---

## Task 1: globals.css — 컬러 팔레트 교체

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: CSS 변수 교체**

`src/app/globals.css`의 `:root` 블록 전체를 아래로 교체한다:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: dark;
    --background: 270 20% 5%;
    --foreground: 280 25% 87%;
    --card: 270 18% 8%;
    --card-foreground: 280 25% 87%;
    --popover: 270 18% 8%;
    --popover-foreground: 280 25% 87%;
    --primary: 270 35% 42%;
    --primary-foreground: 280 30% 92%;
    --secondary: 270 30% 27%;
    --secondary-foreground: 280 25% 87%;
    --muted: 270 15% 13%;
    --muted-foreground: 270 10% 57%;
    --accent: 270 25% 20%;
    --accent-foreground: 280 25% 87%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 270 15% 14%;
    --input: 270 15% 14%;
    --ring: 270 35% 42%;
    --radius: 0.75rem;

    --chart-1: 270 35% 42%;
    --chart-2: 280 30% 60%;
    --chart-3: 48 91% 55%;
    --chart-4: 280 40% 55%;
    --chart-5: 300 35% 50%;
  }

  .dark {
    --background: 270 20% 5%;
    --foreground: 280 25% 87%;
    --card: 270 18% 8%;
    --card-foreground: 280 25% 87%;
    --popover: 270 18% 8%;
    --popover-foreground: 280 25% 87%;
    --primary: 270 35% 42%;
    --primary-foreground: 280 30% 92%;
    --secondary: 270 30% 27%;
    --secondary-foreground: 280 25% 87%;
    --muted: 270 15% 13%;
    --muted-foreground: 270 10% 57%;
    --accent: 270 25% 20%;
    --accent-foreground: 280 25% 87%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 270 15% 14%;
    --input: 270 15% 14%;
    --ring: 270 35% 42%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 2: 타입 체크 실행**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/app/globals.css
git commit -m "style: 컬러 팔레트를 다크 벨벳 퍼플로 교체"
```

---

## Task 2: page.tsx — 배경 글로우·부제목·getHelperText·Toast

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 배경 글로우 색상 변경**

`page.tsx`에서 배경 글로우 두 개를 찾아 교체한다.

찾기:
```tsx
<div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
<div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[100px] rounded-full pointer-events-none" />
```

교체:
```tsx
<div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/15 blur-[100px] rounded-full pointer-events-none" />
<div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
```

- [ ] **Step 2: 메인 부제목 교체**

찾기:
```tsx
<p className="text-lg md:text-xl text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
  {userInfo.mbti}의 기운을 담아, 당신의 무의식이 이끄는 5장의 카드를 선택하세요.
</p>
```

교체:
```tsx
<p className="text-lg md:text-xl text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
  {userInfo.mbti}의 내면을 꿰뚫는 5장의 패를 집으십시오. 이미 무엇을 원하는지 알고 있습니다.
</p>
```

- [ ] **Step 3: getHelperText 교체**

찾기:
```tsx
const getHelperText = () => {
    if (isLoading) return "카드의 메시지를 해석하고 있습니다...";
    if (isShuffling) return "카드를 섞고 있습니다...";
    if (question.trim() === "") return "먼저 타로카드에게 물어볼 질문을 입력해주세요.";
    if (selectedCards.length === 0) return "직관이 이끄는 대로 카드를 선택해주세요. (3장 또는 5장)";
    if (selectedCards.length > 0) return "선택 완료 버튼을 눌러 카드의 의미를 확인해보세요.";
    return "카드를 섞고 질문을 집중해 보세요.";
  };
```

교체:
```tsx
const getHelperText = () => {
    if (isLoading) return "운명의 패를 읽고 있습니다...";
    if (isShuffling) return "패를 섞고 있습니다...";
    if (question.trim() === "") return "먼저 점술가에게 물음을 전하십시오.";
    if (selectedCards.length === 0) return "운명이 이끄는 패를 집으십시오. (3장 또는 5장)";
    if (selectedCards.length > 0) return "패가 선택됐습니다. 운명을 들여다볼 준비가 됐습니까?";
    return "패를 섞고 물음에 집중하십시오.";
  };
```

- [ ] **Step 4: 셔플 버튼 텍스트 교체**

찾기:
```tsx
{isShuffling ? "우주의 기운을 모으는 중..." : "카드 섞기"}
```

교체:
```tsx
{isShuffling ? "패를 섞는 중..." : "패를 섞다"}
```

- [ ] **Step 5: Toast 문구 교체**

찾기:
```tsx
toast({
  variant: "destructive",
  title: "질문을 입력해주세요",
  description: "타로카드에게 물어볼 질문이 필요합니다.",
});
```

교체:
```tsx
toast({
  variant: "destructive",
  title: "물음이 없으면 패를 읽을 수 없습니다",
  description: "점술가에게 전할 물음을 먼저 적어주십시오.",
});
```

찾기:
```tsx
toast({
  variant: "destructive",
  title: "카드를 선택해주세요",
  description: "해석을 위해 최소 1장의 카드를 선택해야 합니다.",
});
```

교체:
```tsx
toast({
  variant: "destructive",
  title: "패를 선택하십시오",
  description: "최소 1장의 패를 집어야 운명을 읽을 수 있습니다.",
});
```

찾기:
```tsx
toast({
  variant: "destructive",
  title: "오류가 발생했습니다",
  description: "해석을 가져오는 중 문제가 생겼습니다. 다시 시도해주세요.",
});
```

교체:
```tsx
toast({
  variant: "destructive",
  title: "운명의 실이 끊겼습니다",
  description: "패를 읽는 중 문제가 생겼습니다. 다시 시도해 주십시오.",
});
```

- [ ] **Step 6: 타입 체크 실행**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 7: 커밋**

```bash
git add src/app/page.tsx
git commit -m "style: 메인 페이지 문구 및 배경 글로우 점술가 톤으로 교체"
```

---

## Task 3: BirthdateStep.tsx — 전체 문구 교체

**Files:**
- Modify: `src/components/ui/BirthdateStep.tsx`

- [ ] **Step 1: 제목·설명 교체**

찾기:
```tsx
<div className="relative z-10 text-center mb-8">
    <h2 className="text-3xl font-serif text-primary-foreground mb-3">다음에 펼쳐질 당신의 이야기</h2>
    <p className="text-muted-foreground text-sm leading-relaxed">
        당신을 향해 다가오는 운명의 흐름을 읽고,<br />
        앞으로 맞이할 눈부신 내일을 확인하기 위해 기본 정보가 필요해요.
    </p>
</div>
```

교체:
```tsx
<div className="relative z-10 text-center mb-8">
    <h2 className="text-3xl font-serif text-primary-foreground mb-4">말하지 않아도 됩니다.<br/>이미 보고 있으니까요.</h2>
    <p className="text-sm leading-relaxed text-left italic text-foreground/75 border-l-2 border-primary/50 pl-4 bg-primary/5 py-3 pr-3 rounded-r-lg">
        "그렇지만... 이름과 태어난 날만큼은 직접 알려주셔야 합니다.<br/>그것은 당신만이 줄 수 있는 것이니."
    </p>
</div>
```

- [ ] **Step 2: 이름 필드 레이블·placeholder 교체**

찾기:
```tsx
<label htmlFor="name" className="text-sm font-medium text-foreground/80 pl-1">
    이름 (닉네임) <span className="text-primary">*</span>
</label>
<input
    type="text"
    id="name"
    required
    placeholder="당신을 부를 이름을 알려주세요"
```

교체:
```tsx
<label htmlFor="name" className="text-sm font-medium text-foreground/80 pl-1">
    당신의 이름 <span className="text-primary">*</span>
</label>
<input
    type="text"
    id="name"
    required
    placeholder="숨기지 않아도 됩니다"
```

- [ ] **Step 3: 생년월일 레이블 교체**

찾기:
```tsx
<label htmlFor="birthdate" className="text-sm font-medium text-foreground/80 pl-1">
    생년월일 <span className="text-primary">*</span>
</label>
```

교체:
```tsx
<label htmlFor="birthdate" className="text-sm font-medium text-foreground/80 pl-1">
    이 세상에 태어난 날 <span className="text-primary">*</span>
</label>
```

- [ ] **Step 4: 시간 레이블·placeholder·체크박스 교체**

찾기:
```tsx
<label htmlFor="birthtime" className="text-sm font-medium text-foreground/80">
    태어난 시간
</label>
```
교체:
```tsx
<label htmlFor="birthtime" className="text-sm font-medium text-foreground/80">
    태어난 시간 <span className="text-xs text-muted-foreground font-normal">— 기억하지 못해도 읽을 수 있습니다</span>
</label>
```

찾기:
```tsx
<span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">모름</span>
```
교체:
```tsx
<span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">기억하지 못합니다</span>
```

찾기 (time input):
```tsx
className="w-full bg-white/5 border border-primary/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all [color-scheme:dark] disabled:opacity-50 disabled:cursor-not-allowed"
```
교체 (placeholder 속성 추가):
```tsx
placeholder="알고 있다면 알려주십시오"
className="w-full bg-white/5 border border-primary/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all [color-scheme:dark] disabled:opacity-50 disabled:cursor-not-allowed"
```

- [ ] **Step 5: 제출 버튼 텍스트 교체**

찾기:
```tsx
나만의 운명 여정 시작하기
```
교체:
```tsx
운명의 문 앞에 서다
```

- [ ] **Step 6: 타입 체크 실행**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 7: 커밋**

```bash
git add src/components/ui/BirthdateStep.tsx
git commit -m "style: BirthdateStep 점술가 톤으로 전면 교체"
```

---

## Task 4: MbtiQuizStep.tsx — 진행 텍스트·질문 접두어

**Files:**
- Modify: `src/components/ui/MbtiQuizStep.tsx`

- [ ] **Step 1: 진행 상태 텍스트 교체**

찾기:
```tsx
<span>우주의 진동 주파수 분석중...</span>
```
교체:
```tsx
<span>당신의 본질을 읽는 중...</span>
```

- [ ] **Step 2: 질문 접두어 추가**

찾기:
```tsx
<h3 className="text-xl md:text-2xl font-serif text-primary-foreground mb-8 leading-relaxed">
    {currentQ.text}
</h3>
```
교체:
```tsx
<p className="text-xs text-primary/60 uppercase tracking-widest mb-3">점술가가 묻습니다</p>
<h3 className="text-xl md:text-2xl font-serif text-primary-foreground mb-8 leading-relaxed">
    {currentQ.text}
</h3>
```

- [ ] **Step 3: 타입 체크 실행**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 4: 커밋**

```bash
git add src/components/ui/MbtiQuizStep.tsx
git commit -m "style: MbtiQuizStep 진행 텍스트 및 질문 접두어 교체"
```

---

## Task 5: QuestionInput.tsx — 레이블·placeholder

**Files:**
- Modify: `src/components/ui/QuestionInput.tsx`

- [ ] **Step 1: 레이블·placeholder 교체**

찾기:
```tsx
<Label
    htmlFor="question"
    className="text-foreground mb-2 block font-serif italic text-lg"
>
    무엇이 알고 싶으신가요?
</Label>
<Input
    id="question"
    placeholder="예: 오늘 저의 연애운은 어떤가요?"
```
교체:
```tsx
<Label
    htmlFor="question"
    className="text-foreground mb-2 block font-serif italic text-lg"
>
    무엇을 알고 싶습니까?
</Label>
<Input
    id="question"
    placeholder="직접 말하지 않아도 됩니다. 하지만 물음이 있다면..."
```

- [ ] **Step 2: 타입 체크 실행**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/components/ui/QuestionInput.tsx
git commit -m "style: QuestionInput 레이블 및 placeholder 점술가 톤으로 교체"
```

---

## Task 6: CardSelectionDialog.tsx — 전체 문구 교체

**Files:**
- Modify: `src/components/ui/CardSelectionDialog.tsx`

- [ ] **Step 1: 하단 카운터 텍스트 교체**

찾기:
```tsx
선택한 카드: <span className="text-primary font-bold text-lg">{selectedCards.length}</span>장 (최대 5장)
```
교체:
```tsx
<span className="text-primary font-bold text-lg">{selectedCards.length}</span>장의 패가 선택되었습니다
```

- [ ] **Step 2: 3장 선택 힌트 교체**

찾기:
```tsx
<p className="text-xs text-muted-foreground/80 mb-3 animate-pulse pointer-events-auto">
    더 깊은 조언을 원한다면 5장까지 선택할 수 있어요
</p>
```
교체:
```tsx
<p className="text-xs text-muted-foreground/80 mb-3 animate-pulse pointer-events-auto">
    더 깊이 들어가시겠습니까? 2장이 더 남아 있습니다
</p>
```

- [ ] **Step 3: 확인 트리거 버튼 텍스트 교체**

찾기:
```tsx
{selectedCards.length}장 카드 선택 완료 (결과 보기)
```
교체:
```tsx
이 {selectedCards.length}장의 패로 운명을 읽겠습니다
```

- [ ] **Step 4: 다이얼로그 제목·설명 교체**

찾기:
```tsx
<AlertDialogTitle className="text-2xl font-serif text-center text-primary-foreground">
    선택 완료
</AlertDialogTitle>
<AlertDialogDescription className="text-center text-muted-foreground">
    {selectedCards.length}장의 카드를 선택하셨습니다.
    이제 우주의 메시지를 확인해볼까요?
</AlertDialogDescription>
```
교체:
```tsx
<AlertDialogTitle className="text-2xl font-serif text-center text-primary-foreground">
    패가 정해졌습니다
</AlertDialogTitle>
<AlertDialogDescription className="text-center text-muted-foreground">
    {selectedCards.length}장의 패를 선택하셨습니다.<br/>
    이제 당신의 운명을 들여다보겠습니다.
</AlertDialogDescription>
```

- [ ] **Step 5: 확인 액션 버튼 텍스트 교체**

찾기:
```tsx
<AlertDialogAction
    onClick={onConfirmSelection}
    className="w-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_15px_-3px_var(--primary)] text-lg py-5 rounded-xl"
>
    해석 보기
</AlertDialogAction>
```
교체:
```tsx
<AlertDialogAction
    onClick={onConfirmSelection}
    className="w-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_15px_-3px_var(--primary)] text-lg py-5 rounded-xl"
>
    운명을 마주하다
</AlertDialogAction>
```

- [ ] **Step 6: 타입 체크 실행**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 7: 커밋**

```bash
git add src/components/ui/CardSelectionDialog.tsx
git commit -m "style: CardSelectionDialog 전체 문구 점술가 톤으로 교체"
```

---

## Task 7: PreviewCardDialog.tsx — 설명·닫기 버튼

**Files:**
- Modify: `src/components/ui/PreviewCardDialog.tsx`

- [ ] **Step 1: 설명 문구·닫기 버튼 교체**

찾기:
```tsx
<DialogDescription className="text-center text-muted-foreground italic">
    선택하신 카드의 기운을 느껴보세요
</DialogDescription>
```
교체:
```tsx
<DialogDescription className="text-center text-muted-foreground italic">
    이 패가 당신에게 오고 있었습니다
</DialogDescription>
```

찾기:
```tsx
닫기
```
교체:
```tsx
알겠습니다
```

- [ ] **Step 2: 타입 체크 실행**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/components/ui/PreviewCardDialog.tsx
git commit -m "style: PreviewCardDialog 문구 점술가 톤으로 교체"
```

---

## Task 8: CardInterpretations.tsx — 모달 제목·아이콘·버튼

**Files:**
- Modify: `src/components/ui/CardInterpretations.tsx`

- [ ] **Step 1: 모달 제목 교체**

찾기:
```tsx
<h3 className="text-2xl font-serif font-bold text-primary tracking-wide">
    운명의 흐름 해석
</h3>
```
교체:
```tsx
<h3 className="text-2xl font-serif font-bold text-primary tracking-wide">
    당신의 패를 읽겠습니다
</h3>
```

- [ ] **Step 2: 내담자 아이콘 교체**

찾기:
```tsx
🔮 내담자:
```
교체:
```tsx
🕯 내담자:
```

- [ ] **Step 3: 재시작 버튼 텍스트 교체**

찾기:
```tsx
처음으로
```
교체:
```tsx
다시 운명을 마주하다
```

- [ ] **Step 4: 타입 체크 실행**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 5: 커밋**

```bash
git add src/components/ui/CardInterpretations.tsx
git commit -m "style: CardInterpretations 모달 문구 점술가 톤으로 교체"
```

---

## Task 9: SelectedCardsSlots.tsx — 안내 문구

**Files:**
- Modify: `src/components/ui/SelectedCardsSlots.tsx`

- [ ] **Step 1: 최소 선택 안내 문구 교체**

찾기:
```tsx
<p className="text-center text-xs text-muted-foreground mt-4 animate-pulse">
    최소 3장의 카드를 선택해야 합니다
</p>
```
교체:
```tsx
<p className="text-center text-xs text-muted-foreground mt-4 animate-pulse">
    최소 3장의 패가 필요합니다
</p>
```

- [ ] **Step 2: 타입 체크 실행**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 3: 최종 빌드 확인**

```bash
pnpm build
```

Expected: 빌드 성공 (오류 없음)

- [ ] **Step 4: 커밋**

```bash
git add src/components/ui/SelectedCardsSlots.tsx
git commit -m "style: SelectedCardsSlots 안내 문구 점술가 톤으로 교체"
```
