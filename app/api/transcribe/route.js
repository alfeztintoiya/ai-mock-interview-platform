import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
export const runtime = "nodejs";

// Server-side only: read key from env
const apiKey =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "Missing Gemini API key" },
        { status: 500 }
      );
    }
    const { base64Audio, mimeType = "audio/webm" } = await req.json();
    if (!base64Audio || typeof base64Audio !== "string") {
      return NextResponse.json(
        { error: "Invalid audio payload" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Transcribe the following audio as plain text. Output only the transcript without extra words.",
            },
            { inlineData: { data: base64Audio, mimeType } },
          ],
        },
      ],
    });

    const text = result.response?.text?.();
    if (!text) {
      return NextResponse.json(
        { error: "Empty transcription result" },
        { status: 502 }
      );
    }
    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Transcription failed" },
      { status: 500 }
    );
  }
}
