"use client";

import { useState } from "react";

type Thought = {
  id: string;
  created_at: string;
  title: string | null;
  category: string | null;
  content: string;
  status: string | null;
};

type Mode =
  | "general"
  | "creative-desk"
  | "linkedin-lead"
  | "substack-note"
  | "vertical-campaign";

const modePrompts: Record<Mode, string> = {
  general:
    "Respond as Alfred, Joash's editorial and growth chief of staff. Be calm, clear, useful and commercially aware.",

  "creative-desk":
    "Turn the user's thought into a Creative Desk content idea. Suggest whether it should become Tuesday Builder’s Brief, Thursday Lab Notes, or Sunday Strategic Reset. Then create a strong title, angle, outline, Substack CTA, LinkedIn teaser, Substack Note and visual brief.",

  "linkedin-lead":
    "Create a modern, punchy, effective LinkedIn lead-generation post for Mediahubink. Use British English. Make it commercially sharp, direct and specific. Structure it with a strong hook, pain point, numbers or business impact, mechanism, clear CTA, and a pinned comment.",

  "substack-note":
    "Create a short Substack Note from the user's thought. Make it thoughtful, concise, calm and worth replying to. Include one sharp idea, one short reflection, and a soft invitation to read or subscribe.",

  "vertical-campaign":
    "Create a vertical-specific LinkedIn campaign for Mediahubink. Include target vertical, pain point, 5 post titles, one full sample post, pinned comment, CTA, suggested demo link type, and hashtags. Keep it practical and conversion-focused.",
};

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loadingThoughts, setLoadingThoughts] = useState(false);
  const [mode, setMode] = useState<Mode>("general");

  async function askAlfred(selectedMode: Mode = mode) {
    if (!prompt.trim()) return;

    setLoading(true);
    setReply("");
    setSaveMessage("");

    const fullPrompt = `
Mode:
${selectedMode}

Instruction:
${modePrompts[selectedMode]}

User thought/topic:
${prompt}
`;

    try {
      const response = await fetch("/api/alfred", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: fullPrompt }),
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
      loadThoughts();
    } catch {
      setSaveMessage("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function loadThoughts() {
    setLoadingThoughts(true);

    try {
      const response = await fetch("/api/thoughts/list");
      const data = await response.json();

      if (!response.ok) {
        setSaveMessage(data.error || "Could not load memory.");
        return;
      }

      setThoughts(data.thoughts || []);
    } catch {
      setSaveMessage("Something went wrong loading memory.");
    } finally {
      setLoadingThoughts(false);
    }
  }

  function setModeAndAsk(selectedMode: Mode) {
    setMode(selectedMode);
    askAlfred(selectedMode);
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
              <a className="btn btn-secondary" href="#memory">
                View Memory
              </a>
            </div>
          </div>

          <div className="card" id="quick-create">
            <div className="panel-title">What do you want to share today?</div>

            <textarea
              className="input-box"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A dentist asked if AI will replace reception staff."
            />

            <div className="mode-grid">
              <button
                className="mode"
                onClick={() => setMode("creative-desk")}
              >
                <strong>Creative Desk Post</strong>
                <span>Builder’s Brief, Lab Notes or Strategic Reset.</span>
              </button>

              <button
                className="mode"
                onClick={() => setMode("linkedin-lead")}
              >
                <strong>LinkedIn Lead Post</strong>
                <span>Punchy Mediahubink post with CTA and pinned comment.</span>
              </button>

              <button
                className="mode"
                onClick={() => setMode("substack-note")}
              >
                <strong>Substack Note</strong>
                <span>Short, thoughtful post for Substack Notes.</span>
              </button>

              <button
                className="mode"
                onClick={() => setMode("vertical-campaign")}
              >
                <strong>Vertical Campaign</strong>
                <span>5-post campaign for one target industry.</span>
              </button>
            </div>

            <div className="actions" style={{ marginTop: "16px" }}>
              <button className="btn" onClick={() => askAlfred()} disabled={loading}>
                {loading ? "Alfred is thinking..." : "Ask Alfred"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setModeAndAsk("creative-desk")}
                disabled={loading}
              >
                Creative Desk
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setModeAndAsk("linkedin-lead")}
                disabled={loading}
              >
                LinkedIn
              </button>

              <button
                className="btn btn-secondary"
                onClick={saveThought}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Thought"}
              </button>
            </div>

            <p style={{ color: "#a3a3a3", marginTop: "14px", fontSize: "14px" }}>
              Current mode: {mode}
            </p>

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
          </div>
        </section>

        <section className="section" id="modules">
          <div className="mini-card">
            <h3>Editorial Engine</h3>
            <p>Create Tuesday, Thursday and Sunday posts using your frameworks.</p>
          </div>

          <div className="mini-card">
            <h3>LinkedIn Growth Engine</h3>
            <p>Generate vertical-specific posts, pinned comments and CTAs.</p>
          </div>

          <div className="mini-card">
            <h3>CRM-lite</h3>
            <p>Track prospects, demo interest and follow-ups.</p>
          </div>
        </section>

        <section className="card" id="memory" style={{ marginTop: "28px" }}>
          <div className="panel-title">Alfred’s Memory</div>

          <div className="actions" style={{ marginBottom: "18px" }}>
            <button
              className="btn btn-secondary"
              onClick={loadThoughts}
              disabled={loadingThoughts}
            >
              {loadingThoughts ? "Loading..." : "Refresh Memory"}
            </button>
          </div>

          {thoughts.length === 0 ? (
            <p className="lead" style={{ fontSize: "16px" }}>
              No thoughts loaded yet. Save a thought, then refresh memory.
            </p>
          ) : (
            <div className="mode-grid">
              {thoughts.map((thought) => (
                <div className="mode" key={thought.id}>
                  <strong>{thought.title || "Untitled thought"}</strong>
                  <span>{thought.content}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
