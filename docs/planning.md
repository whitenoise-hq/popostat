# planning.md — 반려동물 전투력 측정기 (PopoStat · 포포스탯)

> 이 문서는 Claude Code가 읽고 개발에 사용하는 기획 정의서다.
> 제품 규칙·데이터 구조·측정 로직의 단일 출처(Single Source of Truth).

---

## 1. 제품 개요

사용자가 반려동물 사진을 올리면 AI가 사진의 실제 디테일을 분석해 "전투력"과
게임 스탯을 매기고, **포켓몬 카드 형태**로 결과를 보여주는 모바일 앱.
측정된 카드는 "덱"에 수집된다.

- 톤: 진지한 척하지만 웃긴 "능력 배틀물" 해설체
- 핵심 재미: 측정 결과의 의외성 + 카드 수집 + (향후) 자랑/공유/대결
- 로그인: **카카오 OAuth only** (Supabase Auth 경유)

---

## 2. 핵심 루프 (MVP)

```
사진 선택(카메라/앨범) → 이름 입력 → [전투력 측정] 버튼
  → 스캔 연출(로딩) → AI 분석 → 카드 생성 → 덱에 저장 → 카드 이미지 공유
```

이 루프가 제품의 전부다. 측정이 재미있어야 모든 게 작동한다.

---

## 3. 화면 / 네비게이션

하단 탭 네비게이터 **3탭**:

| 탭 | 역할 |
|----|------|
| 측정 | 핵심 화면. 사진 업로드 + 이름 입력 + 측정 실행 (= 사실상 홈) |
| 덱 | 측정한 카드 컬렉션. 정렬/필터 |
| 설정 | 계정, 로그아웃, 정책, 앱 정보 |

상세 레이아웃은 `screens.md` 참조.

---

## 4. 측정 / 등급 규칙 (중요)

### 4.1 역할 분리 (핵심 설계 원칙)

> **AI 모델은 0~100 스탯만 매긴다. power와 grade는 클라이언트/Edge에서 코드로 계산한다.**

이유: 모델에 power를 직접 맡기면 점수가 상향 편향되어 "다 높게" 나온다.
분포를 코드로 통제해야 등급이 의미를 가진다.

### 4.2 스탯 (모델이 산정)

각 0~100, 기준점 50(평범한 반려동물):
- `attack` (공격)
- `defense` (방어)
- `agility` (민첩)
- `cuteness` (귀여움)
- `laziness` (게으름) — power에 **감점** 요소

모델 가이드:
- 대부분의 펫은 30~65 범위. 80 이상은 사진에 명확한 근거가 있을 때만.
- attack/defense/agility는 신체적 단서 없으면 50 초과 금지.
- 같은 동물의 비슷한 사진은 비슷하게(일관성). temperature 낮게.

### 4.3 power 계산 (코드)

```ts
function calcPower(s) {
  const raw =
    s.attack   * 0.30 +
    s.defense  * 0.25 +
    s.agility  * 0.25 +
    s.cuteness * 0.10 -
    s.laziness * 0.20;
  const norm = Math.max(0, Math.min(1, (raw + 20) / 110));
  const curved = Math.pow(norm, 1.6); // 지수↑ = 고등급 희귀
  return Math.round(curved * 10000);  // 0~10000
}
```

> 곡선 지수(1.6)는 실제 사진으로 튜닝. ↑ 희귀, ↓ 후함.

### 4.4 grade 결정 (코드, power 구간)

```
F:   ~1500
D:   ~3000
C:   ~4500
B:   ~6000
A:   ~7500
S:   ~8500
SS:  ~9500
SSS: 9501~
```

순서: F < D < C < B < A < S < SS < SSS

---

## 5. AI 응답 포맷

- 비전 입력 지원 모델 사용 (gpt-4o 계열 등 — 정확한 모델명은 배포 직전 확인)
- `response_format: { type: "json_object" }` 강제
- 모델은 power=0, grade="F"로 두고, 코드에서 덮어씀

```json
{
  "detected": "강아지" | "고양이" | "기타동물" | "없음",
  "name_guess": "추정 품종 또는 종",
  "power": 0,
  "grade": "F",
  "title": "재밌는 칭호",
  "stats": { "attack": 0, "defense": 0, "agility": 0, "cuteness": 0, "laziness": 0 },
  "analysis": "사진 근거를 든 2~3문장 해설",
  "special_move": "필살기 이름 + 한줄 설명",
  "error": null
}
```

- 동물 없으면 `detected: "없음"`, `error`에 사유, 나머지 0/null.

---

## 6. 데이터 구조 (개념)

상세 스키마/RLS는 `tech-stack.md` 참조. 개념 수준:

### cards
- `id`, `user_id` (FK), `created_at`
- `pet_name` (사용자 입력)
- `image_url` (압축 WebP)
- `detected`, `name_guess`
- `power` (int), `grade` (text)
- `title`, `analysis`, `special_move`
- `stats` (jsonb: attack/defense/agility/cuteness/laziness)

> 카드는 측정 시점에 **확정 저장**. 재측정으로 점수가 흔들리지 않게 한다.

---

## 7. 규칙 / 정책

- 카드 소유자만 자기 카드 수정/삭제 (Supabase RLS로 강제)
- 원본 사진은 업로드 후 압축 WebP만 보관 (~1080–1440px), 원본 폐기 검토
- OpenAI API 키는 **절대 클라이언트 노출 금지** → 모든 호출 Supabase Edge Function 경유
- 측정 결과 카드는 이미지로 공유 가능 (바이럴 핵심)

---

## 8. MVP 범위

포함:
- 카카오 로그인 (⚠️ 애플 4.8: Sign in with Apple 미제공 시 리젝 위험 — tech-stack.md 2.3 참조)
- 측정(사진+이름 → AI → 카드)
- 덱(수집/정렬/필터)
- 카드 이미지 공유
- 설정

제외(MVP):
- 대결 기능

---

## 9. 향후 확장 (Backlog)

- **대결 탭 (친구 대결, 비동기 방식)**
  - 덱에서 카드 선택 → 대결 코드 생성 → 친구가 코드+카드 입력 시 power 비교로 승부 확정 → 양쪽 결과 연출
  - 필요: `battles` 테이블, 대결 확정 RPC/Edge Function, 결과 화면
  - 실시간(Realtime) 동기화는 불필요 — 코드 입력 시 1회 계산
  - 네비게이션 4탭으로 확장 (측정/덱/대결/설정)
- 랜덤 상대 대결 (프라이버시 동의 설계 필요)
- 등급 도감 / 희귀도 통계
- 다중 펫 / 가족 공유 (포포노트 패턴 참고 가능)
