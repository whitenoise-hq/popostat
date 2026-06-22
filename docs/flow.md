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

## Phase 2: 전체 화면 UI ✅
- [x] 다크 네온 테마 + Pretendard 폰트
- [x] 로그인 화면 (카카오 버튼)
- [x] 닉네임 입력 화면
- [x] 측정 화면 (사진 선택, 이름 입력, 측정 버튼 활성화 조건)
- [x] 스캔 연출 화면 (스캔라인 + 스탯 플리커 + 프로그레스 바)
- [x] 결과 카드 화면 (덱 저장 / 공유 / 다시 측정)
- [x] BattleCard 컴포넌트 (등급별 색, S이상 샤인/글로우/무지개)
- [x] 덱 화면 (카드 그리드 2열, 정렬/필터, 빈 상태)
- [x] 카드 상세 화면 (큰 카드 + 상단 공유/삭제 아이콘)
- [x] 설정 화면 (계정정보, 로그아웃, 계정삭제, 앱정보, 약관)
- [x] 공용 모달 컴포넌트 (AppModal)

## Phase 3: 인증 연동 ✅
- [x] Supabase Auth 카카오 OAuth 연동
- [x] 인증 상태 관리 (useSession + useProtectedRoute → 세션 분기)
- [x] 로그아웃 기능 (queryClient.clear 포함)
- [x] provider 추상화 (Sign in with Apple 추가 대비)

## Phase 4: 측정 로직 (핵심 루프) ✅
- [x] DB 마이그레이션 (cards 테이블 + RLS + Storage 버킷 + delete_account RPC)
- [x] 이미지 압축/리사이즈 (expo-image-manipulator → WebP 1080px)
- [x] Supabase Storage 업로드 (base64 방식)
- [x] Edge Function: analyze-pet (gpt-4.1-mini 비전 → calcPower/calcGrade → DB insert)
- [x] 측정 화면 ↔ Edge Function 연결 (measure-store)
- [x] 결과 → 덱 갱신 (TanStack Query invalidate)
- [x] Storage 이미지 URL 변환 (경로 → 공개 URL)

## Phase 5: 덱 & 공유 로직 ✅
- [x] 덱 데이터 로드 (useCards React Query 훅)
- [x] 정렬 (최신순 / 전투력순 / 등급순)
- [x] 필터 (등급별)
- [x] 카드 삭제 (useDeleteCard + AppModal 확인)
- [ ] 카드 이미지 캡처 (react-native-view-shot)
- [ ] 공유 기능 (expo-sharing)

## Phase 6: 계정 & 마무리
- [ ] 계정 삭제 (delete_account RPC 연결, 5.1.1(v) 대응)
- [ ] 에러 핸들링 / 빈 상태 UI 보강
- [ ] 다크모드/키보드/폰트 함정 점검
- [ ] EAS 빌드 + TestFlight