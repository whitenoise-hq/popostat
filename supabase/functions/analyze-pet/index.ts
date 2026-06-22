function calcPower(s: { attack: number; defense: number; agility: number; cuteness: number; laziness: number }): number {
  const raw = s.attack * 0.30 + s.defense * 0.25 + s.agility * 0.25 + s.cuteness * 0.10 - s.laziness * 0.20
  const norm = Math.max(0, Math.min(1, (raw + 20) / 110))
  return Math.round(Math.pow(norm, 1.3) * 10000)
}

function calcGrade(power: number): string {
  if (power <= 1500) return "F"
  if (power <= 3000) return "D"
  if (power <= 4500) return "C"
  if (power <= 6000) return "B"
  if (power <= 7500) return "A"
  if (power <= 8500) return "S"
  if (power <= 9500) return "SS"
  return "SSS"
}

const SYSTEM_PROMPT = `당신은 반려동물 전투력 측정기입니다. 사진을 분석해 게임 스탯을 매기세요.

규칙:
- 각 스탯은 0~100, 기준점 50(평범한 반려동물)
- 사진에서 보이는 특징을 적극적으로 반영해 스탯을 매기세요
- 40~75가 일반적 범위, 인상적인 특징이 있으면 80~95도 가능
- 귀여움은 대부분의 펫이 높게 받을 수 있음 (60~90)
- laziness(게으름)는 사진에서 자고 있거나 늘어져 있을 때만 높게
- 같은 동물의 비슷한 사진은 비슷하게(일관성)
- "능력 배틀물" 해설체로 재밌고 과장되게 작성 (포켓몬 도감 느낌)

반드시 아래 JSON 형식으로 응답:
{
  "detected": "강아지" | "고양이" | "기타동물" | "없음",
  "name_guess": "추정 품종 또는 종",
  "power": 0,
  "grade": "F",
  "title": "재밌는 칭호",
  "stats": { "attack": 0, "defense": 0, "agility": 0, "cuteness": 0, "laziness": 0 },
  "analysis": "사진 근거를 든 2~3문장 해설",
  "special_move": "[스킬이름] 스킬 설명",
  "error": null
}

- power와 grade는 0과 "F"로 두세요. 서버에서 계산합니다.
- **중요: 사진에 동물(강아지, 고양이, 새, 햄스터, 토끼 등)이 없으면 반드시 detected를 "없음"으로 설정하세요.**
- 꽃, 음식, 풍경, 사람만 있는 사진 등은 모두 "없음"입니다.
- 동물이 없으면 detected: "없음", error: "동물이 포함된 사진을 올려주세요", 나머지 0/null`

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })

Deno.serve(async (req) => {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

  try {
    // 인증
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) return json({ error: "인증이 필요합니다" }, 401)

    // 유저 확인 (REST API)
    console.log("[analyze-pet] verifying user...")
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: authHeader, apikey: Deno.env.get("SUPABASE_ANON_KEY")! },
    })
    if (!userRes.ok) return json({ error: "유효하지 않은 사용자" }, 401)
    const user = await userRes.json()
    console.log("[analyze-pet] user:", user.id)

    // 요청 파싱
    const { image_url, pet_name } = await req.json()
    if (!image_url || !pet_name) return json({ error: "image_url과 pet_name이 필요합니다" }, 400)
    console.log("[analyze-pet] image:", image_url, "name:", pet_name)

    // Signed URL (REST API with service role)
    console.log("[analyze-pet] creating signed URL...")
    const signRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/sign/card-images/${image_url}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expiresIn: 300 }),
      }
    )
    const signData = await signRes.json()
    console.log("[analyze-pet] sign result:", JSON.stringify(signData))

    if (!signData.signedURL) return json({ error: "이미지 URL 생성 실패" }, 500)
    const imageAccessUrl = `${SUPABASE_URL}/storage/v1${signData.signedURL}`

    // OpenAI 호출
    console.log("[analyze-pet] calling OpenAI...")
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: `이 반려동물의 이름은 "${pet_name}"입니다. 전투력을 측정해주세요.` },
              { type: "image_url", image_url: { url: imageAccessUrl } },
            ],
          },
        ],
        max_tokens: 800,
      }),
    })

    console.log("[analyze-pet] OpenAI status:", openaiRes.status)
    if (!openaiRes.ok) {
      const errText = await openaiRes.text()
      console.error("[analyze-pet] OpenAI error:", errText)
      return json({ error: "AI 분석에 실패했습니다" }, 502)
    }

    const openaiData = await openaiRes.json()
    const content = openaiData.choices?.[0]?.message?.content
    if (!content) return json({ error: "AI 응답이 비어있습니다" }, 502)

    const parsed = JSON.parse(content)
    console.log("[analyze-pet] detected:", parsed.detected)

    if (parsed.detected === "없음") {
      return json({ error: parsed.error || "동물을 찾을 수 없습니다", detected: "없음" })
    }

    const power = calcPower(parsed.stats)
    const grade = calcGrade(power)
    console.log("[analyze-pet] power:", power, "grade:", grade)

    // DB insert (REST API with service role, user_id를 직접 지정)
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/cards`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY!,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: user.id,
        pet_name,
        image_url,
        detected: parsed.detected,
        name_guess: parsed.name_guess,
        power,
        grade,
        title: parsed.title,
        analysis: parsed.analysis,
        special_move: parsed.special_move,
        stats: parsed.stats,
      }),
    })

    if (!insertRes.ok) {
      const insertErr = await insertRes.text()
      console.error("[analyze-pet] insert error:", insertErr)
      return json({ error: `카드 저장 실패: ${insertErr}` }, 500)
    }

    const cards = await insertRes.json()
    const card = Array.isArray(cards) ? cards[0] : cards
    console.log("[analyze-pet] saved card:", card.id)

    return json(card)
  } catch (err) {
    const msg = err instanceof Error ? `${err.message}\n${err.stack}` : String(err)
    console.error("[analyze-pet] error:", msg)
    return json({ error: msg, step: "catch" }, 500)
  }
})