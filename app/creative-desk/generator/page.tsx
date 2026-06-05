"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clipboard,
  Image as ImageIcon,
  Wand2,
} from "lucide-react";

type PostType = "Sunday" | "Tuesday" | "Thursday";

const postConfig = {
  Sunday: {
    label: "Sunday Reset",
    icon: "🌿",
    mood: "Reflective. Discipline. Perspective.",
    positioning:
      "A calm, reflective reset that helps the reader slow down, regain perspective and return to the week with clarity.",
    imagePrompt:
      "A detailed, realistic photograph of a narrow footpath cutting through open Yorkshire moorland in early morning. Low mist sits in the valley below and the grass beside the path is worn short. No person visible. Camera low at path level, looking toward the mist-filled valley. Solitary, unhurried atmosphere. Wide natural-light landscape photograph, cool blue-grey morning tones, heather, mist and pale gold palette. 16:9 horizontal.",
    postAngle:
      "Use a personal reflection, ordinary scene or quiet moment. Include one Scripture reference if appropriate. Keep it faith-rooted but not preachy.",
    linkedinEnd:
      "I break down the full reset in today’s Sunday piece. Link in comments.",
    instagramPrompt:
      "Slide 1: The feeling. Slide 2: The mistake. Slide 3: The reset. Slide 4: The quiet question. Slide 5: Read the full piece on The Creative Desk.",
  },
  Tuesday: {
    label: "Tuesday Creative Guide",
    icon: "🧠",
    mood: "Structure. Positioning. Long-term thinking.",
    positioning:
      "A practical guide that helps founders, creatives and operators think more clearly and make better creative decisions.",
    imagePrompt:
      "A detailed, realistic photograph of a single sheet of cream paper covered in dense handwriting, words crossed out, arrows connecting ideas, one phrase circled twice in darker ink. The paper rests flat on a worn dark oak desk. The camera is positioned directly overhead, slightly off-centre. The atmosphere is quiet and cerebral, the feeling of a mind working through something difficult in private. Modern editorial photograph, natural diffused morning light, muted cream, charcoal and rust palette. 16:9 horizontal. No faces. No readable text.",
    postAngle:
      "Use a grounded real-world moment, diagnose the deeper issue, then offer a named framework with 3 to 4 clear steps.",
    linkedinEnd:
      "I break down the full framework in today’s Creative Guide. Link in comments.",
    instagramPrompt:
      "Slide 1: The problem. Slide 2: The mistake most people make. Slide 3: The better way. Slide 4: The framework. Slide 5: Read the caption for the fix.",
  },
  Thursday: {
    label: "Thursday Tech",
    icon: "⚙️",
    mood: "Tools. Workflow. What actually works.",
    positioning:
      "A practical operator briefing that explains tools, systems and workflows without hype.",
    imagePrompt:
      "A detailed, realistic photograph of a plain wooden desk from directly above. A single open notebook has a hand-drawn system diagram, a mechanical pencil rests across the page, and three index cards sit beside it. Focused, deliberate atmosphere. Modern flat-lay editorial photograph, soft directional natural light, pale wood, cream and grey palette. 16:9 horizontal. No faces. No readable text.",
    postAngle:
      "Start with operational friction. Explain why the friction persists. Offer a simple workflow, tool stack or decision model.",
    linkedinEnd:
      "I break down the full system in today’s Tech post. Link in comments.",
    instagramPrompt:
      "Slide 1: The workflow problem. Slide 2: The tool mistake. Slide 3: The simpler system. Slide 4: What to keep. Slide 5: What to drop.",
  },
};

function todayDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function CreativeDeskGeneratorPage() {
  const [postType, setPostType] = useState<PostType>("Tuesday");
  const [topic, setTopic] = useState("");
  const [readerProblem, setReaderProblem] = useState("");
  const [nextTuesday, setNextTuesday] = useState("");
  const [nextThursday, setNextThursday] = useState("");
  const [copied, setCopied] = useState("");

  const config = postConfig[postType];

  const generated = useMemo(() => {
    const safeTopic = topic.trim() || "[Insert topic]";
    const problem = readerProblem.trim() || "[Insert reader problem or tension]";
    const teaserTuesday = nextTuesday.trim() || "[Insert next Tuesday topic]";
    const teaserThursday = nextThursday.trim() || "[Insert next Thursday topic]";

    return `# ${safeTopic}

The Creative Desk · ${todayDate()}

---

[IMAGE AT TOP]

Use this image prompt:

${config.imagePrompt}

---

## Opening hook

Start with one sharp sentence connected to ${safeTopic}. No preamble.

## First strong section

Write 2 to 3 paragraphs that establish the core idea.

Reader tension:
${problem}

Angle:
${config.postAngle}

[SUBSCRIBE BUTTON 1]

Label:
Get every issue in your inbox, it's free

## Main body

Continue the essay using this structure:

1. Name the real problem.
2. Explain why people misunderstand it.
3. Give the reader a practical way forward.
4. Use one grounded example or story.
5. End with a clear principle they can remember.

## Sign-off

Write one short italic sign-off line from The Creative Desk.

Example:
_The Creative Desk is a quiet space for clearer work, calmer thinking and better creative decisions._

---

[SUBSCRIBE BUTTON 2]

Label:
Join The Creative Desk

## Next issue teasers

Next Tuesday:
${teaserTuesday}

Next Thursday:
${teaserThursday}

---

## LinkedIn teaser

Hook:
Write one sentence that names the tension behind ${safeTopic}.

Conflict:
Explain the problem without giving away the whole essay.

Cliffhanger:
Reveal only the first step or the core question.

End with:
${config.linkedinEnd}

## Instagram carousel concept

${config.instagramPrompt}

## Substack Note

Pull one punchy quote from the diagnostic section and post it as a short Note.

## Visual brief

Style:
Black and white, high contrast, minimal, editorial.

Subject:
A visual metaphor for ${safeTopic}.

Never:
Colour-heavy imagery, busy stock photography, generic business imagery or decorative overlays.`;
  }, [topic, readerProblem, nextTuesday, nextThursday, config]);

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(`${label} copied.`);
    } catch {
      setCopied("Could not copy.");
    }
  }

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Creative Desk Generator</div>
            <div className="logo-subtitle">
              Build a correctly structured Substack post
            </div>
          </div>

          <Link className="nav-pill" href="/creative-desk">
            <ArrowLeft size={16} />
            Back to Creative Desk OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Step 31A · Creative Desk Post Generator</div>
          <h1>Choose the post type, add the topic, then copy the full publishing brief.</h1>
          <p className="lead">
            Alfred applies the right rhythm, image prompt, subscribe button placement,
            Substack structure and repurposing block for Sunday, Tuesday or Thursday.
          </p>
        </section>

        <section className="creative-generator-grid" style={{ marginTop: "28px" }}>
          <article className="card">
            <div className="creative-desk-heading">
              <Wand2 size={22} />
              <h2>Post setup</h2>
            </div>

            <div className="creative-type-grid">
              {(["Sunday", "Tuesday", "Thursday"] as const).map((type) => (
                <button
                  key={type}
                  className={postType === type ? "creative-type-card active" : "creative-type-card"}
                  onClick={() => setPostType(type)}
                >
                  <span>{postConfig[type].icon}</span>
                  <strong>{postConfig[type].label}</strong>
                  <small>{postConfig[type].mood}</small>
                </button>
              ))}
            </div>

            <div className="form-grid" style={{ marginTop: "22px" }}>
              <input
                className="input-box"
                style={{ minHeight: "52px" }}
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Post topic, e.g. Why your brand message feels unclear"
              />

              <textarea
                className="input-box"
                value={readerProblem}
                onChange={(event) => setReaderProblem(event.target.value)}
                placeholder="Reader problem or tension, e.g. They are creating content but not getting the right enquiries."
              />

              <input
                className="input-box"
                style={{ minHeight: "52px" }}
                value={nextTuesday}
                onChange={(event) => setNextTuesday(event.target.value)}
                placeholder="Next Tuesday teaser"
              />

              <input
                className="input-box"
                style={{ minHeight: "52px" }}
                value={nextThursday}
                onChange={(event) => setNextThursday(event.target.value)}
                placeholder="Next Thursday teaser"
              />
            </div>
          </article>

          <article className="card">
            <div className="creative-desk-heading">
              <BookOpen size={22} />
              <h2>Selected format</h2>
            </div>

            <div className="mode-grid">
              <div className="mode">
                <strong>{config.icon} {config.label}</strong>
                <span>{config.mood}</span>
              </div>

              <div className="mode">
                <strong>Positioning</strong>
                <span>{config.positioning}</span>
              </div>

              <div className="mode">
                <strong>Writing angle</strong>
                <span>{config.postAngle}</span>
              </div>
            </div>
          </article>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="creative-desk-heading">
            <ImageIcon size={22} />
            <h2>Image prompt</h2>
          </div>

          <div className="creative-output-box">
            <p>{config.imagePrompt}</p>

            <button
              className="btn btn-secondary"
              onClick={() => copyText(config.imagePrompt, "Image prompt")}
            >
              Copy Image Prompt
            </button>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="creative-desk-heading">
            <Clipboard size={22} />
            <h2>Generated publishing brief</h2>
          </div>

          {copied && (
            <div className="mode" style={{ marginBottom: "18px" }}>
              <strong>Status:</strong>
              <span>{copied}</span>
            </div>
          )}

          <pre className="creative-generated-output">{generated}</pre>

          <div className="actions" style={{ marginTop: "18px" }}>
            <button className="btn" onClick={() => copyText(generated, "Publishing brief")}>
              Copy Full Brief
            </button>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="creative-desk-heading">
            <CalendarDays size={22} />
            <h2>Publishing rules applied</h2>
          </div>

          <div className="mode-grid">
            <div className="mode">
              <strong>One image</strong>
              <span>Top of post. 1200 × 630px. 16:9 horizontal.</span>
            </div>

            <div className="mode">
              <strong>Two subscribe buttons</strong>
              <span>Button 1 after first strong section. Button 2 at the end.</span>
            </div>

            <div className="mode">
              <strong>One structure</strong>
              <span>Same layout every essay so the reader learns the rhythm.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
