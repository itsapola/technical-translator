"use client";

import { useState } from "react";

export default function Home() {
  const [product, setProduct] = useState("");
  const [buyers, setBuyers] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!product.trim()) {
      setError("Describe the technical product or feature first.");
      return;
    }
    if (!buyers.trim()) {
      setError("List at least one buyer to translate for.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, buyers }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav>
        <span className="brand">
          <a href="https://ashleypola.com"><svg className="navmark" viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="16" rx="13" ry="6" fill="none" stroke="var(--persimmon)" strokeWidth="2.4" transform="rotate(-28 16 16)" /><circle cx="16" cy="16" r="3.4" fill="var(--ink)" /><circle cx="27.3" cy="9.9" r="2.6" fill="var(--persimmon)" /></svg>Ashley Pola</a>
        </span>
        <a className="navback" href="https://ashleypola.com/tools.html">
          ← All tools
        </a>
      </nav>

      <div className="wrap">
        <section className="hero">
          <span className="eyebrow">Technical-to-Buyer Translator</span>
          <h1>
            Same fact, <span className="hl">different</span> buyer.
          </h1>
          <p className="lede">
            Describe what the product technically does, list the buyers who
            need to understand it, and it holds one core technical fact
            constant while translating it into value-prop copy for each —
            so the CFO and the engineer are hearing the same truth, in
            language each of them actually cares about.
          </p>
        </section>

        <div className="process">
          <div className="pstep">
            <div className="pn">01 / Hold</div>
            <h4>Fix the core fact</h4>
            <p>
              States the one technical claim that has to stay true across
              every version.
            </p>
          </div>
          <div className="pstep">
            <div className="pn">02 / Translate</div>
            <h4>Write for each buyer</h4>
            <p>
              A distinct headline and value prop per audience, in their
              vocabulary, not yours.
            </p>
          </div>
          <div className="pstep">
            <div className="pn">03 / Check</div>
            <h4>Flag the risk</h4>
            <p>
              Names what could get lost or overclaimed in translation for
              each audience.
            </p>
          </div>
        </div>

        <form className="formcard" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="product">
              What does the product or feature technically do?
            </label>
            <textarea
              id="product"
              rows={4}
              placeholder="e.g. Our model runs entirely on-device, so patient audio is transcribed and discarded locally — no PHI ever leaves the hospital network or touches a third-party server."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
            <div className="hint">
              Be precise — the more specific the technical claim, the less
              it can drift when translated.
            </div>
          </div>

          <div className="field">
            <label htmlFor="buyers">
              Who needs to understand this? (one per line)
            </label>
            <textarea
              id="buyers"
              rows={4}
              placeholder={
                "Hospital CISO\nClinical Ops Director\nCFO evaluating the contract\nFrontline nurse using the device"
              }
              value={buyers}
              onChange={(e) => setBuyers(e.target.value)}
            />
            <div className="hint">2–4 buyers works best.</div>
          </div>

          <div className="formrow">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Translating…" : "Translate"}
            </button>
            {error && <span className="status err">{error}</span>}
            {loading && (
              <span className="status" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <svg className="spinner-star" viewBox="0 0 20 20" aria-hidden="true"><line x1="10" y1="1" x2="10" y2="19" /><line x1="1" y1="10" x2="19" y2="10" /><line x1="3.6" y1="3.6" x2="16.4" y2="16.4" /><line x1="16.4" y1="3.6" x2="3.6" y2="16.4" /></svg>
                Holding the fact constant, writing each version…
              </span>
            )}
          </div>
        </form>

        {result && result.translations && result.translations.length > 0 && (
          <>
            {result.coreFact && (
              <div className="corefact">
                <div className="sl">The fact held constant</div>
                <div className="sv">{result.coreFact}</div>
              </div>
            )}

            <section className="results">
              <div className="kicker">
                <span>Buyer translations</span>
                <span className="ln"></span>
                <span>{result.translations.length} generated</span>
              </div>

              {result.translations.map((t, i) => (
                <article key={i} className="translation">
                  <div className="tnum">{String(i + 1).padStart(2, "0")}</div>
                  <div className="audience-tag">{t.audience}</div>
                  <h3>{t.headline}</h3>
                  <p className="copy">{t.copy}</p>

                  <div className="deflist">
                    <div className="dfrow">
                      <div className="dt">Anchored on</div>
                      <div className="dd">{t.anchor}</div>
                    </div>
                    <div className="dfrow">
                      <div className="dt">Watch out for</div>
                      <div className="dd">{t.watchOutFor}</div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </div>

      <footer>
        <svg className="orbit-mark" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16.5" fill="none" stroke="var(--persimmon)" strokeWidth="0.5" opacity="0.45" /><g stroke="var(--persimmon)" strokeWidth="0.6"><line x1="20" y1="2.5" x2="20" y2="6" /><line x1="20" y1="34" x2="20" y2="37.5" /><line x1="2.5" y1="20" x2="6" y2="20" /><line x1="34" y1="20" x2="37.5" y2="20" /><line x1="8" y1="8" x2="10.5" y2="10.5" /><line x1="29.5" y1="29.5" x2="32" y2="32" /><line x1="32" y1="8" x2="29.5" y2="10.5" /><line x1="10.5" y1="29.5" x2="8" y2="32" /></g><ellipse cx="20" cy="20" rx="18" ry="7" transform="rotate(-20 20 20)" /><ellipse cx="20" cy="20" rx="18" ry="7" transform="rotate(40 20 20)" /><circle cx="20" cy="20" r="2.5" /></svg>
        <span>Ashley Pola © 2026</span>
        <span>Draft copy — always fact-check technical claims before use.</span>
      </footer>
    </>
  );
}
