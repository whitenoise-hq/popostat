# tech-stack.md — 반려동물 전투력 측정기 (PopoStat · 포포스탯)

> 아키텍처 결정과 기술적 제약의 단일 출처. `planning.md`의 규칙을 구현 관점에서 구체화.

---

## 1. 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | React Native + Expo |
| 언어 | TypeScript |
| 라우팅 | Expo Router (file-based, 3탭 bottom navigator) |
| 스타일 | RN `StyleSheet.create` + `theme/colors.ts` 단일 출처 (hex 직접 사용 금지). **NativeWind 안 씀** |
| 아이콘 | Ionicons (`@expo/vector-icons`). **이모지 금지** (기기별 렌더링 불일치) |
| 서버 상태 | TanStack Query |
| 백엔드 | Supabase (Auth, DB, Storage, Edge Functions) |
| 인증 | 카카오 OAuth (Supabase Auth) — ⚠️ 애플 4.8 리스크, 아래 2.3 참조 |
| 이미지 분석 | OpenAI 비전 지원 모델 (gpt-4o 계열) — Edge Function 경유 |
| 패키지 매니저 | **pnpm** |

> 백엔드 복잡도는 최소화한다(프론트 중심 개발). Supabase가 Auth/DB/Storage/Edge를 전담.

---

## 2. 핵심 아키텍처 원칙

### 2.1 API 키 보호 (절대 규칙)
OpenAI API 키는 클라이언트에 두지 않는다. **모든 외부 API 호출은 Supabase Edge Function 경유.**
앱 → Edge Function → OpenAI → 응답 가공 → 앱.

### 2.2 측정 책임 분리
- 모델: 스탯(0~100)만 산정
- Edge Function(또는 클라이언트): `calcPower`, `calcGrade`로 power·grade 계산
- 권장: **Edge Function에서 계산까지 완료**해서 클라이언트엔 완성된 카드 데이터만 반환 (로직 일관성·변조 방지)

### 2.3 ⚠️ 애플 로그인(4.8) 리스크 — 출시 전 반드시 확인
- MVP는 **카카오 OAuth 단독**으로 결정됨.
- 그러나 App Store 가이드라인 4.8은 "소셜 로그인을 단독으로 써서 기본 계정을 만드는 앱은 Sign in with Apple도 동등 옵션으로 제공"하라고 요구한다. 카카오도 해당됨 → **심사 리젝 가능성 있음.**
- 대응: (1) 리젝 시 Sign in with Apple 추가(Supabase Auth가 애플 지원), 또는 (2) 처음부터 애플 로그인 병행.
- 코드 설계 시 **로그인 provider를 쉽게 추가할 수 있는 구조**로 둘 것(카카오 하드코딩 회피, provider 추상화).
- 추가로 5.1.1(v): 계정 생성 앱은 **앱 내 계정 삭제**(`delete_account` RPC) 필수 — 로그아웃만으론 리젝.

---

## 3. 측정 플로우 (기술 관점)

```
1. 클라: 이미지 선택 (expo-image-picker, 카메라/앨범)
2. 클라: 이미지 압축/리사이즈 (expo-image-manipulator → WebP, ~1080–1440px)
3. 클라: Supabase Storage 업로드 → image_url 확보
4. 클라: Edge Function 호출 (image_url 또는 base64 + pet_name 전달)
5. Edge: OpenAI 비전 모델 호출 (response_format: json_object)
6. Edge: 응답 파싱 → calcPower → calcGrade → 카드 객체 완성
7. Edge: cards 테이블 insert → 완성 카드 반환
8. 클라: 결과 화면 렌더 → 덱 갱신 (TanStack Query invalidate)
```

> 측정 지연(2~5초) 동안 "스캔 중" 연출 필수 (`screens.md` 참조).

---

## 4. OpenAI 호출 규약

- `response_format: { type: "json_object" }`
- `temperature` 낮게 (일관성 우선, 0.3~0.5 권장 — 튜닝)
- 시스템 프롬프트: `planning.md` 4·5절 규칙 그대로 반영
- 파싱 실패 대비: try/catch + 재시도 1회, 그래도 실패 시 사용자에 친화적 에러
- `detected: "없음"`이면 카드 저장하지 않고 에러 안내

---

## 5. power / grade 계산 (구현)

```ts
// supabase/functions/_shared/score.ts
export type Stats = {
  attack: number; defense: number;
  agility: number; cuteness: number; laziness: number;
};

export function calcPower(s: Stats): number {
  const raw =
    s.attack   * 0.30 +
    s.defense  * 0.25 +
    s.agility  * 0.25 +
    s.cuteness * 0.10 -
    s.laziness * 0.20;
  const norm = Math.max(0, Math.min(1, (raw + 20) / 110));
  const curved = Math.pow(norm, 1.6);
  return Math.round(curved * 10000);
}

export function calcGrade(power: number): string {
  if (power <= 1500) return "F";
  if (power <= 3000) return "D";
  if (power <= 4500) return "C";
  if (power <= 6000) return "B";
  if (power <= 7500) return "A";
  if (power <= 8500) return "S";
  if (power <= 9500) return "SS";
  return "SSS";
}
```

> 곡선 지수·구간은 실제 데이터로 튜닝. 변경 시 이 파일 한 곳만 수정.

---

## 6. 이미지 처리 정책

- 선택: `expo-image-picker` (카메라/앨범)
- 가공: `expo-image-manipulator` → WebP, 최대 변 ~1080–1440px, 적정 품질
- 저장: Supabase Storage (버킷 예: `card-images`)
- 원본은 업로드/분석 후 보관하지 않음(압축본만). 디바이스 원본은 사용자 갤러리에 남음.
- 분석 입력: Storage 공개 URL 또는 base64 — Edge Function이 OpenAI에 전달

---

## 7. DB 스키마 (Supabase / Postgres)

### cards
```sql
create table public.cards (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  pet_name     text not null,
  image_url    text not null,
  detected     text not null,           -- 강아지/고양이/기타동물/없음
  name_guess   text,
  power        integer not null,
  grade        text not null,           -- F~SSS
  title        text,
  analysis     text,
  special_move text,
  stats        jsonb not null           -- {attack,defense,agility,cuteness,laziness}
);
```

### RLS (소유자만 접근)
```sql
alter table public.cards enable row level security;

create policy "select own cards"
  on public.cards for select
  using (auth.uid() = user_id);

create policy "insert own cards"
  on public.cards for insert
  with check (auth.uid() = user_id);

create policy "update own cards"
  on public.cards for update
  using (auth.uid() = user_id);

create policy "delete own cards"
  on public.cards for delete
  using (auth.uid() = user_id);
```

> Edge Function이 insert할 때는 service role 사용 가능하나, user_id를 반드시 호출자 토큰의 uid로 강제.

### Storage
- 버킷 `card-images`, 사용자별 경로(`{user_id}/...`)
- 접근 정책은 소유자 기준으로 제한 (공유 시엔 클라에서 이미지 생성/내보내기)

---

## 8. 카드 공유 (기술)

- 카드 뷰를 이미지로 캡처: `react-native-view-shot`
- 저장/공유: `expo-sharing`, `expo-media-library`
- 공유 이미지에 앱 워터마크/이름 넣어 바이럴 유도

---

## 9. 향후 확장 (대결) — 기술 메모

- `battles` 테이블: `code`, `challenger_card_id`, `opponent_card_id`, `winner_card_id`, `status`, `created_at`
- 대결 확정: Edge Function/RPC가 코드 입력 시 1회 실행, 두 카드 power 비교
- 실시간 동기화 불필요 (비동기 비교 방식)
