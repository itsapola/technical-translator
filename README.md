# Technical-to-Buyer Translator

Describe what a product technically does, list the buyers who need to understand it, and it holds one core technical fact constant while translating it into value-prop copy for each — so a CFO and an engineer are hearing the same underlying truth, in language each of them actually cares about.

**Live:** https://buyer-translator.vercel.app/ (update once deployed)

## What it does

1. **Hold** — extracts one core technical fact from the description that has to stay true, unchanged, across every version.
2. **Translate** — writes a distinct headline + value-prop copy per buyer, framed around what that specific buyer needs to hear, not a generic rephrasing of the same paragraph.
3. **Check** — flags the real risk in each translation: where it could be misread, overclaimed, or object to by a reader from a different audience.

This is the third tool in a set that maps to how I actually run brand work — diagnose (the [Brand Intelligence Toolkit](https://brand-analyst.vercel.app/)), architect (the [Category Thesis Generator](https://category-thesis-generator.vercel.app/)), and execute (this one): taking a fixed technical truth and making it legible to different audiences without losing what's actually true — the same move behind the Ekso Bionics dual-market brand architecture case study at [ashleypola.com](https://ashleypola.com).

## Stack

- Next.js 14 (App Router)
- Anthropic API (`claude-sonnet-5`), called server-side from a route handler — the API key never reaches the browser
- No database — stateless, one request in, one JSON response out

## Running locally

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your real ANTHROPIC_API_KEY
npm run dev
```

Visit `http://localhost:3000`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, import the repo.
3. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` — your key from [console.anthropic.com](https://console.anthropic.com/settings/keys)
4. Deploy. No other config needed — Vercel auto-detects Next.js.

If you rotate or add the key after the first deploy, redeploy for it to take effect.

## Notes

- The API key is a **server-side** env var (not `NEXT_PUBLIC_`) on purpose — only read inside `app/api/generate/route.js`, never shipped to the client.
- The model is prompted to never invent capabilities the product description didn't state, and to always name a real risk per translation rather than defaulting to "none" — output is a drafting aid, not finished copy.

---

Built by [Ashley Pola](https://ashleypola.com) — brand and narrative strategist.
