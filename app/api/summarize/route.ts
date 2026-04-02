import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no_key" }, { status: 503 });

  let body: { title?: string; summary?: string; source?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }

  const { title, summary, source } = body;
  if (!title) return NextResponse.json({ error: "no_title" }, { status: 400 });

  const client = new Anthropic({ apiKey });

  const prompt = `אתה עורך חדשות טק ישראלי. סכם את הכתבה הבאה בעברית עבור עיתונאי טק ישראלי.

כותרת: ${title}
מקור: ${source ?? "לא ידוע"}
תקציר: ${summary ?? "אין תקציר"}

ספק:
1. סיכום של 2-3 משפטים בעברית
2. 3 נקודות מפתח קצרות בעברית
3. למה זה רלוונטי לקורא ישראלי (משפט אחד)

החזר JSON בלבד, ללא טקסט לפני או אחרי:
{"summary":"...","bullets":["...","...","..."],"significance":"..."}`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.find(b => b.type === "text")?.text ?? "{}";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: "parse_failed" }, { status: 500 });
    const parsed = JSON.parse(match[0]);
    if (!parsed.summary) return NextResponse.json({ error: "parse_failed" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
