import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT =
  'אתה עורך טכנולוגיה מנוסה בעיתון ישראל היום. כתוב ידיעות עיתונאיות בעברית, ישירות, בלי מלל מיותר.';

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY לא הוגדר בשרת" },
      { status: 500 }
    );
  }

  let body: { title?: string; summary?: string; link?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const { title, summary, link, source } = body;
  if (!title) {
    return NextResponse.json({ error: "חסר שדה title" }, { status: 400 });
  }

  const userPrompt = `כתוב ידיעה על סמך:
כותרת מקורית: ${title}
תקציר: ${summary || "אין תקציר"}
מקור: ${source || "לא ידוע"}
קישור: ${link || ""}

כלול:
1) כותרת ראשית (40-65 תווים, FOMO, SEO)
2) כותרת משנה
3) 3 נקודות בולט קצרות
4) גוף ידיעה (3 פסקאות קצרות)

ענה אך ורק בפורמט JSON תקני, ללא טקסט לפני או אחרי:
{"headline":"...","subhead":"...","bullets":["...","...","..."],"body":"..."}`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1200,
      thinking: { type: "enabled", budget_tokens: 800 },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    // Extract text content (thinking blocks come first, then text)
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "לא התקבלה תשובה מהמודל" },
        { status: 500 }
      );
    }

    // Parse JSON — Claude may wrap in markdown code fences
    const raw = textBlock.text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    let parsed: {
      headline: string;
      subhead: string;
      bullets: string[];
      body: string;
    };

    try {
      parsed = JSON.parse(raw);
    } catch {
      // Fallback: try to extract JSON object from the text
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        return NextResponse.json(
          { error: "תשובת המודל לא היתה JSON תקין" },
          { status: 500 }
        );
      }
      parsed = JSON.parse(match[0]);
    }

    // Validate structure
    if (
      typeof parsed.headline !== "string" ||
      typeof parsed.subhead !== "string" ||
      !Array.isArray(parsed.bullets) ||
      typeof parsed.body !== "string"
    ) {
      return NextResponse.json(
        { error: "מבנה JSON לא תקין מהמודל" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "שגיאה פנימית בשרת";
    console.error("[write-article]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
