import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Use server-side env; avoid exposing in client
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Gemini API key is not set in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);

// Default model (not used directly); session resolves valid model at runtime
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Stable model choices; SDK doesn't expose listModels
const candidateModels = [
  "gemini-1.5-flash-001",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.5-flash"
];

let resolvedModel = candidateModels[3];

export async function resolveModel() {
  return resolvedModel;
}

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

export async function getChatSession() {
  const modelName = await resolveModel();
  const model = genAI.getGenerativeModel({ model: modelName });
  return model.startChat({ generationConfig, safetySettings });
}

export async function generateText(prompt) {
  const modelName = await resolveModel();
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  return result;
}
