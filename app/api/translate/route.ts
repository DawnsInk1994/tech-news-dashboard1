import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ translations: [] });

  let titles: string[];
  try {
    ({ titles } = await req.json());
  } catch {
    return NextResponse.json({ translations: [] });
  }
  if (!titles?.length) return NextResponse.json({ translations: [] });

  const client = new Anthropic({ apiKey });

  const prompt = `Translate these English tech news headlines to Hebrew. Return ONLY a valid JSON array of strings in the same order, no extra text before or after.

Rules:
- Keep company names, product names (iPhone, GPT-4, etc.) in English
- Be concise and journalistic — match the tone of Israeli tech journalism
- If a headline is already short and clear in English, still translate it

Headlines:
${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.find((b) => b.type === "text")?.text ?? "[]";
    const match = text.match(/\[[\s\S]*\]/);
    const translations: string[] = match ? JSON.parse(match[0]) : [];
    return NextResponse.json({ translations }, {
      headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json({ translations: [] });
  }
}
