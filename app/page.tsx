"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  async function askAlfred() {
    if (!prompt.trim()) return;

    setLoading(true);
    setReply("");
    setSaveMessage("");

    try {
      const response = await fetch("/api/alfred", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      setReply(data.reply || data.error || "No response from Alfred.");
    } catch {
      setReply("Something went wrong. Check the API route or Vercel logs.");
    } finally {
      setLoading(false);
    }
  }

  async function saveThought() {
    if (!prompt.trim()) return;

    setSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/thoughts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: prompt,
          category: "Thought Vault",
          title: prompt.slice(0, 80),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSaveMessage(data.error || "Could not save thought.");
        return;
      }

      setSaveMessage("Saved to Alfred’s memory.");
    } catch {
      setSaveMessage("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Alfred</div>
            <div className="logo-subtitle">
              Mediahubink Editorial + Growth Chief of Staff
            </div>
          </div>

          <div className="nav-pill">Private V1</div>
        </nav>

        <section className="hero">
          <div className="card">
            <div className="kicker">The Creative Desk · Mediahubink</div>

            <h1>Your ideas, turned into clear publishing momentum.</h1>

            <p className="lead">
              Alfred helps capture what you are building, learning, testing and
              sharing, then turns it into Substack posts, LinkedIn content,
              client lead campaigns and calm strategic follow-up.
            </p>

            <div className="actions">
              <a className="btn" href="#quick-create">
                Open Quick Create
              </a>
              <a className="btn btn-secondary" href="#modules">
                View Modules
              </a>
            </div>
          </div>

          <div className="card" id="quick-create">
            <div className="panel-title">What do you want to share today?</div>

            <textarea
              className="input-box"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A dentist asked if AI will replace reception staff. Turn this into a LinkedIn post and a Creative Desk idea."
            />

            <div className="actions" style={{ marginTop: "16px" }}>
              <button className="btn" onClick={askAlfred} disabled={loading}>
                {loading ? "Alfred is thinking..." : "Ask Alfred"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={saveThought}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Thought"}
              </button>
            </div>

            {saveMessage && (
              <div className="mode" style={{ marginTop: "16px" }}>
                <strong>Memory:</strong>
                <span>{saveMessage}</span>
              </div>
            )}

            {reply && (
              <div
                className="mode"
                style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}
              >
                <strong>Alfred says:</strong>
                <span>{reply}</span>
              </div>
            )}

            <div className="mode-grid">
              <div className="mode">
                <strong>The Creative Desk</strong>
                <span>
                  Builder’s Brief, Lab Notes, Strategic Reset, Substack Notes
                  and reflective long-form content.
                </span>
              </div>

              <div className="mode">
                <strong>Mediahubink Growth</strong>
                <span>
                  LinkedIn lead posts, vertical campaigns, pinned comments,
                  CTAs, demos and client conversations.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="modules">
          <div className="mini-card">
            <h3>Editorial Engine</h3>
            <p>
              Create Tuesday, Thursday and Sunday posts using your saved
              frameworks, tone and archive memory.
            </p>
          </div>

          <div className="mini-card">
            <h3>LinkedIn Growth Engine</h3>
            <p>
              Generate punchy vertical-specific posts for dentists, trades,
              schools, gyms, serviced offices and more.
            </p>
          </div>

          <div className="mini-card">
            <h3>CRM-lite</h3>
            <p>
              Track leads, prospects, demo interest, follow-ups and content
              that creates real conversations.
            </p>
          </div>

          <div className="mini-card">
            <h3>Thought Vault</h3>
            <p>
              Store what you are building, testing, learning, noticing and
              wrestling with.
            </p>
          </div>

          <div className="mini-card">
            <h3>Demo Manager</h3>
            <p>
              Keep each vertical demo link organised so Alfred always suggests
              the right CTA.
            </p>
          </div>

          <div className="mini-card">
            <h3>Offer Engine</h3>
            <p>
              Connect posts to Fredi, voice agents, AI receptionists, advisory
              work and partner offers.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
