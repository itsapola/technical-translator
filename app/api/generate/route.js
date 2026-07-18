import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a senior brand and narrative strategist who specializes in translating complex, technical, or regulated products into language different buyers trust — without changing what's actually true.

Given a technical product/feature description and a list of buyer audiences, do two things:

1. Identify ONE core technical fact from the description that must remain true and unchanged across every audience's version — the thing that cannot be lost, softened, or overclaimed no matter who you're writing for.

2. For each buyer listed, write a distinct translation:
   - "audience": the buyer as given
   - "headline": a short, sharp value-prop headline (under 12 words) in language that specific buyer actually uses and cares about
   - "copy": 2-3 sentences of value-prop copy for that buyer, grounded in the core fact but framed around what THAT buyer needs to hear (their risk, their metric, their day-to-day) — not a generic rephrasing
   - "anchor": one short phrase naming exactly how this version stays tethered to the core fact (so it's checkable, not just persuasive)
   - "watchOutFor": the real risk of this specific translation — where it could be misread, overclaimed, or where a reader from a different audience might object. Never write "none" or "no risk" — every translation has one.

Do not invent capabilities the product description didn't state. If a buyer's likely concern isn't addressable by what was given, say so honestly in watchOutFor rather than inventing a feature.

Respond with ONLY valid, parseable JSON in this exact shape — no markdown fences, no preamble, no text before or after the JSON object. If you quote or paraphrase language from the product description inside a headline, copy, anchor, or watchOutFor field, do not use raw double quotes around it — use single quotes or drop the quotation marks entirely, and escape any double quote character you do use as \\". The entire response must be a single valid JSON object parseable by JSON.parse with no modification:
{"coreFact": "...", "translations": [{"audience": "...", "headline": "...", "copy": "...", "anchor": "...", "watchOutFor": "..."}]}`;

export async function POST(req) {
  try {
    const { product, buyers } = await req.json();

    if (!product || !product.trim()) {
      return NextResponse.json(
        { error: "Product description is required." },
        { status: 400 }
      );
    }
    if (!buyers || !buyers.trim()) {
      return NextResponse.json(
        { error: "At least one buyer is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Server is missing ANTHROPIC_API_KEY. Add it in your Vercel project's Environment Variables.",
        },
        { status: 500 }
      );
    }

    const buyerList = buyers
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean)
      .slice(0, 6);

    const userMessage = [
      `Technical product/feature description: ${product.trim()}`,
      `Buyers to translate for:\n${buyerList.map((b) => `- ${b}`).join("\n")}`,
    ].join("\n\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 2800,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return NextResponse.json(
        { error: `Anthropic API error (${response.status}): ${errText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === "text");
    const raw = textBlock ? textBlock.text : "";

    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback: the model may have added stray text before/after the JSON
      // object. Extract the substring from the first { to the last } and
      // retry once before giving up.
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        try {
          parsed = JSON.parse(cleaned.slice(start, end + 1));
        } catch {
          console.error("JSON parse failed twice. Raw model output:", raw);
          return NextResponse.json(
            { error: "Model response wasn't valid JSON. Try again." },
            { status: 502 }
          );
        }
      } else {
        console.error("No JSON object found. Raw model output:", raw);
        return NextResponse.json(
          { error: "Model response wasn't valid JSON. Try again." },
          { status: 502 }
        );
      }
    }

    if (!parsed.translations || !Array.isArray(parsed.translations)) {
      return NextResponse.json(
        { error: "Model response was missing the expected data." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
