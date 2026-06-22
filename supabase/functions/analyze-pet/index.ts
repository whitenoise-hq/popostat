import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"
import { calcPower, calcGrade } from "../_shared/score.ts"

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!

const SYSTEM_PROMPT = `당신은 반려동물 전투력 측정기입니다. 사진을 분석해 게임 스탯을 매기세요.

규칙:
- 각 스탯은 0~100, 기준점 50(평범한 반려동물)
- 대부분의 펫은 30~65 범위. 80 이상은 사진에 명확한 근거가 있을 때만
- attack/defense/agility는 신체적 단서 없으면 50 초과 금지
- 같은 동물의 비슷한 사진은 비슷하게(일관성)
- "능력 배틀물" 해설체로 재밌게 작성

반드시 아래 JSON 형식으로 응답:
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

- power와 grade는 0과 "F"로 두세요. 서버에서 계산합니다.
- 동물이 없으면 detected: "없음", error에 사유, 나머지 0/null`

Deno.serve(async (req) => {
  try {
    // 인증 확인
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "인증이 필요합니다" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Supabase 클라이언트 (호출자 토큰 사용)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "유효하지 않은 사용자" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { image_url, pet_name } = await req.json()

    if (!image_url || !pet_name) {
      return new Response(JSON.stringify({ error: "image_url과 pet_name이 필요합니다" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Storage에서 signed URL 생성 (OpenAI에 전달용)
    const imagePath = image_url.replace(/^.*card-images\//, "")
    const { data: signedData, error: signedError } = await supabase.storage
      .from("card-images")
      .createSignedUrl(imagePath, 300)

    if (signedError || !signedData?.signedUrl) {
      return new Response(JSON.stringify({ error: "이미지 URL 생성 실패" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // OpenAI 비전 호출
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
              { type: "image_url", image_url: { url: signedData.signedUrl } },
            ],
          },
        ],
        max_tokens: 800,
      }),
    })

    if (!openaiRes.ok) {
      const err = await openaiRes.text()
      console.error("OpenAI error:", err)
      return new Response(JSON.stringify({ error: "AI 분석에 실패했습니다" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      })
    }

    const openaiData = await openaiRes.json()
    const content = openaiData.choices?.[0]?.message?.content

    if (!content) {
      return new Response(JSON.stringify({ error: "AI 응답이 비어있습니다" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      })
    }

    const parsed = JSON.parse(content)

    // 동물 미검출
    if (parsed.detected === "없음") {
      return new Response(JSON.stringify({
        error: parsed.error || "동물을 찾을 수 없습니다",
        detected: "없음",
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    // power/grade는 코드로 계산 (AI 값 무시)
    const power = calcPower(parsed.stats)
    const grade = calcGrade(power)

    // DB 저장 (service role 대신 호출자 토큰 사용 → RLS 적용)
    const { data: card, error: insertError } = await supabase
      .from("cards")
      .insert({
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
      })
      .select()
      .single()

    if (insertError) {
      console.error("Insert error:", insertError)
      return new Response(JSON.stringify({ error: "카드 저장에 실패했습니다" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify(card), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("Unexpected error:", err)
    return new Response(JSON.stringify({ error: "서버 오류가 발생했습니다" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})