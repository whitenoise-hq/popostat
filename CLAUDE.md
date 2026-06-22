# CLAUDE.md — 반려동물 전투력 측정기 (PopoStat · 포포스탯)

> Claude Code 작업 지침. 코드 작성 전 아래 문서를 반드시 참조한다.

## 참조 문서 (Source of Truth)
- `docs/expo-ios-playbook.md` — Expo+iOS 검증된 세팅/명령어/함정 (스택·배포·RN 함정의 기준). **충돌 시 이 파일이 기술 기준 우선.**
- `docs/planning.md` — 제품 정의, 핵심 루프, 측정/등급 규칙, 데이터 구조
- `docs/tech-stack.md` — 아키텍처, Edge Function, DB 스키마/RLS, 계산 로직
- `docs/screens.md` — 화면별 레이아웃/동작, 카드 등급 디자인

규칙이 충돌하면 위 문서가 우선. 문서에 없는 결정은 임의로 하지 말고 질문한다.

---

## 프로젝트 개요
사진 → AI 분석 → 전투력 카드 → 덱 수집. 카카오 로그인 only.
MVP 탭: **측정 / 덱 / 설정** (3탭). 대결은 향후 확장(미구현).

## 스택
React Native + Expo / TypeScript / Expo Router / StyleSheet + theme/colors /
TanStack Query / Supabase(Auth·DB·Storage·Edge) / pnpm

---

## 폴더 구조 (플레이북 기준)
```
app/
  (auth)/login.tsx
  (tabs)/
    _layout.tsx       # 3탭 네비게이터
    measure.tsx
    deck.tsx
    settings.tsx
  _layout.tsx
components/          # 재사용 UI (BattleCard 등)
  ui/                # Text·Card·Button·Screen 등 토큰 적용 공용 컴포넌트
lib/                 # supabase 클라이언트, query-client, 유틸
hooks/               # React Query 커스텀 훅
theme/
  colors.ts          # 색상 단일 출처 (등급별 색 포함)
types/               # Card, Stats 등 공용 타입
supabase/
  functions/
    analyze-pet/      # OpenAI 호출 + power/grade 계산
    _shared/score.ts  # calcPower, calcGrade (단일 출처)
  migrations/         # SQL (cards 테이블, RLS)
docs/                 # planning.md, tech-stack.md, screens.md, expo-ios-playbook.md
```

---

## 코딩 컨벤션
- TypeScript strict. `any` 지양, 공용 타입은 `types/`에.
- 컴포넌트: 함수형 + named export 우선. 파일명 PascalCase(컴포넌트), camelCase(유틸/훅).
- 스타일: `StyleSheet.create` 사용. 색상은 `theme/colors.ts` 단일 출처에서만 가져오고 hex를 컴포넌트에 직접 박지 않는다. NativeWind 안 씀.
- 아이콘: Ionicons(`@expo/vector-icons`)만. 이모지 사용 금지(기기별 렌더링 불일치).
- 서버 통신: TanStack Query 훅으로 캡슐화. 컴포넌트에서 직접 fetch 금지.
- Supabase 호출은 `lib/`/`hooks/`의 함수로 래핑(컴포넌트에서 직접 호출 금지).
- 측정 계산(`calcPower`/`calcGrade`)은 `supabase/functions/_shared/score.ts` **한 곳**에만. 복붙 금지.

---

## 보안 / 정책 (필수 준수)
- **OpenAI API 키 클라이언트 노출 절대 금지.** 모든 외부 API는 Edge Function 경유.
- AI는 스탯(0~100)만 매기고, power·grade는 코드로 계산 (상향 편향 방지).
- 카드는 측정 시점 확정 저장. 같은 사진 재측정으로 점수 흔들지 않기.
- RLS로 카드 소유자만 접근. user_id는 호출자 토큰 uid로 강제.
- 이미지는 압축 WebP(~1080–1440px)만 저장.
- 비밀키/토큰은 `.env` / Supabase secrets로만. 커밋 금지.
- 클라이언트엔 `EXPO_PUBLIC_SUPABASE_URL` + anon key만. `.env` 미커밋(`.env.example`엔 플레이스홀더만).
- **애플 가이드라인 대비:** 로그인은 MVP에서 카카오 단독이나 provider 추상화로 두어 Sign in with Apple을 쉽게 추가할 수 있게 한다(4.8 리젝 대비). 계정 생성 앱이므로 **앱 내 계정 삭제**(`delete_account` RPC, security definer) 반드시 제공(5.1.1(v)).

---

## 커밋 규칙
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`
- 한 커밋 = 한 논리적 변경.
- `.claude/commands/commit.md` 커스텀 슬래시 커맨드 사용 (커밋 후 push 여부 Yes/No 확인).

---

## Do NOT
- API 키/시크릿을 클라이언트 코드나 저장소에 넣지 마라.
- AI 모델이 power/grade를 직접 정하게 하지 마라 (코드 계산 필수).
- 측정 계산 로직을 여러 곳에 복제하지 마라.
- RLS 없이 카드 테이블을 노출하지 마라.
- 원본(비압축) 이미지를 서버에 영구 저장하지 마라.
- 문서에 없는 기능을 임의로 추가하지 마라 (대결 등 backlog는 MVP에 넣지 않음).
- 카드 삭제/공유 등 사용자 행동을 자동 실행하지 마라 (명시적 사용자 액션으로만).
