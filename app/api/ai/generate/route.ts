import { type NextRequest, NextResponse } from "next/server"

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models"
const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000/api"

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, context } = await request.json()

    const model = type === "react" ? "bigcode/starcoder" : "Salesforce/codet5p-2b"

    const response = await fetch(`${HUGGINGFACE_API_URL}/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const result = await response.json()

    await fetch(`${DJANGO_API_URL}/ai/suggestions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.headers.get("authorization")?.replace("Bearer ", "") || ""}`,
      },
      body: JSON.stringify({
        prompt,
        type,
        context,
        suggestion: result[0]?.generated_text || "",
        model_used: model,
      }),
    })

    return NextResponse.json({
      suggestion: result[0]?.generated_text || "",
      model: model,
      confidence: result[0]?.score || 0.8,
    })
  } catch (error) {
    console.error("AI generation failed:", error)
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 })
  }
}
