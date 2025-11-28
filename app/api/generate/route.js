import { NextResponse } from "next/server";
import { generateText } from "@/utils/GeminiAIModal";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    // Force JSON-only output
    const strictPrompt = `${prompt}

Return ONLY a valid JSON array with 5 items in the exact shape:
[{"Question": "...", "Answer": "..."}]
No markdown fences, no commentary.`;

    const result = await generateText(strictPrompt);
    const text = result.response?.text?.() ?? "";

    const raw = text.replace("```json", "").replace("```", "").trim();

    // Validate/repair server-side
    const first = raw.indexOf("[");
    const last = raw.lastIndexOf("]");
    const candidate =
      first !== -1 && last !== -1 ? raw.slice(first, last + 1) : raw;

    const cleaned = candidate
      .replace(/\r?\n/g, " ")
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (e) {
      return NextResponse.json(
        { error: "Model returned invalid JSON" },
        { status: 502 }
      );
    }

    const valid =
      Array.isArray(questions) &&
      questions.every(
        (q) => typeof q?.Question === "string" && typeof q?.Answer === "string"
      );
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid questions shape" },
        { status: 502 }
      );
    }

    return NextResponse.json({ questions });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Generation failed" },
      { status: 500 }
    );
  }
}
