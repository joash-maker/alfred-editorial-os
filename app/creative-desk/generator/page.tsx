"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Clipboard,
  Image as ImageIcon,
  MailPlus,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type PromptItem = {
  title: string;
  use: string;
  prompt: string;
};

const promptGroups: Record<"Tuesday" | "Thursday" | "Sunday", PromptItem[]> = {
  Tuesday: [
    {
      title: "Tuesday Prompt 1",
      use: "Week 1",
      prompt: "A detailed, realistic photograph of a single sheet of cream paper covered in dense handwriting, words crossed out, arrows connecting ideas, one phrase circled twice in darker ink. The paper rests flat on a worn dark oak desk. The camera is positioned directly overhead, slightly off-centre. The atmosphere is quiet and cerebral, the feeling of a mind working through something difficult in private. Modern editorial photograph, natural diffused morning light, muted cream, charcoal and rust palette. 16:9 horizontal. No faces. No readable text.",
    },
    {
      title: "Tuesday Prompt 2",
      use: "Week 2",
      prompt: "A detailed, realistic photograph of a worn hardback book lying open on a stone windowsill. A single sentence on the left page has been underlined carefully in pencil, but the words are not readable. Soft overcast British daylight through the glass. Still, contemplative atmosphere. Quiet natural-light editorial photograph, slate, cream and faded ochre palette. 16:9 horizontal. No faces. No readable text.",
    },
    {
      title: "Tuesday Prompt 3",
      use: "Week 3",
      prompt: "A detailed, realistic photograph of a brass compass resting on a hand-drawn working map on kraft paper with notes in the margins, distances crossed out and corrected, and a route traced in pencil. The camera looks down at a slight angle. Purposeful, mid-process atmosphere. Modern documentary photograph, warm natural light, parchment, deep brown and dull gold palette. 16:9 horizontal. No faces. No readable text.",
    },
    {
      title: "Tuesday Prompt 4",
      use: "Week 4",
      prompt: "A detailed, realistic photograph of two identical plain ceramic mugs on an outdoor stone table, one full of black coffee and one empty. Between them sits a single folded white paper, unread. Blurred British street background, grey pavement, low sky. Suspended and suggestive atmosphere. Candid documentary photograph, cool overcast tones, white, grey and slate palette. 16:9 horizontal. No faces.",
    },
    {
      title: "Tuesday Prompt 5",
      use: "Week 5",
      prompt: "A detailed, realistic photograph of a large whiteboard mounted on a plain wall. Three words are written in thick black marker but intentionally illegible. A single empty chair is visible in the lower foreground, slightly out of focus. Spare and deliberate atmosphere, a room where a decision has just been made. Modern architectural photograph, flat cool daylight, white, pale grey and deep charcoal palette. 16:9 horizontal. No faces. No readable text.",
    },
  ],
  Thursday: [
    {
      title: "Thursday Prompt 1",
      use: "Week 1",
      prompt: "A detailed, realistic photograph of a mechanic's pegboard tool wall. Tools are hung in exact order, each outlined by a faint shadow, with one tool missing from its hook. Camera straight on, centred on the missing tool space. Precise, purposeful atmosphere. Modern industrial editorial photograph, warm workshop lighting, steel grey, black rubber and off-white palette. 16:9 horizontal. No faces.",
    },
    {
      title: "Thursday Prompt 2",
      use: "Week 2",
      prompt: "A detailed, realistic photograph of a hand-drawn flowchart pinned to a corkboard, with boxes, arrows and one diamond-shaped decision point. Two yellow sticky notes sit at slightly different angles with unreadable handwriting. Active, iterative atmosphere. Candid documentary photograph, flat office light, kraft, blue and yellow palette. 16:9 horizontal. No faces. No readable text.",
    },
    {
      title: "Thursday Prompt 3",
      use: "Week 3",
      prompt: "A detailed, realistic photograph of a single green indicator light blinking on a server unit in an otherwise dark room. Slightly long exposure gives a faint trail of green light. Quietly powerful atmosphere, something running reliably while everyone sleeps. Long-exposure documentary photograph, deep blue-black shadows, single sharp green light. 16:9 horizontal. No faces.",
    },
    {
      title: "Thursday Prompt 4",
      use: "Week 4",
      prompt: "A detailed, realistic photograph of a plain wooden desk from directly above. A single open notebook has a hand-drawn system diagram, a mechanical pencil rests across the page, and three index cards sit beside it. Focused, deliberate atmosphere. Modern flat-lay editorial photograph, soft directional natural light, pale wood, cream and grey palette. 16:9 horizontal. No faces. No readable text.",
    },
    {
      title: "Thursday Prompt 5",
      use: "Week 5",
      prompt: "A detailed, realistic photograph of a tangle of cables on a plain grey concrete floor, photographed from directly above. Muted rust, slate, cream and olive cables. The tangle is almost resolved, with one cable leading purposefully off-frame. Honest mid-process infrastructure atmosphere. Modern documentary photograph, flat overhead light. 16:9 horizontal. No faces.",
    },
  ],
  Sunday: [
    {
      title: "Sunday Prompt 1",
      use: "Week 1",
      prompt: "A detailed, realistic photograph of a narrow footpath cutting through open Yorkshire moorland in early morning. Low mist sits in the valley below and the grass beside the path is worn short. No person visible. Camera low at path level, looking toward the mist-filled valley. Solitary, unhurried atmosphere. Wide natural-light landscape photograph, cool blue-grey morning tones, heather, mist and pale gold palette. 16:9 horizontal.",
    },
    {
      title: "Sunday Prompt 2",
      use: "Week 2",
      prompt: "A detailed, realistic photograph of a plain kitchen table set for one, a half-drunk cup of tea, a small plate with toast, and a folded newspaper not yet opened. Morning light through a net curtain. The chair is pushed back slightly. Domestic, unhurried atmosphere. Quiet documentary photograph, warm indirect morning light, cream, pale yellow and warm grey palette. 16:9 horizontal. No faces. No readable text.",
    },
    {
      title: "Sunday Prompt 3",
      use: "Week 3",
      prompt: "A detailed, realistic photograph of a single white candle burning on a cold stone windowsill. Outside the window are a grey British sky, slate rooftops and bare tree branches. Candle flame reflects faintly in the glass. Still, grounded atmosphere. Natural-light interior photograph, amber flame, cold slate grey and deep warm shadow palette. 16:9 horizontal. No faces.",
    },
    {
      title: "Sunday Prompt 4",
      use: "Week 4",
      prompt: "A detailed, realistic photograph of worn brown leather boots by a back door, dried mud on the soles, laces loosely tied. A dark waxed coat hangs above them. The back door is slightly ajar, showing grey daylight and wet garden stone. Honest, unglamorous atmosphere. Candid documentary photograph, cool overcast light, brown, grey, olive and muted rust palette. 16:9 horizontal. No faces.",
    },
    {
      title: "Sunday Prompt 5",
      use: "Week 5",
      prompt: "A detailed, realistic photograph of a shallow river in the Yorkshire Dales in late afternoon. Low clear water, smooth stones visible, a single oak tree on the far bank with leaves beginning to turn amber. Slow, restorative atmosphere. Wide natural-light landscape photograph, warm-to-cool palette of amber, pale gold, river grey and deep green. 16:9 horizontal. No faces.",
    },
  ],
};

const checklist = [
  "Image uploaded at the top, 1200 × 630px, 16:9",
  "Title finalised",
  "Divider added below header",
  "Opening hook checked",
  "Subscribe Button 1 added after first strong section",
  "Button 1 label: Get every issue in your inbox, it's free",
  "Sign-off and bio line included",
  "Divider added before final subscribe button",
  "Subscribe Button 2 added at the end",
  "Button 2 label: Join The Creative Desk",
  "Next Tuesday teaser added",
  "Next Thursday teaser added",
  "Preview checked before publishing",
];

export default function CreativeDeskPage() {
  const [activeTab, setActiveTab] = useState<"Tuesday" | "Thursday" | "Sunday">("Tuesday");
  const [copyMessage, setCopyMessage] = useState("");

  async function copyPrompt(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} copied.`);
    } catch {
      setCopyMessage("Could not copy prompt.");
    }
  }

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Creative Desk OS</div>
            <div className="logo-subtitle">
              Publishing system, templates, image library and workflow
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Step 31 · The Creative Desk Publishing System</div>
          <h1>Publish every Substack post with the same calm structure.</h1>
          <p className="lead">
            This page keeps the weekly rhythm, post structure, subscribe button placement,
            image prompts and publishing checklist in one place.
          </p>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Create New Post</div>

          <div className="mode-grid">
            <Link className="btn" href="/creative-desk/generator">
              Open Creative Desk Generator
            </Link>

            <div className="mode">
              <strong>What it does</strong>
              <span>Choose Sunday, Tuesday or Thursday and Alfred builds the correct Substack publishing brief.</span>
            </div>
          </div>
        </section>

        <section className="creative-desk-grid" style={{ marginTop: "28px" }}>
          <article className="creative-desk-card">
            <Sparkles size={22} />
            <span>Sunday</span>
            <strong>Reset</strong>
            <p>Reflective. Discipline. Perspective.</p>
          </article>

          <article className="creative-desk-card">
            <BookOpen size={22} />
            <span>Tuesday</span>
            <strong>Creative Guide</strong>
            <p>Structure. Positioning. Long-term thinking.</p>
          </article>

          <article className="creative-desk-card">
            <CalendarDays size={22} />
            <span>Thursday</span>
            <strong>Tech</strong>
            <p>Tools. Workflow. What actually works.</p>
          </article>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="creative-desk-heading">
            <Clipboard size={22} />
            <h2>Publishing SOP</h2>
          </div>

          <div className="creative-step-list">
            {[
              "Image at top",
              "Essay title",
              "Horizontal divider",
              "Opening hook",
              "First strong section",
              "Subscribe Button 1",
              "Remaining sections",
              "Sign-off and bio",
              "Horizontal divider",
              "Subscribe Button 2",
              "Next issue teasers",
            ].map((step, index) => (
              <div className="creative-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="creative-desk-heading">
            <MailPlus size={22} />
            <h2>Subscribe Button Rules</h2>
          </div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Button 1</strong>
              <span>Placement: after the first strong section.</span>
              <span>Label: Get every issue in your inbox, it&apos;s free</span>
            </div>

            <div className="mode">
              <strong>Button 2</strong>
              <span>Placement: at the very end of the article.</span>
              <span>Label: Join The Creative Desk</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="creative-desk-heading">
            <ImageIcon size={22} />
            <h2>Image Prompt Library</h2>
          </div>

          <div className="creative-tabs">
            {(["Tuesday", "Thursday", "Sunday"] as const).map((tab) => (
              <button
                className={activeTab === tab ? "creative-tab active" : "creative-tab"}
                key={tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {copyMessage && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <strong>Copied:</strong>
              <span>{copyMessage}</span>
            </div>
          )}

          <div className="creative-prompt-grid" style={{ marginTop: "18px" }}>
            {promptGroups[activeTab].map((item) => (
              <article className="creative-prompt-card" key={item.title}>
                <div>
                  <p>{item.use}</p>
                  <h3>{item.title}</h3>
                </div>

                <span>{item.prompt}</span>

                <button
                  className="btn btn-secondary"
                  onClick={() => copyPrompt(item.prompt, item.title)}
                >
                  Copy Prompt
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="creative-desk-heading">
            <RotateCcw size={22} />
            <h2>Weekly Rotation Planner</h2>
          </div>

          <div className="creative-rotation-grid">
            {[1, 2, 3, 4, 5].map((week) => (
              <div className="creative-rotation-card" key={week}>
                <strong>Week {week}</strong>
                <span>Tuesday: Prompt {week}</span>
                <span>Thursday: Prompt {week}</span>
                <span>Sunday: Prompt {week}</span>
              </div>
            ))}
          </div>

          <p className="creative-note">
            After Week 5, restart the cycle. By then the content has moved on enough
            that the visual language feels like a system, not a repeat.
          </p>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="creative-desk-heading">
            <CheckSquare size={22} />
            <h2>Publishing Checklist</h2>
          </div>

          <div className="creative-checklist">
            {checklist.map((item) => (
              <label key={item}>
                <input type="checkbox" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Creative Desk North Star</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>The Creative Desk builds trust.</strong>
              <span>Every article should help readers think better, work better, build better or decide better.</span>
            </div>

            <div className="mode">
              <strong>Mediahubink converts trust into revenue.</strong>
              <span>The publication supports the business by building authority and useful relationships.</span>
            </div>

            <div className="mode">
              <strong>Coming Soon</strong>
              <span>Creative Desk Post Generator: choose Sunday, Tuesday or Thursday and Alfred builds the correct Substack structure.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
