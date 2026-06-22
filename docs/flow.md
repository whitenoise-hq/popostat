# PopoStat 개발 진행 순서

## Phase 1: 초기 셋업 ✅
- [x] Expo + TypeScript 프로젝트 생성 (pnpm)
- [x] 패키지 설치 (Supabase, TanStack Query, image-picker, reanimated 등)
- [x] 폴더 구조 스캐폴딩 (app, components, lib, hooks, theme, types, supabase)
- [x] theme/colors.ts 등급별 색상 토큰
- [x] types/card.ts Card/Stats 타입
- [x] lib/supabase.ts, lib/query-client.ts 골격
- [x] supabase/functions/_shared/score.ts (calcPower, calcGrade)
- [x] .env.example, .gitignore
- [x] 기획 문서 docs/ 이동, playbook 충돌 해소

## Phase 2: 전체 화면 UI (목데이터 기반)
- [ ] 공용 UI 컴포넌트 (components/ui: Text, Button, Screen 등)
- [ ] 로그인 화면 (카카오 버튼, provider 추상화 레이아웃)
- [ ] 측정 화면 (사진 선택 영역, 이름 입력, 측정 버튼 — 단계형 UI)
- [ ] 스캔 연출 화면 (로딩 애니메이션)
- [ ] 결과 카드 화면 (덱 저장 확인 / 공유 / 다시 측정)
- [ ] BattleCard 컴포넌트 (등급별 색/테두리, 스탯 바, 목데이터)
- [ ] 덱 화면 (카드 그리드 2열, 정렬/필터 UI, 빈 상태)
- [ ] 카드 상세 화면 (큰 카드 + 공유/삭제 버튼)
- [ ] 설정 화면 (계정정보, 로그아웃, 앱정보, 약관)
- [ ] S등급 이상 광택/글로우 애니메이션

## Phase 3: 인증 연동
- [ ] Supabase Auth 카카오 OAuth 연동
- [ ] 인증 상태 관리 (세션 체크 → 탭 or 로그인 분기)
- [ ] 로그아웃 기능

## Phase 4: 측정 로직 (핵심 루프)
- [ ] DB 마이그레이션 (cards 테이블 + RLS)
- [ ] 이미지 압축/리사이즈 (expo-image-manipulator → WebP)
- [ ] Supabase Storage 업로드
- [ ] Edge Function: analyze-pet (OpenAI 비전 호출 + score 계산 + DB insert)
- [ ] 측정 화면 ↔ Edge Function 연결
- [ ] 결과 → 덱 갱신 (TanStack Query invalidate)

## Phase 5: 덱 & 공유 로직
- [ ] 덱 데이터 로드 (React Query 훅)
- [ ] 정렬/필터 로직
- [ ] 카드 삭제 로직
- [ ] 카드 이미지 캡처 (react-native-view-shot)
- [ ] 공유 기능 (expo-sharing)

## Phase 6: 계정 & 마무리
- [ ] 계정 삭제 (delete_account RPC, 5.1.1(v) 대응)
- [ ] 에러 핸들링 / 빈 상태 UI 보강
- [ ] 다크모드/키보드/폰트 함정 점검
- [ ] EAS 빌드 + TestFlight